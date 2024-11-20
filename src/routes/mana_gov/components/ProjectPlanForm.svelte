<!-- src/routes/mana_gov/components/ProjectPlanForm.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  interface DeveloperHoursAllocated {
    developerName: string;
    totalEstimatedManaHours: number;
    totalAllocatedMana: number;
    subProjects: SubProjectPlan[];
  }

  interface SubProjectPlan {
    id: number;
    subProjectName: string;
    epics: EpicPlan[];
  }

  interface EpicPlan {
    id: number;
    subProjectId: number;
    epicName: string;
    tasks: TaskPlan[];
  }

  interface TaskPlan {
    id: number;
    epicId: number;
    taskName: string;
    rolesManaHours: TaskRoleManaHours[];
  }

  interface TaskRoleManaHours {
    roleName: string;
    manaHours: number;
  }

  export let proposals: { id: number; title: string }[];

  const dispatch = createEventDispatcher<{
    addProjectPlan: {
      proposalId: number;
      projectName: string;
      developers: DeveloperHoursAllocated[];
    };
  }>();

  let selectedProposalId: number | null = null;
  let projectName = '';
  let jsonFile: File | null = null;
  let validationError: string | null = null;

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    jsonFile = target.files?.[0] || null;
  }

  // Function to validate the structure and data types of the project plan JSON
  function validateProjectPlanJson(json: any): string | null {
    if (!json || typeof json !== 'object' || !json.developers) {
      return 'Invalid project plan format. Expected a JSON object with developer data.';
    }

    if (!Array.isArray(json.developers)) {
      return 'Invalid format for developers. Expected an array of developers.';
    }

    for (const developer of json.developers) {
      if (typeof developer.developerName !== 'string') {
        return 'Invalid or missing "developerName" for developer.';
      }
      if (typeof developer.totalEstimatedManaHours !== 'number') {
        return `Invalid or missing "totalEstimatedManaHours" for ${developer.developerName}.`;
      }
      if (typeof developer.totalAllocatedMana !== 'number') {
        return `Invalid or missing "totalAllocatedMana" for ${developer.developerName}.`;
      }
      if (!Array.isArray(developer.subProjects)) {
        return `Invalid or missing "subProjects" for ${developer.developerName}.`;
      }
      for (const subProject of developer.subProjects) {
        if (typeof subProject.id !== 'number') {
          return `Invalid or missing "id" for subproject of ${developer.developerName}.`;
        }
        if (typeof subProject.subProjectName !== 'string') {
          return `Invalid or missing "subProjectName" for subproject of ${developer.developerName}.`;
        }
        if (!Array.isArray(subProject.epics)) {
          return `Invalid or missing "epics" for subproject of ${developer.developerName}.`;
        }
      }
    }
    return null; // No validation errors
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (!selectedProposalId) {
      validationError = 'Please select a proposal.';
      return;
    }

    if (!projectName.trim()) {
      validationError = 'Please enter a project name.';
      return;
    }

    if (!jsonFile) {
      validationError = 'Please upload a valid project plan JSON file.';
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
    const validationMessage = validateProjectPlanJson(parsedJson);
    if (validationMessage) {
      validationError = validationMessage;
      return;
    }

    dispatch('addProjectPlan', {
      proposalId: selectedProposalId,
      projectName,
      developers: parsedJson.developers,
    });
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <div>
    <label for="proposal" class="block text-sm font-medium text-gray-700">
      Select Proposal
    </label>
    <select
      id="proposal"
      bind:value={selectedProposalId}
      class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
    >
      <option value={null}>Select a proposal...</option>
      {#each proposals as proposal}
        <option value={proposal.id}>{proposal.title}</option>
      {/each}
    </select>
  </div>

  <div>
    <label for="projectName" class="block text-sm font-medium text-gray-700">
      Project Name
    </label>
    <input
      type="text"
      id="projectName"
      bind:value={projectName}
      class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      placeholder="Enter project name"
    />
  </div>

  <div>
    <label for="jsonFile" class="block text-sm font-medium text-gray-700">
      Upload Project Plan JSON
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
      Submit Project Plan
    </button>
  </div>
</form>
