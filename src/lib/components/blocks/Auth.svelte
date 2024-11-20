<script lang="ts">
  import { onMount } from 'svelte';
  import { authStore } from '$lib/stores/auth';
  import { authenticate, logOut } from '$lib/actions';
  import Login from './Login.svelte';
  
  let dropdownOpen = false;
  
  async function fetchData() {
    const auth = await authenticate();
    authStore.set({
      session: auth.success,
      username: auth.user?.username || ''
    });
  }
  
  async function handleLogout() {
    const result = await logOut();
    if (result.success) {
      authStore.set({
        session: false,
        username: ''
      });
    } else {
      console.error(result.message);
    }
  }
  
  onMount(() => {
    fetchData();
  });
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
            <div class="bg-black uppercase h-10 w-10 rounded-full flex items-center justify-center text-white">
              {$authStore.username.charAt(0)}
            </div>
          </div>
        </button>
        
        {#if dropdownOpen}
          <div 
            class="absolute right-0 mt-2 w-fit rounded-md bg-popover p-2 shadow-lg"
          >
            <button 
              on:click={handleLogout}
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

<style>
  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
</style>
