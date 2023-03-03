import { ethers } from 'hardhat';
import { expect } from 'chai';
import { MyERC721 } from '../typechain-types';

describe('MyERC721', function () {
  let contract: MyERC721;

  beforeEach(async function () {
    // get owner (first account)
    const [owner] = await ethers.getSigners();

    // deploy MyERC721 contract
    const MyERC721 = await ethers.getContractFactory('MyERC721');
    contract = await MyERC721.deploy(
      owner.address, // owner
      'Crafty Voters', // name
      'CV', // symbol
      'https://crafty-voters-base-uri.com/', // baseURI
      'https://crafty-voters-contract-uri.com/' // contractURI
    );
    await contract.deployed();

    // grant owner the minter role
    await contract.grantRole(await contract.MINTER_ROLE(), owner.address);
  });

  it('Should be deployed with the correct arguments', async function () {
    expect(await contract.name()).to.equal('Crafty Voters');
    expect(await contract.symbol()).to.equal('CV');
    expect(await contract.baseURI()).to.equal(
      'https://crafty-voters-base-uri.com/'
    );
    expect(await contract.contractURI()).to.equal(
      'https://crafty-voters-contract-uri.com/'
    );
  });

  it('Account with minter role should be able to mint multiple NFTs', async function () {
    const [owner, recipient] = await ethers.getSigners();
    await contract.connect(owner).permissionedMint(recipient.address, 5);
    expect(await contract.balanceOf(recipient.address)).to.equal(5);
    expect(await contract.ownerOf(1)).to.equal(recipient.address);
    expect(await contract.ownerOf(2)).to.equal(recipient.address);
    expect(await contract.ownerOf(3)).to.equal(recipient.address);
    expect(await contract.ownerOf(4)).to.equal(recipient.address);
    expect(await contract.ownerOf(5)).to.equal(recipient.address);
  });

  it('Crafts tokens', async function () {
    const [owner, recipient] = await ethers.getSigners();
    contract.grantRole(
      '0x4d494e5445525f524f4c45000000000000000000000000000000000000000000',
      owner.address
    );
    await contract.connect(owner).permissionedMint(recipient.address, 5);

    expect(await contract.totalSupply()).to.equal(5);
    await contract.connect(recipient).craftToken(
      [
        await contract.tokenByIndex(0), // Token id 1
        await contract.tokenByIndex(1), // Token id 2
        await contract.tokenByIndex(2), // Token id 3
      ],
      'Dragon Squire'
    );

    expect(await contract.totalSupply()).to.equal(6);

    expect(await contract.ownerOf(await contract.tokenByIndex(5))).to.eq(
      recipient.address
    );

    expect(await contract.crafted(1)).to.equal(true);
    expect(await contract.crafted(2)).to.equal(true);
    expect(await contract.crafted(3)).to.equal(true);
    expect(await contract.crafted(4)).to.equal(false);
    expect(await contract.crafted(5)).to.equal(false);
  });

  it('Vote on crafted tokens', async function () {
    const [owner, recipient] = await ethers.getSigners();
    contract.grantRole(
      '0x4d494e5445525f524f4c45000000000000000000000000000000000000000000',
      owner.address
    );
    await contract.connect(owner).permissionedMint(recipient.address, 5);

    expect(await contract.totalSupply()).to.equal(5);
    await contract.connect(recipient).craftToken(
      [
        await contract.tokenByIndex(0), // Token id 1
        await contract.tokenByIndex(1), // Token id 2
        await contract.tokenByIndex(2), // Token id 3
      ],
      'Dragon Squire'
    );

    expect(await contract.totalSupply()).to.equal(6);

    expect(await contract.ownerOf(await contract.tokenByIndex(5))).to.eq(
      recipient.address
    );

    contract.voteForToken(6, recipient.address);

    expect((await contract.getTokenDetails(6)).votes).eq(1);
  });
});
