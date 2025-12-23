const hre = require("hardhat");

async function main() {
  console.log("Deploying SimpleNTZS to", hre.network.name, "...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy SimpleNTZS
  const SimpleNTZS = await hre.ethers.getContractFactory("SimpleNTZS");
  const ntzs = await SimpleNTZS.deploy(deployer.address);
  
  await ntzs.waitForDeployment();
  const ntzsAddress = await ntzs.getAddress();
  
  console.log("✅ SimpleNTZS deployed to:", ntzsAddress);
  console.log("\nToken Details:");
  console.log("  Name:", await ntzs.name());
  console.log("  Symbol:", await ntzs.symbol());
  console.log("  Decimals:", await ntzs.decimals());
  
  // Save deployment info
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    SimpleNTZS: ntzsAddress,
    timestamp: new Date().toISOString()
  };
  
  const filename = `deployment-ntzs-${hre.network.name}-${new Date().toISOString().split('T')[0]}.json`;
  fs.writeFileSync(filename, JSON.stringify(deploymentInfo, null, 2));
  console.log("\n📄 Deployment info saved to:", filename);
  
  // Verify on explorer (if not local)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("\n⏳ Waiting for block confirmations before verification...");
    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30 seconds
    
    try {
      console.log("🔍 Verifying contract on BaseScan...");
      await hre.run("verify:verify", {
        address: ntzsAddress,
        constructorArguments: [deployer.address],
      });
      console.log("✅ Contract verified on BaseScan!");
    } catch (error) {
      console.log("⚠️ Verification failed:", error.message);
      console.log("You can verify manually later with:");
      console.log(`npx hardhat verify --network ${hre.network.name} ${ntzsAddress} ${deployer.address}`);
    }
  }
  
  console.log("\n🎉 Deployment complete!");
  console.log("\nView on BaseScan: https://sepolia.basescan.org/address/" + ntzsAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
