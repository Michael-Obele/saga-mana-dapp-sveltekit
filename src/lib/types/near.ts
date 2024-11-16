export interface StakingHistory {
  staker: string;
  stakedAmount: string;
  stakingDuration: string;
  status: string;
  manaToReceive: string;
}

export interface TokenStats {
  circulatingSupply: string;
  maximumSupply: string;
  manaPrice: string;
}

export interface NearContract {
  get_staking_history: (args: { account_id: string }) => Promise<StakingHistory[]>;
  get_token_stats: () => Promise<TokenStats>;
  swap_fyre_to_mana: (args: { amount: string }) => Promise<void>;
  get_fyre_tokens: () => Promise<void>;
}
