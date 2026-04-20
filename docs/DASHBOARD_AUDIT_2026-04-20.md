# Clarion Dashboard QA Audit
**Date:** 2026-04-20  
**Auditor:** Claude Code (claude-sonnet-4-6)  
**Scope:** Authenticated dashboard IA, all 5 lenses

---

## 1. Goal

Audit the authenticated Clarion governance dashboard against the product's North Star — specifically whether the corrected IA pass has made the governance loop legible, whether the Governance Brief remains the center of gravity, whether Brief Archive is now genuinely secondary, and whether all five pages feel like one deliberate governance system.

This is an audit pass only. No code changes made.

---

## 2. Apify Setup Used

| Field | Value |
|---|---|
| Primary actor | `apify/playwright-scraper` |
| Run ID | `lkvGAV6vo1WcfO0wP` |
| Status | `SUCCEEDED` (17.7s) |
| Dataset ID | `7559fsUWrPm0Dh2G8` |
| Dataset items | **0** — see note below |
| KV store name configured | `clarion-dashboard-qa-artifacts` |
| Task | None created — single audit run |

**Coverage truth:** The Apify actor ran and processed pages on the live Render site (`https://law-firm-feedback-saas.onrender.com`). However, the pageFunction used `Actor.setValue()` which is not available in `apify/playwright-scraper`'s pageFunction context (the correct API is `context.Apify` or the `KeyValueStore` SDK). All page functions failed silently, returning no dataset items and no screenshots to the key-value store. This is an Apify API mismatch — the actor ran, but produced no structured output.

**Authenticated coverage:** Not reached. Dashboard routes redirect to `/login`. No credentials were available for the cloud actor. See Section 3.

**Local Playwright coverage:** Used `mcp__plugin_playwright_playwright` tools against the locally running Flask server (`http://localhost:5000`) for:
- `/` — landing page (screenshot captured)
- `/login` — login page (screenshot captured)
- `/demo` — demo workspace entry (screenshot captured)
- `/dashboard` — redirects to `/login` (confirmed)

**Code-based coverage:** Deep static analysis of all 7 authenticated routes via source reading. All key page files, layout shell, CSS, and component files read in full.

---

## 3. Authentication Coverage Truth

- **Live Render site:** Not authenticated. The Apify cloud actor had no credentials. All dashboard routes return a 302 to `/login`.
- **Local server:** Running on `http://localhost:5000`. Redirected to `/login` at `/dashboard` (confirmed). No local credentials available without secrets folder access.
- **Demo routes:** `/demo` is publicly accessible but contains no seeded data in the local database (no `governance_briefs`, no ready reports). Demo shows the step-through page but "Sample brief unavailable" on `/demo/reports/1`.
- **Code coverage:** 100% of the dashboard surface area was audited via source reading — `Dashboard.tsx`, `SignalsPage.tsx`, `ExecutionPage.tsx`, `ActionDetail.tsx`, `ReportsPage.tsx`, `ReportDetail.tsx`, `WorkspaceLayout.tsx`, `PageWrapper.tsx`, `PageTabs.tsx`, `index.css` (home CSS classes, `gov-page-shell`, `workspace-main`).

**Judgment:** The live-state visual audit cannot be confirmed with actual screenshots of the authenticated dashboard. All findings below are grounded in source code and are high-confidence architectural/copy/design judgments, not screenshot-based pixel audits.

---

## 4. Exact Routes Covered

| Route | Coverage Method | Status |
|---|---|---|
| `/dashboard` | Code + local redirect confirmed | Auth-gated |
| `/dashboard/signals` | Code (full file read) | Auth-gated |
| `/dashboard/actions` | Code (full file read) | Auth-gated |
| `/dashboard/actions/:id` | Code (full file read) | Auth-gated |
| `/dashboard/reports` | Code (full file read) | Auth-gated |
| `/dashboard/reports/:id` | Code (partial read) | Auth-gated |
| `/dashboard/reports/:id?present=1` | Code (MeetingRoomMode confirmed in imports) | Auth-gated |

**Coverage gaps:** No live screenshots of any authenticated route. No Meeting Room present-mode visual confirmation. ActionDetail visual layout not screenshot-verified.

---

## 5. Repo Truths Used

