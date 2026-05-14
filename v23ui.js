/* EMX Soul Arena v23 — UI Rescue + Safe Tab Lock
   This replaces the v22 approach with a light screen manager:
   - no global click/tap blocking
   - no invisible tap shields
   - background locks only while a visible tab/modal is open
   - buttons keep their normal handlers */
(function () {
  "use strict";
  if (window.__EMX_V23_UI_RESCUE__) return;
  window.__EMX_V23_UI_RESCUE__ = true;

  const d = document;
  const root = d.documentElement;
  const $ = (id) => d.getElementById(id);
  const qsa = (sel) => Array.from(d.querySelectorAll(sel));

  const OPEN_SELECTOR = [
    ".overlay:not(.hidden)",
    ".v8-overlay:not(.hidden)",
    ".v9-overlay:not(.hidden)",
    ".v10-overlay:not(.hidden)",
    ".v11-overlay.open",
    ".v12-overlay.show",
    ".v12-choice-room.show",
    ".v19-overlay.show",
    "#v15SafePanel.show",
    "#v23Overlay.show"
  ].join(",");

  const HIDDEN_SELECTOR = [
    ".overlay.hidden",
    ".v8-overlay.hidden",
    ".v9-overlay.hidden",
    ".v10-overlay.hidden",
    ".v11-overlay:not(.open)",
    ".v12-overlay:not(.show)",
    ".v12-choice-room:not(.show)",
    ".v19-overlay.hidden",
    "#v15SafePanel:not(.show)",
    "#v23Overlay:not(.show)"
  ].join(",");

  let locked = false;
  let lockY = 0;
  let lastOpenKey = "";
  let tapCount = 0;

  function isVisible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 3 && r.height > 3;
  }

  function getOpenOverlays() {
    return qsa(OPEN_SELECTOR).filter((el) => el.id !== "bootScreen" && isVisible(el));
  }

  function lockScroll() {
    if (locked) return;
    locked = true;
    lockY = window.scrollY || window.pageYOffset || 0;
    root.classList.add("v23-scroll-locked");
    d.body.classList.add("v23-scroll-locked");
    d.body.style.top = `-${lockY}px`;
  }

  function unlockScroll() {
    if (!locked) return;
    locked = false;
    root.classList.remove("v23-scroll-locked");
    d.body.classList.remove("v23-scroll-locked");
    d.body.style.top = "";
    const y = lockY;
    lockY = 0;
    requestAnimationFrame(() => window.scrollTo(0, y));
  }

  function syncUi() {
    // Remove old v22 shields if they still exist from cached files or leftover DOM.
    qsa(".v22-scroll-shield").forEach((el) => {
      try { el.remove(); } catch (_) { el.style.display = "none"; el.style.pointerEvents = "none"; }
    });

    // Keep hidden overlays from blocking buttons.
    qsa(HIDDEN_SELECTOR).forEach((el) => {
      if (el.id === "bootScreen") return;
      el.style.pointerEvents = "none";
    });

    const open = getOpenOverlays();
    open.forEach((el) => {
      el.style.pointerEvents = "auto";
      if (getComputedStyle(el).position === "static") el.style.position = "fixed";
    });

    const key = open.map((el) => el.id || el.className || el.tagName).join("|") || "none";
    if (key === lastOpenKey) return;
    lastOpenKey = key;
    if (open.length) lockScroll();
    else unlockScroll();
  }

  function ensureOverlay() {
    let overlay = $("v23Overlay");
    if (!overlay) {
      overlay = d.createElement("section");
      overlay.id = "v23Overlay";
      overlay.innerHTML = `<div class="v23-modal" id="v23Modal"></div>`;
      d.body.appendChild(overlay);
    }
    return overlay;
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  }

  function openPanel(title, subtitle, body) {
    const overlay = ensureOverlay();
    const modal = $("v23Modal");
    modal.innerHTML = `
      <div class="v23-top">
        <div>
          <p class="eyebrow">UI Rescue</p>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <button type="button" class="v23-close" data-v23-action="close">✕</button>
      </div>
      ${body}`;
    overlay.classList.add("show");
    overlay.style.display = "grid";
    overlay.style.pointerEvents = "auto";
    setTimeout(syncUi, 0);
  }

  function closePanel() {
    const overlay = $("v23Overlay");
    if (overlay) {
      overlay.classList.remove("show");
      overlay.style.display = "none";
      overlay.style.pointerEvents = "none";
    }
    setTimeout(syncUi, 0);
  }

  function toast(message) {
    try { if (window.EMXV12?.toast) return window.EMXV12.toast(message); } catch (_) {}
    let box = $("v23Toast");
    if (!box) {
      box = d.createElement("div");
      box.id = "v23Toast";
      box.className = "v19-toast";
      d.body.appendChild(box);
    }
    box.textContent = message;
    box.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => box.classList.remove("show"), 1300);
  }

  function closeAllTabs() {
    qsa(".overlay").forEach((el) => el.classList.add("hidden"));
    qsa(".v8-overlay,.v9-overlay,.v10-overlay").forEach((el) => el.classList.add("hidden"));
    qsa(".v11-overlay").forEach((el) => el.classList.remove("open"));
    qsa(".v12-overlay,.v12-choice-room,.v19-overlay,#v15SafePanel,#v23Overlay").forEach((el) => {
      el.classList.remove("show");
      if (el.classList.contains("v19-overlay") || el.id === "v15SafePanel" || el.id === "v23Overlay") {
        el.classList.add("hidden");
        el.style.display = "none";
      }
      el.style.pointerEvents = "none";
    });
    setTimeout(syncUi, 0);
    toast("All tabs closed.");
  }

  function refreshCache() {
    const url = new URL(location.href);
    url.searchParams.set("v", "23");
    url.searchParams.set("fresh", Date.now().toString(36));
    location.href = url.toString();
  }

  function openButtonTest() {
    tapCount = 0;
    openPanel("Button Test Center", "This version does not hijack taps. Scroll inside the box, then tap the test buttons.", `
      <div class="v23-info-list">
        <div class="v23-info"><strong>Scroll test</strong><small>Swipe up and down inside this box. The main screen behind it should stay still.</small></div>
        <div class="v23-scroll-demo">
          ${Array.from({ length: 14 }, (_, i) => `<div class="v23-info"><strong>Scroll row ${i + 1}</strong><p>Scroll here. No random tab should open and no background button should activate.</p></div>`).join("")}
        </div>
        <div class="v23-info"><strong>Tap test</strong><small>These should count only when you actually tap.</small></div>
        <div class="v23-grid">
          <button type="button" class="primary-v23" data-v23-action="testTap">Tap Test A</button>
          <button type="button" data-v23-action="testTap">Tap Test B</button>
          <button type="button" data-v23-action="testTap">Tap Test C</button>
        </div>
        <div id="v23TestLog" class="v23-test-log">Tap count: 0</div>
      </div>`);
  }

  function openHelp() {
    openPanel("Tab + Button Rules", "How the app should behave after v23.", `
      <div class="v23-info-list">
        <div class="v23-info"><strong>Buttons</strong><p>Buttons use their normal click handlers again. No invisible layer should steal taps.</p></div>
        <div class="v23-info"><strong>Tabs</strong><p>When a tab is open, the background locks. Scroll inside the tab only.</p></div>
        <div class="v23-info"><strong>If stuck</strong><p>Tap Close All Tabs, then Refresh App Cache. Test in Safari with <b>?v=23</b>.</p></div>
      </div>`);
  }

  function installStartCard() {
    const start = $("startScreen");
    if (!start || $("v23RescueCard")) return;
    const card = d.createElement("section");
    card.id = "v23RescueCard";
    card.className = "v23-rescue-card";
    card.innerHTML = `
      <p class="eyebrow">v23 UI Rescue</p>
      <h2>Buttons restored + safe tabs</h2>
      <p>This update removes the v22 tap shield. Buttons should open normally, while tabs still lock the background.</p>
      <div class="v23-grid">
        <button type="button" class="primary-v23" data-v23-action="buttonTest">Button Test</button>
        <button type="button" data-v23-action="help">Tab Rules</button>
        <button type="button" data-v23-action="closeAll">Close All Tabs</button>
        <button type="button" data-v23-action="refresh">Refresh Cache</button>
      </div>`;
    const after = $("continueBtn") || start.querySelector(".brand-title-card");
    if (after?.parentNode) after.parentNode.insertBefore(card, after.nextSibling);
    else start.prepend(card);
  }

  function route(action, target) {
    if (action === "close") closePanel();
    else if (action === "buttonTest") openButtonTest();
    else if (action === "help") openHelp();
    else if (action === "closeAll") closeAllTabs();
    else if (action === "refresh") refreshCache();
    else if (action === "testTap") {
      tapCount += 1;
      const log = $("v23TestLog");
      if (log) log.textContent = `Tap count: ${tapCount} — ${target?.textContent?.trim() || "button"}`;
      toast("Real tap counted.");
    }
    else return false;
    return true;
  }

  function installEvents() {
    d.addEventListener("click", (event) => {
      const el = event.target.closest?.("[data-v23-action]");
      if (!el) return;
      const action = el.dataset.v23Action;
      if (route(action, el)) {
        event.preventDefault();
        // Stop only v23 buttons. Do not block the rest of the game.
        event.stopPropagation();
      }
    }, false);

    window.addEventListener("resize", () => setTimeout(syncUi, 0));
    window.addEventListener("orientationchange", () => setTimeout(syncUi, 100));
  }

  function boot() {
    installStartCard();
    ensureOverlay();
    syncUi();
    installEvents();
    const obs = new MutationObserver(() => {
      installStartCard();
      clearTimeout(boot.timer);
      boot.timer = setTimeout(syncUi, 30);
    });
    obs.observe(d.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    setInterval(syncUi, 900);
    setTimeout(() => toast("v23 UI rescue loaded"), 1100);
  }

  window.EMXV23UI = { syncUi, closeAllTabs, openButtonTest, openHelp, refreshCache };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
