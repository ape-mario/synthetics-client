import { keccak256 } from 'js-sha3';
import { CONTRACTS } from '../constants.js'
import { encodeMethodSignature, decodeAddressArray } from '../abi.js'

const KECCAK_GET_CURRENCIES = keccak256('getCurrencies()');

export default function getCurrencies() {
	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: CONTRACTS.CAP_CLP,
			data: encodeMethodSignature(KECCAK_GET_CURRENCIES)
		}, 'latest']
	}).then((result) => {
		let offset = 2 /* 0x */ + 64 /* offset */;
		const size = parseInt(result.slice(offset, offset + 64), 16);
		return decodeAddressArray(result, offset + 64, size);
	});
}