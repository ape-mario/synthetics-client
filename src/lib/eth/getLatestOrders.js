import { contract } from '../constants'
import getFilterLogs from './getFilterLogs'
import getFilterChanges from './getFilterChanges'
import { extractLogData, formatUser, enrichOrderSubmittedEventData, EVENT_TYPES, ORDER_SUBMITTED_EVENT_TYPES, PROCESSING_EVENT_TYPES } from '../eventHelpers'

const LIMIT = 10;

export async function getLatestOrders(params) {
	const { user } = params;
	const logs = await getFilterLogs({ fromBlock: 'earliest', addresses: [ contract('CAP_ASSETS') ], topics: [EVENT_TYPES, formatUser(user)] });
	const orderSubmittedEvents = logs.filter(e => ORDER_SUBMITTED_EVENT_TYPES.includes(e.topics[0])).slice(-1 * LIMIT).map(extractLogData);
	const startIndex = logs.findIndex(e => e.transactionHash == orderSubmittedEvents[0].txhash);
	const processingEvents = Object.assign({}, ...logs.slice(startIndex).filter(e => !ORDER_SUBMITTED_EVENT_TYPES.includes(e.topics[0])).map(extractLogData));
	
	const enrichedOrderSubmittedEvents = await enrichOrderSubmittedEventData(orderSubmittedEvents);
	return {
		submitted: enrichedOrderSubmittedEvents.reverse(),
		processed: processingEvents
	}
}

export async function getLatestOrderUpdates(params) {
	const { user } = params;
	const logs = await getFilterChanges({ fromBlock: 'latest', addresses: [ contract('CAP_ASSETS') ], topics: [PROCESSING_EVENT_TYPES, formatUser(user)] });
	const processingEvents = Object.assign({}, ...logs.map(extractLogData));
	return {
		processed: processingEvents
	}
}
