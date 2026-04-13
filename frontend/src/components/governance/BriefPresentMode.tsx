/**
 * BriefPresentMode
 * ─────────────────────────────────────────────────────────────────────────────
 * Wraps ReportDetail content in a full-screen present mode overlay.
 *
 * Present mode intent:
 *   - Hides all nav/sidebar chrome (WorkspaceLayout stays mounted but invisible)
 *   - Expands content to comfortable reading width (max-w-4xl centred)
 *   - Slightly larger base font for on-screen legibility
 *   - Simplified, print-safe color palette (no background gradients)
 *   - Print CSS baked in via @media print rules in this component
 *
 * Activation:
 *   - Toggled via internal React state in ReportDetail; ?present=1 param also accepted
 *   - Exit via "Exit presentation" button or Escape key
 *
 * Usage:
 *   <BriefPresentMode active={presentMode} onExit={() => setPresentMode(false)}>
 *     {/* page sections *\/}
 *   </BriefPresentMode>
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";

type BriefPresentModeProps = {
  active: boolean;
  onExit: () => void;
  children: ReactNode;
};

export default function BriefPresentMode({ active, onExit, children }: BriefPresentModeProps) {
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
      {/* Exit bar */}
      <div className="brief-present-bar" aria-label="Presentation controls">
        <span className="brief-present-bar-label">Meeting view</span>
        <span className="brief-present-bar-hint">Press Esc to exit</span>
        <button
          type="button"
          onClick={onExit}
          aria-label="Exit meeting view"
          className="brief-present-exit-btn"
        >
          <X size={14} aria-hidden />
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
