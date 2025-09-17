import { Button } from "@/components/ui/button";
import { Shield, Zap, Lock } from "lucide-react";
import arenaBackground from "@/assets/arena-background.jpg";

interface ArenaHeroProps {
  onStartBetting: () => void;
}

export const ArenaHero = ({ onStartBetting }: ArenaHeroProps) => {
  return (
    <section 
      className="relative min-h-[70vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(rgba(20, 8, 8, 0.8), rgba(20, 8, 8, 0.6)), url(${arenaBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Animated Fire Embers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-ember-rise opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Main Title */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-cinzel font-bold text-secondary mb-4 tracking-wide animate-glow-pulse">
            STEALTH ARENA
          </h1>
          <h2 className="text-3xl md:text-4xl font-cinzel font-semibold text-primary mb-6 tracking-wider animate-flicker">
            Place Bets, Keep Them Hidden.
          </h2>
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed font-inter">
            Revolutionary encrypted betting on gladiator matches. Your bets remain secret until the arena decides the victor.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-3xl mx-auto">
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-accent/20 shadow-arena">
            <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
            <h3 className="font-cinzel font-semibold text-lg text-foreground mb-2">Encrypted Bets</h3>
            <p className="text-muted-foreground text-sm">Your wagers stay hidden until match completion</p>
          </div>
          
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-accent/20 shadow-arena">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="font-cinzel font-semibold text-lg text-foreground mb-2">Fair Odds</h3>
            <p className="text-muted-foreground text-sm">No market manipulation, true competitive betting</p>
          </div>
          
          <div className="bg-card/60 backdrop-blur-sm p-6 rounded-lg border border-accent/20 shadow-arena">
            <Lock className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="font-cinzel font-semibold text-lg text-foreground mb-2">Secure Platform</h3>
            <p className="text-muted-foreground text-sm">Blockchain-secured with instant payouts</p>
          </div>
        </div>

        {/* CTA Button */}
        <Button
          variant="arena"
          size="xl"
          onClick={onStartBetting}
          className="relative group"
        >
          <span className="relative z-10">ENTER THE ARENA</span>
          <div className="absolute inset-0 bg-gradient-ember opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-md" />
        </Button>
      </div>
    </section>
  );
};