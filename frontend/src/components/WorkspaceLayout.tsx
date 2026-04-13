/**
 * WorkspaceLayout
 * ─────────────────────────────────────────────────────────────────────────────
 * Global shell for all authenticated workspace routes.
 *
 * Navigation Information Architecture
 * ── PRIMARY ──────────────────────────────────────────────────────────────────
 *   Home              /dashboard              Home
 *   Briefs            /dashboard/reports      FileText      — governance briefs
 *   Issues            /dashboard/signals      ScanLine      — client issues
 *   Follow-Through    /dashboard/actions      ClipboardList — execution
 * ── ACCOUNT MENU (topbar dropdown) ──────────────────────────────────────────
 *   Meetings          /dashboard/meetings
 *   Account           /dashboard/account
 *   Team              /dashboard/team
 *   Billing           /dashboard/billing
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ClipboardList,
  FileText,
  Home,
  ScanLine,
} from "lucide-react";
import { getLatestExposure } from "@/api/authService";
import { useAuth } from "@/contexts/AuthContext";

// ── Navigation Items ──────────────────────────────────────────────────────────

const PRIMARY_NAV = [
  {
    to: "/dashboard",
    label: "Home",
    Icon: Home,
    iconClass: "text-[#E2E8F0]",
    iconActiveClass: "text-white",
  },
  {
    to: "/dashboard/reports",
    label: "Briefs",
    Icon: FileText,
    badgeKey: "briefs" as const,
    badgeLabel: "Escalation-required briefs",
    iconClass: "text-[#E2E8F0]",
    iconActiveClass: "text-white",
  },
  {
    to: "/dashboard/signals",
    label: "Issues",
    Icon: ScanLine,
    iconClass: "text-[#E2E8F0]",
    iconActiveClass: "text-white",
  },
  {
    to: "/dashboard/actions",
    label: "Follow-Through",
    Icon: ClipboardList,
    iconClass: "text-[#E2E8F0]",
    iconActiveClass: "text-white",
  },
] as const;

// Approval Queue is founder/admin only — not part of the public PRIMARY_NAV array.
// It is rendered conditionally in WorkspaceLayout JSX using user?.is_admin.

// Union type for badge key across primary nav
type BadgeKey = "briefs";


// ── NavItem Component ─────────────────────────────────────────────────────────

function NavItem({
  to,
  label,
  Icon,
  isActive,
  badgeCount,
  urgent = false,
  iconClass,
  iconActiveClass,
  badgeLabel,
}: {
  to: string;
  label: string;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  isActive: boolean;
  badgeCount?: number;
  urgent?: boolean;
  iconClass?: string;
  iconActiveClass?: string;
  badgeLabel?: string;
}) {
  return (
    <Link
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={[
        "group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
        isActive
          ? "border-l-[2px] border-l-[#C4A96A] bg-white/10 pl-[10px] text-white shadow-sm"
          : "border border-transparent text-slate-300/90 hover:bg-white/6 hover:text-white",
      ].join(" ")}
    >
      <Icon
        size={15}
        className={[
          "shrink-0 transition-colors duration-150",
          isActive ? "text-[#C4A96A]" : (iconClass || "text-slate-400"),
          !isActive ? "group-hover:text-slate-200" : "",
        ].join(" ")}
      />
      <span className="flex-1 text-[13.5px] leading-none tracking-[0.01em]">{label}</span>
      {typeof badgeCount === "number" ? (
        <span
          title={badgeLabel ? `${badgeLabel}: ${badgeCount}` : String(badgeCount)}
          aria-label={badgeLabel ? `${badgeLabel}: ${badgeCount}` : String(badgeCount)}
          className={[
            "inline-flex min-w-5 items-center justify-center rounded-md border px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
            urgent && badgeCount > 0
              ? "border-[#C4A96A]/50 bg-[#C4A96A]/20 text-[#C4A96A]"
              : "border-white/20 bg-white/8 text-slate-300",
          ].join(" ")}
        >
          {badgeCount}
        </span>
      ) : null}
    </Link>
  );
}


// ── WorkspaceLayout ───────────────────────────────────────────────────────────

/** Maps a pathname to a human-readable page label for the topbar and document title. */
const resolvePageLabel = (pathname: string): string => {
  // Detail routes first (more specific)
  if (pathname.startsWith("/dashboard/brief-customization")) return "Brief Customization";
  if (pathname.startsWith("/dashboard/approval-queue"))     return "Approval Queue";
  if (pathname.startsWith("/dashboard/signals/"))             return "Issue Detail";
  if (pathname.startsWith("/dashboard/reports/"))             return "Governance Brief";

  // Primary nav exact / prefix matches
  for (const item of PRIMARY_NAV) {
    if (item.to === "/dashboard" && pathname === "/dashboard") return item.label;
    if (item.to !== "/dashboard" && (pathname === item.to || pathname.startsWith(`${item.to}/`))) return item.label;
  }
  // Upload is a top-level route outside /dashboard
  if (pathname === "/upload") return "New Review";

  // Account menu routes
  if (pathname === "/dashboard/meetings") return "Meetings";
  if (pathname === "/dashboard/billing")  return "Billing";
  if (pathname === "/dashboard/account")  return "Account";
  if (pathname === "/dashboard/team")     return "Team";
  if (pathname === "/dashboard/security") return "Security";

  return "Home";
};

