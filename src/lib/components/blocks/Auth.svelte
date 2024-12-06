<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { authenticate, logOut } from '$lib/actions';
  import Login from './Login.svelte';
  
  let dropdownOpen = false;
</script>

<div>
  {#if $authStore.session}
    <div class="bg-none">
      <div class="relative">
        <button 
          on:click={() => dropdownOpen = !dropdownOpen}
          class="bg-none"
        >
          <div class="avatar">
            <div class="flex h-10 w-10 items-center justify-center rounded-full bg-black uppercase text-white">
              {$authStore.username.charAt(0)}
            </div>
          </div>
        </button>
        
        {#if dropdownOpen}
          <div 
            class="absolute right-0 mt-2 w-fit rounded-md bg-popover p-2 shadow-lg"
          >
            <button 
              class="w-full px-4 py-2 text-left font-bold capitalize hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <Login />
  {/if}
</div>


