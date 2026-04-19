import * as TabsPrimitive from "@radix-ui/react-tabs";

export type PageTabItem = {
  value: string;
  label: string;
  badgeCount?: number;
  badgeUrgent?: boolean;
};

type PageTabsProps = {
  value: string;
  onValueChange: (value: string) => void;
  tabs: PageTabItem[];
  className?: string;
};

export function PageTabs({ value, onValueChange, tabs, className = "" }: PageTabsProps) {
  return (
    <TabsPrimitive.Root value={value} onValueChange={onValueChange}>
      <TabsPrimitive.List
        className={[
          "flex w-fit max-w-full flex-wrap items-end gap-0 rounded-lg border border-[#DDD8D0] bg-white/95 px-2 pt-1 shadow-[0_1px_4px_rgba(13,27,42,0.06)]",
          className,
        ].join(" ")}
        aria-label="Page workflow tabs"
      >
        {tabs.map((tab) => (
          <TabsPrimitive.Trigger
            key={tab.value}
            value={tab.value}
            className={[
              "group relative flex items-center gap-2 px-4 pb-3 pt-2",
              "whitespace-nowrap text-[13px] font-medium leading-none",
              "text-[#374151] transition-[color] duration-150 ease-out hover:text-[#0D1B2A]",
              "data-[state=active]:font-semibold data-[state=active]:text-[#0D1B2A]",
              "after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2.5px] after:origin-left after:scale-x-0 after:rounded-t-[1px] after:bg-[#C4A96A] after:opacity-0 after:transition-[transform,opacity] after:duration-150 after:ease-out",
              "data-[state=active]:after:scale-x-100 data-[state=active]:after:opacity-100",
              "rounded-sm outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D1B2A] focus-visible:ring-offset-1",
            ].join(" ")}
          >
            {tab.label}
            {typeof tab.badgeCount === "number" && tab.badgeCount > 0 ? (
              <span
                className={[
                  "inline-flex min-w-[18px] items-center justify-center rounded-full border px-1.5 py-[1px] text-[10px] font-semibold leading-none tabular-nums",
                  tab.badgeUrgent
                    ? "border-amber-300/60 bg-amber-100 text-amber-800"
                    : "border-slate-200 bg-slate-100 text-slate-600",
                ].join(" ")}
              >
                {tab.badgeCount}
              </span>
            ) : null}
          </TabsPrimitive.Trigger>
        ))}
      </TabsPrimitive.List>
    </TabsPrimitive.Root>
  );
}
