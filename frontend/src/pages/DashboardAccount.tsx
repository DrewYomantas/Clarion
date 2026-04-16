import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PageWrapper from "@/components/governance/PageWrapper";
import { useAuth } from "@/contexts/AuthContext";
import {
  cancelPendingEmailChange,
  createSupportTicket,
  getSupportTickets,
  requestEmailChange,
  resendPendingEmailChange,
  type SupportTicket,
} from "@/api/authService";

type AccountTab = "profile" | "billing" | "security";

const SUPPORT_CATEGORY_OPTIONS = [
  { value: "product_bug", label: "Product issue" },
  { value: "data_upload", label: "CSV upload help" },
  { value: "partner_brief", label: "Partner brief delivery" },
  { value: "billing", label: "Billing" },
  { value: "account_access", label: "Account access" },
  { value: "privacy", label: "Privacy request" },
  { value: "security", label: "Security issue" },
  { value: "other", label: "Other" },
] as const;

const TABS: Array<{ key: AccountTab; label: string }> = [
  { key: "profile", label: "Account" },
  { key: "billing", label: "Billing" },
  { key: "security", label: "Security" },
];

const supportCategoryLabel = (value: string) =>
  SUPPORT_CATEGORY_OPTIONS.find((o) => o.value === value)?.label || value;

const supportStatusClass = (status: string) => {
  if (status === "resolved") return "border-[#D1FAE5] bg-[#ECFDF5] text-[#065F46]";
  if (status === "in_review") return "border-[#BAE6FD] bg-[#EFF6FF] text-[#1E40AF]";
  return "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]";
};

const supportEscalationClass = (level: string) => {
  if (level === "high" || level === "critical") return "border-[#FECACA] bg-[#FEF2F2] text-[#991B1B]";
  if (level === "medium") return "border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]";
  return "border-[#DDD8D0] bg-[#F8F6F2] text-[#374151]";
};

// ── Security checklist ──────────────────────────────────────────────────────

