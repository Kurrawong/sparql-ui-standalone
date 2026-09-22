<script lang="ts" setup>
withDefaults(
	defineProps<{
		title?: string;
	}>(),
	{ title: "SPARQL Query UI" },
);
</script>

<template>
	<div class="flex min-h-screen flex-col bg-background text-foreground">
		<header class="flex items-center gap-3 border-b border-border px-6 py-4">
			<slot name="logo" />
			<h1 class="text-lg font-semibold">{{ title }}</h1>
		</header>
		<main class="flex-1">
			<slot />
		</main>
		<footer class="px-6 py-4 text-sm opacity-70">
			<slot name="footer" />
		</footer>
	</div>
</template>
