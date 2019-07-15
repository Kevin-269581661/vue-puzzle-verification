import Vue from 'vue'
import Router from 'vue-router'

const login = () => import( '../components/home/login.vue')
//修改密码
const changePwd = () => import('../components/home/changePwd.vue')
// 修改个人信息
const myInfo = () => import('../components/home/myInfo.vue')
// 方案分享页面
const shareADList = () => import('../components/common/shareADList.vue')
//Q&A
const questionAndAnswer =()=> import('../components/common/questionAndAnswer')
//404
const NotFountPage = () => import('../components/common/NotFoundPage.vue')
//管理员
const admin = () => import('../components/admin/admin_common.vue')
const SMqinlinzk = () => import('../components/admin/SMqinlinzk.vue')

// 空点导出
const emptyPoint = () => import('../components/common/downEmptyPoint.vue')

//公用页面
const mediaInput = () => import('../components/common/mediaInput.vue')
const mediaDetail = () => import('../components/common/mediaDetail.vue')
const mediaList = () => import('../components/common/mediaList.vue')
const clientList = () => import('../components/common/clientList.vue')
const planList = () => import('../components/common/planList.vue')
const publishPriceList = () => import('../components/common/publishPriceList.vue')
const createAccount = () => import('../components/common/createAccount.vue')
const accountList = () => import('../components/common/accountList.vue')
const orderList = () => import('../components/common/orderList.vue')
const clientDetail = () => import('../components/common/clientDetail.vue')
const createPlan = () => import('../components/common/createPlan.vue')
const editPlan = () => import('../components/common/editPlan.vue')
const planDetail = () => import('../components/common/planDetail.vue')
const orderDetail = () => import('../components/common/orderDetail.vue')
const photoGallery = () => import('../components/common/photoGallery.vue')
const advertTV = () => import('../components/common/advertTV.vue')
const tvOrderList = () => import('../components/common/tvOrderList.vue')
const tvOrderDetail = () => import('../components/common/tvOrderDetail.vue')
const settingPrice = () => import('../components/common/settingPrice.vue')
const maintainList = () => import('../components/common/maintainList.vue')
const companyList = () => import('../components/common/companyList.vue')
const compact = () => import('../components/common/compact.vue')
const paintedPath = () => import('../components/common/paintedPath.vue')
const adsDialPlate = () => import('../components/common/adsDialPlate.vue')

// 下载进度页面
const progressDown = () => import('../components/common/progressDown.vue')

//地图选点中转页面
const mapMessage = () => import('../components/common/mapMessage.vue')

//超级运营
const adminIndex = () => import('../components/superOperate/superOperate_index.vue')
const ADlimitList = () => import('../components/superOperate/ADlimitList.vue')
const superOperateCommon = () => import('../components/superOperate/superOperate_common.vue')
const dataAnalysis = () => import('../components/superOperate/dataAnalysis.vue')

//普通运营
const operateIndex = () => import('../components/operate/operate_index.vue')
const operateCommon = () => import('../components/operate/operate_common.vue')

//媒介
const mediaIndex = () => import('../components/media/media_index.vue')
const mediaCommon = () => import('../components/media/media_common.vue')
const projectList = () => import('../components/common/projectList.vue')
const projectDetail = () => import('../components/common/projectDetail.vue')

//销售
const saleIndex = () => import('../components/sale/sale_index.vue')
const createClient = () => import('../components/sale/createClient.vue')
const editClient = () => import('../components/sale/editClient.vue')
const saleCommon = () => import('../components/sale/sale_common.vue')

//广告主
const adOwnerIndex = () => import('../components/adOwner/adOwner_index.vue')
const adOwnerCommon = () => import('../components/adOwner/adOwner_common.vue')
const ADReport = () => import('../components/adOwner/ADqinlinzkReport.vue')
const ADqinlinzk = () => import('../components/adOwner/ADqinlinzk.vue')
const totalView = () => import('../components/adOwner/totalView.vue')
const trafficTrend = () => import('../components/adOwner/trafficTrends.vue')
const resVisitors = () => import('../components/adOwner/resVisitors.vue')
const accessPeriod = () => import('../components/adOwner/accessPeriod.vue')
const residentAttr = () => import('../components/adOwner/residentAttr.vue')
const costPreferences = () => import('../components/adOwner/costPreferences.vue')
const ADorderDetail = () => import('../components/adOwner/ADorderDetail.vue')
const visitFrequency = () => import('../components/adOwner/visitFrequency.vue')
const hotSource = () => import('../components/adOwner/hotSource.vue')


