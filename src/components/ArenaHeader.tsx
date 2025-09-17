import { Button } from "@/components/ui/button";
import { Wallet, Sword, EyeOff } from "lucide-react";

interface ArenaHeaderProps {
  onConnectWallet: () => void;
  isWalletConnected: boolean;
  walletAddress?: string;
}

export const ArenaHeader = ({ onConnectWallet, isWalletConnected, walletAddress }: ArenaHeaderProps) => {
  return (
    <header className="relative border-b border-accent/20 bg-card/80 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Sword className="h-8 w-8 text-secondary animate-flicker" />
              <EyeOff className="absolute -top-1 -right-1 h-4 w-4 text-primary animate-ember-rise" />
            </div>
            <div>
              <h1 className="text-2xl font-cinzel font-bold text-secondary tracking-wide">
                STEALTH ARENA
              </h1>
              <p className="text-sm text-muted-foreground font-cinzel">BETS</p>
            </div>
          </div>

          {/* Tagline */}
          <div className="hidden md:block text-center">
            <h2 className="text-xl font-cinzel font-semibold text-foreground tracking-wider">
              Place Bets, Keep Them Hidden.
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Encrypted betting until match completion
            </p>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center gap-3">
            {isWalletConnected && walletAddress && (
              <div className="text-sm text-muted-foreground">
                {`${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
              </div>
            )}
            <Button
              variant={isWalletConnected ? "gladiator" : "arena"}
              size="lg"
              onClick={onConnectWallet}
              className="relative overflow-hidden"
            >
              <Wallet className="h-5 w-5" />
              {isWalletConnected ? "Connected" : "Connect Wallet"}
              {!isWalletConnected && (
                <div className="absolute inset-0 bg-gradient-fire opacity-20 animate-fire-dance" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};