// 角色转换成中文
let uTypeToText = {};
uTypeToText.toText = function (uType) {
	return {
		'ADN_SA': '系统管理员',
		'ADN_SM': '超级管理员', 
		'ADN_OP': '运营', 
		'ADN_MD': '地方媒介',
		'ADN_MD_COUNTRY': '全国媒介',
		'ADN_BD': '地方销售',
		'ADN_BD_COUNTRY': '全国销售',
		'ADN_BD_KA': 'KA销售',
		'AD': '广告主', 
		'ADN_EP': '工程人员', 
		'ADN_DEV': '开发人员',
		'ADN_DEV_ASSET': '资产人员',
		'ADN_DEV_LEADER': '开发总监',
	}[uType]
}

export default uTypeToText;
