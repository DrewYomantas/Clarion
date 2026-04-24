import { Link } from "react-router-dom";
import PublicBrand from "@/components/PublicBrand";

const SiteFooter = () => (
  <footer className="border-t border-[rgba(203,178,123,0.12)] bg-[#071120] py-12 text-[#D5D8E2]">
    <div className="section-container">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md">
          <PublicBrand variant="footer" />
          <p className="mt-2 text-sm leading-7 text-[#C8CCDA]">
            Clarion turns client feedback into a Governance Brief, visible follow-through, and a meeting record the
            firm can carry from one cycle to the next.
          </p>
          <p className="mt-4 text-xs leading-6 text-[#99A4BA]">
            Questions about setup, billing, or data handling?{" "}
            <a href="mailto:support@clarionhq.co" className="font-semibold text-[#F4EFE5] hover:underline">
              support@clarionhq.co
            </a>
          </p>
        </div>
        <div className="grid gap-8 text-xs text-[#A4ACBF] sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#CBB27B]">Product</p>
            <div className="grid gap-y-2">
              <Link to="/demo/reports/26" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Sample Brief</Link>
              <Link to="/features" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Features</Link>
              <Link to="/how-it-works" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">How It Works</Link>
              <Link to="/pricing" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Pricing</Link>
              <Link to="/contact" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Contact</Link>
            </div>
          </div>
          <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#CBB27B]">Reference</p>
            <div className="grid gap-y-2">
              <Link to="/security" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Security</Link>
              <Link to="/docs" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Docs</Link>
              <Link to="/terms" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Terms</Link>
              <Link to="/privacy" className="transition-colors hover:text-[#F4EFE5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">Privacy</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 flex flex-col gap-2 border-t border-[rgba(203,178,123,0.12)] pt-4 text-xs text-[#8993A9] md:flex-row md:items-center md:justify-between">
        <p>Built for law-firm client-feedback governance, meeting review, and visible follow-through.</p>
        <p>&copy; {new Date().getFullYear()} Clarion. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default SiteFooter;
