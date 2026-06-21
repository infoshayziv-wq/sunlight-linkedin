/* @ds-bundle: {"format":3,"namespace":"SunlightDesignSystem_2847f8","components":[{"name":"Button","sourcePath":"components/actions/Button.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"LogoMark","sourcePath":"components/brand/LogoMark.jsx"},{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"IconChip","sourcePath":"components/display/IconChip.jsx"},{"name":"Check","sourcePath":"components/forms/Check.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Navbar","sourcePath":"components/navigation/Navbar.jsx"}],"sourceHashes":{"components/actions/Button.jsx":"47cb662570e6","components/brand/Logo.jsx":"3f9248ae0f32","components/brand/LogoMark.jsx":"dbfa64778abd","components/display/Badge.jsx":"374b1ede4027","components/display/Card.jsx":"24759f0a3533","components/display/IconChip.jsx":"6cc7d5e2a301","components/forms/Check.jsx":"5d54c7380278","components/forms/Input.jsx":"66b82cfb9bce","components/navigation/Navbar.jsx":"1352358eda63","ui_kits/marketing-site/sections.jsx":"f57c2520a9fc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.SunlightDesignSystem_2847f8 = window.SunlightDesignSystem_2847f8 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/actions/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...c) => c.filter(Boolean).join(" ");

/**
 * Button — Sunlight's action element. Yellow primary is the signature CTA;
 * pill shape is used in nav, rounded (default) for in-page actions.
 */
function Button({
  variant = "primary",
  // primary | secondary | outline | ghost
  size = "md",
  // sm | md | lg
  pill = false,
  block = false,
  as: Tag = "button",
  className,
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: cx("sl-btn", `sl-btn--${variant}`, size !== "md" && `sl-btn--${size}`, pill && "sl-btn--pill", block && "sl-btn--block", className)
  }, props), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/actions/Button.jsx", error: String((e && e.message) || e) }); }

// components/brand/LogoMark.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * LogoMark — the official Sunlight petal mark (four petals forming an "S").
 * Uses currentColor, so it recolors via the `color` prop or inherited color.
 * Brand plum (#540F28) by default; pass "#fff" on dark surfaces.
 */
function LogoMark({
  size = 28,
  color = "var(--sl-color-plum, #540F28)",
  className,
  style,
  ...props
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size * (42 / 46),
    viewBox: "0 0 46 42",
    fill: "none",
    role: "img",
    "aria-label": "Sunlight",
    className: className,
    style: {
      color,
      display: "block",
      ...style
    }
  }, props), /*#__PURE__*/React.createElement("path", {
    d: "M13.9707 0V20.9558C6.2431 20.9044 0.000148773 16.2336 0.000148773 10.4781C0.000148773 4.72264 6.2431 0.0514331 13.9707 0Z",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M31.2676 0V20.9558C23.54 20.9044 17.297 16.2336 17.297 10.4781C17.297 4.72264 23.54 0.0514331 31.2676 0Z",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M31.2671 20.9558V41.9116C38.9947 41.8602 45.2376 37.1894 45.2376 31.4339C45.2376 25.6784 38.9947 21.0072 31.2671 20.9558Z",
    fill: "currentColor"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M13.9702 20.9558V41.9116C21.6978 41.8602 27.9408 37.1894 27.9408 31.4339C27.9408 25.6784 21.6978 21.0072 13.9702 20.9558Z",
    fill: "currentColor"
  }));
}
Object.assign(__ds_scope, { LogoMark });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/LogoMark.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Logo — the Sunlight lockup: petal mark + "Sunlight" wordmark.
 * Both recolor together via the `color` prop (plum on light, white on dark).
 */
function Logo({
  label = "Sunlight",
  color = "var(--sl-color-plum, #540F28)",
  markSize = 26,
  className,
  style,
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["sl-logo", className].filter(Boolean).join(" "),
    style: {
      color,
      ...style
    }
  }, props), /*#__PURE__*/React.createElement(__ds_scope.LogoMark, {
    size: markSize,
    color: "currentColor"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "currentColor",
      fontWeight: 600,
      letterSpacing: "-0.2px"
    }
  }, label));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/display/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...c) => c.filter(Boolean).join(" ");

/**
 * Badge — pill label used as section eyebrows ("Our Products") and status
 * chips. Variants tint the pill; default is warm sand.
 */
