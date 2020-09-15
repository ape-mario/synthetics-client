import { CONTRACTS } from '../constants.js'
import { keccak256 } from 'js-sha3'
import { user } from '../../stores/user.js'
import { encodeMethodSignature, encodeBytes32, decodeAddress } from '../abi.js'

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
			to: CONTRACTS.CAP_ASSETS,
			data: encodeMethodSignature(KECCAK_TOKEN) + encodeBytes32(product)
		}, "latest"]
	}).then((result) => {
		const address = decodeAddress(result, 2);
		cache[product] = address;
		return address;
	});
}
