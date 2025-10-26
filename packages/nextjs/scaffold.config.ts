import * as chains from "viem/chains";

export type BaseConfig = {
  targetNetworks: readonly chains.Chain[];
  pollingInterval: number;
  alchemyApiKey: string;
  rpcOverrides?: Record<number, string>;
  walletConnectProjectId: string;
  onlyLocalBurnerWallet: boolean;
};

export type ScaffoldConfig = BaseConfig;

export const DEFAULT_ALCHEMY_API_KEY = "oKxs-03sij-U_N0iOlrSsZFr29-IqbuF";

const scaffoldConfig = {
  // The networks on which your DApp is live
  targetNetworks: [chains.sepolia, chains.mainnet], // Using Sepolia testnet
  // Interval at which frontend polls the RPC servers (ms)
  pollingInterval: 30000,
  // Alchemy API key (from env or default)
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || DEFAULT_ALCHEMY_API_KEY,
  // Override RPC URLs for specific chains
  rpcOverrides: {
    [chains.sepolia.id]:
      process.env.NEXT_PUBLIC_RPC_URL_SEPOLIA || "https://eth-sepolia.g.alchemy.com/v2/o1tRi-75Sb1JOROcxTegT",
    [chains.mainnet.id]:
      process.env.NEXT_PUBLIC_RPC_URL_MAINNET || "https://eth-mainnet.alchemyapi.io/v2/o1tRi-75Sb1JOROcxTegT",
  },
  // WalletConnect project ID
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64",
  // Disable local burner wallet for live testnet
  onlyLocalBurnerWallet: false,
} as const satisfies ScaffoldConfig;

export default scaffoldConfig;
