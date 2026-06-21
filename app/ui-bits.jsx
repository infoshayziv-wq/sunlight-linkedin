/* Sunlight Writing Machine — status, keys, dialogs, thinking state (JSX).
   Merges into window.SWMUI. */
const { USERS: SWM_USERS, MODES: SWM_MODES } = window.SWM;
const SWMIcon = window.Icon;
const { Avatar: SWMAvatar, placeholderCount: SWMphc } = window.SWMUI;

// ---- Section label (eyebrow) -------------------------------------------
function SectionLabel({ children, icon }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, font: "600 12px/1 var(--sl-font-sans)",
      letterSpacing: "0.8px", textTransform: "uppercase", color: "var(--sl-color-text-subtle)" }}>
      {icon && <SWMIcon name={icon} size={14} />}
      {children}
    </div>
  );
}

// ---- Key indicator ------------------------------------------------------
function KeyPill({ kind, who, applied, actionable, onApply }) {
  const label = kind === "intent" ? "Intent" : "Quality";
  const person = kind === "intent" ? "Guy" : "Nyx";
  if (applied) {
    return (
      <span className="sl-badge sl-badge--success" title={`${label} key · ${USERS_NAME(who.who)} · ${who.when}`}
        style={{ gap: 6, padding: "7px 13px", font: "600 13px var(--sl-font-sans)" }}>
        <SWMIcon name="check" size={14} /> {label} · {person}
      </span>
    );
  }
  if (actionable) {
    return (
      <button onClick={onApply} className="sl-badge"
        style={{ cursor: "pointer", padding: "7px 14px", font: "600 13px var(--sl-font-sans)",
          background: "var(--sl-color-ink)", color: "#fff", border: "1px solid var(--sl-color-ink)" }}>
        <SWMIcon name="key" size={14} /> Apply your {label.toLowerCase()} key
      </button>
    );
  }
  return (
    <span className="sl-badge sl-badge--outline" style={{ padding: "7px 13px", font: "500 13px var(--sl-font-sans)",
      color: "var(--sl-color-text-subtle)", borderStyle: "dashed" }}>
      <SWMIcon name="keyOutline" size={14} /> Awaiting {person}'s {label.toLowerCase()} key
    </span>
  );
}
function USERS_NAME(id) { return (SWM_USERS[id] || {}).name || id; }

function KeyIndicator({ post, role, onApplyKey }) {
  const twoKey = post.contentType === "guy-personal";
  const canIntent = role === "generator"; // Guy
  const canQuality = role === "editor";   // Nyx
  const pills = [];
  if (twoKey) {
    pills.push(
      <KeyPill key="i" kind="intent" who={post.intentKey} applied={!!post.intentKey}
        actionable={canIntent && !post.intentKey} onApply={() => onApplyKey("intent")} />
    );
  }
  pills.push(
    <KeyPill key="q" kind="quality" who={post.qualityKey} applied={!!post.qualityKey}
      actionable={canQuality && !post.qualityKey} onApply={() => onApplyKey("quality")} />
  );
  return <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{pills}</div>;
}

// ---- Readiness / status helpers ----------------------------------------
function keysSatisfied(post) {
  if (post.contentType === "guy-personal") return !!post.intentKey && !!post.qualityKey;
  return !!post.qualityKey;
}
function visualResolved(post) { return post.noVisual || !!post.visualLink; }
function isReady(post) { return keysSatisfied(post) && visualResolved(post); }
function missingKeyText(post) {
  if (post.contentType === "guy-personal") {
    if (!post.intentKey && !post.qualityKey) return "Awaiting both keys";
    if (!post.intentKey) return "Awaiting Guy's intent key";
    if (!post.qualityKey) return "Awaiting editor's quality key";
  } else if (!post.qualityKey) return "Awaiting editor's quality key";
  if (!visualResolved(post)) return "Awaiting visual";
  return "Both keys in — ready to go live";
}

// ---- Status icon row ----------------------------------------------------
function StatusRow({ post, size = 15 }) {
  const ph = SWMphc(post);
  const comments = (post.comments || []).filter((c) => !c.resolved).length;
  const twoKey = post.contentType === "guy-personal";
  const keysIn = (post.intentKey ? 1 : 0) + (post.qualityKey ? 1 : 0);
  const keysTotal = twoKey ? 2 : 1;
  const item = (icon, text, color, aria) => (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, color: color || "var(--sl-color-text-subtle)",
      font: "500 12.5px/1 var(--sl-font-sans)" }} aria-label={aria || text} title={aria || text}>
      <SWMIcon name={icon} size={size} /> {text}
    </span>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
      {item("key", `${keysIn}/${keysTotal} keys`, keysIn === keysTotal ? "var(--sl-color-success)" : null,
        `${keysIn} of ${keysTotal} keys in`)}
      {visualResolved(post)
        ? item("link", post.noVisual ? "No visual needed" : "Visual linked", null,
            post.noVisual ? "No visual needed" : "Visual reference linked")
        : item("linkOff", "Visual pending", null, "Visual not yet resolved")}
      {comments > 0 && item("comment", String(comments), null, `${comments} open comments`)}
      {ph > 0 && item("flag", String(ph), "var(--sl-color-ink)", `${ph} unresolved placeholder${ph > 1 ? "s" : ""}`)}
    </div>
  );
}

