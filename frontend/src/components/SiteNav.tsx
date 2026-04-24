import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { defaultSampleBriefPath } from "@/data/sampleFirmData";
import PublicBrand from "@/components/PublicBrand";

const sharedMoreLinks = [
  { label: "Sample Brief", to: defaultSampleBriefPath },
  { label: "Sample Workspace", to: "/demo" },
  { label: "Docs", to: "/docs" },
  { label: "Contact", to: "/contact" },
  { label: "Terms", to: "/terms" },
  { label: "Privacy", to: "/privacy" },
];

const SiteNav = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isLoggedIn, isLoading, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const normalizedPathname = location.pathname.toLowerCase().replace(/\s+/g, "-");
  const isWorkspaceRoute =
    normalizedPathname.startsWith("/dashboard") ||
    normalizedPathname.startsWith("/upload") ||
    normalizedPathname.startsWith("/onboarding");
  const isPublicRoute = !isWorkspaceRoute;

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMoreMenu = () => {
    clearCloseTimer();
    setIsMoreOpen(true);
  };

  const closeMoreMenuWithDelay = () => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsMoreOpen(false);
    }, 380);
  };

  useEffect(() => {
    return () => clearCloseTimer();
  }, []);

  useEffect(() => {
    if (!isPublicRoute) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPublicRoute]);

  const handleLogout = async () => {
    await logOut();
    setMobileOpen(false);
    toast.success("You have been logged out.");
    navigate("/");
  };

  const headerClass = isPublicRoute
    ? [
        "fixed top-0 left-0 right-0 z-50 border-b border-[rgba(203,178,123,0.16)] transition-all duration-200",
        scrolled
          ? "bg-[rgba(5,11,24,0.96)] backdrop-blur-xl shadow-[0_18px_48px_rgba(4,9,22,0.36)]"
          : "bg-[rgba(4,10,22,0.9)] backdrop-blur-xl",
      ].join(" ")
    : "fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md";
  const menuButtonClass = [
    "p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isPublicRoute ? "text-[#F4EFE5]" : "text-slate-900",
  ].join(" ");

  const moreButtonClass = [
    "text-sm font-medium transition-colors md:rounded-full md:px-3 md:py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isPublicRoute ? "text-[#EEF2FA] hover:text-white" : "text-slate-700 hover:text-slate-900",
  ].join(" ");

  const dropdownClass = isPublicRoute
    ? "rounded-2xl border border-[rgba(203,178,123,0.18)] bg-[rgba(8,16,33,0.96)] p-2 shadow-[0_20px_44px_rgba(4,8,20,0.5)]"
    : "landing-nav-dropdown rounded-xl border border-[#D7D0C3] bg-[#FFFDF9] shadow-lg p-2";
  const showWorkspaceNav = !isLoading && isLoggedIn && !isPublicRoute;
  const showPublicWorkspaceCta = isPublicRoute && !isLoading && isLoggedIn;
  const publicLinkClass = ({ isActive }: { isActive: boolean }) =>
    [
      "text-sm font-medium transition-colors md:rounded-full md:px-3 md:py-2",
      isActive ? "text-white md:bg-[rgba(255,255,255,0.1)]" : "text-[#E2E8F3] hover:text-white",
    ].join(" ");
  const workspaceLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${isActive ? "text-slate-900" : "text-slate-700 hover:text-slate-900"}`;

  return (
    <header className={headerClass}>
      <div className="section-container flex h-16 items-center justify-between">
        <Link to="/" className="min-w-0">
          {isPublicRoute ? <PublicBrand variant="nav" /> : <div className="text-lg font-bold tracking-tight leading-tight text-slate-900">Clarion</div>}
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {showWorkspaceNav ? (
            <>
              <NavLink to="/dashboard" end className={workspaceLinkClass}>
                Workspace Home
              </NavLink>
              <NavLink to="/dashboard/reports" className={workspaceLinkClass} data-tour-id="nav-reports-link">
                Briefs
              </NavLink>
              <NavLink to="/dashboard/billing" className={workspaceLinkClass}>
                Billing
              </NavLink>
              <NavLink to="/upload" className={workspaceLinkClass}>
                Upload Cycle
              </NavLink>
              <NavLink to="/pricing" className={workspaceLinkClass}>
                Pricing
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/features" className={publicLinkClass}>
                Features
              </NavLink>
              <NavLink to="/how-it-works" className={publicLinkClass}>
                How It Works
              </NavLink>
              <NavLink to="/pricing" className={publicLinkClass}>
                Pricing
              </NavLink>
              <NavLink to="/security" className={publicLinkClass}>
                Security
              </NavLink>
              <Link
                to={defaultSampleBriefPath}
                className="inline-flex items-center rounded-xl border border-[rgba(203,178,123,0.3)] bg-[rgba(255,255,255,0.06)] px-4 py-2 text-sm font-semibold text-[#F4EFE5] transition-all duration-200 hover:bg-[rgba(255,255,255,0.12)]"
              >
                Sample brief
              </Link>
              {showPublicWorkspaceCta ? (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center rounded-xl border border-[#CBB27B] bg-[#CBB27B] px-5 py-2 text-sm font-semibold text-[#08101F] transition-all duration-200 hover:bg-[#D5BD89]"
                >
                  Open workspace
                </Link>
              ) : (
                <>
                  <NavLink to="/login" className={publicLinkClass}>
                    Log in
                  </NavLink>
                  <Link
                    to="/signup"
                    className="inline-flex items-center rounded-xl border border-[#CBB27B] bg-[#CBB27B] px-5 py-2 text-sm font-semibold text-[#08101F] transition-all duration-200 hover:bg-[#D5BD89]"
                  >
                    Start free
                  </Link>
                </>
              )}
            </>
          )}

          <div className="relative" onMouseEnter={openMoreMenu} onMouseLeave={closeMoreMenuWithDelay}>
            <button
              type="button"
              className={moreButtonClass}
              aria-haspopup="menu"
              aria-expanded={isMoreOpen}
              onFocus={openMoreMenu}
              onBlur={closeMoreMenuWithDelay}
            >
              Resources
            </button>
            <div
              className={`absolute right-0 top-full w-48 pt-2 transition-all duration-150 ${
                isMoreOpen ? "opacity-100 visible translate-y-0 pointer-events-auto" : "opacity-0 invisible translate-y-1 pointer-events-none"
              } z-[120]`}
              onMouseEnter={openMoreMenu}
              onMouseLeave={closeMoreMenuWithDelay}
            >
              <div className={dropdownClass}>
                {sharedMoreLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMoreOpen(false)}
                    className={({ isActive }) =>
                      [
                        "block rounded-md px-3 py-2 text-sm",
                        isPublicRoute
                          ? isActive
                            ? "bg-[rgba(255,255,255,0.08)] text-white"
                            : "text-[#D3D8E6] hover:bg-[rgba(255,255,255,0.06)] hover:text-white"
                          : isActive
                            ? "text-slate-900 bg-[#F3ECDD]"
                            : "text-slate-700 hover:text-slate-900 hover:bg-slate-100",
                      ].join(" ")
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        <div className="md:hidden flex items-center gap-2">
          <button onClick={() => setMobileOpen(!mobileOpen)} className={menuButtonClass} aria-label="Toggle menu">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          className={[
            "md:hidden px-6 py-4 space-y-3 border-t",
            isPublicRoute
              ? "border-[rgba(203,178,123,0.18)] bg-[rgba(6,12,24,0.98)] text-[#F4EFE5]"
              : "border-slate-200 bg-white",
          ].join(" ")}
        >
          {showWorkspaceNav ? (
            <>
              <NavLink to="/dashboard" end onClick={() => setMobileOpen(false)} className={workspaceLinkClass}>
                Workspace Home
              </NavLink>
              <NavLink to="/dashboard/reports" onClick={() => setMobileOpen(false)} className={workspaceLinkClass} data-tour-id="nav-reports-link">
                Briefs
              </NavLink>
              <NavLink to="/dashboard/billing" onClick={() => setMobileOpen(false)} className={workspaceLinkClass}>
                Billing
              </NavLink>
              <NavLink to="/upload" onClick={() => setMobileOpen(false)} className={workspaceLinkClass}>
                Upload Cycle
              </NavLink>
              <NavLink to="/pricing" onClick={() => setMobileOpen(false)} className={workspaceLinkClass}>
                Pricing
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="block text-left text-sm font-medium text-slate-700 hover:text-slate-900"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to="/features" onClick={() => setMobileOpen(false)} className={publicLinkClass}>
                Features
              </NavLink>
              <NavLink to="/how-it-works" onClick={() => setMobileOpen(false)} className={publicLinkClass}>
                How It Works
              </NavLink>
              <NavLink to="/pricing" onClick={() => setMobileOpen(false)} className={publicLinkClass}>
                Pricing
              </NavLink>
              <NavLink to="/security" onClick={() => setMobileOpen(false)} className={publicLinkClass}>
                Security
              </NavLink>
              <Link
                to={defaultSampleBriefPath}
                onClick={() => setMobileOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-xl border border-[rgba(203,178,123,0.3)] bg-[rgba(255,255,255,0.06)] px-5 py-2 text-sm font-semibold text-[#F4EFE5] transition-all duration-200 hover:bg-[rgba(255,255,255,0.12)]"
              >
                Sample brief
              </Link>
              {showPublicWorkspaceCta ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-[#CBB27B] bg-[#CBB27B] px-5 py-2 text-sm font-semibold text-[#08101F] transition-all duration-200 hover:bg-[#D5BD89]"
                  >
                    Open workspace
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="block text-left text-sm font-medium text-[#E2E8F3] hover:text-white"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <NavLink to="/login" onClick={() => setMobileOpen(false)} className={publicLinkClass}>
                    Log in
                  </NavLink>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex w-full items-center justify-center rounded-xl border border-[#CBB27B] bg-[#CBB27B] px-5 py-2 text-sm font-semibold text-[#08101F] transition-all duration-200 hover:bg-[#D5BD89]"
                  >
                    Start free
                  </Link>
                </>
              )}
            </>
          )}

          <div
            className={[
              "pt-3 space-y-2 border-t",
              isPublicRoute ? "border-[rgba(203,178,123,0.18)]" : "border-slate-200",
            ].join(" ")}
          >
            {sharedMoreLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={isPublicRoute ? publicLinkClass : workspaceLinkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
};

export default SiteNav;
