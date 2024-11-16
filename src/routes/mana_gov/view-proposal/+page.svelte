<!-- src/routes/mana_gov/view-proposal/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import type { Proposal } from '@prisma/client';
  import { authenticate, fetchUserProposalsWithDetails, type FetchUserProposalsWithDetailsResponse } from '$lib/actions';
  import SubProjectsList from './SubProjectsList.svelte';

  let proposals: FetchUserProposalsWithDetailsResponse['proposals'] = [];
  let selectedProposalId: number | null = null;
  let session = false;
  let username = '';
  let error = false;
  let message: string | undefined = '';

  onMount(async () => {
    const authResult = await authenticate();
    session = authResult.success;
    username = authResult.user?.username || '';

    if (authResult.success && authResult.user?.username) {
      const projectResult = await fetchUserProposalsWithDetails(authResult.user.username);

      if (projectResult.success === false) {
        error = true;
        message = projectResult.message;
      } else {
        error = false;
        message = projectResult.message || '';
        proposals = projectResult.proposals ?? [];
      }
    }
  });

  function handleProposalClick(proposalId: number) {
    // Toggle selection
    selectedProposalId = selectedProposalId === proposalId ? null : proposalId;
  }
</script>

<div class="min-h-screen bg-amber-50 px-4 py-8">
  <h1 class="mb-8 text-center text-3xl font-bold text-amber-900">My Projects</h1>

  {#if session}
    {#if error}
      <div class="font-semibold text-red-500">{message}</div>
    {/if}
    
    {#if proposals.length > 0}
      <ul class="space-y-4">
        {#each proposals as proposal (proposal.id)}
          <li class="rounded-lg bg-white p-4 shadow-md">
            <button
              on:click={() => handleProposalClick(proposal.id)}
              class="w-full text-left text-lg font-medium text-amber-900 hover:underline"
            >
              {proposal.title}
            </button>

            {#if selectedProposalId === proposal.id}
              <div class="mt-4 border-t border-amber-200 pt-4">
                <p class="font-medium text-amber-700">
                  Description: <span class="font-normal text-amber-900">{proposal.description}</span>
                </p>
                <p class="font-medium text-amber-700">
                  MANA Allocated: <span class="font-normal text-amber-900">{proposal.manaTokenAllocated}</span>
                </p>

                <SubProjectsList subProjects={proposal.subProjects} />
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    {:else}
      <div class="flex h-64 flex-col items-center justify-center">
        <p class="text-lg font-medium text-amber-900">No projects available. Please create one.</p>
        <a
          href="/mana_gov/create-project"
          class="mt-4 rounded-lg bg-amber-400 px-4 py-2 text-white hover:bg-amber-500"
        >
          Create Project
        </a>
      </div>
    {/if}
  {:else}
    <div class="flex h-64 flex-col items-center justify-center">
      <p class="text-lg font-medium text-amber-900">Please log in to view your projects.</p>
    </div>
  {/if}
</div>
