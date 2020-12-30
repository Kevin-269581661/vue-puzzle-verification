// 运用场景：时间格式化

var timeFormat = {};
// 获取时间年月日
timeFormat.toDate = function (time, format = '-') {
	let result = '';
	if (time) {
		// let str = time.toString().substring(time.length - 2);
		// if (str == ".0") {
		// 	time = time.toString().substring(0, time.length - 2);
		// }
		if(typeof time === 'number') {
			time = new Date(time)
		} else {
			time = new Date(Date.parse(time.toString().replace(/[-\.]/g, "/")));
		}
		let year = time.getFullYear();
		let month = time.getMonth() + 1;//js从0开始取
		let date = time.getDate();

		if (month < 10) {
			month = "0" + month;
		}
		if (date < 10) {
			date = "0" + date;
		}

		result = year + format + month + format + date; //2009-06-12
	}
	return result;
};



// 获取时间年月日时分秒
timeFormat.toDateTime = function (time, format = '-') {
	let result = '';
	if (time) {
		let str = time.toString().substring(time.length - 2);
		if (str == ".0") {
			time = time.toString().substring(0, time.length - 2);
		}
		time = new Date(Date.parse(time.toString().replace(/[-\.]/g, "/")));
		let year = time.getFullYear();
		let month = time.getMonth() + 1;//js从0开始取
		let date = time.getDate();
		let hour = time.getHours();
		let minutes = time.getMinutes();
		let second = time.getSeconds();

		if (month < 10) {
			month = "0" + month;
		}
		if (date < 10) {
			date = "0" + date;
		}
		if (hour < 10) {
			hour = "0" + hour;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (second < 10) {
			second = "0" + second;
		}

		result = year + format + month + format + date + " " + hour + ":" + minutes + ":" + second; //2009-06-12 17:18:05
	}

	return result;
};

// 根据开始时间和结束时间获取该时间段内的每天
timeFormat.getDayAll = function (begin, end) {
	let dateAllArr = [];
	let ab = this.toDate(begin, '/').split("/");
	let ae = this.toDate(end, '/').split("/");
	let db = new Date();
	db.setUTCFullYear(ab[0], ab[1] - 1, ab[2]);
	let de = new Date();
	de.setUTCFullYear(ae[0], ae[1] - 1, ae[2]);
	let unixDb = db.getTime();
	let unixDe = de.getTime();
	for (let k = unixDb; k <= unixDe;) {
		dateAllArr.push(this.toDate(new Date(parseInt(k)), '/'));
		k = k + 24 * 60 * 60 * 1000;
	}
	return dateAllArr;
}

// 根据开始时间和结束时间获取这段间隔相隔多少天
timeFormat.getDayBetween = function(begin, end){
	let num = 0;
	let ab = this.toDate(begin, '/').split("/");
	let ae = this.toDate(end, '/').split("/");
	let abStart = new Date(ab[0], ab[1]-1, ab[2]);
	let aeEnd = new Date(ae[0], ae[1]-1, ae[2]);
	let sTime = abStart.getTime();
	let eTime = aeEnd.getTime();
	let dateTime = 1000*60*60*24; //每一天的毫秒数
	num = Math.floor(((eTime-sTime)/dateTime));//计算出两个日期的天数差
	return num;
}

// 根据开始时间和结束时间获取该时间段内的每月
timeFormat.getMonthAll = function(begin,end) {
	var dateArry = new Array();
	var s1 = this.toDate(end, '/').split("/");
	var s2 = this.toDate(end, '/').split("/");
	var mCount = 0;
	if (parseInt(s1[0]) < parseInt(s2[0])) {
		mCount = (parseInt(s2[0]) - parseInt(s1[0])) * 12 + parseInt(s2[1]) - parseInt(s1[1])+1;
	} else {
		mCount = parseInt(s2[1]) - parseInt(s1[1])+1;
	}
	if (mCount > 0) {
		var startM = parseInt(s1[1]);
		var startY = parseInt(s1[0]);
		for (var i = 0; i < mCount; i++) {
			if (startM < 12) {
				dateArry[i] = startY + "-" + (startM>9 ? startM : "0" + startM);
				startM += 1;
			} else {
				dateArry[i] = startY + "-" + (startM > 9 ? startM : "0" + startM);
				startM = 1;
				startY += 1;
			}
		}
	}
	return dateArry;
}

// 根据开始时间和结束时间获取该时间段内的每年
timeFormat.getYearAll = function(begin, end) {
	var dateArry = new Array();
	var s1 = this.toDate(begin, '/').split("/");
	var s2 = this.toDate(end, '/').split("/");
	var mYearCount = parseInt(s2[0]) - parseInt(s1[0])+1;
	var startY = parseInt(s1[0]);
	for (var i = 0; i < mYearCount;i++) {
		dateArry[i] = startY;
		startY += 1;
	}
	return dateArry;
}

// 比较一个数组里面时间的最大最小值，返回数据：最大值：endTime,最小值：startTime;参数要求：arr,sField:开始时间字段，eField:结束时间字段
timeFormat.compareTime = function (arr, sField, eField) {
	let obj = {
		startTime: '',
		endTime: ''
	};
	if (arr.length) {
		obj = {
			startTime: this.toDate(arr[0][sField], '/'),
			endTime: this.toDate(arr[0][eField], '/')
		};
	}
	for (let data of arr) {
		let startTime = this.toDate(data[sField], '/');
		let endTime = this.toDate(data[eField], '/');
		if (startTime < obj.startTime) {
			obj.startTime = startTime;
		}
		if (endTime > obj.endTime) {
			obj.endTime = endTime;
		}
	}
	console.log('obj-----------', obj);
	return obj;
}


//时间戳转化为刚刚/N分钟前/今天几点几分/昨天几点几分等
timeFormat.timestampFormat = function (timestamp) {
    function zeroize(num) {
		return (String(num).length == 1 ? '0' : '') + num;
	}
	let curTimestamp = new Date().getTime(); //当前时间戳
	let timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数
	let curDate = new Date(); // 当前时间日期对象
	let tmDate = new Date(timestamp);  // 参数时间戳转换成的日期对象
	let Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
	let H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();
    if (timestampDiff < 60) { // 一分钟以内
		return "刚刚";
	} else if (timestampDiff < 3600) { // 一小时前之内
		return Math.floor(timestampDiff / 60) + "分钟前";
	} else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
		return '今天' + zeroize(H) + ':' + zeroize(i);
	} else {
		let newDate = new Date((curTimestamp - 86400000)); // 参数中的时间戳加一天转换成的日期对象
		if (newDate.getFullYear() == Y && newDate.getMonth() + 1 == m && newDate.getDate() == d) {
			return '昨天' + zeroize(H) + ':' + zeroize(i);
		} else if (curDate.getFullYear() == Y) {
			return zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i)+ ':' + zeroize(s);
		} else {
			return Y + '年' + zeroize(m) + '月' + zeroize(d) + '日 ' + zeroize(H) + ':' + zeroize(i)+ ':' + zeroize(s);
		}
	}
};
// 时间串转化成数组并排序  first:第一次截取的字符
timeFormat.returnTimeArr = function (timeString,firstString,secondString){
    let b= timeString.split(firstString)  // 例如 '、'
    let arr = []
    for(let key of b){
        let temp = key.split(secondString)   // 例如 '-'
        for(let tken of temp){
            arr.push(tken.replace(/\./g, '/'))
        }
    }
    arr.sort(function (a, b) {
        return Date.parse(a) - Date.parse(b)
    })
    return arr
}
//获取当前时间并计算N天后的日期
timeFormat.returnDayCount = function (AddDayCount,format,toDay = new Date()) {     // format: . 或 - 或 /
    let dd = toDay
    dd.setDate(dd.getDate() + AddDayCount)    // 获取AddDayCount天后的日期
    let y = dd.getFullYear();
    let m = (dd.getMonth() + 1) < 10 ? "0" + (dd.getMonth() + 1) : (dd.getMonth() + 1)  // 获取当前月份的日期，不足10补0
    let d = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()       // 获取当前几号，不足10补0
    return y + format + m + format + d
}
// 获取当前时间并计算N月前的日期
timeFormat.returnMonthCount = function (AddMonthCount,format) {  // format: . 或 - 或 /
    let dd = new Date();
    dd.setMonth(dd.getMonth() - AddMonthCount);
    let Y = dd.getFullYear();
    let M = (dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1)
    let D = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()
    return Y + format + M + format + D
}
// 获取date本月本周或者近两周的时间(周一到周日为一周),例如获取近一周的时间 returnDayRange(7, new Date());
timeFormat.returnDayRange = function (num, date) {
    let resultObj = {
        startTime: '',
        endTime: '',
    };
    let time = new Date(this.toDate(date, '/'));
    let sTime = time.getTime();
    let day = time.getDay();
    let limit = (day - 1) * 86400000;
    let resultTime = time.getTime() - limit;
    let startTime = new Date(resultTime);
    let endTime = resultTime + (num - 1) * 86400000;
    resultObj.startTime = timeFormat.toDate(startTime);
    resultObj.endTime = timeFormat.toDate(new Date(endTime));
    return resultObj;
}
// 获取传入日期当月的天数
timeFormat.getCurrMonthDays = function (date) {
    let aDate = new Date(this.toDate(date, '/'));
    let aYear = aDate.getFullYear();
    let aMonth = aDate.getMonth() + 1;
    let new_date = new Date(aYear, aMonth, 0);
    //这里传入的0,代表获取上一个月的最后一天;如果传1,则获得当月的第一天；
    return new_date.getDate();
}
// 获取指定时间并计算N月前/后的日期
timeFormat.getSpecifiedDateStr = function (specifiedDate,AddMonthCount) {
    let dd = new Date(specifiedDate);
    dd.setMonth(dd.getMonth() - AddMonthCount);
    let Y = dd.getFullYear();
    let M = (dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1)
    let D = dd.getDate() < 10 ? "0" + dd.getDate() : dd.getDate()
    return Y + '-' + M + '-' + D
}
// 获取指定日期所在的生产周(周六-周五)
timeFormat.getWorkWeek = function (format,date = new Date()) {
    let dd = new Date(date);
    let weekIndex = dd.getDay();
    let star = ''
    let end = ''
    if (weekIndex < 6) {
        star = this.returnDayCount(-(weekIndex + 1), format, new Date(date))
        end = this.returnDayCount((5 - weekIndex), format, dd)
    } else {
        star = this.returnDayCount(6 - weekIndex, format, new Date(date))
        end = this.returnDayCount((12 - weekIndex), format, new Date(date))
    }
    return [star,end]
}
// 指定日期转化为星期几
timeFormat.returnWeekByDate = function (date = new Date()) {
    let week = new Date(date).getDay();
    let weekName = ''
    switch (week){
        case 0:
            weekName = '星期天';
            break;
        case 1:
            weekName = '星期一';
            break;
        case 2:
            weekName = '星期二';
            break;
        case 3:
            weekName = '星期三';
            break;
        case 4:
            weekName = '星期四';
            break;
        case 5:
            weekName = '星期五';
            break;
        case 6:
            weekName = '星期六';
            break;
    }
    return weekName
}
export default timeFormat;
