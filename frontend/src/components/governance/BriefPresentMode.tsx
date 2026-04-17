/**
 * BriefPresentMode
 * ─────────────────────────────────────────────────────────────────────────────
 * Full-screen Meeting Mode overlay. Hides all workspace chrome and presents
 * the governance brief as a focused live-review surface — the boardroom
 * version of Home. Navy canvas, parchment section cards, gold command bar.
 *
 * Activation:  ?present=1 param or internal state in ReportDetail
 * Exit:        "Exit" button in bar, or Escape key
 * Print:       Print button inside the present-mode header section
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type BriefPresentModeProps = {
  active: boolean;
  onExit: () => void;
  /** Brief title shown in the command bar — keeps context visible while scrolling */
  briefTitle?: string;
  children: ReactNode;
};

export default function BriefPresentMode({ active, onExit, briefTitle, children }: BriefPresentModeProps) {
  // Keyboard exit
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onExit();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, onExit]);

  // Lock body scroll while active
  useEffect(() => {
    if (!active) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [active]);

  if (!active) return null;

  return (
    <div
      role="dialog"
      aria-label="Meeting view"
      aria-modal="true"
      className="brief-present-overlay"
    >
      {/* Command bar */}
      <div className="brief-present-bar" aria-label="Meeting Mode controls">
        <span className="brief-present-bar-label">Meeting Mode</span>
        {briefTitle ? (
          <span className="brief-present-bar-context" aria-hidden>{briefTitle}</span>
        ) : null}
        <span className="brief-present-bar-hint">Esc to exit</span>
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

      {/* Scrollable content area */}
      <div className="brief-present-scroll">
        <div className="brief-present-content">
          {children}
        </div>
      </div>
    </div>
  );
}
