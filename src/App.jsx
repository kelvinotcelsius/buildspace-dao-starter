import { useWeb3 } from '@3rdweb/hooks';
import { ThirdwebSDK } from '@3rdweb/sdk';
import { useEffect, useMemo, useState } from 'react';
import { ethers } from 'ethers';

// We instantiate the sdk on Rinkeby.
const sdk = new ThirdwebSDK('rinkeby');

// We can grab a reference to our ERC-1155 contract.
const bundleDropModule = sdk.getBundleDropModule(
  '0x8A2080739309b3aB0e976e5e5820A5C405175499'
);
const tokenModule = sdk.getTokenModule(
  '0xFd25dcDBC630d9BBCeC16916102e83b4B409BA1a'
);

const App = () => {
  const { connectWallet, address, error, provider } = useWeb3(); // get the connectWallet hook

  const signer = provider ? provider.getSigner() : undefined; // The signer is required to sign transactions on the blockchain. Without it we can only read data, not write.

  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false); // show a a loading state while the NFT is minting

  // Holds the amount of token each member has in state.
  const [memberTokenAmounts, setMemberTokenAmounts] = useState({});
  // The array holding all of our members addresses.
  const [memberAddresses, setMemberAddresses] = useState([]);

  // A fancy function to shorten someones wallet address, no need to show the whole thing.
  const shortenAddress = (str) => {
    return str.substring(0, 6) + '...' + str.substring(str.length - 4);
  };

  // This useEffect grabs all the addresses of our members holding our NFT.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Just like we did in the 7-airdrop-token.js file! Grab the users who hold our NFT with tokenId 0.
    bundleDropModule
      .getAllClaimerAddresses('0')
      .then((addresses) => {
        console.log('🚀 Members addresses', addresses);
        setMemberAddresses(addresses);
      })
      .catch((err) => {
        console.error('failed to get member list', err);
      });
  }, [hasClaimedNFT]);

  // This useEffect grabs the # of token each member holds.
  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    // Get the token balances of everyone who holds our membership NFT on our ERC-20 contract
    //
    tokenModule
      .getAllHolderBalances()
      .then((amounts) => {
        console.log('👜 Amounts', amounts);
        setMemberTokenAmounts(amounts);
      })
      .catch((err) => {
        console.error('failed to get token amounts', err);
      });
  }, [hasClaimedNFT]);

  // Now, we combine the memberAddresses and memberTokenAmounts into a single array
  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      return {
        address,
        tokenAmount: ethers.utils.formatUnits(
          // If the address isn't in memberTokenAmounts, it means they don't
          // hold any of our token.
          memberTokenAmounts[address] || 0,
          18
        ),
      };
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    // We pass the signer to the sdk, which enables us to interact with our deployed contract!
    sdk.setProviderOrSigner(signer);
  }, [signer]);

  useEffect(() => {
    // If they don't have an connected wallet, exit!
    if (!address) {
      return;
    }

    // Check if the user has the NFT by using bundleDropModule.balanceOf
    return bundleDropModule
      .balanceOf(address, '0') // token id is 0 because the membership nft is the first nft we created on the ERC-1155 contract
      .then((balance) => {
        // If balance is greater than 0, they have our NFT!
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log('🌟 this user has a membership NFT!');
        } else {
          setHasClaimedNFT(false);
          console.log("😭 this user doesn't have a membership NFT.");
        }
      })
      .catch((error) => {
        setHasClaimedNFT(false);
        console.error('failed to nft balance', error);
      });
  }, [address]);

  const mintNft = () => {
    setIsClaiming(true);
    // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
    bundleDropModule
      .claim('0', 1)
      .then(() => {
        // Set claim state.
        setHasClaimedNFT(true);
        // Show user their fancy new NFT!
      })
      .catch((err) => {
        console.error('failed to claim', err);
      })
      .finally(() => {
        // Stop loading state.
        setIsClaiming(false);
      });
  };

  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className='landing'>
        <h1>Welcome to ZageDAO</h1>
        <button onClick={() => connectWallet('injected')} className='btn-hero'>
          Connect your wallet
        </button>
      </div>
    );
  }

  if (hasClaimedNFT) {
    return (
      <div className='member-page'>
        <h1>&#9889; ZageDAO Member Page &#9889;</h1>
        <p>
          Congratulations on joining the community. Check out your NFT on{' '}
          <a
            href={`https://testnets.opensea.io/assets/${bundleDropModule.address.toLowerCase()}/0`}
            target='_blank'
            rel='noopener noreferrer'
          >
            OpenSea
          </a>
          . Announcements to come soon...
        </p>
        <div>
          <h2>Member List</h2>
          <table className='card'>
            <thead>
              <tr>
                <th>Address</th>
                <th>Token Amount</th>
              </tr>
            </thead>
            <tbody>
              {memberList.map((member) => {
                return (
                  <tr key={member.address}>
                    <td>{shortenAddress(member.address)}</td>
                    <td>{member.tokenAmount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className='mint-nft'>
      <h1>Mint your free &#9889;ZageDAO&#9889; Membership NFT</h1>
      <button disabled={isClaiming} onClick={() => mintNft()}>
        {isClaiming ? 'Minting...' : 'Mint your nft (FREE)'}
      </button>
    </div>
  );
};

export default App;
