import { ethers } from "hardhat";

async function main() {

  const contractOwner = await ethers.getSigners();

  console.log(`Deploying contract from: ${contractOwner[0].address}`);

  const WorkHardToken = await ethers.getContractFactory('WorkHardToken');

  console.log('Deploying WorkHardToken...');
  const WHT = await WorkHardToken.deploy();
  await WHT.waitForDeployment();

  const WHTAddress = await WHT.getAddress()
  console.log(`FunToken deployed to: ${WHTAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
