/* App shell — store, navbar, role switcher, routing, toasts. */
const { USERS: AUSERS, NAV_FOR, NOTES: ANOTES } = window.SWM;
const AUI = window.SWMUI;
const AIcon = window.Icon;
const DS = window.SunlightDesignSystem_2847f8;

const NAV_META = {
  home: { label: "Home", icon: "home" },
  generate: { label: "Generate", icon: "pencil" },
  pipeline: { label: "Pipeline", icon: "layers" },
  dashboard: { label: "Dashboard", icon: "gauge" },
  brain: { label: "Brain", icon: "brain" },
};

function now() {
  const d = new Date();
  return "2026-06-21 " + d.toTimeString().slice(0, 5);
}
const clone = (o) => JSON.parse(JSON.stringify(o));

function App() {
  const [userId, setUserId] = React.useState("guy");
  const [view, setView] = React.useState("home");
  const [params, setParams] = React.useState({});
  const [posts, setPosts] = React.useState(() => clone(window.SWM.POSTS));
  const [toasts, setToasts] = React.useState([]);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);

  const user = AUSERS[userId];
  const role = user.role;
  const mainRef = React.useRef(null);

  const toast = React.useCallback((text) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4200);
  }, []);

  const navigate = React.useCallback((v, p = {}) => {
    setView(v); setParams(p); setMenuOpen(false); setNotifOpen(false);
    if (mainRef.current) mainRef.current.scrollTop = 0;
    window.scrollTo(0, 0);
  }, []);

  const updatePost = React.useCallback((id, patch) => {
    setPosts((ps) => ps.map((p) => p.id === id ? recompute({ ...p, ...patch }) : p));
  }, []);

  function recompute(p) {
    const keys = AUI.keysSatisfied(p);
    const vis = AUI.visualResolved(p);
    if (keys && vis) { p.status = "ready"; p.waitingOn = null; }
    else if (p.intentKey || p.qualityKey || ["approval", "in-editing", "handed-off"].includes(p.status)) {
      if (p.status !== "handed-off" || p.qualityKey || p.intentKey) p.status = "approval";
      p.waitingOn = !p.qualityKey ? "nyx" : (p.contentType === "guy-personal" && !p.intentKey) ? "guy" : null;
    }
    return p;
  }

  const store = {
    user, posts, view, params, navigate, toast, updatePost,
    applyKey: (id, kind) => {
      setPosts((ps) => ps.map((p) => {
        if (p.id !== id) return p;
        const k = { who: user.id, when: now() };
        const np = recompute({ ...p, [kind === "intent" ? "intentKey" : "qualityKey"]: k });
        return np;
      }));
      toast(kind === "intent" ? "Intent key applied — you stand behind this." : "Quality key applied — editorially ready.");
    },
    handOff: (id, note) => {
      setPosts((ps) => ps.map((p) => p.id === id ? {
        ...p, status: "handed-off", waitingOn: "nyx", handoffNote: note || p.handoffNote,
        versions: [{ id: "v" + (p.versions.length + 1), who: user.id, when: now(), note: "Handed off from Generate" }, ...p.versions],
      } : p));
      toast("Handed off to Nyx. It's in her queue now.");
      navigate("home");
    },
    markPosted: (id, url) => {
      setPosts((ps) => ps.map((p) => p.id === id ? {
        ...p, status: "posted", waitingOn: null, posted: { when: "2026-06-21", who: user.id, url: url || "" },
      } : p));
      toast("Recorded as posted. Auto-appended to the brain's library as a new approved example.");
      navigate("pipeline");
    },
    createDraftFromAngle: (angle, mode, secondary, idea) => {
      const id = "p-new-" + Date.now();
      const title = idea.trim().replace(/\s+/g, " ").split(" ").slice(0, 8).join(" ");
      const np = {
        id, title: title.charAt(0).toUpperCase() + title.slice(1), author: user.id,
        contentType: role === "editor" ? "nyx-own" : "guy-personal", mode, vector: angle.vector,
        status: "draft", waitingOn: null, handoffNote: null, deadline: null,
        intentKey: null, qualityKey: null, visualLink: "", noVisual: false,
        body: clone(angle.body), comments: [],
        versions: [{ id: "v1", who: user.id, when: now(), note: "Kept from Generate" }],
      };
      setPosts((ps) => [np, ...ps]);
      navigate("editor", { postId: id, from: "generate" });
      toast("Kept as a private draft. Refine it, then hand off.");
    },
    ping: (p) => toast(`Pinged ${AUI.USERS_NAME(p.waitingOn) || "the owner"} — in-app + email. Calm, not nagging.`),
    bumpDeadline: (p) => {
      setPosts((ps) => ps.map((x) => x.id === p.id ? { ...x, deadline: addDay(x.deadline) } : x));
      toast("Deadline nudged out a day.");
    },
    reassign: (p) => toast("Task reassigned — who does the work, never who holds the key."),
  };

  const navItems = NAV_FOR[role];
  const Screen = { home: window.HomeScreen, generate: window.GenerateScreen, pipeline: window.PipelineScreen,
    dashboard: window.DashboardScreen, brain: window.BrainScreen, editor: window.EditorScreen }[view];

  const myNotes = ANOTES.filter((n) => n.to === user.id);

  return (
    <window.AppCtx.Provider value={store}>
      <div style={{ minHeight: "100vh", background: "var(--sl-color-surface-warm)" }}>
        {/* NAVBAR */}
        <div style={{ position: "sticky", top: 0, zIndex: 40, padding: "16px 24px", background: "linear-gradient(var(--sl-color-surface-warm) 70%, transparent)" }}>
          <nav className="sl-navbar" style={{ maxWidth: 1200, margin: "0 auto", paddingRight: 12 }}>
            <button onClick={() => navigate("home")} style={{ border: "none", background: "none", cursor: "pointer", padding: 0 }}>
              <DS.Logo label="Sunlight Studio" />
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div className="sl-navbar__links" style={{ gap: 4 }}>
                {navItems.map((k) => {
                  const active = view === k || (k === "pipeline" && view === "editor");
                  return (
                    <button key={k} onClick={() => navigate(k)} style={{ border: "none", cursor: "pointer",
                      display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 15px", borderRadius: 9999,
                      font: "500 14.5px var(--sl-font-sans)", color: "var(--sl-color-ink)",
                      background: active ? "var(--sl-color-brand-soft)" : "transparent" }}>
                      <AIcon name={NAV_META[k].icon} size={16} /> {NAV_META[k].label}
                    </button>
                  );
                })}
              </div>
              <div style={{ width: 1, height: 26, background: "var(--sl-color-border)", margin: "0 6px" }} />
              {/* notifications */}
              <div style={{ position: "relative" }}>
                <button onClick={() => { setNotifOpen((o) => !o); setMenuOpen(false); }} style={{ border: "none", background: "none",
                  cursor: "pointer", padding: 9, borderRadius: 9999, position: "relative", color: "var(--sl-color-ink)" }}>
                  <AIcon name="bell" size={19} />
                  {myNotes.length > 0 && <span style={{ position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: 9999, background: "var(--sl-color-brand)" }} />}
                </button>
                {notifOpen && (
                  <div className="sl-card" style={{ position: "absolute", top: "120%", right: 0, width: 320, padding: 12, boxShadow: "var(--sl-shadow-lg)", zIndex: 50 }}>
                    <div style={{ font: "600 12px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.6px", padding: "2px 6px 8px" }}>Notifications</div>
                    {myNotes.length === 0
                      ? <p style={{ font: "400 14px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", padding: "6px" }}>Nothing right now.</p>
                      : myNotes.map((n) => (
                          <div key={n.id} style={{ display: "flex", gap: 10, padding: "9px 6px", alignItems: "flex-start" }}>
                            <AIcon name={n.type === "ping" ? "bell" : n.type === "handoff" ? "send" : "key"} size={16} style={{ color: "var(--sl-color-text-subtle)", marginTop: 2 }} />
                            <div>
                              <p style={{ margin: 0, font: "400 13.5px/1.4 var(--sl-font-sans)", color: "var(--sl-color-text-muted)" }}>{n.text}</p>
                              <span style={{ font: "400 11.5px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>{n.when}</span>
                            </div>
                          </div>
                        ))}
                  </div>
                )}
              </div>
              {/* role switcher */}
              <div style={{ position: "relative" }}>
                <button onClick={() => { setMenuOpen((o) => !o); setNotifOpen(false); }} style={{ border: "none", cursor: "pointer",
                  display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 10px 6px 6px", borderRadius: 9999,
                  background: "var(--sl-color-surface-sand)" }}>
                  <AUI.Avatar id={user.id} size={30} />
                  <span style={{ font: "600 13.5px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>{user.first}</span>
                  <AIcon name="chevDown" size={15} style={{ color: "var(--sl-color-text-subtle)" }} />
                </button>
                {menuOpen && (
                  <div className="sl-card" style={{ position: "absolute", top: "120%", right: 0, width: 280, padding: 8, boxShadow: "var(--sl-shadow-lg)", zIndex: 50 }}>
                    <div style={{ font: "600 11px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.6px", padding: "6px 10px" }}>
                      Viewing as — switch seat
                    </div>
                    {Object.values(AUSERS).map((u) => (
                      <button key={u.id} onClick={() => { setUserId(u.id); navigate("home"); }} style={{ display: "flex", width: "100%",
                        alignItems: "center", gap: 11, border: "none", cursor: "pointer", textAlign: "left", borderRadius: 10, padding: "9px 10px",
                        background: u.id === user.id ? "var(--sl-color-brand-soft)" : "transparent" }}>
                        <AUI.Avatar id={u.id} size={34} />
                        <div style={{ flex: 1 }}>
                          <div style={{ font: "600 14px var(--sl-font-sans)", color: "var(--sl-color-ink)" }}>{u.name}</div>
                          <div style={{ font: "400 12px var(--sl-font-sans)", color: "var(--sl-color-text-subtle)" }}>{u.title}</div>
                        </div>
                        {u.id === user.id && <AIcon name="check" size={16} />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        {/* MAIN */}
        <main ref={mainRef} style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 32px 60px" }}>
          {Screen ? <Screen /> : <div>Not found</div>}
        </main>

        {/* TOASTS */}
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 80,
          display: "flex", flexDirection: "column", gap: 10, alignItems: "center", width: "min(520px, 92vw)" }}>
          {toasts.map((t) => (
            <div key={t.id} className="swm-toast" style={{ background: "var(--sl-color-ink)", color: "#fff", padding: "13px 20px",
              borderRadius: 12, font: "500 14px/1.4 var(--sl-font-sans)", boxShadow: "var(--sl-shadow-lg)", display: "flex",
              alignItems: "center", gap: 10, maxWidth: "100%" }}>
              <AIcon name="check" size={16} style={{ flex: "0 0 auto", color: "var(--sl-color-brand)" }} /> {t.text}
            </div>
          ))}
        </div>
      </div>
    </window.AppCtx.Provider>
  );
}

function addDay(d) {
  if (!d) return d;
  const dt = new Date(d); dt.setDate(dt.getDate() + 1); return dt.toISOString().slice(0, 10);
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
