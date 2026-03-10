/**
 * ActionCard
 * Renders a single governance action using the shared GovernanceCard pattern.
 * Refactored from ad-hoc layout to GovernanceCard + GovStatusChip.
 *
 * Zones:
 *   header  → action title + status chip
 *   meta    → owner · due date
 *   detail  → collapsible activity log
 *   actions → "Open report" link
 */

import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { type ReportActionItem } from "@/api/authService";
import { formatApiDate, parseApiDate } from "@/lib/dateTime";
import GovernanceCard, { type GovernanceCardAccent } from "@/components/governance/GovernanceCard";
import GovStatusChip, { type GovStatusChipVariant } from "@/components/governance/GovStatusChip";

type ActionCardProps = {
  action: ReportActionItem;
};

const isOverdue = (action: ReportActionItem): boolean => {
  if (!action.due_date) return false;
  if (action.status === "done") return false;
  const dueDate = parseApiDate(action.due_date);
  return Boolean(dueDate && dueDate.getTime() < Date.now());
};

type StatusLabel = "Open" | "In Progress" | "Completed" | "Overdue" | "Blocked";

const resolveStatusLabel = (action: ReportActionItem): StatusLabel => {
  if (action.status === "blocked") return "Blocked";
  if (isOverdue(action)) return "Overdue";
  if (action.status === "done") return "Completed";
  if (action.status === "in_progress") return "In Progress";
  return "Open";
};

const statusToChipVariant: Record<StatusLabel, GovStatusChipVariant> = {
  Overdue:     "risk",
  Blocked:     "risk",
  "In Progress": "warn",
  Completed:   "success",
  Open:        "muted",
};

const statusToAccent: Record<StatusLabel, GovernanceCardAccent> = {
  Overdue:     "risk",
  Blocked:     "risk",
  "In Progress": "warn",
  Completed:   "success",
  Open:        "neutral",
};

const monthDay = (value?: string | null) =>
  formatApiDate(value, { month: "short", day: "numeric" }, "Date unavailable");

const buildActivityLog = (action: ReportActionItem) => {
  const entries = Array.isArray(action.activity_log) ? [...action.activity_log] : [];
  if (entries.length === 0) {
    entries.push({ date: monthDay(action.created_at), description: "Action created" });
    const owner = (action.owner || "").trim();
    if (owner && owner.toLowerCase() !== "unassigned") {
      entries.push({
        date: monthDay(action.updated_at || action.created_at),
        description: `Assigned to Partner ${owner}`,
      });
    }
    if (action.status && action.status !== "open") {
      entries.push({
        date: monthDay(action.updated_at || action.created_at),
        description: `Status updated to ${resolveStatusLabel(action)}`,
      });
    }
  }
  return entries;
};

const ActionCard = ({ action }: ActionCardProps) => {
  const [showActivity, setShowActivity] = useState(false);
  const label = resolveStatusLabel(action);
  const owner = action.owner?.trim() || "";
  const dueDate = action.due_date
    ? formatApiDate(action.due_date, { month: "short", day: "numeric" }, "No due date")
    : "";
  const reportId = Number(action.report_id || 0) || null;
  const activity = useMemo(() => buildActivityLog(action), [action]);

  const metaItems: string[] = [
    owner ? `Partner: ${owner}` : "Unassigned",
    action.due_date
      ? (isOverdue(action) ? `Due ${dueDate} — overdue` : `Due ${dueDate}`)
      : "No due date set",
  ];

  return (
    <GovernanceCard
      title={action.title}
      titleHref={`/dashboard/actions/${action.id}`}
      accent={statusToAccent[label]}
      chip={<GovStatusChip label={label} variant={statusToChipVariant[label]} />}
      meta={metaItems}
      detail={
        <div>
          <button
            type="button"
            className="text-[12px] text-[#9CA3AF] underline underline-offset-4 transition-colors hover:text-slate-700"
            onClick={() => setShowActivity((prev) => !prev)}
          >
            {showActivity ? "Hide activity" : "Show activity"}
          </button>
          {showActivity ? (
            <ul className="mt-2 space-y-1">
              {activity.map((entry, index) => (
                <li
                  key={`${entry.date}-${entry.description}-${index}`}
                  className="text-[12px] text-[#9CA3AF]"
                >
                  {entry.date} — {entry.description}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      }
      actions={
        reportId ? (
          <Link className="text-[12px] text-[#6B7280] underline underline-offset-4 transition-colors hover:text-slate-700" to={`/dashboard/reports/${reportId}`}>
            Open report
          </Link>
        ) : undefined
      }
    />
  );
};

export default ActionCard;
