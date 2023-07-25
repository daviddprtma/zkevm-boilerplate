import { ethers } from 'hardhat';
import { MyERC721__factory } from '../typechain-types';

const CONTRACT_ADDRESS = '0x8F1C586BB5af01bb2D92c5070d1a12a2E3b4BB35';

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
  // const tx =  await contract.connect(owner).grantMinterRole(owner.address);

  // mint
  const tx = await contract.connect(owner).mint(owner.address, 5);
  console.log(`MyERC721 mint transaction hash: ${tx.hash}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
