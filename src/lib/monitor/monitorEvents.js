import { CONTRACTS } from '../constants.js'
import { keccak256 } from 'js-sha3';
import { get } from 'svelte/store'
import { user } from '../../stores/user.js'
import { recentEvents } from '../../stores/transactions.js'
import { decodeUint, decodeString } from '../abi.js'
import getFilterChanges from '../eth/getFilterChanges.js'

const types = [
	'0x' + keccak256('BuyOrderProcessed(uint256,address,uint256,uint256)'),
	'0x' + keccak256('SellOrderProcessed(uint256,address,uint256,uint256)'),
	'0x' + keccak256('BuyOrderCancelled(uint256,address,string)'),
	'0x' + keccak256('SellOrderCancelled(uint256,address,string)')
]

function extractLogData(log) {
	const {
		data,
		topics
	} = log;

	if (topics[0] === types[0] || topics[0] === types[1]) {
		return {
			[decodeUint(data, 2).toString()]: {
				processed: true,
				amount: decodeUint(data, 2 + 64).toString(),
				price: decodeUint(data, 2 + 64 * 2).toString()
			}
		}
	} else {
		return {
			[decodeUint(data, 2).toString()]: {
				processed: false,
				reason: decodeString(data, 2 + 64 * 3, Number(decodeUint(data, 2 + 64 * 2)))
			}
		}
	}
}

export default function monitorEvents() {

	setInterval(async () => {
		const logs = await getFilterChanges({ addresses: [ CONTRACTS.CAP_ASSETS ], types, user: '0x' + get(user).slice(2).padStart(64, 0) });
		const events = logs.map(extractLogData);
		recentEvents.addPersist(events);
	}, 5000)

}
