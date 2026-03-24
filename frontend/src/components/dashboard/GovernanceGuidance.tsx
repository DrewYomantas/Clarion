
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
      subtitle="The clearest next step based on current client issues and action state."
    >
      <div className="gov-card-content">
        <p className="gov-section-intro">{directive}</p>
        <div className="rounded-[10px] border border-[var(--border)] bg-[#FAFBFC] px-4 py-3">
          <p className="gov-type-eyebrow mb-1">Recommended next step</p>
          <p className="gov-body font-medium text-[#0D1B2A]">{recommendedAction}</p>
        </div>
      </div>
      <div className="mt-4">
        <Button type="button" variant="primary" onClick={onOpenActions}>
          Open actions workspace
        </Button>
      </div>
    </DashboardCard>
  );
};

export default GovernanceGuidance;
