# ZYTHERAVEX

An infinite, client-side identity archive. Plain HTML, CSS and JavaScript; deploys to GitHub Pages as-is (push the four files, enable Pages on the branch root).

## How it works
- **Identifiers** are decimal strings and BigInt values. They are never converted to Number, so any length stays exact.
- **Deterministic profiles**: every attribute is derived from a hash of the identifier string (`h32` + seeded PRNG). The same number always gives the same identity, with no stored data and no generation of preceding identities.
- **Classes**: each block of six consecutive identifiers contains each of the six classes once, in a seeded order. This lets a class filter jump straight to its k-th member by arithmetic, so filtered feeds are endless too. Each class therefore has an equal share of the universe, which is intentional.
- **Endless feed**: virtualized rows (only visible rows plus an adaptive buffer exist in the DOM). A generation controller extends the virtual height three viewports ahead on scroll, from an IntersectionObserver sentinel, and from a 1.2 s watchdog, and re-checks after each render. A failed render is caught, rows are rebuilt, and scroll position is untouched. To keep document height bounded, the feed silently rebases its anchor index without moving anything on screen.
- **Search**: a number opens its identity directly. A name search scans 40,000 identities at a time (button to continue); it is bounded by design and says so.
- **Chamber**: `#/id/<number>` URLs, previous and next computed directly, Back returns to the same feed position, copy number and link.
- **Portraits** are locally generated SVG illustrations, not photographs. Optional external portrait URLs are not implemented, so no network is needed.

## Validation status
Syntax was checked with `node --check`. The checklist in the brief has **not** been run in a browser (long scroll runs, memory profiling, mobile devices, rapid-scroll blank-area checks). Test these before relying on it. Known limits: name search is not exhaustive, and feed position is not persisted across reloads.
