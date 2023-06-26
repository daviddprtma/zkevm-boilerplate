import {ethers} from 'hardhat';
import {MyERC721__factory} from '../typechain-types';

// Set your own contract here
const CONTRACT_ADDRESS = '0xAC67fda08d891728f6449c45c9AF45A283fAFA31';
const TO_ADDRESS = ""
const TOKEN_ID = 2

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

  // transfer
  const transferResult = await contract.connect(owner)["safeTransferFrom(address,address,uint256)"](owner.address, TO_ADDRESS, TOKEN_ID)
  console.log(`MyERC721 transfer transaction hash: ${transferResult.hash}`);

  // burn
  // const burnResult = await contract.connect(owner).burn(TOKEN_ID)
  // console.log(`MyERC721 burn transaction hash: ${burnResult.hash}`);

}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
