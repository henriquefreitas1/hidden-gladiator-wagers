import { useContract, useContractWrite, useContractRead, useAccount } from 'wagmi';
import { parseEther, formatEther } from 'viem';

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
  
  // Contract instance
  const contract = useContract({
    address: CONTRACT_ADDRESS,
    abi: GLADIATOR_ARENA_ABI,
  });

  // Contract write functions
  const { writeAsync: createMatch } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: GLADIATOR_ARENA_ABI,
    functionName: 'createMatch',
  });

  const { writeAsync: placeBet } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: GLADIATOR_ARENA_ABI,
    functionName: 'placeBet',
  });

  const { writeAsync: completeMatch } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: GLADIATOR_ARENA_ABI,
    functionName: 'completeMatch',
  });

  const { writeAsync: revealBetAndClaim } = useContractWrite({
    address: CONTRACT_ADDRESS,
    abi: GLADIATOR_ARENA_ABI,
    functionName: 'revealBetAndClaim',
  });

  // Contract read functions
  const { data: matchInfo, refetch: refetchMatchInfo } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: GLADIATOR_ARENA_ABI,
    functionName: 'getMatchInfo',
    args: [1n], // Example match ID
  });

  const { data: userBetInfo, refetch: refetchUserBetInfo } = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: GLADIATOR_ARENA_ABI,
    functionName: 'getUserBetInfo',
    args: address ? [1n, address] : undefined, // Example match ID
  });

  // Helper functions
  const createNewMatch = async (startTime: number) => {
    if (!createMatch) throw new Error('Contract not initialized');
    
    const tx = await createMatch({
      args: [BigInt(startTime)],
    });
    
    return tx;
  };

  const placeEncryptedBet = async (
    matchId: number,
    encryptedBet: string,
    nonce: string,
    betAmount: string
  ) => {
    if (!placeBet) throw new Error('Contract not initialized');
    
    const tx = await placeBet({
      args: [BigInt(matchId), encryptedBet as `0x${string}`, nonce as `0x${string}`],
      value: parseEther(betAmount),
    });
    
    return tx;
  };

  const completeGladiatorMatch = async (matchId: number, winner: number) => {
    if (!completeMatch) throw new Error('Contract not initialized');
    
    const tx = await completeMatch({
      args: [BigInt(matchId), BigInt(winner)],
    });
    
    return tx;
  };

  const revealAndClaimBet = async (
    matchId: number,
    betAmount: string,
    choice: number,
    nonce: string
  ) => {
    if (!revealBetAndClaim) throw new Error('Contract not initialized');
    
    const tx = await revealBetAndClaim({
      args: [BigInt(matchId), parseEther(betAmount), BigInt(choice), nonce as `0x${string}`],
    });
    
    return tx;
  };

  // FHE Encryption helper (simplified)
  const encryptBet = (amount: number, choice: number, nonce: string): string => {
    // Simplified encryption for demonstration
    const combined = (amount << 8) | choice;
    const encrypted = (combined ^ parseInt(nonce.slice(2), 16)) % (2**256 - 1);
    return '0x' + encrypted.toString(16).padStart(64, '0');
  };

  const generateNonce = (): string => {
    return '0x' + Math.random().toString(16).slice(2, 18).padStart(16, '0');
  };

  return {
    contract,
    createNewMatch,
    placeEncryptedBet,
    completeGladiatorMatch,
    revealAndClaimBet,
    encryptBet,
    generateNonce,
    matchInfo,
    userBetInfo,
    refetchMatchInfo,
    refetchUserBetInfo,
  };
};
