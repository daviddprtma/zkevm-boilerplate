import { ethers } from "hardhat";
import {OF721, OF721__factory, TrustedContractRegistry, TrustedContractRegistry__factory} from "../typechain-types";

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
  const OF721: OF721__factory = await ethers.getContractFactory(
    "OF721"
  );
  const TrustedContractRegistry: TrustedContractRegistry__factory = await ethers.getContractFactory(
      "TrustedContractRegistry"
  );

  const contractRegistry: TrustedContractRegistry = await TrustedContractRegistry.connect(deployer).deploy(deployer.address);

  const contract: OF721 = await OF721.connect(deployer).deploy(
    deployer.address, // owner
    "Imaginary Immutable Iguanas", // name
    "III", // symbol
    "https://example-base-uri.com/", // baseURI
    "https://example-contract-uri.com/", // contractURI
    contractRegistry.address
  );

  await contract.deployed();
  await contractRegistry.deployed();

  // log deployed contract address
  console.log(`TrustedContractRegistry contract deployed to ${contractRegistry.address}`);
  console.log(`MyERC721 contract deployed to ${contract.address}`);
}

deploy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
