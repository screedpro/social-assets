# Animated slide 3: scene guide

The "Practical AI for ScreedPro clients" Instagram carousels are getting an animated slide 3. Each post has 7 slides. Slide 3 is the "what Claude does" slide. We are replacing its static block with a short animation (about 7–14 seconds) that **shows the job happening**: a business card being scanned into the CRM, an n8n workflow running, Claude drafting an email, a register filling up, and so on. The MD loved the first one, a Teams chat with Pam typing live. He wants simple graphics like this wherever possible.

You write a **scene spec** (JSON) per post. The engine (`gen/live/engine.js`) animates it. You do not write HTML.

Scratchpad root: `/tmp/claude-0/-home-claude/d5fc16b7-4214-57a9-b3a8-f527a65ea3e2/scratchpad` (call it `$S`).

## Output format

Write one JSON file: `{ "ID": {"h": "...", "label": "...", "spec": {...}}, ... }`

- `h`: the slide headline. Keep the post's existing slide-3 headline (`s3.h`) unless it no longer fits the graphic. If you change it, use 36 characters or fewer, sentence case, and no full stop or question mark.
- `label`: the footer, exactly `"<Series name>, post <n> of 10"` (e.g. `"Accounting, post 3 of 10"`).
- `spec`: one of the scene types below.

## Build and check (do this for every post)

```
cd $S/live
python3 ../gen/live/build_live.py YOURFILE.json pages_YOURGROUP
python3 ../gen/render_live.py pages_YOURGROUP/ID.dc.html st_YOURGROUP/ID 30 stills
python3 ../gen/live/sheet.py sheet_YOURGROUP.png st_YOURGROUP/ID1 st_YOURGROUP/ID2 ...
```

- The render prints `ok []` or `PROBLEMS [...]`. PROBLEMS means something sits outside the panel or a no-wrap label is clipped. Fix it by shortening text or using fewer items.
- Then **look**: Read the contact sheet, and Read the last still (`still_<largest number>.png`) full size for every post. Check that:
  - nothing overlaps,
  - no text spills out of its box,
  - nothing is cut off,
  - the final frame reads as a finished, clear graphic on its own (it is also the backup still).
- Fix and re-render until clean. You can run several renders in parallel with `&` and `wait`. Each still render takes about 5 seconds.

## Scene types

Icons (`icon` fields) are plain lettermarks or line icons, never logos. App keys:

- **Apps:** xero, crm, highlevel, teams, outlook, gmail, email, calendar, n8n, airtable, sharepoint, drive, dropbox, github, zapier, approvalmax.
- **People and agents:** claude, pam, you, person.
- **Things:** abr, ato, bank, phone, web, camera, doc, supplier, sms, forms, console, api, mcp, webhook, skill, schedule, alert, bell, dashboard, fleet, tool, receipt, card, folder, mic, graph, search, lock, map, brain, key, list.
- **Raw line icons** (also usable): mail, calendar, doc, clock, bolt, check, person, camera, mic, chart, lock, globe, truck, tool, dollar, spark, alert, phone, receipt, card, folder, gear, chat, plug, key, search, list, web, bell, map, brain, link, graph.

Pill colours (`badgeKind`, `captionKind`, `verdictKind`, `resultKind`, `doneKind`, `highlight.kind`) mean something, so use them consistently:

- **orange** (person icon): "a person checks or approves". Use it when money, sending or records are involved.
- **dark**: neutral statement.
- **green** (tick): done or finished.

### chat: a message thread (Teams with Pam, or a Claude chat)
`{"type":"chat","app":"teams"|"claude"|"sms","agent":"Pam"|"Claude","agentSub":"AI agent · drafts, you approve","msgs":[["You","text","right"],["Claude","text","left",{"app":"xero","title":"Invoice INV-0412","tag":"Draft","rows":[["ABC Tiling","$4,180"],["Due","14 days"]]}]]}`
- 3–5 messages, each 90 characters or fewer, about 330 characters in total.
- An optional 4th element on a left message is an attachment card (up to 3 rows). An attachment counts as about 1.5 messages of space.
- The user's messages type live in the compose box; the agent's stream in word by word.

