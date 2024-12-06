<script lang="ts">
	import Navbar from './components/Navbar.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<Navbar />
<div class="min-h-screen">
	<main class="mx-auto px-4 py-8">
		{@render children?.()}
	</main>
</div>
