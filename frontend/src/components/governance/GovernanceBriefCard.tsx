import GovernanceCard from "./GovernanceCard";
import GovStatusChip from "./GovStatusChip";

export type BriefStatus = "ready" | "escalation" | "pending" | "sent" | "acknowledged";

export type GovernanceBriefCardProps = {
  title: string;
  meetingDate?: string;
  dateLabel: string;
  description?: string;
  status: BriefStatus;
  generatedBy?: string;
  planType?: string;
  isPast?: boolean;
  onView?: () => void;
  onDownload?: () => void;
  onPrepare?: () => void;
};

const statusChipMap: Record<BriefStatus, { label: string; variant: "risk" | "warn" | "success" | "muted" | "info" }> = {
  escalation: { label: "Decision required", variant: "warn" },
  ready: { label: "Brief prepared", variant: "success" },
  pending: { label: "Draft", variant: "muted" },
  sent: { label: "Sent", variant: "info" },
  acknowledged: { label: "Acknowledged", variant: "success" },
};

const accentMap: Record<BriefStatus, "warn" | "success" | "neutral"> = {
  escalation: "warn",
  ready: "success",
  pending: "neutral",
  sent: "success",
  acknowledged: "success",
};

function buildDescription(status?: BriefStatus): string | undefined {
  if (status === "escalation") {
    return "Decision required before the next partner meeting.";
  }
  if (status === "ready") {
    return "Brief prepared for partner review.";
  }
  return undefined;
}

export default function GovernanceBriefCard({
  title,
  meetingDate,
  dateLabel,
  description,
  status,
  generatedBy,
  planType,
  isPast = false,
  onView,
  onDownload,
  onPrepare,
}: GovernanceBriefCardProps) {
  const { label: chipLabel, variant: chipVariant } = statusChipMap[status] ?? statusChipMap.ready;
  const metaItems: string[] = [];
  if (meetingDate) metaItems.push(meetingDate);
  metaItems.push(`Generated ${dateLabel}`);
  if (generatedBy && generatedBy !== "System") metaItems.push(`by ${generatedBy}`);

  const summaryLine = description ?? buildDescription(status);
  const downloadLabel = planType === "free" ? "Preview PDF" : "Download PDF";

  return (
    <GovernanceCard
      title={title}
      accent={accentMap[status] ?? "neutral"}
      chip={<GovStatusChip label={chipLabel} variant={chipVariant} />}
      summary={summaryLine}
      meta={metaItems}
      className={isPast ? "reports-brief-card" : "reports-brief-card reports-brief-card--current"}
      actions={
        <>
          {!isPast && onPrepare ? (
            <button
              type="button"
              onClick={onPrepare}
              className="inline-flex items-center rounded-[6px] bg-[#0D1B2A] px-3 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#16263b]"
            >
              Enter Meeting Room
            </button>
          ) : null}
          {onView ? (
            <button
              type="button"
              onClick={onView}
              className="inline-flex items-center rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0D1B2A] transition-colors hover:bg-slate-50"
            >
              Open Brief
            </button>
          ) : null}
          {onDownload ? (
            <button
              type="button"
              onClick={onDownload}
              className="inline-flex items-center rounded-[6px] border border-[#D1D5DB] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0D1B2A] transition-colors hover:bg-slate-50"
            >
              {downloadLabel}
            </button>
          ) : null}
        </>
      }
    />
  );
}
