import '@rainbow-me/rainbowkit/styles.css';
import { RainbowKitProvider, getDefaultWallets } from '@rainbow-me/rainbowkit';
import { createConfig, WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http } from 'viem';

// Get environment variables
const projectId = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || '2ec9743d0d0cd7fb94dee1a7e6d33475';
const rpcUrl = import.meta.env.VITE_RPC_URL || 'https://sepolia.infura.io/v3/b18fb7e6ca7045ac83c41157ab93f990';

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
  try {
    return (
      <WagmiProvider config={wagmiConfig}>
        <RainbowKitProvider chains={[sepolia]}>
          {children}
        </RainbowKitProvider>
      </WagmiProvider>
    );
  } catch (error) {
    console.error('Wallet provider error:', error);
    // Fallback without wallet functionality
    return <>{children}</>;
  }
};
