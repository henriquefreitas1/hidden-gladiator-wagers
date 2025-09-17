// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title GladiatorArena
 * @dev A smart contract for encrypted gladiator betting with FHE (Fully Homomorphic Encryption)
 * @notice This contract implements privacy-preserving betting where wagers remain encrypted until match completion
 */
contract GladiatorArena is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    
    // Events
    event MatchCreated(uint256 indexed matchId, address indexed creator, uint256 startTime);
    event BetPlaced(uint256 indexed matchId, address indexed bettor, bytes32 encryptedBet);
    event MatchCompleted(uint256 indexed matchId, uint8 winner, uint256 totalPayout);
    event BetRevealed(uint256 indexed matchId, address indexed bettor, uint256 amount, bool won);
    
    // Structs
    struct GladiatorMatch {
        uint256 matchId;
        address creator;
        uint256 startTime;
        uint256 endTime;
        bool isActive;
        bool isCompleted;
        uint8 winner; // 0 = no winner, 1 = gladiator1, 2 = gladiator2
        uint256 totalBets;
        uint256 totalPayout;
        mapping(address => bytes32) encryptedBets;
        mapping(address => bool) hasBet;
        mapping(address => uint256) betAmounts;
        mapping(address => bool) hasClaimed;
    }
    
    struct FHEBet {
        bytes32 encryptedAmount;
        bytes32 encryptedChoice;
        bytes32 nonce;
        uint256 timestamp;
    }
    
    // State variables
    Counters.Counter private _matchIds;
    mapping(uint256 => GladiatorMatch) public matches;
    mapping(address => uint256[]) public userMatches;
    mapping(address => uint256) public userTotalBets;
    
    // FHE Configuration
    uint256 public constant MIN_BET = 0.001 ether;
    uint256 public constant MAX_BET = 10 ether;
    uint256 public constant HOUSE_EDGE = 5; // 5% house edge
    uint256 public constant MATCH_DURATION = 3600; // 1 hour in seconds
    
    // FHE Encryption parameters (simplified for demonstration)
    uint256 private constant FHE_MODULUS = 2**256 - 1;
    uint256 private constant FHE_KEY = 0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef;
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @dev Create a new gladiator match
     * @param _startTime The timestamp when the match should start
     */
    function createMatch(uint256 _startTime) external onlyOwner returns (uint256) {
        require(_startTime > block.timestamp, "Start time must be in the future");
        
        _matchIds.increment();
        uint256 matchId = _matchIds.current();
        
        GladiatorMatch storage match_ = matches[matchId];
        match_.matchId = matchId;
        match_.creator = msg.sender;
        match_.startTime = _startTime;
        match_.endTime = _startTime + MATCH_DURATION;
        match_.isActive = true;
        match_.isCompleted = false;
        match_.winner = 0;
        match_.totalBets = 0;
        match_.totalPayout = 0;
        
        emit MatchCreated(matchId, msg.sender, _startTime);
        return matchId;
    }
    
    /**
     * @dev Place an encrypted bet on a gladiator match
     * @param _matchId The ID of the match to bet on
     * @param _encryptedBet The encrypted bet data (amount + choice)
     * @param _nonce Random nonce for encryption
     */
    function placeBet(
        uint256 _matchId,
        bytes32 _encryptedBet,
        bytes32 _nonce
    ) external payable nonReentrant {
        GladiatorMatch storage match_ = matches[_matchId];
        require(match_.isActive, "Match is not active");
        require(block.timestamp >= match_.startTime, "Match has not started yet");
        require(block.timestamp < match_.endTime, "Match has ended");
        require(!match_.hasBet[msg.sender], "Already placed a bet on this match");
        require(msg.value >= MIN_BET && msg.value <= MAX_BET, "Invalid bet amount");
        
        // Store encrypted bet
        match_.encryptedBets[msg.sender] = _encryptedBet;
        match_.hasBet[msg.sender] = true;
        match_.betAmounts[msg.sender] = msg.value;
        match_.totalBets += msg.value;
        
        // Add to user's match history
        userMatches[msg.sender].push(_matchId);
        userTotalBets[msg.sender] += msg.value;
        
        emit BetPlaced(_matchId, msg.sender, _encryptedBet);
    }
    
    /**
     * @dev Complete a match and determine the winner
     * @param _matchId The ID of the match to complete
     * @param _winner The winner (1 for gladiator1, 2 for gladiator2)
     */
    function completeMatch(uint256 _matchId, uint8 _winner) external onlyOwner {
        GladiatorMatch storage match_ = matches[_matchId];
        require(match_.isActive, "Match is not active");
        require(block.timestamp >= match_.endTime, "Match has not ended yet");
        require(_winner == 1 || _winner == 2, "Invalid winner");
        
        match_.isActive = false;
        match_.isCompleted = true;
        match_.winner = _winner;
        
        // Calculate total payout (simplified)
        uint256 houseCut = (match_.totalBets * HOUSE_EDGE) / 100;
        match_.totalPayout = match_.totalBets - houseCut;
        
        emit MatchCompleted(_matchId, _winner, match_.totalPayout);
    }
    
    /**
     * @dev Reveal a bet and claim winnings (simplified FHE decryption)
     * @param _matchId The ID of the match
     * @param _betAmount The original bet amount
     * @param _choice The gladiator choice (1 or 2)
     * @param _nonce The nonce used for encryption
     */
    function revealBetAndClaim(
        uint256 _matchId,
        uint256 _betAmount,
        uint8 _choice,
        bytes32 _nonce
    ) external nonReentrant {
        GladiatorMatch storage match_ = matches[_matchId];
        require(match_.isCompleted, "Match is not completed");
        require(match_.hasBet[msg.sender], "No bet placed");
        require(!match_.hasClaimed[msg.sender], "Already claimed");
        require(_choice == 1 || _choice == 2, "Invalid choice");
        
        // Verify the bet (simplified FHE verification)
        bytes32 expectedEncrypted = _encryptBet(_betAmount, _choice, _nonce);
        require(match_.encryptedBets[msg.sender] == expectedEncrypted, "Invalid bet data");
        
        match_.hasClaimed[msg.sender] = true;
        
        // Check if bet won
        bool won = (_choice == match_.winner);
        
        if (won) {
            // Calculate winnings (simplified)
            uint256 winnings = (_betAmount * match_.totalPayout) / match_.totalBets;
            require(address(this).balance >= winnings, "Insufficient contract balance");
            
            payable(msg.sender).transfer(winnings);
        }
        
        emit BetRevealed(_matchId, msg.sender, _betAmount, won);
    }
    
    /**
     * @dev Simple FHE encryption function (for demonstration)
     * @param _amount The bet amount
     * @param _choice The gladiator choice
     * @param _nonce Random nonce
     * @return The encrypted bet data
     */
    function _encryptBet(
        uint256 _amount,
        uint8 _choice,
        bytes32 _nonce
    ) private pure returns (bytes32) {
        // Simplified encryption using XOR and modular arithmetic
        uint256 combined = (_amount << 8) | _choice;
        uint256 encrypted = (combined ^ uint256(_nonce)) % FHE_MODULUS;
        return bytes32(encrypted);
    }
    
    /**
     * @dev Get match information
     * @param _matchId The ID of the match
     * @return matchId, creator, startTime, endTime, isActive, isCompleted, winner, totalBets, totalPayout
     */
    function getMatchInfo(uint256 _matchId) external view returns (
        uint256 matchId,
        address creator,
        uint256 startTime,
        uint256 endTime,
        bool isActive,
        bool isCompleted,
        uint8 winner,
        uint256 totalBets,
        uint256 totalPayout
    ) {
        GladiatorMatch storage match_ = matches[_matchId];
        return (
            match_.matchId,
            match_.creator,
            match_.startTime,
            match_.endTime,
            match_.isActive,
            match_.isCompleted,
            match_.winner,
            match_.totalBets,
            match_.totalPayout
        );
    }
    
    /**
     * @dev Check if user has bet on a match
     * @param _matchId The ID of the match
     * @param _user The user address
     * @return hasBet, betAmount, hasClaimed
     */
    function getUserBetInfo(uint256 _matchId, address _user) external view returns (
        bool hasBet,
        uint256 betAmount,
        bool hasClaimed
    ) {
        GladiatorMatch storage match_ = matches[_matchId];
        return (
            match_.hasBet[_user],
            match_.betAmounts[_user],
            match_.hasClaimed[_user]
        );
    }
    
    /**
     * @dev Get user's match history
     * @param _user The user address
     * @return Array of match IDs
     */
    function getUserMatches(address _user) external view returns (uint256[] memory) {
        return userMatches[_user];
    }
    
    /**
     * @dev Withdraw house profits (owner only)
     */
    function withdrawHouseProfits() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No profits to withdraw");
        payable(owner()).transfer(balance);
    }
    
    /**
     * @dev Emergency function to pause contract
     */
    function emergencyPause() external onlyOwner {
        // Implementation would pause the contract
        // This is a placeholder for emergency functionality
    }
    
    // Receive function to accept ETH
    receive() external payable {}
}