### flow: inputs → Claude → outputs
`{"type":"flow","sources":[{"label":"Accounts inbox","sub":"supplier bills","icon":"outlook"}],"hub":{"label":"Claude","icon":"claude","status":["Waiting","Reading 12 bills","Drafted"]},"targets":[{"label":"Xero","sub":"draft bills","icon":"xero","result":"12 bills drafted, coded"}],"badge":"A person approves in Xero","badgeKind":"orange"}`
- 1–3 sources and 1–3 targets.
- `label`: 18 characters or fewer. `sub`: 26 or fewer. `result`: 40 or fewer (26 or fewer with 3 targets). `badge`: 38 or fewer.
- `hub.status` holds up to 3 short states (20 characters or fewer each). They show in turn.

### n8n: a workflow running (use for n8n, automation, webhooks, scheduled jobs, "listening posts")
`{"type":"n8n","title":"Supplier bills","nodes":[{"id":"t","label":"New email","sub":"accounts inbox","kind":"trigger","col":0,"row":0.5},{"id":"ai","label":"Claude reads it","kind":"ai","col":1,"row":0.5},{"id":"if","label":"Known supplier?","kind":"if","col":2,"row":0.5},{"id":"a","label":"Draft bill","sub":"in Xero","icon":"xero","col":3,"row":0},{"id":"b","label":"Ask a person","icon":"teams","col":3,"row":1}],"edges":[["t","ai"],["ai","if"],["if","a","yes"],["if","b","no"]],"result":"Drafts only. A person approves"}`
- `kind`: trigger | ai | if | wait | action (action needs an `icon`).
- Up to 5 columns (0–4) and 7 nodes. Rows are 0–1 (use 0.5 for the middle) or 0–2.
- `label`: 16 characters or fewer. `sub`: 16 or fewer. `result`: 38 or fewer.

### scan: phone photo → Claude reads it → apps
`{"type":"scan","item":"card"|"receipt"|"docket"|"photo"|"invoice","count":12,"itemTitle":"...","itemLines":["..."],"photoIcon":"tool","fieldsTitle":"Claude reads it","fields":[["Name","Sam Rossi"]],"targets":[{"icon":"crm","label":"CRM","line":"New contact: Sam Rossi","tag":"Added"}],"badge":"...","badgeKind":"dark"}`
- 3–5 fields, each value 26 characters or fewer.
- 1–3 targets. `line`: 48 characters or fewer (30 or fewer with 3 targets). `tag`: 12 or fewer.
- `itemLines`: up to 5 short lines printed on the paper.
- For a photo of a thing, use `item:"photo"` plus `photoIcon` (tool, truck, camera, doc…).

### table: a register or list filling in (Airtable, spreadsheet, CRM)
`{"type":"table","app":"airtable","title":"Ticket register","sub":"12 people","cols":["Name","Ticket","Expires"],"rows":[["Bob","White Card","Never"]],"highlight":{"row":2,"note":"Expires in 21 days. Reminder sent","kind":"orange"},"footer":"...","badge":"..."}`
- 2–4 columns and 3–6 rows. Cells: 22 characters or fewer.

### doc: Claude drafts a document or email, then a person approves
`{"type":"doc","app":"outlook","title":"Reply to ABC Tiling","sub":"Draft","meta":[["To","Sam, ABC Tiling"],["Subject","Quote for Smith St"]],"lines":["Hi Sam,","Thanks for ...","# Heading line","- bullet line"],"tag":"Drafted by Claude","button":"Approve and send","done":"Sent by you"}`
- 0–2 meta rows and up to 7 lines, about 75 words in total.
- A line starting with `# ` is a heading; a line starting with `- ` is a bullet.
- The animation ends with a cursor clicking the button, which turns green with the `done` text. Use this for "Claude drafts, a person approves".

### dash: a dashboard counting up
`{"type":"dash","title":"Morning dashboard","sub":"Mon 9 Nov","tiles":[{"label":"Crew on site","value":7},{"label":"Overdue","value":3,"kind":"alert"},{"label":"Owed to you","value":48200,"prefix":"$"}],"bars":{"title":"Owed by age","labels":["Current","30","60","90+"],"values":[30,12,4,2],"fmt":["$30k","$12k","$4k","$2k"],"hi":3},"alert":{"text":"3 invoices over 60 days","button":"Draft reminders","done":"Drafted for you to check"}}`
- 3–4 tiles. `bars` (4–7 bars) and `alert` are optional.
- The alert button is clicked by a cursor at the end.

### compare: before and after (task vs strategy, one vs ten, old way vs new way)
`{"type":"compare","left":{"title":"The task","icon":"chat","items":["Write a quote for this bathroom job."],"quote":true},"right":{"title":"The strategy","icon":"brain","items":["What's the best way to quote this job, with options the client will value?"],"quote":true},"verdict":"Ask for the strategy, not just the task","verdictKind":"dark"}`
- `items`: up to 3 on the left and 4 on the right.
- `layout:"grid"` on the right allows up to 10 short items (22 characters or fewer). Good for "ten, not one".
- `quote:true` shows items as speech quotes.
- `left.weight` (0.25–0.5) sets the left box's share of the height.

