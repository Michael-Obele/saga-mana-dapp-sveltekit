<!-- src/routes/mana_gov/voting/TaskPerformanceVoting.svelte -->
<script lang="ts">
  export let taskId: number;
  export let voteeId: string;
  
  let hasVoted = false;
  let vote: boolean | null = null;

  // ... (Logic to fetch existing vote for this task and votee) ...

  async function handleVote(newVote: boolean) {
    // ... (Send vote to your API route) ...
    hasVoted = true;
    vote = newVote;
  }
</script>

<div class="mt-2">
  {#if !hasVoted}
    <div class="flex gap-2">
      <button
        class="rounded-lg bg-amber-400 px-4 py-2 text-white"
        on:click={() => handleVote(true)}
      >
        Yes
      </button>
      <button
        class="rounded-lg bg-amber-400 px-4 py-2 text-white"
        on:click={() => handleVote(false)}
      >
        No
      </button>
    </div>
  {/if}
  {#if hasVoted}
    <p class="text-xs text-amber-600">You voted: {vote ? 'Yes' : 'No'}</p>
  {/if}
</div>
