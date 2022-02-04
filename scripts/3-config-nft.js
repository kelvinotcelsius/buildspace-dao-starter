import sdk from './1-initialize-sdk.js';
import { readFileSync } from 'fs';

/* PURPOSE: This script creates and deploys the metadata for our membership NFT itself */

// Get our ERC-1155 contract
const bundleDrop = sdk.getBundleDropModule(
  '0x8A2080739309b3aB0e976e5e5820A5C405175499'
);

// Create our NFT on our ERC-1155. Remember, because it's an ERC-1155 all our members will mint the same NFT
(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: 'One Ring to Zap Them All',
        description: 'This NFT will give you access to ZageDAO!',
        image: readFileSync('scripts/assets/lightning-ring.png'), // Must be a local image, internet links won't work.
      },
    ]);
    console.log('✅ Successfully created a new NFT in the drop!');
  } catch (error) {
    console.error('failed to create the new NFT', error);
  }
})();
