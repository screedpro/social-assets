# Brief: write the remaining posts for "Practical AI for ScreedPro clients"

You are writing Instagram carousel posts for ScreedPro (screed manufacturer and pumping supplier, Perth-based, national; its clients are tilers, flooring contractors and builders). The series teaches tilers and flooring contractors practical uses of Claude (Anthropic's AI) in their business, using things ScreedPro already does. Readers are tradies, not tech people.

Read these first:
- `/tmp/claude-0/-home-claude/d5fc16b7-4214-57a9-b3a8-f527a65ea3e2/scratchpad/doc.txt` — the series plan, house rules and the full topic list.
- `/tmp/claude-0/-home-claude/d5fc16b7-4214-57a9-b3a8-f527a65ea3e2/scratchpad/gen/week1_posts.json` — 11 finished posts in the exact JSON format. Match their tone, length and structure closely. These are approved by the MD.

## Output
Write a JSON list to the file path you are given: one object per post, same keys as week1_posts.json:
- `id`: series code + two-digit number (e.g. "AC03").
- `series`: series index (given to you). `num`: post number 1–10.
- `title_short`: "<Series name> <num>". `page`: "<CODE><num> <short topic>". `page_title`: "<Series name> <num>: <topic exactly as in the topic list>".
- `q`: the cover hook, a question a tradie would ask (≤ 50 characters, ends with "?").
- `sub`: cover subline (≤ 60 characters, ends with a full stop).
- `s2` (slide 2, the problem): `h` headline (≤ 32 characters, no full stop), `b` body (≤ 130 characters), `x`: `["pills", [3 short labels, each ≤ 20 characters]]`.
- `s3` (slide 3, what Claude does): `h` (≤ 36 characters), optional `b` (≤ 140 characters; omit if the block is big), and `x` one of:
  - `["cards", [[title ≤ 22 chars, text ≤ 110 chars], ... up to 3]]` (no `b` with 3 cards)
  - `["strip", [[big ≤ 10 chars, small ≤ 24 chars] × 3]]`
  - `["chat", [[who, text ≤ 90 chars, "right"|"left"], ... 2–4 bubbles]]` — "You" on the right, "Claude" or "Pam" on the left.
  - `["listcard", title ≤ 24 chars, [[label ≤ 14 chars, value ≤ 34 chars] × 3–4]]`
  - `["grid2", [up to 10 items ≤ 28 chars]]` (no `b`)
  Vary the block type across the series; don't use the same one every time.
- `s4` (slide 4, how): `h` (≤ 24 characters, e.g. "How to do it", "How to start", "How to set it up"), `steps`: exactly 3 steps, each ≤ 70 characters, imperative.
- `s5` (slide 5, copy this): `sub` (≤ 50 chars), `prompt` (the prompt to copy, ≤ 220 characters, written as the tradie would type it), `note` (≤ 70 chars).
- `caption`: two short paragraphs separated by a blank line (`\n\n`), ≤ 330 characters total. First line repeats the hook. Do NOT add the offer line or hashtags — they are added automatically.

Headlines: no full stop and no question mark (the template adds an orange triangle after the last word). Sentence case. Australian English (organise, colour, licence as a noun). Use straight apostrophes ('), plain double quotes inside prompts are fine.

## House rules (non-negotiable)
1. Practical over abstract: a real job a tiler or flooring contractor does, in their words. A building analogy on every jargon post (e.g. n8n is the mesh in the screed; a skill is telling an apprentice "this is how we do it").
2. Money, sends and records: Claude drafts, a person approves. Say it every time money, emails or records are involved.
3. Never tell anyone to give Claude their bank login or bank password. Cash updates come from the Xero bank feed.
4. No HR or employment advice, no Fair Work, awards, pay rates, hiring/firing, contracts, leave entitlements. Posts on timesheets, new starters, toolbox talks and licences must stay purely about admin and records (checking timesheets against job records before the pay run, an equipment/paperwork checklist, keeping training and ticket records, reminders before expiry). Never interpret awards or employment law.
5. Safety documents: Claude drafts, a competent person on the job reviews and signs off. Never imply AI makes a site safe.
6. Auto mode is fine for everyday work; keep approval on for anything that sends emails, pays money or changes records.
7. Screenshots/figures: say nothing that needs real client names or figures. Use made-up sample names like "ABC Tiling".
8. Never use the name "Go Deeper"; call it a deep-think skill.
9. Sam, ScreedPro's fleet agent, isn't live yet: "in the works" if mentioned.
10. Don't be rude about other products (ApprovalMax, Zapier, forms apps). Be fair: "you might not need it for X; keep it if Y".
11. Don't invent ScreedPro facts. Known facts you may use: ScreedPro runs on Claude; Pam is ScreedPro's AI agent, the team messages her in Microsoft Teams and she drafts invoices and purchase orders for people to check; ScreedPro staff use Claude Team; ScreedPro has six Xero companies; ScreedPro uses HighLevel as its CRM, Airtable, n8n and GitHub; agents run in the Claude Console and are paid by usage; ScreedPro offers clients a free skill or agent on enquiry and another with every quote or booking. If you're not sure ScreedPro does something, write it as advice ("you can"), not as a ScreedPro claim.
12. Product facts about Claude must be correct. Before writing anything specific about Claude features, plans, models, connectors, skills, projects, artifacts, Claude Code, the Console or scheduled tasks, load the `product-self-knowledge` skill with the Skill tool and check. Where unsure, keep it general rather than guess. Don't quote prices.
13. The two pillar ideas — echo one where it fits: "Ten things, not one" (batch the job, one decision) and "Ask for the strategy, not just the task".
14. Each series runs in order, so a post may build on earlier posts in its own series and on Getting started, but not on later ones. The `note` on slide 5 may point to the next post in the series ("Next in the series: ...") — only if it matches the topic list.

Do the posts in the topic list order. When finished, re-read every field against the character limits and rules above, fix anything over, validate the JSON parses, then reply with just the file path and a one-line note of anything you were unsure about.
