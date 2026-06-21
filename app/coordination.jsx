/* Coordination — Pipeline, Dashboard, Brain + shared cards. */
const CUI = window.SWMUI;
const CIcon = window.Icon;
const { USERS: CUSERS, MODES: CMODES, VECTORS: CVEC, BRAIN: CBRAIN } = window.SWM;
const TODAY = "2026-06-21";

function snippet(post) {
  const first = post.body[0];
  if (typeof first === "string") return first;
  return first.map((s) => s.t === "text" ? s.v : s.t === "placeholder" ? `〔${s.v}〕` : `[${s.fact}]`).join("");
}
function overdue(post) { return post.deadline && post.deadline < TODAY && !["ready", "posted", "archived"].includes(post.status); }

const STATE_META = {
  "draft":      { label: "Draft", cls: "sl-badge--outline" },
  "handed-off": { label: "Handed off", cls: "sl-badge--soft" },
  "in-editing": { label: "In editing", cls: "sl-badge--soft" },
  "approval":   { label: "In approval", cls: "sl-badge" },
  "ready":      { label: "Ready to go live", cls: "sl-badge--success" },
  "posted":     { label: "Posted", cls: "sl-badge--success" },
  "archived":   { label: "Archived", cls: "sl-badge--outline" },
};

function StatePill({ post }) {
  if (post.status === "approval") {
    return <span className="sl-badge" style={{ font: "500 12px var(--sl-font-sans)" }}>
      <CIcon name="keyOutline" size={13} /> {CUI.missingKeyText(post)}</span>;
  }
  const m = STATE_META[post.status];
  return <span className={"sl-badge " + m.cls} style={{ font: "500 12px var(--sl-font-sans)" }}>{m.label}</span>;
}

function waitingLabel(post) {
  if (!post.waitingOn) return null;
  const map = { guy: "Guy's intent key", nyx: post.status === "approval" ? "Nyx's quality key" : "Nyx to edit", mika: "Mika", shay: "Admin" };
  return map[post.waitingOn] || CUSERS[post.waitingOn]?.name;
}

