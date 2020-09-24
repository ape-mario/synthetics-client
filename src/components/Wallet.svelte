<script>

  import { onMount } from 'svelte';
  import { user, minified_user } from '../stores/user.js'
  import { showToast } from '../stores/toasts.js'

  /*
  - Use sign typed data v4 RPC method: https://danfinlay.github.io/js-eth-personal-sign-examples/ to sign nonce message
  - more info about signing: https://medium.com/metamask/eip712-is-coming-what-to-expect-and-how-to-use-it-bb92fd1a7a26

  Steps
  - connect wallet
  - with user address, create address + nonce in DB and return nonce to sign
  - signature dialog with ({action: login, nonce})
  - send signature and address to server for verification, if good then send a session id the user can use until expiration date for authenticated API calls
  - session id address has to match authenticated address from metamask
  - withdrawals can only be made to currently connected account for which the balance corresponds
  - no need for web3, you can use JSON RPC calls through metamask directly which uses infura

  */

  let isMetamask;

  function initProvider() {

    isMetamask = window.ethereum && window.ethereum.isMetaMask;

    if (!isMetamask) {
      showToast('Please install Metamask to use Cap.');
      return;
    };

   // console.log('ethereum.chainId', ethereum.chainId);

    // if (ethereum.chainId && ethereum.chainId != '0x1') {
    //   showToast('Cap only works on Ethereum mainnet. Please switch to the Main Ethereum Network and reload the page.');
    //   return;
    // }

    /**********************************************************/
    /* Handle chain (network) and chainChanged (per EIP-1193) */
    /**********************************************************/

    // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
    // returns incorrectly formatted chain ID values.
    let currentChainId = ethereum.chainId;

    ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
      // We recommend reloading the page, unless you must do otherwise
      // console.log('_chainId', _chainId);
      // if (_chainId != '0x1') {
      //   showToast('Cap only works on Ethereum mainnet. Please switch back to the Main Ethereum Network.');
      // }

      //window.location.reload();
      // TODO: this seems to be causing infinite reload loops, maybe from the live reload
    }

    /***********************************************************/
    /* Handle user accounts and accountsChanged (per EIP-1193) */
    /***********************************************************/

    let currentAccount = null;
    ethereum
      .request({ method: 'eth_accounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        // Some unexpected error.
        // For backwards compatibility reasons, if no accounts are available,
        // eth_accounts will return an empty array.
        console.error(err);
      });

    // Note that this event is emitted on page load.
    // If the array of accounts is non-empty, you're already
    // connected.
    ethereum.on('accountsChanged', handleAccountsChanged);


    ethereum.on('connect', () => {
      // You can now submit RPC requests
    })

    ethereum.on('disconnect', () => {
      // Disconnected from network, must reload the page to reconnect
      window.location.reload(); // reloads stores etc.
      localStorage.removeItem('selected-account');
      localStorage.removeItem('selected-product');
    });

  }

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    // console.log('handleAccountsChanged', accounts);
    if (accounts.length === 0) {
      user.set(null);
    } else if (accounts[0] !== $user) {
      user.set(accounts[0]);
    }
  }

  // Called on button click
  function connect() {
    if (!isMetamask) {
      showToast('Please install Metamask to use Cap.');
      return;
    };
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (error.code === 4001) {
          // Request rejected by the user
          // EIP-1193 userRejectedRequest error
            console.log('Rejected by user.');
          } else if (error.code == -32602) {
            console.log('Params invalid.');
          } else if (error.code == -32603) {
            console.log('Internal error.');
          } else {
            console.error(error);
          }
      });
  }

  onMount(initProvider);

</script>

<style>
  
</style>

{#if $user}
  <div>✔ {$minified_user}</div>
{:else}
  <div><a on:click={connect}>Connect Metamask</a></div>
{/if}