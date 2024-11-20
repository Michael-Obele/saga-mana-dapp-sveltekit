<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from '$lib/components/app-sidebar.svelte';
	import './app.css';
	let { children } = $props();

	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	const sidebar = useSidebar();
</script>

<Sidebar.Provider>
	<AppSidebar />
	<main>
		<!-- <div class="bg-[#3F003F] text-white">
			<Sidebar.Trigger />
		</div> -->
		<div class="bg-gradient-to-b from-[#2A092A] to-[#3F003F] p-12 text-white">
			{@render children?.()}
		</div>
	</main>
</Sidebar.Provider>
