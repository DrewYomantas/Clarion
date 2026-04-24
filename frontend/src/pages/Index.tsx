import { useEffect } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import PublicBrand from "@/components/PublicBrand";
import MarketingProofBar from "@/components/MarketingProofBar";
import LandingOperatingPreview from "@/components/landing/LandingOperatingPreview";
import {
  landingAccountabilityRows,
  landingMeetingPoints,
  landingTrustPoints,
  landingWorkflowSteps,
} from "@/content/landingV3";
import { defaultSampleBriefPath } from "@/data/sampleFirmData";
import { useAuth } from "@/contexts/AuthContext";

const loopBands = [
  {
    label: "Evidence",
    title: "Client issues stay attached to the same cycle.",
    body: "Recurring complaints and service drift are structured before the meeting starts, so the firm is not reviewing raw comments in real time.",
  },
  {
    label: "Follow-through",
    title: "Owners and due-state stay visible after the brief leaves the room.",
    body: "Clarion keeps the follow-through record tied to the same Governance Brief instead of letting decisions drift into disconnected notes.",
  },
  {
    label: "Meeting use",
    title: "The Governance Brief becomes the artifact leadership actually works from.",
    body: "Review what changed, what is overdue, and what needs escalation from the same operating record the firm uses between meetings.",
  },
];

