let dateInfo = {};
let info = localStorage.getItem('indexIsDateFirst');
let dateArr = info?JSON.parse(info):'';
// 判断localStorage是否已存在对应uid的展示信息
dateInfo.setData = function (dateObj) {
    console.log('dateobj----', dateObj);
    if (!dateArr) {
        dateArr = [dateObj];
    } else {
        let isHad = false;
        for (let key of dateArr) {
            if (key.uid == dateObj.uid) {
                if(key.date == dateObj.date){
                    key.isHad = dateObj.isHad;
                    isHad = true;
                }else{
                    key.date = dateObj.date;
                    key.isHad = dateObj.isHad;
                }
                isHad = true;
                break;
            }
        }
        if (!isHad) {
            dateArr.push(dateObj);
        }
    }
    localStorage.setItem('indexIsDateFirst', JSON.stringify(dateArr))
};
// 返回指定uid的是否展示
dateInfo.getData = function (uid) {
    if (!dateArr) {
        return false;
    } else {
        let isHad = false;
        for (let key of dateArr) {
            if (key.uid == uid) {
                return key;
                break;
            }
        }
        if (!isHad) {
            return false;
        }
    }
}

// 判断当前用户当天是否是第一次
dateInfo.getIsFirst = function(uid, date){
    console.log('uid---date', uid, date);
    let data = this.getData(uid);
    let info = {
        uid: uid,
        date: date,
        isHad: '',
    };
    if(data){
        if(data.date == date){
            if(data.isHad){
                return false;
            }else{
                info.isHad = 1;
            }
        }else{
            info.isHad = 1;
        }
    }else{
        info.isHad = 1;
    }
    console.log('info---', info);
    // 存储数据
    this.setData(info);
    return true;
}
export default dateInfo;
