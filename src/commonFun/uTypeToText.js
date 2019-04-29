// 角色转换成中文
let uTypeToText = {};
uTypeToText.toText = function (utype) {
	let uTypeText = [
		{ text: '系统管理员', value: 'SA' },
		{ text: '超级管理员', value: 'SM' },
		{ text: '运营', value: 'OP' },
		{ text: '媒介', value: 'MD' },
		{ text: '销售', value: 'BD' },
		{ text: '广告主', value: 'AD' },
		{ text: '工程人员', value: 'EP' }
	];
	for (let item of uTypeText) {
		if (item.value == utype) {
			return item.text;
		}
	}
}

export default uTypeToText;