import PlanBadge from "@/components/dashboard/PlanBadge";
import { formatApiDate } from "@/lib/dateTime";
import type { UiPlanLimits } from "@/config/planLimits";

type FirmPlan = "free" | "team" | "firm" | "trial" | "professional" | "leadership" | null | undefined;

interface PlanCurrentBannerProps {
  firmPlan: FirmPlan;
  planLabel: string;
  isPaidSubscription: boolean;
  planLimits: UiPlanLimits;
  nextReset: string | null | undefined;
  nextUpgradePath: string;
  isLoading: boolean;
}

function historyLabel(days: number | null | undefined): string {
  if (!days) return "Unlimited";
  if (days >= 365) return `${Math.round(days / 365)} year`;
  return `${days} days`;
}

const PlanCurrentBanner = ({
  firmPlan,
  planLabel,
  isPaidSubscription,
  planLimits,
  nextReset,
  nextUpgradePath,
  isLoading,
}: PlanCurrentBannerProps) => {
  const resetLabel = nextReset ? formatApiDate(nextReset, { month: "long", day: "numeric" }, "") : "";
  const reviewLimit = planLimits.maxReviewsPerUpload ?? null;
  const reportLimit = planLimits.maxReportsPerMonth ?? null;
  const history = planLimits.historyDays ?? null;

  const isFree = !isPaidSubscription && (firmPlan === "free" || firmPlan === "trial" || !firmPlan);
  const isTeam = firmPlan === "team" || firmPlan === "professional";

  const handleUpgrade = (intent: string) => {
    // Route authenticated users to /pricing with intent — stays in the auth shell via normal navigation.
    // The pricing page detects auth state and adjusts the CTA accordingly.
    window.location.href = `/pricing?intent=${intent}&from=billing`;
  };

  if (isLoading) {
    return (
      <div className="settings-card animate-pulse">
        <div className="h-4 w-24 rounded bg-[#EAE7E2]" />
        <div className="mt-3 h-3 w-48 rounded bg-[#EAE7E2]" />
      </div>
    );
  }

  return (
    <div className="settings-card">
      {/* Header row: badge + title + single upgrade CTA */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <PlanBadge plan={firmPlan} />
          <h2 className="text-[13px] font-semibold text-[#0D1B2A]">
            Current plan: <span className="text-[#374151]">{planLabel}</span>
          </h2>
        </div>

        {!isTeam && isFree ? (
          <button
            type="button"
            onClick={() => handleUpgrade("team")}
            className="inline-flex items-center rounded-lg bg-[#0D1B2A] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#152638]"
          >
            Upgrade to Team →
          </button>
        ) : isTeam ? (
          <button
            type="button"
            onClick={() => handleUpgrade("firm")}
            className="inline-flex items-center rounded-lg border border-[#DDD8D0] bg-white px-3 py-1.5 text-xs font-medium text-[#374151] hover:bg-[#F5F3F0]"
          >
            Upgrade to Firm →
          </button>
        ) : null}
      </div>

      {/* Micro-stat row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded border border-[#EAE7E2] bg-[#F9F8F6] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Reports / month</p>
          <p className="mt-0.5 text-sm font-semibold text-[#0D1B2A]">
            {reportLimit !== null ? reportLimit : "Unlimited"}
          </p>
        </div>
        <div className="rounded border border-[#EAE7E2] bg-[#F9F8F6] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Reviews / upload</p>
          <p className="mt-0.5 text-sm font-semibold text-[#0D1B2A]">
            {reviewLimit !== null ? reviewLimit : "Unlimited"}
          </p>
        </div>
        <div className="rounded border border-[#EAE7E2] bg-[#F9F8F6] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">History window</p>
          <p className="mt-0.5 text-sm font-semibold text-[#0D1B2A]">{historyLabel(history)}</p>
        </div>
        <div className="rounded border border-[#EAE7E2] bg-[#F9F8F6] px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Resets</p>
          <p className="mt-0.5 text-sm font-semibold text-[#0D1B2A]">
            {isPaidSubscription ? "Monthly" : resetLabel || "Monthly"}
          </p>
        </div>
      </div>

      {/* Free-plan callout — single CTA, no duplicate */}
      {isFree && (
        <div className="mt-4 rounded border border-[#DDD8D0] bg-[#F9F8F6] px-4 py-3">
          <p className="text-xs text-[#374151]">
            <span className="font-semibold text-[#0D1B2A]">Free plan</span> — {reportLimit ?? 1} report/month,{" "}
            up to {reviewLimit ?? 50} reviews/upload{resetLabel ? `, resets ${resetLabel}` : ""}.
            Team unlocks 10 reports and 250 reviews/upload with no watermarks.
          </p>
        </div>
      )}
    </div>
  );
};

export default PlanCurrentBanner;