const Index = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const workspaceLink = !isLoading && isLoggedIn ? "/dashboard" : "/signup";

  useEffect(() => {
    document.title = "Clarion - Governance Briefs for Law-Firm Client Feedback";
  }, []);

  return (
    <PageLayout>
      <section className="public-hero-shell">
        <div className="section-container py-16 lg:py-20">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div className="max-w-[36rem]">
              <PublicBrand variant="hero" />
              <p className="mt-6 text-[0.72rem] font-semibold uppercase tracking-[0.34em] text-[#CBB27B]">
                Governance Briefs for law firms
              </p>
              <h1 className="mt-5 max-w-[11ch] font-['Newsreader',Georgia,serif] text-[3.25rem] leading-[0.95] tracking-[-0.045em] text-white sm:text-[4rem] xl:text-[4.8rem]">
                Bring client feedback into the meeting as one clear brief.
              </h1>
              <p className="mt-6 max-w-[34rem] text-[1.05rem] leading-8 text-[#CCD3E2]">
                Clarion turns one feedback export into a Governance Brief, visible client issues, assigned follow-through,
                and a meeting record leadership can carry from cycle to cycle.
              </p>
              <MarketingProofBar
                items={[
                  "Governance Brief comes first",
                  "Client issues stay tied to the source cycle",
                  "Follow-through remains visible after the meeting",
                ]}
                className="mt-7"
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={defaultSampleBriefPath} className="gov-btn-primary bg-[#CBB27B] text-[#08101F] hover:bg-[#D6BF8C]">
                  Review sample Governance Brief
                </Link>
                <Link
                  to={workspaceLink}
                  className="gov-btn-secondary border-[rgba(203,178,123,0.28)] bg-[rgba(255,255,255,0.04)] text-[#F4EFE5] hover:bg-[rgba(255,255,255,0.08)]"
                >
                  {!isLoading && isLoggedIn ? "Open workspace home" : "Start free"}
                </Link>
              </div>
              <div className="mt-10 border-t border-[rgba(203,178,123,0.14)] pt-6">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#CBB27B]">
                  The governance loop
                </p>
                <div className="mt-4 space-y-3 text-sm leading-7 text-[#D1D7E4]">
                  {landingWorkflowSteps.slice(0, 5).map((step) => (
                    <div key={step.step} className="flex gap-4">
                      <span className="w-10 shrink-0 text-[#7E8AA5]">{step.step}</span>
                      <p>
                        <span className="font-semibold text-white">{step.title}</span> — {step.body}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <LandingOperatingPreview mode="outputs" />
              <div className="rounded-[28px] border border-[rgba(203,178,123,0.14)] bg-[rgba(255,255,255,0.04)] p-6">
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.3em] text-[#CBB27B]">
                  Above the fold, in under five seconds
                </p>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <div>
                    <p className="text-sm font-semibold text-white">What requires decision</p>
                    <p className="mt-2 text-sm leading-7 text-[#C7CDDA]">
                      Surface the issue pattern leadership should discuss now.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">What supports it</p>
                    <p className="mt-2 text-sm leading-7 text-[#C7CDDA]">
                      Keep evidence, theme concentration, and issue seriousness close to the brief.
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">What happens next</p>
                    <p className="mt-2 text-sm leading-7 text-[#C7CDDA]">
                      Carry named follow-through back into the next cycle instead of losing momentum.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="public-surface-band">
        <div className="section-container py-14 lg:py-18">
          <div className="grid gap-5 lg:grid-cols-3">
            {loopBands.map((band) => (
              <article key={band.label} className="public-surface-panel">
                <p className="public-eyebrow">{band.label}</p>
                <h2 className="mt-3 text-[1.45rem] font-semibold leading-tight text-[#0A1324]">{band.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[#445067]">{band.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="public-dark-section">
        <div className="section-container py-14 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div>
              <p className="public-eyebrow text-[#CBB27B]">Why firms use Clarion</p>
              <h2 className="mt-4 font-['Newsreader',Georgia,serif] text-[2.4rem] leading-[0.98] tracking-[-0.03em] text-white">
                The brief becomes the product, not another output nobody trusts.
              </h2>
              <p className="mt-5 max-w-[34rem] text-base leading-8 text-[#C7CDDA]">
                Clarion is not analytics software and it is not a dashboard product. The point is to give the firm one
                governance record that starts with evidence, becomes a meeting-ready brief, and remains useful once the
                meeting ends.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {landingTrustPoints.map((point) => (
                <article key={point.title} className="rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] p-5">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-[#CBB27B]">{point.eyebrow}</p>
                  <h3 className="mt-3 text-lg font-semibold text-white">{point.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#CBD1DE]">{point.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="public-surface-band">
        <div className="section-container py-14 lg:py-18">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="public-eyebrow">Accountability after the meeting</p>
              <h2 className="mt-4 font-['Newsreader',Georgia,serif] text-[2.35rem] leading-[0.98] tracking-[-0.03em] text-[#0A1324]">
                Decisions are only useful if the same record survives the room.
              </h2>
              <div className="mt-6 space-y-4">
                {landingAccountabilityRows.map((row) => (
                  <article key={row.action} className="rounded-[24px] border border-[#D6CCBB] bg-[#FFFDF8] p-5 shadow-[0_16px_34px_rgba(12,18,34,0.08)]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="max-w-[32rem] text-base font-semibold text-[#0A1324]">{row.action}</h3>
                      <span className="rounded-full border border-[#D7C79D] bg-[#F8F0DA] px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7A5D1A]">
                        {row.status}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#5A6579]">
                      <span>Owner: {row.owner}</span>
                      <span>Due: {row.due}</span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-[#445067]">{row.note}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-[#D9CDBB] bg-[#FBF7EF] p-6">
              <p className="public-eyebrow">Bring it into the meeting</p>
              <div className="mt-5 space-y-5">
                {landingMeetingPoints.map((point, index) => (
                  <div key={point.title} className="border-b border-[#E2D9CA] pb-5 last:border-b-0 last:pb-0">
                    <div className="flex gap-4">
                      <span className="w-8 shrink-0 pt-0.5 text-sm font-semibold text-[#8B6F3D]">
                        0{index + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-semibold text-[#0A1324]">{point.title}</h3>
                        <p className="mt-2 text-sm leading-7 text-[#445067]">{point.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link to={defaultSampleBriefPath} className="gov-btn-primary">
                  Open sample brief
                </Link>
                <Link to="/how-it-works" className="gov-btn-secondary">
                  See the full cycle
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
