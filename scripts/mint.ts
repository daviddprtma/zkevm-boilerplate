import { ethers } from "hardhat";
const { getContractAt } = require("@nomiclabs/hardhat-ethers/internal/helpers");

async function mint() {
  //   const [owner] = await ethers.getSigners();
  const contract = await ethers.getContractFactory("MyERC721");
  const mycontract = contract.attach(
    "0x5FbDB2315678afecb367f032d93F642f64180aa3"
  );
  const [owner, _] = await ethers.getSigners();
  await mycontract.grantRole(await mycontract.MINTER_ROLE(), owner.address);
  await mycontract.connect(owner).permissionedMint(owner.address, 7);

  mycontract.swapForNFT([7], 11, owner.address);
}

mint();
