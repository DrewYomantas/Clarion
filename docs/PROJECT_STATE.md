# Clarion Project State

_This file reflects current live state. Historical detail lives in `CHANGELOG_AI.md`. Design direction and product identity live in `NORTH_STAR.md`. Working rules and protected systems live in `AI_WORKING_RULES.md`. Engineering practices and repo hygiene live in `ENGINEERING_PRACTICES.md`._

---

## Startup Reads (Every Session)
1. `NORTH_STAR.md` â€” product identity, design direction, canonical brief spine
2. `PROJECT_STATE.md` (this file) â€” live state, active issues, next pass priorities
3. `AI_WORKING_RULES.md` â€” pass discipline, protected systems, hygiene rules
4. `ENGINEERING_PRACTICES.md` â€” repo hygiene, commit format, cleanup checkpoint checklist

---

## Document Role Boundary (Authoritative)
- `NORTH_STAR.md` â€” product identity, narrative spine, design lane, canonical brief truth
- `PROJECT_STATE.md` â€” live implementation truth, current phase, active pass priorities
- `AI_WORKING_RULES.md` â€” execution discipline, protected-system handling, verification rules
- `CHANGELOG_AI.md` â€” append-only historical record of completed passes
- `ENGINEERING_PRACTICES.md` â€” repo hygiene standards, cleanup checklist, known technical debt

---

## Repository & Deployment

- **GitHub:** https://github.com/DrewYomantas/Clarion (renamed from BeyondDrewTV/law-firm-insights â€” local remote updated)
- **Live site:** https://law-firm-feedback-saas.onrender.com (Render â€” may be on stale deploy, see Render section below)
- **Local git remote:** confirmed pointing to DrewYomantas/Clarion as of 2026-03-21

### Render Deploy Status (ACTION NEEDED)
Render is likely deploying an old commit. The repo was renamed on GitHub and Render may have lost its webhook.
To fix: Render dashboard â†’ service Settings â†’ Build & Deploy â†’ reconnect to `DrewYomantas/Clarion` â†’ Manual Deploy â†’ Deploy latest commit.
Latest commit to deploy after reconnect: latest `main` head (Render is believed stale until proven otherwise).

---

## Repository Structure
- `backend/` â€” Flask monolith, APIs, services, templates, pdf_generator
- `frontend/src/` â€” React/TypeScript/Vite SPA (marketing + authenticated workspace)
- `Clarion-Agency/` â€” Agent office runtime, per-division agents, memory, execution layer
- `automation/calibration/` â€” Calibration pipeline scripts
- `data/calibration/` â€” Calibration inputs and synthetic reviews (run artifacts gitignored)
- `docs/` â€” This doc set
- `tools/` â€” Smoke test helpers, seeded workspace tooling

## Major Subsystems (Verified File Paths)
- Feedback ingestion: `backend/app.py`, `frontend/src/pages/Upload.tsx`
- Governance signal engine: `backend/services/governance_insights.py`
- Calibration: `automation/calibration/`, `backend/services/benchmark_engine.py`
- Brief/PDF output: `backend/pdf_generator.py` + report PDF routes in `backend/app.py`
- Action tracking: `frontend/src/pages/ExecutionPage.tsx` + action APIs in `backend/app.py`
- Landing: `frontend/src/pages/Index.tsx`, `frontend/src/components/landing/`
- Agent office: `Clarion-Agency/` â€” 21-agent autonomous ops system, approval queue wired into dashboard

---

## Current Phase

**Authenticated workspace completion + continuity lock is complete (2026-03-26).** Dashboard redesign is no longer the main active track.

**Landing / marketing proof + onboarding clarity pass complete (2026-03-26).** Public-facing copy now explains Clarion as a law-firm governance brief workflow centered on partner meetings, follow-through, and one review-period export.

**Launch-readiness truth test:** Near-ready with limited blockers. Product understanding is materially stronger, but public launch should wait for deployed-environment truth: Render reconnect / latest main deploy, deployed smoke across public and authenticated flows, and confirmation that setup-dependent delivery paths match live claims.

---

## Canonical Brief Section Spine (Locked)

```
1. Leadership Briefing
2. Signals That Matter Most
3. Assigned Follow-Through
4. Decisions & Next Steps
5. Supporting Client Evidence
```

All output surfaces aligned: on-screen brief, email preview modal, inline email HTML, Jinja2 email template, PDF reference layout, PDF generator.

