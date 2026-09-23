<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue";
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
import { sparqlEndpoints } from "../endpoints.config";
import { getSelectedEndpoint, setSelectedEndpoint, selectedEndpointName } from "../composables/useSparqlEndpoint";

const containerRef = useTemplateRef<HTMLDivElement>("container");

let yasgui: Yasgui | undefined;

function authHeaders(username?: string, password?: string): Record<string, string> {
	if (username && password) {
		return { Authorization: "Basic " + btoa(`${username}:${password}`) };
	}
	return {};
}

function handleEndpointChange(event: Event) {
	setSelectedEndpoint((event.target as HTMLSelectElement).value);

	const entry = getSelectedEndpoint();
	const tab = yasgui?.getTab();
	if (!tab) return;

	tab.setEndpoint(entry.endpoint);
	tab.setRequestConfig({ headers: authHeaders(entry.username, entry.password) });
}

onMounted(() => {
	const initial = getSelectedEndpoint();
	yasgui = new Yasgui(containerRef.value!, {
		requestConfig: {
			endpoint: initial.endpoint,
			method: "POST",
			headers: authHeaders(initial.username, initial.password),
		},
		copyEndpointOnNewTab: true,
		autofocus: true,
	});
});
</script>

<template>
	<div class="sparql-editor px-5">
		<div class="flex items-center gap-2 pb-3">
			<label for="sparql-endpoint-select" class="text-sm font-medium">Endpoint</label>
			<select
				id="sparql-endpoint-select"
				:value="selectedEndpointName"
				class="rounded border border-border bg-background px-2 py-1 text-sm"
				@change="handleEndpointChange"
			>
				<option v-for="entry in sparqlEndpoints" :key="entry.name" :value="entry.name">
					{{ entry.name }}
				</option>
			</select>
		</div>
		<div ref="container" />
	</div>
</template>

<style>
/*
 * Yasgui builds its results/editor UI as plain DOM (document.createElement),
 * not through Vue templates, so Vue's scoped CSS has nothing to attach to
 */

/* "Simple view" / "Ellipse" toggles, default label text and checkbox have no gap, kind of ugly. */
.yasgui .tableControls .switch {
	gap: 6px;
}

/* Tailwind's preflight strips the native border off every input and Yasgui never sets its own, which makes it confusing. */
.yasgui .tableFilter {
	border: 1px solid var(--color-border);
	border-radius: 4px;
	padding-inline: 6px;
}

/* Dead link to Triply's docs, and an error-state link not useful here. */
.yasgui .yasr_external_ref_btn,
.yasgui .yasr_tryQuery {
	display: none !important;
}

/* Endpoint is chosen via our own dropdown above, and the request-config
   panel (headers/method/graphs, each removable via an "X" button) isn't
   exposed to users of this app — both replaced by app-configured endpoints. */
.yasgui .controlbar .autocompleteWrapper,
.yasgui .tabContextButton,
.yasgui .tabMenu {
	display: none !important;
}
</style>
