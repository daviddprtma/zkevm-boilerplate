import { ethers } from 'hardhat';
import { MyERC721__factory } from '../typechain-types';

const CONTRACT_ADDRESS = '0x8F1C586BB5af01bb2D92c5070d1a12a2E3b4BB35';
const ROYALTY_ALLOWLIST_DEVNET = "0x449b19eebbe656AE033B64fF408459F501F4A678"

const ROYALTY_ALLOWLIST_TESTNET = "0xE57661143ACef993BD2A0a6d01bb636625e6540B"


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

  // mint
  const allowlist = await contract.connect(owner).setRoyaltyAllowlistRegistry(ROYALTY_ALLOWLIST_TESTNET);
  console.log(`MyERC721 setRoyaltyAllowlistRegistry transaction hash: ${allowlist.hash}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
