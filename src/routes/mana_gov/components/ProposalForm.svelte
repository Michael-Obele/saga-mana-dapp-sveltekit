<!-- src/routes/mana_gov/components/ProposalForm.svelte -->
<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import Modal from './Modal.svelte';
  import { Label } from '@/components/ui/label';
  import { Input } from '@/components/ui/input';

  export let loggedInUserId: string;

  const dispatch = createEventDispatcher<{
    addProposal: {
      title: string;
      description: string;
      manaHoursBudgeted: number;
      targetApprovalDate: string;
      submittedBy: string;
      developers?: Record<string, unknown>;
    };
  }>();

  let title = '';
  let description = '';
  let manaHoursBudgeted = 0;
  let targetApprovalDate: string | undefined = undefined;
  let jsonFile: File | null = null;
  let validationError: string | null = null;
  let showModal = false;
  let modalMessage = '';

  function handleFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    jsonFile = target.files?.[0] || null;
  }

  // Modified validation to handle nested developer and project structures
  function validateProposalJson(json: any): string | null {
    if (typeof json.title !== 'string') {
      return 'Invalid or missing "title" in proposal.';
    }
    if (typeof json.submittedBy !== 'string') {
      return 'Invalid or missing "submittedBy" in proposal.';
    }
    if (typeof json.manaHoursBudgeted !== 'number') {
      return 'Invalid or missing "manaHoursBudgeted" in proposal.';
    }
    if (json.targetApprovalDate && isNaN(Date.parse(json.targetApprovalDate))) {
      return 'Invalid "targetApprovalDate" in proposal.';
    }

    // Validate developers structure
    if (json.developers && typeof json.developers !== 'object') {
      return 'Invalid "developers" structure in proposal.';
    }

    return null;
  }

  async function handleSubmit(e: Event) {
    e.preventDefault();

    if (jsonFile) {
      try {
        const fileContent = await jsonFile.text();
        const parsedJson = JSON.parse(fileContent);
        const validationMessage = validateProposalJson(parsedJson);
        if (validationMessage) {
          validationError = validationMessage;
          return;
        }
        modalMessage = 'Validation passed! Submitting your proposal...';
        showModal = true;
        dispatch('addProposal', parsedJson);
      } catch (err) {
        validationError = 'Invalid JSON file.';
      }
    } else {
      const proposal = {
        title,
        description,
        manaHoursBudgeted,
        targetApprovalDate: targetApprovalDate || '',
        submittedBy: loggedInUserId,
        developers: {}, // Initialize as empty object for consistency
      };
      modalMessage = 'Validation passed! Submitting your proposal...';
      showModal = true;
      dispatch('addProposal', proposal);
    }

    setTimeout(() => {
      showModal = false;
    }, 2000);
  }
</script>

<form on:submit|preventDefault={handleSubmit} class="mt-10 rounded-lg p-6 shadow-lg">
  {#if showModal}
    <Modal message={modalMessage} closeModal={() => showModal = false} />
  {/if}

  {#if !jsonFile}
    <div class="mb-4">
      <Label for="title" class="mb-2 block font-medium text-orange-500">Title:</Label>
      <Input
        type="text"
        id="title"
        bind:value={title}
        required
        class="w-full rounded-md border border-orange-300 p-2 focus:border-orange-500 focus:outline-none"
      />
    </div>

    <div class="mb-4">
      <Label for="description" class="mb-2 block font-medium text-orange-500">Description:</Label>
      <textarea
        id="description"
        bind:value={description}
        rows="4"
        class="w-full rounded-md border border-orange-300 p-2 focus:border-orange-500 focus:outline-none"
      />
    </div>

    <div class="mb-4">
      <Label for="manaHours" class="mb-2 block font-medium text-orange-500">Mana Hours Budgeted:</Label>
      <Input
        type="number"
        id="manaHours"
        bind:value={manaHoursBudgeted}
        min="0"
        required
        class="w-full rounded-md border border-orange-300 p-2 focus:border-orange-500 focus:outline-none"
      />
    </div>

    <div class="mb-4">
      <Label for="approvalDate" class="mb-2 block font-medium text-orange-500">Target Approval Date:</Label>
      <Input
        type="date"
        id="approvalDate"
        bind:value={targetApprovalDate}
        class="w-full rounded-md border border-orange-300 p-2 focus:border-orange-500 focus:outline-none"
      />
    </div>
  {/if}

  <div class="mb-4">
    <Label for="jsonFile" class="mb-2 block font-medium text-orange-500">
      Or Upload Proposal JSON:
    </Label>
    <Input
      type="file"
      id="jsonFile"
      accept=".json"
      on:change={handleFileChange}
      class="w-full rounded-md border border-orange-300 p-2 focus:border-orange-500 focus:outline-none"
    />
  </div>

  {#if validationError}
    <div class="mb-4 text-red-500">{validationError}</div>
  {/if}

  <button
    type="submit"
    class="w-full rounded-md bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
  >
    Submit Proposal
  </button>
</form>
