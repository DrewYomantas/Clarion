import clarionLogo from "@/assets/clarion-logo.png";

type PublicBrandProps = {
  variant?: "nav" | "hero" | "footer" | "mark" | "sidebar";
  className?: string;
};

const variantClasses: Record<NonNullable<PublicBrandProps["variant"]>, string> = {
  nav: "flex items-center gap-3.5 text-left",
  hero: "flex items-center gap-4 text-left",
  footer: "flex items-center gap-3.5 text-left",
  mark: "flex items-center",
  sidebar: "flex items-center gap-3 text-left",
};

const markFrameClasses: Record<NonNullable<PublicBrandProps["variant"]>, string> = {
  nav: "h-12 w-12 rounded-[15px]",
  hero: "h-[4.75rem] w-[4.75rem] rounded-[22px]",
  footer: "h-14 w-14 rounded-[18px]",
  mark: "h-11 w-11 rounded-[14px]",
  sidebar: "h-10 w-10 rounded-[13px]",
};

const markImageClasses: Record<NonNullable<PublicBrandProps["variant"]>, string> = {
  nav: "scale-[1.14]",
  hero: "scale-[1.18]",
  footer: "scale-[1.14]",
  mark: "scale-[1.14]",
  sidebar: "scale-[1.12]",
};

const titleClasses: Record<"nav" | "hero" | "footer" | "sidebar", string> = {
  nav: "text-[1.02rem] tracking-[0.34em]",
  hero: "text-[1.35rem] tracking-[0.33em]",
  footer: "text-[1.08rem] tracking-[0.34em]",
  sidebar: "text-[1rem] tracking-[0.3em]",
};

const subtitleClasses: Record<"nav" | "hero" | "footer" | "sidebar", string> = {
  nav: "text-[0.59rem] tracking-[0.34em]",
  hero: "text-[0.66rem] tracking-[0.35em]",
  footer: "text-[0.61rem] tracking-[0.34em]",
  sidebar: "text-[0.53rem] tracking-[0.26em]",
};

const BrandMark = ({ variant }: { variant: NonNullable<PublicBrandProps["variant"]> }) => (
  <span
    className={[
      "relative isolate overflow-hidden border border-[rgba(203,178,123,0.18)] bg-[linear-gradient(180deg,rgba(8,16,31,0.98),rgba(4,10,22,0.94))] shadow-[0_16px_34px_rgba(4,9,22,0.38)]",
      markFrameClasses[variant],
    ].join(" ")}
  >
    <img
      src={clarionLogo}
      alt="Clarion mark"
      className={[
        "h-full w-full object-cover object-[center_18%]",
        markImageClasses[variant],
      ].join(" ")}
    />
    <span className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,255,255,0.2),transparent_42%)]" />
  </span>
);

const PublicBrand = ({ variant = "nav", className = "" }: PublicBrandProps) => {
  if (variant === "mark") {
    return <BrandMark variant="mark" />;
  }

  if (variant === "nav" || variant === "hero" || variant === "footer" || variant === "sidebar") {
    return (
      <div className={`${variantClasses[variant]} ${className}`.trim()}>
        <BrandMark variant={variant} />
        <div className="min-w-0">
          <div className={`font-semibold uppercase leading-none text-white ${titleClasses[variant]}`}>Clarion</div>
          <div className={`mt-1 font-medium uppercase leading-none text-[#CBB27B] ${subtitleClasses[variant]}`}>
            Client Intelligence
          </div>
        </div>
      </div>
    );
  }
};

export default PublicBrand;
