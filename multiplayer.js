import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get, set, update, onValue, onDisconnect, runTransaction, remove } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { firebaseConfig, hasFirebaseConfig } from "./firebase-config.js";

const $ = (id) => document.getElementById(id);
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ROOM_LIMIT = 2;
const MAX_LOGS = 12;
const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

const CLASS_DATA = {
  flame: {
    name: "Flame Mage",
    icon: "🧙‍♂️",
    hp: 112,
    mana: 92,
    powers: {
      basic: { icon: "🔥", label: "Ember Cut", desc: "Free fire hit.", cost: 0, damage: 18, crit: 0.12, fx: "fire" },
      special: { icon: "☄️", label: "Fireball", desc: "Burn chance.", cost: 13, damage: 34, crit: 0.1, fx: "fire", status: { type: "burn", chance: 0.65, turns: 3, damage: 7 } },
      guard: { icon: "🛡️", label: "Flame Guard", desc: "Shield + burn aura.", cost: 10, shield: 32, fx: "shield", selfStatus: { type: "flameGuard", turns: 2 } },
      heal: { icon: "✨", label: "Warm Light", desc: "Restore HP.", cost: 16, heal: 34, fx: "heal" },
      ultimate: { icon: "🌋", label: "Inferno Meteor", desc: "Huge burn nuke.", cost: 0, ultCost: 100, damage: 82, crit: 0.18, fx: "meteor", status: { type: "burn", chance: 1, turns: 4, damage: 10 } }
    }
  },
  rogue: {
    name: "Shadow Rogue",
    icon: "🥷",
    hp: 104,
    mana: 78,
    powers: {
      basic: { icon: "🗡️", label: "Backstab", desc: "High crit hit.", cost: 0, damage: 19, crit: 0.34, fx: "shadow", status: { type: "bleed", chance: 0.28, turns: 3, damage: 5 } },
      special: { icon: "☠️", label: "Poison Blade", desc: "Poison pressure.", cost: 11, damage: 26, crit: 0.22, fx: "poison", status: { type: "poison", chance: 0.85, turns: 4, damage: 6 } },
      guard: { icon: "💨", label: "Smoke Bomb", desc: "Shield + dodge.", cost: 10, shield: 24, fx: "shadow", selfStatus: { type: "dodge", turns: 1 } },
      heal: { icon: "🩹", label: "Patch Up", desc: "Quick heal.", cost: 13, heal: 29, fx: "heal" },
      ultimate: { icon: "🌑", label: "Nightfall Combo", desc: "Four fast strikes.", cost: 0, ultCost: 100, damage: 25, hits: 4, crit: 0.42, fx: "combo", status: { type: "bleed", chance: 0.6, turns: 3, damage: 6 } }
    }
  },
  storm: {
    name: "Storm Knight",
    icon: "⚔️",
    hp: 128,
    mana: 78,
    powers: {
      basic: { icon: "⚔️", label: "Sword Slash", desc: "Reliable strike.", cost: 0, damage: 22, crit: 0.13, fx: "slash" },
      special: { icon: "⚡", label: "Thunder Strike", desc: "Stun chance.", cost: 14, damage: 32, crit: 0.13, fx: "lightning", status: { type: "stun", chance: 0.3, turns: 1 } },
      guard: { icon: "🛡️", label: "Parry", desc: "Large shield.", cost: 9, shield: 42, fx: "shield", selfStatus: { type: "parry", turns: 1 } },
      heal: { icon: "📣", label: "Rally", desc: "Heal + shield.", cost: 15, heal: 25, shield: 16, fx: "heal" },
      ultimate: { icon: "🌩️", label: "Stormbreaker", desc: "Stunning finisher.", cost: 0, ultCost: 100, damage: 88, crit: 0.14, fx: "lightning", status: { type: "stun", chance: 0.82, turns: 1 } }
    }
  },
  nature: {
    name: "Nature Healer",
    icon: "🧝",
    hp: 120,
    mana: 88,
    powers: {
      basic: { icon: "🌿", label: "Vine Whip", desc: "Can root.", cost: 0, damage: 17, crit: 0.1, fx: "poison", status: { type: "root", chance: 0.24, turns: 1 } },
      special: { icon: "🍄", label: "Poison Spores", desc: "Strong DOT.", cost: 11, damage: 23, crit: 0.1, fx: "poison", status: { type: "poison", chance: 0.9, turns: 4, damage: 7 } },
      guard: { icon: "🌳", label: "Barkskin", desc: "Shield + regen.", cost: 9, shield: 34, fx: "shield", selfStatus: { type: "regen", turns: 3, damage: 7 } },
      heal: { icon: "🌸", label: "Bloom Heal", desc: "Strong heal.", cost: 17, heal: 46, fx: "heal" },
      ultimate: { icon: "🌺", label: "Bloom Nova", desc: "Heal, shield, poison.", cost: 0, ultCost: 100, damage: 58, heal: 48, shield: 24, crit: 0.12, fx: "heal", status: { type: "poison", chance: 1, turns: 4, damage: 9 } }
    }
  }
};

