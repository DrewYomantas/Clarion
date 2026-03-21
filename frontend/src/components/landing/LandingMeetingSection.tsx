import { landingMeetingPoints } from "@/content/landingV3";

const LandingMeetingSection = () => (
  <section className="bg-[#FBF8F2]">
    <div className="section-container py-16 lg:py-20">
      <div className="landing-reveal reveal--visible max-w-3xl">
        <p className="landing-kicker">Meeting-ready visibility</p>
        <h2 className="landing-section-title mt-4 text-[#111827]">
          Partners should be able to understand the cycle quickly, then spend the meeting on decisions instead of interpretation.
        </h2>
      </div>

      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {landingMeetingPoints.map((point, index) => (
          <article
            key={point.title}
            className={`landing-meeting-card landing-surface-lift landing-reveal reveal--visible landing-reveal-delay-${index + 1}`}
          >
            <p className="landing-preview-label">{point.title}</p>
            <p className="mt-4 text-base leading-7 text-[#1F2937]">{point.body}</p>
          </article>
        ))}
      </div>

      <div className="landing-reveal landing-reveal-delay-2 reveal--visible mt-8 border-t border-[#DED7CA] pt-8">
        <p className="max-w-2xl text-base leading-7 text-[#374151]">
          Clarion gives the firm a brief to review, a workspace to act from, and a record to revisit in the next cycle.
          That is what makes the product useful in partner review rather than just interesting on a screen.
        </p>
      </div>
    </div>
  </section>
);

export default LandingMeetingSection;
