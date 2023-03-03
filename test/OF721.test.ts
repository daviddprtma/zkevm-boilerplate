import { ethers } from "hardhat";
import {OF721, OF721__factory, TrustedContractRegistry, TrustedContractRegistry__factory} from "../typechain-types";

describe("OF721", function () {
  let contract: OF721;
  let registry: TrustedContractRegistry;

  beforeEach(async function () {
    // get owner (first account)
    const [owner] = await ethers.getSigners();

      // deploy MyERC721 contract
      const OF721: OF721__factory = await ethers.getContractFactory(
          "OF721"
      );
      const TrustedContractRegistry: TrustedContractRegistry__factory = await ethers.getContractFactory(
          "TrustedContractRegistry"
      );

  registry = await TrustedContractRegistry.deploy(owner.address);

    // deploy MyERC721 contract
    contract = await OF721.deploy(
      owner.address, // owner
      "Imaginary Immutable Iguanas", // name
      "III", // symbol
      "https://example-base-uri.com/", // baseURI
      "https://example-contract-uri.com/", // contractURI
        registry.address
    );
    await contract.deployed();
      await registry.deployed();

    // grant owner the minter role
    await contract.grantRole(await contract.MINTER_ROLE(), owner.address);
  });

  // it("Should be deployed with the correct arguments", async function () {
  //   expect(await contract.name()).to.equal("Imaginary Immutable Iguanas");
  //   expect(await contract.symbol()).to.equal("III");
  //   expect(await contract.baseURI()).to.equal("https://example-base-uri.com/");
  //   expect(await contract.contractURI()).to.equal(
  //     "https://example-contract-uri.com/"
  //   );
  // });
  //
  // it("Account with minter role should be able to mint multiple NFTs", async function () {
  //   const [owner, recipient] = await ethers.getSigners();
  //   await contract.connect(owner).permissionedMint(recipient.address, 5);
  //   expect(await contract.balanceOf(recipient.address)).to.equal(5);
  //   expect(await contract.ownerOf(1)).to.equal(recipient.address);
  //   expect(await contract.ownerOf(2)).to.equal(recipient.address);
  //   expect(await contract.ownerOf(3)).to.equal(recipient.address);
  //   expect(await contract.ownerOf(4)).to.equal(recipient.address);
  //   expect(await contract.ownerOf(5)).to.equal(recipient.address);
  // });
  //
  // it("Account without minter role should not be able to mint NFTs", async function () {
  //   const [_, acc1] = await ethers.getSigners();
  //   const minterRole = await contract.MINTER_ROLE();
  //   await expect(
  //     contract.connect(acc1).permissionedMint(acc1.address, 1)
  //   ).to.be.revertedWith(
  //     `AccessControl: account 0x70997970c51812dc3a010c7d01b50e0d17dc79c8 is missing role ${minterRole}`
  //   );
  // });

    it("Run demo", async function () {
        let whiteListed = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";

        let initialSales = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
        // let finalRecipient = "0x90F79bf6EB2c4f870365E785982E1f101E93b906";

        // register trusted marketplace
        const tx = await registry.register(whiteListed);
        const rc = await tx.wait()
        const event = rc.events?.find(e => e.event == 'RegistrationUpdated');
        console.log(event);


        // mint 1 token
        await contract.permissionedMint(initialSales, 1)
        let token = await contract.tokenByIndex(1)
        console.log(`token details`, token)

        await contract.transferFrom(initialSales, whiteListed, 1)

    });


});
