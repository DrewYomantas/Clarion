import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

import GovernanceEmptyState from "@/components/governance/GovernanceEmptyState";
import { ActionColumnSkeleton } from "@/components/governance/skeletons";
import {
  createReportAction,
  deleteReportAction,
  getFirmActions,
  getReports,
  type ReportActionItem,
  type ReportListItem,
} from "@/api/authService";
import ActionForm, { type ActionFormValues } from "@/components/actions/ActionForm";
import ActionCard from "@/components/actions/ActionCard";
import PageWrapper from "@/components/governance/PageWrapper";
import { PageTabs } from "@/components/governance/PageTabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";

type StatusFilter = "all" | "open" | "in_progress" | "blocked" | "done" | "overdue";

const isOverdue = (action: ReportActionItem): boolean => {
  if (!action.due_date) return false;
  if (action.status === "done") return false;
  const due = new Date(action.due_date).getTime();
  return Number.isFinite(due) && due < Date.now();
};

const actionMatchesStatus = (action: ReportActionItem, status: StatusFilter) => {
  if (status === "all") return true;
  if (status === "overdue") return isOverdue(action);
  if (status === "blocked") return action.status === "blocked";
  if (status === "open") return action.status === "open" && !isOverdue(action);
  return action.status === status;
};

const normalizeOwnerKey = (action: ReportActionItem): string => {
  if (typeof action.owner_user_id === "number") return `user:${action.owner_user_id}`;
  const owner = (action.owner || "").trim().toLowerCase();
  return owner ? `name:${owner}` : "unassigned";
};

const ownerLabel = (action: ReportActionItem): string => {
  const owner = (action.owner || "").trim();
  return owner || "Unassigned";
};

const hasOwner = (action: ReportActionItem): boolean => Boolean((action.owner || "").trim());

