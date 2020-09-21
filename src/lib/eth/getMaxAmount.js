import { keccak256 } from 'js-sha3';
import { contract } from '../constants.js'
import { encodeMethodSignature, encodeBytes32, decodeUint } from '../abi.js'

const KECCAK_MAX_AMOUNT = keccak256('maxAmount(bytes32)');

const max_amount_cache = {}

export default function getMaxAmount(params) {
	const {
		product
	} = params;

	if (max_amount_cache[product]) return Promise.resolve(max_amount_cache[product]);

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: contract('CAP_ASSETS'),
			data: encodeMethodSignature(KECCAK_MAX_AMOUNT) + encodeBytes32(product)
		}, 'latest']
	}).then((result) => decodeUint(result, 2));
}
