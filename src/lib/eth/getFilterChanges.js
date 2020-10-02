import newFilter from './newFilter'

export default async function getFilterChanges(params) {

	const filter_id = await newFilter(params);

	const logs = await ethereum.request({
		method: 'eth_getFilterChanges',
		params: [filter_id]
	});

	return logs.filter(log => !log.removed);

}