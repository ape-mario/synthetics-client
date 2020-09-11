import { toUtf8String, parseBytes32String, formatBytes32String } from '@ethersproject/strings'
import { BN } from 'bn.js'

export function encodeMethodSignature(signature) {
	return '0x' + signature.substring(0,8);
}

export function encodeUint(value) {
	return new BN(value).toString(16, 64);
}

export function encodeAddress(address) {
	return address.substring(2).padStart(64,0);
}

export function encodeBytes32(value) {
	return formatBytes32String(value).slice(2);
}

export function decodeUint(bytesStr, offset) {
	return new BN(bytesStr.slice(offset), 16);
}

export function decodeString(bytesStr, offset, length) {
	return toUtf8String('0x' + bytesStr.slice(offset)).substring(0, length);
}

export function decodeAddress(bytesStr, offset) {
	return '0x' + bytesStr.slice(offset + 24, offset + 64);
}

export function decodeAddressArray(bytesStr, offset, size) {
	const result = []
	for (let i=0; i < size; i++) {
		result.push(decodeAddress(bytesStr, offset));
		offset += 64;
	}
	return result;
}

export function decodeBytes32(bytesStr, offset) {
	return parseBytes32String('0x' + bytesStr.slice(offset, offset + 64));
}

export function decodeBytes32Array(bytesStr, offset, size) {
	const result = []
	for (let i=0; i < size; i++) {
		result.push(decodeBytes32(bytesStr, offset));
		offset += 64;
	}
	return result;
}