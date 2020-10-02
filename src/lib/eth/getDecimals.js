import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { encodeMethodSignature } from '../abi'

const KECCAK_DECIMALS = keccak256('decimals()');

const cache = {}

export default function getDecimals(params) {
	const {
		address // erc20 currency address
	} = params;

	if (cache[address]) return Promise.resolve(cache[address]);

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(KECCAK_DECIMALS)
		}, "latest"]
	}).then((result) => {
		const decimals = BigInt(result);

		// cache
		cache[address] = decimals;
		return decimals;
	});
}
