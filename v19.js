/* EMX Soul Arena v19 — Home + Fun Expansion
   Adds home navigation, clearer instructions, better attack cinematics, and extra interactive games. */
(function () {
  "use strict";
  if (window.__EMX_V19_HOME_FUN__) return;
  window.__EMX_V19_HOME_FUN__ = true;

  const d = document;
  const $ = (id) => d.getElementById(id);
  const qsa = (sel) => Array.from(d.querySelectorAll(sel));
  const META_KEY = "emxSoulArenaV19Fun_v1";
  const HQ_KEY = "emxSoulArenaMeta_v4";
  const ARCADE_KEY = "emxSoulArenaFunArcade_v10";
  const COLLECTION_KEY = "emxSoulArenaCollection_v1";

  const state = {
    overlayMode: "home",
    catchScore: 0,
    catchLeft: 0,
    memorySeq: [],
    memoryIndex: 0,
    dodgeRound: 0,
    dodgeCorrect: "left"
  };

  const icons = {
    fire: "🔥",
    lightning: "⚡",
    ice: "❄️",
    poison: "☠️",
    shadow: "🌑",
    heal: "✨",
    shield: "🛡️",
    slash: "⚔️",
    meteor: "☄️",
    nova: "💥",
    combo: "🥷",
    boss: "👑",
    ultimate: "🌋"
  };

  function read(key, fallback = {}) {
    try { return { ...fallback, ...(JSON.parse(localStorage.getItem(key) || "{}") || {}) }; }
    catch (error) { return { ...fallback }; }
  }

  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) {}
  }

  function defaultMeta() {
    return {
      tickets: 0,
      stars: 0,
      animationPreviews: 0,
      miniGamesPlayed: 0,
      dailyDate: "",
      dailyClaims: 0,
      bestCatch: 0,
      memoryWins: 0,
      dodgeWins: 0,
      coachViews: 0,
      homeUses: 0,
      lastReward: "No v19 rewards yet"
    };
  }

  let meta = read(META_KEY, defaultMeta());

  function saveMeta() {
    write(META_KEY, meta);
    updateStats();
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function htmlEscape(text) {
    return String(text ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function playSound(kind = "tap") {
    try {
      if (window.EMXAudioPack?.play) return window.EMXAudioPack.play(kind);
      if (window.EMXSound?.play) return window.EMXSound.play(kind);
    } catch (error) {}
    return false;
  }

  function toast(message) {
    let box = $("v19Toast");
    if (!box) {
      box = d.createElement("div");
      box.id = "v19Toast";
      box.className = "v19-toast";
      d.body.appendChild(box);
    }
    box.textContent = message;
    box.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => box.classList.remove("show"), 1800);
  }

  function award({ tickets = 0, stars = 0, crystals = 0, coins = 0, chest = "", reason = "Reward" }) {
    if (tickets) meta.tickets = Number(meta.tickets || 0) + tickets;
    if (stars) meta.stars = Number(meta.stars || 0) + stars;

    if (crystals) {
      const hq = read(HQ_KEY, {});
      hq.crystals = Number(hq.crystals || 0) + crystals;
      write(HQ_KEY, hq);
    }

    if (coins) {
      const save = read("emxSoulArenaSave_v3", null);
      if (save && save.state?.coins != null) {
        save.state.coins = Number(save.state.coins || 0) + coins;
        write("emxSoulArenaSave_v3", save);
      }
    }

    if (chest) {
      const collection = read(COLLECTION_KEY, {});
      collection.chests = { neon: 0, boss: 0, skin: 0, pet: 0, legend: 0, mythic: 0, ...(collection.chests || {}) };
      collection.chests[chest] = Number(collection.chests[chest] || 0) + 1;
      write(COLLECTION_KEY, collection);
    }

    const parts = [];
    if (tickets) parts.push(`+${tickets} 🎟️`);
    if (stars) parts.push(`+${stars} ⭐`);
    if (crystals) parts.push(`+${crystals} 💎`);
    if (coins) parts.push(`+${coins} coins`);
    if (chest) parts.push(`${chest} chest`);
    meta.lastReward = `${reason}: ${parts.join(" • ") || "Nice work"}`;
    saveMeta();
    toast(meta.lastReward);
    if (chest) playSound("chest");
    else playSound("coin");
  }

  function closeFeatureOverlays() {
    qsa(".overlay,.v8-overlay,.v9-overlay,.v10-overlay,.v11-overlay,.v12-overlay,.v12-choice-room,#v15SafePanel,#v19Overlay").forEach((el) => {
      if (!el) return;
      el.classList.add("hidden");
      el.classList.remove("show", "open");
      el.style.pointerEvents = "none";
      // Built-in overlays reopen by toggling .hidden, so never leave inline display:none on them.
      if (el.classList.contains("overlay") && el.id !== "v19Overlay") el.style.display = "";
      else el.style.display = "none";
    });
  }

  function goHome() {
    meta.homeUses = Number(meta.homeUses || 0) + 1;
    saveMeta();

    try {
      Function("try { if (typeof saveGame === 'function') saveGame(); } catch(e) {}")();
    } catch (error) {}

    closeFeatureOverlays();
    const boot = $("bootScreen");
    if (boot) {
      boot.classList.add("boot-finished");
      boot.style.pointerEvents = "none";
    }

    qsa(".screen").forEach((screen) => screen.classList.add("hidden"));
    const start = $("startScreen");
    if (start) start.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    toast("Back to main page");
    playSound("tap");
  }

  function updateStats() {
    qsa("[data-v19-stat='tickets']").forEach((el) => { el.textContent = Number(meta.tickets || 0); });
    qsa("[data-v19-stat='stars']").forEach((el) => { el.textContent = Number(meta.stars || 0); });
    qsa("[data-v19-stat='daily']").forEach((el) => { el.textContent = meta.dailyDate === todayKey() ? "Claimed" : "Ready"; });
    qsa("[data-v19-stat='last']").forEach((el) => { el.textContent = meta.lastReward || "No reward yet"; });
  }

  function markPosition() {
    const start = $("startScreen");
    const onStart = Boolean(start && !start.classList.contains("hidden"));
    d.body.classList.toggle("v19-at-start", onStart);
  }

  function installHomeButton() {
    if (d.querySelector(".mp-app")) return;
    if ($("v19HomeButton")) return;
    const btn = d.createElement("button");
    btn.id = "v19HomeButton";
    btn.className = "v19-home-button";
    btn.type = "button";
    btn.setAttribute("data-v19-action", "home");
    btn.setAttribute("aria-label", "Go home");
    btn.innerHTML = "🏠 <span>Home</span>";
    d.body.appendChild(btn);
  }

  function installStartCard() {
    const start = $("startScreen");
    if (!start || $("v19FeatureCard")) return;
    const card = d.createElement("section");
    card.id = "v19FeatureCard";
    card.className = "v19-card";
    card.innerHTML = `
      <p class="eyebrow">Live Build Update</p>
      <h2>EMX Fun Center</h2>
      <p>New home button, clearer help, stronger 3D-style attack previews, boss coaching, daily surprises, and fresh mini-games.</p>
      <div class="v19-mini-stats">
        <span class="v19-pill">🎟️ <b data-v19-stat="tickets">0</b></span>
        <span class="v19-pill">⭐ <b data-v19-stat="stars">0</b></span>
        <span class="v19-pill">🎁 <b data-v19-stat="daily">Ready</b></span>
      </div>
      <div class="v19-grid">
        <button type="button" data-v19-action="howto">📘 How to Play<small>Clear steps and tips</small></button>
        <button type="button" data-v19-action="funhub">🎮 Mini Games<small>Crystal Catch, Memory, Dodge</small></button>
        <button type="button" data-v19-action="animationLab">🎬 Animation Lab<small>Preview upgraded attacks</small></button>
        <button type="button" data-v19-action="bossCoach">👑 Boss Coach<small>Learn boss counters</small></button>
        <button type="button" data-v19-action="daily">🎁 Daily Surprise<small>Claim a daily bonus</small></button>
        <button type="button" data-v19-action="home">🏠 Home<small>Return to main page</small></button>
      </div>
    `;
    const heading = start.querySelector(".section-heading") || start.querySelector(".class-grid");
    if (heading) start.insertBefore(card, heading);
    else start.appendChild(card);
    updateStats();
  }

  function ensureOverlay() {
    let overlay = $("v19Overlay");
    if (!overlay) {
      overlay = d.createElement("section");
      overlay.id = "v19Overlay";
      overlay.className = "v19-overlay hidden";
      overlay.innerHTML = `<div class="v19-modal" id="v19Modal"></div>`;
      d.body.appendChild(overlay);
    }
    return overlay;
  }

  function openOverlay(title, eyebrow, bodyHtml) {
    const overlay = ensureOverlay();
    const modal = $("v19Modal");
    modal.innerHTML = `
      <div class="v19-modal-top">
        <div>
          <p class="eyebrow">${htmlEscape(eyebrow)}</p>
          <h2>${htmlEscape(title)}</h2>
        </div>
        <div class="v19-close-row">
          <button type="button" data-v19-action="home">🏠</button>
          <button type="button" data-v19-action="close">✕</button>
        </div>
      </div>
      ${bodyHtml}
    `;
    overlay.classList.remove("hidden");
    overlay.classList.add("show");
    overlay.style.display = "grid";
    overlay.style.pointerEvents = "auto";
    updateStats();
    playSound("tap");
  }

  function closeOverlay() {
    const overlay = $("v19Overlay");
    if (!overlay) return;
    overlay.classList.add("hidden");
    overlay.classList.remove("show");
    overlay.style.display = "none";
    overlay.style.pointerEvents = "none";
    playSound("tap");
  }

  function renderHowTo() {
    const steps = [
      ["1. Pick a class", "Flame is easy damage. Storm is safer. Nature survives longest. Rogue is best for crit combos."],
      ["2. Watch HP and mana", "HP is your life. Mana fuels stronger powers. Basic attacks are free and help rebuild ultimate."],
      ["3. Use Shield before bosses", "If a boss warning appears, use Shield, Stun, Freeze, or Heal before attacking again."],
      ["4. Choose upgrades that match your class", "Flame likes burn. Rogue likes crit/poison. Storm likes shield/stun. Nature likes heal/regen."],
      ["5. Open Gear, Skills, and HQ", "Permanent upgrades make later runs easier. Use crystals, skill points, and gear forge upgrades."],
      ["6. Use Home when lost", "The new Home button closes tabs and takes you back to the main page without deleting your run."],
      ["7. Mini-games give bonuses", "Play the Fun Center games for tickets, crystals, chests, and practice."],
      ["8. Multiplayer is separate", "Use Online Multiplayer from the main page when you want rooms, duels, or co-op."],
      ["9. Kid Mode helps younger players", "Kid Mode makes enemies easier and gives extra shield/mana rewards."],
      ["10. Bosses have patterns", "Do not spam attacks on bosses. Watch warnings, defend, then punish during weakness windows."]
    ];
    openOverlay("How to Play", "Clear Instructions", `
      <div class="v19-list">
        ${steps.map(([title, body]) => `<div class="v19-info-card"><strong>${htmlEscape(title)}</strong><p>${htmlEscape(body)}</p></div>`).join("")}
      </div>
      <button type="button" class="v19-wide-button" data-v19-action="funhub">Try Mini-Games After Reading<small>Practice timing, memory, and boss dodges</small></button>
    `);
  }

  function renderAnimationLab() {
    const options = [
      ["slash", "⚔️ Slash", "Fast 3D blade impact"],
      ["fire", "🔥 Fireball", "Rolling flame comet"],
      ["lightning", "⚡ Lightning", "Electric bolt impact"],
      ["ice", "❄️ Ice Blast", "Crystal freeze burst"],
      ["poison", "☠️ Poison", "Toxic orb splash"],
      ["shadow", "🌑 Shadow", "Dark portal strike"],
      ["heal", "✨ Heal", "Green recovery wave"],
      ["shield", "🛡️ Shield", "Blue barrier raise"],
      ["meteor", "☄️ Meteor", "Big ultimate drop"],
      ["nova", "💥 Nova", "Full-screen energy burst"],
      ["combo", "🥷 Combo", "Multi-slash chain"],
      ["boss", "👑 Boss Slam", "Heavy enemy cut-in"]
    ];
    openOverlay("Animation Lab", "3D-Style Attack Previews", `
      <p class="v19-info-card">Tap an attack to preview the upgraded cinematic. These effects also trigger during fights.</p>
      <div class="v19-grid">
        ${options.map(([kind, label, desc]) => `<button type="button" data-v19-anim="${kind}">${label}<small>${desc}</small></button>`).join("")}
      </div>
    `);
  }

  function renderBossCoach() {
    meta.coachViews = Number(meta.coachViews || 0) + 1;
    saveMeta();
    const bosses = [
      ["👑 Goblin King", "When he charges Royal Smash, use Shield or Stun. Fire and poison work well because the fight lasts longer."],
      ["🐉 Bone Dragon", "Heal before poison stacks too high. Shield breath attacks and use burst damage during weakness."],
      ["⛈️ Storm Titan", "If he charges lightning, defend next turn. Freeze or stun can interrupt some big hits."],
      ["👁️ Void Beast", "Void gets stronger over time. Use ultimates early and keep shield ready."],
      ["🗼 Tower Bosses", "Tower fights reward good timing. Practice Dodge Trainer before climbing."],
      ["🌋 Final Bosses", "Bring forged gear, equipped pet, and a power loadout before entering the zone."]
    ];
    openOverlay("Boss Coach", "Fair Boss Fights", `
      <div class="v19-list">
        ${bosses.map(([name, tip]) => `<div class="v19-info-card"><strong>${name}</strong><p>${tip}</p></div>`).join("")}
      </div>
      <button type="button" class="v19-wide-button" data-v19-game="dodge">Practice Boss Dodge<small>Win practice rounds for tickets and crystals</small></button>
    `);
  }

  function renderFunHub() {
    openOverlay("Mini Games", "Fun Interactive Arcade", `
      <div class="v19-mini-stats">
        <span class="v19-pill">🎟️ Tickets: <b data-v19-stat="tickets">0</b></span>
        <span class="v19-pill">⭐ Stars: <b data-v19-stat="stars">0</b></span>
        <span class="v19-pill">Last: <b data-v19-stat="last">None</b></span>
      </div>
      <div class="v19-grid">
        <button type="button" data-v19-game="catch">💎 Crystal Catch<small>Tap crystals, avoid bombs</small></button>
        <button type="button" data-v19-game="memory">🧠 Rune Memory<small>Repeat the rune pattern</small></button>
        <button type="button" data-v19-game="dodge">🛡️ Boss Dodge<small>Pick the safe side</small></button>
        <button type="button" data-v19-game="wheel">🎡 Reward Wheel<small>Spin for a bonus</small></button>
        <button type="button" data-v19-action="animationLab">🎬 Animation Lab<small>Preview effects</small></button>
        <button type="button" data-v19-action="howto">📘 Help<small>Learn what to do next</small></button>
      </div>
    `);
  }

  function claimDaily() {
    const today = todayKey();
    if (meta.dailyDate === today) {
      toast("Daily surprise already claimed today");
      playSound("fail");
      renderFunHub();
      return;
    }
    meta.dailyDate = today;
    meta.dailyClaims = Number(meta.dailyClaims || 0) + 1;
    award({ tickets: 20, stars: 2, crystals: 18, chest: "neon", reason: "Daily Surprise" });
    renderFunHub();
  }

  function startCatch() {
    state.catchScore = 0;
    state.catchLeft = 8;
    meta.miniGamesPlayed = Number(meta.miniGamesPlayed || 0) + 1;
    saveMeta();
    renderCatch();
  }

  function renderCatch() {
    const spots = [];
    for (let i = 0; i < 12; i += 1) spots.push(Math.random() < 0.62 ? "💎" : "💣");
    const body = `
      <div class="v19-mini-game">
        <div class="v19-info-card"><strong>💎 Crystal Catch</strong><p>Tap crystals. Avoid bombs. Moves left: ${state.catchLeft}. Score: ${state.catchScore}.</p></div>
        <div class="v19-play-grid">
          ${spots.map((icon, index) => `<button type="button" data-v19-catch="${index}" data-kind="${icon === "💎" ? "crystal" : "bomb"}">${icon}</button>`).join("")}
        </div>
      </div>`;
    openOverlay("Crystal Catch", "Mini Game", body);
  }

  function handleCatch(btn) {
    if (state.catchLeft <= 0) return;
    const kind = btn.dataset.kind;
    btn.disabled = true;
    if (kind === "crystal") {
      state.catchScore += 1;
      btn.classList.add("hit");
      playSound("coin");
    } else {
      state.catchScore = Math.max(0, state.catchScore - 1);
      btn.classList.add("miss");
      playSound("wrong");
    }
    state.catchLeft -= 1;
    if (state.catchLeft <= 0) {
      meta.bestCatch = Math.max(Number(meta.bestCatch || 0), state.catchScore);
      const stars = state.catchScore >= 5 ? 2 : 1;
      award({ tickets: 8 + state.catchScore, stars, crystals: Math.max(2, state.catchScore * 2), reason: "Crystal Catch" });
      setTimeout(renderFunHub, 500);
    } else {
      const info = $("v19Modal")?.querySelector(".v19-info-card p");
      if (info) info.textContent = `Tap crystals. Avoid bombs. Moves left: ${state.catchLeft}. Score: ${state.catchScore}.`;
    }
  }

  function startMemory() {
    const pool = ["🔥", "⚡", "❄️", "☠️", "🌿", "🌑"];
    state.memorySeq = Array.from({ length: 4 }, () => pool[Math.floor(Math.random() * pool.length)]);
    state.memoryIndex = 0;
    meta.miniGamesPlayed = Number(meta.miniGamesPlayed || 0) + 1;
    saveMeta();
    renderMemory(false);
  }

  function renderMemory(failed) {
    const choices = ["🔥", "⚡", "❄️", "☠️", "🌿", "🌑"];
    openOverlay("Rune Memory", "Mini Game", `
      <div class="v19-mini-game">
        <div class="v19-info-card"><strong>${failed ? "Try again" : "Memorize the pattern"}</strong><p>Tap the runes in order. Progress: ${state.memoryIndex}/${state.memorySeq.length}.</p></div>
        <div class="v19-sequence">${state.memorySeq.map((icon, i) => `<span style="opacity:${i < state.memoryIndex ? .35 : 1}">${icon}</span>`).join("")}</div>
        <div class="v19-play-grid">${choices.map((icon) => `<button type="button" data-v19-memory="${icon}">${icon}</button>`).join("")}</div>
      </div>
    `);
  }

  function handleMemory(icon) {
    const expected = state.memorySeq[state.memoryIndex];
    if (icon === expected) {
      state.memoryIndex += 1;
      playSound("memory");
      if (state.memoryIndex >= state.memorySeq.length) {
        meta.memoryWins = Number(meta.memoryWins || 0) + 1;
        award({ tickets: 16, stars: 3, crystals: 12, reason: "Rune Memory" });
        setTimeout(renderFunHub, 500);
      } else {
        renderMemory(false);
      }
    } else {
      playSound("wrong");
      state.memoryIndex = 0;
      renderMemory(true);
    }
  }

  function startDodge() {
    state.dodgeRound = 1;
    meta.miniGamesPlayed = Number(meta.miniGamesPlayed || 0) + 1;
    saveMeta();
    renderDodge();
  }

  function renderDodge() {
    const options = ["left", "middle", "right"];
    state.dodgeCorrect = options[Math.floor(Math.random() * options.length)];
    const danger = options.filter((x) => x !== state.dodgeCorrect).join(" + ");
    openOverlay("Boss Dodge", "Mini Game", `
      <div class="v19-mini-game">
        <div class="v19-info-card"><strong>Round ${state.dodgeRound}/5</strong><p>Boss attacks ${danger}. Pick the safe side before the blast lands.</p></div>
        <div class="v19-play-grid">
          <button type="button" data-v19-dodge="left">⬅️ Left</button>
          <button type="button" data-v19-dodge="middle">⬆️ Middle</button>
          <button type="button" data-v19-dodge="right">➡️ Right</button>
        </div>
      </div>
    `);
    attackCinematic("boss", "Boss Warning");
  }

  function handleDodge(choice) {
    if (choice === state.dodgeCorrect) {
      playSound("shield");
      if (state.dodgeRound >= 5) {
        meta.dodgeWins = Number(meta.dodgeWins || 0) + 1;
        award({ tickets: 22, stars: 4, crystals: 16, reason: "Boss Dodge" });
        setTimeout(renderFunHub, 500);
      } else {
        state.dodgeRound += 1;
        renderDodge();
      }
    } else {
      playSound("fail");
      toast("Hit! Try again from round 1.");
      state.dodgeRound = 1;
      renderDodge();
    }
  }

  function spinWheel() {
    meta.miniGamesPlayed = Number(meta.miniGamesPlayed || 0) + 1;
    saveMeta();
    const rewards = [
      { tickets: 10, stars: 1, crystals: 5, reason: "Reward Wheel" },
      { tickets: 20, stars: 2, crystals: 10, reason: "Reward Wheel" },
      { tickets: 12, stars: 1, chest: "neon", reason: "Reward Wheel" },
      { tickets: 5, stars: 3, chest: "pet", reason: "Reward Wheel" },
      { tickets: 30, stars: 3, crystals: 25, reason: "Reward Wheel" }
    ];
    attackCinematic("nova", "Reward Wheel");
    setTimeout(() => award(rewards[Math.floor(Math.random() * rewards.length)]), 450);
    setTimeout(renderFunHub, 900);
  }

  function inferAttackKind(powerKey, label = "") {
    const text = `${powerKey || ""} ${label || ""}`.toLowerCase();
    if (text.includes("ultimate") || text.includes("meteor") || text.includes("inferno")) return "meteor";
    if (text.includes("nova") || text.includes("overdrive")) return "nova";
    if (text.includes("thunder") || text.includes("lightning") || text.includes("storm")) return "lightning";
    if (text.includes("ice") || text.includes("freeze")) return "ice";
    if (text.includes("poison") || text.includes("spore") || text.includes("venom")) return "poison";
    if (text.includes("shadow") || text.includes("night") || text.includes("drain")) return "shadow";
    if (text.includes("heal") || text.includes("warm") || text.includes("bloom")) return "heal";
    if (text.includes("shield") || text.includes("parry") || text.includes("guard") || text.includes("barkskin")) return "shield";
    if (text.includes("combo")) return "combo";
    if (text.includes("fire") || text.includes("ember") || text.includes("flame") || text.includes("dragon")) return "fire";
    return "slash";
  }

  function attackCinematic(kind = "slash", label = "Attack") {
    kind = inferAttackKind(kind, label);
    meta.animationPreviews = Number(meta.animationPreviews || 0) + 1;
    saveMeta();

    const old = $("v19Cinematic");
    if (old) old.remove();

    const root = d.createElement("div");
    root.id = "v19Cinematic";
    root.className = `v19-cine ${kind}`;
    const particles = Array.from({ length: 16 }, (_, i) => `<span style="--i:${i}"></span>`).join("");
    const title = `${icons[kind] || "✨"} ${label || kind}`;
    root.innerHTML = `
      <div class="v19-cine-stage">
        <div class="v19-cine-title">${htmlEscape(title)}</div>
        <div class="v19-particles">${particles}</div>
        <div class="v19-object"></div>
      </div>
    `;
    d.body.appendChild(root);

    const soundMap = { slash: "slash", fire: "fire", lightning: "lightning", ice: "ice", poison: "poison", shadow: "shadow", heal: "heal", shield: "shield", meteor: "meteor", nova: "nova", combo: "combo", boss: "boss" };
    playSound(soundMap[kind] || "attack");
    setTimeout(() => root.remove(), 920);
  }

  function installBattleEnhancers() {
    const arena = $("arena");
    if (arena && !$("v19BattleCoach")) {
      const coach = d.createElement("div");
      coach.id = "v19BattleCoach";
      coach.className = "v19-battle-coach";
      coach.textContent = "Tip: Use Shield before boss warnings. Use Home if you get lost.";
      arena.appendChild(coach);
    }
  }

  function updateBattleCoach() {
    const coach = $("v19BattleCoach");
    const enemy = ($("enemyName")?.textContent || "").toLowerCase();
    if (!coach) return;
    if (enemy.includes("king")) coach.textContent = "👑 Boss tip: Goblin King charges big hits. Shield before Royal Smash.";
    else if (enemy.includes("dragon")) coach.textContent = "🐉 Boss tip: Poison stacks. Heal early and burst during weakness.";
    else if (enemy.includes("storm") || enemy.includes("titan")) coach.textContent = "⚡ Boss tip: If lightning charges, defend next turn.";
    else if (enemy.includes("void")) coach.textContent = "👁️ Boss tip: Void gets stronger. Use ultimate sooner.";
    else coach.textContent = "Tip: Build combo, save mana, and choose upgrades that match your class.";
  }

  function handleAction(action) {
    if (action === "home") return goHome();
    if (action === "close") return closeOverlay();
    if (action === "howto") return renderHowTo();
    if (action === "animationLab") return renderAnimationLab();
    if (action === "bossCoach") return renderBossCoach();
    if (action === "funhub") return renderFunHub();
    if (action === "daily") return claimDaily();
    if (action === "stable") {
      if (window.EMXV17ButtonDoctor?.openStableMenu) return window.EMXV17ButtonDoctor.openStableMenu();
      return toast("Stable Menu is already handled by the tap doctor.");
    }
  }

  function handleClick(event) {
    const actionBtn = event.target.closest("[data-v19-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.v19Action;
      if (action) {
        event.preventDefault();
        event.stopPropagation();
        handleAction(action);
        return;
      }
    }

    const anim = event.target.closest("[data-v19-anim]");
    if (anim) {
      event.preventDefault();
      attackCinematic(anim.dataset.v19Anim, anim.textContent.trim().split("\n")[0]);
      return;
    }

    const game = event.target.closest("[data-v19-game]");
    if (game) {
      event.preventDefault();
      const name = game.dataset.v19Game;
      if (name === "catch") startCatch();
      if (name === "memory") startMemory();
      if (name === "dodge") startDodge();
      if (name === "wheel") spinWheel();
      return;
    }

    const catchBtn = event.target.closest("[data-v19-catch]");
    if (catchBtn) {
      event.preventDefault();
      handleCatch(catchBtn);
      return;
    }

    const memoryBtn = event.target.closest("[data-v19-memory]");
    if (memoryBtn) {
      event.preventDefault();
      handleMemory(memoryBtn.dataset.v19Memory);
      return;
    }

    const dodgeBtn = event.target.closest("[data-v19-dodge]");
    if (dodgeBtn) {
      event.preventDefault();
      handleDodge(dodgeBtn.dataset.v19Dodge);
      return;
    }
  }

  function handlePowerTap(event) {
    const btn = event.target.closest(".action-btn[data-power]");
    if (!btn || btn.disabled) return;
    const label = btn.textContent || btn.dataset.power || "Attack";
    // Slight delay lets the actual attack state change first; the cinematic is visual-only.
    setTimeout(() => attackCinematic(btn.dataset.power, label), 35);
  }

  function patchMultiplayerLinkHome() {
    if (!d.body.classList.contains("v19-mp") && d.querySelector(".mp-app")) {
      d.body.classList.add("v19-mp");
      if (!$('v19MpHome')) {
        const a = d.createElement("a");
        a.id = "v19MpHome";
        a.className = "v19-home-button";
        a.href = "index.html";
        a.innerHTML = "🏠 <span>Home</span>";
        d.body.appendChild(a);
      }
    }
  }

  function markVersion() {
    qsa(".version-chip").forEach((chip) => { chip.textContent = "Live Build"; });
    const sub = d.querySelector(".brand-title-card .subtitle");
    if (sub) sub.textContent = "Campaign zones, EMX City, pets, gear, arcade games, multiplayer, and cinematic combat.";
    const doctor = $("v18DoctorCard");
    if (doctor && !doctor.dataset.v19Updated) {
      doctor.dataset.v19Updated = "1";
      const eyebrow = doctor.querySelector(".eyebrow");
      const h2 = doctor.querySelector("h2");
      const p = doctor.querySelector("p:not(.eyebrow)");
      if (eyebrow) eyebrow.textContent = "v19 Button System";
      if (h2) h2.textContent = "Buttons stable + new Home";
      if (p) p.textContent = "Use the floating Home button when you are inside another tab or panel. Scrolling should stay safe.";
    }
  }

  function boot() {
    installHomeButton();
    installStartCard();
    installBattleEnhancers();
    markVersion();
    updateStats();
    markPosition();
    patchMultiplayerLinkHome();
    setInterval(() => {
      installHomeButton();
      installStartCard();
      installBattleEnhancers();
      updateBattleCoach();
      markVersion();
      updateStats();
      markPosition();
    }, 1200);
    setTimeout(() => toast("Live Build loaded"), 1500);
  }

  d.addEventListener("click", handleClick, false);
  d.addEventListener("click", handlePowerTap, true);
  d.addEventListener("scroll", markPosition, { passive: true });

  window.EMXV19 = {
    goHome,
    openHowTo: renderHowTo,
    openFunHub: renderFunHub,
    openAnimationLab: renderAnimationLab,
    openBossCoach: renderBossCoach,
    attackCinematic,
    claimDaily,
    closeOverlay,
    award
  };

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
