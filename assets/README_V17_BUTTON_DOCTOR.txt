EMX Soul Arena v17 - Button Doctor

Fixes:
- Restores reliable buttons using pointerup/touchend, not pointerdown.
- Buttons only fire on real taps, not swipes/scrolling.
- Stops tap SFX from playing while scrolling.
- Restores loading screen behavior.
- Keeps all v12-v16 game systems.

Install:
Copy all files inside emx_soul_arena_v17 into your repo root.
Your repo root should include index.html, style.css, script.js, tapfix.js, manifest.webmanifest, multiplayer files, Firebase files, and assets/.
Commit, push, wait for Vercel redeploy.

Important:
After deploying, open the Safari URL with ?v=17 once, like:
https://your-app.vercel.app/?v=17
If the Home Screen app still acts old, delete the old Home Screen shortcut and add it again.
