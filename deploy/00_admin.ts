import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import config from '../config';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  await deploy('SecureAdmin', {
    from: deployer,
    args: [
      deployer,
      config.VALIDATORS,
    ],
    log: true,
    skipIfAlreadyDeployed: true,
    contract: 'SecureAdmin',
  });
};

export default func;
func.id = 'SecureAdmin';
func.tags = ['hardhat', 'nft'];
func.dependencies = [];