const COOP_BOSSES = [
  { name: "Neon Goblin King", icon: "🤴", hp: 420, attack: 22, defense: 4, status: { type: "bleed", chance: 0.18, turns: 2, damage: 5 } },
  { name: "Cyber Bone Dragon", icon: "🐉", hp: 520, attack: 26, defense: 5, status: { type: "poison", chance: 0.25, turns: 3, damage: 6 } },
  { name: "Void Tuning Beast", icon: "👁️", hp: 600, attack: 29, defense: 6, status: { type: "stun", chance: 0.16, turns: 1 } }
];

const STATUS_LABELS = {
  burn: "Burn",
  poison: "Poison",
  bleed: "Bleed",
  stun: "Stun",
  root: "Root",
  freeze: "Freeze",
  dodge: "Dodge",
  parry: "Parry",
  regen: "Regen",
  flameGuard: "Flame Guard"
};

const STATUS_ICONS = {
  burn: "🔥",
  poison: "☠️",
  bleed: "🩸",
  stun: "💫",
  root: "🌿",
  freeze: "❄️",
  dodge: "💨",
  parry: "🛡️",
  regen: "💚",
  flameGuard: "🔥"
};

let app = null;
let auth = null;
let db = null;
let uid = null;
let selectedClass = localStorage.getItem("emxMultiplayerClass") || "flame";
let currentRoomCode = null;
let currentRoomData = null;
let currentRoomRef = null;
let unsubscribeRoom = null;
let lastActionSeq = 0;
let busy = false;

function sanitizeName(raw) {
  const clean = String(raw || "").replace(/[^a-zA-Z0-9 _.-]/g, "").trim();
  return clean.slice(0, 18) || "Player";
}

function makeRoomCode() {
  let code = "";
  for (let i = 0; i < 6; i++) code += ROOM_CODE_CHARS[rand(0, ROOM_CODE_CHARS.length - 1)];
  return code;
}

function statusLabel(type) {
  return STATUS_LABELS[type] || type;
}

function statusIcon(type) {
  return STATUS_ICONS[type] || "✨";
}

function getPlayerName() {
  return sanitizeName($("playerNameInput").value || localStorage.getItem("emxMultiplayerName"));
}

function setSetupStatus(message) {
  $("setupStatus").textContent = message;
}

function setLobbyStatus(message) {
  $("lobbyStatus").textContent = message;
}

function setConnection(online, label) {
  const badge = $("connectionBadge");
  badge.classList.toggle("online", online);
  badge.classList.toggle("offline", !online);
  badge.textContent = label || (online ? "Online" : "Offline");
}

function classBase(classKey) {
  return CLASS_DATA[classKey] || CLASS_DATA.flame;
}

function makePlayer() {
  const base = classBase(selectedClass);
  const name = getPlayerName();
  localStorage.setItem("emxMultiplayerName", name);
  localStorage.setItem("emxMultiplayerClass", selectedClass);
  return {
    uid,
    name,
    classKey: selectedClass,
    icon: base.icon,
    hp: base.hp,
    maxHp: base.hp,
    mana: base.mana,
    maxMana: base.mana,
    ult: 0,
    maxUlt: 100,
    shield: 0,
    statuses: [],
    ready: false,
    connected: true,
    lastSeen: Date.now()
  };
}

function resetPlayerForBattle(player) {
  const base = classBase(player.classKey);
  player.icon = base.icon;
  player.hp = base.hp;
  player.maxHp = base.hp;
  player.mana = base.mana;
  player.maxMana = base.mana;
  player.ult = 0;
  player.maxUlt = 100;
  player.shield = 0;
  player.statuses = [];
  return player;
}

function makeCoopBoss(level = 1) {
  const base = COOP_BOSSES[(level - 1) % COOP_BOSSES.length];
  const scale = 1 + (level - 1) * 0.18;
  return {
    name: base.name,
    icon: base.icon,
    hp: Math.round(base.hp * scale),
    maxHp: Math.round(base.hp * scale),
    attack: Math.round(base.attack * scale),
    defense: Math.round(base.defense * scale),
    shield: 0,
    statuses: [],
    status: base.status,
    turn: 0
  };
}

function roomPlayers(room) {
  return Object.values(room?.players || {}).filter((player) => player && player.uid);
}

function roomPlayerIds(room) {
  return Object.keys(room?.players || {}).filter((id) => room.players[id] && room.players[id].uid);
}

