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
