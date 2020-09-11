import { keccak256 } from 'js-sha3';
import { CONTRACTS } from '../constants.js'
import { encodeMethodSignature, encodeUint, decodeBytes32Array } from '../abi.js'

const KECCAK_GET_SYMBOLS = keccak256('getSymbols(uint256,uint256)');

export default function getProducts(firstIndex, length) {
	return new Promise((resolve) => { resolve(['BTC', 'ETH']) });
	// return ethereum.request({
	// 	method: 'eth_call',
	// 	params: [{
	// 		to: CONTRACTS.CAP_ASSETS,
	// 		data: encodeMethodSignature(KECCAK_GET_SYMBOLS) + encodeUint(firstIndex) + encodeUint(length)
	// 	}, 'latest']
	// }).then((result) => {
	// 	let offset = 2 /* 0x */ + 64 /* offset */;
	// 	const size = parseInt(result.slice(offset, offset + 64), 16);
	// 	return decodeBytes32Array(result, offset + 64, size);
	// });
}
