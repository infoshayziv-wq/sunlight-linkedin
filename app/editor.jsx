/* Editor screen — read/edit body, keys, comments, versions, hand off, posted. */
const EUI = window.SWMUI;
const EIcon = window.Icon;
const { USERS: EUSERS } = window.SWM;

function VisualLinkField({ post, readOnly, onChange }) {
  return (
    <div>
      <EUI.SectionLabel icon="image">Visual reference</EUI.SectionLabel>
      <div style={{ marginTop: 10 }}>
        <input className="sl-input" disabled={readOnly || post.noVisual} value={post.visualLink}
          placeholder="Paste the designer's asset URL…"
          onChange={(e) => onChange({ visualLink: e.target.value })} style={{ font: "400 13px var(--sl-font-sans)" }} />
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10, cursor: readOnly ? "default" : "pointer",
          font: "400 14px var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>
          <input type="checkbox" disabled={readOnly} checked={post.noVisual}
            onChange={(e) => onChange({ noVisual: e.target.checked, visualLink: e.target.checked ? "" : post.visualLink })} />
          No visual needed
        </label>
      </div>
    </div>
  );
}

function CommentThread({ post, readOnly, onUpdate }) {
  const [draft, setDraft] = React.useState("");
  const open = (post.comments || []).filter((c) => !c.resolved);
  const resolved = (post.comments || []).filter((c) => c.resolved);

  function add() {
    if (!draft.trim()) return;
    const c = { id: "c" + Date.now(), author: "nyx", anchor: null, body: draft.trim(), resolved: false, replies: [] };
    onUpdate({ comments: [...(post.comments || []), c] });
    setDraft("");
  }
  function toggle(id) {
    onUpdate({ comments: post.comments.map((c) => c.id === id ? { ...c, resolved: !c.resolved } : c) });
  }

  const row = (c) => (
    <div key={c.id} className="sl-card sl-card--sand" style={{ padding: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: c.anchor ? 6 : 4 }}>
        <EUI.Avatar id={c.author} size={22} />
        <span style={{ font: "600 13px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>{(EUSERS[c.author] || {}).name}</span>
        <button onClick={() => toggle(c.id)} disabled={readOnly} style={{ marginLeft: "auto", border: "none", background: "none",
          cursor: readOnly ? "default" : "pointer", font: "500 12px var(--sl-font-sans)",
          color: c.resolved ? "var(--sl-color-success)" : "var(--sl-color-text-subtle)", display: "inline-flex", alignItems: "center", gap: 4 }}>
          <EIcon name="check" size={13} /> {c.resolved ? "Resolved" : "Resolve"}
        </button>
      </div>
      {c.anchor && <div style={{ borderLeft: "2px solid var(--sl-color-brand)", paddingLeft: 8, margin: "0 0 6px",
        font: "400 12.5px/1.4 var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", fontStyle: "italic" }}>{c.anchor}</div>}
      <p style={{ margin: 0, font: "400 14px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>{c.body}</p>
    </div>
  );

  return (
    <div>
      <EUI.SectionLabel icon="comment">Comments</EUI.SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
        {open.length === 0 && resolved.length === 0 && (
          <p style={{ font: "400 13px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", margin: 0 }}>No comments yet.</p>
        )}
        {open.map(row)}
        {!readOnly && (
          <div style={{ display: "flex", gap: 8 }}>
            <input className="sl-input" value={draft} onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") add(); }} placeholder="Add a comment…"
              style={{ font: "400 14px var(--sl-font-sans)" }} />
            <button className="sl-btn sl-btn--outline sl-btn--sm" onClick={add}>Post</button>
          </div>
        )}
        {resolved.length > 0 && (
          <details>
            <summary style={{ cursor: "pointer", font: "500 13px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", padding: "4px 0" }}>
              {resolved.length} resolved
            </summary>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8, opacity: 0.7 }}>{resolved.map(row)}</div>
          </details>
        )}
      </div>
    </div>
  );
}

function EditorScreen() {
  const store = EUI.useStore();
  const post = store.posts.find((p) => p.id === store.params.postId);
  const [histOpen, setHistOpen] = React.useState(false);
  const [postedOpen, setPostedOpen] = React.useState(false);
  const [handoffNote, setHandoffNote] = React.useState("");
  if (!post) return <div style={{ padding: 40 }}>Post not found.</div>;

  const role = store.user.role;
  const softLocked = role === "admin" && post.status === "in-editing";
  const isAuthor = post.author === store.user.id;
  const canEditBody = !softLocked && (
    (role === "editor" && (post.status !== "draft" || post.author === "nyx")) ||
    (role === "admin" && post.status !== "draft") ||
    (role === "generator" && isAuthor && post.status === "draft")
  );
  const canComment = role !== "coordinator" && post.status !== "draft";
  const ph = EUI.placeholderCount(post);
  const ready = EUI.isReady(post);
  const canPost = ready && (role === "admin" || role === "coordinator" || role === "editor");

  const update = (patch) => store.updatePost(post.id, patch);

  function applyKey(kind) {
    store.applyKey(post.id, kind);
  }
  function handOff() {
    store.handOff(post.id, handoffNote);
    setHandoffNote("");
  }

  return (
    <div style={{ maxWidth: 1160, margin: "0 auto", padding: "8px 0 80px" }}>
      <button className="sl-btn sl-btn--ghost sl-btn--sm" onClick={() => store.navigate(store.params.from || "pipeline")}
        style={{ color: "var(--sl-color-text-muted)", paddingLeft: 0, marginBottom: 12 }}>
        <EIcon name="arrowLeft" size={16} /> Back
      </button>

      {softLocked && (
        <div className="sl-badge--soft" style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--sl-color-brand-soft)",
          padding: "12px 18px", borderRadius: 12, marginBottom: 18, font: "500 14px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>
          <EIcon name="lock" size={16} /> Nyx is editing — opens read-only. Your view updates when she releases it.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 36, alignItems: "start" }}>
        {/* MAIN: draft */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <span className="sl-badge" style={{ background: EUSERS[post.author].tint, font: "500 12px var(--sl-font-sans)" }}>
              {post.contentType === "guy-personal" ? "Guy's personal post" : "Nyx's own post"}
            </span>
            <GUI_modeBadge post={post} />
          </div>
          <h1 style={{ font: "500 30px/1.1 var(--sl-font-sans)", letterSpacing: "-0.9px", color: "var(--sl-color-ink)", margin: "0 0 18px" }}>
            {post.title}
          </h1>

          {post.handoffNote && (
            <div className="sl-card sl-card--sand" style={{ padding: "12px 16px", marginBottom: 22, display: "flex", gap: 10 }}>
              <EUI.Avatar id={post.author} size={26} />
              <div>
                <div style={{ font: "600 12px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", marginBottom: 2 }}>Handoff note · {EUSERS[post.author].first}</div>
                <p style={{ margin: 0, font: "400 14px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>{post.handoffNote}</p>
              </div>
            </div>
          )}

          <div className="sl-card" style={{ padding: "32px 36px", opacity: softLocked ? 0.7 : 1 }}>
            <EUI.Body post={post} editable={canEditBody} large onChange={(body) => update({ body })} />
          </div>
          {canEditBody && (
            <p style={{ font: "400 12.5px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", margin: "10px 2px 0" }}>
              Click any line to edit directly. {ph > 0 ? `Click a 〔placeholder〕 to drop in the real value.` : "Saved automatically, every meaningful change versioned."}
            </p>
          )}

          {post.status === "draft" && isAuthor && <RefineRail store={store} post={post} />}
        </div>

        {/* RAIL */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 100 }}>
          {/* keys / status */}
          <div className="sl-card" style={{ padding: 18 }}>
            <EUI.SectionLabel icon="key">Approval</EUI.SectionLabel>
            <div style={{ marginTop: 12 }}>
              <EUI.KeyIndicator post={post} role={role} onApplyKey={applyKey} />
            </div>
            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8,
              font: "500 14px var(--sl-font-sans)",
              color: ready ? "var(--sl-color-success)" : "var(--sl-color-text-muted)" }}>
              {ready && <EIcon name="check" size={16} />}
              {EUI.missingKeyText(post)}
            </div>
            {post.status === "posted" && (
              <div className="sl-badge sl-badge--success" style={{ marginTop: 12 }}>
                <EIcon name="check" size={14} /> Posted {post.posted.when} · {EUSERS[post.posted.who].first}
              </div>
            )}
          </div>

          {/* status row */}
          <div className="sl-card" style={{ padding: 18 }}>
            <EUI.SectionLabel>At a glance</EUI.SectionLabel>
            <div style={{ marginTop: 12 }}><EUI.StatusRow post={post} /></div>
            {ph > 0 && (
              <p style={{ margin: "12px 0 0", font: "400 13px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>
                <EIcon name="flag" size={13} /> {ph} unresolved placeholder{ph > 1 ? "s" : ""} — visible at every gate until resolved.
              </p>
            )}
          </div>

          <div className="sl-card" style={{ padding: 18 }}>
            <VisualLinkField post={post} readOnly={!canEditBody && role !== "editor" && role !== "admin"} onChange={update} />
          </div>

          {/* version history */}
          <button className="sl-btn sl-btn--outline sl-btn--sm" onClick={() => setHistOpen(true)} style={{ justifyContent: "flex-start" }}>
            <EIcon name="history" size={15} /> Version history ({post.versions.length})
          </button>

          {/* comments */}
          {post.status !== "draft" && (
            <div className="sl-card" style={{ padding: 18 }}>
              <CommentThread post={post} readOnly={!canComment} onUpdate={update} />
            </div>
          )}

          {/* hand off (private draft, author) */}
          {post.status === "draft" && isAuthor && (
            <div className="sl-card sl-card--sand" style={{ padding: 18 }}>
              <EUI.SectionLabel icon="send">Hand off</EUI.SectionLabel>
              <p style={{ font: "400 13px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "10px 0" }}>
                Move this into the shared pipeline for Nyx to edit. Private until you do.
              </p>
              <textarea value={handoffNote} onChange={(e) => setHandoffNote(e.target.value)} rows={2}
                className="sl-input" placeholder="Optional note for the editor…" style={{ resize: "none", font: "400 14px var(--sl-font-sans)", marginBottom: 10 }} />
              <button className="sl-btn sl-btn--primary sl-btn--block" onClick={handOff}>Hand off to Nyx</button>
            </div>
          )}

          {/* mark posted */}
          {canPost && post.status !== "posted" && (
            <button className="sl-btn sl-btn--secondary sl-btn--block" onClick={() => setPostedOpen(true)}>
              <EIcon name="check" size={16} /> Mark as posted
            </button>
          )}
        </div>
      </div>

      {/* version dialog */}
      <EUI.Dialog open={histOpen} onClose={() => setHistOpen(false)} title="Version history" width={520}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {post.versions.map((v, i) => (
            <div key={v.id} className="sl-card sl-card--sand" style={{ padding: 14, display: "flex", alignItems: "center", gap: 12 }}>
              <EUI.Avatar id={v.who} size={30} />
              <div style={{ flex: 1 }}>
                <div style={{ font: "600 14px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>
                  {EUSERS[v.who].name} {i === 0 && <span style={{ font: "500 11px var(--sl-font-sans)", color: "var(--sl-color-success)", marginLeft: 6 }}>current</span>}
                </div>
                <div style={{ font: "400 12.5px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>{v.when} · {v.note}</div>
              </div>
              {i !== 0 && (
                <EUI.ConfirmButton className="sl-btn sl-btn--ghost sl-btn--sm" confirmLabel="Restore"
                  onConfirm={() => { store.toast("Restored as a new version — nothing was lost."); setHistOpen(false); }}>
                  <EIcon name="rotate" size={14} /> Restore
                </EUI.ConfirmButton>
              )}
            </div>
          ))}
        </div>
        <p style={{ font: "400 12.5px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", margin: "14px 0 0" }}>
          Restoring creates a new version. Nothing is ever destroyed.
        </p>
      </EUI.Dialog>

      {/* posted dialog */}
      <PostedDialog open={postedOpen} onClose={() => setPostedOpen(false)} post={post}
        onConfirm={(url) => { store.markPosted(post.id, url); setPostedOpen(false); }} ph={ph} />
    </div>
  );
}

function GUI_modeBadge({ post }) {
  const m = window.SWM.MODES[post.mode];
  return (
    <span className="sl-badge sl-badge--soft" style={{ font: "500 12px var(--sl-font-sans)" }}>
      <EIcon name="target" size={13} /> {m.label} · {window.SWM.VECTORS[post.vector]}
    </span>
  );
}

function PostedDialog({ open, onClose, post, onConfirm, ph }) {
  const [url, setUrl] = React.useState("");
  return (
    <EUI.Dialog open={open} onClose={onClose} title="Mark as posted" width={480}
      footer={<>
        <button className="sl-btn sl-btn--ghost" onClick={onClose}>Cancel</button>
        <button className="sl-btn sl-btn--primary" onClick={() => onConfirm(url)}>Record as posted</button>
      </>}>
      <p style={{ font: "400 15px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "0 0 16px" }}>
        This only records that a human copied the post into LinkedIn — the app never posts. Captures the date, who marked it, and an optional live URL.
      </p>
      {ph > 0 && (
        <div style={{ display: "flex", gap: 10, padding: "12px 14px", borderRadius: 10, background: "var(--sl-color-brand-soft)",
          marginBottom: 16, font: "400 14px/1.45 var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>
          <EIcon name="flag" size={16} style={{ flex: "0 0 auto", marginTop: 1 }} />
          Heads up: {ph} placeholder{ph > 1 ? "s" : ""} still unresolved. You can still post — just confirming you meant to.
        </div>
      )}
      <input className="sl-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Live URL (optional)" />
    </EUI.Dialog>
  );
}

window.EditorScreen = EditorScreen;

// ---- Refine with the brain (conversational refinement on a kept draft) ----
const REFINE_T = window.SWM.T, REFINE_MF = window.SWM.MF;
function refine(body, instr) {
  const t = instr.toLowerCase();
  const isStr = (p) => typeof p === "string";
  const firstSentence = (s) => s.split(/(?<=[.!?])\s+/)[0];

  if (/\b(add|number|stat|figure|float|data|percent|%|customer|client|name|quote|metric|proof)\b/.test(t)) {
    const nb = body.slice();
    nb.splice(Math.min(1, nb.length), 0, [REFINE_T("Worth anchoring with a real number here — "), REFINE_MF("figure"), REFINE_T(".")]);
    return { body: nb, reply: "That leans on a fact I don't have. I've left the spot marked — drop in the real figure, or it travels as a clearly-marked placeholder. I won't guess." };
  }
  if (/\b(end|ending|close|closing|final|last)\b/.test(t)) {
    const pool = ["That's the whole game.", "The rest is just detail.", "Everything else is noise."];
    const nb = body.map((p, i) => (i === body.length - 1 && isStr(p)) ? pool[Math.floor(Math.random() * pool.length)] : p);
    return { body: nb, reply: "Sharpened the close — the last line lands harder now." };
  }
  if (/\b(open|opening|hook|start|first|lede|lead|intro)\b/.test(t)) {
    const nb = body.slice();
    for (let i = 0; i < nb.length; i++) { if (isStr(nb[i])) { nb[i] = firstSentence(nb[i]); break; } }
    return { body: nb, reply: "Reworked the open to start straight on the tension." };
  }
  if (/\b(short|shorter|tighten|trim|concise|cut|punch|punchy|crisp|brief|less|cleaner)\b/.test(t)) {
    const nb = body.map((p) => isStr(p) ? firstSentence(p) : p);
    return { body: nb, reply: "Tightened throughout — cut the slack, kept the idea." };
  }
  let li = -1, ll = 0;
  body.forEach((p, i) => { if (isStr(p) && p.length > ll) { ll = p.length; li = i; } });
  const nb = body.map((p, i) => i === li ? firstSentence(p) : p);
  return { body: nb, reply: "Eased the rhythm and trimmed a couple of words. Tell me where to push harder." };
}

function RefineRail({ store, post }) {
  const [msgs, setMsgs] = React.useState([{ who: "brain",
    text: "Kept. Tell me how to sharpen it — shorter, a punchier close, a stronger open. I'll keep it in Guy's voice, and I won't invent a fact." }]);
  const [val, setVal] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const scroller = React.useRef(null);
  const stamp = () => "2026-06-21 " + new Date().toTimeString().slice(0, 5);

  React.useEffect(() => { if (scroller.current) scroller.current.scrollTop = scroller.current.scrollHeight; }, [msgs, busy]);

  function send(text) {
    const instr = (text != null ? text : val).trim();
    if (!instr || busy) return;
    setVal("");
    setMsgs((m) => [...m, { who: "user", text: instr }]);
    setBusy(true);
    setTimeout(() => {
      const { body, reply } = refine(post.body, instr);
      store.updatePost(post.id, {
        body,
        versions: [{ id: "v" + (post.versions.length + 1), who: store.user.id, when: stamp(),
          note: 'Refined: "' + (instr.length > 38 ? instr.slice(0, 38) + "…" : instr) + '"' }, ...post.versions],
      });
      setMsgs((m) => [...m, { who: "brain", text: reply }]);
      setBusy(false);
    }, 1300);
  }

  const chips = ["Make it shorter", "Punchier ending", "Stronger open", "Add a real number"];

  return (
    <div className="sl-card" style={{ padding: 20, marginTop: 20 }}>
      <EUI.SectionLabel icon="pencil">Refine with the brain</EUI.SectionLabel>
      <div ref={scroller} style={{ display: "flex", flexDirection: "column", gap: 12, margin: "14px 0", maxHeight: 320, overflow: "auto" }}>
        {msgs.map((m, i) => m.who === "brain" ? (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <EUI.Avatar id="nyx" size={26} />
            <div className="sl-card sl-card--sand" style={{ padding: "10px 14px", maxWidth: "85%" }}>
              <p style={{ margin: 0, font: "400 14px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>{m.text}</p>
            </div>
          </div>
        ) : (
          <div key={i} style={{ display: "flex", justifyContent: "flex-end" }}>
            <div style={{ padding: "10px 14px", borderRadius: 12, background: "var(--sl-color-brand-soft)", maxWidth: "85%",
              font: "400 14px/1.5 var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>{m.text}</div>
          </div>
        ))}
        {busy && (
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <EUI.Avatar id="nyx" size={26} />
            <div className="sl-card sl-card--sand" style={{ padding: "12px 16px", display: "flex", gap: 6 }}>
              <span className="swm-breathe" style={{ width: 8, height: 8, borderRadius: 9999, background: "var(--sl-color-brand)" }} />
              <span style={{ font: "400 13px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>Reworking in Guy's voice…</span>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
        {chips.map((c) => (
          <button key={c} onClick={() => send(c)} disabled={busy} className="sl-badge sl-badge--outline"
            style={{ cursor: busy ? "default" : "pointer", font: "500 12.5px var(--sl-font-sans)", padding: "7px 13px", opacity: busy ? 0.5 : 1 }}>{c}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="sl-input" value={val} onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") send(); }} disabled={busy}
          placeholder="Tell the brain how to refine it…" style={{ font: "400 14px var(--sl-font-sans)" }} />
        <button className="sl-btn sl-btn--primary sl-btn--sm" onClick={() => send()} disabled={busy}>
          <EIcon name="send" size={15} />
        </button>
      </div>
      <p style={{ font: "400 12px/1.45 var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", margin: "12px 0 0" }}>
        Each refinement is a new version — restore any earlier take. Ask for a fact it doesn't have and it marks the gap, never invents.
      </p>
    </div>
  );
}
