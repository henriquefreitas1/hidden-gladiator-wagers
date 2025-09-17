import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Shield, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Unlock,
  Zap,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useGladiatorArena } from "@/hooks/useGladiatorArena";
import { verifyEncryptedBet, type BetData, type EncryptedBet } from "@/lib/fhe-encryption";

interface BetVerificationProps {
  bet: {
    gladiatorId: string;
    amount: number;
    odds: string;
    timestamp: Date;
    encryptedBet?: EncryptedBet;
    betId?: string;
    zkProof?: string;
  };
  onVerificationComplete: (verified: boolean) => void;
}

export const BetVerification = ({ bet, onVerificationComplete }: BetVerificationProps) => {
  const { verifyBetData, revealAndClaimBet } = useGladiatorArena();
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRevealing, setIsRevealing] = useState(false);
  const [verificationResult, setVerificationResult] = useState<boolean | null>(null);
  const [revealResult, setRevealResult] = useState<boolean | null>(null);

  const handleVerifyBet = async () => {
    if (!bet.encryptedBet) {
      toast({
        title: "❌ No Encrypted Data",
        description: "This bet doesn't have encrypted data to verify.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Create bet data for verification
      const betData: BetData = {
        amount: bet.amount,
        choice: bet.gladiatorId === "maximus" ? 1 : 2,
        matchId: 1, // Demo match ID
      };

      // Verify the encrypted bet
      const isValid = verifyBetData(betData, bet.encryptedBet);
      setVerificationResult(isValid);
      
      if (isValid) {
        toast({
          title: "✅ Verification Successful",
          description: "Your encrypted bet data is valid and can be revealed.",
        });
      } else {
        toast({
          title: "❌ Verification Failed",
          description: "The encrypted bet data is invalid or corrupted.",
          variant: "destructive",
        });
      }
      
      onVerificationComplete(isValid);
    } catch (error) {
      console.error("Verification error:", error);
      toast({
        title: "❌ Verification Error",
        description: "An error occurred during verification.",
        variant: "destructive",
      });
      setVerificationResult(false);
      onVerificationComplete(false);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRevealBet = async () => {
    if (!bet.encryptedBet || verificationResult !== true) {
      toast({
        title: "❌ Cannot Reveal",
        description: "Bet must be verified before revealing.",
        variant: "destructive",
      });
      return;
    }

    setIsRevealing(true);
    
    try {
      const choice = bet.gladiatorId === "maximus" ? 1 : 2;
      
      // Reveal and claim bet on-chain
      await revealAndClaimBet(1, bet.amount, choice, bet.encryptedBet);
      
      setRevealResult(true);
      toast({
        title: "🎉 Bet Revealed Successfully",
        description: "Your bet has been revealed and processed on-chain.",
      });
    } catch (error) {
      console.error("Reveal error:", error);
      toast({
        title: "❌ Reveal Failed",
        description: "Failed to reveal your bet on-chain.",
        variant: "destructive",
      });
      setRevealResult(false);
    } finally {
      setIsRevealing(false);
    }
  };

  return (
    <Card className="bg-card/80 backdrop-blur-sm border border-accent/30">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-cinzel font-bold text-foreground">
            Bet Verification & Reveal
          </h3>
        </div>

        {/* Bet Information */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Gladiator</Label>
            <div className="flex items-center gap-2">
              <span className="font-medium">{bet.gladiatorId === "maximus" ? "MAXIMUS STEEL" : "LUCIA FLAME"}</span>
              <Badge variant="secondary">
                <Lock className="h-3 w-3 mr-1" />
                FHE Encrypted
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Amount</Label>
            <div className="font-bold text-lg">{bet.amount} ETH</div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">Bet ID</Label>
            <div className="font-mono text-sm text-muted-foreground">
              {bet.betId ? `${bet.betId.slice(0, 12)}...` : "N/A"}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium">ZK Proof</Label>
            <div className="flex items-center gap-1">
              {bet.zkProof ? (
                <>
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary">Available</span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
          </div>
        </div>

        {/* Verification Status */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <Label className="text-sm font-medium">Verification Status</Label>
            {verificationResult === true && <CheckCircle className="h-4 w-4 text-green-500" />}
            {verificationResult === false && <XCircle className="h-4 w-4 text-red-500" />}
            {verificationResult === null && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
          </div>
          
          {verificationResult === null && (
            <p className="text-sm text-muted-foreground">
              Click "Verify Bet" to validate your encrypted bet data.
            </p>
          )}
          
          {verificationResult === true && (
            <p className="text-sm text-green-600">
              ✅ Your bet data is valid and ready for reveal.
            </p>
          )}
          
          {verificationResult === false && (
            <p className="text-sm text-red-600">
              ❌ Bet data verification failed. Please check your bet details.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleVerifyBet}
            disabled={isVerifying || !bet.encryptedBet}
            variant="outline"
            className="flex-1"
          >
            {isVerifying ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2" />
                Verifying...
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Verify Bet
              </>
            )}
          </Button>
          
          <Button
            onClick={handleRevealBet}
            disabled={isRevealing || verificationResult !== true}
            variant="default"
            className="flex-1"
          >
            {isRevealing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Revealing...
              </>
            ) : (
              <>
                <Unlock className="h-4 w-4 mr-2" />
                Reveal & Claim
              </>
            )}
          </Button>
        </div>

        {/* Reveal Status */}
        {revealResult !== null && (
          <div className="mt-4 p-3 rounded-lg bg-muted/20">
            {revealResult ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Bet successfully revealed and processed!</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Failed to reveal bet. Please try again.</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

