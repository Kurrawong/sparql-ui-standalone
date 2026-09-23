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
		<slot name="header">
			<header class="flex items-center gap-3 border-b border-border px-6 py-4">
				<slot name="logo" />
				<h1 class="text-lg font-semibold">{{ title }}</h1>
			</header>
		</slot>
		<main class="flex-1">
			<slot />
		</main>
		<slot name="footer">
			<footer class="px-6 py-4 text-sm opacity-70" />
		</slot>
	</div>
</template>
