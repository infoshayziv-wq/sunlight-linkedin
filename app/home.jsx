/* Role-shaped homes — the smart front door. */
const HUI = window.SWMUI;
const HIcon = window.Icon;
const { USERS: HUSERS } = window.SWM;
const { PipelineCard: HPCard, CoordControls: HCoord, overdue: Hoverdue, waitingLabel: HwaitL } = window.SWMCoord;

function Greeting({ user, sub }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
        <HUI.Avatar id={user.id} size={40} />
        <h1 style={{ font: "500 32px/1 var(--sl-font-sans)", letterSpacing: "-1.2px", color: "var(--sl-color-ink)", margin: 0 }}>
          Good morning, {user.first}
        </h1>
      </div>
      <p style={{ font: "400 16px var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "0 0 0 52px" }}>{sub}</p>
    </div>
  );
}

function HomeSection({ title, count, children }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 14 }}>
        <h2 style={{ font: "600 18px var(--sl-font-sans)", color: "var(--sl-color-ink)", margin: 0, whiteSpace: "nowrap" }}>{title}</h2>
        {count != null && <span style={{ font: "500 15px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>{count}</span>}
      </div>
      {children}
    </div>
  );
}

// ---- Guy ----------------------------------------------------------------
function GuyHome({ store }) {
  const mine = store.posts.filter((p) => p.author === "guy");
  const awaitingKey = mine.filter((p) => p.status === "approval" && !p.intentKey);
  const inFlight = mine.filter((p) => ["handed-off", "in-editing"].includes(p.status));
  const open = (p, from) => store.navigate("editor", { postId: p.id, from: from || "home" });

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "8px 0 80px" }}>
      <Greeting user={HUSERS.guy} sub={awaitingKey.length
        ? `${awaitingKey.length} post${awaitingKey.length > 1 ? "s" : ""} waiting on your intent key.`
        : "Nothing waiting on your key. Got an idea?"} />

      <button className="sl-btn sl-btn--primary sl-btn--lg" onClick={() => store.navigate("generate")}
        style={{ marginBottom: 32, boxShadow: "var(--sl-shadow-brand)" }}>
        <HIcon name="plus" size={18} /> New post
      </button>

      <HomeSection title="Awaiting your intent key" count={awaitingKey.length}>
        {awaitingKey.length === 0
          ? <HUI.EmptyState icon="check" title="All clear" body="Nothing needs your sign-off right now." />
          : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {awaitingKey.map((p) => (
                <HPCard key={p.id} post={p} onOpen={() => open(p)} controls={
                  <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--sl-color-border)", display: "flex", gap: 10 }}>
                    <button className="sl-btn sl-btn--secondary sl-btn--sm" onClick={() => store.applyKey(p.id, "intent")}>
                      <HIcon name="key" size={14} /> Apply intent key
                    </button>
                    <button className="sl-btn sl-btn--ghost sl-btn--sm" onClick={() => open(p)} style={{ color: "var(--sl-color-text-muted)" }}>
                      Read it first <HIcon name="arrowRight" size={14} />
                    </button>
                  </div>
                } />
              ))}
            </div>}
      </HomeSection>

      {inFlight.length > 0 && (
        <HomeSection title="Your posts in the pipeline" count={inFlight.length}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {inFlight.map((p) => <HPCard key={p.id} post={p} onOpen={() => open(p, "home")} />)}
          </div>
        </HomeSection>
      )}
    </div>
  );
}

// ---- Nyx ----------------------------------------------------------------
function NyxHome({ store }) {
  const queue = store.posts.filter((p) => ["handed-off", "in-editing"].includes(p.status));
  const awaitingKey = store.posts.filter((p) => p.status === "approval" && !p.qualityKey);
  const mineOwn = store.posts.filter((p) => p.author === "nyx" && p.status === "ready");
  const open = (p) => store.navigate("editor", { postId: p.id, from: "home" });

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", padding: "8px 0 80px" }}>
      <Greeting user={HUSERS.nyx} sub={queue.length
        ? `${queue.length} post${queue.length > 1 ? "s" : ""} in your editing queue.`
        : "All clear — nothing waiting on you."} />

      <HomeSection title="Your editing queue" count={queue.length}>
        {queue.length === 0
          ? <HUI.EmptyState icon="check" title="All clear" body="Nothing waiting on you. Enjoy the quiet desk." />
          : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {queue.map((p) => (
                <HPCard key={p.id} post={p} onOpen={() => open(p)} controls={
                  p.handoffNote && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--sl-color-border)", display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <HIcon name="send" size={15} style={{ color: "var(--sl-color-text-subtle)", marginTop: 2, flex: "0 0 auto" }} />
                      <p style={{ margin: 0, font: "400 13.5px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>
                        <b style={{ color: "var(--sl-color-ink)" }}>{HUSERS[p.author].first}:</b> {p.handoffNote}
                      </p>
                    </div>
                  )
                } />
              ))}
            </div>}
      </HomeSection>

      {awaitingKey.length > 0 && (
        <HomeSection title="Awaiting your quality key" count={awaitingKey.length}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {awaitingKey.map((p) => <HPCard key={p.id} post={p} onOpen={() => open(p)} />)}
          </div>
        </HomeSection>
      )}

      {mineOwn.length > 0 && (
        <HomeSection title="Your own posts" count={mineOwn.length}>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {mineOwn.map((p) => <HPCard key={p.id} post={p} onOpen={() => open(p)} />)}
          </div>
        </HomeSection>
      )}
    </div>
  );
}

