import { keccak256 } from 'js-sha3';
import { DEFAULT_PRECISION, SYNTHS_PRECISION, SYNTHS_DECIMALS } from './constants'
import { decodeUint, decodeAddress, decodeString } from './abi'
import { formatBigInt } from './decimals'
import getSymbol from './eth/getSymbol'
import getDecimals from './eth/getDecimals'

export const ORDER_SUBMITTED_EVENT_TYPES = [
	'0x' + keccak256('BuyOrderSubmitted(uint256,address,address,uint256,address)'),
	'0x' + keccak256('SellOrderSubmitted(uint256,address,address,uint256,address)')
]

export const PROCESSING_EVENT_TYPES = [
	'0x' + keccak256('BuyOrderProcessed(uint256,address,uint256,uint256)'),
	'0x' + keccak256('SellOrderProcessed(uint256,address,uint256,uint256)'),
	'0x' + keccak256('BuyOrderCancelled(uint256,address,string)'),
	'0x' + keccak256('SellOrderCancelled(uint256,address,string)')
]

export const EVENT_TYPES = ORDER_SUBMITTED_EVENT_TYPES.concat(PROCESSING_EVENT_TYPES);

export function extractLogData(log) {
	const {
		blockNumber,
		data,
		topics,
		transactionHash
	} = log;

	const eventType = topics[0];
	// submitted events
	if (eventType == EVENT_TYPES[0] || eventType == EVENT_TYPES[1]) {
		return {
			id: decodeUint(data, 2).toString(),
			side: topics[0] == EVENT_TYPES[0] ? 'buy' : 'sell',
			productAddress: decodeAddress(data, 2 + 64),
			amount: decodeUint(data, 2 + 64 * 2).toString(),
			currencyAddress: decodeAddress(data, 2 + 64 * 3),
			blockNumber,
			txhash: transactionHash
		}
	}
	// processed events
	if (eventType == EVENT_TYPES[2] || eventType == EVENT_TYPES[3]) {
		return {
			[decodeUint(data, 2).toString()]: {
				processed: true,
				amount: decodeUint(data, 2 + 64).toString(),
				price: decodeUint(data, 2 + 64 * 2).toString()
			}
		}
	}
	// cancelled events
	return {
		[decodeUint(data, 2).toString()]: {
			processed: false,
			reason: decodeString(data, 2 + 64 * 3, Number(decodeUint(data, 2 + 64 * 2)))
		}
	}
}

export function formatUser(user) {
	return '0x' + user.slice(2).padStart(64, 0);
}

export async function enrichOrderSubmittedEventData(events) {
	if (!events || events.length == 0) return events;

	const currencyAddresses = events.map((event) => event.currencyAddress);
	const uniqCurrencyAddresses = currencyAddresses.filter((address, index) => currencyAddresses.indexOf(address) == index);

	const productAddresses = events.map((event) => event.productAddress);
	const uniqProductAddresses = productAddresses.filter((address, index) => productAddresses.indexOf(address) == index);

	const allAddresses = uniqProductAddresses.concat(uniqCurrencyAddresses);

	const symbolsArr = await Promise.all(allAddresses.map(address => getSymbol({ address })));
	const decimalsArr = await Promise.all(uniqCurrencyAddresses.map(address => getDecimals({ address })));

	const symbols = Object.assign({}, ...allAddresses.map((address, index) => ({[address]: symbolsArr[index]})));
	const decimals = Object.assign({}, ...uniqCurrencyAddresses.map((address, index) => ({[address]: decimalsArr[index]})));

	return events.map(event => Object.assign({}, event, {
		decimalAmount: formatBigInt(BigInt(event.amount), event.side == 'buy' ? decimals[event.currencyAddress] : SYNTHS_DECIMALS, event.side == 'buy' ? DEFAULT_PRECISION : SYNTHS_PRECISION),
		product: symbols[event.productAddress],
		currency: symbols[event.currencyAddress],
		currencyDecimals: decimals[event.currencyAddress]
	}));
}
