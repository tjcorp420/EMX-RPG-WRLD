const SAVE_KEY = "emxSoulArenaSave_v2";
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

wireEvents();
updateContinueButton();
initBoot();
