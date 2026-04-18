import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type BriefPresentModeProps = {
  active: boolean;
  onExit: () => void;
  briefTitle?: string;
  children: ReactNode;
};

export default function BriefPresentMode({ active, onExit, briefTitle, children }: BriefPresentModeProps) {
  useEffect(() => {
    if (!active) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onExit]);

  useEffect(() => {
    if (!active) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-label="Meeting view"
      aria-modal="true"
      className="brief-present-overlay"
    >
      <div className="brief-present-frame" aria-label="Meeting room frame">
        <div className="brief-present-room-mark">
          <span className="brief-present-bar-label">Meeting Mode</span>
          <span className="brief-present-bar-hint">Esc to exit</span>
        </div>
        {briefTitle ? (
          <span className="brief-present-bar-context" aria-hidden>{briefTitle}</span>
        ) : null}
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit Meeting Mode"
          className="brief-present-exit-btn"
        >
          <X size={13} aria-hidden />
          Exit
        </button>
      </div>

      <div className="brief-present-scroll">
        <div className="brief-present-content">
          {children}
        </div>
      </div>
    </div>
  );
}