function opponentId(room, myId = uid) {
  return roomPlayerIds(room).find((id) => id !== myId) || null;
}

function nextAlivePlayerId(room, afterId) {
  const ids = roomPlayerIds(room);
  if (!ids.length) return null;
  const start = Math.max(0, ids.indexOf(afterId));
  for (let step = 1; step <= ids.length; step++) {
    const id = ids[(start + step) % ids.length];
    const player = room.players[id];
    if (player && player.hp > 0) return id;
  }
  return null;
}

function allPlayersDead(room) {
  return roomPlayers(room).every((player) => player.hp <= 0);
}

function addRoomLog(room, message) {
  const logs = Array.isArray(room.logs) ? room.logs : [];
  room.logs = [message, ...logs].slice(0, MAX_LOGS);
}

function addStatus(target, status, room, targetName) {
  target.statuses = Array.isArray(target.statuses) ? target.statuses : [];
  const existing = target.statuses.find((item) => item.type === status.type);
  const fresh = {
    type: status.type,
    turns: status.turns || 1,
    damage: status.damage || 0
  };
  if (existing) {
    existing.turns = Math.max(existing.turns || 0, fresh.turns);
    existing.damage = Math.max(existing.damage || 0, fresh.damage || 0);
  } else {
    target.statuses.push(fresh);
  }
  addRoomLog(room, `${targetName} gained ${statusLabel(status.type)}.`);
}

function hasStatus(target, type) {
  return Array.isArray(target.statuses) && target.statuses.some((status) => status.type === type && status.turns > 0);
}

function tickStatuses(entity, room, entityName) {
  entity.statuses = Array.isArray(entity.statuses) ? entity.statuses : [];
  let skipTurn = false;

  for (const status of entity.statuses) {
    if (["burn", "poison", "bleed"].includes(status.type)) {
      const damage = Math.max(1, status.damage || 1);
      entity.hp = clamp((entity.hp || 0) - damage, 0, entity.maxHp || 1);
      addRoomLog(room, `${entityName} took ${damage} ${statusLabel(status.type)} damage.`);
    }

    if (status.type === "regen") {
      const heal = Math.max(1, status.damage || 1);
      entity.hp = clamp((entity.hp || 0) + heal, 0, entity.maxHp || 1);
      addRoomLog(room, `${entityName} regenerated ${heal} HP.`);
    }

    if (["stun", "root", "freeze"].includes(status.type)) {
      skipTurn = true;
    }

    status.turns -= 1;
  }

  entity.statuses = entity.statuses.filter((status) => status.turns > 0);
  return skipTurn;
}

function dealDamage(attacker, target, rawDamage, critChance, room, attackerName, targetName) {
  let amount = Math.round(rawDamage * (Math.random() * 0.18 + 0.91));
  const crit = Math.random() < (critChance || 0);
  if (crit) amount = Math.round(amount * 1.75);

  const defense = Math.round((target.defense || 0) * 0.45);
  amount = Math.max(1, amount - defense);

  let blocked = 0;
  if ((target.shield || 0) > 0) {
    blocked = Math.min(target.shield, amount);
    target.shield -= blocked;
    amount -= blocked;
  }

  target.hp = clamp((target.hp || 0) - amount, 0, target.maxHp || 1);

  if (crit) addRoomLog(room, `${attackerName} landed a CRIT!`);
  if (blocked > 0) addRoomLog(room, `${targetName}'s shield blocked ${blocked}.`);
  addRoomLog(room, `${attackerName} hit ${targetName} for ${amount} damage.`);

  return amount;
}

function healEntity(entity, amount, room, name) {
  const oldHp = entity.hp || 0;
  entity.hp = clamp(oldHp + amount, 0, entity.maxHp || 1);
  const healed = entity.hp - oldHp;
  if (healed > 0) addRoomLog(room, `${name} healed ${healed} HP.`);
  return healed;
}

function applyPower(room, actor, target, powerKey, targetName) {
  const actorName = actor.name || "Player";
  const classData = classBase(actor.classKey);
  const power = classData.powers[powerKey];
  if (!power) return { ok: false, reason: "Unknown power." };

  actor.mana = clamp((actor.mana || 0) + 8, 0, actor.maxMana || 1);

  if ((actor.mana || 0) < (power.cost || 0)) return { ok: false, reason: "Not enough mana." };
  if (power.ultCost && (actor.ult || 0) < power.ultCost) return { ok: false, reason: "Ultimate is not ready." };

  actor.mana -= power.cost || 0;
  if (power.ultCost) actor.ult -= power.ultCost;

  addRoomLog(room, `${actorName} used ${power.label}.`);

  const hits = power.hits || 1;
  let totalDamage = 0;

  for (let i = 0; i < hits; i++) {
    if (power.damage) totalDamage += dealDamage(actor, target, power.damage, power.crit || 0, room, actorName, targetName);
  }

  if (power.heal) healEntity(actor, power.heal, room, actorName);

  if (power.shield) {
    actor.shield = (actor.shield || 0) + power.shield;
    addRoomLog(room, `${actorName} gained ${power.shield} shield.`);
  }

  if (power.selfStatus) addStatus(actor, power.selfStatus, room, actorName);

  if (power.status && Math.random() < (power.status.chance || 1)) {
    addStatus(target, power.status, room, targetName);
  }

  actor.ult = clamp((actor.ult || 0) + (power.ultCost ? 0 : 18), 0, actor.maxUlt || 100);

  return { ok: true, power, totalDamage };
}

