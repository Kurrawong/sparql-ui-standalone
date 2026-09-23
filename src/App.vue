<script lang="ts" setup>
import AppShell from "./components/AppShell.vue";
import SparqlEditor from "./components/SparqlEditor.vue";
</script>

<template>
	<AppShell title="SPARQL Query Editor">
		<SparqlEditor />
		<template #footer>
			<p class="text-center">
				sparql-ui-standalone —
				<a
					href="https://github.com/Kurrawong/sparql-ui-standalone"
					target="_blank"
					rel="noopener noreferrer"
					class="underline"
					>GitHub</a
				>
			</p>
		</template>
	</AppShell>
</template>
