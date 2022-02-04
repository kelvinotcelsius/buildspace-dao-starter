import sdk from './1-initialize-sdk.js';

/* PURPOSE: This script sets our claim conditions, i.e. the max # of NFTs that can be minted, when can they mint again?*/

const bundleDrop = sdk.getBundleDropModule(
  '0x8A2080739309b3aB0e976e5e5820A5C405175499'
);

(async () => {
  try {
    const claimConditionFactory = bundleDrop.getClaimConditionFactory();
    // Specify conditions.
    claimConditionFactory.newClaimPhase({
      startTime: new Date(), // when users are allowed to start minting NFTs (we set it to be immediately)
      maxQuantity: 100_000, // max number of membership NFTs that can be minted
      maxQuantityPerTransaction: 1, // how many tokens someone can claim in a single transaction
    });

    await bundleDrop.setClaimCondition(0, claimConditionFactory); // interact with our deployed contract on-chain and adjust the conditions. We pass in a 0 for tokenId because it's the first token in our ERC-1155 contract
    console.log(
      '✅ Successfully set claim condition on bundle drop:',
      bundleDrop.address
    );
  } catch (error) {
    console.error('Failed to set claim condition', error);
  }
})();
