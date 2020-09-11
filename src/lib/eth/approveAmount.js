import { CONTRACTS } from '../constants.js'
import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user.js'
import { encodeMethodSignature, encodeAddress, encodeUint } from '../abi.js'

const KECCAK_APPROVE = keccak256('approve(address,uint256)');

export default function approveAmount(params) {
	const {
		address, // erc20 address (currency)
		amount
	} = params;

	return ethereum.request({
		method: 'eth_sendTransaction',
		params: [{
			nonce: '0x00', // ignored by MetaMask
			gasPrice: '0x174876E800', // customizable by user during MetaMask confirmation. (100Gwei gas price)
			gas: '0x30D40', // customizable by user during MetaMask confirmation. (200000 gas limit)
			to: address, // Required except during contract publications.
			from: get(user), // must match user's active address.
			value: '0x00', // Only required to send ether to the recipient from the initiating external account.
			data: encodeMethodSignature(KECCAK_APPROVE) + encodeAddress(CONTRACTS.CAP_ASSETS) + encodeUint(amount),
			chainId: 1, // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
		}]
	});
}