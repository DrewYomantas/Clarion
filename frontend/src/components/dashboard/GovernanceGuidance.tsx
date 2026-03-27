
import { DashboardCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GovernanceGuidanceProps = {
  directive: string;
  recommendedAction: string;
  onOpenActions: () => void;
};

const GovernanceGuidance = ({ directive, recommendedAction, onOpenActions }: GovernanceGuidanceProps) => {
  return (
    <DashboardCard
      title="Next recommended move"
      subtitle="The clearest next step from current issue and ownership state."
    >
      <div className="gov-card-content">
        <p className="gov-section-intro">{directive}</p>
        <div className="rounded-[10px] border border-[var(--border)] bg-[#FAFBFC] px-4 py-3">
          <p className="gov-type-eyebrow mb-1">Recommended action</p>
          <p className="gov-body font-medium text-[#0D1B2A]">{recommendedAction}</p>
        </div>
      </div>
      <div className="mt-3">
        <Button type="button" variant="secondary" onClick={onOpenActions}>
          Open actions workspace
        </Button>
      </div>
    </DashboardCard>
  );
};

export default GovernanceGuidance;
