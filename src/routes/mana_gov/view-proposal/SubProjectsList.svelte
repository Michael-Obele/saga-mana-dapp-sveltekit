<!-- src/routes/mana_gov/view-proposal/SubProjectsList.svelte -->
<script lang="ts">
  import type { SubProject, Epic, Task, RolesManaHour } from '@prisma/client';

  export let subProjects: (SubProject & {
    epics: (Epic & {
      tasks: (Task & {
        rolesManaHours: RolesManaHour[];
      })[];
    })[];
  })[] = [];
</script>

<div>
  <h3 class="mt-4 text-lg font-semibold text-amber-900">Sub-Projects:</h3>
  {#if subProjects.length === 0}
    <p class="text-amber-700">No sub-projects found for this proposal.</p>
  {:else}
    <ul class="ml-6 list-inside list-disc text-amber-800">
      {#each subProjects as subProject (subProject.id)}
        <li>
          <h4 class="text-md font-medium">{subProject.subProjectName}</h4>
          
          <!-- Epics List -->
          <div class="text-amber-800">
            <h5 class="mt-2 text-sm font-semibold">Epics:</h5>
            {#if subProject.epics.length === 0}
              <p class="ml-4">No epics found for this sub-project.</p>
            {:else}
              <ul class="ml-6 list-inside list-disc">
                {#each subProject.epics as epic (epic.id)}
                  <li>
                    <span class="font-medium">{epic.epicName}</span>
                    
                    <!-- Tasks List -->
                    <div class="text-amber-800">
                      <h6 class="mt-2 text-xs font-semibold">Tasks:</h6>
                      {#if epic.tasks.length === 0}
                        <p class="ml-4">No tasks found for this epic.</p>
                      {:else}
                        <ul class="ml-6 list-inside list-disc">
                          {#each epic.tasks as task (task.id)}
                            <li>
                              <span class="font-medium">{task.taskName}</span> - MANA Allocated: {task.manaTokenAllocated}
                              
                              <!-- Roles and Mana Hours List -->
                              <div class="text-amber-800">
                                <h6 class="mt-2 text-xs font-semibold">Roles and Mana Hours:</h6>
                                {#if task.rolesManaHours.length === 0}
                                  <p class="ml-4">No roles and mana hours found for this task.</p>
                                {:else}
                                  <ul class="ml-6 list-inside list-disc">
                                    {#each task.rolesManaHours as roleManaHour (roleManaHour.id)}
                                      <li>
                                        <span class="font-medium">{roleManaHour.roleName}</span> - Mana Hours: {roleManaHour.manaHours}
                                      </li>
                                    {/each}
                                  </ul>
                                {/if}
                              </div>
                            </li>
                          {/each}
                        </ul>
                      {/if}
                    </div>
                  </li>
                {/each}
              </ul>
            {/if}
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>
