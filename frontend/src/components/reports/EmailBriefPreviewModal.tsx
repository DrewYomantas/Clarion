import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { PartnerBriefDeliveryStatus } from "@/api/authService";

type EmailBriefPreviewModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The governance brief name / matter identifier shown in the confirmation */
  matter?: string;
  averageRating: string;
  topIssue: string;
  exampleQuote: string;
  recommendedDiscussion: string;
  htmlSummary: string;
  onSend: () => void;
  isSending?: boolean;
  deliveryStatus?: PartnerBriefDeliveryStatus | null;
  deliveryStatusLoading?: boolean;
};

export default function EmailBriefPreviewModal({
  open,
  onOpenChange,
  matter,
  averageRating,
  topIssue,
  exampleQuote,
  recommendedDiscussion,
  htmlSummary,
  onSend,
  isSending = false,
  deliveryStatus = null,
  deliveryStatusLoading = false,
}: EmailBriefPreviewModalProps) {
  const deliveryUnavailable = deliveryStatus && !deliveryStatus.delivery_available;
  const deliveryStateKnown = Boolean(deliveryStatus);
  const sendDisabled = isSending || deliveryStatusLoading || !deliveryStateKnown || Boolean(deliveryUnavailable);
  const sendLabel = isSending
    ? "Sending…"
    : deliveryStatusLoading
      ? "Checking delivery…"
      : !deliveryStateKnown
        ? "Delivery status unavailable"
        : deliveryUnavailable
          ? "Delivery unavailable"
          : "Send Brief";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Send Brief</DialogTitle>
          <DialogDescription>
            Confirm the details below before sending. This delivers the brief immediately to the configured recipient list.
          </DialogDescription>
        </DialogHeader>

        {/* Confirmation: matter + recipient */}
        {(matter || deliveryStatus) && (
          <section className="rounded-[10px] border border-[#E5E7EB] bg-[#FAFBFC] p-4">
            <h3 className="text-sm font-semibold text-[#0D1B2A]">Confirm send details</h3>
            <div className="mt-3 space-y-2">
              {matter && (
                <div className="flex gap-3">
                  <p className="w-20 shrink-0 text-xs uppercase tracking-[0.08em] text-[#6B7280]">Matter</p>
                  <p className="text-sm text-[#0D1B2A]">{matter}</p>
                </div>
              )}
              {deliveryStatus?.delivery_available && deliveryStatus.recipients.length > 0 && (
                <div className="flex gap-3">
                  <p className="w-20 shrink-0 text-xs uppercase tracking-[0.08em] text-[#6B7280]">Recipients</p>
                  <p className="text-sm text-[#0D1B2A] break-all">{deliveryStatus.recipients.join(", ")}</p>
                </div>
              )}
              {deliveryStatus?.delivery_available && deliveryStatus.from_email && (
                <div className="flex gap-3">
                  <p className="w-20 shrink-0 text-xs uppercase tracking-[0.08em] text-[#6B7280]">From</p>
                  <p className="text-sm text-[#0D1B2A]">{deliveryStatus.from_email}</p>
                </div>
              )}
            </div>
          </section>
        )}

        <section className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#0D1B2A]">Current Governance Brief Snapshot</h3>
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            <div className="rounded-[8px] border border-[#E5E7EB] bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-[#6B7280]">Leadership Briefing</p>
              <p className="mt-1 text-sm text-[#0D1B2A]">{averageRating}</p>
            </div>
            <div className="rounded-[8px] border border-[#E5E7EB] bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-[#6B7280]">Signals That Matter Most</p>
              <p className="mt-1 text-sm text-[#0D1B2A]">{topIssue}</p>
            </div>
            <div className="rounded-[8px] border border-[#E5E7EB] bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-[#6B7280]">Decisions &amp; Next Steps</p>
              <p className="mt-1 text-sm text-[#0D1B2A]">{recommendedDiscussion}</p>
            </div>
            <div className="rounded-[8px] border border-[#E5E7EB] bg-slate-50 p-3">
              <p className="text-xs uppercase tracking-[0.08em] text-[#6B7280]">Supporting Client Evidence</p>
              <p className="mt-1 text-sm text-[#0D1B2A]">&quot;{exampleQuote}&quot;</p>
            </div>
          </div>
        </section>

        {deliveryUnavailable && (
          <section className="rounded-[10px] border border-amber-200 bg-amber-50 p-4">
            <p className="text-sm font-medium text-amber-900">Delivery not configured</p>
            <p className="mt-1 text-sm text-amber-800">
              Partner brief delivery is not set up for this workspace. Configure outbound email and a recipient list before sending.
            </p>
          </section>
        )}

        <section className="rounded-[10px] border border-[#E5E7EB] bg-white p-4">
          <h3 className="text-sm font-semibold text-[#0D1B2A]">Governance Brief Email Preview</h3>
          <div className="mt-3 overflow-hidden rounded-[8px] border border-[#E5E7EB] bg-white">
            <iframe
              title="Governance brief email preview"
              srcDoc={htmlSummary}
              className="h-[420px] w-full bg-white"
            />
          </div>
        </section>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            className="gov-btn-secondary"
            onClick={() => onOpenChange(false)}
            disabled={isSending}
          >
            Cancel
          </button>
          <button
            type="button"
            className="gov-btn-primary"
            onClick={onSend}
            disabled={sendDisabled}
          >
            {sendLabel}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
