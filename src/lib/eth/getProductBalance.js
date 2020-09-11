import { CONTRACTS } from '../constants.js'
import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user.js'
import { encodeMethodSignature, encodeBytes32, encodeAddress } from '../abi.js'
import BN from 'bn.js'

const KECCAK_BALANCE = keccak256('balanceOf(bytes32,address)');

export default function getProductBalance(params) {
	const {
		product
	} = params;

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: CONTRACTS.CAP_ASSETS,
			data: encodeMethodSignature(KECCAK_BALANCE) + encodeBytes32(product) + encodeAddress(get(user))
		}, "latest"]
	}).then(result => new BN(result.substring(2), 16))
}
