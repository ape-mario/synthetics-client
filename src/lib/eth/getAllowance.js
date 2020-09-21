import { contract } from '../constants.js'
import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user.js'
import { encodeMethodSignature, encodeAddress } from '../abi.js'

const KECCAK_ALLOWANCE = keccak256('allowance(address,address)');

export default function getAllowance(params) {
	const {
		owner,
		spender,
		address // erc20 currency address
	} = params;

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(KECCAK_ALLOWANCE) + encodeAddress(owner) + encodeAddress(spender)
		}, "latest"]
	})
	.then(BigInt);
}

export function getAssetsAllowance(params) {
	const {
		address // erc20 currency address
	} = params;

	return getAllowance({
		owner: get(user),
		spender: contract('CAP_ASSETS'),
		address
	});
}
