import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { NFT } from '../dist/types';
import config from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  // admin deployment info
  const adminDeployment = await hre.deployments.get('SecureAdmin');

  // nft deployment info
  const nftDeployment = await hre.deployments.get('NFT');
  const nftContract = await hre.ethers.getContractAt('NFT', nftDeployment.address) as NFT;
  
  await deploy('NFTProxy', {
    from: deployer,
    args: [
      nftContract.address,
      adminDeployment.address,
      nftContract.interface.encodeFunctionData('init', [
        config.NAME,
        config.SYMBOL,
        deployer,
        config.VALIDATORS,
      ]),
    ],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'ContractProxy',
  });
};

export default func;
func.id = 'NFTProxy';
func.tags = ['hardhat', 'nft'];
func.dependencies = ['NFT'];
