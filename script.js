const SAVE_KEY = "emxSoulArenaSave_v3";
const POWER_ORDER = ["basic", "special", "skill1", "skill2", "guard", "heal", "skill3", "ultimate"];

const $ = (id) => document.getElementById(id);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice = (array) => array[Math.floor(Math.random() * array.length)];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const CLASS_DATA = {
  flame: {
    name: "Flame Mage",
    icon: "🧙‍♂️",
    maxHp: 96,
    maxMana: 78,
    powers: {
      basic: {
        icon: "🔥",
        label: "Ember Strike",
        desc: "Free fire hit. Can burn.",
        cost: 0,
        damage: 16,
        crit: 0.1,
        animation: "slash",
        status: { type: "burn", chance: 0.22, turns: 2, damage: 4 }
      },
      special: {
        icon: "☄️",
        label: "Fireball",
        desc: "Heavy hit + burn chance.",
        cost: 9,
        damage: 28,
        crit: 0.1,
        animation: "fireball",
        status: { type: "burn", chance: 0.6, turns: 3, damage: 6 }
      },
      skill1: {
        icon: "🐉",
        label: "Dragon Breath",
        desc: "Two fire hits. Unlocks L2.",
        unlock: 2,
        cost: 14,
        damage: 18,
        hits: 2,
        crit: 0.08,
        animation: "nova",
        status: { type: "burn", chance: 0.75, turns: 3, damage: 6 }
      },
      skill2: {
        icon: "🩸",
        label: "Heat Drain",
        desc: "Damage, heal, weaken. L4.",
        unlock: 4,
        cost: 12,
        damage: 22,
        heal: 14,
        crit: 0.08,
        animation: "drain",
        status: { type: "weakness", chance: 0.8, turns: 2 }
      },
      guard: {
        icon: "🛡️",
        label: "Flame Shield",
        desc: "Shield + burns attackers.",
        cost: 7,
        shield: 29,
        animation: "shield",
        selfStatus: { type: "flameGuard", turns: 2 }
      },
      heal: {
        icon: "✨",
        label: "Warm Light",
        desc: "Restore HP.",
        cost: 13,
        heal: 30,
        animation: "heal"
      },
      skill3: {
        icon: "🌋",
        label: "Overheat Nova",
        desc: "Blast + rage buff. L6.",
        unlock: 6,
        cost: 18,
        damage: 48,
        crit: 0.12,
        animation: "meteor",
        selfStatus: { type: "rage", turns: 2 },
        status: { type: "burn", chance: 1, turns: 4, damage: 8 }
      },
      ultimate: {
        icon: "💥",
        label: "Inferno Meteor",
        desc: "Huge hit + heavy burn.",
        cost: 0,
        ultCost: 100,
        damage: 84,
        crit: 0.15,
        animation: "meteor",
        status: { type: "burn", chance: 1, turns: 4, damage: 10 }
      }
    }
  },
  rogue: {
    name: "Shadow Rogue",
    icon: "🥷",
    maxHp: 88,
    maxMana: 64,
    powers: {
      basic: {
        icon: "🗡️",
        label: "Backstab",
        desc: "High crit basic attack.",
        cost: 0,
        damage: 17,
        crit: 0.34,
        animation: "shadow",
        status: { type: "bleed", chance: 0.26, turns: 3, damage: 4 }
      },
      special: {
        icon: "☠️",
        label: "Poison Blade",
        desc: "Damage + strong poison.",
        cost: 8,
        damage: 20,
        crit: 0.22,
        animation: "poison",
        status: { type: "poison", chance: 0.85, turns: 4, damage: 5 }
      },
      skill1: {
        icon: "🔪",
        label: "Fan of Knives",
        desc: "Triple hit + bleed. L2.",
        unlock: 2,
        cost: 13,
        damage: 12,
        hits: 3,
        crit: 0.22,
        animation: "combo",
        status: { type: "bleed", chance: 0.45, turns: 3, damage: 5 }
      },
      skill2: {
        icon: "👤",
        label: "Shadow Clone",
        desc: "Double hit + dodge. L4.",
        unlock: 4,
        cost: 15,
        damage: 23,
        hits: 2,
        crit: 0.24,
        animation: "shadow",
        selfStatus: { type: "dodge", turns: 1 }
      },
      guard: {
        icon: "💨",
        label: "Smoke Bomb",
        desc: "Shield + high dodge.",
        cost: 7,
        shield: 19,
        animation: "shield",
        selfStatus: { type: "dodge", turns: 1 }
      },
      heal: {
        icon: "🩹",
        label: "Patch Up",
        desc: "Small heal, cheap cost.",
        cost: 10,
        heal: 24,
        animation: "heal"
      },
      skill3: {
        icon: "🎯",
        label: "Death Mark",
        desc: "Weakens target. L6.",
        unlock: 6,
        cost: 16,
        damage: 30,
        crit: 0.35,
        animation: "drain",
        status: { type: "weakness", chance: 1, turns: 3 }
      },
      ultimate: {
        icon: "🌑",
        label: "Nightfall Combo",
        desc: "Five rapid crit hits.",
        cost: 0,
        ultCost: 100,
        damage: 22,
        hits: 5,
        crit: 0.45,
        animation: "combo",
        status: { type: "bleed", chance: 0.65, turns: 3, damage: 6 }
      }
    }
  },
  storm: {
    name: "Storm Knight",
    icon: "⚔️",
    maxHp: 114,
    maxMana: 60,
    powers: {
      basic: {
        icon: "⚔️",
        label: "Sword Slash",
        desc: "Reliable free attack.",
        cost: 0,
        damage: 19,
        crit: 0.13,
        animation: "slash"
      },
      special: {
        icon: "⚡",
        label: "Thunder Strike",
        desc: "Lightning + stun chance.",
        cost: 10,
        damage: 27,
        crit: 0.12,
        animation: "lightning",
        status: { type: "stun", chance: 0.28, turns: 1 }
      },
      skill1: {
        icon: "❄️",
        label: "Ice Breaker",
        desc: "Damage + freeze. L2.",
        unlock: 2,
        cost: 12,
        damage: 25,
        crit: 0.12,
        animation: "ice",
        status: { type: "freeze", chance: 0.38, turns: 1 }
      },
      skill2: {
        icon: "🔋",
        label: "Overcharge",
        desc: "Gain rage, mana, shield. L4.",
        unlock: 4,
        cost: 5,
        shield: 18,
        manaGain: 18,
        animation: "buff",
        selfStatus: { type: "rage", turns: 2 }
      },
      guard: {
        icon: "🛡️",
        label: "Parry",
        desc: "Big shield + reflect.",
        cost: 6,
        shield: 36,
        animation: "shield",
        selfStatus: { type: "parry", turns: 1 }
      },
      heal: {
        icon: "📣",
        label: "Rally",
        desc: "Heal + small shield.",
        cost: 12,
        heal: 22,
        shield: 12,
        animation: "heal"
      },
      skill3: {
        icon: "🔗",
        label: "Chain Bolt",
        desc: "Triple lightning. L6.",
        unlock: 6,
        cost: 18,
        damage: 18,
        hits: 3,
        crit: 0.14,
        animation: "lightning",
        status: { type: "stun", chance: 0.42, turns: 1 }
      },
      ultimate: {
        icon: "🌩️",
        label: "Stormbreaker",
        desc: "Massive lightning stun.",
        cost: 0,
        ultCost: 100,
        damage: 86,
        crit: 0.14,
        animation: "lightning",
        status: { type: "stun", chance: 0.8, turns: 1 }
      }
    }
  },
  nature: {
    name: "Nature Healer",
    icon: "🧝",
    maxHp: 106,
    maxMana: 72,
    powers: {
      basic: {
        icon: "🌿",
        label: "Vine Whip",
        desc: "Can root enemies.",
        cost: 0,
        damage: 15,
        crit: 0.1,
        animation: "slash",
        status: { type: "root", chance: 0.22, turns: 1 }
      },
      special: {
        icon: "🍄",
        label: "Poison Spores",
        desc: "Poison damage over time.",
        cost: 8,
        damage: 18,
        crit: 0.1,
        animation: "poison",
        status: { type: "poison", chance: 0.92, turns: 4, damage: 6 }
      },
      skill1: {
        icon: "🪤",
        label: "Root Trap",
        desc: "Guaranteed root. L2.",
        unlock: 2,
        cost: 11,
        damage: 23,
        crit: 0.08,
        animation: "nova",
        status: { type: "root", chance: 1, turns: 1 }
      },
      skill2: {
        icon: "🪷",
        label: "Leech Seed",
        desc: "Damage + heal + poison. L4.",
        unlock: 4,
        cost: 14,
        damage: 22,
        heal: 18,
        crit: 0.1,
        animation: "drain",
        status: { type: "poison", chance: 0.75, turns: 3, damage: 5 }
      },
      guard: {
        icon: "🌳",
        label: "Barkskin",
        desc: "Shield + regeneration.",
        cost: 6,
        shield: 29,
        animation: "shield",
        selfStatus: { type: "regen", turns: 3, damage: 6 }
      },
      heal: {
        icon: "🌸",
        label: "Bloom Heal",
        desc: "Strong healing spell.",
        cost: 14,
        heal: 40,
        animation: "heal"
      },
      skill3: {
        icon: "🌲",
        label: "Guardian Grove",
        desc: "Heal, shield, regen. L6.",
        unlock: 6,
        cost: 18,
        heal: 34,
        shield: 30,
        animation: "buff",
        selfStatus: { type: "regen", turns: 4, damage: 7 }
      },
      ultimate: {
        icon: "🌺",
        label: "Bloom Nova",
        desc: "Heal, shield, damage, poison.",
        cost: 0,
        ultCost: 100,
        damage: 54,
        heal: 44,
        shield: 24,
        crit: 0.1,
        animation: "nova",
        status: { type: "poison", chance: 1, turns: 4, damage: 9 }
      }
    }
  }
};

const ENEMIES = [
  { id: "slime", name: "Neon Slime", icon: "🟢", hp: 48, attack: 8, defense: 1 },
  { id: "goblin", name: "Goblin Hacker", icon: "👺", hp: 55, attack: 10, defense: 2 },
  { id: "skeleton", name: "Bone Rattler", icon: "💀", hp: 60, attack: 12, defense: 2 },
  { id: "wolf", name: "Dire Wolf", icon: "🐺", hp: 64, attack: 13, defense: 1, status: { type: "bleed", chance: 0.22, turns: 3, damage: 4 } },
  { id: "bat", name: "Vampire Bat", icon: "🦇", hp: 52, attack: 11, defense: 1, lifesteal: 0.25 },
  { id: "spider", name: "Poison Spider", icon: "🕷️", hp: 58, attack: 10, defense: 1, status: { type: "poison", chance: 0.35, turns: 3, damage: 4 } },
  { id: "imp", name: "Ice Imp", icon: "👿", hp: 62, attack: 11, defense: 2, status: { type: "freeze", chance: 0.18, turns: 1 } },
  { id: "golem", name: "Rock Golem", icon: "🗿", hp: 82, attack: 14, defense: 6 },
  { id: "drone", name: "Circuit Drone", icon: "🤖", hp: 72, attack: 15, defense: 3, status: { type: "stun", chance: 0.2, turns: 1 } },
  { id: "wraith", name: "Void Wraith", icon: "👻", hp: 68, attack: 16, defense: 2, status: { type: "weakness", chance: 0.28, turns: 2 } }
];

const BOSSES = [
  { id: "goblinKing", name: "Goblin King", icon: "🤴", hp: 145, attack: 17, defense: 5 },
  { id: "boneDragon", name: "Bone Dragon", icon: "🐉", hp: 180, attack: 20, defense: 6, status: { type: "poison", chance: 0.35, turns: 4, damage: 5 } },
  { id: "stormTitan", name: "Storm Titan", icon: "⛈️", hp: 220, attack: 22, defense: 8, status: { type: "stun", chance: 0.2, turns: 1 } },
  { id: "voidBeast", name: "Void Beast", icon: "👁️", hp: 260, attack: 24, defense: 9 },
  { id: "emxOverlord", name: "EMX Overlord", icon: "💀", hp: 310, attack: 27, defense: 10, status: { type: "weakness", chance: 0.3, turns: 2 } }
];

const UPGRADES = [
  {
    id: "hp",
    rarity: "Common",
    title: "+22 Max HP",
    desc: "Gain 22 max HP and heal 22 HP.",
    apply() {
      state.player.maxHp += 22;
      healTarget(state.player, 22, false);
    }
  },
  {
    id: "mana",
    rarity: "Common",
    title: "+14 Max Mana",
    desc: "Gain 14 max mana and refill 14 mana.",
    apply() {
      state.player.maxMana += 14;
      state.player.mana = clamp(state.player.mana + 14, 0, state.player.maxMana);
    }
  },
  {
    id: "basicPower",
    rarity: "Common",
    title: "Sharper Basic Attack",
    desc: "Your free basic attack deals +6 damage.",
    apply() {
      state.mods.basicDamage += 6;
    }
  },
  {
    id: "specialPower",
    rarity: "Common",
    title: "Stronger Skills",
    desc: "Specials, skills, and ultimates deal +7 damage.",
    apply() {
      state.mods.specialDamage += 7;
    }
  },
  {
    id: "healPower",
    rarity: "Common",
    title: "Better Healing",
    desc: "Your healing powers restore +10 HP.",
    apply() {
      state.mods.healBonus += 10;
    }
  },
  {
    id: "shieldPower",
    rarity: "Common",
    title: "Thicker Shield",
    desc: "Your shield powers give +11 shield.",
    apply() {
      state.mods.shieldBonus += 11;
    }
  },
  {
    id: "crit",
    rarity: "Rare",
    title: "Lucky Strikes",
    desc: "All attacks gain +9% crit chance.",
    apply() {
      state.mods.critBonus += 0.09;
    }
  },
  {
    id: "statusChance",
    rarity: "Rare",
    title: "Status Mastery",
    desc: "Status effect chances gain +13%.",
    apply() {
      state.mods.statusChance += 0.13;
    }
  },
  {
    id: "statusDuration",
    rarity: "Rare",
    title: "Longer Curses",
    desc: "Burn, poison, bleed, weakness, and regen last +1 turn.",
    apply() {
      state.mods.statusDuration += 1;
    }
  },
  {
    id: "dots",
    rarity: "Rare",
    title: "Cruel Damage Over Time",
    desc: "Burn, poison, and bleed deal +3 damage each tick.",
    apply() {
      state.mods.statusDamage += 3;
    }
  },
  {
    id: "regenMana",
    rarity: "Rare",
    title: "Mana Spring",
    desc: "Regenerate +3 extra mana every player turn.",
    apply() {
      state.mods.manaRegen += 3;
    }
  },
  {
    id: "startShield",
    rarity: "Rare",
    title: "Opening Barrier",
    desc: "Start every fight with +15 shield.",
    apply() {
      state.mods.startShield += 15;
    }
  },
  {
    id: "combo",
    rarity: "Epic",
    title: "Combo Engine",
    desc: "Damage powers have a 12% chance to hit one extra time.",
    apply() {
      state.mods.extraHitChance += 0.12;
    }
  },
  {
    id: "lifeSteal",
    rarity: "Epic",
    title: "Soul Siphon",
    desc: "Heal for 9% of the damage you deal.",
    apply() {
      state.mods.lifeSteal += 0.09;
    }
  },
  {
    id: "tough",
    rarity: "Epic",
    title: "Iron Will",
    desc: "Enemy attacks deal 9% less damage.",
    apply() {
      state.mods.damageReduction += 0.09;
    }
  },
  {
    id: "ultGain",
    rarity: "Epic",
    title: "Ultimate Battery",
    desc: "Gain +7 extra ultimate charge when using powers.",
    apply() {
      state.mods.ultGain += 7;
    }
  },
  {
    id: "bossSlayer",
    rarity: "Epic",
    title: "Boss Slayer",
    desc: "Deal +18% damage to bosses.",
    apply() {
      state.mods.bossDamage += 0.18;
    }
  },
  {
    id: "phoenix",
    rarity: "Legendary",
    title: "Phoenix Backup",
    desc: "Revive once with 35% HP when you die.",
    apply() {
      state.mods.revive += 1;
    }
  }
];

const SHOP_ITEMS = [
  {
    id: "potion",
    price: 28,
    title: "Mega Potion",
    desc: "Heal 50 HP right now.",
    buy() {
      healTarget(state.player, 50, true);
    }
  },
  {
    id: "manaCore",
    price: 30,
    title: "Mana Core",
    desc: "Restore 40 mana and gain 20 ultimate charge.",
    buy() {
      state.player.mana = clamp(state.player.mana + 40, 0, state.player.maxMana);
      state.player.ult = clamp(state.player.ult + 20, 0, state.player.maxUlt);
      addFloatingText("+Mana", "good", "player");
    }
  },
  {
    id: "armorPlate",
    price: 48,
    title: "Armor Plate",
    desc: "Gain 30 shield and +5 starting shield forever.",
    buy() {
      state.player.shield += 30;
      state.mods.startShield += 5;
      addFloatingText("+30 Shield", "good", "player");
    }
  },
  {
    id: "randomRune",
    price: 80,
    title: "Random Rune",
    desc: "Instantly apply a random upgrade.",
    buy() {
      const upgrade = choice(UPGRADES);
      upgrade.apply();
      addLog(`Shop rune activated: ${upgrade.title}.`);
    }
  }
];

function defaultMods() {
  return {
    basicDamage: 0,
    specialDamage: 0,
    healBonus: 0,
    shieldBonus: 0,
    critBonus: 0,
    statusChance: 0,
    statusDuration: 0,
    statusDamage: 0,
    manaRegen: 6,
    startShield: 0,
    lifeSteal: 0,
    damageReduction: 0,
    ultGain: 10,
    extraHitChance: 0,
    bossDamage: 0,
    revive: 0
  };
}

let state = null;
let recentLog = [];

function makeState(classKey) {
  const classData = CLASS_DATA[classKey];

  return {
    active: true,
    phase: "player",
    classKey,
    wave: 1,
    level: 1,
    xp: 0,
    xpToLevel: 60,
    coins: 0,
    player: {
      name: classData.name,
      icon: classData.icon,
      hp: classData.maxHp,
      maxHp: classData.maxHp,
      mana: classData.maxMana,
      maxMana: classData.maxMana,
      ult: 0,
      maxUlt: 100,
      shield: 0,
      statuses: []
    },
    enemy: null,
    mods: defaultMods()
  };
}

function initBoot() {
  const boot = $("bootScreen");
  if (!boot) return;
  const fill = $("bootFill");
  const percent = $("bootPercent");
  let progress = 0;
  const timer = setInterval(() => {
    progress = clamp(progress + rand(8, 18), 0, 100);
    fill.style.width = `${progress}%`;
    percent.textContent = `Loading ${progress}%`;
    if (progress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        boot.classList.add("boot-finished");
        setTimeout(() => boot.remove(), 500);
      }, 360);
    }
  }, 160);
}

function startNewRun(classKey) {
  state = makeState(classKey);
  recentLog = [];
  $("startScreen").classList.add("hidden");
  $("battleScreen").classList.remove("hidden");
  $("gameOverScreen").classList.add("hidden");
  $("upgradeScreen").classList.add("hidden");
  $("shopScreen").classList.add("hidden");
  addLog(`You entered the arena as ${CLASS_DATA[classKey].name}.`);
  addLog("New skills unlock at levels 2, 4, and 6.");
  startFight();
}

function startFight() {
  state.phase = "player";
  state.enemy = createEnemy(state.wave);
  state.player.shield = state.mods.startShield;
  state.player.mana = clamp(state.player.mana + 10, 0, state.player.maxMana);
  clearDeadStatuses(state.player);
  addLog(`Wave ${state.wave}: ${state.enemy.name} appears!`);
  if (state.enemy.isBoss) addLog("Boss battle! Watch for special moves.");
  render();
  saveGame();
}

function createEnemy(wave) {
  const isBoss = wave % 5 === 0;
  const base = isBoss ? BOSSES[((wave / 5) - 1) % BOSSES.length] : choice(ENEMIES);
  const scale = isBoss ? 1 + wave * 0.18 : 1 + wave * 0.14;
  return {
    ...base,
    hp: Math.round(base.hp * scale + wave * 4),
    maxHp: Math.round(base.hp * scale + wave * 4),
    attack: Math.round(base.attack * scale + wave * 0.8),
    defense: Math.round(base.defense + wave * 0.45),
    statuses: [],
    shield: 0,
    isBoss,
    turn: 0,
    charging: false
  };
}

function powers() {
  return CLASS_DATA[state.classKey].powers;
}

function getPower(key) {
  return powers()[key];
}

function getPowerUnlockLevel(key) {
  const power = getPower(key);
  return power ? power.unlock || 1 : 99;
}

function isPowerUnlocked(key) {
  return state.level >= getPowerUnlockLevel(key);
}

async function usePower(key) {
  if (!state || state.phase !== "player") return;

  const power = getPower(key);
  if (!power) return;

  if (!isPowerUnlocked(key)) {
    addLog(`${power.label} unlocks at level ${getPowerUnlockLevel(key)}.`);
    render();
    return;
  }

  if (state.player.mana < power.cost) {
    addLog("Not enough mana.");
    render();
    return;
  }
  if (power.ultCost && state.player.ult < power.ultCost) {
    addLog("Your ultimate is not charged yet.");
    render();
    return;
  }

  state.phase = "animating";
  render();

  state.player.mana -= power.cost;
  if (power.ultCost) state.player.ult -= power.ultCost;

  addLog(`You used ${power.label}.`);
  await playAnimation(power.animation || "slash");
  applyPlayerPower(key, power);

  if (state.enemy.hp <= 0) {
    await sleep(450);
    winFight();
    return;
  }

  await sleep(520);
  await enemyTurn();
}

function applyPlayerPower(key, power) {
  let totalDamage = 0;
  const baseHits = power.hits || 1;
  const extraHit = power.damage && !power.ultCost && Math.random() < state.mods.extraHitChance ? 1 : 0;
  const hits = baseHits + extraHit;

  if (extraHit) addLog("Combo Engine added an extra hit!");

  for (let i = 0; i < hits; i++) {
    if (power.damage) {
      const result = calculatePlayerDamage(key, power);
      damageEnemy(result.damage);
      totalDamage += result.damage;
      if (result.crit) addLog("Critical hit!");
    }
  }

  if (power.heal) {
    const amount = power.heal + state.mods.healBonus;
    healTarget(state.player, amount, true);
  }

  if (power.shield) {
    const amount = power.shield + state.mods.shieldBonus;
    state.player.shield += amount;
    addFloatingText(`+${amount} Shield`, "good", "player");
    addLog(`You gained ${amount} shield.`);
  }

  if (power.manaGain) {
    state.player.mana = clamp(state.player.mana + power.manaGain, 0, state.player.maxMana);
    addLog(`You restored ${power.manaGain} mana.`);
  }

  if (power.cleanse) {
    cleansePlayer();
  }

  if (power.selfStatus) {
    addStatus(state.player, power.selfStatus);
  }

  if (power.status) {
    const chance = clamp(power.status.chance + state.mods.statusChance, 0, 1);
    if (Math.random() < chance) {
      const status = normalizeStatus(power.status);
      addStatus(state.enemy, status);
    }
  }

  if (totalDamage > 0 && state.mods.lifeSteal > 0) {
    healTarget(state.player, Math.max(1, Math.round(totalDamage * state.mods.lifeSteal)), true);
  }

  const ultGain = power.ultCost ? 0 : state.mods.ultGain;
  state.player.ult = clamp(state.player.ult + ultGain, 0, state.player.maxUlt);
  render();
}

function normalizeStatus(status) {
  const clean = {
    type: status.type,
    turns: status.turns || 1,
    damage: status.damage || 0
  };

  if (["burn", "poison", "bleed", "regen", "weakness", "rage", "flameGuard"].includes(clean.type)) {
    clean.turns += state.mods.statusDuration;
  }

  if (["burn", "poison", "bleed"].includes(clean.type)) {
    clean.damage += state.mods.statusDamage;
  }

  return clean;
}

function calculatePlayerDamage(key, power) {
  let base = power.damage;

  if (key === "basic") base += state.mods.basicDamage;
  if (key !== "basic") base += state.mods.specialDamage;
  if (state.enemy.isBoss) base = Math.round(base * (1 + state.mods.bossDamage));
  if (hasStatus(state.player, "rage")) base = Math.round(base * 1.25);
  if (hasStatus(state.enemy, "weakness")) base = Math.round(base * 1.2);

  base = Math.round(base * (Math.random() * 0.18 + 0.91));
  const critChance = clamp((power.crit || 0) + state.mods.critBonus, 0, 0.86);
  const crit = Math.random() < critChance;
  if (crit) base = Math.round(base * 1.8);

  const defensePenalty = Math.round(state.enemy.defense * 0.4);
  const damage = Math.max(1, base - defensePenalty);
  return { damage, crit };
}

function damageEnemy(amount) {
  const blocked = Math.min(state.enemy.shield || 0, amount);
  state.enemy.shield = Math.max(0, (state.enemy.shield || 0) - blocked);
  const realDamage = amount - blocked;
  state.enemy.hp = clamp(state.enemy.hp - realDamage, 0, state.enemy.maxHp);
  $("enemySprite").classList.add("hit");
  setTimeout(() => $("enemySprite") && $("enemySprite").classList.remove("hit"), 350);
  addFloatingText(`-${amount}`, "bad", "enemy");
}

async function enemyTurn() {
  if (!state || state.enemy.hp <= 0) return;

  state.phase = "enemy";
  render();
  await sleep(350);

  const enemySkipped = hasStatus(state.enemy, "stun") || hasStatus(state.enemy, "freeze") || hasStatus(state.enemy, "root");
  processStatusTicks(state.enemy);
  render();

  if (state.enemy.hp <= 0) {
    await sleep(350);
    winFight();
    return;
  }

  if (enemySkipped) {
    addLog(`${state.enemy.name} could not move!`);
    await sleep(560);
    startPlayerTurn();
    return;
  }

  const move = chooseEnemyMove();
  addLog(`${state.enemy.name} used ${move.name}.`);
  await playEnemyAnimation(move.big);
  applyEnemyMove(move);

  if (state.player.hp <= 0) {
    await sleep(450);
    gameOver();
    return;
  }

  await sleep(560);
  startPlayerTurn();
}

function startPlayerTurn() {
  const playerSkipped = hasStatus(state.player, "stun") || hasStatus(state.player, "freeze") || hasStatus(state.player, "root");
  processStatusTicks(state.player);
  state.player.mana = clamp(state.player.mana + state.mods.manaRegen, 0, state.player.maxMana);

  if (state.player.hp <= 0) {
    gameOver();
    return;
  }

  if (playerSkipped) {
    addLog("You were unable to move this turn!");
    render();
    setTimeout(() => enemyTurn(), 650);
    return;
  }

  state.phase = "player";
  addLog("Your turn.");
  render();
  saveGame();
}

function chooseEnemyMove() {
  const enemy = state.enemy;
  enemy.turn += 1;

  if (enemy.isBoss) {
    if (enemy.id === "stormTitan") {
      if (enemy.charging) {
        enemy.charging = false;
        return { name: "Titan Thunderblast", damage: enemy.attack + 20, big: true, status: { type: "stun", chance: 0.35, turns: 1 } };
      }
      if (enemy.turn % 3 === 0) {
        enemy.charging = true;
        return { name: "Storm Charge", damage: 0, big: false, shield: 24 };
      }
    }

    if (enemy.id === "goblinKing" && enemy.turn % 3 === 0) {
      return { name: "Royal Smash", damage: enemy.attack + 12, big: true };
    }

    if (enemy.id === "boneDragon" && enemy.turn % 2 === 0) {
      return { name: "Poison Breath", damage: enemy.attack + 5, big: true, status: { type: "poison", chance: 0.6, turns: 3, damage: 5 } };
    }

    if (enemy.id === "voidBeast") {
      enemy.attack += 2;
      return { name: "Void Hunger", damage: enemy.attack, big: enemy.turn % 2 === 0, status: { type: "weakness", chance: 0.25, turns: 2 } };
    }

    if (enemy.id === "emxOverlord") {
      if (enemy.turn % 4 === 0) return { name: "System Overload", damage: enemy.attack + 22, big: true, status: { type: "stun", chance: 0.3, turns: 1 } };
      if (enemy.turn % 2 === 0) return { name: "Neon Curse", damage: enemy.attack + 6, status: { type: "weakness", chance: 0.55, turns: 2 } };
    }
  }

  if (enemy.id === "golem" && Math.random() < 0.35) {
    return { name: "Stone Guard", damage: 0, shield: 24 };
  }

  if (enemy.status && Math.random() < 0.45) {
    return { name: "Cursed Strike", damage: enemy.attack, status: enemy.status };
  }

  if (enemy.lifesteal) {
    return { name: "Blood Bite", damage: enemy.attack, lifesteal: enemy.lifesteal };
  }

  if (Math.random() < 0.16) {
    return { name: "Heavy Attack", damage: enemy.attack + rand(4, 10), big: true };
  }

  return { name: "Attack", damage: enemy.attack };
}

function applyEnemyMove(move) {
  if (move.shield) {
    state.enemy.shield = (state.enemy.shield || 0) + move.shield;
    addLog(`${state.enemy.name} gained ${move.shield} shield.`);
  }

  if (move.damage > 0) {
    damagePlayer(move.damage);
    if (move.lifesteal) {
      healTarget(state.enemy, Math.round(move.damage * move.lifesteal), false);
    }
  }

  if (move.status && Math.random() < (move.status.chance || 1)) {
    addStatus(state.player, normalizeEnemyStatus(move.status));
  }

  render();
}

function normalizeEnemyStatus(status) {
  return {
    type: status.type,
    turns: status.turns || 1,
    damage: status.damage || 0
  };
}

function damagePlayer(amount) {
  if (hasStatus(state.player, "dodge") && Math.random() < 0.68) {
    addFloatingText("DODGE", "good", "player");
    addLog("You dodged the attack.");
    return;
  }

  const reduction = clamp(state.mods.damageReduction, 0, 0.55);
  let incoming = Math.max(0, Math.round(amount * (1 - reduction)));

  if (hasStatus(state.player, "weakness")) {
    incoming = Math.round(incoming * 1.12);
  }

  const blocked = Math.min(state.player.shield, incoming);
  state.player.shield -= blocked;
  incoming -= blocked;

  state.player.hp = clamp(state.player.hp - incoming, 0, state.player.maxHp);
  state.player.ult = clamp(state.player.ult + 8, 0, state.player.maxUlt);

  $("playerSprite").classList.add("hit");
  setTimeout(() => $("playerSprite") && $("playerSprite").classList.remove("hit"), 350);

  if (incoming > 0) addFloatingText(`-${incoming}`, "bad", "player");
  if (blocked > 0) addLog(`Your shield blocked ${blocked} damage.`);

  if (hasStatus(state.player, "parry") && blocked > 0) {
    const reflected = Math.max(3, Math.round(amount * 0.48));
    damageEnemy(reflected);
    addLog(`Parry reflected ${reflected} damage.`);
  }

  if (hasStatus(state.player, "flameGuard") && blocked > 0) {
    addStatus(state.enemy, { type: "burn", turns: 2, damage: 5 + state.mods.statusDamage });
  }

  if (state.player.hp <= 0 && state.mods.revive > 0) {
    state.mods.revive -= 1;
    state.player.hp = Math.round(state.player.maxHp * 0.35);
    state.player.shield += 25;
    addLog("Phoenix Backup activated. You revived!");
    addFloatingText("REVIVE", "good", "player");
  }
}

function addStatus(target, status) {
  const type = status.type;
  const existing = target.statuses.find((item) => item.type === type);
  const cleanStatus = {
    type,
    turns: status.turns || 1,
    damage: status.damage || 0
  };

  if (existing) {
    existing.turns = Math.max(existing.turns, cleanStatus.turns);
    existing.damage = Math.max(existing.damage || 0, cleanStatus.damage || 0);
  } else {
    target.statuses.push(cleanStatus);
  }

  addLog(`${target === state.player ? "You" : state.enemy.name} gained ${statusLabel(type)}.`);
}

function hasStatus(target, type) {
  return target.statuses.some((status) => status.type === type && status.turns > 0);
}

function processStatusTicks(target) {
  const isPlayer = target === state.player;
  const name = isPlayer ? "You" : state.enemy.name;

  for (const status of target.statuses) {
    if (["burn", "poison", "bleed"].includes(status.type)) {
      const amount = Math.max(1, status.damage || 1);
      target.hp = clamp(target.hp - amount, 0, target.maxHp);
      addFloatingText(`-${amount}`, "bad", isPlayer ? "player" : "enemy");
      addLog(`${name} took ${amount} ${statusLabel(status.type)} damage.`);
    }

    if (status.type === "regen") {
      const amount = Math.max(1, status.damage || 1);
      healTarget(target, amount, true);
    }

    status.turns -= 1;
  }

  clearDeadStatuses(target);
}

function clearDeadStatuses(target) {
  target.statuses = target.statuses.filter((status) => status.turns > 0);
}

function cleansePlayer() {
  const badStatuses = ["burn", "poison", "bleed", "stun", "freeze", "root", "weakness"];
  const before = state.player.statuses.length;
  state.player.statuses = state.player.statuses.filter((status) => !badStatuses.includes(status.type));
  if (before !== state.player.statuses.length) addLog("Negative effects cleansed.");
}

function statusLabel(type) {
  const labels = {
    burn: "Burn",
    poison: "Poison",
    bleed: "Bleed",
    stun: "Stun",
    freeze: "Freeze",
    root: "Root",
    dodge: "Dodge",
    parry: "Parry",
    regen: "Regen",
    flameGuard: "Flame Guard",
    weakness: "Weakness",
    rage: "Rage"
  };
  return labels[type] || type;
}

function statusIcon(type) {
  const icons = {
    burn: "🔥",
    poison: "☠️",
    bleed: "🩸",
    stun: "💫",
    freeze: "❄️",
    root: "🌿",
    dodge: "💨",
    parry: "🛡️",
    regen: "💚",
    flameGuard: "🔥",
    weakness: "🔻",
    rage: "💢"
  };
  return icons[type] || "✨";
}

function healTarget(target, amount, showText) {
  const oldHp = target.hp;
  target.hp = clamp(target.hp + amount, 0, target.maxHp);
  const healed = target.hp - oldHp;
  if (healed > 0 && showText) {
    addFloatingText(`+${healed}`, "good", target === state.player ? "player" : "enemy");
    addLog(`${target === state.player ? "You healed" : state.enemy.name + " healed"} for ${healed} HP.`);
  }
}

function winFight() {
  state.phase = "upgrade";
  const bossBonus = state.enemy.isBoss ? 28 : 0;
  const xpGain = 30 + state.wave * 6 + bossBonus;
  const coinGain = 11 + state.wave * 3 + bossBonus;

  state.enemy.hp = 0;
  state.xp += xpGain;
  state.coins += coinGain;
  state.player.hp = clamp(state.player.hp + Math.round(state.player.maxHp * 0.09), 0, state.player.maxHp);
  state.player.mana = clamp(state.player.mana + 17, 0, state.player.maxMana);
  state.player.ult = clamp(state.player.ult + 17, 0, state.player.maxUlt);

  addLog(`Victory! +${xpGain} XP, +${coinGain} coins.`);
  checkLevelUp();
  render();
  saveGame();
  showUpgrades();
}

function checkLevelUp() {
  while (state.xp >= state.xpToLevel) {
    state.xp -= state.xpToLevel;
    state.level += 1;
    state.xpToLevel = Math.round(state.xpToLevel * 1.25 + 18);
    state.player.maxHp += 9;
    state.player.maxMana += 5;
    state.player.hp = state.player.maxHp;
    state.player.mana = state.player.maxMana;
    addLog(`Level up! You are now level ${state.level}.`);
    if ([2, 4, 6].includes(state.level)) addLog("New power unlocked!");
  }
}

