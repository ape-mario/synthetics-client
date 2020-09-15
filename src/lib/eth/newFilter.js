const filter_cache = {}

export default function newFilter(params) {

	const {
		addresses
	} = params;

	const key = addresses.sort().join(',');

	if (filter_cache[key]) return Promise.resolve(filter_cache[key]);

	return ethereum.request({
		method: 'eth_newFilter',
		params: [{
			address: addresses
		}]
	}).then((filter_id) => {
		filter_cache[key] = filter_id;
		return filter_id;
	});

}