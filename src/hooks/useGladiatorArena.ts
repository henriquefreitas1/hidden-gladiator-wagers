import { useWriteContract, useReadContract, useAccount } from 'wagmi';
import { parseEther, formatEther, keccak256 } from 'viem';
import { 
  createStealthBet, 
  verifyEncryptedBet, 
  formatForContract,
  type BetData,
  type EncryptedBet 
} from '@/lib/fhe-encryption';

// Contract ABI (simplified for demonstration)
const GLADIATOR_ARENA_ABI = [
  {
    "inputs": [
      {"internalType": "uint256", "name": "_startTime", "type": "uint256"}
    ],
    "name": "createMatch",
    "outputs": [
      {"internalType": "uint256", "name": "", "type": "uint256"}
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_matchId", "type": "uint256"},
      {"internalType": "bytes32", "name": "_encryptedBet", "type": "bytes32"},
      {"internalType": "bytes32", "name": "_nonce", "type": "bytes32"}
    ],
    "name": "placeBet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_matchId", "type": "uint256"},
      {"internalType": "uint8", "name": "_winner", "type": "uint8"}
    ],
    "name": "completeMatch",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_matchId", "type": "uint256"},
      {"internalType": "uint256", "name": "_betAmount", "type": "uint256"},
      {"internalType": "uint8", "name": "_choice", "type": "uint8"},
      {"internalType": "bytes32", "name": "_nonce", "type": "bytes32"}
    ],
    "name": "revealBetAndClaim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_matchId", "type": "uint256"}
    ],
    "name": "getMatchInfo",
    "outputs": [
      {"internalType": "uint256", "name": "matchId", "type": "uint256"},
      {"internalType": "address", "name": "creator", "type": "address"},
      {"internalType": "uint256", "name": "startTime", "type": "uint256"},
      {"internalType": "uint256", "name": "endTime", "type": "uint256"},
      {"internalType": "bool", "name": "isActive", "type": "bool"},
      {"internalType": "bool", "name": "isCompleted", "type": "bool"},
      {"internalType": "uint8", "name": "winner", "type": "uint8"},
      {"internalType": "uint256", "name": "totalBets", "type": "uint256"},
      {"internalType": "uint256", "name": "totalPayout", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "_matchId", "type": "uint256"},
      {"internalType": "address", "name": "_user", "type": "address"}
    ],
    "name": "getUserBetInfo",
    "outputs": [
      {"internalType": "bool", "name": "hasBet", "type": "bool"},
      {"internalType": "uint256", "name": "betAmount", "type": "uint256"},
      {"internalType": "bool", "name": "hasClaimed", "type": "bool"}
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

// Contract address (you'll need to deploy and update this)
const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'; // Update with deployed address

export const useGladiatorArena = () => {
  const { address } = useAccount();
  
  // Contract write functions
  const { writeContract: createMatch } = useWriteContract();
  const { writeContract: placeBet } = useWriteContract();
  const { writeContract: completeMatch } = useWriteContract();
  const { writeContract: revealBetAndClaim } = useWriteContract();

  // Contract read functions
  const { data: matchInfo, refetch: refetchMatchInfo } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: GLADIATOR_ARENA_ABI,
    functionName: 'getMatchInfo',
    args: [1n], // Example match ID
  });

  const { data: userBetInfo, refetch: refetchUserBetInfo } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi: GLADIATOR_ARENA_ABI,
    functionName: 'getUserBetInfo',
    args: address ? [1n, address] : undefined, // Example match ID
  });

  // Helper functions
  const createNewMatch = async (startTime: number) => {
    if (!createMatch) throw new Error('Contract not initialized');
    
    const tx = await createMatch({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: GLADIATOR_ARENA_ABI,
      functionName: 'createMatch',
      args: [BigInt(startTime)],
    });
    
    return tx;
  };

  const placeEncryptedBet = async (
    matchId: number,
    betAmount: number,
    gladiatorChoice: number
  ) => {
    if (!placeBet) throw new Error('Contract not initialized');
    
    // Create FHE encrypted bet data
    const betData: BetData = {
      amount: betAmount,
      choice: gladiatorChoice,
      matchId: matchId
    };
    
    const { encryptedBet, betId, zkProof } = createStealthBet(betData);
    const contractData = formatForContract(encryptedBet);
    
    // Create commitment for contract verification
    const commitment = keccak256(
      contractData.encryptedAmount + 
      contractData.encryptedChoice + 
      contractData.nonce + 
      address + 
      matchId.toString()
    );
    
    const tx = await placeBet({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: GLADIATOR_ARENA_ABI,
      functionName: 'placeBet',
      args: [
        BigInt(matchId),
        contractData.encryptedAmount as `0x${string}`,
        contractData.encryptedChoice as `0x${string}`,
        contractData.nonce as `0x${string}`,
        commitment as `0x${string}`
      ],
      value: parseEther(betAmount.toString()),
    });
    
    return { tx, betId, zkProof, encryptedBet };
  };

  const completeGladiatorMatch = async (matchId: number, winner: number) => {
    if (!completeMatch) throw new Error('Contract not initialized');
    
    const tx = await completeMatch({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: GLADIATOR_ARENA_ABI,
      functionName: 'completeMatch',
      args: [BigInt(matchId), BigInt(winner)],
    });
    
    return tx;
  };

  const revealAndClaimBet = async (
    matchId: number,
    betAmount: number,
    choice: number,
    encryptedBet: EncryptedBet
  ) => {
    if (!revealBetAndClaim) throw new Error('Contract not initialized');
    
    const contractData = formatForContract(encryptedBet);
    
    const tx = await revealBetAndClaim({
      address: CONTRACT_ADDRESS as `0x${string}`,
      abi: GLADIATOR_ARENA_ABI,
      functionName: 'revealBetAndClaim',
      args: [
        BigInt(matchId),
        parseEther(betAmount.toString()),
        BigInt(choice),
        contractData.nonce as `0x${string}`,
        contractData.encryptedAmount as `0x${string}`,
        contractData.encryptedChoice as `0x${string}`
      ],
    });
    
    return tx;
  };

  // Verify bet data locally before revealing
  const verifyBetData = (betData: BetData, encryptedBet: EncryptedBet): boolean => {
    return verifyEncryptedBet(encryptedBet, betData);
  };

  return {
    createNewMatch,
    placeEncryptedBet,
    completeGladiatorMatch,
    revealAndClaimBet,
    verifyBetData,
    matchInfo,
    userBetInfo,
    refetchMatchInfo,
    refetchUserBetInfo,
  };
};