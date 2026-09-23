import { ref } from "vue";
import { sparqlEndpoints, type SparqlEndpointConfig } from "../endpoints.config";

const STORAGE_KEY = "sparqlUiEndpointName";

function resolveInitialName(): string {
	const queryName = new URLSearchParams(window.location.search).get("endpoint");
	if (queryName) {
		localStorage.setItem(STORAGE_KEY, queryName);
		return queryName;
	}

	return localStorage.getItem(STORAGE_KEY) || sparqlEndpoints[0]?.name || "";
}

/** Reactive across the app, e.g. so the footer can show the active endpoint. */
export const selectedEndpointName = ref(resolveInitialName());

export function getSelectedEndpoint(): SparqlEndpointConfig {
	return sparqlEndpoints.find((entry) => entry.name === selectedEndpointName.value) ?? sparqlEndpoints[0];
}

export function setSelectedEndpoint(name: string): void {
	selectedEndpointName.value = name;
	localStorage.setItem(STORAGE_KEY, name);
}
