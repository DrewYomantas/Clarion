import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import {
  getFirmActions,
  getReportDetail,
  updateReportAction,
  type ReportActionItem,
  type ReportDetail,
} from "@/api/authService";
import ActionForm, { type ActionFormValues } from "@/components/actions/ActionForm";
import GovStatusChip, {
  resolveChipVariantForActionStatus,
} from "@/components/governance/GovStatusChip";
import PageWrapper from "@/components/governance/PageWrapper";
import { formatApiDate } from "@/lib/dateTime";

type StatusLabel = "Open" | "In Progress" | "Completed" | "Overdue" | "Blocked";
type NextStateTone = "risk" | "warn" | "complete" | "active";

const isOverdue = (action: ReportActionItem): boolean => {
  if (!action.due_date) return false;
  if (action.status === "done") return false;
  const due = Date.parse(action.due_date);
  return Number.isFinite(due) && due < Date.now();
};

const hasNamedOwner = (action: ReportActionItem): boolean => {
  const owner = (action.owner || "").trim();
  return Boolean(owner && owner.toLowerCase() !== "unassigned");
};

const resolveStatusLabel = (action: ReportActionItem): StatusLabel => {
  if (action.status === "blocked") return "Blocked";
  if (isOverdue(action)) return "Overdue";
  if (action.status === "done") return "Completed";
  if (action.status === "in_progress") return "In Progress";
  return "Open";
};

const fmtLong = (value?: string | null) =>
  formatApiDate(value, { month: "long", day: "numeric", year: "numeric" }, "Not set");

const fmtShort = (value?: string | null) =>
  formatApiDate(value, { month: "short", day: "numeric" }, "Not set");

const buildActivityLog = (action: ReportActionItem) => {
  const entries = Array.isArray(action.activity_log) ? [...action.activity_log] : [];
  if (entries.length > 0) return entries;

  const fallback = [{ date: fmtShort(action.created_at), description: "Follow-through created" }];
  if (hasNamedOwner(action)) {
    fallback.push({
      date: fmtShort(action.updated_at || action.created_at),
      description: `Assigned to ${(action.owner || "").trim()}`,
    });
  }
  if (action.status && action.status !== "open") {
    fallback.push({
      date: fmtShort(action.updated_at || action.created_at),
      description: `Status updated to ${resolveStatusLabel(action)}`,
    });
  }
  return fallback;
};

const toFormValues = (action: ReportActionItem): ActionFormValues => ({
  title: action.title || "",
  owner: action.owner || "",
  owner_user_id: action.owner_user_id ?? null,
  due_date: action.due_date || "",
  status: (action.status as ActionFormValues["status"]) || "open",
  timeframe: (action.timeframe as ActionFormValues["timeframe"]) || "Days 1-30",
  kpi: action.kpi || "",
  notes: action.notes || "",
});

const resolveNextState = (action: ReportActionItem): { cue: string; cta: string; tone: NextStateTone } => {
  if (action.status === "done") {
    return { cue: "Completed.", cta: "Review source brief", tone: "complete" };
  }
  if (action.status === "blocked") {
    return { cue: "Blocked follow-through.", cta: "Update blocker", tone: "risk" };
  }
  if (isOverdue(action)) {
    return { cue: "Due date has passed. Review now.", cta: "Review due state", tone: "risk" };
  }
  if (!hasNamedOwner(action)) {
    return { cue: "No owner assigned.", cta: "Assign owner", tone: "warn" };
  }
  if (!action.due_date) {
    return { cue: "No due date set.", cta: "Set due date", tone: "warn" };
  }
  if (action.status === "in_progress") {
    return { cue: "In progress.", cta: "Update progress", tone: "active" };
  }
  return { cue: "Open.", cta: "Update follow-through", tone: "active" };
};

const toneClasses: Record<NextStateTone, { shell: string; marker: string; text: string }> = {
  risk: {
    shell: "border-red-200 bg-red-50/70",
    marker: "bg-[#DC2626]",
    text: "text-[#991B1B]",
  },
  warn: {
    shell: "border-amber-200 bg-amber-50/70",
    marker: "bg-[#C08403]",
    text: "text-[#92400E]",
  },
  complete: {
    shell: "border-emerald-200 bg-emerald-50/70",
    marker: "bg-[#059669]",
    text: "text-[#065F46]",
  },
  active: {
    shell: "border-[#C9D7E3] bg-[#F4F8FB]",
    marker: "bg-[#0EA5C2]",
    text: "text-[#0D1B2A]",
  },
};

