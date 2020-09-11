import { keccak256 } from 'js-sha3';
import { formatBytes32String } from '@ethersproject/strings'
import BN from 'bn.js'

export const CONTRACTS = {
	CAP_ASSETS: '0x0290FB167208Af455bB137780163b7B7a9a10C16'.toLowerCase(),
	// TODO we only use CLP to get accepted currencies we should probably expose that in CAP_ASSETS
	CAP_CLP: '0x26b4AFb60d6C903165150C6F0AA14F8016bE4aec'.toLowerCase()
};

export const SYNTH_DECIMALS = 18;
export const UNIT = new BN(10).pow(new BN(SYNTH_DECIMALS));

export const DECIMALS = {
	'USDC': 6,
	'USDT': 6,
	'DAI': 18,
	'CAP': 18
};

export const MAX_UINT256 = '0x' + 'f'.repeat(64);

export const EMPTY_BYTES32 = formatBytes32String('');
