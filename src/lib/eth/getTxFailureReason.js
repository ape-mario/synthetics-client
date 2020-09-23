import { decodeString } from '../abi.js'

const cache = {};

export default function getTxFailureReason(params) {
	const {
		txhash,
		to,
		from,
		input,
		blockNumber
	} = params;

	if (cache[txhash]) return Promise.resolve(cache[txhash]);

	return ethereum.request({
		method: 'eth_call',
		params: [{
			to,
			from,
			data: input
		}, blockNumber]
	}).then((result) => {
		if (result == '0x') return 'Transaction Failed';
		const offset = 2 /* 0x */ + 64 /* offset */;
		const length = parseInt(result.slice(offset, offset + 64), 16);
		const string_value = decodeString(result, offset + 64, length);

		// cache
		cache[txhash] = string_value;
		return string_value;
	});
}
