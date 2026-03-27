import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

type NarrativeCard = {
  stage: "Evidence" | "Signals" | "Actions" | "Governance Briefs";
  /** Short one-line description of what this stage holds */
  description: string;
  /** Two status lines — counts, "new this week", etc. */
  statusLines: [string, string?];
  route: string;
};

type GovernanceNarrativeRailProps = {
  cards: NarrativeCard[];
  loading?: boolean;
};

const STAGE_ACCENT: Record<NarrativeCard["stage"], string> = {
  Evidence: "#2563EB",
  Signals: "#F59E0B",
  Actions: "#0EA5C2",
  "Governance Briefs": "#16A34A",
};

const STAGE_NUMBER: Record<NarrativeCard["stage"], string> = {
  Evidence: "01",
  Signals: "02",
  Actions: "03",
  "Governance Briefs": "04",
};

/**
 * GovernanceNarrativeRail
 * Four-card horizontal row depicting the Evidence → Signals → Actions →
 * Governance Briefs governance loop. Each card links to the corresponding
 * deep workspace. Renders below OversightBand, above FirmGovernanceStatus.
 *
 * Usage going forward: pass pre-computed statusLines from Dashboard.tsx.
 * Do not fetch data here — keep purely presentational.
 */
export default function GovernanceNarrativeRail({ cards, loading = false }: GovernanceNarrativeRailProps) {
  return (
    <div className="mb-0">
      <div className="mb-2 flex items-baseline gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#94A3B8]">Governance cycle</p>
        <p className="text-[11px] text-[#A0AEC0]">Evidence &rarr; Signals &rarr; Actions &rarr; Brief</p>
      </div>
      <div className="grid grid-cols-2 gap-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.stage}
            to={card.route}
            className="group gov-clickable flex flex-col rounded-[10px] border border-[#E5E7EB] bg-white px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-shadow hover:shadow-[0_3px_10px_rgba(0,0,0,0.07)]"
            style={{ borderTop: `3px solid ${STAGE_ACCENT[card.stage]}` }}
          >
            <div className="mb-2 flex items-center justify-between">
              <span
                className="text-[10px] font-bold uppercase tracking-[0.08em]"
                style={{ color: STAGE_ACCENT[card.stage] }}
              >
                {STAGE_NUMBER[card.stage]}
              </span>
              <ChevronRight
                size={14}
                className="text-[#CBD5E1] transition-colors group-hover:text-[#64748B]"
              />
            </div>

            <p className="mb-1 text-[13px] font-semibold text-[#0F172A]">{card.stage}</p>
            <p className="mb-2 text-[11px] leading-snug text-[#64748B]">{card.description}</p>

            <div className="mt-auto space-y-1">
              {loading ? (
                <>
                  <div className="h-3 w-28 animate-pulse rounded bg-neutral-200" />
                  <div className="h-3 w-20 animate-pulse rounded bg-neutral-200" />
                </>
              ) : (
                <>
                  <p className="text-[11px] font-medium text-[#334155]">{card.statusLines[0]}</p>
                  {card.statusLines[1] ? (
                    <p className="text-[10px] text-[#94A3B8]">{card.statusLines[1]}</p>
                  ) : null}
                </>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
