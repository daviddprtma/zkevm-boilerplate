import { ethers } from 'hardhat';
import { MyERC721__factory } from '../typechain-types';

const CONTRACT_ADDRESS = '0xf1a2bfc3f06643d2119a5b6d9fd52916f40a1b03';

async function deploy() {
  // get owner
  const [owner] = await ethers.getSigners();

  // check account balance
  console.log(
    'Account balance:',
    ethers.utils.formatEther(await owner.getBalance()),
  );

  const factory: MyERC721__factory = await ethers.getContractFactory(
    'MyERC721',
  );

  const contract = factory.attach(CONTRACT_ADDRESS);

  // grant minter role to owner
  // await contract.connect(owner).grantMinterRole(owner.address);

  // mint
  const mintResult = await contract.connect(owner).mint(owner.address, 1);
  console.log(`MyERC721 mint transaction hash: ${mintResult.hash}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
