# brand_qa.md
# Clarion — Brand and UX Quality Standard
# Version: 1.0 | 2026-03-12
# Read by: Product Experience Agent (required before every audit), Content & SEO Agent
# Maintained by: CEO only

---

## PURPOSE
Keep Clarion current, sharp, specific, and credible.
This file is the quality bar for every surface the product touches — website, copy, UI, outreach.
When an agent or Claude prompt produces output, this file defines what "good" looks like and what to reject.

---

## WHAT CLARION SHOULD FEEL LIKE

- A sharp tool built by someone who has thought hard about law firm operations
- Specific: it names real problems law firm partners actually have
- Confident: it doesn't hedge with AI caveats or "powered by" language
- Credible: it signals that real firms have used this and it worked
- Legible: every screen answers one question well rather than five questions poorly
- Modern but not trendy: clean hierarchy, generous whitespace, purposeful motion
- B2B-grade, not startup-grad: serious product for serious buyers
- Proof-first: the product claims are validated by outcomes, not asserted by copy

---

## WHAT CLARION SHOULD NOT FEEL LIKE

- A generic law-firm SaaS product (see anti-patterns below)
- A consulting website with a product tacked on
- An AI-hype pitch with buzzwords and no specifics
- A startup that hasn't found its customer yet
- A demo product that exists to show technical capability, not solve a real problem
- Overly formal in a way that distances Clarion from the partner reading it
- A product that could be for any professional services firm (must feel law-firm-specific)

---

## ANTI-PATTERNS: GENERIC LAW FIRM SAAS

Reject any output that contains or implies any of the following:

Visual:
- Navy/dark blue hero with sans-serif all-caps header
- Stock photo of a lawyer at a desk, gavel, scales, or courthouse
- Generic icon set (briefcase, handshake, globe, checklist)
- "Enterprise-grade" visual patterns applied to a pre-launch product
- Feature grid with 6 identical icon-plus-headline blocks
- Footer with 5 column navigation and 40 links
- Testimonial section with headshots that look AI-generated or stock

Copy:
- "Streamline your law firm"
- "Empower your team"
- "End-to-end solution"
- "AI-powered insights"
- "Trusted by leading firms"
- "Transform client relationships"
- "Drive growth" / "Scale your practice"
- Any headline that could also describe a CRM, project management tool, or HR platform

---

## ANTI-PATTERNS: CORPORATE THEATER

Reject output that performs seriousness without delivering substance.

Signs of corporate theater:
- Mission statements that say nothing specific ("We help law firms thrive")
- Social proof language without specific outcomes ("Firms love Clarion")
- Awards, badges, or certifications that haven't been earned
- "Enterprise security" / "Bank-grade encryption" claims without verification
- Testimonial quotes that are generic ("Great product, highly recommend")
- Org chart or team section before any proof of traction
- Press logos from outlets that haven't actually covered the product

---

## ANTI-PATTERNS: OBVIOUS AI COPY

Reject any copy that reads like it was written by an AI trying to sound professional.

Warning signs:
- "In today's competitive landscape..."
- "As law firms navigate an increasingly complex environment..."
- "Clarion is the solution for modern law firms..."
- Lists of three adjectives without specifics: "fast, reliable, and secure"
- Sentences that start with "With Clarion, you can..."
- Any use of "unlock", "harness", "leverage" in a headline
- Copy that could describe the product without having used the product

---

## HIERARCHY AND STORY RULES

Homepage hierarchy must follow this logic:
1. Problem statement or insight — what is broken or missing for law firms
2. Mechanism — how Clarion fixes it (specific, not abstract)
3. Proof or specificity — a number, an outcome, or a named use case
4. CTA — one action, specific language

Every page must have one primary job. If a page is trying to do three things, it is doing none of them.

CTA copy rules:
- Never use "Get started" as the primary CTA
- Never use "Learn more" as the only secondary option
- Preferred CTA patterns: "Request a pilot analysis" / "See how it works" / "Talk to a real firm outcome"
- CTAs must be specific enough that the prospect knows what they are clicking into

---

## PROOF-FIRST MESSAGING RULES

Proof must appear before claims wherever possible.

Proof hierarchy (use the highest available):
1. Named firm outcome with permission ("[Firm] used Clarion to identify...")
2. Anonymized outcome with specifics ("A 12-partner firm discovered...")
3. Pilot offer with specificity ("We'll analyze your last 90 days of client feedback")
4. Mechanism-as-proof ("10 governance themes, 511 scored phrases, zero black box")
5. Founder credibility ("Built by someone who has spent X years watching law firms...")

Do not use proof level 5 when levels 1-4 are available.
Do not claim proof that does not exist in memory/proof_assets.md.

---

## MODERNITY REVIEW CRITERIA

Evaluate modernity against the 2025-2026 B2B SaaS standard, not 2020.

Signs the site reads as current:
- Typography: one strong typeface with clear weight variation (not two mediocre fonts)
- Color: intentional use of one accent color; not gradient-heavy; not all-white or all-dark without purpose
- Whitespace: generous; sections breathe; content does not run edge to edge on desktop
- Motion: used at most in one or two moments (scroll reveal or hero element); not decorative noise
- Mobile: doesn't collapse into a broken version of the desktop layout
- Navigation: 5 items or fewer; secondary navigation handled contextually

Signs the site reads as dated:
- Box shadows everywhere (2019 look)
- Rounded corners on everything including dividers
- Multiple hero animations or parallax scroll effects
- "Trusted by X companies" counter without named companies
- Full-bleed hero with centered text and two CTA buttons side by side

---

## BANNED STYLE PATTERNS

Visual patterns that are hard-blocked:
- Any stock photography of legal settings
- Gradient backgrounds on hero sections (unless extremely minimal and purposeful)
- Icon-plus-headline feature grids with 6+ items
- Typewriter or animated text effects in the hero
- Chat bubble or support widget as a primary engagement mechanism pre-traction

Copy patterns that are hard-blocked:
- Any sentence starting with "Introducing Clarion"
- "Join thousands of..." / "Used by X firms" without real numbers
- "The future of law firm management"
- Any claim about "AI" in a headline without immediately explaining the mechanism
- Passive voice in CTAs ("Learn how Clarion can help you")

---

## NOTES FOR PRODUCT EXPERIENCE AGENT

When running an audit, open this file first.
Check each finding against the anti-patterns above before logging it.
If a finding is purely aesthetic with no commercial argument, do not log it.
If a finding violates one of the hard-blocked patterns, log it as HIGH severity regardless of other factors.
