import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { finalizeCheckoutSession, startCheckoutSession, type BillingPlan } from "@/api/authService";
import PricingSection from "@/components/PricingSection";
import PageLayout from "@/components/PageLayout";
import { useAuth } from "@/contexts/AuthContext";
import { pricingPlans, type PricingPlanId } from "@/data/pricingPlans";

const validPlans: BillingPlan[] = ["team", "firm"];
const focusedPlanIds: PricingPlanId[] = ["team", "firm"];

const Pricing = () => {
  const { isLoggedIn, isLoading, refreshPlan, refreshUser, currentPlan } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [focusedCheckoutPlan, setFocusedCheckoutPlan] = useState<BillingPlan | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  // P5 persistent checkout-return states
  const [checkoutCanceled, setCheckoutCanceled] = useState(false);
  const [canceledPlan, setCanceledPlan] = useState<BillingPlan | null>(null);
  const [finalizeError, setFinalizeError] = useState<string | null>(null);
  const [startCheckoutError, setStartCheckoutError] = useState<string | null>(null);

  const checkoutStatus = searchParams.get("checkout");
  const sessionId = searchParams.get("session_id");
  const plan = searchParams.get("plan");
  const selectedPlanParam = searchParams.get("intent");
  const parsedPlan = useMemo(() => {
    if (validPlans.includes(plan as BillingPlan)) return plan as BillingPlan;
    return null;
  }, [plan]);
  const focusedPlanId = useMemo(() => {
    if (focusedPlanIds.includes(selectedPlanParam as PricingPlanId)) {
      return selectedPlanParam as PricingPlanId;
    }
    return null;
  }, [selectedPlanParam]);
  const focusedPlan = useMemo(
    () => pricingPlans.find((tier) => tier.id === focusedPlanId) ?? null,
    [focusedPlanId],
  );
  const finalizeAfterLoginPath =
    checkoutStatus === "success" && sessionId && parsedPlan
      ? `/pricing?checkout=success&session_id=${encodeURIComponent(sessionId)}&plan=${encodeURIComponent(parsedPlan)}`
      : "/pricing";
  const needsCheckoutSignIn =
    !isLoading && checkoutStatus === "success" && !!sessionId && !!parsedPlan && !isLoggedIn;

  useEffect(() => {
    if (isLoading || checkoutStatus !== "success" || !sessionId || !parsedPlan || !isLoggedIn || isFinalizing) {
      return;
    }

    const finalize = async () => {
      setIsFinalizing(true);
      setFinalizeError(null);
      const result = await finalizeCheckoutSession(sessionId, parsedPlan);
      if (result.success) {
        await Promise.all([refreshUser(), refreshPlan()]);
        toast.success("Checkout confirmed. Your account has been updated.");
        navigate("/dashboard", { replace: true });
      } else {
        const msg = result.error || "We couldn't verify your payment. Please refresh or contact support.";
        setFinalizeError(msg);
        setSearchParams({}, { replace: true });
      }
      setIsFinalizing(false);
    };

    void finalize();
  }, [
    checkoutStatus,
    isFinalizing,
    isLoading,
    isLoggedIn,
    navigate,
    parsedPlan,
    refreshPlan,
    refreshUser,
    sessionId,
    setSearchParams,
  ]);

  useEffect(() => {
    if (checkoutStatus !== "canceled") {
      return;
    }
    // Capture the plan before clearing params so the "try again" CTA can re-open it
    if (parsedPlan) setCanceledPlan(parsedPlan);
    setCheckoutCanceled(true);
    setSearchParams({}, { replace: true });
  }, [checkoutStatus, parsedPlan, setSearchParams]);

  const handleFocusedCheckout = async () => {
    if (!focusedPlan || focusedPlan.id === "free") {
      return;
    }

    if (!isLoggedIn) {
      navigate(`/login?redirectTo=${encodeURIComponent(`/pricing?intent=${focusedPlan.id}`)}`);
      return;
    }

    if (currentPlan?.planType === focusedPlan.planType) {
      navigate("/dashboard");
      return;
    }

    const checkoutPlan: BillingPlan = focusedPlan.id === "firm" ? "firm" : "team";
    setFocusedCheckoutPlan(checkoutPlan);
    setStartCheckoutError(null);
    const result = await startCheckoutSession(checkoutPlan, `/pricing?intent=${focusedPlan.id}`);
    if (!result.success || !result.checkout_url) {
      setFocusedCheckoutPlan(null);
      const message = result.error || "Unable to start checkout.";
      if (message.includes("sign in again")) {
        toast.message(message);
        navigate(`/login?redirectTo=${encodeURIComponent(`/pricing?intent=${focusedPlan.id}`)}`);
        return;
      }
      setStartCheckoutError(message);
      return;
    }

    window.location.assign(result.checkout_url);
  };

  // Retry checkout from the canceled banner
  const handleRetryCheckout = async (plan: BillingPlan) => {
    setCheckoutCanceled(false);
    setStartCheckoutError(null);
    if (!isLoggedIn) {
      navigate(`/login?redirectTo=${encodeURIComponent(`/pricing?intent=${plan}`)}`);
      return;
    }
    const result = await startCheckoutSession(plan, `/pricing?intent=${plan}`);
    if (!result.success || !result.checkout_url) {
      setStartCheckoutError(result.error || "Unable to restart checkout. Please try again.");
      return;
    }
    window.location.assign(result.checkout_url);
  };

  const focusedPlanButtonLabel = useMemo(() => {
    if (!focusedPlan) return "";
    if (currentPlan?.planType === focusedPlan.planType) {
      return "Current workspace plan";
    }
    if (!isLoggedIn) {
      return `Sign in for ${focusedPlan.name}`;
    }
    if (focusedCheckoutPlan === focusedPlan.id) {
      return "Starting checkout...";
    }
    return `Continue to ${focusedPlan.name} checkout`;
  }, [currentPlan?.planType, focusedCheckoutPlan, focusedPlan, isLoggedIn]);

  return (
    <PageLayout>
      <section className="marketing-hero">
        <div className="section-container space-y-4">
          <p className="inline-flex items-center rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-blue-300">
            Pricing
          </p>
          <h1 className="marketing-hero-title">Governance tools built for how law firms actually operate.</h1>
          <p className="max-w-3xl marketing-hero-body">
            Start with a free trial — no credit card required. Move to Team when governance becomes a monthly discipline. Choose Firm for full-platform coverage with scheduled delivery, custom branding, and unlimited capacity.
          </p>

          {/* ── Billing toggle — lives in hero so it's visible before the cards ── */}
          <div className="pt-1">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 p-1 text-sm backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setBillingCycle("monthly")}
                className={`rounded-full px-4 py-1.5 font-medium transition ${
                  billingCycle === "monthly"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle("annual")}
                className={`rounded-full px-4 py-1.5 font-medium transition ${
                  billingCycle === "annual"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-white/70 hover:text-white"
                }`}
              >
                Annual
                <span className="ml-1.5 rounded-full bg-emerald-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                  Save up to 17%
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 pt-1">
            <a href="#pricing-page-plans" className="gov-btn-primary">
              Compare plans
            </a>
            <Link to="/contact" className="gov-btn-secondary">
              Contact support
            </Link>
          </div>

          {/* ── Trust strip ── */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-4">
            {[
              "Built for law firms",
              "No credit card required",
              "Secure checkout via Stripe",
              "Designed for client experience governance",
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5 text-xs text-white/60">
                <span className="h-1 w-1 rounded-full bg-white/30" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {isFinalizing && (
        <section className="section-container pb-2 pt-4">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">
            Confirming your Stripe checkout...
          </div>
        </section>
      )}

      {needsCheckoutSignIn && (
        <section className="section-container pb-2 pt-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-slate-800">
            <p className="font-medium text-slate-900">Return to finish secure checkout</p>
            <p className="mt-1">
              Your payment is waiting to be confirmed in Clarion. Sign in again to finish applying the plan to your
              workspace.
            </p>
            <div className="mt-3">
              <Link to={`/login?redirectTo=${encodeURIComponent(finalizeAfterLoginPath)}`} className="gov-btn-secondary">
                Sign in to finish checkout
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── P5: Canceled checkout banner ──────────────────────────────────── */}
      {checkoutCanceled && (
        <section className="section-container pb-2 pt-4">
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">Checkout was canceled — your plan hasn't changed.</p>
                <p className="mt-1 text-slate-600">
                  You can pick up where you left off. Your workspace and data are untouched.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {canceledPlan ? (
                    <button
                      type="button"
                      onClick={() => void handleRetryCheckout(canceledPlan)}
                      className="gov-btn-primary"
                    >
                      Try checkout again →
                    </button>
                  ) : (
                    <a href="#pricing-page-plans" className="gov-btn-primary">
                      Choose a plan →
                    </a>
                  )}
                  <Link to="/contact" className="gov-btn-secondary">
                    Contact support
                  </Link>
                </div>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setCheckoutCanceled(false)}
                className="shrink-0 rounded p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── P5: Finalize / payment failure banner ─────────────────────────── */}
      {finalizeError && (
        <section className="section-container pb-2 pt-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-red-900">Payment could not be confirmed.</p>
                <p className="mt-1 text-red-800">{finalizeError}</p>
                <p className="mt-2 text-red-700">
                  If your card was declined, double-check the card details or try a different payment method. If you
                  used a test card number in a live checkout session, it won't be accepted — use a real card instead.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href="#pricing-page-plans" className="gov-btn-primary">
                    Try a different card →
                  </a>
                  <Link to="/contact" className="gov-btn-secondary">
                    Contact support
                  </Link>
                </div>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setFinalizeError(null)}
                className="shrink-0 rounded p-1 text-red-400 hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── P5: Checkout-start failure banner (near focused plan CTA) ─────── */}
      {startCheckoutError && (
        <section className="section-container pb-2 pt-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-5 py-4 text-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="font-semibold text-red-900">We couldn't start checkout.</p>
                <p className="mt-1 text-red-800">{startCheckoutError}</p>
                <p className="mt-2 text-red-700">
                  This is sometimes caused by a card being declined before reaching Stripe's checkout page. Try a
                  different card, or contact support if the problem continues.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <a href="#pricing-page-plans" className="gov-btn-primary">
                    Try a different card →
                  </a>
                  <Link to="/contact" className="gov-btn-secondary">
                    Contact support
                  </Link>
                </div>
              </div>
              <button
                type="button"
                aria-label="Dismiss"
                onClick={() => setStartCheckoutError(null)}
                className="shrink-0 rounded p-1 text-red-400 hover:bg-red-100 hover:text-red-700 transition-colors"
              >
                ✕
              </button>
            </div>
          </div>
        </section>
      )}

      {focusedPlan && (
        <section className="section-container pb-2 pt-6">
          <div className={`marketing-panel rounded-2xl px-6 py-6 ${
            focusedPlan.id === "firm" ? "marketing-tone-violet" : "marketing-tone-blue"
          }`}>
            <div className="flex flex-wrap items-start justify-between gap-5">
              <div className="max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-600">Selected upgrade</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{focusedPlan.name}</h2>
                <p className="mt-2 text-sm text-slate-700">{focusedPlan.audience}</p>
                <p className="mt-3 text-sm text-slate-700">
                  This tier is designed for firms that need more room to run recurring governance cycles without losing
                  workflow continuity.
                </p>
                <ul className="mt-4 grid gap-2 text-sm text-slate-800 sm:grid-cols-2">
                  {focusedPlan.features.slice(0, 4).map((feature) => (
                    <li key={feature} className="rounded-lg border border-slate-200 bg-white/80 px-3 py-2">
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="min-w-[240px] rounded-xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">
                  {focusedPlan.price}
                  {focusedPlan.period}
                </p>
                <p className="mt-1 text-xs text-slate-600">
                  Quick overview first, then the same secure Stripe checkout already used across Clarion.
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => void handleFocusedCheckout()}
                    disabled={focusedCheckoutPlan !== null || currentPlan?.planType === focusedPlan.planType}
                    className="gov-btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {focusedPlanButtonLabel}
                  </button>
                  <Link to="/contact" className="gov-btn-secondary justify-center text-center">
                    Contact support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-container pb-2 pt-6">
        <div className="supporting-cta-strip">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Choose by cadence</p>
            <p className="mt-2 text-sm text-slate-700">
              Free validates a first cycle. Team supports a recurring monthly operating rhythm. Firm is for broader,
              ongoing coverage across practice groups.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={!isLoading && isLoggedIn ? "/dashboard" : "/signup"} className="gov-btn-primary">
              {!isLoading && isLoggedIn ? "Go to Dashboard" : "Start Free workspace"}
            </Link>
            <Link to="/contact" className="gov-btn-secondary">
              Contact support
            </Link>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50">
        <PricingSection
          sectionId="pricing-page-plans"
          showIntro={false}
          showEntryCtas={false}
          highlightedPlanId={focusedPlanId}
          showFaq
          billingCycle={billingCycle}
          onBillingCycleChange={setBillingCycle}
        />
      </section>
    </PageLayout>
  );
};

export default Pricing;
