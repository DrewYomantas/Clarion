import type { ReactNode } from "react";

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
    <section className="gov-page-shell">
      <div className="gov-page-frame">
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
              <p className="mt-2 max-w-2xl text-[14px] leading-relaxed text-[#B9CCDA]">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex flex-wrap items-center gap-2 pt-1">{actions}</div>
          ) : null}
        </header>

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
