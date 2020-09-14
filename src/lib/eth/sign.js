import { CONTRACTS, MAX_UINT256 } from '../constants.js'
import { splitSignature } from '@ethersproject/bytes'

const EIP712Domain = [
	{ name: 'name', type: 'string' },
	{ name: 'version', type: 'string' },
	{ name: 'chainId', type: 'uint256' },
	{ name: 'verifyingContract', type: 'address' }
]

function prepareForSigning(params) {
	const {
		owner,
		nonce,
		deadline,
		verifyingProduct
	} = params;

	// special case for DAI
	if (verifyingProduct == 'DAI') return [
		{ name: 'holder', type: 'address', value: owner },
		{ name: 'spender', type: 'address', value: CONTRACTS.CAP_ASSETS },
		{ name: 'nonce', type: 'uint256', value: nonce },
		{ name: 'expiry', type: 'uint256', value: deadline },
		{ name: 'allowed', type: 'bool', value: true }
	]

	// Default (used by CapERC20 and USDCv2)
	return [
		{ name: 'owner', type: 'address', value: owner },
		{ name: 'spender', type: 'address', value: CONTRACTS.CAP_ASSETS },
		{ name: 'value', type: 'uint256', value: MAX_UINT256 },
		{ name: 'nonce', type: 'uint256', value: nonce },
		{ name: 'deadline', type: 'uint256', value: deadline }
	]
}

export default function sign(params) {
	const {
		owner,
		name,
		version,
		verifyingContract
	} = params;

	const data = prepareForSigning(params);

    const typedData = JSON.stringify({
      types: {
        EIP712Domain,
        Permit: data.map(i => ({name: i.name, type: i.type}))
      },
      domain: {
        name,
        version,
        chainId: ethereum.chainId,
        verifyingContract: verifyingContract
      },
      primaryType: 'Permit',
      message: Object.assign({}, ...data.map(i => ({[i.name]: i.value})))
    })

    console.log('signing:', [owner, typedData]);

    return ethereum.request({
		method: 'eth_signTypedData_v4',
		from: owner,
		params: [owner, typedData],
	}).then(splitSignature)
}
