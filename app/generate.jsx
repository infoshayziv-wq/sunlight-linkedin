/* Generate screen — type-and-go → mode → 3 angles → keep/hand off. JSX. */
const { GEN_CLEAN, GEN_FLOAT, MODES: GMODES, SPARKS } = window.SWM;
const GUI = window.SWMUI;
const GIcon = window.Icon;

// reserve angles for "Different angle" in-place swaps
const RESERVE = {
  clean: {
    vector: "broken-list",
    body: [
      "Three things every platform still believes about moving money, and all three are wrong.",
      "That checks are cheaper than cards. That speed is the only metric that matters. That payments belong to finance, not product.",
      "Drop all three and the same flow looks like a revenue line: card where it qualifies, interchange you weren't capturing, float you stopped giving away.",
      "The assumptions were never free. They just billed you quietly.",
    ],
  },
  float: {
    vector: "broken-list",
    body: [
      "Two things platforms get wrong about float, and both cost real money.",
      [window.SWM.T("First, that it's a rounding error — it isn't. Second, that it's finance's job, not the product's. For us, float moved revenue by "), window.SWM.MF("real float figure"), window.SWM.T(".")],
      "Same dollars, a rail that pays you to hold them a beat longer.",
      "The float was always there. We just stopped handing it to someone else.",
    ],
  },
};

