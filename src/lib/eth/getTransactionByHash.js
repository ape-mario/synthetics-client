const cache = {}

export default function getTransactionByHash(params) {
	const {
		txhash // erc20 currency address
	} = params;

	if (cache[txhash]) return Promise.resolve(cache[txhash]);

	return ethereum.request({
		method: 'eth_getTransactionByHash',
		params: [
			txhash
		]
	}).then((tx) => {
		if (tx) cache[txhash] = tx;
		return tx;
	})
}