//亲邻科技上刊报告
const Report = () => import('../components/h5/Report.vue')

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes:[
        {path: '/', redirect: '/login'},
        {path: '/login', name: 'login', component: login},
        {path: '/mapMessage', name: 'mapMessage', component: mapMessage},
        {path: '/progressDown', name: 'progressDown', component: progressDown},
        {path: '/shareADList', name: 'shareADList', component: shareADList},
        {path: '/emptyPoint', name: 'emptyPoint', component: emptyPoint},
        //上下刊报告h5页面
        {path: '/Report', name: 'Report', component: Report},
        //admin
        {
            path: '/',
            component: admin,
            children: [
                {path: '/admin', component: accountList},
                {path: '/createAccount', component: createAccount},
                {path: '/admin/changePwd', component: changePwd},
                {path: '/admin/SMqinlinzk', component: SMqinlinzk},
                {path: '/admin/mediaList', component: mediaList},
                {path: '/admin/mediaDetail', component: mediaDetail},
                {path: '/admin/companyList', component: companyList},
            ]
        },
        //超级运营
        {
            path: '/',
            component: superOperateCommon,
            children: [
                {path: '/superOperate', component: adminIndex},
                {path: '/superOperate/ADlimitList', component: ADlimitList},
                // {path: '/superOperate/mediaInput', component: mediaInput},
                {path: '/superOperate/mediaList', component: mediaList},
                {path: '/superOperate/mediaDetail', component: mediaDetail},
                {path: '/superOperate/clientList', component: clientList},
                {path: '/superOperate/planList', component: planList,
                    meta:{keepAlive: true} // 这个组件需要缓存 true
                },
                {path: '/superOperate/publishPriceList', component: publishPriceList},
                {path: '/superOperate/createAccount', component: createAccount},
                {path: '/superOperate/accountList', component: accountList},
                {path: '/superOperate/orderList', component: orderList},
                {path: '/superOperate/clientDetail', component: clientDetail},
                {path: '/superOperate/planDetail', component: planDetail},
                {path: '/superOperate/orderDetail', component: orderDetail},
                {path: '/superOperate/photoGallery', component: photoGallery},
                {path: '/superOperate/dataAnalysis', component: dataAnalysis},
                {path: '/superOperate/changePwd', component: changePwd},
                {path: '/superOperate/myInfo', component: myInfo},
                {path: '/superOperate/ADqinlinzk', component: ADqinlinzk},
                {path: '/superOperate/questionAndAnswer', component: questionAndAnswer},
                {path: '/superOperate/tvOrderList', component: tvOrderList},
                {path: '/superOperate/tvOrderDetail', component: tvOrderDetail},
                {path: '/superOperate/settingPrice', component: settingPrice},
                {path: '/superOperate/maintainList', component: maintainList},
                {path: '/superOperate/companyList', component: companyList},
                {path: '/superOperate/compact', component: compact},
            ]
        },
        //普通运营
        {
            path: '/',
            component: operateCommon,
            children: [
                {path: '/operate', name: '普通运营首页', component: operateIndex},
                {path: '/operate/mediaList', component: mediaList},
                {path: '/operate/mediaDetail', component: mediaDetail},
                {path: '/operate/planList', component: planList},
                {path: '/operate/publishPriceList', component: publishPriceList},
                {path: '/operate/orderList', component: orderList},
                {path: '/operate/clientDetail', component: clientDetail},
                {path: '/operate/planDetail', component: planDetail},
                {path: '/operate/orderDetail', component: orderDetail},
                {path: '/operate/publishPriceList', component: publishPriceList},
                // {path: '/operate/mediaInput', component: mediaInput},
                {path: '/operate/clientList', component: clientList},
                {path: '/operate/changePwd', component: changePwd},
                {path: '/operate/questionAndAnswer', component: questionAndAnswer},
                {path: '/operate/compact', component: compact},
            ]
        },
        //媒介
        {
            path: '/',
            component: mediaCommon,
            children: [
                {path: '/media', component: mediaIndex},
                {path: '/media/mediaList', component: mediaList},
                {path: '/media/mediaInput', component: mediaInput},
                {path: '/media/mediaEdit', component: mediaInput},
                {path: '/media/mediaDetail', component: mediaDetail},
                {path: '/media/planList', component: planList},
                {path: '/media/publishPriceList', component: publishPriceList},
                {path: '/media/orderList', component: orderList},
                {path: '/media/createPlan', component: createPlan},
                {path: '/media/editPlan', component: editPlan},
                {path: '/media/planDetail', component: planDetail},
                {path: '/media/orderDetail', component: orderDetail},
                {path: '/media/photoGallery', component: photoGallery},
                {path: '/media/changePwd', component: changePwd},
                {path: '/media/questionAndAnswer', component: questionAndAnswer},
                {path: '/media/advertTV', component: advertTV},
                {path: '/media/tvOrderList', component: tvOrderList},
                {path: '/media/tvOrderDetail', component: tvOrderDetail},
                {path: '/media/mapMessage', component: mapMessage},
                {path: '/media/maintainList', component: maintainList},
                {path: '/media/myInfo', component: myInfo},
                {path: '/media/compact', component: compact},
                {path: '/media/paintedPath', component: paintedPath},
                {path: '/media/adsDialPlate', component: adsDialPlate},
                {path: '/media/projectList', component: projectList},
                {path: '/media/projectDetail', component: projectDetail},
            ]
        },
        //销售
        {
            path: '/',
            component: saleCommon,
            children: [
                {path: '/sale', component: saleIndex},
                {path: '/sale/createClient', component: createClient},
                {path: '/sale/editClient', component: editClient},
                {path: '/sale/clientList', component: clientList},
                {path: '/sale/planList', component: planList},
                {path: '/sale/publishPriceList', component: publishPriceList},
                {path: '/sale/orderList', component: orderList},
                {path: '/sale/clientDetail', component: clientDetail},
                {path: '/sale/createPlan', component: createPlan},
                {path: '/sale/editPlan', component: editPlan},
                {path: '/sale/planDetail', component: planDetail},
                {path: '/sale/orderDetail', component: orderDetail},
                {path: '/sale/photoGallery', component: photoGallery},
                {path: '/sale/changePwd', component: changePwd},
                {path: '/sale/ADqinlinzk', component: ADqinlinzk},
                {path: '/sale/questionAndAnswer', component: questionAndAnswer},
                {path: '/sale/advertTV', component: advertTV},
                {path: '/sale/tvOrderList', component: tvOrderList},
                {path: '/sale/tvOrderDetail', component: tvOrderDetail},
                {path: '/sale/mapMessage', component: mapMessage},
                {path: '/sale/myInfo', component: myInfo},
                {path: '/sale/compact', component: compact},
            ]
        },
        //广告主
        {
            path: '/',
            component: adOwnerCommon,
            children: [
                {path: '/adOwner', component: adOwnerIndex},
                {path: '/adOwner/planList', component: planList},
                {path: '/adOwner/planDetail', component: planDetail},
                {path: '/adOwner/orderList', component: orderList},
                {path: '/adOwner/changePwd', component: changePwd},
                {path: '/adOwner/ADReport', component: ADReport},
                {path: '/adOwner/ADqinlinzk', component: ADqinlinzk},
                {path: '/adOwner/totalView', component: totalView},
                {path: '/adOwner/trafficTrend', component: trafficTrend},
                {path: '/adOwner/resVisitors', component: resVisitors},
                {path: '/adOwner/accessPeriod', component: accessPeriod},
                {path: '/adOwner/residentAttr', component: residentAttr},
                {path: '/adOwner/costPreferences', component: costPreferences},
                {path: '/adOwner/ADorderDetail', component: ADorderDetail},
                {path: '/adOwner/ADplanDetail', component: planDetail},
                {path: '/adOwner/visitFrequency', component: visitFrequency},
                {path: '/adOwner/hotSource', component: hotSource},
                {path: '/adOwner/compact', component: compact},
            ]
        },
        //404
        {path: '*', component: NotFountPage}
    ]
})
