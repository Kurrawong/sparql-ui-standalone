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

Without this file, the dropdown is simply empty. `src/endpoints.ts` globs `src/endpoints.json` in at build time. See "Keeping real credentials out of git and out of AI-agent context" below for what this does and doesn't protect against.

## Build

```bash
pnpm build
pnpm preview
```

`dist/` is a plain static site — deploy it to any static file host. No server runtime is required.

## Theming

All components use Tailwind's semantic utility classes (`bg-background`, `text-foreground`, `border-border`, ...). Those classes are generated from the `@theme` tokens in `src/theme.css`. Reskinning the app means editing that one file -- no component changes needed.

For anything beyond colors and fonts, use `AppShell.vue`'s `title` prop and `logo` slot, or replace the whole bar with its `header`/`footer` slots, instead of forking the component. `SparqlEditor.vue` itself has no theming seams, since there's nothing org-specific about a query editor.

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

and import `SparqlEditor.vue` / `AppShell.vue` directly by path in its own app. Moving to a published package later only changes that install line.

Because the components are consumed as source, the app must also depend on `@triply/yasgui` (and `vue`) directly, the same way `create-prez-app`'s template lists prez-ui's dependencies. Otherwise `vue-tsc` can't resolve them from the package's `.vue` files under pnpm:

```bash
pnpm add @triply/yasgui@^4.2.28
```

A downstream app contains only config, laid out the same way as this repo:

```
src/
├── App.vue                # AppShell + SparqlEditor, plus its own header/footer slots
├── main.ts                # standard Vite entry: createApp(App).mount("#app") + import "./theme.css"
├── theme.css              # @import "sparql-ui-standalone/src/theme.css"; then @theme overrides
├── endpoints.json         # gitignored; endpoints.example.json committed as a template
└── queries/*.rq           # sample queries
```

No glue code is needed: this repo's `src/endpoints.ts` and `src/queries.ts` glob `/src/endpoints.json` and `/src/queries/*.rq`, and Vite resolves a leading `/` from the root of the app being built. That means they pick up the downstream app's files automatically. Likewise, `src/theme.css` declares `@source "./components"`, so importing it generates the utility classes these components need even from `node_modules`.

```vue
<script lang="ts" setup>
import AppShell from "sparql-ui-standalone/src/components/AppShell.vue";
import SparqlEditor from "sparql-ui-standalone/src/components/SparqlEditor.vue";
</script>

<template>
	<AppShell title="Your App">
		<template #logo><strong>Your</strong>Org</template>
		<SparqlEditor />
	</AppShell>
</template>
```

`SparqlEditor.vue` also accepts optional `endpoints`/`sampleQueries` props (`SparqlEndpointConfig[]`/`SampleQuery[]`). They're for hosts that build these lists programmatically instead of from files, such as prez-ui later on.

### Credential ignoring

`src/endpoints.json` (see "Configuring endpoints" above) is gitignored, and this repo's `.claude/settings.json` denies Claude Code's own Read/Grep/Edit tools on it. A downstream app consuming this as a dependency should set up the same two things itself (gitignore + its own `.claude/settings.json` deny rule) for its own `src/endpoints.json`.
