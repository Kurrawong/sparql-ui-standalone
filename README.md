# sparql-ui-standalone

A SPARQL query UI built on [Yasgui](https://github.com/TriplyDB/Yasgui), as a Vue 3 + Vite static site.

The repo has three parts:

- `src/`: the UI.
- `proxy/`: a small server-side proxy for endpoints that need a login.
- `proxy/azure/`: an adapter for deploying that proxy to Azure Static Web Apps.

## Develop

```bash
pnpm install
cp .env.example .env.local   # only needed for endpoints behind the proxy for local development. See below for setting these in development
pnpm dev
```

`pnpm dev` also serves the proxy, through `proxy/vite-plugin.js`.

## Endpoints

List endpoints in `src/endpoints.json` as `[{ "name": "…", "endpoint": "…" }]`. This file is compiled into the page, so it must never contain credentials.

- **Public endpoint:** set `endpoint` to its URL.
- **Endpoint that needs a login:** set `endpoint` to `/api/sparql/<id>`. The proxy reads these settings:
    - `SPARQL_<ID>_ENDPOINT`: the real URL;
    - `SPARQL_<ID>_USERNAME` and `SPARQL_<ID>_PASSWORD`: optional, sent as Basic auth.

    `<ID>` is the id in upper case, so `/api/sparql/example` reads `SPARQL_EXAMPLE_*`. Ids may only contain letters, digits and `_`.

The settings come from `.env.local` locally (see `.env.example`), and from app settings on the host when deployed. An id with no `SPARQL_<ID>_ENDPOINT` returns a 404 naming the missing setting.

## Sample queries

Each `src/queries/*.rq` file is one sample query, listed in file-name order. Two optional comment lines at the top set its title and description:

```sparql
# title: Count all triples
# description: The total number of triples in the dataset.
SELECT (COUNT(*) AS ?count) WHERE { ?s ?p ?o }
```

Without them, the title is "Untitled" and the description is blank.

## Theming

Components use Tailwind's semantic classes (`bg-background`, `text-foreground`, `border-border`), generated from the `@theme` tokens in `src/theme.css`.

For branding beyond colours and fonts, use `AppShell.vue`:

- its `title` prop and `logo` slot, for the default header;
- its `header` and `footer` slots, to replace them entirely.

## Build and deploy

```bash
pnpm build
```

`dist/` is a static site. If any endpoint uses the proxy, the host must also serve `POST /api/sparql/<id>` on the same origin. To do that, wrap `proxySparql(id, request, env)` from `proxy/sparql-proxy.js` for your platform; it only uses standard `fetch`.

On **Azure Static Web Apps**, use the adapter in `proxy/azure/`:

1. Assemble the function: `cp -r proxy/azure api && cp proxy/sparql-proxy.js api/src/`.
2. Deploy with `app_location: dist` and `api_location: api`.
3. Set the `SPARQL_<ID>_*` values as app settings.

The proxy does no authentication of its own. Gate the site, and with it `/api/*`, through the host's sign-in.

## Using it in another app

```bash
pnpm add github:Kurrawong/sparql-ui-standalone#v0.1.0 @triply/yasgui@^4.2.28
```

The components are consumed as source, so the app must also depend on `@triply/yasgui` directly; otherwise `vue-tsc` can't resolve it under pnpm.

The app then only needs config:

```
index.html
vite.config.ts        # plugins: [vue(), tailwindcss(), sparqlProxy()]; build: { cssMinify: false }
src/
├── main.ts           # createApp(App).mount("#app") and import "./theme.css"
├── App.vue           # AppShell + SparqlEditor, with its own header and footer
├── theme.css         # @import "sparql-ui-standalone/src/theme.css", then @theme overrides
├── endpoints.json
└── queries/*.rq
```

- `sparqlProxy` comes from `sparql-ui-standalone/proxy/vite-plugin.js`.
- `cssMinify: false` is needed because Vite's CSS minifier breaks Yasgui's stylesheet. See `vite.config.ts`.

`src/endpoints.ts` and `src/queries.ts` read the app's own `src/endpoints.json` and `src/queries/`. `src/theme.css` generates the classes the components use.

```vue
<script lang="ts" setup>
import AppShell from "sparql-ui-standalone/src/components/AppShell.vue";
import SparqlEditor from "sparql-ui-standalone/src/components/SparqlEditor.vue";
</script>

<template>
	<AppShell title="Your App">
		<SparqlEditor />
	</AppShell>
</template>
```

## Credentials

Credentials only exist in the `SPARQL_<ID>_*` settings:

- **Locally**, in `.env.local`. It's gitignored, and `.claude/settings.json` blocks Claude Code from reading it. Vite never sends variables without a `VITE_` prefix to the browser.
- **When deployed**, in the host's app settings.
