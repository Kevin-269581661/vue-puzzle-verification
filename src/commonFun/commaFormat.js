// 运用场景： 价格需要每三位加上逗号

var comma = {};
// 价格逗号(返回两位小数)
comma.init = function (price) {
	var newStr = "";
	var count = 0;
	// console.log(price)
	let str = price.toString();
	if (str.indexOf(".") == -1) {
		for (let i = str.length - 1; i >= 0; i--) {
			if (count % 3 == 0 && count != 0) {
				newStr = str.charAt(i) + "," + newStr;
			} else {
				newStr = str.charAt(i) + newStr;
			}
			count++;
		}
		str = newStr + ".00"; //自动补小数点后两位
	} else {
		for (let i = str.indexOf(".") - 1; i >= 0; i--) {
			if (count % 3 == 0 && count != 0) {
				newStr = str.charAt(i) + "," + newStr;
			} else {
				newStr = str.charAt(i) + newStr; //逐个字符相接起来
			}
			count++;
		}
		str = newStr + (str + "00").substr((str + "00").indexOf("."), 3);
	}
	return str;
}

// 价格逗号(整数)
comma.format = function (price) {
	var newStr = "";
	var count = 0;
	let str = price.toString();
	for (let i = str.length - 1; i >= 0; i--) {
		if (count % 3 == 0 && count != 0) {
			newStr = str.charAt(i) + "," + newStr;
		} else {
			newStr = str.charAt(i) + newStr;
		}
		count++;
	}
	str = newStr;
	return str;
}

// 保留两位小数(没有逗号)
comma.noComma = function (price) {
	let str = price.toString();
	if (str.indexOf(".") == -1) {
		str = str + ".00"; //自动补小数点后两位
	} else {
		let index = str.indexOf('.');
		str = str.substring(0, index) + str.substr(index, 3);
	}
	return str;
}
export default comma;