---

## Dashboard Workspace â€” Screenshot Audit (2026-03-21)

A full walk-through of the authenticated workspace was captured in screenshots. Here is the honest assessment of every surface, ready for the next pass.

### What's Working Well (Don't Break)
- Sidebar: CLARION wordmark with SVG mark, gold "CLIENT INTELLIGENCE" label, gold active nav indicator â€” this looks sharp, keep it
- Navigation IA is correct: Workspace Home â†’ Upload Cycle â†’ Signals â†’ Follow-Through â†’ Briefs â†’ Approval Queue
- First-run empty state (Image 1) â€” copy is clear, 3-step flow is readable, layout is clean
- Upload page (Images 2-3) â€” plan limit warning is clear, upload success state with cycle details is functional
- "Supporting Cycle Context" section (Image 8) â€” the 4-card governance cycle rail (Evidence â†’ Signals â†’ Follow-Through â†’ Briefs) is a genuinely good component, keep it
- Approval Queue (Images 11-12) â€” this is the Agent Office command center. The dark card layout with PENDING badges, Outreach/Content/Account Setup tabs, and the side-panel detail view (Approve / Hold / Reject) is the best-looking surface in the workspace. This is the design direction to pull FROM for the rest of the dashboard.

### Critical Issues to Fix (Next Pass Priority Order)

**ISSUE 1 â€” Dashboard page is too long / no hierarchy**
The workspace home scrolls through: header â†’ baseline notice â†’ history notice â†’ anchor bar â†’ brief card + posture card â†’ attention now divider â†’ guidance card â†’ suggested actions (3 cards) â†’ follow-through card â†’ recent follow-through card â†’ supporting context divider â†’ since last review â†’ recent briefs â†’ oversight band â†’ governance cycle rail â†’ partner brief panel â†’ escalations â†’ workspace reference divider â†’ plan card.
That is ~18 distinct sections on one page. A managing partner will not scroll this. The brief is buried.
Fix: Collapse to 3 visual tiers maximum. Tier 1 = the brief (dominant, takes up first viewport). Tier 2 = what needs action now (compact). Tier 3 = supporting context (collapsed or linked).

**ISSUE 2 â€” Meeting View shows blank page (Image 5)**
When Meeting View is toggled on, the dashboard renders only the header and breadcrumb â€” the entire content area is empty white. This is a broken feature. The Meeting View toggle (`partnerMode` state in Dashboard.tsx) is not rendering its content.
Fix: Read the `partnerMode` conditional in Dashboard.tsx and find why the meeting-view content block is not rendering. This is likely a conditional render that evaluates to null.

**ISSUE 3 â€” Date/time display appears wrong**
User flagged that time and date are wrong. The topbar shows "Last processed Mar 22, 2026, 04:02 AM" â€” this is likely a timezone display issue (server stores UTC, frontend displays UTC without local conversion).
Fix: Audit `formatDateTime` in Dashboard.tsx â€” check if it uses `toLocaleString` with timezone awareness or is just rendering raw UTC.

**ISSUE 4 â€” Approval Queue is visible to all authenticated users**
The Approval Queue (Images 11-12) contains Agent Office output: outreach drafts, LinkedIn posts, prospect target lists, content articles. This is Clarion's internal operations data â€” it should NOT be visible to law firm users. It is currently in the sidebar and accessible at `/dashboard/approval-queue` for all users.
Fix: Gate the Approval Queue route and sidebar item behind a `is_founder` or `is_admin` flag. Law firm workspace users should never see this page.

**ISSUE 5 â€” "Create Governance Action" button styling (Image 6)**
The dark navy CTA buttons ("Create Governance Action", "Open actions workspace") are heavy and generic. They read as "generic SaaS button" not "Clarion governance action." Minor but visible.
Fix: In the next visual pass, these get the same refinement treatment as the rest of the card components.

**ISSUE 6 â€” Suggested actions cards have left amber border but no surface treatment**
The suggested action cards (Image 6) use a left amber border accent but the card itself is plain white. High-severity items should feel more urgent â€” a very subtle warm amber tint on the card surface would communicate urgency without shouting.

**ISSUE 7 â€” "Firm Reputation Risk Score: 80/100" with breakdown (Image 9)**
This score (80/100, Communication: Moderate, Professionalism: Moderate, Case Outcomes: Moderate) uses the word "Moderate" three times and shows a score of 80 that seems disconnected from the "High Risk" posture shown elsewhere on the same page. This is confusing â€” if everything is Moderate why is the posture "High Exposure"? Either the score calculation or the label needs audit.

