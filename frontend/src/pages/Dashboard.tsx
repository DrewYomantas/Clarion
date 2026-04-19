import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  emitPlanLimitError,
  getDashboardStats,
  getFirmActions,
  getLatestExposure,
  getReportGovernanceSignals,
  getReports,
  type DashboardStats,
  type ExposureSnapshot,
  type GovernanceSignal,
  type ReportActionItem,
  type ReportListItem,
} from "@/api/authService";
import { useAuth } from "@/contexts/AuthContext";
import { resolvePlanLimits } from "@/config/planLimits";
import { DISPLAY_LABELS } from "@/constants/displayLabels";
import type { ReputationIssuePercentages } from "@/utils/reputationScore";

const toTimestamp = (value: string | null | undefined) => {
  if (!value) return 0;
  const ts = Date.parse(value);
  return Number.isFinite(ts) ? ts : 0;
};

const formatDateOnly = (value: string | null | undefined) => {
  if (!value) return "Not available";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Not available";
  return date.toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatMonthYear = (value: string | null | undefined) => {
  if (!value) return "";
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "";
  return date.toLocaleDateString([], {
    month: "long",
    year: "numeric",
  });
};

const formatReviewPeriod = (report: ReportListItem | null) => {
  if (!report) return "Not available";
  const start = report.review_date_start ? new Date(report.review_date_start) : null;
  const end = report.review_date_end ? new Date(report.review_date_end) : null;

  const validStart = Boolean(start && Number.isFinite(start.getTime()));
  const validEnd = Boolean(end && Number.isFinite(end.getTime()));

  if (validStart && validEnd && start && end) {
    const sameYear = start.getFullYear() === end.getFullYear();
    const sameMonth = sameYear && start.getMonth() === end.getMonth();
    if (sameMonth) return start.toLocaleDateString([], { month: "long", year: "numeric" });
    if (sameYear) {
      return `${start.toLocaleDateString([], { month: "long" })} – ${end.toLocaleDateString([], {
        month: "long",
        year: "numeric",
      })}`;
    }
    return `${start.toLocaleDateString([], { month: "short", year: "numeric" })} – ${end.toLocaleDateString([], {
      month: "short",
      year: "numeric",
    })}`;
  }

  const cycleMonthYear = formatMonthYear(report.created_at);
  return cycleMonthYear ? `${cycleMonthYear} (current cycle)` : "Not available";
};

const isOverdue = (action: ReportActionItem) => {
  if (!action.due_date || action.status === "done") return false;
  const due = Date.parse(action.due_date);
  if (!Number.isFinite(due)) return false;
  return due < Date.now();
};

const signalCategory = (signal: GovernanceSignal) => {
  const title = (signal.title || "").trim();
  if (!title) return "uncategorized";
  return title.split(":")[0].trim().toLowerCase();
};

const signalLabel = (signal: GovernanceSignal) => {
  const title = (signal.title || "").trim();
  if (!title) return "service quality";
  return title.split(":")[0].trim();
};

const recommendationForSignal = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes("communication")) return "Review firm communication response standards.";
  if (lower.includes("billing")) return "Review billing explanation standards and escalation script.";
  if (lower.includes("intake")) return "Review intake callback standards and ownership.";
  if (lower.includes("timeline") || lower.includes("delay")) return "Review case timeline update protocol.";
  return `Review ${label.toLowerCase()} response standards.`;
};

