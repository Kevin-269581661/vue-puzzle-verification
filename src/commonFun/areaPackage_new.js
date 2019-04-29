//作用：
import cityData from '../commonFun/json/region.json';
var region = {};

// 使用方法：返回两级联动框
// 返回数据：省市
region.province = function () {
	var result = [];
	let arr = [];
	// 省
	for (let province of cityData) {
		let opt = { label: '', value: '', children: [] }
		opt.label = province.region;
		opt.value = province.code;
		if (province.regionEntitys.length) {
			// 市
			for (let city of province.regionEntitys) {
				let cityOpt = { label: '', value: '' };
				cityOpt.label = city.region;
				cityOpt.value = city.code;
				opt.children.push(cityOpt);
			}
		}
		arr.push(opt)
	}
	result = arr;
	// console.log(result);
	return result;
}


// 使用方法：返回三级联动框
// 返回数据：省市区

region.cityArea = function () {
	var result = [];
	let arr = [];
	// 省
	for (let province of cityData) {
		let opt = { label: '', value: '', children: [] }
		opt.label = province.region;
		opt.value = province.code;
		if (province.regionEntitys.length) {
			// 市
			for (let city of province.regionEntitys) {
				let cityOpt = { label: '', value: '', children: [] };
				cityOpt.label = city.region;
				cityOpt.value = city.code;
				if (city.regionEntitys.length) {
					// 区
					for (let area of city.regionEntitys) {
						let areaOpt = { label: '', value: '' };
						areaOpt.label = area.region;
						areaOpt.value = area.code;
						cityOpt.children.push(areaOpt);
					}
				}
				opt.children.push(cityOpt);
			}
		}
		arr.push(opt)
	}
	result = arr;
	// console.log(result);
	return result;
}

// 由一个rid获取它下面的所有市
region.findCity = function(rid){
	let result = [];
	rid = rid.toString().substring(0, 2)+'0000';
	for(let city of cityData){
		if(city.code == rid){
			// result = city.regionEntitys;
			for(let data of city.regionEntitys){
				let cityObj = {
					label: data.region,
					value: data.code
				};
				result.push(cityObj);
			}
		}
	}

	return result;
}

// 由一个rid获取它下面的所有区
region.findArea = function(rid){
	let result = [];
	let provinceRid = rid.toString().substring(0, 2)+'0000';
	let cityRid = rid.toString().substring(0, 4)+'00';
	for(let province of cityData){
		if(province.code == provinceRid){
			for(let city of province.regionEntitys){
				if(city.code == cityRid){
					for(let area of city.regionEntitys){
						let cityObj = {
							rName: area.region,
							rID: area.code
						};
						result.push(cityObj);
					}
				}
			}
		}
	}
	return result;
}

// 由一个中文获取它下面的rid
region.TextToCode = function(text){
	let result = [];
	for(let province of cityData){
			for(let city of province.regionEntitys){
				if(city.region == text){
					result =  city.code;
					break;
				}
			}
	}
	return result;
}

// 由一个中文模糊匹配获取下面的rid
region.sameTextToCode = function(text){
	let result = '';
	for(let province of cityData){
			for(let city of province.regionEntitys){
				if(city.region.includes(text)){
					result =  city.code;
					break;
				}
			}
	}
	return result;
}

export default region;
