<script lang="ts">
  // import { connectModal } from '$lib/stores/wallet';  // We'll need to create this store
  // import Wallet from '../wallet_components/Wallet.svelte';
  import Navbar from './Navbar.svelte';
  import Auth from './Auth.svelte';
  import logo from '$lib/assets/sagahalla.png';
  
  export let appName = "SagaHalla";
  
  let dropdownOpen = false;
  
  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }
  
  // function openConnectModal() {
  //   connectModal.set(true);
  // }
</script>

<div class="header flex items-center justify-between bg-[#ce711e] text-white">
  <!-- App Logo and Site Name -->
  <div class="logo flex items-center space-x-2 p-2">
    <a href="/">
      <img src="{logo}" alt="SagaHalla Logo" class="h-10" />
    </a>
    <span class="text-xl font-bold text-white">{appName}</span>
  </div>

  <!-- Nav Bar -->
  <Navbar />

  <!-- Wallets and Login Section -->
  <div class="flex items-center space-x-2 p-2">
    <div class="relative">
      <button 
        on:click={toggleDropdown}
        class="cursor-pointer rounded-md bg-[#a85a18] px-2 py-1 font-bold capitalize text-white hover:bg-[#8f4914]"
      >
        Wallets
      </button>
      
      {#if dropdownOpen}
        <div 
          class="absolute right-0 mt-2 w-fit space-y-1 rounded-md bg-popover p-2 shadow-lg focus:outline-none"
          role="menu"
        >
          <div class="px-2 py-1 text-sm font-semibold">Connect to a wallet</div>
          <div class="my-1 h-px bg-border"></div>
          
          <!-- NEAR Wallet -->
          <div class="cursor-pointer bg-[#a85a18] px-2 py-1 font-bold uppercase text-white hover:bg-[#8f4914]">
            <!-- <Wallet /> -->
          </div>
          
          <!-- EVM Wallet Connect -->
          <button
          class="w-full cursor-pointer bg-[#a85a18] px-2 py-1 font-bold capitalize text-white hover:bg-[#8f4914]"
          >
          Connect EVM
        </button>
      </div>
      {/if}
    </div>
    
    <!-- on:click={openConnectModal} -->
    <!-- Auth (Login/Logout) -->
    <Auth />
  </div>
</div>

<style>
  /* Add any component-specific styles here */
</style>
