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

export const sparqlEndpoints: SparqlEndpointConfig[] = [
	{
		name: "OSPD",
		endpoint: "https://api.ospd.dev.kurrawong.ai/sparql",
	},
	{
		name: "Pidreg",
		endpoint: "https://api.pidreg.dev.kurrawong.ai/sparql",
	},
	// Add more named endpoints here, e.g.:
	// { name: "GraphDB", endpoint: "https://...", username: "...", password: "..." },
];
