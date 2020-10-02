import { contract } from '../constants'
import { keccak256 } from 'js-sha3'
import { user } from '../../stores/user'
import { encodeMethodSignature, encodeBytes32, decodeAddress } from '../abi'

const KECCAK_TOKEN = keccak256('token(bytes32)');

const cache = {}

export default function getProductAddress(params) {
	const {
		product
	} = params;

	if (cache[product]) return Promise.resolve(cache[product]);

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: contract('CAP_ASSETS'),
			data: encodeMethodSignature(KECCAK_TOKEN) + encodeBytes32(product)
		}, "latest"]
	}).then((result) => {
		const address = decodeAddress(result, 2);
		if (address.length > 2) {
			cache[product] = address;
		}
		return address;
	});
}
