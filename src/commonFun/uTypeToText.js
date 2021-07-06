// 角色转换成中文
let uTypeToText = {};
uTypeToText.toText = function (uType) {
	return {
		'SA': '系统管理员',
		'SM': '超级管理员',
		'OP': '运营',
		'MD': '媒介',
		'BD': '销售',
		'AD': '广告主',
		'EP': '工程人员',
		'DEV': '开发'
	}[uType]
}

export default uTypeToText;
