/* Sunlight — monochrome line icons (Lucide-style). window.Icon */
(function () {
  const P = {
    home:        ["M3 10.5 12 3l9 7.5", "M5 9.5V21h14V9.5"],
    pencil:      ["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"],
    layers:      ["M12 3 2 8l10 5 10-5-10-5Z", "M2 16l10 5 10-5", "M2 12l10 5 10-5"],
    gauge:       ["M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z", "M12 14l3-3", "M4 18a9 9 0 1 1 16 0"],
    brain:       ["M9 4a3 3 0 0 0-3 3 3 3 0 0 0-1 5 3 3 0 0 0 1 5 3 3 0 0 0 3 3 V4Z", "M15 4a3 3 0 0 1 3 3 3 3 0 0 1 1 5 3 3 0 0 1-1 5 3 3 0 0 1-3 3 V4Z"],
    plus:        ["M12 5v14", "M5 12h14"],
    arrowRight:  ["M5 12h14", "M13 6l6 6-6 6"],
    arrowLeft:   ["M19 12H5", "M11 6l-6 6 6 6"],
    check:       ["M20 6 9 17l-5-5"],
    key:         ["M15.5 7.5a4 4 0 1 0-4.9 3.9L4 18v3h3l.6-2h2l.4-2 2-.5a4 4 0 0 0 3.5-9Z", "M16.5 7.5h.01"],
    keyOutline:  ["M15.5 7.5a4 4 0 1 0-4.9 3.9L4 18v3h3l.6-2h2l.4-2 2-.5a4 4 0 0 0 3.5-9Z"],
    flag:        ["M4 22V4", "M4 4h11l-1.5 4L15 12H4"],
    comment:     ["M21 11.5a8 8 0 0 1-11.7 7L4 20l1.5-5.3A8 8 0 1 1 21 11.5Z"],
    link:        ["M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1", "M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"],
    linkOff:     ["M9 17H7A5 5 0 0 1 7 7h2", "M15 7h2a5 5 0 0 1 4 8", "M3 3l18 18"],
    image:       ["M3 5h18v14H3z", "M3 15l5-5 4 4 3-3 6 6", "M8.5 9.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"],
    clock:       ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 7v5l3 2"],
    bell:        ["M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"],
    user:        ["M20 21a8 8 0 1 0-16 0", "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],
    users:       ["M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M22 21v-2a4 4 0 0 0-3-3.9", "M16 3.1a4 4 0 0 1 0 7.8"],
    send:        ["M22 2 11 13", "M22 2l-7 20-4-9-9-4 20-7Z"],
    calendar:    ["M3 5h18v16H3z", "M3 9h18", "M8 3v4", "M16 3v4"],
    shuffle:     ["M16 3h5v5", "M4 20 21 3", "M21 16v5h-5", "M15 15l6 6", "M4 4l5 5"],
    paperclip:   ["M21 11.5 12 20a5 5 0 0 1-7-7l9-9a3.5 3.5 0 0 1 5 5l-9 9a2 2 0 0 1-3-3l8-8"],
    sparkle:     ["M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"],
    history:     ["M3 12a9 9 0 1 0 3-6.7L3 8", "M3 4v4h4", "M12 8v4l3 2"],
    chevDown:    ["M6 9l6 6 6-6"],
    chevRight:   ["M9 6l6 6-6 6"],
    x:           ["M18 6 6 18", "M6 6l12 12"],
    edit3:       ["M12 20h9", "M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"],
    lock:        ["M5 11h14v10H5z", "M8 11V7a4 4 0 0 1 8 0v4"],
    eye:         ["M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z", "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"],
    rotate:      ["M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.7 3L3 8", "M3 4v4h4"],
    trash:       ["M3 6h18", "M8 6V4h8v2", "M6 6l1 14h10l1-14"],
    dot:         ["M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"],
    mail:        ["M3 5h18v14H3z", "M3 6l9 7 9-7"],
    file:        ["M14 3H6v18h12V8l-4-5Z", "M14 3v5h4"],
    target:      ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z", "M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z", "M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"],
    bookmark:    ["M6 3h12v18l-6-4-6 4V3Z"],
  };

  function Icon({ name, size = 18, stroke = 2, className, style, ...rest }) {
    const d = P[name];
    if (!d) return null;
    return React.createElement(
      "svg",
      {
        width: size, height: size, viewBox: "0 0 24 24", fill: "none",
        stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round",
        strokeLinejoin: "round", className, style, "aria-hidden": "true", ...rest,
      },
      d.map((p, i) => React.createElement("path", { key: i, d: p }))
    );
  }
  window.Icon = Icon;
})();
