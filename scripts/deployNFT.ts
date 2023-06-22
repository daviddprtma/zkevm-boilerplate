import { ethers } from 'hardhat';
import { MyERC721, MyERC721__factory } from '../typechain-types';

async function deploy() {
  // get deployer
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // check account balance
  console.log(
    'Account balance:',
    ethers.utils.formatEther(await deployer.getBalance()),
  );

  // deploy MyERC721 contract
  const MyERC721: MyERC721__factory = await ethers.getContractFactory(
    'MyERC721',
  );
  const contract: MyERC721 = await MyERC721.connect(deployer).deploy(
    deployer.address, // owner
    'collection-aa-devnet', // name
    'AA', // symbol
    'https://webhook.site/5ce48076-ccdf-45d7-ab2a-a315833ba60a', // baseURI
    'https://webhook.site/10c86fab-d5a7-4283-93c3-398fe269497b', // contractURI
    deployer.address, // royalty recipient
    ethers.BigNumber.from('2000'), // fee numerator
  );
  await contract.deployed();

  // log deployed contract address
  console.log(`MyERC721 contract deployed to ${contract.address}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
