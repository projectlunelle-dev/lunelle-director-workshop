# Director Workshop

Lunelle atelier for **Story #001** — write scenes with Ryo, Ren, Natsuki, and Raina.

**Repo:** https://github.com/projectlunelle-dev/lunelle-director-workshop

## Screens

Story Libraries → Director’s Room → Characters → Workshop → Configure / Timeline / Archive

## Photos included

- Character portraits: Ryo, Ren, Natsuki, Raina (card + current)
- Scene ideas: Lost Camera, Dare at the Seawall, Waiting Out the Rain
- Director’s Room hero, story cover, scene art

## Local

```bash
npm install
npm run dev
```

`npm run build` decodes workshop photos from `encoded/` then builds for Netlify.

## Netlify

1. Open [Netlify](https://app.netlify.com) → **Add new site** → **Import an existing project**
2. Connect GitHub and choose **projectlunelle-dev/lunelle-director-workshop**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy

Scene writing uses a server function. Import from Git (not a static drag-and-drop) so that path stays live.