function bossRetaliates(room, boss, target) {
  if (!boss || boss.hp <= 0 || !target || target.hp <= 0) return;
  boss.turn = (boss.turn || 0) + 1;
  const bossName = boss.name || "Boss";
  let damage = boss.attack || 20;
  if (boss.turn % 3 === 0) {
    damage += 10;
    addRoomLog(room, `${bossName} charged a heavy strike!`);
  }

  if (hasStatus(target, "dodge") && Math.random() < 0.6) {
    addRoomLog(room, `${target.name} dodged ${bossName}'s attack.`);
    return;
  }

  let blocked = 0;
  if ((target.shield || 0) > 0) {
    blocked = Math.min(target.shield, damage);
    target.shield -= blocked;
    damage -= blocked;
  }

  target.hp = clamp((target.hp || 0) - damage, 0, target.maxHp || 1);
  addRoomLog(room, `${bossName} hit ${target.name} for ${damage} damage.`);
  if (blocked > 0) addRoomLog(room, `${target.name}'s shield blocked ${blocked}.`);

  if (boss.status && Math.random() < (boss.status.chance || 0)) {
    addStatus(target, boss.status, room, target.name);
  }
}

function finishRoom(room, winner, message) {
  room.status = "finished";
  room.winner = winner;
  room.currentTurn = "";
  addRoomLog(room, message);
}

function randomAliveTurn(room) {
  const ids = roomPlayerIds(room).filter((id) => room.players[id].hp > 0);
  return ids.length ? ids[rand(0, ids.length - 1)] : "";
}

async function ensureUniqueRoomCode() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = makeRoomCode();
    const snapshot = await get(ref(db, `rooms/${code}`));
    if (!snapshot.exists()) return code;
  }
  throw new Error("Could not create a unique room code. Try again.");
}

async function createRoom(mode) {
  if (!uid || !db || busy) return;
  busy = true;
  try {
    const code = await ensureUniqueRoomCode();
    const player = makePlayer();
    const room = {
      code,
      mode,
      status: "lobby",
      hostUid: uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      currentTurn: "",
      turnNumber: 0,
      actionSeq: 0,
      winner: "",
      players: { [uid]: player },
      logs: [`${player.name} created a ${mode === "coop" ? "co-op boss" : "duel"} room.`]
    };
    await set(ref(db, `rooms/${code}`), room);
    enterRoom(code);
  } catch (error) {
    setSetupStatus(error.message || "Could not create room.");
  } finally {
    busy = false;
  }
}

async function joinRoom(codeRaw) {
  if (!uid || !db || busy) return;
  const code = String(codeRaw || $("roomCodeInput").value || "").trim().toUpperCase();
  if (code.length < 4) {
    setSetupStatus("Enter a valid room code.");
    return;
  }

  busy = true;
  try {
    const roomSnapshot = await get(ref(db, `rooms/${code}`));
    if (!roomSnapshot.exists()) throw new Error("Room not found.");
    const room = roomSnapshot.val();
    const ids = roomPlayerIds(room);
    const alreadyInRoom = ids.includes(uid);
    if (!alreadyInRoom && ids.length >= ROOM_LIMIT) throw new Error("That room is full.");
    if (!alreadyInRoom && room.status !== "lobby") throw new Error("That battle already started.");

    const player = makePlayer();
    await update(ref(db, `rooms/${code}/players/${uid}`), player);
    await update(ref(db, `rooms/${code}`), { updatedAt: Date.now() });
    enterRoom(code);
  } catch (error) {
    setSetupStatus(error.message || "Could not join room.");
  } finally {
    busy = false;
  }
}