const ExecutionPage = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [actions, setActions] = useState<ReportActionItem[]>([]);
  const [reports, setReports] = useState<ReportListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creatingAction, setCreatingAction] = useState(false);
  const [createActionError, setCreateActionError] = useState("");
  const [targetReportId, setTargetReportId] = useState<number | null>(null);
  const [actionsTab, setActionsTab] = useState<"firm-wide" | "my-actions" | "overdue">("firm-wide");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [ownerFilter, setOwnerFilter] = useState<string>("all");
  const [reportFilter, setReportFilter] = useState<string>("all");

  const isOverdueOnlyFilter = searchParams.get("filter") === "overdue";
  const readyReports = useMemo(
    () => reports.filter((report) => report.status === "ready"),
    [reports],
  );
  const latestReadyReport = useMemo(
    () =>
      readyReports
        .slice()
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] || null,
    [readyReports],
  );
  const hasReadyCycle = readyReports.length > 0;
  const hasAnyCycle = reports.length > 0;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      const [actionsResult, reportsResult] = await Promise.all([getFirmActions(), getReports(120)]);
      if (!mounted) return;

      if (!actionsResult.success || !actionsResult.actions) {
        setError(actionsResult.error || "Unable to load actions.");
        setActions([]);
      } else {
        setError("");
        setActions(actionsResult.actions);
      }

      if (reportsResult.success && reportsResult.reports) {
        setReports(reportsResult.reports);
      } else {
        setReports([]);
      }

      setLoading(false);
    };

    void load();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (targetReportId) return;
    const ready = readyReports
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    const fallback = reports
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
    const preferred = ready || fallback;
    setTargetReportId(preferred?.id ?? null);
  }, [readyReports, reports, targetReportId]);

  const ownerOptions = useMemo(() => {
    const options = new Map<string, string>();
    actions.forEach((action) => {
      options.set(normalizeOwnerKey(action), ownerLabel(action));
    });
    return [...options.entries()]
      .map(([value, label]) => ({ value, label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [actions]);

  const ownerSuggestions = useMemo(
    () => ownerOptions.map((option) => option.label).filter((label) => label !== "Unassigned"),
    [ownerOptions],
  );

  const reportOptions = useMemo(() => {
    const byId = new Map<number, string>();
    actions.forEach((action) => {
      const reportId = Number(action.report_id || 0);
      if (!reportId) return;
      const reportName = action.report_name || reports.find((r) => r.id === reportId)?.name || `Report #${reportId}`;
      byId.set(reportId, reportName);
    });
    return [...byId.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => b.id - a.id);
  }, [actions, reports]);

  const filteredActions = useMemo(() => {
    return actions.filter((action) => {
      if (isOverdueOnlyFilter && !isOverdue(action)) return false;
      if (!actionMatchesStatus(action, statusFilter)) return false;
      if (ownerFilter !== "all" && normalizeOwnerKey(action) !== ownerFilter) return false;
      if (reportFilter !== "all" && String(action.report_id || "") !== reportFilter) return false;
      return true;
    });
  }, [actions, isOverdueOnlyFilter, ownerFilter, reportFilter, statusFilter]);

  const myActionsSet = useMemo(() => {
    if (!user) return filteredActions;
    const myName = (user.name || "").trim().toLowerCase();
    const myEmail = (user.email || "").trim().toLowerCase();
    return filteredActions.filter((action) => {
      const owner = (action.owner || "").trim().toLowerCase();
      return (myName && owner === myName) || (myEmail && owner === myEmail);
    });
  }, [filteredActions, user]);

  const overdueActionsSet = useMemo(
    () => filteredActions.filter((action) => isOverdue(action)),
    [filteredActions],
  );

  const tabActions = useMemo(() => {
    if (actionsTab === "my-actions") return myActionsSet;
    if (actionsTab === "overdue") return overdueActionsSet;
    return filteredActions;
  }, [actionsTab, filteredActions, myActionsSet, overdueActionsSet]);

  const overdueNow = useMemo(() => tabActions.filter((action) => isOverdue(action)), [tabActions]);
  const blockedNow = useMemo(
    () => tabActions.filter((action) => action.status === "blocked" && !isOverdue(action)),
    [tabActions],
  );
  const unownedNow = useMemo(
    () =>
      tabActions.filter(
        (action) =>
          action.status !== "done" &&
          action.status !== "blocked" &&
          !isOverdue(action) &&
          !hasOwner(action),
      ),
    [tabActions],
  );
  const openReview = useMemo(
    () =>
      tabActions.filter(
        (action) => action.status === "open" && !isOverdue(action) && hasOwner(action),
      ),
    [tabActions],
  );
  const inProgressReview = useMemo(
    () =>
      tabActions.filter(
        (action) => action.status === "in_progress" && !isOverdue(action) && hasOwner(action),
      ),
    [tabActions],
  );
  const completedActions = useMemo(
    () => tabActions.filter((action) => action.status === "done"),
    [tabActions],
  );

  const summary = useMemo(
    () => ({
      overdue: overdueNow.length,
      unowned: tabActions.filter((action) => action.status !== "done" && !hasOwner(action)).length,
      blocked: tabActions.filter((action) => action.status === "blocked").length,
      needsReview: tabActions.filter((action) => action.status !== "done").length,
    }),
    [overdueNow.length, tabActions],
  );

  const accountabilityDirective = useMemo(() => {
    if (summary.overdue > 0) {
      return `${summary.overdue} overdue follow-through item${summary.overdue === 1 ? "" : "s"} need review now.`;
    }
    if (summary.unowned > 0) {
      return `${summary.unowned} follow-through item${summary.unowned === 1 ? "" : "s"} still need a named owner before the next meeting.`;
    }
    if (summary.blocked > 0) {
      return `${summary.blocked} blocked item${summary.blocked === 1 ? "" : "s"} may stall the current governance cycle.`;
    }
    if (summary.needsReview > 0) {
      return `${summary.needsReview} active follow-through item${summary.needsReview === 1 ? " is" : "s are"} moving without immediate risk.`;
    }
    return "Current follow-through is clear. Completed items remain available as cycle history.";
  }, [summary.blocked, summary.needsReview, summary.overdue, summary.unowned]);

  const resetFilters = () => {
    setStatusFilter("all");
    setOwnerFilter("all");
    setReportFilter("all");
  };

  const hasActiveFilters =
    statusFilter !== "all" ||
    ownerFilter !== "all" ||
    reportFilter !== "all" ||
    isOverdueOnlyFilter;

  const clearUrlFilter = () => {
    const next = new URLSearchParams(searchParams);
    next.delete("filter");
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    resetFilters();
    if (isOverdueOnlyFilter) {
      clearUrlFilter();
    }
  };

  const openCreateActionModal = () => {
    if (!hasReadyCycle || !targetReportId) {
      toast.message("Add follow-through after the first brief is ready.");
      return;
    }
    setCreateActionError("");
    setCreateModalOpen(true);
  };

  const closeCreateActionModal = () => {
    setCreateActionError("");
    setCreateModalOpen(false);
  };

  const createActionInitialValues: ActionFormValues = {
    title: "",
    owner: "",
    owner_user_id: null,
    due_date: "",
    status: "open",
    timeframe: "Days 1-30",
    kpi: "",
    notes: "",
  };

  const handleCreateAction = async (values: ActionFormValues) => {
    if (!targetReportId) {
      setCreateActionError("No governance brief is available yet. Generate a report first, then add follow-through.");
      return;
    }

    setCreatingAction(true);
    setCreateActionError("");
    const result = await createReportAction(targetReportId, {
      title: values.title,
      owner: values.owner || undefined,
      owner_user_id: values.owner_user_id,
      status: values.status,
      due_date: values.due_date || null,
      timeframe: values.timeframe,
      kpi: values.kpi,
      notes: values.notes,
    });
    setCreatingAction(false);

    if (!result.success || !result.action) {
      setCreateActionError(result.error || "Unable to create action.");
      return;
    }

    setActions((prev) => [result.action as ReportActionItem, ...prev]);
    toast.success("Follow-through item created.");
    closeCreateActionModal();
  };

  const handleDeleteAction = async (actionId: number) => {
    const target = actions.find((a) => a.id === actionId);
    if (!target) return;
    const reportId = Number(target.report_id || 0);
    if (!reportId) {
      toast.error("Unable to delete: action has no linked report.");
      return;
    }
    const result = await deleteReportAction(reportId, actionId);
    if (!result.success) {
      toast.error(result.error || "Unable to delete action.");
      return;
    }
    setActions((prev) => prev.filter((a) => a.id !== actionId));
    toast.success("Follow-through item deleted.");
  };

  const renderActionGroup = (
    title: string,
    description: string,
    actionsForGroup: ReportActionItem[],
    emptyTitle: string,
    emptyDescription: string,
    accent: "risk" | "warn" | "neutral" | "success" = "neutral",
  ) => {
    const borderAccent =
      accent === "risk"
        ? "border-l-[3px] border-l-[#EF4444]"
        : accent === "warn"
          ? "border-l-[3px] border-l-[#F59E0B]"
          : accent === "success"
            ? "border-l-[3px] border-l-[#10B981]"
            : "border-l-[3px] border-l-[#CBD5E1]";

    const headerAccentColor =
      accent === "risk"
        ? "text-[#B91C1C]"
        : accent === "warn"
          ? "text-[#B45309]"
          : accent === "success"
            ? "text-[#166534]"
            : "text-[#7A6E63]";

    const emptyBg =
      accent === "risk"
        ? "rounded-lg border border-red-100/80 bg-red-50/30"
        : accent === "warn"
          ? "rounded-lg border border-amber-100/80 bg-amber-50/30"
          : accent === "success"
            ? "rounded-lg border border-emerald-100/80 bg-emerald-50/20"
            : "rounded-lg border border-[#DDD8D0] bg-[#F9F8F6]";

    return (
      <div className={[
        "space-y-2 rounded-lg border border-[#DDD8D0] bg-white px-4 py-4 shadow-[0_1px_3px_rgba(13,27,42,0.05)]",
        borderAccent,
      ].join(" ")}>
        <div className="border-b border-[#F0EDE8] pb-2.5">
          <p className={`text-[11px] font-bold uppercase tracking-[0.08em] ${headerAccentColor}`}>{title}</p>
          <p className="mt-0.5 text-[12px] leading-5 text-[#5A6470]">{description}</p>
        </div>
        {actionsForGroup.length > 0 ? (
          <div className="space-y-3">
            {actionsForGroup.map((action) => (
              <ActionCard key={`${title}-${action.id}`} action={action} onDelete={handleDeleteAction} />
            ))}
          </div>
        ) : (
          <GovernanceEmptyState
            size="sm"
            icon={<ClipboardList size={18} />}
            title={emptyTitle}
            description={emptyDescription}
            className={emptyBg}
          />
        )}
      </div>
    );
  };

  return (
    <PageWrapper
      eyebrow="Assigned Follow-Through"
      title="Follow-through for the current brief"
      description="The assigned follow-through record for the current Governance Brief. Review ownership, due-state, and blockers before the next meeting."
      contentClassName="stage-sequence"
      actions={
        <>
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-[8px] border border-[#DDD8D0] bg-transparent px-4 py-2 text-sm font-medium text-[#0D1B2A] transition-colors hover:bg-[#F5F3F0] disabled:cursor-not-allowed disabled:text-[#9CA3AF] disabled:hover:bg-transparent"
            onClick={handleResetFilters}
            disabled={!hasActiveFilters}
          >
            Reset view
          </button>
          {latestReadyReport ? (
            <Link
              className="inline-flex items-center justify-center rounded-[8px] border border-[#DDD8D0] bg-white px-4 py-2 text-sm font-medium text-[#0D1B2A] transition-colors hover:bg-[#F5F3F0]"
              to={`/dashboard/reports/${latestReadyReport.id}`}
            >
              Open current brief
            </Link>
          ) : null}
          <Link
            className={[
              "inline-flex items-center justify-center rounded-[8px] px-4 py-2 text-sm font-semibold transition-colors",
              hasReadyCycle
                ? "bg-[#0D1B2A] text-white hover:bg-[#16263b]"
                : "cursor-not-allowed border border-[#DDD8D0] bg-white text-[#9CA3AF] hover:bg-white",
            ].join(" ")}
            to={hasReadyCycle ? "#" : "/dashboard"}
            aria-disabled={!hasReadyCycle}
            onClick={(event) => {
              if (!hasReadyCycle) {
                event.preventDefault();
                return;
              }
              event.preventDefault();
              openCreateActionModal();
            }}
          >
            {hasReadyCycle ? "Add follow-through" : "Add follow-through after first cycle"}
          </Link>
        </>
      }
    >
      {/* Dark header slab */}
      <section className="overflow-hidden rounded-[16px] border border-white/[0.13] shadow-[0_16px_48px_rgba(0,0,0,0.22),0_0_0_1px_rgba(255,255,255,0.04)]">
        {/* Top: identity + directive */}
        <div
          className="relative px-7 py-6"
          style={{ background: "linear-gradient(150deg, #0B1929 0%, #0e2139 55%, #0D1B2A 100%)" }}
        >
          <div className="relative flex flex-wrap items-start justify-between gap-5">
            <div>
              <span className="inline-flex items-center gap-2">
                <span className="h-[12px] w-[2px] rounded-full bg-[#C4A96A]/50" aria-hidden />
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8AB4D1]">Follow-Through</span>
              </span>
              <h2
                className="mt-3 text-[26px] leading-[1.05] text-white sm:text-[30px]"
                style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 500 }}
              >
                {hasReadyCycle ? "Cycle follow-through" : "Waiting for first brief"}
              </h2>
              <p className="mt-2 max-w-xl text-[14px] font-medium leading-6 text-[#B8CAD9]">
                {hasReadyCycle
                  ? "Review ownership, due-state, and blockers before the next meeting."
                  : "Follow-through opens after the first governance brief is ready. Upload feedback to begin."}
              </p>
            </div>
          </div>
        </div>

        {/* Guidance directive band */}
        <div
          className="relative px-7 py-2.5"
          style={{ background: "#0D1B2A", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className={[
            "absolute inset-y-0 left-0 w-[3px]",
            summary.overdue > 0 ? "bg-[#F87171]" : summary.unowned > 0 ? "bg-[#F59E0B]" : "bg-[#0EA5C2]",
          ].join(" ")} />
          <p className="text-[12px] font-semibold text-[#BDD2E1]">
            <span className={[
              "mr-1.5",
              summary.overdue > 0 ? "text-[#F87171]" : summary.unowned > 0 ? "text-[#F59E0B]" : "text-[#0EA5C2]",
            ].join(" ")}>{"->"}</span>
            {accountabilityDirective}
          </p>
        </div>

        <div
          className="flex flex-wrap divide-x divide-white/[0.07]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "#080F1C" }}
        >
          <div className="min-w-[88px] px-5 py-3.5">
            <p
              className="text-[22px] font-semibold leading-none"
              style={{ fontVariantNumeric: "tabular-nums", color: summary.overdue > 0 ? "#F87171" : "#ffffff" }}
            >
              {loading ? "-" : summary.overdue}
            </p>
            <p className="mt-1.5 text-[10.5px] font-semibold tracking-[0.04em] text-[#86A9C4]">Overdue</p>
          </div>
          <div className="min-w-[88px] px-5 py-3.5">
            <p
              className="text-[22px] font-semibold leading-none"
              style={{ fontVariantNumeric: "tabular-nums", color: summary.unowned > 0 ? "#F59E0B" : "#ffffff" }}
            >
              {loading ? "-" : summary.unowned}
            </p>
            <p className="mt-1.5 text-[10.5px] font-semibold tracking-[0.04em] text-[#86A9C4]">Unowned</p>
          </div>
          <div className="min-w-[88px] px-5 py-3.5">
            <p
              className="text-[22px] font-semibold leading-none"
              style={{ fontVariantNumeric: "tabular-nums", color: summary.blocked > 0 ? "#F59E0B" : "#ffffff" }}
            >
              {loading ? "-" : summary.blocked}
            </p>
            <p className="mt-1.5 text-[10.5px] font-semibold tracking-[0.04em] text-[#86A9C4]">Blocked</p>
          </div>
          <div className="min-w-[88px] px-5 py-3.5">
            <p className="text-[22px] font-semibold leading-none text-white" style={{ fontVariantNumeric: "tabular-nums" }}>
              {loading ? "-" : summary.needsReview}
            </p>
            <p className="mt-1.5 text-[10.5px] font-semibold tracking-[0.04em] text-[#86A9C4]">Needs review</p>
          </div>

        </div>

        {/* Filter panel — inline below the dark slab */}
        <div className="border-t border-[#EAE7E2] bg-[#F9F8F6] px-7 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#7A6E63]">Refine view</p>
              <p className="mt-0.5 text-[12px] text-[#5A6470]">Use filters after reviewing at-risk items first.</p>
            </div>
            {isOverdueOnlyFilter ? (
              <button
                type="button"
                className="inline-flex items-center rounded-[6px] border border-[#DDD8D0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#0D1B2A] transition-colors hover:bg-[#F5F3F0]"
                onClick={clearUrlFilter}
              >
                Clear overdue view
              </button>
            ) : null}
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Status",
                value: statusFilter,
                onChange: (v: string) => setStatusFilter(v as StatusFilter),
                options: [
                  { value: "all", label: "All statuses" },
                  { value: "open", label: "Open" },
                  { value: "in_progress", label: "In progress" },
                  { value: "blocked", label: "Blocked" },
                  { value: "done", label: "Completed" },
                  { value: "overdue", label: "Overdue" },
                ],
              },
              {
                label: "Owner",
                value: ownerFilter,
                onChange: (v: string) => setOwnerFilter(v),
                options: [
                  { value: "all", label: "All owners" },
                  ...ownerOptions.map((o) => ({ value: o.value, label: o.label })),
                ],
              },
              {
                label: "Report",
                value: reportFilter,
                onChange: (v: string) => setReportFilter(v),
                options: [
                  { value: "all", label: "All reports" },
                  ...reportOptions.map((r) => ({ value: String(r.id), label: r.name })),
                ],
              },
            ].map(({ label, value, onChange, options }) => (
              <div key={label}>
                <label className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7A6E63]">{label}</label>
                <div className="relative">
                  <select
                    className="h-[36px] w-full appearance-none rounded-[8px] border border-[#DDD8D0] bg-white px-3 pr-8 text-[13px] text-[#0D1B2A] outline-none transition-colors focus:border-[#0D1B2A]"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                  >
                    {options.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#7A6E63]">▾</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-xl border border-destructive/35 bg-destructive/10 p-6 text-sm text-destructive">{error}</div>
      ) : null}

      {!loading && hasReadyCycle ? (
        <PageTabs
          value={actionsTab}
          onValueChange={(value) => {
            setActionsTab(value as typeof actionsTab);
            if (value !== "overdue" && isOverdueOnlyFilter) clearUrlFilter();
          }}
          tabs={[
            { value: "firm-wide", label: "Brief record" },
            {
              value: "my-actions",
              label: "My follow-through",
              badgeCount: myActionsSet.length > 0 ? myActionsSet.length : undefined,
            },
            {
              value: "overdue",
              label: "Overdue now",
              badgeCount: overdueActionsSet.length,
              badgeUrgent: overdueActionsSet.length > 0,
            },
          ]}
        />
      ) : null}

      {loading ? (
        <section aria-label="Loading follow-through" className="grid gap-6 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, col) => (
            <ActionColumnSkeleton key={`exec-skeleton-${col}`} />
          ))}
        </section>
      ) : filteredActions.length === 0 ? (
        <section className="rounded-xl border border-[#E3E8EF] bg-white shadow-sm">
          <GovernanceEmptyState
            size="lg"
            icon={<ClipboardList size={20} />}
            title="No follow-through items from recent Governance Briefs"
            description={
              !hasAnyCycle
                ? "Start a new review to generate your first Governance Brief. Once the brief is ready, open issues and assign follow-through here."
                : !hasReadyCycle
                  ? "Your first Governance Brief is still being prepared. Follow-through becomes available once the brief is ready for review."
                  : "Follow-through is assigned after reviewing client issues in a Governance Brief. Confirm what needs ownership, then set due dates and owners."
            }
            primaryAction={
              !hasAnyCycle
                ? { label: "Start a new review", href: "/upload" }
                : !hasReadyCycle
                  ? { label: "Check Governance Brief status", href: "/dashboard/reports" }
                  : { label: "Review client issues", href: "/dashboard/signals" }
            }
            secondaryAction={
              hasReadyCycle
                ? { label: "Add follow-through manually", onClick: openCreateActionModal }
                : { label: "Return to dashboard", href: "/dashboard" }
            }
            footer={
              <Link
                to="/demo"
                className="text-sm text-[#5A6470] underline underline-offset-4 transition-colors hover:text-[#0D1B2A]"
              >
                Open sample workspace
              </Link>
            }
          />
        </section>
      ) : tabActions.length === 0 && actionsTab !== "firm-wide" ? (
        <section className="rounded-xl border border-[#E3E8EF] bg-white shadow-sm">
          <GovernanceEmptyState
            size="md"
            icon={<ClipboardList size={20} />}
            title={
              actionsTab === "my-actions"
                ? "No follow-through assigned to you"
                : "No overdue items — all within due dates"
            }
            description={
              actionsTab === "my-actions"
                ? "Open the Governance Brief to see where ownership is missing and assign yourself to items that need a named lead."
                : "All current follow-through is within due dates. Review the firm-wide view to stay ahead of the next meeting."
            }
            primaryAction={{ label: "View all follow-through", onClick: () => setActionsTab("firm-wide") }}
          />
        </section>
      ) : (
        <section className="space-y-8">
          {/* Section context band */}
          <div className="rounded-lg border border-[#DDD8D0] bg-[#F9F8F6] px-5 py-3.5">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0EA5C2]" />
              <p className="text-[13px] font-medium text-[#0D1B2A]">
                {actionsTab === "overdue"
                  ? "Overdue follow-through"
                  : actionsTab === "my-actions"
                    ? "My follow-through"
                    : "Firm-wide follow-through record"}
              </p>
            </div>
            <p className="mt-1.5 pl-[14px] text-[12px] leading-5 text-[#5A6470]">
              {actionsTab === "overdue"
                ? "These items have passed their due date and require immediate review."
                : actionsTab === "my-actions"
                  ? "This view keeps your owned follow-through visible before the next meeting."
                  : "Review at-risk items first, then confirm what is moving cleanly before the next meeting."}
            </p>
          </div>

          {/* At risk */}
          <div className="space-y-4">
            <div className="rounded-lg border border-[#DDD8D0] bg-white/95 px-5 py-3.5 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A6E63]">At risk now</p>
              <p className="mt-1 text-[12px] leading-5 text-[#4B5563]">
                These items are the clearest threats to a credible current review cycle.
              </p>
            </div>
            <div className="grid gap-5 xl:grid-cols-3">
              {renderActionGroup("Overdue", "Due dates have passed. Needs immediate review.", overdueNow, "No overdue follow-through", "Everything in view is still within due date.", "risk")}
              {renderActionGroup("Unowned", "Need a named owner before the next meeting.", unownedNow, "No unowned follow-through", "Visible items already have ownership assigned.", "warn")}
              {renderActionGroup("Blocked", "Stalled items that may prevent cycle closure.", blockedNow, "No blocked follow-through", "Nothing in view is currently marked blocked.", "warn")}
            </div>
          </div>

          {/* Needs review */}
          <div className="space-y-4">
            <div className="rounded-lg border border-[#DDD8D0] bg-white/95 px-5 py-3.5 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A6E63]">Needs review before next meeting</p>
            </div>
            <div className="grid gap-5 xl:grid-cols-2">
              {renderActionGroup("Ready to start", "Owned items that need visible movement.", openReview, "No ready-to-start follow-through", "No owned open items in the current view.")}
              {renderActionGroup("In progress", "Work underway - keep visible until closed.", inProgressReview, "No in-progress follow-through", "No actively moving items in the current view.")}
            </div>
          </div>

          {/* Progressing cleanly */}
          <div className="space-y-4">
            <div className="rounded-lg border border-[#DDD8D0] bg-white/95 px-5 py-3.5 shadow-[0_1px_4px_rgba(13,27,42,0.06)]">
              <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#7A6E63]">Progressing cleanly</p>
            </div>
            {renderActionGroup("Completed", "Closed items remain visible as cycle history.", completedActions, "No completed follow-through in view", "Completed items will appear here as the cycle progresses.", "success")}
          </div>
        </section>
      )}

      <Dialog
        open={createModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            closeCreateActionModal();
            return;
          }
          setCreateModalOpen(true);
        }}
      >
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create follow-through item</DialogTitle>
            <DialogDescription>
              Create an item with clear ownership, due date, and success metric.
            </DialogDescription>
          </DialogHeader>
          <ActionForm
            open={createModalOpen}
            mode="create"
            initialValues={createActionInitialValues}
            ownerOptions={ownerSuggestions}
            submitting={creatingAction}
            submitLabel="Add follow-through"
            submittingLabel="Adding..."
            serverError={createActionError}
            onCancel={closeCreateActionModal}
            onSubmit={handleCreateAction}
          />
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
};

export default ExecutionPage;
