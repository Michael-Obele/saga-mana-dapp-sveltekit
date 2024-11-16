<script lang="ts">
  import { onMount } from 'svelte';
  import { connect, keyStores, type WalletConnection, type Contract } from 'near-api-js';
  import type { PageData } from './$types';
  import { nearConfig } from '$lib/config/near';
  import type { StakingHistory, NearContract } from '$lib/types/near';

  export let data: PageData;

  let purchaseAmount = '';
  let stakingHistory: StakingHistory[] = [];
  let loading = false;
  let error: string | null = null;
  let wallet: WalletConnection | null = null;
  let contract: NearContract | null = null;
  let accountId: string | null = null;

  $: circulatingSupply = data.circulatingSupply;
  $: maximumSupply = data.maximumSupply;
  $: manaPrice = data.manaPrice;

  async function initNearConnection() {
    try {
      const keyStore = new keyStores.BrowserLocalStorageKeyStore();
      const near = await connect({
        ...nearConfig,
        keyStore,
      });

      wallet = new WalletConnection(near, "saga-halla-mana");

      if (wallet.isSignedIn()) {
        accountId = wallet.getAccountId();
        const account = await near.account(accountId);
        contract = new Contract(
          account,
          nearConfig.contractName,
          {
            viewMethods: ['get_staking_history', 'get_token_stats'],
            changeMethods: ['swap_fyre_to_mana', 'get_fyre_tokens']
          }
        ) as NearContract;

        await fetchStakingHistory();
      } else {
        error = "Please connect your NEAR wallet.";
      }
    } catch (e) {
      console.error("Error initializing NEAR connection:", e);
      error = "Failed to initialize NEAR connection";
    }
  }

  async function fetchStakingHistory() {
    if (!contract || !accountId) return;
    
    try {
      loading = true;
      stakingHistory = await contract.get_staking_history({ account_id: accountId });
    } catch (err) {
      console.error("Error fetching staking history:", err);
      error = "Unable to fetch staking history. Please try again.";
    } finally {
      loading = false;
    }
  }

  async function handleReturnToken() {
    try {
      if (!wallet) {
        error = "Wallet is not initialized.";
        return;
      }
      
      if (!wallet.isSignedIn()) {
        await wallet.requestSignIn({
          contractId: nearConfig.contractName,
          methodNames: ["get_fyre_tokens"]
        });
        return;
      }

      if (!contract) {
        error = "Contract is not initialized.";
        return;
      }

      loading = true;
      await contract.get_fyre_tokens();
      await fetchStakingHistory(); // Refresh history after getting tokens
    } catch (err) {
      console.error("Error retrieving tokens:", err);
      error = "There was an issue retrieving the tokens. Please try again.";
    } finally {
      loading = false;
    }
  }

  async function handleSwapTokens() {
    if (!purchaseAmount || parseFloat(purchaseAmount) <= 0) {
      error = "Please enter a valid amount";
      return;
    }

    try {
      if (!wallet) {
        error = "Wallet is not initialized.";
        return;
      }
      
      if (!wallet.isSignedIn()) {
        await wallet.requestSignIn({
          contractId: nearConfig.contractName,
          methodNames: ["swap_fyre_to_mana"]
        });
        return;
      }

      if (!contract) {
        error = "Contract is not initialized.";
        return;
      }

      loading = true;
      await contract.swap_fyre_to_mana({ amount: purchaseAmount });
      await fetchStakingHistory(); // Refresh history after swap
      purchaseAmount = ''; // Clear input after successful swap
    } catch (err) {
      console.error("Error swapping tokens:", err);
      error = "There was an issue with the token swap. Please try again.";
    } finally {
      loading = false;
    }
  }

  onMount(() => {
    initNearConnection();
  });
</script>

