// 运用场景：天数转为周数
var dayToChange = {};
dayToChange.toWeeks = function (days) {
	let result = {
        week: 0,
        day: 0
    };
    result.week = parseInt(days/7);
    result.day = parseInt(days%7);
	return result;
}
// 运用场景：日期转换天数  
dayToChange.toDays = function (start, end){ //start和end是2018.02.18格式
    let days = 0;
    start = new Date(Date.parse(start.toString().replace(/[-\.]/g, "/")));
    end = new Date(Date.parse(end.toString().replace(/[-\.]/g, "/")));
    days = Math.abs(start-end)/ 1000 / 60 / 60 / 24 +1;
    return days;
}
// 运用场景：日期转换成多少周多少天(3周3天)
dayToChange.toDaysText = function(start, end, week="周", day="天"){
    let result = {
        week: 0,
        day: 0
    };
    let weekDays = '';
    let days = 0;
    start = new Date(Date.parse(start.toString().replace(/[-\.]/g, "/")));
    end = new Date(Date.parse(end.toString().replace(/[-\.]/g, "/")));
    days = Math.abs(start-end)/ 1000 / 60 / 60 / 24 +1;
    result.week = parseInt(days/7);
    result.day = parseInt(days%7);
    if(days < 7){
        weekDays = result.day + day;
    }else if((result.day ==0) && (result.week != 0)){
        weekDays = result.week + week;
    }else{
        weekDays = result.week + week + result.day + day;
    }
}
export default dayToChange;