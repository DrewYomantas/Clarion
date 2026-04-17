import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, FileText, Clock, ChevronRight } from "lucide-react";
import { getReports, type ReportListItem } from "@/api/authService";
import PageWrapper from "@/components/governance/PageWrapper";
import { formatApiDate } from "@/lib/dateTime";

type MeetingRow = {
  id: number;
  name: string;
  period: string;
  created: string;
  totalReviews: number;
  dateStart: string | null;
  dateEnd: string | null;
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
      dateStart: report.review_date_start ?? null,
      dateEnd: report.review_date_end ?? null,
    }));
  }, [reports]);

  const latestRow = rows[0] ?? null;
  const priorRows = rows.slice(1);

  const statsSlot = !loading && rows.length > 0 ? (
    <div className="flex items-center gap-5">
      <div className="text-right">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4A6FA5]">Sessions</p>
        <p className="mt-0.5 text-[13px] font-semibold text-[#CBD5E1]">{rows.length}</p>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#4A6FA5]">Most recent</p>
        <p className="mt-0.5 text-[13px] font-semibold text-[#CBD5E1]">{latestRow?.period || "—"}</p>
      </div>
    </div>
  ) : null;

  return (
    <PageWrapper
      eyebrow="Review Meetings"
      title="Meetings"
      actions={statsSlot}
    >
      {error ? (
        <div className="rounded-[10px] border border-[#EF4444]/20 bg-[#FEF2F2] px-5 py-4 text-[13px] text-[#991B1B]">{error}</div>
      ) : loading ? (
        <div className="space-y-3">
          <div className="h-[180px] animate-pulse rounded-[12px] bg-[#E5E7EB]" />
          <div className="h-[68px] animate-pulse rounded-[10px] bg-[#E5E7EB]" />
          <div className="h-[68px] animate-pulse rounded-[10px] bg-[#E5E7EB]" />
        </div>
      ) : rows.length === 0 ? (
        /* ── Empty state ── */
        <div className="rounded-[14px] border border-[#DDD8D0] bg-white">
          <div className="px-8 py-12 flex flex-col items-center text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-[12px] border border-[#DDD8D0] bg-[#F8F6F2] text-[#9CA3AF] mb-4">
              <Calendar size={20} />
            </div>
            <p className="text-[15px] font-semibold text-[#0D1B2A]">No meetings on record yet</p>
            <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-[#6B7280]">
              Governance review meetings appear here once the first brief is ready. Upload feedback and generate a brief to start the record.
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
          {/* What happens here info strip */}
          <div className="border-t border-[#E5E2DC] px-8 py-5 grid grid-cols-3 gap-6">
            {[
              { step: "01", label: "Upload feedback", body: "Import a CSV of partner or client feedback from the review period." },
              { step: "02", label: "Generate brief", body: "CLARION processes and produces a structured Governance Brief." },
              { step: "03", label: "Meet and record", body: "Conduct your review meeting — the brief is logged here automatically." },
            ].map(({ step, label, body }) => (
              <div key={step} className="flex flex-col gap-1.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#C4A96A]">{step}</p>
                <p className="text-[13px] font-semibold text-[#0D1B2A]">{label}</p>
                <p className="text-[12px] leading-relaxed text-[#6B7280]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* ── Active brief — featured card ── */}
          {latestRow && (
            <div
              className="relative overflow-hidden rounded-[14px] border border-[#DDD8D0] bg-white shadow-[0_2px_8px_rgba(13,27,42,0.07)]"
              style={{ borderLeftWidth: "3px", borderLeftColor: "#C4A96A" }}
            >
              {/* Header band */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-6 pt-5 pb-4 border-b border-[#F0EDE9]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10B981]" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#10B981]">Active brief</p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/dashboard/reports/${latestRow.id}`)}
                  className="inline-flex items-center gap-1.5 rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b]"
                >
                  Open Governance Brief
                  <ChevronRight size={13} />
                </button>
              </div>

              {/* Body */}
              <div className="px-6 py-5">
                <p className="text-[17px] font-semibold text-[#0D1B2A] leading-tight">{latestRow.name}</p>
                <p className="mt-1 text-[13px] text-[#6B7280]">{latestRow.period} · Generated {latestRow.created}</p>
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3 border-t border-[#F0EDE9]">
                <div className="px-6 py-4 border-r border-[#F0EDE9]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">Review period</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#0D1B2A]">{latestRow.period}</p>
                </div>
                <div className="px-6 py-4 border-r border-[#F0EDE9]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">Reviews processed</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#0D1B2A]">
                    {latestRow.totalReviews > 0 ? latestRow.totalReviews.toLocaleString() : "—"}
                  </p>
                </div>
                <div className="px-6 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#9CA3AF]">Brief generated</p>
                  <p className="mt-1 text-[13px] font-semibold text-[#0D1B2A]">{latestRow.created}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Prior sessions ── */}
          {priorRows.length > 0 ? (
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
                    className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#E5E2DC] bg-white px-5 py-3.5 shadow-[0_1px_2px_rgba(13,27,42,0.04)] transition-shadow hover:shadow-[0_2px_6px_rgba(13,27,42,0.08)]"
                    style={{ borderLeftWidth: "3px", borderLeftColor: "#CBD5E1" }}
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#F5F3F0] text-[#9CA3AF]">
                        <FileText size={14} />
                      </div>
                      <div>
                        <p className="text-[13px] font-semibold text-[#0D1B2A]">{row.name}</p>
                        <p className="mt-0.5 text-[11.5px] text-[#6B7280]">
                          {row.period}
                          {row.totalReviews > 0 && <span className="ml-2 text-[#9CA3AF]">· {row.totalReviews} reviews</span>}
                          <span className="ml-2 text-[#9CA3AF]">· {row.created}</span>
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate(`/dashboard/reports/${row.id}`)}
                      className="inline-flex items-center gap-1 rounded-[6px] border border-[#DDD8D0] bg-[#F8F6F2] px-3 py-1.5 text-[11.5px] font-medium text-[#374151] transition-colors hover:bg-[#EDEBE7]"
                    >
                      Open brief
                      <ChevronRight size={11} />
                    </button>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            /* ── When there's only 1 session — "what's next" panel ── */
            <div className="rounded-[12px] border border-[#DDD8D0] bg-[#FAFAF9]">
              <div className="px-6 py-4 border-b border-[#E5E2DC]">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF]">Building your meeting record</p>
              </div>
              <div className="grid grid-cols-2 divide-x divide-[#E5E2DC]">
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#EBF5FB] text-[#0EA5C2]">
                      <Clock size={13} />
                    </div>
                    <p className="text-[12px] font-semibold text-[#0D1B2A]">Session cadence</p>
                  </div>
                  <p className="text-[12px] leading-relaxed text-[#6B7280]">
                    Most governance teams run quarterly review meetings. Each upload and brief generation creates a new session entry here, building a longitudinal record over time.
                  </p>
                </div>
                <div className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[7px] bg-[#F0FDF4] text-[#10B981]">
                      <Calendar size={13} />
                    </div>
                    <p className="text-[12px] font-semibold text-[#0D1B2A]">Your next session</p>
                  </div>
                  <p className="text-[12px] leading-relaxed text-[#6B7280]">
                    When you're ready for the next review cycle, upload a new feedback CSV. CLARION will generate a new brief and it will appear here alongside this one.
                  </p>
                  <a
                    href="/upload"
                    className="mt-3 inline-flex items-center gap-1 text-[11.5px] font-semibold text-[#0D1B2A] underline-offset-2 hover:underline"
                  >
                    Upload feedback CSV <ChevronRight size={11} />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </PageWrapper>
  );
};

export default MeetingsPage;
