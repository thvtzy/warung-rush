"use strict";
/* Warung Rush — menu data: ingredients, dishes, faces, prices.
   All names and recipes are original to this game. */
const ING = {
  nasi:   { e:"🍚", n:"Rice" },
  mie:    { e:"🍜", n:"Noodles" },
  telur:  { e:"🍳", n:"Egg" },
  ayam:   { e:"🍗", n:"Chicken" },
  kecap:  { e:"🍶", n:"Soy sauce" },
  cabai:  { e:"🌶️", n:"Chili" },
  sayur:  { e:"🥬", n:"Veggies" },
  tusuk:  { e:"🍢", n:"Skewer" },
  kacang: { e:"🥜", n:"Peanut" },
  daging: { e:"🥩", n:"Beef" },
  kuah:   { e:"🥣", n:"Broth" },
  kerupuk:{ e:"🍘", n:"Crackers" },
  teh:    { e:"🍵", n:"Tea" },
  es:     { e:"🧊", n:"Ice" },
  gula:   { e:"🍬", n:"Sugar" }
};
/* Keyboard shortcut for each ingredient, in tray order. */
const KEYS = ["1","2","3","4","5","6","7","8","9","0","Q","W","E","R","T"];
const ING_KEYS = {};
Object.keys(ING).forEach((k, i) => { ING_KEYS[k] = KEYS[i]; });

const DISHES = [
  { name:"Nasi Goreng",  items:["nasi","telur","ayam","cabai","kecap"] },
  { name:"Mie Goreng",   items:["mie","telur","sayur","ayam"] },
  { name:"Sate Ayam",    items:["ayam","tusuk","kacang","kecap"] },
  { name:"Bakso Sapi",   items:["daging","mie","kuah","sayur"] },
  { name:"Nasi Campur",  items:["nasi","ayam","telur","cabai","kerupuk"] },
  { name:"Es Teh Manis", items:["teh","es","gula"] }
];
const FACES = ["face1", "face2", "face3", "face4", "face5", "faceHijab"];

const priceOf = d => 5000 + 3000 * d.items.length;
const rp = n => "Rp" + n.toLocaleString("id-ID");
const dishByName = name => DISHES.find(d => d.name === name);
