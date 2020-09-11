import { keccak256 } from 'js-sha3';
import { CONTRACTS } from '../constants.js'
import { encodeMethodSignature, encodeBytes32, decodeUint } from '../abi.js'

const KECCAK_MAX_AMOUNT = keccak256('maxAmount(bytes32)');

export default function getMaxAmount(params) {
	const {
		product
	} = params;

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: CONTRACTS.CAP_ASSETS,
			data: encodeMethodSignature(KECCAK_MAX_AMOUNT) + encodeBytes32(product)
		}, 'latest']
	}).then((result) => decodeUint(result, 2));
}