**ISSUE 8 â€” "Pricing Model Report - Mar 22 (#9)" report name (Image 3)**
The auto-generated report name includes "Pricing Model" which is a test artifact from the upload CSV used. In production, report naming should be cleaner. This is likely from the test data used, not a bug â€” but it should be addressed in the upload flow to generate better default names.

### Visual Design Assessment (vs. Target Direction)

Current state vs. target ("Mercury Bank meets Cravath partner meeting"):
- Canvas color: âœ“ Warm parchment applied, significant improvement over cold gray
- Card elevation: âœ“ Improved, cards now sit on the canvas
- Sidebar: âœ“ Identity moment working, gold accent correct
- Topbar: âœ“ Warm and refined
- Dashboard content: âœ— Still feels like a long admin report, not a premium command center
- Brief as visual anchor: âœ— The brief is one card among 18. It needs to be THE dominant element in the first viewport
- Typography: âœ— No Newsreader serif moments in the workspace yet (only in the brief artifact itself)
- Meeting Mode: âœ— Broken â€” must fix before any demo

The Approval Queue (dark card layout) and the 4-card governance rail are the two best-looking components. The next design pass should pull visual language FROM those and apply it to the dashboard primary tier.

---

## Active / Next Passes (Priority Order)

### Closed Milestones
1. **Authenticated workspace completion + continuity lock** - DONE (`ebc3c41`). Dashboard compression and authenticated continuity lock are complete.
2. **Landing / marketing proof + onboarding clarity** - DONE (`9b6202e`). Public messaging and first-run upload framing now match the actual product more closely.

### Next Logical Pass
3. **Public-launch truth pass** - reconnect Render to the current repo, deploy latest `main`, and run a deployed smoke across `/`, auth entry, upload, sample brief, and current review packet flow.
4. **Setup-dependent delivery proof** - confirm live truth for support/contact, billing entry points, and partner-brief delivery paths before public traffic.

### Later
5. **Domain cutover** to `clarion.co` (checklist below).
6. **Agent Office audit** - 21-agent system is real and in play, but was built early and still needs a dedicated truth pass.
7. **Code splitting** - pre-existing ~910kB frontend bundle warning, not the current blocker.
8. **app.py -> Flask blueprints** - planned only after launch-facing truth is stable.

---

## Agent Office (Clarion-Agency/)

The `Clarion-Agency/` folder contains a 21-agent autonomous operations system for running Clarion's own business. Divisions: Prospect Intelligence, Outbound Sales, Content Engine, Product Experience, Executive (Chief of Staff). The Approval Queue in the dashboard is the founder review interface for staged agent output.

**Current state:** Agents are structured and configured. SMTP credentials not set, LinkedIn/social API tokens missing. Several data files are placeholder-only. The system produces output (35 items pending in queue as of 2026-03-21) but cannot send/publish without credentials.

**Agent count: 25 agents across 10 divisions.** This is the verified count from `agent_org.md`. Do not use any other number.

**Audit needed:** System was built early in the project. A full file-by-file read is needed to assess what's actually functional vs skeleton. Schedule as a dedicated session.

**IMPORTANT:** The Approval Queue must be gated from law firm users before any pilot. See Issue 4 above.

---

## Locked Architecture Truths (Live)

**Calibration engines are separate:**
- `backend/services/benchmark_engine.py` â€” live calibration path; phrase/guard changes go here
- `backend/services/bench/deterministic_tagger.py` â€” standalone harness only, not called by Flask

**Data layer:** SQLite with Postgres compatibility scaffolding. Render Postgres is production DB.

**Stack:** Flask monolith backend + React/TypeScript/Vite frontend. Deployed on Render.

---

## Operator Smoke State

Full local seeded smoke remains confirmed from 2026-03-18.
Additional launch-readiness verification completed 2026-03-26:
- landing page copy/runtime check at `/`
- sample brief proof route at `/demo/reports/26`
- authenticated upload flow framing at `/upload` with the local smoke user
- Limitation: `/onboarding?preview=true` redirected the smoke user to `/dashboard` in local state, so onboarding preview-mode copy was verified in code/build but not as a direct runtime route.

---

## Calibration State (Stable â€” Hold)