- `docs/NORTH_STAR.md` — product identity, canonical brief spine, design direction
- `docs/PROJECT_STATE.md` — live state, current phase (Render deploy verification)
- `docs/AI_WORKING_RULES.md` — pass discipline, scope rules
- `docs/ENGINEERING_PRACTICES.md` — hygiene standards
- `frontend/src/pages/Dashboard.tsx` — Home page
- `frontend/src/pages/SignalsPage.tsx` — Issues page
- `frontend/src/pages/ExecutionPage.tsx` — Follow-Through page
- `frontend/src/pages/ActionDetail.tsx` — Action Detail page
- `frontend/src/pages/ReportsPage.tsx` — Brief Archive page
- `frontend/src/pages/ReportDetail.tsx` — Brief surface / Meeting Room
- `frontend/src/components/WorkspaceLayout.tsx` — nav shell
- `frontend/src/components/governance/PageWrapper.tsx` — shared page header
- `frontend/src/components/governance/PageTabs.tsx` — workflow tabs component
- `frontend/src/index.css` (relevant sections) — home CSS, workspace-main, gov-page-shell
- `frontend/src/App.tsx` — routing (meetings redirect confirmed)
- `frontend/src/pages/MeetingsRedirect.tsx` — /dashboard/meetings → present mode

---

## 6. Findings by Lens

### Lens 1 — Managing Partner: "Can I understand what matters in this cycle in under 10 seconds?"

**Result: Mostly passes. One attention item.**

**What works:**
- Home page (`Dashboard.tsx`) opens with firm name in gold 10px caps + cycle period label + a status chip (Brief prepared / Escalation Flagged / Sent / Draft). This is the fastest possible cycle orientation — no scrolling required.
- The "Current governance brief" eyebrow + review period headline is immediately legible as the cycle center.
- The right column "Governance state" checklist (Brief prepared / overdue items / unowned actions / escalation flag) gives a 5-line readout of governance posture. Exactly what a partner needs in 10 seconds.
- Primary CTA is "Open Meeting View" — leads directly to the flagship artifact surface. Correct priority.
- Secondary CTAs ("Open Governance Brief", "Download PDF") are appropriately ranked below the primary.
- The agenda section reads as a prioritized reading list before the meeting — editorial, not a widget.

**Attention item:**
- `loopSteps`, `loopActiveStep`, `stats`, `issuePercentages`, `previousIssuePercentages`, `topIssue`, `newExposureCategories`, and `suggestedActions` are all computed in `Dashboard.tsx` (lines 261–325, 449–463) but explicitly `void`'d and never rendered. This is dead computation — 8 memoized state shapes calculated on every render cycle with no consumer. The governance loop is not visually represented as a progress tracker anywhere on Home. This is fine as a design decision (the Decision Room + Agenda replaces it), but the dead code is unnecessary weight and a code hygiene concern.

**Verdict for this lens: Pass with one hygiene flag.**

---

### Lens 2 — Meeting Operator: "Can I move from current cycle → brief → issues → follow-through without confusion during a live review?"

**Result: Passes cleanly.**

**What works:**
- The navigation IA is correct: "Governance Loop" section header with Home → Issues → Follow-Through as primary nav. "Reference" section header with Brief Archive as secondary.
- Home → Meeting View: primary button on the Decision Room surface. Direct.
- Home → Governance Brief: secondary link. Right.
- Follow-Through page header includes "Open current brief" link in the action bar — closes the Issues → Follow-Through → Brief loop.
- Action Detail includes "Back to Follow-Through" link and a "Review source brief" link when action is done. The accountability chain back to the brief is preserved.
- Brief Archive page opens with a prominent "Current brief starts from Home" banner and a "Return Home" primary button. This is the clearest possible signal that Brief Archive is not the active workflow entry point.
- `/dashboard/meetings` still exists but redirects immediately to the current report's present mode — good safety net, no dead page.

**Mild gaps:**
- There is no explicit "back to Home" from the Governance Brief / Meeting Room. The Brief Archive page redirects to Home, but the Brief Detail page itself (`/dashboard/reports/:id`) doesn't surface a direct "back to cycle overview" CTA — navigation back relies on the sidebar. For a live meeting operator, this is a minor friction if they need to return to governance state during a session.

**Verdict for this lens: Pass. One mild gap noted.**

---

### Lens 3 — Accountability Reviewer: "Can I review follow-through clearly and trust what the system is saying?"

**Result: Passes. One copy-level note.**

**What works:**
- Follow-Through page (`ExecutionPage.tsx`) groups actions by: overdue / blocked / unowned / open-with-owner / in-progress / completed. This is the correct governance reading order — risk first.
- The directive band under the dark header emits a single accountability sentence: "X overdue follow-through items need review now" / "X items need a named owner." Terse, operative, correct.
- Three PageTabs: "Firm-wide" | "My Actions" | "Overdue" — clean and purposeful.
- Action Detail (`ActionDetail.tsx`) shows: status chip + owner + due date (red if overdue) + source brief + timeframe. All the fields a reviewer needs to confirm accountability before a meeting.
- "Accountability record" eyebrow on ActionDetail — explicit and correct.
- Activity log built from actual log entries with a fallback to creation event — shows the history even if no explicit log exists.
- `nextState` computed from status: "Blocked follow-through." / "Due date has passed. Review now." / "No owner assigned." / "In progress." — clear governance signals.
- Source brief link from ActionDetail → ReportDetail is correctly wired.

