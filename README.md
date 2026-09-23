# sparql-ui-standalone

Standalone SPARQL query UI built on [Yasgui](https://github.com/zazuko/Yasgui) (migrate from triply after styling fixes), packaged as a static site with no backend framework dependency. It's a Vue 3 + TypeScript + Vite app that builds to plain HTML/CSS/JS and can be hosted anywhere.

## Develop

```bash
pnpm install
pnpm dev
```

## Configuring endpoints

The SPARQL endpoints shown in the dropdown from the values in `src/endpoints.json`. This is a static SPA with no backend, so anything in this file (including credentials) ships in plain text in the built JS bundle and is readable by anyone who opens devtools — fine for shared/low-sensitivity credentials that all authenticated users are allowed to access, not for anything that needs to stay hidden from the app's own users.

To get started, copy the example endpoints file and edit it:

```bash
cp src/endpoints.example.json src/endpoints.json
```

Without this file, the dropdown is simply empty. `src/endpoints.config.ts` globs `src/endpoints.json` in at build time. See "Keeping real credentials out of git and out of AI-agent context" below for what this does and doesn't protect against.

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

## Consuming as a dependency

This repo isn't published to a package registry yet. A consuming project can depend on it directly via git in the meantime:

```bash
pnpm add git+https://github.com/Kurrawong/sparql-ui-standalone.git#v0.1.0
```

and import `SparqlEditor.vue` / `AppShell.vue` / `useSparqlEndpoint.ts` directly by path in its own app, alongside its own `theme.css`. Moving to a published package later only changes that install line — the internal structure and exports stay the same.

`SparqlEditor.vue` accepts optional `endpoints`/`sampleQueries` props (each matching the exported `SparqlEndpointConfig[]`/`SampleQuery[]` shapes) so a downstream app can supply its own list instead of this repo's built-in ones — the built-in `src/endpoints.config.ts`/`src/queries.ts` are only the defaults used when no props are passed:

```vue
<script lang="ts" setup>
import AppShell from "sparql-ui-standalone/src/components/AppShell.vue";
import SparqlEditor from "sparql-ui-standalone/src/components/SparqlEditor.vue";
import { sparqlEndpoints } from "./endpoints.config";
import { sampleQueries } from "./queries";
</script>

<template>
	<AppShell title="Your App">
		<template #logo><strong>Your</strong>Org</template>
		<SparqlEditor :endpoints="sparqlEndpoints" :sample-queries="sampleQueries" />
	</AppShell>
</template>
```

### Credential ignoring

`src/endpoints.json` (see "Configuring endpoints" above) is gitignored, and this repo's `.claude/settings.json` denies Claude Code's own Read/Grep/Edit tools on it. A downstream app consuming this as a dependency should set up the same two things itself (gitignore + its own `.claude/settings.json` deny rule) for its own `src/endpoints.json`.
