/**
 * GovStatusChip
 * ─────────────────────────────────────────────────────────────────────────────
 * Single chip primitive used across all governance object types (Signal,
 * Action, Brief).  Encodes the semantic color system for status and severity.
 *
 * ── VARIANT SEMANTICS ────────────────────────────────────────────────────────
 *   risk     — red    Overdue · Blocked · High severity · Escalation required
 *   warn     — amber  In Progress · Medium severity · Due soon · Unassigned
 *   success  — green  Completed · Ready · Low severity · On track
 *   muted    — slate  Open · Neutral · Not started · Informational
 *   info     — blue   Informational states · Notes · Context
 *
 * ── GOVERNANCE LABEL VOCABULARY (use these exact strings) ────────────────────
 *   Severity:   "High"  "Medium"  "Low"
 *   Action:     "Open"  "In Progress"  "Blocked"  "Completed"  "Overdue"
 *   Brief:      "Ready"  "Escalation"  "Pending"
 *   Exposure:   "High Exposure"  "Medium Exposure"  "Low Exposure"
 *   State:      "On Track"  "Overdue"  "Due Soon"  "Unassigned"
 *
 * ── SIZE ─────────────────────────────────────────────────────────────────────
 *   sm  — 10px text, tighter padding  (meta rows, dense lists)
 *   md  — 11px text, standard padding (default — card headers, detail views)
 *
 * Usage:
 *   <GovStatusChip label="Overdue"        variant="risk"    />
 *   <GovStatusChip label="In Progress"    variant="warn"    />
 *   <GovStatusChip label="Ready"          variant="success" />
 *   <GovStatusChip label="Open"           variant="muted"   />
 *   <GovStatusChip label="High Exposure"  variant="risk"  size="sm" />
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type GovStatusChipVariant = "risk" | "warn" | "success" | "muted" | "info";
export type GovStatusChipSize    = "sm" | "md";

type GovStatusChipProps = {
  label: string;
  variant: GovStatusChipVariant;
  size?: GovStatusChipSize;
  className?: string;
};

const variantClass: Record<GovStatusChipVariant, string> = {
  risk:    "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]",
  warn:    "bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A]",
  success: "bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0]",
  muted:   "bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]",
  info:    "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]",
};

const sizeClass: Record<GovStatusChipSize, string> = {
  sm: "px-1.5 py-[2px] text-[10px]",
  md: "px-2    py-[3px] text-[11px]",
};

export default function GovStatusChip({
  label,
  variant,
  size = "md",
  className = "",
}: GovStatusChipProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-[4px] font-semibold leading-none tracking-[0.04em] shrink-0 whitespace-nowrap",
        variantClass[variant],
        sizeClass[size],
        className,
      ].join(" ")}
    >
      {label}
    </span>
  );
}

/**
 * resolveChipVariant
 * ─────────────────────────────────────────────────────────────────────────────
 * Utility for mapping raw API strings → GovStatusChipVariant without
 * repeating the same switch logic across adapters.
 *
 * Severity strings: "high" | "medium" | "low"
 * Action statuses:  "open" | "in_progress" | "blocked" | "done"
 * Boolean flags:    isOverdue, isDueSoon, isUnassigned
 */
export function resolveChipVariantForSeverity(
  severity: string | null | undefined,
): GovStatusChipVariant {
  const s = (severity || "").toLowerCase();
  if (s === "high")   return "risk";
  if (s === "medium") return "warn";
  return "success";
}

export function resolveChipVariantForActionStatus(
  status: string | null | undefined,
  isOverdue = false,
): GovStatusChipVariant {
  if (isOverdue)             return "risk";
  const s = (status || "").toLowerCase();
  if (s === "blocked")       return "risk";
  if (s === "in_progress")   return "warn";
  if (s === "done")          return "success";
  return "muted"; // open / default
}

export function resolveChipVariantForBriefStatus(
  status: string | null | undefined,
): GovStatusChipVariant {
  const s = (status || "").toLowerCase();
  if (s === "escalation") return "risk";
  if (s === "ready")      return "success";
  if (s === "pending")    return "warn";
  return "muted";
}
