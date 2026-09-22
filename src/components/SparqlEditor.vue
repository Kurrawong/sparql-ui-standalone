<script lang="ts" setup>
import { onMounted, useTemplateRef } from "vue";
import Yasgui from "@triply/yasgui";
import "@triply/yasgui/build/yasgui.min.css";
import { getSparqlEndpoint } from "../composables/useSparqlEndpoint";

const props = defineProps<{
	/** Overrides the resolved default endpoint (env/localStorage/query param). */
	endpoint?: string;
}>();

const containerRef = useTemplateRef<HTMLDivElement>("container");

onMounted(() => {
	new Yasgui(containerRef.value!, {
		requestConfig: {
			endpoint: props.endpoint || getSparqlEndpoint(),
			method: "POST",
		},
		copyEndpointOnNewTab: true,
		autofocus: true,
	});
});
</script>

<template>
	<div ref="container" class="sparql-editor px-5" />
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
</style>
