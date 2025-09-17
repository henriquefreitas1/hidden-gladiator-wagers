import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

// Get environment variables
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475';
const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990';

export const config = getDefaultConfig({
  appName: 'Hidden Gladiator Wagers',
  projectId,
  chains: [sepolia],
  ssr: false, // If your dApp uses server side rendering (SSR)
});

// Wallet connection configuration
export const walletConfig = {
  chains: [sepolia],
  projectId,
  rpcUrl,
  chainId: 11155111, // Sepolia testnet
};
