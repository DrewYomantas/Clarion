# Current Build

Active pass scope, next options, and recent pass history are now in `PROJECT_STATE.md` under "Active / Next Passes" and "Last Completed Passes".

Latest completed pass: `2026-03-26 - Pass 12 - Landing / marketing proof + onboarding clarity + launch-readiness truth test (9b6202e)`.

Build verification: `npm run build` in `frontend/` passed (1822 modules, pre-existing chunk warning unchanged).

Runtime verification: shell-based Playwright checks passed on `/`, `/demo/reports/26`, and authenticated `/upload`. Direct runtime verification of onboarding preview mode remains incomplete because `/onboarding?preview=true` redirected the smoke user to `/dashboard` in local state.

Launch-readiness status: near-ready with limited blockers. The remaining blockers are deployed-environment truth checks, not another dashboard redesign pass.

Read `PROJECT_STATE.md`.