// ---- Mika ---------------------------------------------------------------
function MikaHome({ store }) {
  const active = store.posts.filter((p) => !["draft", "posted", "archived"].includes(p.status));
  const attention = active.filter(Hoverdue);
  const moving = active.filter((p) => !Hoverdue(p));
  const open = (p) => store.navigate("editor", { postId: p.id, from: "home" });

  return (
    <div style={{ maxWidth: 880, margin: "0 auto", padding: "8px 0 80px" }}>
      <Greeting user={HUSERS.mika} sub={attention.length
        ? `${attention.length} post${attention.length > 1 ? "s" : ""} need a nudge to keep moving.`
        : "The board's moving. Nothing stalled."} />

      <HomeSection title="Needs a nudge" count={attention.length}>
        {attention.length === 0
          ? <HUI.EmptyState icon="check" title="Nothing stalled" body="Every post is moving. Check the dashboard for the full board." />
          : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {attention.map((p) => <HPCard key={p.id} post={p} onOpen={() => open(p)} controls={<HCoord post={p} />} />)}
            </div>}
      </HomeSection>

      <HomeSection title="Moving along" count={moving.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {moving.map((p) => <HPCard key={p.id} post={p} onOpen={() => open(p)} controls={<HCoord post={p} />} />)}
        </div>
      </HomeSection>

      <button className="sl-btn sl-btn--outline" onClick={() => store.navigate("dashboard")}>
        <HIcon name="gauge" size={16} /> Open the full dashboard
      </button>
    </div>
  );
}

// ---- Admin --------------------------------------------------------------
function AdminHome({ store }) {
  const active = store.posts.filter((p) => !["draft", "posted", "archived"].includes(p.status));
  const attention = active.filter(Hoverdue);
  const open = (p) => store.navigate("editor", { postId: p.id, from: "home" });

  return (
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "8px 0 80px" }}>
      <Greeting user={HUSERS.shay} sub="The board and the brain, both on you. Everything handed-off is visible." />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
        <button className="sl-card sl-card--hover" onClick={() => store.navigate("brain")}
          style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--sl-color-border)", padding: 22 }}>
          <HUI.SectionLabel icon="brain">The brain</HUI.SectionLabel>
          <p style={{ font: "400 14px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "12px 0 8px" }}>
            A ready post just auto-appended to the library. Context size is creeping; 2 near-duplicates flagged.
          </p>
          <span style={{ font: "600 13px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>Tend the brain <HIcon name="arrowRight" size={14} /></span>
        </button>
        <button className="sl-card sl-card--hover" onClick={() => store.navigate("dashboard")}
          style={{ textAlign: "left", cursor: "pointer", border: "1px solid var(--sl-color-border)", padding: 22 }}>
          <HUI.SectionLabel icon="gauge">Coordination</HUI.SectionLabel>
          <p style={{ font: "400 14px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "12px 0 8px" }}>
            {attention.length} post{attention.length > 1 ? "s" : ""} overdue on a key. Ping, deadline, or reassign the work.
          </p>
          <span style={{ font: "600 13px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>Open the dashboard <HIcon name="arrowRight" size={14} /></span>
        </button>
      </div>

      <HomeSection title="Needs attention" count={attention.length}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {attention.map((p) => <HPCard key={p.id} post={p} onOpen={() => open(p)} controls={<HCoord post={p} />} />)}
        </div>
      </HomeSection>
    </div>
  );
}

function HomeScreen() {
  const store = HUI.useStore();
  const role = store.user.role;
  if (role === "generator") return <GuyHome store={store} />;
  if (role === "editor") return <NyxHome store={store} />;
  if (role === "coordinator") return <MikaHome store={store} />;
  return <AdminHome store={store} />;
}

window.HomeScreen = HomeScreen;
