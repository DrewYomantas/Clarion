/**
 * SignalCard
 * Renders a single governance signal using the shared GovernanceCard pattern.
 * Replaces the inline <article> block in SignalsPage.tsx.
 *
 * Props map cleanly to GovernanceCard zones:
 *   title        → header title
 *   severity     → GovStatusChip + accent
 *   summary      → description line + frequency line
 *   meta         → previous count / trend (when available)
 *   actions      → "View Details" link + "Create Action" button
 */

import { Link } from "react-router-dom";
import GovernanceCard, { type GovernanceCardAccent } from "./GovernanceCard";
import GovStatusChip, { type GovStatusChipVariant } from "./GovStatusChip";

export type SignalSeverity = "High" | "Medium" | "Low";

export type SignalCardProps = {
  id: string;
  title: string;
  severity: SignalSeverity;
  frequencyCount: number;
  shareLabel?: string | null;
  description: string;
  previousCount?: number | null;
  trendLabel?: string | null;
  onCreateAction?: () => void;
};

const severityToAccent: Record<SignalSeverity, GovernanceCardAccent> = {
  High:   "risk",
  Medium: "warn",
  Low:    "success",
};

const severityToChipVariant: Record<SignalSeverity, GovStatusChipVariant> = {
  High:   "risk",
  Medium: "warn",
  Low:    "success",
};

export default function SignalCard({
  id,
  title,
  severity,
  frequencyCount,
  shareLabel,
  description,
  previousCount,
  trendLabel,
  onCreateAction,
}: SignalCardProps) {
  const metaItems: string[] = [];
  if (typeof previousCount === "number") {
    metaItems.push(`Prior cycle: ${previousCount}`);
  }
  if (trendLabel) {
    metaItems.push(trendLabel);
  }

  const summaryParts: string[] = [
    `Detected in ${frequencyCount} review${frequencyCount === 1 ? "" : "s"}`,
    shareLabel ?? "",
    description,
  ].filter(Boolean);
  const summary = summaryParts.join(" · ");

  return (
    <GovernanceCard
      title={title}
      accent={severityToAccent[severity]}
      chip={<GovStatusChip label={severity} variant={severityToChipVariant[severity]} />}
      summary={summary}
      meta={metaItems}
      actions={
        <>
          <Link
            to={`/dashboard/signals/${id}`}
            className="inline-flex items-center rounded-[6px] bg-[#0D1B2A] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#16263b]"
          >
            View details
          </Link>
          {onCreateAction ? (
            <button
              type="button"
              className="text-[12px] text-[#6B7280] underline underline-offset-4 transition-colors hover:text-[#374151]"
              onClick={onCreateAction}
            >
              Create action
            </button>
          ) : null}
        </>
      }
    />
  );
}
