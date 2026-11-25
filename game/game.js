"use strict";
/* Warung Rush — game logic, rendering and input.
   Depends on sprites.js (pixel art), recipes.js (menu data) and
   audio.js (sounds + music), loaded before this file. */
const SHIFT_LEN = 150; // seconds per shift
const $ = id => document.getElementById(id);

let S = null; // game state

function newGame() {
  S = {
    running: true, frozen: false,
    timeLeft: SHIFT_LEN,
    money: 0, served: 0, lost: 0,
    combo: 0, bestCombo: 0,
    hearts: 3,
    plate: [],
    customers: [null, null, null],
    spawnIn: 0.4,
    tick: 0
  };
  $("startscreen").classList.add("hidden");
  $("endscreen").classList.add("hidden");
  setMsg("First customers are coming…");
  startMusic();
  renderAll();
}

function elapsed() { return SHIFT_LEN - S.timeLeft; }
function spawnEvery() { return Math.max(2.8, 6 - elapsed() * 0.022); }
function patienceMax() { return Math.max(30, 50 - elapsed() * 0.13); }

function spawnCustomer() {
  const free = S.customers.map((c, i) => c ? -1 : i).filter(i => i >= 0);
  if (!free.length) return;
  const slot = free[Math.floor(Math.random() * free.length)];
  const dish = DISHES[Math.floor(Math.random() * DISHES.length)];
  const pm = patienceMax();
  S.customers[slot] = {
    dish, patience: pm, maxPatience: pm,
    face: FACES[Math.floor(Math.random() * FACES.length)]
  };
  sndPop();
}

function plateMatches(dish) {
  if (S.plate.length !== dish.items.length) return false;
  const a = [...S.plate].sort().join(",");
  const b = [...dish.items].sort().join(",");
  return a === b;
}

function addIngredient(key, el) {
  if (!S || !S.running) return;
  if (S.plate.includes(key)) { setMsg(ING[key].n + " is already on the plate!"); sndBad(); return; }
  S.plate.push(key);
  sndClick();
  flyToPlate(key, el);
  renderPlate(); renderCustomers();
  const ready = S.customers.find(c => c && plateMatches(c.dish));
  if (ready) setMsg("That's a " + ready.dish.name + "! Tap the glowing customer (or press Enter) to serve 👆");
}

function serve(slot, ev) {
  if (!S || !S.running) return;
  const c = S.customers[slot];
  if (!c) return;
  const cardEl = document.querySelector('.cust[data-slot="' + slot + '"]');
  if (!plateMatches(c.dish)) {
    if (cardEl) { cardEl.classList.remove("shake"); void cardEl.offsetWidth; cardEl.classList.add("shake"); }
    setMsg("That plate isn't a " + c.dish.name + " yet — check the glowing ingredients.");
    sndBad();
    return;
  }
  const base = priceOf(c.dish);
  const tip = Math.round(base * 0.5 * (c.patience / c.maxPatience));
  const mult = 1 + Math.min(S.combo, 10) * 0.1;
  const total = Math.round((base + tip) * mult);
  S.money += total;
  S.served++;
  S.combo++;
  S.bestCombo = Math.max(S.bestCombo, S.combo);
  S.customers[slot] = null;
  S.plate = [];
  sndServe();
  if (cardEl) starBurst(cardEl);
  if (ev) floaty("+" + rp(total), ev.clientX, ev.clientY);
  setMsg("Served " + c.dish.name + "! " + rp(base) + " + tip " + rp(tip) + (S.combo > 1 ? " · combo x" + S.combo : ""));
  renderAll();
}

function serveFirstReady() {
  if (!S || !S.running) return;
  const i = S.customers.findIndex(c => c && plateMatches(c.dish));
  if (i >= 0) serve(i);
  else { setMsg("No order matches your plate yet."); sndBad(); }
}

function customerLeaves(slot) {
  const c = S.customers[slot];
  S.customers[slot] = null;
  S.lost++;
  S.hearts--;
  S.combo = 0;
  sndOut();
  setMsg("Oh no — the " + c.dish.name + " customer walked away!");
  if (S.hearts <= 0) endGame(false);
}

