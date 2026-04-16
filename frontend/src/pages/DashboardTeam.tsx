import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Mail, MoreHorizontal, Plus, RefreshCw, UserMinus, UserX } from "lucide-react";
import PageWrapper from "@/components/governance/PageWrapper";
import { useAuth } from "@/contexts/AuthContext";
import {
  getTeamMembers,
  inviteTeamMember,
  updateTeamMemberRole,
  updateTeamMemberStatus,
  type TeamMember,
  type TeamMemberRole,
} from "@/api/authService";

// ─── helpers ─────────────────────────────────────────────────────────────────

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const roleBadge = (role: TeamMemberRole) => {
  const base = "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.04em]";
  if (role === "owner") return `${base} border-[#C4A96A]/40 bg-[#C4A96A]/10 text-[#8A6E30]`;
  if (role === "partner") return `${base} border-[#4A7FAA]/30 bg-[#4A7FAA]/10 text-[#2D5A80]`;
  return `${base} border-[#DDD8D0] bg-[#F5F3F0] text-[#6B7280]`;
};

const statusBadge = (status: string) => {
  const base = "inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium";
  if (status === "active") return `${base} border-emerald-200 bg-emerald-50 text-emerald-700`;
  if (status === "invited") return `${base} border-[#4A7FAA]/30 bg-[#4A7FAA]/10 text-[#2D5A80]`;
  return `${base} border-rose-200 bg-rose-50 text-rose-700`;
};

const fmtDate = (iso: string | null) => {
  if (!iso) return "—";
  try { return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }); }
  catch { return "—"; }
};

// ─── Invite Modal ─────────────────────────────────────────────────────────────

interface InviteModalProps {
  onClose: () => void;
  onSuccess: (email: string) => void;
}

