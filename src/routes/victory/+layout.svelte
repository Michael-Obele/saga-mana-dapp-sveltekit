<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import "./app.css";
	let { children } = $props();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main>
		<Sidebar.Trigger />
		<div class="bg-gradient-to-b from-[#2A092A] to-[#3F003F] p-12 text-white">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>