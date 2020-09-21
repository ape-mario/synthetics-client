import { contract, EMPTY_BYTES32, BIGINT_ZERO } from '../constants.js'
import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user.js'
import { addresses } from '../../stores/currencies.js'
import { encodeMethodSignature, encodeBytes32, encodeAddress, encodeUint } from '../abi.js'
import sign from './sign.js'
import getNonce from './getNonce.js'
import getName from './getName.js'
import getDomainSeparator from './getDomainSeparator.js'
import { getAssetsAllowance } from './getAllowance.js'

// submitSellOrder(bytes32 symbol, uint256 amountToBurn, address currency, uint256 deadline, uint8 v, bytes32 r, bytes32 s)
const KECCAK_SUBMIT_SELL_ORDER = keccak256('submitSellOrder(bytes32,uint256,address,uint256,uint8,bytes32,bytes32)');

export default async function submitSellOrder(params) {
	const {
		symbol,
		address, // address of the product
		currency,
		amount
	} = params;

	const _user = get(user);
	const [name, nonce, allowance] = await Promise.all([
		getName({ address }),
		getNonce({ address }),
		getAssetsAllowance({ address })
	]);

	const deadline = Math.ceil(Date.now() / 1000) + 60 * 5;

	let signature = { v: BIGINT_ZERO, r: EMPTY_BYTES32, s: EMPTY_BYTES32 };
	// sign only if not enough allowance margin
	if (allowance < 100n * amount) {
		signature = await sign({
			owner: _user,
			name: 'Cap',
			version: '1',
			verifyingContract: address,
			verifyingProduct: symbol,
			deadline: '0x' + encodeUint(deadline),
			nonce
		});
	}

	const { v, r, s } = signature;
	return ethereum.request({
		method: 'eth_sendTransaction',
		params: [{
			nonce: '0x00', // ignored by MetaMask
			gasPrice: '0x174876E800', // customizable by user during MetaMask confirmation. (100Gwei gas price)
			gas: '0x30D40', // customizable by user during MetaMask confirmation. (200000 gas limit)
			to: contract('CAP_ASSETS'),
			from: _user,
			data: encodeMethodSignature(KECCAK_SUBMIT_SELL_ORDER) +
				encodeBytes32(symbol) +
				encodeUint(amount) +
				encodeAddress(get(addresses)[currency]) +
				encodeUint(deadline) +
				encodeUint(v) +
				r.slice(2) +
				s.slice(2),
			chainId: ethereum.chainId // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
		}]
	});
}
