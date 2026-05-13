/* EMX Soul Arena v19 — Home + Fun Pack
   Adds a real Home button, stronger cinematic overlays, clearer instructions,
   and a new interactive Fun Center without disturbing the v18 tap router. */
(function () {
  'use strict';

  if (window.__EMX_V19_HOME_FUN__) return;
  window.__EMX_V19_HOME_FUN__ = true;

  const VERSION = 'v19 Home + Fun Pack';
  const META_KEY = 'emxSoulArenaV19Meta';
  const $ = (id) => document.getElementById(id);
  const q = (sel) => document.querySelector(sel);
  const qa = (sel) => Array.from(document.querySelectorAll(sel));
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  const defaultMeta = {
    tickets: 0,
    crystals: 0,
    badges: [],
    gamesPlayed: 0,
    animationsPreviewed: 0,
    howToRead: false,
    dailyGoalDay: '',
    dailyGoals: {},
    bestReflex: null,
    bestBlock: 0,
    memoryStreak: 0,
    treasureFinds: 0,
    wheelSpins: 0,
    comboBadges: 0
  };

  let meta = loadMeta();
  let activePanel = null;
  let lastCinematicAt = 0;

  function loadMeta() {
    try {
      return { ...defaultMeta, ...(JSON.parse(localStorage.getItem(META_KEY) || '{}') || {}) };
    } catch (error) {
      return { ...defaultMeta };
    }
  }

  function saveMeta() {
    try { localStorage.setItem(META_KEY, JSON.stringify(meta)); } catch (error) {}
  }

  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function safeCall(name, ...args) {
    try {
      const fn = Function('return (typeof ' + name + " === 'function') ? " + name + ' : null')();
      if (typeof fn === 'function') return fn(...args);
    } catch (error) {}
    try {
      if (typeof window[name] === 'function') return window[name](...args);
    } catch (error) {}
    return undefined;
  }

  function toast(message) {
    try {
      if (window.EMXV12?.toast) return window.EMXV12.toast(message);
    } catch (error) {}
    let box = $('emxV19Toast');
    if (!box) {
      box = document.createElement('div');
      box.id = 'emxV19Toast';
      box.className = 'emx-v19-toast';
      document.body.appendChild(box);
    }
    box.textContent = message;
    box.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => box.classList.remove('show'), 1800);
  }

  function sfx(type = 'tap') {
    try {
      if (window.EMXAudioPack?.play) return window.EMXAudioPack.play(type);
      if (window.EMXSound?.play) return window.EMXSound.play(type);
    } catch (error) {}
  }

  function reward({ tickets = 0, crystals = 0, badge = '', message = '' } = {}) {
    if (tickets) meta.tickets += tickets;
    if (crystals) meta.crystals += crystals;
    if (badge && !meta.badges.includes(badge)) meta.badges.push(badge);
    saveMeta();
    refreshStartCard();
    const parts = [];
    if (tickets) parts.push(`🎟️ +${tickets}`);
    if (crystals) parts.push(`💎 +${crystals}`);
    if (badge) parts.push(`🏅 ${badge}`);
    toast(message || parts.join('  ') || 'Reward earned!');
  }

  function hideAllFeaturePanels() {
    // Close known Story/HQ panels first.
    try { window.EMXV12?.close?.(); } catch (error) {}

    // Hide overlays/feature panels that may still be open.
    const selectors = [
      '.overlay:not(.hidden)',
      '.v8-overlay:not(.hidden)',
      '.v9-overlay:not(.hidden)',
      '.v10-overlay:not(.hidden)',
      '.v11-overlay.open',
      '.v12-overlay.show',
      '.v12-choice-room.show',
      '#v15SafePanel.show',
      '#emxV19Panel.show'
    ];
    qa(selectors.join(',')).forEach((el) => {
      if (el.id === 'bootScreen') return;
      if (el.id === 'emxV19Panel') {
        el.classList.remove('show');
        el.style.display = 'none';
        return;
      }
      el.classList.add('hidden');
      el.classList.remove('open', 'show');
      el.style.display = 'none';
      el.style.pointerEvents = 'none';
    });
  }

  function goHome() {
    try { safeCall('saveGame'); } catch (error) {}
    hideAllFeaturePanels();
    const start = $('startScreen');
    const battle = $('battleScreen');
    if (battle) battle.classList.add('hidden');
    if (start) start.classList.remove('hidden');
    document.body.classList.add('emx-v19-home-mode');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast('Home base opened. Your run is saved.');
    sfx('tap');
  }

  function installHomeButton() {
    let btn = $('emxV19HomeButton');
    if (!btn) {
      btn = document.createElement('button');
      btn.id = 'emxV19HomeButton';
      btn.className = 'emx-home-button';
      btn.type = 'button';
      btn.innerHTML = '<span>🏠</span><strong>Home</strong>';
      btn.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
        goHome();
      });
      document.body.appendChild(btn);
    }
    updateHomeVisibility();
  }

  function updateHomeVisibility() {
    const btn = $('emxV19HomeButton');
    if (!btn) return;
    const start = $('startScreen');
    const boot = $('bootScreen');
    const onStart = start && !start.classList.contains('hidden');
    const bootShowing = boot && !boot.classList.contains('boot-finished');
    const panelOpen = activePanel || q('.v12-overlay.show,.v11-overlay.open,.v10-overlay:not(.hidden),.v9-overlay:not(.hidden),.v8-overlay:not(.hidden),.overlay:not(.hidden)');
    btn.classList.toggle('show', !bootShowing && (!onStart || Boolean(panelOpen)));
  }

  function installStartCard() {
    const start = $('startScreen');
    if (!start || $('emxV19StartCard')) return;
    const card = document.createElement('section');
    card.id = 'emxV19StartCard';
    card.className = 'emx-v19-card';
    card.innerHTML = `
      <div class="emx-v19-card-top">
        <div>
          <p class="eyebrow">v19 Update</p>
          <h2>Home + Fun Pack</h2>
          <p class="emx-v19-muted">Clearer instructions, a real Home button, stronger attack animations, and new interactive games.</p>
        </div>
        <div class="emx-v19-wallet"><span>🎟️</span><strong id="emxV19Tickets">0</strong></div>
      </div>
      <div class="emx-v19-actions">
        <button type="button" data-v19-open="guide">📘 How to Play</button>
        <button type="button" data-v19-open="arcade">🎮 Fun Arcade</button>
        <button type="button" data-v19-open="anim">🎬 Animation Lab</button>
        <button type="button" data-v19-open="goals">🎯 Daily Goals</button>
      </div>
      <div class="emx-v19-actions wide">
        <button type="button" data-v19-open="combo">🧪 Combo Lab</button>
        <button type="button" data-v19-open="rewards">🏅 Rewards</button>
      </div>
    `;
    const heading = start.querySelector('.section-heading');
    if (heading) start.insertBefore(card, heading);
    else start.appendChild(card);
    refreshStartCard();
  }

  function refreshStartCard() {
    const t = $('emxV19Tickets');
    if (t) t.textContent = String(meta.tickets || 0);
    const c = $('emxV19Crystals');
    if (c) c.textContent = String(meta.crystals || 0);
    const b = $('emxV19BadgeCount');
    if (b) b.textContent = String(meta.badges.length);
  }

  function ensurePanel() {
    let panel = $('emxV19Panel');
    if (!panel) {
      panel = document.createElement('section');
      panel.id = 'emxV19Panel';
      panel.className = 'emx-v19-panel';
      panel.innerHTML = '<div class="emx-v19-modal"></div>';
      document.body.appendChild(panel);
    }
    return panel;
  }

  function openPanel(type) {
    const panel = ensurePanel();
    const modal = panel.querySelector('.emx-v19-modal');
    activePanel = type;
    panel.classList.add('show');
    panel.style.display = 'grid';
    panel.style.pointerEvents = 'auto';
    modal.innerHTML = renderPanel(type);
    refreshStartCard();
    updateHomeVisibility();
    sfx('tap');
  }

  function closePanel() {
    const panel = $('emxV19Panel');
    if (panel) {
      panel.classList.remove('show');
      panel.style.display = 'none';
      panel.style.pointerEvents = 'none';
    }
    activePanel = null;
    updateHomeVisibility();
    sfx('tap');
  }

  function panelShell(title, subtitle, body) {
    return `
      <div class="emx-v19-panel-head">
        <div>
          <p class="eyebrow">${VERSION}</p>
          <h2>${title}</h2>
          <p>${subtitle}</p>
        </div>
        <div class="emx-v19-head-actions">
          <button type="button" data-v19-home>🏠 Home</button>
          <button type="button" data-v19-close>✕</button>
        </div>
      </div>
      ${body}
    `;
  }

  function renderPanel(type) {
    if (type === 'guide') return renderGuide();
    if (type === 'arcade') return renderArcade();
    if (type === 'anim') return renderAnimationLab();
    if (type === 'goals') return renderDailyGoals();
    if (type === 'combo') return renderComboLab();
    if (type === 'rewards') return renderRewards();
    return renderGuide();
  }

  function renderGuide() {
    const steps = [
      ['1', 'Pick a class', 'Flame = burn damage, Rogue = crits, Storm = shield/stun, Nature = healing.'],
      ['2', 'Watch HP + Mana', 'HP keeps you alive. Mana pays for stronger powers. Free attacks restore momentum.'],
      ['3', 'Use Shield before big boss hits', 'When a warning appears, guard, stun, heal, or use your ultimate.'],
      ['4', 'Choose upgrades', 'Upgrade cards make powers stronger during the run. Pick what matches your class.'],
      ['5', 'Go Home anytime', 'The new Home button brings you back to the main page without deleting your run.'],
      ['6', 'Play side activities', 'Fun Arcade, Combo Lab, Gear, Pets, and Chests all give extra rewards.']
    ].map(([n, h, p]) => `<article><span>${n}</span><strong>${h}</strong><p>${p}</p></article>`).join('');
    return panelShell('How to Play', 'A simple guide for new players and kids.', `
      <div class="emx-v19-guide-grid">${steps}</div>
      <button class="emx-v19-primary" type="button" data-v19-complete-guide>Mark Guide Complete + Reward</button>
    `);
  }

  function renderArcade() {
    return panelShell('Fun Arcade 2.0', 'Quick interactive games that give tickets and crystals.', `
      <div class="emx-v19-stats-row">
        <div><span>Tickets</span><strong>${meta.tickets}</strong></div>
        <div><span>Crystals</span><strong>${meta.crystals}</strong></div>
        <div><span>Games</span><strong>${meta.gamesPlayed}</strong></div>
      </div>
      <div class="emx-v19-game-grid">
        <button type="button" data-v19-game="reflex">⚡ Reflex Sparks<small>Tap the spark when it lights up.</small></button>
        <button type="button" data-v19-game="memory">🧠 Rune Memory<small>Repeat the rune pattern.</small></button>
        <button type="button" data-v19-game="block">🛡️ Boss Block<small>Block when the boss attacks.</small></button>
        <button type="button" data-v19-game="doors">🚪 Treasure Doors<small>Pick the safest glowing door.</small></button>
        <button type="button" data-v19-game="wheel">🎡 Reward Wheel<small>Spin for a quick prize.</small></button>
      </div>
      <div id="emxV19GameStage" class="emx-v19-game-stage"><p>Choose a game above.</p></div>
    `);
  }

  function renderAnimationLab() {
    const types = [
      ['fireball', '☄️ Fireball'], ['meteor', '🌋 Meteor'], ['nova', '💥 Nova'], ['lightning', '⚡ Lightning'],
      ['ice', '❄️ Ice'], ['poison', '☠️ Poison'], ['shadow', '🌑 Shadow'], ['drain', '🩸 Drain'],
      ['heal', '✨ Heal'], ['shield', '🛡️ Shield'], ['combo', '🥷 Combo'], ['boss', '👑 Boss Attack']
    ].map(([id, label]) => `<button type="button" data-v19-preview="${id}">${label}</button>`).join('');
    return panelShell('Animation Lab', 'Preview the new 3D-style attack overlays.', `
      <div class="emx-v19-preview-grid">${types}</div>
      <p class="emx-v19-muted center">These same cinematic layers now appear during real battle attacks.</p>
    `);
  }

  function renderDailyGoals() {
    resetDailyIfNeeded();
    const goals = dailyList();
    const html = goals.map((goal) => {
      const done = Boolean(meta.dailyGoals[goal.id]);
      return `<article class="emx-v19-goal ${done ? 'done' : ''}">
        <div><strong>${goal.icon} ${goal.title}</strong><p>${goal.desc}</p></div>
        <button type="button" data-v19-claim-goal="${goal.id}" ${done ? 'disabled' : ''}>${done ? 'Claimed' : 'Claim'}</button>
      </article>`;
    }).join('');
    return panelShell('Daily Goals', 'Simple tasks with clear rewards.', `
      <div class="emx-v19-goals">${html}</div>
      <p class="emx-v19-muted">New goals refresh each day. These are kid-friendly and optional.</p>
    `);
  }

  function renderComboLab() {
    const combos = [
      ['Firestorm', '🔥 + ⚡', 'Big burn chance and lightning impact.'],
      ['Venom Shadow', '☠️ + 🌑', 'Poison plus crit-style dark slash.'],
      ['Frozen Bloom', '❄️ + 🌿', 'Freeze, heal, and calm the fight.'],
      ['Meteor Guard', '🌋 + 🛡️', 'Heavy hit followed by safe shield.']
    ].map(([name, recipe, desc]) => `<button type="button" data-v19-combo="${name}"><strong>${recipe} ${name}</strong><small>${desc}</small></button>`).join('');
    return panelShell('Combo Lab', 'Tap combo recipes to learn strong power pairings.', `
      <div class="emx-v19-combo-grid">${combos}</div>
      <div id="emxV19ComboStage" class="emx-v19-game-stage"><p>Pick a combo recipe.</p></div>
    `);
  }

  function renderRewards() {
    const badges = meta.badges.length ? meta.badges.map((b) => `<span>🏅 ${b}</span>`).join('') : '<p class="emx-v19-muted">No v19 badges yet. Play arcade games or complete the guide.</p>';
    return panelShell('Rewards + Badges', 'Track the prizes earned from v19 activities.', `
      <div class="emx-v19-stats-row big">
        <div><span>Tickets</span><strong>${meta.tickets}</strong></div>
        <div><span>Crystals</span><strong id="emxV19Crystals">${meta.crystals}</strong></div>
        <div><span>Badges</span><strong id="emxV19BadgeCount">${meta.badges.length}</strong></div>
      </div>
      <div class="emx-v19-badge-box">${badges}</div>
      <button class="emx-v19-primary" type="button" data-v19-open="arcade">Earn More in Fun Arcade</button>
    `);
  }

  function resetDailyIfNeeded() {
    const today = todayKey();
    if (meta.dailyGoalDay !== today) {
      meta.dailyGoalDay = today;
      meta.dailyGoals = {};
      saveMeta();
    }
  }

  function dailyList() {
    return [
      { id: 'readGuide', icon: '📘', title: 'Read one tip', desc: 'Open How to Play or mark the guide complete.', tickets: 10, crystals: 2 },
      { id: 'playGame', icon: '🎮', title: 'Play an arcade game', desc: 'Any Fun Arcade game counts.', tickets: 15, crystals: 3 },
      { id: 'previewMove', icon: '🎬', title: 'Preview an animation', desc: 'Open Animation Lab and preview one move.', tickets: 12, crystals: 2 },
      { id: 'learnCombo', icon: '🧪', title: 'Learn a combo', desc: 'Tap any recipe in Combo Lab.', tickets: 12, crystals: 2 }
    ];
  }

  function claimGoal(id) {
    resetDailyIfNeeded();
    if (meta.dailyGoals[id]) return toast('Already claimed today.');
    const goal = dailyList().find((g) => g.id === id);
    if (!goal) return;
    meta.dailyGoals[id] = true;
    reward({ tickets: goal.tickets, crystals: goal.crystals, badge: 'Daily Grinder', message: `${goal.title} complete!` });
    openPanel('goals');
  }

  async function playReflexGame(stage) {
    stage.innerHTML = `<h3>⚡ Reflex Sparks</h3><p>Wait for the green spark, then tap it fast.</p><button type="button" class="emx-v19-orb waiting">Wait...</button>`;
    const orb = stage.querySelector('.emx-v19-orb');
    await sleep(rand(800, 1800));
    const start = performance.now();
    orb.textContent = 'TAP!';
    orb.classList.remove('waiting');
    orb.classList.add('ready');
    orb.onclick = () => {
      const ms = Math.round(performance.now() - start);
      const gain = ms < 300 ? 28 : ms < 550 ? 18 : 10;
      meta.gamesPlayed += 1;
      meta.bestReflex = meta.bestReflex == null ? ms : Math.min(meta.bestReflex, ms);
      reward({ tickets: gain, crystals: Math.ceil(gain / 10), badge: ms < 300 ? 'Spark Speedster' : '', message: `Reflex ${ms}ms • +${gain} tickets` });
      stage.innerHTML = `<h3>⚡ Reflex ${ms}ms</h3><p>Great tap! Best: ${meta.bestReflex}ms.</p><button type="button" data-v19-game="reflex">Play Again</button>`;
    };
  }

  function playMemoryGame(stage) {
    const runes = ['🔥', '⚡', '❄️', '☠️', '🌿'];
    const sequence = Array.from({ length: 4 + Math.min(2, meta.memoryStreak) }, () => pick(runes));
    let index = 0;
    stage.innerHTML = `<h3>🧠 Rune Memory</h3><p>Pattern: <strong class="emx-v19-rune-seq">${sequence.join(' ')}</strong></p><p>Now tap the runes in the same order.</p><div class="emx-v19-runes">${runes.map((r) => `<button type="button" data-rune="${r}">${r}</button>`).join('')}</div><p id="emxV19MemoryStatus"></p>`;
    setTimeout(() => {
      const seq = stage.querySelector('.emx-v19-rune-seq');
      if (seq) seq.textContent = '❔ ❔ ❔ ❔';
    }, 1700);
    stage.querySelector('.emx-v19-runes').onclick = (event) => {
      const b = event.target.closest('[data-rune]');
      if (!b) return;
      const status = $('emxV19MemoryStatus');
      if (b.dataset.rune === sequence[index]) {
        index += 1;
        if (status) status.textContent = `Correct ${index}/${sequence.length}`;
        if (index >= sequence.length) {
          meta.gamesPlayed += 1;
          meta.memoryStreak += 1;
          reward({ tickets: 24, crystals: 4, badge: meta.memoryStreak >= 3 ? 'Rune Genius' : '', message: 'Rune Memory cleared!' });
          stage.innerHTML = `<h3>🧠 Memory Clear!</h3><p>Streak: ${meta.memoryStreak}</p><button type="button" data-v19-game="memory">Play Again</button>`;
        }
      } else {
        meta.gamesPlayed += 1;
        meta.memoryStreak = 0;
        saveMeta();
        if (status) status.textContent = 'Oops! Pattern reset.';
        sfx('wrong');
      }
    };
  }

  async function playBlockGame(stage) {
    stage.innerHTML = `<h3>🛡️ Boss Block Trainer</h3><p>Tap BLOCK when the attack bar enters the green zone.</p><div class="emx-v19-block-track"><div class="zone"></div><div class="marker"></div></div><button type="button" class="emx-v19-primary" id="emxV19BlockBtn">BLOCK</button><p id="emxV19BlockStatus">Get ready...</p>`;
    const marker = stage.querySelector('.marker');
    let pos = 0;
    let dir = 1;
    let active = true;
    const timer = setInterval(() => {
      pos += dir * 3.5;
      if (pos > 96 || pos < 0) dir *= -1;
      marker.style.left = pos + '%';
    }, 24);
    $('emxV19BlockBtn').onclick = () => {
      if (!active) return;
      active = false;
      clearInterval(timer);
      const perfect = pos >= 42 && pos <= 58;
      const okay = pos >= 32 && pos <= 68;
      const gain = perfect ? 35 : okay ? 18 : 6;
      meta.gamesPlayed += 1;
      meta.bestBlock = Math.max(meta.bestBlock || 0, gain);
      reward({ tickets: gain, crystals: perfect ? 7 : 2, badge: perfect ? 'Perfect Guard' : '', message: perfect ? 'PERFECT BLOCK!' : okay ? 'Good block!' : 'Late block — still earned tickets.' });
      $('emxV19BlockStatus').textContent = perfect ? 'Perfect shield timing!' : okay ? 'Good block!' : 'The boss clipped you. Try again.';
      stage.insertAdjacentHTML('beforeend', '<button type="button" data-v19-game="block">Train Again</button>');
    };
    await sleep(6500);
    if (active) {
      active = false;
      clearInterval(timer);
      $('emxV19BlockStatus').textContent = 'Time ran out. Try again.';
    }
  }

  function playDoorsGame(stage) {
    const good = rand(1, 3);
    stage.innerHTML = `<h3>🚪 Treasure Doors</h3><p>Pick one door. One has a crystal stash.</p><div class="emx-v19-door-row">${[1, 2, 3].map((n) => `<button type="button" data-door="${n}">Door ${n}<span>🚪</span></button>`).join('')}</div>`;
    stage.querySelector('.emx-v19-door-row').onclick = (event) => {
      const door = event.target.closest('[data-door]');
      if (!door) return;
      const n = Number(door.dataset.door);
      meta.gamesPlayed += 1;
      if (n === good) {
        meta.treasureFinds += 1;
        reward({ tickets: 25, crystals: 8, badge: 'Treasure Finder', message: 'You found the crystal stash!' });
      } else {
        reward({ tickets: 8, crystals: 1, message: 'Empty room, but you found a few tickets.' });
      }
      stage.innerHTML = `<h3>${n === good ? '💎 Jackpot!' : '🪙 Small Find'}</h3><p>The glowing door was Door ${good}.</p><button type="button" data-v19-game="doors">Choose Again</button>`;
    };
  }

  function playWheelGame(stage) {
    const prizes = [
      { label: '10 Tickets', tickets: 10 }, { label: '25 Tickets', tickets: 25 }, { label: '5 Crystals', crystals: 5 },
      { label: 'Chest Spark', tickets: 18, crystals: 3 }, { label: 'Lucky Badge', tickets: 8, badge: 'Wheel Winner' }
    ];
    stage.innerHTML = `<h3>🎡 Reward Wheel</h3><div class="emx-v19-wheel">EMX</div><button type="button" class="emx-v19-primary" id="emxV19SpinBtn">Spin</button><p id="emxV19SpinResult">Tap spin.</p>`;
    $('emxV19SpinBtn').onclick = async () => {
      const wheel = stage.querySelector('.emx-v19-wheel');
      wheel.classList.add('spin');
      sfx('spin');
      await sleep(850);
      wheel.classList.remove('spin');
      const prize = pick(prizes);
      meta.gamesPlayed += 1;
      meta.wheelSpins += 1;
      reward({ ...prize, message: `Wheel prize: ${prize.label}` });
      $('emxV19SpinResult').textContent = `Prize: ${prize.label}`;
    };
  }

  function runGame(type) {
    const stage = $('emxV19GameStage');
    if (!stage) return;
    if (type === 'reflex') return playReflexGame(stage);
    if (type === 'memory') return playMemoryGame(stage);
    if (type === 'block') return playBlockGame(stage);
    if (type === 'doors') return playDoorsGame(stage);
    if (type === 'wheel') return playWheelGame(stage);
  }

  function runCombo(name) {
    const stage = $('emxV19ComboStage');
    if (!stage) return;
    meta.comboBadges += 1;
    reward({ tickets: 10, crystals: 2, badge: 'Combo Learner', message: `${name} learned!` });
    const type = name.includes('Fire') || name.includes('Meteor') ? 'meteor' : name.includes('Venom') ? 'shadow' : name.includes('Frozen') ? 'ice' : 'shield';
    showCinematic(type, name);
    stage.innerHTML = `<h3>🧪 ${name}</h3><p>Try using this idea in battle. Combos help kids learn what powers go together.</p><button type="button" data-v19-preview="${type}">Preview Again</button>`;
  }

  function previewAnimation(type) {
    meta.animationsPreviewed += 1;
    saveMeta();
    if (!meta.dailyGoals.previewMove) meta.dailyGoals.previewMove = false;
    showCinematic(type, type.toUpperCase());
    reward({ tickets: 3, crystals: 1, message: `${type} previewed.` });
  }

  function iconFor(type) {
    const icons = {
      fireball: '☄️', meteor: '🌋', nova: '💥', lightning: '⚡', ice: '❄️', freeze: '❄️', poison: '☠️',
      shadow: '🌑', drain: '🩸', heal: '✨', shield: '🛡️', combo: '🥷', slash: '⚔️', boss: '👑', enemy: '👹'
    };
    return icons[type] || '⚔️';
  }

  function familyFor(type) {
    const t = String(type || '').toLowerCase();
    if (t.includes('fire') || t.includes('meteor') || t.includes('nova')) return 'fire';
    if (t.includes('light')) return 'lightning';
    if (t.includes('ice') || t.includes('freeze')) return 'ice';
    if (t.includes('poison')) return 'poison';
    if (t.includes('shadow') || t.includes('combo')) return 'shadow';
    if (t.includes('drain')) return 'drain';
    if (t.includes('heal')) return 'heal';
    if (t.includes('shield') || t.includes('guard')) return 'shield';
    if (t.includes('boss') || t.includes('enemy')) return 'boss';
    return 'slash';
  }

  async function showCinematic(type = 'slash', label = '') {
    const now = performance.now();
    if (now - lastCinematicAt < 140) return;
    lastCinematicAt = now;

    const family = familyFor(type);
    const stage = document.createElement('div');
    stage.className = `emx-cinematic-stage ${family}`;
    stage.setAttribute('aria-hidden', 'true');
    const bits = Array.from({ length: 14 }, (_, i) => `<i style="--i:${i};--x:${rand(-44,44)};--y:${rand(-36,36)}"></i>`).join('');
    stage.innerHTML = `
      <div class="emx-cinematic-card">
        <div class="emx-cinematic-ring"></div>
        <div class="emx-cinematic-icon">${iconFor(type)}</div>
        <strong>${label || String(type || 'Attack').replace(/[-_]/g, ' ')}</strong>
      </div>
      <div class="emx-cinematic-beam"></div>
      <div class="emx-cinematic-particles">${bits}</div>
    `;
    document.body.appendChild(stage);
    sfx(family === 'slash' ? 'attack' : family);
    await sleep(family === 'boss' ? 940 : 760);
    stage.classList.add('fade');
    setTimeout(() => stage.remove(), 280);
  }

  function patchCombatAnimations() {
    try {
      const oldPlay = Function('return (typeof playAnimation === "function") ? playAnimation : null')();
      if (oldPlay && !oldPlay.__emxV19Wrapped) {
        const wrapped = async function emxV19PlayAnimation(type) {
          showCinematic(type, String(type || 'Attack').replace(/[-_]/g, ' '));
          return oldPlay.apply(this, arguments);
        };
        wrapped.__emxV19Wrapped = true;
        Function('fn', 'playAnimation = fn;')(wrapped);
      }
    } catch (error) {}

    try {
      const oldEnemy = Function('return (typeof playEnemyAnimation === "function") ? playEnemyAnimation : null')();
      if (oldEnemy && !oldEnemy.__emxV19Wrapped) {
        const wrappedEnemy = async function emxV19EnemyAnimation(big) {
          if (big) showCinematic('boss', 'Boss Strike');
          return oldEnemy.apply(this, arguments);
        };
        wrappedEnemy.__emxV19Wrapped = true;
        Function('fn', 'playEnemyAnimation = fn;')(wrappedEnemy);
      }
    } catch (error) {}
  }

  function bindV19Clicks() {
    document.addEventListener('click', (event) => {
      const open = event.target.closest('[data-v19-open]');
      const close = event.target.closest('[data-v19-close]');
      const home = event.target.closest('[data-v19-home]');
      const preview = event.target.closest('[data-v19-preview]');
      const game = event.target.closest('[data-v19-game]');
      const goal = event.target.closest('[data-v19-claim-goal]');
      const guide = event.target.closest('[data-v19-complete-guide]');
      const combo = event.target.closest('[data-v19-combo]');

      if (open) { event.preventDefault(); return openPanel(open.dataset.v19Open); }
      if (close) { event.preventDefault(); return closePanel(); }
      if (home) { event.preventDefault(); return goHome(); }
      if (preview) { event.preventDefault(); return previewAnimation(preview.dataset.v19Preview); }
      if (game) { event.preventDefault(); return runGame(game.dataset.v19Game); }
      if (goal) { event.preventDefault(); return claimGoal(goal.dataset.v19ClaimGoal); }
      if (guide) {
        event.preventDefault();
        meta.howToRead = true;
        if (!meta.dailyGoals.readGuide) meta.dailyGoals.readGuide = false;
        reward({ tickets: 20, crystals: 5, badge: 'Guide Graduate', message: 'Guide complete! You earned a reward.' });
        return openPanel('guide');
      }
      if (combo) { event.preventDefault(); return runCombo(combo.dataset.v19Combo); }
    });
  }

  function markVersion() {
    qa('.version-chip').forEach((chip) => { chip.textContent = VERSION; });
    const subtitle = q('.brand-title-card .subtitle');
    if (subtitle) subtitle.textContent = 'v19: Home button, clearer instructions, new games, and upgraded cinematic attack effects.';
    const metaDesc = q('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', 'EMX Soul Arena v19 - Home button, clear instructions, fun arcade, better fight animations, and interactive kid-friendly upgrades.');
  }

  function boot() {
    installHomeButton();
    installStartCard();
    bindV19Clicks();
    patchCombatAnimations();
    markVersion();
    refreshStartCard();
    setTimeout(() => updateHomeVisibility(), 600);
    setInterval(() => {
      installHomeButton();
      installStartCard();
      patchCombatAnimations();
      markVersion();
      updateHomeVisibility();
    }, 1400);
    setTimeout(() => toast('v19 Home + Fun Pack loaded'), 3600);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
