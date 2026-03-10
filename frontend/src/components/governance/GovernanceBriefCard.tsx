/**
 * GovernanceBriefCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Renders a single governance brief as a clearly-labeled meeting packet card.
 * Uses the shared GovernanceCard pattern.
 *
 * Used in:
 *   - ReportsPage (upcoming + past tabs)
 *   - RecentGovernanceBriefs (dashboard rail)
 *
 * Design intent:
 *   Each card should read like a meeting packet label — you immediately know
 *   which meeting it belongs to, how many issues were reviewed, and whether
 *   any escalation is flagged. The "Past Briefs" tab presents these as a
 *   reference stack, not an analytics table.
 *
 * Props map:
 *   title            → header title (e.g. "March 2025 Brief")
 *   meetingDate      → the meeting this brief was prepared for (display label)
 *   dateLabel        → generated/created date — shown in meta row
 *   description      → optional one-liner summary (e.g. "3 high-severity issues reviewed")
 *   status           → "ready" | "escalation" | "pending" → chip + accent
 *   signalsCount     → meta: "N signals" (optional)
 *   actionsCount     → meta: "N actions" (optional)
 *   generatedBy      → meta: attribution (optional)
 *   planType         → controls PDF download label (free = watermarked)
 *   isPast           → true for archived cards — suppresses "Prepare" action
 *   onView           → primary "View brief" action
 *   onDownload       → "Download PDF" action
 *   onPrepare        → "Prepare presentation" action (upcoming tab only)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { Calendar, FileText, Zap } from "lucide-react";
import GovernanceCard from "./GovernanceCard";
import GovStatusChip from "./GovStatusChip";

export type BriefStatus = "ready" | "escalation" | "pending";

export type GovernanceBriefCardProps = {
  title: string;
  /** Human-readable label for the meeting date period (e.g. "March 2025") */
  meetingDate?: string;
  /** Created/generated date label — shown as a meta item */
  dateLabel: string;
  /** One-liner description shown as the summary line */
  description?: string;
  status: BriefStatus;
  signalsCount?: number;
  actionsCount?: number;
  generatedBy?: string;
  planType?: string;
  /** When true, hides the "Prepare presentation" action (past briefs) */
  isPast?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onPrepare?: () => void;
};

const statusChipMap: Record<BriefStatus, { label: string; variant: "risk" | "warn" | "success" | "muted" }> = {
  escalation: { label: "Escalation Required", variant: "warn" },
  ready:      { label: "Ready",               variant: "success" },
  pending:    { label: "Pending",              variant: "muted" },
};

const accentMap: Record<BriefStatus, "warn" | "success" | "neutral"> = {
  escalation: "warn",
  ready:      "success",
  pending:    "neutral",
};

/** Build the packet-summary description when none is provided */
function buildDescription(signalsCount?: number, actionsCount?: number, status?: BriefStatus): string | undefined {
  const parts: string[] = [];
  if (typeof signalsCount === "number") {
    parts.push(`${signalsCount} client ${signalsCount === 1 ? "issue" : "issues"} reviewed`);
  }
  if (typeof actionsCount === "number") {
    parts.push(`${actionsCount} ${actionsCount === 1 ? "action" : "actions"} tracked`);
  }
  if (status === "escalation") {
    parts.push("partner escalation flagged");
  }
  return parts.length > 0 ? parts.join(" · ") : undefined;
}

export default function GovernanceBriefCard({
  title,
  meetingDate,
  dateLabel,
  description,
  status,
  signalsCount,
  actionsCount,
  generatedBy,
  planType,
  isPast = false,
  onView,
  onDownload,
  onPrepare,
}: GovernanceBriefCardProps) {
  const { label: chipLabel, variant: chipVariant } = statusChipMap[status] ?? statusChipMap.ready;

  // Build meta row: meeting period → generated date → attribution
  const metaItems: string[] = [];
  if (meetingDate) metaItems.push(meetingDate);
  metaItems.push(`Generated ${dateLabel}`);
  if (generatedBy && generatedBy !== "System") metaItems.push(`by ${generatedBy}`);

  // Summary line: prefer explicit description, fall back to computed packet summary
  const summaryLine = description ?? buildDescription(signalsCount, actionsCount, status);

  const downloadLabel = planType === "free" ? "Preview PDF (Watermarked)" : "Download PDF";

  return (
    <GovernanceCard
      title={title}
      accent={accentMap[status] ?? "neutral"}
      chip={<GovStatusChip label={chipLabel} variant={chipVariant} />}
      summary={summaryLine}
      meta={metaItems}
      detail={
        /* Compact stats row inside the card body — signals + actions at a glance */
        (typeof signalsCount === "number" || typeof actionsCount === "number") ? (
          <div className="flex flex-wrap items-center gap-4 pt-1">
            {typeof signalsCount === "number" ? (
              <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                <Zap size={12} className="text-slate-400" aria-hidden />
                <span>{signalsCount} {signalsCount === 1 ? "signal" : "signals"}</span>
              </span>
            ) : null}
            {typeof actionsCount === "number" ? (
              <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                <FileText size={12} className="text-slate-400" aria-hidden />
                <span>{actionsCount} {actionsCount === 1 ? "action" : "actions"}</span>
              </span>
            ) : null}
            {meetingDate ? (
              <span className="flex items-center gap-1.5 text-[12px] text-slate-500">
                <Calendar size={12} className="text-slate-400" aria-hidden />
                <span>{meetingDate}</span>
              </span>
            ) : null}
          </div>
        ) : null
      }
      actions={
        <>
          {onView ? (
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0D1B2A] transition-colors hover:bg-slate-50"
            >
              View brief
            </button>
          ) : null}
          {!isPast && onPrepare ? (
            <button
              type="button"
              onClick={onPrepare}
              className="inline-flex items-center rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0D1B2A] transition-colors hover:bg-slate-50"
            >
              Prepare presentation
            </button>
          ) : null}
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center rounded-[6px] bg-[#0D1B2A] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#16263b]"
            >
              {downloadLabel}
            </button>
          ) : null}
        </>
      }
    />
  );
}
