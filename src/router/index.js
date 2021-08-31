import Vue from 'vue'
import Router from 'vue-router'

const login = () => import(/* webpackChunkName: "login" */ '../components/home/login.vue')
//修改密码
const changePwd = () => import(/* webpackChunkName: "changePwd" */ '../components/home/changePwd.vue')
// 修改个人信息
const myInfo = () => import(/* webpackChunkName: "myInfo" */ '../components/home/myInfo.vue')
// 方案分享页面
const shareADList = () => import(/* webpackChunkName: "shareADList" */ '../components/common/shareADList.vue')
const shareADListProposal = () => import(/* webpackChunkName: "shareADListProposal" */ '../components/common/shareADListProposal.vue')
//Q&A
const questionAndAnswer =()=> import(/* webpackChunkName: "questionAndAnswer" */ '../components/common/questionAndAnswer')
//404
const NotFountPage = () => import(/* webpackChunkName: "NotFountPage" */ '../components/common/NotFoundPage.vue')
//管理员
const admin = () => import(/* webpackChunkName: "adminCommon" */ '../components/admin/adminCommon.vue')
const SMqinlinzk = () => import(/* webpackChunkName: "SMqinlinzk" */ '../components/admin/SMqinlinzk.vue')
const ADlimitList = () => import(/* webpackChunkName: "ADlimitList" */ '../components/admin/ADlimitList.vue')
const notice = () => import(/* webpackChunkName: "notice" */ '../components/admin/notice.vue')

// 空点导出
const emptyPoint = () => import(/* webpackChunkName: "downEmptyPoint" */ '../components/common/downEmptyPoint.vue')

//公用页面
const mediaInput = () => import(/* webpackChunkName: "mediaInput" */ '../components/common/mediaInput.vue')
const mediaDetail = () => import(/* webpackChunkName: "mediaDetail" */ '../components/common/mediaDetail.vue')
const mediaList = () => import(/* webpackChunkName: "mediaList" */ '../components/common/mediaList.vue')
const clientList = () => import(/* webpackChunkName: "clientList" */ '../components/common/clientList.vue')
const planList = () => import(/* webpackChunkName: "planList" */ '../components/common/planList.vue')
const publishPriceList = () => import(/* webpackChunkName: "publishPriceList" */ '../components/common/publishPriceList.vue')
const createAccount = () => import(/* webpackChunkName: "createAccount" */ '../components/common/createAccount.vue')
const accountList = () => import(/* webpackChunkName: "accountList" */ '../components/common/accountList.vue')
const orderList = () => import(/* webpackChunkName: "orderList" */ '../components/common/orderList.vue')
const clientDetail = () => import(/* webpackChunkName: "clientDetail" */ '../components/common/clientDetail.vue')
// 直营销售创建意向方案
const createPlan = () => import(/* webpackChunkName: "createPlan" */ '../components/common/createPlan.vue')
// 加盟销售和媒介或直营媒介创建方案（保持原逻辑）
const createPlanOld = () => import(/* webpackChunkName: "createPlanOld" */ '../components/common/createPlanOld.vue')
// 加盟销售和媒介编辑方案或直营媒介编辑非意向方案（保持原逻辑）
const editPlanOld = () => import(/* webpackChunkName: "editPlanOld" */ '../components/common/editPlanOld.vue')
// 直营媒介编辑已配点意向方案或者给未配点意向方案进行配点或者编辑非意向方案点位（原逻辑增加配点组件并根据是否有意向方案加以权限控制）
const editPlan = () => import(/* webpackChunkName: "editPlan" */ '../components/common/editPlan.vue')
// 直营媒介或销售编辑未配点意向方案的意向
const editEmptyPointPlan = () => import(/* webpackChunkName: "editEmptyPointPlan" */ '../components/common/editEmptyPointPlan.vue')
const planDetail = () => import(/* webpackChunkName: "planDetail" */ '../components/common/planDetail.vue')
const planEmptyPointDetail = () => import(/* webpackChunkName: "planEmptyPointDetail" */ '../components/common/planEmptyPointDetail.vue')
const orderDetail = () => import(/* webpackChunkName: "orderDetail" */ '../components/common/orderDetail.vue')
const photoGallery = () => import(/* webpackChunkName: "photoGallery" */ '../components/common/photoGallery.vue')
const advertTV = () => import(/* webpackChunkName: "advertTV" */ '../components/common/advertTV.vue')
const tvOrderList = () => import(/* webpackChunkName: "tvOrderList" */ '../components/common/tvOrderList.vue')
const tvOrderDetail = () => import(/* webpackChunkName: "tvOrderDetail" */ '../components/common/tvOrderDetail.vue')
const settingPrice = () => import(/* webpackChunkName: "settingPrice" */ '../components/common/settingPrice.vue')
const maintainList = () => import(/* webpackChunkName: "maintainList" */ '../components/common/maintainList.vue')
const companyList = () => import(/* webpackChunkName: "companyList" */ '../components/common/companyList.vue')
const compact = () => import(/* webpackChunkName: "compact" */ '../components/common/compact.vue')
const paintedPath = () => import(/* webpackChunkName: "paintedPath" */ '../components/common/paintedPath.vue')
const adsDialPlate = () => import(/* webpackChunkName: "adsDialPlate" */ '../components/common/adsDialPlate.vue')
const messageList = () => import(/* webpackChunkName: "messageList" */ '../components/common/messageList.vue')
const communityRank = () => import(/* webpackChunkName: "communityRank" */ '../components/common/communityRank.vue')
const portraitDetail = () => import(/* webpackChunkName: "portraitDetail" */ '../components/common/portraitDetail.vue')
const qinLinMap = () => import(/* webpackChunkName: "qinLinMap" */ '../components/common/qinLinMap.vue')
const resContrastMap = () => import(/* webpackChunkName: "resContrastMap" */ '../components/common/resContrastMap.vue')

