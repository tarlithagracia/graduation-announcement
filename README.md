# GRACIA graduated!

An interactive, phone-sized announcement page built from the Figma design
[Frame 6](https://www.figma.com/design/cstXc97bSiGTWrD8bRQBfs/Graduation-Announcement?node-id=1-54).
Four full-screen panels: the announcement, then-vs-now, a timed quiz, and the
"business card" the whole thing exists to get shared.

No build step, no dependencies — open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## What's interactive

- **Hero** — "Keep scrolling" nudges and scrolls to the next panel.
- **Then / now** — tap the "today" collage to peek at the photo underneath the
  job-hunt clutter; tap again to put it back.
- **Quiz** — the `10` from the design is a real 10-second countdown drawn on a
  circular progress ring in the card's gradient. It starts when the panel comes
  into view, pauses when it leaves, and freezes on answer. Answering marks your
  pick, reveals (c), and writes a one-line reply; running out of time reveals
  the answer instead. Either way it scrolls on to the card. "Skip the quiz"
  jumps straight there.
- **Card** — `Share` uses the native share sheet where the browser has one and
  falls back to copying the link. Confetti fires the first time the card comes
  into view. Linkedin / Resume / Email are real links.

## Before you send it to anyone

1. Add the five image files listed in [`assets/README.md`](assets/README.md).
2. Open `script.js` and fill in `CONFIG` — LinkedIn URL, resume path, email.
   Until you do, those buttons say what's missing instead of going nowhere.
3. Quiz copy (timer length, the four replies) also lives in `CONFIG`.

## Notes on fidelity

Built to the Figma geometry: the 404px grid is expressed in rem where
`1rem = 10 design px`, so the whole layout scales proportionally on narrower
phones and never needs a second set of numbers. Panels are one screen tall and
grow rather than clip on short windows.

Two things are reconstructions rather than exports, because the Figma asset CDN
was unreachable from the environment this was built in:

- the LinkedIn and Indeed marks on the collage are drawn in CSS,
- the veil over the "today" photo — which in Figma is a vector masked around
  Gracia so she stays sharp — is approximated with a radial mask.

Swap in the exported assets when convenient; everything else is the design.
