import sdk from './1-initialize-sdk.js';

// Grab the app module address.
const appModule = sdk.getAppModule(
  '0x35834678e4C4E436d9Efb80f0AdA3394E168B7E4'
);

// Creates an ERC-20 voting contract
(async () => {
  try {
    const voteModule = await appModule.deployVoteModule({
      // Give your governance contract a name.
      name: "ZageDAO's Epic Proposals",

      // This is the location of our governance token, our ERC-20 contract!
      votingTokenAddress: '0xFd25dcDBC630d9BBCeC16916102e83b4B409BA1a',

      // After a proposal is created, when can members start voting?
      // For now, we set this to immediately.
      proposalStartWaitTimeInSeconds: 0,

      // How long do members have to vote on a proposal when it's created?
      // Here, we set it to 24 hours (86400 seconds)
      proposalVotingTimeInSeconds: 24 * 60 * 60,

      // Let’s say a member creates a proposal and the other 199 DAO members are on vacation at Disney World and aren’t online. Well, in this case, if that one DAO member creates the proposal and votes “YES” on their own proposal — that means 100% of the votes said “YES” (since there was only one vote) and the proposal would pass once proposalVotingTimeInSeconds is up! To avoid this, we use a quorum which says “In order for a proposal to pass, a minimum x % of token must be used in the vote”. For the sake of example, let’s just do votingQuorumFraction: 0 which means the proposal will pass regardless of what % of token was used on the vote. This means one person could technically pass a proposal themselves if the other members are on vacation lol. For now, this is fine. The quorum you set in the real world depends on your supply and how much you initially airdropped.
      votingQuorumFraction: 0,

      // What's the minimum # of tokens a user needs to be allowed to create a proposal?
      // I set it to 0. Meaning no tokens are required for a user to be allowed to
      // create a proposal.
      minimumNumberOfTokensNeededToPropose: '0',
    });

    console.log(
      '✅ Successfully deployed vote module, address:',
      voteModule.address
    );
  } catch (err) {
    console.error('Failed to deploy vote module', err);
  }
})();
