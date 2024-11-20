<!-- src/routes/mana_gov/create-proposal/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import CreateSubProjectForm from './proposal-form.svelte';
  import { authenticate, fetchUserProposals } from '$lib/actions';

  interface Proposal {
    id: number;
    title: string;
  }

  let proposals: Proposal[] = [];
  let selectedProject = '';
  let session = false;
  let username = '';
  let error = false;
  let message: string | undefined = '';

  onMount(async () => {
    const authResult = await authenticate();
    session = authResult.success;
    username = authResult.user?.username || '';

    if (authResult.success && authResult.user?.username) {
      const projectResult = await fetchUserProposals(authResult.user.username);
      if (projectResult.success === false) {
        error = true;
        message = projectResult.message;
      } else {
        error = false;
        message = projectResult.message || '';
        if (projectResult.proposals) {
          proposals = projectResult.proposals.map(p => ({ id: p.id, title: p.title }));
        }
      }
    }
  });

  function handleProposalChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    selectedProject = target.value;
  }
</script>

<div class="flex min-h-screen flex-col justify-center gap-5 bg-[#270927] p-4">
  {#if session}
    <div class="mx-auto">
      <h4 class="text-center text-2xl font-bold capitalize text-white">Choose a Project</h4>
      <select
        name="project"
        id="project"
        class="block w-[300px] rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-900 focus:border-amber-500 focus:ring-amber-500"
        on:change={handleProposalChange}
        value={selectedProject}
      >
        <option value="" disabled>Select a proposal</option>
        {#each proposals as proposal}
          <option value={proposal.id}>
            {proposal.title}
          </option>
        {/each}
      </select>
    </div>

    <div>
      {#if selectedProject}
        <CreateSubProjectForm proposalId={selectedProject} />
      {/if}
    </div>
  {:else}
    <div class="min-h-screen px-4 py-8 text-black">
      <h2 class="mb-6 text-2xl font-bold text-white">Create New Proposal</h2>
      <p class="text-white">Please sign in to create a new proposal</p>
    </div>
  {/if}
</div>
