import type { PageServerLoad } from './$types';
import { connect, keyStores, type Contract } from 'near-api-js';
import { nearConfig } from '$lib/config/near';
import type { NearContract, TokenStats } from '$lib/types/near';

export const load: PageServerLoad = async () => {
  try {
    const keyStore = new keyStores.InMemoryKeyStore();
    const near = await connect({
      ...nearConfig,
      keyStore,
    });

    const account = await near.account(nearConfig.contractName);
    const contract = new Contract(
      account,
      nearConfig.contractName,
      {
        viewMethods: ['get_token_stats'],
        changeMethods: []
      }
    ) as NearContract;

    const tokenStats: TokenStats = await contract.get_token_stats();

    return {
      ...tokenStats,
      error: null
    };
  } catch (error) {
    console.error("Error connecting to NEAR:", error);
    return {
      error: "Failed to connect to NEAR network",
      circulatingSupply: "0",
      maximumSupply: "0",
      manaPrice: "0"
    };
  }
};