// 下载进度页面
const progressDown = () => import(/* webpackChunkName: "progressDown" */ '../components/common/progressDown.vue')

//地图选点中转页面
// const mapMessage = () => import('../components/common/mapMessage.vue')

//超级运营
const adminIndex = () => import(/* webpackChunkName: "superOperateIndex" */ '../components/superOperate/superOperate_index.vue')
const superOperateCommon = () => import(/* webpackChunkName: "superOperateCommon" */ '../components/superOperate/superOperateCommon.vue')
const dataAnalysis = () => import(/* webpackChunkName: "dataAnalysis" */ '../components/superOperate/dataAnalysis.vue')
const communityPortrait = () => import(/* webpackChunkName: "communityPortrait" */ '../components/superOperate/communityPortrait')

//普通运营
const operateIndex = () => import(/* webpackChunkName: "operateIndex" */ '../components/operate/operate_index.vue')
const operateCommon = () => import(/* webpackChunkName: "operateCommon" */ '../components/operate/operateCommon.vue')

//媒介
const mediaIndex = () => import(/* webpackChunkName: "mediaIndex" */  '../components/media/media_index.vue')
const mediaCommon = () => import(/* webpackChunkName: "mediaCommon" */  '../components/media/mediaCommon.vue')
const projectList = () => import(/* webpackChunkName: "projectList" */  '../components/common/projectList.vue')
const projectDetail = () => import(/* webpackChunkName: "projectDetail" */  '../components/common/projectDetail.vue')
const paintedCount = () => import(/* webpackChunkName: "paintedCount" */  '../components/common/paintedCount.vue')


//销售
const saleIndex = () => import(/* webpackChunkName: "saleIndex" */  '../components/sale/sale_index.vue')
const createClient = () => import(/* webpackChunkName: "createClient" */  '../components/sale/createClient.vue')
const editClient = () => import(/* webpackChunkName: "editClient" */  '../components/sale/editClient.vue')
const saleCommon = () => import(/* webpackChunkName: "saleCommon" */  '../components/sale/saleCommon.vue')

// 加盟公司销售
const oldSaleIndex = () => import(/* webpackChunkName: "saleIndex" */ '../components/oldSale/sale_index.vue')
const oldSaleCommon = () => import(/* webpackChunkName: "saleCommon" */ '../components/oldSale/saleCommon.vue')

