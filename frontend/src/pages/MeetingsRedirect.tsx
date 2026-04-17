/**
 * MeetingsRedirect
 * /dashboard/meetings is no longer a standalone page.
 * Meeting functionality lives inside ReportDetail (?present=1).
 *
 * Behavior:
 *   - If there is a current ready brief → redirect to /dashboard/reports/:id?present=1
 *   - Otherwise → redirect to /dashboard/reports
 */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getReports } from "@/api/authService";

export default function MeetingsRedirect() {
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    const redirect = async () => {
      const result = await getReports(10);
      if (!mounted) return;
      const latest = result.success && result.reports
        ? result.reports
            .filter((r) => r.status === "ready")
            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0]
        : null;
      if (latest) {
        navigate(`/dashboard/reports/${latest.id}?present=1`, { replace: true });
      } else {
        navigate("/dashboard/reports", { replace: true });
      }
    };
    void redirect();
    return () => { mounted = false; };
  }, [navigate]);

  return null;
}
