import { landingTrustCallouts, landingTrustPoints } from "@/content/landingV3";

const LandingTrustSection = () => (
  <section className="border-b border-[#D7D0C3] bg-[#FBF8F2]">
    <div className="section-container py-16 lg:py-20">
      <div className="landing-reveal reveal--visible grid gap-8 border-b border-[#DED7CA] pb-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-end">
        <div className="max-w-2xl">
          <p className="landing-kicker">Built for law-firm review</p>
          <h2 className="landing-section-title mt-4 text-[#111827]">
            Clarion is for firms that want a disciplined review cycle, not a new analytics hobby.
          </h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {landingTrustCallouts.map((item, index) => (
            <div
              key={item}
              className={`landing-surface-lift landing-reveal reveal--visible rounded-[18px] border border-[#D7D0C3] bg-white px-4 py-4 text-sm leading-6 text-[#374151] landing-reveal-delay-${index + 1}`}
            >
              {item}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {landingTrustPoints.map((point, index) => (
          <article
            key={point.title}
            className={`landing-trust-card landing-surface-lift landing-reveal reveal--visible landing-reveal-delay-${index + 1}`}
          >
            <p className="landing-preview-label">{point.eyebrow}</p>
            <h3 className="mt-4 text-xl font-semibold text-[#111827]">{point.title}</h3>
            <p className="mt-3 text-sm leading-7 text-[#4B5563]">{point.body}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

export default LandingTrustSection;
