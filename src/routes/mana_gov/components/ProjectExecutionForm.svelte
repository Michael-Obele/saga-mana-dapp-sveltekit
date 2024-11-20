<!-- src/routes/mana_gov/components/ProjectExecutionForm.svelte -->
<script lang="ts">
  import type { ProjectExecution, TaskExecution } from './types';
  import { createEventDispatcher } from 'svelte';

  export let projectPlans: { id: number; projectName: string }[];
  
  const dispatch = createEventDispatcher<{
    addProjectExecution: ProjectExecution;
  }>();

  let selectedProjectPlanId: number | null = null;
  let jsonFile: File | null = null;
  let validationError: string | null = null;

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    jsonFile = target.files?.[0] || null;
  }

  // Function to validate the structure and data types of the project execution JSON
  function validateProjectExecutionJson(json: any): string | null {
    if (typeof json !== 'object' || json === null) {
      return 'Invalid project execution format. Expected an object.';
    }

    if (typeof json.projectPlanId !== 'number') {
      return 'Invalid or missing "projectPlanId".';
    }

    if (!Array.isArray(json.tasks)) {
      return 'Invalid project execution format. Expected an array of tasks.';
    }

    for (const task of json.tasks) {
      if (typeof task.id !== 'number') {
        return 'Invalid or missing "id" for task.';
      }
      if (typeof task.taskPlanId !== 'number') {
        return 'Invalid or missing "taskPlanId" for task.';
      }
      if (typeof task.actualManaHours !== 'number') {
        return 'Invalid or missing "actualManaHours" for task.';
      }
    }

    if (!Array.isArray(json.peerVotes)) {
      return 'Invalid project execution format. Expected an array of peer votes.';
    }

    for (const vote of json.peerVotes) {
      if (typeof vote.id !== 'number') {
        return 'Invalid or missing "id" for peer vote.';
      }
      if (typeof vote.userId !== 'number') {
        return 'Invalid or missing "userId" for peer vote.';
      }
      if (typeof vote.vote !== 'boolean') {
        return 'Invalid or missing "vote" for peer vote.';
      }
    }

    return null; // No validation errors
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!selectedProjectPlanId) {
      validationError = 'Please select a project plan.';
      return;
    }

    if (!jsonFile) {
      validationError = 'Please upload a valid project execution JSON file.';
      return;
    }

    // Handle reading and validating the JSON file
    const fileContent = await jsonFile.text();
    let parsedJson;
    try {
      parsedJson = JSON.parse(fileContent);
    } catch (err) {
      validationError = 'Invalid JSON file format.';
      return;
    }

    // Validate the JSON structure
    const validationMessage = validateProjectExecutionJson(parsedJson);
    if (validationMessage) {
      validationError = validationMessage;
      return;
    }

    const projectExecution: ProjectExecution = {
      projectPlanId: selectedProjectPlanId,
      actualManaHours: parsedJson.actualManaHours,
      tasks: parsedJson.tasks as TaskExecution[],
      peerVotes: parsedJson.peerVotes,
      id: parsedJson.id || 0, // Default ID if not provided
    };

    dispatch('addProjectExecution', projectExecution);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label for="projectPlan" class="block text-sm font-medium text-gray-700">
      Select Project Plan
    </label>
    <select
      id="projectPlan"
      bind:value={selectedProjectPlanId}
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value={null}>Select a project plan...</option>
      {#each projectPlans as plan}
        <option value={plan.id}>{plan.projectName}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="jsonFile" class="block text-sm font-medium text-gray-700">
      Upload Project Execution JSON
    </label>
    <input
      type="file"
      id="jsonFile"
      accept=".json"
      on:change={handleFileChange}
      class="mt-1 block w-full"
    />
  </div>

  {#if validationError}
    <div class="text-red-600 text-sm">{validationError}</div>
  {/if}

  <div>
    <button
      type="submit"
      class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
      Submit Project Execution
    </button>
  </div>
</form>
