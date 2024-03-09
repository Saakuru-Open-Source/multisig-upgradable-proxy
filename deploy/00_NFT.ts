import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy('NFT', {
    from: deployer,
    args: [],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'NFT',
  });
};

export default func;
func.id = '00_NFT';
func.tags = ['hardhat', 'nft'];
func.dependencies = [];
