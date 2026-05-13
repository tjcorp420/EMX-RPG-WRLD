EMX Soul Arena v13 — Button Hotfix Update

What changed:
- Added tap-safe fallback handlers for core game buttons.
- Added cache-busted script/style links so Safari and Home Screen refresh the new build.
- Removed hard lock from Power Loadouts so battle powers do not feel broken.
- Added a small v13 Tap Fix card on the start screen.
- Added boot-screen fallback removal in case mobile Safari pauses the loading animation.
- Added pointer-event safety so hidden overlays do not block taps.

Install:
Open this folder, copy everything inside it into your GitHub repo root, replace old files, commit, push, and wait for Vercel redeploy.

Repo root should contain index.html, style.css, script.js, manifest.webmanifest, multiplayer files, firebase files, and assets/.
