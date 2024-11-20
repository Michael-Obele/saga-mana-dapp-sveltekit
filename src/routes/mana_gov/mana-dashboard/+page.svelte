<!-- src/routes/mana_gov/mana-dashboard/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import ProposalList from '../components/ProposalList.svelte';
  import ProjectList from '../components/ProjectList.svelte';
  import AssignedTasks from '../components/AssignedTasks.svelte';

  let proposals = [];
  let projects = [];
  let tasks = [];
  let loading = true;
  let error = false;
  const userId = 123; // Example user ID, replace with actual logic

  onMount(async () => {
    try {
      const [proposalsRes, projectsRes, tasksRes] = await Promise.all([
        fetch('/api/proposals'),
        fetch('/api/projects'),
        fetch('/api/tasks'),
      ]);

      const [proposalsData, projectsData, tasksData] = await Promise.all([
        proposalsRes.json(),
        projectsRes.json(),
        tasksRes.json(),
      ]);

      proposals = proposalsData;
      projects = projectsData;
      tasks = tasksData;
    } catch (err) {
      error = true;
    } finally {
      loading = false;
    }
  });

  // Empty data for error states
  $: emptyProposals = [];
  $: emptyProjects = [];
  $: emptyTasks = [];
</script>

{#if loading}
  <p>Loading...</p>
{:else}
  <div>
    <!-- Header Section -->
    <header>
      <h1>Mana Effort Tracking App</h1>
      <p>Welcome, [User Name]</p>
    </header>

    <!-- Navigation Links -->
    <nav>
      <a href="/proposal-management">Proposal Management</a>
      <a href="/project-planning">Project Planning</a>
      <a href="/task-tracking">Task Tracking</a>
      <a href="/voting">Voting</a>
      <a href="/reports">Reports</a>
    </nav>

    <!-- Main Dashboard Section -->
    <div class="dashboard">
      <!-- Proposal List Section -->
      <section class="proposals">
        <h2>Proposals</h2>
        <ProposalList proposals={error ? emptyProposals : proposals} />
        <a href="/mana_gov/create-proposal" class="button">
          Create New Proposal
        </a>
      </section>

      <!-- Project List Section -->
      <section class="projects">
        <h2>Project Planning</h2>
        <ProjectList projects={error ? emptyProjects : projects} />
        <a href="#" class="button">
          View All Projects
        </a>
      </section>

      <!-- Assigned Tasks Section -->
      <section class="tasks">
        <h2>Your Tasks</h2>
        <AssignedTasks tasks={error ? emptyTasks : tasks} {userId} />
        <a href="#" class="button">
          View All Tasks
        </a>
      </section>
    </div>

    <!-- Footer Section -->
    <footer>
      <p>&copy; 2024 Mana DApp. All Rights Reserved.</p>
    </footer>
  </div>
{/if}
