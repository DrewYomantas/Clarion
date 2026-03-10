/**
 * RecentGovernanceBriefs
 * Dashboard section component showing the last 3 ready briefs.
 * Refactored to use the shared GovernanceBriefCard pattern.
 */

import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

import type { ReportListItem } from "@/api/authService";
import { DashboardCard } from "@/components/ui/card";
import GovernanceBriefCard from "@/components/governance/GovernanceBriefCard";
import { formatApiDate } from "@/lib/dateTime";

type RecentGovernanceBriefsProps = {
  briefs: ReportListItem[];
  escalationReportId?: number | null;
  hasEscalation?: boolean | null;
  onView: (reportId: number) => void;
  onDownload: (brief: ReportListItem) => Promise<void>;
};

const formatBriefTitle = (value: string) => {
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return "Unknown period";
  const month = date.toLocaleDateString([], { month: "long", year: "numeric" });
  return `${month} Brief`;
};

export default function RecentGovernanceBriefs({
  briefs,
  escalationReportId,
  hasEscalation,
  onView,
  onDownload,
}: RecentGovernanceBriefsProps) {
  return (
    <DashboardCard
      title="Recent governance briefs"
      subtitle="Recent leadership-ready outputs from completed review cycles."
    >
      {briefs.length === 0 ? (
        <p className="text-sm text-neutral-700">No governance briefs generated yet. Upload feedback to begin.</p>
      ) : (
        <div className="space-y-3">
          {briefs.map((brief) => {
            const escalationRequired = Boolean(
              hasEscalation && escalationReportId && brief.id === escalationReportId,
            );
            const dateLabel = formatApiDate(
              brief.created_at,
              { month: "long", day: "numeric", year: "numeric" },
              "Unknown date",
            );

            return (
              <GovernanceBriefCard
                key={brief.id}
                title={formatBriefTitle(brief.created_at)}
                dateLabel={dateLabel}
                status={escalationRequired ? "escalation" : "ready"}
                planType={brief.plan_type}
                onView={() => onView(brief.id)}
                onDownload={() => void onDownload(brief)}
              />
            );
          })}
          <div className="pt-1">
            <Link
              to="/dashboard/reports"
              className="inline-flex items-center gap-1 text-[12px] font-medium text-neutral-700 hover:text-neutral-900"
            >
              View all briefs
              <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      )}
    </DashboardCard>
  );
}
