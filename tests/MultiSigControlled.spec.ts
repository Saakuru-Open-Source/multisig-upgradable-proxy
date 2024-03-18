import { Wallet } from 'ethers';
import { waffle } from 'hardhat';
import { NFT, SecureAdmin } from '../dist/types';
import { integrationFixture } from './shared/integration';

const { expect } = require('chai');
const { ethers } = require('hardhat');


describe('MultiSigControlled.spec', function () {
  let users: Wallet[];
  let admin: SecureAdmin;
  let nft: NFT;
  let nft2: NFT;
  let loadFixture: ReturnType<typeof waffle.createFixtureLoader>;
  
  before('create fixture loader', async () => {
    users = await (ethers as any).getSigners();
    loadFixture = waffle.createFixtureLoader(users);
  });
  
  beforeEach('deploy fixture', async () => {
    ({ admin, nft, nft2 } = await loadFixture(integrationFixture));
  });

  describe('MultiSign management', () => {
    it('Should return correct owner', async function () {
      const owner = await admin.owner();
      expect(owner).to.be.equal(users[0].address);
    });
    
    it('Should set admins correctly during deployment', async () => {
      await expect(await admin.isAdmin(users[0].address)).to.be.equal(false);
      await expect(await admin.isAdmin(users[1].address)).to.be.equal(true);
      await expect(await admin.isAdmin(users[2].address)).to.be.equal(true);
      await expect(await admin.isAdmin(users[3].address)).to.be.equal(true);
      await expect(await admin.isAdmin(users[4].address)).to.be.equal(true);
      await expect(await admin.isAdmin(users[5].address)).to.be.equal(true);
      await expect(await admin.isAdmin(users[6].address)).to.be.equal(false);
    });
  });

  describe('Proxy upgrade with MultiSig', () => {
    it('Should not upgrade contract without 2fa', async function () {
      const implementation = await admin.getProxyImplementation(nft.address);
      await admin.connect(users[0]).upgrade(nft.address, nft2.address);
      const implementation2 = await admin.getProxyImplementation(nft.address);
      expect(implementation === implementation2, 'Updated without MultiSig');
    });
    
    it('Should not allow create upgrade proposal for non admin', async function () {
      await expect(admin.connect(users[6]).createUpgradeProposal(nft.address, nft2.address)).to.be.revertedWith('MultiSigControlled: Not allowed');
    });

    it('Should not allow create upgrade proposal for zero address', async function () {
      await expect(admin.connect(users[0]).createUpgradeProposal(nft.address, '0x0000000000000000000000000000000000000000')).to.be.revertedWith('MultiSigControlled: Zero address');
    });

    it('Should create proposal correctly', async function () {
      await admin.connect(users[1]).createUpgradeProposal(nft.address, nft2.address);
      const proposal = await admin.getProposal(1);
      expect(proposal.participants[0]).to.be.equal(users[1].address);
      expect(proposal.participants.length).to.be.equal(1);
      expect(proposal.proxyAddress).to.be.equal(nft.address);
      expect(proposal.newImplementation).to.be.equal(nft2.address);
      expect(proposal.valid).to.be.equal(true);
    });

    it('Should upgrade correctly after consensus reached', async () => {
      await admin.connect(users[1]).createUpgradeProposal(nft.address, nft2.address);
      await admin.connect(users[2]).approveUpgradeProposal(1);
      await admin.connect(users[3]).approveUpgradeProposal(1);

      const implementation = await admin.getProxyImplementation(nft.address);
      expect(implementation).to.be.equal(nft2.address);

      const proposal = await admin.getProposal(1);
      expect(proposal.valid).to.be.equal(false);
      await expect(admin.connect(users[2]).approveUpgradeProposal(1)).to.be.revertedWith('Secure Admin: Proposal is not valid');
    });
  });


});