// 获取行业中文信息，传入一个子类id: iID,返回出去的是父类/子类
var industry = {};
let arr = JSON.parse(sessionStorage.getItem('industry'));
// ps:需要由页面传入，不然第一次登陆之后加载会出现报错
industry.getText = function (iID, arr) {
	let str = '';
	let piid = '';
	for (let data of arr) {
		if (iID == data.iID) {
			str = data.iName;
			piid = data.piID;
			break;
		}
	}
	console.log('piid', piid);
	console.log('str', str);
	for (let data of arr) {
		if (piid == data.iID) {
			str = data.iName + '-' + str;
			break;
		}
	}
	console.log('str1', str);
	return str;
};

// 由中文名称获取行业的子级iId
industry.getiID = function (iName, arr) {
	let iid = '';
	for (let data of arr) {
		if (data.iName == iName) {
			iid = data.iID;
		}
	}
	return iid;
};

// 获取行业的一级piId
industry.getpiID = function (iID, arr) {
	let piid = '';
	for (let data of arr) {
		if (data.iID == iID) {
			piid = data.piID;
		}
	}
	return piid;
};
// 获取所有行业信息，并且封装成cascader联动
industry.cascader = function (arr) {
	let result = [];
	for (let data of arr) {
		if (data.piID == 0) {
			result.push({ piID: data.piID, iID: data.iID, value: data.iID, label: data.iName, children: [] });
		}
		for (let item of result) {
			if (data.piID == item.iID) {
				item.children.push({ piID: data.piID, iID: data.iID, value: data.iID, label: data.iName });
			}
		}
	}
	return result;
}

// 获取一级行业信息
industry.getFirstLevel = function (arr) {
	let result = [];
	for (let data of arr) {
		if (data.piID == 0) {
			result.push({ value: data.iID, label: data.iName });
		}
	}
	return result;
}

export default industry;
