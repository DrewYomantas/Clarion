import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, ChevronRight, ArrowUpRight } from "lucide-react";
import { getReports, type ReportListItem } from "@/api/authService";
import PageWrapper from "@/components/governance/PageWrapper";
import { formatApiDate } from "@/lib/dateTime";

type MeetingRow = {
  id: number;
  name: string;
  period: string;
  created: string;
  totalReviews: number;
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
      totalReviews: report.total_reviews ?? 0,
    }));
  }, [reports]);

  const latestRow = rows[0] ?? null;
  const priorRows = rows.slice(1);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <PageWrapper eyebrow="Review Meetings" title="Meetings">
        <div className="grid grid-cols-[1fr_280px] gap-5 items-start">
          <div className="h-[200px] animate-pulse rounded-[12px] bg-[#E5E7EB]" />
          <div className="space-y-3">
            <div className="h-[88px] animate-pulse rounded-[10px] bg-[#E5E7EB]" />
            <div className="h-[88px] animate-pulse rounded-[10px] bg-[#E5E7EB]" />
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ── Error ── */
  if (error) {
    return (
      <PageWrapper eyebrow="Review Meetings" title="Meetings">
        <div className="rounded-[10px] border border-[#EF4444]/20 bg-[#FEF2F2] px-5 py-4 text-[13px] text-[#991B1B]">{error}</div>
      </PageWrapper>
    );
  }

  /* ── Empty state (no sessions at all) ── */
  if (rows.length === 0) {
    return (
      <PageWrapper eyebrow="Review Meetings" title="Meetings">
        <div className="grid grid-cols-[1fr_280px] gap-5 items-start">
          {/* Left: empty message */}
          <div className="rounded-[12px] border border-[#DDD8D0] bg-white px-7 py-10 flex flex-col items-start">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#DDD8D0] bg-[#F8F6F2] text-[#9CA3AF] mb-4">
              <Calendar size={18} />
            </div>
            <p className="text-[15px] font-semibold text-[#0D1B2A]">No meetings on record yet</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-[#6B7280] max-w-sm">
              Governance review meetings appear here once the first brief is ready.
            </p>
            <a
              href="/upload"
              className="mt-5 inline-flex items-center gap-1.5 rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b]"
            >
              Upload feedback CSV
            </a>
          </div>
          {/* Right: static meta */}
          <div className="rounded-[10px] border border-[#DDD8D0] bg-[#FAFAF9] divide-y divide-[#E5E2DC]">
            <div className="px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Total sessions</p>
              <p className="mt-1 text-[22px] font-bold text-[#0D1B2A] leading-none">0</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Most recent</p>
              <p className="mt-1 text-[13px] font-semibold text-[#9CA3AF]">None yet</p>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  /* ── Sessions exist ── */
  return (
    <PageWrapper eyebrow="Review Meetings" title="Meetings">
      <div className="grid grid-cols-[1fr_280px] gap-5 items-start">

        {/* ════ LEFT: main column ════ */}
        <div className="space-y-2">

          {/* Active/latest session — hero card */}
          {latestRow && (
            <div
              className="rounded-[12px] border border-[#DDD8D0] bg-white overflow-hidden shadow-[0_1px_4px_rgba(13,27,42,0.07)]"
              style={{ borderLeftWidth: "3px", borderLeftColor: "#C4A96A" }}
            >
              <div className="px-5 pt-4 pb-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#10B981]">Active brief</p>
                </div>
                <p className="text-[16px] font-semibold text-[#0D1B2A] leading-snug">{latestRow.name}</p>
                <p className="mt-0.5 text-[12px] text-[#6B7280]">{latestRow.period} · Generated {latestRow.created}</p>
                {latestRow.totalReviews > 0 && (
                  <p className="mt-0.5 text-[12px] text-[#9CA3AF]">{latestRow.totalReviews.toLocaleString()} reviews processed</p>
                )}
              </div>
              <div className="px-5 py-3 border-t border-[#F0EDE9] flex items-center justify-between">
                <p className="text-[11.5px] text-[#9CA3AF]">Governance brief ready</p>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/reports/${latestRow.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b]"
                >
                  Open Governance Brief
                  <ArrowUpRight size={12} />
                </button>
              </div>
            </div>
          )}

          {/* Prior sessions list — only rendered when they exist */}
          {priorRows.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mt-1 mb-2">
                <div className="h-px flex-1 bg-[#E5E2DC]" />
                <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Prior sessions</p>
                <div className="h-px flex-1 bg-[#E5E2DC]" />
              </div>
              <div className="space-y-1.5">
                {priorRows.map((row) => (
                  <article
                    key={row.id}
                    className="flex items-center justify-between gap-3 rounded-[10px] border border-[#E5E2DC] bg-white px-4 py-3 shadow-[0_1px_2px_rgba(13,27,42,0.04)] transition-shadow hover:shadow-[0_2px_6px_rgba(13,27,42,0.08)]"
                    style={{ borderLeftWidth: "2px", borderLeftColor: "#CBD5E1" }}
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] bg-[#F5F3F0] text-[#9CA3AF]">
                        <FileText size={13} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-[#0D1B2A] truncate">{row.name}</p>
                        <p className="mt-0.5 text-[11.5px] text-[#6B7280]">
                          {row.period}
                          {row.totalReviews > 0 && <span className="ml-1.5 text-[#9CA3AF]">· {row.totalReviews} reviews</span>}
                          <span className="ml-1.5 text-[#9CA3AF]">· {row.created}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/reports/${row.id}`)}
                      className="shrink-0 inline-flex items-center gap-1 rounded-[6px] border border-[#DDD8D0] bg-[#F8F6F2] px-3 py-1.5 text-[11.5px] font-medium text-[#374151] transition-colors hover:bg-[#EDEBE7]"
                    >
                      Open brief <ChevronRight size={11} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ════ RIGHT: sidebar column ════ */}
        <div className="space-y-3">
          {/* Session meta */}
          <div className="rounded-[10px] border border-[#DDD8D0] bg-white divide-y divide-[#F0EDE9] shadow-[0_1px_3px_rgba(13,27,42,0.05)]">
            <div className="px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Total sessions</p>
              <p className="mt-1 text-[26px] font-bold text-[#0D1B2A] leading-none">{rows.length}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Most recent</p>
              <p className="mt-1 text-[13px] font-semibold text-[#0D1B2A]">{latestRow?.period || "—"}</p>
            </div>
            {latestRow && latestRow.totalReviews > 0 && (
              <div className="px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Reviews in latest</p>
                <p className="mt-1 text-[13px] font-semibold text-[#0D1B2A]">{latestRow.totalReviews.toLocaleString()}</p>
              </div>
            )}
          </div>

          {/* Next action */}
          <div className="rounded-[10px] border border-[#DDD8D0] bg-[#FAFAF9] px-4 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF] mb-2">Next cycle</p>
            <p className="text-[12px] leading-relaxed text-[#6B7280]">
              Ready for another review period? Upload a new feedback CSV to generate the next brief.
            </p>
            <a
              href="/upload"
              className="mt-3 inline-flex items-center gap-1.5 rounded-[7px] bg-[#0D1B2A] px-3 py-2 text-[11.5px] font-semibold text-white transition-colors hover:bg-[#16263b] w-full justify-center"
            >
              Upload feedback CSV
            </a>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
};

export default MeetingsPage;
