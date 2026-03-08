import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, Eye, EyeOff, RefreshCw } from "lucide-react";
import { acceptTeamInvite } from "@/api/authService";

// ─── helpers ──────────────────────────────────────────────────────────────────

const pwStrength = (pw: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { score, label: "Weak", color: "bg-rose-400" };
  if (score <= 3) return { score, label: "Fair", color: "bg-amber-400" };
  return { score, label: "Strong", color: "bg-emerald-500" };
};

const inputClass = "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#0EA5C2] focus:outline-none focus:ring-2 focus:ring-[#0EA5C2]/20";
const labelClass = "mb-1.5 block text-xs font-semibold text-neutral-700";

// ─── Password field with show/hide toggle ────────────────────────────────────

function PasswordField({
  label, value, onChange, placeholder, id,
}: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; id: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={labelClass}>{label}</label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} pr-10`}
          autoComplete={id === "password" ? "new-password" : "new-password"}
        />
        <button type="button" onClick={() => setShow(v => !v)} tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600">
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function InviteAccept() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Token comes in via ?token= (backend returns /accept-invite?token=... in dev mode)
  const token = (searchParams.get("token") ?? "").trim();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Validate token presence immediately
  const tokenMissing = !token;

  const strength = pwStrength(password);

  const handleAccept = async () => {
    setSubmitError(null);
    if (!password) { setSubmitError("Password is required."); return; }
    if (password.length < 8) { setSubmitError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setSubmitError("Passwords do not match."); return; }

    setSubmitting(true);
    const result = await acceptTeamInvite(token, password);
    setSubmitting(false);

    if (!result.success) {
      setSubmitError(result.error || "Unable to accept invitation. The link may be expired or already used.");
      return;
    }
    setDone(true);
  };

  // ── Token missing ─────────────────────────────────────────────────────────
  if (tokenMissing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
            <span className="text-xl">⚠️</span>
          </div>
          <h1 className="mb-2 text-lg font-semibold text-neutral-900">Invalid invite link</h1>
          <p className="mb-6 text-sm text-neutral-500">This link is missing a required token. Check your email for the original invitation link.</p>
          <button onClick={() => navigate("/login")}
            className="text-sm font-medium text-[#0EA5C2] hover:underline">← Go to login</button>
        </div>
      </div>
    );
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (done) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <CheckCircle className="mx-auto mb-4 text-emerald-500" size={44} />
          <h1 className="mb-2 text-lg font-semibold text-neutral-900">You're in!</h1>
          <p className="mb-6 text-sm text-neutral-500">Your account is set up. Log in with the email and password you just created.</p>
          <button onClick={() => navigate("/login")}
            className="w-full rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1E293B]">
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Accept form ───────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">
          <span className="text-xl font-bold tracking-tight text-[#0F172A]">Clarion</span>
          <p className="mt-0.5 text-[11px] font-medium uppercase tracking-widest text-neutral-400">Client Experience Governance</p>
        </div>

        <div className="rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-neutral-900">Accept your invitation</h1>
            <p className="mt-1 text-sm text-neutral-500">Create a password to activate your account and join your firm's workspace.</p>
          </div>

          <div className="space-y-4">
            <PasswordField id="password" label="Create password" value={password}
              onChange={setPassword} placeholder="At least 8 characters" />

            {/* Strength meter */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="flex h-1.5 gap-0.5 overflow-hidden rounded-full">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className={`flex-1 rounded-full transition-colors duration-200 ${i <= strength.score ? strength.color : "bg-neutral-200"}`} />
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500">Strength: <span className="font-medium">{strength.label}</span></p>
              </div>
            )}

            <PasswordField id="confirm" label="Confirm password" value={confirm}
              onChange={setConfirm} placeholder="Re-enter password" />
          </div>

          {submitError && (
            <div className="mt-4 rounded border border-rose-200 bg-rose-50 px-3 py-2.5 text-sm text-rose-700">
              {submitError}
            </div>
          )}

          <button onClick={() => void handleAccept()} disabled={submitting}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0F172A] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#1E293B] disabled:opacity-60">
            {submitting ? <><RefreshCw size={14} className="animate-spin" /> Activating…</> : "Accept & Join Firm"}
          </button>
        </div>

        <p className="mt-6 text-center text-xs text-neutral-400">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="font-medium text-[#0EA5C2] hover:underline">Sign in</button>
        </p>
      </div>
    </div>
  );
}