async function enterRoom(code) {
  currentRoomCode = code;
  currentRoomRef = ref(db, `rooms/${code}`);
  lastActionSeq = 0;

  if (unsubscribeRoom) unsubscribeRoom();
  unsubscribeRoom = onValue(currentRoomRef, (snapshot) => {
    currentRoomData = snapshot.val();
    renderRoom();
  });

  onDisconnect(ref(db, `rooms/${code}/players/${uid}/connected`)).set(false);
  onDisconnect(ref(db, `rooms/${code}/players/${uid}/lastSeen`)).set(Date.now());

  await update(ref(db, `rooms/${code}/players/${uid}`), { connected: true, lastSeen: Date.now() });

  $("setupPanel").classList.add("hidden");
  $("lobbyPanel").classList.remove("hidden");
  $("battlePanel").classList.add("hidden");
}

async function leaveRoom() {
  if (!currentRoomCode || !db) return;
  const code = currentRoomCode;
  try {
    const room = currentRoomData;
    if (room?.status === "lobby") {
      await remove(ref(db, `rooms/${code}/players/${uid}`));
      const latest = await get(ref(db, `rooms/${code}/players`));
      if (!latest.exists() || Object.keys(latest.val() || {}).length === 0) await remove(ref(db, `rooms/${code}`));
    } else {
      await update(ref(db, `rooms/${code}/players/${uid}`), { connected: false, ready: false, lastSeen: Date.now() });
    }
  } catch (error) {
    // Still leave locally.
  }

  if (unsubscribeRoom) unsubscribeRoom();
  unsubscribeRoom = null;
  currentRoomCode = null;
  currentRoomData = null;
  currentRoomRef = null;
  $("setupPanel").classList.remove("hidden");
  $("lobbyPanel").classList.add("hidden");
  $("battlePanel").classList.add("hidden");
}

async function toggleReady() {
  if (!currentRoomCode || !currentRoomData || busy) return;
  busy = true;
  try {
    const me = currentRoomData.players?.[uid];
    const nextReady = !me?.ready;
    const player = { ...makePlayer(), ready: nextReady };
    await update(ref(db, `rooms/${currentRoomCode}/players/${uid}`), player);
    await tryStartBattle();
  } finally {
    busy = false;
  }
}

async function tryStartBattle() {
  if (!currentRoomRef) return;
  await runTransaction(currentRoomRef, (room) => {
    if (!room || room.status !== "lobby") return room;
    const ids = roomPlayerIds(room);
    if (ids.length < ROOM_LIMIT) return room;
    if (!ids.every((id) => room.players[id]?.ready)) return room;

    ids.forEach((id) => {
      room.players[id] = resetPlayerForBattle(room.players[id]);
    });

    room.status = "battle";
    room.turnNumber = 1;
    room.currentTurn = ids[rand(0, ids.length - 1)];
    room.updatedAt = Date.now();
    room.actionSeq = (room.actionSeq || 0) + 1;
    room.winner = "";
    room.logs = [];

    if (room.mode === "coop") {
      room.boss = makeCoopBoss(1);
      addRoomLog(room, `Co-op raid started against ${room.boss.name}.`);
    } else {
      room.boss = null;
      addRoomLog(room, "Online duel started.");
    }

    addRoomLog(room, `${room.players[room.currentTurn].name}'s turn.`);
    room.lastFx = { type: "start", label: "Battle Start", at: Date.now(), by: room.currentTurn };
    return room;
  });
}

async function usePower(powerKey) {
  if (!currentRoomRef || !currentRoomData || busy) return;
  if (currentRoomData.currentTurn !== uid || currentRoomData.status !== "battle") return;
  busy = true;

  const localPower = classBase(currentRoomData.players?.[uid]?.classKey).powers[powerKey];
  if (localPower) playFx(localPower.fx || "slash", localPower.label);

  try {
    await runTransaction(currentRoomRef, (room) => {
      if (!room || room.status !== "battle" || room.currentTurn !== uid) return room;
      const me = room.players?.[uid];
      if (!me || me.hp <= 0) return room;

      const meName = me.name || "Player";
      const skipped = tickStatuses(me, room, meName);
      if (me.hp <= 0) {
        if (room.mode === "coop") {
          if (allPlayersDead(room)) finishRoom(room, "boss", `${room.boss?.name || "Boss"} wiped the team.`);
          else room.currentTurn = nextAlivePlayerId(room, uid);
        } else {
          const foe = opponentId(room, uid);
          finishRoom(room, foe || "", `${meName} fell to status damage.`);
        }
        return room;
      }

      if (skipped) {
        addRoomLog(room, `${meName} could not move.`);
        room.currentTurn = room.mode === "coop" ? nextAlivePlayerId(room, uid) : opponentId(room, uid);
        room.turnNumber = (room.turnNumber || 0) + 1;
        room.updatedAt = Date.now();
        return room;
      }

      const targetId = opponentId(room, uid);
      const target = room.mode === "coop" ? room.boss : room.players?.[targetId];
      if (!target) return room;
      const targetName = room.mode === "coop" ? target.name : target.name || "Opponent";

      const result = applyPower(room, me, target, powerKey, targetName);
      if (!result.ok) {
        addRoomLog(room, result.reason || "Power failed.");
        return room;
      }

      if (room.mode === "coop") {
        if (target.hp <= 0) {
          finishRoom(room, "players", `Raid clear! ${target.name} was defeated.`);
        } else {
          bossRetaliates(room, target, me);
          if (allPlayersDead(room)) {
            finishRoom(room, "boss", `${target.name} defeated the team.`);
          } else {
            room.currentTurn = nextAlivePlayerId(room, uid);
            addRoomLog(room, `${room.players[room.currentTurn].name}'s turn.`);
          }
        }
      } else {
        if (target.hp <= 0) {
          finishRoom(room, uid, `${meName} wins the duel!`);
        } else {
          room.currentTurn = targetId;
          addRoomLog(room, `${targetName}'s turn.`);
        }
      }

      room.turnNumber = (room.turnNumber || 0) + 1;
      room.updatedAt = Date.now();
      room.actionSeq = (room.actionSeq || 0) + 1;
      room.lastFx = {
        type: result.power?.fx || "slash",
        label: result.power?.label || "Attack",
        by: uid,
        at: Date.now(),
        damage: result.totalDamage || 0
      };
      return room;
    });
  } finally {
    busy = false;
  }
}

