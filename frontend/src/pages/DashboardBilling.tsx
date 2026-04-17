import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  getCredits,
  getReportPackSchedule,
  updateReportPackSchedule,
  type CreditsState,
  type ReportPackSchedule,
} from "@/api/authService";
import PageWrapper from "@/components/governance/PageWrapper";
import PlanCurrentBanner from "@/components/billing/PlanCurrentBanner";
import { useAuth } from "@/contexts/AuthContext";
import { resolvePlanLimits } from "@/config/planLimits";


const DashboardBilling = () => {
  const { currentPlan } = useAuth();
  const [credits, setCredits] = useState<CreditsState | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [schedule, setSchedule] = useState<ReportPackSchedule | null>(null);
  const [canManageSchedule, setCanManageSchedule] = useState(false);
  const [scheduleError, setScheduleError] = useState("");
  const [scheduleLoading, setScheduleLoading] = useState(true);
  const [isSavingSchedule, setIsSavingSchedule] = useState(false);
  const [recipientsDraft, setRecipientsDraft] = useState("");

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError("");
      setScheduleLoading(true);
      setScheduleError("");
      const [creditsResult, scheduleResult] = await Promise.all([getCredits(), getReportPackSchedule()]);
      if (creditsResult.success && creditsResult.credits) {
        setCredits(creditsResult.credits);
      } else {
        setCredits(null);
        setError(creditsResult.error || "Unable to load billing usage.");
      }

      if (scheduleResult.success && scheduleResult.schedule) {
        setSchedule(scheduleResult.schedule);
        setCanManageSchedule(Boolean(scheduleResult.can_manage));
        setRecipientsDraft((scheduleResult.schedule.recipients || []).join(", "));
      } else {
        setSchedule(null);
        setCanManageSchedule(false);
        setScheduleError(
          scheduleResult.error || scheduleResult.upgrade_message || "Unable to load executive report pack schedule.",
        );
      }

      setIsLoading(false);
      setScheduleLoading(false);
    };
    void load();
  }, []);

  const recipientsList = useMemo(
    () =>
      recipientsDraft
        .split(",")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    [recipientsDraft],
  );

  const handleSaveSchedule = async () => {
    if (!schedule) return;
    setIsSavingSchedule(true);
    const result = await updateReportPackSchedule({
      enabled: schedule.enabled,
      cadence: schedule.cadence,
      recipients: recipientsList,
    });
    if (result.success && result.schedule) {
      setSchedule(result.schedule);
      setRecipientsDraft((result.schedule.recipients || []).join(", "));
      toast.success("Executive report pack schedule saved. Delivery still depends on email configuration.");
      setScheduleError("");
    } else {
      setScheduleError(result.error || "Unable to save schedule settings.");
      toast.error(result.error || "Unable to save schedule settings.");
    }
    setIsSavingSchedule(false);
  };

  const isPaidSubscription =
    Boolean(credits?.has_active_subscription) ||
    currentPlan?.planType === "pro_monthly" ||
    currentPlan?.planType === "pro_annual";
  const planLabel = currentPlan?.firmPlan
    ? currentPlan.firmPlan === "leadership"
      ? "Firm"
      : currentPlan.firmPlan === "professional"
        ? "Team"
        : "Free"
    : currentPlan?.planLabel || (isPaidSubscription ? "Team" : "Free");
  const nextUpgradePlan = currentPlan?.planType === "pro_annual" ? null : currentPlan?.planType === "pro_monthly" ? "firm" : "team";
  const nextUpgradeLabel = nextUpgradePlan === "firm" ? "Firm" : "Team";
  const focusedUpgradePath = nextUpgradePlan ? `/pricing?intent=${nextUpgradePlan}` : "/pricing";
  const planLimits = resolvePlanLimits(currentPlan);

  return (
    <PageWrapper
      eyebrow="Workspace"
      title="Billing & Usage"
      description="Current plan allowances and automation settings."
      actions={
        <Link
          to={focusedUpgradePath}
          className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
        >
          {nextUpgradePlan ? `View ${nextUpgradeLabel} overview` : "View plan details"}
        </Link>
      }
    >
      {error && (
        <div className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">{error}</div>
      )}

      <PlanCurrentBanner
        firmPlan={currentPlan?.firmPlan}
        planLabel={planLabel}
        isPaidSubscription={isPaidSubscription}
        planLimits={planLimits}
        nextReset={credits?.next_reset}
        nextUpgradePath={focusedUpgradePath}
        isLoading={isLoading}
      />

      {/* Automation & Delivery */}
      <div className="settings-card space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[13px] font-semibold text-[#0D1B2A]">Automation & Delivery</h2>
            <p className="mt-1 text-xs text-[#5A6470]">
              Included in Team/Firm. Save recipient and cadence settings here. Delivery runs when outbound email is
              configured for this deployment.
            </p>
            {!canManageSchedule && (
              <p className="mt-1.5 text-xs text-[#7A6E63]">
                Team and Firm unlock saved recipient lists and recurring report-pack cadence for leadership review cycles.
              </p>
            )}
          </div>
          {canManageSchedule ? (
            <span className="inline-flex items-center rounded border border-[#C4A96A]/40 bg-[#C4A96A]/10 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#8A6E30]">
              Included
            </span>
          ) : (
            <Link
              to="/pricing?intent=team"
              className="inline-flex items-center rounded-lg border border-[#DDD8D0] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F5F3F0]"
            >
              Upgrade to Team
            </Link>
          )}
        </div>

        {!canManageSchedule && !scheduleLoading && (
          <div className="rounded border border-[#EAE7E2] bg-[#F9F8F6] p-4">
            <p className="text-xs font-semibold text-[#0D1B2A]">What this unlocks</p>
            <ul className="mt-2 space-y-1 text-xs text-[#6B7280]">
              <li>Save the partner or ops distribution list once instead of re-entering each cycle.</li>
              <li>Set a recurring weekly or monthly cadence for report-pack delivery.</li>
              <li>Keep leadership delivery settings attached to the workspace.</li>
            </ul>
          </div>
        )}

        {scheduleError && !scheduleLoading && (
          <div className="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            {scheduleError}
          </div>
        )}

        {scheduleLoading ? (
          <p className="text-sm text-[#7A6E63]">Loading schedule settings…</p>
        ) : schedule ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex items-center gap-2 text-sm text-[#374151]">
                <input
                  type="checkbox"
                  checked={schedule.enabled}
                  disabled={!canManageSchedule}
                  onChange={(e) => setSchedule((prev) => (prev ? { ...prev, enabled: e.target.checked } : prev))}
                  className="rounded border-[#DDD8D0]"
                />
                Enable scheduled report packs
              </label>
              <label className="flex items-center gap-2 text-sm text-[#374151]">
                Cadence
                <select
                  className="settings-field max-w-[180px] px-3"
                  value={schedule.cadence}
                  disabled={!canManageSchedule}
                  onChange={(e) =>
                    setSchedule((prev) => (prev ? { ...prev, cadence: e.target.value === "monthly" ? "monthly" : "weekly" } : prev))
                  }
                >
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
            </div>

            <label className="block text-sm text-[#374151]">
              Recipients (comma-separated)
              <input
                type="text"
                className="settings-field mt-1.5 px-3"
                value={recipientsDraft}
                disabled={!canManageSchedule}
                onChange={(e) => setRecipientsDraft(e.target.value)}
                placeholder="partner@firm.com, ops@firm.com"
              />
            </label>

            <p className="text-xs text-[#7A6E63]">
              Last sent: {schedule.last_sent_at || "Never"} · Next run: {schedule.next_send_at || "Not scheduled"}
            </p>

            {!canManageSchedule && (
              <p className="text-xs text-[#7A6E63]">
                Settings are visible for reference, but editing and scheduled delivery require Team or Firm.
              </p>
            )}

            <div>
              <button
                type="button"
                disabled={!canManageSchedule || isSavingSchedule}
                onClick={() => void handleSaveSchedule()}
                className="inline-flex items-center rounded-lg bg-[#0D1B2A] px-4 py-2 text-sm font-medium text-white hover:bg-[#152638] disabled:opacity-50"
              >
                {isSavingSchedule ? "Saving…" : "Save schedule"}
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </PageWrapper>
  );
};

export default DashboardBilling;
