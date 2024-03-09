import * as ethers from 'ethers';
import * as dotenv  from 'dotenv';
import nftAbi from '../../abi/contracts/NFT.sol/NFT.json';
import adminAbi from '../../abi/contracts/upgrade/SecureAdmin.sol/SecureAdmin.json';
import { networks } from '../../helpers/networks';
import { NFT, SecureAdmin } from '../../dist/types';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const admin = require(`../../deployments/${process.env.NETWORK}/SecureAdmin.json`);
const proxy = require(`../../deployments/${process.env.NETWORK}/NFTProxy.json`);
const implementation = require(`../../deployments/${process.env.NETWORK}/NFT.json`);

export const deployments = {
  admin,
  proxy,
  implementation,
};

const rpcUrl = networks[process.env.NETWORK || ''].url;
const provider = ethers.getDefaultProvider(rpcUrl);

export const wallet = new ethers.Wallet(networks[process.env.NETWORK || '0'].accounts[0], provider);

export const getContracts = () => {
  return {
    admin: new ethers.Contract(admin.address, adminAbi, wallet) as SecureAdmin,
    nft: new ethers.Contract(proxy.address, nftAbi, wallet) as NFT,
  };
};

export const txConfig = {
  gasPrice: networks[process.env.NETWORK || ''].gasPrice !== undefined ? networks[process.env.NETWORK || ''].gasPrice : undefined,
  gasLimit: 10000000,
};