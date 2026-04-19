import type { ReactNode } from "react";

/**
 * PageWrapper
 * Standard page shell for all app-level governance pages.
 *
 * Typography:
 *   eyebrow     → workspace-shell-eyebrow  (11px / 700 / uppercase — legacy class, same as gov-type-eyebrow)
 *   title (h1)  → gov-type-h1              (24px / 700 / #0D1B2A)
 *   description → gov-type-body            (14px / 400 / #334155)
 */
type PageWrapperProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
  contentClassName?: string;
};

const PageWrapper = ({ title, description, eyebrow, actions, children, contentClassName = "" }: PageWrapperProps) => {
  return (
    <section
      className="gov-page-shell"
      style={{
        padding: "var(--space-page-y) var(--space-page-x)",
      }}
    >
      <div
        className="mx-auto w-full"
        style={{ maxWidth: "var(--content-max-w)" }}
      >
        {/* Page header — renders against dark gradient band; all text is light */}
        <header
          className="workspace-shell-header flex flex-wrap items-start justify-between border-b border-white/[0.09]"
          style={{ gap: "var(--space-content)", marginBottom: "20px", paddingBottom: "20px" }}
        >
          <div className="max-w-3xl">
            {eyebrow ? (
              <p
                className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.14em]"
                style={{ color: "#C4A96A" }}
              >
                {eyebrow}
              </p>
            ) : null}
            <h1
              className="text-white"
              style={{ fontSize: "var(--type-page-size)", fontWeight: "var(--type-page-weight)", lineHeight: "var(--type-page-lh)" }}
            >
              {title}
            </h1>
            {description ? (
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#8FA7BC]">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">{actions}</div>
          ) : null}
        </header>

        {/* Page content */}
        <div
          className={contentClassName}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-section)" }}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default PageWrapper;
