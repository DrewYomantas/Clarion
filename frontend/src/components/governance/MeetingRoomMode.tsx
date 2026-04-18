import { Printer } from "lucide-react";
import type { ReactNode } from "react";
import type { ReportActionItem, ReportDetail } from "@/api/authService";
import GovStatusChip, { resolveChipVariantForActionStatus } from "@/components/governance/GovStatusChip";

type DecisionItem = {
  theme: string;
  recommendation: string;
};

type MeetingRoomModeProps = {
  report: ReportDetail;
  decisionItems: DecisionItem[];
  actions: ReportActionItem[];
  activeActionCount: number;
  overdueCount: number;
  unassignedCount: number;
  undatedCount: number;
  completedCount: number;
  escalation: { on: boolean; reason: string };
  canSendBrief: boolean;
  formatDate: (value: string | null | undefined) => string;
  formatDateTime: (value: string | null | undefined) => string;
  statusLabel: (value: string | null | undefined) => string;
  isOverdue: (action: ReportActionItem) => boolean;
  isUnassigned: (action: ReportActionItem) => boolean;
  onCreateFollowThrough: (theme?: string | null) => void;
  onSendBrief: () => void;
};

function MeetingRoomSection({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`meeting-room-section ${className}`}>
      <p className="meeting-room-eyebrow">{eyebrow}</p>
      <h2 className="meeting-room-section-title">{title}</h2>
      <div className="meeting-room-section-body">{children}</div>
    </section>
  );
}

