# Improvement Notes — R0607.com

A review of `index.html`, `style.css`, and `script.js`.

---

## index.html

### SEO & Discoverability
- **Missing `<meta name="description">`** — Search engines show a blank snippet. Add a short description (e.g. `"R0607.com — coming soon"`).
- **Missing Open Graph / Twitter Card tags** — Without `og:title`, `og:description`, `og:image`, etc., link previews on social platforms show nothing useful.
- **Missing favicon** — No `<link rel="icon">` is present; browsers will request `/favicon.ico` anyway and log a 404.
- **Missing canonical tag** — `<link rel="canonical" href="https://r0607.com/">` prevents duplicate-content issues if the page is ever reachable via multiple URLs (www vs non-www, HTTP vs HTTPS).

### Accessibility
- **`aria-live="polite"` on `.scene`** — The scene only contains the `aria-hidden` cube, so this attribute does nothing useful here. Remove it.
- **`aria-live` placement** — The live region is on the `<h2>` wrapper but only the inner `<span id="status-text">` changes. Screen readers may not always announce partial child updates. Move `aria-live="polite"` (and `aria-atomic="true"`) directly onto `#status-text`.

### No `<noscript>` fallback
- When JavaScript is disabled the status text is permanently empty. A `<noscript>` block with a static message (e.g. `Coming soon`) keeps the page meaningful.

---

## style.css

### Dead Code
- **Commented-out rule** — `/* text-transform: lowercase; */` inside `.face span` serves no purpose. Remove it to keep the stylesheet clean.

### Fonts
- **Generic `Arial, Helvetica, sans-serif`** — For a techy aesthetic, a more fitting system font stack would be `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`, or a monospaced/geometric option that matches the terminal feel of the rest of the page.

### Performance & Rendering
- **Missing `will-change: transform` on `.cube`** — Adding this hint lets the browser promote the element to its own compositor layer before the animation begins, reducing jank on low-end devices.
- **Complex layered backgrounds on `body`** — Four background layers including multiple gradients are re-painted on every repaint. Moving the decorative grid to a separate `::before` pseudo-element with `position: fixed` and `will-change: transform` isolates the paint cost.

### Animation
- **`cube-spin` only rotates on Z** — The `rotateX` and `rotateY` values stay constant throughout the animation, so it feels like a flat spin rather than true 3D tumbling. A more dynamic keyframe sequence (e.g. shifting X or Y mid-animation) would make better use of the 3D scene.
- **`prefers-reduced-motion` resets `animation-iteration-count: 1`** — This will still run the animation once (a flash). Setting `animation: none !important` outright is safer and matches user expectations.

### Minor
- **`backface-visibility: visible`** on `.face` — Explicitly set to `visible`, which means the backs of faces are rendered even when facing away. This is likely intentional for the full-glow aesthetic, but consider `hidden` if you ever notice z-fighting or rendering artefacts.
- **Duplicate `min-height`** on `.landing` — `min-height: 100vh` followed immediately by `min-height: 100dvh` is a valid progressive-enhancement pattern, but a comment explaining the intentional fallback would help future maintainers.

---

## script.js

### Bug / Typo
- **`"Initialiazing OS ..."`** — Typo. Should be `"Initializing OS ..."`.

### Consistency Between CSS and JS
- **Cube size mismatch** — The CSS variable defaults to `70vmin`, but `setCubeSize()` computes `Math.min(width, height) * 0.5` (50%). On page load before JS runs, the cube is 70 vmin; after JS runs it snaps to 50%. Align both to the same value, or remove the CSS fallback and rely solely on JS (with a sensible hard-coded pixel fallback for no-JS).

### Robustness
- **No null-guard on `#status-text`** — If the element is ever missing, the typer will throw immediately. A guard (`if (!statusText) return;`) avoids a silent crash.
- **`typeTimer` / `nextMessageTimer` initialised to `0`** — `clearTimeout(0)` is harmless but semantically misleading. Prefer `null` as the "no pending timer" sentinel.
- **Recursive `setTimeout` chain for typing** — For very long messages this builds a chain of closures. A simple `setInterval` or `requestAnimationFrame`-based loop would be cleaner and easier to cancel.

### Code Clarity
- **Magic numbers** — `typeSpeed = 70` and `messageInterval = 5000` are unexplained. Add short comments (e.g. `// ms per character`, `// ms between messages`).
- **`statusIndex` initialised to `statusMessages.length - 1`** — This is a clever trick so `showNextStatusMessage` wraps to index 0 on first call, but it is non-obvious. A comment or restructuring to start at `-1` (with a guard) would make the intent clearer.
- **No cleanup on page unload** — `window.removeEventListener` for the resize handlers isn't needed on a single-page site, but if the JS is ever modularised or tested in a framework, the lack of teardown will cause leaks.

---

## Summary Table

| Area | Issue | Priority |
|---|---|---|
| `script.js` | Typo: "Initialiazing" | High |
| `index.html` | Missing meta description | High |
| `index.html` | Missing favicon | High |
| `script.js` | Cube size CSS/JS mismatch | Medium |
| `index.html` | Misplaced `aria-live` | Medium |
| `index.html` | No `<noscript>` fallback | Medium |
| `style.css` | Dead commented-out rule | Low |
| `style.css` | `will-change: transform` missing on `.cube` | Low |
| `style.css` | `prefers-reduced-motion` still runs once | Low |
| `index.html` | Missing OG / Twitter Card tags | Low |
| `script.js` | Magic numbers lack comments | Low |
| `script.js` | Confusing `statusIndex` initialisation | Low |
