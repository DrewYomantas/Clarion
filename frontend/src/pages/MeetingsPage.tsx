import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { getReports, type ReportListItem } from "@/api/authService";
import PageWrapper from "@/components/governance/PageWrapper";
import GovernanceEmptyState from "@/components/governance/GovernanceEmptyState";
import GovStatusChip from "@/components/governance/GovStatusChip";
import { formatApiDate } from "@/lib/dateTime";

type MeetingRow = {
  id: number;
  name: string;
  period: string;
  created: string;
};

const MeetingsPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const result = await getReports(120);
      if (!mounted) return;
      if (!result.success || !result.reports) {
        setError(result.error || "Unable to load meetings.");
        setLoading(false);
        return;
      }
      const ready = result.reports
        .filter((r) => r.status === "ready")
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setReports(ready);
      setLoading(false);
    };
    void load();
    return () => { mounted = false; };
  }, []);

  const rows = useMemo<MeetingRow[]>(() => {
    return reports.map((report) => ({
      id: report.id,
      name: report.name || formatApiDate(report.created_at, { month: "long", year: "numeric" }, "Unknown period"),
      period: report.review_date_label || formatApiDate(report.created_at, { month: "long", year: "numeric" }, "Unknown period"),
      created: formatApiDate(report.created_at, { month: "long", day: "numeric", year: "numeric" }, "Unknown date"),
    }));
  }, [reports]);

  return (
    <PageWrapper
      eyebrow="Review Meetings"
      title="Meetings"
      description="Chronological record of governance review meetings. Each entry links to the associated Governance Brief prepared for that session."
      contentClassName="stage-sequence"
    >
      {error ? (
        <div className="rounded-xl border border-destructive/35 bg-destructive/10 p-6 text-sm text-destructive">{error}</div>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-[10px] bg-slate-100" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <section className="rounded-xl border border-[#E3E8EF] bg-white shadow-sm">
          <GovernanceEmptyState
            size="lg"
            icon={<Calendar size={20} />}
            title="No meetings on record yet"
            description="Governance review meetings appear here once the first brief is ready. Upload feedback and generate a brief to start the meeting record."
            primaryAction={{ label: "Upload feedback CSV", href: "/upload" }}
            secondaryAction={{ label: "Return to dashboard", href: "/dashboard" }}
          />
        </section>
      ) : (
        <div className="space-y-2">
          {rows.map((row) => (
            <div
              key={row.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-semibold text-[#0D1B2A]">{row.name}</p>
                  <GovStatusChip label="Ready to Send" variant="success" />
                </div>
                <p className="mt-0.5 text-[12px] text-[#6B7280]">
                  {row.period} · Generated {row.created}
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`/dashboard/reports/${row.id}`)}
                className="inline-flex items-center rounded-[6px] bg-[#0D1B2A] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#16263b]"
              >
                Open Governance Brief
              </button>
            </div>
          ))}
        </div>
      )}
    </PageWrapper>
  );
};

export default MeetingsPage;
