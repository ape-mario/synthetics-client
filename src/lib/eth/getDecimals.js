import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { encodeMethodSignature } from '../abi.js'

const KECCAK_DECIMALS = keccak256('decimals()');

// TODO add local cache also

const decimals_cache = {}

export default function getDecimals(params) {
	const {
		address // erc20 currency address
	} = params;

	if (decimals_cache[address]) return new Promise.resolve(decimals_cache[address]);

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(KECCAK_DECIMALS)
		}, "latest"]
	}).then((result) => {
		const decimals = BigInt(result);

		// cache
		decimals_cache[address] = decimals;
		return decimals;
	});
}
