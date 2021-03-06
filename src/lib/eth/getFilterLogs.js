import newFilter from './newFilter'

export default async function getFilterLogs(params) {

	const filter_id = await newFilter(params);

	const logs = await ethereum.request({
		method: 'eth_getFilterLogs',
		params: [filter_id]
	});

	return logs.filter(log => !log.removed);

}