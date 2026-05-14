/* EMX Soul Arena v22 — UI Stability + Tab Control
   Keeps tabs/modals scrollable while the game behind them is locked. */
(function () {
  "use strict";
  if (window.__EMX_V22_UI_STABILITY__) return;
  window.__EMX_V22_UI_STABILITY__ = true;

  const d = document;
  const root = d.documentElement;
  const $ = (id) => d.getElementById(id);
  const qsa = (sel) => Array.from(d.querySelectorAll(sel));

  const OPEN_OVERLAY_SELECTOR = [
    ".overlay:not(.hidden)",
    ".v8-overlay:not(.hidden)",
    ".v9-overlay:not(.hidden)",
    ".v10-overlay:not(.hidden)",
    ".v11-overlay.open",
    ".v12-overlay.show",
    ".v12-choice-room.show",
    ".v19-overlay.show",
    "#v15SafePanel.show",
    "#v22Overlay.show"
  ].join(",");

  const HIDDEN_OVERLAY_SELECTOR = [
    ".overlay.hidden",
    ".v8-overlay.hidden",
    ".v9-overlay.hidden",
    ".v10-overlay.hidden",
    ".v11-overlay:not(.open)",
    ".v12-overlay:not(.show)",
    ".v12-choice-room:not(.show)",
    ".v19-overlay.hidden",
    "#v15SafePanel:not(.show)",
    "#v22Overlay:not(.show)"
  ].join(",");

  const SCROLLABLE_SELECTOR = [
    ".modal",
    ".v8-modal",
    ".v9-modal",
    ".v10-modal",
    ".v11-modal",
    ".v12-modal",
    ".v12-choice-card-wrap",
    ".v19-modal",
    ".v15-safe-modal",
    ".v22-modal",
    ".v22-scroll-demo",
    "[data-v22-scroll]"
  ].join(",");

  let locked = false;
  let lockY = 0;
  let activeOverlay = null;
  let lastState = "";
  let testHits = 0;

  function visible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden" || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  }

  function zIndex(el) {
    const z = Number.parseInt(getComputedStyle(el).zIndex, 10);
    return Number.isFinite(z) ? z : 0;
  }

  function openOverlays() {
    return qsa(OPEN_OVERLAY_SELECTOR).filter((el) => el.id !== "bootScreen" && visible(el));
  }

  function topOverlay(list = openOverlays()) {
    return list.sort((a, b) => zIndex(b) - zIndex(a))[0] || null;
  }

  function addShield(overlay) {
    if (!overlay || overlay.querySelector(":scope > .v22-scroll-shield")) return;
    const shield = d.createElement("button");
    shield.type = "button";
    shield.className = "v22-scroll-shield";
    shield.setAttribute("aria-hidden", "true");
    shield.tabIndex = -1;
    shield.dataset.v22Shield = "true";
    shield.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
    }, true);
    overlay.insertBefore(shield, overlay.firstChild);
  }

  function removeShields() {
    qsa(`${HIDDEN_OVERLAY_SELECTOR} > .v22-scroll-shield`).forEach((el) => el.remove());
  }

  function ensureOverlayLayers(list) {
    qsa(HIDDEN_OVERLAY_SELECTOR).forEach((el) => {
      if (el.id === "bootScreen") return;
      el.style.pointerEvents = "none";
    });
    list.forEach((el) => {
      el.style.pointerEvents = "auto";
      if (getComputedStyle(el).position === "static") el.style.position = "fixed";
      addShield(el);
    });
    removeShields();
  }

  function lockScroll() {
    if (locked) return;
    lockY = window.scrollY || window.pageYOffset || 0;
    locked = true;
    root.classList.add("v22-scroll-locked");
    d.body.classList.add("v22-scroll-locked", "v22-modal-open");
    d.body.style.top = `-${lockY}px`;
  }

  function unlockScroll() {
    if (!locked) return;
    locked = false;
    root.classList.remove("v22-scroll-locked");
    d.body.classList.remove("v22-scroll-locked", "v22-modal-open");
    d.body.style.top = "";
    const y = lockY;
    lockY = 0;
    requestAnimationFrame(() => window.scrollTo(0, y));
  }

  function syncLock() {
    const list = openOverlays();
    const top = topOverlay(list);
    ensureOverlayLayers(list);

    qsa("[data-v22-active-overlay]").forEach((el) => el.removeAttribute("data-v22-active-overlay"));
    if (top) top.setAttribute("data-v22-active-overlay", "true");
    activeOverlay = top;

    const state = top ? top.id || top.className : "none";
    if (state === lastState) return;
    lastState = state;

    if (top) lockScroll();
    else unlockScroll();
  }

  function isInsideActiveOverlay(target) {
    if (!activeOverlay || !target) return false;
    return activeOverlay === target || activeOverlay.contains(target);
  }

  function isInScrollable(target) {
    return Boolean(target?.closest?.(SCROLLABLE_SELECTOR));
  }

  function guardTouchMove(event) {
    if (!activeOverlay) return;
    if (!isInsideActiveOverlay(event.target)) {
      event.preventDefault();
      return;
    }
    if (!isInScrollable(event.target)) {
      event.preventDefault();
    }
  }

  function guardBackgroundEvents(event) {
    if (!activeOverlay) return;
    if (!isInsideActiveOverlay(event.target)) {
      event.preventDefault?.();
      event.stopPropagation?.();
      event.stopImmediatePropagation?.();
    }
  }

  function ensureOverlay() {
    let overlay = $("v22Overlay");
    if (!overlay) {
      overlay = d.createElement("section");
      overlay.id = "v22Overlay";
      overlay.className = "v22-overlay";
      overlay.innerHTML = `<div class="v22-modal" id="v22Modal"></div>`;
      d.body.appendChild(overlay);
    }
    return overlay;
  }

  function openV22(title, subtitle, bodyHtml) {
    const overlay = ensureOverlay();
    const modal = $("v22Modal");
    modal.innerHTML = `
      <div class="v22-top">
        <div>
          <p class="eyebrow">UI Stability</p>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <button class="v22-close" data-v22-action="close">✕</button>
      </div>
      ${bodyHtml}`;
    overlay.classList.add("show");
    syncLock();
  }

  function closeV22() {
    const overlay = $("v22Overlay");
    if (overlay) overlay.classList.remove("show");
    syncLock();
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  }

  function toast(message) {
    try { if (window.EMXV12?.toast) return window.EMXV12.toast(message); } catch (e) {}
    let box = $("v22Toast");
    if (!box) {
      box = d.createElement("div");
      box.id = "v22Toast";
      box.className = "v19-toast";
      d.body.appendChild(box);
    }
    box.textContent = message;
    box.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => box.classList.remove("show"), 1400);
  }

  function closeAllTabs() {
    qsa(".overlay").forEach((el) => el.classList.add("hidden"));
    qsa(".v8-overlay,.v9-overlay,.v10-overlay").forEach((el) => el.classList.add("hidden"));
    qsa(".v11-overlay").forEach((el) => el.classList.remove("open"));
    qsa(".v12-overlay,.v12-choice-room,.v19-overlay,#v15SafePanel,#v22Overlay").forEach((el) => {
      el.classList.remove("show");
      if (el.classList.contains("v19-overlay") || el.id === "v15SafePanel") {
        el.classList.add("hidden");
        el.style.display = "none";
      }
    });
    syncLock();
    toast("All tabs closed.");
  }

  function refreshCache() {
    const url = new URL(location.href);
    url.searchParams.set("v", "22");
    url.searchParams.set("fresh", Date.now().toString(36));
    location.href = url.toString();
  }

  function openButtonTest() {
    testHits = 0;
    openV22("Button Test Center", "Use this screen after every update. It confirms tabs scroll correctly and buttons only fire when tapped.", `
      <div class="v22-info-list">
        <div class="v22-info"><strong>Test 1: Scroll box</strong><small>Swipe this box up and down. It should scroll inside the tab without moving the page behind it.</small></div>
        <div class="v22-scroll-demo" data-v22-scroll>
          ${Array.from({ length: 12 }, (_, i) => `<div class="v22-info"><strong>Scroll row ${i + 1}</strong><p>Swipe slowly over this row. No random tab should open behind this overlay.</p></div>`).join("")}
        </div>
        <div class="v22-info"><strong>Test 2: Tap counter</strong><small>Tap the buttons below. The counter should only change on real taps, not on scrolling.</small></div>
        <div class="v22-grid">
          <button data-v22-action="testTap" class="primary-v22">Tap Test A</button>
          <button data-v22-action="testTap">Tap Test B</button>
          <button data-v22-action="testTap">Tap Test C</button>
        </div>
        <div id="v22TestLog" class="v22-test-log">Tap count: 0</div>
      </div>`);
  }

  function openInstructions() {
    openV22("Tab + Scroll Rules", "How the app should behave now.", `
      <div class="v22-info-list">
        <div class="v22-info"><strong>When a tab is open</strong><p>The background locks. Only the active tab should scroll and accept taps.</p></div>
        <div class="v22-info"><strong>When you swipe</strong><p>Swiping up or down should never activate a button or play a click sound.</p></div>
        <div class="v22-info"><strong>Home / Close</strong><p>Use Home to return to the main page, or X to close a tab. You should never be trapped.</p></div>
        <div class="v22-info"><strong>If something feels stuck</strong><p>Use Close All Tabs, then Refresh App Cache. On iPhone Home Screen, re-add the app if old cached code appears.</p></div>
      </div>`);
  }

  function installStartCard() {
    const start = $("startScreen");
    if (!start || $("v22StabilityCard")) return;
    const card = d.createElement("section");
    card.id = "v22StabilityCard";
    card.className = "v22-stability-card";
    card.innerHTML = `
      <p class="eyebrow">v22 Stability</p>
      <h2>Tab Control Center</h2>
      <p>Tabs now lock the background, scroll inside the panel, and only activate real taps.</p>
      <div class="v22-grid">
        <button class="primary-v22" data-v22-action="test">Button Test</button>
        <button data-v22-action="instructions">Scroll Rules</button>
        <button data-v22-action="closeAll">Close All Tabs</button>
        <button data-v22-action="refresh">Refresh App Cache</button>
      </div>`;
    const after = $("continueBtn") || start.querySelector(".brand-title-card");
    if (after?.parentNode) after.parentNode.insertBefore(card, after.nextSibling);
    else start.prepend(card);
  }

  function route(action, target) {
    if (!action) return false;
    if (action === "close") closeV22();
    else if (action === "test") openButtonTest();
    else if (action === "instructions") openInstructions();
    else if (action === "closeAll") closeAllTabs();
    else if (action === "refresh") refreshCache();
    else if (action === "testTap") {
      testHits += 1;
      const log = $("v22TestLog");
      if (log) log.textContent = `Tap count: ${testHits} — last button: ${target?.textContent?.trim() || "button"}`;
      toast("Real tap detected.");
    }
    else return false;
    return true;
  }

  function installEvents() {
    d.addEventListener("click", (event) => {
      const el = event.target.closest?.("[data-v22-action]");
      if (!el) return;
      if (route(el.dataset.v22Action, el)) {
        event.preventDefault();
        event.stopPropagation();
      }
    }, true);

    d.addEventListener("touchmove", guardTouchMove, { capture: true, passive: false });
    d.addEventListener("pointerdown", guardBackgroundEvents, true);
    d.addEventListener("click", guardBackgroundEvents, true);
    d.addEventListener("scroll", () => setTimeout(syncLock, 0), true);
    window.addEventListener("resize", syncLock);
    window.addEventListener("orientationchange", () => setTimeout(syncLock, 100));
  }

  function boot() {
    installStartCard();
    ensureOverlay();
    syncLock();
    installEvents();
    const obs = new MutationObserver(() => {
      installStartCard();
      clearTimeout(boot.t);
      boot.t = setTimeout(syncLock, 30);
    });
    obs.observe(d.body, { childList: true, subtree: true, attributes: true, attributeFilter: ["class", "style"] });
    setInterval(syncLock, 800);
    setTimeout(() => toast("v22 tab control loaded"), 1200);
  }

  window.EMXV22UI = { syncLock, closeAllTabs, openButtonTest, refreshCache, openInstructions };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
