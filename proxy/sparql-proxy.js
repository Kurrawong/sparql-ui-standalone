// Platform-neutral SPARQL proxy for /api/sparql/<id>: forwards the query to
// SPARQL_<ID>_ENDPOINT, adding a Basic auth header from SPARQL_<ID>_USERNAME and
// SPARQL_<ID>_PASSWORD, so credentials never reach the browser
// `request` needs `headers.get()` and `text()`, like a Fetch or Azure Functions request
export async function proxySparql(id, request, env) {
	if (!/^\w+$/.test(id)) return { status: 404, body: "Invalid SPARQL endpoint id" };

	const prefix = `SPARQL_${id.toUpperCase()}_`;
	const endpoint = env[`${prefix}ENDPOINT`];
	if (!endpoint) return { status: 404, body: `No SPARQL endpoint configured: set ${prefix}ENDPOINT` };

	const headers = {
		"Content-Type": request.headers.get("content-type") ?? "application/x-www-form-urlencoded",
		Accept: request.headers.get("accept") ?? "application/sparql-results+json",
	};
	const username = env[`${prefix}USERNAME`];
	const password = env[`${prefix}PASSWORD`];
	if (username && password) {
		const credentials = String.fromCharCode(...new TextEncoder().encode(`${username}:${password}`));
		headers.Authorization = "Basic " + btoa(credentials);
	}

	const upstream = await fetch(endpoint, { method: "POST", headers, body: await request.text() });
	return {
		status: upstream.status,
		headers: { "Content-Type": upstream.headers.get("content-type") ?? "text/plain" },
		body: await upstream.text(),
	};
}