//广告主
const adOwnerIndex = () => import(/* webpackChunkName: "adOwnerIndex" */ '../components/adOwner/adOwner_index.vue')
const adOwnerCommon = () => import(/* webpackChunkName: "adOwnerCommon" */ '../components/adOwner/adOwnerCommon.vue')
const ADReport = () => import(/* webpackChunkName: "ADqinlinzkReport" */ '../components/adOwner/ADqinlinzkReport.vue')
const ADqinlinzk = () => import(/* webpackChunkName: "ADqinlinzk" */ '../components/adOwner/ADqinlinzk.vue')
const totalView = () => import(/* webpackChunkName: "totalView" */ '../components/adOwner/totalView.vue')
const trafficTrend = () => import(/* webpackChunkName: "trafficTrends" */ '../components/adOwner/trafficTrends.vue')
const resVisitors = () => import(/* webpackChunkName: "resVisitors" */ '../components/adOwner/resVisitors.vue')
const accessPeriod = () => import(/* webpackChunkName: "accessPeriod" */ '../components/adOwner/accessPeriod.vue')
const residentAttr = () => import(/* webpackChunkName: "residentAttr" */ '../components/adOwner/residentAttr.vue')
const costPreferences = () => import(/* webpackChunkName: "costPreferences" */ '../components/adOwner/costPreferences.vue')
const ADorderDetail = () => import(/* webpackChunkName: "ADorderDetail" */ '../components/adOwner/ADorderDetail.vue')
const visitFrequency = () => import(/* webpackChunkName: "visitFrequency" */ '../components/adOwner/visitFrequency.vue')
const hotSource = () => import(/* webpackChunkName: "hotSource" */ '../components/adOwner/hotSource.vue')


//工程
const engineerCommon = () => import(/* webpackChunkName: "engineerCommon" */ '../components/engineer/engineerCommon.vue')

// 楼盘开发
const developCommon = () => import(/* webpackChunkName: "developCommon" */ '../components/develop/developCommon.vue')
const developIndex = () => import(/* webpackChunkName: "developIndex" */ '../components/develop/developIndex.vue')
const contractCfg = () => import(/* webpackChunkName: "contractCfg" */ '../components/develop/contractCfg.vue')
const newContract = () => import(/* webpackChunkName: "newContract" */ '../components/develop/newContract.vue')
const editContract = () => import(/* webpackChunkName: "editContract" */ '../components/develop/editContract.vue')
const nextContract = () => import(/* webpackChunkName: "nextContract" */ '../components/develop/nextContract.vue')
const contractDetail = () => import(/* webpackChunkName: "contractDetail" */ '../components/develop/contractDetail.vue')
const contractList = () => import(/* webpackChunkName: "contractList" */ '../components/develop/contractList.vue')

//亲邻科技上刊报告
const Report = () => import(/* webpackChunkName: "Report" */ '../components/h5/Report.vue')

Vue.use(Router);
const staticRoutes = [{path: '/', redirect: '/login'},
    {path: '/login', name: 'login', component: login},
    // {path: '/mapMessage', name: 'mapMessage', component: mapMessage},
    {path: '/progressDown', name: 'progressDown', component: progressDown},
    {path: '/shareADList', name: 'shareADList', component: shareADList},
    {path: '/shareADListProposal', name: 'shareADListProposal', component: shareADListProposal},
    {path: '/emptyPoint', name: 'emptyPoint', component: emptyPoint},
    // 亲邻地图
    {path: '/ADResourceMap/chooseRes', component: qinLinMap, meta:{title: '亲邻科技，智慧选点'}},
    // 地图分享
    {path: '/ADResourcesMap/shareRes', component: qinLinMap, meta:{title: '亲邻科技，智慧分享'}},
    //资源对比可视化
    {path: '/resContrastMap',name:'resContrastMap',component: resContrastMap, meta:{title: '亲邻科技，智慧地图'}},
    //消息列表
    //上下刊报告h5页面
    {path: '/Report', name: 'Report', component: Report},
    //404
    {path: '*', component: NotFountPage}];
