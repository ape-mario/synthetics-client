export function encodeMethodSignature(signature) {
	return '0x' + signature.substring(0,8);
}

export function encodeUint(value) {
	return BigInt(value).toString(16).padStart(64, 0);
}

export function encodeAddress(address) {
	return address.substring(2).padStart(64,0);
}

export function encodeBytes32(value) {
	const encoded = new TextEncoder().encode(value);
	// TODO review if we need a null terminator
	// https://github.com/ethers-io/ethers.js/blob/d817416bae2fbc7adb8391fd038613241b7ab8ba/packages/strings/src.ts/bytes32.ts#L15
	if (encoded.length > 31) throw Error('bytes32 string must be less than 32 bytes');
	return encoded.reduce(((acc, num) => acc + num.toString(16)), '').padEnd(64, 0);
}

export function decodeUint(bytesStr, offset) {
	return BigInt('0x' + bytesStr.slice(offset));
}

export function decodeString(bytesStr, offset, length) {
	const bytes = bytesStr.slice(offset);
	const uint8Array = new Uint8Array(bytes.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
	return new TextDecoder().decode(uint8Array).substring(0, length);
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
	const bytes = bytesStr.slice(offset, offset + 64);
	const uint8Array = new Uint8Array(bytes.match(/.{1,2}/g).map(hex => parseInt(hex, 16)));
	if (uint8Array[uint8Array.length - 1] != 0) throw Error('invalid bytes32 string - no null terminator');
	if (uint8Array.length != 32) throw Error('invalid bytes32 - not 32 bytes long');
	return new TextDecoder().decode(uint8Array);
}

export function decodeBytes32Array(bytesStr, offset, size) {
	const result = []
	for (let i=0; i < size; i++) {
		result.push(decodeBytes32(bytesStr, offset));
		offset += 64;
	}
	return result;
}