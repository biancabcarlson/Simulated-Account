---
## 🚨 STANDING USER INSTRUCTION — READ THIS BEFORE ANYTHING ELSE

The user has given an explicit, standing instruction that applies to
**every pass on this project, not just the one that prompted it**:

> "Tackle as much as you can before running into a reached limit. Do
> not reach the limit without giving me the updated files and a new
> handoff."

Practically, this means: work through the NOT STARTED / PARTIALLY DONE
items below in order, for as long as you have budget. The moment you
sense you're approaching a limit (tool-call budget, length, turn
budget — whatever form it takes), **stop making further edits and
immediately**:
1. Re-zip both project folders with whatever real, working edits you've
   completed so far — never hand back a half-edited file mid-change.
2. Write an updated version of this HANDOFF.md reflecting exactly what
   you did and didn't finish, in the same DONE/NOT-STARTED format.
3. Present the zips to the user along with the handoff.

Do not run out of budget silently or leave the user to guess what
happened — the previous pass got explicitly told to do this and it's
the reason this handoff format exists at all. Carry this instruction
forward into whatever handoff you write next, so it doesn't get lost.

---
## ⚠️ NEXT AGENT — READ THIS FIRST, DO NOT RE-EXPLORE OR RE-READ THE PDF FROM SCRATCH

The user has a real feedback PDF: `Feedback_pt2_.pdf` (already reviewed in
full in an earlier pass — do not ask them to re-upload it or re-describe
it). Everything below is a direct, itemized translation of that PDF into
concrete file edits. Some are done, some are not. **Trust this list over
re-deriving requirements from the PDF yourself.**

Working copies: `/home/claude/work/case-tools-suite/case-tools-suite/`
and `/home/claude/work/simulated-account/simulated-account/`. If the
user pastes a fresh zip, unzip it to these same paths and diff against
what's described below before assuming anything is missing — this pass
already made real edits, they should be in the zip you're given.

There is an older handoff, `HANDOFF_prev.md`, in this same folder, from
a *previous, unrelated* pass (accessibility/cross-browser audit). That
work is genuinely done and still valid — don't redo it — but it is NOT
what the user is currently asking about.

### DONE — all previous passes, do not redo
- **All 6 tools**: removed the repeated "Runs entirely in your browser"
  boilerplate from every tool's lede/meta description. Confirmed with
  `grep -rn "Runs entirely" case-tools-suite/` → zero hits.
- **Simulated account**: consolidated disclosure lives once, as a
  `<p class="section-sub">` at the top of the `#security` panel.
- **Simulated account banner**: now reads "Simulated Account — for demo
  purposes only. All account information, transactions, transfers,
  account numbers, and PII are made up."
- **Simulated account**: removed the two duplicate bottom disclosure
  lines (`.hub-footer`, `.doc-modal-foot`). CSS rules for them are
  still in the `<style>` block, unused — harmless, left alone.
- **Account number length**: now 16 digits (`4408 2201 9034 5672`,
  masked `•••• •••• •••• 9034`) in `index.html` and `account-data.json`.
  `account-data-2.json` has a *different* fixture account (•••2987, 13
  digits) — still NOT touched; check with the user whether it needs
  lengthening too.
- **Identity verification redesign**: clickable `Verified` pill opens
  an example-ID modal (`docTemplates['id-doc']`, `.id-card` component,
  "EXAMPLE ONLY — NOT A REAL ID" band).
- **Risk & Review Flags bug fix — fully verified consistent this
  pass**: the stale pre-ATO Apr 2 "flagged" crypto entry was removed
  and replaced with a genuine in-window Aug 31, 2026 flagged BTC
  withdrawal (`bc1q...9k2m`, $4,590). **This pass re-grepped the entire
  `case-tools-suite/` folder for `4,590`, `9k2m`, `6,430`, `4f2a`, and
  "added same day"** — zero stale hits outside `simulated-account/`,
  and the hits inside `simulated-account/index.html` +
  `account-data.json` are all the *new*, correct values, fully
  consistent across the Home-tab kv-row, the Risk & Review Flags card,
  and the Crypto activity tab. **This item is closed — no further
  checking needed.**