const buildIssuePercentagesFromSignals = (
  signals: GovernanceSignal[],
): ReputationIssuePercentages => {
  if (signals.length === 0) return {};

  const counts = new Map<string, number>();
  signals.forEach((signal) => {
    const label = signalLabel(signal).toLowerCase();
    counts.set(label, (counts.get(label) || 0) + 1);
  });

  const countFor = (matcher: (category: string) => boolean) => {
    let total = 0;
    counts.forEach((count, category) => {
      if (matcher(category)) total += count;
    });
    return total;
  };

  const toPercent = (count: number) => Math.round((count / signals.length) * 100);

  const communication = countFor((category) => category.includes("communication"));
  const professionalism = countFor((category) => category.includes("professionalism"));
  const caseOutcome = countFor(
    (category) =>
      category.includes("case outcome") ||
      category.includes("outcome") ||
      category.includes("result") ||
      category.includes("timeline") ||
      category.includes("delay"),
  );
  const staffSupport = countFor(
    (category) =>
      category.includes("staff support") ||
      category.includes("support staff") ||
      category.includes("staff"),
  );

  const percentages: ReputationIssuePercentages = {};
  if (communication > 0) percentages.communication = toPercent(communication);
  if (professionalism > 0) percentages.professionalism = toPercent(professionalism);
  if (caseOutcome > 0) percentages.caseOutcome = toPercent(caseOutcome);
  if (staffSupport > 0) percentages.staffSupport = toPercent(staffSupport);
  return percentages;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { currentPlan, user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [exposure, setExposure] = useState<ExposureSnapshot | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [historyNotice, setHistoryNotice] = useState<string | null>(null);
  const [historyTruncated, setHistoryTruncated] = useState(false);
  const [actions, setActions] = useState<ReportActionItem[]>([]);
  const [latestSignals, setLatestSignals] = useState<GovernanceSignal[]>([]);
  const [previousSignals, setPreviousSignals] = useState<GovernanceSignal[]>([]);
  const [loadError, setLoadError] = useState("");
  const [baselineDismissed, setBaselineDismissed] = useState(false);

  const baselineDismissKey = useMemo(
    () => `baseline-analysis-dismissed:${user?.firm_id ?? user?.email ?? "unknown"}`,
    [user?.email, user?.firm_id],
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [exposureResult, statsResult, reportsResult, actionsResult] = await Promise.all([
        getLatestExposure(),
        getDashboardStats(),
        getReports(100),
        getFirmActions(),
      ]);

      setExposure(exposureResult.success && exposureResult.exposure ? exposureResult.exposure : null);
      setStats(statsResult.success && statsResult.stats ? statsResult.stats : null);

      const sortedReports = reportsResult.success && reportsResult.reports
        ? [...reportsResult.reports].sort((a, b) => toTimestamp(b.created_at) - toTimestamp(a.created_at))
        : [];

      setReports(sortedReports);
      setHistoryNotice(reportsResult.success ? reportsResult.history_notice || null : null);
      setHistoryTruncated(Boolean(reportsResult.success && reportsResult.history_truncated));
      setActions(actionsResult.success && actionsResult.actions ? actionsResult.actions : []);

      const readyReports = sortedReports.filter((report) => report.status === "ready");
      const latestReady = readyReports[0];
      const previousReady = readyReports[1];

      if (latestReady?.id) {
        const latestResult = await getReportGovernanceSignals(latestReady.id);
        setLatestSignals(latestResult.success && latestResult.signals ? latestResult.signals : []);
      } else {
        setLatestSignals([]);
      }

      if (previousReady?.id) {
        const previousResult = await getReportGovernanceSignals(previousReady.id);
        setPreviousSignals(previousResult.success && previousResult.signals ? previousResult.signals : []);
      } else {
        setPreviousSignals([]);
      }
    } catch {
      setLoadError("Unable to load executive overview right now.");
      setExposure(null);
      setStats(null);
      setReports([]);
      setHistoryNotice(null);
      setHistoryTruncated(false);
      setActions([]);
      setLatestSignals([]);
      setPreviousSignals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    const onUploaded = () => { void loadDashboard(); };
    window.addEventListener("reports:uploaded", onUploaded as EventListener);
    return () => { window.removeEventListener("reports:uploaded", onUploaded as EventListener); };
  }, [loadDashboard]);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(baselineDismissKey) === "1";
    setBaselineDismissed(dismissed);
  }, [baselineDismissKey]);

  const latestReadyBrief = useMemo(
    () => reports.find((report) => report.status === "ready" && report.download_pdf_url) || null,
    [reports],
  );
  const latestProcessedReport = useMemo(() => reports.find((report) => report.status === "ready") || null, [reports]);
  const reviewPeriodLabel = useMemo(() => formatReviewPeriod(latestProcessedReport), [latestProcessedReport]);
  const reviewsAnalyzed = latestProcessedReport?.total_reviews ?? 0;
  const lastProcessedLabel = formatDateOnly(latestProcessedReport?.created_at);
  const readyReportCount = useMemo(() => reports.filter((report) => report.status === "ready").length, [reports]);
  const showBaselineNotice = readyReportCount === 1 && !baselineDismissed;
  const isFirstRunWorkspace = !loading && !loadError && readyReportCount === 0;

  const overdueActions = useMemo(() => actions.filter((action) => isOverdue(action)), [actions]);
  const openActions = useMemo(() => actions.filter((action) => action.status !== "done"), [actions]);
  const unownedActionsCount = useMemo(
    () => openActions.filter((action) => !action.owner || String(action.owner).trim() === "").length,
    [openActions],
  );
  const highSeveritySignalsCount = useMemo(
    () => latestSignals.filter((signal) => String(signal.severity || "").toLowerCase() === "high").length,
    [latestSignals],
  );

  const newSignalsCount = useMemo(() => {
    if (previousSignals.length === 0) return latestSignals.length;
    return Math.max(0, latestSignals.length - previousSignals.length);
  }, [latestSignals.length, previousSignals.length]);

  const newExposureCategories = useMemo(() => {
    const previousCategories = new Set(previousSignals.map(signalCategory));
    const latestCategories = new Set(latestSignals.map(signalCategory));
    let created = 0;
    latestCategories.forEach((category) => {
      if (!previousCategories.has(category)) created += 1;
    });
    return created;
  }, [latestSignals, previousSignals]);

  const signalCategoryCounts = useMemo(() => {
    const counts = new Map<string, { label: string; count: number }>();
    latestSignals.forEach((signal) => {
      const key = signalCategory(signal);
      const label = signalLabel(signal);
      const existing = counts.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        counts.set(key, { label, count: 1 });
      }
    });
    return Array.from(counts.values()).sort((a, b) => b.count - a.count);
  }, [latestSignals]);

  const issuePercentages = useMemo<ReputationIssuePercentages>(
    () => buildIssuePercentagesFromSignals(latestSignals),
    [latestSignals],
  );
  const previousIssuePercentages = useMemo<ReputationIssuePercentages>(
    () => buildIssuePercentagesFromSignals(previousSignals),
    [previousSignals],
  );

  const topIssue = signalCategoryCounts[0] || null;

  const suggestedActions = useMemo(() => {
    return latestSignals
      .filter((signal) => String(signal.severity || "").toLowerCase() === "high")
      .map((signal) => {
        const label = signalLabel(signal);
        const categoryKey = signalCategory(signal);
        const hasAssignedAction = actions.some((action) => {
          const haystack = `${action.title} ${action.notes || ""} ${action.kpi || ""}`.toLowerCase();
          return haystack.includes(categoryKey);
        });
        return {
          id: signal.id,
          hasAssignedAction,
          context: `High-severity ${label.toLowerCase()} client issue detected in this cycle.`,
          recommendation: recommendationForSignal(label),
        };
      })
      .filter((item) => !item.hasAssignedAction);
  }, [actions, latestSignals]);

  const handleExportBrief = useCallback(async (targetBrief?: ReportListItem | null) => {
    const brief = targetBrief || latestReadyBrief;
    if (!brief?.download_pdf_url) {
      navigate("/dashboard/reports");
      return;
    }

    const exportUrl = brief.download_pdf_url.includes("?")
      ? `${brief.download_pdf_url}&export=1`
      : `${brief.download_pdf_url}?export=1`;

    try {
      const response = await fetch(exportUrl, { credentials: "include" });
      const contentType = response.headers.get("content-type") || "";

      if (contentType.includes("application/json")) {
        const payload = (await response.json()) as { error?: string; message?: string };
        if (payload.error === "plan_limit") {
          emitPlanLimitError(payload.message || "Trial limit reached");
          return;
        }
        if (payload.error === "Report outside plan history window") {
          toast.error("This report is outside your plan's governance history window. Upgrade your plan to access older reports.");
          return;
        }
        if (!response.ok) {
          toast.error(payload.message || payload.error || "Unable to generate governance brief.");
          return;
        }
      }

      if (!response.ok) {
        toast.error("Unable to generate governance brief.");
        return;
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch {
      toast.error("Unable to generate governance brief.");
    }
  }, [latestReadyBrief, navigate]);

  const planUsage = useMemo(() => {
    const limits = resolvePlanLimits(currentPlan);
    return { pdfWatermark: Boolean(limits.pdfWatermark) };
  }, [currentPlan]);

  const dismissBaselineNotice = () => {
    window.localStorage.setItem(baselineDismissKey, "1");
    setBaselineDismissed(true);
  };

  // Attention items — rendered in the right column
  const attentionItems: Array<{ id: string; label: string; severity: "high" | "warn"; to: string; action: string }> = [];
  if (overdueActions.length > 0) {
    attentionItems.push({
      id: "overdue",
      label: `${overdueActions.length} overdue ${overdueActions.length === 1 ? "action" : "actions"}`,
      severity: "high",
      to: "/dashboard/actions?filter=overdue",
      action: "Review",
    });
  }
  if (exposure?.partner_escalation_required) {
    attentionItems.push({
      id: "escalation",
      label: "Partner escalation required",
      severity: "high",
      to: latestProcessedReport ? `/dashboard/reports/${latestProcessedReport.id}` : "/dashboard/reports",
      action: "Open brief",
    });
  }
  if (highSeveritySignalsCount > 0) {
    attentionItems.push({
      id: "signals",
      label: `${highSeveritySignalsCount} high-severity ${highSeveritySignalsCount === 1 ? "issue" : "issues"}`,
      severity: "warn",
      to: "/dashboard/signals?filter=high",
      action: "View",
    });
  }
  if (unownedActionsCount > 0) {
    attentionItems.push({
      id: "unowned",
      label: `${unownedActionsCount} ${unownedActionsCount === 1 ? "action needs" : "actions need"} an owner`,
      severity: "warn",
      to: "/dashboard/actions",
      action: "Assign",
    });
  }

  // Brief status chip
  const briefStatus = latestProcessedReport?.status;
  const hasPartnerEscalation = Boolean(exposure?.partner_escalation_required);
  const chipLabel = hasPartnerEscalation ? "Escalation Flagged"
    : briefStatus === "sent" ? "Sent"
    : briefStatus === "acknowledged" ? "Acknowledged"
    : briefStatus === "ready" || briefStatus === "escalation" ? "Brief prepared"
    : "Draft";
  const chipColor = hasPartnerEscalation
    ? { border: "rgba(251,191,36,0.34)", bg: "rgba(251,191,36,0.10)", text: "#FCD34D" }
    : briefStatus === "acknowledged" || briefStatus === "ready"
    ? { border: "rgba(196,169,106,0.35)", bg: "rgba(196,169,106,0.10)", text: "rgba(196,169,106,0.90)" }
    : briefStatus === "sent"
      ? { border: "rgba(196,169,106,0.25)", bg: "rgba(196,169,106,0.07)", text: "rgba(196,169,106,0.70)" }
      : briefStatus === "escalation"
        ? { border: "rgba(251,191,36,0.30)", bg: "rgba(251,191,36,0.08)", text: "#FCD34D" }
        : { border: "rgba(255,255,255,0.10)", bg: "rgba(255,255,255,0.04)", text: "rgba(255,255,255,0.38)" };

  // Loop step state
  const hasReport = Boolean(latestProcessedReport);
  const reportReady = latestProcessedReport?.status === "ready";
  const loopActiveStep =
    !hasReport || !reportReady ? 0
    : overdueActions.length > 0 ? 3
    : openActions.length === 0 ? 1
    : 2;
  const briefId = latestProcessedReport?.id;
  const loopSteps = [
    { label: "New Review",        stat: readyReportCount > 0 ? `${readyReportCount} complete` : "Upload CSV",       to: "/upload" },
    { label: "Governance Brief",  stat: hasReport ? reviewPeriodLabel : "Awaiting review",                          to: briefId ? `/dashboard/reports/${briefId}` : "/dashboard/reports" },
    { label: "Meeting View",      stat: reportReady ? "Ready" : "Pending brief",                                    to: briefId ? `/dashboard/reports/${briefId}?present=1` : "/dashboard/reports" },
    { label: "Follow-Through",    stat: openActions.length > 0 ? `${openActions.length} open` : "All clear",        to: "/dashboard/actions" },
  ];

  // unused computed state — preserved for future use
  void stats;
  void issuePercentages;
  void previousIssuePercentages;
  void topIssue;
  void newExposureCategories;
  void suggestedActions;
  void loopSteps;
  void loopActiveStep;

  // Inline sentence summarising cycle evidence — woven into the headline body, not a strip
  const cycleSummaryParts: string[] = [];
  if (latestSignals.length > 0) cycleSummaryParts.push(`${latestSignals.length} client ${latestSignals.length === 1 ? "issue" : "issues"} reviewed`);
  if (highSeveritySignalsCount > 0) cycleSummaryParts.push(`${highSeveritySignalsCount} high-severity`);
  if (openActions.length > 0) cycleSummaryParts.push(`${openActions.length} open ${openActions.length === 1 ? "action" : "actions"}`);
  if (overdueActions.length > 0) cycleSummaryParts.push(`${overdueActions.length} overdue`);
  const cycleSummary = cycleSummaryParts.join(" · ");

  // Agenda items: prioritised matters for the meeting — no separate widget, just a list
  const agendaItems: Array<{ id: string; priority: "high" | "moderate"; matter: string; to: string }> = [];
  if (overdueActions.length > 0) agendaItems.push({
    id: "overdue",
    priority: "high",
    matter: `${overdueActions.length} overdue follow-through ${overdueActions.length === 1 ? "item requires" : "items require"} review before the meeting can close cleanly`,
    to: "/dashboard/actions?filter=overdue",
  });
  if (hasPartnerEscalation) agendaItems.push({
    id: "escalation",
    priority: "high",
    matter: "Partner escalation is flagged in the current brief and requires a decision in the room",
    to: latestProcessedReport ? `/dashboard/reports/${latestProcessedReport.id}` : "/dashboard/reports",
  });
  if (highSeveritySignalsCount > 0) agendaItems.push({
    id: "signals",
    priority: highSeveritySignalsCount >= 3 ? "high" : "moderate",
    matter: `${highSeveritySignalsCount} high-severity client ${highSeveritySignalsCount === 1 ? "issue is" : "issues are"} active and should be reviewed in sequence during the meeting`,
    to: "/dashboard/signals?filter=high",
  });
  if (unownedActionsCount > 0) agendaItems.push({
    id: "unowned",
    priority: "moderate",
    matter: `${unownedActionsCount} open ${unownedActionsCount === 1 ? "action needs" : "actions need"} clear ownership before follow-through can proceed`,
    to: "/dashboard/actions",
  });

  // Room context — integrated right column of the decision surface
  const lastUploadDate = latestProcessedReport
    ? formatDateOnly(latestProcessedReport.created_at)
    : null;
  const meetingReadiness: { label: string; ok: boolean }[] = [];
  if (latestProcessedReport) {
    meetingReadiness.push({ label: "Brief prepared", ok: true });
    meetingReadiness.push({
      label: overdueActions.length > 0
        ? `${overdueActions.length} overdue ${overdueActions.length === 1 ? "item" : "items"} outstanding`
        : "No overdue follow-through",
      ok: overdueActions.length === 0,
    });
    meetingReadiness.push({
      label: openActions.length > 0
        ? `${openActions.length} open ${openActions.length === 1 ? "action" : "actions"} still active`
        : "No open actions",
      ok: openActions.length === 0,
    });
    if (unownedActionsCount > 0) {
      meetingReadiness.push({
        label: `${unownedActionsCount} open ${unownedActionsCount === 1 ? "action needs" : "actions need"} owner`,
        ok: false,
      });
    } else if (openActions.length > 0) {
      meetingReadiness.push({ label: "Open actions have owners", ok: true });
    }
    meetingReadiness.push({
      label: hasPartnerEscalation
        ? "Partner escalation flagged"
        : "No partner escalation flagged",
      ok: !hasPartnerEscalation,
    });
  }

  return (
    <div className="home-root">
      <div className="home-inner">

        {/* ── Page frame ─────────────────────────────────────────────────────
            Firm identity, cycle period, status — pure typography, no box.
        ──────────────────────────────────────────────────────────────────── */}
        <header className="home-frame">
          <div className="home-frame-row">
            <div className="home-frame-left">
              <p className="home-firm-name">{user?.firm_name || "Governance Workspace"}</p>
              <div className="home-frame-meta">
                {latestProcessedReport ? (
                  <>
                    <span className="home-frame-cycle">{reviewPeriodLabel}</span>
                    <span className="home-frame-sep" aria-hidden>·</span>
                    <span
                      className="home-frame-chip"
                      style={{ borderColor: chipColor.border, background: chipColor.bg, color: chipColor.text }}
                    >
                      {chipLabel}
                    </span>
                  </>
                ) : (
                  <span className="home-frame-nocycle">No active cycle</span>
                )}
              </div>
            </div>
            <Link to="/upload?start=true" className="home-frame-action">New Review</Link>
          </div>
          <div className="home-frame-rule" />
        </header>

        {/* Error */}
        {loadError ? (
          <div className="home-error">
            <p>{loadError}</p>
          </div>
        ) : null}

        {/* ── First-run ──────────────────────────────────────────────────────── */}
        {isFirstRunWorkspace ? (
          <section className="home-onboard">
            <div className="home-onboard-grid">
              <div className="home-onboard-main">
                <p className="home-onboard-eyebrow">First review cycle</p>
                <h2 className="home-onboard-headline">
                  The workspace stays quiet until the first cycle begins.
                </h2>
                <p className="home-onboard-body">
                  Bring in one CSV from the current review period. Clarion validates the file,
                  generates the first governance brief, and opens the issue and follow-through
                  workflow from there.
                </p>
                <div className="home-onboard-steps">
                  {[
                    ["01", "Upload feedback", "Use one current review-period CSV to establish the live cycle."],
                    ["02", "Review signals", "Clarion groups recurring client issues into a decision-ready surface."],
                    ["03", "Open follow-through", "Assign owners and move directly into the governance brief."],
                  ].map(([step, title, body]) => (
                    <div key={step} className="home-onboard-step">
                      <p className="home-onboard-step-num">{step}</p>
                      <h3 className="home-onboard-step-title">{title}</h3>
                      <p className="home-onboard-step-body">{body}</p>
                    </div>
                  ))}
                </div>
                <div className="home-onboard-ctas">
                  <Link to="/upload?start=true" className="home-onboard-primary-cta">Upload feedback CSV</Link>
                  <Link to="/demo" className="home-onboard-ghost-cta">Review sample workspace</Link>
                </div>
              </div>
              <div className="home-onboard-aside">
                {[
                  ["What you need", "One CSV export from the current review period. Clarion checks structure first, then runs full upload validation."],
                  ["What Clarion creates", "The first upload creates the governance brief, issue map, and action list the workspace orbits around."],
                  ["Sample workspace", "The sample workspace uses example law-firm data. Your live workspace stays untouched until you upload your own file."],
                ].map(([title, body]) => (
                  <div key={title} className="home-onboard-aside-item">
                    <p className="home-onboard-aside-label">{title}</p>
                    <p className="home-onboard-aside-body">{body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {/* ── Decision room surface ───────────────────────────────────────────
            The page IS the room. No card border. Dark canvas section.
            Two-column inner: left = headline + evidence + CTAs,
            right = integrated cycle context (no border, same surface).
        ──────────────────────────────────────────────────────────────────── */}
        {!isFirstRunWorkspace ? (
          <section className="home-room" aria-label="Current governance brief">
            <div className="home-room-glow" aria-hidden />

            <div className="home-room-inner">
              {/* Left: the dominant surface */}
              <div className="home-room-left">
                <p className="home-room-eyebrow">Current governance brief</p>

                <div className="home-room-headline-row">
                  <span className="home-room-gold-rail" aria-hidden />
                  <div className="home-room-headline-body">
                    <h2 className="home-room-headline">
                      {latestProcessedReport ? reviewPeriodLabel : "No brief ready yet"}
                    </h2>
                    {cycleSummary ? (
                      <p className="home-room-summary">{cycleSummary}</p>
                    ) : null}
                  </div>
                </div>

                <div className="home-room-actions">
                  {latestProcessedReport ? (
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/reports/${latestProcessedReport.id}?present=1`)}
                      className="home-room-enter"
                    >
                      Open Meeting View
                    </button>
                  ) : null}
                  <div className="home-room-secondary-actions">
                    {latestProcessedReport ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/reports/${latestProcessedReport.id}`)}
                        className="home-room-brief-link"
                      >
                        Open Governance Brief
                      </button>
                    ) : null}
                    {latestReadyBrief ? (
                      <button
                        type="button"
                        onClick={() => void handleExportBrief()}
                        className="home-room-pdf-link"
                      >
                        {loading
                          ? <><Loader2 size={11} className="animate-spin" /> Loading</>
                          : planUsage.pdfWatermark ? "Preview PDF" : "Download PDF"}
                      </button>
                    ) : null}
                    {!latestProcessedReport ? (
                      <button
                        type="button"
                        onClick={() => navigate("/upload")}
                        className="home-room-enter"
                      >
                        Start New Review <ChevronRight size={13} />
                      </button>
                    ) : null}
                  </div>
                </div>

                {(showBaselineNotice || (historyTruncated && historyNotice)) ? (
                  <div className="home-room-notice">
                    <p className="home-room-notice-text">
                      {showBaselineNotice
                        ? "Baseline cycle — trend comparison becomes available after the next upload."
                        : historyNotice}
                    </p>
                    {showBaselineNotice ? (
                      <button type="button" onClick={dismissBaselineNotice} aria-label="Dismiss" className="home-room-notice-dismiss">✕</button>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Right: integrated cycle context — no border, no card, same dark surface */}
              {latestProcessedReport ? (
                <div className="home-room-meta" aria-label="Cycle context">
                  <div className="home-room-meta-block">
                    <p className="home-room-meta-label">Governance state</p>
                    <ul className="home-room-readiness-list" aria-label="Governance state">
                      {meetingReadiness.map((item) => (
                        <li key={item.label} className={`home-room-readiness-item${item.ok ? " home-room-readiness-item--ok" : " home-room-readiness-item--open"}`}>
                          <span className="home-room-readiness-dot" aria-hidden />
                          <span className="home-room-readiness-text">{item.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="home-room-meta-block">
                    <p className="home-room-meta-label">Cycle</p>
                    <p className="home-room-meta-value">{reviewPeriodLabel}</p>
                  </div>
                  {lastUploadDate ? (
                    <div className="home-room-meta-block">
                      <p className="home-room-meta-label">Last processed</p>
                      <p className="home-room-meta-value">{lastUploadDate}</p>
                    </div>
                  ) : null}
                  {latestSignals.length > 0 ? (
                    <div className="home-room-meta-block">
                      <p className="home-room-meta-label">Issues on record</p>
                      <p className="home-room-meta-value">{latestSignals.length}</p>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          </section>
        ) : null}

        {/* ── Agenda ─────────────────────────────────────────────────────────
            Matters requiring attention in this cycle, presented as a
            prioritised reading list — not an alerts widget.
            Editorial: each item is a full sentence stating the matter.
            No per-row buttons. Click the item to navigate.
        ──────────────────────────────────────────────────────────────────── */}
        {!isFirstRunWorkspace && agendaItems.length > 0 ? (
          <section className="home-agenda" aria-label="Meeting agenda">
            <p className="home-agenda-heading">Before the meeting</p>
            <ol className="home-agenda-list">
              {agendaItems.map((item, i) => (
                <li key={item.id} className="home-agenda-item">
                  <span className="home-agenda-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className={`home-agenda-priority home-agenda-priority--${item.priority}`} aria-hidden />
                  <Link to={item.to} className="home-agenda-matter">{item.matter}</Link>
                </li>
              ))}
            </ol>
          </section>
        ) : null}

      </div>
    </div>
  );
};

export default Dashboard;
