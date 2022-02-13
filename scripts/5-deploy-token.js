import sdk from './1-initialize-sdk.js';

// In order to deploy the new contract we need our old friend the app module again.
const app = sdk.getAppModule('0x35834678e4C4E436d9Efb80f0AdA3394E168B7E4');

(async () => {
  try {
    // Deploy a standard ERC-20 contract.
    const tokenModule = await app.deployTokenModule({
      // What's your token's name? Ex. "Ethereum"
      name: 'ZageDAO Governance Token',
      // What's your token's symbol? Ex. "ETH"
      symbol: 'ZAGE',
    });
    console.log(
      '✅ Successfully deployed token module, address:',
      tokenModule.address // if you search the token module adderss on rinkeby.etherscan.io you'll see it
    );
  } catch (error) {
    console.error('failed to deploy token module', error);
  }
})();
