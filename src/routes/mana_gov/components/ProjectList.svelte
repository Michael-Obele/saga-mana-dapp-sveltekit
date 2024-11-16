<!-- src/routes/mana_gov/components/ProjectList.svelte -->
<script lang="ts">
  export let projects: any[] = [];
</script>

{#if projects.length === 0}
  <p class="text-gray-500">No active projects</p>
{:else}
  <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
    {#each projects as project}
      <div class="rounded-lg border p-4 hover:bg-gray-50">
        <h3 class="text-lg font-semibold">{project.title}</h3>
        <p class="mt-1 line-clamp-2 text-gray-600">{project.description}</p>
        <div class="mt-4">
          <div class="flex justify-between text-sm text-gray-500">
            <span>Status: {project.status}</span>
            <span>Progress: {project.progress}%</span>
          </div>
          <div class="mt-2 h-2 rounded-full bg-gray-200">
            <div
              class="h-full rounded-full bg-indigo-600"
              style="width: {project.progress}%"
            ></div>
          </div>
        </div>
        <div class="mt-4">
          <a
            href={`/mana_gov/project/${project.id}`}
            class="text-indigo-600 hover:text-indigo-800"
          >
            View Details
          </a>
        </div>
      </div>
    {/each}
  </div>
{/if}
