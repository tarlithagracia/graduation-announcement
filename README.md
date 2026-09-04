# GRACIA graduated!

An interactive announcement page built from the Figma design
[Frame 6](https://www.figma.com/design/cstXc97bSiGTWrD8bRQBfs/Graduation-Announcement?node-id=1-54):
four full-screen panels — the announcement, then vs now, the quiz, and the card.

No build step, no dependencies. Open `index.html`, or serve the folder:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Interaction

- **Keep scrolling** and **Skip the quiz, show me the card!** scroll to the next panel.
- **The quiz timer** — the `10` is a 10-second countdown in the centre of a
  circular progress ring, stroked in the card's gradient. It starts when the
  quiz panel comes into view and pauses when it leaves. Picking an answer, or
  the countdown reaching zero, moves on to the card.
- **Share** opens the device's share sheet, falling back to copying the link.
- **Linkedin / Resume / Portfolio** are the three links on the card. LinkedIn
  and the resume are wired up in `CONFIG` at the top of `script.js`; add the
  portfolio URL there and that pill starts working too.

## Fidelity

Built to the Figma geometry. The 404px grid is expressed in rem where
`1rem = 10 design px`, so the layout scales proportionally on narrower phones.
Every element was measured against its Figma coordinate and sits within 1.5px
of it; panels are one screen tall and grow rather than clip on short windows.

The photos are in `assets/`, the two typefaces are self-hosted in
`assets/fonts/`. The only drawn element is the share icon.