function InviteModal({ onClose, onSuccess }: InviteModalProps) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"partner" | "member">("member");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devToken, setDevToken] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  useEffect(() => { emailRef.current?.focus(); }, []);

  const handleSubmit = async () => {
    setError(null);
    const trimmed = email.trim().toLowerCase();
    if (!trimmed) { setError("Email is required."); return; }
    if (!isValidEmail(trimmed)) { setError("Enter a valid email address."); return; }
    setLoading(true);
    const result = await inviteTeamMember(trimmed, role);
    setLoading(false);
    if (!result.success) {
      if (result.code === "feature_unavailable") {
        setError("Team invitations are coming soon. The backend feature is not yet enabled.");
      } else {
        setError(result.error || "Failed to send invitation.");
      }
      return;
    }
    if (result.invite_token) setDevToken(result.invite_token);
    else onSuccess(trimmed);
  };

  if (devToken) {
    const acceptUrl = `${window.location.origin}/invite/accept?token=${devToken}`;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-md rounded-xl border border-[#DDD8D0] bg-white p-6 shadow-2xl">
          <h2 className="mb-1 text-base font-semibold text-[#0D1B2A]">Dev Mode — Invite Token</h2>
          <p className="mb-4 text-sm text-[#6B7280]">Email delivery is unavailable in dev mode. Use this link to test the accept flow:</p>
          <a href={acceptUrl} target="_blank" rel="noopener noreferrer"
            className="block break-all rounded border border-[#4A7FAA]/30 bg-[#4A7FAA]/8 p-3 text-xs text-[#2D5A80] hover:underline">
            {acceptUrl}
          </a>
          <button onClick={() => onSuccess(email.trim())}
            className="mt-4 w-full rounded-lg bg-[#0D1B2A] px-4 py-2 text-sm font-medium text-white hover:bg-[#152638]">
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-[#DDD8D0] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-base font-semibold text-[#0D1B2A]">Invite Team Member</h2>
            <p className="mt-0.5 text-sm text-[#6B7280]">They'll receive an email with a link to set their password and join.</p>
          </div>
          <button onClick={onClose}
            className="ml-3 shrink-0 rounded p-1 text-[#9CA3AF] hover:bg-[#F5F3F0] hover:text-[#374151]">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Email address</label>
            <input ref={emailRef} type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") void handleSubmit(); }}
              placeholder="partner@yourfirm.com" className="settings-field px-3" />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#374151]">Role</label>
            <select value={role} onChange={e => setRole(e.target.value as "partner" | "member")}
              className="settings-field px-3">
              <option value="member">Member — can view and interact with firm data</option>
              <option value="partner">Partner — elevated visibility, same as member for now</option>
            </select>
          </div>
          {error && <p className="rounded border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose}
            className="rounded-lg border border-[#DDD8D0] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F5F3F0]">
            Cancel
          </button>
          <button onClick={() => void handleSubmit()} disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0D1B2A] px-4 py-2 text-sm font-medium text-white hover:bg-[#152638] disabled:opacity-60">
            {loading ? <RefreshCw size={13} className="animate-spin" /> : <Mail size={13} />}
            {loading ? "Sending…" : "Send Invitation"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Row action menu ──────────────────────────────────────────────────────────

interface MemberMenuProps {
  member: TeamMember;
  currentUserId: number;
  isOwner: boolean;
  onRoleChange: (userId: number, role: TeamMemberRole) => void;
  onStatusChange: (userId: number, status: "active" | "suspended") => void;
}

function MemberMenu({ member, currentUserId, isOwner, onRoleChange, onStatusChange }: MemberMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  if (!isOwner || member.user_id === currentUserId) return null;

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)}
        className="rounded p-1 text-[#9CA3AF] hover:bg-[#F5F3F0] hover:text-[#374151]"
        title="Member actions">
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border border-[#DDD8D0] bg-white py-1 shadow-lg">
          {member.role !== "partner" && (
            <button onClick={() => { onRoleChange(member.user_id, "partner"); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#374151] hover:bg-[#F5F3F0]">
              Promote to Partner
            </button>
          )}
          {member.role !== "member" && member.role !== "owner" && (
            <button onClick={() => { onRoleChange(member.user_id, "member"); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-[#374151] hover:bg-[#F5F3F0]">
              Demote to Member
            </button>
          )}
          <div className="my-1 h-px bg-[#F5F3F0]" />
          {member.status === "active" ? (
            <button onClick={() => { onStatusChange(member.user_id, "suspended"); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50">
              <UserX size={13} /> Suspend Access
            </button>
          ) : member.status === "suspended" ? (
            <button onClick={() => { onStatusChange(member.user_id, "active"); setOpen(false); }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50">
              <UserMinus size={13} /> Restore Access
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function DashboardTeam() {
  const { user } = useAuth();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);

  const currentUserId = user?.id ?? -1;
  const isOwner = user?.firm_role === "owner";

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getTeamMembers();
    setLoading(false);
    if (!result.success) { setError(result.error || "Unable to load team members."); return; }
    setMembers(result.members ?? []);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const handleRoleChange = async (userId: number, role: TeamMemberRole) => {
    const result = await updateTeamMemberRole(userId, role);
    if (!result.success) { toast.error(result.error || "Unable to update role."); return; }
    toast.success("Role updated.");
    setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, role } : m));
  };

  const handleStatusChange = async (userId: number, status: "active" | "suspended") => {
    const result = await updateTeamMemberStatus(userId, status);
    if (!result.success) { toast.error(result.error || "Unable to update member status."); return; }
    toast.success(status === "suspended" ? "Access suspended." : "Access restored.");
    setMembers(prev => prev.map(m => m.user_id === userId ? { ...m, status } : m));
  };

  const handleInviteSuccess = (email: string) => {
    setInviteOpen(false);
    toast.success(`Invitation sent to ${email}`);
    void load();
  };

  const active = members.filter(m => m.status === "active").length;
  const invited = members.filter(m => m.status === "invited").length;

  return (
    <>
      {inviteOpen && <InviteModal onClose={() => setInviteOpen(false)} onSuccess={handleInviteSuccess} />}

      <PageWrapper
        eyebrow="Workspace"
        title="Team"
        description="Manage firm members and invite new colleagues."
        actions={
          isOwner ? (
            <button
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white hover:bg-white/15"
            >
              <Plus size={14} /> Invite Member
            </button>
          ) : null
        }
      >
        <div className="settings-card">
          {/* Seat counter */}
          <div className="mb-5 flex items-center justify-between border-b border-[#EAE7E2] pb-4">
            <div className="flex items-center gap-4 text-sm text-[#6B7280]">
              <span><span className="font-semibold text-[#0D1B2A]">{active}</span> active</span>
              {invited > 0 && (
                <span><span className="font-semibold text-[#2D5A80]">{invited}</span> pending invite{invited !== 1 ? "s" : ""}</span>
              )}
              <span className="text-[#C4B9AA]">·</span>
              <span>Unlimited seats</span>
            </div>
            <button onClick={() => void load()} title="Refresh"
              className="rounded p-1.5 text-[#9CA3AF] hover:bg-[#F5F3F0] hover:text-[#374151]">
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Member list */}
          {loading && members.length === 0 && (
            <div className="py-10 text-center text-sm text-[#9CA3AF]">Loading members…</div>
          )}
          {!loading && error && (
            <div className="rounded border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          )}
          {!loading && !error && members.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-sm text-[#9CA3AF]">No team members yet.</p>
              {isOwner && (
                <button onClick={() => setInviteOpen(true)}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-[#DDD8D0] px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#F5F3F0]">
                  <Plus size={13} /> Invite your first member
                </button>
              )}
            </div>
          )}
          {members.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#EAE7E2]">
                    <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Member</th>
                    <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Role</th>
                    <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Status</th>
                    <th className="pb-2 text-left text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9CA3AF]">Joined</th>
                    {isOwner && <th className="pb-2" />}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F5F3F0]">
                  {members.map(member => (
                    <tr key={member.user_id} className="group">
                      <td className="py-3 pr-4">
                        <div className="font-medium leading-none text-[#0D1B2A]">{member.email}</div>
                        {member.status === "invited" && (
                          <div className="mt-0.5 text-[11px] text-[#9CA3AF]">Invited {fmtDate(member.invited_at)}</div>
                        )}
                      </td>
                      <td className="py-3 pr-4">
                        <span className={roleBadge(member.role)}>{member.role}</span>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={statusBadge(member.status)}>{member.status}</span>
                      </td>
                      <td className="py-3 pr-4 text-[#9CA3AF]">{fmtDate(member.joined_at)}</td>
                      {isOwner && (
                        <td className="py-3 text-right">
                          <MemberMenu
                            member={member}
                            currentUserId={currentUserId}
                            isOwner={isOwner}
                            onRoleChange={(id, role) => void handleRoleChange(id, role)}
                            onStatusChange={(id, status) => void handleStatusChange(id, status)}
                          />
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {!isOwner && (
          <p className="text-xs text-[#9CA3AF]">Only firm owners can invite or manage team members.</p>
        )}
      </PageWrapper>
    </>
  );
}
