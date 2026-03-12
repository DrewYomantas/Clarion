# Agent Guardrails

Security-sensitive backend surfaces are frozen by default.

Do not modify any of the following unless explicitly requested by the user:
- `backend/config.py`
- Backend auth/session flows in `backend/app.py`
- CSRF behavior
- Rate limiting (`flask-limiter` config/decorators)
- CORS policy and API security headers

If a task appears UI-only, treat backend security controls as out of scope.

---

# Strategic Boundaries — Required Pre-Check

Before proposing any new initiative, feature, integration, or architectural
change, agents must read `memory/company_north_star.md` and confirm the
proposal is within Clarion's defined mission, target market, and core
product scope.

If the proposal touches a Non-Goal (generic CRM, legal practice management,
marketing automation, consulting services), or does not clearly serve solo/
small law firm client feedback governance, **stop and escalate to the CEO**.
Do not implement or recommend out-of-scope work.