function endGame(timeUp) {
  if (!S.running) return;
  S.running = false;
  stopMusic();
  $("endtitle").textContent = timeUp ? "Shift over!" : "Out of hearts!";
  const stars = S.money >= 280000 ? 3 : S.money >= 180000 ? 2 : S.money >= 90000 ? 1 : 0;
  $("stars").textContent = "★★★".slice(0, stars) + "☆☆☆".slice(0, 3 - stars);
  $("st-money").textContent = rp(S.money);
  $("st-served").textContent = S.served;
  $("st-combo").textContent = "x" + S.bestCombo;
  $("st-lost").textContent = S.lost;
  $("endnote").textContent =
    stars === 3 ? "Legendary! Your warung is the talk of the town." :
    stars === 2 ? "Great shift! The regulars will be back tomorrow." :
    stars === 1 ? "A decent first shift — speed comes with practice!" :
                  "Every great warung starts somewhere. Try again!";
  $("endscreen").classList.remove("hidden");
  renderHUD();
}

function tick() {
  if (!S || !S.running || S.frozen) return;
  S.tick++;
  S.customers.forEach((c, i) => {
    if (!c) return;
    c.patience -= 0.1;
    if (c.patience <= 0) customerLeaves(i);
  });
  if (!S.running) { renderAll(); return; }
  S.spawnIn -= 0.1;
  if (S.spawnIn <= 0) { spawnCustomer(); S.spawnIn = spawnEvery() * (0.75 + Math.random() * 0.5); }
  if (S.tick % 10 === 0) {
    S.timeLeft--;
    if (S.timeLeft <= 0) { S.timeLeft = 0; endGame(true); }
  }
  renderHUD(); renderCustomers();
}
setInterval(tick, 100);

/* ================= Effects ================= */
function flyToPlate(key, fromEl) {
  try {
    if (!fromEl || !fromEl.getBoundingClientRect) return;
    const plate = $("plate");
    const r1 = fromEl.getBoundingClientRect(), r2 = plate.getBoundingClientRect();
    const img = document.createElement("img");
    img.className = "spr flyimg";
    img.src = SPR[key] || "";
    img.style.left = (r1.left + r1.width / 2 - 21) + "px";
    img.style.top = (r1.top + r1.height / 2 - 21) + "px";
    document.body.appendChild(img);
    const dx = (r2.left + r2.width / 2) - (r1.left + r1.width / 2);
    const dy = (r2.top + 24) - (r1.top + r1.height / 2);
    const anim = img.animate([
      { transform: "translate(0,0) scale(1)", opacity: 1 },
      { transform: "translate(" + dx + "px," + dy + "px) scale(.7)", opacity: .9 }
    ], { duration: 320, easing: "steps(6)" });
    if (anim) anim.onfinish = () => img.remove();
    setTimeout(() => img.remove(), 700);
  } catch (e) { /* animation is decoration only */ }
}

function starBurst(cardEl) {
  try {
    if (!cardEl || !cardEl.getBoundingClientRect) return;
    const r = cardEl.getBoundingClientRect();
    const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    for (let i = 0; i < 6; i++) {
      const img = document.createElement("img");
      img.className = "spr burstimg";
      img.src = SPR.star || "";
      img.style.left = (cx - 11) + "px";
      img.style.top = (cy - 11) + "px";
      document.body.appendChild(img);
      const ang = (Math.PI * 2 * i) / 6 + Math.random() * .5;
      const dist = 55 + Math.random() * 35;
      const anim = img.animate([
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        { transform: "translate(" + Math.cos(ang) * dist + "px," + (Math.sin(ang) * dist - 24) + "px) scale(.4)", opacity: 0 }
      ], { duration: 550, easing: "steps(7)" });
      if (anim) anim.onfinish = () => img.remove();
      setTimeout(() => img.remove(), 900);
    }
  } catch (e) { /* decoration only */ }
}

