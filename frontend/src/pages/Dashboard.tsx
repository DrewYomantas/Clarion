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
  const chipLabel = briefStatus === "sent" ? "Sent"
    : briefStatus === "acknowledged" ? "Acknowledged"
    : briefStatus === "ready" || briefStatus === "escalation" ? "Ready to Send"
    : "Draft";
  const chipColor = briefStatus === "acknowledged" || briefStatus === "ready"
    ? { border: "rgba(52,211,153,0.3)", bg: "rgba(52,211,153,0.1)", text: "#6EE7B7" }
    : briefStatus === "sent"
      ? { border: "rgba(96,165,250,0.3)", bg: "rgba(96,165,250,0.1)", text: "#93C5FD" }
      : briefStatus === "escalation"
        ? { border: "rgba(251,191,36,0.3)", bg: "rgba(251,191,36,0.1)", text: "#FCD34D" }
        : { border: "rgba(255,255,255,0.1)", bg: "rgba(255,255,255,0.05)", text: "rgba(255,255,255,0.4)" };

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

  // Merge-style warm/dark polarity: instrument strip uses warm cream, not another dark surface
  const stripBg = "#F9F7F3";
  const stripBorder = "rgba(13,27,42,0.08)";

  return (
    <div className="home-root">
      <div className="home-inner">

        {/* ── Zone 1: Cycle header ──────────────────────────────────────────────
            Norm.ai influence: firm identity + cycle context as pure typography,
            no containing box. The page is the container.
        ─────────────────────────────────────────────────────────────────────── */}
        <header className="home-header">
          <div className="home-header-row">
            <div className="home-header-left">
              <p className="home-eyebrow">{user?.firm_name || "Governance Workspace"}</p>
              <div className="home-cycle-row">
                <span className="home-cycle-label">
                  {latestProcessedReport
                    ? <><span className="home-cycle-muted">Governance cycle</span> <span className="home-cycle-period">{reviewPeriodLabel}</span></>
                    : <span className="home-cycle-muted">No active cycle</span>}
                </span>
                {latestProcessedReport ? (
                  <span
                    className="home-chip"
                    style={{ borderColor: chipColor.border, background: chipColor.bg, color: chipColor.text }}
                  >
                    {chipLabel}
                  </span>
                ) : null}
                {latestProcessedReport ? (
                  <span className="home-cycle-date">Last processed {lastProcessedLabel}</span>
                ) : null}
              </div>
            </div>
            <Link to="/upload?start=true" className="home-new-review-btn">New Review</Link>
          </div>
          <div className="home-header-rule" />
        </header>

        {/* Error state */}
        {loadError ? (
          <div className="home-error-banner">
            <p>{loadError}</p>
          </div>
        ) : null}

        {/* ── First-run empty state ─────────────────────────────────────────── */}
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

        {/* ── Zone 2: Primary decision surface ─────────────────────────────────
            Merge.dev influence: warm/dark polarity — dark command card left,
            instrument strip in warm cream, not another dark surface.
            Vercel influence: one unmistakably primary CTA ("Open Meeting View"),
            everything else recedes in weight.
            Linear influence: multi-layer shadow depth on the brief card.
        ─────────────────────────────────────────────────────────────────────── */}
        {!isFirstRunWorkspace ? (
          <div className={`home-stage${attentionItems.length > 0 ? " home-stage--split" : ""}`}>

            {/* LEFT: Brief command card */}
            <div className="home-brief-card">
              {/* Ambient radial glow — top-right depth layer */}
              <div className="home-brief-glow" aria-hidden />

              {/* Headline section */}
              <div className="home-brief-head">
                <div className="home-brief-head-inner">
                  {/* Title block */}
                  <div className="home-brief-title-col">
                    <p className="home-brief-eyebrow">Current Governance Brief</p>
                    <div className="home-brief-title-row">
                      <span className="home-brief-gold-rail" aria-hidden />
                      <h2 className="home-brief-title">
                        {latestProcessedReport ? reviewPeriodLabel : "No brief ready yet"}
                      </h2>
                    </div>
                    {latestProcessedReport ? (
                      <p className="home-brief-sub">{reviewsAnalyzed} reviews analyzed</p>
                    ) : null}
                  </div>

                  {/* CTA stack — Vercel-style single dominant action */}
                  <div className="home-brief-ctas">
                    {latestProcessedReport ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/reports/${latestProcessedReport.id}?present=1`)}
                        className="home-cta-primary"
                      >
                        Open Meeting View
                      </button>
                    ) : null}
                    {latestProcessedReport ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/reports/${latestProcessedReport.id}`)}
                        className="home-cta-secondary"
                      >
                        Open Governance Brief <ChevronRight size={12} />
                      </button>
                    ) : null}
                    {latestReadyBrief ? (
                      <button
                        type="button"
                        onClick={() => void handleExportBrief()}
                        className="home-cta-ghost"
                      >
                        {loading ? <><Loader2 size={12} className="animate-spin" /> Loading</> : planUsage.pdfWatermark ? "Preview PDF" : "Download PDF"}
                      </button>
                    ) : (!latestProcessedReport ? (
                      <button
                        type="button"
                        onClick={() => navigate("/upload")}
                        className="home-cta-primary"
                      >
                        Start New Review <ChevronRight size={13} />
                      </button>
                    ) : null)}
                  </div>
                </div>
              </div>

              {/* Instrument strip — Merge.dev warm cream polarity */}
              {latestProcessedReport ? (
                <div
                  className="home-strip"
                  style={{ background: stripBg, borderTop: `1px solid ${stripBorder}` }}
                >
                  {([
                    { value: latestSignals.length,  label: "Issues detected",  ink: "#1E293B",              sub: "#64748B" },
                    { value: openActions.length,    label: "Open actions",     ink: "#1E293B",              sub: "#64748B" },
                    { value: overdueActions.length, label: "Overdue",          ink: overdueActions.length > 0 ? "#B91C1C" : "#1E293B", sub: "#64748B" },
                    { value: newSignalsCount,       label: "New this cycle",   ink: newSignalsCount > 0 ? "#92400E" : "#1E293B", sub: "#64748B" },
                  ] as const).map((m, i, arr) => (
                    <div
                      key={m.label}
                      className="home-strip-cell"
                      style={{ borderRight: i < arr.length - 1 ? `1px solid ${stripBorder}` : "none" }}
                    >
                      <p className="home-strip-value" style={{ color: m.ink }}>{m.value}</p>
                      <p className="home-strip-label" style={{ color: m.sub }}>{m.label}</p>
                    </div>
                  ))}
                </div>
              ) : null}

              {/* Cycle directive — quiet bottom context line */}
              {latestProcessedReport && (newSignalsCount > 0 || overdueActions.length > 0) ? (
                <div
                  className="home-directive"
                  style={{ background: stripBg, borderTop: `1px solid ${stripBorder}` }}
                >
                  <span className="home-directive-dot" aria-hidden />
                  <p className="home-directive-text">
                    {overdueActions.length > 0
                      ? `${overdueActions.length} overdue ${overdueActions.length === 1 ? "action requires" : "actions require"} partner review before this brief is meeting-ready.`
                      : `${newSignalsCount} new ${newSignalsCount === 1 ? DISPLAY_LABELS.clientIssueSingular.toLowerCase() : DISPLAY_LABELS.clientIssuePlural.toLowerCase()} detected since last review — assign partner review.`}
                  </p>
                </div>
              ) : null}

              {/* System notices */}
              {(showBaselineNotice || (historyTruncated && historyNotice)) ? (
                <div className="home-notice" style={{ background: stripBg, borderTop: `1px solid ${stripBorder}` }}>
                  <p className="home-notice-text">
                    {showBaselineNotice
                      ? "Baseline cycle — trend comparison becomes available after the next upload."
                      : historyNotice}
                  </p>
                  {showBaselineNotice ? (
                    <button type="button" onClick={dismissBaselineNotice} aria-label="Dismiss" className="home-notice-dismiss">✕</button>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* RIGHT: Attention column — contextual, invisible when empty */}
            {attentionItems.length > 0 ? (
              <div className="home-attention">
                <div className="home-attention-head">
                  <span className="home-attention-pulse" aria-hidden>
                    <span className="home-attention-pulse-ring" />
                    <span className="home-attention-pulse-dot" />
                  </span>
                  <p className="home-attention-label">Needs attention</p>
                </div>
                <ul className="home-attention-list">
                  {attentionItems.map((item) => (
                    <li key={item.id} className="home-attention-item">
                      <div className="home-attention-item-left">
                        <span
                          className="home-attention-dot"
                          style={{ background: item.severity === "high" ? "#EF4444" : "#F59E0B" }}
                        />
                        <span className="home-attention-text">{item.label}</span>
                      </div>
                      <Link to={item.to} className="home-attention-action">{item.action} →</Link>
                    </li>
                  ))}
                </ul>
                {latestProcessedReport && latestSignals.length > 0 ? (
                  <div className="home-attention-footer">
                    <p className="home-attention-footer-text">
                      {latestSignals.length} total {latestSignals.length === 1 ? "issue" : "issues"} across {signalCategoryCounts.length} {signalCategoryCounts.length === 1 ? "category" : "categories"} this cycle.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

          </div>
        ) : null}

        {/* ── Zone 3: Governance loop ───────────────────────────────────────────
            Glean.com influence: clear type scale discipline between step number,
            label, and stat. Linear influence: warm cream active step anchored
            by gold rail, not just a background color change.
        ─────────────────────────────────────────────────────────────────────── */}
        {!isFirstRunWorkspace ? (
          <div className="home-loop">
            {loopSteps.map((step, index) => (
              <Link
                key={step.label}
                to={step.to}
                className={`home-loop-step${index === loopActiveStep ? " home-loop-step--active" : ""}`}
                style={{
                  borderRight: index < loopSteps.length - 1
                    ? `1px solid ${index === loopActiveStep ? "rgba(255,255,255,0.07)" : "#E8E4DF"}`
                    : "none",
                }}
              >
                <span className="home-loop-num">{String(index + 1).padStart(2, "0")}</span>
                <span className="home-loop-label">{step.label}</span>
                <span className="home-loop-stat">{step.stat}</span>
                {index === loopActiveStep ? (
                  <span className="home-loop-current">
                    <span className="home-loop-current-dot" />
                    Current
                  </span>
                ) : null}
              </Link>
            ))}
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default Dashboard;