- **Entity Name Matcher wording**: "Scans all accounts...", "retired"
  language reworded to "· prior" badge suffix + reworded sentences.
  Internal class/field names (`badge.retired`, `type:"retired"`) kept
  as-is per project convention.
- **Report Template Filler**: lede no longer calls it a "sample report
  template"; says "grouped by section" / "prefilled from this case."
- **Simulated account → Account Activity sort control — FINISHED this
  pass** (was partially done, now complete):
  - `<select id="activity-sort">` ("Most recent first" / "Oldest
    first") next to the "Account activity" heading, in a
    `.section-head-row` / `.sort-control` layout.
  - Every `<li>` in `#activity-list` has a `data-date` attribute,
    **including the last two ("Identity verification completed",
    "Account created") which were missing it going into this pass —
    fixed and confirmed.**
  - The `sortActivity()` JS function and its `change` event listener
    are now wired up in the bottom `<script>` block.
  - `.section-head-row` and `.sort-control` CSS added (flex,
    space-between, small inline select) — no longer unstyled.
  - **This item is fully done — no further work needed here.**

### NOT STARTED going into this pass, STATUS after this pass:

1. **OSINT tool — DONE this pass.**
   File: `case-tools-suite/osint-tool/index.html` + `osint_tool.py` +
   `README.md`.
   - Removed "edit or clear any field for a real case" from the
     fixture-note banner (grepped, confirmed zero hits remain).
   - Added three new optional fields: **Town/county**, **Approx. age**,
     **Known associate (first name)** — with inline copy explaining
     they sharpen the name-based lookups.
   - Replaced the old "Google/Bing exact name/email/phone" query set
     with investigator-relevant categories:
     - Name: LinkedIn profile confirmation, Facebook mutual-connection
       check (uses the associate field), obituary search (uses
       town+age), public police-record search (uses town/county).
     - Email: reverse email reputation lookup (framed as an
       "Emailage-style" genre example, not a hard link to that
       vendor) + the old exact-email Google check, relabeled as a
       breach/exposure check.
     - Phone: reverse phone reputation lookup (genre example) + the
       old exact-phone Google check.
   - Lede/meta copy generalized: "Works for any case typology; the
     preloaded example just happens to be an account-takeover case."
     No ATO-specific hard-coding anywhere in the new copy (grepped).
   - `osint_tool.py` CLI rewritten to mirror the HTML tool's new
     categories and new `--town`/`--age`/`--associate` flags. Tested
     end-to-end (ran it with all flags → correct query links written
     to a markdown checklist).
   - `README.md` updated to match.
   - **Fully done and tested. No further work needed.**

2. **Case Timeline Builder — DONE this pass (total redirection).**
   File: `case-tools-suite/case-timeline-builder/index.html` +
   `case_timeline_builder.py` + `README.md`.
   - Did NOT ask the user for their raw note format (no round-trip
     available this pass) — went with the handoff's documented
     fallback: a flexible parser tolerating varied real-world
     investigator shorthand, not the old rigid
     `YYYY-MM-DDTHH:MM | note` format.
   - New parser (`parseLine()` in the HTML, mirrored in
     `case_timeline_builder.py` as Python) accepts, all with no
     separator required (dash/colon/comma/space all work, and the old
     `|` still works too):
     - ISO: `2026-08-28T18:41` or `2026-08-28 18:41` (date-only OK)
     - US slash: `8/28`, `8/28/2026`, `8/28/26`, with optional 12h
       (`6:41pm`) or 24h (`18:41`) time
     - Month name: `Aug 28, 2026`, `August 28`, same optional time
       formats
   - Added a **"Case year"** number input (default 2026, matching the
     fixture) used when a line's date has no year.
   - Lines with a date but no time are still placed in the timeline,
     sorted by date, and rendered with a "time not specified" label
     instead of being dropped or given a fake midnight time silently.
   - Gap-warning text now notes when a flagged gap involves a
     time-unknown entry (so the gap is only approximate).
   - Malformed-line reporting changed from "missing | separator" to
     "couldn't find a date at the start of this line" — matches the
     new, more permissive parsing.
   - Sample data (`loadSample()`) rewritten to demonstrate the new
     free-text shorthand, e.g. `8/28 6:41pm - password reset via
     self-service`.
   - **Tested**: extracted and ran the actual `<script>` block content
     in Node against 8 test lines (ISO, slash, month-name, mixed
     separators, no-time, unparseable) — all parsed correctly,
     including backward compatibility with the old pipe format.
   - `case_timeline_builder.py` rewritten: now accepts either the old
     JSON format OR a new `.txt` free-text format (auto-detected by
     file extension), using the same parsing logic as the HTML tool,
     plus a new `--case-year` flag. **Tested both code paths** by
     running the script against a sample `.txt` and a sample `.json`
     file — both produced correct Markdown output.
   - `README.md` updated to describe the flexible format and the new
     CLI behavior.
   - **Fully done and tested. No further work needed** — though if the
     user does clarify their actual note format later and it differs
     meaningfully from this guess, the parser may need adjusting.

3. **Case Calculator — NOT STARTED this pass, pick up here first.**
   File: `case-tools-suite/case-calculator/index.html` (+
   `case_calculator.py` — not yet opened/checked this pass, check it
   for drift once the HTML is rebuilt, same as the timeline builder's
   `.py` needed updating to match).
   - Current UI (confirmed by reading the full file this pass): each
     classifiable transaction row has a `<select class="classify">`
     dropdown with options `none/confirmed/prevented/recovered`,
     wired to `onchange="recomputeFromTransactions()"`. Non-classifiable
     rows (returned/reversed, or non-fraud-related deposits) get a
     disabled select fixed to "Not fraud-related". This needs to
     become **checkboxes**: check a transaction to include it toward
     the case totals, with flagged/relevant transactions pre-checked
     by default. As boxes are checked/unchecked, `recomputeFromTransactions()`-
     equivalent logic should recompute live — **and take each
     transaction's status (pending/completed/failed→returned) into
     account when deciding whether it counts toward totals**. The PDF
     doesn't specify the exact weighting per status — pick a clear,
     documented default (e.g.: returned/failed transactions never
     count regardless of checkbox state, since they never completed;
     pending vs completed might both count but pending could get a
     visual "pending — may change" caveat) and state the rule
     prominently in the UI copy, since it's a judgment call.
   - Note the current TRANSACTIONS array's `classifiable`/`default`
     fields (`case-calculator/index.html`, ~line 274) and the
     `confirmed/prevented/recovered/none` 4-way classification will
     need rethinking for a checkbox model — checkboxes are naturally
     binary (in/out), so the "which bucket does this count toward"
     question (loss vs prevention vs recovery) either needs to become
     a second control per checked row, or the tool's framing needs to
     simplify to one bucket per transaction based on its existing
     fixture metadata (e.g. status implies bucket: pending→prevented,
     completed-and-part-of-the-fraud→confirmed, etc.) with the
     checkbox purely toggling in/out of the total. **This is a real
     design decision, not just a markup swap** — pick the simpler
     "checkbox = in/out, bucket inferred from existing transaction
     metadata" approach unless there's a clear signal the PDF wants
     per-row bucket selection preserved; re-read the PDF section on
     this tool if in doubt, don't just guess further without
     rechecking source material.
   - The lede text already describes the checkbox workflow ("Check the
     transactions from this case that count toward loss, prevention,
     or recovery...") from an earlier pass — **the actual table
     markup/JS still has the old dropdown implementation**. Don't ship
     any further copy changes here without also fixing the
     functionality — they're now inconsistent and that inconsistency
     needs closing, not extending.
   - **Mobile scroll fix**: `.table-wrap` (overflow-x:auto) IS already
     applied to this table (confirmed, line ~151: `<div
     class="table-wrap"><table id="txnTable">`), but the PDF's
     complaint is about having to scroll at all, which suggests
     `.table-wrap`'s horizontal-scroll approach isn't good enough on
     mobile even though it's technically there. Consider a stacked
     card/row layout below a breakpoint (~480–600px) similar to the
     simulated account's `.pm-row` pattern (in
     `simulated-account/index.html`, used on the payment-methods tab)
     instead of relying on horizontal scroll for this specific table.
   - **Results card redesign**: PDF calls the "Calculated Results" /
     "Not calculated yet" placeholder state "ugly" — the italic gray
     `.not-calculated` style is what's flagged, not the empty-state
     concept itself. No specific direction given; use judgment (e.g.
     replace the italic-gray placeholder text with a dash "—" or a
     muted icon + "—" rather than a full sentence repeated 6 times).
   - Design tokens for this file are the shared 6-tool palette (see
     bottom of this doc) — already in the file's `:root` block,
     nothing to change there.

4. **Case Doc Tracker — NOT STARTED, not yet opened this pass.**
   File: `case-tools-suite/case-doc-tracker/index.html` (+
   `case_doc_tracker.py`).
   - "Generating a status report isn't helpful" — replace/extend the
     current Generate/Copy flow with:
     - A way to see which document(s) are still missing and trigger a
       **"Send reminder"** action (represents emailing the customer),
       AND a separate **"Flag for CS call"** option (represents asking
       a human to call the customer instead) — two distinct actions.
     - A confirmation step ("are you sure?") before either action
       actually "sends," to prevent accidental triggers.
     - A way to mark a submitted item **rejected/not acceptable**
       (distinct from unchecking it back to "not collected") so the
       flow reads as "please resend this specific item" rather than a
       generic, confusing re-request.
   - Separately, smaller/independent quick win: **remove the "Generate
     Report" button entirely** — "Copy Shareable Summary" should
     always reflect current checkbox state live, no separate generate
     step. Safe to do first, independent of the bigger workflow work.
   - Not yet read this pass — open the file fresh before starting;
     don't assume anything about its current structure beyond what's
     stated in this bullet list.

### Design tokens + shared components (for consistency — from an earlier pass, still accurate)
```
--bg:#EEF2EF; --ink:#142019; --muted:#5B665F; --faint:#666E68;
--border:#DCE3DD; --border-strong:#C3CDC5; --card:#FFFFFF; --field:#EEF2EF;
--accent:#2F6F4E; --accent-hover:#26593F; --accent-active:#1F4A34; --link:#2A5C8A;
--danger:#A5311F; --danger-bg:#FBEAE6; --warning:#9B600A; --warning-bg:#FBF0DE;
--success:#26593F; --success-bg:#E3EFE8; --radius:12px; --radius-sm:8px;
```
Note: the simulated-account page uses a *different* token set
(`--accent-light`, `--amber`, `--amber-light`, `--red`, `--red-light`,
`--blue`, `--blue-light`, `--surface`, `--mono`, `--sans`) — it was
built as a separate project and never fully unified with the 6-tool
palette above. Don't assume the two share variables; check each file's
own `:root` block before adding new colors.

`.tool-card` / `.tools-grid` is the shared "More tools" nav component —
reuse verbatim in any new page. `.kv-card` / `.kv-row` is the simulated
account's shared label/value row component. `.id-card` is the
example-ID modal component — reuse if any other tool ever needs to
show a mock identity document. `.pm-row` (simulated account,
payment-methods tab) is a stacked-card mobile pattern worth reusing
for the Case Calculator's mobile table fix (item 3 above).

### When you're done or hitting a limit again
Re-zip both project folders and present the zip — don't just describe
changes in chat text, the user needs the actual updated files. Update
the "DONE" / "NOT STARTED" split above before handing off again, so the
list stays accurate instead of drifting from the real state of the
code.

---
See `HANDOFF_prev.md` in this same folder for the earlier, unrelated
accessibility/cross-browser audit pass — still valid, not the current
task.