const resolvePageNote = (pathname: string): string => {
  if (pathname === "/dashboard") {
    return "Open the current Governance Brief, confirm what changed, and review follow-through before the next partner meeting.";
  }
  if (pathname === "/upload") {
    return "Start a new review cycle from one law-firm feedback export.";
  }
  if (pathname === "/dashboard/signals" || pathname.startsWith("/dashboard/signals/") || pathname.startsWith("/signals/")) {
    return "Review the client-feedback issues that feed the current Governance Brief.";
  }
  if (pathname === "/dashboard/actions" || pathname.startsWith("/dashboard/actions/")) {
    return "Review overdue, unowned, and blocked follow-through before the next partner discussion.";
  }
  if (pathname === "/dashboard/reports" || pathname.startsWith("/dashboard/reports/")) {
    return "Open the partner-ready Governance Brief and confirm follow-through and next decisions.";
  }
  if (pathname === "/dashboard/meetings") {
    return "Chronological record of governance review meetings and their associated briefs.";
  }
  if (pathname === "/dashboard/billing") {
    return "Manage your plan and subscription details.";
  }
  if (pathname === "/dashboard/team") {
    return "Manage workspace members and access.";
  }
  return "Manage your account and workspace preferences.";
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const { logOut, user, currentPlan } = useAuth();
  const location = useLocation();
  const { pathname } = location;
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);
  const [briefsBadgeCount, setBriefsBadgeCount] = useState<number>(0);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);
  const mainRef = useRef<HTMLElement | null>(null);

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === "/dashboard";
    if (href === "/upload")    return pathname === "/upload";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  // Load nav badge: escalation indicator on Governance Briefs
  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    const loadNavBadges = async () => {
      const exposure = await getLatestExposure(controller.signal);
      if (!active) return;
      setBriefsBadgeCount(
        exposure.success && exposure.exposure?.partner_escalation_required ? 1 : 0,
      );
    };
    void loadNavBadges();
    return () => { active = false; controller.abort(); };
  }, []);

  const handleLogOut = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logOut();
      navigate("/login");
    } finally {
      setLoggingOut(false);
    }
  };

  const currentPageLabel = resolvePageLabel(pathname);
  const currentPageNote = resolvePageNote(pathname);

  useEffect(() => {
    document.title = `${currentPageLabel} - Clarion`;
  }, [currentPageLabel]);

  // Workspace routes are never public — ensure noindex on every mount/route change.
  useEffect(() => {
    let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "robots";
      document.head.appendChild(tag);
    }
    tag.content = "noindex,nofollow";
    return () => { tag?.remove(); };
  }, [pathname]);

  useEffect(() => {
    const mainElement = mainRef.current;
    if (!mainElement) return;
    mainElement.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  // Close account menu on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(e.target as Node)) {
        setAccountMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const planLabel = currentPlan?.firmPlan
    ? currentPlan.firmPlan.toUpperCase()
    : currentPlan?.planLabel
      ? currentPlan.planLabel.toUpperCase()
      : "FREE";
  const userName = (user?.name || user?.email || "").trim();
  const initials = userName
    ? userName.split(/\s+/).slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("")
    : "U";

  return (
    <div className="gov-canvas flex h-screen w-full overflow-hidden">
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside
        aria-label="Primary navigation"
        className="workspace-sidebar sticky top-0 flex h-screen w-[17rem] shrink-0 flex-col overflow-y-auto border-r border-white/10"
      >
        {/* Wordmark */}
        <div className="workspace-shell-brand flex shrink-0 flex-col justify-center border-b border-white/8 px-5 py-5">
          <div className="flex items-center gap-2.5">
            {/* Mark — stylised C with gold accent dot */}
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path d="M18.5 11A7.5 7.5 0 1 1 11 3.5" stroke="#4A6FA5" strokeWidth="2.2" strokeLinecap="round"/>
              <path d="M11 3.5C13.2 3.5 15.2 4.4 16.6 5.9" stroke="url(#cg)" strokeWidth="2.2" strokeLinecap="round"/>
              <circle cx="16.6" cy="5.9" r="1.5" fill="#C4A96A"/>
              <defs>
                <linearGradient id="cg" x1="11" y1="3.5" x2="16.6" y2="5.9" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#4A6FA5"/>
                  <stop offset="1" stopColor="#C4A96A"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-serif text-[17px] font-semibold tracking-[0.04em] text-white" style={{ fontFamily: "'Newsreader', Georgia, serif", letterSpacing: "0.06em" }}>
              CLARION
            </span>
          </div>
          <p className="mt-2.5 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-[#C4A96A]/80">
            Governance Workspace
          </p>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 px-3 py-5" aria-label="Governance workspace">
          <div className="space-y-0.5">
            <p className="workspace-shell-nav-label px-3 pb-2 pt-1">Workspace</p>
            {PRIMARY_NAV.map((item) => (
              <NavItem
                key={item.to}
                to={item.to}
                label={item.label}
                Icon={item.Icon}
                isActive={isActive(item.to)}
                badgeCount={
                  "badgeKey" in item && item.badgeKey === "briefs" && briefsBadgeCount > 0
                    ? briefsBadgeCount
                    : undefined
                }
                urgent={"badgeKey" in item && item.badgeKey === "briefs" && briefsBadgeCount > 0}
                iconClass={item.iconClass}
                iconActiveClass={item.iconActiveClass}
                badgeLabel={"badgeLabel" in item ? item.badgeLabel : undefined}
              />
            ))}

            {/* Approval Queue is internal-only; not surfaced in the law-firm workspace nav. */}
          </div>
        </nav>

        {/* Log out */}
        <div className="shrink-0 px-4 py-4">
          <div className="mb-3 h-px bg-white/8" />
          <button
            type="button"
            onClick={() => void handleLogOut()}
            disabled={loggingOut}
            className="text-[12px] font-medium tracking-wide text-white/40 transition-colors hover:text-white/65 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>
      </aside>

      {/* ── Main content area ────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="workspace-shell-topbar flex shrink-0 items-center justify-between border-b border-[#DDD8D0] bg-[#FDFCFA] px-6 py-3">
          <div className="min-w-0">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#7A6E63]">
              {currentPageLabel}
            </p>
            <p className="mt-0.5 truncate text-[13px] leading-5 text-[#2C3E50]">{currentPageNote}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center rounded-lg border border-[#DDD8D0] bg-white px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#7A6E63]">
              {planLabel}
            </span>
            {/* Account menu */}
            <div className="relative" ref={accountMenuRef}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((p) => !p)}
                aria-label="Open account menu"
                aria-expanded={accountMenuOpen}
                aria-haspopup="true"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#DDD8D0] bg-[#F5F2ED] text-[11px] font-bold tracking-wide text-[#0D1B2A] transition-colors hover:bg-[#EBE6DF]"
              >
                {initials}
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-52 rounded-[10px] border border-[#DDD8D0] bg-white py-1 shadow-lg">
                  <div className="border-b border-[#F0EDE8] px-3 py-2.5">
                    <p className="truncate text-[11px] font-semibold text-[#0D1B2A]">{user?.firm_name || userName || "Account"}</p>
                    <p className="truncate text-[10px] text-[#7A6E63]">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard/meetings"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0D1B2A] hover:bg-[#F5F2ED]"
                  >
                    Meetings
                  </Link>
                  <div className="my-1 h-px bg-[#F0EDE8]" />
                  <Link
                    to="/dashboard/account"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0D1B2A] hover:bg-[#F5F2ED]"
                  >
                    Account
                  </Link>
                  <Link
                    to="/dashboard/team"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0D1B2A] hover:bg-[#F5F2ED]"
                  >
                    Team
                  </Link>
                  <Link
                    to="/dashboard/billing"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-[12px] text-[#0D1B2A] hover:bg-[#F5F2ED]"
                  >
                    Billing
                  </Link>
                  <div className="my-1 h-px bg-[#F0EDE8]" />
                  <button
                    type="button"
                    onClick={() => { setAccountMenuOpen(false); void handleLogOut(); }}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-[12px] text-[#0D1B2A] hover:bg-[#F5F2ED] disabled:opacity-50"
                  >
                    {loggingOut ? "Signing out…" : "Sign out"}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main
          ref={mainRef}
          className="workspace-main min-h-0 flex-1 overflow-y-auto bg-[#F2F0EC]"
        >
          <div className="workspace-route-content min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
