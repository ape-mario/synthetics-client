import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { encodeMethodSignature, decodeString } from '../abi'

const KECCAK_DOMAIN_SEPARATOR = keccak256('DOMAIN_SEPARATOR()');

export default function getDomainSeparator(params) {
	const {
		address // erc20 currency address
	} = params;

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(KECCAK_DOMAIN_SEPARATOR)
		}, "latest"]
	}).then((result) => {
		const offset = 2 /* 0x */ + 64 /* offset */;
		const length = parseInt(result.slice(offset, offset + 64), 16);
		const string_value = decodeString(result, offset + 64, length);

		return string_value;
	});
}
