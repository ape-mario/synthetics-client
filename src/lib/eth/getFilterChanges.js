import newFilter from './newFilter.js'

export default async function getFilterChanges(params) {

	const {
		addresses,
		types,
		user
	} = params;

	const filter_id = await newFilter(params);
	console.log('getFilterChanges triggered:', filter_id);

	const logs = await ethereum.request({
		method: 'eth_getFilterChanges',
		params: [filter_id],
	});

	return logs.filter((log) => {
		return !log.removed && types.includes(log.topics[0]) && log.topics[1] == user
	});

}