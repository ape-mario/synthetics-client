import { keccak256 } from 'js-sha3';

export const CONTRACTS = {
	CAP_ASSETS: '0x0290FB167208Af455bB137780163b7B7a9a10C16'.toLowerCase(),
	// TODO we only use CLP to get accepted currencies we should probably expose that in CAP_ASSETS
	CAP_CLP: '0x26b4AFb60d6C903165150C6F0AA14F8016bE4aec'.toLowerCase()
};

export const SYNTHS_DECIMALS = 18n;
export const SYNTHS_PRECISION = 6n;
export const SYNTHS_UNIT = 10n ** SYNTHS_DECIMALS;

export const DEFAULT_DECIMALS = 18n;
export const DEFAULT_PRECISION = 2n;

export const BIGINT_ZERO = 0n;

export const MAX_UINT256 = '0x' + 'f'.repeat(64);
export const EMPTY_BYTES32 = '0x' + '0'.repeat(64);
