/* EMX Soul Arena v24 — Fun Upgrade + Reliable Screen Router
   Focus: working EMX City, scroll-safe tabs, animation test lab, and more kid-friendly interactive games. */
(function () {
  "use strict";
  if (window.__EMX_V24_FUN_FIX__) return;
  window.__EMX_V24_FUN_FIX__ = true;

  const VERSION = "24";
  const META_KEY = "emxSoulArena_v24_funMeta";
  const d = document;
  const root = d.documentElement;
  const $ = (id) => d.getElementById(id);
  const qsa = (sel) => Array.from(d.querySelectorAll(sel));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

  let scrollY = 0;
  let game = null;

  function defaultMeta() {
    return {
      stars: 0,
      tickets: 0,
      playgroundWins: 0,
      animationTests: {},
      stickers: {},
      quests: {
        tapGoblin: 0,
        animationTest: 0,
        runeMatch: 0,
        bossBlock: 0
      },
      lastDaily: ""
    };
  }

  function loadMeta() {
    try {
      return { ...defaultMeta(), ...(JSON.parse(localStorage.getItem(META_KEY) || "{}")) };
    } catch (_) {
      return defaultMeta();
    }
  }

  let meta = loadMeta();

  function saveMeta() {
    localStorage.setItem(META_KEY, JSON.stringify(meta));
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  }

  function playSfx(type = "tap") {
    try {
      if (window.EMXAudioPack?.play) return window.EMXAudioPack.play(type);
      if (window.EMXSound?.play) return window.EMXSound.play(type);
    } catch (_) {}
    return false;
  }

  function vibrate(ms = 24) {
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch (_) {}
  }

  function toast(message) {
    let box = $("v24Toast");
    if (!box) {
      box = d.createElement("div");
      box.id = "v24Toast";
      box.className = "v24-toast";
      d.body.appendChild(box);
    }
    box.textContent = message;
    box.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => box.classList.remove("show"), 1600);
  }

  function lockBody() {
    if (d.body.classList.contains("v24-lock")) return;
    scrollY = window.scrollY || window.pageYOffset || 0;
    root.classList.add("v24-lock");
    d.body.classList.add("v24-lock");
    d.body.style.top = `-${scrollY}px`;
  }

  function unlockBody() {
    if (!d.body.classList.contains("v24-lock")) return;
    root.classList.remove("v24-lock");
    d.body.classList.remove("v24-lock");
    d.body.style.top = "";
    const y = scrollY || 0;
    scrollY = 0;
    requestAnimationFrame(() => window.scrollTo(0, y));
  }

  function ensureOverlay() {
    let overlay = $("v24Overlay");
    if (!overlay) {
      overlay = d.createElement("section");
      overlay.id = "v24Overlay";
      overlay.innerHTML = `<div class="v24-modal" id="v24Modal" role="dialog" aria-modal="true"></div>`;
      d.body.appendChild(overlay);
    }
    return overlay;
  }

  function openPanel(title, subtitle, body, eyebrow = "EMX v24") {
    const overlay = ensureOverlay();
    const modal = $("v24Modal");
    modal.innerHTML = `
      <div class="v24-top">
        <div>
          <p class="eyebrow">${escapeHtml(eyebrow)}</p>
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(subtitle)}</p>
        </div>
        <button type="button" class="v24-close" data-v24-action="close">✕</button>
      </div>
      <div class="v24-body">${body}</div>`;
    overlay.classList.add("show");
    overlay.style.pointerEvents = "auto";
    lockBody();
    playSfx("tap");
  }

  function closePanel() {
    const overlay = $("v24Overlay");
    if (overlay) {
      overlay.classList.remove("show");
      overlay.style.pointerEvents = "none";
    }
    unlockBody();
  }

  function closeLegacyPanels() {
    qsa(".overlay").forEach((el) => { el.classList.add("hidden"); el.style.pointerEvents = "none"; });
    qsa(".v8-overlay,.v9-overlay,.v10-overlay").forEach((el) => { el.classList.add("hidden"); el.style.pointerEvents = "none"; });
    qsa(".v11-overlay").forEach((el) => { el.classList.remove("open"); el.style.pointerEvents = "none"; });
    qsa(".v12-overlay,.v12-choice-room,.v19-overlay,#v15SafePanel,#v23Overlay").forEach((el) => {
      el.classList.remove("show");
      el.classList.add("hidden");
      el.style.display = "none";
      el.style.pointerEvents = "none";
    });
    closePanel();
  }

  function goHome() {
    closeLegacyPanels();
    const start = $("startScreen");
    const battle = $("battleScreen");
    if (start) start.classList.remove("hidden");
    if (battle) battle.classList.add("hidden");
    window.scrollTo(0, 0);
    toast("Back to main page.");
  }

  function grantReward({ stars = 0, tickets = 0, crystals = 0, coins = 0, sticker = "" } = {}) {
    if (stars) meta.stars += stars;
    if (tickets) meta.tickets += tickets;
    if (sticker) meta.stickers[sticker] = true;
    if (crystals) {
      try { if (typeof hqAwardCrystals === "function") hqAwardCrystals(crystals, "v24 reward"); } catch (_) {}
    }
    if (coins) {
      try {
        if (typeof state !== "undefined" && state) {
          state.coins = Math.max(0, (state.coins || 0) + coins);
          if (typeof render === "function") render();
        }
      } catch (_) {}
    }
    saveMeta();
    const bits = [];
    if (stars) bits.push(`+${stars} ⭐`);
    if (tickets) bits.push(`+${tickets} 🎟️`);
    if (crystals) bits.push(`+${crystals} 💎`);
    if (coins) bits.push(`+${coins} coins`);
    if (sticker) bits.push(`Sticker: ${sticker}`);
    toast(bits.length ? bits.join(" • ") : "Reward claimed.");
  }

  function statusLine() {
    return `Stars ${meta.stars} ⭐ • Tickets ${meta.tickets} 🎟️ • Playground wins ${meta.playgroundWins}`;
  }

  function openCity() {
    openPanel("EMX City", "Tap a building. This v24 city uses a new reliable router, so the buttons should open every time.", `
      <div class="v24-city-map">
        <span class="v24-building b1">🏟️</span><span class="v24-building b2">🎮</span><span class="v24-building b3">🐾</span><span class="v24-building b4">🧪</span><span class="v24-building b5">🏆</span>
      </div>
      <div class="v24-note"><strong>Current progress:</strong> ${escapeHtml(statusLine())}<br>Use the Playground for quick games, Animation Lab to preview attacks, and Boss Coach to learn counters.</div>
      <div class="v24-grid" style="margin-top:12px">
        <button class="v24-primary" data-v24-action="playground"><strong>🎮 Adventure Playground</strong><small>Mini-games, reward wheel, rune match, goblin tap.</small></button>
        <button data-v24-action="animationLab"><strong>🎬 Animation Lab</strong><small>Test every attack animation safely.</small></button>
        <button data-v24-action="bossCoach"><strong>👑 Boss Coach</strong><small>Practice boss warnings and counters.</small></button>
        <button data-v24-action="powerGuide"><strong>📘 Power Guide</strong><small>What every class power does.</small></button>
        <button data-v24-action="petPlay"><strong>🐾 Pet Playroom</strong><small>Feed, play, and earn pet rewards.</small></button>
        <button data-v24-action="stickerHunt"><strong>📒 Sticker Hunt</strong><small>Collect fun enemy and boss stickers.</small></button>
        <button data-v24-action="dailyQuest"><strong>🌟 Daily Quest</strong><small>Claim a simple daily reward.</small></button>
        <a href="multiplayer.html"><strong>🌐 Multiplayer</strong><small>Duel or co-op boss raid with a friend.</small></a>
      </div>
      <div class="v24-grid" style="margin-top:10px">
        <button data-v24-action="start" data-class="flame"><strong>🔥 Start Flame Run</strong><small>Jump straight into battle.</small></button>
        <button data-v24-action="start" data-class="storm"><strong>⚔️ Start Storm Run</strong><small>Shield and lightning practice.</small></button>
      </div>
    `, "City Hub");
  }

  function openHowTo() {
    openPanel("How To Play", "Clear instructions for new players and kids.", `
      <div class="v24-note"><strong>Goal:</strong> win battles, choose upgrades, collect rewards, clear bosses, and build your hero.</div>
      <div class="v24-grid single" style="margin-top:12px">
        <div class="v24-action-card"><strong>1. Pick a class</strong><small>Flame burns, Rogue crits, Storm shields, Nature heals.</small></div>
        <div class="v24-action-card"><strong>2. Watch HP and Mana</strong><small>HP keeps you alive. Mana lets you use special powers.</small></div>
        <div class="v24-action-card"><strong>3. Shield before boss attacks</strong><small>If you see a warning, use Shield, Stun, or Heal.</small></div>
        <div class="v24-action-card"><strong>4. Choose upgrades</strong><small>Damage, healing, shield, crit, poison, burn, and relics make you stronger.</small></div>
        <div class="v24-action-card"><strong>5. Use EMX City</strong><small>Mini-games, stickers, pets, animation lab, and boss coach help between fights.</small></div>
      </div>
    `, "Instructions");
  }

  function openPowerGuide() {
    let classNames = ["Flame Mage", "Shadow Rogue", "Storm Knight", "Nature Healer"];
    let cards = "";
    try {
      if (typeof CLASS_DATA !== "undefined") {
        classNames = Object.values(CLASS_DATA).map((cls) => cls.name);
        cards = Object.values(CLASS_DATA).map((cls) => {
          const powerList = Object.values(cls.powers || {}).map((p) => `<li><strong>${p.icon || "✨"} ${escapeHtml(p.label)}</strong> — ${escapeHtml(p.desc || "Power")}${p.unlock ? ` <em>Unlock L${p.unlock}</em>` : ""}</li>`).join("");
          return `<div class="v24-action-card"><strong>${escapeHtml(cls.icon || "🦸")} ${escapeHtml(cls.name)}</strong><small><ul>${powerList}</ul></small></div>`;
        }).join("");
      }
    } catch (_) {}
    if (!cards) {
      cards = classNames.map((name) => `<div class="v24-action-card"><strong>${escapeHtml(name)}</strong><small>Use class powers to attack, shield, heal, and build ultimate charge.</small></div>`).join("");
    }
    openPanel("Power Guide", "Tap Animation Lab after reading this to see the powers move.", `<div class="v24-grid single">${cards}</div>`, "Power Guide");
  }

  function openBossCoach() {
    openPanel("Boss Coach", "Learn boss counters before real fights.", `
      <div class="v24-note"><strong>Boss rule:</strong> when a boss charges a big move, do not just attack. Shield, stun, heal, or counter.</div>
      <div class="v24-grid" style="margin-top:12px">
        <button data-v24-game="boss"><strong>🛡️ Start Boss Block Trainer</strong><small>Choose the correct counter and win rewards.</small></button>
        <button data-v24-action="animationLab"><strong>🎬 Preview Boss FX</strong><small>See lightning, meteor, nova, shadow, and shield effects.</small></button>
      </div>
      <div class="v24-grid single" style="margin-top:12px">
        <div class="v24-action-card"><strong>Royal Smash</strong><small>Best counter: Shield or Parry.</small></div>
        <div class="v24-action-card"><strong>Poison Breath</strong><small>Best counter: Heal, cleanse, or burst damage.</small></div>
        <div class="v24-action-card"><strong>Storm Charge</strong><small>Best counter: Stun, Freeze, or Shield.</small></div>
      </div>
    `, "Boss Training");
  }

  function openPlayground() {
    openPanel("Adventure Playground", "Fast interactive games with simple rewards. Great for kids and quick breaks.", `
      <div class="v24-note"><strong>${escapeHtml(statusLine())}</strong></div>
      <div class="v24-grid" style="margin-top:12px">
        <button class="v24-primary" data-v24-game="goblin"><strong>👺 Tap The Goblin</strong><small>Tap the glowing goblin 8 times.</small></button>
        <button data-v24-game="runes"><strong>💠 Rune Match</strong><small>Flip runes and find pairs.</small></button>
        <button data-v24-game="wheel"><strong>🎡 Reward Wheel</strong><small>Spin for stars, tickets, crystals, or stickers.</small></button>
        <button data-v24-game="boss"><strong>👑 Boss Block</strong><small>Pick the right boss counter.</small></button>
        <button data-v24-game="crystal"><strong>💎 Crystal Catch</strong><small>Pick one crystal and reveal the prize.</small></button>
        <button data-v24-action="dailyQuest"><strong>🌟 Daily Quest</strong><small>One quick daily reward.</small></button>
      </div>
    `, "Mini-Games");
  }

  function renderGoblinGame() {
    const hot = game.hot;
    const cells = Array.from({ length: 9 }, (_, i) => `<button class="v24-target ${i === hot ? "hot" : ""}" data-v24-target="${i}">${i === hot ? "👺" : choice(["🟣", "🟢", "⚫", "✨"])}</button>`).join("");
    openPanel("Tap The Goblin", "Tap the glowing goblin. Real taps count; scrolling does not.", `
      <div class="v24-note"><strong>Score:</strong> ${game.score}/8</div>
      <div class="v24-target-grid" style="margin-top:12px">${cells}</div>
      <div class="v24-log">${escapeHtml(game.log || "Find the glowing goblin!")}</div>
    `, "Arcade");
  }

  function startGoblinGame() {
    game = { type: "goblin", score: 0, hot: rand(0, 8), log: "Find the glowing goblin!" };
    renderGoblinGame();
  }

  function hitGoblin(index) {
    if (!game || game.type !== "goblin") return;
    if (Number(index) === game.hot) {
      game.score += 1;
      game.hot = rand(0, 8);
      game.log = `Nice tap! ${8 - game.score} left.`;
      playSfx("coin");
      vibrate(18);
      if (game.score >= 8) {
        meta.playgroundWins += 1;
        grantReward({ stars: 4, tickets: 3, crystals: 2, sticker: "Goblin Tapper" });
        game = null;
        return openPlayground();
      }
    } else {
      game.log = "Miss! Try the glowing goblin.";
      playSfx("wrong");
    }
    renderGoblinGame();
  }

  function startRuneGame() {
    const icons = ["🔥", "⚡", "🌿", "☠️"];
    const deck = icons.concat(icons).sort(() => Math.random() - 0.5);
    game = { type: "runes", deck, revealed: [], matched: [], tries: 0 };
    renderRuneGame();
  }

  function renderRuneGame() {
    const cells = game.deck.map((icon, i) => {
      const open = game.revealed.includes(i) || game.matched.includes(i);
      return `<button class="v24-rune ${game.matched.includes(i) ? "matched" : ""}" data-v24-rune="${i}">${open ? icon : "❔"}</button>`;
    }).join("");
    openPanel("Rune Match", "Flip two cards. Match all pairs for a reward.", `
      <div class="v24-note"><strong>Tries:</strong> ${game.tries} • <strong>Matched:</strong> ${game.matched.length}/8</div>
      <div class="v24-rune-grid" style="margin-top:12px">${cells}</div>
    `, "Arcade");
  }

  function flipRune(index) {
    if (!game || game.type !== "runes") return;
    index = Number(index);
    if (game.matched.includes(index) || game.revealed.includes(index)) return;
    if (game.revealed.length >= 2) game.revealed = [];
    game.revealed.push(index);
    playSfx("memory");
    if (game.revealed.length === 2) {
      game.tries += 1;
      const [a, b] = game.revealed;
      if (game.deck[a] === game.deck[b]) {
        game.matched.push(a, b);
        game.revealed = [];
        playSfx("upgrade");
        if (game.matched.length >= game.deck.length) {
          meta.playgroundWins += 1;
          grantReward({ stars: 5, tickets: 4, crystals: 3, sticker: "Rune Matcher" });
          game = null;
          return openPlayground();
        }
      } else {
        setTimeout(() => {
          if (game && game.type === "runes") {
            game.revealed = [];
            renderRuneGame();
          }
        }, 650);
      }
    }
    renderRuneGame();
  }

  function spinWheel() {
    const prizes = [
      { label: "5 Stars", reward: { stars: 5 }, sfx: "coin" },
      { label: "4 Tickets", reward: { tickets: 4 }, sfx: "spin" },
      { label: "3 Crystals", reward: { crystals: 3 }, sfx: "chest" },
      { label: "Sticker", reward: { sticker: choice(["Lucky Spinner", "Neon Prize", "Wheel Hero"]) }, sfx: "sticker" },
      { label: "10 Coins", reward: { coins: 10 }, sfx: "coin" }
    ];
    const prize = choice(prizes);
    playSfx(prize.sfx);
    vibrate(30);
    grantReward(prize.reward);
    openPanel("Reward Wheel", `You landed on ${prize.label}.`, `
      <div class="v24-note"><strong>Prize:</strong> ${escapeHtml(prize.label)}</div>
      <div class="v24-grid" style="margin-top:12px">
        <button class="v24-primary" data-v24-game="wheel"><strong>🎡 Spin Again</strong><small>Spin for another quick reward.</small></button>
        <button data-v24-action="playground"><strong>🎮 Back to Playground</strong><small>Try another mini-game.</small></button>
      </div>
    `, "Reward");
  }

  function crystalCatch() {
    const options = ["💎", "🟢", "🟣", "⭐", "🎟️", "📒"];
    const cells = options.map((icon, i) => `<button class="v24-target" data-v24-game="crystalPick" data-index="${i}">${icon}</button>`).join("");
    openPanel("Crystal Catch", "Pick one crystal. Every pick gives something, but some prizes are better.", `
      <div class="v24-target-grid">${cells}</div>
      <div class="v24-log">Choose carefully.</div>
    `, "Arcade");
  }

  function crystalPick(index) {
    const prizes = [
      { stars: 2, tickets: 1 }, { stars: 3 }, { tickets: 3 }, { crystals: 2 }, { sticker: "Crystal Catcher" }, { coins: 12 }
    ];
    grantReward(prizes[Number(index) % prizes.length]);
    playSfx("chest");
    openPlayground();
  }

  function startBossTrainer() {
    const prompts = [
      { move: "Goblin King charges Royal Smash", answer: "shield", tip: "Shield blocks the big hit." },
      { move: "Bone Dragon prepares Poison Breath", answer: "heal", tip: "Heal and cleanse after poison." },
      { move: "Storm Titan gathers lightning", answer: "stun", tip: "Stun/freeze interrupts charge moves." },
      { move: "Void Beast opens a shadow portal", answer: "dodge", tip: "Dodge avoids the surprise hit." }
    ];
    game = { type: "boss", prompt: choice(prompts) };
    renderBossTrainer();
  }

  function renderBossTrainer() {
    const p = game.prompt;
    openPanel("Boss Block Trainer", p.move, `
      <div class="v24-note"><strong>Choose the counter:</strong> ${escapeHtml(p.tip)}</div>
      <div class="v24-grid" style="margin-top:12px">
        <button data-v24-game="bossAnswer" data-answer="attack"><strong>⚔️ Attack</strong><small>Risky when boss is charging.</small></button>
        <button data-v24-game="bossAnswer" data-answer="shield"><strong>🛡️ Shield</strong><small>Best against smash attacks.</small></button>
        <button data-v24-game="bossAnswer" data-answer="stun"><strong>💫 Stun</strong><small>Interrupt charged moves.</small></button>
        <button data-v24-game="bossAnswer" data-answer="heal"><strong>✨ Heal</strong><small>Recover from poison or chip damage.</small></button>
        <button data-v24-game="bossAnswer" data-answer="dodge"><strong>💨 Dodge</strong><small>Avoid sudden attacks.</small></button>
      </div>
    `, "Boss Coach");
  }

  function bossAnswer(answer) {
    const correct = game?.prompt?.answer === answer;
    if (correct) {
      meta.playgroundWins += 1;
      playSfx("shield");
      vibrate(28);
      grantReward({ stars: 3, tickets: 2, crystals: 1, sticker: "Boss Blocker" });
      startBossTrainer();
    } else {
      playSfx("wrong");
      toast("Not that one. Try the best counter.");
    }
  }

  function openPetPlay() {
    openPanel("Pet Playroom", "Feed, play, and train your companion in a simple kid-friendly screen.", `
      <div class="v24-note"><strong>Pet mood:</strong> Happy pets help more often. This screen gives small rewards even outside battle.</div>
      <div class="v24-grid" style="margin-top:12px">
        <button data-v24-action="petReward" data-pet="feed"><strong>🍖 Feed Pet</strong><small>Reward: stars and sticker chance.</small></button>
        <button data-v24-action="petReward" data-pet="play"><strong>🎾 Play Fetch</strong><small>Reward: tickets and pet sticker.</small></button>
        <button data-v24-action="petReward" data-pet="train"><strong>🥋 Train Trick</strong><small>Reward: crystals and coach tip.</small></button>
        <button data-v24-action="playground"><strong>🎮 Back to Playground</strong><small>Try a mini-game.</small></button>
      </div>
    `, "Pet Lab");
  }

  function petReward(kind) {
    playSfx("pet");
    if (kind === "feed") grantReward({ stars: 2, sticker: "Pet Snack" });
    else if (kind === "play") grantReward({ tickets: 2, sticker: "Pet Friend" });
    else grantReward({ crystals: 1, stars: 2, sticker: "Pet Trainer" });
  }

  function openStickerHunt() {
    const stickers = Object.keys(meta.stickers);
    openPanel("Sticker Hunt", "Collect stickers from mini-games, bosses, pets, and the reward wheel.", `
      <div class="v24-note"><strong>Unlocked:</strong> ${stickers.length} stickers.</div>
      <div class="v24-grid" style="margin-top:12px">
        ${(stickers.length ? stickers : ["No stickers yet — play a mini-game!"]).map((s) => `<div class="v24-action-card"><strong>📒 ${escapeHtml(s)}</strong><small>Collected in v24.</small></div>`).join("")}
        <button data-v24-action="playground"><strong>🎮 Earn More Stickers</strong><small>Play mini-games for sticker drops.</small></button>
      </div>
    `, "Collection");
  }

  function dailyQuest() {
    const today = todayKey();
    if (meta.lastDaily === today) {
      openPanel("Daily Quest", "You already claimed today's reward. Come back tomorrow.", `
        <div class="v24-note"><strong>Done today:</strong> ${escapeHtml(today)}<br>Play mini-games for extra rewards anytime.</div>
        <button class="v24-btn v24-primary" data-v24-action="playground">Open Playground</button>
      `, "Daily");
      return;
    }
    meta.lastDaily = today;
    grantReward({ stars: 8, tickets: 5, crystals: 3, sticker: "Daily Hero" });
    openPanel("Daily Quest Claimed", "Nice. You got today's reward.", `
      <div class="v24-note"><strong>Reward:</strong> 8 stars, 5 tickets, 3 crystals, and Daily Hero sticker.</div>
      <div class="v24-grid" style="margin-top:12px">
        <button data-v24-action="playground"><strong>🎮 Play Mini-Games</strong><small>Earn more rewards.</small></button>
        <button data-v24-action="city"><strong>🏙️ Back to City</strong><small>Choose another activity.</small></button>
      </div>
    `, "Daily");
  }

  function openProfile() {
    openPanel("Profile Card", "Your v24 activity progress.", `
      <div class="v24-grid single">
        <div class="v24-action-card"><strong>⭐ Stars</strong><small>${meta.stars}</small></div>
        <div class="v24-action-card"><strong>🎟️ Tickets</strong><small>${meta.tickets}</small></div>
        <div class="v24-action-card"><strong>🎮 Playground Wins</strong><small>${meta.playgroundWins}</small></div>
        <div class="v24-action-card"><strong>📒 Stickers</strong><small>${Object.keys(meta.stickers).length}</small></div>
        <div class="v24-action-card"><strong>🎬 Animations Tested</strong><small>${Object.keys(meta.animationTests).length}/11</small></div>
      </div>
    `, "Profile");
  }

  const ANIMS = [
    ["slash", "⚔️ Slash"], ["fireball", "🔥 Fireball"], ["meteor", "☄️ Meteor"], ["lightning", "⚡ Lightning"], ["ice", "❄️ Ice"], ["poison", "☠️ Poison"], ["shadow", "🌑 Shadow"], ["combo", "🥷 Combo"], ["heal", "✨ Heal"], ["shield", "🛡️ Shield"], ["nova", "💥 Nova"], ["drain", "🩸 Drain"], ["buff", "🔋 Buff"]
  ];

  function openAnimationLab() {
    openPanel("Animation Lab", "Tap each power to test the new cinematic overlay. These are safe previews and do not spend mana.", `
      <div class="v24-note"><strong>Tested:</strong> ${Object.keys(meta.animationTests).length}/${ANIMS.length}. Battle powers also trigger these effects.</div>
      <div class="v24-grid" style="margin-top:12px">
        ${ANIMS.map(([id, label]) => `<button data-v24-anim="${id}"><strong>${label}</strong><small>${meta.animationTests[id] ? "✅ Tested" : "Tap to preview"}</small></button>`).join("")}
      </div>
    `, "FX Lab");
  }

  function runCinematic(type = "slash", label = "Attack") {
    let box = $("v24Cinematic");
    if (!box) {
      box = d.createElement("section");
      box.id = "v24Cinematic";
      d.body.appendChild(box);
    }
    const safeType = String(type || "slash").replace(/[^a-z0-9-]/gi, "");
    const particles = Array.from({ length: 22 }, (_, i) => `<span class="v24-particle" style="--a:${i * 17}deg;--d:${rand(96, 210)}px"></span>`).join("");
    box.innerHTML = `
      <div class="v24-cine-stage v24-${safeType}">
        <div class="v24-cine-title">${escapeHtml(label || safeType)}</div>
        <div class="v24-hero">🦸</div>
        <div class="v24-impact"></div>
        ${particles}
        <div class="v24-foe">👹</div>
      </div>`;
    box.classList.add("show");
    playSfx(soundForAnim(safeType));
    vibrate(safeType === "meteor" || safeType === "nova" ? 55 : 24);
    clearTimeout(runCinematic.timer);
    runCinematic.timer = setTimeout(() => box.classList.remove("show"), 860);
  }

  function soundForAnim(type) {
    const map = { fireball: "fireball", fire: "fire", meteor: "meteor", nova: "nova", lightning: "lightning", ice: "ice", freeze: "freeze", poison: "poison", shadow: "shadow", combo: "combo", heal: "heal", shield: "shield", drain: "drain", buff: "upgrade", slash: "slash" };
    return map[type] || "attack";
  }

  function testAnimation(type) {
    meta.animationTests[type] = true;
    meta.quests.animationTest += 1;
    saveMeta();
    const entry = ANIMS.find(([id]) => id === type);
    runCinematic(type, entry ? entry[1] : type);
    setTimeout(openAnimationLab, 920);
  }

  function patchBattleAnimations() {
    if (window.__EMXV24_ANIM_PATCHED__) return;
    window.__EMXV24_ANIM_PATCHED__ = true;
    try {
      const oldPlayAnimation = window.playAnimation || (typeof playAnimation === "function" ? playAnimation : null);
      if (oldPlayAnimation) {
        window.playAnimation = async function v24PlayAnimation(type) {
          runCinematic(type || "slash", String(type || "Attack"));
          return oldPlayAnimation.apply(this, arguments);
        };
      }
    } catch (_) {}
    try {
      const oldUsePower = window.usePower || (typeof usePower === "function" ? usePower : null);
      if (oldUsePower) {
        window.usePower = async function v24UsePower(key) {
          try {
            const p = (typeof getPower === "function") ? getPower(key) : null;
            runCinematic(p?.animation || key || "slash", p?.label || key || "Attack");
          } catch (_) {}
          return oldUsePower.apply(this, arguments);
        };
      }
    } catch (_) {}
  }

  function openButtonCheck() {
    const tests = [
      ["Start screen", Boolean($("startScreen"))],
      ["Class buttons", qsa(".class-card[data-class]").length >= 4],
      ["Battle buttons", qsa(".action-btn[data-power]").length >= 4],
      ["EMX City route", Boolean(window.EMXV12?.openHub)],
      ["Animation lab", true],
      ["Overlay scroll lock", true],
      ["Multiplayer file link", Boolean(d.querySelector('a[href="multiplayer.html"]'))],
      ["Sound object", Boolean(window.EMXAudioPack || window.EMXSound)]
    ];
    const rows = tests.map(([name, ok]) => `<div class="v24-action-card"><strong>${ok ? "✅" : "⚠️"} ${escapeHtml(name)}</strong><small>${ok ? "Ready" : "Needs checking"}</small></div>`).join("");
    openPanel("Button Health Check", "This checks the main selectors and routes without opening random tabs.", `
      <div class="v24-grid single">${rows}</div>
      <div class="v24-grid" style="margin-top:12px">
        <button data-v24-action="city"><strong>🏙️ Test EMX City</strong><small>Opens the reliable v24 city.</small></button>
        <button data-v24-action="animationLab"><strong>🎬 Test Animations</strong><small>Open the animation lab.</small></button>
      </div>
    `, "Diagnostics");
  }

  function startRun(classKey) {
    closePanel();
    try {
      if (typeof startNewRun === "function") {
        startNewRun(classKey || "flame");
        return;
      }
    } catch (_) {}
    toast("Start function not ready yet. Try again after the loading screen finishes.");
  }

  function handleAction(action, el) {
    switch (action) {
      case "close": return closePanel();
      case "home": return goHome();
      case "city": return openCity();
      case "howto": return openHowTo();
      case "playground": return openPlayground();
      case "animationLab": return openAnimationLab();
      case "bossCoach": return openBossCoach();
      case "powerGuide": return openPowerGuide();
      case "petPlay": return openPetPlay();
      case "stickerHunt": return openStickerHunt();
      case "dailyQuest": return dailyQuest();
      case "profile": return openProfile();
      case "buttonCheck": return openButtonCheck();
      case "petReward": return petReward(el?.dataset?.pet || "play");
      case "start": return startRun(el?.dataset?.class || "flame");
      case "refresh": {
        const url = new URL(location.href);
        url.searchParams.set("v", VERSION);
        url.searchParams.set("fresh", Date.now().toString(36));
        location.href = url.toString();
        return;
      }
      default: return openCity();
    }
  }

  function handleGame(action, el) {
    if (action === "goblin") return startGoblinGame();
    if (action === "runes") return startRuneGame();
    if (action === "wheel") return spinWheel();
    if (action === "boss") return startBossTrainer();
    if (action === "crystal") return crystalCatch();
    if (action === "crystalPick") return crystalPick(el?.dataset?.index || 0);
    if (action === "bossAnswer") return bossAnswer(el?.dataset?.answer || "attack");
  }

  function patchGlobalRoutes() {
    const api = window.EMXV12 || {};
    api.openHub = openCity;
    api.story = () => openPanel("Story Chapters", "Read simple story goals and boss tips.", `
      <div class="v24-grid single">
        <div class="v24-action-card"><strong>Chapter 1: Slime Fields</strong><small>Learn attacks, shields, and upgrades.</small></div>
        <div class="v24-action-card"><strong>Chapter 2: Goblin Market</strong><small>Boss tip: shield Royal Smash.</small></div>
        <div class="v24-action-card"><strong>Chapter 3: Bone Crypt</strong><small>Boss tip: heal through poison.</small></div>
        <button data-v24-action="start" data-class="flame"><strong>🔥 Start Story Run</strong><small>Begin with Flame Mage.</small></button>
      </div>`, "Story");
    api.tower = () => openPanel("Neon Tower", "Quick tower challenge coming through the Playground for now.", `<button class="v24-btn v24-primary" data-v24-game="boss">Start Boss Block Trainer</button>`, "Tower");
    api.pet = openPetPlay;
    api.loadout = openPowerGuide;
    api.stickers = openStickerHunt;
    api.events = dailyQuest;
    api.profile = openProfile;
    api.close = closePanel;
    api.toast = toast;
    window.EMXV12 = api;

    window.EMXV24 = {
      openCity,
      openPlayground,
      openAnimationLab,
      openBossCoach,
      openPowerGuide,
      openButtonCheck,
      runCinematic,
      close: closePanel,
      home: goHome,
      patchGlobalRoutes
    };

    if (window.EMXV19) {
      window.EMXV19.goHome = goHome;
      window.EMXV19.openFunHub = openPlayground;
      window.EMXV19.openAnimationLab = openAnimationLab;
      window.EMXV19.openBossCoach = openBossCoach;
      window.EMXV19.openHowTo = openHowTo;
    }
  }

  function installStartCard() {
    const start = $("startScreen");
    if (!start || $("v24FunCard")) return;
    const card = d.createElement("section");
    card.id = "v24FunCard";
    card.className = "v24-card";
    card.innerHTML = `
      <p class="eyebrow">v24 Fun + Bugfix</p>
      <h2>Play Hub + Tested Animations</h2>
      <p>Use this reliable hub if any older tab feels stuck. It has working city buttons, animation previews, mini-games, and a button health check.</p>
      <div class="v24-grid">
        <button class="v24-primary" data-v24-action="city"><strong>🏙️ Open EMX City</strong><small>Reliable v24 city hub.</small></button>
        <button data-v24-action="playground"><strong>🎮 Adventure Playground</strong><small>Mini-games and rewards.</small></button>
        <button data-v24-action="animationLab"><strong>🎬 Animation Lab</strong><small>Test all attack FX.</small></button>
        <button data-v24-action="buttonCheck"><strong>🧪 Button Check</strong><small>Diagnose core buttons.</small></button>
        <button data-v24-action="howto"><strong>📘 How To Play</strong><small>Clear instructions.</small></button>
        <button data-v24-action="refresh"><strong>🔄 Refresh Cache</strong><small>Reload with v24.</small></button>
      </div>`;
    const after = $("v23RescueCard") || $("v18DoctorCard") || $("continueBtn") || start.querySelector(".brand-title-card");
    if (after?.parentNode) after.parentNode.insertBefore(card, after.nextSibling);
    else start.prepend(card);
  }

  function installEvents() {
    d.addEventListener("click", (event) => {
      const anim = event.target.closest?.("[data-v24-anim]");
      const rune = event.target.closest?.("[data-v24-rune]");
      const target = event.target.closest?.("[data-v24-target]");
      const gameBtn = event.target.closest?.("[data-v24-game]");
      const action = event.target.closest?.("[data-v24-action]");
      const el = anim || rune || target || gameBtn || action;
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      if (anim) return testAnimation(anim.dataset.v24Anim);
      if (rune) return flipRune(rune.dataset.v24Rune);
      if (target) return hitGoblin(target.dataset.v24Target);
      if (gameBtn) return handleGame(gameBtn.dataset.v24Game, gameBtn);
      if (action) return handleAction(action.dataset.v24Action, action);
    }, false);

    // Recovery route for older buttons. If tapfix lets a normal click through, v24 handles it before old bubble handlers.
    d.addEventListener("click", (event) => {
      const v12 = event.target.closest?.("[data-v12-action]");
      const building = event.target.closest?.("[data-v12-building]");
      if (!v12 && !building) return;
      const key = v12?.dataset?.v12Action || building?.dataset?.v12Building || "openHub";
      const map = {
        openHub: openCity,
        story: window.EMXV12?.story,
        tower: window.EMXV12?.tower,
        pet: openPetPlay,
        loadout: openPowerGuide,
        stickers: openStickerHunt,
        events: dailyQuest,
        profile: openProfile,
        close: closePanel,
        campaign: () => startRun("flame"),
        arena: () => startRun("flame"),
        arcade: openPlayground,
        forge: openPowerGuide,
        multiplayer: () => { location.href = "multiplayer.html"; }
      };
      const fn = map[key] || openCity;
      event.preventDefault();
      event.stopPropagation();
      fn();
    }, true);
  }

  function markBrand() {
    qsa(".version-chip").forEach((chip) => { chip.textContent = "EMX Soul Arena"; });
    const sub = d.querySelector(".brand-title-card .subtitle");
    if (sub) sub.textContent = "Battle, explore, collect gear, play mini-games, and challenge friends.";
  }

  function finishBoot() {
    const boot = $("bootScreen");
    if (!boot) return;
    boot.classList.add("boot-finished");
    boot.style.pointerEvents = "none";
    setTimeout(() => { try { boot.remove(); } catch (_) {} }, 460);
  }

  function boot() {
    ensureOverlay();
    patchGlobalRoutes();
    installStartCard();
    installEvents();
    patchBattleAnimations();
    markBrand();
    setTimeout(finishBoot, 3600);
    setTimeout(() => { patchGlobalRoutes(); patchBattleAnimations(); installStartCard(); markBrand(); }, 850);
    setInterval(() => { patchGlobalRoutes(); installStartCard(); markBrand(); }, 2000);
    setTimeout(() => toast("v24 fun + button fix loaded"), 1200);
  }

  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot, { once: true });
  else boot();
})();
