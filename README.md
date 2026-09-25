# sparql-ui-standalone

Standalone SPARQL query UI built on [Yasgui](https://github.com/TriplyDB/Yasgui). It's a Vue 3 + TypeScript + Vite static site, plus a small platform-neutral proxy (`proxy/`) for endpoints that need a login. `proxy/azure/` is an optional adapter for deploying that proxy to Azure.

## Develop

```bash
pnpm install
cp .env.example .env.local   # only needed for endpoints behind the proxy
pnpm dev
```

`pnpm dev` also serves the proxy, through a Vite plugin (`proxy/vite-plugin.js`). No platform tooling is needed.

## Configuring endpoints

There is one way to configure endpoints, in two parts:

| Where | Holds | Who reads it |
| --- | --- | --- |
| `src/endpoints.json` (committed) | `[{ "name", "endpoint" }]` — never credentials | The browser. It's compiled into the page. |
| Environment: `.env.local` locally, app settings when deployed | `SPARQL_<ID>_ENDPOINT`, plus optional `SPARQL_<ID>_USERNAME` and `SPARQL_<ID>_PASSWORD` | Only the proxy, on the server |

- **Public endpoint:** list its real URL in `src/endpoints.json`.
- **Endpoint that needs a login:** list `"/api/sparql/<id>"` in `src/endpoints.json`, and set `SPARQL_<ID>_ENDPOINT` (the real URL), `SPARQL_<ID>_USERNAME` and `SPARQL_<ID>_PASSWORD`. `<ID>` is the id in upper case, and ids use letters, digits and `_` only. For example, `/api/sparql/example` reads `SPARQL_EXAMPLE_*`. See `.env.example`.
- The proxy (`proxy/sparql-proxy.js`) adds the login header and forwards the query, so the browser never sees the credentials. An id without settings returns a 404 naming the setting it expected.

`src/endpoints.ts` globs `/src/endpoints.json` at build time. The leading `/` resolves from the root of the app being built, so a downstream app's own file is used automatically.

## Build and deploy

```bash
pnpm build
```

`dist/` is a static site. To use the proxy in production, the host must also serve `POST /api/sparql/<id>` on the same origin. Do that with a small adapter around `proxySparql(id, request, env)` from `proxy/sparql-proxy.js`, which only uses standard `fetch`.

**Azure Static Web Apps** (adapter in `proxy/azure/`):
1. Assemble the function: `cp -r proxy/azure api && cp proxy/sparql-proxy.js api/src/`.
2. Deploy `dist/` and `api/` together (`app_location: dist`, `api_location: api`).
3. Set the `SPARQL_<ID>_*` values as app settings.

See `sparql-ui-standalone-demo` for a complete deployment.

## Theming

All components use Tailwind's semantic utility classes (`bg-background`, `text-foreground`, `border-border`, ...), generated from the `@theme` tokens in `src/theme.css`. Reskinning means editing that one file.

For anything beyond colours and fonts, use `AppShell.vue`'s `title` prop and `logo` slot, or replace the whole bar with its `header`/`footer` slots.

## Consuming as a dependency

```bash
pnpm add github:Kurrawong/sparql-ui-standalone#v0.1.0
pnpm add @triply/yasgui@^4.2.28
```

The components are consumed as source, so the app must also depend on `@triply/yasgui` directly (as `create-prez-app`'s template does for prez-ui). Otherwise `vue-tsc` can't resolve it under pnpm.

A downstream app contains only config, laid out like this repo:

```
src/
├── App.vue           # AppShell + SparqlEditor, plus its own header/footer slots
├── main.ts           # createApp(App).mount("#app") + import "./theme.css"
├── theme.css         # @import "sparql-ui-standalone/src/theme.css"; then @theme overrides
├── endpoints.json    # names and URLs only
└── queries/*.rq      # sample queries
vite.config.ts        # plugins: [..., sparqlProxy()] from "sparql-ui-standalone/proxy/vite-plugin.js"
```

`src/endpoints.ts` and `src/queries.ts` pick up the app's own files (see above), and `src/theme.css` declares `@source "./components"` so the components' utility classes are generated from `node_modules`. The proxy and its adapters come from this package, and are assembled at deploy time rather than copied into the app's repo.

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

### Keeping credentials out of git and AI tools

Credentials only ever live in the `SPARQL_<ID>_*` settings:
- **Locally** they're in `.env.local`. It's gitignored, and `.claude/settings.json` denies Claude Code's Read/Grep/Edit tools on it. Vite never exposes variables without a `VITE_` prefix to the browser.
- **When deployed** they're app settings on the host.