<div class="bg-[#270927] min-h-screen text-white p-8">
  <!-- MANA Token Section -->
  <main class="flex justify-center mt-10">
    <div class="bg-[#3a0f3a] p-5 rounded-lg shadow-md w-full max-w-md">
      <h3 class="text-[#ce711e] text-3xl font-bold mb-4 text-center">Contribute MANA Tokens</h3>
      <label class="mb-2 block text-center">Offering Price: {manaPrice} FYRE per MANA</label>
      <input
        type="number"
        id="price"
        class="w-full p-2 rounded text-black"
        placeholder="Input MANA Amount"
        bind:value={purchaseAmount}
      />
      <button
        on:click={handleSwapTokens}
        disabled={loading}
        class="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4"
        class:cursor-not-allowed={loading}
      >
        {loading ? "Contributing..." : "FYRE TO MANA CONTRIBUTION"}
      </button>
      <button
        on:click={handleReturnToken}
        disabled={loading}
        class="bg-[#ce711e] hover:bg-[#a85a18] text-white font-bold py-2 px-4 rounded w-full mt-4"
        class:cursor-not-allowed={loading}
      >
        {loading ? "Retrieving..." : "GET FYRE"}
      </button>
    </div>
  </main>

  {#if error}
    <div class="flex justify-center mt-4">
      <p class="text-red-500">{error}</p>
    </div>
  {/if}

  <!-- Staking History Section -->
  <main>
    <div class="mt-10">
      <h3 class="text-[#ce711e] text-3xl font-bold mb-4">Staking History</h3>
      {#if loading}
        <p>Loading staking history...</p>
      {:else if stakingHistory.length > 0}
        <div class="bg-[#270927] p-4 rounded-lg shadow-md">
          <table class="w-full text-left text-white">
            <thead>
              <tr>
                <th class="px-4 py-2">Staker</th>
                <th class="px-4 py-2">Staked FYRE</th>
                <th class="px-4 py-2">Duration (hours)</th>
                <th class="px-4 py-2">MANA to Receive</th>
                <th class="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {#each stakingHistory as staking, index}
                <tr class="bg-[#3a0f3a]">
                  <td class="border px-4 py-2">{staking.staker}</td>
                  <td class="border px-4 py-2">{staking.stakedAmount}</td>
                  <td class="border px-4 py-2">{staking.stakingDuration}</td>
                  <td class="border px-4 py-2">{staking.manaToReceive}</td>
                  <td class="border px-4 py-2">{staking.status}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p>No staking history available.</p>
      {/if}
    </div>
  </main>

  <!-- Minting Stats Section -->
  <main>
    <h3 class="text-[#ce711e] text-3xl font-bold mb-4">MANA Token Minting Stats</h3>
    <div class="bg-[#ce711e] rounded overflow-hidden">
      <div class="grid grid-cols-2">
        <div class="p-3 text-white font-semibold">CIRCULATING SUPPLY</div>
        <div class="p-3 bg-[#270927] text-white">{circulatingSupply} MANA</div>
        <div class="p-3 text-white font-semibold">MAXIMUM SUPPLY</div>
        <div class="p-3 bg-[#270927] text-white">{maximumSupply} MANA</div>
      </div>
    </div>
  </main>

  <!-- Real-Time Prices Section -->
  <main class="bg-[#3a0f3a] p-6 rounded-lg shadow-md mt-8">
    <h3 class="text-[#ce711e] text-3xl font-bold mb-4">MANA Price</h3>
    <div class="bg-[#ce711e] rounded overflow-hidden">
      <div class="grid grid-cols-2">
        <div class="p-3 text-white font-semibold">Price USD/MANA</div>
        <div class="p-3 bg-[#270927] text-white">${manaPrice}</div>
      </div>
    </div>
  </main>

  <!-- Utility & Use Case Section -->
  <main class="mt-8">
    <h3 class="text-[#ce711e] text-3xl font-bold mb-4">Utility & Use Case</h3>
    <div class="bg-[#3a0f3a] p-6 rounded-lg">
      <p class="mb-4">MANA tokens can be used to contribute to projects within the SagaHalla ecosystem. These contributions represent real-world involvement in cooperative initiatives.</p>
      <p class="mb-4">Convert your FYRE tokens to MANA tokens. This action represents long-term staking in the SagaHalla community.</p>
      <p class="mb-4">Governance Rights: MANA tokens represent contributions and do not provide governance rights within SagaHalla.</p>
    </div>
  </main>
</div>