Last fresh live run: `data/calibration/runs/20260317_223428`. Agreement rate 43.4% (62/143). Label variance confirmed as AI nondeterminism, not engine defect. Hold stable.

---

## Public Surface State

- `/` â€” V3 landing, governance-brief-centered hierarchy
- `/demo/reports/:id` â€” canonical public proof artifact (sample governance brief)
- `/demo` â€” secondary mechanics proof
- `/features`, `/how-it-works`, `/pricing`, `/security`, `/privacy`, `/terms` â€” React-owned

---

## Domain Cutover Checklist (Pending â€” clarion.co)

- [ ] Render custom domain configuration
- [ ] Stripe webhook URL update
- [ ] Resend domain verification
- [ ] Frontend `VITE_API_BASE_URL` update
- [ ] CORS allowed origins update in `backend/app.py`
---

## Last Completed Passes (This Session - 2026-03-26)
1. Pass 12 - Landing / marketing proof + onboarding clarity + launch-readiness truth test (`9b6202e`). Files: `LandingHeroSection.tsx`, `LandingOperatingPreview.tsx`, `LandingWorkflowSection.tsx`, `landingV3.ts`, `Onboarding.tsx`, `Upload.tsx`. Changes: landing promise now leads with partner-meeting clarity, governance brief, and follow-through; workflow/output copy now stresses one review-period export into one readable governance record; onboarding explains what Clarion creates before asking for upload action; upload flow language now stays aligned to a single-export, review-packet path.
2. Explicitly not touched: backend logic, governance engine, calibration, PDF internals, completed dashboard layout work, route/API contracts, pricing mechanics.
3. Verification: `npm run build` clean (`frontend/`, 1822 modules, pre-existing chunk warning unchanged) + shell-based Playwright runtime checks on landing (`/`), sample brief (`/demo/reports/26`), and authenticated upload (`/upload`). Direct runtime verification of onboarding preview mode did not complete because `/onboarding?preview=true` redirected the local smoke user to `/dashboard`.
4. Launch-readiness verdict: near-ready with limited blockers. Product messaging is strong enough for public evaluation, but launch should wait for deployed-environment truth: Render reconnect / latest deploy, deployed smoke, and confirmation that setup-dependent delivery paths match live claims.

## Last Completed Passes (This Session - 2026-03-24, continued x6)
1. Pass 9 - Meeting Mode elevation refinement. Dashboard.tsx partnerMode block only. Added readiness badge model (display-only) and introduced a presentation-quality artifact shell: top meeting/readiness chips, artifact-first framing line, serif cycle title, stronger stat tiles, explicit "Meeting packet includes" spine reminder, polished pre-meeting readiness card with mirrored badge, and promoted "Exit meeting view" to secondary button treatment. No backend/API/data-flow changes.
2. Build: clean (npm run build in frontend/, 1823 modules, pre-existing large chunk warning remains).

## Last Completed Passes (This Session â€” 2026-03-24, continued Ã—5)
1. Pass 9 â€” Meeting Mode elevation (76536c9). Dashboard.tsx partnerMode block only. Primary card eyebrow: "Meeting view Â· current governance brief" â†’ "Partner briefing Â· current governance brief". Positioning line added above stat tiles: "The partner-ready record for this cycleâ€¦". Secondary card eyebrow: "Cycle attention" â†’ "Pre-meeting readiness". Stat labels: "Open actions" â†’ "Open follow-through", "Overdue" â†’ "Overdue items", "High-severity signals" â†’ "High-severity issues". Readiness gate line added after stats: "Resolve overdue and unowned items before opening the brief in the meeting." Build clean (1823 modules, 907kB pre-existing warning).
2. Commit: 76536c9

