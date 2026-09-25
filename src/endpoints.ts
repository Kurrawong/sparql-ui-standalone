export interface SparqlEndpointConfig {
	name: string;
	/**
	 * A public SPARQL endpoint URL, or `/api/sparql/<id>` for one that needs a
	 * login. Credentials never go here: this file ships in the browser bundle.
	 */
	endpoint: string;
}

// The endpoint list lives entirely in src/endpoints.json (committed; see README.md).
// The leading "/" makes Vite resolve this from the root of the app being
// built, so a downstream app's own src/endpoints.json is picked up automatically.
const files = import.meta.glob("/src/endpoints.json", {
	eager: true,
	import: "default",
}) as Record<string, SparqlEndpointConfig[]>;

export const sparqlEndpoints: SparqlEndpointConfig[] = Object.values(files).flat();
