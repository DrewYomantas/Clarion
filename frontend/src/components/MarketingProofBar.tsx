type MarketingProofBarProps = {
  items: string[];
  className?: string;
};

const MarketingProofBar = ({ items, className = "" }: MarketingProofBarProps) => {
  return (
    <div
      className={[
        "mt-5 flex flex-wrap items-center gap-2 text-xs text-[#CBB27B]",
        className,
      ].join(" ")}
    >
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-[rgba(203,178,123,0.28)] bg-[rgba(10,18,35,0.72)] px-2.5 py-1 text-[#E8E0CF]"
        >
          {item}
        </span>
      ))}
    </div>
  );
};

export default MarketingProofBar;