### stack: layers building up (bottom layer first)
`{"type":"stack","layers":[{"label":"Your records","sub":"Xero, CRM, files","icon":"folder"},{"label":"Skills","sub":"how you do each job","icon":"skill"},{"label":"Claude","sub":"does the work","icon":"claude","hi":true}],"caption":"..."}`
- 3–5 layers. `label`: 22 characters or fewer. `sub`: 40 or fewer. Optional `tag` (14 or fewer) at the right.
- Building analogies work well here (substrate → screed → tiles).

### checklist: items ticking off
`{"type":"checklist","app":"list","title":"New starter: Monday","sub":"Copied for each new starter","items":[{"text":"PPE sizes ordered","who":"Office"}],"done":"Ready before day one"}`
- 4–7 items, each 44 characters or fewer. `who`: 10 or fewer.

### hub: Claude in the middle, apps around it (connectors, "what it can reach")
`{"type":"hub","centre":{"label":"Claude","sub":"...","icon":"claude"},"spokes":[{"label":"Xero","icon":"xero","via":"Connector"}],"caption":"..."}`
- 3–6 spokes. `label`: 16 characters or fewer. `sub`: 30 or fewer, only with 4 or fewer spokes. `via`: 10 or fewer.

## How to choose

- **Show the job being done.** Prefer process scenes (chat, flow, n8n, scan, doc, table filling, dash with an action) over static explainers. Use the post's own example (its s3 block, s2 problem and s5 prompt) so slide 3 matches the slides either side.
- When the post explains a concept (API, MCP, webhook, tokens, knowledge graph, skills, plans), draw the concept:
  - **hub** for connections,
  - **n8n** for automations and triggers,
  - **stack** for layers,
  - **compare** for before and after.
- Vary scene types within a series. Avoid the same type on consecutive posts where a different one fits.
- Keep words few and large. It is a phone screen.

## House rules (non-negotiable)

1. **Money, sends and records:** Claude drafts, a person approves. Show it every time with an orange pill, a "Draft" tag, or the doc scene's approve click. Claude never pays and never sends without a person's yes.
2. **Never show anyone giving Claude a bank login.** Cash figures come from the Xero bank feed.
3. **No HR or employment advice:** no awards, pay rates, Fair Work, hiring or firing. Timesheet, new-starter, toolbox and licence posts stay about admin and records.
4. **Safety documents:** Claude drafts; a competent person on the job reviews and signs off. Never imply AI makes a site safe.
5. **Sample names only:** ABC Tiling, ABC Builders, Sam Rossi, Bob, Smith Street, Job 118, and the like. No real client names. Figures are made-up but plausible.
6. **"Go Deeper"** is never used; call it a "deep-think skill". Sam (ScreedPro's fleet agent) is "in the works", not live.
7. **Be fair to other products** (ApprovalMax, Zapier, forms apps): "you might not need it for X; keep it if Y".
8. **Claude and app facts must be correct.** Known corrections:
   - The standard Xero connector for Claude is **read-only**: it cannot create bills, invoices, POs or contacts, or attach files. Writing into Xero needs a custom connector or MCP (ScreedPro has its own) or n8n. If a scene shows Claude writing into Xero, either label the write as done by n8n or a custom connector, or show the Xero step as "Draft ready, you approve" / "Ready to add".
   - Xero has no draft-only access level.
   - Unreconciled bank lines aren't available through Xero's API.
   - Claude can't take audio file uploads; use the phone's dictation or a transcript.
   - A Teams agent like Pam is custom-built: Pam runs on a custom MCP, a Claude Console agent harness, n8n "rails" as her hands, and a Microsoft agent in Azure for Teams. It is not off the shelf.
   - GitHub only publishes a site if the site is hosted from it.
   - Don't quote prices or name specific model versions.
   - If unsure about a Claude feature, load the `product-self-knowledge` skill or keep it general.
9. The post's other slides stay as they are, so don't contradict them.

## Finish

When every post in your group is clean:

1. Make one contact sheet of all your posts.
2. Reply with:
   - the path to your JSON file,
   - the path to the contact sheet,
   - one line per post: scene type and what it shows,
   - anything you were unsure about.
