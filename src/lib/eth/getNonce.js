import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user.js'
import { encodeMethodSignature, encodeAddress } from '../abi.js'

const KECCAK_NONCES = keccak256('nonces(address)');

export default function getNonce(params) {
	const {
		address // erc20 currency address
	} = params;

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(KECCAK_NONCES) + encodeAddress(get(user))
		}, "latest"]
	});
}
