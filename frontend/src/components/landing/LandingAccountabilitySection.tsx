import { landingAccountabilityRows } from "@/content/landingV3";

const LandingAccountabilitySection = () => (
  <section className="border-b border-[#1A2A3F] bg-[#0D1B2A]">
    <div className="section-container py-20 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
        <div className="landing-reveal reveal--visible max-w-lg">
          <p className="landing-kicker" style={{ color: "#C4A96A" }}>Action and accountability</p>
          <h2 className="landing-section-title mt-4 text-[#F3F4F6]">
            A useful client-feedback review ends with owners, deadlines, and clear pressure where follow-through is lagging.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#9CA3AF]">
            Clarion keeps that accountability inside the same cycle as the brief so the firm is not relying on memory,
            scattered notes, or a second tracker after the meeting ends.
          </p>
        </div>

        <div
          className="landing-ledger landing-reveal landing-reveal-delay-2 landing-reveal-scale reveal--visible"
          style={{ background: "linear-gradient(180deg, #162233 0%, #111E2C 100%)", borderColor: "#1E3148" }}
        >
          <div className="landing-ledger-head" style={{ background: "rgba(255,255,255,0.04)", borderColor: "#1E3148", color: "#6B7280" }}>
            <span>Assigned action</span>
            <span>Owner</span>
            <span>Due</span>
            <span>Status</span>
          </div>
          {landingAccountabilityRows.map((row) => (
            <article key={row.action} className="landing-ledger-row" style={{ borderColor: "#1E3148", color: "#9CA3AF" }}>
              <div>
                <p className="font-semibold" style={{ color: "#E5E7EB" }}>{row.action}</p>
                <p className="mt-2 text-sm leading-6" style={{ color: "#6B7280" }}>{row.note}</p>
              </div>
              <span>{row.owner}</span>
              <span>{row.due}</span>
              <span className="landing-ledger-status" style={{ color: "#D1D5DB" }}>{row.status}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export default LandingAccountabilitySection;
