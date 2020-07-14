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
const admin = () => import('../components/admin/adminCommon.vue')
const SMqinlinzk = () => import('../components/admin/SMqinlinzk.vue')
const ADlimitList = () => import('../components/admin/ADlimitList.vue')

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
const messageList = () => import('../components/common/messageList.vue')
const communityRank = () => import('../components/common/communityRank.vue')
const portraitDetail = () => import('../components/common/portraitDetail.vue')
const qinLinMap = () => import('../components/common/qinLinMap.vue')
const resContrastMap = () => import('../components/common/resContrastMap.vue')

// 下载进度页面
const progressDown = () => import('../components/common/progressDown.vue')

//地图选点中转页面
const mapMessage = () => import('../components/common/mapMessage.vue')

//超级运营
const adminIndex = () => import('../components/superOperate/superOperate_index.vue')
const superOperateCommon = () => import('../components/superOperate/superOperateCommon.vue')
const dataAnalysis = () => import('../components/superOperate/dataAnalysis.vue')
const communityPortrait = () => import('../components/superOperate/communityPortrait')

//普通运营
const operateIndex = () => import('../components/operate/operate_index.vue')
const operateCommon = () => import('../components/operate/operateCommon.vue')

//媒介
const mediaIndex = () => import('../components/media/media_index.vue')
const mediaCommon = () => import('../components/media/mediaCommon.vue')
const projectList = () => import('../components/common/projectList.vue')
const projectDetail = () => import('../components/common/projectDetail.vue')
const paintedCount = () => import('../components/common/paintedCount.vue')

//销售
const saleIndex = () => import('../components/sale/sale_index.vue')
const createClient = () => import('../components/sale/createClient.vue')
const editClient = () => import('../components/sale/editClient.vue')
const saleCommon = () => import('../components/sale/saleCommon.vue')

//广告主
const adOwnerIndex = () => import('../components/adOwner/adOwner_index.vue')
const adOwnerCommon = () => import('../components/adOwner/adOwnerCommon.vue')
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


//工程
const engineerCommon = () => import('../components/engineer/engineerCommon.vue')




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
        // 亲邻地图
        {path: '/ADResourceMap/chooseRes',name:'qinLinMap',component: qinLinMap, meta:{title: '亲邻科技，智慧选点'}},
        // 地图分享
        {path: '/ADResourcesMap/shareRes',name:'qinLinMap',component: qinLinMap, meta:{title: '亲邻科技，智慧分享'}},
        //资源对比可视化
        {path: '/resContrastMap',name:'resContrastMap',component: resContrastMap, meta:{title: '亲邻科技，智慧地图'}},
        //消息列表
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
                {path: '/admin/myInfo', component: myInfo},
                {path: '/admin/ADlimitList', component: ADlimitList},
            ]
        },
        //超级运营
        {
            path: '/',
            component: superOperateCommon,
            children: [
                {path: '/superOperate', component: adminIndex},
                // {path: '/superOperate/mediaInput', component: mediaInput},
                {path: '/superOperate/mediaList', component: mediaList},
                {path: '/superOperate/mediaDetail', component: mediaDetail},
                {path: '/superOperate/clientList', component: clientList},
                {path: '/superOperate/planList', component: planList,
                    // meta:{keepAlive: true} // 这个组件需要缓存 true
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
                {path: '/superOperate/questionAndAnswer', component: questionAndAnswer, meta:{title:'常见问题'}},
                {path: '/superOperate/tvOrderList', component: tvOrderList},
                {path: '/superOperate/tvOrderDetail', component: tvOrderDetail},
                {path: '/superOperate/settingPrice', component: settingPrice},
                {path: '/superOperate/maintainList', component: maintainList},
                {path: '/superOperate/companyList', component: companyList},
                {path: '/superOperate/compact', component: compact},
                {path: '/superOperate/communityPortrait',component: communityPortrait},
                {path: '/superOperate/communityRank',component: communityRank},
                {path: '/superOperate/portraitDetail',component: portraitDetail},
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
                {path: '/media/mediaInput', component: mediaInput, meta:{title: '创建媒体'}},
                {path: '/media/mediaEdit', component: mediaInput, meta:{title: '编辑媒体'}},
                {path: '/media/mediaDetail', component: mediaDetail},
                {path: '/media/planList', component: planList},
                {path: '/media/publishPriceList', component: publishPriceList},
                {path: '/media/orderList', component: orderList},
                {path: '/media/createPlan', component: createPlan, meta:{title: '创建方案'}},
                {path: '/media/editPlan', component: editPlan, meta:{title: '编辑方案'}},
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
                {path: '/media/paintedCount', component: paintedCount},
                {path: '/media/messageList', name: 'messageList', component: messageList},
                {path: '/media/communityPortrait',component: communityPortrait},
                {path: '/media/communityRank',component: communityRank},
                {path: '/media/portraitDetail',component: portraitDetail},
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
                {path: '/sale/createPlan', component: createPlan, meta:{title: '创建方案'}},
                {path: '/sale/editPlan', component: editPlan, meta:{title: '编辑方案'}},
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
                {path: '/sale/communityPortrait',component: communityPortrait},
                {path: '/sale/communityRank',component: communityRank},
                {path: '/sale/portraitDetail',component: portraitDetail},
                {path: '/sale/messageList', name: 'messageList', component: messageList},
                {path: '/sale/adsDialPlate', component: adsDialPlate},
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
                {path: '/adOwner/myInfo', component: myInfo},
                {path: '/adOwner/communityPortrait',component: communityPortrait},
                {path: '/adOwner/communityRank',component: communityRank},
                {path: '/adOwner/portraitDetail',component: portraitDetail},
            ]
        },
        
        //工程
        {
            path: '/f_engineer',
            component: engineerCommon,
            children: [
                {path: '', redirect: '/f_engineer/orderList'},
                {path: '/f_engineer/orderList', name:'orderList', component: orderList },
                {path: '/f_engineer/myInfo', component: myInfo},
                {path: '/f_engineer/orderDetail', component: orderDetail},
                {path: '/f_engineer/messageList', name: 'messageList', component: messageList},
                {path: '/f_engineer/questionAndAnswer', component: questionAndAnswer}
            ]
        },
        //404
        {path: '*', component: NotFountPage}
    ]
})