// ---- Pipeline card ------------------------------------------------------
function PipelineCard({ post, onOpen, controls }) {
  return (
    <div className="sl-card" style={{ padding: 18 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <CUI.Avatar id={post.author} size={36} ring />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div onClick={onOpen} role="button" tabIndex={0} style={{ cursor: "pointer",
            font: "600 17px/1.3 var(--sl-font-sans)", color: "var(--sl-color-ink)", marginBottom: 5 }}>{post.title}</div>
          <p style={{ margin: "0 0 10px", font: "400 14px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)",
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{snippet(post)}</p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
            <StatePill post={post} />
            <span className="sl-badge sl-badge--soft" style={{ font: "500 11.5px var(--sl-font-sans)" }}>
              <CIcon name="target" size={12} /> {CMODES[post.mode].label}</span>
            <span style={{ font: "400 12px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>
              {post.contentType === "guy-personal" ? "Guy's personal" : "Nyx's own"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <CUI.StatusRow post={post} />
            {post.deadline && post.status !== "posted" && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 5, font: "500 12.5px var(--sl-font-sans)",
                color: overdue(post) ? "#B45309" : "var(--sl-color-text-subtle)" }}>
                <CIcon name="clock" size={14} /> {overdue(post) ? "Overdue · " : "Due "}{post.deadline}
              </span>
            )}
            {waitingLabel(post) && (
              <span style={{ font: "500 12.5px var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>
                Waiting on <b style={{ color: "var(--sl-color-ink)" }}>{waitingLabel(post)}</b>
              </span>
            )}
          </div>
          {controls}
        </div>
      </div>
    </div>
  );
}

// ---- Coordination controls (Admin/Mika) --------------------------------
function CoordControls({ post }) {
  const store = CUI.useStore();
  return (
    <div style={{ display: "flex", gap: 8, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--sl-color-border)", flexWrap: "wrap" }}>
      <button className="sl-btn sl-btn--ghost sl-btn--sm" style={{ color: "var(--sl-color-text-muted)" }}
        onClick={() => store.ping(post)}><CIcon name="bell" size={14} /> Ping</button>
      <button className="sl-btn sl-btn--ghost sl-btn--sm" style={{ color: "var(--sl-color-text-muted)" }}
        onClick={() => store.bumpDeadline(post)}><CIcon name="calendar" size={14} /> Adjust deadline</button>
      <button className="sl-btn sl-btn--ghost sl-btn--sm" style={{ color: "var(--sl-color-text-muted)" }}
        onClick={() => store.reassign(post)}><CIcon name="shuffle" size={14} /> Reassign task</button>
    </div>
  );
}

// ---- Pipeline screen ----------------------------------------------------
function PipelineScreen() {
  const store = CUI.useStore();
  const [filter, setFilter] = React.useState("active");
  const visible = store.posts.filter((p) => p.status !== "draft");
  const shown = visible.filter((p) =>
    filter === "active" ? !["posted", "archived"].includes(p.status) :
    filter === "shipped" ? p.status === "posted" : true);
  const open = (p) => store.navigate("editor", { postId: p.id, from: "pipeline" });

  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "8px 0 80px" }}>
      <h1 style={{ font: "500 30px/1 var(--sl-font-sans)", letterSpacing: "-0.9px", color: "var(--sl-color-ink)", margin: "0 0 6px" }}>Pipeline</h1>
      <p style={{ font: "400 15px var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "0 0 22px" }}>
        Everything handed off and onward. {store.user.role === "coordinator" ? "Opens read-only — you keep it moving, you don't edit." : ""}
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {[["active", "Active"], ["shipped", "Shipped archive"], ["all", "All"]].map(([k, l]) => (
          <button key={k} onClick={() => setFilter(k)} className={"sl-badge " + (filter === k ? "sl-badge--brand" : "sl-badge--outline")}
            style={{ cursor: "pointer", font: "500 13px var(--sl-font-sans)", padding: "8px 16px" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {shown.length === 0
          ? <CUI.EmptyState icon="layers" title="Nothing here right now" body="As posts get handed off, they'll show up in this list." />
          : shown.map((p) => <PipelineCard key={p.id} post={p} onOpen={() => open(p)} />)}
      </div>
    </div>
  );
}

// ---- Dashboard ----------------------------------------------------------
function DashboardScreen() {
  const store = CUI.useStore();
  const [view, setView] = React.useState("whom");
  const posts = store.posts.filter((p) => !["draft", "posted", "archived"].includes(p.status));
  const open = (p) => store.navigate("editor", { postId: p.id, from: "dashboard" });

  const groups = React.useMemo(() => {
    if (view === "overdue") {
      return [["Overdue & at-risk", posts.filter(overdue)], ["On track", posts.filter((p) => !overdue(p))]];
    }
    if (view === "stage") {
      return [["In editing", posts.filter((p) => ["handed-off", "in-editing"].includes(p.status))],
        ["In approval", posts.filter((p) => p.status === "approval")],
        ["Ready to go live", posts.filter((p) => p.status === "ready")]];
    }
    // waiting on whom
    const by = {};
    posts.forEach((p) => { const k = waitingLabel(p) || "No one"; (by[k] = by[k] || []).push(p); });
    return Object.entries(by);
  }, [view, posts]);

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "8px 0 80px" }}>
      <h1 style={{ font: "500 30px/1 var(--sl-font-sans)", letterSpacing: "-0.9px", color: "var(--sl-color-ink)", margin: "0 0 6px" }}>Dashboard</h1>
      <p style={{ font: "400 15px var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "0 0 22px" }}>
        The shared pipeline, legible from across the room. Move work and time — never a key.
      </p>
      <div style={{ display: "flex", gap: 8, marginBottom: 22 }}>
        {[["whom", "Waiting on whom"], ["stage", "By stage"], ["overdue", "Overdue / at-risk"]].map(([k, l]) => (
          <button key={k} onClick={() => setView(k)} className={"sl-badge " + (view === k ? "sl-badge--brand" : "sl-badge--outline")}
            style={{ cursor: "pointer", font: "500 13px var(--sl-font-sans)", padding: "8px 16px" }}>{l}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {groups.map(([label, items]) => (
          <div key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <h2 style={{ font: "600 15px var(--sl-font-sans)", color: "var(--sl-color-ink)", margin: 0 }}>{label}</h2>
              <span style={{ font: "500 13px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>{items.length}</span>
            </div>
            {items.length === 0
              ? <p style={{ font: "400 14px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", margin: 0 }}>Nothing here right now.</p>
              : <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {items.map((p) => <PipelineCard key={p.id} post={p} onOpen={() => open(p)} controls={<CoordControls post={p} />} />)}
                </div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- Brain --------------------------------------------------------------
function BrainScreen() {
  const store = CUI.useStore();
  const [tab, setTab] = React.useState("master");
  const [mp, setMp] = React.useState(CBRAIN.master_prompt.text);
  const [mr, setMr] = React.useState(CBRAIN.messaging_reference.text);
  const [lib, setLib] = React.useState(CBRAIN.few_shot_library.examples);

  const tabs = [["master", "Master prompt", CBRAIN.master_prompt], ["library", "Few-shot library", CBRAIN.few_shot_library], ["messaging", "Messaging reference", CBRAIN.messaging_reference]];
  const meta = tabs.find((t) => t[0] === tab)[2];

  return (
    <div style={{ maxWidth: 1120, margin: "0 auto", padding: "8px 0 80px" }}>
      <h1 style={{ font: "500 30px/1 var(--sl-font-sans)", letterSpacing: "-0.9px", color: "var(--sl-color-ink)", margin: "0 0 6px" }}>The brain</h1>
      <p style={{ font: "400 15px var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "0 0 22px" }}>
        The voice asset the app reads on every generation. Co-owned by Admin and Nyx — equal control, full history, rollback.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {tabs.map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} className={"sl-badge " + (tab === k ? "sl-badge--brand" : "sl-badge--outline")}
                style={{ cursor: "pointer", font: "500 13px var(--sl-font-sans)", padding: "8px 16px" }}>{l}</button>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ font: "400 12.5px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>
              Version {meta.version} · {meta.updated}
            </div>
            <CUI.ConfirmButton className="sl-btn sl-btn--ghost sl-btn--sm" confirmLabel="Roll back"
              style={{ color: "var(--sl-color-text-muted)" }}
              onConfirm={() => store.toast("Rolled back to the prior version — change is versioned with who & when.")}>
              <CIcon name="rotate" size={14} /> Roll back
            </CUI.ConfirmButton>
          </div>

          {tab === "library" ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {lib.map((ex) => {
                const dup = CBRAIN.few_shot_library.dupes.includes(ex.id);
                return (
                  <div key={ex.id} className="sl-card sl-card--sand" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
                    <CIcon name={ex.source === "flywheel" ? "rotate" : "bookmark"} size={16} style={{ color: "var(--sl-color-text-subtle)" }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ font: "600 14px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>{ex.title}</div>
                      <div style={{ font: "400 12px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>
                        {ex.added} · {ex.source === "flywheel" ? "auto-added by the flywheel" : "added by hand"}
                        {dup && <span style={{ color: "#B45309", marginLeft: 8 }}>· near-duplicate</span>}
                      </div>
                    </div>
                    <CUI.ConfirmButton danger className="sl-btn sl-btn--ghost sl-btn--sm" confirmLabel="Prune"
                      style={{ color: "var(--sl-color-text-muted)" }}
                      onConfirm={() => { setLib((l) => l.filter((x) => x.id !== ex.id)); store.toast("Pruned from the library — keeps the voice sharp."); }}>
                      <CIcon name="trash" size={14} /> Prune
                    </CUI.ConfirmButton>
                  </div>
                );
              })}
            </div>
          ) : (
            <textarea value={tab === "master" ? mp : mr} onChange={(e) => tab === "master" ? setMp(e.target.value) : setMr(e.target.value)}
              spellCheck={false}
              style={{ width: "100%", minHeight: 440, border: "1px solid var(--sl-color-border)", borderRadius: 12, padding: 18,
                font: "400 13px/1.6 var(--sl-font-mono, monospace)", color: "var(--sl-color-ink)", resize: "vertical", background: "#fff" }} />
          )}
        </div>

        {/* usage visibility */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "sticky", top: 100 }}>
          <div className="sl-card" style={{ padding: 18 }}>
            <CUI.SectionLabel icon="gauge">Usage visibility</CUI.SectionLabel>
            <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 12 }}>
              <UsageBar label="Context size" pct={68} note="creeping up" />
              <UsageBar label="Cost / generation" pct={42} note="$0.38 · ceiling $0.75" />
            </div>
            <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "var(--sl-color-brand-soft)",
              font: "400 13px/1.45 var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>
              <CIcon name="flag" size={14} /> 2 near-duplicate examples flagged. Pruning keeps the brain calibrated.
            </div>
          </div>
          <div className="sl-card sl-card--sand" style={{ padding: 18 }}>
            <CUI.SectionLabel icon="rotate">The flywheel</CUI.SectionLabel>
            <p style={{ font: "400 13.5px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "10px 0 0" }}>
              Every post that reaches ready-to-go-live is auto-appended as a new approved example — immediately shaping the next generation. Prune by hand to keep quality over quantity.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UsageBar({ label, pct, note }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", font: "500 13px var(--sl-font-sans)", color: "var(--sl-color-ink)", marginBottom: 5 }}>
        <span>{label}</span><span style={{ color: "var(--sl-color-text-subtle)", fontWeight: 400, fontSize: 12 }}>{note}</span>
      </div>
      <div style={{ height: 7, borderRadius: 9999, background: "var(--sl-color-surface-sand)", overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: pct > 60 ? "var(--sl-color-brand)" : "var(--sl-color-success)", borderRadius: 9999 }} />
      </div>
    </div>
  );
}

window.SWMCoord = { PipelineCard, CoordControls, StatePill, overdue, waitingLabel, snippet };
Object.assign(window, { PipelineScreen, DashboardScreen, BrainScreen });