async function rematch() {
  if (!currentRoomRef || !currentRoomData) return;
  await runTransaction(currentRoomRef, (room) => {
    if (!room || room.status !== "finished") return room;
    const ids = roomPlayerIds(room);
    ids.forEach((id) => {
      room.players[id].ready = false;
      resetPlayerForBattle(room.players[id]);
    });
    room.status = "lobby";
    room.currentTurn = "";
    room.winner = "";
    room.logs = ["Rematch lobby opened. Ready up again."];
    room.updatedAt = Date.now();
    return room;
  });
}

function renderClassGrid() {
  const grid = $("mpClassGrid");
  grid.innerHTML = "";

  Object.entries(CLASS_DATA).forEach(([key, data]) => {
    const button = document.createElement("button");
    button.className = `mp-class-card ${key === selectedClass ? "selected" : ""}`;
    button.innerHTML = `
      <span class="mp-class-icon">${data.icon}</span>
      <span><strong>${data.name}</strong><small>${Object.values(data.powers).slice(0, 3).map((power) => power.label).join(" • ")}</small></span>
      <span>${key === selectedClass ? "✓" : ""}</span>
    `;
    button.addEventListener("click", () => {
      selectedClass = key;
      localStorage.setItem("emxMultiplayerClass", selectedClass);
      renderClassGrid();
    });
    grid.appendChild(button);
  });
}

function renderRoom() {
  const room = currentRoomData;
  if (!room) return;

  const inviteUrl = `${location.origin}${location.pathname}?room=${room.code}`;
  $("roomCodeText").textContent = room.code;
  $("roomModeText").textContent = room.mode === "coop" ? "Co-op Raid" : "Duel";
  $("inviteLinkInput").value = inviteUrl;
  $("battleRoomCode").textContent = room.code;

  const isLobby = room.status === "lobby";
  $("lobbyPanel").classList.toggle("hidden", !isLobby);
  $("battlePanel").classList.toggle("hidden", isLobby);
  $("setupPanel").classList.add("hidden");

  if (isLobby) renderLobby(room);
  else renderBattle(room);

  if ((room.actionSeq || 0) > lastActionSeq && room.lastFx) {
    lastActionSeq = room.actionSeq || 0;
    playFx(room.lastFx.type, room.lastFx.label);
  }
}

function renderLobby(room) {
  const list = $("lobbyPlayers");
  const players = roomPlayers(room);
  list.innerHTML = "";

  players.forEach((player) => {
    const data = classBase(player.classKey);
    const chip = document.createElement("div");
    chip.className = "mp-player-chip";
    chip.innerHTML = `
      <span class="icon">${data.icon}</span>
      <span><strong>${player.name || "Player"}${player.uid === room.hostUid ? " 👑" : ""}</strong><small>${data.name}</small></span>
      <span class="mp-badge ${player.ready ? "online" : "offline"}">${player.ready ? "Ready" : "Wait"}</span>
    `;
    list.appendChild(chip);
  });

  const me = room.players?.[uid];
  $("readyBtn").textContent = me?.ready ? "Unready" : "Ready";
  const remaining = Math.max(0, ROOM_LIMIT - players.length);
  if (players.length < ROOM_LIMIT) setLobbyStatus(`Waiting for ${remaining} more player${remaining === 1 ? "" : "s"}...`);
  else if (!players.every((player) => player.ready)) setLobbyStatus("Both players are in. Tap Ready to start.");
  else setLobbyStatus("Starting battle...");
}