const ActionDetail = () => {
  const { actionId } = useParams<{ actionId: string }>();
  const parsedId = Number(actionId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [action, setAction] = useState<ReportActionItem | null>(null);
  const [reportDetail, setReportDetail] = useState<ReportDetail | null>(null);
  const [allOwners, setAllOwners] = useState<string[]>([]);
  const [showEditForm, setShowEditForm] = useState(false);
  const [submittingEdit, setSubmittingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const loadAction = useCallback(async () => {
    const result = await getFirmActions();
    if (!result.success || !result.actions) return null;
    const owners = Array.from(
      new Set(result.actions.map((a) => (a.owner || "").trim()).filter(Boolean)),
    );
    setAllOwners(owners);
    return result.actions.find((a) => a.id === parsedId) ?? null;
  }, [parsedId]);

  useEffect(() => {
    if (!Number.isFinite(parsedId) || parsedId <= 0) {
      setError("Invalid follow-through ID.");
      setLoading(false);
      return;
    }

    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const found = await loadAction();
        if (!active) return;
        if (!found) {
          setError("Follow-through not found. It may have been deleted or you may not have access.");
          setLoading(false);
          return;
        }
        setAction(found);

        const reportId = Number(found.report_id || 0);
        if (reportId > 0) {
          const result = await getReportDetail(reportId);
          if (active && result.success && result.report) {
            setReportDetail(result.report);
          }
        }
      } catch {
        if (active) setError("Unable to load follow-through right now.");
      } finally {
        if (active) setLoading(false);
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, [loadAction, parsedId]);

  const handleSaveEdit = async (values: ActionFormValues) => {
    if (!action) return;
    const reportId = Number(action.report_id || 0);
    if (!reportId) {
      setEditError("This follow-through is not linked to a Governance Brief and cannot be updated.");
      return;
    }
    setSubmittingEdit(true);
    setEditError("");
    try {
      const result = await updateReportAction(reportId, action.id, {
        title: values.title,
        owner: values.owner || undefined,
        owner_user_id: values.owner_user_id,
        status: values.status,
        due_date: values.due_date || null,
        timeframe: values.timeframe,
        kpi: values.kpi,
        notes: values.notes,
      });
      if (!result.success) {
        const msg = result.error || "Unable to save changes.";
        setEditError(msg);
        toast.error(msg);
        return;
      }
      setAction((prev) =>
        prev
          ? {
              ...prev,
              title: values.title,
              owner: values.owner,
              owner_user_id: values.owner_user_id,
              status: values.status,
              due_date: values.due_date || null,
              timeframe: values.timeframe,
              kpi: values.kpi,
              notes: values.notes,
              updated_at: new Date().toISOString(),
            }
          : prev,
      );
      toast.success("Follow-through updated");
      setShowEditForm(false);
    } finally {
      setSubmittingEdit(false);
    }
  };

  const statusLabel = useMemo(() => (action ? resolveStatusLabel(action) : "Open"), [action]);
  const overdueFlag = useMemo(() => (action ? isOverdue(action) : false), [action]);
  const activityLog = useMemo(() => (action ? buildActivityLog(action) : []), [action]);
  const reportId = action ? Number(action.report_id || 0) || null : null;
  const nextState = useMemo(() => (action ? resolveNextState(action) : null), [action]);
  const sourceBriefName = reportDetail?.name || action?.report_name || (reportId ? `Governance Brief #${reportId}` : "No source brief");
  const tone = nextState ? toneClasses[nextState.tone] : toneClasses.active;

  const evidenceExcerpts = useMemo(() => {
    if (!reportDetail) return [];
    const complaints = Array.isArray(reportDetail.top_complaints) ? reportDetail.top_complaints : [];
    return complaints
      .slice(0, 2)
      .map((text, idx) => ({ id: idx, text: String(text || "").trim() }))
      .filter((excerpt) => excerpt.text);
  }, [reportDetail]);

  const signalHint = useMemo(() => {
    if (!action) return null;
    const text = [action.title, action.notes || ""].join(" ").trim();
    return text.length > 0 ? text.split(/[:.]/)[0].trim() : null;
  }, [action]);

  const openEditForm = () => {
    setEditError("");
    setShowEditForm(true);
  };

  const primaryAction =
    action?.status === "done"
      ? {
          type: "link" as const,
          label: reportId ? "Review source brief" : "Back to Follow-Through",
          to: reportId ? `/dashboard/reports/${reportId}` : "/dashboard/actions",
        }
      : { type: "button" as const, label: nextState?.cta || "Update follow-through" };

  return (
    <PageWrapper
      title="Follow-through record"
      description="Review ownership, due-state, source brief, and next step before the next meeting."
      contentClassName="stage-sequence"
    >
      <div>
        <Link to="/dashboard/actions" className="text-[13px] font-semibold text-[#BDD2E1] hover:text-white">
          Back to Follow-Through
        </Link>
      </div>

      {error ? (
        <section className="rounded-lg border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-800">
          {error}
        </section>
      ) : null}

      {loading ? (
        <section className="space-y-5">
          <div className="h-64 animate-pulse rounded-lg border border-[#E5E7EB] bg-white" />
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="h-44 animate-pulse rounded-lg border border-[#E5E7EB] bg-white" />
            <div className="h-44 animate-pulse rounded-lg border border-[#E5E7EB] bg-white" />
          </div>
        </section>
      ) : action && nextState ? (
        <div className="space-y-6">
          <section className="overflow-hidden rounded-lg border border-[#C9D7E3]/70 bg-white shadow-[0_18px_50px_rgba(13,27,42,0.12)]">
            <div className="border-b border-[#E8EDF2] bg-[#F8FAFC] px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <GovStatusChip
                    label={statusLabel}
                    variant={resolveChipVariantForActionStatus(action.status, overdueFlag)}
                  />
                  <span className="gov-type-eyebrow">Accountability record</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {primaryAction.type === "link" ? (
                    <Link
                      to={primaryAction.to}
                      className="inline-flex items-center justify-center rounded-lg bg-[#0D1B2A] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#16263b]"
                    >
                      {primaryAction.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg bg-[#0D1B2A] px-4 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-[#16263b]"
                      onClick={openEditForm}
                    >
                      {primaryAction.label}
                    </button>
                  )}
                  {!showEditForm ? (
                    <button
                      type="button"
                      className="inline-flex items-center justify-center rounded-lg border border-[#C9D0D8] bg-white px-4 py-2 text-[13px] font-semibold text-[#0D1B2A] transition-colors hover:bg-[#F5F7FA]"
                      onClick={openEditForm}
                    >
                      Edit follow-through
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="px-6 py-6">
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
                <div>
                  <h1 className="max-w-3xl text-[28px] font-bold leading-tight text-[#0D1B2A]">{action.title}</h1>
                  <div className={["mt-5 rounded-lg border px-4 py-3", tone.shell].join(" ")}>
                    <div className="flex items-start gap-3">
                      <span className={["mt-1 h-2.5 w-2.5 shrink-0 rounded-full", tone.marker].join(" ")} />
                      <div>
                        <p className={["text-[14px] font-bold leading-5", tone.text].join(" ")}>{nextState.cue}</p>
                        <p className="mt-1 text-[12px] leading-5 text-[#4B5563]">
                          {action.status === "done"
                            ? "No open update is required from this record."
                            : "Confirm ownership, due-state, and progress before the next meeting."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-lg border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3">
                    <dt className="gov-type-eyebrow">Owner</dt>
                    <dd className="mt-1 text-[14px] font-semibold text-[#0D1B2A]">
                      {hasNamedOwner(action) ? (action.owner || "").trim() : "No owner assigned"}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3">
                    <dt className="gov-type-eyebrow">Due date</dt>
                    <dd className={["mt-1 text-[14px] font-semibold", overdueFlag ? "text-[#B91C1C]" : "text-[#0D1B2A]"].join(" ")}>
                      {action.due_date ? `${fmtLong(action.due_date)}${overdueFlag ? " - overdue" : ""}` : "No due date set"}
                    </dd>
                  </div>
                  <div className="rounded-lg border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3">
                    <dt className="gov-type-eyebrow">Source brief</dt>
                    <dd className="mt-1 text-[14px] font-semibold text-[#0D1B2A]">{sourceBriefName}</dd>
                  </div>
                  <div className="rounded-lg border border-[#DDD8D0] bg-[#FBFAF8] px-4 py-3">
                    <dt className="gov-type-eyebrow">Timeframe</dt>
                    <dd className="mt-1 text-[14px] font-semibold text-[#0D1B2A]">
                      {action.timeframe || "No timeframe set"}
                    </dd>
                  </div>
                </dl>
              </div>

              {showEditForm ? (
                <div className="mt-6 rounded-lg border border-[#D7DEE8] bg-[#F8FAFC] p-4">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="gov-type-eyebrow">Controlled update</p>
                      <p className="mt-1 text-[13px] font-medium text-[#4B5563]">
                        Update owner, due date, status, or success measure.
                      </p>
                    </div>
                  </div>
                  <ActionForm
                    open
                    mode="edit"
                    initialValues={toFormValues(action)}
                    ownerOptions={allOwners}
                    submitting={submittingEdit}
                    submitLabel="Save changes"
                    submittingLabel="Saving..."
                    serverError={editError}
                    onCancel={() => {
                      if (submittingEdit) return;
                      setEditError("");
                      setShowEditForm(false);
                    }}
                    onSubmit={handleSaveEdit}
                  />
                </div>
              ) : null}
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start">
            <main className="space-y-5">
              <section className="rounded-lg border border-[#DDD8D0] bg-white px-6 py-5 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
                <p className="gov-type-eyebrow">Work to confirm</p>
                {action.kpi ? (
                  <div className="mt-4">
                    <p className="gov-type-eyebrow">Success measure</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-[#0D1B2A]">{action.kpi}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-[13px] font-medium text-[#6B7280]">No success measure set.</p>
                )}
                {action.notes ? (
                  <div className="mt-4 border-t border-[#ECE8E1] pt-4">
                    <p className="gov-type-eyebrow">Notes</p>
                    <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed text-[#374151]">{action.notes}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-[13px] font-medium text-[#6B7280]">No notes added.</p>
                )}
              </section>

              <section className="rounded-lg border border-[#DDD8D0] bg-white px-6 py-5 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
                <p className="gov-type-eyebrow">Source context</p>
                <h2 className="mt-1 text-[16px] font-semibold text-[#0D1B2A]">
                  {signalHint ? signalHint : "Client feedback signal"}
                </h2>
                <p className="mt-2 text-[13px] leading-relaxed text-[#374151]">
                  {reportId
                    ? "This follow-through is tied to the current Governance Brief and should stay visible until ownership and progress are confirmed."
                    : "No source Governance Brief is linked to this follow-through."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/dashboard/signals"
                    className="inline-flex items-center rounded-md border border-[#D1D5DB] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0D1B2A] transition-colors hover:bg-[#F5F7FA]"
                  >
                    Review issues
                  </Link>
                  {reportId ? (
                    <Link
                      to={`/dashboard/reports/${reportId}`}
                      className="inline-flex items-center rounded-md border border-[#D1D5DB] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0D1B2A] transition-colors hover:bg-[#F5F7FA]"
                    >
                      Open Governance Brief
                    </Link>
                  ) : null}
                </div>

                {evidenceExcerpts.length > 0 ? (
                  <div className="mt-5 space-y-3">
                    <p className="gov-type-eyebrow">Client evidence</p>
                    {evidenceExcerpts.map((excerpt) => (
                      <blockquote
                        key={excerpt.id}
                        className="rounded-lg border border-red-100 border-l-[3px] border-l-[#F87171] bg-red-50/30 px-4 py-3"
                      >
                        <p className="text-[13px] leading-relaxed text-[#374151]">&quot;{excerpt.text}&quot;</p>
                        <p className="mt-1.5 text-[11px] font-medium text-[#6B7280]">Anonymous client feedback</p>
                      </blockquote>
                    ))}
                  </div>
                ) : null}
              </section>
            </main>

            <aside className="space-y-5">
              <section className="rounded-lg border border-[#DDD8D0] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
                <p className="gov-type-eyebrow">Related navigation</p>
                <div className="mt-3 space-y-2">
                  <Link
                    to="/dashboard/actions"
                    className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#FBFAF8] px-3 py-2.5 text-[13px] font-semibold text-[#0D1B2A] transition-colors hover:bg-[#F4F1EC]"
                  >
                    Follow-Through
                    <span className="text-[11px] text-[#5A6470]">Open</span>
                  </Link>
                  {reportId ? (
                    <Link
                      to={`/dashboard/reports/${reportId}`}
                      className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#FBFAF8] px-3 py-2.5 text-[13px] font-semibold text-[#0D1B2A] transition-colors hover:bg-[#F4F1EC]"
                    >
                      Governance Brief
                      <span className="text-[11px] text-[#5A6470]">Open</span>
                    </Link>
                  ) : null}
                </div>
              </section>

              <section className="rounded-lg border border-[#DDD8D0] bg-white px-5 py-4 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
                <p className="gov-type-eyebrow">Activity history</p>
                {activityLog.length > 0 ? (
                  <ol className="relative mt-4 ml-2 space-y-4 border-l border-[#E5E7EB] pl-4">
                    {activityLog.map((entry, idx) => (
                      <li key={`tl-${idx}`} className="relative">
                        <span className="absolute -left-[21px] top-[3px] h-2 w-2 rounded-full border-2 border-[#0EA5C2] bg-white" />
                        <p className="text-[13px] font-semibold text-[#0D1B2A]">{entry.description}</p>
                        <p className="text-[11px] font-medium text-[#6B7280]">{entry.date}</p>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <p className="mt-3 text-[12px] font-medium text-[#6B7280]">No activity recorded.</p>
                )}
              </section>
            </aside>
          </div>
        </div>
      ) : null}
    </PageWrapper>
  );
};

export default ActionDetail;