function AngleCard({ angle, mode, secondary, index, focused, onFocus, onKeep, onEdit, onDifferent, onChange, swapping }) {
  return (
    <div id={`angle-${index}`} className="sl-card sl-card--hover" onMouseEnter={onFocus}
      style={{ padding: 28, scrollMarginTop: 100, borderColor: focused ? "var(--sl-color-border-strong)" : "var(--sl-color-border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <GUI.Transparency mode={mode} secondary={secondary} vector={angle.vector} />
        <span style={{ font: "600 12px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>Angle {index + 1}</span>
      </div>
      {swapping
        ? <div style={{ padding: "40px 0", textAlign: "center", color: "var(--sl-color-text-subtle)",
            font: "500 15px var(--sl-font-sans)" }}>
            <span className="swm-breathe" style={{ display: "inline-block", width: 14, height: 14, borderRadius: 9999,
              background: "var(--sl-color-brand)", marginRight: 10, verticalAlign: "middle" }} />
            Finding a different way in…
          </div>
        : <GUI.Body post={{ body: angle.body }} editable large onChange={onChange} />}
      {!swapping && (
        <div style={{ display: "flex", gap: 10, marginTop: 22, alignItems: "center" }}>
          <button className="sl-btn sl-btn--primary sl-btn--sm" onClick={onKeep}>Keep &amp; refine</button>
          <button className="sl-btn sl-btn--outline sl-btn--sm" onClick={onEdit}>Edit</button>
          <button className="sl-btn sl-btn--ghost sl-btn--sm" onClick={onDifferent} style={{ marginLeft: "auto", color: "var(--sl-color-text-muted)" }}>
            <GIcon name="shuffle" size={15} /> Different angle
          </button>
        </div>
      )}
    </div>
  );
}

function GenerateScreen() {
  const store = GUI.useStore();
  const [idea, setIdea] = React.useState("");
  const [mode, setMode] = React.useState(null);          // chosen mode id
  const [secondary, setSecondary] = React.useState(null); // blended second mode
  const [pickerOpen, setPickerOpen] = React.useState(false);
  const [phase, setPhase] = React.useState("idle");       // idle | thinking | angles
  const [angles, setAngles] = React.useState([]);
  const [genMode, setGenMode] = React.useState("theorist");
  const [focused, setFocused] = React.useState(0);
  const [swapIdx, setSwapIdx] = React.useState(-1);
  const [showFacts, setShowFacts] = React.useState(false);
  const [showSpark, setShowSpark] = React.useState(false);
  const [attachments, setAttachments] = React.useState([]);
  const [attachOpen, setAttachOpen] = React.useState(false);

  const isFloat = (t) => /float|lifted|incremental|\b%\b|\bx%\b/i.test(t);
  const reacted = idea.trim().length > 6;
  const suggested = isFloat(idea) ? "builder" : "theorist";
  const activeMode = mode || suggested;

  function pickMode(id) {
    if (id === "wildcard") { setMode("wildcard"); setSecondary(null); setPickerOpen(false); return; }
    if (mode && mode !== id && !secondary && mode !== "wildcard") { setSecondary(id); setPickerOpen(false); return; }
    if (secondary === id) { setSecondary(null); return; }
    setMode(id); setSecondary(null);
  }

  function generate() {
    const set = isFloat(idea) ? GEN_FLOAT : GEN_CLEAN;
    setGenMode(mode || set.mode);
    setPhase("thinking");
    setTimeout(() => {
      setAngles(set.angles.map((a) => ({ ...a, body: a.body.map((p) => Array.isArray(p) ? p.map((s) => ({ ...s })) : p) })));
      setPhase("angles");
    }, 2600);
  }

  function differentAngle(i) {
    setSwapIdx(i);
    setTimeout(() => {
      const reserve = isFloat(idea) ? RESERVE.float : RESERVE.clean;
      setAngles((prev) => prev.map((a, j) => j === i
        ? { ...reserve, body: reserve.body.map((p) => Array.isArray(p) ? p.map((s) => ({ ...s })) : p) }
        : a));
      setSwapIdx(-1);
    }, 1400);
  }

  function keep(i) { store.createDraftFromAngle(angles[i], genMode, secondary, idea); }

  function addAttachment(kind) {
    setAttachOpen(false);
    if (kind === "deck") setAttachments((a) => [...a, { id: Date.now(), icon: "file", name: "Q2-board-deck.pdf", note: "reading as source", directive: false }]);
    if (kind === "melio") setAttachments((a) => [...a, { id: Date.now(), icon: "link", name: "melio-press-release", note: "read as source, not instruction", directive: true }]);
  }

  // ----- IDLE / INPUT -----
  if (phase !== "angles") {
    return (
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "8px 0 80px" }}>
        <h1 style={{ font: "500 36px/1 var(--sl-font-sans)", letterSpacing: "-1.5px", color: "var(--sl-color-ink)", margin: "8px 0 6px" }}>
          What's the idea?
        </h1>
        <p style={{ font: "400 16px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "0 0 24px" }}>
          One sentence is enough. The brain composes three angles in Guy's voice.
        </p>

        {phase === "thinking"
          ? <div className="sl-card" style={{ padding: 0 }}><GUI.ThinkingState /></div>
          : <>
            <div className="sl-card" style={{ padding: 18 }}>
              <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={3}
                placeholder="e.g. Where B2B payments incentives are heading…"
                style={{ width: "100%", border: "none", outline: "none", resize: "none", background: "transparent",
                  font: "400 19px/1.5 var(--sl-font-sans)", color: "var(--sl-color-ink)" }} />

              {/* attachments */}
              {attachments.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "8px 0 4px" }}>
                  {attachments.map((at) => (
                    <span key={at.id} className="sl-badge sl-badge--outline" style={{ gap: 7 }}>
                      <GIcon name={at.icon} size={14} /> {at.name}
                      <button onClick={() => setAttachments((a) => a.filter((x) => x.id !== at.id))}
                        style={{ border: "none", background: "none", cursor: "pointer", color: "var(--sl-color-text-subtle)", padding: 0, display: "inline-flex" }}>
                        <GIcon name="x" size={13} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              {attachments.some((a) => a.directive) && (
                <div style={{ font: "400 13px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", marginTop: 2 }}>
                  <GIcon name="eye" size={13} /> Directive text detected in a source — read as source, not instruction.
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, flexWrap: "wrap" }}>
                <div style={{ position: "relative" }}>
                  <button className="sl-btn sl-btn--ghost sl-btn--sm" style={{ padding: "6px 8px", color: "var(--sl-color-text-muted)" }}
                    onClick={() => setAttachOpen((o) => !o)}>
                    <GIcon name="paperclip" size={15} /> Attach source
                  </button>
                  {attachOpen && (
                    <div className="sl-card" style={{ position: "absolute", top: "110%", left: 0, zIndex: 20, padding: 6, width: 230, boxShadow: "var(--sl-shadow-lg)" }}>
                      <MenuItem icon="file" label="Q2 board deck (PDF)" onClick={() => addAttachment("deck")} />
                      <MenuItem icon="link" label="Melio press release (link)" onClick={() => addAttachment("melio")} />
                    </div>
                  )}
                </div>
                <button className="sl-btn sl-btn--ghost sl-btn--sm" style={{ padding: "6px 8px", color: "var(--sl-color-text-muted)" }}
                  onClick={() => setShowFacts((s) => !s)}>
                  <GIcon name="plus" size={15} /> Add facts to anchor on
                </button>
                <button className="sl-btn sl-btn--primary" style={{ marginLeft: "auto" }} disabled={!reacted} onClick={generate}>
                  Show me 3 angles <GIcon name="arrowRight" size={16} />
                </button>
              </div>
            </div>

            {showFacts && (
              <div className="sl-card sl-card--sand" style={{ marginTop: 12, padding: 18 }}>
                <GUI.SectionLabel icon="target">Facts to anchor on</GUI.SectionLabel>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 12 }}>
                  <input className="sl-input" placeholder="Fact (e.g. float lift)" />
                  <input className="sl-input" placeholder="Value (e.g. the real figure)" />
                </div>
                <p style={{ font: "400 13px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", margin: "10px 0 0" }}>
                  Optional. Supplying real data up front means fewer missing-fact prompts later.
                </p>
              </div>
            )}

            {/* reaction / mode suggestion */}
            {reacted && (
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <GUI.Avatar id="nyx" size={28} />
                  <div className="sl-card sl-card--sand" style={{ padding: "12px 16px", flex: 1 }}>
                    <p style={{ margin: 0, font: "400 15px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>
                      {(isFloat(idea) ? GEN_FLOAT : GEN_CLEAN).reflect}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  <span style={{ font: "500 14px var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>Suggested mode:</span>
                  <div style={{ position: "relative" }}>
                    <GUI.ModeChip mode={activeMode} secondary={secondary} selected onClick={() => setPickerOpen((o) => !o)} />
                    {pickerOpen && (
                      <div className="sl-card" style={{ position: "absolute", top: "115%", left: 0, zIndex: 20, padding: 6, width: 280, boxShadow: "var(--sl-shadow-lg)" }}>
                        <div style={{ font: "400 12px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", padding: "4px 10px 8px" }}>
                          Tap to change. Tap a second to blend (max two).
                        </div>
                        {Object.values(GMODES).map((m) => {
                          const on = activeMode === m.id || secondary === m.id;
                          return (
                            <button key={m.id} onClick={() => pickMode(m.id)} style={{ display: "flex", width: "100%",
                              alignItems: "center", gap: 8, border: "none", cursor: "pointer", textAlign: "left",
                              background: on ? "var(--sl-color-brand-soft)" : "transparent", borderRadius: 8, padding: "8px 10px" }}>
                              {on ? <GIcon name="check" size={15} /> : <span style={{ width: 15 }} />}
                              <span><b style={{ font: "600 14px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>{m.label}</b>
                                <span style={{ font: "400 13px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", marginLeft: 6 }}>{m.desc}</span></span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {secondary && <button className="sl-btn sl-btn--ghost sl-btn--sm" style={{ color: "var(--sl-color-text-subtle)" }}
                    onClick={() => setSecondary(null)}>clear blend</button>}
                </div>
              </div>
            )}

            {/* spark (empty state) */}
            {!reacted && (
              <div style={{ marginTop: 22 }}>
                <button className="sl-btn sl-btn--ghost sl-btn--sm" style={{ color: "var(--sl-color-text-muted)", padding: "6px 8px" }}
                  onClick={() => setShowSpark((s) => !s)}>
                  <GIcon name="sparkle" size={15} /> Need a spark?
                </button>
                {showSpark && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
                    {SPARKS.map((s) => (
                      <button key={s} className="sl-badge sl-badge--soft" style={{ cursor: "pointer", font: "500 13px var(--sl-font-sans)", padding: "8px 14px" }}
                        onClick={() => { setIdea(s); setShowSpark(false); }}>
                        <GIcon name="sparkle" size={13} /> {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>}
      </div>
    );
  }

  // ----- ANGLES -----
  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "8px 0 80px", position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <button className="sl-btn sl-btn--ghost sl-btn--sm" onClick={() => setPhase("idle")} style={{ color: "var(--sl-color-text-muted)", paddingLeft: 0 }}>
          <GIcon name="arrowLeft" size={16} /> Back to the idea
        </button>
      </div>
      <h2 style={{ font: "600 24px/1.2 var(--sl-font-sans)", letterSpacing: "-0.5px", color: "var(--sl-color-ink)", margin: "0 0 4px" }}>
        Three angles, same idea
      </h2>
      <p style={{ font: "400 15px var(--sl-font-sans)", color: "var(--sl-color-text-muted)", margin: "0 0 24px" }}>
        “{idea}”
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "44px 1fr", gap: 18 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, position: "sticky", top: 100, height: "fit-content" }}>
          {[0, 1, 2].map((i) => (
            <a key={i} href={`#angle-${i}`} onClick={() => setFocused(i)}
              style={{ width: 36, height: 36, borderRadius: 9999, display: "inline-flex", alignItems: "center", justifyContent: "center",
                font: "600 14px var(--sl-font-sans)", textDecoration: "none",
                background: focused === i ? "var(--sl-color-brand-soft)" : "var(--sl-color-surface-sand)",
                color: "var(--sl-color-ink)" }}>{i + 1}</a>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {angles.map((a, i) => (
            <AngleCard key={i} angle={a} mode={genMode} secondary={secondary} index={i}
              focused={focused === i} swapping={swapIdx === i}
              onFocus={() => setFocused(i)}
              onChange={(body) => setAngles((prev) => prev.map((x, j) => j === i ? { ...x, body } : x))}
              onKeep={() => keep(i)} onEdit={() => keep(i)} onDifferent={() => differentAngle(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function MenuItem({ icon, label, onClick }) {
  return (
    <button onClick={onClick} style={{ display: "flex", width: "100%", alignItems: "center", gap: 10, border: "none",
      cursor: "pointer", textAlign: "left", background: "transparent", borderRadius: 8, padding: "9px 10px",
      font: "500 14px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}
      onMouseEnter={(e) => e.currentTarget.style.background = "var(--sl-color-surface-sand)"}
      onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
      {window.Icon && <GIcon name={icon} size={16} />} {label}
    </button>
  );
}

window.GenerateScreen = GenerateScreen;
