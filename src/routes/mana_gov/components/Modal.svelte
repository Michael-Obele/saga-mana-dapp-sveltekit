<script lang="ts">
	export let isOpen: boolean = false;
	export let onClose: () => void;
	export let title: string;
	export let message: string;
</script>

{#if isOpen}
	<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
		<div
			class="bg-purple-custom border-orange-custom w-full max-w-md rounded-lg border-2 p-6 shadow-lg"
		>
			<p class="text-center text-white">{message}</p>
			<div class="mt-4 flex justify-center">
				<button
					class="bg-orange-custom hover:bg-orange-hover rounded-lg px-4 py-2 text-white"
					on:click={onClose}
				>
					Close
				</button>
			</div>
		</div>
	</div>
{/if}
