import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";
import { getReports, type ReportListItem } from "@/api/authService";
import PageWrapper from "@/components/governance/PageWrapper";
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

  const latestRow = rows[0] ?? null;
  const priorRows = rows.slice(1);

  return (
    <PageWrapper
      eyebrow="Review Meetings"
      title="Meetings"
      description="Chronological record of governance review meetings linked to their Governance Briefs."
      contentClassName="stage-sequence"
    >
      {/* Dark header slab — compact, meets content quickly */}
      <section className="overflow-hidden rounded-[14px] border border-white/[0.13] shadow-[0_8px_32px_rgba(0,0,0,0.18),0_0_0_1px_rgba(255,255,255,0.04)]">
        <div
          className="relative px-6 py-4"
          style={{ background: "linear-gradient(150deg, #0B1929 0%, #0e2139 55%, #0D1B2A 100%)" }}
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#1a3a6b] opacity-25 blur-3xl" aria-hidden />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="gov-type-eyebrow text-[#C4A96A]/90 mb-1.5">Meeting Record</p>
              <h2
                className="text-white"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: "20px", fontWeight: 700, lineHeight: 1.25 }}
              >
                {loading
                  ? "Loading record…"
                  : rows.length === 0
                    ? "No sessions on record yet"
                    : rows.length === 1
                      ? "1 governance session"
                      : `${rows.length} governance sessions`}
              </h2>
            </div>
            <div className="flex items-center gap-6 text-[12px]">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4A6FA5]">Total sessions</p>
                <p className="mt-0.5 font-semibold text-[#CBD5E1]">{loading ? "—" : String(rows.length)}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4A6FA5]">Most recent</p>
                <p className="mt-0.5 font-semibold text-[#CBD5E1]">{loading ? "—" : latestRow?.period || "None"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content area */}
      {error ? (
        <div className="rounded-[10px] border border-[#EF4444]/20 bg-[#FEF2F2] px-5 py-4 text-[13px] text-[#991B1B]">{error}</div>
      ) : loading ? (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[68px] animate-pulse rounded-[10px] bg-[#E5E7EB]" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <section className="rounded-[12px] border border-[#DDD8D0] bg-white px-7 py-10 shadow-[0_1px_3px_rgba(13,27,42,0.06)]">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#DDD8D0] bg-[#F8F6F2] text-[#9CA3AF]">
              <Calendar size={18} />
            </div>
            <p className="mt-4 text-[15px] font-semibold text-[#0D1B2A]">No meetings on record yet</p>
            <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-[#6B7280]">
              Governance review meetings appear here once the first brief is ready. Upload feedback and generate a brief to start the meeting record.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <a href="/upload" className="inline-flex items-center rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b]">
                Upload feedback CSV
              </a>
              <a href="/dashboard" className="inline-flex items-center rounded-[8px] border border-[#DDD8D0] bg-white px-4 py-2 text-[12px] font-medium text-[#374151] transition-colors hover:bg-[#F8F6F2]">
                Return to dashboard
              </a>
            </div>
          </div>
        </section>
      ) : (
        <div className="space-y-4">
          {/* Latest session — featured row */}
          {latestRow && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-px flex-1 bg-[#E5E2DC]" />
                <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Latest session</p>
                <div className="h-px flex-1 bg-[#E5E2DC]" />
              </div>
              <article className="rounded-[12px] border border-[#DDD8D0] bg-white px-5 py-[18px] shadow-[0_1px_3px_rgba(13,27,42,0.06),0_0_0_1px_rgba(13,27,42,0.02)] border-l-[3px] border-l-[#C4A96A]">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#10B981]">Active brief</p>
                      </span>
                    </div>
                    <p className="text-[15px] font-semibold text-[#0D1B2A]">{latestRow.name}</p>
                    <p className="mt-0.5 text-[12px] text-[#6B7280]">
                      {latestRow.period} · Generated {latestRow.created}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate(`/dashboard/reports/${latestRow.id}`)}
                    className="inline-flex items-center rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b]"
                  >
                    Open Governance Brief
                  </button>
                </div>
              </article>
            </div>
          )}

          {/* Prior sessions */}
          {priorRows.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px flex-1 bg-[#E5E2DC]" />
                <p className="shrink-0 text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Prior sessions</p>
                <div className="h-px flex-1 bg-[#E5E2DC]" />
              </div>
              <div className="space-y-2">
                {priorRows.map((row) => (
                  <article
                    key={row.id}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#E5E2DC] bg-white px-5 py-4 shadow-[0_1px_2px_rgba(13,27,42,0.04)] border-l-[3px] border-l-[#CBD5E1] transition-shadow hover:shadow-[0_2px_6px_rgba(13,27,42,0.08)]"
                  >
                    <div className="min-w-0">
                      <p className="text-[14px] font-semibold text-[#0D1B2A]">{row.name}</p>
                      <p className="mt-0.5 text-[12px] text-[#6B7280]">
                        {row.period} · Generated {row.created}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/reports/${row.id}`)}
                      className="inline-flex items-center rounded-[6px] border border-[#DDD8D0] bg-[#F8F6F2] px-3 py-1.5 text-[12px] font-medium text-[#374151] transition-colors hover:bg-[#EDEBE7]"
                    >
                      Open brief
                    </button>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default MeetingsPage;
