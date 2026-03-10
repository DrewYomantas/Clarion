type DashboardSectionDividerProps = {
  label: string;
  /** Optional supporting description on the right side */
  description?: string;
};

/**
 * DashboardSectionDivider
 * A slim, labeled horizontal rule used to separate major dashboard tiers.
 * Renders an eyebrow label on the left and an optional muted description on the right.
 *
 * Usage:
 *   <DashboardSectionDivider label="Priority work" />
 *   <DashboardSectionDivider label="Supporting information" description="Reference and capacity details" />
 *
 * Design rules:
 * - Only use between clearly distinct tiers (Tier 1→2, Tier 2→3)
 * - Do not use between individual cards within the same tier
 * - Label text is govDSM eyebrow (uppercase 11px tracking)
 */
export default function DashboardSectionDivider({
  label,
  description,
}: DashboardSectionDividerProps) {
  return (
    <div className="flex items-center gap-4 py-1">
      <span className="gov-eyebrow shrink-0">{label}</span>
      <div className="h-px flex-1 bg-[#E5E7EB]" />
      {description ? (
        <span className="shrink-0 text-[11px] text-[#9CA3AF]">{description}</span>
      ) : null}
    </div>
  );
}
