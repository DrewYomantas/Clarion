import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { defaultSampleBriefPath } from "@/data/sampleFirmData";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    document.title = "Clarion - Page not found";
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-[#F6F0E4] text-[#111827]">
      <SiteNav />
      <main className="pt-16">
        <section className="border-b border-[#D7D0C3] bg-[#F6F0E4]">
          <div className="section-container py-20 lg:py-24">
            <div className="max-w-3xl rounded-[28px] border border-[#D7D0C3] bg-[#FFFDF9] px-8 py-10 shadow-[0_30px_60px_rgba(15,23,42,0.08)]">
              <p className="landing-kicker">Page not found</p>
              <h1 className="mt-4 font-serif text-4xl leading-tight text-[#111827] sm:text-5xl">
                This page is outside the current Clarion record.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                The link may be outdated, incomplete, or no longer part of the current public site. The clearest place
                to restart is the sample governance brief or the homepage.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={defaultSampleBriefPath}
                  className="inline-flex items-center rounded-xl bg-[#111827] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1F2937]"
                >
                  Review sample brief
                </Link>
                <Link
                  to="/"
                  className="inline-flex items-center rounded-xl border border-[#B9AE99] bg-transparent px-6 py-3 text-sm font-semibold text-[#111827] transition-colors hover:bg-white"
                >
                  Return home
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
