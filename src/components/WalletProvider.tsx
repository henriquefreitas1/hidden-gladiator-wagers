import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http } from 'viem';

// Get environment variables
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'your_project_id_here';
const rpcUrl = import.meta.env.VITE_RPC_URL || 'your_sepolia_rpc_url_here';

// Configure wallets
const { connectors } = getDefaultWallets({
  appName: 'Hidden Gladiator Wagers',
  projectId,
  chains: [sepolia],
});

// Create wagmi config
const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors,
  transports: {
    [sepolia.id]: http(rpcUrl),
  },
});

interface WalletProviderProps {
  children: React.ReactNode;
}

export const WalletProvider = ({ children }: WalletProviderProps) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <RainbowKitProvider chains={[sepolia]}>
        {children}
      </RainbowKitProvider>
    </WagmiProvider>
  );
};
