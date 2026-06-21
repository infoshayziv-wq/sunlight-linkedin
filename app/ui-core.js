/* Sunlight Writing Machine — shared product components + store context.
   Exports to window: AppCtx, useStore, and product components. */
(function () {
  window.AppCtx = React.createContext(null);
  const useStore = () => React.useContext(window.AppCtx);
  const { MODES, VECTORS, USERS } = window.SWM;
  const Icon = window.Icon;

  // ---- body helpers -----------------------------------------------------
  const normPara = (p) => (typeof p === "string" ? [{ t: "text", v: p }] : p);
  const placeholderCount = (post) =>
    (post.body || []).reduce((n, p) => n + normPara(p).filter((s) => s.t === "placeholder").length, 0);
  const missingCount = (post) =>
    (post.body || []).reduce((n, p) => n + normPara(p).filter((s) => s.t === "missing").length, 0);

  // ---- Avatar -----------------------------------------------------------
  function Avatar({ id, size = 36, ring = false }) {
    const u = USERS[id] || { initials: "?", tint: "#eee" };
    return React.createElement("span", {
      style: {
        width: size, height: size, borderRadius: 9999, background: u.tint,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.36, fontWeight: 600, color: "var(--sl-color-ink)",
        flex: "0 0 auto", letterSpacing: "-0.3px",
        boxShadow: ring ? "0 0 0 2px #fff, 0 0 0 3px var(--sl-color-border)" : "none",
      }, title: u.name,
    }, u.initials);
  }

  // ---- Transparency line ------------------------------------------------
  function Transparency({ mode, secondary, vector }) {
    const label = secondary
      ? `${MODES[mode].label} + ${MODES[secondary].label}`
      : MODES[mode].label;
    return React.createElement("div", {
      style: { font: "500 12px/1.4 var(--sl-font-sans)", color: "var(--sl-color-text-subtle)",
        letterSpacing: "0.1px", display: "flex", alignItems: "center", gap: 6 },
    },
      React.createElement(Icon, { name: "target", size: 13 }),
      `${label} · ${VECTORS[vector] || vector}`
    );
  }

  // ---- Mode chip --------------------------------------------------------
  function ModeChip({ mode, secondary, selected, onClick, interactive = true }) {
    const m = MODES[mode];
    const label = secondary ? `${m.label} + ${MODES[secondary].label}` : `${m.label} · ${m.desc}`;
    return React.createElement("button", {
      onClick, disabled: !interactive,
      className: "sl-badge",
      style: {
        cursor: interactive ? "pointer" : "default", border: "1px solid",
        borderColor: selected ? "transparent" : "var(--sl-color-border)",
        background: selected ? "var(--sl-color-brand-soft)" : "#fff",
        color: "var(--sl-color-ink)", font: "500 13px/1 var(--sl-font-sans)",
        padding: "8px 14px",
      },
    },
      React.createElement("span", { style: { fontWeight: 600 } }, secondary ? `${m.label} + ${MODES[secondary].label}` : m.label),
      !secondary && React.createElement("span", { style: { color: "var(--sl-color-text-subtle)", fontWeight: 400, marginLeft: 2 } }, `· ${m.desc}`)
    );
  }

  // ---- Placeholder token (clearly-marked) -------------------------------
  function PlaceholderToken({ label, onClick, title }) {
    return React.createElement("span", {
      onClick, role: "mark", "aria-label": `marked placeholder: ${label}, unresolved`,
      title: title || "Unresolved placeholder — click to add the real value",
      style: {
        display: "inline-flex", alignItems: "center", gap: 5, padding: "1px 9px",
        margin: "0 1px", borderRadius: 7, background: "var(--sl-color-brand-soft)",
        border: "1px dashed var(--sl-color-border-strong)", color: "var(--sl-color-ink)",
        font: "500 0.92em/1.4 var(--sl-font-sans)", cursor: onClick ? "pointer" : "default",
        whiteSpace: "nowrap", verticalAlign: "baseline",
      },
    },
      React.createElement(Icon, { name: "flag", size: 12, style: { opacity: 0.7 } }),
      `\u3014${label}\u3015`
    );
  }

  // ---- Missing-fact slot (HERO) -----------------------------------------
  function MissingFactSlot({ fact, onSupply, onPlaceholder }) {
    const [typing, setTyping] = React.useState(false);
    const [val, setVal] = React.useState("");
    const inputRef = React.useRef(null);
    React.useEffect(() => { if (typing && inputRef.current) inputRef.current.focus(); }, [typing]);

    const commit = () => { if (val.trim()) onSupply(val.trim()); };

    return React.createElement("span", {
      role: "group",
      "aria-label": `Missing fact: ${fact} \u2014 add a value or insert a marked placeholder`,
      style: {
        display: "inline-flex", flexDirection: "column", gap: 8, verticalAlign: "top",
        margin: "4px 2px", padding: "12px 14px", borderRadius: 8,
        background: "var(--sl-color-brand-soft)", border: "1px dashed var(--sl-color-border-strong)",
        maxWidth: 460, whiteSpace: "normal",
      },
    },
      React.createElement("span", {
        style: { font: "400 14.5px/1.5 var(--sl-font-sans)", color: "var(--sl-color-ink)" },
      },
        `I need a real ${fact} to anchor this. Add it, or I'll leave a clearly-marked placeholder.`
      ),
      typing
        ? React.createElement("span", { style: { display: "flex", gap: 8 } },
            React.createElement("input", {
              ref: inputRef, className: "sl-input", value: val,
              onChange: (e) => setVal(e.target.value),
              onKeyDown: (e) => { if (e.key === "Enter") commit(); },
              placeholder: `Type the real ${fact}\u2026`,
              style: { padding: "8px 10px", font: "400 14px var(--sl-font-sans)", flex: 1 },
            }),
            React.createElement("button", { className: "sl-btn sl-btn--primary sl-btn--sm", onClick: commit }, "Add")
          )
        : React.createElement("span", { style: { display: "flex", gap: 16, alignItems: "center" } },
            React.createElement("button", {
              className: "sl-btn sl-btn--ghost sl-btn--sm",
              style: { padding: "6px 12px", fontWeight: 600, color: "var(--sl-color-ink)" },
              onClick: () => setTyping(true),
            }, "Add the real figure"),
            React.createElement("button", {
              className: "sl-btn sl-btn--ghost sl-btn--sm",
              style: { padding: "6px 12px", color: "var(--sl-color-text-muted)" },
              onClick: () => onPlaceholder(fact),
            }, "Use a clearly-marked placeholder")
          )
    );
  }

  // ---- Draft body renderer ---------------------------------------------
  // editable: if true, missing/placeholder become interactive and text is contentEditable
  function Body({ post, editable = false, onChange, large = true }) {
    const baseFont = large
      ? "400 18px/1.6 var(--sl-font-sans)"
      : "400 15px/1.55 var(--sl-font-sans)";

    const resolveSegment = (pi, si, replacement) => {
      const next = post.body.map((p, i) => {
        if (i !== pi) return p;
        const segs = normPara(p).map((s, j) => (j === si ? replacement : s));
        return segs;
      });
      onChange && onChange(next);
    };

    return React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } },
      post.body.map((para, pi) =>
        React.createElement("p", {
          key: pi,
          style: { margin: 0, font: baseFont, color: "var(--sl-color-ink)", textWrap: "pretty" },
        },
          normPara(para).map((seg, si) => {
            if (seg.t === "text") {
              if (editable) {
                return React.createElement("span", {
                  key: si, contentEditable: true, suppressContentEditableWarning: true,
                  spellCheck: false,
                  style: { outline: "none" },
                  onBlur: (e) => {
                    const v = e.target.textContent;
                    if (v !== seg.v) resolveSegment(pi, si, { t: "text", v });
                  },
                }, seg.v);
              }
              return React.createElement("span", { key: si }, seg.v);
            }
            if (seg.t === "missing") {
              if (!editable) {
                // non-editable contexts still show the calm slot (generate output)
                return React.createElement(MissingFactSlot, {
                  key: si, fact: seg.fact,
                  onSupply: (v) => resolveSegment(pi, si, { t: "text", v: ` ${v} ` }),
                  onPlaceholder: (f) => resolveSegment(pi, si, { t: "placeholder", v: f }),
                });
              }
              return React.createElement(MissingFactSlot, {
                key: si, fact: seg.fact,
                onSupply: (v) => resolveSegment(pi, si, { t: "text", v: ` ${v} ` }),
                onPlaceholder: (f) => resolveSegment(pi, si, { t: "placeholder", v: f }),
              });
            }
            if (seg.t === "placeholder") {
              return React.createElement(PlaceholderToken, {
                key: si, label: seg.v,
                onClick: editable ? () => {
                  const real = window.prompt(`Replace placeholder with the real ${seg.v}:`, "");
                  if (real && real.trim()) resolveSegment(pi, si, { t: "text", v: ` ${real.trim()} ` });
                } : null,
              });
            }
            return null;
          })
        )
      )
    );
  }

  window.SWMUI = Object.assign(window.SWMUI || {}, {
    useStore, normPara, placeholderCount, missingCount,
    Avatar, Transparency, ModeChip, PlaceholderToken, MissingFactSlot, Body,
  });
})();