function renderBattle(room) {
  const me = room.players?.[uid];
  if (!me) return;

  const target = room.mode === "coop" ? room.boss : room.players?.[opponentId(room, uid)];
  const targetData = room.mode === "coop" ? { name: "Raid Boss", icon: target?.icon || "👹" } : classBase(target?.classKey);
  const meData = classBase(me.classKey);
  const isMyTurn = room.status === "battle" && room.currentTurn === uid;

  $("battleTurnBadge").textContent = room.status === "finished" ? "Finished" : isMyTurn ? "Your Turn" : "Enemy Turn";
  $("mpTurnText").textContent = room.status === "finished" ? finishText(room) : isMyTurn ? "YOUR TURN" : `${turnName(room)}'s turn`;

  $("opponentName").textContent = room.mode === "coop" ? target?.name || "Raid Boss" : target?.name || "Opponent";
  $("opponentMeta").textContent = room.mode === "coop" ? `Co-op Boss • ATK ${target?.attack || 0}` : targetData.name;
  $("opponentSprite").textContent = room.mode === "coop" ? target?.icon || "👹" : targetData.icon;
  setBar("opponentHpFill", target?.hp || 0, target?.maxHp || 1);
  $("opponentHpText").textContent = `HP ${target?.hp || 0}/${target?.maxHp || 0}${target?.shield ? ` • Shield ${target.shield}` : ""}`;
  renderStatuses("opponentStatuses", target?.statuses || []);

  $("myName").textContent = `${me.name || "You"}${me.shield ? ` 🛡️${me.shield}` : ""}`;
  $("myMeta").textContent = meData.name;
  $("mySprite").textContent = meData.icon;
  setBar("myHpFill", me.hp || 0, me.maxHp || 1);
  setBar("myManaFill", me.mana || 0, me.maxMana || 1);
  setBar("myUltFill", me.ult || 0, me.maxUlt || 100);
  $("myHpText").textContent = `HP ${me.hp || 0}/${me.maxHp || 0}${me.shield ? ` • Shield ${me.shield}` : ""}`;
  $("myManaText").textContent = `Mana ${me.mana || 0}/${me.maxMana || 0}`;
  $("myUltText").textContent = `Ultimate ${me.ult || 0}/${me.maxUlt || 100}`;
  renderStatuses("myStatuses", me.statuses || []);

  renderActions(me, isMyTurn && room.status === "battle");
  renderLog(room.logs || []);
}

function finishText(room) {
  if (room.mode === "coop") return room.winner === "players" ? "RAID CLEARED" : "TEAM WIPED";
  if (room.winner === uid) return "YOU WON";
  if (room.winner) return "YOU LOST";
  return "FINISHED";
}

function turnName(room) {
  const player = room.players?.[room.currentTurn];
  if (player) return player.uid === uid ? "Your" : player.name || "Opponent";
  return "Opponent";
}

function renderActions(me, enabled) {
  const actions = $("mpActions");
  actions.innerHTML = "";
  const powers = classBase(me.classKey).powers;

  Object.entries(powers).forEach(([key, power]) => {
    const button = document.createElement("button");
    button.className = `mp-action-btn ${key === "ultimate" ? "ultimate" : ""}`;
    const cost = power.ultCost ? `ULT ${power.ultCost}` : `Mana ${power.cost || 0}`;
    button.innerHTML = `<strong>${power.icon} ${power.label}</strong><small>${power.desc}<br>${cost}</small>`;
    button.disabled = !enabled || (me.mana || 0) < (power.cost || 0) || Boolean(power.ultCost && (me.ult || 0) < power.ultCost);
    button.addEventListener("click", () => usePower(key));
    actions.appendChild(button);
  });

  if (currentRoomData?.status === "finished") {
    const rematchButton = document.createElement("button");
    rematchButton.className = "mp-action-btn ultimate";
    rematchButton.innerHTML = "<strong>🔁 Rematch</strong><small>Return both players to the lobby.</small>";
    rematchButton.addEventListener("click", rematch);
    actions.appendChild(rematchButton);
  }
}

function renderStatuses(id, statuses) {
  const row = $(id);
  row.innerHTML = "";
  statuses.forEach((status) => {
    const badge = document.createElement("span");
    badge.className = "status-badge";
    badge.textContent = `${statusIcon(status.type)} ${status.turns}`;
    row.appendChild(badge);
  });
}

function setBar(id, value, max) {
  const pct = max <= 0 ? 0 : clamp((value / max) * 100, 0, 100);
  $(id).style.width = `${pct}%`;
}

