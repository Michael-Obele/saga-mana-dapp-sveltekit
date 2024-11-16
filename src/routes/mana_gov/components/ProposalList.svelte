<!-- src/routes/mana_gov/components/ProposalList.svelte -->
<script lang="ts">
  export let proposals: any[] = [];
</script>

{#if proposals.length === 0}
  <p class="text-gray-500">No active proposals</p>
{:else}
  <div class="space-y-4">
    {#each proposals as proposal}
      <div class="border rounded-lg p-4 hover:bg-gray-50">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold">{proposal.title}</h3>
            <p class="text-gray-600 mt-1">{proposal.description}</p>
          </div>
          <div class="text-sm text-gray-500">
            {new Date(proposal.createdAt).toLocaleDateString()}
          </div>
        </div>
        <div class="mt-4 flex space-x-4">
          <a
            href={`/mana_gov/view-proposal?id=${proposal.id}`}
            class="text-indigo-600 hover:text-indigo-800"
          >
            View Details
          </a>
          <a
            href={`/mana_gov/voting?proposalId=${proposal.id}`}
            class="text-green-600 hover:text-green-800"
          >
            Vote
          </a>
        </div>
      </div>
    {/each}
  </div>
{/if}
