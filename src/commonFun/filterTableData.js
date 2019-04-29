// 运用场景：过滤去重，主要使用在table表头需要过滤筛选功能,otherKey的作用是：另外一个key是否需要存储，有需要的话可以进行存储
var filterData = function (dataArr, key, otherkey = '') {
	let dataList = [];
	for (let item of dataArr) {
		if (otherkey) {
			let Obj = {
				text: item[key],
				value: item[key],
				[otherkey]: item[otherkey]
			}
			if (item[key]) {
				// 去重
				if (JSON.stringify(dataList).indexOf(JSON.stringify(Obj)) === -1) {
					dataList.push(Obj);
				}
			}
		} else {
			let Obj = {
				text: item[key],
				value: item[key],
			}
			if (item[key]) {
				// 去重
				if (JSON.stringify(dataList).indexOf(JSON.stringify(Obj)) === -1) {
					dataList.push(Obj);
				}
			}
		}
	}
	// console.log(dataList);
	return dataList;
}
export default filterData;