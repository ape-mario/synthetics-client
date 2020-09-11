import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { encodeMethodSignature, decodeString } from '../abi.js'

const KECCAK_SYMBOL = keccak256('symbol()');

// TODO add local cache also

const symbols_cache = {}

export default function getSymbol(params) {
	const {
		address // erc20 currency address
	} = params;

	if (symbols_cache[address]) {
		return new Promise((resolve, reject) => { resolve(symbols_cache[address]) });
	}

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(KECCAK_SYMBOL)
		}, "latest"]
	}).then((result) => {
		const offset = 2 /* 0x */ + 64 /* offset */;
		const length = parseInt(result.slice(offset, offset + 64), 16);
		const string_value = decodeString(result, offset + 64, length);

		// cache
		symbols_cache[address] = string_value;
		return string_value;
	});
}
