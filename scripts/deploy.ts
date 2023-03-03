import { ethers } from "hardhat";
import { MyRoubbler ,MyRoubbler__factory } from "../typechain-types";

async function deploy() {
  // get deployer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // check account balance
  console.log(
    "Account balance:",
    ethers.utils.formatEther(await deployer.getBalance())
  );

  // deploy MyERC721 contract
  const MyERC721: MyRoubbler__factory = await ethers.getContractFactory(
    "MyRoubbler"
  );
  const contract: MyRoubbler = await MyERC721.connect(deployer).deploy(
    deployer.address, // owner
    "Roubbler", // name
    "III", // symbol
    "https://example-base-uri.com/", // baseURI
    "https://example-contract-uri.com/" // contractURI
  );
  await contract.deployed();

  // log deployed contract address
  console.log(`MyRoubbler contract deployed to ${contract.address}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
