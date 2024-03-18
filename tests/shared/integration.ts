import { ethers } from 'hardhat';
import { Fixture } from 'ethereum-waffle';
import { ContractProxy, SecureAdmin, NFT } from '../../dist/types';
import config from '../../config';

const argv = config;

interface ContractFixture {
  nft: NFT;
  nft2: NFT;
  admin: SecureAdmin;
  nftProxy: ContractProxy;
}

export const integrationFixture: Fixture<ContractFixture> =
  async function (): Promise<ContractFixture> {
    const users = await ethers.getSigners();

    // nft
    const nft = await (
      await ethers.getContractFactory('NFT')
    ).deploy() as NFT;
    await nft.deployed();

    // nft
    const nft2 = await (
      await ethers.getContractFactory('NFT')
    ).deploy() as NFT;
    await nft2.deployed();

    // admin
    const admin = await (
      await ethers.getContractFactory('SecureAdmin')
    ).deploy(
      users[0].address,
      [users[1].address, users[2].address, users[3].address, users[4].address, users[5].address],
    ) as SecureAdmin;
    await admin.deployed();

    const nftProxy = await (await ethers.getContractFactory('ContractProxy')).deploy(
      nft.address,
      admin.address,
      nft.interface.encodeFunctionData('init', [
        argv.NAME,
        argv.SYMBOL,
        users[0].address,
        [users[1].address, users[2].address, users[3].address, users[4].address, users[5].address],
      ]),
    ) as ContractProxy;
    await nftProxy.deployed();

    const nftAttached = nft.attach(nftProxy.address);
    
    return {
      nft: nftAttached,
      nft2,
      admin,
      nftProxy,
    };
  };
