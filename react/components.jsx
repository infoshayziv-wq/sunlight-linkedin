/* ==========================================================================
   Sunlight Design System — React Component Library
   Stack-neutral styling: components render `sl-` classNames defined in
   components.css. Import the CSS once at your app root:
       import "../tokens.css";
       import "../components.css";
   Then: import { Button, Card, Badge, ... } from "./components.jsx";
   No build-time CSS framework required.
   ========================================================================== */
import React from "react";

const cx = (...c) => c.filter(Boolean).join(" ");

/* Button ----------------------------------------------------------------- */
export function Button({
  variant = "primary", // primary | secondary | outline | ghost
  size = "md",         // sm | md | lg
  pill = false,
  as: Tag = "button",
  className,
  children,
  ...props
}) {
  return (
    <Tag
      className={cx(
        "sl-btn",
        `sl-btn--${variant}`,
        size !== "md" && `sl-btn--${size}`,
        pill && "sl-btn--pill",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

/* Badge ------------------------------------------------------------------ */
export function Badge({ variant = "default", className, children, ...props }) {
  return (
    <span
      className={cx("sl-badge", variant !== "default" && `sl-badge--${variant}`, className)}
      {...props}
    >
      {children}
    </span>
  );
}

/* Card ------------------------------------------------------------------- */
export function Card({ variant, hover = false, className, children, ...props }) {
  return (
    <div
      className={cx("sl-card", variant && `sl-card--${variant}`, hover && "sl-card--hover", className)}
      {...props}
    >
      {children}
    </div>
  );
}
Card.Title = ({ children, className, ...p }) => (
  <h3 className={cx("sl-h3 sl-card__title", className)} {...p}>{children}</h3>
);
Card.Body = ({ children, className, ...p }) => (
  <p className={cx("sl-card__body", className)} {...p}>{children}</p>
);

/* IconChip --------------------------------------------------------------- */
export function IconChip({ brand = false, className, children, ...props }) {
  return (
    <span className={cx("sl-iconchip", brand && "sl-iconchip--brand", className)} {...props}>
      {children}
    </span>
  );
}

/* Input ------------------------------------------------------------------ */
export function Input({ label, hint, id, className, ...props }) {
  const inputId = id || (label ? `sl-${label.replace(/\s+/g, "-").toLowerCase()}` : undefined);
  return (
    <div className="sl-field">
      {label && <label className="sl-label" htmlFor={inputId}>{label}</label>}
      <input id={inputId} className={cx("sl-input", className)} {...props} />
      {hint && <span className="sl-hint">{hint}</span>}
    </div>
  );
}

/* Checklist item --------------------------------------------------------- */
export function Check({ children, className, ...props }) {
  return (
    <div className={cx("sl-check", className)} {...props}>
      <span className="sl-check__mark" aria-hidden>✓</span>
      <span>{children}</span>
    </div>
  );
}

/* Layout ----------------------------------------------------------------- */
export const Container = ({ className, children, ...p }) => (
  <div className={cx("sl-container", className)} {...p}>{children}</div>
);
export const Section = ({ variant, className, children, ...p }) => (
  <section className={cx("sl-section", variant && `sl-section--${variant}`, className)} {...p}>
    {children}
  </section>
);

/* Eyebrow + headings ----------------------------------------------------- */
export const Eyebrow = ({ children, className, ...p }) => (
  <Badge className={cx("sl-eyebrow", className)} {...p}>{children}</Badge>
);
export const H1 = ({ children, className, ...p }) => <h1 className={cx("sl-h1", className)} {...p}>{children}</h1>;
export const H2 = ({ children, className, ...p }) => <h2 className={cx("sl-h2", className)} {...p}>{children}</h2>;
export const Lead = ({ children, className, ...p }) => <p className={cx("sl-lead", className)} {...p}>{children}</p>;

/* Brand mark — the official Sunlight petal logo.
   `color` defaults to the brand plum (#540F28); pass any CSS color (e.g. "#fff"
   on dark backgrounds) and the SVG recolors via currentColor. */
export function LogoMark({ size = 28, color = "var(--sl-color-plum, #540F28)", className, ...props }) {
  return (
    <svg width={size} height={size * (42 / 46)} viewBox="0 0 46 42" fill="none"
         style={{ color }} className={className} aria-hidden {...props}>
      <path d="M13.9707 0V20.9558C6.2431 20.9044 0.000148773 16.2336 0.000148773 10.4781C0.000148773 4.72264 6.2431 0.0514331 13.9707 0Z" fill="currentColor"/>
      <path d="M31.2676 0V20.9558C23.54 20.9044 17.297 16.2336 17.297 10.4781C17.297 4.72264 23.54 0.0514331 31.2676 0Z" fill="currentColor"/>
      <path d="M31.2671 20.9558V41.9116C38.9947 41.8602 45.2376 37.1894 45.2376 31.4339C45.2376 25.6784 38.9947 21.0072 31.2671 20.9558Z" fill="currentColor"/>
      <path d="M13.9702 20.9558V41.9116C21.6978 41.8602 27.9408 37.1894 27.9408 31.4339C27.9408 25.6784 21.6978 21.0072 13.9702 20.9558Z" fill="currentColor"/>
    </svg>
  );
}

/* Brand lockup — mark + wordmark. */
export function Logo({ label = "Sunlight", color = "var(--sl-color-plum, #540F28)", markSize = 26, className, ...props }) {
  return (
    <span className={cx("sl-logo", className)} style={{ color }} {...props}>
      <LogoMark size={markSize} color="currentColor" />
      <span style={{ color: "currentColor", fontWeight: 600 }}>{label}</span>
    </span>
  );
}

/* Navbar (floating pill) ------------------------------------------------- */
export function Navbar({ links = [], cta = "Contact Sales", onCta, className }) {
  return (
    <nav className={cx("sl-navbar", className)}>
      <Logo />
      <div className="sl-navbar__links">
        {links.map((l) => (
          <a key={l.label} href={l.href || "#"} className="sl-navbar__link">{l.label}</a>
        ))}
        <Button pill onClick={onCta}>{cta}</Button>
      </div>
    </nav>
  );
}

export default {
  Button, Badge, Card, IconChip, Input, Check,
  Container, Section, Eyebrow, H1, H2, Lead, Logo, LogoMark, Navbar,
};
