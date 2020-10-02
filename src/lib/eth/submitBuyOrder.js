import { contract, EMPTY_BYTES32, BIGINT_ZERO } from '../constants'
import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user'
import { addresses } from '../../stores/currencies'
import { encodeMethodSignature, encodeBytes32, encodeAddress, encodeUint } from '../abi'
import sign from './sign'
import getNonce from './getNonce'
import getName from './getName'
import approveAmount from './approveAmount'
import { getAssetsAllowance } from './getAllowance'

// submitBuyOrder(symbol: bytes32, payAmount: uint256, currency: address, deadline: uint256, v: uint8, r: bytes32, s: bytes32)
const KECCAK_SUBMIT_BUY_ORDER = keccak256('submitBuyOrder(bytes32,uint256,address,uint256,uint8,bytes32,bytes32)');

const VERSIONS = {
	DAI: '1',
	USDC: '2'
}

export default async function submitBuyOrder(params) {
	const {
		symbol,
		currency,
		amount
	} = params;

	const currencyAddress = get(addresses)[currency];

	const _user = get(user);

	const [name, nonce, allowance] = await Promise.all([
		getName({ address: currencyAddress }),
		getNonce({ address: currencyAddress }),
		getAssetsAllowance({ address: currencyAddress })
	]);

	const deadline = Math.ceil(Date.now() / 1000) + 60 * 5;

	let signature = { v: BIGINT_ZERO, r: EMPTY_BYTES32, s: EMPTY_BYTES32 };

	// sign only if not enough allowance margin
	let permit = false;
	if (allowance < 100n * amount) {
		permit = true;
		signature = await sign({
			owner: _user,
			name,
			version: VERSIONS[currency] || '1',
			verifyingContract: currencyAddress,
			verifyingProduct: currency,
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
			gas: permit ? '0x493E0' : '0x30D40',
			to: contract('CAP_ASSETS'),
			from: _user,
			data: encodeMethodSignature(KECCAK_SUBMIT_BUY_ORDER) +
				encodeBytes32(symbol) +
				encodeUint(amount) +
				encodeAddress(currencyAddress) +
				encodeUint(deadline) +
				encodeUint(v) +
				r.slice(2) +
				s.slice(2),
			chainId: ethereum.chainId // Used to prevent transaction reuse across blockchains. Auto-filled by MetaMask.
		}]
	});
}
