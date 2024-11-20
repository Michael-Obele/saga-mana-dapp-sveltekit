<!-- src/routes/mana_gov/components/AssignedTasks.svelte -->
<script lang="ts">
  import type { Project, Task } from '../types/types';

  export let projects: Project[] = [];
  export let userId: number;

  let searchQuery = '';

  // Filter projects where the user has assigned mana hours
  $: userProjects = projects.filter((project) =>
    project.manaHours?.some((mana) => mana.userId === userId)
  );

  // Filter projects and tasks based on search query and user assignment
  $: filteredProjects = userProjects.filter((project) =>
    project.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.subProjects?.some(subProject =>
      subProject.subProjectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      subProject.epics?.some(epic =>
        epic.epicName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        epic.tasks.some(task =>
          task.taskName.toLowerCase().includes(searchQuery.toLowerCase()) &&
          task.assignedTo === userId
        )
      )
    )
  );
</script>

<div class="assigned-tasks">
  <h2 class="text-orange-500">Assigned Tasks</h2>

  <!-- Search Box -->
  <div class="mb-4">
    <input
      type="text"
      placeholder="Search by project, subproject, epic, or task title"
      bind:value={searchQuery}
      class="px-3 py-2 border border-orange-500 rounded-lg bg-purple-900 text-white"
    />
  </div>

  <!-- Project List with Tasks -->
  {#if filteredProjects.length > 0}
    <div>
      {#each filteredProjects as project (project.id)}
        <div class="mb-6">
          <!-- Project Details -->
          <h3 class="font-semibold text-orange-500">
            {project.projectName}
          </h3>

          <!-- SubProjects and Epics -->
          {#if project.subProjects}
            {#each project.subProjects as subProject (subProject.id)}
              <div>
                <h4 class="text-orange-300">
                  {subProject.subProjectName}
                </h4>
                {#if subProject.epics}
                  {#each subProject.epics as epic (epic.id)}
                    <div>
                      <h5 class="text-orange-200">{epic.epicName}</h5>

                      <!-- Task List -->
                      <ul class="list-disc list-inside">
                        {#each epic.tasks.filter((task: Task) => task.assignedTo === userId) as task (task.id)}
                          <li class="ml-4 text-white">
                            {task.taskName}
                          </li>
                        {/each}
                      </ul>
                    </div>
                  {/each}
                {/if}
              </div>
            {/each}
          {/if}
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-white">No tasks assigned to you.</p>
  {/if}
</div>
