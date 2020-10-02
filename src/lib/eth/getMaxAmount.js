import { keccak256 } from 'js-sha3';
import { contract } from '../constants'
import { encodeMethodSignature, encodeBytes32, decodeUint } from '../abi'

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
	}).then((result) => {
		const maxAmount = decodeUint(result, 2);

		// cache
		if (maxAmount != null) {
			max_amount_cache[product] = maxAmount;
		}
		return maxAmount || 0n;
	});
}