function renderLog(logs) {
  $("mpLog").innerHTML = logs.map((message) => `<p>${escapeHtml(message)}</p>`).join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function playFx(type = "slash", label = "Attack") {
  const arena = $("mpArena");
  const layer = $("mpEffectLayer");
  if (!arena || !layer) return;

  arena.classList.add("mp-shake");
  setTimeout(() => arena.classList.remove("mp-shake"), 460);

  const cinematic = document.createElement("div");
  cinematic.className = `mp-cinematic-card ${fxClass(type)}`;
  cinematic.textContent = label || type;
  layer.appendChild(cinematic);
  setTimeout(() => cinematic.remove(), 920);

  if (["fire", "meteor"].includes(type)) {
    const projectile = document.createElement("div");
    projectile.className = "mp-projectile";
    layer.appendChild(projectile);
    setTimeout(() => projectile.remove(), 700);
  } else if (["lightning"].includes(type)) {
    const bolt = document.createElement("div");
    bolt.className = "mp-bolt";
    bolt.textContent = "⚡";
    layer.appendChild(bolt);
    setTimeout(() => bolt.remove(), 650);
  } else if (["heal"].includes(type)) {
    const ring = document.createElement("div");
    ring.className = "mp-ring";
    layer.appendChild(ring);
    setTimeout(() => ring.remove(), 780);
  } else if (["shield"].includes(type)) {
    const ring = document.createElement("div");
    ring.className = "mp-ring shield";
    layer.appendChild(ring);
    setTimeout(() => ring.remove(), 780);
  } else if (["poison"].includes(type)) {
    const ring = document.createElement("div");
    ring.className = "mp-ring poison";
    layer.appendChild(ring);
    setTimeout(() => ring.remove(), 780);
  } else {
    for (let i = 0; i < (type === "combo" ? 4 : 1); i++) {
      const slash = document.createElement("div");
      slash.className = "mp-slash";
      slash.style.transform = `rotate(${i % 2 ? 35 : -35}deg)`;
      layer.appendChild(slash);
      setTimeout(() => slash.remove(), 580);
      if (type === "combo") await sleep(90);
    }
  }
}

function fxClass(type) {
  if (["fire", "meteor"].includes(type)) return "fire";
  if (["lightning"].includes(type)) return "lightning";
  if (["shadow", "combo"].includes(type)) return "shadow";
  if (["poison"].includes(type)) return "poison";
  if (["heal", "shield"].includes(type)) return "heal";
  return "";
}

async function copyInvite() {
  const text = $("inviteLinkInput").value;
  try {
    await navigator.clipboard.writeText(text);
    setLobbyStatus("Invite link copied. Send it to your friend.");
  } catch {
    $("inviteLinkInput").select();
    setLobbyStatus("Copy the highlighted invite link.");
  }
}

function wireEvents() {
  $("createDuelBtn").addEventListener("click", () => createRoom("duel"));
  $("createCoopBtn").addEventListener("click", () => createRoom("coop"));
  $("joinRoomBtn").addEventListener("click", () => joinRoom());
  $("readyBtn").addEventListener("click", toggleReady);
  $("leaveRoomBtn").addEventListener("click", leaveRoom);
  $("battleLeaveBtn").addEventListener("click", leaveRoom);
  $("copyInviteBtn").addEventListener("click", copyInvite);

  $("playerNameInput").addEventListener("input", () => {
    localStorage.setItem("emxMultiplayerName", sanitizeName($("playerNameInput").value));
  });

  $("roomCodeInput").addEventListener("input", () => {
    $("roomCodeInput").value = $("roomCodeInput").value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  });
}

async function boot() {
  wireEvents();
  renderClassGrid();
  $("playerNameInput").value = sanitizeName(localStorage.getItem("emxMultiplayerName") || `Player${rand(10, 99)}`);

  const params = new URLSearchParams(location.search);
  const roomParam = params.get("room");
  if (roomParam) $("roomCodeInput").value = roomParam.toUpperCase().slice(0, 6);

  if (!hasFirebaseConfig) {
    $("setupWarning").classList.remove("hidden");
    setConnection(false, "Setup Needed");
    setSetupStatus("Paste Firebase config first, then redeploy.");
    ["createDuelBtn", "createCoopBtn", "joinRoomBtn"].forEach((id) => ($(id).disabled = true));
    return;
  }

  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
    const credential = await signInAnonymously(auth);
    uid = credential.user.uid;
    setConnection(true, "Online");
    setSetupStatus(roomParam ? "Room code loaded. Choose your class, then Join Room Code." : "Connected. Create a room or join a friend.");
  } catch (error) {
    $("setupWarning").classList.remove("hidden");
    setConnection(false, "Auth Error");
    setSetupStatus(error.message || "Firebase could not connect. Check your config and Anonymous Auth setting.");
    ["createDuelBtn", "createCoopBtn", "joinRoomBtn"].forEach((id) => ($(id).disabled = true));
  }
}

boot();
