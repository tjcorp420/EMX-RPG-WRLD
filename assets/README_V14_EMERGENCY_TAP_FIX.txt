EMX Soul Arena v14 — Emergency Tap Fix

This update is focused on the frozen-main-screen issue.

What changed:
- Adds a separate tapfix.js file that loads after the main game script.
- If the big script gets stuck, tapfix.js still runs.
- Removes/neutralizes hidden overlays that can block iPhone/Home Screen taps.
- Forces class buttons, battle power buttons, shop buttons, continue, save, restart, and EMX City buttons to respond through pointerup/touchend/click.
- Adds a v14 repair card on the start screen with safe buttons.
- Adds cache-busted style/script/tapfix links using ?v=14.

Install:
1. Open emx_soul_arena_v14.
2. Copy everything inside into your repo root.
3. Make sure tapfix.js is beside index.html.
4. Commit and push to GitHub.
5. Wait for Vercel to redeploy.
6. Open Safari first, then re-add to Home Screen if needed.

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
