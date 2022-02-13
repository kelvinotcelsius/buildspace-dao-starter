import { ethers } from 'ethers';
import sdk from './1-initialize-sdk.js';

// This is the address of our ERC-20 governance contract printed out in the step before.
const tokenModule = sdk.getTokenModule(
  '0xFd25dcDBC630d9BBCeC16916102e83b4B409BA1a'
);

(async () => {
  try {
    // What's the max supply you want to set? 1,000,000 is a nice number!
    const amount = 1_000_000;
    // We use the util function from "ethers" to convert the amount to have 18 decimals (which is the standard for ERC20 tokens).
    // Why would we want 18 decimal places? Well, it allows our token to be sent very precisely by users. For example, what if I wanted to send 0.00000001 of my token to a friend? In this case, I could! I have 18 decimal places worth of precision. Basically — we can send really small amounts of tokens with no problem.
    const amountWith18Decimals = ethers.utils.parseUnits(amount.toString(), 18);
    // Interact with your deployed ERC-20 contract and mint the tokens!
    await tokenModule.mint(amountWith18Decimals);
    const totalSupply = await tokenModule.totalSupply();

    // Print out how many of our token's are out there now!
    console.log(
      '✅ There now is',
      ethers.utils.formatUnits(totalSupply, 18),
      '$ZAGE in circulation'
    );
  } catch (error) {
    console.error('Failed to print money', error);
  }
})();
