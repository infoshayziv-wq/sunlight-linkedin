/* ==========================================================================
   Sunlight Writing Machine — mock data store
   Plain JS (no JSX). Exposes window.SWM with users, posts, modes, vectors,
   helpers. The app reads the "brain" as source of truth — voice logic is NOT
   reimplemented here; these are pre-authored sample outputs for the prototype.
   ========================================================================== */
(function () {
  // --- People / roles ----------------------------------------------------
  const USERS = {
    guy:  { id: "guy",  name: "Guy Ziv",  first: "Guy",  role: "generator",  title: "CEO / Co-founder",    initials: "GZ", tint: "#FFE8A3" },
    nyx:  { id: "nyx",  name: "Nyx",      first: "Nyx",  role: "editor",     title: "Chief Editor",        initials: "NX", tint: "#D8E6FF" },
    mika: { id: "mika", name: "Mika",     first: "Mika", role: "coordinator",title: "Chief of Staff",      initials: "MK", tint: "#D8F0E2" },
    shay: { id: "shay", name: "Shay Ziv", first: "Shay", role: "admin",      title: "Strategist / Admin",  initials: "SZ", tint: "#F0DCE4" },
  };

  const ROLE_LABEL = {
    generator: "Generator", editor: "Chief Editor", coordinator: "Coordinator", admin: "Strategist / Admin",
  };

  // Nav visibility per role (role-gated IA). Home is always first.
  const NAV_FOR = {
    generator:  ["home", "generate", "pipeline"],
    editor:     ["home", "generate", "pipeline", "brain"],
    coordinator:["home", "pipeline", "dashboard"],
    admin:      ["home", "generate", "pipeline", "dashboard", "brain"],
  };

  // --- Modes & attack vectors -------------------------------------------
  const MODES = {
    theorist: { id: "theorist", label: "Theorist", desc: "Where the industry's heading." },
    builder:  { id: "builder",  label: "Builder",  desc: "Revenue insight for platforms." },
    founder:  { id: "founder",  label: "Founder",  desc: "A hard-earned personal lesson." },
    wildcard: { id: "wildcard", label: "Wild Card",desc: "An off-topic idea, still in your voice." },
  };
  const VECTORS = {
    "contrarian-claim": "opens on a contrarian claim",
    "analogy":          "opens on an analogy",
    "reframe":          "opens on a reframe",
    "broken-list":      "names the outdated assumptions",
    "hidden-cost":      "follows the hidden cost",
  };

  // segment helpers
  const T  = (v) => ({ t: "text", v });
  const PH = (v) => ({ t: "placeholder", v });          // clearly-marked placeholder token
  const MF = (fact) => ({ t: "missing", fact });         // unresolved missing-fact slot

  // --- Canned generation results (Generate flow) -------------------------
  // Detected from the idea text: anything mentioning "float"/"%"/"X" → the
  // missing-fact path (Builder). Otherwise the clean Theorist path.
  const GEN_CLEAN = {
    mode: "theorist",
    reflect: "You're pointing at where the incentives in B2B payments are heading — not the plumbing, the economics.",
    angles: [
      {
        vector: "contrarian-claim",
        body: [
          "Most teams still treat accounts payable as a cost center. That's the mistake.",
          "AP is where money leaves the building — which means it's also where the incentives are richest. Every check you cut is a card payment you didn't capture, and a rebate you handed back to no one.",
          "The platforms that figure this out won't \u201ccut costs.\u201d They'll turn their payment rails into a revenue line.",
          "The cost center was never the problem. The framing was.",
        ],
      },
      {
        vector: "analogy",
        body: [
          "Think about how airlines learned to price a seat.",
          "The fare was never the whole business. The margin sat in the things around the seat \u2014 timing, loyalty, the fee you didn't notice. The ticket was just the entry point.",
          "B2B payments are heading the same way. The transaction is the seat. The incentive layer \u2014 interchange, timing, where the money rests \u2014 is the margin nobody's pricing yet.",
          "The companies that win won't sell cheaper flights. They'll own the layer above the fare.",
        ],
      },
      {
        vector: "reframe",
        body: [
          "The question most platforms ask is \u201chow do we move money cheaper?\u201d",
          "Wrong question. Cheaper is a race you finish last in.",
          "The better question: where in this flow is value leaking out that we could keep? An ACH transfer that could have been a card. A vendor portal nobody wants to log into. A rebate the buyer never thought to ask for.",
          "Stop optimizing the cost of moving money. Start owning the incentives inside the move.",
        ],
      },
    ],
  };

  const GEN_FLOAT = {
    mode: "builder",
    reflect: "You want to make the point with a real revenue number \u2014 the float lift. I'll need the actual figure, or I'll leave a clearly-marked placeholder.",
    angles: [
      {
        vector: "hidden-cost",
        body: [
          "Here's a number most platforms never look at: how long money sits still between when a buyer pays and a vendor gets paid.",
          [T("That gap is float \u2014 and for us it moved revenue by "), MF("float figure"), T(" last quarter.")],
          "Not by moving faster. By moving the same dollars through a rail that pays us to hold them a beat longer.",
          "The float was always there. We just stopped giving it away.",
        ],
      },
      {
        vector: "contrarian-claim",
        body: [
          "Speed is overrated in B2B payments.",
          [T("The money isn't in settling instantly \u2014 it's in the float. For platforms moving ACH to card, that float lifted our revenue by "), MF("float figure"), T(".")],
          "Everyone optimizes for \u201cfaster.\u201d The quieter lever is whose balance sheet holds the dollar in between.",
          "Fast is table stakes. Float is margin.",
        ],
      },
      {
        vector: "reframe",
        body: [
          "Ask a platform where its payment revenue comes from and you'll hear \u201cinterchange.\u201d",
          "True \u2014 but incomplete.",
          [T("There's a second engine underneath: float, the interest on funds held a beat longer when a check becomes a card. For us that was "), MF("float figure"), T(" of incremental revenue.")],
          "Interchange is the headline. Float is the line nobody reads.",
        ],
      },
    ],
  };

  // --- Spark starters ----------------------------------------------------
  const SPARKS = [
    "Why \u201cfaster payments\u201d is the wrong goal for platforms",
    "What a vendor portal actually costs a finance team",
    "The revenue hiding in your accounts-payable file",
    "Interchange as a product decision, not a payments one",
  ];

  // --- The brain (raw text, versioned) -----------------------------------
  const BRAIN = {
    master_prompt: {
      version: 17,
      updated: "2026-06-18 by Nyx",
      text:
`# Master Prompt — Guy Ziv voice (v1.7)

## Worldview
Write about the infrastructure, incentives, and economics of B2B payments.
Sunlight enters late and as the bridge, never the hero.

## Hard rules (never violate)
- Never open with "thrilled / excited / proud to announce."
- Never close with "the future is bright" / "stay tuned."
- NEVER invent stats, customer stories, company names, quotes, or capabilities. Ask instead.
- No naming competitors. No political positions. No founder-hero / hustle narratives.
- No AI hype. No self-superlatives.
- Banned words: synergy, paradigm shift, game changer, revolutionary, seamless.
- "unlock" \u2264 1 per piece. "transform" only with a measurable outcome.

## Self-check (run before returning each draft)
Opens on genuine tension \u00b7 one idea \u00b7 has an enemy \u00b7 revenue implication before
technical \u00b7 future is earned, not hype \u00b7 last line bigger than first \u00b7 no invented
facts \u00b7 no banned words \u00b7 paragraphs 1\u20133 sentences \u00b7 sounds distinctly like Guy.`,
    },
    few_shot_library: {
      version: 11,
      updated: "2026-06-21 by system (auto-append)",
      examples: [
        { id: "fs1", title: "Why growth-stage platforms leave money on the table", added: "Approved 2026-05-02", source: "manual" },
        { id: "fs2", title: "The vendor portal nobody wants to log into", added: "Approved 2026-05-19", source: "manual" },
        { id: "fs3", title: "ACH was a workaround we forgot to question", added: "Approved 2026-06-11", source: "flywheel" },
        { id: "fs4", title: "What checks actually cost you", added: "Approved 2026-06-14", source: "flywheel" },
        { id: "fs5", title: "Interchange is a product decision", added: "Approved 2026-06-17", source: "flywheel" },
        { id: "fs6", title: "The margin hiding in your AP file", added: "Approved 2026-06-20", source: "flywheel" },
      ],
      dupes: ["fs4", "fs5"], // near-duplicates flagged by usage panel
    },
    messaging_reference: {
      version: 4,
      updated: "2026-04-30 by Shay",
      text:
`# Messaging Reference (Apr 2026) — FACTS / POSITIONING ONLY. Never a voice source.

Approved Sunlight facts (do not exceed):
- Agentic B2B card-payments intelligence + execution layer bridging AP \u2194 AR.
- Converts ACH / check \u2192 card where viable.
- Navigates vendor portals (incl. gated) with AI agents.
- Up to 10% incremental revenue.
- Customers: growth-stage / mature platforms, banks, fintechs.
- Revenue mechanism = interchange (secondary = float).

Any other specific stat / client / quote \u2192 stop and ask.`,
    },
  };

  // --- Posts -------------------------------------------------------------
  // status: draft | handed-off | in-editing | approval | ready | posted | archived
  // contentType: guy-personal (two-key) | nyx-own (single key)
  const today = new Date("2026-06-21");
  const day = (n) => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };

  const POSTS = [
    {
      id: "p-portal", title: "The vendor portal nobody wants to log into",
      author: "guy", contentType: "guy-personal", mode: "builder", vector: "analogy",
      status: "in-editing", waitingOn: "nyx",
      handoffNote: "The dental-insurance analogy is the point \u2014 keep it. Nyx, drop in the real platform count when you have it.",
      deadline: day(1),
      intentKey: null, qualityKey: null,
      visualLink: "", noVisual: false,
      body: [
        "Every finance team has a folder of vendor portals. Logins they reset every quarter. Passwords in a spreadsheet nobody admits to.",
        "It's the dental-insurance website of B2B payments. You only go when you have to, and you dread it every time.",
        [T("We pointed AI agents at those portals so people don't have to. Across "), PH("platform count"), T(" platforms, the logins just\u2026 happen.")],
        "The portal was never the point. Getting paid was. We just stopped making humans do the boring part.",
      ],
      comments: [
        { id: "c1", author: "nyx", anchor: "It's the dental-insurance website of B2B payments.", body: "Strong line \u2014 leaving as is.", resolved: false, replies: [] },
        { id: "c2", author: "nyx", anchor: null, body: "Tightened paragraph 4 from three sentences to two.", resolved: true, replies: [] },
      ],
      versions: [
        { id: "v3", who: "nyx", when: "2026-06-21 09:14", note: "Tightened close; flagged platform count" },
        { id: "v2", who: "nyx", when: "2026-06-21 09:02", note: "First editorial pass" },
        { id: "v1", who: "guy", when: "2026-06-20 17:40", note: "Handed off from Generate" },
      ],
    },
    {
      id: "p-interchange", title: "Interchange is a product decision, not a payments one",
      author: "guy", contentType: "guy-personal", mode: "theorist", vector: "reframe",
      status: "approval", waitingOn: "guy",
      handoffNote: "Punchy. Ready for your key when you get a second.",
      deadline: day(-1), // overdue
      intentKey: null,
      qualityKey: { who: "nyx", when: "2026-06-20 16:05" },
      visualLink: "https://figma.com/file/sunlight-interchange-card", noVisual: false,
      body: [
        "Most platforms file interchange under \u201cpayments.\u201d That's an org-chart decision, not a strategy.",
        "Interchange is a product lever. It decides which transactions you want, which you price, and which you quietly let walk. That's a roadmap question, not a finance one.",
        "Move it out of the payments cost center and into the product team, and the questions change. Suddenly you're designing for the rail that pays you back.",
        "Interchange isn't what you pay to move money. It's a product you haven't shipped yet.",
      ],
      comments: [],
      versions: [
        { id: "v2", who: "nyx", when: "2026-06-20 16:00", note: "Editorial pass + quality key" },
        { id: "v1", who: "guy", when: "2026-06-19 11:20", note: "Handed off from Generate" },
      ],
    },
    {
      id: "p-checks", title: "What checks actually cost you",
      author: "guy", contentType: "guy-personal", mode: "builder", vector: "hidden-cost",
      status: "approval", waitingOn: "guy",
      handoffNote: "Numbers all real / approved. Your key when ready.",
      deadline: day(-2), // overdue
      intentKey: null,
      qualityKey: { who: "nyx", when: "2026-06-19 14:40" },
      visualLink: "", noVisual: false, // visual unresolved
      body: [
        "A check looks free. It isn't.",
        "It's the float you give away, the reconciliation hours nobody bills, the vendor portal someone logs into by hand. The cost is real \u2014 it's just spread thin enough that nobody owns it.",
        "Turn that check into a card where it makes sense, and the same payment starts paying you back. Up to 10% incremental revenue on the flows that qualify.",
        "Free was always the most expensive option. It just didn't send an invoice.",
      ],
      comments: [
        { id: "c3", author: "mika", anchor: null, body: "This one's been waiting on Guy's key for two days \u2014 nudged.", resolved: false, replies: [] },
      ],
      versions: [
        { id: "v2", who: "nyx", when: "2026-06-19 14:35", note: "Editorial pass + quality key" },
        { id: "v1", who: "guy", when: "2026-06-18 08:50", note: "Handed off from Generate" },
      ],
    },
    {
      id: "p-apfile", title: "The margin hiding in your AP file",
      author: "nyx", contentType: "nyx-own", mode: "builder", vector: "broken-list",
      status: "ready", waitingOn: null,
      handoffNote: null,
      deadline: day(2),
      intentKey: null, // nyx-own: no intent key needed
      qualityKey: { who: "nyx", when: "2026-06-20 18:10" },
      visualLink: "https://figma.com/file/sunlight-apfile-card", noVisual: false,
      body: [
        "Open any accounts-payable file and you'll find three assumptions quietly costing you money.",
        "One: that a check is cheaper than a card. Two: that \u201con time\u201d is the only goal worth optimizing. Three: that the rail is finance's problem, not the product's.",
        "Replace all three and the same file reads differently. Card where it qualifies. Float where the timing allows. A revenue line where there used to be an expense.",
        "The margin was in the file the whole time. The assumptions were just sitting on top of it.",
      ],
      comments: [],
      versions: [
        { id: "v1", who: "nyx", when: "2026-06-20 18:05", note: "Generated + self-edited" },
      ],
    },
    {
      id: "p-growth", title: "Why growth-stage platforms leave money on the table",
      author: "guy", contentType: "guy-personal", mode: "theorist", vector: "contrarian-claim",
      status: "ready", waitingOn: null,
      handoffNote: "Both of us happy with this one.",
      deadline: day(0),
      intentKey: { who: "guy", when: "2026-06-20 19:30" },
      qualityKey: { who: "nyx", when: "2026-06-20 17:55" },
      visualLink: "https://figma.com/file/sunlight-growth-card", noVisual: false,
      body: [
        "Growth-stage platforms obsess over the top of the funnel and ignore the bottom of the stack.",
        "They'll spend a quarter optimizing checkout and never look at how money actually moves once a deal closes. That's where the quiet money is \u2014 in the rails, not the funnel.",
        "Card where checks used to be. Interchange you weren't capturing. Float you were handing to someone else's balance sheet.",
        "The funnel gets the meeting. The stack gets the margin.",
      ],
      comments: [],
      versions: [
        { id: "v2", who: "nyx", when: "2026-06-20 17:50", note: "Editorial pass + quality key" },
        { id: "v1", who: "guy", when: "2026-06-19 10:10", note: "Handed off from Generate" },
      ],
    },
    {
      id: "p-rebate", title: "The rebate your buyers never ask for",
      author: "guy", contentType: "guy-personal", mode: "builder", vector: "reframe",
      status: "handed-off", waitingOn: "nyx",
      handoffNote: "Quick one between meetings \u2014 see if the open lands.",
      deadline: day(3),
      intentKey: null, qualityKey: null,
      visualLink: "", noVisual: false,
      body: [
        "Buyers negotiate the price and forget the payment.",
        "There's a rebate sitting inside how a bill gets paid \u2014 the interchange a card flow throws off \u2014 and most buyers never think to ask for it. Not because it's hidden. Because nobody told them it was theirs.",
        "Pay the same invoice on the right rail and value comes back instead of leaking out.",
        "The discount was never at the negotiating table. It was in the payment all along.",
      ],
      comments: [],
      versions: [
        { id: "v1", who: "guy", when: "2026-06-21 08:30", note: "Handed off from Generate" },
      ],
    },
    {
      id: "p-ach", title: "ACH was a workaround we forgot to question",
      author: "guy", contentType: "guy-personal", mode: "theorist", vector: "reframe",
      status: "posted", waitingOn: null,
      handoffNote: null,
      deadline: day(-6),
      intentKey: { who: "guy", when: "2026-06-10 15:00" },
      qualityKey: { who: "nyx", when: "2026-06-10 14:20" },
      visualLink: "https://figma.com/file/sunlight-ach-card", noVisual: false,
      posted: { when: "2026-06-11", who: "nyx", url: "https://linkedin.com/posts/guy-ziv-ach-workaround" },
      body: [
        "ACH wasn't designed. It was settled for.",
        "It solved a 1970s problem \u2014 move money without paper \u2014 and we've been treating its limits as laws of nature ever since. Batch windows. No data. A rail that forgets the invoice the moment it clears.",
        "Cards carry the context ACH dropped. Where the flow qualifies, that context is worth more than the speed.",
        "We didn't choose ACH. We inherited it. That's a very different thing.",
      ],
      comments: [],
      versions: [
        { id: "v2", who: "nyx", when: "2026-06-10 14:15", note: "Final pass" },
        { id: "v1", who: "guy", when: "2026-06-09 16:00", note: "Handed off" },
      ],
    },
  ];

  // --- Notifications -----------------------------------------------------
  const NOTES = [
    { id: "n1", type: "key-needed", to: "guy",  text: "2 posts are waiting on your intent key.", when: "9:02" },
    { id: "n2", type: "handoff",    to: "nyx",  text: "Guy handed off \u201cThe rebate your buyers never ask for.\u201d", when: "8:31" },
    { id: "n3", type: "ping",       to: "guy",  text: "Mika nudged you on \u201cWhat checks actually cost you.\u201d", when: "8:45" },
  ];

  window.SWM = {
    USERS, ROLE_LABEL, NAV_FOR, MODES, VECTORS, SPARKS, BRAIN, POSTS, NOTES,
    GEN_CLEAN, GEN_FLOAT, T, PH, MF, day,
  };
})();
