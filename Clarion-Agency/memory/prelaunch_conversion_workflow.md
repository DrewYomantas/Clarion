# prelaunch_conversion_workflow.md
# Clarion — Pre-Launch Conversion Architect Workflow
# Temporary workflow. Active during pre-launch phase only.
# Deactivate when SO-006 / SO-007 are retired by CEO post-launch directive.

---

## 1. Purpose

Clarion is pre-launch. The product is functional but the narrative, feature
explanations, onboarding, and conversion surfaces have not been pressure-tested
against a real law-firm operator audience.

This workflow exists to systematically audit and improve every layer of the
product experience that affects whether a law firm operator can understand,
trust, and act on what Clarion does — before launch.

This is not a redesign initiative. It is a clarity and comprehension audit.
The output is structured findings with severity and recommended changes, not
autonomous implementation.

---

## 2. Duration

**Pre-launch only.**

This workflow is active while SO-006 and SO-007 are in effect.
When the CEO issues a post-launch directive, this workflow is retired.
No agent runs this workflow after launch without explicit CEO reactivation.

---

## 3. Owners

| Role | Responsibility |
|---|---|
| **Product Usage Analyst** | Audit dashboard hierarchy, feature explanation quality, onboarding comprehension |
| **Head of Growth** | Audit landing page narrative, CTA quality, trust signals, category clarity |
| **Chief of Staff** | Review findings each cycle; escalate major narrative or positioning changes to CEO |
| **CEO** | Approves major positioning or brand direction changes only |

Both owning agents include conversion audit findings in their weekly reports.
Neither agent executes changes autonomously — all recommended changes are
proposed as PROPOSED ACTIONS requiring CEO approval, or executed as internal
drafts only.

---

## 4. Audit Scope

Each audit run covers the following surfaces. Agents audit only the surfaces
within their division scope (defined in Section 3).

### Landing Page & Narrative (Revenue / Head of Growth)
- **Hero clarity** — Does the hero statement tell a law-firm operator what this is,
  who it is for, and what problem it solves in one read?
- **Category clarity** — Is it immediately clear what category of product this is?
  (e.g., client review intelligence, governance dashboard, feedback analytics)
- **Problem framing** — Is the problem the product solves stated explicitly and
  specifically — not implied?
- **Solution framing** — Is the output Clarion delivers stated in concrete, specific
  terms a law firm partner would recognize?

### Feature Explanation (Product Insight / Usage Analyst)
- **Feature explanation quality** — Does each feature explanation state what it does,
  what it produces, and why it matters to a law-firm operator?
- **Jargon check** — Are any feature names or descriptions opaque to someone outside
  the product team?

### Dashboard (Product Insight / Usage Analyst)
- **Information hierarchy** — Does the dashboard lead with the most important signal
  ("what matters now") rather than burying it?
- **Action clarity** — After reading the dashboard, is it obvious what the operator
  should do next?

### Onboarding (Product Insight / Usage Analyst)
- **Comprehension flow** — Does onboarding answer three questions in sequence:
  (1) What happened? (2) Why does it matter? (3) What should I do next?
- **Time to value** — Can a new user reach a meaningful signal in one session?

### CTA Quality (Revenue / Head of Growth)
- **CTA clarity** — Is it obvious what happens after clicking? Does the CTA
  language match what the user actually gets?
- **CTA placement** — Are CTAs placed at the right moment in the comprehension arc,
  not before the user has understood the value?

### Trust Signals (Revenue / Head of Growth)
- **Credibility signals** — Are there signals that establish Clarion as legitimate
  and worth trusting? (e.g., specificity about how the product works, social proof,
  firm-type relevance)
- **Risk reduction** — Does the messaging reduce the felt risk of adoption for a
  cautious law firm partner?

---

## 5. Review Questions

Before submitting any audit finding, the agent must be able to answer these
questions about the surface being audited:

1. Can a law-firm operator (managing partner, operations director) understand
   what this product does in 5–10 seconds of reading?
2. Is the problem Clarion solves stated explicitly — not implied?
3. Is the output Clarion delivers explicit — not described in abstract terms?
4. Is the workflow (what the user does, what Clarion does, what the user gets)
   obvious without requiring a demo or explanation?
5. Does the dashboard show "what matters now" first — not a data-complete view
   that requires the user to interpret before acting?
6. Does onboarding answer "what happened / why it matters / what to do next"
   in that order — not as scattered information?

A finding is only surfaced if one or more of these questions cannot be answered
affirmatively for the surface being reviewed.

---

## 6. Output Contract

Every finding from this workflow must follow this format:

```
CONVERSION AUDIT FINDING
Surface:            [Landing page hero | Feature explanation | Dashboard hierarchy |
                     Onboarding flow | CTA | Trust signals | Category clarity |
                     Problem/solution framing]
Finding:            [One sentence — what the clarity or comprehension failure is]
Severity:           [High | Medium | Low]
                    High   = a law-firm operator cannot understand the product
                             or its value without this being fixed
                    Medium = comprehension is degraded but not blocked
                    Low    = minor phrasing or framing improvement
Recommended Change: [One to three sentences — what specifically should change
                     and what it should say instead, or what question it should answer]
Expected Impact:    [One sentence — conversion or comprehension effect if the
                     change is made]
Claude Implementation Needed: [Yes — describe scope | No — human copy/design change]
Escalate to CoS:    [Yes — reason | No]
```

Agents include findings in their weekly reports under a dedicated
`CONVERSION AUDIT FINDINGS` section. Omit the section if no findings this run.

High-severity findings are always escalated to Chief of Staff.
Major narrative or brand direction changes require CEO approval via PROPOSED ACTIONS.

---

## 7. Escalation

| Finding type | Route |
|---|---|
| Feature explanation or dashboard hierarchy change | Product Insight → resolve internally or propose to CEO |
| Onboarding copy or flow change | Product Insight → propose to CEO |
| Landing page hero, problem/solution framing, category clarity | Head of Growth → escalate to Chief of Staff |
| Major positioning, brand voice, or category change | Chief of Staff → escalate to CEO |
| CTA copy only | Head of Growth → propose to CEO |
| Trust signal additions (new credibility content) | Head of Growth → propose to CEO |

**CoS escalation threshold:** Any finding that would change how Clarion is
described publicly, how the product category is named, or how the value
proposition is framed must pass through Chief of Staff before being actioned.

**CEO escalation threshold:** Any change that materially repositions the brand,
changes the ICP framing, or alters the primary narrative of the product.

Minor copy fixes and internal draft revisions that do not change public-facing
positioning may be executed by owning agents as internal authorized work.

---

## 8. Deactivation

This workflow ends when:
- The CEO issues a post-launch standing order replacing SO-006 / SO-007, or
- The CEO explicitly deactivates this workflow

On deactivation:
- Remove `CONVERSION AUDIT FINDINGS` sections from Usage Analyst and Head of Growth reports
- Remove pre-launch conversion synthesis rule from Chief of Staff
- Archive this file to `memory/archive/` — do not delete
