<!-- src/routes/mana_gov/components/GovPower.svelte -->
<script lang="ts">
  export let power: number = 0;
</script>

<div class="bg-white rounded-lg shadow p-6">
  <h2 class="text-xl font-semibold mb-4">Governance Power</h2>
  <div class="text-4xl font-bold text-indigo-600">{power}</div>
  <p class="text-gray-600 mt-2">Your current voting power</p>
</div>