const SecurityChecklist = () => (
  <div className="space-y-4">
    {[
      {
        label: "Implemented in Clarion",
        items: [
          ["Authentication & Session Controls", [
            "Session cookies are HttpOnly.",
            "Session cookies use SameSite=Lax by default.",
            "Secure cookie mode is enabled outside debug by configuration.",
          ]],
          ["Access Control & Firm Scoping", [
            "Firm context is required on governance API routes.",
            "Reports, actions, and governance briefs are queried with firm scope.",
            "Cross-firm access attempts are rejected.",
          ]],
          ["Request Traceability", [
            "API responses include a request ID header for support and incident tracing.",
            "Error responses include request IDs so events can be correlated in server logs.",
          ]],
          ["Upload Validation", [
            "CSV upload checks file type and required structure before processing.",
            "Server-side row limits and validation are applied during ingestion.",
          ]],
          ["Export & Abuse Controls", [
            "Plan gates and history windows are enforced server-side for report and PDF access.",
            "Rate limits are applied on authentication and high-cost API endpoints.",
          ]],
        ] as [string, string[]][],
      },
      {
        label: "Deployment responsibilities",
        items: [
          ["Transport Security (TLS/HTTPS)", ["Enforced by hosting or reverse-proxy configuration."]],
          ["Encryption at Rest", ["Provided by your infrastructure provider and database/storage configuration."]],
          ["Backup & Retention Operations", ["Managed at the deployment layer unless separately configured."]],
        ] as [string, string[]][],
      },
      {
        label: "What matters for law-firm review",
        items: [
          ["", [
            "Firm-scoped access controls for reports, actions, and client issues.",
            "Server-side plan enforcement on export and report-history endpoints.",
            "Rate limiting and request correlation for incident and abuse response.",
            "Clear separation between application controls and infrastructure controls.",
          ]],
        ] as [string, string[]][],
      },
    ].map(({ label, items }) => (
      <div key={label} className="settings-card">
        <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A6E63] mb-4">{label}</p>
        <div className="space-y-4">
          {items.map(([title, points]) => (
            <div key={title || points[0]}>
              {title && <p className="text-[13px] font-semibold text-[#0D1B2A] mb-1.5">{title}</p>}
              <ul className="space-y-1">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-[13px] text-[#374151]">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-[#CBD5E1]" aria-hidden />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// ── Main page ───────────────────────────────────────────────────────────────

const DashboardAccount = () => {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [supportLoading, setSupportLoading] = useState(false);
  const [supportError, setSupportError] = useState("");
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [supportSummary, setSupportSummary] = useState<{ open_count: number; escalated_count: number } | null>(null);
  const [supportSubmissionState, setSupportSubmissionState] = useState<{
    ticketRef: string;
    autoResponseEmailSent: boolean;
    supportNotificationSent: boolean;
  } | null>(null);
  const [supportCategory, setSupportCategory] = useState("product_bug");
  const [supportUrgency, setSupportUrgency] = useState("normal");
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [emailChangeSubmitting, setEmailChangeSubmitting] = useState(false);
  const [emailChangeBusyAction, setEmailChangeBusyAction] = useState<"resend" | "cancel" | null>(null);

  const activeTab = useMemo<AccountTab>(() => {
    const raw = (searchParams.get("tab") || "profile").toLowerCase();
    return raw === "billing" || raw === "security" || raw === "profile" ? (raw as AccountTab) : "profile";
  }, [searchParams]);

  const setTab = (tab: AccountTab) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next, { replace: true });
  };

  useEffect(() => {
    if (activeTab !== "profile") return;
    let active = true;
    const loadSupport = async () => {
      setSupportLoading(true);
      const selfResult = await getSupportTickets();
      if (!active) return;
      if (!selfResult.success || !selfResult.tickets) {
        setSupportTickets([]);
        setSupportError(selfResult.error || "Unable to load support tickets.");
        setSupportSummary(null);
      } else {
        setSupportTickets(selfResult.tickets);
        setSupportError("");
        setSupportSummary(selfResult.summary || null);
      }
      setSupportLoading(false);
    };
    void loadSupport();
    return () => { active = false; };
  }, [activeTab]);

  const refreshSupportTickets = async () => {
    const selfResult = await getSupportTickets();
    if (selfResult.success && selfResult.tickets) {
      setSupportTickets(selfResult.tickets);
      setSupportError("");
      setSupportSummary(selfResult.summary || null);
    } else {
      setSupportError(selfResult.error || "Unable to load support tickets.");
      setSupportSummary(null);
    }
  };

  const handleSupportSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSupportSubmitting(true);
    const result = await createSupportTicket({
      source: "dashboard",
      category: supportCategory,
      urgency: supportUrgency,
      subject: supportSubject,
      message: supportMessage,
    });
    setSupportSubmitting(false);
    if (!result.success || !result.ticket) {
      toast.error(result.error || "Unable to submit support request.");
      return;
    }
    setSupportSubmissionState({
      ticketRef: result.ticket.ticket_ref,
      autoResponseEmailSent: Boolean(result.auto_response_email_sent),
      supportNotificationSent: Boolean(result.support_notification_sent),
    });
    toast.success(`Support request logged under ${result.ticket.ticket_ref}.`);
    setSupportSubject("");
    setSupportMessage("");
    await refreshSupportTickets();
  };

  const pendingEmailChange = user?.pending_email_change;

  const handleEmailChangeSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setEmailChangeSubmitting(true);
    const result = await requestEmailChange({ new_email: newEmail, current_password: currentPassword });
    setEmailChangeSubmitting(false);
    if (!result.success) {
      toast.error(result.error || "Unable to start email change.");
      return;
    }
    setCurrentPassword("");
    setNewEmail("");
    await refreshUser();
    toast.success(
      result.verification_sent
        ? "Verification sent to your new email."
        : result.message || "Pending email change saved.",
    );
  };

  const handlePendingEmailResend = async () => {
    setEmailChangeBusyAction("resend");
    const result = await resendPendingEmailChange();
    setEmailChangeBusyAction(null);
    if (!result.success) { toast.error(result.error || "Unable to resend verification."); return; }
    await refreshUser();
    toast.success(result.verification_sent ? "Verification email resent." : result.message || "Verification email resend processed.");
  };

  const handlePendingEmailCancel = async () => {
    setEmailChangeBusyAction("cancel");
    const result = await cancelPendingEmailChange();
    setEmailChangeBusyAction(null);
    if (!result.success) { toast.error(result.error || "Unable to cancel pending email change."); return; }
    await refreshUser();
    toast.success("Pending email change canceled.");
  };

  return (
    <PageWrapper
      eyebrow="Workspace"
      title="Account"
      description="Profile, identity, security, and support for your Clarion workspace."
    >
      {/* Tab bar */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Account sections">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.key}
            onClick={() => setTab(tab.key)}
            className={["settings-tab", activeTab === tab.key ? "settings-tab-active" : "settings-tab-inactive"].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Profile tab */}
      {activeTab === "profile" && (
        <div className="space-y-5">
          {/* Workspace overview */}
          <div className="settings-card">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A6E63] mb-1">Workspace</p>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Firm</p>
                <p className="mt-1 text-[15px] font-semibold text-[#0D1B2A]">{user?.firm_name || "Not set"}</p>
                <p className="mt-1 text-[13px] text-[#6B7280]">Primary identity used for report ownership and leadership outputs.</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Account email</p>
                <p className="mt-1 text-[15px] font-semibold text-[#0D1B2A]">{user?.email || "Not available"}</p>
                <p className="mt-1 text-[13px] text-[#6B7280]">Sign-in and account notices are sent to this address.</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2 pt-4 border-t border-[#EEF2F7]">
              <Link to="/dashboard/billing" className="inline-flex items-center rounded-[6px] border border-[#DDD8D0] bg-[#F8F6F2] px-3 py-1.5 text-[12px] font-medium text-[#374151] transition-colors hover:bg-[#EDEBE7]">
                Billing & Credits
              </Link>
              <Link to="/dashboard/team" className="inline-flex items-center rounded-[6px] border border-[#DDD8D0] bg-[#F8F6F2] px-3 py-1.5 text-[12px] font-medium text-[#374151] transition-colors hover:bg-[#EDEBE7]">
                Team Members
              </Link>
            </div>
          </div>

          {/* Change email */}
          <div className="settings-card">
            <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A6E63] mb-1">Change email</p>
            <p className="mt-1 text-[13px] text-[#6B7280]">Your current email stays active until the new address is verified.</p>
            <form className="mt-4 space-y-3 max-w-md" onSubmit={handleEmailChangeSubmit}>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A6E63] mb-1.5">New email address</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@yourfirm.com"
                  className="settings-field"
                  autoComplete="email"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A6E63] mb-1.5">Current password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current password"
                  className="settings-field"
                  autoComplete="current-password"
                />
              </div>
              <button type="submit" disabled={emailChangeSubmitting} className="inline-flex items-center rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b] disabled:opacity-50">
                {emailChangeSubmitting ? "Sending verification…" : "Change email"}
              </button>
            </form>
            {pendingEmailChange ? (
              <div className="mt-5 rounded-[8px] border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 max-w-md">
                <p className="text-[13px] font-semibold text-[#92400E]">Pending: {pendingEmailChange.new_email}</p>
                <p className="mt-1 text-[12px] text-[#A16207]">Check that inbox and verify the link before the sign-in email changes.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button type="button" onClick={handlePendingEmailResend} disabled={emailChangeBusyAction !== null}
                    className="inline-flex items-center rounded-[6px] border border-[#FDE68A] bg-white px-3 py-1.5 text-[12px] font-medium text-[#92400E] transition-colors hover:bg-amber-50 disabled:opacity-50">
                    {emailChangeBusyAction === "resend" ? "Resending…" : "Resend verification"}
                  </button>
                  <button type="button" onClick={handlePendingEmailCancel} disabled={emailChangeBusyAction !== null}
                    className="inline-flex items-center rounded-[6px] border border-[#DDD8D0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#6B7280] transition-colors hover:bg-[#F8F6F2] disabled:opacity-50">
                    {emailChangeBusyAction === "cancel" ? "Canceling…" : "Cancel"}
                  </button>
                </div>
              </div>
            ) : null}
          </div>

          {/* Support */}
          <div className="settings-card">
            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A6E63]">Support</p>
                <p className="mt-1 text-[13px] text-[#6B7280]">Submit tracked requests for product, billing, account, or security issues.</p>
              </div>
              {supportSummary ? (
                <div className="flex items-center gap-3 text-[12px] text-[#6B7280]">
                  <span><span className="font-semibold text-[#0D1B2A]">{supportSummary.open_count}</span> open</span>
                  {supportSummary.escalated_count > 0 && (
                    <span><span className="font-semibold text-[#EF4444]">{supportSummary.escalated_count}</span> escalated</span>
                  )}
                </div>
              ) : null}
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
              {/* Submit form */}
              <div className="rounded-[8px] border border-[#EEF2F7] bg-[#FAFBFC] p-5">
                <p className="text-[13px] font-semibold text-[#0D1B2A] mb-3">Open a support ticket</p>
                <form className="space-y-3" onSubmit={handleSupportSubmit}>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A6E63] mb-1">Category</label>
                      <select value={supportCategory} onChange={(e) => setSupportCategory(e.target.value)} className="settings-field">
                        {SUPPORT_CATEGORY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A6E63] mb-1">Urgency</label>
                      <select value={supportUrgency} onChange={(e) => setSupportUrgency(e.target.value)} className="settings-field">
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A6E63] mb-1">Subject</label>
                    <input value={supportSubject} onChange={(e) => setSupportSubject(e.target.value)} placeholder="Short subject" className="settings-field" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A6E63] mb-1">Message</label>
                    <textarea value={supportMessage} onChange={(e) => setSupportMessage(e.target.value)}
                      placeholder="Describe the issue, page, validation message, or steps to reproduce."
                      className="min-h-[120px] w-full rounded-[6px] border border-[#DDD8D0] bg-white px-3 py-2 text-[13px] text-[#0D1B2A] placeholder:text-[#9CA3AF] focus:border-[#4A7FAA] focus:outline-none focus:ring-2 focus:ring-[#0EA5C2]/12" />
                  </div>
                  <button type="submit" disabled={supportSubmitting} className="inline-flex items-center rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b] disabled:opacity-50">
                    {supportSubmitting ? "Submitting…" : "Submit request"}
                  </button>
                  {supportSubmissionState ? (
                    <div className="rounded-[6px] border border-[#D1FAE5] bg-[#ECFDF5] px-3 py-3">
                      <p className="text-[12px] font-semibold text-[#065F46]">Ticket created: {supportSubmissionState.ticketRef}</p>
                      <p className="mt-1 text-[12px] text-[#047857]">
                        {supportSubmissionState.autoResponseEmailSent ? "Acknowledgement email sent." : "Ticket stored. No auto-email on this deployment."}
                      </p>
                    </div>
                  ) : null}
                </form>
              </div>

              {/* Right column: contact + history */}
              <div className="space-y-4">
                <div className="rounded-[8px] border border-[#EEF2F7] bg-[#FAFBFC] p-4">
                  <p className="text-[12px] font-semibold text-[#0D1B2A] mb-3">Direct contact</p>
                  <div className="space-y-2">
                    <a href="mailto:support@clarionhq.co" className="flex items-center text-[12px] text-[#4A7FAA] hover:text-[#0D1B2A] transition-colors">
                      support@clarionhq.co
                    </a>
                    <a href="mailto:security@clarionhq.co" className="flex items-center text-[12px] text-[#4A7FAA] hover:text-[#0D1B2A] transition-colors">
                      security@clarionhq.co
                    </a>
                  </div>
                </div>

                <div className="rounded-[8px] border border-[#EEF2F7] bg-[#FAFBFC] p-4">
                  <p className="text-[12px] font-semibold text-[#0D1B2A] mb-2">{user?.is_admin ? "Recent tickets" : "Your recent tickets"}</p>
                  {supportError ? <p className="text-[12px] text-[#EF4444]">{supportError}</p> : null}
                  {supportLoading ? (
                    <div className="space-y-2 mt-2">
                      {[1,2].map(i => <div key={i} className="h-10 animate-pulse rounded-[6px] bg-[#E5E7EB]" />)}
                    </div>
                  ) : supportTickets.length === 0 ? (
                    <p className="text-[12px] text-[#9CA3AF]">No requests yet.</p>
                  ) : (
                    <ul className="space-y-2 mt-2">
                      {supportTickets.slice(0, 5).map((ticket) => (
                        <li key={ticket.id} className="rounded-[6px] border border-[#DDD8D0] bg-white px-3 py-2.5">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-[11px] font-bold text-[#0D1B2A] uppercase tracking-[0.06em]">{ticket.ticket_ref}</p>
                              <p className="mt-0.5 text-[12px] text-[#374151]">{ticket.subject}</p>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold ${supportStatusClass(ticket.status)}`}>
                                {ticket.status.replaceAll("_", " ")}
                              </span>
                              {ticket.escalation_level !== "none" ? (
                                <span className={`inline-flex rounded border px-1.5 py-0.5 text-[10px] font-semibold ${supportEscalationClass(ticket.escalation_level)}`}>
                                  Escalated
                                </span>
                              ) : null}
                            </div>
                          </div>
                          <p className="mt-1.5 text-[11px] text-[#9CA3AF]">{supportCategoryLabel(ticket.category)} · {ticket.priority} priority</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing redirect tab */}
      {activeTab === "billing" && (
        <div className="settings-card max-w-lg">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.1em] text-[#7A6E63] mb-1">Billing & Credits</p>
          <p className="mt-2 text-[13px] text-[#6B7280]">Plan, usage, and automation scheduling are managed in Billing.</p>
          <Link to="/dashboard/billing" className="mt-4 inline-flex items-center rounded-[8px] bg-[#0D1B2A] px-4 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#16263b]">
            Open Billing & Credits
          </Link>
        </div>
      )}

      {/* Security tab */}
      {activeTab === "security" && <SecurityChecklist />}
    </PageWrapper>
  );
};

export default DashboardAccount;