// ---- Thinking state -----------------------------------------------------
const THINK_LINES = [
  "Composing in Guy's voice…",
  "Finding the tension first…",
  "Three angles, same idea…",
  "Checking every fact against the brain…",
];
function ThinkingState() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % THINK_LINES.length), 1400);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 22, padding: "80px 24px", textAlign: "center" }} aria-live="polite">
      <span className="swm-breathe" style={{ width: 56, height: 56, borderRadius: 9999,
        background: "var(--sl-color-brand)", boxShadow: "0 8px 24px rgba(255,213,3,0.35)" }} />
      <div style={{ font: "500 20px/1.4 var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>
        {THINK_LINES[i]}
      </div>
      <div style={{ font: "400 14px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>
        This usually takes about half a minute.
      </div>
    </div>
  );
}

// ---- Dialog (one level) -------------------------------------------------
function Dialog({ open, onClose, title, children, width = 540, footer }) {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div onMouseDown={onClose} style={{ position: "fixed", inset: 0, zIndex: 60,
      background: "rgba(12,10,8,0.32)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div onMouseDown={(e) => e.stopPropagation()} className="sl-card" style={{ width, maxWidth: "100%",
        maxHeight: "86vh", display: "flex", flexDirection: "column", boxShadow: "var(--sl-shadow-lg)", padding: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px", borderBottom: "1px solid var(--sl-color-border)" }}>
          <h3 style={{ margin: 0, font: "600 18px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>{title}</h3>
          <button onClick={onClose} className="sl-btn sl-btn--ghost sl-btn--sm" style={{ padding: 6 }} aria-label="Close">
            <SWMIcon name="x" size={18} />
          </button>
        </div>
        <div style={{ padding: 22, overflow: "auto" }}>{children}</div>
        {footer && <div style={{ padding: "14px 22px", borderTop: "1px solid var(--sl-color-border)",
          display: "flex", justifyContent: "flex-end", gap: 10 }}>{footer}</div>}
      </div>
    </div>
  );
}

// ---- Soft confirm button -----------------------------------------------
function ConfirmButton({ children, onConfirm, danger, className, style, confirmLabel = "Confirm" }) {
  const [armed, setArmed] = React.useState(false);
  React.useEffect(() => {
    if (!armed) return;
    const t = setTimeout(() => setArmed(false), 3000);
    return () => clearTimeout(t);
  }, [armed]);
  if (armed) {
    return (
      <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
        <span style={{ font: "400 13px var(--sl-font-sans)", color: danger ? "var(--sl-color-danger)" : "var(--sl-color-text-muted)" }}>Sure?</span>
        <button className={"sl-btn sl-btn--sm " + (danger ? "" : "sl-btn--primary")} style={danger ? { background: "var(--sl-color-danger)", color: "#fff" } : {}}
          onClick={() => { setArmed(false); onConfirm(); }}>{confirmLabel}</button>
        <button className="sl-btn sl-btn--ghost sl-btn--sm" onClick={() => setArmed(false)}>Cancel</button>
      </span>
    );
  }
  return <button className={className} style={style} onClick={() => setArmed(true)}>{children}</button>;
}

// ---- Empty state --------------------------------------------------------
function EmptyState({ icon = "check", title, body, action }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      gap: 12, padding: "56px 24px", textAlign: "center" }}>
      <span style={{ width: 52, height: 52, borderRadius: 9999, background: "var(--sl-color-surface-sand)",
        display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--sl-color-text-subtle)" }}>
        <SWMIcon name={icon} size={24} />
      </span>
      <div style={{ font: "500 18px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>{title}</div>
      {body && <div style={{ font: "400 15px/1.5 var(--sl-font-sans)", color: "var(--sl-color-text-muted)", maxWidth: 380 }}>{body}</div>}
      {action}
    </div>
  );
}

Object.assign(window.SWMUI, {
  SectionLabel, KeyIndicator, KeyPill, StatusRow, ThinkingState, Dialog, ConfirmButton, EmptyState,
  keysSatisfied, visualResolved, isReady, missingKeyText, USERS_NAME,
});
