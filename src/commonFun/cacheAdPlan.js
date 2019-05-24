
var adPlan = {}
var planArr = JSON.parse(localStorage.getItem('creatPlanInfo'))
// 判断localStorage是否已存在对应uid的方案信息
adPlan.setData = function (planInfo) {
    // let planArr = JSON.parse(localStorage.getItem('creatPlanInfo'))
    if (!planArr) {
        planArr = [planInfo]
    } else {
        let isHad = false
        for (let key of planArr) {
            if (key.uid == planInfo.uid) {
                key.setTime = planInfo.setTime
                key.planData = planInfo.planData
                isHad = true
                break
            }
        }
        if (!isHad) {
            planArr.push(planInfo)
        }
    }
    localStorage.setItem('creatPlanInfo',JSON.stringify(planArr))
};
// 返回指定uid的缓存方案
adPlan.getData = function (uid) {
    if (!planArr) {
        return false
    } else {
        let isHad = false
        for (let key of planArr) {
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
// 删除指定uid的方案
adPlan.removeData = function (uid) {
    if (!planArr) {
        return
    }
    for (let i = 0;i < planArr.length; ) {
        if (planArr[i].uid == uid) {
            planArr.splice(i,1)
            break
        }else{
            i++
        }
    }
    if (planArr.length) {
        localStorage.setItem('creatPlanInfo', JSON.stringify(planArr))
    } else {
        localStorage.removeItem('creatPlanInfo')
    }
}
export default adPlan;
