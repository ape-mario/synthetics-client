import { keccak256 } from 'js-sha3';

export const CONTRACTS = {
	CAP_ASSETS: '0x0290FB167208Af455bB137780163b7B7a9a10C16'.toLowerCase()
};

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
