<!-- src/routes/mana_gov/components/ProjectDetailsModal.svelte -->
<script lang="ts">
  import type { Project } from '../types/types';

  export let project: Project;
  export let closeModal: () => void;
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
  <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-2xl font-bold">{project.title}</h2>
      <button
        on:click={closeModal}
        class="text-gray-500 hover:text-gray-700"
      >
        &times; <!-- Close button -->
      </button>
    </div>

    <!-- Project Details -->
    <div class="mb-4">
      <p><strong>Total Mana Hours:</strong> {project.totalManaHours}</p>
      <p><strong>Your Mana Hours:</strong> {project.manaHours.find(mana => mana.userId)?.hours || 0}</p>
      <p><strong>Voting Power:</strong> {project.votingPower}</p>
    </div>

    <!-- Additional Project Info -->
    <div class="mb-4">
      <h3 class="font-semibold">Description</h3>
      <p>{project.description || 'No description available.'}</p>
    </div>

    <div class="mb-4">
      <h3 class="font-semibold">Team Members</h3>
      <ul class="list-disc list-inside">
        {#if project.teamMembers && project.teamMembers.length > 0}
          {#each project.teamMembers as member, index (index)}
            <li>{member.name}</li>
          {/each}
        {:else}
          <li>No team members assigned yet.</li>
        {/if}
      </ul>
    </div>

    <!-- Actions -->
    <div class="flex justify-end">
      <button
        on:click={closeModal}
        class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-blue-600"
      >
        Close
      </button>
    </div>
  </div>
</div>
