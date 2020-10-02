import { keccak256 } from 'js-sha3';

const cache = {}

export default function newFilter(params) {

	const {
		fromBlock,
		addresses,
		topics
	} = params;

	const address = addresses.sort().join(',');
	const key = keccak256(JSON.stringify([fromBlock, address, topics]));

	if (cache[key]) return Promise.resolve(cache[key]);

	return ethereum.request({
		method: 'eth_newFilter',
		params: [{
			fromBlock,
			address,
			topics
		}]
	}).then((filter_id) => {
		cache[key] = filter_id;
		return filter_id;
	});

}
