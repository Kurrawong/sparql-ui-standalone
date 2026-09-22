const STORAGE_KEY = "sparqlUiEndpoint";

/**
 * Resolves the SPARQL endpoint to open the editor with: an `?endpoint=`
 * query param (which also persists the choice), then a value the user
 * previously set, then the build-time default (VITE_SPARQL_ENDPOINT).
 */
export function getSparqlEndpoint(): string {
    const queryOverride = new URLSearchParams(window.location.search).get("endpoint");
    if (queryOverride) {
        setSparqlEndpoint(queryOverride);
        return queryOverride;
    }

    return localStorage.getItem(STORAGE_KEY) || import.meta.env.VITE_SPARQL_ENDPOINT || "";
}

export function setSparqlEndpoint(endpoint: string): void {
    localStorage.setItem(STORAGE_KEY, endpoint);
}
