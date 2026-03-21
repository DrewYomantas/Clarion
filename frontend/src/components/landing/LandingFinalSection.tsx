import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { defaultSampleBriefPath } from "@/data/sampleFirmData";

const LandingFinalSection = () => {
  const { isLoggedIn, isLoading } = useAuth();
  const secondaryHref = !isLoading && isLoggedIn ? "/upload" : "/signup";
  const secondaryLabel = !isLoading && isLoggedIn ? "Upload recent feedback" : "Start a pilot workspace";

  return (
    <section className="bg-[#0D1B2A]">
      <div className="section-container py-20 lg:py-24">
        <div className="landing-reveal reveal--visible max-w-2xl">
          <p className="landing-kicker" style={{ color: "#C4A96A" }}>Next step</p>
          <h2 className="landing-section-title mt-4 text-[#F3F4F6]">
            Start with one recent feedback cycle and bring a clearer record into the next partner meeting.
          </h2>
          <p className="mt-5 text-base leading-7 text-[#9CA3AF]">
            Review the sample brief first, start a pilot when the firm is ready, and keep the setup burden low. The
            point is to make the first cycle legible quickly, not to ask leadership to adopt another complicated system.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to={defaultSampleBriefPath}
              className="landing-cta-button inline-flex items-center rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#0D1B2A] transition-colors hover:bg-[#F3F4F6]"
            >
              Review sample brief <ArrowRight size={15} className="ml-2" />
            </Link>
            <Link
              to={secondaryHref}
              className="landing-cta-button inline-flex items-center rounded-xl border border-[#2D4A6A] bg-transparent px-6 py-3 text-sm font-semibold text-[#D1D5DB] transition-colors hover:bg-[#162233] hover:text-white"
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LandingFinalSection;
