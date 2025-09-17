import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { GladiatorCard } from "./GladiatorCard";
import { Timer, Users, Lock, Eye, EyeOff, Shield } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGladiatorArena } from "@/hooks/useGladiatorArena";
import { useWallet } from "@/hooks/useWallet";
import gladiator1 from "@/assets/gladiator-1.jpg";
import gladiator2 from "@/assets/gladiator-2.jpg";

interface Bet {
  gladiatorId: string;
  amount: number;
  odds: string;
  timestamp: Date;
}

export const BettingArena = () => {
  const { isConnected } = useWallet();
  const { placeEncryptedBet, encryptBet, generateNonce, matchInfo } = useGladiatorArena();
  
  const [bets, setBets] = useState<Bet[]>([]);
  const [showBets, setShowBets] = useState(false);
  const [matchActive, setMatchActive] = useState(true);
  const [timeLeft, setTimeLeft] = useState(278); // 4:38 in seconds
  const [betAmount, setBetAmount] = useState("0.01");
  const [selectedGladiator, setSelectedGladiator] = useState<string | null>(null);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  const gladiators = [
    {
      id: "maximus",
      name: "MAXIMUS STEEL",
      image: gladiator1,
      wins: 23,
      losses: 4,
      specialty: "Sword & Shield",
      odds: "2.1x",
      isActive: matchActive,
    },
    {
      id: "lucia",
      name: "LUCIA FLAME",
      image: gladiator2,
      wins: 18,
      losses: 6,
      specialty: "Spear & Net",
      odds: "1.8x",
      isActive: matchActive,
    },
  ];

  const handlePlaceBet = (gladiatorId: string, amount: number) => {
    const gladiator = gladiators.find(g => g.id === gladiatorId);
    if (!gladiator) return;

    const newBet: Bet = {
      gladiatorId,
      amount,
      odds: gladiator.odds,
      timestamp: new Date(),
    };

    setBets(prev => [...prev, newBet]);
    
    toast({
      title: "🔒 Stealth Bet Placed",
      description: `Your bet on ${gladiator.name} has been encrypted and hidden until match completion.`,
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const totalBetAmount = bets.reduce((sum, bet) => sum + bet.amount, 0);

  return (
    <section className="py-12 bg-gradient-arena">
      <div className="container mx-auto px-6">
        {/* Arena Header */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-cinzel font-bold text-secondary mb-2 tracking-wide">
            THE COLOSSEUM
          </h2>
          <p className="text-muted-foreground text-lg">
            Current match in progress - place your encrypted bets now
          </p>
        </div>

        {/* Match Status */}
        <Card className="mb-8 bg-card/60 backdrop-blur-sm border border-accent/30">
          <div className="p-6">
            <div className="grid md:grid-cols-4 gap-4 items-center text-center">
              <div className="flex items-center justify-center gap-2">
                <Timer className="h-5 w-5 text-primary animate-pulse" />
                <div>
                  <div className="text-2xl font-bold font-cinzel text-primary">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-xs text-muted-foreground">Time Left</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                <div>
                  <div className="text-2xl font-bold font-cinzel text-secondary">247</div>
                  <div className="text-xs text-muted-foreground">Active Bettors</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <Lock className="h-5 w-5 text-accent animate-flicker" />
                <div>
                  <div className="text-2xl font-bold font-cinzel text-accent">1,834</div>
                  <div className="text-xs text-muted-foreground">Hidden Bets</div>
                </div>
              </div>
              
              <div>
                <Badge 
                  variant={matchActive ? "default" : "secondary"}
                  className="px-4 py-2 font-cinzel animate-glow-pulse"
                >
                  {matchActive ? "🔥 BETTING OPEN" : "⚔️ MATCH ENDED"}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        {/* Gladiators Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {gladiators.map((gladiator) => (
            <GladiatorCard
              key={gladiator.id}
              {...gladiator}
              onPlaceBet={handlePlaceBet}
            />
          ))}
        </div>

        {/* My Bets Section */}
        <Card className="bg-card/80 backdrop-blur-sm border border-accent/30">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-cinzel font-bold text-foreground">
                My Stealth Bets
              </h3>
              <Button
                variant="stealth"
                size="sm"
                onClick={() => setShowBets(!showBets)}
              >
                {showBets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showBets ? "Hide" : "Show"} Bets
              </Button>
            </div>

            {bets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Lock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No bets placed yet. Enter the arena and place your first stealth bet!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-muted/20 rounded-lg">
                  <span className="font-medium">Total Bet Amount:</span>
                  <span className="font-bold font-cinzel text-xl text-secondary">
                    {totalBetAmount} ETH
                  </span>
                </div>
                
                {showBets && (
                  <div className="space-y-2">
                    {bets.map((bet, index) => {
                      const gladiator = gladiators.find(g => g.id === bet.gladiatorId);
                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted/10 rounded border border-accent/20"
                        >
                          <div>
                            <span className="font-medium">{gladiator?.name}</span>
                            <span className="text-xs text-muted-foreground ml-2">
                              {bet.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{bet.amount} ETH</div>
                            <div className="text-xs text-secondary">{bet.odds}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
};