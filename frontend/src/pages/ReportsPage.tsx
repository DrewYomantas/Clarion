import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";
import { toast } from "sonner";

import { getLatestExposure, getReports, type ReportListItem } from "@/api/authService";
import PageWrapper from "@/components/governance/PageWrapper";
import GovernanceBriefCard from "@/components/governance/GovernanceBriefCard";
import GovernanceEmptyState from "@/components/governance/GovernanceEmptyState";
import { BriefCardSkeleton } from "@/components/governance/skeletons";
import { formatApiDate } from "@/lib/dateTime";

type BriefRow = {
  id: number;
  title: string;
  meetingDate: string;
  dateLabel: string;
  description: string;
  pdfUrl: string;
  planType: string;
  escalationRequired: boolean;
};

const ReportsPage = () => {
  const navigate = useNavigate();
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
            "This report is outside your plan's governance history window. Upgrade your plan to access older reports.",
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
      const isEscalation = escalationReportId === report.id;

      return {
        id: report.id,
        title: `${monthYear} Governance Brief`,
        meetingDate: monthYear,
        dateLabel: formatApiDate(report.created_at, { month: "long", day: "numeric", year: "numeric" }, "Unknown date"),
        description: isEscalation ? "Decision required before the next meeting." : "Brief prepared for current-cycle review.",
        pdfUrl: report.download_pdf_url,
        planType: report.plan_type,
        escalationRequired: isEscalation,
      };
    });
  }, [escalationReportId, reports]);

  const latestRow = rows[0] || null;
  const archivedRows = rows.slice(1);

  return (
    <PageWrapper
      eyebrow="Reference"
      title="Brief Archive"
      description="Use this for Governance Brief history and reference. The active brief starts from Home."
      contentClassName="stage-sequence"
    >
      {loading ? (
        <section aria-label="Loading governance brief archive" className="space-y-4">
          <BriefCardSkeleton />
        </section>
      ) : (
        <section className="rounded-[10px] border border-[#D7DEE8] bg-white/75 px-5 py-4 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="gov-type-eyebrow">Active cycle</p>
              <h2 className="mt-2 text-[17px] font-semibold text-[#0D1B2A]">Current brief starts from Home</h2>
              <p className="mt-1 max-w-2xl text-[13px] leading-6 text-[#455A6E]">
                {latestRow
                  ? `${latestRow.title} remains the active cycle. Use Home to open the meeting view, review state, and move follow-through.`
                  : "No active Governance Brief is ready yet. Start a new review from Home when the next cycle begins."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#16263b]"
                onClick={() => navigate("/dashboard")}
              >
                Return Home
              </button>
              {latestRow ? (
                <button
                  type="button"
                  className="inline-flex items-center justify-center rounded-[8px] border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-[#0D1B2A] transition-colors hover:bg-[#F5F7FA]"
                  onClick={() => navigate(`/dashboard/reports/${latestRow.id}`)}
                >
                  Open active brief
                </button>
              ) : null}
            </div>
          </div>
        </section>
      )}

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

      {!loading ? (
        <section className="rounded-[10px] border border-[#D7DEE8] bg-white/70 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E5E0D8] px-5 py-4">
            <div>
              <p className="gov-type-eyebrow">Past briefs</p>
              <p className="mt-1 text-[14px] leading-6 text-[#455A6E]">
                Completed Governance Briefs stay here for reference after a newer cycle becomes active.
              </p>
            </div>
            <strong className="inline-flex min-w-7 justify-center rounded-full border border-[#C4A96A]/35 px-2 py-0.5 text-[12px] font-semibold text-[#9A742F]">
              {archivedRows.length}
            </strong>
          </div>

          {archivedRows.length > 0 ? (
            <div className="space-y-3 p-4">
              {archivedRows.map((row) => (
                <GovernanceBriefCard
                  key={row.id}
                  title={row.title}
                  meetingDate={row.meetingDate}
                  dateLabel={row.dateLabel}
                  description={row.description || undefined}
                  status={row.escalationRequired ? "escalation" : "ready"}
                  planType={row.planType}
                  isPast={true}
                  onView={() => navigate(`/dashboard/reports/${row.id}`)}
                  onDownload={() => void handleDownload(row)}
                />
              ))}
            </div>
          ) : (
            <div className="px-5 py-5">
              <GovernanceEmptyState
                size="sm"
                icon={<FileText size={18} />}
                title="No past briefs yet"
                description="This workspace has one active cycle. Past briefs will appear here after another Governance Brief is generated."
                secondaryAction={{ label: "Return Home", href: "/dashboard" }}
                className="rounded-[8px] border border-[#DDD8D0] bg-[#F9F8F6]"
              />
            </div>
          )}
        </section>
      ) : null}
    </PageWrapper>
  );
};

export default ReportsPage;
