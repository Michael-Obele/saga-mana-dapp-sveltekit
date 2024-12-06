<script lang="ts">
	import Header from '$lib/components/blocks/Header.svelte';
import Navbar from '$lib/components/blocks/Navbar.svelte';
import '../app.css';
	let { children } = $props();
</script>

<!-- <Navbar/> -->

<Header/>
{@render children()}