export default function MeetingRoomMode({
  report,
  decisionItems,
  actions,
  activeActionCount,
  overdueCount,
  unassignedCount,
  undatedCount,
  completedCount,
  escalation,
  canSendBrief,
  formatDate,
  formatDateTime,
  statusLabel,
  isOverdue,
  isUnassigned,
  onCreateFollowThrough,
  onSendBrief,
}: MeetingRoomModeProps) {
  const firstDecision = decisionItems[0] || null;
  const meetingDecisionTitle =
    firstDecision?.theme ||
    report.themes[0]?.name ||
    "Current governance discussion";
  const meetingDecisionBody =
    firstDecision?.recommendation ||
    "Review the current client issues, confirm ownership, and decide what moves into follow-through.";
  const meetingStatus = escalation.on
    ? "Decision required"
    : activeActionCount > 0
      ? "Follow-through open"
      : "Ready to close";
  const meetingStatusDetail = escalation.on
    ? escalation.reason
    : activeActionCount > 0
      ? `${activeActionCount} open action${activeActionCount === 1 ? "" : "s"} remain active.`
      : "No open follow-through remains for this cycle.";
  const meetingAgendaItems = [
    {
      label: "Primary decision",
      title: meetingDecisionTitle,
      body: meetingDecisionBody,
      urgent: escalation.on,
    },
    ...decisionItems.slice(1, 4).map((item) => ({
      label: "Supporting decision",
      title: item.theme,
      body: item.recommendation,
      urgent: false,
    })),
  ];

  if (escalation.on) {
    meetingAgendaItems.push({
      label: "Governance blocker",
      title: "Follow-through readiness",
      body: `${overdueCount} overdue, ${unassignedCount} unassigned, ${undatedCount} missing due date.`,
      urgent: true,
    });
  }

  const meetingEvidenceThemes = report.themes.slice(0, 4);
  const meetingEvidenceQuotes = report.top_complaints.slice(0, 3);
  const meetingHandoff = overdueCount > 0
    ? `${overdueCount} overdue item${overdueCount === 1 ? "" : "s"} should be reviewed before the cycle closes.`
    : unassignedCount > 0
      ? `${unassignedCount} action${unassignedCount === 1 ? " needs" : "s need"} ownership before handoff.`
      : activeActionCount > 0
        ? `${activeActionCount} open action${activeActionCount === 1 ? "" : "s"} remain in motion after this room.`
        : "The action record is clear for this cycle.";

  return (
    <>
      <header className="meeting-room-hero">
        <div className="meeting-room-hero-main">
          <p className="meeting-room-eyebrow">Current cycle</p>
          <h1>{report.name || report.title}</h1>
          <p>{meetingDecisionBody}</p>
        </div>
        <div className="meeting-room-hero-context" aria-label="Cycle context">
          {report.review_date_label ? (
            <div>
              <span>Review period</span>
              <strong>{report.review_date_label}</strong>
            </div>
          ) : null}
          <div>
            <span>Reviews analyzed</span>
            <strong>{report.total_reviews}</strong>
          </div>
          <div>
            <span>Generated</span>
            <strong>{formatDateTime(report.created_at)}</strong>
          </div>
          <div>
            <span>Status</span>
            <strong className={escalation.on ? "meeting-room-risk-text" : ""}>{meetingStatus}</strong>
          </div>
        </div>
      </header>

      <div className="meeting-room-layout">
        <main className="meeting-room-main">
          <section className="meeting-current-discussion" aria-label="Current discussion">
            <p className="meeting-room-eyebrow">Current discussion</p>
            <h2>{meetingDecisionTitle}</h2>
            <p>{meetingDecisionBody}</p>
            <div className="meeting-current-state">
              {escalation.on ? <GovStatusChip label="Escalation required" variant="risk" size="sm" /> : null}
              {overdueCount > 0 ? <GovStatusChip label={`${overdueCount} overdue`} variant="risk" size="sm" /> : null}
              {unassignedCount > 0 ? <GovStatusChip label={`${unassignedCount} unassigned`} variant="warn" size="sm" /> : null}
              {activeActionCount > 0 ? <GovStatusChip label={`${activeActionCount} open`} variant="warn" size="sm" /> : null}
              {activeActionCount === 0 && !escalation.on ? <GovStatusChip label="Clear" variant="success" size="sm" /> : null}
            </div>
          </section>

          <MeetingRoomSection eyebrow="Decision agenda" title="Sequence for the room">
            <ol className="meeting-agenda-list">
              {meetingAgendaItems.map((item, index) => (
                <li key={`${item.label}-${index}`} className={item.urgent ? "meeting-agenda-item meeting-agenda-item--urgent" : "meeting-agenda-item"}>
                  <span className="meeting-agenda-number">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="meeting-agenda-label">{item.label}</p>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </MeetingRoomSection>
        </main>

        <aside className="meeting-room-context">
          <MeetingRoomSection eyebrow="Room state" title={meetingStatus}>
            <div className="meeting-state-list">
              <div>
                <span>Open actions</span>
                <strong>{activeActionCount}</strong>
              </div>
              <div>
                <span>Overdue</span>
                <strong className={overdueCount > 0 ? "meeting-room-risk-text" : ""}>{overdueCount}</strong>
              </div>
              <div>
                <span>Unassigned</span>
                <strong className={unassignedCount > 0 ? "meeting-room-warn-text" : ""}>{unassignedCount}</strong>
              </div>
              <div>
                <span>Completed</span>
                <strong>{completedCount}</strong>
              </div>
            </div>
            <p className="meeting-room-state-note">{meetingStatusDetail}</p>
          </MeetingRoomSection>

          <MeetingRoomSection eyebrow="After this room" title="Handoff">
            <p className="meeting-room-state-note">{meetingHandoff}</p>
            <div className="meeting-room-actions">
              <button type="button" onClick={() => onCreateFollowThrough(meetingDecisionTitle)} className="meeting-room-primary-action">
                Create linked follow-through
              </button>
              <button
                type="button"
                onClick={() => document.querySelector(".meeting-room-follow-through")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="meeting-room-secondary-action"
              >
                Review follow-through
              </button>
            </div>
          </MeetingRoomSection>
        </aside>
      </div>

      <div className="meeting-room-lower">
        <MeetingRoomSection eyebrow="Evidence" title="What supports the discussion">
          <div className="meeting-evidence-grid">
            <div>
              <p className="meeting-room-minor-heading">Issue themes</p>
              {meetingEvidenceThemes.length > 0 ? (
                <ul className="meeting-theme-list">
                  {meetingEvidenceThemes.map((theme) => (
                    <li key={theme.name}>
                      <span>{theme.name}</span>
                      <strong>{theme.mentions} mention{theme.mentions === 1 ? "" : "s"}</strong>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="meeting-empty-copy">No issue themes were identified for this cycle.</p>
              )}
            </div>
            <div>
              <p className="meeting-room-minor-heading">Client evidence</p>
              {meetingEvidenceQuotes.length > 0 ? (
                <div className="meeting-quote-list">
                  {meetingEvidenceQuotes.map((quote, index) => (
                    <blockquote key={`meeting-quote-${index}`}>{quote}</blockquote>
                  ))}
                </div>
              ) : (
                <p className="meeting-empty-copy">No client concern excerpts are available for this cycle.</p>
              )}
            </div>
          </div>
        </MeetingRoomSection>

        <MeetingRoomSection eyebrow="Follow-through" title="What can be confirmed from here" className="meeting-room-follow-through">
          {actions.length === 0 ? (
            <p className="meeting-empty-copy">No follow-through items have been recorded for this brief yet.</p>
          ) : (
            <div className="meeting-follow-list">
              {actions.slice(0, 5).map((action) => (
                <article key={action.id} className="meeting-follow-item">
                  <div>
                    <h3>{action.title}</h3>
                    <p>
                      Owner: {(action.owner || "Unassigned").trim() || "Unassigned"} - Due: {formatDate(action.due_date)}
                    </p>
                  </div>
                  <div className="meeting-follow-status">
                    <GovStatusChip
                      label={statusLabel(action.status)}
                      variant={resolveChipVariantForActionStatus(action.status, isOverdue(action))}
                      size="sm"
                    />
                    {isOverdue(action) ? <GovStatusChip label="Overdue" variant="risk" size="sm" /> : null}
                    {isUnassigned(action) ? <GovStatusChip label="Unassigned" variant="warn" size="sm" /> : null}
                  </div>
                </article>
              ))}
            </div>
          )}
        </MeetingRoomSection>
      </div>

      <footer className="meeting-room-footer">
        <p>{meetingHandoff}</p>
        <div>
          {canSendBrief ? (
            <button type="button" onClick={onSendBrief} className="meeting-room-secondary-action">
              Send brief
            </button>
          ) : null}
          <button type="button" onClick={() => window.print()} className="meeting-room-secondary-action">
            <Printer size={12} aria-hidden />
            Print / Export PDF
          </button>
        </div>
      </footer>
    </>
  );
}