function showUpgrades() {
  const cards = $("upgradeCards");
  const choices = getUpgradeChoices();
  cards.innerHTML = "";

  for (const upgrade of choices) {
    const button = document.createElement("button");
    button.className = "upgrade-card";
    button.innerHTML = `
      <span>${upgrade.rarity}</span>
      <strong>${upgrade.title}</strong>
      <small>${upgrade.desc}</small>
    `;
    button.addEventListener("click", () => chooseUpgrade(upgrade.id));
    cards.appendChild(button);
  }

  $("upgradeScreen").classList.remove("hidden");
}

function getUpgradeChoices() {
  const pool = [...UPGRADES];
  const choices = [];
  while (choices.length < 3 && pool.length > 0) {
    const index = rand(0, pool.length - 1);
    choices.push(pool.splice(index, 1)[0]);
  }
  return choices;
}

function chooseUpgrade(id) {
  const upgrade = UPGRADES.find((item) => item.id === id);
  if (!upgrade) return;
  upgrade.apply();
  addLog(`Upgrade chosen: ${upgrade.title}.`);
  $("upgradeScreen").classList.add("hidden");
  state.wave += 1;
  startFight();
}

function showShop() {
  if (!state || ["enemy", "animating", "upgrade", "gameover"].includes(state.phase)) {
    addLog("You can only shop on your turn.");
    render();
    return;
  }
  renderShop();
  $("shopScreen").classList.remove("hidden");
}

function renderShop() {
  const grid = $("shopCards");
  grid.innerHTML = "";

  for (const item of SHOP_ITEMS) {
    const canBuy = state.coins >= item.price;
    const button = document.createElement("button");
    button.className = "shop-card";
    button.disabled = !canBuy;
    button.innerHTML = `
      <span>${item.price} coins</span>
      <strong>${item.title}</strong>
      <small>${item.desc}</small>
    `;
    button.addEventListener("click", () => buyShopItem(item.id));
    grid.appendChild(button);
  }
}

function buyShopItem(id) {
  const item = SHOP_ITEMS.find((shopItem) => shopItem.id === id);
  if (!item || state.coins < item.price) return;
  state.coins -= item.price;
  item.buy();
  addLog(`Bought ${item.title}.`);
  render();
  renderShop();
  saveGame();
}

function closeShop() {
  $("shopScreen").classList.add("hidden");
}

function gameOver() {
  state.phase = "gameover";
  render();
  localStorage.removeItem(SAVE_KEY);
  $("gameOverStats").textContent = `You reached wave ${state.wave} at level ${state.level} with ${state.coins} coins.`;
  $("gameOverScreen").classList.remove("hidden");
}

function render() {
  if (!state) return;

  $("waveText").textContent = state.wave;
  $("levelText").textContent = state.level;
  $("xpText").textContent = `${state.xp}/${state.xpToLevel}`;
  $("coinsText").textContent = state.coins;

  $("playerName").textContent = `${state.player.name} ${state.player.shield > 0 ? "🛡️" + state.player.shield : ""}`;
  $("playerSprite").textContent = state.player.icon;
  setBar("playerHpFill", state.player.hp, state.player.maxHp);
  setBar("playerManaFill", state.player.mana, state.player.maxMana);
  setBar("playerUltFill", state.player.ult, state.player.maxUlt);
  $("playerHpText").textContent = `HP ${state.player.hp}/${state.player.maxHp}`;
  $("playerManaText").textContent = `Mana ${state.player.mana}/${state.player.maxMana}`;
  $("playerUltText").textContent = `Ultimate ${state.player.ult}/${state.player.maxUlt}`;
  renderStatuses("playerStatuses", state.player.statuses);

  if (state.enemy) {
    $("enemyName").textContent = `${state.enemy.name} ${state.enemy.shield > 0 ? "🛡️" + state.enemy.shield : ""}`;
    $("enemySprite").textContent = state.enemy.icon;
    setBar("enemyHpFill", state.enemy.hp, state.enemy.maxHp);
    $("enemyHpText").textContent = `HP ${state.enemy.hp}/${state.enemy.maxHp} • DEF ${state.enemy.defense}`;
    renderStatuses("enemyStatuses", state.enemy.statuses);
  }

  const turnMessages = {
    player: "Your turn",
    enemy: "Enemy turn",
    animating: "Attacking...",
    upgrade: "Choose an upgrade",
    gameover: "Game over"
  };
  $("turnText").textContent = turnMessages[state.phase] || "Battle";

  for (const button of document.querySelectorAll(".action-btn")) {
    const key = button.dataset.power;
    const power = getPower(key);
    if (!power) {
      button.classList.add("hidden");
      continue;
    }
    button.classList.remove("hidden");
    button.classList.toggle("locked", !isPowerUnlocked(key));

    if (!isPowerUnlocked(key)) {
      button.innerHTML = `<strong>🔒 ${power.label}</strong><small>Unlocks at Level ${getPowerUnlockLevel(key)}.</small>`;
      button.disabled = true;
      continue;
    }

    const costText = power.ultCost ? `ULT ${power.ultCost}` : power.cost > 0 ? `Mana ${power.cost}` : "Free";
    button.innerHTML = `<strong>${power.icon} ${power.label}</strong><small>${power.desc}<br>${costText}</small>`;
    button.disabled = state.phase !== "player" || state.player.mana < power.cost || Boolean(power.ultCost && state.player.ult < power.ultCost);
  }

  renderLog();
}

function setBar(id, value, max) {
  const percent = max <= 0 ? 0 : clamp((value / max) * 100, 0, 100);
  $(id).style.width = `${percent}%`;
}

function renderStatuses(id, statuses) {
  const row = $(id);
  row.innerHTML = "";
  for (const status of statuses) {
    const badge = document.createElement("span");
    badge.className = "status-badge";
    badge.textContent = `${statusIcon(status.type)} ${status.turns}`;
    row.appendChild(badge);
  }
}

function addLog(message) {
  recentLog.unshift(message);
  recentLog = recentLog.slice(0, 10);
}

function renderLog() {
  const log = $("battleLog");
  log.innerHTML = recentLog.map((item) => `<p>${item}</p>`).join("");
}

function addFloatingText(text, mood = "bad", target = "enemy") {
  const layer = $("effectLayer");
  if (!layer) return;
  const item = document.createElement("div");
  item.className = `damage-number ${mood}`;
  item.textContent = text;
  item.style.left = target === "player" ? "25%" : "75%";
  item.style.top = target === "player" ? "62%" : "35%";
  layer.appendChild(item);
  setTimeout(() => item.remove(), 860);
}

async function playAnimation(type) {
  const layer = $("effectLayer");
  const battleScreen = $("battleScreen");
  const playerSprite = $("playerSprite");

  playerSprite.classList.add("attack-lunge");
  setTimeout(() => playerSprite.classList.remove("attack-lunge"), 380);

  if (type === "combo") {
    battleScreen.classList.add("screen-shake");
    for (let i = 0; i < 5; i++) {
      const slash = document.createElement("div");
      slash.className = i % 2 ? "shadow-effect" : "slash-effect";
      slash.style.transform = `rotate(${i % 2 ? 35 : -35}deg)`;
      layer.appendChild(slash);
      setTimeout(() => slash.remove(), 450);
      await sleep(95);
    }
    battleScreen.classList.remove("screen-shake");
    return;
  }

  let effect = document.createElement("div");

  if (type === "fireball" || type === "meteor") {
    effect.className = "projectile";
    if (type === "meteor") battleScreen.classList.add("screen-shake", "ultimate-flash");
  } else if (type === "lightning") {
    effect.className = "lightning-effect";
    effect.textContent = "⚡";
    battleScreen.classList.add("screen-shake");
  } else if (type === "ice") {
    effect.className = "ice-effect";
    effect.textContent = "❄️";
  } else if (type === "drain") {
    effect.className = "drain-effect";
    effect.textContent = "🌀";
    battleScreen.classList.add("screen-shake");
  } else if (type === "nova") {
    effect.className = "nova-effect";
    battleScreen.classList.add("screen-shake", "ultimate-flash");
  } else if (type === "heal") {
    effect.className = "heal-effect";
  } else if (type === "shield") {
    effect.className = "shield-effect";
  } else if (type === "poison") {
    effect.className = "poison-effect";
  } else if (type === "buff") {
    effect.className = "buff-effect";
  } else if (type === "shadow") {
    effect.className = "shadow-effect";
  } else {
    effect.className = "slash-effect";
  }

  layer.appendChild(effect);
  await sleep(type === "meteor" || type === "nova" ? 720 : 540);
  effect.remove();
  battleScreen.classList.remove("screen-shake", "ultimate-flash");
}

async function playEnemyAnimation(big = false) {
  const enemySprite = $("enemySprite");
  const battleScreen = $("battleScreen");
  enemySprite.classList.add("enemy-lunge");
  if (big) battleScreen.classList.add("screen-shake");
  await sleep(big ? 520 : 380);
  enemySprite.classList.remove("enemy-lunge");
  battleScreen.classList.remove("screen-shake");
}

function saveGame() {
  if (!state || state.phase === "gameover") return;
  localStorage.setItem(SAVE_KEY, JSON.stringify({ state, recentLog }));
  updateContinueButton();
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;

  try {
    const saved = JSON.parse(raw);
    state = saved.state;
    state.mods = { ...defaultMods(), ...(state.mods || {}) };
    state.player.statuses = state.player.statuses || [];
    if (state.enemy) state.enemy.statuses = state.enemy.statuses || [];
    recentLog = saved.recentLog || [];
    $("startScreen").classList.add("hidden");
    $("battleScreen").classList.remove("hidden");
    $("gameOverScreen").classList.add("hidden");
    $("upgradeScreen").classList.add("hidden");
    $("shopScreen").classList.add("hidden");
    if (state.phase === "enemy" || state.phase === "animating") state.phase = "player";
    if (state.phase === "upgrade") state.phase = "player";
    render();
    return true;
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
    return false;
  }
}

function updateContinueButton() {
  const hasSave = Boolean(localStorage.getItem(SAVE_KEY));
  $("continueBtn").classList.toggle("hidden", !hasSave);
}

function deleteSave() {
  localStorage.removeItem(SAVE_KEY);
  updateContinueButton();
  if (state) {
    addLog("Save deleted.");
    render();
  }
}

function restartToMenu() {
  localStorage.removeItem(SAVE_KEY);
  state = null;
  recentLog = [];
  $("battleScreen").classList.add("hidden");
  $("gameOverScreen").classList.add("hidden");
  $("shopScreen").classList.add("hidden");
  $("startScreen").classList.remove("hidden");
  updateContinueButton();
}

function wireEvents() {
  document.querySelectorAll(".class-card").forEach((button) => {
    button.addEventListener("click", () => startNewRun(button.dataset.class));
  });

  document.querySelectorAll(".action-btn").forEach((button) => {
    button.addEventListener("click", () => usePower(button.dataset.power));
  });

  $("continueBtn").addEventListener("click", loadGame);
  $("saveBtn").addEventListener("click", () => {
    saveGame();
    addLog("Game saved.");
    render();
  });
  $("shopBtn").addEventListener("click", showShop);
  $("closeShopBtn").addEventListener("click", closeShop);
  $("resetBtn").addEventListener("click", deleteSave);
  $("restartBtn").addEventListener("click", restartToMenu);
}


/* === EMX Soul Arena v3: Evolution Update === */
const RARITY_WEIGHT = { Common: 70, Rare: 43, Epic: 24, Legendary: 10, Mythic: 4 };
const RARITY_ORDER = { Common: 1, Rare: 2, Epic: 3, Legendary: 4, Mythic: 5 };

const ELITE_MODIFIERS = [
  {
    id: "armored",
    prefix: "Armored",
    apply(enemy) {
      enemy.defense += 5;
      enemy.shield += 18 + state.wave;
    }
  },
  {
    id: "burning",
    prefix: "Burning",
    apply(enemy) {
      enemy.attack += 3;
      enemy.eliteStatus = { type: "burn", chance: 0.42, turns: 2, damage: 5 };
    }
  },
  {
    id: "vampiric",
    prefix: "Vampiric",
    apply(enemy) {
      enemy.lifesteal = Math.max(enemy.lifesteal || 0, 0.32);
      enemy.attack += 2;
    }
  },
  {
    id: "toxic",
    prefix: "Toxic",
    apply(enemy) {
      enemy.eliteStatus = { type: "poison", chance: 0.48, turns: 3, damage: 5 };
    }
  },
  {
    id: "berserker",
    prefix: "Berserker",
    apply(enemy) {
      enemy.attack += 4;
      enemy.berserker = true;
    }
  },
  {
    id: "mirror",
    prefix: "Mirror",
    apply(enemy) {
      enemy.reflectPct = 0.08;
      enemy.defense += 2;
    }
  },
  {
    id: "explosive",
    prefix: "Explosive",
    apply(enemy) {
      enemy.explosive = true;
      enemy.hp += 12 + state.wave * 2;
      enemy.maxHp += 12 + state.wave * 2;
    }
  }
];

const BOSS_LOOT = [
  {
    id: "emberStaff",
    rarity: "Rare",
    icon: "🔥",
    title: "Ember Staff",
    desc: "Fire powers deal +14 damage. Burn lasts +1 turn.",
    effect() {
      state.mods.fireDamage += 14;
      state.mods.statusDuration += 1;
    }
  },
  {
    id: "shadowRing",
    rarity: "Rare",
    icon: "💍",
    title: "Shadow Ring",
    desc: "Crit chance +14%. Crits grant shield.",
    effect() {
      state.mods.critBonus += 0.14;
      state.mods.critShield += 8;
    }
  },
  {
    id: "stormPlate",
    rarity: "Epic",
    icon: "🛡️",
    title: "Storm Plate",
    desc: "Start fights with +34 shield. Lightning hits harder.",
    effect() {
      state.mods.startShield += 34;
      state.mods.lightningDamage += 9;
    }
  },
  {
    id: "venomCharm",
    rarity: "Epic",
    icon: "☠️",
    title: "Venom Charm",
    desc: "Poison ramps up and poison damage heals you a little.",
    effect() {
      state.mods.poisonRamp += 2;
      state.mods.poisonLeech += 0.25;
    }
  },
  {
    id: "phoenixCore",
    rarity: "Legendary",
    icon: "🌅",
    title: "Phoenix Core",
    desc: "Gain a revive and +25 max HP.",
    effect() {
      state.mods.revive += 1;
      state.player.maxHp += 25;
      healTarget(state.player, 25, true);
    }
  },
  {
    id: "voidBlade",
    rarity: "Legendary",
    icon: "🗡️",
    title: "Void Blade",
    desc: "Attacks can ignore defense. Skills can double cast.",
    effect() {
      state.mods.ignoreDefenseChance += 0.18;
      state.mods.doubleCastChance += 0.12;
    }
  },
  {
    id: "emxEngine",
    rarity: "Mythic",
    icon: "⚙️",
    title: "EMX Engine",
    desc: "Overdrive deals more damage and charges ultimate faster.",
    effect() {
      state.mods.overdriveDamage += 0.35;
      state.mods.ultGain += 8;
      state.comboMax = Math.max(4, state.comboMax - 1);
    }
  }
];

const POWER_EVOLUTIONS = [
  {
    id: "evoFlameFireball",
    kind: "Power Evolution",
    rarity: "Epic",
    classKey: "flame",
    powerKey: "special",
    title: "Evolve Fireball: Explosive Orb",
    desc: "Fireball becomes a double-hit nova with stronger burn.",
    condition: () => state.classKey === "flame" && state.level >= 3 && !state.evolutions.special,
    apply() {
      state.evolutions.special = "explosiveFireball";
      state.mods.fireDamage += 6;
    }
  },
  {
    id: "evoFlameMeteor",
    kind: "Power Evolution",
    rarity: "Legendary",
    classKey: "flame",
    powerKey: "ultimate",
    title: "Evolve Ultimate: Phoenix Meteor",
    desc: "Ultimate hits harder, heals you, and grants a revive shard.",
    condition: () => state.classKey === "flame" && state.level >= 7 && !state.evolutions.ultimate,
    apply() {
      state.evolutions.ultimate = "phoenixMeteor";
      state.mods.revive += 1;
    }
  },
  {
    id: "evoRoguePoison",
    kind: "Power Evolution",
    rarity: "Epic",
    classKey: "rogue",
    powerKey: "special",
    title: "Evolve Poison Blade: Venom Fang",
    desc: "Poison Blade poisons harder and poison grows every tick.",
    condition: () => state.classKey === "rogue" && state.level >= 3 && !state.evolutions.special,
    apply() {
      state.evolutions.special = "venomFang";
      state.mods.poisonRamp += 2;
    }
  },
  {
    id: "evoRogueClone",
    kind: "Power Evolution",
    rarity: "Legendary",
    classKey: "rogue",
    powerKey: "skill2",
    title: "Evolve Shadow Clone: Silent Clone",
    desc: "Shadow Clone can grant an instant extra turn.",
    condition: () => state.classKey === "rogue" && state.level >= 6 && !state.evolutions.skill2,
    apply() {
      state.evolutions.skill2 = "silentClone";
      state.mods.freeTurnChance += 0.18;
    }
  },
  {
    id: "evoStormThunder",
    kind: "Power Evolution",
    rarity: "Epic",
    classKey: "storm",
    powerKey: "special",
    title: "Evolve Thunder Strike: Chain Lightning",
    desc: "Lightning powers gain extra hits and more stun pressure.",
    condition: () => state.classKey === "storm" && state.level >= 3 && !state.evolutions.special,
    apply() {
      state.evolutions.special = "chainLightning";
      state.mods.chainLightning += 1;
    }
  },
  {
    id: "evoStormParry",
    kind: "Power Evolution",
    rarity: "Legendary",
    classKey: "storm",
    powerKey: "guard",
    title: "Evolve Parry: Thunder Guard",
    desc: "Parry gives more shield and shocks attackers harder.",
    condition: () => state.classKey === "storm" && state.level >= 6 && !state.evolutions.guard,
    apply() {
      state.evolutions.guard = "thunderGuard";
      state.mods.shieldBonus += 18;
    }
  },
  {
    id: "evoNatureHeal",
    kind: "Power Evolution",
    rarity: "Epic",
    classKey: "nature",
    powerKey: "heal",
    title: "Evolve Bloom Heal: Life Bloom",
    desc: "Overhealing becomes shield and heals gain regeneration.",
    condition: () => state.classKey === "nature" && state.level >= 3 && !state.evolutions.heal,
    apply() {
      state.evolutions.heal = "lifeBloom";
      state.mods.overhealShield = true;
    }
  },
  {
    id: "evoNaturePoison",
    kind: "Power Evolution",
    rarity: "Legendary",
    classKey: "nature",
    powerKey: "special",
    title: "Evolve Spores: Toxic Bloom",
    desc: "Poison Spores hit harder and poison heals you each tick.",
    condition: () => state.classKey === "nature" && state.level >= 6 && !state.evolutions.special,
    apply() {
      state.evolutions.special = "toxicBloom";
      state.mods.poisonLeech += 0.35;
      state.mods.statusDamage += 2;
    }
  }
];

const CLASS_EVOLUTIONS = [
  {
    id: "classInfernoWarlock",
    kind: "Class Evolution",
    rarity: "Mythic",
    classKey: "flame",
    title: "Class Evolution: Inferno Warlock",
    desc: "Fire damage +20, burn spread, and ultimates hit harder.",
    condition: () => state.classKey === "flame" && state.level >= 10 && !state.classEvolution,
    apply() {
      state.classEvolution = "Inferno Warlock";
      state.mods.fireDamage += 20;
      state.mods.burnSpread = true;
      state.mods.overdriveDamage += 0.15;
    }
  },
  {
    id: "classPhoenixSage",
    kind: "Class Evolution",
    rarity: "Mythic",
    classKey: "flame",
    title: "Class Evolution: Phoenix Sage",
    desc: "Healing converts overflow to shield and you gain another revive.",
    condition: () => state.classKey === "flame" && state.level >= 10 && !state.classEvolution,
    apply() {
      state.classEvolution = "Phoenix Sage";
      state.mods.overhealShield = true;
      state.mods.revive += 1;
      state.mods.healBonus += 20;
    }
  },
  {
    id: "classNightAssassin",
    kind: "Class Evolution",
    rarity: "Mythic",
    classKey: "rogue",
    title: "Class Evolution: Night Assassin",
    desc: "Crit chance +18%, crits give shield, and combo grows faster.",
    condition: () => state.classKey === "rogue" && state.level >= 10 && !state.classEvolution,
    apply() {
      state.classEvolution = "Night Assassin";
      state.mods.critBonus += 0.18;
      state.mods.critShield += 12;
      state.mods.comboOnCrit += 1;
    }
  },
  {
    id: "classVenomReaper",
    kind: "Class Evolution",
    rarity: "Mythic",
    classKey: "rogue",
    title: "Class Evolution: Venom Reaper",
    desc: "Poison ramps up, poison heals you, and status chance rises.",
    condition: () => state.classKey === "rogue" && state.level >= 10 && !state.classEvolution,
    apply() {
      state.classEvolution = "Venom Reaper";
      state.mods.poisonRamp += 3;
      state.mods.poisonLeech += 0.45;
      state.mods.statusChance += 0.15;
    }
  },
  {
    id: "classThunderPaladin",
    kind: "Class Evolution",
    rarity: "Mythic",
    classKey: "storm",
    title: "Class Evolution: Thunder Paladin",
    desc: "Shields are stronger and shielded hits build combo.",
    condition: () => state.classKey === "storm" && state.level >= 10 && !state.classEvolution,
    apply() {
      state.classEvolution = "Thunder Paladin";
      state.mods.shieldBonus += 28;
      state.mods.startShield += 25;
      state.mods.comboShield += 1;
    }
  },
  {
    id: "classTitanSlayer",
    kind: "Class Evolution",
    rarity: "Mythic",
    classKey: "storm",
    title: "Class Evolution: Titan Slayer",
    desc: "Boss and elite enemies take much more damage.",
    condition: () => state.classKey === "storm" && state.level >= 10 && !state.classEvolution,
    apply() {
      state.classEvolution = "Titan Slayer";
      state.mods.bossDamage += 0.35;
      state.mods.eliteDamage += 0.28;
      state.mods.lightningDamage += 16;
    }
  },
  {
    id: "classLifeDruid",
    kind: "Class Evolution",
    rarity: "Mythic",
    classKey: "nature",
    title: "Class Evolution: Life Druid",
    desc: "Healing, regen, and overheal shields become much stronger.",
    condition: () => state.classKey === "nature" && state.level >= 10 && !state.classEvolution,
    apply() {
      state.classEvolution = "Life Druid";
      state.mods.healBonus += 28;
      state.mods.overhealShield = true;
      state.mods.statusDuration += 1;
    }
  },
  {
    id: "classPlagueBloom",
    kind: "Class Evolution",
    rarity: "Mythic",
    classKey: "nature",
    title: "Class Evolution: Plague Bloom",
    desc: "Poison damage explodes upward and poison ticks heal you.",
    condition: () => state.classKey === "nature" && state.level >= 10 && !state.classEvolution,
    apply() {
      state.classEvolution = "Plague Bloom";
      state.mods.statusDamage += 6;
      state.mods.poisonRamp += 3;
      state.mods.poisonLeech += 0.55;
    }
  }
];

const EXTRA_UPGRADES = [
  {
    id: "comboMaster",
    rarity: "Rare",
    title: "Combo Master",
    desc: "Combo fills faster and breaks less when hit.",
    apply() {
      state.mods.comboGain += 1;
      state.mods.comboProtection += 1;
    }
  },
  {
    id: "criticalBarrier",
    rarity: "Rare",
    title: "Critical Barrier",
    desc: "Critical hits give +10 shield.",
    apply() {
      state.mods.critShield += 10;
    }
  },
  {
    id: "hunterChip",
    rarity: "Rare",
    title: "Elite Hunter Chip",
    desc: "Deal +20% damage to elite enemies.",
    apply() {
      state.mods.eliteDamage += 0.2;
    }
  },
  {
    id: "killHeal",
    rarity: "Rare",
    title: "Victory Drain",
    desc: "After every win, heal 18 extra HP.",
    apply() {
      state.mods.killHeal += 18;
    }
  },
  {
    id: "twinCast",
    rarity: "Legendary",
    title: "Twin Cast",
    desc: "Damage skills have a 16% chance to cast twice.",
    apply() {
      state.mods.doubleCastChance += 0.16;
    }
  },
  {
    id: "bloodPact",
    rarity: "Epic",
    title: "Blood Pact",
    desc: "Under 50% HP, you deal +28% damage.",
    apply() {
      state.mods.lowHpDamage += 0.28;
    }
  },
  {
    id: "voidBreaker",
    rarity: "Legendary",
    title: "Void Breaker",
    desc: "Attacks have a 20% chance to ignore enemy defense.",
    apply() {
      state.mods.ignoreDefenseChance += 0.2;
    }
  },
  {
    id: "emxOverdrive",
    rarity: "Mythic",
    title: "EMX Overdrive",
    desc: "Full combo attacks become cinematic and deal huge bonus damage.",
    apply() {
      state.mods.overdriveDamage += 0.45;
      state.mods.ultGain += 8;
      state.comboMax = Math.max(4, state.comboMax - 1);
    }
  }
];

const EXTRA_SHOP_ITEMS = [
  {
    id: "comboCharge",
    rarity: "Rare",
    price: 45,
    title: "Combo Charger",
    desc: "Instantly fill your combo meter.",
    buy() {
      gainCombo(state.comboMax);
    }
  },
  {
    id: "trainingManual",
    rarity: "Rare",
    price: 70,
    title: "Training Manual",
    desc: "Gain 55 XP immediately.",
    buy() {
      state.xp += 55;
      checkLevelUp();
    }
  },
  {
    id: "mysteryRelic",
    rarity: "Legendary",
    price: 145,
    title: "Mystery Relic",
    desc: "Gain a random boss relic without waiting for a boss.",
    buy() {
      grantRelic(choice(BOSS_LOOT));
    }
  },
  {
    id: "powerSpark",
    rarity: "Epic",
    price: 110,
    title: "Power Spark",
    desc: "Attempts to trigger a random available power evolution.",
    buy() {
      const available = POWER_EVOLUTIONS.filter((item) => !item.condition || item.condition());
      if (!available.length) {
        addLog("No power evolution is available yet.");
        state.coins += getShopPrice(this);
        return;
      }
      const upgrade = choice(available);
      upgrade.apply();
      addLog(`Power Spark activated: ${upgrade.title}.`);
    }
  }
];

SHOP_ITEMS.push(...EXTRA_SHOP_ITEMS);

function rarityClass(rarity) {
  return String(rarity || "Common").toLowerCase();
}

function defaultMods() {
  return {
    basicDamage: 0,
    specialDamage: 0,
    healBonus: 0,
    shieldBonus: 0,
    critBonus: 0,
    statusChance: 0,
    statusDuration: 0,
    statusDamage: 0,
    manaRegen: 6,
    startShield: 0,
    lifeSteal: 0,
    damageReduction: 0,
    ultGain: 10,
    extraHitChance: 0,
    bossDamage: 0,
    revive: 0,
    doubleCastChance: 0,
    freeTurnChance: 0,
    chainLightning: 0,
    poisonRamp: 0,
    poisonLeech: 0,
    burnSpread: false,
    fireDamage: 0,
    lightningDamage: 0,
    natureDamage: 0,
    shadowDamage: 0,
    eliteDamage: 0,
    lowHpDamage: 0,
    ignoreDefenseChance: 0,
    overdriveDamage: 0.35,
    overhealShield: false,
    critShield: 0,
    comboGain: 0,
    comboOnCrit: 0,
    comboProtection: 0,
    comboShield: 0,
    killHeal: 0,
    shopDiscount: 0,
    firstStrikeCrit: false
  };
}

function makeState(classKey) {
  const classData = CLASS_DATA[classKey];

  return {
    active: true,
    phase: "player",
    classKey,
    classEvolution: null,
    wave: 1,
    level: 1,
    xp: 0,
    xpToLevel: 60,
    coins: 0,
    combo: 0,
    comboMax: 5,
    evolutions: {},
    relics: [],
    stats: { kills: 0, bosses: 0 },
    lastCompletedWave: 0,
    shopReady: false,
    nextEnemyBurn: false,
    activeOverdrive: false,
    extraTurnReady: false,
    firstStrikeReady: false,
    player: {
      name: classData.name,
      icon: classData.icon,
      hp: classData.maxHp,
      maxHp: classData.maxHp,
      mana: classData.maxMana,
      maxMana: classData.maxMana,
      ult: 0,
      maxUlt: 100,
      shield: 0,
      statuses: []
    },
    enemy: null,
    mods: defaultMods()
  };
}

function ensureV3State() {
  if (!state) return;
  state.mods = { ...defaultMods(), ...(state.mods || {}) };
  state.evolutions = state.evolutions || {};
  state.relics = state.relics || [];
  state.stats = state.stats || { kills: 0, bosses: 0 };
  state.combo = Number.isFinite(state.combo) ? state.combo : 0;
  state.comboMax = state.comboMax || 5;
  state.lastCompletedWave = state.lastCompletedWave || 0;
  state.shopReady = Boolean(state.shopReady);
  state.classEvolution = state.classEvolution || null;
  state.player.statuses = state.player.statuses || [];
  if (state.enemy) state.enemy.statuses = state.enemy.statuses || [];
}

function startNewRun(classKey) {
  state = makeState(classKey);
  recentLog = [];
  $("startScreen").classList.add("hidden");
  $("battleScreen").classList.remove("hidden");
  $("gameOverScreen").classList.add("hidden");
  $("upgradeScreen").classList.add("hidden");
  $("shopScreen").classList.add("hidden");
  addLog(`You entered the arena as ${CLASS_DATA[classKey].name}.`);
  addLog("Evolution Update active: elites, relics, combo, and class evolutions unlocked.");
  startFight();
}

function startFight() {
  ensureV3State();
  state.phase = "player";
  state.enemy = createEnemy(state.wave);
  state.player.shield = state.mods.startShield;
  state.player.mana = clamp(state.player.mana + 10, 0, state.player.maxMana);
  state.firstStrikeReady = true;
  clearDeadStatuses(state.player);

  if (state.nextEnemyBurn) {
    addStatus(state.enemy, { type: "burn", turns: 3, damage: 7 + state.mods.statusDamage });
    state.nextEnemyBurn = false;
    addLog("Wildfire spread into the next wave.");
  }

  addLog(`Wave ${state.wave}: ${state.enemy.name} appears!`);
  if (state.enemy.elite) addLog(`Elite modifier active: ${state.enemy.eliteLabels.join(" + ")}.`);
  if (state.enemy.isBoss) addLog("Boss battle! Win to claim a relic.");
  render();
  saveGame();
}

function createEnemy(wave) {
  const isBoss = wave % 5 === 0;
  const base = isBoss ? BOSSES[((wave / 5) - 1) % BOSSES.length] : choice(ENEMIES);
  const scale = isBoss ? 1 + wave * 0.18 : 1 + wave * 0.14;
  const enemy = {
    ...base,
    status: base.status ? { ...base.status } : undefined,
    hp: Math.round(base.hp * scale + wave * 4),
    maxHp: Math.round(base.hp * scale + wave * 4),
    attack: Math.round(base.attack * scale + wave * 0.8),
    defense: Math.round(base.defense + wave * 0.45),
    statuses: [],
    shield: 0,
    isBoss,
    turn: 0,
    charging: false,
    elite: false,
    eliteLabels: []
  };

  if (!isBoss && wave >= 3 && Math.random() < Math.min(0.25 + wave * 0.018, 0.68)) {
    applyEliteModifiers(enemy, wave >= 12 && Math.random() < 0.24 ? 2 : 1);
  }

  if (isBoss && wave >= 15) {
    enemy.name = `Ascended ${enemy.name}`;
    enemy.attack += 4;
    enemy.defense += 3;
    enemy.shield += 32;
    enemy.elite = true;
    enemy.eliteLabels.push("Ascended");
  }

  return enemy;
}

function applyEliteModifiers(enemy, count = 1) {
  const pool = [...ELITE_MODIFIERS];
  for (let i = 0; i < count && pool.length; i++) {
    const index = rand(0, pool.length - 1);
    const modifier = pool.splice(index, 1)[0];
    enemy.elite = true;
    enemy.eliteLabels.push(modifier.prefix);
    enemy.eliteIds = enemy.eliteIds || [];
    enemy.eliteIds.push(modifier.id);
    modifier.apply(enemy);
  }
  enemy.name = `${enemy.eliteLabels.join(" ")} ${enemy.name}`;
}

function powers() {
  return CLASS_DATA[state.classKey].powers;
}

function getPower(key) {
  if (!state) return null;
  const base = powers()[key];
  if (!base) return null;
  const power = {
    ...base,
    status: base.status ? { ...base.status } : undefined,
    selfStatus: base.selfStatus ? { ...base.selfStatus } : undefined
  };
  applyEvolutionToPower(key, power);
  applyClassEvolutionToPower(key, power);
  return power;
}

function applyEvolutionToPower(key, power) {
  const evo = state.evolutions?.[key];
  if (!evo) return;

  if (evo === "explosiveFireball") {
    power.icon = "💣";
    power.label = "Explosive Fireball";
    power.desc = "Double-hit nova + stronger burn.";
    power.damage += 8;
    power.hits = Math.max(power.hits || 1, 2);
    power.animation = "nova";
    power.status = { type: "burn", chance: 0.85, turns: 4, damage: 9 };
  }

  if (evo === "phoenixMeteor") {
    power.icon = "🌅";
    power.label = "Phoenix Meteor";
    power.desc = "Meteor, heal, revive energy.";
    power.damage += 22;
    power.heal = (power.heal || 0) + 24;
  }

  if (evo === "venomFang") {
    power.icon = "🐍";
    power.label = "Venom Fang";
    power.desc = "Poison grows every tick.";
    power.damage += 6;
    power.status = { type: "poison", chance: 1, turns: 5, damage: 8 };
  }

  if (evo === "silentClone") {
    power.icon = "👥";
    power.label = "Silent Clone";
    power.desc = "Double hit + possible extra turn.";
    power.hits = Math.max(power.hits || 1, 3);
    power.crit = Math.min((power.crit || 0) + 0.12, 0.75);
  }

  if (evo === "chainLightning") {
    power.icon = "🔗";
    power.label = "Chain Lightning";
    power.desc = "Lightning jumps and stuns.";
    power.hits = Math.max(power.hits || 1, 2 + state.mods.chainLightning);
    power.damage += 5;
    if (power.status) power.status.chance = Math.min(1, power.status.chance + 0.12);
  }

  if (evo === "thunderGuard") {
    power.icon = "⚡";
    power.label = "Thunder Guard";
    power.desc = "Huge shield + stronger reflect.";
    power.shield += 18;
    power.selfStatus = { type: "parry", turns: 2 };
  }

  if (evo === "lifeBloom") {
    power.icon = "💚";
    power.label = "Life Bloom";
    power.desc = "Overheal shield + regeneration.";
    power.heal += 16;
    power.selfStatus = { type: "regen", turns: 3, damage: 7 };
  }

  if (evo === "toxicBloom") {
    power.icon = "🧪";
    power.label = "Toxic Bloom";
    power.desc = "Poison blast + leech.";
    power.damage += 8;
    power.status = { type: "poison", chance: 1, turns: 5, damage: 10 };
  }
}

function applyClassEvolutionToPower(key, power) {
  if (!state.classEvolution) return;

  if (["Inferno Warlock", "Phoenix Sage"].includes(state.classEvolution) && ["basic", "special", "skill1", "skill2", "skill3", "ultimate"].includes(key)) {
    if (["fireball", "meteor", "nova", "slash"].includes(power.animation)) power.damage = power.damage ? power.damage + 5 : power.damage;
  }

  if (["Night Assassin", "Venom Reaper"].includes(state.classEvolution)) {
    if (power.damage) power.crit = Math.min((power.crit || 0) + 0.06, 0.85);
  }

  if (["Thunder Paladin", "Titan Slayer"].includes(state.classEvolution) && power.animation === "lightning") {
    power.damage = power.damage ? power.damage + 8 : power.damage;
  }

  if (["Life Druid", "Plague Bloom"].includes(state.classEvolution) && (power.heal || power.status?.type === "poison")) {
    if (power.heal) power.heal += 10;
    if (power.status?.type === "poison") power.status.damage += 3;
  }
}

