EMX Soul Arena v16 — Scroll-Safe Tap Fix

What changed:
- Restores the branded loading screen instead of removing it immediately.
- Fixes the v15 issue where pointerdown routing could fire while scrolling.
- Buttons are still recovered through tapfix.js, but only after a real tap/click.
- Adds scroll-click suppression so swiping up/down does not open tabs you pass over.
- Keeps sounds/SFX available but prevents scroll gestures from triggering random click sounds.

Install:
1. Copy everything inside emx_soul_arena_v16 to your GitHub repo root.
2. Commit and push.
3. Wait for Vercel to redeploy.
4. Hard refresh Safari, then test the Vercel link.
5. If the Home Screen app still acts old, delete and re-add the Home Screen shortcut.

Repo root should include:
index.html
style.css
script.js
tapfix.js
manifest.webmanifest
multiplayer.html
multiplayer.css
multiplayer.js
firebase-config.js
firebase-rules.json
assets/
