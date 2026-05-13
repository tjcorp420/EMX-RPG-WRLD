/* EMX Soul Arena v21 — Stable Brand Lock
   This removes version-label fighting from older update modules. */
(function () {
  "use strict";

  const BRAND_TITLE = "EMX Soul Arena";
  const BRAND_COPY = "Campaign zones, EMX City, pets, gear, arcade games, multiplayer, and cinematic combat.";
  const CHIP_TEXT = "Live Build";

  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));

  function safeText(el, text) {
    if (el && el.textContent.trim() !== text) el.textContent = text;
  }

  function removeOldBadges() {
    qa(".v5-cine-chip,.v7-chip,.v7-pill,.version-pill,.update-pill").forEach((el) => {
      const text = (el.textContent || "").toLowerCase();
      if (
        text.includes("v5") || text.includes("v7") || text.includes("v11") ||
        text.includes("v12") || text.includes("v13") || text.includes("v18") ||
        text.includes("v19") || text.includes("v20") || text.includes("cinematic") ||
        text.includes("campaign world")
      ) {
        el.remove();
      }
    });
  }

  function renameOldSectionLabels() {
    qa(".eyebrow,.v7-panel-title,.v12-panel-head .eyebrow").forEach((el) => {
      const t = (el.textContent || "").trim().toLowerCase();
      if (t === "collection update") safeText(el, "Collection Locker");
      if (t === "campaign update") safeText(el, "Campaign World");
      if (t.includes("v11")) safeText(el, "Guide + Adventure");
      if (t.includes("v12")) safeText(el, "Story World");
      if (t.includes("v19")) safeText(el, "Fun Lab");
      if (t.includes("v20")) safeText(el, "Live Build");
    });
  }

  function lockBrand() {
    document.title = BRAND_TITLE;

    const metaTitle = q('meta[name="apple-mobile-web-app-title"]');
    if (metaTitle) metaTitle.setAttribute("content", BRAND_TITLE);

    const subtitle = q(".brand-title-card .subtitle");
    safeText(subtitle, BRAND_COPY);

    qa(".version-chip").forEach((chip) => safeText(chip, CHIP_TEXT));

    removeOldBadges();
    renameOldSectionLabels();

    const brandCard = q(".brand-title-card");
    if (brandCard) brandCard.classList.add("v21-brand-locked");
  }

  function boot() {
    lockBrand();
    [80, 250, 700, 1500, 3000].forEach((ms) => setTimeout(lockBrand, ms));
    setInterval(lockBrand, 500);

    const obs = new MutationObserver(() => {
      clearTimeout(boot._t);
      boot._t = setTimeout(lockBrand, 20);
    });
    obs.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
