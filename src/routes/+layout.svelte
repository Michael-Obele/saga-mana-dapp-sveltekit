<script lang="ts">
	import Navbar from '$lib/components/blocks/Navbar.svelte';
import '../app.css';
	let { children } = $props();
</script>

<Navbar/>
{@render children()}
