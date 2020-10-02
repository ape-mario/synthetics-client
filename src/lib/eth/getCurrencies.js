import { keccak256 } from 'js-sha3';
import { contract } from '../constants'
import { encodeMethodSignature, decodeAddressArray } from '../abi'

const KECCAK_GET_CURRENCIES = keccak256('getCurrencies()');

export default function getCurrencies() {
	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: contract('CAP_ASSETS'),
			data: encodeMethodSignature(KECCAK_GET_CURRENCIES)
		}, 'latest']
	}).then((result) => {
		let offset = 2 /* 0x */ + 64 /* offset */;
		const size = parseInt(result.slice(offset, offset + 64), 16);
		return decodeAddressArray(result, offset + 64, size);
	});
}