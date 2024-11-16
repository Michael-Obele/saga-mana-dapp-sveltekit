<!-- src/routes/mana_gov/create-project/+page.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { createProject, authenticate, logOut } from '$lib/actions';

  let message: string | undefined = '';
  let session = false;
  let username = '';
  let error = false;

  async function fetchAuth() {
    const authResult = await authenticate();
    session = authResult.success;
    username = authResult.user?.username || '';
  }

  onMount(() => {
    fetchAuth();
  });

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    console.log(formData.get("submittedBy"));
    console.log(formData.get("title"));

    const result = await createProject(formData);

    if (result.success) {
      console.log("Project created successfully");
      error = false;
      message = result.message;
    } else {
      error = true;
      message = result.message;
      console.error(result.message);
    }
  }
</script>

{#if session}
  <div class="min-h-screen bg-[#270927] px-4 py-8 text-white">
    <h2 class="mb-6 text-2xl font-bold text-white">Create New Project</h2>
    <form on:submit={handleSubmit} class="space-y-4">
      <div>
        <Label for="title" class="block text-sm font-medium text-gray-300">
          Title:
        </Label>
        <Input
          type="text"
          id="title"
          name="title"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <Label for="description" class="block text-sm font-medium text-gray-300">
          Description:
        </Label>
        <Textarea
          id="description"
          name="description"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <Label for="manaTokenAllocated" class="block text-sm font-medium text-gray-300">
          MANA Tokens Allocated:
        </Label>
        <Input
          type="number"
          id="manaTokenAllocated"
          name="manaTokenAllocated"
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <Label for="submittedBy" class="block text-sm font-medium text-gray-300">
          Submitted By:
        </Label>
        <Input
          type="text"
          id="submittedBy"
          name="submittedBy"
          value={username}
          disabled
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <Input
          type="hidden"
          id="submittedBy"
          name="submittedBy"
          value={username}
          required
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <Label for="targetApprovalDate" class="block text-sm font-medium text-gray-300">
          Target Approval Date (optional):
        </Label>
        <Input
          type="date"
          id="targetApprovalDate"
          name="targetApprovalDate"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <Label for="budgetWindowLow" class="block text-sm font-medium text-gray-300">
          Budget Window Low (optional):
        </Label>
        <Input
          type="number"
          id="budgetWindowLow"
          name="budgetWindowLow"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <Label for="budgetWindowHigh" class="block text-sm font-medium text-gray-300">
          Budget Window High (optional):
        </Label>
        <Input
          type="number"
          id="budgetWindowHigh"
          name="budgetWindowHigh"
          class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        class="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Create Project
      </button>
    </form>
    {#if message}
      <div class={`mt-4 p-4 rounded-md ${error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
        {message}
      </div>
    {/if}
  </div>
{:else}
  <div class="min-h-screen flex items-center justify-center bg-[#270927]">
    <div class="text-center text-white">
      <h1 class="text-2xl font-bold mb-4">Please log in to create a project</h1>
      <p class="text-gray-300">You must be logged in to access this page.</p>
    </div>
  </div>
{/if}