let router = new Router({
    mode: 'history',
    routes: staticRoutes
})
let roleRoutes = []
function addRoutes(role, proposal, retain) {
    !retain && resetRouter()
    switch (role) {
        case 'ADN_SM':
            roleRoutes = [
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
                        {path: '/superOperate/planEmptyPointDetail', component: planEmptyPointDetail},
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
                }]
            break;
        case 'ADN_SA':
            roleRoutes = [
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
                        {path: '/admin/notice', component: notice},
                    ]
                }]
            break;
        case 'ADN_OP':
            roleRoutes = [
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
                        {path: '/operate/planEmptyPointDetail', component: planEmptyPointDetail},
                        {path: '/operate/orderDetail', component: orderDetail},
                        {path: '/operate/publishPriceList', component: publishPriceList},
                        // {path: '/operate/mediaInput', component: mediaInput},
                        {path: '/operate/clientList', component: clientList},
                        {path: '/operate/changePwd', component: changePwd},
                        {path: '/operate/questionAndAnswer', component: questionAndAnswer},
                        {path: '/operate/compact', component: compact},
                    ]
                }]
            break;
        case 'ADN_MD_COUNTRY':
        case 'ADN_MD':
            //媒介
            let tempMD = null
            if(proposal) {
                // 直营媒介
                tempMD = [
                    {path: '/media/createPlanOld', component: createPlanOld, meta:{title: '创建方案'}},
                    {path: '/media/editPlanOld', component: editPlanOld, meta:{title: '编辑方案'}},
                    {path: '/media/editPlan', component: editPlan, meta:{title: '编辑方案'}},
                    {path: '/media/editEmptyPointPlan', component: editEmptyPointPlan, meta:{title: '编辑方案'}}
                ]
            } else {
                // 加盟媒介和直营媒介
                tempMD = [
                    {path: '/media/createPlanOld', component: createPlanOld, meta:{title: '创建方案'}},
                    {path: '/media/editPlanOld', component: editPlanOld, meta:{title: '编辑方案'}}
                ]
            }
            roleRoutes = [
                {
                    path: '/',
                    component: mediaCommon,
                    children: [
                        ...tempMD,
                        {path: '/media', component: mediaIndex},
                        {path: '/media/mediaList', component: mediaList},
                        {path: '/media/mediaInput', component: mediaInput, meta:{title: '创建媒体'}},
                        {path: '/media/mediaEdit', component: mediaInput, meta:{title: '编辑媒体'}},
                        {path: '/media/mediaDetail', component: mediaDetail},
                        {path: '/media/planList', component: planList},
                        {path: '/media/publishPriceList', component: publishPriceList},
                        {path: '/media/orderList', component: orderList},
                        {path: '/media/planDetail', component: planDetail},
                        {path: '/media/planEmptyPointDetail', component: planEmptyPointDetail},
                        {path: '/media/orderDetail', component: orderDetail},
                        {path: '/media/photoGallery', component: photoGallery},
                        {path: '/media/changePwd', component: changePwd},
                        {path: '/media/questionAndAnswer', component: questionAndAnswer},
                        {path: '/media/advertTV', component: advertTV},
                        {path: '/media/tvOrderList', component: tvOrderList},
                        {path: '/media/tvOrderDetail', component: tvOrderDetail},
                        // {path: '/media/mapMessage', component: mapMessage},
                        {path: '/media/maintainList', component: maintainList},
                        {path: '/media/myInfo', component: myInfo},
                        {path: '/media/compact', component: compact},
                        {path: '/media/paintedPath', component: paintedPath},
                        {path: '/media/adsDialPlate', component: adsDialPlate},
                        {path: '/media/projectList', component: projectList},
                        {path: '/media/projectDetail', component: projectDetail},
                        {path: '/media/paintedCount', component: paintedCount},
                        {path: '/media/messageList', component: messageList},
                        {path: '/media/communityPortrait',component: communityPortrait},
                        {path: '/media/communityRank',component: communityRank},
                        {path: '/media/portraitDetail',component: portraitDetail},
                    ]
                }
            ]
            break;
        case 'ADN_BD_COUNTRY':
        case 'ADN_BD_KA':
        case 'ADN_BD':
            let tempBD = null
            if(proposal) {
                // 直营销售
                tempBD = [
                    {path: '/sale', component: saleIndex},
                    {path: '/sale/createPlan', component: createPlan, meta:{title: '创建方案'}},
                    {path: '/sale/editEmptyPointPlan', component: editEmptyPointPlan, meta:{title: '编辑方案'}},
                ]
            } else {
                // 加盟销售
                tempBD = [
                    {path: '/sale', component: oldSaleIndex},
                    {path: '/sale/createPlanOld', component: createPlanOld, meta:{title: '创建方案'}},
                    {path: '/sale/editPlanOld', component: editPlanOld, meta:{title: '编辑方案'}},
                ]
            }
            roleRoutes = [
                //销售
                {
                    path: '/',
                    component: proposal?saleCommon:oldSaleCommon,
                    children: [
                        ...tempBD,
                        {path: '/sale/createClient', component: createClient},
                        {path: '/sale/editClient', component: editClient},
                        {path: '/sale/clientList', component: clientList},
                        {path: '/sale/planList', component: planList},
                        {path: '/sale/publishPriceList', component: publishPriceList},
                        {path: '/sale/orderList', component: orderList},
                        {path: '/sale/clientDetail', component: clientDetail},
                        {path: '/sale/planDetail', component: planDetail},
                        {path: '/sale/planEmptyPointDetail', component: planEmptyPointDetail},
                        {path: '/sale/orderDetail', component: orderDetail},
                        {path: '/sale/photoGallery', component: photoGallery},
                        {path: '/sale/changePwd', component: changePwd},
                        {path: '/sale/ADqinlinzk', component: ADqinlinzk},
                        {path: '/sale/questionAndAnswer', component: questionAndAnswer},
                        {path: '/sale/advertTV', component: advertTV},
                        {path: '/sale/tvOrderList', component: tvOrderList},
                        {path: '/sale/tvOrderDetail', component: tvOrderDetail},
                        // {path: '/sale/mapMessage', component: mapMessage},
                        {path: '/sale/myInfo', component: myInfo},
                        {path: '/sale/compact', component: compact},
                        {path: '/sale/communityPortrait',component: communityPortrait},
                        {path: '/sale/communityRank',component: communityRank},
                        {path: '/sale/portraitDetail',component: portraitDetail},
                        {path: '/sale/messageList', component: messageList},
                        {path: '/sale/adsDialPlate', component: adsDialPlate},
                    ]
                }
            ]
            break;
        case 'AD':
            roleRoutes = [
                //广告主
                {
                    path: '/',
                    component: adOwnerCommon,
                    children: [
                        {path: '/adOwner', component: adOwnerIndex},
                        {path: '/adOwner/planList', component: planList},
                        {path: '/adOwner/planDetail', component: planDetail},
                        {path: '/adOwner/planEmptyPointDetail', component: planEmptyPointDetail},
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
                        // {path: '/adOwner/ADplanDetail', component: planDetail},
                        {path: '/adOwner/visitFrequency', component: visitFrequency},
                        {path: '/adOwner/hotSource', component: hotSource},
                        {path: '/adOwner/compact', component: compact},
                        {path: '/adOwner/myInfo', component: myInfo},
                        {path: '/adOwner/communityPortrait',component: communityPortrait},
                        {path: '/adOwner/communityRank',component: communityRank},
                        {path: '/adOwner/portraitDetail',component: portraitDetail},
                    ]
                }]
            break;
        case 'ADN_EP':
            roleRoutes = [
                //工程
                {
                    path: '/f_engineer',
                    component: engineerCommon,
                    children: [
                        {path: '', redirect: '/f_engineer/orderList'},
                        {path: '/f_engineer/orderList', name:'orderList', component: orderList },
                        {path: '/f_engineer/myInfo', component: myInfo},
                        {path: '/f_engineer/orderDetail', component: orderDetail},
                        {path: '/f_engineer/messageList', component: messageList},
                        {path: '/f_engineer/questionAndAnswer', component: questionAndAnswer},
                        {path: '/f_engineer/maintainList', component: maintainList},
                    ]
                }]
            break;
        case 'ADN_DEV':
        case 'ADN_DEV_ASSET':
        case 'ADN_DEV_LEADER':
            roleRoutes = [
                //楼盘开发
                {
                    path: '/',
                    component: developCommon,
                    children: [
                        {path: '/f_develop', name:'developIndex', component: developIndex },
                        {path: '/f_develop/mediaList', component: mediaList},
                        {path: '/f_develop/mediaInput', component: mediaInput, meta:{title: '创建媒体'}},
                        {path: '/f_develop/mediaEdit', component: mediaInput, meta:{title: '编辑媒体'}},
                        {path: '/f_develop/mediaDetail', component: mediaDetail},
                        {path: '/f_develop/myInfo', component: myInfo},
                        {path: '/f_develop/messageList', component: messageList},
                        {path: '/f_develop/questionAndAnswer', component: questionAndAnswer},
                        {path: '/f_develop/maintainList', component: maintainList},
                        {path: '/f_develop/messageList', component: messageList},
                        {path: '/f_develop/contractCfg', component: contractCfg},
                        {path: '/f_develop/newContract', component: newContract},
                        {path: '/f_develop/editContract', component: editContract},
                        {path: '/f_develop/nextContract', component: nextContract},
                        {path: '/f_develop/contractDetail', component: contractDetail},
                        {path: '/f_develop/contractList', component: contractList}
                    ]
                }]
            break;
    }
    router.addRoutes(roleRoutes)
}
const resetRouter = () => {
    const newRouter = new Router({
        mode: 'history',
        routes: staticRoutes
    });
    router.matcher = newRouter.matcher;
}
if(document.location.pathname.indexOf('/login') !== -1 || document.location.pathname == '/') {
    // 刷新登录页触发
} else {
    // 刷新非登录页，保留原路由
    let session_data = JSON.parse(sessionStorage.getItem("session_data")||'{}')
    session_data.uType && addRoutes(session_data.uType, session_data.customPermission.proposalPermission == 1, true)
}
export {router, addRoutes}
