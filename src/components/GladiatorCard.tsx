import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sword, Shield, Flame, Zap } from "lucide-react";
import { useState } from "react";

interface GladiatorProps {
  id: string;
  name: string;
  image: string;
  wins: number;
  losses: number;
  specialty: string;
  odds: string;
  isActive: boolean;
  onPlaceBet: (gladiatorId: string, amount: number) => void;
}

export const GladiatorCard = ({ 
  id, 
  name, 
  image, 
  wins, 
  losses, 
  specialty, 
  odds, 
  isActive,
  onPlaceBet 
}: GladiatorProps) => {
  const [betAmount, setBetAmount] = useState(10);
  const [isHovered, setIsHovered] = useState(false);

  const handlePlaceBet = () => {
    onPlaceBet(id, betAmount);
  };

  const winRate = Math.round((wins / (wins + losses)) * 100);

  return (
    <Card 
      className={`relative overflow-hidden bg-card/90 backdrop-blur-sm border-2 transition-all duration-300 ${
        isActive 
          ? 'border-primary shadow-fire animate-glow-pulse' 
          : 'border-accent/30 hover:border-accent/60'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Fire Effect */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-fire opacity-10 animate-fire-dance" />
      )}

      {/* Gladiator Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Active Badge */}
        {isActive && (
          <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground font-cinzel animate-flicker">
            <Flame className="h-3 w-3 mr-1" />
            ACTIVE
          </Badge>
        )}
      </div>

      <div className="p-6 space-y-4">
        {/* Gladiator Info */}
        <div>
          <h3 className="text-xl font-cinzel font-bold text-foreground tracking-wide mb-2">
            {name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <Sword className="h-4 w-4 text-accent" />
            <span className="text-sm text-muted-foreground font-cinzel">{specialty}</span>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center">
              <div className="text-lg font-bold text-secondary">{wins}</div>
              <div className="text-xs text-muted-foreground">Wins</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-destructive">{losses}</div>
              <div className="text-xs text-muted-foreground">Losses</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-primary">{winRate}%</div>
              <div className="text-xs text-muted-foreground">Rate</div>
            </div>
          </div>

          {/* Odds */}
          <div className="bg-muted/30 rounded-lg p-3 border border-accent/20">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Current Odds:</span>
              <span className="font-cinzel font-bold text-secondary text-lg">{odds}</span>
            </div>
          </div>
        </div>

        {/* Betting Section */}
        {isActive && (
          <div className="space-y-3 pt-2 border-t border-accent/20">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Bet Amount:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="stealth"
                  size="sm"
                  onClick={() => setBetAmount(Math.max(1, betAmount - 5))}
                >
                  -
                </Button>
                <span className="font-bold text-lg w-16 text-center font-cinzel text-secondary">
                  {betAmount}
                </span>
                <Button
                  variant="stealth"
                  size="sm"
                  onClick={() => setBetAmount(betAmount + 5)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              variant="gladiator"
              size="lg"
              className="w-full group relative overflow-hidden"
              onClick={handlePlaceBet}
            >
              <Shield className="h-4 w-4 group-hover:animate-pulse" />
              PLACE STEALTH BET
              <Zap className="h-4 w-4 group-hover:animate-pulse" />
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};