import { defaultSampleReportId, sampleReportDetails } from "@/data/sampleFirmData";
import {
  landingAccountabilityRows,
  landingPreviewIssueRows,
  landingPreviewMeetingAgenda,
} from "@/content/landingV3";

type LandingOperatingPreviewProps = {
  compact?: boolean;
  mode?: "hero" | "outputs";
};

const toneClassByLabel: Record<string, string> = {
  Watch: "border-[rgba(203,178,123,0.28)] bg-[rgba(203,178,123,0.12)] text-[#E7D5A7]",
  "Needs action": "border-[rgba(234,145,107,0.28)] bg-[rgba(234,145,107,0.12)] text-[#F4C0AA]",
  Escalate: "border-[rgba(243,112,112,0.28)] bg-[rgba(243,112,112,0.12)] text-[#F7B3B3]",
  "In Progress": "border-[rgba(203,178,123,0.28)] bg-[rgba(203,178,123,0.12)] text-[#E7D5A7]",
  Planned: "border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.06)] text-[#D9DEEA]",
};

const LandingOperatingPreview = ({
  compact = false,
  mode = "hero",
}: LandingOperatingPreviewProps) => {
  const report = sampleReportDetails[defaultSampleReportId];
  const previewTitle = "Current governance brief for partner review";
  const actions = compact ? landingAccountabilityRows.slice(0, 2) : landingAccountabilityRows;
  const issues = compact ? landingPreviewIssueRows.slice(0, 2) : landingPreviewIssueRows;

  return (
    <article
      className={`overflow-hidden rounded-[28px] border border-[rgba(203,178,123,0.18)] bg-[linear-gradient(180deg,#0B1425_0%,#0C182B_55%,#0A1221_100%)] shadow-[0_28px_70px_rgba(4,9,22,0.5)] ${compact ? "" : ""}`}
    >
      <header className="border-b border-[rgba(203,178,123,0.12)] px-6 py-6 md:px-7">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#CBB27B]">Governance Brief</p>
          <h3 className="mt-3 font-['Newsreader',Georgia,serif] text-[2rem] leading-[0.96] tracking-[-0.04em] text-white">
            {previewTitle}
          </h3>
          <p className="mt-3 max-w-[38rem] text-sm leading-7 text-[#C7CDDA]">
            {report.totalReviews} reviews analyzed from one review-period export. Prepared for partner review.
          </p>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <span className="rounded-full border border-[rgba(203,178,123,0.22)] bg-[rgba(203,178,123,0.12)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#E5D7B3]">
            Governance Brief
          </span>
          <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#D9DEEA]">
            Meeting use
          </span>
        </div>
      </header>

      <div className="grid gap-4 px-6 py-6 md:grid-cols-[1.05fr_0.95fr] md:px-7">
        <section className="rounded-[22px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#CBB27B]">Attention now</p>
          <p className="mt-3 text-sm leading-7 text-[#E3E8F2]">
            Communication delays and billing confusion remain the clearest service risks. Outcome sentiment is still
            strong, but the firm is losing confidence between milestones.
          </p>
          <div className="mt-5 space-y-3">
            {issues.map((issue) => (
              <div key={issue.label} className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[rgba(6,12,24,0.55)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold text-white">{issue.label}</p>
                  <span className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${toneClassByLabel[issue.tone]}`}>
                    {issue.tone}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-[#B9C1D3]">{issue.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[22px] border border-[rgba(203,178,123,0.14)] bg-[linear-gradient(180deg,rgba(203,178,123,0.08)_0%,rgba(255,255,255,0.03)_100%)] p-5">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#CBB27B]">Follow-through</p>
          <div className="mt-4 space-y-3">
            {actions.map((row) => (
              <div key={row.action} className="rounded-[18px] border border-[rgba(255,255,255,0.06)] bg-[rgba(6,12,24,0.4)] p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-semibold leading-6 text-white">{row.action}</p>
                  <span className={`rounded-full border px-2.5 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${toneClassByLabel[row.status] || toneClassByLabel.Planned}`}>
                    {row.status}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#B5BED2]">
                  <span>Owner: {row.owner}</span>
                  <span>Due: {row.due}</span>
                </div>
                {!compact && <p className="mt-2 text-sm leading-6 text-[#CAD1E0]">{row.note}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="border-t border-[rgba(203,178,123,0.12)] px-6 py-6 md:px-7">
        <div>
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#CBB27B]">Meeting agenda</p>
          <ul className="mt-3 space-y-2">
            {landingPreviewMeetingAgenda.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm leading-6 text-[#D4DAE7]">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#CBB27B]" />
                {point}
              </li>
            ))}
          </ul>
        </div>

        {mode === "outputs" && !compact && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.03)] px-5 py-4">
            <div>
              <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#CBB27B]">Use in the room</p>
              <p className="mt-2 text-sm leading-6 text-[#D4DAE7]">
                Bring the brief into partner review, then keep the same cycle alive in the workspace.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#D9DEEA]">Workspace</span>
              <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#D9DEEA]">PDF brief</span>
              <span className="rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#D9DEEA]">Email summary</span>
            </div>
          </div>
        )}
      </footer>
    </article>
  );
};

export default LandingOperatingPreview;