function Badge({
  variant = "default",
  className,
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cx("sl-badge", variant !== "default" && `sl-badge--${variant}`, className)
  }, props), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...c) => c.filter(Boolean).join(" ");

/**
 * Card — surface container. Default is white with a hairline border + soft
 * shadow; `sand` and `dark` are the alternate feature-card treatments.
 * Compose with Card.Title and Card.Body, or pass arbitrary children.
 */
function Card({
  variant,
  hover = false,
  className,
  children,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cx("sl-card", variant && `sl-card--${variant}`, hover && "sl-card--hover", className)
  }, props), children);
}
Card.Title = function CardTitle({
  children,
  className,
  ...p
}) {
  return /*#__PURE__*/React.createElement("h3", _extends({
    className: cx("sl-card__title", className)
  }, p), children);
};
Card.Body = function CardBody({
  children,
  className,
  ...p
}) {
  return /*#__PURE__*/React.createElement("p", _extends({
    className: cx("sl-card__body", className)
  }, p), children);
};
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/IconChip.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...c) => c.filter(Boolean).join(" ");

/**
 * IconChip — a 44px rounded tile that holds an icon at the top of feature
 * cards. Neutral sand by default; `brand` (yellow) or `dark` (ink) accents.
 */
function IconChip({
  variant,
  brand = false,
  className,
  children,
  ...props
}) {
  const v = brand ? "brand" : variant;
  return /*#__PURE__*/React.createElement("span", _extends({
    className: cx("sl-iconchip", v && `sl-iconchip--${v}`, className)
  }, props), children);
}
Object.assign(__ds_scope, { IconChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/IconChip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Check.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...c) => c.filter(Boolean).join(" ");

/**
 * Check — a feature-list row with a circular checkmark, mirroring the
 * site's benefit lists. Default mark is ink; `brand` makes it yellow.
 */
function Check({
  brand = false,
  children,
  className,
  ...props
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    className: cx("sl-check", brand && "sl-check--brand", className)
  }, props), /*#__PURE__*/React.createElement("span", {
    className: "sl-check__mark",
    "aria-hidden": true
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, children));
}
Object.assign(__ds_scope, { Check });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Check.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const cx = (...c) => c.filter(Boolean).join(" ");

/**
 * Input — labeled text field with optional hint. Yellow focus ring matches
 * the brand. Pair these in the "Contact Sales" / lead-capture forms.
 */
