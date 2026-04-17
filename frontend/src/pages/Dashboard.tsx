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

  // unused vars kept to avoid removing computed state that may be used later
  void stats;
  void issuePercentages;
  void previousIssuePercentages;
  void topIssue;
  void newExposureCategories;
  void suggestedActions;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #060D1A 0%, #081120 100%)",
        padding: "var(--space-page-y) var(--space-page-x)",
      }}
    >
      <div style={{ maxWidth: "var(--content-max-w)", margin: "0 auto" }}>

        {/* ── Zone 1: Cycle header ─────────────────────────────────────── */}
        <header style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "1rem" }}>
            <div>
              <p style={{
                margin: 0,
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "#4A7A9B",
              }}>
                {user?.firm_name || "Governance Workspace"}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "6px", flexWrap: "wrap" }}>
                <h1 style={{
                  margin: 0,
                  fontSize: "13px",
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.35)",
                  letterSpacing: "0.01em",
                }}>
                  {latestProcessedReport
                    ? <>Governance cycle <span style={{ color: "rgba(255,255,255,0.55)" }}>{reviewPeriodLabel}</span></>
                    : "No active cycle"}
                </h1>
                {latestProcessedReport ? (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "10px",
                    fontWeight: 600,
                    padding: "2px 7px",
                    borderRadius: "4px",
                    border: `1px solid ${chipColor.border}`,
                    background: chipColor.bg,
                    color: chipColor.text,
                  }}>
                    {chipLabel}
                  </span>
                ) : null}
                {latestProcessedReport ? (
                  <span style={{ fontSize: "11px", color: "#354F64" }}>
                    Last processed {lastProcessedLabel}
                  </span>
                ) : null}
              </div>
            </div>
            <Link
              to="/upload?start=true"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)",
                padding: "7px 14px",
                fontSize: "11.5px",
                fontWeight: 500,
                color: "rgba(255,255,255,0.4)",
                textDecoration: "none",
                transition: "all 0.15s",
                flexShrink: 0,
              }}
            >
              New Review
            </Link>
          </div>
          {/* Divider */}
          <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginTop: "20px" }} />
        </header>

        {/* Error state */}
        {loadError ? (
          <div style={{
            marginBottom: "1.5rem",
            borderRadius: "12px",
            border: "1px solid rgba(248,113,113,0.2)",
            background: "rgba(239,68,68,0.08)",
            padding: "12px 20px",
          }}>
            <p style={{ margin: 0, fontSize: "13px", color: "#FCA5A5" }}>{loadError}</p>
          </div>
        ) : null}

        {/* ── First-run empty state ─────────────────────────────────────── */}
        {isFirstRunWorkspace ? (
          <section style={{
            borderRadius: "20px",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#08111E",
            overflow: "hidden",
          }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr" }}>
              <div style={{ padding: "40px 48px", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6DBDCC" }}>
                  First review cycle
                </p>
                <h2 style={{
                  margin: "16px 0 0",
                  fontSize: "clamp(1.8rem, 3vw, 2.5rem)",
                  lineHeight: 1.02,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontWeight: 500,
                  color: "#F3F7FB",
                  maxWidth: "12ch",
                }}>
                  The workspace stays quiet until the first cycle begins.
                </h2>
                <p style={{ margin: "16px 0 0", fontSize: "15px", lineHeight: "1.7", color: "#8FA7BC", maxWidth: "520px" }}>
                  Bring in one CSV from the current review period. Clarion validates the file, generates the first governance brief,
                  and opens the issue and follow-through workflow from there.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "32px" }}>
                  {[
                    ["01", "Upload feedback", "Use one current review-period CSV to establish the live cycle."],
                    ["02", "Review signals", "Clarion groups recurring client issues into a decision-ready surface."],
                    ["03", "Open follow-through", "Assign owners and move directly into the governance brief."],
                  ].map(([step, title, body]) => (
                    <div key={step} style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
                      <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "#4E6A84" }}>{step}</p>
                      <h3 style={{ margin: "8px 0 0", fontSize: "14px", fontWeight: 600, color: "#FFFFFF" }}>{title}</h3>
                      <p style={{ margin: "6px 0 0", fontSize: "12.5px", lineHeight: "1.55", color: "#7F98AE" }}>{body}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "32px", flexWrap: "wrap" }}>
                  <Link
                    to="/upload?start=true"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "100px",
                      background: "#0EA5C2",
                      padding: "10px 20px",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: "#FFFFFF",
                      textDecoration: "none",
                    }}
                  >
                    Upload feedback CSV
                  </Link>
                  <Link
                    to="/demo"
                    style={{ fontSize: "13px", fontWeight: 500, color: "#9CC0D3", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    Review sample workspace
                  </Link>
                </div>
              </div>
              <div style={{ padding: "40px 32px", background: "rgba(255,255,255,0.01)" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {[
                    ["What you need", "One CSV export from the current review period. Clarion checks structure first, then runs full upload validation."],
                    ["What Clarion creates", "The first upload creates the governance brief, issue map, and action list the workspace orbits around."],
                    ["Sample workspace", "The sample workspace uses example law-firm data. Your live workspace stays untouched until you upload your own file."],
                  ].map(([title, body]) => (
                    <div key={title} style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "16px" }}>
                      <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#5A7D97" }}>{title}</p>
                      <p style={{ margin: "8px 0 0", fontSize: "12.5px", lineHeight: "1.6", color: "#89A3B8" }}>{body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* ── Zone 2: Primary decision surface (two-column) ─────────────── */}
        {!isFirstRunWorkspace ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: attentionItems.length > 0 ? "1fr 300px" : "1fr",
            gap: "20px",
            alignItems: "start",
          }}>

            {/* LEFT: Brief command card */}
            <div style={{
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.1)",
              overflow: "hidden",
              background: "linear-gradient(150deg, #0B1929 0%, #0D2040 55%, #0D1B2A 100%)",
              position: "relative",
            }}>
              {/* Ambient glow */}
              <div style={{
                position: "absolute",
                top: "-60px",
                right: "-60px",
                width: "280px",
                height: "280px",
                borderRadius: "50%",
                background: "#1a3a6b",
                opacity: 0.25,
                filter: "blur(60px)",
                pointerEvents: "none",
              }} aria-hidden />

              {/* Brief headline */}
              <div style={{ padding: "32px 36px 28px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>
                  <div style={{ flex: "1 1 0", minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "#3D6B8A",
                    }}>
                      Current Governance Brief
                    </p>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", marginTop: "14px" }}>
                      <span style={{
                        display: "block",
                        width: "3px",
                        height: "48px",
                        borderRadius: "2px",
                        background: "linear-gradient(180deg, #C4A96A 0%, rgba(196,169,106,0.3) 100%)",
                        flexShrink: 0,
                        marginTop: "4px",
                      }} aria-hidden />
                      <h2 style={{
                        margin: 0,
                        fontSize: "clamp(1.8rem, 2.8vw, 2.4rem)",
                        lineHeight: 1.0,
                        letterSpacing: "-0.04em",
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontWeight: 500,
                        color: "#FFFFFF",
                      }}>
                        {latestProcessedReport ? reviewPeriodLabel : "No brief ready yet"}
                      </h2>
                    </div>
                    {latestProcessedReport ? (
                      <p style={{ margin: "10px 0 0 17px", fontSize: "12px", color: "#2E5470" }}>
                        {reviewsAnalyzed} reviews analyzed
                      </p>
                    ) : null}
                  </div>

                  {/* CTA stack */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", paddingTop: "4px" }}>
                    {latestProcessedReport ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/reports/${latestProcessedReport.id}?present=1`)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          borderRadius: "8px",
                          background: "#FFFFFF",
                          padding: "9px 18px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#0D1B2A",
                          border: "none",
                          cursor: "pointer",
                          boxShadow: "0 1px 4px rgba(0,0,0,0.15), 0 4px 16px rgba(255,255,255,0.08)",
                          whiteSpace: "nowrap",
                          transition: "all 0.15s",
                        }}
                      >
                        Open Meeting View
                      </button>
                    ) : null}
                    {latestProcessedReport ? (
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/reports/${latestProcessedReport.id}`)}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          borderRadius: "8px",
                          border: "1px solid rgba(255,255,255,0.15)",
                          background: "rgba(255,255,255,0.06)",
                          padding: "8px 16px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: "rgba(255,255,255,0.65)",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                          transition: "all 0.15s",
                        }}
                      >
                        Open Governance Brief <ChevronRight size={12} />
                      </button>
                    ) : null}
                    {latestReadyBrief ? (
                      <button
                        type="button"
                        onClick={() => void handleExportBrief()}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "6px 12px",
                          fontSize: "11.5px",
                          fontWeight: 500,
                          color: "#3D6282",
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {loading ? <><Loader2 size={12} className="animate-spin" /> Loading</> : planUsage.pdfWatermark ? "Preview PDF" : "Download PDF"}
                      </button>
                    ) : (!latestProcessedReport ? (
                      <button
                        type="button"
                        onClick={() => navigate("/upload")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          borderRadius: "8px",
                          background: "#FFFFFF",
                          padding: "9px 18px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#0D1B2A",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Start New Review <ChevronRight size={13} />
                      </button>
                    ) : null)}
                  </div>
                </div>
              </div>

              {/* Instrument strip — cycle metrics */}
              {latestProcessedReport ? (
                <div style={{
                  display: "flex",
                  borderTop: "1px solid rgba(255,255,255,0.07)",
                  position: "relative",
                }}>
                  {[
                    { value: latestSignals.length,    label: "Issues detected",   color: latestSignals.length > 0 ? "#FFFFFF" : "#FFFFFF" },
                    { value: openActions.length,      label: "Open actions",      color: "#FFFFFF" },
                    { value: overdueActions.length,   label: "Overdue",           color: overdueActions.length > 0 ? "#F87171" : "#FFFFFF" },
                    { value: newSignalsCount,         label: "New this cycle",    color: newSignalsCount > 0 ? "#FCD34D" : "#FFFFFF" },
                  ].map((metric) => (
                    <div key={metric.label} style={{
                      flex: "1 1 0",
                      padding: "16px 20px",
                      borderRight: "1px solid rgba(255,255,255,0.07)",
                    }}>
                      <p style={{
                        margin: 0,
                        fontSize: "22px",
                        fontWeight: 600,
                        lineHeight: 1,
                        color: metric.color,
                        fontVariantNumeric: "tabular-nums",
                      }}>
                        {metric.value}
                      </p>
                      <p style={{ margin: "5px 0 0", fontSize: "10.5px", fontWeight: 500, color: "#2E5470", letterSpacing: "0.03em" }}>
                        {metric.label}
                      </p>
                    </div>
                  ))}
                  {/* Remove the last border */}
                  <style>{`.home-strip > div:last-child { border-right: none !important; }`}</style>
                </div>
              ) : null}

              {/* Cycle brief deltas — if we have signals from a previous cycle */}
              {latestProcessedReport && (newSignalsCount > 0 || overdueActions.length > 0) ? (
                <div style={{
                  padding: "12px 20px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(0,0,0,0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}>
                  <span style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#0EA5C2", flexShrink: 0 }} aria-hidden />
                  <p style={{ margin: 0, fontSize: "11.5px", color: "#5A8AAA", lineHeight: 1.4 }}>
                    {overdueActions.length > 0
                      ? `${overdueActions.length} overdue ${overdueActions.length === 1 ? "action requires" : "actions require"} partner review before this brief is meeting-ready.`
                      : `${newSignalsCount} new ${newSignalsCount === 1 ? DISPLAY_LABELS.clientIssueSingular.toLowerCase() : DISPLAY_LABELS.clientIssuePlural.toLowerCase()} detected since last review — assign partner review.`}
                  </p>
                </div>
              ) : null}

              {/* Baseline / history notices */}
              {(showBaselineNotice || (historyTruncated && historyNotice)) ? (
                <div style={{
                  borderTop: "1px solid rgba(255,255,255,0.04)",
                  background: "rgba(0,0,0,0.25)",
                  padding: "10px 20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "8px",
                }}>
                  <p style={{ margin: 0, fontSize: "10.5px", color: "rgba(255,255,255,0.2)", letterSpacing: "0.02em" }}>
                    {showBaselineNotice
                      ? "Baseline cycle — trend comparison becomes available after the next upload."
                      : historyNotice}
                  </p>
                  {showBaselineNotice ? (
                    <button
                      type="button"
                      onClick={dismissBaselineNotice}
                      aria-label="Dismiss"
                      style={{ fontSize: "10.5px", color: "rgba(255,255,255,0.18)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
                    >
                      ✕
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>

            {/* RIGHT: Attention column — only mounts when there's something */}
            {attentionItems.length > 0 ? (
              <div style={{
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.08)",
                overflow: "hidden",
                background: "#09121E",
              }}>
                <div style={{
                  padding: "12px 16px",
                  borderBottom: "1px solid rgba(255,255,255,0.06)",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}>
                  {/* Amber pulse dot */}
                  <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", flexShrink: 0 }}>
                    <span style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "#F59E0B",
                      animation: "ping 1.5s cubic-bezier(0,0,0.2,1) infinite",
                      opacity: 0.4,
                    }} />
                    <span style={{ position: "relative", display: "inline-flex", width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B" }} />
                  </span>
                  <p style={{ margin: 0, fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5A7D97" }}>
                    Needs attention
                  </p>
                </div>
                <ul style={{ margin: 0, padding: 0, listStyle: "none" }}>
                  {attentionItems.map((item) => (
                    <li key={item.id} style={{
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "11px 16px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                        <span style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          background: item.severity === "high" ? "#F87171" : "#FCD34D",
                          flexShrink: 0,
                        }} />
                        <span style={{ fontSize: "12.5px", color: "#A8C4D8", lineHeight: 1.3 }}>{item.label}</span>
                      </div>
                      <Link
                        to={item.to}
                        style={{
                          flexShrink: 0,
                          display: "inline-flex",
                          alignItems: "center",
                          borderRadius: "5px",
                          border: "1px solid rgba(255,255,255,0.12)",
                          background: "rgba(255,255,255,0.04)",
                          padding: "4px 10px",
                          fontSize: "10.5px",
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.55)",
                          textDecoration: "none",
                        }}
                      >
                        {item.action} →
                      </Link>
                    </li>
                  ))}
                </ul>
                {/* Cycle summary below attention list */}
                {latestProcessedReport && latestSignals.length > 0 ? (
                  <div style={{ padding: "12px 16px", borderTop: "1px solid rgba(255,255,255,0.04)", background: "rgba(0,0,0,0.15)" }}>
                    <p style={{ margin: 0, fontSize: "11px", color: "#2E4D63", lineHeight: 1.5 }}>
                      {latestSignals.length} total {latestSignals.length === 1 ? "issue" : "issues"} across {signalCategoryCounts.length} {signalCategoryCounts.length === 1 ? "category" : "categories"} in this cycle.
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

          </div>
        ) : null}

        {/* ── Zone 3: Governance loop ───────────────────────────────────── */}
        {!isFirstRunWorkspace ? (
          <div style={{ marginTop: "20px" }}>
            {/* Loop track */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              borderRadius: "12px",
              border: "1px solid rgba(255,255,255,0.07)",
              overflow: "hidden",
            }}>
              {loopSteps.map((step, index) => (
                <Link
                  key={step.label}
                  to={step.to}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "14px 18px",
                    background: index === loopActiveStep ? "#0A1724" : "#F8FAFC",
                    borderTop: `2px solid ${index === loopActiveStep ? "#C4A96A" : "transparent"}`,
                    borderRight: index < loopSteps.length - 1 ? `1px solid ${index === loopActiveStep ? "rgba(255,255,255,0.07)" : "#E2E8F0"}` : "none",
                    textDecoration: "none",
                    transition: "background 0.12s",
                  }}
                >
                  <span style={{
                    fontSize: "9px",
                    fontWeight: 700,
                    letterSpacing: "0.14em",
                    color: index === loopActiveStep ? "#3D5E7A" : "#B8C4CE",
                  }}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span style={{
                    marginTop: "5px",
                    fontSize: "12.5px",
                    fontWeight: 600,
                    lineHeight: 1.2,
                    color: index === loopActiveStep ? "#FFFFFF" : "#1E293B",
                  }}>
                    {step.label}
                  </span>
                  <span style={{
                    marginTop: "3px",
                    fontSize: "10.5px",
                    color: index === loopActiveStep ? "#2E5470" : "#94A3B8",
                    lineHeight: 1.3,
                  }}>
                    {step.stat}
                  </span>
                  {index === loopActiveStep ? (
                    <span style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "9.5px",
                      fontWeight: 700,
                      letterSpacing: "0.08em",
                      color: "rgba(196,169,106,0.7)",
                    }}>
                      <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "rgba(196,169,106,0.6)" }} />
                      Current
                    </span>
                  ) : null}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default Dashboard;
