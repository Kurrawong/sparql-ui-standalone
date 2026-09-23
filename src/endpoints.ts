export interface SparqlEndpointConfig {
	name: string;
	endpoint: string;
	/**
	 * HTTP Basic Auth, sent only when both are set. This is a static SPA
	 * with no backend, so anything here ships in plain text in the built
	 * JS bundle and is readable by anyone who opens devtools — fine for
	 * shared/low-sensitivity credentials, not for anything that needs to
	 * stay hidden from the app's own users.
	 */
	username?: string;
	password?: string;
}

// The endpoint list lives entirely in src/endpoints.json
// Copy src/endpoints.example.json to get started — see README.md.
const files = import.meta.glob("/src/endpoints.json", {
	eager: true,
	import: "default",
}) as Record<string, SparqlEndpointConfig[]>;

export const sparqlEndpoints: SparqlEndpointConfig[] = Object.values(files).flat();
