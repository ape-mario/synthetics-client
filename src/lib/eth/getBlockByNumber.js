export default function getBlockByNumber() {

	return ethereum.request({
		method: 'eth_getBlockByNumber',
		params: [
			'latest',
			false
		]
	});

}
