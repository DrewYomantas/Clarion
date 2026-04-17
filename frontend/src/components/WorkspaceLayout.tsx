/**
 * WorkspaceLayout
 * ─────────────────────────────────────────────────────────────────────────────
 * Global shell for all authenticated workspace routes.
 *
 * Navigation Information Architecture
 * ── PRIMARY (left rail) ──────────────────────────────────────────────────────
 *   Home              /dashboard              Home
 *   Briefs            /dashboard/reports      FileText      — governance briefs
 *   Issues            /dashboard/signals      ScanLine      — client issues
 *   Follow-Through    /dashboard/actions      ClipboardList — execution
 *   Meetings          /dashboard/meetings     Calendar      — review record
 * ── ACCOUNT MENU (topbar dropdown) ──────────────────────────────────────────
 *   Account           /dashboard/account
 *   Team              /dashboard/team
 *   Billing           /dashboard/billing
 *   Sign out
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
          ? "border-l-[3px] border-l-[#C4A96A] bg-white/[0.12] pl-[10px] text-white shadow-sm"
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
        {/* Official Clarion brand block */}
        <div className="workspace-shell-brand flex shrink-0 flex-col justify-center border-b border-white/[0.07] px-5 py-5">
          <div className="flex items-center gap-3">
            {/* Official mark — deep-blue C-arc with concentric inner arc, gold terminal needle + glow */}
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="cl-outer" x1="18" y1="3" x2="28" y2="9" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#2A4F8A"/>
                  <stop offset="0.55" stopColor="#3B6CB5"/>
                  <stop offset="1" stopColor="#C4A96A"/>
                </linearGradient>
                <linearGradient id="cl-inner" x1="18" y1="8" x2="25" y2="12" gradientUnits="userSpaceOnUse">
                  <stop offset="0" stopColor="#1E3D70" stopOpacity="0.7"/>
                  <stop offset="1" stopColor="#C4A96A" stopOpacity="0.5"/>
                </linearGradient>
                <radialGradient id="cl-glow" cx="76%" cy="26%" r="30%">
                  <stop offset="0" stopColor="#C4A96A" stopOpacity="0.55"/>
                  <stop offset="1" stopColor="#C4A96A" stopOpacity="0"/>
                </radialGradient>
              </defs>
              {/* Glow halo behind terminal point */}
              <circle cx="27.2" cy="9.4" r="6.5" fill="url(#cl-glow)"/>
              {/* Outer C-arc — main stroke */}
              <path
                d="M30.5 18A12.5 12.5 0 1 1 18 5.5"
                stroke="url(#cl-outer)"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Outer arc upper arm to terminal */}
              <path
                d="M18 5.5 C21.4 5.5 24.5 6.9 26.7 9.2"
                stroke="url(#cl-outer)"
                strokeWidth="3.2"
                strokeLinecap="round"
                fill="none"
              />
              {/* Inner concentric arc — subtle depth layer */}
              <path
                d="M26.2 18A8.2 8.2 0 1 1 18 9.8"
                stroke="url(#cl-inner)"
                strokeWidth="1.4"
                strokeLinecap="round"
                fill="none"
                opacity="0.7"
              />
              {/* Gold needle line pointing to terminal */}
              <line x1="20" y1="16" x2="27.2" y2="9.4" stroke="#C4A96A" strokeWidth="1.1" strokeLinecap="round" opacity="0.85"/>
              {/* Terminal point — gold dot with bright center */}
              <circle cx="27.2" cy="9.4" r="3" fill="#B8953C"/>
              <circle cx="27.2" cy="9.4" r="1.5" fill="#E8C97A"/>
            </svg>
            <div>
              <p
                className="text-[17px] font-bold text-white"
                style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: "0.18em", lineHeight: 1 }}
              >
                CLARION
              </p>
              <p className="mt-0.5 text-[8.5px] font-bold uppercase tracking-[0.22em] text-[#C4A96A]/70">
                Client Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Primary nav */}
        <nav className="flex-1 px-3 py-5" aria-label="Governance workspace">
          <div className="space-y-0.5">
            <p className="workspace-shell-nav-label px-3 pb-2 pt-1">Workspace</p>
            {PRIMARY_NAV.map((item) => {
              const active = isActive(item.to);
              const badgeCount =
                "badgeKey" in item && item.badgeKey === "briefs" && briefsBadgeCount > 0
                  ? briefsBadgeCount
                  : undefined;
              return (
                <NavItem
                  key={item.to}
                  to={item.to}
                  label={item.label}
                  Icon={item.Icon}
                  isActive={active}
                  badgeCount={badgeCount}
                  urgent={"badgeKey" in item && item.badgeKey === "briefs"}
                  iconClass={item.iconClass}
                  iconActiveClass={item.iconActiveClass}
                  badgeLabel={"badgeLabel" in item ? item.badgeLabel : undefined}
                />
              );
            })}

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
        <header className="workspace-shell-topbar relative flex shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#0B1929] px-6 py-3 before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-[#C4A96A]/50">
          <div className="min-w-0">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-[#4A7FAA]">
              {currentPageLabel}
            </p>
            <p className="mt-0.5 truncate text-[13px] leading-5 text-[#8FA7BC]">{currentPageNote}</p>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center rounded-lg border border-white/[0.1] bg-white/[0.05] px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#8FA7BC]">
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
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.07] text-[11px] font-bold tracking-wide text-[#CBD5E1] transition-colors hover:bg-white/[0.12] hover:text-white"
              >
                {initials}
              </button>
              {accountMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-1.5 w-56 rounded-[10px] border border-[#DDD8D0] bg-white py-1 shadow-[0_8px_24px_-4px_rgba(13,27,42,0.14),0_2px_8px_rgba(13,27,42,0.06),0_0_0_1px_rgba(13,27,42,0.03)]">
                  {/* Identity header */}
                  <div className="border-b border-[#EEF2F7] px-3.5 py-3">
                    <p className="truncate text-[12px] font-semibold text-[#0D1B2A]">{user?.firm_name || userName || "Account"}</p>
                    <p className="truncate text-[11px] text-[#7A6E63]">{user?.email}</p>
                  </div>
                  <Link
                    to="/dashboard/account"
                    onClick={() => setAccountMenuOpen(false)}
                    className="group flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium text-[#374151] transition-colors hover:bg-[#F8F6F2] hover:text-[#0D1B2A]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E2E8F0] transition-colors group-hover:bg-[#CBD5E1]" aria-hidden />
                    Account
                  </Link>
                  <Link
                    to="/dashboard/team"
                    onClick={() => setAccountMenuOpen(false)}
                    className="group flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium text-[#374151] transition-colors hover:bg-[#F8F6F2] hover:text-[#0D1B2A]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E2E8F0] transition-colors group-hover:bg-[#CBD5E1]" aria-hidden />
                    Team
                  </Link>
                  <Link
                    to="/dashboard/billing"
                    onClick={() => setAccountMenuOpen(false)}
                    className="group flex items-center gap-2.5 px-3.5 py-2 text-[12.5px] font-medium text-[#374151] transition-colors hover:bg-[#F8F6F2] hover:text-[#0D1B2A]"
                  >
                    <span className="h-1 w-1 rounded-full bg-[#E2E8F0] transition-colors group-hover:bg-[#CBD5E1]" aria-hidden />
                    Billing
                  </Link>
                  <div className="mx-3 my-1 h-px bg-[#EEF2F7]" />
                  <button
                    type="button"
                    onClick={() => { setAccountMenuOpen(false); void handleLogOut(); }}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 px-3.5 py-2 text-[12px] text-[#6B7280] transition-colors hover:bg-[#F8F6F2] hover:text-[#0D1B2A] disabled:opacity-50"
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
          className="workspace-main min-h-0 flex-1 overflow-y-auto"
        >
          <div className="workspace-route-content min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