/* ================= Rendering ================= */
function renderHUD() {
  if (!S) return;
  $("score").textContent = rp(S.money);
  $("combo").textContent = "x" + S.combo;
  $("hearts").innerHTML =
    sprImg("heart", "hrt").repeat(Math.max(0, S.hearts)) +
    sprImg("heartOff", "hrt").repeat(Math.max(0, 3 - S.hearts));
  const m = Math.floor(S.timeLeft / 60), s = S.timeLeft % 60;
  $("timelabel").textContent = "SHIFT ⏱ " + m + ":" + String(s).padStart(2, "0");
  $("timebar").style.width = (S.timeLeft / SHIFT_LEN * 100) + "%";
}

function renderCustomers() {
  if (!S) return;
  const wrap = $("customers");
  wrap.innerHTML = "";
  S.customers.forEach((c, i) => {
    const d = document.createElement("div");
    if (!c) {
      d.className = "cust empty";
      d.innerHTML = "<div>waiting for<br>a customer…</div>";
    } else {
      const ready = plateMatches(c.dish);
      d.className = "cust" + (ready ? " ready" : "");
      d.dataset.slot = i;
      const pct = Math.max(0, c.patience / c.maxPatience * 100);
      const barColor = pct > 50 ? "#37d67a" : pct > 25 ? "#ffb347" : "#e8483f";
      const face = pct <= 25 ? "faceAngry" : c.face;
      const items = c.dish.items.map(k =>
        '<span class="oi' + (S.plate.includes(k) ? " got" : "") + '" title="' + ING[k].n + '">' + sprImg(k) + "</span>"
      ).join("");
      d.innerHTML =
        '<div class="face">' + sprImg(face) + "</div>" +
        '<div class="dishname">' + c.dish.name + "</div>" +
        '<div class="order">' + items + "</div>" +
        '<div class="price">' + rp(priceOf(c.dish)) + "</div>" +
        '<div class="patience"><div style="width:' + pct + "%;background:" + barColor + '"></div></div>';
      d.addEventListener("click", ev => serve(i, ev));
    }
    wrap.appendChild(d);
  });
}

function renderPlate() {
  if (!S) return;
  const p = $("plate");
  if (!S.plate.length) {
    p.innerHTML = '<span class="hint">Tap ingredients below to build a dish…</span>';
  } else {
    p.innerHTML = S.plate.map(k => '<span class="pi" title="' + ING[k].n + '">' + sprImg(k) + "</span>").join("");
  }
  $("platecount").textContent = S.plate.length ? S.plate.length + " ingredient" + (S.plate.length > 1 ? "s" : "") : "";
  $("undobtn").disabled = !S.plate.length;
  $("trashbtn").disabled = !S.plate.length;
  $("stove").classList.toggle("on", S.plate.length > 0);
  document.querySelectorAll(".ing").forEach(b => {
    b.classList.toggle("used", S.plate.includes(b.dataset.key));
  });
}

function renderTray() {
  const tray = $("tray");
  tray.innerHTML = "";
  Object.keys(ING).forEach(k => {
    const b = document.createElement("button");
    b.className = "ing"; b.dataset.key = k;
    b.innerHTML = '<span class="k">' + ING_KEYS[k] + '</span><span class="e">' + sprImg(k) + '</span><span class="n">' + ING[k].n + "</span>";
    b.addEventListener("click", () => addIngredient(k, b));
    tray.appendChild(b);
  });
}

function renderAll() { renderHUD(); renderCustomers(); renderPlate(); }

let msgTimer = null;
function setMsg(t) {
  $("msg").textContent = t;
  if (msgTimer) clearTimeout(msgTimer);
  msgTimer = setTimeout(() => { $("msg").textContent = ""; }, 6000);
}

