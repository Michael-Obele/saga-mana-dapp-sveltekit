<script lang="ts">
	import Navbar from './components/Navbar.svelte';
</script>

<Navbar />
<div class="min-h-screen">
	<main class="mx-auto px-4 py-8">
		<slot />
	</main>
</div>