function getPowerUnlockLevel(key) {
  const power = getPower(key);
  return power ? power.unlock || 1 : 99;
}

function isPowerUnlocked(key) {
  return state.level >= getPowerUnlockLevel(key);
}

async function usePower(key) {
  ensureV3State();
  if (!state || state.phase !== "player") return;

  const power = getPower(key);
  if (!power) return;

  if (!isPowerUnlocked(key)) {
    addLog(`${power.label} unlocks at level ${getPowerUnlockLevel(key)}.`);
    render();
    return;
  }

  if (state.player.mana < power.cost) {
    addLog("Not enough mana.");
    render();
    return;
  }
  if (power.ultCost && state.player.ult < power.ultCost) {
    addLog("Your ultimate is not charged yet.");
    render();
    return;
  }

  state.phase = "animating";
  state.activeOverdrive = state.combo >= state.comboMax;
  render();

  state.player.mana -= power.cost;
  if (power.ultCost) state.player.ult -= power.ultCost;

  if (state.activeOverdrive) addLog("EMX OVERDRIVE activated!");
  addLog(`You used ${power.label}.`);
  await playAnimation(power.animation || "slash");
  applyPlayerPower(key, power);

  if (state.enemy.hp <= 0) {
    await sleep(450);
    winFight();
    return;
  }

  if (state.extraTurnReady) {
    state.extraTurnReady = false;
    state.phase = "player";
    addLog("Extra turn gained!");
    render();
    saveGame();
    return;
  }

  await sleep(520);
  await enemyTurn();
}

function applyPlayerPower(key, power) {
  let totalDamage = 0;
  let anyCrit = false;
  let statusApplied = false;
  const doubleCast = power.damage && !power.ultCost && Math.random() < state.mods.doubleCastChance;
  const casts = doubleCast ? 2 : 1;

  if (doubleCast) addLog("Twin Cast triggered!");

  for (let cast = 0; cast < casts; cast++) {
    let hits = power.hits || 1;
    if (power.damage && power.animation === "lightning" && state.mods.chainLightning > 0 && key !== "ultimate") hits += state.mods.chainLightning;
    if (power.damage && !power.ultCost && Math.random() < state.mods.extraHitChance) {
      hits += 1;
      addLog("Combo Engine added an extra hit!");
    }

    for (let i = 0; i < hits; i++) {
      if (power.damage) {
        const result = calculatePlayerDamage(key, power);
        damageEnemy(result.damage);
        totalDamage += result.damage;
        if (result.crit) {
          anyCrit = true;
          addLog("Critical hit!");
          if (state.mods.critShield > 0) {
            state.player.shield += state.mods.critShield;
            addFloatingText(`+${state.mods.critShield} Shield`, "good", "player");
          }
        }
      }
    }

    if (power.heal) {
      const amount = power.heal + state.mods.healBonus;
      healTarget(state.player, amount, true);
    }

    if (power.shield) {
      const amount = power.shield + state.mods.shieldBonus;
      state.player.shield += amount;
      addFloatingText(`+${amount} Shield`, "good", "player");
      addLog(`You gained ${amount} shield.`);
    }

    if (power.manaGain) {
      state.player.mana = clamp(state.player.mana + power.manaGain, 0, state.player.maxMana);
      addLog(`You restored ${power.manaGain} mana.`);
    }

    if (power.cleanse) cleansePlayer();
    if (power.selfStatus) addStatus(state.player, normalizeStatus(power.selfStatus));

    if (power.status) {
      const chance = clamp(power.status.chance + state.mods.statusChance, 0, 1);
      if (Math.random() < chance) {
        const status = normalizeStatus(power.status);
        addStatus(state.enemy, status);
        statusApplied = true;
      }
    }
  }

  if (state.evolutions?.skill2 === "silentClone" && key === "skill2" && Math.random() < state.mods.freeTurnChance + 0.2) {
    state.extraTurnReady = true;
  }

  if (totalDamage > 0 && state.mods.lifeSteal > 0) {
    healTarget(state.player, Math.max(1, Math.round(totalDamage * state.mods.lifeSteal)), true);
  }

  const ultGain = power.ultCost ? 0 : state.mods.ultGain;
  state.player.ult = clamp(state.player.ult + ultGain, 0, state.player.maxUlt);

  if (state.activeOverdrive) {
    state.combo = 0;
    state.activeOverdrive = false;
  } else {
    gainCombo(1 + state.mods.comboGain + (anyCrit ? 1 + state.mods.comboOnCrit : 0) + (statusApplied ? 1 : 0));
  }

  state.firstStrikeReady = false;
  render();
}

function normalizeStatus(status) {
  const clean = {
    type: status.type,
    turns: status.turns || 1,
    damage: status.damage || 0,
    ramp: false
  };

  if (["burn", "poison", "bleed", "regen", "weakness", "rage", "flameGuard"].includes(clean.type)) {
    clean.turns += state.mods.statusDuration;
  }

  if (["burn", "poison", "bleed"].includes(clean.type)) {
    clean.damage += state.mods.statusDamage;
  }

  if (clean.type === "poison" && state.mods.poisonRamp > 0) {
    clean.ramp = true;
    clean.damage += state.mods.poisonRamp;
  }

  return clean;
}

function calculatePlayerDamage(key, power) {
  let base = power.damage || 0;

  if (key === "basic") base += state.mods.basicDamage;
  if (key !== "basic") base += state.mods.specialDamage;
  if (["fireball", "meteor", "nova"].includes(power.animation)) base += state.mods.fireDamage;
  if (power.animation === "lightning") base += state.mods.lightningDamage;
  if (["shadow", "combo"].includes(power.animation)) base += state.mods.shadowDamage;
  if (power.status?.type === "poison" || power.status?.type === "root") base += state.mods.natureDamage;
  if (state.enemy.isBoss) base = Math.round(base * (1 + state.mods.bossDamage));
  if (state.enemy.elite) base = Math.round(base * (1 + state.mods.eliteDamage));
  if (state.player.hp <= state.player.maxHp * 0.5) base = Math.round(base * (1 + state.mods.lowHpDamage));
  if (hasStatus(state.player, "rage")) base = Math.round(base * 1.25);
  if (hasStatus(state.enemy, "weakness")) base = Math.round(base * 1.2);
  if (state.combo >= 3) base = Math.round(base * 1.08);
  if (state.activeOverdrive) base = Math.round(base * (1 + state.mods.overdriveDamage));

  base = Math.round(base * (Math.random() * 0.18 + 0.91));
  let critChance = clamp((power.crit || 0) + state.mods.critBonus, 0, 0.86);
  if (state.firstStrikeReady && state.mods.firstStrikeCrit) critChance = 1;
  const crit = Math.random() < critChance;
  if (crit) base = Math.round(base * 1.8);

  const ignoreDefense = Math.random() < state.mods.ignoreDefenseChance;
  const defensePenalty = ignoreDefense ? 0 : Math.round(state.enemy.defense * 0.4);
  if (ignoreDefense) addLog("Void Breaker ignored defense.");
  const damage = Math.max(1, base - defensePenalty);
  return { damage, crit };
}

function damageEnemy(amount) {
  const blocked = Math.min(state.enemy.shield || 0, amount);
  state.enemy.shield = Math.max(0, (state.enemy.shield || 0) - blocked);
  const realDamage = amount - blocked;
  state.enemy.hp = clamp(state.enemy.hp - realDamage, 0, state.enemy.maxHp);
  $("enemySprite").classList.add("hit");
  setTimeout(() => $("enemySprite") && $("enemySprite").classList.remove("hit"), 350);
  addFloatingText(`-${amount}`, "bad", "enemy");

  if (realDamage > 0 && state.enemy.reflectPct && state.enemy.hp > 0) {
    const reflected = Math.max(1, Math.round(realDamage * state.enemy.reflectPct));
    state.player.hp = clamp(state.player.hp - reflected, 0, state.player.maxHp);
    addFloatingText(`-${reflected}`, "bad", "player");
    addLog(`Mirror armor reflected ${reflected} damage.`);
  }

  if (state.enemy.hp <= 0 && state.enemy.explosive && !state.enemy.exploded) {
    state.enemy.exploded = true;
    const blast = 10 + state.wave * 2;
    addLog(`${state.enemy.name} exploded for ${blast} damage!`);
    damagePlayer(blast);
  }
}

function chooseEnemyMove() {
  const enemy = state.enemy;
  enemy.turn += 1;

  if (enemy.eliteStatus && Math.random() < 0.45) {
    return { name: "Elite Curse", damage: enemy.attack + 2, status: enemy.eliteStatus, big: enemy.eliteStatus.type === "burn" };
  }

  if (enemy.berserker && enemy.hp <= enemy.maxHp * 0.45) {
    return { name: "Berserker Frenzy", damage: enemy.attack + 12, big: true };
  }

  if (enemy.isBoss) {
    if (enemy.id === "stormTitan") {
      if (enemy.charging) {
        enemy.charging = false;
        return { name: "Titan Thunderblast", damage: enemy.attack + 20, big: true, status: { type: "stun", chance: 0.35, turns: 1 } };
      }
      if (enemy.turn % 3 === 0) {
        enemy.charging = true;
        return { name: "Storm Charge", damage: 0, big: false, shield: 24 };
      }
    }

    if (enemy.id === "goblinKing" && enemy.turn % 3 === 0) {
      return { name: "Royal Smash", damage: enemy.attack + 12, big: true };
    }

    if (enemy.id === "boneDragon" && enemy.turn % 2 === 0) {
      return { name: "Poison Breath", damage: enemy.attack + 5, big: true, status: { type: "poison", chance: 0.6, turns: 3, damage: 5 } };
    }

    if (enemy.id === "voidBeast") {
      enemy.attack += 2;
      return { name: "Void Hunger", damage: enemy.attack, big: enemy.turn % 2 === 0, status: { type: "weakness", chance: 0.25, turns: 2 } };
    }

    if (enemy.id === "emxOverlord") {
      if (enemy.turn % 4 === 0) return { name: "System Overload", damage: enemy.attack + 22, big: true, status: { type: "stun", chance: 0.3, turns: 1 } };
      if (enemy.turn % 2 === 0) return { name: "Neon Curse", damage: enemy.attack + 6, status: { type: "weakness", chance: 0.55, turns: 2 } };
    }
  }

  if (enemy.id === "golem" && Math.random() < 0.35) {
    return { name: "Stone Guard", damage: 0, shield: 24 };
  }

  if (enemy.status && Math.random() < 0.45) {
    return { name: "Cursed Strike", damage: enemy.attack, status: enemy.status };
  }

  if (enemy.lifesteal && Math.random() < 0.55) {
    return { name: "Blood Bite", damage: enemy.attack, lifesteal: enemy.lifesteal };
  }

  if (Math.random() < 0.16) {
    return { name: "Heavy Attack", damage: enemy.attack + rand(4, 10), big: true };
  }

  return { name: "Attack", damage: enemy.attack };
}

function damagePlayer(amount) {
  if (hasStatus(state.player, "dodge") && Math.random() < 0.68) {
    addFloatingText("DODGE", "good", "player");
    addLog("You dodged the attack.");
    gainCombo(1);
    return;
  }

  const reduction = clamp(state.mods.damageReduction, 0, 0.55);
  let incoming = Math.max(0, Math.round(amount * (1 - reduction)));

  if (hasStatus(state.player, "weakness")) incoming = Math.round(incoming * 1.12);

  const blocked = Math.min(state.player.shield, incoming);
  state.player.shield -= blocked;
  incoming -= blocked;

  state.player.hp = clamp(state.player.hp - incoming, 0, state.player.maxHp);
  state.player.ult = clamp(state.player.ult + 8, 0, state.player.maxUlt);

  $("playerSprite").classList.add("hit");
  setTimeout(() => $("playerSprite") && $("playerSprite").classList.remove("hit"), 350);

  if (incoming > 0) {
    addFloatingText(`-${incoming}`, "bad", "player");
    breakCombo(1);
  }
  if (blocked > 0) {
    addLog(`Your shield blocked ${blocked} damage.`);
    if (state.mods.comboShield > 0) gainCombo(state.mods.comboShield);
  }

  if (hasStatus(state.player, "parry") && blocked > 0) {
    const reflected = Math.max(3, Math.round(amount * (state.evolutions?.guard === "thunderGuard" ? 0.72 : 0.48)));
    damageEnemy(reflected);
    addLog(`Parry reflected ${reflected} damage.`);
  }

  if (hasStatus(state.player, "flameGuard") && blocked > 0) {
    addStatus(state.enemy, { type: "burn", turns: 2, damage: 5 + state.mods.statusDamage + Math.round(state.mods.fireDamage * 0.2) });
  }

  if (state.player.hp <= 0 && state.mods.revive > 0) {
    state.mods.revive -= 1;
    state.player.hp = Math.round(state.player.maxHp * 0.38);
    state.player.shield += 28;
    addLog("Phoenix Backup activated. You revived!");
    addFloatingText("REVIVE", "good", "player");
  }
}

function addStatus(target, status) {
  const type = status.type;
  const existing = target.statuses.find((item) => item.type === type);
  const cleanStatus = {
    type,
    turns: status.turns || 1,
    damage: status.damage || 0,
    ramp: Boolean(status.ramp)
  };

  if (existing) {
    existing.turns = Math.max(existing.turns, cleanStatus.turns);
    existing.damage = Math.max(existing.damage || 0, cleanStatus.damage || 0);
    existing.ramp = existing.ramp || cleanStatus.ramp;
  } else {
    target.statuses.push(cleanStatus);
  }

  addLog(`${target === state.player ? "You" : state.enemy.name} gained ${statusLabel(type)}.`);
  return true;
}

function processStatusTicks(target) {
  const isPlayer = target === state.player;
  const name = isPlayer ? "You" : state.enemy.name;

  for (const status of target.statuses) {
    if (["burn", "poison", "bleed"].includes(status.type)) {
      const amount = Math.max(1, status.damage || 1);
      target.hp = clamp(target.hp - amount, 0, target.maxHp);
      addFloatingText(`-${amount}`, "bad", isPlayer ? "player" : "enemy");
      addLog(`${name} took ${amount} ${statusLabel(status.type)} damage.`);

      if (!isPlayer && status.type === "poison" && state.mods.poisonLeech > 0) {
        healTarget(state.player, Math.max(1, Math.round(amount * state.mods.poisonLeech)), true);
      }

      if (!isPlayer && status.ramp && state.mods.poisonRamp > 0) {
        status.damage += state.mods.poisonRamp;
      }
    }

    if (status.type === "regen") {
      const amount = Math.max(1, status.damage || 1);
      healTarget(target, amount, true);
    }

    status.turns -= 1;
  }

  clearDeadStatuses(target);
}

function healTarget(target, amount, showText) {
  const missing = Math.max(0, target.maxHp - target.hp);
  const healed = Math.min(missing, amount);
  const overheal = Math.max(0, amount - healed);
  target.hp = clamp(target.hp + healed, 0, target.maxHp);

  if (target === state.player && overheal > 0 && state.mods.overhealShield) {
    const shieldGain = Math.max(1, Math.round(overheal * 0.8));
    target.shield += shieldGain;
    if (showText) addFloatingText(`+${shieldGain} Shield`, "good", "player");
  }

  if (healed > 0 && showText) {
    addFloatingText(`+${healed}`, "good", target === state.player ? "player" : "enemy");
    addLog(`${target === state.player ? "You healed" : state.enemy.name + " healed"} for ${healed} HP.`);
  }
}

function gainCombo(amount = 1) {
  ensureV3State();
  state.combo = clamp(state.combo + amount, 0, state.comboMax);
}

function breakCombo(amount = 1) {
  ensureV3State();
  const protectedAmount = Math.max(0, amount - state.mods.comboProtection);
  state.combo = clamp(state.combo - protectedAmount, 0, state.comboMax);
}

function winFight() {
  ensureV3State();

  if (state.player.hp <= 0) {
    gameOver();
    return;
  }

  state.phase = "upgrade";
  const completedWave = state.wave;
  const wasBoss = state.enemy.isBoss;
  const wasBurning = hasStatus(state.enemy, "burn");
  const bossBonus = wasBoss ? 32 : 0;
  const eliteBonus = state.enemy.elite ? 12 : 0;
  const xpGain = 32 + state.wave * 6 + bossBonus + eliteBonus;
  const coinGain = 12 + state.wave * 3 + bossBonus + eliteBonus;

  state.enemy.hp = 0;
  state.lastCompletedWave = completedWave;
  state.stats.kills += 1;
  if (wasBoss) state.stats.bosses += 1;
  state.xp += xpGain;
  state.coins += coinGain;
  state.player.hp = clamp(state.player.hp + Math.round(state.player.maxHp * 0.1), 0, state.player.maxHp);
  state.player.mana = clamp(state.player.mana + 18, 0, state.player.maxMana);
  state.player.ult = clamp(state.player.ult + 18, 0, state.player.maxUlt);
  if (state.mods.killHeal > 0) healTarget(state.player, state.mods.killHeal, true);
  if (state.mods.burnSpread && wasBurning) state.nextEnemyBurn = true;

  addLog(`Victory! +${xpGain} XP, +${coinGain} coins.`);
  checkLevelUp();
  render();
  saveGame();

  if (wasBoss) showBossLoot();
  else showUpgrades();
}

function getAvailableUpgradePool() {
  ensureV3State();
  return [...UPGRADES, ...EXTRA_UPGRADES, ...POWER_EVOLUTIONS, ...CLASS_EVOLUTIONS].filter((upgrade) => {
    return !upgrade.condition || upgrade.condition();
  });
}

function weightedUpgradePick(pool) {
  const total = pool.reduce((sum, item) => sum + (RARITY_WEIGHT[item.rarity] || 20), 0);
  let roll = Math.random() * total;
  for (const item of pool) {
    roll -= RARITY_WEIGHT[item.rarity] || 20;
    if (roll <= 0) return item;
  }
  return choice(pool);
}

function getUpgradeChoices() {
  const pool = getAvailableUpgradePool();
  const choices = [];
  const classEvos = pool.filter((item) => item.kind === "Class Evolution");

  if (classEvos.length) {
    choices.push(choice(classEvos));
  }

  const workingPool = pool.filter((item) => !choices.some((chosen) => chosen.id === item.id));
  while (choices.length < 3 && workingPool.length > 0) {
    const picked = weightedUpgradePick(workingPool);
    choices.push(picked);
    workingPool.splice(workingPool.findIndex((item) => item.id === picked.id), 1);
  }
  return choices;
}

function showUpgrades() {
  const cards = $("upgradeCards");
  const choices = getUpgradeChoices();
  cards.innerHTML = "";
  $("rewardEyebrow").textContent = "Victory Reward";
  $("rewardTitle").textContent = "Choose One Upgrade";

  for (const upgrade of choices) {
    const button = document.createElement("button");
    button.className = `upgrade-card ${rarityClass(upgrade.rarity)}`;
    button.innerHTML = `
      <span class="reward-type">${upgrade.kind || upgrade.rarity}</span>
      <strong>${upgrade.title}</strong>
      <small>${upgrade.desc}</small>
    `;
    button.addEventListener("click", () => chooseUpgrade(upgrade.id));
    cards.appendChild(button);
  }

  $("upgradeScreen").classList.remove("hidden");
}

function chooseUpgrade(id) {
  const upgrade = getAvailableUpgradePool().find((item) => item.id === id);
  if (!upgrade) return;
  upgrade.apply();
  addLog(`${upgrade.kind || "Upgrade"} chosen: ${upgrade.title}.`);
  $("upgradeScreen").classList.add("hidden");
  const completedWave = state.lastCompletedWave || state.wave;
  state.wave += 1;
  startFight();
  if (completedWave % 3 === 0) {
    state.shopReady = true;
    addLog("Arena Shop opened after your 3-wave streak.");
    render();
    setTimeout(showShop, 220);
  }
}

function showBossLoot() {
  const cards = $("upgradeCards");
  const choices = getBossLootChoices();
  cards.innerHTML = "";
  $("rewardEyebrow").textContent = "Boss Defeated";
  $("rewardTitle").textContent = "Claim One Relic";

  for (const relic of choices) {
    const button = document.createElement("button");
    button.className = `upgrade-card ${rarityClass(relic.rarity)}`;
    button.innerHTML = `
      <span class="reward-type">${relic.rarity} Relic</span>
      <strong>${relic.icon} ${relic.title}</strong>
      <small>${relic.desc}</small>
    `;
    button.addEventListener("click", () => chooseBossLoot(relic.id));
    cards.appendChild(button);
  }

  $("upgradeScreen").classList.remove("hidden");
}

function getBossLootChoices() {
  const pool = [...BOSS_LOOT];
  const choices = [];
  while (choices.length < 3 && pool.length > 0) {
    const maxRarity = state.wave >= 15 ? "Mythic" : state.wave >= 10 ? "Legendary" : "Epic";
    const filtered = pool.filter((item) => (RARITY_ORDER[item.rarity] || 1) <= (RARITY_ORDER[maxRarity] || 3));
    const pickPool = filtered.length ? filtered : pool;
    const relic = weightedUpgradePick(pickPool);
    choices.push(relic);
    pool.splice(pool.findIndex((item) => item.id === relic.id), 1);
  }
  return choices;
}

function chooseBossLoot(id) {
  const relic = BOSS_LOOT.find((item) => item.id === id);
  if (!relic) return;
  grantRelic(relic);
  addLog(`Relic claimed: ${relic.title}.`);
  showUpgrades();
}

function grantRelic(relic) {
  ensureV3State();
  state.relics.push({ id: relic.id, title: relic.title, icon: relic.icon, rarity: relic.rarity });
  relic.effect();
  if (state.relics.length > 10) state.relics.shift();
}

function getShopPrice(item) {
  return Math.max(1, Math.round(item.price * (1 - state.mods.shopDiscount)));
}

function showShop() {
  if (!state || ["enemy", "animating", "upgrade", "gameover"].includes(state.phase)) {
    addLog("You can only shop on your turn.");
    render();
    return;
  }
  state.shopReady = false;
  renderShop();
  render();
  $("shopScreen").classList.remove("hidden");
}

function renderShop() {
  const grid = $("shopCards");
  grid.innerHTML = "";

  for (const item of SHOP_ITEMS) {
    const price = getShopPrice(item);
    const canBuy = state.coins >= price;
    const button = document.createElement("button");
    button.className = `shop-card ${rarityClass(item.rarity || "Common")}`;
    button.disabled = !canBuy;
    button.innerHTML = `
      <span>${price} coins</span>
      <strong>${item.title}</strong>
      <small>${item.desc}</small>
    `;
    button.addEventListener("click", () => buyShopItem(item.id));
    grid.appendChild(button);
  }
}

function buyShopItem(id) {
  const item = SHOP_ITEMS.find((shopItem) => shopItem.id === id);
  if (!item) return;
  const price = getShopPrice(item);
  if (state.coins < price) return;
  state.coins -= price;
  item.buy();
  addLog(`Bought ${item.title}.`);
  render();
  renderShop();
  saveGame();
}

function render() {
  if (!state) return;
  ensureV3State();

  $("waveText").textContent = state.wave;
  $("levelText").textContent = state.level;
  $("xpText").textContent = `${state.xp}/${state.xpToLevel}`;
  $("coinsText").textContent = state.coins;

  const displayName = state.classEvolution || state.player.name;
  $("playerName").textContent = `${displayName} ${state.player.shield > 0 ? "🛡️" + state.player.shield : ""}`;
  $("playerSprite").textContent = state.player.icon;
  setBar("playerHpFill", state.player.hp, state.player.maxHp);
  setBar("playerManaFill", state.player.mana, state.player.maxMana);
  setBar("playerUltFill", state.player.ult, state.player.maxUlt);
  setBar("comboFill", state.combo, state.comboMax);
  $("playerHpText").textContent = `HP ${state.player.hp}/${state.player.maxHp}`;
  $("playerManaText").textContent = `Mana ${state.player.mana}/${state.player.maxMana}`;
  $("playerUltText").textContent = `Ultimate ${state.player.ult}/${state.player.maxUlt}`;
  const overdrivePercent = Math.round((state.combo / state.comboMax) * 100);
  $("comboText").textContent = `Combo x${state.combo}/${state.comboMax} • Overdrive ${overdrivePercent}%`;
  renderStatuses("playerStatuses", state.player.statuses);
  renderRelics();

  if (state.enemy) {
    $("enemyName").textContent = `${state.enemy.name} ${state.enemy.shield > 0 ? "🛡️" + state.enemy.shield : ""}`;
    $("enemyName").classList.toggle("elite-name", Boolean(state.enemy.elite));
    $("enemySprite").textContent = state.enemy.icon;
    setBar("enemyHpFill", state.enemy.hp, state.enemy.maxHp);
    const tags = state.enemy.elite ? ` • ${state.enemy.eliteLabels.join("+")}` : "";
    $("enemyHpText").textContent = `HP ${state.enemy.hp}/${state.enemy.maxHp} • DEF ${state.enemy.defense}${tags}`;
    renderStatuses("enemyStatuses", state.enemy.statuses);
  }

  const turnMessages = {
    player: "Your turn",
    enemy: "Enemy turn",
    animating: "Attacking...",
    upgrade: "Choose a reward",
    gameover: "Game over"
  };
  $("turnText").textContent = turnMessages[state.phase] || "Battle";

  for (const button of document.querySelectorAll(".action-btn")) {
    const key = button.dataset.power;
    const power = getPower(key);
    if (!power) {
      button.classList.add("hidden");
      continue;
    }
    button.classList.remove("hidden");
    button.classList.toggle("locked", !isPowerUnlocked(key));
    button.classList.toggle("evolved", Boolean(state.evolutions[key]));

    if (!isPowerUnlocked(key)) {
      button.innerHTML = `<strong>🔒 ${power.label}</strong><small>Unlocks at Level ${getPowerUnlockLevel(key)}.</small>`;
      button.disabled = true;
      continue;
    }

    const costText = power.ultCost ? `ULT ${power.ultCost}` : power.cost > 0 ? `Mana ${power.cost}` : "Free";
    const evolvedText = state.evolutions[key] ? " • EVOLVED" : "";
    button.innerHTML = `<strong>${power.icon} ${power.label}</strong><small>${power.desc}<br>${costText}${evolvedText}</small>`;
    button.disabled = state.phase !== "player" || state.player.mana < power.cost || Boolean(power.ultCost && state.player.ult < power.ultCost);
  }

  $("shopBtn").classList.toggle("shop-ready", Boolean(state.shopReady));
  renderLog();
}

function renderRelics() {
  const row = $("relicRow");
  if (!row) return;
  row.innerHTML = "";
  const relics = state.relics || [];
  if (!relics.length) {
    const empty = document.createElement("span");
    empty.className = "relic-chip";
    empty.textContent = "No relics yet — beat a boss";
    row.appendChild(empty);
    return;
  }
  for (const relic of relics.slice(-6)) {
    const chip = document.createElement("span");
    chip.className = `relic-chip ${rarityClass(relic.rarity)}`;
    chip.textContent = `${relic.icon} ${relic.title}`;
    row.appendChild(chip);
  }
}

function loadGame() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;

  try {
    const saved = JSON.parse(raw);
    state = saved.state;
    ensureV3State();
    recentLog = saved.recentLog || [];
    $("startScreen").classList.add("hidden");
    $("battleScreen").classList.remove("hidden");
    $("gameOverScreen").classList.add("hidden");
    $("upgradeScreen").classList.add("hidden");
    $("shopScreen").classList.add("hidden");
    if (state.phase === "enemy" || state.phase === "animating") state.phase = "player";
    if (state.phase === "upgrade") state.phase = "player";
    render();
    return true;
  } catch (error) {
    localStorage.removeItem(SAVE_KEY);
    return false;
  }
}


wireEvents();
updateContinueButton();
initBoot();

/* === EMX Soul Arena v4: HQ / Meta Progression Update === */
const HQ_META_SAVE_KEY = "emxSoulArenaMeta_v4";

const HQ_DAILY_MISSIONS = [
  { id: "dailyKills", type: "kills", mode: "add", title: "Soul Sweep", desc: "Defeat 10 enemies today.", goal: 10, reward: 30 },
  { id: "dailyBoss", type: "bosses", mode: "add", title: "Boss Breaker", desc: "Defeat 1 boss today.", goal: 1, reward: 45 },
  { id: "dailyElite", type: "elites", mode: "add", title: "Elite Hunter", desc: "Defeat 3 elite enemies today.", goal: 3, reward: 35 },
  { id: "dailyWave", type: "wave", mode: "max", title: "Wave Runner", desc: "Reach wave 5 in any run today.", goal: 5, reward: 40 },
  { id: "dailyUltimate", type: "ultimates", mode: "add", title: "Overdrive Training", desc: "Use 3 ultimates today.", goal: 3, reward: 35 },
  { id: "dailySpend", type: "spend", mode: "add", title: "Shop Investor", desc: "Spend 75 coins in the Arena Shop today.", goal: 75, reward: 30 }
];

const HQ_TALENTS = [
  { id: "vitality", icon: "❤️", title: "Vitality Core", desc: "+12 max HP per rank.", base: 25, step: 14, max: 10 },
  { id: "focus", icon: "🔷", title: "Mana Circuit", desc: "+6 max mana per rank.", base: 25, step: 14, max: 10 },
  { id: "arsenal", icon: "⚔️", title: "Weapon Tuning", desc: "+3 basic and special damage per rank.", base: 35, step: 18, max: 10 },
  { id: "barrier", icon: "🛡️", title: "Starter Barrier", desc: "+8 starting shield per rank.", base: 30, step: 16, max: 10 },
  { id: "luck", icon: "✨", title: "Crit Calibration", desc: "+2.5% crit chance per rank.", base: 45, step: 24, max: 8 },
  { id: "drive", icon: "⚡", title: "Overdrive Engine", desc: "+2 ultimate charge gained per rank.", base: 40, step: 22, max: 8 }
];

const HQ_ACHIEVEMENTS = [
  { id: "firstBlood", title: "First Blood", desc: "Defeat your first enemy.", reward: 20, test: (m) => m.totalKills >= 1 },
  { id: "tenKills", title: "Soul Collector", desc: "Defeat 10 enemies total.", reward: 35, test: (m) => m.totalKills >= 10 },
  { id: "bossOne", title: "Boss Breaker", desc: "Defeat your first boss.", reward: 45, test: (m) => m.totalBosses >= 1 },
  { id: "waveTen", title: "Wave 10 Club", desc: "Reach wave 10.", reward: 60, test: (m) => m.bestWave >= 10 },
  { id: "eliteFive", title: "Elite Hunter", desc: "Defeat 5 elite enemies total.", reward: 55, test: (m) => m.totalElites >= 5 },
  { id: "ultimateFive", title: "Ultimate User", desc: "Use 5 ultimates total.", reward: 45, test: (m) => m.totalUltimates >= 5 },
  { id: "shopper", title: "Arena Investor", desc: "Spend 250 coins in the shop.", reward: 50, test: (m) => m.totalCoinsSpent >= 250 },
  { id: "collector", title: "Relic Collector", desc: "Hold 5 boss relics in one run.", reward: 65, test: () => Boolean(state && state.relics && state.relics.length >= 5) },
  { id: "crystalBank", title: "Crystal Bank", desc: "Earn 250 EMX crystals total.", reward: 75, test: (m) => m.lifetimeCrystals >= 250 },
  { id: "waveTwenty", title: "Arena Legend", desc: "Reach wave 20.", reward: 120, test: (m) => m.bestWave >= 20 }
];

function hqTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function hqDefaultMeta() {
  return {
    version: 4,
    crystals: 0,
    lifetimeCrystals: 0,
    totalRuns: 0,
    totalKills: 0,
    totalBosses: 0,
    totalElites: 0,
    totalUltimates: 0,
    totalCoinsSpent: 0,
    bestWave: 0,
    bestLevel: 1,
    dailyDate: "",
    missions: [],
    achievements: {},
    talents: {}
  };
}

function hqMissionTemplateCopy() {
  return HQ_DAILY_MISSIONS.map((mission) => ({
    id: mission.id,
    type: mission.type,
    mode: mission.mode,
    title: mission.title,
    desc: mission.desc,
    goal: mission.goal,
    reward: mission.reward,
    progress: 0,
    claimed: false
  }));
}

function hqLoadMeta() {
  try {
    const raw = localStorage.getItem(HQ_META_SAVE_KEY);
    return hqEnsureMeta(raw ? JSON.parse(raw) : hqDefaultMeta());
  } catch (error) {
    return hqEnsureMeta(hqDefaultMeta());
  }
}

function hqEnsureMeta(meta) {
  const base = hqDefaultMeta();
  const merged = { ...base, ...(meta || {}) };
  merged.talents = { ...(merged.talents || {}) };
  merged.achievements = { ...(merged.achievements || {}) };

  for (const talent of HQ_TALENTS) {
    merged.talents[talent.id] = clamp(Number(merged.talents[talent.id] || 0), 0, talent.max);
  }

  for (const achievement of HQ_ACHIEVEMENTS) {
    merged.achievements[achievement.id] = {
      unlocked: false,
      claimed: false,
      ...(merged.achievements[achievement.id] || {})
    };
  }

  const today = hqTodayKey();
  if (merged.dailyDate !== today || !Array.isArray(merged.missions) || merged.missions.length === 0) {
    merged.dailyDate = today;
    merged.missions = hqMissionTemplateCopy();
  } else {
    const byId = Object.fromEntries(merged.missions.map((mission) => [mission.id, mission]));
    merged.missions = hqMissionTemplateCopy().map((template) => ({ ...template, ...(byId[template.id] || {}) }));
  }

  return merged;
}

let hqMeta = hqLoadMeta();

function hqSaveMeta() {
  hqMeta = hqEnsureMeta(hqMeta);
  localStorage.setItem(HQ_META_SAVE_KEY, JSON.stringify(hqMeta));
}

function hqAwardCrystals(amount, reason = "EMX crystals earned") {
  const gain = Math.max(0, Math.round(amount || 0));
  if (!gain) return;
  hqMeta.crystals += gain;
  hqMeta.lifetimeCrystals += gain;
  if (state && typeof addLog === "function") addLog(`${reason}: +${gain} 💎`);
  hqCheckAchievements();
  hqSaveMeta();
  hqRenderPanel();
  hqRenderIfOpen();
}

function hqProgressMission(type, amount = 1, mode = "add") {
  hqMeta = hqEnsureMeta(hqMeta);
  for (const mission of hqMeta.missions) {
    if (mission.type !== type || mission.claimed) continue;
    if (mission.mode === "max" || mode === "max") {
      mission.progress = Math.max(mission.progress || 0, amount);
    } else {
      mission.progress = (mission.progress || 0) + amount;
    }
    mission.progress = clamp(mission.progress, 0, mission.goal);
  }
  hqSaveMeta();
  hqRenderPanel();
  hqRenderIfOpen();
}

function hqCheckAchievements() {
  hqMeta = hqEnsureMeta(hqMeta);
  let changed = false;
  for (const achievement of HQ_ACHIEVEMENTS) {
    const entry = hqMeta.achievements[achievement.id];
    const unlocked = Boolean(achievement.test(hqMeta));
    if (unlocked && !entry.unlocked) {
      entry.unlocked = true;
      changed = true;
      if (state && typeof addLog === "function") addLog(`Achievement unlocked: ${achievement.title}.`);
    }
  }
  if (changed) hqSaveMeta();
}

function hqTalentCost(talent) {
  const rank = hqMeta.talents[talent.id] || 0;
  return Math.round(talent.base + rank * talent.step + Math.max(0, rank - 3) * 6);
}

