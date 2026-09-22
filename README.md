# Frameo

Frameo is a browser-based video editor focused on a desktop-editor workflow: media bin, multi-track timeline, transitions, graphics, text, effects, inspector controls, real-time preview, and local export.

## Frameo changes

- Frameo branding and GitHub Pages deployment.
- Spanish / English language switch.
- Generative-AI creation surface removed.
- Direct free-transform interaction in the preview: select a clip on the canvas and drag from the clip area, with resize handles updating continuously.
- OpenReel timeline, graphics, text, transition, effects, preview, and export architecture retained as the editor foundation.

## Development

```bash
pnpm install
pnpm dev
```

Production build:

```bash
pnpm build
```

## Attribution and license

Frameo is derived from the open-source **OpenReel Video** project by Augustus Otu and Contributors.

Original project: https://github.com/ahsocode/openreel-video

OpenReel is distributed under the MIT License. The original copyright and permission notice are preserved in [LICENSE](./LICENSE).

Frameo modifications are also distributed under the terms of that license.
