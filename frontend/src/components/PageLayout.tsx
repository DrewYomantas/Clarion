import { PropsWithChildren, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { SkipToMainContent } from "@/components/SkipToMainContent";

const PAGE_TITLES: Record<string, string> = {
  "/": "Home",
  "/features": "Features",
  "/how-it-works": "How It Works",
  "/pricing": "Pricing",
  "/security": "Security",
  "/contact": "Contact",
  "/terms": "Terms",
  "/privacy": "Privacy",
  "/login": "Log In",
  "/signup": "Sign Up",
  "/check-email": "Check Email",
  "/verify-success": "Verify Success",
  "/demo": "Sample Workspace",
  "/docs": "Documentation",
  "/forgot-password": "Forgot Password",
};

const PAGE_DESCRIPTIONS: Record<string, string> = {
  "/": "Clarion turns law-firm client feedback into Governance Briefs, visible client issues, and follow-through built for the meeting cycle.",
  "/features": "See how Clarion structures client feedback into governance signals, briefs, and follow-through records designed for partner review.",
  "/how-it-works": "Clarion takes one CSV upload and produces a structured governance brief, prioritized signals, and assigned follow-through — ready in minutes.",
  "/pricing": "Simple plans for law firms ready to govern client feedback at the partner level. Start free, upgrade when the cycle demands it.",
  "/security": "Clarion stores all feedback data in encrypted, access-controlled workspaces. Review our security posture and data handling practices.",
  "/contact": "Reach the Clarion team with questions about your firm's governance workflow, data setup, or partner review cycle.",
  "/docs": "Reference documentation for Clarion's upload format, brief structure, signal taxonomy, and workspace configuration.",
  "/demo": "Explore a sample Clarion workspace — including a live governance brief, prioritized signals, and assigned follow-through records.",
};

const CANONICAL_BASE = "https://law-firm-feedback-saas.onrender.com";

function setMetaDescription(content: string) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "description";
    document.head.appendChild(tag);
  }
  tag.content = content;
}

function setCanonical(path: string) {
  let tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!tag) {
    tag = document.createElement("link");
    tag.rel = "canonical";
    document.head.appendChild(tag);
  }
  tag.href = `${CANONICAL_BASE}${path}`;
}

function setRobotsTag(noindex: boolean) {
  let tag = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (noindex) {
    if (!tag) {
      tag = document.createElement("meta");
      tag.name = "robots";
      document.head.appendChild(tag);
    }
    tag.content = "noindex,nofollow";
  } else {
    tag?.remove();
  }
}

const PageLayout = ({ children }: PropsWithChildren) => {
  const { pathname, search } = useLocation();
  const isAuthRoute =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/check-email" ||
    pathname === "/verify-success" ||
    pathname.startsWith("/verify-email") ||
    pathname === "/verified" ||
    pathname.startsWith("/verified") ||
    pathname === "/forgot-password" ||
    pathname.startsWith("/reset-password");
  const isWorkspaceRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/upload") ||
    pathname.startsWith("/signals/");
  const isPublicRoute = !isWorkspaceRoute;

  useEffect(() => {
    const page =
      pathname.startsWith("/demo/reports/") && pathname.endsWith("/pdf")
        ? "Sample Governance Brief"
        : pathname.startsWith("/demo/reports/")
          ? "Sample Governance Brief"
          : PAGE_TITLES[pathname] || "Clarion";
    document.title = page === "Clarion" ? "Clarion" : `${page} - Clarion`;

    // Per-route meta description
    const demoReportDesc =
      "View a sample Clarion Governance Brief — the meeting artifact produced from structured client feedback analysis.";
    const description =
      pathname.startsWith("/demo/reports/")
        ? demoReportDesc
        : PAGE_DESCRIPTIONS[pathname] || PAGE_DESCRIPTIONS["/"];
    setMetaDescription(description);

    // Canonical tag — only for public indexable routes
    const publicRoutes = Object.keys(PAGE_DESCRIPTIONS);
    if (publicRoutes.includes(pathname) || pathname.startsWith("/demo/reports/")) {
      setCanonical(pathname);
    }

    // noindex for auth/non-public routes handled by PageLayout
    setRobotsTag(isAuthRoute);
  }, [pathname, isAuthRoute]);

  useEffect(() => {
    if (isWorkspaceRoute) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, search, isWorkspaceRoute]);

  return (
    <div
      className={[
        "min-h-screen",
        isPublicRoute ? "clarion-public-shell text-[#F4EFE5]" : "bg-background",
      ].join(" ")}
    >
      <SkipToMainContent />
      <SiteNav />
      <main
        id="main-content"
        className={[
          "pt-16",
          isWorkspaceRoute ? "pb-10" : "clarion-public-main pb-16",
          isAuthRoute ? "route-shell-auth" : "",
        ].join(" ")}
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
};

export default PageLayout;
