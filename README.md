# 🍜 Warung Rush

A tiny, original **Indonesian street-food cooking game** that runs entirely in your
browser — no downloads, no server, no network needed after the page loads.

**▶ Play it here: https://thvtzy.github.io/warung-rush/**

## How to play

You run a busy *warung* (Indonesian street-food stall) for one 2½-minute shift.

1. Customers arrive with orders — **Nasi Goreng**, **Mie Goreng**, **Sate Ayam**,
   **Bakso Sapi**, **Nasi Campur**, **Es Teh Manis**.
2. Tap the ingredient buttons to build the dish on your plate. Ingredients in the
   customer's order light up green as you add them.
3. When your plate matches an order exactly, the customer glows — tap them to serve.
4. Fast service earns **tips** and builds your **combo multiplier**. Slow service
   drains the customer's patience bar; if it empties, they walk away and you lose
   a ❤️. Lose all 3 hearts and the shift ends early.
5. When the timer runs out you get a star rating (★–★★★) based on your earnings.

## Running it offline

The whole game is a single self-contained `index.html` — no external fonts,
images, scripts or network calls (all artwork is emoji, all sound is generated
with WebAudio). Just download the file and open it in any modern browser.

## Tech

- Plain HTML + CSS + vanilla JavaScript in one file (~20 KB)
- Emoji-based visuals, WebAudio-generated sound effects (mutable)
- Works on desktop and mobile, mouse or touch

## License

MIT — see [LICENSE](LICENSE). The game, its name, art direction and code are an
original work created for this repository.
