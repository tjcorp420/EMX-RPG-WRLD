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
