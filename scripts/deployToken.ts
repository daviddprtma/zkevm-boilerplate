import { ethers } from 'hardhat';
import { MyERC20, MyERC20__factory } from '../typechain-types';

async function deploy() {
  // get deployer
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // check account balance
  console.log(
    'Account balance:',
    ethers.utils.formatEther(await deployer.getBalance()),
  );

  // deploy MyERC20 contract
  const MyERC20: MyERC20__factory = await ethers.getContractFactory('MyERC20');
  const contract: MyERC20 = await MyERC20.connect(deployer).deploy(
    'token-aa-devnet', // name
    'AA', // symbol
  );
  await contract.deployed();

  // log deployed contract address
  console.log(`MyERC20 contract deployed to ${contract.address}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
