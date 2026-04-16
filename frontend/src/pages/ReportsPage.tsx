import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, BookOpen } from "lucide-react";
import { toast } from "sonner";

import { getLatestExposure, getReports, type ReportListItem } from "@/api/authService";
import PageWrapper from "@/components/governance/PageWrapper";
import GovernanceBriefCard from "@/components/governance/GovernanceBriefCard";
import GovernanceEmptyState from "@/components/governance/GovernanceEmptyState";
import { BriefCardSkeleton } from "@/components/governance/skeletons";
import { PageTabs } from "@/components/governance/PageTabs";
import { useAuth } from "@/contexts/AuthContext";
import { formatApiDate } from "@/lib/dateTime";
import { resolvePlanLimits } from "@/config/planLimits";
import { defaultSampleBriefPath } from "@/data/sampleFirmData";

type BriefRow = {
  id: number;
  title: string;
  /** Period label for the meeting this brief covers (e.g. "March 2025") */
  meetingDate: string;
  /** Formatted full date for the generated/created date */
  dateLabel: string;
  /** One-liner packet summary shown inside the card */
  description: string;
  generatedBy: string;
  pdfUrl: string;
  planType: string;
  escalationRequired: boolean;
  signalsCount?: number;
  actionsCount?: number;
};

const ReportsPage = () => {
  const navigate = useNavigate();
  const { currentPlan } = useAuth();
  const maxReportsPerMonth = resolvePlanLimits(currentPlan).maxReportsPerMonth;
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [historyNotice, setHistoryNotice] = useState<string | null>(null);
  const [historyTruncated, setHistoryTruncated] = useState(false);
  const [escalationReportId, setEscalationReportId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleDownload = async (row: BriefRow) => {
    try {
      const response = await fetch(row.pdfUrl, { credentials: "include" });
      const contentType = response.headers.get("content-type") || "";
      if (contentType.includes("application/json")) {
        const payload = (await response.json()) as { error?: string; message?: string };
        if (payload.error === "Report outside plan history window") {
          toast.error(
            "This report is outside your plan’s governance history window. Upgrade your plan to access older reports.",
          );
          return;
        }
        if (!response.ok) {
          toast.error(payload.message || payload.error || "Unable to open governance brief.");
          return;
        }
      }
      if (!response.ok) {
        toast.error("Unable to open governance brief.");
        return;
      }
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, "_blank", "noopener,noreferrer");
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
    } catch {
      toast.error("Unable to open governance brief.");
    }
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const [result, exposureResult] = await Promise.all([getReports(120), getLatestExposure()]);
      if (!mounted) return;

      if (!result.success || !result.reports) {
        setReports([]);
        setHistoryNotice(null);
        setHistoryTruncated(false);
        setEscalationReportId(null);
        setError(result.error || "Unable to load governance brief history.");
        setLoading(false);
        return;
      }

      const ready = result.reports
        .filter((report) => report.status === "ready")
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      setReports(ready);
      setHistoryNotice(result.history_notice || null);
      setHistoryTruncated(Boolean(result.history_truncated));
      if (exposureResult.success && exposureResult.exposure?.partner_escalation_required && exposureResult.exposure.report_id) {
        setEscalationReportId(exposureResult.exposure.report_id);
      } else {
        setEscalationReportId(null);
      }
      setError("");
      setLoading(false);
    };
    void load();
    return () => {
      mounted = false;
    };
  }, []);

  const rows = useMemo<BriefRow[]>(() => {
    return reports.map((report) => {
      const monthYear = formatApiDate(report.created_at, { month: "long", year: "numeric" }, "Unknown date");
      const reportWithCounts = report as ReportListItem & {
        signals_count?: number;
        signal_count?: number;
        governance_signals_count?: number;
        actions_count?: number;
        governance_actions_count?: number;
      };
      const signalsCountCandidate =
        reportWithCounts.signals_count ??
        reportWithCounts.signal_count ??
        reportWithCounts.governance_signals_count;
      const actionsCountCandidate =
        reportWithCounts.actions_count ??
        reportWithCounts.governance_actions_count;

      const signalsFinal = Number.isFinite(signalsCountCandidate) ? Number(signalsCountCandidate) : undefined;
      const actionsFinal = Number.isFinite(actionsCountCandidate) ? Number(actionsCountCandidate) : undefined;
      const isEscalation = escalationReportId === report.id;

      // Build a readable packet description from available counts + status
      const descParts: string[] = [];
      if (typeof signalsFinal === "number") {
        descParts.push(`${signalsFinal} client ${signalsFinal === 1 ? "issue" : "issues"} reviewed`);
      }
      if (typeof actionsFinal === "number") {
        descParts.push(`${actionsFinal} ${actionsFinal === 1 ? "action" : "actions"} tracked`);
      }
      if (isEscalation) descParts.push("partner escalation flagged");

      return {
        id: report.id,
        title: `${monthYear} Governance Brief`,
        meetingDate: monthYear,
        dateLabel: formatApiDate(report.created_at, { month: "long", day: "numeric", year: "numeric" }, "Unknown date"),
        description: descParts.join(" · "),
        generatedBy: "System",
        pdfUrl: report.download_pdf_url,
        planType: report.plan_type,
        escalationRequired: isEscalation,
        signalsCount: signalsFinal,
        actionsCount: actionsFinal,
      };
    });
  }, [escalationReportId, reports]);

  const summary = useMemo(() => {
    const totalBriefs = rows.length;
    const escalationCount = rows.filter((row) => row.escalationRequired).length;
    const latestDate = rows[0]?.dateLabel || "Not available";
    const now = new Date();
    const reportsThisMonth = reports.filter((report) => {
      const parsed = new Date(report.created_at || "");
      return (
        Number.isFinite(parsed.getTime()) &&
        parsed.getFullYear() === now.getFullYear() &&
        parsed.getMonth() === now.getMonth()
      );
    }).length;
    return { totalBriefs, escalationCount, latestDate, reportsThisMonth };
  }, [reports, rows]);

  const latestRow = rows[0] || null;
  const archivedRows = rows.slice(1);

  // ── Workflow tab: "upcoming" | "past" ─────────────────────────────────────
  // "Upcoming Meetings" → latest brief (the one being prepared for the next session)
  // "Past Briefs"       → prior cycles (reference / comparison)
  const [briefsTab, setBriefsTab] = useState<"upcoming" | "past">("upcoming");

  return (
      <PageWrapper
        eyebrow="Governance Brief Library"
        title="Governance Briefs"
        description="The firm's complete governance brief record. Each cycle produces a partner-ready artifact covering client signals reviewed, actions assigned, and decisions required."
        contentClassName="stage-sequence"
      >
        {/* Dark header slab — matches Home's governance brief card tone */}
        <section className="overflow-hidden rounded-[16px] border border-white/[0.13] shadow-[0_16px_48px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.04)]">
          <div
            className="relative px-7 py-6"
            style={{ background: "linear-gradient(150deg, #0B1929 0%, #0e2139 55%, #0D1B2A 100%)" }}
          >
            {/* Radial glow */}
            <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#1a3a6b] opacity-35 blur-3xl" aria-hidden />
            {/* Dot-grid texture */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{ backgroundImage: "radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px)", backgroundSize: "20px 20px" }}
              aria-hidden
            />
            <div className="relative flex flex-wrap items-start justify-between gap-5">
              <div>
                <span className="inline-flex items-center gap-2">
                  <span className="h-[12px] w-[2px] rounded-full bg-[#C4A96A]/50" aria-hidden />
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#4D7FA8]">Brief Library</span>
                </span>
                <h2
                  className="mt-3 text-[28px] leading-[1.05] text-white sm:text-[32px]"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
                >
                  {loading ? "Loading…" : summary.totalBriefs === 0 ? "No briefs yet" : `${summary.totalBriefs} governance ${summary.totalBriefs === 1 ? "brief" : "briefs"}`}
                </h2>
                <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#8FA7BC]">
                  Open the current brief before every partner meeting. Prior cycles are reference — they document what the firm reviewed, decided, and assigned.
                </p>
              </div>
              {latestRow ? (
                <div className="flex flex-wrap items-center gap-2 pt-0.5">
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/reports/${latestRow.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-[8px] bg-white px-4 py-2 text-[13px] font-semibold text-[#0D1B2A] shadow-[0_1px_3px_rgba(0,0,0,0.12)] transition-all hover:bg-[#EEF2F8] active:scale-[0.98]"
                  >
                    Open Current Brief
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/brief-customization?reportId=${latestRow.id}`)}
                    className="inline-flex items-center gap-1.5 rounded-[8px] border border-white/20 bg-white/[0.08] px-4 py-2 text-[13px] font-medium text-white/80 transition-all hover:border-white/30 hover:bg-white/[0.12] hover:text-white active:scale-[0.98]"
                  >
                    Prepare Meeting Brief
                  </button>
                </div>
              ) : null}
            </div>
          </div>
          {/* Instrument strip */}
          <div
            className="relative flex flex-wrap divide-x divide-white/[0.07]"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "#0D1B2A" }}
          >
            <div className="min-w-[88px] px-5 py-3.5">
              <p className="text-[22px] font-semibold leading-none text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
                {loading ? "—" : summary.totalBriefs}
              </p>
              <p className="mt-1.5 text-[10.5px] font-medium tracking-[0.04em] text-[#3D627F]">Total briefs</p>
            </div>
            <div className="min-w-[88px] px-5 py-3.5">
              <p
                className="text-[22px] font-semibold leading-none"
                style={{ fontVariantNumeric: "tabular-nums", color: summary.escalationCount > 0 ? "#F59E0B" : "#ffffff" }}
              >
                {loading ? "—" : summary.escalationCount}
              </p>
              <p className="mt-1.5 text-[10.5px] font-medium tracking-[0.04em] text-[#3D627F]">Escalations</p>
            </div>
            <div className="px-5 py-3.5">
              <p className="text-[14px] font-semibold leading-snug text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
                {loading ? "—" : summary.latestDate}
              </p>
              <p className="mt-1.5 text-[10.5px] font-medium tracking-[0.04em] text-[#3D627F]">Latest brief</p>
            </div>
          </div>
        </section>

        {historyTruncated && historyNotice ? (
          <section className="rounded-[10px] border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm text-[#1E3A8A]">
            {historyNotice}
          </section>
        ) : null}

        {error ? (
          <div className="rounded-xl border border-destructive/35 bg-destructive/10 p-6 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {loading ? (
          <section aria-label="Loading governance briefs" className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <BriefCardSkeleton key={`brief-skeleton-${index}`} />
            ))}
          </section>
        ) : rows.length === 0 ? (
          <section className="rounded-[12px] border border-[#E5E2DC] bg-white px-8 py-10 text-center shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-[10px] border border-[#DDD8D0] bg-[#F8F6F2] text-slate-500">
              <FileText size={18} />
            </div>
            <h2 className="mt-4 text-[17px] font-semibold text-[#0D1B2A]">No governance brief yet</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-slate-500">
              The first cycle starts with a CSV upload. Review the resulting client issues, assign follow-through, and the governance brief will appear here once that cycle is ready.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                className="inline-flex items-center rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#16263b]"
                onClick={() => navigate("/upload")}
              >
                Upload feedback CSV
              </button>
              <button
                type="button"
                className="inline-flex items-center rounded-[8px] border border-[#D1D5DB] bg-white px-4 py-2 text-[13px] font-medium text-[#0D1B2A] transition-colors hover:bg-slate-50"
                onClick={() => navigate("/dashboard")}
              >
                Return to overview
              </button>
            </div>
            <div className="mt-4">
              <Link to={defaultSampleBriefPath} className="text-[13px] text-slate-400 underline underline-offset-4 transition-colors hover:text-slate-600">
                Review sample brief
              </Link>
            </div>
          </section>
        ) : (
          <div className="space-y-5">
            {/* ── Workflow tabs ─────────────────────────────────────── */}
            <PageTabs
              value={briefsTab}
              onValueChange={(v) => setBriefsTab(v as typeof briefsTab)}
              tabs={[
                {
                  value: "upcoming",
                  label: "Current Brief",
                  badgeCount: latestRow?.escalationRequired ? 1 : undefined,
                  badgeUrgent: latestRow?.escalationRequired,
                },
                {
                  value: "past",
                  label: "Past Briefs",
                  badgeCount: archivedRows.length > 0 ? archivedRows.length : undefined,
                },
              ]}
            />

            {briefsTab === "upcoming" ? (
              latestRow ? (
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    {latestRow.escalationRequired ? (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                        <p className="gov-type-eyebrow text-amber-700">Next meeting · escalation required</p>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                        <p className="gov-type-eyebrow">Active governance brief</p>
                      </span>
                    )}
                  </div>
                  <GovernanceBriefCard
                    title={latestRow.title}
                    meetingDate={latestRow.meetingDate}
                    dateLabel={latestRow.dateLabel}
                    description={latestRow.description || undefined}
                    status={latestRow.escalationRequired ? "escalation" : "ready"}
                    signalsCount={latestRow.signalsCount}
                    actionsCount={latestRow.actionsCount}
                    generatedBy={latestRow.generatedBy}
                    planType={latestRow.planType}
                    isPast={false}
                    onView={() => navigate(`/dashboard/reports/${latestRow.id}`)}
                    onPrepare={() => navigate(`/dashboard/brief-customization?reportId=${latestRow.id}`)}
                    onDownload={() => void handleDownload(latestRow)}
                  />
                </div>
              ) : (
                <section className="rounded-xl border border-[#E3E8EF] bg-white shadow-sm">
                  <GovernanceEmptyState
                    size="md"
                    icon={<FileText size={20} />}
                    title="No Governance Brief ready yet"
                    description="Start a new review to generate your first Governance Brief. Once a review cycle is processed, the brief will appear here ready to prepare and send."
                    primaryAction={{ label: "Start a new review", href: "/upload" }}
                    secondaryAction={{ label: "Review client issues", href: "/dashboard/signals" }}
                  />
                </section>
              )
            ) : (
              archivedRows.length > 0 ? (
                <div>
                  <p className="mb-3 gov-type-eyebrow">
                    Prior meeting cycles — reference only
                  </p>
                  <div className="space-y-3">
                    {archivedRows.map((row) => (
                      <GovernanceBriefCard
                        key={row.id}
                        title={row.title}
                        meetingDate={row.meetingDate}
                        dateLabel={row.dateLabel}
                        description={row.description || undefined}
                        status={row.escalationRequired ? "escalation" : "ready"}
                        signalsCount={row.signalsCount}
                        actionsCount={row.actionsCount}
                        planType={row.planType}
                        isPast={true}
                        onView={() => navigate(`/dashboard/reports/${row.id}`)}
                        onDownload={() => void handleDownload(row)}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <section className="rounded-xl border border-[#E3E8EF] bg-white shadow-sm">
                  <GovernanceEmptyState
                    size="md"
                    icon={<BookOpen size={20} />}
                    title="No past Governance Briefs yet"
                    description="Completed brief cycles will appear here as a reference archive. Use them to track how client issues change across review periods."
                    primaryAction={{ label: "View current brief", onClick: () => setBriefsTab("upcoming") }}
                  />
                </section>
              )
            )}
          </div>
        )}
      </PageWrapper>
  );
};

export default ReportsPage;