function floaty(text, x, y) {
  const el = document.createElement("div");
  el.className = "floaty";
  el.textContent = text;
  el.style.left = (x - 40) + "px";
  el.style.top = (y - 20) + "px";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

/* ================= Input wiring ================= */
function undoLast() { if (S && S.running && S.plate.length) { S.plate.pop(); sndClick(); renderPlate(); renderCustomers(); } }
function trashPlate() { if (S && S.running && S.plate.length) { S.plate = []; sndBad(); renderPlate(); renderCustomers(); setMsg("Plate thrown away."); } }

$("undobtn").addEventListener("click", undoLast);
$("trashbtn").addEventListener("click", trashPlate);
$("mutebtn").addEventListener("click", () => { muted = !muted; $("mutebtn").textContent = muted ? "🔇" : "🔊"; if (!muted) sndClick(); });
$("startbtn").addEventListener("click", () => { sndServe(); newGame(); });
$("againbtn").addEventListener("click", () => { sndServe(); newGame(); });

document.addEventListener("keydown", ev => {
  if (!S || !S.running) {
    if (ev.key === "Enter" && !$("startscreen").classList.contains("hidden")) { sndServe(); newGame(); }
    return;
  }
  const k = ev.key.toUpperCase();
  const ingKey = Object.keys(ING_KEYS).find(key => ING_KEYS[key] === k);
  if (ingKey) { addIngredient(ingKey, document.querySelector('.ing[data-key="' + ingKey + '"]')); return; }
  if (ev.key === "Enter") { ev.preventDefault(); serveFirstReady(); }
  else if (ev.key === "Backspace") { ev.preventDefault(); undoLast(); }
  else if (ev.key === "Delete") { trashPlate(); }
});

/* ================= Screenshot staging =================
   ?shot=1|2|3 freezes a real, deterministic game state so the game's own
   rendering can be photographed for the entry screenshots. Normal play
   (no query string) is unaffected. */
function stagedCustomer(dishName, patienceFrac, face) {
  const pm = 40;
  return { dish: dishByName(dishName), patience: pm * patienceFrac, maxPatience: pm, face };
}
function setupShot(n) {
  S = {
    running: true, frozen: true, timeLeft: 95,
    money: 47500, served: 6, lost: 0, combo: 3, bestCombo: 5,
    hearts: 3, plate: [], customers: [null, null, null], spawnIn: 99, tick: 0
  };
  if (n === 1) { // a plate ready to serve, customer glowing
    S.customers[0] = stagedCustomer("Nasi Goreng", 0.72, "faceHijab");
    S.customers[1] = stagedCustomer("Es Teh Manis", 0.9, "face2");
    S.plate = ["nasi", "telur", "ayam", "cabai", "kecap"];
    setMsg("That's a Nasi Goreng! Tap the glowing customer (or press Enter) to serve 👆");
  } else if (n === 2) { // one dish mid-assembly
    S.customers[0] = stagedCustomer("Sate Ayam", 0.8, "face3");
    S.customers[1] = stagedCustomer("Bakso Sapi", 0.55, "face1");
    S.plate = ["ayam", "tusuk"];
    S.money = 32000; S.combo = 2; S.timeLeft = 118;
    setMsg("Building a Sate Ayam — 2 of 4 ingredients on the plate…");
  } else if (n === 3) { // the lunch rush: three orders, one patience bar in the red
    S.customers[0] = stagedCustomer("Mie Goreng", 0.22, "face4");
    S.customers[1] = stagedCustomer("Nasi Campur", 0.65, "face5");
    S.customers[2] = stagedCustomer("Es Teh Manis", 0.85, "face2");
    S.plate = ["mie"];
    S.money = 86500; S.served = 11; S.combo = 5; S.bestCombo = 7; S.hearts = 2; S.timeLeft = 47;
    setMsg("Lunch rush! The Mie Goreng customer is running out of patience…");
  } else {
    return; // unknown shot: leave the start screen up
  }
  $("startscreen").classList.add("hidden");
  renderAll();
}

/* ================= Boot ================= */
document.querySelectorAll("img[data-spr]").forEach(im => { im.src = SPR[im.dataset.spr] || ""; });
$("hearts").innerHTML = sprImg("heart", "hrt").repeat(3);
renderTray();
const shotParam = new URLSearchParams(location.search).get("shot");
if (shotParam) setupShot(parseInt(shotParam, 10));
