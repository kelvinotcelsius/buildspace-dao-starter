import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

/* PURPOSE: This script creates and deploys the ERC-1155 contract that defines the metadata for our multi-ownership membership NFT. After running this script you will see the contract in the ThirdWeb dashboard. */

const app = sdk.getAppModule('0x35834678e4C4E436d9Efb80f0AdA3394E168B7E4'); // this is the address of the ThirdWeb SDK app from the first script

// Defines the NFT metadata
(async () => {
  try {
    const bundleDropModule = await app.deployBundleDropModule({
      // The collection's name, ex. CryptoPunks
      name: 'ZageDAO Membership',
      // A description for the collection.
      description: 'A DAO for elite members of the ZageVerse.',
      // The image for the collection that will show up on OpenSea.
      image: readFileSync('scripts/assets/zage-logo.png'),
      // We need to pass in the address of the person who will be receiving the proceeds from sales of nfts in the module. Must be a local image, internet links won't work.
      // We're planning on not charging people for the drop, so we'll pass in the 0x0 address. You can set this to your own wallet address if you want to charge for the drop.
      primarySaleRecipientAddress: ethers.constants.AddressZero,
    });

    console.log(
      '✅ Successfully deployed bundleDrop module (i.e. our ERC-1155 contract), address:',
      bundleDropModule.address
    );
    console.log(
      '✅ ERC-1155 contract metadata:',
      await bundleDropModule.getMetadata()
    );
  } catch (error) {
    console.log('failed to deploy ERC-1155 contract', error);
  }
})();