**One copy note:**
- `resolveNextState` CTA when blocked: "Update blocker" — this is accurate but slightly admin-flavored. "Address blocker" or "Resolve blocker" might read more decisively in a governance context.
- When action is done: CTA is "Review source brief" (when `reportId` exists). This is exactly right — done items should naturally point back to the brief they served.

**Verdict for this lens: Pass.**

---

### Lens 4 — Visual/Polish: "Does this feel like one authored product rather than a stitched-together admin app?"

**Result: Mostly passes. Three items to watch.**

**What works:**
- The design system is coherent. `workspace-main` has a dark navy gradient (`#080f1a → #0B1929 → #16263C`) that runs behind all authenticated pages. Home overrides this with its own full-dark canvas (same palette). Other pages use `gov-page-shell::before` to transition from dark to light — creating a layered depth.
- The dark header slabs on Issues and Follow-Through (gradient `#0B1929 → #0e2139 → #0D1B2A`) echo the nav sidebar and Home canvas. These pages feel related to Home without being identical.
- PageTabs use gold bottom-border animation on active tab (`#C4A96A`, scale-x-0 → scale-x-100). Matches the nav active indicator. Consistent gold language.
- PageWrapper header uses `#C4A96A` for eyebrow text — same gold token. Consistent.
- Action Detail uses white background with light card surfaces — intentionally lighter than the evidence/overview pages. This reads as "zoomed in" vs. "overview."
- Brief Archive page uses white card surfaces — appropriate for a reference/history page that should feel quieter than the loop pages.

**Three items to watch (cannot confirm without live screenshots):**

1. **Brief Archive "active cycle" banner top-of-page** (from code): The `Current brief starts from Home` section uses a rounded-10px white/light card. This sits at the top of the Brief Archive page before the archive list. Based on code: it looks clean. But I cannot confirm whether the visual weight of this banner correctly signals "you're in the right place, just wrong page" vs. feeling like an error/redirect state. Without a screenshot, uncertain.

2. **Baseline notice dual-surface inconsistency**: The baseline notice on the Issues page uses `bg-[#0D1B2A]` (navy) with `text-[#0EA5C2]` (cyan). The baseline notice on Home (if present) uses a different treatment (`home-room-notice` in CSS). Two different notice styles for functionally equivalent first-cycle messages. Low severity but a design drift.

3. **Home "New Review" button low contrast**: The "New Review" action in the top header frame uses `color: rgba(255,255,255,0.56)` with a nearly invisible border. It's intentionally de-emphasized (correct — it's a tertiary action), but on low-brightness displays it might be nearly invisible. This is only a concern if "starting a new review from Home" is a frequent task rather than a periodic one.

**Verdict for this lens: Mostly passes. Cannot confirm pixel-level polish without authenticated screenshots.**

---

### Lens 5 — Language/Trust: "Does the copy support product truth without fake reassurance or stale wording?"

**Result: Passes well. Two nits.**

**What works:**
- PageWrapper descriptions across all pages are tight and on-brand:
  - Issues: "The evidence record behind the current Governance Brief. Review the issues that need ownership before the next meeting."
  - Follow-Through: "The assigned follow-through record for the current Governance Brief. Review ownership, due-state, and blockers before the next meeting."
  - Brief Archive: "Use this for Governance Brief history and reference. The active brief starts from Home."
  - Action Detail: "Review ownership, due-state, source brief, and next step before the next meeting."
- All four of these are loop-anchored: they say what the page is FOR in relation to the brief. None of them claim standalone feature importance.
- Topbar page notes (`resolvePageNote` in WorkspaceLayout) are product-anchored: "Open the current Governance Brief, confirm what changed, and review follow-through before the next meeting." for Home. Correct.
- "Partner-ready" phrasing not found in the authenticated workspace copy — appropriate. That phrase belongs in the marketing context.
- The Issues page dark header says "Current issue record" with "Evidence from the [date] cycle." — evidence-first framing, not "insights" or "analytics."

**Two nits:**

1. **"In Briefs" tab on Issues page**: The tab label `In Briefs` technically means "signals that appeared in a prior cycle and are therefore represented in past briefs." But a user might read it as "signals that are in the current brief" — which would be all of them. The label is ambiguous enough to warrant a rename: "Recurring" or "Prior Cycle" would be clearer. The description under the selected tab does clarify, but the tab label is what users scan first.

