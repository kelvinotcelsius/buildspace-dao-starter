import { ThirdwebSDK } from '@3rdweb/sdk';
import ethers from 'ethers';

/* PURPOSE: This script initialized the ThirdWeb SDK so that other files can call ThirdWeb methods */

// Importing and configuring our .env file that we use to securely store our environment variables
import dotenv from 'dotenv';
dotenv.config();

// Some quick checks to make sure our .env is working.
if (!process.env.PRIVATE_KEY || process.env.PRIVATE_KEY === '') {
  console.log('🛑 Private key not found.');
}
if (!process.env.ALCHEMY_API_URL || process.env.ALCHEMY_API_URL === '') {
  console.log('🛑 Alchemy API URL not found.');
}
if (!process.env.WALLET_ADDRESS || process.env.WALLET_ADDRESS === '') {
  console.log('🛑 Wallet Address not found.');
}

const sdk = new ThirdwebSDK(
  new ethers.Wallet(
    process.env.PRIVATE_KEY,
    ethers.getDefaultProvider(process.env.ALCHEMY_API_URL) // RPC URL, we'll use our Alchemy API URL from our .env file.
  )
);

// ensure we can retrieve the apps we make with ThirdWeb's SDK
(async () => {
  try {
    const apps = await sdk.getApps();
    console.log('👋 Your app address is:', apps[0].address);
  } catch (err) {
    console.error('Failed to get apps from the sdk', err);
    process.exit(1);
  }
})();

// export the initialized thirdweb SDK so that we can use it in our other scripts
export default sdk;
