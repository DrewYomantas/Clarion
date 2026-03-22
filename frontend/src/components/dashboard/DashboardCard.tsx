import type { ReactNode } from "react";

/**
 * DashboardCard
 * General-purpose card shell for dashboard modules.
 *
 * Typography defaults (override via titleClassName / subtitleClassName props):
 *   title    → gov-type-h3  (15px / 600 / #0D1B2A)
 *   subtitle → gov-type-meta (12px / 400 / #9CA3AF)
 */
type DashboardCardProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  children: ReactNode;
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

const DashboardCard = ({
  title,
  subtitle,
  children,
  className = "",
  titleClassName = "gov-type-h3",
  subtitleClassName = "gov-type-meta",
}: DashboardCardProps) => {
  return (
    <section className={`gov-card-surface rounded-2xl border border-[#DDD8D0] bg-white px-6 py-5 shadow-[0_2px_8px_rgba(13,27,42,0.07),0_0_0_1px_rgba(13,27,42,0.03)] ${className}`.trim()}>
      <div className="mb-3">
        <h3 className={titleClassName}>{title}</h3>
        {subtitle ? <p className={subtitleClassName}>{subtitle}</p> : null}
      </div>
      {children}
    </section>
  );
};

export default DashboardCard;
