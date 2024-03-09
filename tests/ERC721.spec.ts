import { Wallet } from 'ethers';
import { waffle } from 'hardhat';
import { NFT } from '../dist/types';
import { integrationFixture } from './shared/integration';

const { expect } = require('chai');
const { ethers } = require('hardhat');

const ipfsPrefix = 'ipfs://';
const demoUrl1 =  ipfsPrefix + 'demo1';
const demoUrl2 =  ipfsPrefix + 'demo2';

describe('ERC721', function () {
  let users: Wallet[];
  let nft: NFT;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;
  
  before('create fixture loader', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
  });
  
  beforeEach('deploy fixture', async () => {
    ({ nft } = await loadFixture(integrationFixture));
    // Mint two new tokens
    await nft.connect(users[0]).mint(users[0].address,  demoUrl1);
    await nft.connect(users[0]).mint(users[1].address,  demoUrl2);
    await nft.connect(users[0]).mint(users[1].address,  demoUrl2);
  });

  it('Should airdrop a new ERC721 token and get its balance', async function () {
    expect(await nft.balanceOf(users[0].address)).to.equal(1);
    expect(await nft.balanceOf(users[1].address)).to.equal(2);
  });

  it('Should return the correct total supply', async function () {
    // Total supply should be 2
    expect(await nft.totalSupply()).to.equal(3);
  });

  it('Should return the correct token owner', async function () {
    // Token owner should be users[0]
    expect(await nft.ownerOf(1)).to.equal(users[0].address);
  });

  it('Should return the correct token URI', async function () {
    expect(await nft.tokenURI(1)).to.equal(demoUrl1);
  });

  it('Should return the correct token ID at index', async function () {
    // Token ID at index 0 should be 1
    expect(await nft.tokenByIndex(0)).to.equal(1);

    // Token ID at index 1 should be 2
    expect(await nft.tokenByIndex(1)).to.equal(2);
  });

  it('Should return the correct token ID for owner at index', async function () {
    // Token ID for users[0] at index 0 should be 1
    expect(await nft.tokenOfOwnerByIndex(users[0].address, 0)).to.equal(1);

    // Token ID for users[0] at index 1 should be 2
    expect(await nft.tokenOfOwnerByIndex(users[1].address, 0)).to.equal(2);

    // Token ID for users[0] at index 1 should be 2
    expect(await nft.tokenOfOwnerByIndex(users[1].address, 1)).to.equal(3);
  });

 
  it('Should return the correct token ID at index', async function () {
    // Token ID at index 0 should be 1
    expect(await nft.tokenByIndex(0)).to.equal(1);

    // Token ID at index 1 should be 2
    expect(await nft.tokenByIndex(1)).to.equal(2);

    // Token ID at index 2 should be 3
    expect(await nft.tokenByIndex(2)).to.equal(3);
  });

  it('Should fail to return the token ID at an invalid index', async function () {
    await expect(nft.tokenByIndex(4)).to.be.revertedWith('ERC721Enumerable: global index out of bounds');
  });

  it('Should fail to return the token ID for an invalid owner index', async function () {
    await expect(nft.tokenOfOwnerByIndex(users[0].address, 3)).to.be.revertedWith('ERC721Enumerable: owner index out of bounds');
  });
 

  it('Should mint a new ERC721 token and transfer it', async function () {
    // Transfer the token to addr1
    await nft.transferFrom(users[0].address, users[1].address, 1);

    // Token should now belong to addr1
    expect(await nft.ownerOf(1)).to.equal(users[1].address);
    expect(await nft.balanceOf(users[1].address)).to.equal(3);
  });

  it('Should fail to transfer a token without approval', async function () {
    // Try to transfer the token to addr1 without approval
    await expect(nft.connect(users[1]).transferFrom(users[0].address, users[1].address, 1)).to.be.revertedWith('ERC721: transfer caller is not owner nor approved');
  });

  it('Should approve and transfer a token', async function () {
    // Approve addr1 to transfer the token
    await nft.approve(users[1].address, 1);

    // Transfer the token to addr1
    await nft.connect(users[1]).transferFrom(users[0].address, users[1].address, 1);

    // Token should now belong to addr1
    expect(await nft.ownerOf(1)).to.equal(users[1].address);
  });

  it('Should return the correct allowance', async function () {
    // Approve addr1 to transfer the token
    await nft.approve(users[1].address, 1);

    // Allowance for addr1 should be 1
    expect(await nft.getApproved(1)).to.equal(users[1].address);
  });

  it('Should fail to approve a token if not the owner', async function () {
    // addr1 tries to approve users[2] to transfer the token
    await expect(nft.connect(users[1]).approve(users[2].address, 1)).to.be.revertedWith('ERC721: approve caller is not owner nor approved for all');
  });
});