function Input({
  label,
  hint,
  id,
  className,
  ...props
}) {
  const inputId = id || (label ? `sl-${String(label).replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return /*#__PURE__*/React.createElement("div", {
    className: "sl-field"
  }, label && /*#__PURE__*/React.createElement("label", {
    className: "sl-label",
    htmlFor: inputId
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    className: cx("sl-input", className)
  }, props)), hint && /*#__PURE__*/React.createElement("span", {
    className: "sl-hint"
  }, hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Navbar.jsx
try { (() => {
/**
 * Navbar — Sunlight's signature floating pill header: logo on the left,
 * links + a pill CTA on the right, on a white rounded bar with a soft shadow.
 */
function Navbar({
  links = [],
  cta = "Contact Sales",
  onCta,
  className
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: ["sl-navbar", className].filter(Boolean).join(" ")
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, null), /*#__PURE__*/React.createElement("div", {
    className: "sl-navbar__links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l.label,
    href: l.href || "#",
    className: "sl-navbar__link"
  }, l.label)), cta && /*#__PURE__*/React.createElement(__ds_scope.Button, {
    pill: true,
    onClick: onCta
  }, cta)));
}
Object.assign(__ds_scope, { Navbar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Navbar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/marketing-site/sections.jsx
try { (() => {
/* ==========================================================================
   Sunlight Marketing Site — UI kit sections
   High-fidelity recreation of the sunlightapi.com landing surface, composed
   from the Sunlight component library (window.SunlightDesignSystem_2847f8).
   Exports section components to window for index.html to mount.
   ========================================================================== */
const {
  Navbar,
  Button,
  Badge,
  Card,
  IconChip,
  Check,
  Logo,
  LogoMark
} = window.SunlightDesignSystem_2847f8;
const Icon = ({
  name,
  size = 20,
  color,
  stroke = 2
}) => /*#__PURE__*/React.createElement("i", {
  "data-lucide": name,
  style: {
    width: size,
    height: size,
    color,
    strokeWidth: stroke
  }
});

/* --- Hero --------------------------------------------------------------- */
function Hero({
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--sl-color-surface-sand)",
      paddingBottom: 96,
      position: "relative",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement(Navbar, {
    links: [{
      label: "Products"
    }, {
      label: "Developers ↗"
    }, {
      label: "Company"
    }],
    cta: "Contact Sales",
    onCta: onContact
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1.05fr 0.95fr",
      gap: 56,
      alignItems: "center",
      paddingTop: 72
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Badge, {
    variant: "soft",
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sparkles",
    size: 15
  }), " Agentic Portal Payments"), /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 60,
      fontWeight: 500,
      letterSpacing: "-1.5px",
      lineHeight: 1.02,
      margin: 0,
      color: "var(--sl-color-ink)"
    }
  }, "More card revenue.", /*#__PURE__*/React.createElement("br", null), "Less manual work."), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 20,
      lineHeight: 1.5,
      color: "var(--sl-color-text-muted)",
      margin: "22px 0 0",
      maxWidth: 480
    }
  }, "Sunlight is the infrastructure to grow your card revenue \u2014 agents that execute card payments across any supplier portal, with zero onboarding."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14,
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onContact
  }, "Get Started Now"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline"
  }, "Read the docs")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 26,
      marginTop: 34,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement(Check, null, "No supplier onboarding"), /*#__PURE__*/React.createElement(Check, null, "Full audit & compliance"))), /*#__PURE__*/React.createElement(HeroVisual, null))));
}

/* Product visual — a faux "payment run" card built from real UI, not a screenshot */
function HeroVisual() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    style: {
      padding: 0,
      overflow: "hidden",
      boxShadow: "var(--sl-shadow-lg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "16px 20px",
      borderBottom: "1px solid var(--sl-color-border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 9,
      fontWeight: 600,
      fontSize: 15
    }
  }, /*#__PURE__*/React.createElement(LogoMark, {
    size: 18
  }), " Payment Run"), /*#__PURE__*/React.createElement(Badge, {
    variant: "success"
  }, "\u25CF Executing")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 20,
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, [["Acme Manufacturing", "INV-20481", "$48,250.00", "globe"], ["Northwind Supply Co.", "INV-20482", "$12,900.00", "globe"], ["Birchwood Logistics", "INV-20483", "$7,418.50", "check-check"]].map(([name, inv, amt, ic], i) => /*#__PURE__*/React.createElement("div", {
    key: inv,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "12px 14px",
      borderRadius: "var(--sl-radius-lg)",
      background: "var(--sl-color-surface-sand)"
    }
  }, /*#__PURE__*/React.createElement(IconChip, {
    variant: i === 2 ? "brand" : "dark",
    style: {
      width: 38,
      height: 38
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, name), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--sl-font-mono)",
      fontSize: 12,
      color: "var(--sl-color-text-subtle)"
    }
  }, inv, " \xB7 card-eligible")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--sl-font-mono)",
      fontWeight: 600,
      fontSize: 14,
      fontVariantNumeric: "tabular-nums"
    }
  }, amt)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "14px 20px",
      borderTop: "1px solid var(--sl-color-border)",
      background: "var(--sl-color-bg)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: "var(--sl-color-text-subtle)"
    }
  }, "Interchange captured"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--sl-font-mono)",
      fontWeight: 600,
      fontVariantNumeric: "tabular-nums"
    }
  }, "+$1,032.40"))), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      bottom: -22,
      left: -22,
      background: "var(--sl-color-brand)",
      borderRadius: "var(--sl-radius-xl)",
      padding: "12px 18px",
      boxShadow: "var(--sl-shadow-brand)",
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trending-up",
    size: 20,
    color: "var(--sl-color-ink)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: 14
    }
  }, "96% card acceptance")));
}

/* --- Trust bar ---------------------------------------------------------- */
function TrustBar() {
  const names = ["Ramp", "Brex", "Bill", "AvidXchange", "Coupa", "Tipalti"];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--sl-color-bg)",
      padding: "40px 0",
      borderBottom: "1px solid var(--sl-color-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      textAlign: "center",
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      color: "var(--sl-color-text-subtle)",
      margin: "0 0 22px"
    }
  }, "Powering card programs at modern finance platforms"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 52,
      flexWrap: "wrap",
      opacity: 0.75
    }
  }, names.map(n => /*#__PURE__*/React.createElement("span", {
    key: n,
    style: {
      fontSize: 22,
      fontWeight: 700,
      letterSpacing: "-0.5px",
      color: "var(--sl-color-text-muted)"
    }
  }, n)))));
}

/* --- Why Sunlight (feature grid) ---------------------------------------- */
function WhySunlight() {
  const features = [["bot", "dark", "AI-driven automation", "Agents execute card payments across any supplier portal, at scale — no scripts to maintain."], ["zap", "brand", "Zero supplier onboarding", "No change to how buyers or suppliers operate. Nothing to install on either side."], ["globe", "dark", "Universal portal integration", "Connect to any payment portal with a full audit trail and compliance baked in."], ["shield-check", "dark", "Compliant by default", "SOC 2 controls, scoped credentials, and a complete record of every transaction."], ["wallet", "brand", "Maximize share of wallet", "Route more spend to card and unlock card-eligible invoices you were leaving behind."], ["line-chart", "dark", "Grow interchange revenue", "Turn AP automation into a new revenue line for your platform."]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--sl-color-bg)",
      padding: "96px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640,
      marginBottom: 48
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    style: {
      marginBottom: 16
    }
  }, "Why Sunlight"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 36,
      fontWeight: 600,
      letterSpacing: "-0.9px",
      lineHeight: 1.1,
      margin: 0
    }
  }, "The missing link in modern finance operations"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 20,
      color: "var(--sl-color-text-muted)",
      lineHeight: 1.5,
      margin: "16px 0 0"
    }
  }, "One API to move B2B spend onto cards \u2014 without asking buyers or suppliers to change a thing.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 18
    }
  }, features.map(([ic, v, title, body]) => /*#__PURE__*/React.createElement(Card, {
    key: title,
    hover: true
  }, /*#__PURE__*/React.createElement(IconChip, {
    variant: v,
    style: {
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: ic,
    size: 20,
    color: v === "dark" ? "#fff" : undefined
  })), /*#__PURE__*/React.createElement(Card.Title, null, title), /*#__PURE__*/React.createElement(Card.Body, null, body))))));
}

/* --- How it works ------------------------------------------------------- */
function HowItWorks() {
  const steps = [["Connect", "Drop in one API key. Sunlight maps to your existing AP and card-issuing stack."], ["Identify", "We surface card-eligible invoices across every supplier portal automatically."], ["Execute", "Agents run the payment in-portal and capture the interchange — fully audited."]];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--sl-color-surface-sand)",
      padding: "96px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      maxWidth: 600,
      margin: "0 auto 52px"
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    variant: "soft",
    style: {
      marginBottom: 16
    }
  }, "How it works"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 36,
      fontWeight: 600,
      letterSpacing: "-0.9px",
      margin: 0
    }
  }, "Live in days, not quarters")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 18
    }
  }, steps.map(([title, body], i) => /*#__PURE__*/React.createElement("div", {
    key: title,
    style: {
      background: "var(--sl-color-bg)",
      borderRadius: "var(--sl-radius-2xl)",
      padding: 28,
      border: "1px solid var(--sl-color-border)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--sl-font-mono)",
      fontSize: 13,
      fontWeight: 600,
      color: "var(--sl-color-text-subtle)"
    }
  }, "0", i + 1), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      fontWeight: 600,
      margin: "10px 0 8px"
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--sl-color-text-muted)",
      lineHeight: 1.5,
      margin: 0
    }
  }, body))))));
}

/* --- CTA band ----------------------------------------------------------- */
function CtaBand({
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: "var(--sl-color-bg)",
      padding: "96px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: "0 auto",
      padding: "0 24px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "var(--sl-color-surface-dark)",
      borderRadius: "var(--sl-radius-3xl)",
      padding: "64px 56px",
      display: "grid",
      gridTemplateColumns: "1.2fr 1fr",
      gap: 48,
      alignItems: "center"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 40,
      fontWeight: 600,
      letterSpacing: "-1px",
      color: "#fff",
      margin: 0,
      lineHeight: 1.08
    }
  }, "Turn AP into a revenue stream"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 19,
      color: "var(--sl-color-text-on-dark)",
      lineHeight: 1.5,
      margin: "16px 0 28px",
      maxWidth: 420
    }
  }, "Talk to our team about bringing agentic card payments to your platform."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    onClick: onContact
  }, "Contact Sales"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "ghost",
    style: {
      color: "#fff"
    }
  }, "Read the docs"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Check, {
    brand: true,
    style: {
      color: "var(--sl-color-text-on-dark)"
    }
  }, "Unlock card-eligible invoices at scale"), /*#__PURE__*/React.createElement(Check, {
    brand: true,
    style: {
      color: "var(--sl-color-text-on-dark)"
    }
  }, "Automate B2B card payments end-to-end"), /*#__PURE__*/React.createElement(Check, {
    brand: true,
    style: {
      color: "var(--sl-color-text-on-dark)"
    }
  }, "Maximize share of wallet"), /*#__PURE__*/React.createElement(Check, {
    brand: true,
    style: {
      color: "var(--sl-color-text-on-dark)"
    }
  }, "Grow interchange revenue")))));
}

/* --- Footer ------------------------------------------------------------- */
function SiteFooter() {
  const cols = [["Products", ["Agentic Payments", "Universal Card-on-File", "Reconciliation", "Pricing"]], ["Developers", ["Documentation", "API Reference", "Status", "Changelog"]], ["Company", ["About", "Careers", "Blog", "Contact"]]];
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: "var(--sl-color-surface-dark)",
      color: "var(--sl-color-text-on-dark)",
      padding: "56px 0 36px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: "0 auto",
      padding: "0 24px",
      display: "grid",
      gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
      gap: 40
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    color: "#fff"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      lineHeight: 1.5,
      color: "var(--sl-color-text-on-dark)",
      margin: "16px 0 0",
      maxWidth: 240,
      opacity: 0.85
    }
  }, "The infrastructure to grow your card revenue.")), cols.map(([head, items]) => /*#__PURE__*/React.createElement("div", {
    key: head
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: "0.04em",
      textTransform: "uppercase",
      color: "#fff",
      marginBottom: 14
    }
  }, head), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    href: "#",
    style: {
      color: "var(--sl-color-text-on-dark)",
      textDecoration: "none",
      fontSize: 14,
      opacity: 0.85
    }
  }, it)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 1180,
      margin: "40px auto 0",
      padding: "20px 24px 0",
      borderTop: "1px solid rgba(255,255,255,0.12)",
      display: "flex",
      justifyContent: "space-between",
      fontSize: 13,
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 Sunlight, Inc."), /*#__PURE__*/React.createElement("span", null, "Privacy \xB7 Terms \xB7 Security")));
}

/* --- Contact modal ------------------------------------------------------ */
function ContactModal({
  open,
  onClose
}) {
  const {
    Input
  } = window.SunlightDesignSystem_2847f8;
  const [sent, setSent] = React.useState(false);
  React.useEffect(() => {
    if (open) setSent(false);
  }, [open]);
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(12,10,8,0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 50,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: "#fff",
      borderRadius: "var(--sl-radius-2xl)",
      padding: 32,
      width: 420,
      maxWidth: "100%",
      boxShadow: "var(--sl-shadow-lg)"
    }
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: "center",
      padding: "24px 0"
    }
  }, /*#__PURE__*/React.createElement(IconChip, {
    brand: true,
    style: {
      margin: "0 auto 16px"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 20
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 24,
      fontWeight: 600,
      margin: "0 0 8px"
    }
  }, "Thanks \u2014 we'll be in touch"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--sl-color-text-muted)",
      margin: "0 0 24px"
    }
  }, "Our team typically replies within one business day."), /*#__PURE__*/React.createElement(Button, {
    block: true,
    onClick: onClose
  }, "Done")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 24,
      fontWeight: 600,
      margin: 0
    }
  }, "Contact Sales"), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      border: 0,
      background: "transparent",
      cursor: "pointer",
      color: "var(--sl-color-text-subtle)",
      padding: 4
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      color: "var(--sl-color-text-muted)",
      margin: "0 0 22px",
      fontSize: 15
    }
  }, "Tell us about your card program and we'll show you the numbers."), /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Work email",
    type: "email",
    required: true,
    placeholder: "you@company.com"
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Company",
    required: true,
    placeholder: "Acme Inc."
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    block: true,
    size: "lg",
    style: {
      marginTop: 4
    }
  }, "Request a demo")))));
}
Object.assign(window, {
  Hero,
  TrustBar,
  WhySunlight,
  HowItWorks,
  CtaBand,
  SiteFooter,
  ContactModal
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/marketing-site/sections.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.LogoMark = __ds_scope.LogoMark;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.IconChip = __ds_scope.IconChip;

__ds_ns.Check = __ds_scope.Check;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Navbar = __ds_scope.Navbar;

})();
