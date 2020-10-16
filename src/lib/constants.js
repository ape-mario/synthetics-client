import { keccak256 } from 'js-sha3';

const CONTRACTS = {
	'0x1': {
		CAP_ASSETS: ''
	},
	'0x3': {
		CAP_ASSETS: '0x75C764B7A673e2877eA3178E63B958dD67eCFab4'.toLowerCase()
	},
	'0x2a': {
		CAP_ASSETS: ''
	},
	'0x4': {
		CAP_ASSETS: ''
	},
	'0x5': {
		CAP_ASSETS: ''
	},
	'0x64': {
		CAP_ASSETS: '0x6eD79Aa1c71FD7BdBC515EfdA3Bd4e26394435cC'.toLowerCase()
	}
};

export function contract(name) {
	if (!window.ethereum || !ethereum.chainId) return null;
	return CONTRACTS[ethereum.chainId][name];
}

export const ETHERSCAN_URI = {
	'0x1': 'https://etherscan.io',
	'0x3': 'https://ropsten.etherscan.io',
	'0x2a': 'https://kovan.etherscan.io',
	'0x4': 'https://rinkeby.etherscan.io',
	'0x5': 'https://goerli.etherscan.io',
	'0x64': 'http://localhost:7777'
}

export const SYNTHS_DECIMALS = 18n;
export const SYNTHS_PRECISION = 6n;
export const SYNTHS_UNIT = 10n ** SYNTHS_DECIMALS;

export const DEFAULT_DECIMALS = 18n;
export const DEFAULT_PRECISION = 2n;

export const BIGINT_ZERO = 0n;

export const MAX_UINT256 = '0x' + 'f'.repeat(64);
export const EMPTY_BYTES32 = '0x' + '0'.repeat(64);
