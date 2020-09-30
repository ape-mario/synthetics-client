import newFilter from './newFilter.js'

export default async function getFilterLogs(params) {

	const {
		addresses,
		types,
		users
	} = params;

	const filter_id = await newFilter(params);

	const logs = await ethereum.request({
		method: 'eth_getFilterLogs',
		params: [filter_id],
	});

	return logs.filter((log) => {
		return !log.removed && types.includes(log.topics[0]) && users.includes(log.topics[1])
	});

}