## Last Completed Passes (This Session â€” 2026-03-24, continued Ã—4)
1. Pass 8 â€” ReportDetail page header framing polish (5a1591a). ReportDetail.tsx only. Sub-copy: "Use this packet for partner review, action decisions, and follow-through updatesâ€¦" â†’ "The governance brief for this cycle â€” the partner-ready record of what clients said, what the firm is doing about it, and what still needs a decision." "Send partner brief" button promoted from gov-btn-secondary to dark-border tier (border-[#0D1B2A] bg-white font-semibold) â€” visually distinct from and above "Download PDF". Build clean (1823 modules, 907kB pre-existing warning).
2. Commit: 5a1591a

## Last Completed Passes (This Session â€” 2026-03-24, continued Ã—3)
1. Pass 7 â€” ExecutionPage framing elevated to governance-cycle artifact language (7e02fd1). ExecutionPage.tsx only. Eyebrow: "Follow-through" â†’ "Assigned Follow-Through" (matches canonical brief spine Â§3). Description rewritten to artifact-first framing. Posture card label: "Current follow-through posture" â†’ "Follow-through posture for this cycle". Posture card h2 rewritten to partner-meeting framing. Brief context card label: "Current brief context" â†’ "Current governance brief". Brief context copy rewritten to connect follow-through status to brief. Tab "All follow-through" â†’ "Brief record". Default-tab sub-copy anchored to brief. Build clean (1823 modules, 907kB pre-existing warning).
2. Commit: 7e02fd1

## Last Completed Passes (This Session â€” 2026-03-24, continued Ã—2)
1. Pass 6 â€” Signals page reframed as governance-cycle evidence layer (7929bbe). SignalsPage.tsx only. Eyebrow: "Review Surface" â†’ "Client Feedback Evidence". Description rewritten to position page as evidence layer behind the governance brief. Section h2 reframed from directive to descriptive. Tab "All Signals" â†’ "Current Cycle". Tab "Triage" â†’ "Needs Action". Section eyebrow for all-tab: "Issue queue" â†’ "Current cycle evidence". Section sub-copy for all-tab and needs-action tab rewritten for governance framing. Bottom attribution cleaned from "Based on: ..." to italic provenance line. Build clean.
2. Commit: 7929bbe

## Last Completed Passes (This Session â€” 2026-03-24, continued)
1. Pass 5 â€” Reports/brief library elevation. ReportsPage.tsx: eyebrow updated to "Governance Brief Library", description rewritten as artifact-authoritative copy, section label and h2 reframed around artifact primacy, body copy positions brief as the primary artifact and archive as reference, usage-meter "This month" stat replaced with "Latest" date stat (summary.latestDate), tab label "Upcoming Meetings" -> "Current Brief", active brief eyebrow "Prepared for next meeting" -> "Active governance brief". GovernanceBriefCard.tsx: "View brief" promoted to primary dark CTA; "Download PDF" demoted to secondary border button; isPast=false card gets border-t-2 border-t-[#0EA5C2] top accent stripe to distinguish active artifact from archive cards.
2. Commit: 733fe87
3. Build: clean (906kB bundle â€” pre-existing known debt)

## Last Completed Passes (This Session â€” 2026-03-24)
1. Pass 1 â€” Meeting View fixed (partnerMode block added to Dashboard.tsx)
2. Pass 1 â€” Approval Queue gated behind is_admin (WorkspaceLayout nav, App.tsx route, ApprovalQueuePage defense-in-depth)
3. Pass 1 â€” Date/time display confirmed correct (toLocaleString already uses browser local TZ â€” no bug)
4. Pass 2 â€” Dashboard hierarchy: suppressed "anchored to" metadata strip, renamed brief card title to "Current governance brief", removed PartnerBriefPanel (80/100 score â€” contradicts posture label, needs engine audit), cleaned "Brief handoff" label copy
5. Commit: d95877d
6. Pass 3 â€” Brief card promoted to full-width first-viewport anchor; FirmGovernanceStatus demoted to secondary row below it (removed xl:grid-cols side-by-side layout from Tier 1). Dashboard.tsx only. Build clean.
7. Commit: 5a83f3d
8. Pass 4 â€” FirmGovernanceStatus visual weight reduced: titleClassName text-baseâ†’text-sm/font-semiboldâ†’font-medium/neutral-900â†’neutral-500; status badge px-4 py-2 text-base font-semiboldâ†’px-3 py-1 text-sm font-medium; all 4 metric counters text-[36px] font-boldâ†’text-[24px] font-semibold; subtitle reworded to "Supporting posture context for the current brief." FirmGovernanceStatus.tsx only. Build clean.
9. Commit: 8ccd5d2
10. This session (beyonddrewtv) is now at limit. Next account picks up at: Reports/brief library elevation pass.

## Last Completed Passes (This Session â€” 2026-03-21)
1. Design system token reset â€” warm canvas, card elevation, sidebar identity, topbar
2. verify-email RETURNING crash fix
3. Repo hygiene â€” .gitignore overhaul, README rewrite, ENGINEERING_PRACTICES.md created
4. Git remote updated to DrewYomantas/Clarion
5. Dashboard screenshot audit documented (this file)
