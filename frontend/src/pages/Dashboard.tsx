
import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, AlertTriangle, Loader2, X } from "lucide-react";
import DashboardCard from "@/components/dashboard/DashboardCard";
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
import { Button } from "@/components/ui/button";
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
      return `${start.toLocaleDateString([], { month: "long" })} - ${end.toLocaleDateString([], {
        month: "long",
        year: "numeric",
      })}`;
    }
    return `${start.toLocaleDateString([], { month: "short", year: "numeric" })} - ${end.toLocaleDateString([], {
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
    const onUploaded = () => {
      void loadDashboard();
    };
    window.addEventListener("reports:uploaded", onUploaded as EventListener);
    return () => {
      window.removeEventListener("reports:uploaded", onUploaded as EventListener);
    };
  }, [loadDashboard]);

  useEffect(() => {
    const dismissed = window.localStorage.getItem(baselineDismissKey) === "1";
    setBaselineDismissed(dismissed);
  }, [baselineDismissKey]);


  const latestReadyBrief = useMemo(
    () => reports.find((report) => report.status === "ready" && report.download_pdf_url) || null,
    [reports],
  );
  const recentReadyBriefs = useMemo(
    () => reports.filter((report) => report.status === "ready" && report.download_pdf_url).slice(0, 3),
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
  const inProgressActions = useMemo(() => actions.filter((action) => action.status === "in_progress"), [actions]);
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

  const exposureLabel = (exposure?.exposure_label || "Baseline").toLowerCase();
  const exposureRisk = exposureLabel.includes("high") || exposureLabel.includes("elevated")
    ? "High"
    : exposureLabel.includes("watch")
      ? "Moderate"
      : "Low";

  const guidance = useMemo(() => {
    if (overdueActions.length > 0) {
      return {
        directive: `${overdueActions.length} overdue action${overdueActions.length === 1 ? "" : "s"} require immediate partner review.`,
        recommendation: "Assign partner review and confirm owner + due date updates today.",
      };
    }
    if (newSignalsCount > 0) {
      return {
        directive: `${newSignalsCount} new ${newSignalsCount === 1 ? DISPLAY_LABELS.clientIssueSingular.toLowerCase() : DISPLAY_LABELS.clientIssuePlural.toLowerCase()} detected since last review.`,
        recommendation: "Assign partner review.",
      };
    }
    if (latestSignals.length > 0 && openActions.length === 0) {
      return {
        directive: "Client issues exist without corresponding open actions.",
        recommendation: "Create action owners for each high-priority client issue.",
      };
    }
    return {
      directive: "Client issues and actions are currently aligned.",
      recommendation: "Proceed to generate the next governance brief.",
    };
  }, [latestSignals.length, newSignalsCount, openActions.length, overdueActions.length]);

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
  const topIssueShare = topIssue && latestSignals.length > 0 ? Math.round((topIssue.count / latestSignals.length) * 100) : 0;

  const briefDeltas = useMemo(() => {
    const items: string[] = [];
    items.push(newSignalsCount > 0 ? `${newSignalsCount} new client issues detected.` : "No net-new client issues detected in this cycle.");
    if (newExposureCategories > 0) {
      items.push(`${newExposureCategories} new exposure categories emerged.`);
    }
    items.push(
      overdueActions.length > 0
        ? `${overdueActions.length} overdue actions now require partner attention.`
        : "No overdue actions at this time.",
    );
    return items;
  }, [newExposureCategories, newSignalsCount, overdueActions.length]);

  const briefFeedbackQuotes = useMemo(
    () => latestSignals.map((signal) => signal.description?.trim()).filter((value): value is string => Boolean(value)).slice(0, 2),
    [latestSignals],
  );

  const estimatedImpact = useMemo(() => {
    if (!topIssue) return null;
    const modeledReduction = Math.max(1, Math.round(topIssue.count * 0.1));
    return `A 10% reduction in ${topIssue.label.toLowerCase()} themes would reduce approximately ${modeledReduction} flagged client issues in the next cycle.`;
  }, [topIssue]);

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

  const cycleAttentionSummary = useMemo(() => {
    if (overdueActions.length > 0) {
      return `${overdueActions.length} overdue follow-through item${overdueActions.length === 1 ? "" : "s"} need partner review before the current brief is meeting-ready.`;
    }
    if (unownedActionsCount > 0) {
      return `${unownedActionsCount} open follow-through item${unownedActionsCount === 1 ? "" : "s"} still need clear ownership before the brief can carry clean follow-through into the room.`;
    }
    if (highSeveritySignalsCount > 0) {
      return `${highSeveritySignalsCount} high-severity client issue${highSeveritySignalsCount === 1 ? "" : "s"} ${highSeveritySignalsCount === 1 ? "is" : "are"} active in the current cycle and should be reviewed in the brief first.`;
    }
    if (latestReadyBrief) {
      return "The latest brief is ready to review and current follow-through is in a healthy state.";
    }
    return "This cycle is active, but the latest brief is still being prepared.";
  }, [highSeveritySignalsCount, latestReadyBrief, overdueActions.length, unownedActionsCount]);

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

  const oversightMetrics = [
    {
      label: "High-risk signals",
      value: highSeveritySignalsCount,
      sub: `of ${latestSignals.length} total client issues`,
      risk: true,
      route: "/dashboard/signals",
      routeQuery: "filter=high",
    },
    {
      label: "Unowned actions",
      value: unownedActionsCount,
      sub: `${openActions.length} open actions total`,
      warn: true,
      route: "/dashboard/actions",
    },
    {
      label: "Briefs ready",
      value: readyReportCount,
      sub: readyReportCount === 1 ? "1 completed review cycle" : `${readyReportCount} completed cycles`,
      success: readyReportCount > 0,
      route: "/dashboard/reports",
    },
    {
      label: "Overdue actions",
      value: overdueActions.length,
      sub: overdueActions.length === 0 ? "No overdue items" : "Require immediate attention",
      risk: true,
      route: "/dashboard/actions",
      routeQuery: "filter=overdue",
    },
  ];

  const dismissBaselineNotice = () => {
    window.localStorage.setItem(baselineDismissKey, "1");
    setBaselineDismissed(true);
  };

  return (
    /* ── Page shell: transparent so WorkspaceLayout's warm canvas shows through ── */
    <section
      className="gov-page-shell"
      style={{ padding: "var(--space-page-y) var(--space-page-x)" }}
    >
      <div
        className="stage-sequence dash-override mx-auto w-full"
        style={{ maxWidth: "var(--content-max-w)" }}
      >
        {/* ── Page chrome: firm name + Start New Review ── */}
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <p className="text-[13px] font-semibold text-[#0D1B2A]">
              {user?.firm_name || "Governance Workspace"}
            </p>
            {latestProcessedReport ? (
              <span className="text-[11px] text-[#9CA3AF]">· Updated {lastProcessedLabel}</span>
            ) : null}
          </div>
          <Link
            to="/upload?start=true"
            className="inline-flex items-center gap-1.5 rounded-[7px] bg-[#0D1B2A] px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b]"
          >
            Start New Review
          </Link>
        </div>

        {isFirstRunWorkspace ? (
          <>
            <section className="mb-8 rounded-[12px] border border-[#D9E2EC] bg-white px-6 py-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
              <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
                <div>
                  <p className="gov-type-eyebrow mb-2">First review cycle</p>
                  <h2 className="gov-section-intro">The workspace is intentionally quiet until the first upload starts the cycle.</h2>
                  <p className="gov-body mt-3 max-w-3xl">
                    Bring in one CSV from the current review period. Clarion will validate the file, generate the first report,
                    and open the issue, action, and governance brief workflow from there.
                  </p>

                  <div className="mt-5 rounded-[10px] border border-[#E5E7EB] bg-[#FAFBFC]">
                    <div className="border-b border-[#E5E7EB] px-5 py-4">
                      <p className="gov-type-eyebrow">What happens next</p>
                      <p className="gov-body mt-1">The first upload creates the structure the rest of the workspace depends on.</p>
                    </div>
                    <div className="divide-y divide-[#E5E7EB]">
                      <div className="flex gap-4 px-5 py-4">
                        <div className="gov-type-eyebrow shrink-0">01</div>
                        <div>
                          <h3 className="gov-type-h3">Upload feedback</h3>
                          <p className="gov-body mt-1">Use one CSV from the current review period to establish the first live cycle.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 px-5 py-4">
                        <div className="gov-type-eyebrow shrink-0">02</div>
                        <div>
                          <h3 className="gov-type-h3">Review the recurring client issues</h3>
                          <p className="gov-body mt-1">Clarion groups the feedback into patterns leadership can review in one pass.</p>
                        </div>
                      </div>
                      <div className="flex gap-4 px-5 py-4">
                        <div className="gov-type-eyebrow shrink-0">03</div>
                        <div>
                          <h3 className="gov-type-h3">Assign follow-through and open the Governance Brief</h3>
                          <p className="gov-body mt-1">Turn the highest-priority issues into owned actions and a leadership-ready Governance Brief.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <Link to="/upload?start=true" className="gov-btn-primary px-4 py-2 text-sm font-semibold inline-flex items-center gap-1.5">
                      Upload feedback CSV
                    </Link>
                    <Link to="/demo" className="gov-type-meta underline underline-offset-4 transition-colors hover:text-[#0D1B2A]">
                      Review sample workspace
                    </Link>
                  </div>
                </div>

                <aside className="space-y-4">
                  <div className="rounded-[10px] border border-[#E5E7EB] bg-[#FAFBFC] p-4">
                    <p className="gov-type-eyebrow mb-2">What you need</p>
                    <p className="gov-body">
                      One CSV export from the current review period. Clarion checks structure first, then runs full upload validation.
                    </p>
                  </div>
                  <div className="rounded-[10px] border border-[#E5E7EB] bg-[#FAFBFC] p-4">
                    <p className="gov-type-eyebrow mb-2">What Clarion creates</p>
                    <p className="gov-body">
                      The first upload creates the Governance Brief, action list, and issues the rest of the workspace is built around.
                    </p>
                  </div>
                  <div className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
                    <p className="gov-type-eyebrow mb-2">Sample workspace</p>
                    <p className="gov-body">
                      The sample workspace uses law-firm example data. Your live workspace remains unchanged until you upload your own feedback CSV.
                    </p>
                  </div>
                </aside>
              </div>
            </section>
          </>
        ) : null}

        {/* Anchored-to strip: suppressed from primary view — data is surfaced in the brief card itself */}

        {loadError ? (
          <div className="mb-8">
            <DashboardCard title="Workspace status" subtitle="Connection">
              <p className="gov-body text-red-700">{loadError}</p>
            </DashboardCard>
          </div>
        ) : null}

        {!isFirstRunWorkspace ? (
        <section className="dash-tier">
          {/* ── Current Governance Brief — dominant hero card ── */}
          {(() => {
            // Map backend status to canonical chip labels
            const briefStatus = latestProcessedReport?.status;
            const chipLabel = briefStatus === "sent" ? "Sent"
              : briefStatus === "acknowledged" ? "Acknowledged"
              : briefStatus === "ready" || briefStatus === "escalation" ? "Ready to Send"
              : "Draft";
            const chipVariant: "success" | "muted" | "info" | "warn" =
              briefStatus === "acknowledged" ? "success"
              : briefStatus === "sent" ? "info"
              : briefStatus === "ready" ? "success"
              : briefStatus === "escalation" ? "warn"
              : "muted";
            return (
              <div className="animate-fade-up rounded-[14px] border border-[#CDD9E7] bg-gradient-to-b from-white via-[#F8FBFE] to-[#F2F7FB] px-6 py-5 shadow-[0_4px_16px_rgba(13,27,42,0.08)]">
                <div className="mb-3 flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="gov-type-eyebrow mb-1.5">Governance Brief</p>
                    <h2 className="text-[26px] font-semibold tracking-[-0.02em] text-[#0D1B2A]">
                      {latestProcessedReport ? reviewPeriodLabel : "No brief ready yet"}
                    </h2>
                    {latestProcessedReport ? (
                      <div className="mt-2 flex items-center gap-2.5">
                        <span className="text-[12px] text-[#6B7280]">{reviewsAnalyzed} reviews analyzed</span>
                        <span
                          className={[
                            "inline-flex items-center rounded-[5px] border px-2 py-0.5 text-[11px] font-semibold",
                            chipVariant === "success"
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : chipVariant === "info"
                                ? "border-blue-200 bg-blue-50 text-blue-700"
                                : chipVariant === "warn"
                                  ? "border-amber-200 bg-amber-50 text-amber-700"
                                  : "border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B]",
                          ].join(" ")}
                        >
                          {chipLabel}
                        </span>
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {latestProcessedReport ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={() => navigate(`/dashboard/reports/${latestProcessedReport.id}`)}
                      >
                        Open Governance Brief
                        <ChevronRight size={14} />
                      </Button>
                    ) : null}
                    {latestProcessedReport ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => navigate(`/dashboard/reports/${latestProcessedReport.id}?present=1`)}
                        disabled={readyReportCount === 0}
                        title={readyReportCount === 0 ? "Available after the first completed cycle" : undefined}
                      >
                        Open Meeting View
                      </Button>
                    ) : null}
                    {latestReadyBrief ? (
                      <Button type="button" variant="secondary" onClick={() => void handleExportBrief()}>
                        {loading ? (
                          <><Loader2 size={14} className="animate-spin" /> Loading</>
                        ) : planUsage.pdfWatermark ? "Preview PDF" : "Download PDF"}
                      </Button>
                    ) : latestProcessedReport ? null : (
                      <Button type="button" variant="primary" onClick={() => navigate("/upload")}>
                        Start New Review
                        <ChevronRight size={14} />
                      </Button>
                    )}
                  </div>
                </div>

              </div>
            );
          })()}

          {/* ── Needs Attention ── */}
          {(overdueActions.length > 0 || unownedActionsCount > 0 || highSeveritySignalsCount > 0 || exposure?.partner_escalation_required) ? (
            <div className="animate-fade-up-delay-1 animate-fade-up rounded-[10px] border border-amber-200 bg-amber-50 px-5 py-3.5">
              <div className="mb-2.5 flex items-center gap-1.5">
                <AlertTriangle size={11} className="text-amber-600" aria-hidden />
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-amber-700">Needs attention</p>
              </div>
              <ul className="divide-y divide-amber-100">
                {overdueActions.length > 0 && (
                  <li className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0">
                    <span className="text-[13px] text-[#334155]">
                      <span className="font-semibold text-[#DC2626]">{overdueActions.length} overdue</span>{" "}
                      {overdueActions.length === 1 ? "action" : "actions"}
                    </span>
                    <Link
                      to="/dashboard/actions?filter=overdue"
                      className="shrink-0 inline-flex items-center rounded-[6px] border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0D1B2A] transition-colors hover:bg-amber-50"
                    >
                      Review →
                    </Link>
                  </li>
                )}
                {exposure?.partner_escalation_required ? (
                  <li className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0">
                    <span className="text-[13px] text-[#334155]">
                      <span className="font-semibold text-[#DC2626]">Partner escalation</span> required
                    </span>
                    {latestProcessedReport ? (
                      <Link
                        to={`/dashboard/reports/${latestProcessedReport.id}`}
                        className="shrink-0 inline-flex items-center rounded-[6px] border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0D1B2A] transition-colors hover:bg-amber-50"
                      >
                        Open brief →
                      </Link>
                    ) : null}
                  </li>
                ) : null}
                {highSeveritySignalsCount > 0 && (
                  <li className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0">
                    <span className="text-[13px] text-[#334155]">
                      <span className="font-semibold text-amber-700">{highSeveritySignalsCount} high-severity</span>{" "}
                      {highSeveritySignalsCount === 1 ? "issue" : "issues"}
                    </span>
                    <Link
                      to="/dashboard/signals?filter=high"
                      className="shrink-0 inline-flex items-center rounded-[6px] border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0D1B2A] transition-colors hover:bg-amber-50"
                    >
                      View →
                    </Link>
                  </li>
                )}
                {unownedActionsCount > 0 && (
                  <li className="flex items-center justify-between gap-4 py-2 first:pt-0 last:pb-0">
                    <span className="text-[13px] text-[#334155]">
                      <span className="font-semibold text-amber-700">{unownedActionsCount}</span>{" "}
                      {unownedActionsCount === 1 ? "action needs" : "actions need"} an owner
                    </span>
                    <Link
                      to="/dashboard/actions"
                      className="shrink-0 inline-flex items-center rounded-[6px] border border-amber-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0D1B2A] transition-colors hover:bg-amber-50"
                    >
                      Assign →
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          ) : null}

          {/* ── Governance Loop ── */}
          {(() => {
            const briefId = latestProcessedReport?.id;
            const hasReport = Boolean(latestProcessedReport);
            const reportReady = latestProcessedReport?.status === "ready";
            // Priority: urgent overdue first → then check if brief needs first review → normal operating state
            const activeStep =
              !hasReport || !reportReady ? 0
              : overdueActions.length > 0 ? 3
              : openActions.length === 0 ? 1
              : 2;
            type LoopStep = { label: string; stat: string; to: string };
            const steps: LoopStep[] = [
              {
                label: "New Review",
                stat: readyReportCount > 0 ? `${readyReportCount} complete` : "Upload CSV",
                to: "/upload",
              },
              {
                label: "Governance Brief",
                stat: hasReport ? reviewPeriodLabel : "Awaiting review",
                to: briefId ? `/dashboard/reports/${briefId}` : "/dashboard/reports",
              },
              {
                label: "Meeting View",
                stat: reportReady ? "Ready" : "Pending brief",
                to: briefId ? `/dashboard/reports/${briefId}?present=1` : "/dashboard/reports",
              },
              {
                label: "Follow-Through",
                stat: openActions.length > 0 ? `${openActions.length} open` : "All clear",
                to: "/dashboard/actions",
              },
            ];
            return (
              <div className="animate-fade-up-delay-2 animate-fade-up rounded-[10px] border border-[#DDE3EC] bg-[#F8FAFC] px-5 py-4" style={{ borderLeft: "3px solid #0D1B2A" }}>
                <p className="gov-type-eyebrow mb-3">Governance Loop</p>
                <div className="flex items-start gap-1">
                  {steps.map((step, index) => (
                    <div key={step.label} className="flex items-center gap-1">
                      <Link
                        to={step.to}
                        className={[
                          "flex flex-col rounded-[8px] px-3.5 py-2.5 transition-all duration-150",
                          index === activeStep
                            ? "bg-[#0D1B2A] text-white shadow-[0_2px_10px_rgba(13,27,42,0.22)]"
                            : "bg-white border border-[#E2E8F0] text-[#0D1B2A] hover:border-[rgba(13,27,42,0.25)] hover:bg-[#EEF2F7]",
                        ].join(" ")}
                      >
                        <span className={["mb-1 text-[9px] font-bold tracking-[0.14em]", index === activeStep ? "text-[#94A3B8]" : "text-[#B0BAC6]"].join(" ")}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={["text-[12px] font-semibold leading-tight", index === activeStep ? "text-white" : "text-[#0D1B2A]"].join(" ")}>
                          {step.label}
                        </span>
                        <span className={["mt-0.5 text-[11px] leading-tight", index === activeStep ? "text-[#94A3B8]" : "text-[#6B7280]"].join(" ")}>
                          {step.stat}
                        </span>
                      </Link>
                      {index < steps.length - 1 && (
                        <span className="shrink-0 px-0.5 text-[12px] text-[#D1D9E0]" aria-hidden>→</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {showBaselineNotice ? (
            <div className="flex items-center justify-between gap-3 px-1">
              <p className="text-[11px] text-[#9CA3AF]">
                First cycle — trend comparison available after next upload.
              </p>
              <button
                type="button"
                onClick={dismissBaselineNotice}
                aria-label="Dismiss"
                className="text-[11px] text-[#9CA3AF] transition-colors hover:text-[#6B7280]"
              >
                ×
              </button>
            </div>
          ) : null}

          {historyTruncated && historyNotice ? (
            <p className="px-1 text-[11px] text-[#9CA3AF]">{historyNotice}</p>
          ) : null}
        </section>
        ) : null}
      </div>
    </section>
  );
};

export default Dashboard;
