// scripts/interact.js
import { ethers } from "hardhat";

async function main() {
  console.log('Getting the work hard token contract...');
  const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
  const token = await ethers.getContractAt('WorkHardToken', contractAddress);

  // name()
  console.log('Querying token name...');
  const name = await token.name();
  console.log(`Token Name: ${name}\n`);

  // symbol()
  console.log('Querying token symbol...');
  const symbol = await token.symbol();
  console.log(`Token Symbol: ${symbol}\n`);

  // decimals()
  console.log('Querying decimals...');
  const decimals = await token.decimals();
  console.log(`Token Decimals: ${decimals}\n`);

  // totalSupply()
  console.log('Querying token supply...');
  const totalSupply = await token.totalSupply();
  console.log(`Total Supply including all decimals: ${totalSupply}`);
  console.log(`Total supply including all decimals comma separated: ${totalSupply.toLocaleString()}`);
  console.log(`Total Supply in WHT: ${totalSupply.toLocaleString(undefined, { style: "currency", currency: "WHT" })}\n`);

  // balanceOf(address account)
  console.log('Getting the balance of contract owner...');
  const signers = await ethers.getSigners();
  const ownerAddress = signers[0].address;
  let ownerBalance = await token.balanceOf(ownerAddress);
  console.log(`Contract owner at ${ownerAddress} has a ${symbol} balance of ${ownerBalance.toLocaleString(undefined, { style: "currency", currency: "WHT" })}\n`);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
