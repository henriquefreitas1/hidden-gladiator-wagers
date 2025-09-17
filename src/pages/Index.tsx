import { useState } from "react";
import { ArenaHeader } from "@/components/ArenaHeader";
import { ArenaHero } from "@/components/ArenaHero";
import { BettingArena } from "@/components/BettingArena";
import { useWallet } from "@/hooks/useWallet";
import { toast } from "@/hooks/use-toast";

const Index = () => {
  const { isConnected, connectWallet, address } = useWallet();
  const [showBettingArena, setShowBettingArena] = useState(false);

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "🔗 Connecting Wallet...",
        description: "Please confirm the connection in your wallet.",
      });
    } catch (error) {
      toast({
        title: "❌ Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleStartBetting = () => {
    if (!isConnected) {
      toast({
        title: "🔒 Wallet Required",
        description: "Please connect your wallet to enter the betting arena.",
        variant: "destructive",
      });
      return;
    }
    
    setShowBettingArena(true);
    toast({
      title: "🏛️ Entering the Arena",
      description: "Welcome to the gladiator betting arena! Place your stealth bets now.",
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-inter">
      <ArenaHeader 
        onConnectWallet={handleConnectWallet}
        isWalletConnected={isConnected}
        walletAddress={address}
      />
      
      {!showBettingArena ? (
        <ArenaHero onStartBetting={handleStartBetting} />
      ) : (
        <BettingArena />
      )}
      
      {/* Arena Footer */}
      <footer className="border-t border-accent/20 bg-card/60 backdrop-blur-sm py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-muted-foreground text-sm">
            Stealth Arena Bets • Encrypted Gladiator Betting • Built on Blockchain
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            All bets are encrypted until match completion to ensure fair play
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
