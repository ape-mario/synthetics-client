import { keccak256 } from 'js-sha3';
import { encodeMethodSignature, encodeUint, decodeBytes32Array } from '../abi'

const KECCAK_GET_SYMBOLS = keccak256('getSymbols(uint256,uint256)');

export default function getProducts(firstIndex, length) {
	return Promise.resolve(['BTC', 'AAPL']);
}
