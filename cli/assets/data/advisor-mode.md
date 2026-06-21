# Advisor Mode

Adapted from jiji262/claude-design-skill. Prevents the #1 AI-design failure: committing to a direction before the brief is clear.

---

## When to enter advisor mode

Enter advisor mode whenever the brief is **vague, contradictory, or under-specified**. Signals:

- "Make it look modern" / "make it pop" / "make it premium"
- No reference sites mentioned
- Conflicting cues (e.g. "minimalist but bold")
- No audience or product context
- The user says "surprise me" / "you pick"

If any of those fire, **do not commit**. Switch to advisor mode.

---

## The Advisor Mode protocol

1. **Acknowledge ambiguity.** One sentence. "The brief is open — let me propose 3 directions before we commit."

2. **Propose exactly 3 differentiated directions.** Pull from `design-philosophies.csv`. They must be genuinely different — not three flavors of the same idea. Good triples:
   - Refined Minimalism vs. Bold Maximalism vs. Editorial Magazine
   - Swiss Editorial vs. Brutalist Web vs. Organic Hand-Crafted
   - Aurora/Glass vs. Retro-Futuristic vs. Kenya Hara Minimalism

3. **For each direction, give the user:**
   - **Name** (e.g. "Refined Minimalism")
   - **One-line pitch** (what it feels like)
   - **2 flagship examples** (real sites/products to look at)
   - **The signature move** (one specific thing they'll notice)
   - **The risk** (what could go wrong)

4. **Wait.** Do not start designing. The user picks one — or asks for a fourth — before any pixels are committed.

5. **Once chosen:** lock the direction. Document it in `brand-spec.md` or `DESIGN.md`. Reference it in every subsequent decision.

---

## Format for the 3-option response

```markdown
The brief is open. Three directions worth considering:

### Option A — <Philosophy name>
- **Feels like:** <one sentence>
- **Look at:** <example 1>, <example 2>
- **Signature move:** <one specific decision>
- **Risk:** <what could go wrong>

### Option B — <Philosophy name>
...

### Option C — <Philosophy name>
...

Which direction — or do you want a fourth option?
```

---

## When NOT to use advisor mode

- The user has named a reference site ("make it like Linear") — treat that as a directive, not a brief
- The brief is structural (component, refactor, bug fix)
- The user has already approved a `brand-spec.md` or `DESIGN.md` — work within it
- The user has said "go fast" or "first pass" — propose one direction and ship

---

## Anti-pattern: over-asking

Advisor mode is for **direction**, not for endless clarification. Three options, one round of questions, then commit. If the user asks you to skip advisor mode, skip it.
