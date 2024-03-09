import * as dotenv  from 'dotenv';
import { getContracts } from './utils/setup';

dotenv.config();

console.log('Running... ', process.env.NETWORK);

const main = async () => {

  const contracts = getContracts();

  const implementation = await contracts.admin.getProxyImplementation(contracts.nft.address);
  console.log('implementation: ', implementation);

};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
