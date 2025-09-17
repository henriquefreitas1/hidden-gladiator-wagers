import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Zap, 
  CheckCircle, 
  AlertTriangle,
  Clock
} from "lucide-react";

interface StealthStatusProps {
  totalBets: number;
  encryptedBets: number;
  verifiedBets: number;
  revealedBets: number;
  isMatchActive: boolean;
}

export const StealthStatus = ({
  totalBets,
  encryptedBets,
  verifiedBets,
  revealedBets,
  isMatchActive
}: StealthStatusProps) => {
  const encryptionRate = totalBets > 0 ? (encryptedBets / totalBets) * 100 : 0;
  const verificationRate = encryptedBets > 0 ? (verifiedBets / encryptedBets) * 100 : 0;
  const revealRate = verifiedBets > 0 ? (revealedBets / verifiedBets) * 100 : 0;

  return (
    <Card className="bg-card/60 backdrop-blur-sm border border-accent/30">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-cinzel font-bold text-foreground">
            Stealth Arena Status
          </h3>
          <Badge 
            variant={isMatchActive ? "default" : "secondary"}
            className="ml-auto"
          >
            {isMatchActive ? "🔒 ACTIVE" : "⚔️ ENDED"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Bets */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground">Total Bets</span>
            </div>
            <div className="text-2xl font-bold font-cinzel text-foreground">
              {totalBets}
            </div>
          </div>

          {/* Encrypted Bets */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">FHE Encrypted</span>
            </div>
            <div className="text-2xl font-bold font-cinzel text-primary">
              {encryptedBets}
            </div>
            <div className="text-xs text-muted-foreground">
              {encryptionRate.toFixed(1)}% of total
            </div>
          </div>

          {/* Verified Bets */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-muted-foreground">Verified</span>
            </div>
            <div className="text-2xl font-bold font-cinzel text-green-500">
              {verifiedBets}
            </div>
            <div className="text-xs text-muted-foreground">
              {verificationRate.toFixed(1)}% verified
            </div>
          </div>

          {/* Revealed Bets */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <EyeOff className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium text-muted-foreground">Revealed</span>
            </div>
            <div className="text-2xl font-bold font-cinzel text-secondary">
              {revealedBets}
            </div>
            <div className="text-xs text-muted-foreground">
              {revealRate.toFixed(1)}% revealed
            </div>
          </div>
        </div>

        {/* Security Status */}
        <div className="mt-6 p-4 bg-muted/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Security Status</span>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">FHE Encryption</span>
              <Badge variant="secondary" className="text-xs">
                <Lock className="h-3 w-3 mr-1" />
                Active
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Zero-Knowledge Proofs</span>
              <Badge variant="secondary" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                Enabled
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Commitment Scheme</span>
              <Badge variant="secondary" className="text-xs">
                <Shield className="h-3 w-3 mr-1" />
                Secure
              </Badge>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-primary mb-1">Privacy Protection Active</p>
              <p className="text-muted-foreground">
                All bet data is encrypted using Fully Homomorphic Encryption (FHE) 
                and remains hidden until match completion. Your betting choices are 
                completely private and cannot be observed by other players or the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
