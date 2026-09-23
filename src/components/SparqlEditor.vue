<script lang="ts" setup>
import { computed, onMounted, ref, useTemplateRef } from "vue";
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
import { sparqlEndpoints as defaultEndpoints, type SparqlEndpointConfig } from "../endpoints";
import { sampleQueries as defaultSampleQueries, type SampleQuery } from "../queries";
import { getSelectedEndpoint, setSelectedEndpoint, selectedEndpointName } from "../composables/useSparqlEndpoint";

const props = defineProps<{
	/** Overrides the built-in endpoint list — e.g. a downstream app's own config. */
	endpoints?: SparqlEndpointConfig[];
	/** Overrides the built-in sample-query list. */
	sampleQueries?: SampleQuery[];
}>();

const endpoints = computed(() => props.endpoints ?? defaultEndpoints);
const queries = computed(() => props.sampleQueries ?? defaultSampleQueries);

const containerRef = useTemplateRef<HTMLDivElement>("container");
const sidebarOpen = ref(true);

let yasgui: Yasgui | undefined;

function authHeaders(username?: string, password?: string): Record<string, string> {
	if (username && password) {
		return { Authorization: "Basic " + btoa(`${username}:${password}`) };
	}
	return {};
}

function handleEndpointChange(event: Event) {
	setSelectedEndpoint((event.target as HTMLSelectElement).value);

	const entry = getSelectedEndpoint(endpoints.value);
	const tab = yasgui?.getTab();
	if (!tab) return;

	tab.setEndpoint(entry.endpoint);
	tab.setRequestConfig({ headers: authHeaders(entry.username, entry.password) });
}

function loadSampleQuery(entry: SampleQuery) {
	const tab = yasgui?.getTab();
	if (!tab) return;

	tab.setQuery(entry.query);
}

onMounted(() => {
	if (endpoints.value.length === 0) return;

	const initial = getSelectedEndpoint(endpoints.value);
	selectedEndpointName.value = initial.name;

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
		<p v-if="endpoints.length === 0" class="p-3 text-sm">No endpoints configured.</p>

		<template v-else>
			<div class="flex flex-wrap items-center gap-4 p-3">
				<div class="flex items-center gap-2">
					<label for="sparql-endpoint-select" class="font-medium">Endpoint</label>
					<select
						id="sparql-endpoint-select"
						:value="selectedEndpointName"
						class="bg-background px-2 py-1"
						@change="handleEndpointChange"
					>
						<option v-for="entry in endpoints" :key="entry.name" :value="entry.name">
							{{ entry.name }}
						</option>
					</select>
				</div>

				<button
					v-if="queries.length > 0"
					type="button"
					class="flex items-center gap-1 rounded border border-border bg-background px-2 py-1 text-sm"
					@click="sidebarOpen = !sidebarOpen"
				>
					Sample queries
					<svg
						class="size-3 transition-transform"
						:class="{ 'rotate-180': !sidebarOpen }"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M6 9l6 6 6-6" />
					</svg>
				</button>
			</div>

			<div class="flex items-start gap-4">
				<aside v-if="sidebarOpen && queries.length > 0" class="w-72 shrink-0 rounded border border-border">
					<ul class="divide-y divide-border">
						<li v-for="entry in queries" :key="entry.title">
							<button
								type="button"
								class="block w-full px-3 py-2 text-left hover:bg-border/30"
								@click="loadSampleQuery(entry)"
							>
								<div class="text-sm font-medium">{{ entry.title }}</div>
								<div class="text-xs opacity-70">{{ entry.description }}</div>
							</button>
						</li>
					</ul>
				</aside>
				<div ref="container" class="min-w-0 flex-1" />
			</div>
		</template>
	</div>
</template>

<style>
/*
 * Yasgui builds its results/editor UI as plain DOM (document.createElement),
 * not through Vue templates, so Vue's scoped CSS has nothing to attach to.
 *
 * Several of the rules below only exist because Tailwind's preflight resets
 * margin/padding/border globally (a `* { margin: 0; ... }` rule in
 * @layer base), which also strips browser defaults Yasgui quietly relies on
 * — its own hosted demo has no such reset, so these are invisible there.
 */

/* Yasgui never sets its own line-height, so its table cells inherit our
   app-wide line-height: 1.5 (meant for prose) instead of the browser's
   normal ~1.2x-font-size default, making every row taller than intended. */
.yasgui {
	line-height: normal;
}

/* "Simple view" / "Ellipse" toggles: the checkbox's own default margin
   would normally create this gap, but Tailwind's preflight zeroes it. */
.yasgui .tableControls .switch {
	gap: 6px;
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
