let dateInfo = {};
let dateArr = JSON.parse(localStorage.getItem('indexIsDateFirst'));
// 判断localStorage是否已存在对应uid的展示信息
dateInfo.setData = function (dateObj) {
    if (!dateArr) {
        dateArr = [dateObj];
    } else {
        let isHad = false;
        for (let key of dateArr) {
            if (key.uid == dateObj.uid && ) {
                key.setTime = dateObj.setTime
                key.planData = dateObj.planData
                isHad = true
                break
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
        return false
    } else {
        let isHad = false
        for (let key of dateArr) {
            if (key.uid == uid) {
                return key
                break
            }
        }
        if (!isHad) {
            return false
        }
    }
}
// 删除指定uid的展示
dateInfo.removeData = function (uid) {
    if (!dateArr) {
        return
    }
    for (let i = 0;i < dateArr.length; ) {
        if (dateArr[i].uid == uid) {
            dateArr.splice(i,1)
            break
        }else{
            i++
        }
    }
    if (dateArr.length) {
        localStorage.setItem('indexIsDateFirst', JSON.stringify(dateArr))
    } else {
        localStorage.removeItem('indexIsDateFirst')
    }
}
export default dateInfo;
