EMX Soul Arena v22 — UI Stability + Tab Control

Install:
1. Copy everything inside emx_soul_arena_v22_ui_stability into your repo root.
2. Commit and push to GitHub.
3. Wait for Vercel to redeploy.
4. Test with your-live-link/?v=22

Main fix:
- Open tabs now lock the background page.
- Tabs/modals scroll inside themselves.
- Invisible/hidden overlays are prevented from catching taps.
- A transparent tap shield blocks background buttons while an overlay is open.
- Button Test Center and Refresh App Cache are added on the main screen.

Test flow:
1. Open the live Vercel app with ?v=22.
2. Tap Button Test.
3. Scroll inside the test panel.
4. Confirm the page behind it does not move and no background buttons open.
5. Tap Test A/B/C to verify real taps still work.
