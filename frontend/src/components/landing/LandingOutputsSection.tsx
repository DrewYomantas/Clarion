import LandingOperatingPreview from "@/components/landing/LandingOperatingPreview";
import { landingOutputs } from "@/content/landingV3";

const LandingOutputsSection = () => (
  <section className="border-b border-[#D7D0C3] bg-[#F6F0E4]">
    <div className="section-container py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="landing-reveal reveal--visible max-w-xl">
          <p className="landing-kicker">What the firm receives</p>
          <h2 className="landing-section-title mt-4 text-[#111827]">
            The output is a governance record that can be read quickly, assigned clearly, and shared without translation.
          </h2>
          <div className="mt-8 space-y-5">
            {landingOutputs.map((output, index) => (
              <article
                key={output.title}
                className={`landing-output-card landing-surface-lift landing-reveal reveal--visible landing-reveal-delay-${index + 1}`}
              >
                <h3 className="text-lg font-semibold text-[#111827]">{output.title}</h3>
                <p className="mt-2 text-sm leading-7 text-[#4B5563]">{output.body}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="landing-reveal landing-reveal-delay-2 landing-reveal-scale reveal--visible lg:pl-4">
          <LandingOperatingPreview mode="outputs" />
        </div>
      </div>
    </div>
  </section>
);

export default LandingOutputsSection;
