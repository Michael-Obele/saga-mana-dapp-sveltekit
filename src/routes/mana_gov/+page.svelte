<!-- src/routes/mana_gov/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import GovPower from './components/GovPower.svelte';
  import ProposalList from './components/ProposalList.svelte';
  import ProjectList from './components/ProjectList.svelte';

  let proposals = [];
  let projects = [];
  let govPower = 0;

  onMount(async () => {
    // TODO: Fetch data from your API
    // Example:
    // proposals = await fetchProposals();
    // projects = await fetchProjects();
    // govPower = await fetchGovPower();
  });
</script>

<div class="space-y-8">
  <h1 class="text-3xl font-bold">Mana Governance Dashboard</h1>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <div class="col-span-full lg:col-span-1">
      <GovPower power={govPower} />
    </div>
    
    <div class="col-span-full lg:col-span-2">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Active Proposals</h2>
        <ProposalList {proposals} />
      </div>
    </div>
    
    <div class="col-span-full">
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Current Projects</h2>
        <ProjectList {projects} />
      </div>
    </div>
  </div>
</div>