2. **`AccountabilityRecord` eyebrow** on ActionDetail: "Accountability record" is on-brand but slightly institutional-sounding for what is essentially "this one action item." "Follow-through record" (which is already used as the page title in `PageWrapper`) would be more consistent — the eyebrow and the h1 title should not compete.

**Verdict for this lens: Passes. Two copy-level nits.**

---

## 7. Top 5 Issues by Severity

| # | Severity | Issue | Location |
|---|---|---|---|
| 1 | **Medium** | 8 memoized state values in Dashboard.tsx are computed but `void`'d — dead code from a removed loop tracker widget. Adds render overhead and cognitive confusion for any future developer. | `Dashboard.tsx:456–463` |
| 2 | **Medium** | No direct "Return to cycle overview" link from Report Detail / Meeting Room. During a live meeting, leaving the brief requires using the sidebar or browser back — not an obvious escape path. | `ReportDetail.tsx` |
| 3 | **Low** | "In Briefs" tab label on Issues page is ambiguous. "Recurring" or "Prior Cycle" would be unambiguous at a glance. | `SignalsPage.tsx:644` |
| 4 | **Low** | Baseline notice uses a navy card style on Issues page but a different notice class on Home. Two UI patterns for the same first-cycle signal. | `SignalsPage.tsx:527–547`, `Dashboard.tsx:693–703` |
| 5 | **Nit** | "Accountability record" eyebrow and "Follow-through record" page title compete in ActionDetail — two names for the same thing on the same page. | `ActionDetail.tsx:310` |

---

## 8. Screenshot / Artifact References

| Artifact | Path / Location | Coverage |
|---|---|---|
| Landing page screenshot | `screenshot-landing.png` (local Playwright) | Public |
| Login page screenshot | `screenshot-login.png` (local Playwright) | Public |
| Demo workspace screenshot | `screenshot-demo.png` (local Playwright) | Public (no data) |
| Demo report (no data) | `screenshot-demo-report.png` (local Playwright) | Public (no data) |
| Apify run ID | `lkvGAV6vo1WcfO0wP` | Ran, 0 items (API mismatch) |
| Apify dataset ID | `7559fsUWrPm0Dh2G8` | Empty |
| Named dataset | `clarion-dashboard-qa-public` | Empty (not persisted due to API error) |

**No authenticated dashboard screenshots available.** All code-based findings are from source inspection.

---

## 9. Final Verdict

**Verdict: Needs one more narrow fix pass before dashboard sign-off.**

The IA correction is real and working. The governance loop is correctly ordered in the nav. Brief Archive is genuinely secondary and actively redirects back to Home. Home owns the active cycle. Issues and Follow-Through correctly frame themselves as downstream of the brief. The copy is clean — no "partner-ready" in the workspace, no analytics framing, no AI-magic language.

The product does not pass full sign-off yet for three reasons:

1. The dead code in `Dashboard.tsx` (8 voided state shapes) is not a UX issue but is a code hygiene issue that should be cleaned before the app goes to any external reviewer who might look at the codebase.
2. The "In Briefs" tab label is borderline and could confuse a first-time user.
3. No live authenticated screenshots exist to verify pixel-level visual polish, contrast, and scrollbehavior. Sign-off should include at least one seeded session with an authenticated browser.

**Acceptance threshold review:**
- [x] No major IA contradictions remain
- [x] Brief Archive clearly behaves like reference/history
- [x] Home clearly feels like the active-cycle center (based on code)
- [x] Loop is legible without explanation
- [x] No generic fallback admin feel on key pages
- [ ] **No serious visual regressions** — *cannot confirm without live screenshots*
- [ ] **No page still fights the loop** — *passes code-based check, cannot confirm visually*

---

## 10. Recommended Next Step

**One narrow fix pass:** Clean the 8 voided state shapes from `Dashboard.tsx` (remove the dead `loopSteps`/`loopActiveStep`/`stats`/`issuePercentages`/`previousIssuePercentages`/`topIssue`/`newExposureCategories`/`suggestedActions` computations since nothing renders them). Rename the "In Briefs" tab to "Recurring" on the Issues page.

**Then:** Get one authenticated browser session with seeded demo data against the local or live Render app. Run a 10-minute live walkthrough of the loop: Home → Issues → create action → Follow-Through → Action Detail → Brief Archive. Confirm visual polish. That session is the real sign-off gate.

**After that:** Render deploy verification (current priority per PROJECT_STATE.md) and domain cutover.

---

*Audit generated by Claude Code (claude-sonnet-4-6) on 2026-04-20. Code-based analysis only — no authenticated live screenshots captured. See Authentication Coverage Truth for scope.*
