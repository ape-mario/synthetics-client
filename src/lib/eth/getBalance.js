import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user'
import { encodeMethodSignature, encodeAddress } from '../abi'

const KECCAK_BALANCE = keccak256('balanceOf(address)');

export default function getBalance(params) {
	const {
		address // erc20 currency address
	} = params;

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to: address,
			data: encodeMethodSignature(KECCAK_BALANCE) + encodeAddress(get(user))
		}, "latest"]
	}).then((balance) => {
		if (balance == '0x') return 0n;
		return BigInt(balance);
	});
}
