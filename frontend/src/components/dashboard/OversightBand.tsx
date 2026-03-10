import { useNavigate } from "react-router-dom";

type OversightMetric = {
  label: string;
  value: number | string;
  /** Optional sub-label shown below value */
  sub?: string;
  /** If true, draws a red left accent when value > 0 */
  risk?: boolean;
  /** If true, draws an amber left accent when value > 0 */
  warn?: boolean;
  /** If true, draws a green left accent */
  success?: boolean;
  route?: string;
  routeQuery?: string;
};

type OversightBandProps = {
  metrics: OversightMetric[];
  loading?: boolean;
};

/**
 * OversightBand
 * Horizontal strip of 3–4 leadership KPI tiles. Appears at the very top of the
 * active-workspace dashboard view. Uses the governance design system's neutral
 * surface style with semantic left-border accents only.
 *
 * Usage going forward: always pass pre-computed integer counts from Dashboard.tsx.
 * Do not embed data fetching here — keep this component purely presentational.
 */
export default function OversightBand({ metrics, loading = false }: OversightBandProps) {
  const navigate = useNavigate();

  return (
    <div className="mb-8">
      <div className="mb-3 flex items-baseline gap-2">
        <p className="gov-eyebrow">Today's oversight</p>
      </div>
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}
      >
        {metrics.map((metric) => {
          const hasRisk = metric.risk && Number(metric.value) > 0;
          const hasWarn = metric.warn && Number(metric.value) > 0;
          const hasSuccess = metric.success;

          const accentColor = hasRisk
            ? "#DC2626"
            : hasWarn
              ? "#F59E0B"
              : hasSuccess
                ? "#16A34A"
                : "#CBD5E1";

          const isClickable = Boolean(metric.route);

          const inner = (
            <div
              className="rounded-[10px] border border-[#E5E7EB] bg-white px-5 py-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)]"
              style={{ borderLeft: `3px solid ${accentColor}` }}
            >
              <p className="gov-eyebrow mb-2">{metric.label}</p>
              <p
                className="text-[32px] font-bold leading-none text-[#0F172A]"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {loading ? (
                  <span className="inline-block h-8 w-12 animate-pulse rounded bg-neutral-200" />
                ) : (
                  metric.value
                )}
              </p>
              {metric.sub ? (
                <p className="mt-1.5 text-[12px] text-[#64748B]">{metric.sub}</p>
              ) : null}
            </div>
          );

          if (isClickable && metric.route) {
            return (
              <button
                key={metric.label}
                type="button"
                onClick={() => navigate(metric.routeQuery ? `${metric.route}?${metric.routeQuery}` : (metric.route as string))}
                className="gov-clickable text-left"
                aria-label={`${metric.label}: ${loading ? "loading" : metric.value}. Open detail.`}
              >
                {inner}
              </button>
            );
          }

          return (
            <div key={metric.label}>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
