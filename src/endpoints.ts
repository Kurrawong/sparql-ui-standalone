export interface SparqlEndpointConfig {
	name: string;
	/** A public SPARQL endpoint URL, or `/api/sparql/<id>` for one behind the proxy. */
	endpoint: string;
}

// A leading "/" resolves from the root of the app being built, so this reads that app's src/endpoints.json.
const files = import.meta.glob("/src/endpoints.json", {
	eager: true,
	import: "default",
}) as Record<string, SparqlEndpointConfig[]>;

export const sparqlEndpoints: SparqlEndpointConfig[] = Object.values(files).flat();