function hqApplyTalentsToState(targetState) {
  if (!targetState || !targetState.player || !targetState.mods) return;
  const talents = hqMeta.talents || {};
  const vitality = talents.vitality || 0;
  const focus = talents.focus || 0;
  const arsenal = talents.arsenal || 0;
  const barrier = talents.barrier || 0;
  const luck = talents.luck || 0;
  const drive = talents.drive || 0;

  targetState.player.maxHp += vitality * 12;
  targetState.player.hp += vitality * 12;
  targetState.player.maxMana += focus * 6;
  targetState.player.mana += focus * 6;
  targetState.mods.basicDamage += arsenal * 3;
  targetState.mods.specialDamage += arsenal * 3;
  targetState.mods.startShield += barrier * 8;
  targetState.mods.critBonus += luck * 0.025;
  targetState.mods.ultGain += drive * 2;
}

function hqApplySingleTalentToCurrent(id) {
  if (!state || !state.player || !state.mods) return;
  if (id === "vitality") {
    state.player.maxHp += 12;
    state.player.hp = clamp(state.player.hp + 12, 0, state.player.maxHp);
  }
  if (id === "focus") {
    state.player.maxMana += 6;
    state.player.mana = clamp(state.player.mana + 6, 0, state.player.maxMana);
  }
  if (id === "arsenal") {
    state.mods.basicDamage += 3;
    state.mods.specialDamage += 3;
  }
  if (id === "barrier") {
    state.mods.startShield += 8;
    state.player.shield += 8;
  }
  if (id === "luck") state.mods.critBonus += 0.025;
  if (id === "drive") state.mods.ultGain += 2;
}

function hqBuyTalent(id) {
  const talent = HQ_TALENTS.find((item) => item.id === id);
  if (!talent) return;
  const rank = hqMeta.talents[id] || 0;
  if (rank >= talent.max) return;
  const cost = hqTalentCost(talent);
  if (hqMeta.crystals < cost) return;

  hqMeta.crystals -= cost;
  hqMeta.talents[id] = rank + 1;
  hqApplySingleTalentToCurrent(id);
  hqSaveMeta();
  if (state && typeof addLog === "function") addLog(`${talent.title} upgraded to rank ${rank + 1}.`);
  if (typeof render === "function") render();
  hqRenderPanel();
  hqRenderIfOpen();
}

function hqClaimMission(id) {
  hqMeta = hqEnsureMeta(hqMeta);
  const mission = hqMeta.missions.find((item) => item.id === id);
  if (!mission || mission.claimed || mission.progress < mission.goal) return;
  mission.claimed = true;
  hqAwardCrystals(mission.reward, `Mission complete - ${mission.title}`);
  hqSaveMeta();
  hqRenderPanel();
  hqRenderIfOpen();
}

function hqClaimAchievement(id) {
  hqCheckAchievements();
  const achievement = HQ_ACHIEVEMENTS.find((item) => item.id === id);
  const entry = hqMeta.achievements[id];
  if (!achievement || !entry || !entry.unlocked || entry.claimed) return;
  entry.claimed = true;
  hqAwardCrystals(achievement.reward, `Achievement claimed - ${achievement.title}`);
  hqSaveMeta();
  hqRenderPanel();
  hqRenderIfOpen();
}

function hqClaimAllReady() {
  hqCheckAchievements();
  for (const mission of hqMeta.missions) {
    if (!mission.claimed && mission.progress >= mission.goal) hqClaimMission(mission.id);
  }
  for (const achievement of HQ_ACHIEVEMENTS) {
    const entry = hqMeta.achievements[achievement.id];
    if (entry?.unlocked && !entry.claimed) hqClaimAchievement(achievement.id);
  }
  hqRenderIfOpen();
}

function hqInstallUI() {
  const start = $("startScreen");
  if (start && !$("hqStartPanel")) {
    const panel = document.createElement("section");
    panel.id = "hqStartPanel";
    panel.className = "hq-panel";
    const sectionHeading = start.querySelector(".section-heading");
    if (sectionHeading) start.insertBefore(panel, sectionHeading);
    else start.appendChild(panel);
  }

  const footer = document.querySelector(".footer-actions");
  if (footer && !$("hqBtn")) {
    const button = document.createElement("button");
    button.id = "hqBtn";
    button.className = "small-btn hq";
    button.dataset.hqAction = "open";
    button.textContent = "HQ";
    footer.insertBefore(button, footer.firstElementChild);
  }

  if (!$("hqScreen")) {
    const overlay = document.createElement("section");
    overlay.id = "hqScreen";
    overlay.className = "overlay hidden";
    overlay.innerHTML = `
      <div class="modal hq-modal">
        <div class="hq-modal-header">
          <div>
            <p class="eyebrow">EMX HQ</p>
            <h2>Permanent Progress</h2>
          </div>
          <button class="close-btn" data-hq-action="close">✕</button>
        </div>
        <div id="hqBody"></div>
      </div>
    `;
    document.querySelector("main.app")?.appendChild(overlay);
  }

  document.addEventListener("click", (event) => {
    const control = event.target.closest("[data-hq-action]");
    if (!control) return;
    const action = control.dataset.hqAction;
    const id = control.dataset.id;

    if (action === "open") hqOpen();
    if (action === "close") hqClose();
    if (action === "buyTalent") hqBuyTalent(id);
    if (action === "claimMission") hqClaimMission(id);
    if (action === "claimAchievement") hqClaimAchievement(id);
    if (action === "claimAll") hqClaimAllReady();
  });

  hqRenderPanel();
}

function hqOpen() {
  hqCheckAchievements();
  hqRender();
  $("hqScreen")?.classList.remove("hidden");
}

function hqClose() {
  $("hqScreen")?.classList.add("hidden");
}

function hqRenderPanel() {
  const panel = $("hqStartPanel");
  if (!panel) return;
  hqMeta = hqEnsureMeta(hqMeta);
  hqCheckAchievements();
  const readyMissions = hqMeta.missions.filter((mission) => !mission.claimed && mission.progress >= mission.goal).length;
  const readyAchievements = HQ_ACHIEVEMENTS.filter((achievement) => {
    const entry = hqMeta.achievements[achievement.id];
    return entry?.unlocked && !entry.claimed;
  }).length;

  panel.innerHTML = `
    <div class="hq-panel-header">
      <p class="hq-panel-title">EMX HQ</p>
      <span class="hq-crystal-pill">💎 ${hqMeta.crystals}</span>
    </div>
    <div class="hq-stats-grid">
      <div class="hq-stat"><small>Best Wave</small><strong>${hqMeta.bestWave}</strong></div>
      <div class="hq-stat"><small>Kills</small><strong>${hqMeta.totalKills}</strong></div>
      <div class="hq-stat"><small>Bosses</small><strong>${hqMeta.totalBosses}</strong></div>
      <div class="hq-stat"><small>Runs</small><strong>${hqMeta.totalRuns}</strong></div>
    </div>
    <div class="hq-menu-row">
      <button class="hq-open-btn" data-hq-action="open">HQ Upgrades</button>
      <button class="hq-open-btn" data-hq-action="open">Missions ${readyMissions ? `(${readyMissions})` : ""}</button>
      <button class="hq-open-btn" data-hq-action="open">Achievements ${readyAchievements ? `(${readyAchievements})` : ""}</button>
      <button class="hq-open-btn" data-hq-action="open">Stats</button>
    </div>
  `;
}

function hqRenderIfOpen() {
  const screen = $("hqScreen");
  if (screen && !screen.classList.contains("hidden")) hqRender();
}

function hqRender() {
  hqMeta = hqEnsureMeta(hqMeta);
  hqCheckAchievements();
  const body = $("hqBody");
  if (!body) return;

  body.innerHTML = `
    <div class="hq-stats-grid">
      <div class="hq-stat"><small>Crystals</small><strong>💎 ${hqMeta.crystals}</strong></div>
      <div class="hq-stat"><small>Best Wave</small><strong>${hqMeta.bestWave}</strong></div>
      <div class="hq-stat"><small>Total Kills</small><strong>${hqMeta.totalKills}</strong></div>
      <div class="hq-stat"><small>Bosses</small><strong>${hqMeta.totalBosses}</strong></div>
    </div>
    <div class="hq-badge-row">
      <span class="hq-badge live">Best Level ${hqMeta.bestLevel}</span>
      <span class="hq-badge">Elites ${hqMeta.totalElites}</span>
      <span class="hq-badge">Ultimates ${hqMeta.totalUltimates}</span>
      <span class="hq-badge">Coins Spent ${hqMeta.totalCoinsSpent}</span>
      <span class="hq-badge">Lifetime 💎 ${hqMeta.lifetimeCrystals}</span>
    </div>
    ${hqRenderTalents()}
    ${hqRenderMissions()}
    ${hqRenderAchievements()}
  `;
}

