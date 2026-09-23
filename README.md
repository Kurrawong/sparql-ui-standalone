# sparql-ui-standalone

Standalone SPARQL query UI built on [Yasgui](https://github.com/zazuko/Yasgui) (migrate from triply after styling fixes), packaged as a static site with no backend framework dependency. It's a Vue 3 + TypeScript + Vite app that builds to plain HTML/CSS/JS and can be hosted anywhere.

## Develop

```bash
pnpm install
pnpm dev
```

## Configuring endpoints

The SPARQL endpoints shown in the dropdown are listed in `src/endpoints.config.ts` — a plain typed array, edited directly rather than via environment variables. Each entry has a `name`, `endpoint` URL, and optional `username`/`password` for HTTP Basic Auth. This is a static SPA with no backend, so anything in that file (including credentials) ships in plain text in the built JS bundle and is readable by anyone who opens devtools — fine for shared/low-sensitivity credentials, not for anything that needs to stay hidden from the app's own users.

## Build

```bash
pnpm build
pnpm preview
```

`dist/` is a plain static site — deploy it to any static file host. No server runtime is required.

## Theming

All components use Tailwind's semantic utility classes (`bg-background`, `text-foreground`, `border-border`, ...). Those classes are generated from the `@theme` tokens in `src/theme.css`. Reskinning the app means editing that one file -- no component changes needed.

For anything beyond colors and fonts (e.g. logo, extra footer link), use `AppShell.vue`'s `logo` and `footer` slots and its `title` prop instead of forking the component. `SparqlEditor.vue` itself has no theming seams, since there's nothing org-specific about a query editor.

## Docker

A reference `Dockerfile` and `nginx.conf` are provided under `docker/` — they build the app and serve the static output with nginx:

```bash
docker build -f docker/Dockerfile -t sparql-ui-standalone .
docker run --rm -p 8080:80 sparql-ui-standalone
# → http://localhost:8080
```

Docker is not a requirement — `pnpm build` alone produces everything needed to deploy without it.

## Consuming this as a dependency

This repo isn't published to a package registry yet. A consuming project can depend on it directly via git in the meantime:

```bash
pnpm add git+https://github.com/Kurrawong/sparql-ui-standalone.git#v0.1.0
```

and import `SparqlEditor.vue` / `AppShell.vue` / `useSparqlEndpoint.ts` directly by path in its own app, alongside its own `theme.css`. Moving to a published package later only changes that install line — the internal structure and exports stay the same.
