# Director Workshop

Lunelle atelier for **Story #001** — write scenes with Ryo, Ren, Natsuki, and Raina.

## Screens

Story Libraries → Director’s Room → Characters → Workshop → Configure / Timeline / Archive

## Local

```bash
npm install
npm run dev
```

`npm run build` decodes workshop photos from `encoded/` then builds for Netlify.

## Netlify

1. Add a new site → Import from Git → this repository
2. Build command: `npm run build`
3. Publish directory: `dist`

Scene writing uses a server function. Import from Git (not a static drag-and-drop) so that path stays live.

Repo: https://github.com/projectlunelle-dev/lunelle-director-workshop
