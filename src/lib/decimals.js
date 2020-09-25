export function formatBigInt(value, decimals, precision) {
	const unit = 10n ** decimals;
	const integer = value / unit;
	const fractional = (value % unit);
	if (fractional == 0n) return `${integer}`;

	const precisionUnit = 10n ** (decimals - precision);
	const relevantFractional = fractional / precisionUnit;
	const remainderFractional = fractional % precisionUnit;

	let prefix = remainderFractional > 0n ? '~' : '';
	return `${prefix}${integer}.${relevantFractional.toString().padStart(Number(precision), 0)}`;
}

export function parseDecimal(value, decimals) {
	const [integer, fractional] = value.split('.');
	const unit = 10n ** decimals;
	return BigInt(integer) * unit + BigInt((fractional || '').padEnd(Number(decimals), 0));
}
