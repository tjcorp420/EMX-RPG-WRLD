/* EMX Soul Arena v21 — Brand Lock
   Source-level branding stabilizer. This does NOT change gameplay. It only
   stops older expansion modules from rewriting visible version labels. */
(function () {
  "use strict";

  const TITLE = "EMX Soul Arena";
  const SUBTITLE = "Battle, explore, collect gear, play mini-games, and challenge friends.";

  const sectionNames = new Map([
    ["collection update", "Collection Locker"],
    ["campaign update", "Campaign World"],
    ["v19 home + fun update", "Fun Center"],
    ["v19 home + fun", "EMX Soul Arena"],
    ["v20 header sync", "EMX Soul Arena"],
    ["v21 brand lock", "EMX Soul Arena"],
    ["v5 cinematic", "Cinematic Combat"],
    ["v7 campaign", "Campaign World"]
  ]);

  const exactText = new Map([
    ["v19: home button, clearer instructions, upgraded 3d-style fight animations, boss coaching, and new interactive mini-games.", SUBTITLE.toLowerCase()],
    ["v19 home + fun: home button, clear instructions, better fight animations, boss coaching, and mini-games.", SUBTITLE.toLowerCase()],
    ["v20: synced header, home button, fun lab, mini-games, campaign world, multiplayer, and upgraded fight effects.", SUBTITLE.toLowerCase()],
    ["story world update: tap emx city buildings, climb neon tower, bond with pets, build loadouts, collect stickers, clear weekly events, and follow clear goals.", SUBTITLE.toLowerCase()]
  ]);

  function cleanText(text) {
    return String(text || "").trim().replace(/\s+/g, " ");
  }

  function setText(el, text) {
    if (el && cleanText(el.textContent) !== text) el.textContent = text;
  }

  function syncBranding() {
    document.title = TITLE;
    const apple = document.querySelector('meta[name="apple-mobile-web-app-title"]');
    if (apple) apple.setAttribute("content", TITLE);

    document.querySelectorAll(".version-chip").forEach((el) => setText(el, TITLE));
    document.querySelectorAll(".brand-title-card .subtitle").forEach((el) => setText(el, SUBTITLE));

    document.querySelectorAll(".eyebrow,.v7-panel-title,.v19-card .eyebrow,.v15-restore-card .eyebrow,.v19-pill,.brand-title-card span").forEach((el) => {
      const raw = cleanText(el.textContent);
      const key = raw.toLowerCase();
      if (sectionNames.has(key)) setText(el, sectionNames.get(key));
      if (exactText.has(key)) setText(el, SUBTITLE);
      if (/^v\d+\s/i.test(raw) && /home|header|update|button|fun/i.test(raw)) setText(el, TITLE);
    });

    // Make old version badges read like features instead of software versions.
    document.querySelectorAll(".brand-title-card span,.version-pill,.update-pill,.v5-cine-chip,.v7-chip").forEach((el) => {
      const raw = cleanText(el.textContent).toUpperCase();
      if (raw === "V5 CINEMATIC") setText(el, "CINEMATIC");
      if (raw === "V7 CAMPAIGN") setText(el, "CAMPAIGN");
      if (raw === "V19" || raw === "V20" || raw === "V21") setText(el, "LIVE");
    });
  }

  function boot() {
    syncBranding();
    [50, 150, 400, 900, 1600, 2600].forEach((t) => setTimeout(syncBranding, t));

    const obs = new MutationObserver(() => {
      clearTimeout(boot._t);
      boot._t = setTimeout(syncBranding, 25);
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });

    document.addEventListener("click", () => setTimeout(syncBranding, 30), true);
    document.addEventListener("touchend", () => setTimeout(syncBranding, 30), true);
    document.addEventListener("visibilitychange", syncBranding);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
