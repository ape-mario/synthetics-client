import { contract } from '../constants.js'
import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user.js'
import { encodeMethodSignature, encodeBytes32, encodeAddress } from '../abi.js'

const KECCAK_BALANCE = keccak256('balanceOf(bytes32,address)');

export default function getProductBalance(params) {
	const {
		product
	} = params;

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: contract('CAP_ASSETS'),
			data: encodeMethodSignature(KECCAK_BALANCE) + encodeBytes32(product) + encodeAddress(get(user))
		}, "latest"]
	}).then(BigInt)
}
