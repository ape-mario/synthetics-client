import { SYNTHS_DECIMALS } from '../constants.js'

export default async function watchAsset(params) {
	const {
		address, // erc20 address (currency)
		symbol,
		decimals,
		image
	} = params;

	try {
		const response = await ethereum.request({
			method: 'wallet_watchAsset',
			params: {
				type: 'ERC20',
				options: {
					address,
					symbol,
					decimals: decimals || Number(SYNTHS_DECIMALS),
					image
				}
			}
		});
		// console.log('asset registered');
	} catch (e) {
		console.error(e);
	}	
}
