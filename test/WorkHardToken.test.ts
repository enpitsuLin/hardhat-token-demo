import { expect } from "chai";
import { ethers } from "hardhat";
import { WorkHardToken, WorkHardToken__factory } from "../typechain-types";
import { ContractTransactionResponse } from "ethers";

// Start test block
describe('WorkHardToken', () => {
  let workHardTokenFactory: WorkHardToken__factory
  let workHardToken: WorkHardToken & {
    deploymentTransaction(): ContractTransactionResponse;
  }
  let signerContract: WorkHardToken
  let ownerAddress: string,
    recipientAddress: string
  before(async function () {
    workHardTokenFactory = await ethers.getContractFactory('WorkHardToken');
  });

  beforeEach(async function () {
    workHardToken = await workHardTokenFactory.deploy();
    await workHardToken.waitForDeployment()

    this.decimals = await workHardToken.decimals();

    const signers = await ethers.getSigners();

    ownerAddress = signers[0].address;
    recipientAddress = signers[1].address;

    signerContract = workHardToken.connect(signers[1]);
  });

  // Test cases
  it('Creates a token with a name', async function () {
    expect(await workHardToken.name()).to.equal('Work hard token');
  });

  it('Creates a token with a symbol', async function () {
    expect(await workHardToken.symbol()).to.equal('WHT');
  });

  it('Has a valid decimal', async function () {
    expect((await workHardToken.decimals()).toString()).to.equal('18');
  })

  it('Has a valid total supply', async function () {
    expect(await workHardToken.totalSupply()).to.equal(BigInt('996996996'));
  });

  it('Is able to query account balances', async function () {
    const ownerBalance = await workHardToken.balanceOf(ownerAddress);
    expect(await workHardToken.balanceOf(ownerAddress)).to.equal(ownerBalance);
  });

  it('Transfers the right amount of tokens to/from an account', async function () {
    const transferAmount = 1000;
    await expect(workHardToken.transfer(recipientAddress, transferAmount)).to.changeTokenBalances(
      workHardToken,
      [ownerAddress, recipientAddress],
      [-transferAmount, transferAmount]
    );
  });

  it('Emits a transfer event with the right arguments', async function () {
    const transferAmount = 100000;
    await expect(workHardToken.transfer(recipientAddress, transferAmount))
      .to.emit(workHardToken, "Transfer")
      .withArgs(ownerAddress, recipientAddress, transferAmount)
  });

  it('Allows for allowance approvals and queries', async function () {
    const approveAmount = 10000;
    await signerContract.approve(ownerAddress, ethers.parseUnits(approveAmount.toString(), this.decimals));
    expect((await workHardToken.allowance(recipientAddress, ownerAddress))).to.equal(ethers.parseUnits(approveAmount.toString(), this.decimals));
  });

  it('Emits an approval event with the right arguments', async function () {
    const approveAmount = 10000;
    await expect(signerContract.approve(ownerAddress, approveAmount))
      .to.emit(workHardToken, "Approval")
      .withArgs(recipientAddress, ownerAddress, approveAmount)
  });

  it('Allows an approved spender to transfer from owner', async function () {
    const transferAmount = 10000;
    await workHardToken.transfer(recipientAddress, transferAmount)
    await signerContract.approve(ownerAddress, transferAmount)
    await expect(workHardToken.transferFrom(recipientAddress, ownerAddress, transferAmount)).to.changeTokenBalances(
      workHardToken,
      [ownerAddress, recipientAddress],
      [transferAmount, -transferAmount]
    );
  });

  it('Emits a transfer event with the right arguments when conducting an approved transfer', async function () {
    const transferAmount = 10000;
    await workHardToken.transfer(recipientAddress, transferAmount)
    await signerContract.approve(ownerAddress, transferAmount)
    await expect(workHardToken.transferFrom(recipientAddress, ownerAddress, transferAmount))
      .to.emit(workHardToken, "Transfer")
      .withArgs(recipientAddress, ownerAddress, transferAmount)
  });

  it('Allows allowance to be increased and queried', async function () {
    const initialAmount = 100;
    const incrementAmount = 10000;
    await signerContract.approve(ownerAddress, ethers.parseUnits(initialAmount.toString(), this.decimals))
    const previousAllowance = await workHardToken.allowance(recipientAddress, ownerAddress);
    await signerContract.increaseAllowance(ownerAddress, ethers.parseUnits(incrementAmount.toString(), this.decimals));
    const expectedAllowance = previousAllowance + ethers.parseUnits(incrementAmount.toString(), this.decimals)
    expect((await workHardToken.allowance(recipientAddress, ownerAddress))).to.equal(expectedAllowance);
  });

  it('Emits approval event when alllowance is increased', async function () {
    const incrementAmount = 10000;
    await expect(signerContract.increaseAllowance(ownerAddress, ethers.parseUnits(incrementAmount.toString(), this.decimals)))
      .to.emit(workHardToken, "Approval")
      .withArgs(recipientAddress, ownerAddress, ethers.parseUnits(incrementAmount.toString(), this.decimals))
  });

  it('Allows allowance to be decreased and queried', async function () {
    const initialAmount = 100;
    const decrementAmount = 10;
    await signerContract.approve(ownerAddress, ethers.parseUnits(initialAmount.toString(), this.decimals))
    const previousAllowance = await workHardToken.allowance(recipientAddress, ownerAddress);
    await signerContract.decreaseAllowance(ownerAddress, ethers.parseUnits(decrementAmount.toString(), this.decimals));
    const expectedAllowance = previousAllowance - ethers.parseUnits(decrementAmount.toString(), this.decimals)
    expect((await workHardToken.allowance(recipientAddress, ownerAddress))).to.equal(expectedAllowance);
  });

  it('Emits approval event when alllowance is decreased', async function () {
    const initialAmount = 100;
    const decrementAmount = 10;
    await signerContract.approve(ownerAddress, ethers.parseUnits(initialAmount.toString(), this.decimals))
    const expectedAllowance = ethers.parseUnits(initialAmount.toString(), this.decimals) - ethers.parseUnits(decrementAmount.toString(), this.decimals)
    await expect(signerContract.decreaseAllowance(ownerAddress, ethers.parseUnits(decrementAmount.toString(), this.decimals)))
      .to.emit(workHardToken, "Approval")
      .withArgs(recipientAddress, ownerAddress, expectedAllowance)
  });

});
