'use strict'
// 测试环境
let wuYouMap = 'https://wsopbodv.dituwuyou.com/qinlin/embed?mid=_J6aWeV128gkhVn54AfWIw&token=SvcvtTqpktwPUb8dbu_jx0602nj_4tF-is8&mapid=';
let shareWUYouMap = 'https://wsopbodv.dituwuyou.com/qinlin/embed?mid=_J6aWeV128gkhVn54AfWIw&token=SvcvtTqpktwPUb8dbu_jx0602nj_4tF-is8&myid=';
let jsonLink = 'https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/cityRes-test/';
let wsUrl = "wss://test-qadn.qinlindmp.com/UCAPI/ScanLogin?type=PC"
if(process.env.NODE_ENV == 'production' || process.env.NODE_ENV =='graying'){
    // 正式环境
    wuYouMap = 'https://www.dituwuyou.com/qinlin/embed?mid=FPcrNHyq3xXFZDbqlTyHKA&token=fp3nxsKCYZzOSnU0KosEq0GA1o1qcKh5XLA&mapid=';
    shareWUYouMap = 'https://www.dituwuyou.com/qinlin/embed?mid=FPcrNHyq3xXFZDbqlTyHKA&token=fp3nxsKCYZzOSnU0KosEq0GA1o1qcKh5XLA&myid=';
    jsonLink = 'https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/cityRes/';
    wsUrl = "wss://www.qinlinad.com/UCAPI/ScanLogin?type=PC";
}
// 开发环境
if(process.env.NODE_ENV == 'development'){
    jsonLink = 'https://qadn-1256017579.cos.ap-guangzhou.myqcloud.com/cityRes-dev/';
}
const apiRoot = {
    devURL: '"http://192.168.1.239"',
    // testURL: '"http://192.168.1.239"',
    testURL: '"https://test-qadn.qinlindmp.com/"',
    grayURL: '"https://beta-qadn.qinlindmp.com/"',
    prodURL: '"https://www.qinlinad.com/"',
};

const apiVar = {
    Map: '/MapAPI',
    QZhike: '/QZhike',
    QKuyun: '/QinlinKuyun-API',
    UCAPI: '/UCAPI',
    Media: '/mediaService/media',
    Advertisement: '/advertisement',
    //消息通知
    system:'/system/message',
    //经营分析
    Count: '/Count',
    report: '/report',
    QADNAPI: '/QADNAPI',
    // 工程分画线路
    engineer:'engineer/publishLine',
    // 分画模块相关
    publishPaintTask: '/engineer/publishPaintTask',
    // 换画报告
    replace: '/replace/v1',
    // 社区画像
    portrait: '/portrait/api/v1/',
    // 图片相关
    image: '/image',
    // 自研地图相关
    mapApi: '/map',
    wuYouMap: wuYouMap,
    shareWUYouMap: shareWUYouMap,
    jsonLink: jsonLink,
    wsUrl: wsUrl,
    qadnUrl: process.env.API_ROOT?process.env.API_ROOT.substr(0, process.env.API_ROOT.length-1):''
};

module.exports = {
    apiRoot: apiRoot,
    apiVar: apiVar,
}
