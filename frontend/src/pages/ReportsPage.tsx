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
        description: isEscalation ? "Decision required before the next partner meeting." : "Brief prepared for partner review.",
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
      eyebrow="Governance Brief"
      title="Governance Briefs"
      description="Open the current Governance Brief and confirm follow-through before the next decision."
      contentClassName="stage-sequence"
    >
      <section className="space-y-3">
        {loading ? (
          <section aria-label="Loading governance briefs" className="space-y-4">
            <BriefCardSkeleton />
          </section>
        ) : latestRow ? (
          <GovernanceBriefCard
            title={latestRow.title}
            meetingDate={latestRow.meetingDate}
            dateLabel={latestRow.dateLabel}
            description={latestRow.description || undefined}
            status={latestRow.escalationRequired ? "escalation" : "ready"}
            planType={latestRow.planType}
            isPast={false}
            onView={() => navigate(`/dashboard/reports/${latestRow.id}`)}
            onPrepare={() => navigate(`/dashboard/reports/${latestRow.id}?present=1`)}
            onDownload={() => void handleDownload(latestRow)}
          />
        ) : (
          <section className="rounded-xl border border-[#E3E8EF] bg-white shadow-sm">
            <GovernanceEmptyState
              size="md"
              icon={<FileText size={20} />}
              title="No Governance Brief ready yet"
              description="Start a new review to generate your first Governance Brief. Once a review cycle is processed, the brief will appear here for review."
              primaryAction={{ label: "Start a new review", href: "/upload" }}
              secondaryAction={{ label: "Review client issues", href: "/dashboard/signals" }}
            />
          </section>
        )}
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

      {archivedRows.length > 0 ? (
        <details className="reports-archive">
          <summary>
            <span>
              <span className="gov-type-eyebrow">Archive</span>
              <span className="reports-archive-summary">Past briefs stay available for reference.</span>
            </span>
            <strong>{archivedRows.length}</strong>
          </summary>
          <div className="reports-archive-list">
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
        </details>
      ) : null}
    </PageWrapper>
  );
};

export default ReportsPage;
