/* EMX Soul Arena v17 - Stable Tap Router
   Purpose: keep v15-style reliable buttons, but only activate on a real tap.
   This fixes accidental button presses and tap SFX during scrolling. */
(function () {
  "use strict";

  if (window.__EMXV17_STABLE_TAPS__) return;
  window.__EMXV17_STABLE_TAPS__ = true;

  const d = document;
  const $ = (id) => d.getElementById(id);
  const qsa = (sel) => Array.from(d.querySelectorAll(sel));

  const TAP_MAX_MOVE = 12;
  const TAP_MAX_TIME = 850;

  let down = null;
  let scrollBlockedUntil = 0;
  let handledClickUntil = 0;
  let syntheticClick = false;
  let lastAction = "";
  let lastActionAt = 0;

  const BUTTON_SELECTOR = [
    "button",
    "a[href]",
    ".class-card[data-class]",
    "[role='button']",
    "[data-hq-action]",
    "[data-v7-action]",
    "[data-v8-open]",
    "[data-v8-close]",
    "[data-v8-buy-chest]",
    "[data-v8-chest]",
    "[data-v8-daily]",
    "[data-v8-tab]",
    "[data-v8-equip-skin]",
    "[data-v8-equip-pet]",
    "[data-v8-claim-contract]",
    "[data-v8-claim-pass]",
    "[data-v8-claim-all-pass]",
    "[data-v9-action]",
    "[data-v9-dojo]",
    "[data-v9-sfx]",
    "[data-v10-action]",
    "[data-v10-sfx]",
    "[data-v10-prize]",
    "[data-v10-memory]",
    "[data-v10-riddle-choice]",
    "[data-v11-action]",
    "[data-v11-class]",
    "[data-v11-claim]",
    "[data-v11-forge]",
    "[data-v11-goal-action]",
    "[data-v11-adventure-choice]",
    "[data-v12-action]",
    "[data-v12-building]",
    "[data-v12-choice]",
    "[data-v12-choice-close]",
    "[data-v12-pet]",
    "[data-v12-pet-pick]",
    "[data-v12-tower]",
    "[data-v12-loadout-class]",
    "[data-v12-loadout-toggle]",
    "[data-v12-sticker-tab]",
    "[data-v12-story-index]",
    "[data-v12-favorite-class]",
    "[data-v13-action]",
    "[data-v14-start]",
    "[data-v14-clear]",
    "[data-v15-start]",
    "[data-v15-action]",
    "[data-v16-start]",
    "[data-v16-action]",
    "[data-v17-start]",
    "[data-v17-action]"
  ].join(",");

  function now() {
    return Date.now();
  }

  function debounce(key, gap = 360) {
    const t = now();
    if (lastAction === key && t - lastActionAt < gap) return false;
    lastAction = key;
    lastActionAt = t;
    return true;
  }

  function pt(event) {
    const t = event.changedTouches?.[0] || event.touches?.[0] || event;
    if (typeof t.clientX !== "number" || typeof t.clientY !== "number") return null;
    return { x: t.clientX, y: t.clientY };
  }

  function isVisible(el) {
    if (!el || !el.getBoundingClientRect) return false;
    const s = getComputedStyle(el);
    if (s.display === "none" || s.visibility === "hidden" || Number(s.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 2 && r.height > 2;
  }

  function containsPoint(el, p) {
    if (!el || !p || !el.getBoundingClientRect) return false;
    const r = el.getBoundingClientRect();
    return p.x >= r.left && p.x <= r.right && p.y >= r.top && p.y <= r.bottom;
  }

  function closestButton(target) {
    return target?.closest?.(BUTTON_SELECTOR) || null;
  }

  function findButtonAt(p, fallbackTarget) {
    const fallback = closestButton(fallbackTarget);
    if (fallback && isVisible(fallback)) return fallback;

    if (p) {
      const direct = closestButton(d.elementFromPoint(p.x, p.y));
      if (direct && isVisible(direct)) return direct;

      const hits = qsa(BUTTON_SELECTOR)
        .filter((el) => isVisible(el) && containsPoint(el, p))
        .sort((a, b) => {
          const ar = a.getBoundingClientRect();
          const br = b.getBoundingClientRect();
          const az = Number.parseInt(getComputedStyle(a).zIndex, 10) || 0;
          const bz = Number.parseInt(getComputedStyle(b).zIndex, 10) || 0;
          return (bz - az) || ((ar.width * ar.height) - (br.width * br.height));
        });
      return hits[0] || null;
    }

    return null;
  }

  function call(name, ...args) {
    try {
      if (typeof window[name] === "function") return window[name](...args);
    } catch (error) {
      console.warn("EMX call failed", name, error);
    }
    try {
      return Function("name", "args", "try { if (typeof globalThis[name] === 'function') return globalThis[name](...args); } catch(e) {} try { if (typeof eval(name) === 'function') return eval(name)(...args); } catch(e) {} return undefined;")(name, args);
    } catch (error) {
      console.warn("EMX eval call failed", name, error);
    }
    return undefined;
  }

  function toast(message) {
    try {
      if (window.EMXV12?.toast) return window.EMXV12.toast(message);
    } catch (error) {}
    let box = $("v17Toast");
    if (!box) {
      box = d.createElement("div");
      box.id = "v17Toast";
      box.style.cssText = "position:fixed;left:16px;right:16px;bottom:18px;z-index:999999;padding:12px 14px;border-radius:18px;background:rgba(15,15,25,.94);border:1px solid rgba(255,255,255,.18);color:white;text-align:center;font-weight:800;box-shadow:0 14px 40px rgba(0,0,0,.45);opacity:0;transform:translateY(12px);transition:.22s ease;pointer-events:none";
      d.body.appendChild(box);
    }
    box.textContent = message;
    box.style.opacity = "1";
    box.style.transform = "translateY(0)";
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => {
      box.style.opacity = "0";
      box.style.transform = "translateY(12px)";
    }, 1500);
  }

  function soundTap() {
    if (now() < scrollBlockedUntil) return;
    try {
      const ap = window.EMXAudioPack;
      if (ap && typeof ap.play === "function" && ap.soundOn?.()) return ap.play("tap");
      if (window.EMXSound?.play && window.EMXSound?.enabled?.()) return window.EMXSound.play("tap");
    } catch (error) {}
  }

  function patchSoundScrollBug() {
    const ap = window.EMXAudioPack;
    if (ap && !ap.__emxV17Patched) {
      ap.__emxV17Patched = true;
      const oldUnlock = typeof ap.unlock === "function" ? ap.unlock.bind(ap) : null;
      const oldPlay = typeof ap.play === "function" ? ap.play.bind(ap) : null;

      if (oldUnlock) {
        ap.unlock = function v17Unlock(type = "unlock") {
          // The old code called unlock('tap') on every pointerdown/touchstart.
          // That made scroll gestures play click sounds. Make those silent.
          if (type === "tap" || type === false || type == null) {
            try { this.unlocked = true; this.lastResult = "Audio ready silently"; } catch (error) {}
            return Promise.resolve(true);
          }
          return oldUnlock(type);
        };
      }

      if (oldPlay) {
        ap.play = function v17Play(type = "tap") {
          if (now() < scrollBlockedUntil && String(type || "tap") === "tap") return false;
          return oldPlay(type);
        };
      }
    }

    // v10 replaced the old V9 sound object with this public wrapper. Keep it silent on unlock too.
    if (window.EMXSound && !window.EMXSound.__emxV17Patched) {
      window.EMXSound.__emxV17Patched = true;
      const oldUnlock = typeof window.EMXSound.unlock === "function" ? window.EMXSound.unlock.bind(window.EMXSound) : null;
      const oldPlay = typeof window.EMXSound.play === "function" ? window.EMXSound.play.bind(window.EMXSound) : null;
      if (oldUnlock) window.EMXSound.unlock = () => Promise.resolve(true);
      if (oldPlay) window.EMXSound.play = (type = "tap") => {
        if (now() < scrollBlockedUntil && String(type || "tap") === "tap") return false;
        return oldPlay(type);
      };
    }
  }

  function finishBoot(force = false) {
    const boot = $("bootScreen");
    if (!boot) return;
    if (!force && performance.now() < 3200) return;
    boot.classList.add("boot-finished");
    boot.style.pointerEvents = "none";
    setTimeout(() => { try { boot.remove(); } catch (error) {} }, 450);
  }

  function clearBlockers(forceBoot = false) {
    finishBoot(forceBoot);
    const hiddenSelectors = [
      ".overlay.hidden",
      ".v8-overlay.hidden",
      ".v9-overlay.hidden",
      ".v10-overlay.hidden",
      ".v11-overlay:not(.open)",
      ".v12-overlay:not(.show)",
      ".v12-choice-room:not(.show)",
      "#v15SafePanel:not(.show)"
    ];
    qsa(hiddenSelectors.join(",")).forEach((el) => {
      if (el.id === "bootScreen") return;
      el.style.pointerEvents = "none";
      if (el.classList.contains("hidden") || el.matches(".v11-overlay:not(.open),.v12-overlay:not(.show),.v12-choice-room:not(.show),#v15SafePanel:not(.show)")) {
        el.style.display = "none";
      }
    });

    const openSelectors = [
      ".overlay:not(.hidden)",
      ".v8-overlay:not(.hidden)",
      ".v9-overlay:not(.hidden)",
      ".v10-overlay:not(.hidden)",
      ".v11-overlay.open",
      ".v12-overlay.show",
      ".v12-choice-room.show",
      "#v15SafePanel.show"
    ];
    qsa(openSelectors.join(",")).forEach((el) => {
      if (el.id === "bootScreen") return;
      el.style.pointerEvents = "auto";
      el.style.display = "";
    });

    qsa(".effect-layer,.header-pulse,.v11-floating-guide,.v9-mascot,#v17Toast").forEach((el) => {
      el.style.pointerEvents = "none";
    });
  }

  function showScreen(id) {
    ["startScreen", "battleScreen"].forEach((screenId) => {
      const el = $(screenId);
      if (el) el.classList.toggle("hidden", screenId !== id);
    });
  }

  function startClass(classKey) {
    if (!classKey || !debounce("start:" + classKey, 700)) return true;
    clearBlockers(true);
    call("startNewRun", classKey);
    setTimeout(() => {
      const battle = $("battleScreen");
      if (battle && battle.classList.contains("hidden")) call("startNewRun", classKey);
      showScreen("battleScreen");
    }, 80);
    toast("Starting " + ({ flame: "Flame Mage", rogue: "Shadow Rogue", storm: "Storm Knight", nature: "Nature Healer" }[classKey] || "run"));
    soundTap();
    return true;
  }

  function continueRun() {
    if (!debounce("continue", 700)) return true;
    clearBlockers(true);
    call("loadGame");
    setTimeout(() => showScreen("battleScreen"), 80);
    soundTap();
    return true;
  }

  function usePower(powerKey) {
    if (!powerKey || !debounce("power:" + powerKey, 240)) return true;
    clearBlockers(true);
    call("usePower", powerKey);
    return true;
  }

  function openShop() {
    clearBlockers(true);
    call("showShop");
    const shop = $("shopScreen");
    if (shop) {
      shop.classList.remove("hidden");
      shop.style.display = "";
      shop.style.pointerEvents = "auto";
    }
    soundTap();
    return true;
  }

  function closeShop() {
    call("closeShop");
    const shop = $("shopScreen");
    if (shop) {
      shop.classList.add("hidden");
      shop.style.display = "none";
      shop.style.pointerEvents = "none";
    }
    soundTap();
    return true;
  }

  function routeV12Action(action) {
    clearBlockers(true);
    const api = window.EMXV12 || {};
    const map = {
      openHub: api.openHub,
      story: api.story,
      tower: api.tower,
      pet: api.pet,
      loadout: api.loadout,
      stickers: api.stickers,
      events: api.events,
      profile: api.profile,
      close: api.close
    };
    if (typeof map[action] === "function") map[action]();
    else if (action === "close") api.close?.();
    else openStableMenu();
    soundTap();
    return true;
  }

  function routeV12Building(building) {
    if (building === "multiplayer") {
      soundTap();
      location.href = "multiplayer.html";
      return true;
    }
    if (building === "campaign" || building === "arena") return routeV12Action("close");
    const map = { story: "story", tower: "tower", pet: "pet", loadout: "loadout", stickers: "stickers", events: "events", profile: "profile" };
    return routeV12Action(map[building] || "openHub");
  }

  function nativeClick(el) {
    if (!el) return false;
    syntheticClick = true;
    const evt = new MouseEvent("click", { bubbles: true, cancelable: true, view: window });
    evt.__emxSynthetic = true;
    try { el.dispatchEvent(evt); } catch (error) { try { el.click(); } catch (e) {} }
    setTimeout(() => { syntheticClick = false; }, 0);
    return true;
  }

  function openStableMenu() {
    let panel = $("v15SafePanel");
    if (!panel) {
      panel = d.createElement("section");
      panel.id = "v15SafePanel";
      panel.innerHTML = `
        <div class="v15-safe-modal">
          <div class="v15-safe-top">
            <div>
              <p class="eyebrow">v17 Button Doctor</p>
              <h2>Stable Menu</h2>
              <p>Use this if any menu acts frozen. This version ignores scroll gestures and only activates real taps.</p>
            </div>
            <button data-v17-action="closeStable">✕</button>
          </div>
          <div class="v15-safe-grid">
            <button data-v17-start="flame">🔥 Start Flame</button>
            <button data-v17-start="rogue">🥷 Start Rogue</button>
            <button data-v17-start="storm">⚔️ Start Storm</button>
            <button data-v17-start="nature">🌿 Start Nature</button>
            <button data-v12-action="openHub">🏙️ EMX City</button>
            <button data-v12-action="story">📖 Story</button>
            <button data-v12-action="tower">🗼 Neon Tower</button>
            <button data-v12-action="profile">👤 Profile</button>
            <button data-v17-action="clear">Clear Tap Blockers</button>
            <a href="multiplayer.html">🌐 Multiplayer</a>
          </div>
        </div>`;
      d.body.appendChild(panel);
    }
    panel.classList.add("show");
    panel.style.display = "grid";
    panel.style.pointerEvents = "auto";
    soundTap();
    return true;
  }

  function closeStableMenu() {
    const panel = $("v15SafePanel");
    if (panel) {
      panel.classList.remove("show");
      panel.style.display = "none";
      panel.style.pointerEvents = "none";
    }
    soundTap();
    return true;
  }

  function route(el) {
    if (!el || !isVisible(el)) return false;
    if (el.disabled || el.getAttribute("aria-disabled") === "true") return false;

    const classCard = el.closest?.(".class-card[data-class]");
    if (classCard) return startClass(classCard.dataset.class);

    const start = el.closest?.("[data-v17-start],[data-v16-start],[data-v15-start],[data-v14-start]");
    if (start) return startClass(start.dataset.v17Start || start.dataset.v16Start || start.dataset.v15Start || start.dataset.v14Start);

    if (el.closest?.("#continueBtn")) return continueRun();

    const actionBtn = el.closest?.(".action-btn[data-power]");
    if (actionBtn) return usePower(actionBtn.dataset.power);

    if (el.closest?.("#saveBtn")) { call("saveGame"); toast("Game saved"); soundTap(); return true; }
    if (el.closest?.("#shopBtn")) return openShop();
    if (el.closest?.("#closeShopBtn")) return closeShop();
    if (el.closest?.("#resetBtn")) { call("deleteSave"); toast("Save deleted"); soundTap(); return true; }
    if (el.closest?.("#restartBtn")) { call("restartToMenu"); showScreen("startScreen"); soundTap(); return true; }

    const v17Action = el.closest?.("[data-v17-action],[data-v16-action],[data-v15-action]");
    if (v17Action) {
      const action = v17Action.dataset.v17Action || v17Action.dataset.v16Action || v17Action.dataset.v15Action;
      if (action === "stable" || action === "openSafe" || action === "openStable") return openStableMenu();
      if (action === "closeStable" || action === "closeSafe") return closeStableMenu();
      if (action === "clear") { clearBlockers(true); toast("Tap blockers cleared"); soundTap(); return true; }
      if (action === "bootDone") { finishBoot(true); soundTap(); return true; }
    }

    const v12Action = el.closest?.("[data-v12-action]");
    if (v12Action) return routeV12Action(v12Action.dataset.v12Action || "openHub");

    const v12Building = el.closest?.("[data-v12-building]");
    if (v12Building) return routeV12Building(v12Building.dataset.v12Building || "openHub");

    const a = el.closest?.("a[href]");
    if (a) {
      soundTap();
      location.href = a.getAttribute("href");
      return true;
    }

    // For all older feature panels, let their original delegated click handlers run through a synthetic click.
    const dataFeature = el.closest?.("[data-hq-action],[data-v7-action],[data-v8-open],[data-v8-close],[data-v8-buy-chest],[data-v8-chest],[data-v8-daily],[data-v8-tab],[data-v8-equip-skin],[data-v8-equip-pet],[data-v8-claim-contract],[data-v8-claim-pass],[data-v8-claim-all-pass],[data-v9-action],[data-v9-dojo],[data-v9-sfx],[data-v10-action],[data-v10-sfx],[data-v10-prize],[data-v10-memory],[data-v10-riddle-choice],[data-v11-action],[data-v11-class],[data-v11-claim],[data-v11-forge],[data-v11-goal-action],[data-v11-adventure-choice],[data-v12-choice],[data-v12-choice-close],[data-v12-pet],[data-v12-pet-pick],[data-v12-tower],[data-v12-loadout-class],[data-v12-loadout-toggle],[data-v12-sticker-tab],[data-v12-story-index],[data-v12-favorite-class]");
    if (dataFeature) {
      nativeClick(dataFeature);
      return true;
    }

    return false;
  }

  function begin(event) {
    const p = pt(event);
    if (!p) return;
    const btn = findButtonAt(p, event.target);
    down = {
      x: p.x,
      y: p.y,
      t: now(),
      scrollX: window.scrollX,
      scrollY: window.scrollY,
      target: event.target,
      button: btn,
      moved: false
    };
    patchSoundScrollBug();
  }

  function move(event) {
    if (!down) return;
    const p = pt(event);
    if (!p) return;
    const dist = Math.hypot(p.x - down.x, p.y - down.y);
    const scrollDist = Math.abs(window.scrollY - down.scrollY) + Math.abs(window.scrollX - down.scrollX);
    if (dist > TAP_MAX_MOVE || scrollDist > 4) {
      down.moved = true;
      scrollBlockedUntil = now() + 550;
    }
  }

  function end(event) {
    if (!down) return;
    move(event);
    const p = pt(event);
    const age = now() - down.t;
    const scrollDist = Math.abs(window.scrollY - down.scrollY) + Math.abs(window.scrollX - down.scrollX);
    const moved = down.moved || age > TAP_MAX_TIME || scrollDist > 5;
    const el = !moved ? findButtonAt(p, down.target) || down.button : null;
    down = null;

    if (moved) {
      scrollBlockedUntil = now() + 650;
      return;
    }

    if (el && route(el)) {
      handledClickUntil = now() + 700;
      event.preventDefault?.();
      event.stopPropagation?.();
      event.stopImmediatePropagation?.();
    }
  }

  function clickFallback(event) {
    if (syntheticClick || event.__emxSynthetic) return;

    if (now() < handledClickUntil || now() < scrollBlockedUntil) {
      event.preventDefault?.();
      event.stopPropagation?.();
      event.stopImmediatePropagation?.();
      return;
    }

    // Fallback for browsers that do not deliver pointerup reliably.
    const p = pt(event);
    const el = findButtonAt(p, event.target);
    if (el && route(el)) {
      handledClickUntil = now() + 500;
      event.preventDefault?.();
      event.stopPropagation?.();
      event.stopImmediatePropagation?.();
    }
  }

  function installStartCard() {
    const start = $("startScreen");
    if (!start || $("v17DoctorCard")) return;
    const card = d.createElement("section");
    card.id = "v17DoctorCard";
    card.className = "v15-restore-card";
    card.innerHTML = `
      <div>
        <p class="eyebrow">v17 Button Doctor</p>
        <h2>Scroll-safe buttons restored</h2>
        <p>Buttons activate on real taps only. Swiping over buttons should not play click sounds or open random tabs.</p>
      </div>
      <div class="v15-restore-grid">
        <button data-v17-action="stable">Stable Menu</button>
        <button data-v17-action="clear">Clear Tap Blockers</button>
        <button data-v17-start="flame">Start Flame</button>
        <button data-v17-start="storm">Start Storm</button>
      </div>`;
    const grid = start.querySelector(".class-grid");
    if (grid) start.insertBefore(card, grid);
    else start.appendChild(card);
  }

  function styleButtons() {
    qsa(BUTTON_SELECTOR).forEach((el) => {
      el.style.webkitTapHighlightColor = "transparent";
      el.style.touchAction = "manipulation";
    });
  }

  function markVersion() {
    qsa(".version-chip").forEach((chip) => { chip.textContent = "v17 Button Doctor"; });
    const subtitle = d.querySelector(".brand-title-card .subtitle");
    if (subtitle && /v1[0-9]/i.test(subtitle.textContent || "")) {
      subtitle.textContent = "v17 Button Doctor: loading screen, working buttons, and no accidental click sounds while scrolling.";
    }
  }

  function boot() {
    patchSoundScrollBug();
    installStartCard();
    styleButtons();
    markVersion();
    clearBlockers(false);
    setTimeout(() => finishBoot(false), 3400);
    setInterval(() => {
      patchSoundScrollBug();
      installStartCard();
      styleButtons();
      markVersion();
      clearBlockers(false);
    }, 1200);
    setTimeout(() => toast("v17 button doctor loaded"), 1600);
  }

  // Pointer/touch events are used only to detect a completed tap. No action happens on pointerdown.
  d.addEventListener("pointerdown", begin, { capture: true, passive: true });
  d.addEventListener("pointermove", move, { capture: true, passive: true });
  d.addEventListener("pointerup", end, { capture: true, passive: false });
  d.addEventListener("touchstart", begin, { capture: true, passive: true });
  d.addEventListener("touchmove", move, { capture: true, passive: true });
  d.addEventListener("touchend", end, { capture: true, passive: false });
  d.addEventListener("scroll", () => { scrollBlockedUntil = now() + 650; }, true);
  d.addEventListener("click", clickFallback, true);

  window.__emxV16IgnoreClick = () => now() < handledClickUntil || now() < scrollBlockedUntil;
  window.EMXV17ButtonDoctor = { openStableMenu, clearBlockers, finishBoot, startClass, continueRun };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
