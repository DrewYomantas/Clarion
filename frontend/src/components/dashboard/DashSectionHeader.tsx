type DashSectionHeaderProps = {
  title: string;
  /** Optional muted sub-line below the title */
  subtitle?: string;
};

/**
 * DashSectionHeader
 * Consistent heading component for major content sections within a dashboard tier.
 * Replaces ad-hoc <h2> blocks scattered across Dashboard.tsx.
 *
 * Typography scale:
 *   title   — 15px semibold, #0D1B2A (govDSM gov-h3 level)
 *   subtitle — 12px, #6B7280
 *
 * Usage:
 *   <DashSectionHeader title="Priority follow-through" subtitle="Actions without clear ownership" />
 */
export default function DashSectionHeader({ title, subtitle }: DashSectionHeaderProps) {
  return (
    <div className="mb-3">
      <h2 className="text-[15px] font-semibold uppercase tracking-[0.06em] text-[#4B5563]">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-0.5 text-[12px] text-[#9CA3AF]">{subtitle}</p>
      ) : null}
    </div>
  );
}