function hqRenderTalents() {
  return `
    <section class="hq-section">
      <div class="hq-section-title">
        <div>
          <h3>Permanent Upgrades</h3>
          <p>Spend EMX crystals. These boosts apply to new runs and also boost your current run.</p>
        </div>
      </div>
      <div class="hq-card-grid">
        ${HQ_TALENTS.map((talent) => {
          const rank = hqMeta.talents[talent.id] || 0;
          const maxed = rank >= talent.max;
          const cost = hqTalentCost(talent);
          const canBuy = hqMeta.crystals >= cost && !maxed;
          const pct = (rank / talent.max) * 100;
          return `
            <div class="hq-card ${maxed ? "hq-complete" : ""}">
              <div class="hq-card-top">
                <div><strong>${talent.icon} ${talent.title}</strong><small>${talent.desc}</small></div>
                <span class="hq-cost">${maxed ? "MAX" : `💎 ${cost}`}</span>
              </div>
              <div class="hq-progress"><div class="hq-progress-fill" style="width:${pct}%"></div></div>
              <small>Rank ${rank}/${talent.max}</small>
              <button class="${canBuy ? "ready" : ""}" data-hq-action="buyTalent" data-id="${talent.id}" ${canBuy ? "" : "disabled"}>${maxed ? "Maxed" : "Upgrade"}</button>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function hqRenderMissions() {
  const ready = hqMeta.missions.some((mission) => !mission.claimed && mission.progress >= mission.goal);
  return `
    <section class="hq-section">
      <div class="hq-section-title">
        <div>
          <h3>Daily Missions</h3>
          <p>Resets daily. Complete missions to earn permanent upgrade crystals.</p>
        </div>
        <button class="hq-claim-all-btn" data-hq-action="claimAll" ${ready ? "" : "disabled"}>Claim Ready</button>
      </div>
      <div class="hq-card-grid">
        ${hqMeta.missions.map((mission) => {
          const done = mission.progress >= mission.goal;
          const pct = clamp((mission.progress / mission.goal) * 100, 0, 100);
          return `
            <div class="hq-card ${done ? "hq-complete" : ""} ${mission.claimed ? "hq-claimed" : ""}">
              <div class="hq-card-top">
                <div><strong>${mission.title}</strong><small>${mission.desc}</small></div>
                <span class="hq-cost">💎 ${mission.reward}</span>
              </div>
              <div class="hq-progress"><div class="hq-progress-fill" style="width:${pct}%"></div></div>
              <small>${mission.progress}/${mission.goal}</small>
              <button class="${done && !mission.claimed ? "ready" : ""}" data-hq-action="claimMission" data-id="${mission.id}" ${done && !mission.claimed ? "" : "disabled"}>${mission.claimed ? "Claimed" : done ? "Claim" : "In Progress"}</button>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function hqRenderAchievements() {
  return `
    <section class="hq-section">
      <div class="hq-section-title">
        <div>
          <h3>Achievements</h3>
          <p>Long-term goals that make the game feel like a real mobile RPG.</p>
        </div>
      </div>
      <div class="hq-card-grid">
        ${HQ_ACHIEVEMENTS.map((achievement) => {
          const entry = hqMeta.achievements[achievement.id] || { unlocked: false, claimed: false };
          const unlocked = Boolean(entry.unlocked || achievement.test(hqMeta));
          const claimed = Boolean(entry.claimed);
          return `
            <div class="hq-mini-card ${unlocked ? "hq-complete" : ""} ${claimed ? "hq-claimed" : ""}">
              <div class="hq-card-top">
                <div><strong>${unlocked ? "🏆" : "🔒"} ${achievement.title}</strong><small>${achievement.desc}</small></div>
                <span class="hq-cost">💎 ${achievement.reward}</span>
              </div>
              <button class="${unlocked && !claimed ? "ready" : ""}" data-hq-action="claimAchievement" data-id="${achievement.id}" ${unlocked && !claimed ? "" : "disabled"}>${claimed ? "Claimed" : unlocked ? "Claim" : "Locked"}</button>
            </div>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

(function hqPatchGame() {
  const oldMakeState = makeState;
  makeState = function patchedMakeState(classKey) {
    const newState = oldMakeState(classKey);
    hqApplyTalentsToState(newState);
    return newState;
  };

  const oldStartNewRun = startNewRun;
  startNewRun = function patchedStartNewRun(classKey) {
    hqMeta.totalRuns += 1;
    hqSaveMeta();
    oldStartNewRun(classKey);
    hqRenderPanel();
  };

  const oldUsePower = usePower;
  usePower = async function patchedUsePower(key) {
    let countsUltimate = false;
    if (state && state.phase === "player" && key === "ultimate") {
      const power = getPower(key);
      countsUltimate = Boolean(power && isPowerUnlocked(key) && state.player.mana >= power.cost && state.player.ult >= (power.ultCost || 0));
    }
    await oldUsePower(key);
    if (countsUltimate) {
      hqMeta.totalUltimates += 1;
      hqProgressMission("ultimates", 1);
      hqCheckAchievements();
      hqSaveMeta();
    }
  };

  const oldWinFight = winFight;
  winFight = function patchedWinFight() {
    const completedWave = state?.wave || 0;
    const wasBoss = Boolean(state?.enemy?.isBoss);
    const wasElite = Boolean(state?.enemy?.elite);
    oldWinFight();

    hqMeta.totalKills += 1;
    hqMeta.bestWave = Math.max(hqMeta.bestWave || 0, completedWave);
    hqMeta.bestLevel = Math.max(hqMeta.bestLevel || 1, state?.level || 1);
    hqProgressMission("kills", 1);
    hqProgressMission("wave", completedWave, "max");

    let crystalReward = 1;
    if (wasElite) {
      hqMeta.totalElites += 1;
      hqProgressMission("elites", 1);
      crystalReward += 2;
    }
    if (wasBoss) {
      hqMeta.totalBosses += 1;
      hqProgressMission("bosses", 1);
      crystalReward += 9;
    }

    hqAwardCrystals(crystalReward, wasBoss ? "Boss bounty" : wasElite ? "Elite bounty" : "Wave bounty");
    hqCheckAchievements();
    hqSaveMeta();
    hqRenderPanel();
    hqRenderIfOpen();
    if (typeof render === "function") render();
  };

  const oldBuyShopItem = buyShopItem;
  buyShopItem = function patchedBuyShopItem(id) {
    const before = state?.coins || 0;
    oldBuyShopItem(id);
    const after = state?.coins || 0;
    const spent = Math.max(0, before - after);
    if (spent > 0) {
      hqMeta.totalCoinsSpent += spent;
      hqProgressMission("spend", spent);
      hqCheckAchievements();
      hqSaveMeta();
    }
  };

  const oldGrantRelic = grantRelic;
  grantRelic = function patchedGrantRelic(relic) {
    oldGrantRelic(relic);
    hqCheckAchievements();
    hqSaveMeta();
  };

  const oldGameOver = gameOver;
  gameOver = function patchedGameOver() {
    if (state && state.phase !== "gameover") {
      hqMeta.bestWave = Math.max(hqMeta.bestWave || 0, state.wave || 0);
      hqMeta.bestLevel = Math.max(hqMeta.bestLevel || 1, state.level || 1);
      hqCheckAchievements();
      hqSaveMeta();
    }
    oldGameOver();
    const stats = $("gameOverStats");
    if (stats) stats.textContent += ` • Best Wave ${hqMeta.bestWave} • 💎 ${hqMeta.crystals}`;
    hqRenderPanel();
  };

  const oldRender = render;
  render = function patchedRender() {
    oldRender();
    hqCheckAchievements();
    hqRenderPanel();
    hqRenderIfOpen();
  };
})();

hqInstallUI();
hqSaveMeta();
hqCheckAchievements();
hqRenderPanel();

/* === EMX Soul Arena v5: Cinematic Combat + Boss Balance Update === */
const V5_UPDATE_NAME = "Cinematic Combat";
const V5_CINEMATIC_KEY = "emxSoulArenaCinematic_v5";
let v5ActivePowerName = "";

const V5_BOSS_TUNING = {
  goblinKing: { hp: 108, attack: 12, defense: 3 },
  boneDragon: { hp: 140, attack: 15, defense: 4 },
  stormTitan: { hp: 170, attack: 17, defense: 5 },
  voidBeast: { hp: 205, attack: 19, defense: 6 },
  emxOverlord: { hp: 235, attack: 21, defense: 7 }
};

const V5_POWER_UPGRADES = [
  {
    id: "v5BossBreakerProtocol",
    rarity: "Rare",
    title: "Boss Breaker Protocol",
    desc: "Deal +22% damage to bosses and gain +10 ultimate charge when a boss appears.",
    apply() {
      state.mods.bossDamage += 0.22;
      state.mods.v5BossUlt = (state.mods.v5BossUlt || 0) + 10;
    }
  },
  {
    id: "v5ArenaTrainingPack",
    rarity: "Common",
    title: "Arena Training Pack",
    desc: "+10 basic damage, +10 skill damage, and +8 max HP.",
    apply() {
      state.mods.basicDamage += 10;
      state.mods.specialDamage += 10;
      state.player.maxHp += 8;
      healTarget(state.player, 8, false);
    }
  },
  {
    id: "v5EmergencyArmor",
    rarity: "Rare",
    title: "Emergency Armor",
    desc: "Start fights with +26 shield and reduce enemy damage by 5%.",
    apply() {
      state.mods.startShield += 26;
      state.mods.damageReduction += 0.05;
    }
  },
  {
    id: "v5ManaReactor",
    rarity: "Rare",
    title: "Mana Reactor",
    desc: "+20 max mana and +4 mana regeneration per turn.",
    apply() {
      state.player.maxMana += 20;
      state.player.mana = clamp(state.player.mana + 20, 0, state.player.maxMana);
      state.mods.manaRegen += 4;
    }
  },
  {
    id: "v5LifeCircuit",
    rarity: "Epic",
    title: "Life Circuit",
    desc: "Heal for +8% of damage dealt and heal +18 HP after kills.",
    apply() {
      state.mods.lifeSteal += 0.08;
      state.mods.killHeal += 18;
    }
  },
  {
    id: "v5CriticalBattery",
    rarity: "Epic",
    title: "Critical Battery",
    desc: "+12% crit chance. Crits give +8 ultimate charge.",
    apply() {
      state.mods.critBonus += 0.12;
      state.mods.v5CritUlt = (state.mods.v5CritUlt || 0) + 8;
    }
  },
  {
    id: "v5BossMercyCore",
    rarity: "Legendary",
    title: "Boss Mercy Core",
    desc: "Each boss fight begins with a huge shield, full mana, and +40 ultimate charge.",
    apply() {
      state.mods.v5BossShield = (state.mods.v5BossShield || 0) + 55;
      state.mods.v5BossUlt = (state.mods.v5BossUlt || 0) + 40;
      state.mods.v5BossFullMana = true;
    }
  },
  {
    id: "v5CinematicOverdrive",
    rarity: "Mythic",
    title: "Cinematic Overdrive",
    desc: "Ultimates deal +40% damage and all attack animations become full cutscenes.",
    apply() {
      state.mods.v5UltimateDamage = (state.mods.v5UltimateDamage || 0) + 0.4;
      state.mods.v5AlwaysCinematic = true;
    }
  }
];

const V5_SHOP_ITEMS = [
  {
    id: "v5BossPrepKit",
    price: 38,
    rarity: "Rare",
    title: "Boss Prep Kit",
    desc: "Heal 45 HP, gain 45 shield, and gain +25 ultimate charge.",
    buy() {
      healTarget(state.player, 45, true);
      state.player.shield += 45;
      state.player.ult = clamp(state.player.ult + 25, 0, state.player.maxUlt);
      addFloatingText("Boss Kit", "good", "player");
    }
  },
  {
    id: "v5PowerTuning",
    price: 55,
    rarity: "Epic",
    title: "Power Tuning",
    desc: "+8 damage to basic attacks and skills for this run.",
    buy() {
      state.mods.basicDamage += 8;
      state.mods.specialDamage += 8;
      addLog("Power tuning installed: +8 basic and skill damage.");
    }
  },
  {
    id: "v5ShieldBattery",
    price: 32,
    rarity: "Common",
    title: "Shield Battery",
    desc: "Gain 70 shield immediately.",
    buy() {
      state.player.shield += 70;
      addFloatingText("+70 Shield", "good", "player");
    }
  }
];

(function v5InstallUpgradePool() {
  for (const upgrade of V5_POWER_UPGRADES) {
    if (!UPGRADES.some((item) => item.id === upgrade.id)) UPGRADES.push(upgrade);
  }
  for (const item of V5_SHOP_ITEMS) {
    if (!SHOP_ITEMS.some((shopItem) => shopItem.id === item.id)) SHOP_ITEMS.push(item);
  }
  for (const item of SHOP_ITEMS) {
    if (!item.v5Discounted) {
      item.price = Math.max(8, Math.round(item.price * 0.82));
      item.v5Discounted = true;
    }
  }
})();

function v5BossBaseFor(base) {
  const tune = V5_BOSS_TUNING[base.id];
  return tune ? { ...base, ...tune } : base;
}

function v5BossStats(wave, base) {
  const tuned = v5BossBaseFor(base);
  const scale = 1 + wave * 0.08;
  return {
    hp: Math.round(tuned.hp * scale + wave * 2),
    attack: Math.round(tuned.attack * (1 + wave * 0.045) + wave * 0.25),
    defense: Math.round(tuned.defense + wave * 0.22)
  };
}

function v5NormalStats(wave, base) {
  const scale = 1 + wave * 0.11;
  return {
    hp: Math.round(base.hp * scale + wave * 3),
    attack: Math.round(base.attack * (1 + wave * 0.09) + wave * 0.45),
    defense: Math.round(base.defense + wave * 0.34)
  };
}

const v5OldCreateEnemy = createEnemy;
createEnemy = function v5CreateEnemy(wave) {
  const isBoss = wave % 5 === 0;
  const baseRaw = isBoss ? BOSSES[((wave / 5) - 1) % BOSSES.length] : choice(ENEMIES);
  const base = isBoss ? v5BossBaseFor(baseRaw) : baseRaw;
  const stats = isBoss ? v5BossStats(wave, baseRaw) : v5NormalStats(wave, baseRaw);

  const enemy = {
    ...base,
    status: base.status ? { ...base.status } : undefined,
    hp: stats.hp,
    maxHp: stats.hp,
    attack: stats.attack,
    defense: stats.defense,
    statuses: [],
    shield: 0,
    isBoss,
    turn: 0,
    charging: false,
    elite: false,
    eliteLabels: [],
    v5Balanced: true
  };

  if (!isBoss && wave >= 4 && Math.random() < Math.min(0.18 + wave * 0.014, 0.5)) {
    if (typeof applyEliteModifiers === "function") applyEliteModifiers(enemy, wave >= 14 && Math.random() < 0.18 ? 2 : 1);
  }

  if (isBoss && wave >= 15) {
    enemy.name = `Ascended ${enemy.name}`;
    enemy.attack += 3;
    enemy.defense += 2;
    enemy.shield += 22;
    enemy.elite = true;
    enemy.eliteLabels.push("Ascended");
  }

  return enemy;
};

function v5EnsureFields() {
  if (!state) return;
  state.v5 = state.v5 || {};
  state.mods.v5BossUlt = state.mods.v5BossUlt || 0;
  state.mods.v5BossShield = state.mods.v5BossShield || 0;
  state.mods.v5CritUlt = state.mods.v5CritUlt || 0;
  state.mods.v5UltimateDamage = state.mods.v5UltimateDamage || 0;
  state.mods.v5PreBossTraining = state.mods.v5PreBossTraining || 0;
  v5RebalanceCurrentEnemy();
}

const v5OldEnsureV3State = ensureV3State;
ensureV3State = function v5EnsureV3State() {
  v5OldEnsureV3State();
  v5EnsureFields();
};

function v5RebalanceCurrentEnemy() {
  if (!state || !state.enemy || !state.enemy.isBoss || state.enemy.v5Balanced) return;
  const baseRaw = BOSSES.find((boss) => boss.id === state.enemy.id) || BOSSES[((state.wave / 5) - 1) % BOSSES.length];
  const stats = v5BossStats(state.wave || 5, baseRaw);
  state.enemy.maxHp = Math.min(state.enemy.maxHp, stats.hp);
  state.enemy.hp = Math.min(state.enemy.hp, state.enemy.maxHp);
  state.enemy.attack = Math.min(state.enemy.attack, stats.attack);
  state.enemy.defense = Math.min(state.enemy.defense, stats.defense);
  state.enemy.v5Balanced = true;
  if (!state.v5?.rebalanceLogged) {
    addLog("Cinematic Combat patch balanced this boss fight.");
    state.v5 = state.v5 || {};
    state.v5.rebalanceLogged = true;
  }
}

function v5ApplyBossAssist() {
  if (!state || !state.enemy || !state.enemy.isBoss) return;
  state.v5 = state.v5 || {};
  if (state.v5.bossAssistWave === state.wave) return;
  state.v5.bossAssistWave = state.wave;

  const shield = 44 + state.level * 8 + Math.floor(state.wave * 1.5) + (state.mods.v5BossShield || 0);
  const heal = Math.round(state.player.maxHp * (state.wave <= 5 ? 0.45 : 0.32));
  const ult = 30 + (state.mods.v5BossUlt || 0);

  healTarget(state.player, heal, true);
  state.player.shield += shield;
  state.player.mana = state.mods.v5BossFullMana ? state.player.maxMana : clamp(state.player.mana + Math.round(state.player.maxMana * 0.45), 0, state.player.maxMana);
  state.player.ult = clamp(state.player.ult + ult, 0, state.player.maxUlt);

  addLog(`Boss prep activated: +${shield} shield, +${ult} ultimate, and a combat heal.`);
  v5RenderBossBadge();
  render();
  saveGame();
}

const v5OldStartFight = startFight;
startFight = function v5StartFight() {
  v5OldStartFight();
  v5ApplyBossAssist();
};

const v5OldChooseEnemyMove = chooseEnemyMove;
chooseEnemyMove = function v5ChooseEnemyMove() {
  const move = v5OldChooseEnemyMove();
  if (state?.enemy?.isBoss && move) {
    if (move.damage) move.damage = Math.max(1, Math.round(move.damage * 0.78));
    if (move.status && move.status.chance) move.status.chance = Math.max(0.08, move.status.chance * 0.76);
    if (move.shield) move.shield = Math.round(move.shield * 0.72);
  }
  if (state) state.v5EnemyMoveName = move?.name || "Enemy Strike";
  return move;
};

const v5OldCalculatePlayerDamage = calculatePlayerDamage;
calculatePlayerDamage = function v5CalculatePlayerDamage(key, power) {
  const result = v5OldCalculatePlayerDamage(key, power);
  if (state?.enemy?.isBoss) {
    result.damage = Math.round(result.damage * 1.12);
  }
  if (power?.ultCost && state?.mods?.v5UltimateDamage) {
    result.damage = Math.round(result.damage * (1 + state.mods.v5UltimateDamage));
  }
  if (result.crit && state?.mods?.v5CritUlt) {
    state.player.ult = clamp(state.player.ult + state.mods.v5CritUlt, 0, state.player.maxUlt);
  }
  return result;
};

const v5OldWinFight = winFight;
winFight = function v5WinFight() {
  const completedWave = state?.wave || 0;
  const wasBoss = Boolean(state?.enemy?.isBoss);
  const wasElite = Boolean(state?.enemy?.elite);
  v5OldWinFight();
  if (!state || state.phase === "gameover") return;

  const bonusXp = 10 + completedWave * 2 + (wasBoss ? 16 : 0) + (wasElite ? 8 : 0);
  const bonusCoins = 7 + Math.ceil(completedWave * 1.5) + (wasBoss ? 18 : 0) + (wasElite ? 6 : 0);
  state.xp += bonusXp;
  state.coins += bonusCoins;
  checkLevelUp();
  addLog(`V5 combat bonus: +${bonusXp} XP, +${bonusCoins} coins.`);
  render();
  saveGame();
};

const v5OldGetUpgradeChoices = getUpgradeChoices;
getUpgradeChoices = function v5GetUpgradeChoices() {
  const choices = v5OldGetUpgradeChoices();
  const targetCount = 4;
  const pool = getAvailableUpgradePool().filter((item) => !choices.some((chosen) => chosen.id === item.id));

  const completedWave = state?.lastCompletedWave || state?.wave || 0;
  const preBoss = completedWave > 0 && (completedWave + 1) % 5 === 0;
  if (preBoss) {
    const bossHelp = pool.find((item) => ["v5BossBreakerProtocol", "v5EmergencyArmor", "v5BossMercyCore", "bossSlayer", "tough", "startShield"].includes(item.id));
    if (bossHelp) {
      choices[0] = bossHelp;
      pool.splice(pool.findIndex((item) => item.id === bossHelp.id), 1);
    }
  }

  while (choices.length < targetCount && pool.length > 0) {
    const picked = typeof weightedUpgradePick === "function" ? weightedUpgradePick(pool) : choice(pool);
    choices.push(picked);
    pool.splice(pool.findIndex((item) => item.id === picked.id), 1);
  }
  return choices;
};

const v5OldUsePower = usePower;
usePower = async function v5UsePower(key) {
  const power = state ? getPower(key) : null;
  v5ActivePowerName = power?.label || "";
  await v5OldUsePower(key);
  v5ActivePowerName = "";
};

function v5CinematicEnabled() {
  const stored = localStorage.getItem(V5_CINEMATIC_KEY);
  if (stored === "off") return false;
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  return true;
}

function v5AnimationProfile(type, enemyMove = false) {
  const label = v5ActivePowerName || "EMX Strike";
  const profiles = {
    slash: { cls: "slash", icon: "⚔️", title: label || "Slash", duration: 620 },
    fireball: { cls: "fireball", icon: "🔥", title: label || "Fireball", duration: 700 },
    meteor: { cls: "meteor ultimate", icon: "☄️", title: label || "Inferno Meteor", duration: 940 },
    lightning: { cls: "lightning", icon: "⚡", title: label || "Thunder Strike", duration: 760 },
    ice: { cls: "ice", icon: "❄️", title: label || "Ice Breaker", duration: 740 },
    poison: { cls: "poison", icon: "☠️", title: label || "Poison Strike", duration: 720 },
    drain: { cls: "drain", icon: "🌀", title: label || "Soul Drain", duration: 750 },
    nova: { cls: "nova ultimate", icon: "💥", title: label || "Nova Blast", duration: 880 },
    combo: { cls: "combo", icon: "🗡️", title: label || "Combo Chain", duration: 820 },
    shadow: { cls: "shadow", icon: "🌑", title: label || "Shadow Cut", duration: 720 },
    heal: { cls: "heal", icon: "✚", title: label || "Heal", duration: 620 },
    shield: { cls: "shield", icon: "🛡️", title: label || "Shield", duration: 620 },
    buff: { cls: "buff", icon: "🔋", title: label || "Power Up", duration: 620 }
  };
  if (enemyMove) return { cls: "enemy-cine", icon: "💢", title: state?.v5EnemyMoveName || "Boss Strike", duration: 700 };
  return profiles[type] || profiles.slash;
}

function v5EnsureCinematicStage() {
  let stage = document.getElementById("cinematicStage");
  if (!stage) {
    stage = document.createElement("section");
    stage.id = "cinematicStage";
    stage.className = "cinematic-stage";
    stage.setAttribute("aria-hidden", "true");
    document.body.appendChild(stage);
  }
  return stage;
}

function v5ParticleMarkup(count = 22) {
  let html = "";
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count;
    const radius = rand(90, 280);
    const x = Math.round(Math.cos(angle) * radius + rand(-40, 40));
    const y = Math.round(Math.sin(angle) * radius + rand(-40, 40));
    const z = rand(120, 520);
    const size = rand(4, 12);
    html += `<span style="--x:${x}px;--y:${y}px;--z:${z}px;--size:${size}px"></span>`;
  }
  return html;
}

async function v5RunCinematic(type, enemyMove = false) {
  if (!v5CinematicEnabled()) return;
  if (!state || !state.player || !state.enemy) return;

  const profile = v5AnimationProfile(type, enemyMove);
  const stage = v5EnsureCinematicStage();
  const playerIcon = state.player.icon || "🧙‍♂️";
  const enemyIcon = state.enemy.icon || "👹";
  const particleCount = profile.cls.includes("ultimate") || state.enemy.isBoss ? 34 : 22;

  stage.className = `cinematic-stage active ${profile.cls}`;
  stage.innerHTML = `
    <img src="assets/emx-icon.png" alt="" class="cine-logo-watermark" />
    <div class="cine-title">${profile.title}</div>
    <div class="cine-floor"></div>
    <div class="cine-card cine-player"><div class="cine-sprite">${enemyMove ? enemyIcon : playerIcon}</div></div>
    <div class="cine-card cine-enemy"><div class="cine-sprite">${enemyMove ? playerIcon : enemyIcon}</div></div>
    <div class="cine-attack-model"><div class="cine-attack-core">${profile.icon}</div></div>
    <div class="cine-impact-ring"></div>
    <div class="cine-particles">${v5ParticleMarkup(particleCount)}</div>
    <div class="cine-flash"></div>
  `;

  const battleScreen = $("battleScreen");
  battleScreen?.classList.add("cinematic-impact");
  await sleep(profile.duration);
  stage.classList.remove("active");
  stage.innerHTML = "";
  battleScreen?.classList.remove("cinematic-impact");
  await sleep(70);
}

const v5OldPlayAnimation = playAnimation;
playAnimation = async function v5PlayAnimation(type) {
  const bigAttack = ["meteor", "nova", "combo", "lightning", "fireball", "poison", "drain", "ice", "shadow"].includes(type);
  const always = Boolean(state?.mods?.v5AlwaysCinematic);
  if (always || bigAttack || state?.enemy?.isBoss) await v5RunCinematic(type, false);
  await v5OldPlayAnimation(type);
};

const v5OldPlayEnemyAnimation = playEnemyAnimation;
playEnemyAnimation = async function v5PlayEnemyAnimation(big = false) {
  if (big || state?.enemy?.isBoss) await v5RunCinematic("enemy", true);
  await v5OldPlayEnemyAnimation(big);
};

function v5RenderBossBadge() {
  const panel = document.querySelector(".enemy-panel");
  if (!panel) return;
  panel.classList.toggle("v5-boss-softened", Boolean(state?.enemy?.isBoss));
}

function v5PatchLabels() {
  document.title = "EMX Soul Arena - Cinematic Combat";
  const version = document.querySelector(".version-chip");
  if (version) version.textContent = V5_UPDATE_NAME;
  const startLogoCard = document.querySelector(".brand-title-card .subtitle");
  if (startLogoCard) startLogoCard.textContent = "Cinematic attacks, fairer bosses, stronger rewards, and deeper upgrades.";
  const hqTitle = document.querySelector("#startScreen .brand-title-card");
  if (hqTitle && !hqTitle.querySelector(".v5-cine-chip")) {
    const chip = document.createElement("span");
    chip.className = "v5-cine-chip";
    chip.textContent = "V5 Cinematic";
    hqTitle.appendChild(chip);
  }
}

const v5OldRender = render;
render = function v5Render() {
  v5OldRender();
  v5RenderBossBadge();
  v5PatchLabels();
};

v5PatchLabels();

/* === EMX Soul Arena v7: Campaign Map + Gear Inventory + Skill Tree Update === */
(function emxSoulArenaV7() {
  const V7_UPDATE_NAME = "Campaign + Gear";
  const V7_META_KEY = "emxSoulArenaCampaign_v7";
  const V7_SOUND_KEY = "emxSoulArenaSound_v7";
  const V7_RARITY_ORDER = { Common: 1, Rare: 2, Epic: 3, Legendary: 4, Mythic: 5 };

  const V7_CAMPAIGN_ZONES = [
    {
      id: "slimeFields",
      icon: "🟢",
      title: "Slime Fields",
      subtitle: "Training zone for early builds.",
      tier: 1,
      length: 5,
      unlockText: "Unlocked",
      enemies: [
        { id: "slime", name: "Training Slime", icon: "🟢", hp: 40, attack: 7, defense: 1 },
        { id: "bat", name: "Glow Bat", icon: "🦇", hp: 42, attack: 8, defense: 1, lifesteal: 0.16 },
        { id: "spider", name: "Spore Spider", icon: "🕷️", hp: 48, attack: 8, defense: 1, status: { type: "poison", chance: 0.22, turns: 2, damage: 3 } }
      ],
      miniBoss: { id: "slimeKnight", name: "Slime Knight", icon: "🛡️", hp: 72, attack: 10, defense: 3, shield: 12 },
      boss: { id: "ancientSlime", name: "Ancient Slime", icon: "🧪", hp: 118, attack: 12, defense: 3, shield: 15, status: { type: "poison", chance: 0.26, turns: 2, damage: 4 } },
      rewardGear: "glowleafCharm",
      rewardSkillPoints: 2
    },
    {
      id: "goblinMarket",
      icon: "👺",
      title: "Goblin Market",
      subtitle: "Fast enemies, stolen relics, and shop tech.",
      tier: 2,
      length: 6,
      unlockText: "Clear Slime Fields",
      enemies: [
        { id: "goblin", name: "Market Goblin", icon: "👺", hp: 54, attack: 10, defense: 2 },
        { id: "goblinThief", name: "Goblin Thief", icon: "🧤", hp: 50, attack: 12, defense: 1, lifesteal: 0.18 },
        { id: "cultist", name: "Rune Seller", icon: "🧙", hp: 58, attack: 11, defense: 2, status: { type: "weakness", chance: 0.24, turns: 2 } }
      ],
      miniBoss: { id: "goldBrute", name: "Gold Brute", icon: "💰", hp: 105, attack: 14, defense: 4, shield: 18 },
      boss: { id: "goblinKing", name: "Goblin King", icon: "🤴", hp: 152, attack: 16, defense: 5, shield: 22 },
      rewardGear: "marketBlade",
      rewardSkillPoints: 3
    },
    {
      id: "boneCrypt",
      icon: "💀",
      title: "Bone Crypt",
      subtitle: "Undead fights with bleed, poison, and curses.",
      tier: 3,
      length: 7,
      unlockText: "Clear Goblin Market",
      enemies: [
        { id: "skeleton", name: "Crypt Skeleton", icon: "💀", hp: 66, attack: 13, defense: 3 },
        { id: "boneMage", name: "Bone Mage", icon: "🦴", hp: 60, attack: 14, defense: 2, status: { type: "bleed", chance: 0.25, turns: 3, damage: 4 } },
        { id: "graveWolf", name: "Grave Wolf", icon: "🐺", hp: 68, attack: 15, defense: 2, status: { type: "bleed", chance: 0.3, turns: 3, damage: 4 } }
      ],
      miniBoss: { id: "cryptCaptain", name: "Crypt Captain", icon: "☠️", hp: 128, attack: 17, defense: 5, shield: 20 },
      boss: { id: "boneDragon", name: "Bone Dragon", icon: "🐉", hp: 205, attack: 19, defense: 6, shield: 28, status: { type: "poison", chance: 0.34, turns: 3, damage: 5 } },
      rewardGear: "boneguardArmor",
      rewardSkillPoints: 3
    },
    {
      id: "stormTower",
      icon: "⛈️",
      title: "Storm Tower",
      subtitle: "Shield phases, stuns, and lightning bosses.",
      tier: 4,
      length: 8,
      unlockText: "Clear Bone Crypt",
      enemies: [
        { id: "golem", name: "Tower Golem", icon: "🗿", hp: 84, attack: 15, defense: 6, shield: 18 },
        { id: "imp", name: "Static Imp", icon: "👿", hp: 72, attack: 16, defense: 3, status: { type: "stun", chance: 0.16, turns: 1 } },
        { id: "stormHound", name: "Storm Hound", icon: "🐺", hp: 78, attack: 17, defense: 3, status: { type: "freeze", chance: 0.18, turns: 1 } }
      ],
      miniBoss: { id: "towerSentinel", name: "Tower Sentinel", icon: "🛡️", hp: 160, attack: 19, defense: 7, shield: 35 },
      boss: { id: "stormTitan", name: "Storm Titan", icon: "⛈️", hp: 250, attack: 22, defense: 8, shield: 42, status: { type: "stun", chance: 0.2, turns: 1 } },
      rewardGear: "stormCore",
      rewardSkillPoints: 4
    },
    {
      id: "voidRift",
      icon: "👁️",
      title: "Void Rift",
      subtitle: "Late-game zone with mirror damage and mythic loot.",
      tier: 5,
      length: 9,
      unlockText: "Clear Storm Tower",
      enemies: [
        { id: "voidling", name: "Voidling", icon: "👁️", hp: 86, attack: 18, defense: 4, status: { type: "weakness", chance: 0.24, turns: 2 } },
        { id: "mirrorShade", name: "Mirror Shade", icon: "🪞", hp: 94, attack: 17, defense: 5, reflectPct: 0.06 },
        { id: "riftDemon", name: "Rift Demon", icon: "👹", hp: 102, attack: 20, defense: 5, status: { type: "burn", chance: 0.28, turns: 2, damage: 5 } }
      ],
      miniBoss: { id: "riftReaper", name: "Rift Reaper", icon: "🌑", hp: 190, attack: 23, defense: 7, shield: 36, reflectPct: 0.06 },
      boss: { id: "voidBeast", name: "Void Emperor", icon: "👁️", hp: 315, attack: 25, defense: 9, shield: 50, status: { type: "weakness", chance: 0.35, turns: 2 } },
      rewardGear: "voidCrown",
      rewardSkillPoints: 5
    }
  ];

  const V7_GEAR = [
    { id: "trainingBlade", slot: "weapon", rarity: "Common", icon: "⚔️", title: "Training Blade", desc: "+5 basic damage.", effect: (s) => { s.mods.basicDamage += 5; } },
    { id: "patchedVest", slot: "armor", rarity: "Common", icon: "🥋", title: "Patched Vest", desc: "+18 max HP and +8 starting shield.", effect: (s) => { s.player.maxHp += 18; s.player.hp += 18; s.mods.startShield += 8; } },
    { id: "apprenticeCharm", slot: "charm", rarity: "Common", icon: "🔰", title: "Apprentice Charm", desc: "+4 mana regeneration per turn.", effect: (s) => { s.mods.manaRegen += 4; } },
    { id: "glowleafCharm", slot: "charm", rarity: "Rare", icon: "🌿", title: "Glowleaf Charm", desc: "+16 healing and poison/root powers hit harder.", effect: (s) => { s.mods.healBonus += 16; s.mods.natureDamage += 9; } },
    { id: "marketBlade", slot: "weapon", rarity: "Rare", icon: "🗡️", title: "Market Blade", desc: "+11 basic damage and +9% crit.", effect: (s) => { s.mods.basicDamage += 11; s.mods.critBonus += 0.09; } },
    { id: "emberCalibrator", slot: "weapon", rarity: "Rare", icon: "🔥", title: "Ember Calibrator", desc: "+15 fire damage and burn lasts longer.", effect: (s) => { s.mods.fireDamage += 15; s.mods.statusDuration += 1; } },
    { id: "venomNeedle", slot: "weapon", rarity: "Epic", icon: "☠️", title: "Venom Needle", desc: "Poison ramps faster and crits more.", effect: (s) => { s.mods.poisonRamp += 3; s.mods.critBonus += 0.08; } },
    { id: "boneguardArmor", slot: "armor", rarity: "Epic", icon: "🦴", title: "Boneguard Armor", desc: "+34 HP, +16 start shield, and less boss damage taken.", effect: (s) => { s.player.maxHp += 34; s.player.hp += 34; s.mods.startShield += 16; s.mods.v7BossResist += 0.08; } },
    { id: "stormCore", slot: "core", rarity: "Epic", icon: "⚡", title: "Storm Core", desc: "+14 lightning damage and +8 ultimate charge gain.", effect: (s) => { s.mods.lightningDamage += 14; s.mods.ultGain += 8; } },
    { id: "neonAegis", slot: "armor", rarity: "Legendary", icon: "🛡️", title: "Neon Aegis", desc: "+42 starting shield and 12% damage reduction.", effect: (s) => { s.mods.startShield += 42; s.mods.damageReduction += 0.12; } },
    { id: "bossbreakerCore", slot: "core", rarity: "Legendary", icon: "🎯", title: "Bossbreaker Core", desc: "+25% boss damage, +12% boss resistance.", effect: (s) => { s.mods.bossDamage += 0.25; s.mods.v7BossResist += 0.12; } },
    { id: "phoenixDrive", slot: "core", rarity: "Legendary", icon: "🌅", title: "Phoenix Drive", desc: "Start each run with one revive and stronger heals.", effect: (s) => { s.mods.revive += 1; s.mods.healBonus += 18; } },
    { id: "voidCrown", slot: "charm", rarity: "Mythic", icon: "👑", title: "Void Crown", desc: "Ignore defense more often, +30% campaign damage.", effect: (s) => { s.mods.ignoreDefenseChance += 0.24; s.mods.v7CampaignDamage += 0.3; } },
    { id: "emxOverdriveChip", slot: "core", rarity: "Mythic", icon: "⚙️", title: "EMX Overdrive Chip", desc: "Overdrive charges faster and ultimates hit harder.", effect: (s) => { s.mods.ultGain += 12; s.mods.overdriveDamage += 0.4; s.mods.v5UltimateDamage = (s.mods.v5UltimateDamage || 0) + 0.2; } }
  ];

  const V7_SKILL_NODES = [
    { id: "corePower", icon: "⚔️", title: "Core Power", max: 5, cost: 1, desc: "+4 basic and special damage per rank.", effect: (s, r) => { s.mods.basicDamage += r * 4; s.mods.specialDamage += r * 4; } },
    { id: "fieldMedic", icon: "❤️", title: "Field Medic", max: 4, cost: 1, desc: "+12 HP and +5 healing per rank.", effect: (s, r) => { s.player.maxHp += r * 12; s.player.hp += r * 12; s.mods.healBonus += r * 5; } },
    { id: "bossTactics", icon: "🎯", title: "Boss Tactics", max: 4, cost: 2, desc: "+8% boss damage and +5% boss resistance per rank.", effect: (s, r) => { s.mods.bossDamage += r * 0.08; s.mods.v7BossResist += r * 0.05; } },
    { id: "lootMagnet", icon: "🎁", title: "Loot Magnet", max: 4, cost: 2, desc: "Better gear/chest odds and +4% elite damage per rank.", effect: (s, r) => { s.mods.v7GearLuck += r; s.mods.eliteDamage += r * 0.04; } },
    { id: "overdriveSync", icon: "⚡", title: "Overdrive Sync", max: 3, cost: 2, desc: "+5 ultimate gain and +1 combo protection per rank.", effect: (s, r) => { s.mods.ultGain += r * 5; s.mods.comboProtection += r; } },
    { id: "shopProtocol", icon: "🛒", title: "Shop Protocol", max: 3, cost: 2, desc: "Shop discount +8% per rank.", effect: (s, r) => { s.mods.shopDiscount += r * 0.08; } },
    { id: "campaignScout", icon: "🗺️", title: "Campaign Scout", max: 5, cost: 1, desc: "+6% campaign damage and +6 boss-prep shield per rank.", effect: (s, r) => { s.mods.v7CampaignDamage += r * 0.06; s.mods.v7BossPrepShield += r * 6; } },
    { id: "chestHunter", icon: "💎", title: "Chest Hunter", max: 3, cost: 3, desc: "Daily and zone chests have better rare loot.", effect: (s, r) => { s.mods.v7ChestLuck += r; } }
  ];

  const V7_CAMPAIGN_UPGRADES = [
    {
      id: "v7BossPrepProtocol",
      rarity: "Rare",
      kind: "Campaign Upgrade",
      title: "Boss Prep Protocol",
      desc: "Gain +28 shield now and bosses deal 8% less damage this run.",
      condition: () => Boolean(state?.campaign),
      apply() { state.player.shield += 28; state.mods.v7BossResist += 0.08; addFloatingText("+28 Shield", "good", "player"); }
    },
    {
      id: "v7ZoneBreaker",
      rarity: "Epic",
      kind: "Campaign Upgrade",
      title: "Zone Breaker",
      desc: "Deal +22% damage in campaign zones and +12% to elites.",
      condition: () => Boolean(state?.campaign),
      apply() { state.mods.v7CampaignDamage += 0.22; state.mods.eliteDamage += 0.12; }
    },
    {
      id: "v7FieldRestock",
      rarity: "Rare",
      kind: "Campaign Upgrade",
      title: "Field Restock",
      desc: "Heal 35 HP, restore 35 mana, and gain 25 ultimate charge.",
      condition: () => Boolean(state?.campaign),
      apply() { healTarget(state.player, 35, true); state.player.mana = clamp(state.player.mana + 35, 0, state.player.maxMana); state.player.ult = clamp(state.player.ult + 25, 0, state.player.maxUlt); }
    },
    {
      id: "v7LootScanner",
      rarity: "Epic",
      kind: "Campaign Upgrade",
      title: "Loot Scanner",
      desc: "Next boss or zone clear grants an extra gear chest.",
      condition: () => Boolean(state?.campaign) && !state.v7ExtraChestReady,
      apply() { state.v7ExtraChestReady = true; }
    },
    {
      id: "v7MythicSpark",
      rarity: "Legendary",
      kind: "Campaign Upgrade",
      title: "Mythic Spark",
      desc: "+15% crit, +20% ultimate damage, and +1 skill point after this run.",
      condition: () => Boolean(state?.campaign),
      apply() { state.mods.critBonus += 0.15; state.mods.v5UltimateDamage = (state.mods.v5UltimateDamage || 0) + 0.2; state.v7PendingSkillPoint = (state.v7PendingSkillPoint || 0) + 1; }
    }
  ];

  const V7_SHOP_ITEMS = [
    {
      id: "v7GearCrate",
      price: 85,
      rarity: "Rare",
      title: "Gear Crate",
      desc: "Adds a random permanent gear chest to inventory.",
      buy() { v7AddChest("Gear Crate"); v7Toast("Gear Crate added to your Campaign menu."); }
    },
    {
      id: "v7BossScanner",
      price: 55,
      rarity: "Rare",
      title: "Boss Scanner",
      desc: "Current enemy loses 10% attack and 2 defense.",
      buy() { if (state?.enemy) { state.enemy.attack = Math.max(1, Math.round(state.enemy.attack * 0.9)); state.enemy.defense = Math.max(0, state.enemy.defense - 2); addLog("Boss Scanner weakened the enemy."); } }
    },
    {
      id: "v7SkillChip",
      price: 135,
      rarity: "Epic",
      title: "Skill Chip",
      desc: "Gain +1 permanent skill point.",
      buy() { v7Meta.skillPoints += 1; v7SaveMeta(); v7Toast("+1 permanent skill point."); }
    }
  ];

  function v7TodayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  function v7DefaultMeta() {
    return {
      activeZone: "slimeFields",
      unlockedZones: { slimeFields: true },
      completedZones: {},
      zoneBest: {},
      inventory: ["trainingBlade", "patchedVest", "apprenticeCharm"],
      equipped: { weapon: "trainingBlade", armor: "patchedVest", charm: "apprenticeCharm", core: null },
      skillPoints: 0,
      skills: {},
      chests: [],
      lastDaily: "",
      totalChestsOpened: 0,
      totalZonesCleared: 0,
      bestZoneTier: 1
    };
  }

  function v7LoadMeta() {
    try {
      const raw = localStorage.getItem(V7_META_KEY);
      return v7EnsureMeta(raw ? JSON.parse(raw) : v7DefaultMeta());
    } catch (error) {
      return v7EnsureMeta(v7DefaultMeta());
    }
  }

  function v7EnsureMeta(meta) {
    const base = v7DefaultMeta();
    const merged = { ...base, ...(meta || {}) };
    merged.unlockedZones = { ...base.unlockedZones, ...(meta?.unlockedZones || {}) };
    merged.completedZones = { ...(meta?.completedZones || {}) };
    merged.zoneBest = { ...(meta?.zoneBest || {}) };
    merged.equipped = { ...base.equipped, ...(meta?.equipped || {}) };
    merged.skills = { ...(meta?.skills || {}) };
    merged.chests = Array.isArray(meta?.chests) ? meta.chests : [];
    merged.inventory = Array.from(new Set([...(meta?.inventory || []), ...base.inventory])).filter((id) => Boolean(v7GearById(id)));
    for (const node of V7_SKILL_NODES) merged.skills[node.id] = clamp(Number(merged.skills[node.id] || 0), 0, node.max);
    if (!merged.activeZone || (merged.activeZone !== "endless" && !v7ZoneById(merged.activeZone))) merged.activeZone = "slimeFields";
    if (merged.activeZone !== "endless" && !v7IsZoneUnlocked(merged.activeZone, merged)) merged.activeZone = v7FirstUnlockedZone(merged).id;
    return merged;
  }

  let v7Meta = v7LoadMeta();
  let v7ActiveTab = "map";
  let v7AudioCtx = null;

  function v7SaveMeta() {
    v7Meta = v7EnsureMeta(v7Meta);
    localStorage.setItem(V7_META_KEY, JSON.stringify(v7Meta));
    v7RenderPanel();
    v7RenderIfOpen();
  }

  function v7ZoneById(id) {
    return V7_CAMPAIGN_ZONES.find((zone) => zone.id === id);
  }

  function v7GearById(id) {
    return V7_GEAR.find((item) => item.id === id);
  }

  function v7SkillById(id) {
    return V7_SKILL_NODES.find((item) => item.id === id);
  }

  function v7ZoneIndex(id) {
    return V7_CAMPAIGN_ZONES.findIndex((zone) => zone.id === id);
  }

  function v7IsZoneUnlocked(id, meta = v7Meta) {
    if (id === "endless") return true;
    if (id === "slimeFields") return true;
    if (meta.unlockedZones?.[id]) return true;
    const index = v7ZoneIndex(id);
    if (index <= 0) return true;
    const previous = V7_CAMPAIGN_ZONES[index - 1];
    return Boolean(meta.completedZones?.[previous.id]);
  }

  function v7FirstUnlockedZone(meta = v7Meta) {
    return [...V7_CAMPAIGN_ZONES].reverse().find((zone) => v7IsZoneUnlocked(zone.id, meta)) || V7_CAMPAIGN_ZONES[0];
  }

  function v7UnlockNextZone(zoneId) {
    const index = v7ZoneIndex(zoneId);
    const next = V7_CAMPAIGN_ZONES[index + 1];
    if (next) v7Meta.unlockedZones[next.id] = true;
    return next;
  }

  function v7GetActiveZone() {
    if (v7Meta.activeZone === "endless") return null;
    if (!v7IsZoneUnlocked(v7Meta.activeZone)) v7Meta.activeZone = v7FirstUnlockedZone().id;
    return v7ZoneById(v7Meta.activeZone) || V7_CAMPAIGN_ZONES[0];
  }

  function v7RarityClass(rarity) {
    return String(rarity || "Common").toLowerCase();
  }

  function v7GearSlotsText() {
    const equipped = v7Meta.equipped || {};
    return ["weapon", "armor", "charm", "core"].map((slot) => {
      const gear = v7GearById(equipped[slot]);
      return `<span class="v7-slot-tag">${slot.toUpperCase()}: ${gear ? `${gear.icon} ${gear.title}` : "Empty"}</span>`;
    }).join("");
  }

  function v7ApplyGearAndSkillsToState(targetState) {
    if (!targetState) return targetState;
    targetState.mods = { ...defaultMods(), ...(targetState.mods || {}) };
    targetState.v7GearApplied = [];
    for (const id of Object.values(v7Meta.equipped || {})) {
      const gear = v7GearById(id);
      if (!gear) continue;
      gear.effect(targetState);
      targetState.v7GearApplied.push(gear.title);
    }
    for (const node of V7_SKILL_NODES) {
      const rank = v7Meta.skills[node.id] || 0;
      if (rank > 0) node.effect(targetState, rank);
    }
    targetState.player.hp = clamp(targetState.player.hp, 0, targetState.player.maxHp);
    targetState.player.mana = clamp(targetState.player.mana, 0, targetState.player.maxMana);
    return targetState;
  }

  function v7CreateCampaignRun(targetState) {
    const zone = v7GetActiveZone();
    if (!zone) {
      targetState.campaign = null;
      targetState.v7Mode = "endless";
      return;
    }
    targetState.campaign = {
      mode: "campaign",
      zoneId: zone.id,
      zoneTitle: zone.title,
      zoneBattle: 1,
      zoneLength: zone.length,
      zoneTier: zone.tier,
      zoneCleared: false,
      rewarded: false
    };
    targetState.v7Mode = "campaign";
  }

  function v7CloneStatus(status) {
    return status ? { ...status } : undefined;
  }

  function v7CreateCampaignEnemy(zone, step) {
    const finalBoss = step >= zone.length;
    const miniBoss = !finalBoss && step === Math.max(3, Math.ceil(zone.length / 2));
    const base = finalBoss ? zone.boss : miniBoss ? zone.miniBoss : choice(zone.enemies);
    const tierFactor = 1 + (zone.tier - 1) * 0.12;
    const stepFactor = 1 + (step - 1) * 0.065;
    const bossFactor = finalBoss ? 1.08 : miniBoss ? 1.04 : 1;
    const hp = Math.round(base.hp * tierFactor * stepFactor * bossFactor + zone.tier * (finalBoss ? 18 : miniBoss ? 10 : 4));
    const attack = Math.round(base.attack * (1 + (zone.tier - 1) * 0.075 + (step - 1) * 0.045));
    const defense = Math.round((base.defense || 0) + (zone.tier - 1) * 0.9 + (step - 1) * 0.23);
    const enemy = {
      ...base,
      status: v7CloneStatus(base.status),
      hp,
      maxHp: hp,
      attack,
      defense,
      statuses: [],
      shield: Math.round((base.shield || 0) + (finalBoss ? 12 + zone.tier * 3 : miniBoss ? 8 + zone.tier * 2 : 0)),
      isBoss: finalBoss,
      isMiniBoss: miniBoss,
      turn: 0,
      charging: false,
      elite: false,
      eliteLabels: [],
      v5Balanced: true,
      v7CampaignEnemy: true,
      v7ZoneId: zone.id,
      v7ZoneFinal: finalBoss,
      v7ZoneStep: step
    };

    if (miniBoss) {
      enemy.name = `Mini-Boss ${enemy.name}`;
      enemy.elite = true;
      enemy.eliteLabels.push("Mini-Boss");
    }

    const eliteChance = Math.min(0.08 + zone.tier * 0.03 + step * 0.012, 0.28);
    if (!finalBoss && !miniBoss && Math.random() < eliteChance && typeof applyEliteModifiers === "function") {
      applyEliteModifiers(enemy, zone.tier >= 4 && Math.random() < 0.18 ? 2 : 1);
      enemy.v7CampaignEnemy = true;
      enemy.v7ZoneId = zone.id;
      enemy.v7ZoneStep = step;
    }

    return enemy;
  }

  function v7RollGear(maxRarity = "Epic", zoneTier = 1) {
    const max = V7_RARITY_ORDER[maxRarity] || 3;
    const owned = new Set(v7Meta.inventory || []);
    let pool = V7_GEAR.filter((gear) => (V7_RARITY_ORDER[gear.rarity] || 1) <= max);
    if (Math.random() < 0.7) pool = pool.filter((gear) => !owned.has(gear.id)).concat(pool.filter((gear) => owned.has(gear.id)));
    const luck = (state?.mods?.v7GearLuck || 0) + Math.max(0, zoneTier - 1);
    const rareBoost = Math.min(4, luck);
    const weights = { Common: 72 - rareBoost * 6, Rare: 42 + rareBoost * 5, Epic: 22 + rareBoost * 3, Legendary: 10 + rareBoost * 2, Mythic: 4 + rareBoost };
    const total = pool.reduce((sum, item) => sum + Math.max(1, weights[item.rarity] || 20), 0);
    let roll = Math.random() * total;
    for (const item of pool) {
      roll -= Math.max(1, weights[item.rarity] || 20);
      if (roll <= 0) return item;
    }
    return choice(pool);
  }

  function v7GrantGear(id, source = "Gear unlocked") {
    const gear = typeof id === "string" ? v7GearById(id) : id;
    if (!gear) return null;
    if (!v7Meta.inventory.includes(gear.id)) {
      v7Meta.inventory.push(gear.id);
      v7Toast(`${source}: ${gear.icon} ${gear.title}`);
    } else {
      const crystalAmount = 10 + (V7_RARITY_ORDER[gear.rarity] || 1) * 8;
      if (typeof hqAwardCrystals === "function") hqAwardCrystals(crystalAmount, "Duplicate gear converted");
      v7Toast(`Duplicate ${gear.title} converted to 💎 ${crystalAmount}.`);
    }
    v7SaveMeta();
    return gear;
  }

  function v7AddChest(type = "Campaign Chest") {
    v7Meta.chests.push({ type, addedAt: Date.now() });
    v7SaveMeta();
  }

  function v7OpenChest(index) {
    const chest = v7Meta.chests[index];
    if (!chest) return;
    v7Meta.chests.splice(index, 1);
    v7Meta.totalChestsOpened += 1;
    const zoneTier = state?.campaign?.zoneTier || v7GetActiveZone()?.tier || v7Meta.bestZoneTier || 1;
    let maxRarity = zoneTier >= 5 ? "Mythic" : zoneTier >= 4 ? "Legendary" : zoneTier >= 2 ? "Epic" : "Rare";
    if (chest.type.includes("Legendary")) maxRarity = "Legendary";
    if (chest.type.includes("Mythic")) maxRarity = "Mythic";
    const gear = v7RollGear(maxRarity, zoneTier + (v7Meta.skills.chestHunter || 0));
    v7GrantGear(gear, `${chest.type} opened`);
    if (Math.random() < 0.24 + (v7Meta.skills.chestHunter || 0) * 0.05) {
      v7Meta.skillPoints += 1;
      v7Toast("Bonus: +1 skill point from chest.");
    }
    if (typeof hqAwardCrystals === "function") hqAwardCrystals(8 + zoneTier * 2, `${chest.type} bonus`);
    v7SaveMeta();
    v7Render();
    v7PlaySound("chest");
    v7Vibrate(90);
  }

  function v7CompleteZone(zoneId) {
    const zone = v7ZoneById(zoneId);
    if (!zone || state?.campaign?.rewarded) return;
    state.campaign.rewarded = true;
    state.campaign.zoneCleared = true;
    v7Meta.completedZones[zone.id] = true;
    v7Meta.unlockedZones[zone.id] = true;
    v7Meta.zoneBest[zone.id] = zone.length;
    v7Meta.totalZonesCleared += 1;
    v7Meta.bestZoneTier = Math.max(v7Meta.bestZoneTier || 1, zone.tier);
    v7Meta.skillPoints += zone.rewardSkillPoints + (state.v7PendingSkillPoint || 0);
    v7GrantGear(zone.rewardGear, `${zone.title} clear reward`);
    v7AddChest(`${zone.title} Chest`);
    if (state.v7ExtraChestReady) v7AddChest("Bonus Gear Chest");
    const next = v7UnlockNextZone(zone.id);
    if (typeof hqAwardCrystals === "function") hqAwardCrystals(25 + zone.tier * 12, `${zone.title} campaign clear`);
    addLog(`${zone.title} cleared! +${zone.rewardSkillPoints} skill points and permanent gear unlocked.`);
    if (next) addLog(`New zone unlocked: ${next.title}.`);
    v7SaveMeta();
    v7PlaySound("victory");
    v7Vibrate([80, 40, 120]);
  }

  function v7CampaignCompletePending() {
    return Boolean(state?.campaign?.zoneCleared);
  }

  function v7EndCampaignRun() {
    if (!state?.campaign) return;
    state.phase = "complete";
    saveGame();
    v7ShowZoneComplete(state.campaign.zoneId);
  }

  function v7CurrentZoneStepText() {
    if (!state?.campaign) return "Endless Arena";
    return `${state.campaign.zoneTitle} • Battle ${state.campaign.zoneBattle}/${state.campaign.zoneLength}`;
  }

  function v7Toast(message) {
    let toast = document.getElementById("v7Toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "v7Toast";
      toast.className = "v7-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(v7Toast._timer);
    v7Toast._timer = setTimeout(() => toast.classList.remove("show"), 2300);
  }

  function v7SoundEnabled() {
    return localStorage.getItem(V7_SOUND_KEY) !== "off";
  }

  function v7ToggleSound() {
    const next = v7SoundEnabled() ? "off" : "on";
    localStorage.setItem(V7_SOUND_KEY, next);
    v7Toast(`Sound ${next === "on" ? "enabled" : "muted"}.`);
    v7RenderPanel();
    v7RenderIfOpen();
    if (next === "on") v7PlaySound("tap");
  }

  function v7PlaySound(type = "tap") {
    if (!v7SoundEnabled()) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      v7AudioCtx = v7AudioCtx || new AudioContext();
      const ctx = v7AudioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;
      const profiles = {
        tap: [420, 0.035, "triangle"],
        attack: [170, 0.07, "sawtooth"],
        victory: [620, 0.16, "triangle"],
        chest: [780, 0.12, "sine"],
        fail: [110, 0.16, "square"]
      };
      const [freq, duration, wave] = profiles[type] || profiles.tap;
      osc.type = wave;
      osc.frequency.setValueAtTime(freq, now);
      if (type === "victory" || type === "chest") osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + duration);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (error) {}
  }

  function v7Vibrate(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  }

  function v7InstallUI() {
    v7PatchLabels();
    const start = $("startScreen");
    if (start && !$("v7Panel")) {
      const panel = document.createElement("section");
      panel.id = "v7Panel";
      panel.className = "v7-panel";
      const continueBtn = $("continueBtn");
      start.insertBefore(panel, continueBtn || start.children[1] || null);
    }

    const footer = document.querySelector(".footer-actions");
    if (footer && !$("v7BattleDock")) {
      const dock = document.createElement("section");
      dock.id = "v7BattleDock";
      dock.className = "v7-battle-dock";
      dock.innerHTML = `
        <button data-v7-action="openMap">🗺️ Map</button>
        <button data-v7-action="openInventory">🎒 Gear</button>
        <button data-v7-action="openSkills">🌲 Skills</button>
        <button data-v7-action="toggleSound">🔊 Sound</button>
      `;
      footer.insertAdjacentElement("afterend", dock);
    }

    const topBar = document.querySelector(".top-bar");
    if (topBar && !$("v7CampaignStrip")) {
      const strip = document.createElement("section");
      strip.id = "v7CampaignStrip";
      strip.className = "v7-campaign-strip hidden";
      topBar.insertAdjacentElement("afterend", strip);
    }

    if (!$("v7Screen")) {
      const overlay = document.createElement("section");
      overlay.id = "v7Screen";
      overlay.className = "overlay hidden";
      overlay.innerHTML = `
        <div class="modal v7-modal">
          <div class="v7-modal-top">
            <div>
              <p class="eyebrow">Campaign HQ</p>
              <h2 id="v7ModalTitle">Campaign</h2>
            </div>
            <button class="close-btn" data-v7-action="close">✕</button>
          </div>
          <div class="v7-tab-row">
            <button data-v7-tab="map">Map</button>
            <button data-v7-tab="gear">Gear</button>
            <button data-v7-tab="skills">Skills</button>
            <button data-v7-tab="chests">Chests</button>
          </div>
          <div id="v7Body"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    if (!$("v7CompleteScreen")) {
      const complete = document.createElement("section");
      complete.id = "v7CompleteScreen";
      complete.className = "v7-complete-screen hidden";
      complete.innerHTML = `<div id="v7CompleteBody" class="v7-complete-card v7-pulse-win"></div>`;
      document.body.appendChild(complete);
    }

    document.addEventListener("click", v7HandleClick);
    v7RenderPanel();
  }

  function v7HandleClick(event) {
    const tab = event.target.closest("[data-v7-tab]");
    if (tab) {
      v7ActiveTab = tab.dataset.v7Tab;
      v7Render();
      v7PlaySound("tap");
      return;
    }

    const control = event.target.closest("[data-v7-action]");
    if (!control) return;
    const action = control.dataset.v7Action;
    const id = control.dataset.id;
    v7PlaySound("tap");

    if (action === "openMap") v7Open("map");
    if (action === "openInventory") v7Open("gear");
    if (action === "openSkills") v7Open("skills");
    if (action === "openChests") v7Open("chests");
    if (action === "close") v7Close();
    if (action === "setZone") v7SetZone(id);
    if (action === "equip") v7EquipGear(id);
    if (action === "buySkill") v7BuySkill(id);
    if (action === "claimDaily") v7ClaimDaily();
    if (action === "openChest") v7OpenChest(Number(control.dataset.index));
    if (action === "backToMenu") v7BackToMenu();
    if (action === "nextZone") v7SelectNextZoneAndMenu(id);
    if (action === "toggleSound") v7ToggleSound();
  }

  function v7PatchLabels() {
    document.title = "EMX Soul Arena - Campaign Update";
    const version = document.querySelector(".version-chip");
    if (version) version.textContent = V7_UPDATE_NAME;
    const subtitle = document.querySelector(".brand-title-card .subtitle");
    if (subtitle) subtitle.textContent = "Campaign zones, permanent gear, skill trees, chests, cinematic combat, HQ upgrades, and multiplayer.";
    const title = document.querySelector("#startScreen .brand-title-card");
    if (title && !title.querySelector(".v7-chip")) {
      const chip = document.createElement("span");
      chip.className = "v7-chip";
      chip.textContent = "V7 Campaign";
      title.appendChild(chip);
    }
  }

  function v7Open(tab = "map") {
    v7ActiveTab = tab;
    v7Render();
    $("v7Screen")?.classList.remove("hidden");
  }

  function v7Close() {
    $("v7Screen")?.classList.add("hidden");
  }

  function v7RenderIfOpen() {
    const screen = $("v7Screen");
    if (screen && !screen.classList.contains("hidden")) v7Render();
  }

  function v7RenderPanel() {
    const panel = $("v7Panel");
    if (!panel) return;
    v7Meta = v7EnsureMeta(v7Meta);
    const activeZone = v7GetActiveZone();
    const completed = V7_CAMPAIGN_ZONES.filter((zone) => v7Meta.completedZones[zone.id]).length;
    const dailyReady = v7Meta.lastDaily !== v7TodayKey();
    panel.innerHTML = `
      <div class="v7-panel-top">
        <p class="v7-panel-title">Campaign Update</p>
        <span class="v7-zone-pill">${activeZone ? `${activeZone.icon} ${activeZone.title}` : "∞ Endless"}</span>
      </div>
      <div class="v7-panel-stats">
        <div class="v7-panel-stat"><small>Zones</small><strong>${completed}/${V7_CAMPAIGN_ZONES.length}</strong></div>
        <div class="v7-panel-stat"><small>Gear</small><strong>${v7Meta.inventory.length}/${V7_GEAR.length}</strong></div>
        <div class="v7-panel-stat"><small>Skill Pts</small><strong>${v7Meta.skillPoints}</strong></div>
      </div>
      <div class="v7-menu-row">
        <button data-v7-action="openMap" class="ready">Campaign Map</button>
        <button data-v7-action="openInventory">Gear Loadout</button>
        <button data-v7-action="openSkills">Skill Tree</button>
        <button data-v7-action="${dailyReady ? "claimDaily" : "openChests"}" class="${dailyReady ? "ready" : ""}">${dailyReady ? "Daily Chest Ready" : `Chests ${v7Meta.chests.length}`}</button>
      </div>
    `;
  }

  function v7RenderCampaignStrip() {
    const strip = $("v7CampaignStrip");
    if (!strip) return;
    if (!state?.campaign) {
      strip.classList.add("hidden");
      return;
    }
    strip.classList.remove("hidden");
    const zone = v7ZoneById(state.campaign.zoneId);
    strip.innerHTML = `
      <div>
        <strong>${zone?.icon || "🗺️"} ${v7CurrentZoneStepText()}</strong>
        <span>${state.enemy?.isBoss ? "Final boss" : state.enemy?.isMiniBoss ? "Mini-boss" : "Campaign battle"} • Permanent gear and skill rewards on clear</span>
      </div>
      <span class="v7-zone-pill">Tier ${state.campaign.zoneTier}</span>
    `;
  }

  function v7Render() {
    v7Meta = v7EnsureMeta(v7Meta);
    const body = $("v7Body");
    if (!body) return;
    const title = $("v7ModalTitle");
    const labels = { map: "Campaign Map", gear: "Gear Loadout", skills: "Skill Tree", chests: "Chests + Daily" };
    if (title) title.textContent = labels[v7ActiveTab] || "Campaign";
    document.querySelectorAll("[data-v7-tab]").forEach((button) => button.classList.toggle("active", button.dataset.v7Tab === v7ActiveTab));
    if (v7ActiveTab === "map") body.innerHTML = v7RenderMap();
    if (v7ActiveTab === "gear") body.innerHTML = v7RenderGear();
    if (v7ActiveTab === "skills") body.innerHTML = v7RenderSkills();
    if (v7ActiveTab === "chests") body.innerHTML = v7RenderChests();
    v7RenderPanel();
  }

  function v7RenderMap() {
    const endlessActive = v7Meta.activeZone === "endless";
    const cards = V7_CAMPAIGN_ZONES.map((zone) => {
      const unlocked = v7IsZoneUnlocked(zone.id);
      const active = v7Meta.activeZone === zone.id;
      const completed = Boolean(v7Meta.completedZones[zone.id]);
      const best = v7Meta.zoneBest[zone.id] || 0;
      return `
        <div class="v7-zone-card ${active ? "active" : ""} ${unlocked ? "" : "locked"}">
          <div class="v7-zone-top">
            <div class="v7-zone-name"><span class="v7-zone-icon">${zone.icon}</span><strong>${zone.title}</strong></div>
            <span class="v7-tag">Tier ${zone.tier}</span>
          </div>
          <p>${zone.subtitle}</p>
          <div class="v7-tag-row">
            <span class="v7-tag">Battles ${zone.length}</span>
            <span class="v7-tag">Best ${best}/${zone.length}</span>
            <span class="v7-tag">Reward: +${zone.rewardSkillPoints} SP</span>
            <span class="v7-tag">${completed ? "✅ Cleared" : unlocked ? "Unlocked" : zone.unlockText}</span>
          </div>
          <button class="${unlocked ? "ready" : ""}" data-v7-action="setZone" data-id="${zone.id}" ${unlocked ? "" : "disabled"}>${active ? "Selected — Pick Class Below" : completed ? "Replay Zone" : unlocked ? "Select Zone" : "Locked"}</button>
        </div>`;
    }).join("");

    return `
      <div class="v7-equipped-banner">
        <h3>How Campaign Works</h3>
        <small>Select a zone, close this menu, then pick a class. Clear the final boss to unlock the next zone, permanent gear, chests, and skill points.</small>
      </div>
      <div class="v7-zone-card ${endlessActive ? "active" : ""}">
        <div class="v7-zone-top"><div class="v7-zone-name"><span class="v7-zone-icon">∞</span><strong>Endless Arena</strong></div><span class="v7-tag">Classic</span></div>
        <p>Use the original endless wave mode with gear and skill bonuses active.</p>
        <button class="ready" data-v7-action="setZone" data-id="endless">${endlessActive ? "Selected" : "Select Endless"}</button>
      </div>
      <div class="v7-grid">${cards}</div>
    `;
  }

  function v7RenderGear() {
    const equipped = `<div class="v7-equipped-banner"><h3>Equipped Gear</h3><div class="v7-equipped-row">${v7GearSlotsText()}</div><small>Gear changes apply to your next run. Beat zones and open chests to collect more gear.</small></div>`;
    const cards = v7Meta.inventory.map((id) => {
      const gear = v7GearById(id);
      if (!gear) return "";
      const equippedNow = v7Meta.equipped[gear.slot] === gear.id;
      return `
        <div class="v7-gear-card ${v7RarityClass(gear.rarity)} ${equippedNow ? "equipped" : ""}">
          <div class="v7-gear-top">
            <div class="v7-gear-name"><span class="v7-gear-icon">${gear.icon}</span><strong>${gear.title}</strong></div>
            <span class="v7-tag v7-rarity-${v7RarityClass(gear.rarity)}">${gear.rarity}</span>
          </div>
          <p>${gear.desc}</p>
          <div class="v7-tag-row"><span class="v7-tag">${gear.slot.toUpperCase()}</span><span class="v7-tag">Permanent</span></div>
          <button class="${equippedNow ? "" : "ready"}" data-v7-action="equip" data-id="${gear.id}" ${equippedNow ? "disabled" : ""}>${equippedNow ? "Equipped" : `Equip ${gear.slot}`}</button>
        </div>`;
    }).join("");
    return `${equipped}<div class="v7-grid">${cards}</div>`;
  }

  function v7RenderSkills() {
    const cards = V7_SKILL_NODES.map((node) => {
      const rank = v7Meta.skills[node.id] || 0;
      const maxed = rank >= node.max;
      const cost = node.cost + Math.floor(rank / 2);
      const canBuy = v7Meta.skillPoints >= cost && !maxed;
      const pct = Math.round((rank / node.max) * 100);
      return `
        <div class="v7-skill-card ${rank ? "owned" : ""}">
          <div class="v7-skill-top">
            <div class="v7-skill-name"><span class="v7-skill-icon">${node.icon}</span><strong>${node.title}</strong></div>
            <span class="v7-tag">${rank}/${node.max}</span>
          </div>
          <p>${node.desc}</p>
          <div class="hq-progress"><div class="hq-progress-fill" style="width:${pct}%"></div></div>
          <button class="${canBuy ? "ready" : ""}" data-v7-action="buySkill" data-id="${node.id}" ${canBuy ? "" : "disabled"}>${maxed ? "Maxed" : `Upgrade • ${cost} SP`}</button>
        </div>`;
    }).join("");
    return `
      <div class="v7-equipped-banner"><h3>Skill Points: ${v7Meta.skillPoints}</h3><small>Earn skill points from campaign zone clears, mythic upgrades, and chest bonuses. These are permanent.</small></div>
      <div class="v7-grid">${cards}</div>
    `;
  }

  function v7RenderChests() {
    const dailyReady = v7Meta.lastDaily !== v7TodayKey();
    const chestCards = v7Meta.chests.length ? v7Meta.chests.map((chest, index) => `
      <div class="v7-chest-card">
        <div class="v7-chest-top"><strong>🎁 ${chest.type}</strong><span class="v7-tag">Gear Roll</span></div>
        <p>Open for permanent gear, HQ crystals, and a chance at bonus skill points.</p>
        <button class="ready" data-v7-action="openChest" data-index="${index}">Open Chest</button>
      </div>
    `).join("") : `<div class="v7-chest-card"><strong>No chests waiting.</strong><p>Clear zones, beat bosses, buy Gear Crates, or claim your daily reward.</p></div>`;
    return `
      <div class="v7-chest-card ${dailyReady ? "v7-pulse-win" : ""}">
        <div class="v7-chest-top"><strong>📅 Daily Supply Drop</strong><span class="v7-tag">${dailyReady ? "Ready" : "Claimed"}</span></div>
        <p>Claim once per day for a chest and bonus HQ crystals.</p>
        <button class="${dailyReady ? "ready" : ""}" data-v7-action="claimDaily" ${dailyReady ? "" : "disabled"}>${dailyReady ? "Claim Daily Chest" : "Come Back Tomorrow"}</button>
      </div>
      <div class="v7-grid">${chestCards}</div>
    `;
  }

  function v7SetZone(id) {
    if (id !== "endless" && !v7IsZoneUnlocked(id)) {
      v7Toast("That zone is still locked.");
      return;
    }
    v7Meta.activeZone = id;
    v7SaveMeta();
    v7Render();
    const zone = id === "endless" ? null : v7ZoneById(id);
    v7Toast(zone ? `${zone.title} selected. Pick a class to start.` : "Endless Arena selected.");
  }

  function v7EquipGear(id) {
    const gear = v7GearById(id);
    if (!gear || !v7Meta.inventory.includes(id)) return;
    v7Meta.equipped[gear.slot] = id;
    v7SaveMeta();
    v7Render();
    v7Toast(`${gear.title} equipped for your next run.`);
  }

  function v7BuySkill(id) {
    const node = v7SkillById(id);
    if (!node) return;
    const rank = v7Meta.skills[id] || 0;
    if (rank >= node.max) return;
    const cost = node.cost + Math.floor(rank / 2);
    if (v7Meta.skillPoints < cost) return;
    v7Meta.skillPoints -= cost;
    v7Meta.skills[id] = rank + 1;
    v7SaveMeta();
    v7Render();
    v7Toast(`${node.title} upgraded to rank ${rank + 1}.`);
    v7PlaySound("chest");
  }

  function v7ClaimDaily() {
    if (v7Meta.lastDaily === v7TodayKey()) return;
    v7Meta.lastDaily = v7TodayKey();
    v7AddChest("Daily Chest");
    if (typeof hqAwardCrystals === "function") hqAwardCrystals(25, "Daily Campaign Supply");
    v7SaveMeta();
    v7Open("chests");
    v7Toast("Daily Chest claimed.");
    v7PlaySound("chest");
  }

  function v7ShowZoneComplete(zoneId) {
    const zone = v7ZoneById(zoneId);
    const next = V7_CAMPAIGN_ZONES[v7ZoneIndex(zoneId) + 1];
    const body = $("v7CompleteBody");
    if (!body || !zone) return;
    body.innerHTML = `
      <div class="v7-complete-icon">${zone.icon}</div>
      <p class="eyebrow">Zone Cleared</p>
      <h2>${zone.title} Complete</h2>
      <small>You unlocked permanent rewards, a gear chest, +${zone.rewardSkillPoints} skill points, and ${next ? `${next.title}` : "the end of the current campaign"}.</small>
      <div class="v7-tag-row" style="justify-content:center">
        <span class="v7-tag">Gear: ${v7GearById(zone.rewardGear)?.title || "Reward"}</span>
        <span class="v7-tag">Chests: ${v7Meta.chests.length}</span>
        <span class="v7-tag">Skill Points: ${v7Meta.skillPoints}</span>
      </div>
      <div class="v7-complete-actions">
        <button class="ready" data-v7-action="backToMenu">Back to Menu</button>
        <button data-v7-action="nextZone" data-id="${next?.id || "endless"}">${next ? "Select Next Zone" : "Select Endless"}</button>
      </div>
    `;
    $("v7CompleteScreen")?.classList.remove("hidden");
  }

  function v7BackToMenu() {
    localStorage.removeItem(SAVE_KEY);
    state = null;
    recentLog = [];
    $("v7CompleteScreen")?.classList.add("hidden");
    $("battleScreen")?.classList.add("hidden");
    $("gameOverScreen")?.classList.add("hidden");
    $("shopScreen")?.classList.add("hidden");
    $("upgradeScreen")?.classList.add("hidden");
    $("startScreen")?.classList.remove("hidden");
    updateContinueButton();
    v7RenderPanel();
  }

  function v7SelectNextZoneAndMenu(id) {
    v7SetZone(id);
    v7BackToMenu();
  }

  // New reward/shop pools.
  if (typeof EXTRA_UPGRADES !== "undefined") EXTRA_UPGRADES.push(...V7_CAMPAIGN_UPGRADES);
  else if (typeof UPGRADES !== "undefined") UPGRADES.push(...V7_CAMPAIGN_UPGRADES);
  if (typeof SHOP_ITEMS !== "undefined") SHOP_ITEMS.push(...V7_SHOP_ITEMS);
  if (typeof BOSS_LOOT !== "undefined") {
    BOSS_LOOT.push(
      { id: "v7CampaignCodex", rarity: "Epic", icon: "🗺️", title: "Campaign Codex", desc: "Campaign enemies take +20% damage this run.", effect() { state.mods.v7CampaignDamage += 0.2; } },
      { id: "v7GearPrinter", rarity: "Legendary", icon: "🧬", title: "Gear Printer", desc: "Adds a permanent Boss Gear Chest to your Campaign menu.", effect() { v7AddChest("Boss Gear Chest"); } },
      { id: "v7SkillBattery", rarity: "Legendary", icon: "🔋", title: "Skill Battery", desc: "Gain +1 permanent skill point and +12 ultimate gain.", effect() { v7Meta.skillPoints += 1; state.mods.ultGain += 12; v7SaveMeta(); } }
    );
  }

  // Patch defaults and state hydration.
  const v7OldDefaultMods = defaultMods;
  defaultMods = function v7DefaultMods() {
    return {
      ...v7OldDefaultMods(),
      v7CampaignDamage: 0,
      v7BossResist: 0,
      v7BossPrepShield: 0,
      v7GearLuck: 0,
      v7ChestLuck: 0,
      v7CoinBoost: 0,
      v7XpBoost: 0
    };
  };

  const v7OldEnsureV3State = ensureV3State;
  ensureV3State = function v7EnsureV3State() {
    v7OldEnsureV3State();
    if (!state) return;
    state.mods = { ...defaultMods(), ...(state.mods || {}) };
    if (state.campaign) {
      state.campaign.zoneBattle = state.campaign.zoneBattle || 1;
      state.campaign.zoneLength = state.campaign.zoneLength || v7ZoneById(state.campaign.zoneId)?.length || 5;
      state.campaign.zoneTitle = state.campaign.zoneTitle || v7ZoneById(state.campaign.zoneId)?.title || "Campaign Zone";
      state.campaign.zoneTier = state.campaign.zoneTier || v7ZoneById(state.campaign.zoneId)?.tier || 1;
      state.campaign.zoneCleared = Boolean(state.campaign.zoneCleared);
      state.campaign.rewarded = Boolean(state.campaign.rewarded);
    }
  };

  const v7OldMakeState = makeState;
  makeState = function v7MakeState(classKey) {
    const newState = v7OldMakeState(classKey);
    v7Meta = v7EnsureMeta(v7Meta);
    v7CreateCampaignRun(newState);
    v7ApplyGearAndSkillsToState(newState);
    newState.v7 = { update: V7_UPDATE_NAME, sound: v7SoundEnabled() };
    return newState;
  };

  const v7OldStartNewRun = startNewRun;
  startNewRun = function v7StartNewRun(classKey) {
    v7OldStartNewRun(classKey);
    if (state?.campaign) {
      addLog(`Campaign run started: ${state.campaign.zoneTitle}.`);
      addLog(`Equipped gear: ${(state.v7GearApplied || []).join(", ") || "none"}.`);
    } else {
      addLog("Endless Arena started with permanent gear and skill bonuses.");
    }
    render();
    saveGame();
    v7PlaySound("chest");
  };

  const v7OldCreateEnemy = createEnemy;
  createEnemy = function v7CreateEnemy(wave) {
    if (state?.campaign?.zoneId) {
      const zone = v7ZoneById(state.campaign.zoneId);
      if (zone) return v7CreateCampaignEnemy(zone, state.campaign.zoneBattle || 1);
    }
    return v7OldCreateEnemy(wave);
  };

  const v7OldStartFight = startFight;
  startFight = function v7StartFight() {
    v7OldStartFight();
    if (!state?.campaign || !state.enemy) return;
    const prepKey = `${state.campaign.zoneId}-${state.campaign.zoneBattle}`;
    if ((state.enemy.isBoss || state.enemy.isMiniBoss) && state.v7LastPrepKey !== prepKey) {
      state.v7LastPrepKey = prepKey;
      const shield = 22 + state.campaign.zoneTier * 5 + (state.mods.v7BossPrepShield || 0);
      state.player.shield += shield;
      state.player.mana = clamp(state.player.mana + 18, 0, state.player.maxMana);
      state.player.ult = clamp(state.player.ult + 16, 0, state.player.maxUlt);
      addLog(`${state.enemy.isBoss ? "Final boss" : "Mini-boss"} prep: +${shield} shield, mana, and ultimate charge.`);
      render();
      saveGame();
    }
  };

  const v7OldCalculatePlayerDamage = calculatePlayerDamage;
  calculatePlayerDamage = function v7CalculatePlayerDamage(key, power) {
    const result = v7OldCalculatePlayerDamage(key, power);
    if (state?.campaign) result.damage = Math.round(result.damage * (1 + (state.mods.v7CampaignDamage || 0)));
    if (state?.enemy?.isMiniBoss) result.damage = Math.round(result.damage * 1.08);
    return result;
  };

  const v7OldDamagePlayer = damagePlayer;
  damagePlayer = function v7DamagePlayer(amount) {
    let tuned = amount;
    if (state?.campaign && state?.enemy?.isBoss) tuned = Math.round(tuned * Math.max(0.58, 0.82 - (state.mods.v7BossResist || 0)));
    if (state?.campaign && state?.enemy?.isMiniBoss) tuned = Math.round(tuned * Math.max(0.65, 0.9 - (state.mods.v7BossResist || 0) * 0.5));
    v7OldDamagePlayer(tuned);
  };

  const v7OldChooseEnemyMove = chooseEnemyMove;
  chooseEnemyMove = function v7ChooseEnemyMove() {
    const move = v7OldChooseEnemyMove();
    if (state?.campaign && state.enemy?.isBoss && move?.big) addLog("Boss warning: shield, stun, heal, or burst before the next heavy hit.");
    return move;
  };

  const v7OldUsePower = usePower;
  usePower = async function v7UsePower(key) {
    const canSound = state && state.phase === "player";
    if (canSound) {
      v7PlaySound(key === "heal" || key === "guard" ? "tap" : "attack");
      if (key === "ultimate") v7Vibrate([40, 40, 90]);
      else v7Vibrate(30);
    }
    await v7OldUsePower(key);
  };

  const v7OldWinFight = winFight;
  winFight = function v7WinFight() {
    const wasCampaign = Boolean(state?.campaign);
    const zoneId = state?.campaign?.zoneId;
    const zoneStep = state?.campaign?.zoneBattle || 0;
    const wasFinal = Boolean(state?.enemy?.v7ZoneFinal);
    const wasMini = Boolean(state?.enemy?.isMiniBoss);
    const wasBoss = Boolean(state?.enemy?.isBoss);
    v7OldWinFight();
    if (!state || state.phase === "gameover") return;

    if (wasCampaign && zoneId) {
      v7Meta.zoneBest[zoneId] = Math.max(v7Meta.zoneBest[zoneId] || 0, zoneStep);
      const zone = v7ZoneById(zoneId);
      const xpBonus = Math.round((10 + zoneStep * 3) * (1 + (state.mods.v7XpBoost || 0)));
      const coinBonus = Math.round((8 + zoneStep * 2) * (1 + (state.mods.v7CoinBoost || 0)));
      state.xp += xpBonus;
      state.coins += coinBonus;
      checkLevelUp();
      addLog(`Campaign bonus: +${xpBonus} XP, +${coinBonus} coins.`);
      if (wasMini) {
        v7AddChest(`${zone?.title || "Mini-Boss"} Mini Chest`);
        addLog("Mini-boss dropped a campaign chest.");
      }
      if (wasFinal || (zone && zoneStep >= zone.length && wasBoss)) v7CompleteZone(zoneId);
      else if (state.v7ExtraChestReady && Math.random() < 0.08) v7AddChest("Loot Scanner Chest");
      v7SaveMeta();
      render();
      saveGame();
    }

    if (!wasCampaign && wasBoss && Math.random() < 0.35) {
      v7AddChest("Endless Boss Chest");
      addLog("Endless boss dropped a permanent gear chest.");
    }
    v7PlaySound("victory");
  };

  const v7OldChooseUpgrade = chooseUpgrade;
  chooseUpgrade = function v7ChooseUpgrade(id) {
    if (v7CampaignCompletePending()) {
      const upgrade = getAvailableUpgradePool().find((item) => item.id === id);
      if (!upgrade) return;
      upgrade.apply();
      addLog(`${upgrade.kind || "Upgrade"} chosen: ${upgrade.title}.`);
      $("upgradeScreen")?.classList.add("hidden");
      render();
      saveGame();
      v7EndCampaignRun();
      return;
    }
    if (state?.campaign && !state.campaign.zoneCleared) {
      state.campaign.zoneBattle += 1;
    }
    v7OldChooseUpgrade(id);
  };

  const v7OldBuyShopItem = buyShopItem;
  buyShopItem = function v7BuyShopItem(id) {
    v7OldBuyShopItem(id);
    v7SaveMeta();
  };

  const v7OldRender = render;
  render = function v7RenderPatched() {
    v7OldRender();
    v7PatchLabels();
    v7RenderCampaignStrip();
    v7RenderPanel();
    const soundButton = document.querySelector('[data-v7-action="toggleSound"]');
    if (soundButton) soundButton.textContent = v7SoundEnabled() ? "🔊 Sound" : "🔇 Muted";
  };

  const v7OldLoadGame = loadGame;
  loadGame = function v7LoadGame() {
    const loaded = v7OldLoadGame();
    if (loaded) {
      ensureV3State();
      if (state?.phase === "complete") v7ShowZoneComplete(state.campaign?.zoneId);
      render();
    }
    return loaded;
  };

  const v7OldGameOver = gameOver;
  gameOver = function v7GameOver() {
    v7PlaySound("fail");
    v7Vibrate([100, 40, 140]);
    v7OldGameOver();
  };

  v7InstallUI();
  v7SaveMeta();
  v7PatchLabels();
})();

/* =========================================================
   EMX Soul Arena v8 - Collection / Skins / Pets / Contracts
   Adds: skin locker, companion pets, summon portal, contracts,
   season pass rewards, promo codes, pet assists, and profile UI.
   ========================================================= */
(() => {
  const V8_META_KEY = "emxSoulArenaCollection_v1";
  const V8_DATE_KEY = () => new Date().toISOString().slice(0, 10);

  const V8_SKINS = [
    {
      id: "flame_default",
      classKey: "flame",
      title: "Classic Flame Mage",
      icon: "🧙‍♂️",
      rarity: "Common",
      desc: "Original EMX fire caster look.",
      ownedDefault: true
    },
    {
      id: "flame_phoenix",
      classKey: "flame",
      title: "Phoenix Warlock",
      icon: "🔥",
      rarity: "Epic",
      desc: "+6 fire damage, +10 max HP, and a hotter battle look.",
      effect(st) {
        st.player.maxHp += 10;
        st.player.hp += 10;
        st.mods.fireDamage = (st.mods.fireDamage || 0) + 6;
        st.mods.statusDamage = (st.mods.statusDamage || 0) + 1;
      }
    },
    {
      id: "flame_neon",
      classKey: "flame",
      title: "Neon Inferno King",
      icon: "🌋",
      rarity: "Legendary",
      desc: "+10 fire damage and +10 ultimate gain.",
      effect(st) {
        st.mods.fireDamage = (st.mods.fireDamage || 0) + 10;
        st.mods.ultGain = (st.mods.ultGain || 0) + 10;
      }
    },
    {
      id: "rogue_default",
      classKey: "rogue",
      title: "Classic Shadow Rogue",
      icon: "🥷",
      rarity: "Common",
      desc: "Original assassin look.",
      ownedDefault: true
    },
    {
      id: "rogue_cyber",
      classKey: "rogue",
      title: "Cyber Ninja",
      icon: "🤖",
      rarity: "Epic",
      desc: "+10% crit chance and +1 combo gain.",
      effect(st) {
        st.mods.critBonus = (st.mods.critBonus || 0) + 0.1;
        st.mods.comboGain = (st.mods.comboGain || 0) + 1;
      }
    },
    {
      id: "rogue_void",
      classKey: "rogue",
      title: "Void Reaper",
      icon: "🕷️",
      rarity: "Legendary",
      desc: "+9 shadow damage and crits can give shield.",
      effect(st) {
        st.mods.shadowDamage = (st.mods.shadowDamage || 0) + 9;
        st.mods.critShield = (st.mods.critShield || 0) + 5;
      }
    },
    {
      id: "storm_default",
      classKey: "storm",
      title: "Classic Storm Knight",
      icon: "⚔️",
      rarity: "Common",
      desc: "Original knight look.",
      ownedDefault: true
    },
    {
      id: "storm_mech",
      classKey: "storm",
      title: "Mech Paladin",
      icon: "🦾",
      rarity: "Epic",
      desc: "+18 starting shield and +4 lightning damage.",
      effect(st) {
        st.mods.startShield = (st.mods.startShield || 0) + 18;
        st.mods.lightningDamage = (st.mods.lightningDamage || 0) + 4;
      }
    },
    {
      id: "storm_titan",
      classKey: "storm",
      title: "Titan Slayer",
      icon: "🛡️",
      rarity: "Legendary",
      desc: "+8 boss damage and +8% damage reduction.",
      effect(st) {
        st.mods.bossDamage = (st.mods.bossDamage || 0) + 8;
        st.mods.damageReduction = (st.mods.damageReduction || 0) + 0.08;
      }
    },
    {
      id: "nature_default",
      classKey: "nature",
      title: "Classic Nature Healer",
      icon: "🧝",
      rarity: "Common",
      desc: "Original healer look.",
      ownedDefault: true
    },
    {
      id: "nature_crystal",
      classKey: "nature",
      title: "Crystal Sage",
      icon: "💎",
      rarity: "Epic",
      desc: "+12 max mana, +7 healing, and stronger support.",
      effect(st) {
        st.player.maxMana += 12;
        st.player.mana += 12;
        st.mods.healBonus = (st.mods.healBonus || 0) + 7;
      }
    },
    {
      id: "nature_plague",
      classKey: "nature",
      title: "Plague Bloom",
      icon: "🍄",
      rarity: "Legendary",
      desc: "+9 poison/nature damage and poison leech.",
      effect(st) {
        st.mods.natureDamage = (st.mods.natureDamage || 0) + 9;
        st.mods.poisonLeech = (st.mods.poisonLeech || 0) + 0.05;
      }
    }
  ];

  const V8_PETS = [
    {
      id: "none",
      title: "No Companion",
      icon: "—",
      rarity: "Common",
      desc: "Run solo.",
      ownedDefault: true
    },
    {
      id: "neonDrake",
      title: "Neon Drake",
      icon: "🐉",
      rarity: "Epic",
      desc: "35% chance after attacks to blast the enemy. +3 status damage.",
      passive(st) {
        st.mods.statusDamage = (st.mods.statusDamage || 0) + 3;
      },
      assist: { type: "damage", chance: 0.35, damage: 18, label: "Neon Drake breath" }
    },
    {
      id: "shieldBot",
      title: "Shield Bot",
      icon: "🛸",
      rarity: "Rare",
      desc: "Start fights with extra shield. Sometimes adds emergency shield.",
      passive(st) {
        st.mods.startShield = (st.mods.startShield || 0) + 18;
        st.mods.damageReduction = (st.mods.damageReduction || 0) + 0.04;
      },
      assist: { type: "shield", chance: 0.25, shield: 16, label: "Shield Bot barrier" }
    },
    {
      id: "spiritFox",
      title: "Spirit Fox",
      icon: "🦊",
      rarity: "Rare",
      desc: "+7% crit chance. Sometimes heals after you use a power.",
      passive(st) {
        st.mods.critBonus = (st.mods.critBonus || 0) + 0.07;
      },
      assist: { type: "heal", chance: 0.28, heal: 14, label: "Spirit Fox blessing" }
    },
    {
      id: "voidSprite",
      title: "Void Sprite",
      icon: "👾",
      rarity: "Legendary",
      desc: "Boosts ultimate gain and sometimes fires a void burst.",
      passive(st) {
        st.mods.ultGain = (st.mods.ultGain || 0) + 8;
        st.mods.ignoreDefenseChance = (st.mods.ignoreDefenseChance || 0) + 0.08;
      },
      assist: { type: "damage", chance: 0.27, damage: 28, label: "Void Sprite burst" }
    },
    {
      id: "lootGoblin",
      title: "Loot Goblin",
      icon: "👺",
      rarity: "Epic",
      desc: "+18% coin rewards and a small chest chance after wins.",
      passive(st) {
        st.mods.v8CoinBoost = (st.mods.v8CoinBoost || 0) + 0.18;
      },
      assist: { type: "damage", chance: 0.18, damage: 12, label: "Loot Goblin cheap shot" }
    }
  ];

  const V8_CONTRACT_DEFS = [
    { id: "wins5", title: "Win 5 Battles", desc: "Win any 5 fights.", type: "wins", goal: 5, crystals: 35, seasonXp: 110 },
    { id: "boss1", title: "Break a Boss", desc: "Defeat 1 boss or final zone enemy.", type: "bosses", goal: 1, crystals: 45, chest: "boss", seasonXp: 140 },
    { id: "ult3", title: "Ultimate Showcase", desc: "Use 3 ultimate attacks.", type: "ultimates", goal: 3, crystals: 30, seasonXp: 100 },
    { id: "open2", title: "Open 2 Chests", desc: "Open any 2 reward chests.", type: "chestsOpened", goal: 2, crystals: 30, seasonXp: 90 },
    { id: "spend100", title: "Shop Spender", desc: "Spend 100 coins in shops.", type: "coinsSpent", goal: 100, crystals: 40, seasonXp: 115 },
    { id: "upgrade3", title: "Build Crafter", desc: "Choose 3 upgrade cards.", type: "upgrades", goal: 3, crystals: 25, seasonXp: 85 }
  ];

  const V8_PASS_REWARDS = [
    { level: 1, text: "25 💎", crystals: 25 },
    { level: 2, text: "Neon Chest", chest: "neon" },
    { level: 3, text: "50 💎", crystals: 50 },
    { level: 4, text: "Boss Chest", chest: "boss" },
    { level: 5, text: "Skin Chest", chest: "skin" },
    { level: 6, text: "75 💎", crystals: 75 },
    { level: 7, text: "Companion Chest", chest: "pet" },
    { level: 8, text: "100 💎", crystals: 100 },
    { level: 9, text: "Legendary Neon Chest", chest: "legend" },
    { level: 10, text: "EMX Mythic Chest", chest: "mythic" }
  ];

  const V8_CODES = {
    EMXLAUNCH: { crystals: 150, chest: "neon", text: "150 crystals + Neon Chest" },
    SOULARENA: { crystals: 100, chest: "boss", text: "100 crystals + Boss Chest" },
    NEONPET: { chest: "pet", text: "Companion Chest" }
  };

  function v8DefaultMeta() {
    const ownedSkins = {};
    const equippedSkins = {};
    for (const skin of V8_SKINS) {
      if (skin.ownedDefault) {
        ownedSkins[skin.id] = true;
        if (skin.classKey) equippedSkins[skin.classKey] = skin.id;
      }
    }
    const ownedPets = { none: true };
    return {
      version: 8,
      crystals: 125,
      totalCrystals: 125,
      seasonXp: 0,
      passClaimed: {},
      ownedSkins,
      equippedSkins,
      ownedPets,
      equippedPet: "none",
      chests: { neon: 1, boss: 0, skin: 0, pet: 0, legend: 0, mythic: 0 },
      dailyChestDate: "",
      contractsDate: "",
      contracts: [],
      codes: {},
      stats: {
        runs: 0,
        wins: 0,
        bosses: 0,
        elites: 0,
        ultimates: 0,
        chestsOpened: 0,
        coinsSpent: 0,
        upgrades: 0,
        skinsUnlocked: 0,
        petsUnlocked: 0
      },
      lastReward: "Welcome reward: 125 crystals + 1 Neon Chest"
    };
  }

  function v8MakeContracts() {
    return V8_CONTRACT_DEFS.map((def) => ({
      id: def.id,
      type: def.type,
      title: def.title,
      desc: def.desc,
      goal: def.goal,
      crystals: def.crystals || 0,
      seasonXp: def.seasonXp || 0,
      chest: def.chest || null,
      progress: 0,
      claimed: false
    }));
  }

  function v8EnsureMeta(meta) {
    const base = v8DefaultMeta();
    const merged = { ...base, ...(meta || {}) };
    merged.stats = { ...base.stats, ...(meta?.stats || {}) };
    merged.chests = { ...base.chests, ...(meta?.chests || {}) };
    merged.ownedSkins = { ...base.ownedSkins, ...(meta?.ownedSkins || {}) };
    merged.equippedSkins = { ...base.equippedSkins, ...(meta?.equippedSkins || {}) };
    merged.ownedPets = { ...base.ownedPets, ...(meta?.ownedPets || {}) };
    merged.codes = { ...(meta?.codes || {}) };
    merged.passClaimed = { ...(meta?.passClaimed || {}) };
    if (!Array.isArray(merged.contracts)) merged.contracts = [];
    if (merged.contractsDate !== V8_DATE_KEY() || merged.contracts.length === 0) {
      merged.contractsDate = V8_DATE_KEY();
      merged.contracts = v8MakeContracts();
    }
    if (!merged.equippedPet || !v8PetById(merged.equippedPet)) merged.equippedPet = "none";
    for (const skin of V8_SKINS) {
      if (skin.ownedDefault) merged.ownedSkins[skin.id] = true;
      if (skin.ownedDefault && skin.classKey && !merged.equippedSkins[skin.classKey]) merged.equippedSkins[skin.classKey] = skin.id;
    }
    merged.ownedPets.none = true;
    return merged;
  }

  let v8Meta = v8LoadMeta();
  let v8OpenTabName = "profile";

  function v8LoadMeta() {
    try {
      const raw = localStorage.getItem(V8_META_KEY);
      return v8EnsureMeta(raw ? JSON.parse(raw) : v8DefaultMeta());
    } catch (error) {
      return v8EnsureMeta(v8DefaultMeta());
    }
  }

  function v8SaveMeta() {
    v8Meta = v8EnsureMeta(v8Meta);
    localStorage.setItem(V8_META_KEY, JSON.stringify(v8Meta));
  }

  function v8SkinById(id) {
    return V8_SKINS.find((skin) => skin.id === id);
  }

  function v8PetById(id) {
    return V8_PETS.find((pet) => pet.id === id);
  }

  function v8RarityClass(rarity) {
    return String(rarity || "Common").toLowerCase();
  }

  function v8SeasonLevel() {
    return Math.max(1, Math.floor((v8Meta.seasonXp || 0) / 100) + 1);
  }

  function v8SeasonProgress() {
    return clamp(v8Meta.seasonXp % 100, 0, 100);
  }

  function v8AddCrystals(amount, source = "Reward") {
    const gain = Math.max(0, Math.round(amount || 0));
    if (!gain) return;
    v8Meta.crystals += gain;
    v8Meta.totalCrystals += gain;
    v8Meta.lastReward = `${source}: +${gain} crystals`;
    v8Toast(`💎 +${gain} crystals`);
  }

  function v8SpendCrystals(amount) {
    const cost = Math.max(0, Math.round(amount || 0));
    if (v8Meta.crystals < cost) {
      v8Toast("Not enough EMX Crystals.");
      return false;
    }
    v8Meta.crystals -= cost;
    return true;
  }

  function v8AddSeasonXp(amount, source = "Season XP") {
    const gain = Math.max(0, Math.round(amount || 0));
    if (!gain) return;
    v8Meta.seasonXp += gain;
    v8Meta.lastReward = `${source}: +${gain} Season XP`;
  }

  function v8AddChest(type = "neon", amount = 1) {
    v8Meta.chests[type] = (v8Meta.chests[type] || 0) + Math.max(1, amount);
    v8Meta.lastReward = `Chest added: ${v8ChestLabel(type)}`;
    v8Toast(`🎁 ${v8ChestLabel(type)} added`);
  }

  function v8ChestLabel(type) {
    const labels = {
      neon: "Neon Chest",
      boss: "Boss Chest",
      skin: "Skin Chest",
      pet: "Companion Chest",
      legend: "Legendary Chest",
      mythic: "Mythic Chest"
    };
    return labels[type] || "Chest";
  }

  function v8Track(type, amount = 1) {
    const gain = Math.max(0, Math.round(amount || 0));
    if (!gain) return;
    v8Meta.stats[type] = (v8Meta.stats[type] || 0) + gain;
    for (const contract of v8Meta.contracts) {
      if (contract.type === type && !contract.claimed) {
        contract.progress = clamp((contract.progress || 0) + gain, 0, contract.goal);
      }
    }
  }

  function v8UnlockSkin(id, source = "Unlock") {
    const skin = v8SkinById(id);
    if (!skin) return "Unknown skin";
    if (v8Meta.ownedSkins[id]) {
      v8AddCrystals(v8DuplicateValue(skin.rarity), "Duplicate skin");
      return `Duplicate ${skin.title} converted to crystals.`;
    }
    v8Meta.ownedSkins[id] = true;
    v8Meta.stats.skinsUnlocked += 1;
    v8Meta.lastReward = `${source}: ${skin.title}`;
    return `Unlocked skin: ${skin.icon} ${skin.title}.`;
  }

  function v8UnlockPet(id, source = "Unlock") {
    const pet = v8PetById(id);
    if (!pet) return "Unknown companion";
    if (v8Meta.ownedPets[id]) {
      v8AddCrystals(v8DuplicateValue(pet.rarity), "Duplicate companion");
      return `Duplicate ${pet.title} converted to crystals.`;
    }
    v8Meta.ownedPets[id] = true;
    v8Meta.stats.petsUnlocked += 1;
    v8Meta.lastReward = `${source}: ${pet.title}`;
    return `Unlocked companion: ${pet.icon} ${pet.title}.`;
  }

  function v8DuplicateValue(rarity) {
    const values = { Common: 8, Rare: 18, Epic: 36, Legendary: 75, Mythic: 130 };
    return values[rarity] || 15;
  }

  function v8WeightedPick(pool) {
    const weights = { Common: 80, Rare: 46, Epic: 24, Legendary: 9, Mythic: 3 };
    const total = pool.reduce((sum, item) => sum + (weights[item.rarity] || 20), 0);
    let roll = Math.random() * total;
    for (const item of pool) {
      roll -= weights[item.rarity] || 20;
      if (roll <= 0) return item;
    }
    return choice(pool);
  }

  function v8RollChest(type = "neon") {
    const messages = [];
    const rareOnly = type === "legend" || type === "mythic";
    const legendaryBoost = type === "mythic";
    const includeSkin = type === "skin" || type === "neon" || type === "legend" || type === "mythic";
    const includePet = type === "pet" || type === "neon" || type === "boss" || type === "legend" || type === "mythic";

    const crystalMin = type === "mythic" ? 80 : type === "legend" ? 50 : type === "boss" ? 35 : 18;
    const crystalMax = type === "mythic" ? 160 : type === "legend" ? 105 : type === "boss" ? 80 : 55;
    const crystals = rand(crystalMin, crystalMax);
    v8AddCrystals(crystals, v8ChestLabel(type));
    messages.push(`💎 ${crystals} crystals`);

    if (state && Math.random() < 0.75) {
      const coins = type === "boss" || type === "legend" || type === "mythic" ? rand(80, 180) : rand(30, 90);
      state.coins = (state.coins || 0) + coins;
      messages.push(`🪙 ${coins} run coins`);
      try { addLog(`Collection chest gave +${coins} coins.`); } catch (error) {}
    }

    const rolls = type === "mythic" ? 3 : type === "legend" || type === "boss" ? 2 : 1;
    for (let i = 0; i < rolls; i++) {
      const choosePet = includePet && (!includeSkin || Math.random() < 0.48);
      if (choosePet) {
        let pool = V8_PETS.filter((pet) => pet.id !== "none");
        if (rareOnly) pool = pool.filter((pet) => ["Epic", "Legendary", "Mythic"].includes(pet.rarity));
        if (legendaryBoost && Math.random() < 0.35) pool = pool.filter((pet) => ["Legendary", "Mythic"].includes(pet.rarity));
        const pet = v8WeightedPick(pool.length ? pool : V8_PETS.filter((pet) => pet.id !== "none"));
        messages.push(v8UnlockPet(pet.id, v8ChestLabel(type)));
      } else if (includeSkin) {
        let pool = V8_SKINS.filter((skin) => !skin.ownedDefault);
        if (rareOnly) pool = pool.filter((skin) => ["Epic", "Legendary", "Mythic"].includes(skin.rarity));
        if (legendaryBoost && Math.random() < 0.35) pool = pool.filter((skin) => ["Legendary", "Mythic"].includes(skin.rarity));
        const skin = v8WeightedPick(pool.length ? pool : V8_SKINS.filter((skin) => !skin.ownedDefault));
        messages.push(v8UnlockSkin(skin.id, v8ChestLabel(type)));
      }
    }

    v8Track("chestsOpened", 1);
    v8AddSeasonXp(type === "mythic" ? 90 : type === "legend" ? 70 : type === "boss" ? 55 : 35, "Chest opened");
    v8Meta.lastReward = messages.join(" • ");
    v8SaveMeta();
    v8FlashReward();
    v8RenderHubStats();
    v8RenderOpenTab();
    if (typeof render === "function") render();
    return messages;
  }

  function v8OpenChest(type) {
    if ((v8Meta.chests[type] || 0) <= 0) {
      v8Toast(`No ${v8ChestLabel(type)} available.`);
      return;
    }
    v8Meta.chests[type] -= 1;
    const messages = v8RollChest(type);
    v8Toast(`Opened ${v8ChestLabel(type)}!`);
    try { addLog(`Chest reward: ${messages[0] || "loot"}`); } catch (error) {}
  }

  function v8BuyChest(type, cost) {
    if (!v8SpendCrystals(cost)) return;
    v8AddChest(type, 1);
    v8SaveMeta();
    v8RenderOpenTab();
    v8RenderHubStats();
  }

  function v8ClaimDailyChest() {
    const today = V8_DATE_KEY();
    if (v8Meta.dailyChestDate === today) {
      v8Toast("Daily chest already claimed.");
      return;
    }
    v8Meta.dailyChestDate = today;
    v8AddChest("neon", 1);
    v8AddCrystals(25, "Daily login");
    v8AddSeasonXp(50, "Daily login");
    v8SaveMeta();
    v8RenderOpenTab();
    v8RenderHubStats();
  }

  function v8ClaimContract(id) {
    const contract = v8Meta.contracts.find((item) => item.id === id);
    if (!contract || contract.claimed || (contract.progress || 0) < contract.goal) return;
    contract.claimed = true;
    v8AddCrystals(contract.crystals || 0, contract.title);
    v8AddSeasonXp(contract.seasonXp || 0, contract.title);
    if (contract.chest) v8AddChest(contract.chest, 1);
    v8SaveMeta();
    v8RenderOpenTab();
    v8RenderHubStats();
  }

  function v8ClaimPassReward(level) {
    const reward = V8_PASS_REWARDS.find((item) => item.level === level);
    if (!reward || v8Meta.passClaimed[level] || v8SeasonLevel() < level) return;
    v8Meta.passClaimed[level] = true;
    if (reward.crystals) v8AddCrystals(reward.crystals, `Season level ${level}`);
    if (reward.chest) v8AddChest(reward.chest, 1);
    v8SaveMeta();
    v8RenderOpenTab();
    v8RenderHubStats();
  }

  function v8ClaimAllPassRewards() {
    for (const reward of V8_PASS_REWARDS) {
      if (v8SeasonLevel() >= reward.level && !v8Meta.passClaimed[reward.level]) {
        v8ClaimPassReward(reward.level);
      }
    }
  }

  function v8RedeemCode(raw) {
    const code = String(raw || "").trim().toUpperCase();
    if (!code) return;
    const reward = V8_CODES[code];
    if (!reward) {
      v8Toast("Code not found.");
      return;
    }
    if (v8Meta.codes[code]) {
      v8Toast("Code already redeemed.");
      return;
    }
    v8Meta.codes[code] = true;
    if (reward.crystals) v8AddCrystals(reward.crystals, `Code ${code}`);
    if (reward.chest) v8AddChest(reward.chest, 1);
    v8AddSeasonXp(60, `Code ${code}`);
    v8SaveMeta();
    v8Toast(`Redeemed ${code}: ${reward.text}`);
    v8RenderOpenTab();
    v8RenderHubStats();
  }

  function v8EquipSkin(id) {
    const skin = v8SkinById(id);
    if (!skin || !v8Meta.ownedSkins[id]) return;
    v8Meta.equippedSkins[skin.classKey] = id;
    v8SaveMeta();
    v8Toast(`Equipped ${skin.title}. Start a new run to apply stats.`);
    if (state?.classKey === skin.classKey) {
      state.player.icon = skin.icon;
      try { render(); } catch (error) {}
    }
    v8RenderOpenTab();
    v8RenderHubStats();
  }

  function v8EquipPet(id) {
    const pet = v8PetById(id);
    if (!pet || !v8Meta.ownedPets[id]) return;
    v8Meta.equippedPet = id;
    v8SaveMeta();
    v8Toast(`Equipped ${pet.title}. Start a new run to apply full passive.`);
    if (state) state.v8PetId = id;
    try { render(); } catch (error) {}
    v8RenderOpenTab();
    v8RenderHubStats();
  }

  function v8ApplyLoadoutToState(targetState, classKey) {
    if (!targetState || targetState.v8LoadoutApplied) return targetState;
    targetState.mods = { ...defaultMods(), ...(targetState.mods || {}) };
    targetState.v8LoadoutApplied = true;

    const skin = v8SkinById(v8Meta.equippedSkins?.[classKey]);
    if (skin && v8Meta.ownedSkins[skin.id]) {
      targetState.player.icon = skin.icon;
      targetState.player.name = skin.title;
      targetState.v8SkinId = skin.id;
      if (typeof skin.effect === "function") skin.effect(targetState);
    }

    const pet = v8PetById(v8Meta.equippedPet || "none") || v8PetById("none");
    targetState.v8PetId = pet.id;
    if (pet && typeof pet.passive === "function") pet.passive(targetState);

    targetState.player.hp = clamp(targetState.player.hp, 0, targetState.player.maxHp);
    targetState.player.mana = clamp(targetState.player.mana, 0, targetState.player.maxMana);
    return targetState;
  }

  function v8ApplyPetStartFightBuff() {
    if (!state || !state.v8PetId || state.v8PetId === "none") return;
    const key = `${state.wave || 0}:${state.enemy?.id || state.enemy?.name || "enemy"}`;
    if (state.v8PetBuffKey === key) return;
    state.v8PetBuffKey = key;
    const pet = v8PetById(state.v8PetId);
    if (!pet) return;
    if (pet.id === "shieldBot") {
      state.player.shield += 12;
      try { addLog("Shield Bot deployed +12 emergency shield."); } catch (error) {}
    }
    if (pet.id === "lootGoblin") {
      state.player.mana = clamp(state.player.mana + 4, 0, state.player.maxMana);
    }
  }

  function v8PetAssist(key, power) {
    if (!state || !state.enemy || state.enemy.hp <= 0) return;
    const pet = v8PetById(state.v8PetId || v8Meta.equippedPet || "none");
    if (!pet || !pet.assist || key === "guard") return;
    let chance = pet.assist.chance || 0;
    if (key === "ultimate") chance += 0.18;
    if (Math.random() > chance) return;

    const assist = pet.assist;
    if (assist.type === "damage") {
      const amount = Math.round((assist.damage || 10) + (state.level || 1) * 2 + (state.combo || 0));
      v8PetEffect("bolt");
      damageEnemy(amount);
      addLog(`${pet.icon} ${assist.label} dealt ${amount} damage.`);
    }
    if (assist.type === "heal") {
      const amount = Math.round((assist.heal || 10) + (state.level || 1) * 2);
      v8PetEffect("heal");
      healTarget(state.player, amount, true);
      addLog(`${pet.icon} ${assist.label} healed you.`);
    }
    if (assist.type === "shield") {
      const amount = Math.round((assist.shield || 10) + (state.level || 1));
      v8PetEffect("shield");
      state.player.shield += amount;
      addLog(`${pet.icon} ${assist.label} gave +${amount} shield.`);
    }
    v8AddSeasonXp(3, "Companion assist");
    try { render(); } catch (error) {}
  }

  function v8PetEffect(type) {
    const layer = $("effectLayer");
    if (!layer) return;
    const item = document.createElement("div");
    item.className = type === "heal" ? "v8-pet-heal" : type === "shield" ? "v8-pet-shield" : "v8-pet-bolt";
    layer.appendChild(item);
    setTimeout(() => item.remove(), 800);
  }

  function v8Toast(message) {
    let toast = document.getElementById("v8Toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "v8Toast";
      toast.className = "v8-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove("show"), 2600);
  }

  function v8FlashReward() {
    const modal = document.getElementById("v8OverlayModal");
    if (!modal) return;
    modal.classList.remove("v8-flash-reward");
    void modal.offsetWidth;
    modal.classList.add("v8-flash-reward");
  }

  function v8InstallUI() {
    const start = $("startScreen");
    if (start && !$("v8HubPanel")) {
      const panel = document.createElement("section");
      panel.id = "v8HubPanel";
      panel.className = "v8-hub-panel";
      panel.innerHTML = `
        <div class="v8-hub-top">
          <div>
            <p class="eyebrow">Collection Update</p>
            <h3>EMX Locker + Live Rewards</h3>
          </div>
          <span id="v8SeasonChip" class="v8-chip hot">Season 1</span>
        </div>
        <div id="v8HubStats" class="v8-chip-row"></div>
        <div class="v8-quick-grid">
          <button class="v8-quick-btn primary-glow" data-v8-open="portal">🌀 Portal<small>Chests + rewards</small></button>
          <button class="v8-quick-btn" data-v8-open="skins">🎭 Skins<small>Equip class looks</small></button>
          <button class="v8-quick-btn" data-v8-open="pets">🐾 Pets<small>Battle companions</small></button>
          <button class="v8-quick-btn" data-v8-open="contracts">📋 Contracts<small>Daily rewards</small></button>
        </div>
      `;
      const insertAfter = start.querySelector(".brand-title-card") || start.firstElementChild;
      if (insertAfter) insertAfter.insertAdjacentElement("afterend", panel);
      else start.prepend(panel);
    }

    const footer = document.querySelector(".footer-actions");
    if (footer && !footer.querySelector('[data-v8-open="portal"]')) {
      const portal = document.createElement("button");
      portal.className = "small-btn shop";
      portal.dataset.v8Open = "portal";
      portal.textContent = "Portal";
      footer.insertBefore(portal, footer.firstChild?.nextSibling || null);
      const contracts = document.createElement("button");
      contracts.className = "small-btn";
      contracts.dataset.v8Open = "contracts";
      contracts.textContent = "Contracts";
      footer.insertBefore(contracts, portal.nextSibling);
    }

    if (!$("v8Overlay")) {
      const overlay = document.createElement("section");
      overlay.id = "v8Overlay";
      overlay.className = "v8-overlay hidden";
      overlay.innerHTML = `
        <div id="v8OverlayModal" class="v8-modal">
          <div class="v8-modal-top">
            <div>
              <p class="eyebrow">EMX Collection</p>
              <h2 id="v8ModalTitle">Player Profile</h2>
            </div>
            <button class="v8-close-btn" data-v8-close="true">✕</button>
          </div>
          <div class="v8-tab-row">
            <button class="v8-tab-btn" data-v8-tab="profile">Profile</button>
            <button class="v8-tab-btn" data-v8-tab="portal">Portal</button>
            <button class="v8-tab-btn" data-v8-tab="contracts">Contracts</button>
            <button class="v8-tab-btn" data-v8-tab="pass">Season</button>
            <button class="v8-tab-btn" data-v8-tab="skins">Skins</button>
            <button class="v8-tab-btn" data-v8-tab="pets">Pets</button>
            <button class="v8-tab-btn" data-v8-tab="codes">Codes</button>
          </div>
          <div id="v8Content" class="v8-content"></div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    if (!window.__emxV8ClickHandlerInstalled) {
      window.__emxV8ClickHandlerInstalled = true;
      document.addEventListener("click", v8HandleClick);
    }
    v8RenderHubStats();
    v8RenderRunHud();
  }

  function v8HandleClick(event) {
    const openButton = event.target.closest("[data-v8-open]");
    if (openButton) {
      v8OpenTab(openButton.dataset.v8Open || "profile");
      return;
    }

    const closeButton = event.target.closest("[data-v8-close]");
    if (closeButton) {
      $("v8Overlay")?.classList.add("hidden");
      return;
    }

    const tabButton = event.target.closest("[data-v8-tab]");
    if (tabButton) {
      v8OpenTab(tabButton.dataset.v8Tab || "profile");
      return;
    }

    const chestButton = event.target.closest("[data-v8-chest]");
    if (chestButton) {
      v8OpenChest(chestButton.dataset.v8Chest);
      return;
    }

    const buyChestButton = event.target.closest("[data-v8-buy-chest]");
    if (buyChestButton) {
      v8BuyChest(buyChestButton.dataset.v8BuyChest, Number(buyChestButton.dataset.cost || 0));
      return;
    }

    const dailyButton = event.target.closest("[data-v8-daily]");
    if (dailyButton) {
      v8ClaimDailyChest();
      return;
    }

    const claimContract = event.target.closest("[data-v8-claim-contract]");
    if (claimContract) {
      v8ClaimContract(claimContract.dataset.v8ClaimContract);
      return;
    }

    const claimPass = event.target.closest("[data-v8-claim-pass]");
    if (claimPass) {
      v8ClaimPassReward(Number(claimPass.dataset.v8ClaimPass));
      return;
    }

    const claimAllPass = event.target.closest("[data-v8-claim-all-pass]");
    if (claimAllPass) {
      v8ClaimAllPassRewards();
      return;
    }

    const equipSkin = event.target.closest("[data-v8-equip-skin]");
    if (equipSkin) {
      v8EquipSkin(equipSkin.dataset.v8EquipSkin);
      return;
    }

    const equipPet = event.target.closest("[data-v8-equip-pet]");
    if (equipPet) {
      v8EquipPet(equipPet.dataset.v8EquipPet);
      return;
    }

    const redeem = event.target.closest("[data-v8-redeem]");
    if (redeem) {
      v8RedeemCode($("v8CodeInput")?.value || "");
    }
  }

  function v8OpenTab(tab = "profile") {
    v8OpenTabName = tab;
    $("v8Overlay")?.classList.remove("hidden");
    v8RenderOpenTab();
  }

  function v8RenderOpenTab() {
    const content = $("v8Content");
    if (!content) return;
    const titles = {
      profile: "Player Profile",
      portal: "Summon Portal",
      contracts: "Daily Contracts",
      pass: "Season Track",
      skins: "Skin Locker",
      pets: "Companion Lab",
      codes: "Promo Codes"
    };
    $("v8ModalTitle").textContent = titles[v8OpenTabName] || "EMX Collection";
    document.querySelectorAll(".v8-tab-btn").forEach((button) => {
      button.classList.toggle("active", button.dataset.v8Tab === v8OpenTabName);
    });

    if (v8OpenTabName === "profile") content.innerHTML = v8ProfileHtml();
    if (v8OpenTabName === "portal") content.innerHTML = v8PortalHtml();
    if (v8OpenTabName === "contracts") content.innerHTML = v8ContractsHtml();
    if (v8OpenTabName === "pass") content.innerHTML = v8PassHtml();
    if (v8OpenTabName === "skins") content.innerHTML = v8SkinsHtml();
    if (v8OpenTabName === "pets") content.innerHTML = v8PetsHtml();
    if (v8OpenTabName === "codes") content.innerHTML = v8CodesHtml();
  }

  function v8RenderHubStats() {
    const stats = $("v8HubStats");
    if (stats) {
      const pet = v8PetById(v8Meta.equippedPet || "none") || v8PetById("none");
      const ownedSkinCount = Object.values(v8Meta.ownedSkins || {}).filter(Boolean).length;
      const ownedPetCount = Object.values(v8Meta.ownedPets || {}).filter(Boolean).length - 1;
      stats.innerHTML = `
        <span class="v8-chip hot">💎 ${v8Meta.crystals}</span>
        <span class="v8-chip">🎟 Level ${v8SeasonLevel()}</span>
        <span class="v8-chip">🎭 ${ownedSkinCount}/${V8_SKINS.length}</span>
        <span class="v8-chip">🐾 ${Math.max(0, ownedPetCount)}/${V8_PETS.length - 1}</span>
        <span class="v8-chip">${pet.icon} ${pet.title}</span>
      `;
    }
    const seasonChip = $("v8SeasonChip");
    if (seasonChip) seasonChip.textContent = `Season ${v8SeasonLevel()} • ${v8SeasonProgress()}%`;
  }

  function v8RenderRunHud() {
    const row = $("relicRow");
    if (!row) return;
    if (!state || !state.v8PetId || state.v8PetId === "none") return;
    const pet = v8PetById(state.v8PetId);
    if (!pet || row.querySelector(".v8-pet-chip")) return;
    const chip = document.createElement("span");
    chip.className = "relic-chip v8-pet-chip";
    chip.textContent = `${pet.icon} ${pet.title}`;
    row.appendChild(chip);

    const panel = document.querySelector(".player-panel");
    if (panel && !panel.querySelector(".v8-pet-sprite")) {
      const petSprite = document.createElement("div");
      petSprite.className = "v8-pet-sprite";
      petSprite.textContent = pet.icon;
      panel.appendChild(petSprite);
    } else if (panel) {
      const petSprite = panel.querySelector(".v8-pet-sprite");
      if (petSprite) petSprite.textContent = pet.icon;
    }
  }

  function v8ProfileHtml() {
    const equipped = Object.entries(v8Meta.equippedSkins || {})
      .map(([classKey, skinId]) => v8SkinById(skinId))
      .filter(Boolean);
    const pet = v8PetById(v8Meta.equippedPet || "none") || v8PetById("none");
    return `
      <div class="v8-profile-card">
        <div class="v8-card-top">
          <div>
            <p class="eyebrow">EMX Profile</p>
            <strong>Collection Rank: ${v8CollectionRank()}</strong>
            <small>Last reward: ${v8Escape(v8Meta.lastReward || "No reward yet")}</small>
          </div>
          <span class="v8-card-icon">🏆</span>
        </div>
        <div class="v8-chip-row" style="margin-top:10px">
          <span class="v8-chip hot">💎 ${v8Meta.crystals}</span>
          <span class="v8-chip">🎟 Season XP ${v8Meta.seasonXp}</span>
          <span class="v8-chip">⚔️ Wins ${v8Meta.stats.wins || 0}</span>
          <span class="v8-chip">👑 Bosses ${v8Meta.stats.bosses || 0}</span>
          <span class="v8-chip">🎁 Chests ${v8Meta.stats.chestsOpened || 0}</span>
        </div>
        <div class="v8-progress-line"><div class="v8-progress-fill" style="width:${v8SeasonProgress()}%"></div></div>
        <small>Season Level ${v8SeasonLevel()} • ${100 - v8SeasonProgress()} XP to next level</small>
      </div>
      <div class="v8-grid" style="margin-top:10px">
        <div class="v8-card epic">
          <div class="v8-card-top"><strong>Equipped Companion</strong><span class="v8-card-icon">${pet.icon}</span></div>
          <small>${v8Escape(pet.title)} — ${v8Escape(pet.desc)}</small>
          <div class="v8-card-actions"><button data-v8-tab="pets">Change Companion</button></div>
        </div>
        <div class="v8-card rare">
          <div class="v8-card-top"><strong>Equipped Skins</strong><span class="v8-card-icon">🎭</span></div>
          <small>${equipped.map((skin) => `${skin.icon} ${skin.title}`).join(" • ")}</small>
          <div class="v8-card-actions"><button data-v8-tab="skins">Open Locker</button></div>
        </div>
      </div>
    `;
  }

  function v8PortalHtml() {
    const todayClaimed = v8Meta.dailyChestDate === V8_DATE_KEY();
    const chestButtons = ["neon", "boss", "skin", "pet", "legend", "mythic"].map((type) => `
      <button class="v8-portal-btn" data-v8-chest="${type}">
        ${v8ChestLabel(type)} <small>Owned: ${v8Meta.chests[type] || 0}</small>
      </button>
    `).join("");
    return `
      <div class="v8-portal-stage"><div class="v8-portal-core"><span>🌀</span></div></div>
      <div class="v8-chip-row" style="margin-bottom:10px">
        <span class="v8-chip hot">💎 ${v8Meta.crystals} crystals</span>
        <span class="v8-chip">🎁 ${Object.values(v8Meta.chests).reduce((a,b)=>a+b,0)} chests</span>
        <span class="v8-chip">${todayClaimed ? "✅ Daily claimed" : "🎁 Daily ready"}</span>
      </div>
      <div class="v8-action-grid" style="margin-bottom:12px">
        <button class="v8-portal-btn primary-glow" data-v8-daily="true">Daily Free Chest<small>${todayClaimed ? "Come back tomorrow" : "+25 crystals + Neon Chest"}</small></button>
        <button class="v8-portal-btn" data-v8-buy-chest="neon" data-cost="45">Buy Neon Chest<small>45 crystals</small></button>
        <button class="v8-portal-btn" data-v8-buy-chest="skin" data-cost="80">Buy Skin Chest<small>80 crystals</small></button>
        <button class="v8-portal-btn" data-v8-buy-chest="pet" data-cost="80">Buy Pet Chest<small>80 crystals</small></button>
      </div>
      <div class="v8-grid">${chestButtons}</div>
    `;
  }

  function v8ContractsHtml() {
    return `
      <div class="v8-chip-row" style="margin-bottom:10px">
        <span class="v8-chip hot">Resets daily</span>
        <span class="v8-chip">💎 Rewards crystals</span>
        <span class="v8-chip">🎟 Gives season XP</span>
      </div>
      <div class="v8-grid">
        ${v8Meta.contracts.map((contract) => {
          const done = (contract.progress || 0) >= contract.goal;
          return `
            <div class="v8-card ${done ? "rare" : "common"}">
              <div class="v8-card-top">
                <strong class="${done ? "v8-contract-done" : ""}">${v8Escape(contract.title)}</strong>
                <span class="v8-pill ${contract.claimed ? "equipped" : ""}">${contract.claimed ? "Claimed" : `${contract.progress || 0}/${contract.goal}`}</span>
              </div>
              <small>${v8Escape(contract.desc)} Reward: ${contract.crystals} 💎${contract.chest ? ` + ${v8ChestLabel(contract.chest)}` : ""}</small>
              <div class="v8-progress-line"><div class="v8-progress-fill" style="width:${clamp(((contract.progress || 0) / contract.goal) * 100, 0, 100)}%"></div></div>
              <div class="v8-card-actions"><button ${done && !contract.claimed ? "" : "disabled"} data-v8-claim-contract="${contract.id}">Claim Reward</button></div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function v8PassHtml() {
    const level = v8SeasonLevel();
    return `
      <div class="v8-pass-top" style="margin-bottom:10px">
        <div>
          <p class="eyebrow">Season Track</p>
          <strong>Season Level ${level}</strong>
          <small>Earn XP from wins, bosses, pets, contracts, and chests.</small>
        </div>
        <button class="v8-pass-claim" data-v8-claim-all-pass="true">Claim All</button>
      </div>
      <div class="v8-progress-line" style="margin-bottom:12px"><div class="v8-progress-fill" style="width:${v8SeasonProgress()}%"></div></div>
      <div class="v8-grid">
        ${V8_PASS_REWARDS.map((reward) => {
          const locked = level < reward.level;
          const claimed = Boolean(v8Meta.passClaimed[reward.level]);
          return `
            <div class="v8-pass-row ${locked ? "locked" : ""} ${claimed ? "claimed" : ""}">
              <span class="v8-level-badge">${reward.level}</span>
              <div><strong>${v8Escape(reward.text)}</strong><small>${locked ? "Locked" : claimed ? "Already claimed" : "Ready to claim"}</small></div>
              <button class="v8-pass-claim" ${!locked && !claimed ? "" : "disabled"} data-v8-claim-pass="${reward.level}">${claimed ? "✓" : "Claim"}</button>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  function v8SkinsHtml() {
    return `<div class="v8-grid">${V8_SKINS.map((skin) => {
      const owned = Boolean(v8Meta.ownedSkins[skin.id]);
      const equipped = v8Meta.equippedSkins?.[skin.classKey] === skin.id;
      return `
        <div class="v8-card ${v8RarityClass(skin.rarity)}">
          <div class="v8-card-top">
            <div><strong>${skin.icon} ${v8Escape(skin.title)}</strong><small>${v8Escape(skin.classKey || "all")} • ${v8Escape(skin.rarity)}</small></div>
            <span class="v8-pill ${equipped ? "equipped" : ""}">${equipped ? "Equipped" : owned ? "Owned" : "Locked"}</span>
          </div>
          <small>${v8Escape(skin.desc)}</small>
          <div class="v8-card-actions"><button ${owned && !equipped ? "" : "disabled"} data-v8-equip-skin="${skin.id}">${equipped ? "Equipped" : owned ? "Equip" : "Find in Chests"}</button></div>
        </div>
      `;
    }).join("")}</div>`;
  }

  function v8PetsHtml() {
    return `<div class="v8-grid">${V8_PETS.map((pet) => {
      const owned = Boolean(v8Meta.ownedPets[pet.id]);
      const equipped = v8Meta.equippedPet === pet.id;
      return `
        <div class="v8-card ${v8RarityClass(pet.rarity)}">
          <div class="v8-card-top">
            <div><strong>${pet.icon} ${v8Escape(pet.title)}</strong><small>${v8Escape(pet.rarity)}</small></div>
            <span class="v8-pill ${equipped ? "equipped" : ""}">${equipped ? "Equipped" : owned ? "Owned" : "Locked"}</span>
          </div>
          <small>${v8Escape(pet.desc)}</small>
          <div class="v8-card-actions"><button ${owned && !equipped ? "" : "disabled"} data-v8-equip-pet="${pet.id}">${equipped ? "Equipped" : owned ? "Equip" : "Find in Chests"}</button></div>
        </div>
      `;
    }).join("")}</div>`;
  }

  function v8CodesHtml() {
    return `
      <div class="v8-code-panel">
        <p class="eyebrow">Redeem Codes</p>
        <strong>Try these launch codes:</strong>
        <small>EMXLAUNCH • SOULARENA • NEONPET</small>
        <input id="v8CodeInput" placeholder="Enter code" autocomplete="off" />
        <button class="v8-code-btn primary-glow" data-v8-redeem="true">Redeem Code</button>
      </div>
    `;
  }

  function v8CollectionRank() {
    const score = (v8Meta.stats.wins || 0) + (v8Meta.stats.bosses || 0) * 4 + (v8Meta.stats.skinsUnlocked || 0) * 3 + (v8Meta.stats.petsUnlocked || 0) * 4;
    if (score >= 150) return "EMX Legend";
    if (score >= 90) return "Mythic Hunter";
    if (score >= 45) return "Neon Champion";
    if (score >= 18) return "Arena Specialist";
    return "Rookie Duelist";
  }

  function v8Escape(value) {
    return String(value ?? "").replace(/[&<>'"]/g, (char) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#039;",
      '"': "&quot;"
    }[char]));
  }

  function v8PatchGameFunctions() {
    if (window.__emxV8Patched) return;
    window.__emxV8Patched = true;

    const oldMakeState = makeState;
    makeState = function v8MakeStatePatched(classKey) {
      const nextState = oldMakeState(classKey);
      return v8ApplyLoadoutToState(nextState, classKey);
    };

    const oldStartNewRun = startNewRun;
    startNewRun = function v8StartNewRunPatched(classKey) {
      v8Track("runs", 1);
      v8AddSeasonXp(10, "New run");
      oldStartNewRun(classKey);
      if (state) {
        state = v8ApplyLoadoutToState(state, classKey);
        const pet = v8PetById(state.v8PetId || "none");
        if (pet && pet.id !== "none") addLog(`${pet.icon} ${pet.title} joined your run.`);
        render();
        saveGame();
      }
      v8SaveMeta();
      v8RenderHubStats();
    };

    const oldStartFight = startFight;
    startFight = function v8StartFightPatched() {
      oldStartFight();
      v8ApplyPetStartFightBuff();
      render();
      saveGame();
    };

    const oldApplyPlayerPower = applyPlayerPower;
    applyPlayerPower = function v8ApplyPlayerPowerPatched(key, power) {
      oldApplyPlayerPower(key, power);
      v8PetAssist(key, power);
    };

    const oldUsePower = usePower;
    usePower = async function v8UsePowerPatched(key) {
      const canTrackUltimate = state && state.phase === "player" && key === "ultimate" && state.player?.ult >= 100;
      await oldUsePower(key);
      if (canTrackUltimate) {
        v8Track("ultimates", 1);
        v8AddSeasonXp(12, "Ultimate used");
        v8SaveMeta();
        v8RenderHubStats();
      }
    };

    const oldWinFight = winFight;
    winFight = function v8WinFightPatched() {
      const wasBoss = Boolean(state?.enemy?.isBoss || state?.enemy?.v7ZoneFinal);
      const wasElite = Boolean(state?.enemy?.elite || state?.enemy?.isMiniBoss);
      const hadLootGoblin = state?.v8PetId === "lootGoblin";
      oldWinFight();
      if (!state || state.phase === "gameover") return;
      v8Track("wins", 1);
      if (wasBoss) {
        v8Track("bosses", 1);
        v8AddChest("boss", 1);
        v8AddSeasonXp(65, "Boss defeated");
      } else {
        v8AddSeasonXp(22, "Battle won");
      }
      if (wasElite) {
        v8Track("elites", 1);
        v8AddSeasonXp(20, "Elite defeated");
      }
      if (hadLootGoblin && Math.random() < 0.22) v8AddChest("neon", 1);
      if (Math.random() < (wasBoss ? 0.25 : 0.07)) v8AddChest("neon", 1);
      if (state.mods?.v8CoinBoost && state.coins) {
        const bonus = Math.round(8 * state.mods.v8CoinBoost * Math.max(1, state.wave || 1));
        state.coins += bonus;
        addLog(`Loot boost gave +${bonus} coins.`);
      }
      v8SaveMeta();
      v8RenderHubStats();
      saveGame();
    };

    const oldChooseUpgrade = chooseUpgrade;
    chooseUpgrade = function v8ChooseUpgradePatched(id) {
      oldChooseUpgrade(id);
      v8Track("upgrades", 1);
      v8AddSeasonXp(8, "Upgrade picked");
      v8SaveMeta();
      v8RenderHubStats();
    };

    if (typeof buyShopItem === "function") {
      const oldBuyShopItem = buyShopItem;
      buyShopItem = function v8BuyShopItemPatched(id) {
        const before = state?.coins || 0;
        oldBuyShopItem(id);
        const spent = Math.max(0, before - (state?.coins || 0));
        if (spent > 0) {
          v8Track("coinsSpent", spent);
          v8AddSeasonXp(Math.min(50, Math.ceil(spent / 5)), "Shop spending");
          v8SaveMeta();
          v8RenderHubStats();
        }
      };
    }

    const oldLoadGame = loadGame;
    loadGame = function v8LoadGamePatched() {
      const loaded = oldLoadGame();
      if (loaded && state) {
        if (!state.v8LoadoutApplied) v8ApplyLoadoutToState(state, state.classKey);
        render();
      }
      return loaded;
    };

    const oldRender = render;
    render = function v8RenderPatched() {
      oldRender();
      const versionChip = document.querySelector(".version-chip");
      if (versionChip) versionChip.textContent = "Collection Update";
      const sprite = $("playerSprite");
      if (sprite && state?.v8SkinId) {
        const skin = v8SkinById(state.v8SkinId);
        if (skin) sprite.textContent = skin.icon;
      }
      const petSprite = document.querySelector(".player-panel .v8-pet-sprite");
      if (petSprite && (!state?.v8PetId || state.v8PetId === "none")) petSprite.remove();
      v8RenderRunHud();
      v8RenderHubStats();
    };
  }

  v8PatchGameFunctions();
  v8InstallUI();
  v8SaveMeta();

  setTimeout(() => {
    v8InstallUI();
    v8RenderHubStats();
    if (typeof render === "function" && state) render();
  }, 250);
})();

/* === EMX Soul Arena v9: Sound Lab + Kid-Fun Update === */
(function emxSoulArenaV9() {
  const V9_UPDATE_NAME = "Sound + Kid Fun";
  const V9_META_KEY = "emxSoulArenaKidFun_v9";
  const V9_SOUND_KEY = "emxSoulArenaSound_v7";
  const V9_VOLUME_KEY = "emxSoulArenaVolume_v9";
  const V9_MUSIC_KEY = "emxSoulArenaMusic_v9";

  const V9_STICKER_STARTERS = [
    { id: "slime", name: "Slime", icon: "🟢" },
    { id: "goblin", name: "Goblin", icon: "👺" },
    { id: "skeleton", name: "Skeleton", icon: "💀" },
    { id: "wolf", name: "Dire Wolf", icon: "🐺" },
    { id: "bat", name: "Vampire Bat", icon: "🦇" },
    { id: "spider", name: "Poison Spider", icon: "🕷️" },
    { id: "imp", name: "Ice Imp", icon: "👿" },
    { id: "golem", name: "Rock Golem", icon: "🗿" },
    { id: "goblinKing", name: "Goblin King", icon: "🤴" },
    { id: "boneDragon", name: "Bone Dragon", icon: "🐉" },
    { id: "stormTitan", name: "Storm Titan", icon: "⛈️" },
    { id: "voidBeast", name: "Void Emperor", icon: "👁️" }
  ];

  const V9_DOJO_POWERS = [
    { type: "fire", icon: "🔥", title: "Fire Blast", desc: "Flame sound + impact burst" },
    { type: "lightning", icon: "⚡", title: "Lightning Bolt", desc: "Zap sound + bright flash" },
    { type: "ice", icon: "❄️", title: "Ice Freeze", desc: "Shimmer sound + blue burst" },
    { type: "poison", icon: "☠️", title: "Poison Cloud", desc: "Bubbling toxic pop" },
    { type: "shadow", icon: "🌑", title: "Shadow Dash", desc: "Fast whoosh combo" },
    { type: "heal", icon: "✨", title: "Heal Sparkle", desc: "Soft healing chime" },
    { type: "shield", icon: "🛡️", title: "Shield Pop", desc: "Protective bubble sound" },
    { type: "meteor", icon: "☄️", title: "Meteor Drop", desc: "Big cinematic boom" }
  ];

  let v9Meta = v9LoadMeta();
  let v9LastHint = "";

  const V9Sound = {
    ctx: null,
    unlocked: false,
    musicTimer: null,
    musicStep: 0,

    enabled() {
      return localStorage.getItem(V9_SOUND_KEY) !== "off";
    },

    volume() {
      const raw = Number(localStorage.getItem(V9_VOLUME_KEY));
      if (Number.isFinite(raw)) return clamp(raw, 0, 1);
      return 0.75;
    },

    musicEnabled() {
      return localStorage.getItem(V9_MUSIC_KEY) === "on";
    },

    setVolume(value) {
      localStorage.setItem(V9_VOLUME_KEY, String(clamp(Number(value) || 0, 0, 1)));
      this.play("tap");
      v9RenderSoundStatus();
    },

    setSound(on) {
      localStorage.setItem(V9_SOUND_KEY, on ? "on" : "off");
      if (on) this.play("tap");
      else this.stopMusic();
      v9RenderSoundStatus();
      v9RenderStartPanel();
    },

    setMusic(on) {
      localStorage.setItem(V9_MUSIC_KEY, on ? "on" : "off");
      if (on) this.startMusic();
      else this.stopMusic();
      v9RenderSoundStatus();
    },

    getCtx() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return null;
      if (!this.ctx) this.ctx = new AudioContext();
      return this.ctx;
    },

    async unlock(playWake = false) {
      if (!this.enabled()) return false;
      const ctx = this.getCtx();
      if (!ctx) return false;
      try {
        if (ctx.state === "suspended") await ctx.resume();
        this.unlocked = ctx.state === "running";
        if (this.unlocked) {
          const wake = document.getElementById("v9SoundWake");
          if (wake) wake.classList.add("hide");
          if (playWake) this.play("tap");
          if (this.musicEnabled()) this.startMusic();
        }
        v9RenderSoundStatus();
        return this.unlocked;
      } catch (error) {
        return false;
      }
    },

    makeGain(ctx, start, duration, amount = 0.08) {
      const gain = ctx.createGain();
      const master = amount * this.volume();
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(Math.max(0.0002, master), start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + Math.max(0.025, duration));
      return gain;
    },

    tone(freq, duration = 0.1, wave = "sine", delay = 0, amount = 0.075, endFreq = null) {
      if (!this.enabled()) return;
      const ctx = this.getCtx();
      if (!ctx) return;
      const start = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = this.makeGain(ctx, start, duration, amount);
      osc.type = wave;
      osc.frequency.setValueAtTime(Math.max(20, freq), start);
      if (endFreq) osc.frequency.exponentialRampToValueAtTime(Math.max(20, endFreq), start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + duration + 0.03);
    },

    noise(duration = 0.12, delay = 0, amount = 0.055, filterFreq = 600) {
      if (!this.enabled()) return;
      const ctx = this.getCtx();
      if (!ctx) return;
      const start = ctx.currentTime + delay;
      const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
      const source = ctx.createBufferSource();
      const filter = ctx.createBiquadFilter();
      const gain = this.makeGain(ctx, start, duration, amount);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(filterFreq, start);
      source.buffer = buffer;
      source.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      source.start(start);
      source.stop(start + duration + 0.02);
    },

    chord(freqs, duration = 0.14, wave = "triangle", amount = 0.045) {
      freqs.forEach((freq, index) => this.tone(freq, duration, wave, index * 0.025, amount));
    },

    play(type = "tap") {
      if (!this.enabled()) return;
      const ctx = this.getCtx();
      if (!ctx) return;
      if (ctx.state === "suspended") ctx.resume().then(() => { this.unlocked = true; v9RenderSoundStatus(); }).catch(() => {});
      this.unlocked = ctx.state === "running" || this.unlocked;

      switch (type) {
        case "tap":
          this.tone(520, 0.045, "triangle", 0, 0.045, 760);
          break;
        case "coin":
          this.tone(900, 0.06, "triangle", 0, 0.05, 1250);
          this.tone(1300, 0.08, "sine", 0.05, 0.045);
          break;
        case "upgrade":
          this.chord([420, 630, 840], 0.13, "triangle", 0.055);
          break;
        case "fire":
        case "fireball":
          this.noise(0.16, 0, 0.06, 760);
          this.tone(150, 0.18, "sawtooth", 0, 0.06, 310);
          this.tone(520, 0.1, "triangle", 0.06, 0.045, 260);
          break;
        case "meteor":
        case "nova":
          this.noise(0.32, 0, 0.1, 520);
          this.tone(90, 0.32, "sawtooth", 0, 0.09, 52);
          this.tone(720, 0.18, "triangle", 0.04, 0.055, 200);
          break;
        case "slash":
        case "attack":
          this.noise(0.08, 0, 0.055, 1500);
          this.tone(240, 0.07, "sawtooth", 0, 0.055, 120);
          break;
        case "combo":
          [0, 0.08, 0.16, 0.24].forEach((delay, i) => {
            this.noise(0.06, delay, 0.04, 1700 + i * 120);
            this.tone(240 + i * 70, 0.06, "square", delay, 0.035, 140 + i * 50);
          });
          break;
        case "lightning":
          this.noise(0.12, 0, 0.07, 2600);
          this.tone(1200, 0.08, "square", 0, 0.055, 420);
          this.tone(920, 0.07, "sawtooth", 0.045, 0.045, 1600);
          break;
        case "ice":
        case "freeze":
          this.chord([660, 880, 1320], 0.16, "sine", 0.04);
          this.noise(0.12, 0.04, 0.025, 3000);
          break;
        case "poison":
          this.tone(180, 0.12, "triangle", 0, 0.04, 110);
          this.tone(230, 0.08, "sine", 0.08, 0.032, 180);
          this.noise(0.16, 0, 0.03, 450);
          break;
        case "shadow":
        case "drain":
          this.tone(320, 0.12, "sawtooth", 0, 0.05, 80);
          this.noise(0.14, 0.02, 0.04, 900);
          break;
        case "heal":
          this.chord([523, 659, 784, 1046], 0.18, "sine", 0.04);
          break;
        case "shield":
          this.tone(230, 0.08, "triangle", 0, 0.05, 430);
          this.tone(430, 0.12, "sine", 0.04, 0.045, 430);
          break;
        case "enemy":
        case "boss":
          this.noise(type === "boss" ? 0.28 : 0.14, 0, type === "boss" ? 0.08 : 0.05, type === "boss" ? 420 : 700);
          this.tone(type === "boss" ? 78 : 140, type === "boss" ? 0.28 : 0.14, "sawtooth", 0, type === "boss" ? 0.08 : 0.05, 45);
          break;
        case "victory":
          [523, 659, 784, 1046].forEach((freq, i) => this.tone(freq, 0.14, "triangle", i * 0.08, 0.055));
          break;
        case "chest":
          [740, 980, 1230].forEach((freq, i) => this.tone(freq, 0.12, "sine", i * 0.07, 0.045));
          this.noise(0.18, 0.12, 0.025, 3000);
          break;
        case "fail":
          this.tone(210, 0.18, "triangle", 0, 0.055, 130);
          this.tone(130, 0.22, "sine", 0.12, 0.04, 90);
          break;
        case "pet":
          this.tone(760, 0.08, "triangle", 0, 0.045, 980);
          this.tone(980, 0.08, "triangle", 0.06, 0.04, 760);
          break;
        case "sticker":
          this.chord([650, 900, 1200], 0.12, "triangle", 0.05);
          this.tone(1600, 0.1, "sine", 0.15, 0.045);
          break;
        default:
          this.tone(440, 0.06, "triangle", 0, 0.04);
      }
    },

    startMusic() {
      if (!this.enabled()) return;
      this.unlock(false);
      this.stopMusic();
      this.musicTimer = setInterval(() => {
        if (!this.musicEnabled() || !this.enabled()) return this.stopMusic();
        const bass = [110, 130.81, 146.83, 164.81][this.musicStep % 4];
        const lead = [440, 523.25, 659.25, 587.33][this.musicStep % 4];
        this.tone(bass, 0.26, "triangle", 0, 0.022, bass * 0.5);
        this.tone(lead, 0.18, "sine", 0.04, 0.018);
        this.musicStep += 1;
      }, 780);
    },

    stopMusic() {
      if (this.musicTimer) clearInterval(this.musicTimer);
      this.musicTimer = null;
    }
  };

  window.EMXSound = V9Sound;

  function v9LoadMeta() {
    try {
      const saved = JSON.parse(localStorage.getItem(V9_META_KEY) || "{}");
      return {
        kidMode: Boolean(saved.kidMode),
        stickers: saved.stickers || {},
        stickerWins: saved.stickerWins || 0,
        dojoPlays: saved.dojoPlays || 0,
        soundTests: saved.soundTests || 0,
        funStars: saved.funStars || 0,
        seenTips: saved.seenTips || {}
      };
    } catch (error) {
      return { kidMode: false, stickers: {}, stickerWins: 0, dojoPlays: 0, soundTests: 0, funStars: 0, seenTips: {} };
    }
  }

  function v9SaveMeta() {
    localStorage.setItem(V9_META_KEY, JSON.stringify(v9Meta));
  }

  function v9IsKidMode() {
    return Boolean(v9Meta.kidMode);
  }

  function v9Escape(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function v9PowerSfx(key, power) {
    const label = `${key || ""} ${power?.label || ""} ${power?.animation || ""}`.toLowerCase();
    if (label.includes("meteor")) return "meteor";
    if (label.includes("nova")) return "nova";
    if (label.includes("lightning") || label.includes("thunder") || label.includes("storm")) return "lightning";
    if (label.includes("ice") || label.includes("freeze")) return "ice";
    if (label.includes("poison") || label.includes("spore")) return "poison";
    if (label.includes("shadow") || label.includes("night") || label.includes("drain")) return "shadow";
    if (label.includes("heal") || label.includes("bloom") || label.includes("light")) return "heal";
    if (label.includes("shield") || label.includes("parry") || label.includes("guard")) return "shield";
    if (label.includes("combo")) return "combo";
    if (label.includes("fire") || label.includes("ember") || label.includes("flame")) return "fire";
    return key === "basic" ? "slash" : "attack";
  }

  function v9StickerList() {
    const fromBase = [...V9_STICKER_STARTERS];
    try {
      if (Array.isArray(ENEMIES)) ENEMIES.forEach((e) => fromBase.push({ id: e.id || e.name, name: e.name, icon: e.icon }));
      if (Array.isArray(BOSSES)) BOSSES.forEach((e) => fromBase.push({ id: e.id || e.name, name: e.name, icon: e.icon }));
    } catch (error) {}
    Object.values(v9Meta.stickers || {}).forEach((e) => fromBase.push(e));
    const seen = new Set();
    return fromBase.filter((item) => {
      const id = item.id || item.name;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    });
  }

  function v9GrantSticker(enemy) {
    if (!enemy) return false;
    const id = enemy.id || enemy.name || "mysteryEnemy";
    if (v9Meta.stickers[id]) return false;
    v9Meta.stickers[id] = { id, name: enemy.name || "Mystery Enemy", icon: enemy.icon || "✨", date: Date.now() };
    v9Meta.stickerWins += 1;
    v9Meta.funStars += enemy.isBoss || enemy.v7ZoneFinal ? 4 : enemy.elite || enemy.isMiniBoss ? 2 : 1;
    v9SaveMeta();
    V9Sound.play("sticker");
    v9Toast(`New sticker unlocked: ${enemy.icon || "✨"} ${enemy.name || "Mystery Enemy"}!`);
    return true;
  }

  function v9Toast(message) {
    let toast = document.getElementById("v7Toast") || document.getElementById("v9Toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "v9Toast";
      toast.className = "v7-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(v9Toast._timer);
    v9Toast._timer = setTimeout(() => toast.classList.remove("show"), 2400);
  }

  function v9InstallUI() {
    document.title = "EMX Soul Arena - Sound + Kid Fun";
    const versionChip = document.querySelector(".version-chip");
    if (versionChip) versionChip.textContent = V9_UPDATE_NAME;
    const sub = document.querySelector(".brand-title-card .subtitle");
    if (sub) sub.textContent = "Sound Lab, Kid Mode, Sticker Book, Training Dojo, campaign zones, gear, skins, pets, chests, cinematic combat, HQ upgrades, and multiplayer.";

    const start = $("startScreen");
    if (start && !$("v9StartPanel")) {
      const panel = document.createElement("section");
      panel.id = "v9StartPanel";
      panel.className = "v9-start-panel";
      const heading = start.querySelector(".section-heading");
      start.insertBefore(panel, heading || start.firstChild);
    }

    const footer = document.querySelector(".footer-actions");
    if (footer && !$("v9BattleDock")) {
      const dock = document.createElement("section");
      dock.id = "v9BattleDock";
      dock.className = "v7-battle-dock v9-battle-dock";
      dock.innerHTML = `
        <button data-v9-action="soundLab">🔊 Sound Lab</button>
        <button data-v9-action="dojo">🎮 Dojo</button>
        <button data-v9-action="stickers">📒 Stickers</button>
        <button data-v9-action="toggleKid">${v9IsKidMode() ? "🌟 Kid On" : "🌙 Kid Mode"}</button>
      `;
      footer.insertAdjacentElement("afterend", dock);
    }

    const arena = $("arena");
    if (arena && !$("v9Mascot")) {
      const mascot = document.createElement("section");
      mascot.id = "v9Mascot";
      mascot.className = "v9-mascot";
      mascot.innerHTML = `<div class="v9-mascot-icon">🤖</div><p class="v9-mascot-text">Tip bot ready.</p>`;
      arena.insertAdjacentElement("afterend", mascot);
    }

    if (!$("v9SoundWake")) {
      const wake = document.createElement("button");
      wake.id = "v9SoundWake";
      wake.className = "v9-sound-wake";
      wake.textContent = "🔊 Tap to enable game sounds";
      wake.dataset.v9Action = "unlockSound";
      document.body.appendChild(wake);
    }

    if (!$("v9SoundOverlay")) {
      document.body.insertAdjacentHTML("beforeend", `
        <section id="v9SoundOverlay" class="overlay hidden">
          <div class="modal v9-modal-wide v9-sound-lab">
            <div class="modal-header-row">
              <div>
                <p class="eyebrow">Sound Lab</p>
                <h2>Make Sure Sounds Work</h2>
              </div>
              <button class="close-btn" data-v9-action="closeOverlays">✕</button>
            </div>
            <p class="v9-mini-text">On iPhone, sounds only start after a tap. Press <strong>Unlock + Test</strong>, then try the attack buttons.</p>
            <div class="v9-control-row">
              <button class="v9-pill-btn primary" data-v9-action="unlockSound">🔊 Unlock + Test</button>
              <span id="v9SoundStatus" class="v9-status-pill">Checking...</span>
            </div>
            <div class="v9-control-row">
              <label for="v9Volume">Volume</label>
              <input id="v9Volume" class="v9-slider" type="range" min="0" max="1" step="0.05" value="${V9Sound.volume()}" />
            </div>
            <div class="v9-button-grid">
              <button class="v9-small-btn" data-v9-action="soundOn">🔊 Sound On</button>
              <button class="v9-small-btn" data-v9-action="soundOff">🔇 Mute</button>
              <button class="v9-small-btn" data-v9-action="musicOn">🎵 Music On</button>
              <button class="v9-small-btn" data-v9-action="musicOff">⏹ Music Off</button>
            </div>
            <h3 style="margin-top:16px">Test Attack Sounds</h3>
            <div class="v9-sound-buttons">
              ${V9_DOJO_POWERS.map((p) => `<button class="v9-sound-test-btn" data-v9-sfx="${p.type}">${p.icon} ${p.title}<span>${p.desc}</span></button>`).join("")}
              <button class="v9-sound-test-btn" data-v9-sfx="victory">🏆 Victory<span>Reward jingle</span></button>
              <button class="v9-sound-test-btn" data-v9-sfx="chest">🎁 Chest<span>Loot reveal</span></button>
            </div>
          </div>
        </section>

        <section id="v9DojoOverlay" class="overlay hidden">
          <div class="modal v9-modal-wide v9-kid-card">
            <div class="modal-header-row">
              <div>
                <p class="eyebrow">Training Dojo</p>
                <h2>Power Playground</h2>
              </div>
              <button class="close-btn" data-v9-action="closeOverlays">✕</button>
            </div>
            <p class="v9-mini-text">A kid-friendly practice room. Tap powers to hear sounds, see bursts, and learn what each attack does.</p>
            <div id="v9DojoStage" class="v9-dojo-stage">
              <div class="v9-dojo-target">🎯</div>
              <div id="v9DojoBurst" class="v9-dojo-burst"></div>
            </div>
            <div class="v9-dojo-grid">
              ${V9_DOJO_POWERS.map((p) => `<button class="v9-dojo-power" data-v9-dojo="${p.type}">${p.icon} ${p.title}<span>${p.desc}</span></button>`).join("")}
            </div>
          </div>
        </section>

        <section id="v9StickerOverlay" class="overlay hidden">
          <div class="modal v9-modal-wide v9-kid-card">
            <div class="modal-header-row">
              <div>
                <p class="eyebrow">Sticker Book</p>
                <h2>Enemy Collection</h2>
              </div>
              <button class="close-btn" data-v9-action="closeOverlays">✕</button>
            </div>
            <p class="v9-mini-text">Beat enemies and bosses to collect stickers. This gives younger players a fun collection goal even if a run ends early.</p>
            <div id="v9StickerStats" class="v9-sparkline"></div>
            <div id="v9StickerGrid" class="v9-sticker-grid"></div>
          </div>
        </section>
      `);
    }

    const volume = $("v9Volume");
    if (volume && !volume.dataset.bound) {
      volume.dataset.bound = "true";
      volume.addEventListener("input", (event) => V9Sound.setVolume(event.target.value));
    }

    v9RenderStartPanel();
    v9RenderSoundStatus();
    v9RenderMascot();
    document.body.classList.toggle("v9-kid-active", v9IsKidMode());
  }

  function v9RenderStartPanel() {
    const panel = $("v9StartPanel");
    if (!panel) return;
    const stickerCount = Object.keys(v9Meta.stickers || {}).length;
    panel.innerHTML = `
      <div class="v9-top-strip">
        <div>
          <p class="eyebrow">V9 Update</p>
          <h3>Sound + Kid Fun Center</h3>
        </div>
        <span class="v9-status-pill">${v9IsKidMode() ? "🌟 Kid Mode On" : "🌙 Normal Mode"}</span>
      </div>
      <p class="v9-mini-text">Sound testing, a practice dojo, friendly assist mode, and a sticker book for younger players.</p>
      <div class="v9-sparkline">
        <span title="Sound">${V9Sound.enabled() ? "🔊" : "🔇"}</span>
        <span title="Stickers">📒 ${stickerCount}</span>
        <span title="Fun stars">⭐ ${v9Meta.funStars || 0}</span>
        <span title="Dojo plays">🎮 ${v9Meta.dojoPlays || 0}</span>
      </div>
      <div class="v9-button-grid" style="margin-top:12px">
        <button class="v9-big-btn primary" data-v9-action="soundLab">🔊 Sound Lab</button>
        <button class="v9-big-btn" data-v9-action="dojo">🎮 Training Dojo</button>
        <button class="v9-big-btn" data-v9-action="stickers">📒 Sticker Book</button>
        <button class="v9-big-btn" data-v9-action="toggleKid">${v9IsKidMode() ? "🌟 Kid Mode On" : "🌙 Kid Mode Off"}</button>
      </div>
    `;

    const battleDock = $("v9BattleDock");
    if (battleDock) {
      const kidBtn = battleDock.querySelector('[data-v9-action="toggleKid"]');
      if (kidBtn) kidBtn.textContent = v9IsKidMode() ? "🌟 Kid On" : "🌙 Kid Mode";
    }
  }

  function v9RenderSoundStatus() {
    const status = $("v9SoundStatus");
    if (status) {
      const ctx = V9Sound.ctx;
      const stateText = !V9Sound.enabled() ? "Muted" : V9Sound.unlocked || ctx?.state === "running" ? "Sound Ready" : "Needs Tap";
      status.textContent = `${V9Sound.enabled() ? "🔊" : "🔇"} ${stateText} • Vol ${Math.round(V9Sound.volume() * 100)}%`;
    }
    const wake = $("v9SoundWake");
    if (wake) {
      const ctxReady = V9Sound.unlocked || V9Sound.ctx?.state === "running";
      wake.classList.toggle("hide", !V9Sound.enabled() || ctxReady);
    }
  }

  function v9MascotHint() {
    if (!state) return "Choose a class and start a run. I’ll help with tips.";
    const enemy = state.enemy;
    if (!enemy) return "Pick a zone or start an arena run.";
    if (state.phase === "gameover") return "Good try. Upgrade your gear, use Kid Mode, or practice in the Dojo.";
    if (enemy.isBoss || enemy.v7ZoneFinal) return "Boss tip: shield before big hits, use healing early, and save your ultimate for the last half of the fight.";
    if ((state.player?.hp || 0) < (state.player?.maxHp || 1) * 0.35) return "Careful! Your HP is low. A heal or shield is safer than another attack.";
    if ((state.player?.ult || 0) >= 100) return "Ultimate is ready. Use it when the enemy has high HP or a boss starts pushing back.";
    if (enemy.statuses?.length) return "Nice! Status effects are working. Keep pressure on enemies that are burned, poisoned, stunned, or rooted.";
    if (state.player?.mana < 12) return "Mana is low. Use free basic attacks while mana refills.";
    if (v9IsKidMode()) return "Kid Assist: enemies are softer, rewards are friendlier, and stickers unlock from wins.";
    return "Build combo, pick upgrades, and try to collect a new sticker each run.";
  }

  function v9RenderMascot() {
    const mascot = $("v9Mascot");
    if (!mascot) return;
    const hint = v9MascotHint();
    if (hint !== v9LastHint) v9LastHint = hint;
    mascot.querySelector(".v9-mascot-text").textContent = hint;
  }

  function v9OpenOverlay(id) {
    ["v9SoundOverlay", "v9DojoOverlay", "v9StickerOverlay"].forEach((name) => $(name)?.classList.add("hidden"));
    $(id)?.classList.remove("hidden");
    if (id === "v9StickerOverlay") v9RenderStickers();
    if (id === "v9SoundOverlay") v9RenderSoundStatus();
  }

  function v9CloseOverlays() {
    ["v9SoundOverlay", "v9DojoOverlay", "v9StickerOverlay"].forEach((name) => $(name)?.classList.add("hidden"));
  }

  function v9RenderStickers() {
    const grid = $("v9StickerGrid");
    const stats = $("v9StickerStats");
    if (!grid || !stats) return;
    const list = v9StickerList();
    const owned = Object.keys(v9Meta.stickers || {}).length;
    stats.innerHTML = `<span>📒 ${owned}/${list.length}</span><span>⭐ ${v9Meta.funStars || 0}</span><span>🏆 ${v9Meta.stickerWins || 0}</span>`;
    grid.innerHTML = list.map((item) => {
      const unlocked = Boolean(v9Meta.stickers?.[item.id]);
      return `
        <div class="v9-sticker-card ${unlocked ? "" : "locked"}">
          <div class="v9-sticker-icon">${unlocked ? v9Escape(item.icon || "✨") : "❔"}</div>
          <strong>${unlocked ? v9Escape(item.name || "Sticker") : "Locked Sticker"}</strong>
          <small>${unlocked ? "Collected" : "Win battles to discover"}</small>
        </div>
      `;
    }).join("");
  }

  function v9ToggleKidMode() {
    v9Meta.kidMode = !v9Meta.kidMode;
    v9SaveMeta();
    document.body.classList.toggle("v9-kid-active", v9IsKidMode());
    v9Toast(v9IsKidMode() ? "Kid Mode enabled: easier fights + friendlier rewards." : "Kid Mode off: normal challenge restored.");
    V9Sound.play(v9IsKidMode() ? "upgrade" : "tap");
    if (state && v9IsKidMode()) {
      state.player.shield = (state.player.shield || 0) + 15;
      state.player.mana = clamp((state.player.mana || 0) + 12, 0, state.player.maxMana || 999);
      addLog("Kid Assist gave +15 shield and +12 mana.");
      render();
      saveGame();
    }
    v9RenderStartPanel();
    v9RenderMascot();
  }

  function v9PlayDojo(type) {
    V9Sound.play(type);
    v9Meta.dojoPlays += 1;
    v9Meta.funStars += 1;
    v9SaveMeta();
    const stage = $("v9DojoStage");
    const burst = $("v9DojoBurst");
    const target = stage?.querySelector(".v9-dojo-target");
    if (target) target.textContent = V9_DOJO_POWERS.find((p) => p.type === type)?.icon || "✨";
    if (burst) {
      const colors = {
        fire: "radial-gradient(circle, #fff176, #ff4d00 65%, transparent 70%)",
        lightning: "radial-gradient(circle, #ffffff, #6ecbff 65%, transparent 70%)",
        ice: "radial-gradient(circle, #e8fbff, #7bdcff 65%, transparent 70%)",
        poison: "radial-gradient(circle, #eaffad, #58ff75 65%, transparent 70%)",
        shadow: "radial-gradient(circle, #d98cff, #25103f 65%, transparent 70%)",
        heal: "radial-gradient(circle, #ffffff, #5ee6a7 65%, transparent 70%)",
        shield: "radial-gradient(circle, #ffffff, #8ccfff 65%, transparent 70%)",
        meteor: "radial-gradient(circle, #fff176, #ff3b3b 65%, transparent 70%)"
      };
      burst.style.background = colors[type] || colors.fire;
    }
    if (stage) {
      stage.classList.remove("cast");
      void stage.offsetWidth;
      stage.classList.add("cast");
      setTimeout(() => stage.classList.remove("cast"), 700);
    }
    v9RenderStartPanel();
  }

  function v9Confetti(count = 26) {
    const wrap = document.createElement("div");
    wrap.className = "v9-confetti";
    for (let i = 0; i < count; i++) {
      const bit = document.createElement("i");
      bit.style.left = `${Math.random() * 100}%`;
      bit.style.animationDelay = `${Math.random() * 0.28}s`;
      bit.style.transform = `rotate(${Math.random() * 180}deg)`;
      wrap.appendChild(bit);
    }
    document.body.appendChild(wrap);
    setTimeout(() => wrap.remove(), 1900);
  }

  function v9WireEvents() {
    if (v9WireEvents.wired) return;
    v9WireEvents.wired = true;

    document.addEventListener("pointerdown", () => V9Sound.unlock(false), { passive: true });
    document.addEventListener("touchstart", () => V9Sound.unlock(false), { passive: true });

    document.addEventListener("click", (event) => {
      const actionEl = event.target.closest("[data-v9-action]");
      const sfxEl = event.target.closest("[data-v9-sfx]");
      const dojoEl = event.target.closest("[data-v9-dojo]");
      if (actionEl || sfxEl || dojoEl || event.target.closest("button, a")) V9Sound.play("tap");

      if (sfxEl) {
        v9Meta.soundTests += 1;
        v9Meta.funStars += 1;
        v9SaveMeta();
        V9Sound.play(sfxEl.dataset.v9Sfx);
        v9RenderStartPanel();
      }

      if (dojoEl) v9PlayDojo(dojoEl.dataset.v9Dojo);

      if (!actionEl) return;
      const action = actionEl.dataset.v9Action;
      if (action === "soundLab") v9OpenOverlay("v9SoundOverlay");
      if (action === "dojo") v9OpenOverlay("v9DojoOverlay");
      if (action === "stickers") v9OpenOverlay("v9StickerOverlay");
      if (action === "closeOverlays") v9CloseOverlays();
      if (action === "toggleKid") v9ToggleKidMode();
      if (action === "unlockSound") V9Sound.unlock(true).then(() => { V9Sound.play("victory"); v9RenderSoundStatus(); });
      if (action === "soundOn") V9Sound.setSound(true);
      if (action === "soundOff") V9Sound.setSound(false);
      if (action === "musicOn") V9Sound.setMusic(true);
      if (action === "musicOff") V9Sound.setMusic(false);
    });
  }

  function v9PatchGame() {
    if (v9PatchGame.done) return;
    v9PatchGame.done = true;

    const oldCreateEnemy = createEnemy;
    createEnemy = function v9CreateEnemyPatched(wave) {
      const enemy = oldCreateEnemy(wave);
      if (v9IsKidMode() && enemy) {
        const hpDrop = enemy.isBoss || enemy.v7ZoneFinal ? 0.78 : enemy.isMiniBoss || enemy.elite ? 0.86 : 0.9;
        const atkDrop = enemy.isBoss || enemy.v7ZoneFinal ? 0.72 : 0.78;
        enemy.hp = Math.max(12, Math.round(enemy.hp * hpDrop));
        enemy.maxHp = Math.max(12, Math.round(enemy.maxHp * hpDrop));
        enemy.attack = Math.max(3, Math.round(enemy.attack * atkDrop));
        enemy.defense = Math.max(0, Math.round((enemy.defense || 0) * 0.86));
        enemy.v9KidSoftened = true;
      }
      return enemy;
    };

    const oldStartFight = startFight;
    startFight = function v9StartFightPatched() {
      oldStartFight();
      if (state && v9IsKidMode()) {
        state.player.shield = (state.player.shield || 0) + (state.enemy?.isBoss || state.enemy?.v7ZoneFinal ? 30 : 14);
        state.player.mana = clamp((state.player.mana || 0) + 8, 0, state.player.maxMana || 999);
        addLog("Kid Assist is active: bonus shield and easier enemies.");
      }
      v9RenderMascot();
      render();
    };

    const oldDamagePlayer = damagePlayer;
    damagePlayer = function v9DamagePlayerPatched(amount) {
      const softened = v9IsKidMode() ? Math.max(1, Math.round(amount * 0.78)) : amount;
      return oldDamagePlayer(softened);
    };

    const oldCalculatePlayerDamage = calculatePlayerDamage;
    calculatePlayerDamage = function v9CalculatePlayerDamagePatched(key, power) {
      const result = oldCalculatePlayerDamage(key, power);
      if (v9IsKidMode() && result?.damage) result.damage = Math.max(1, Math.round(result.damage * 1.12));
      return result;
    };

    const oldUsePower = usePower;
    usePower = async function v9UsePowerPatched(key) {
      const power = state ? getPower(key) : null;
      const canAct = state && state.phase === "player" && power && state.player.mana >= (power.cost || 0) && (!power.ultCost || state.player.ult >= power.ultCost);
      if (canAct) V9Sound.play(v9PowerSfx(key, power));
      const result = await oldUsePower(key);
      v9RenderMascot();
      return result;
    };

    const oldPlayEnemyAnimation = playEnemyAnimation;
    playEnemyAnimation = async function v9PlayEnemyAnimationPatched(big = false) {
      V9Sound.play(big || state?.enemy?.isBoss ? "boss" : "enemy");
      return oldPlayEnemyAnimation(big);
    };

    const oldWinFight = winFight;
    winFight = function v9WinFightPatched() {
      const defeatedEnemy = state?.enemy ? { ...state.enemy } : null;
      oldWinFight();
      if (!state || state.phase === "gameover") return;
      V9Sound.play("victory");
      v9Confetti(defeatedEnemy?.isBoss || defeatedEnemy?.v7ZoneFinal ? 42 : 22);
      const stickerUnlocked = v9GrantSticker(defeatedEnemy);
      if (v9IsKidMode()) {
        const bonusCoins = defeatedEnemy?.isBoss || defeatedEnemy?.v7ZoneFinal ? 24 : 8;
        state.coins = (state.coins || 0) + bonusCoins;
        state.player.hp = clamp((state.player.hp || 0) + Math.round((state.player.maxHp || 100) * 0.08), 0, state.player.maxHp || 100);
        addLog(`Kid Assist reward: +${bonusCoins} coins${stickerUnlocked ? " and a new sticker" : ""}.`);
      }
      v9RenderStartPanel();
      v9RenderMascot();
      saveGame();
    };

    const oldChooseUpgrade = chooseUpgrade;
    chooseUpgrade = function v9ChooseUpgradePatched(id) {
      V9Sound.play("upgrade");
      const result = oldChooseUpgrade(id);
      v9Meta.funStars += 1;
      v9SaveMeta();
      v9RenderStartPanel();
      return result;
    };

    if (typeof buyShopItem === "function") {
      const oldBuyShopItem = buyShopItem;
      buyShopItem = function v9BuyShopItemPatched(id) {
        const before = state?.coins || 0;
        const result = oldBuyShopItem(id);
        if ((state?.coins || 0) < before) V9Sound.play("coin");
        return result;
      };
    }

    const oldGameOver = gameOver;
    gameOver = function v9GameOverPatched() {
      V9Sound.play("fail");
      const result = oldGameOver();
      const title = $("gameOverTitle");
      if (title && v9IsKidMode()) title.textContent = "You got knocked out — try again!";
      v9RenderMascot();
      return result;
    };

    const oldRender = render;
    render = function v9RenderPatched() {
      oldRender();
      const versionChip = document.querySelector(".version-chip");
      if (versionChip) versionChip.textContent = V9_UPDATE_NAME;
      document.body.classList.toggle("v9-kid-active", v9IsKidMode());
      v9RenderStartPanel();
      v9RenderSoundStatus();
      v9RenderMascot();
    };
  }

  v9InstallUI();
  v9WireEvents();
  v9PatchGame();
  v9SaveMeta();

  setTimeout(() => {
    v9InstallUI();
    v9RenderStartPanel();
    v9RenderSoundStatus();
    if (state) render();
  }, 300);
})();
