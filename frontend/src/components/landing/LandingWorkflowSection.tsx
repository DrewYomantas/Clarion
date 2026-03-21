import { landingWorkflowSteps } from "@/content/landingV3";

const LandingWorkflowSection = () => (
  <section id="workflow" className="border-b border-[#DED7CA] bg-white">
    <div className="section-container py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
        <div className="landing-reveal reveal--visible max-w-md">
          <p className="landing-kicker">Operating loop</p>
          <h2 className="landing-section-title mt-4 text-[#111827]">
            Upload feedback, structure the issues, assign action, and bring the record into the meeting.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#4B5563]">
            Clarion should be legible in one pass. The workflow is intentionally narrow so the firm can run it
            repeatedly without building a separate reporting process around the product.
          </p>
        </div>

        <div className="landing-rail">
          {landingWorkflowSteps.map((step, index) => (
            <article
              key={step.step}
              className={`landing-rail-step landing-rail-step-interactive landing-reveal reveal--visible landing-reveal-delay-${Math.min(index + 1, 5)}`}
            >
              <div>
                <p className="text-[2rem] font-bold leading-none tracking-tight text-[#D7CFC4]">{step.step}</p>
                <p className="mt-1.5 landing-rail-step-number">Step</p>
              </div>
              <div className="landing-rail-step-content">
                <h3 className="text-2xl font-semibold leading-8 text-[#111827]">{step.title}</h3>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4B5563]">{step.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default LandingWorkflowSection;
