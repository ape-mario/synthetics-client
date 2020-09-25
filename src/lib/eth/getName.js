import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { encodeMethodSignature, decodeString } from '../abi.js'

const KECCAK_NAME = keccak256('name()');

const names_cache = {}

export default function getName(params) {
	const {
		address // erc20 currency address
	} = params;

	if (names_cache[address]) return Promise.resolve(names_cache[address]);

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(KECCAK_NAME)
		}, "latest"]
	}).then((result) => {
		const offset = 2 /* 0x */ + 64 /* offset */;
		const length = parseInt(result.slice(offset, offset + 64), 16);
		const string_value = decodeString(result, offset + 64, length);

		// cache
		names_cache[address] = string_value;
		return string_value;
	});
}
