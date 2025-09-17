const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying GladiatorArena contract...");

  // Get the contract factory
  const GladiatorArena = await ethers.getContractFactory("GladiatorArena");

  // Deploy the contract
  const gladiatorArena = await GladiatorArena.deploy();

  // Wait for deployment to complete
  await gladiatorArena.waitForDeployment();

  const contractAddress = await gladiatorArena.getAddress();

  console.log("GladiatorArena deployed to:", contractAddress);
  console.log("Contract owner:", await gladiatorArena.owner());
  
  // Verify deployment
  console.log("Verifying deployment...");
  const matchCount = await gladiatorArena._matchIds();
  console.log("Initial match count:", matchCount.toString());

  console.log("\n=== DEPLOYMENT SUMMARY ===");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", await ethers.provider.getNetwork().then(n => n.name));
  console.log("Block Number:", await ethers.provider.getBlockNumber());
  
  console.log("\n=== NEXT STEPS ===");
  console.log("1. Update VITE_CONTRACT_ADDRESS in Vercel environment variables");
  console.log("2. Test contract functions on Sepolia testnet");
  console.log("3. Create initial gladiator matches");
  console.log("4. Test betting functionality");

  return contractAddress;
}

// Execute deployment
main()
  .then((address) => {
    console.log(`\n✅ Deployment successful! Contract at: ${address}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
