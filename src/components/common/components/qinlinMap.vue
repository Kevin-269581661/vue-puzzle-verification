<template>
    <div>
        <!--地图标签-->
        <div id="qinlinMap" ref="qinlinMap" style=""></div>
        <!--左侧搜索-->
        <div class="left_search_box">
            <el-input v-model="selectName" placeholder="请输入关键字" size="small" style="width: 270px"></el-input>
            <el-button icon="el-icon-search" circle class="search_btn" @click="searchFun"></el-button>
            <div class="left_search_content">
                <div class="search_result_btn">
                    <span class="search_kind" :class="activeSearchKind === 1 ? 'active_search_kind' : ''"
                        @click="activeSearchKind = 1">亲邻社区</span>
                    <span class="search_kind" :class="activeSearchKind === 2 ? 'active_search_kind' : ''"
                          @click="activeSearchKind = 2">在线结果</span>
                    <span class="search_result_all" @click="selectAllFun">全选</span>
                </div>
                <ul class="search_ul" v-show="activeSearchKind === 1">
                    <li class="search_li" v-for="(item,index) in searchResList" :key="index">
                        <div class="search_res_info">
                            <p>资源ID:{{item.resID}} </p>
                            <p>资源名称:{{item.resName}}</p>
                        </div>
                        <i class="el-icon-circle-check-outline" :class="item.isSelect ? 'is_select_li_icon' : ''"
                           @click="checkBoxFun(item)"></i>
                    </li>
                </ul>
                <ul class="search_ul" v-show="activeSearchKind === 2">
                    <li class="search_li" v-for="(item,index) in searchOnlineList" :key="index">
                        <div class="search_res_info">
                            <p>{{item.title}} </p>
                            <p>{{item.address}}</p>
                        </div>
                        <i class="el-icon-circle-check-outline" :class="item.isSelect ? 'is_select_li_icon' : ''"
                           @click="checkBoxFun(item)"></i>
                    </li>
                </ul>
            </div>
        </div>
        <!--底部右侧选中-->
        <div class="bottom_right_active">
            <div class="bottom_right_header">
                <span class="select_num">已选择<span style="color:red">{{selectResList.length}}</span>条</span>
                <span class="select_del_all" @click="deleteAll()">全部删除</span>
            </div>
            <div v-show="activeSearchKind === 1">
                <ul class="select_ul">
                    <li class="select_li" v-for="(item,index) in selectResList" :key="index">
                        <p class="select_li_resName">{{item.resName}}</p>
                        <i class="el-icon-delete" @click="deleteRes(item)"></i>
                    </li>
                </ul>
                <div style="padding: 0 8px">
                    <el-button type="primary" size="small" @click="exportExcel">导 出</el-button>
                    <el-button type="primary" size="small" @click="pushMapRes">选 定</el-button>
                </div>
            </div>
            <div v-show="activeSearchKind === 2">
                <ul class="select_ul">
                    <li class="select_li" v-for="(item,index) in selectOnlineList" :key="index">
                        <p class="select_li_resName">{{item.title}}</p>
                        <i class="el-icon-delete" @click="deleteRes(item)"></i>
                    </li>
                </ul>
                <div style="padding: 0 8px">
                    <el-input size="small" v-model="searchRadius" style="width: 178px" placeholder="km"></el-input>
                    <el-button type="primary" size="small" @click="searchAround">周边搜索</el-button>
                </div>
            </div>
        </div>
        <!--标注info框-->
        <div ref="res_info_window" v-show="isShowInfo">
            <p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>
                资源ID:{{ showResInfo.resID}}
            </p>
            <p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>
                资源名称:{{ showResInfo.resName}}
            </p>
            <div class="info_footer">
                <span class="show_adDoor">广告门</span>
                <span class="add_Btn" :class="showResInfo.isSelect ? 'is_select_btn' : ''" @click="addResFun(item)">
                    {{showResInfo.isSelect ? '取消待选' : '加入待选'}}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
    import adsInfo from "../../../commonFun/json/ads"
    export default {
        name: "qinlinMap",
        data(){
            return{
                resMap: '',
                markerIcon: require('../../../assets/images/markerIcon.png'),
                selectName: '',
                // 搜索类型
                activeSearchKind: 1,
                // 搜索的资源列表
                searchResList: [],
                searchOnlineList:[],
                // 选择的亲邻社区列表
                selectResList: [],
                // 在线搜索结果
                selectOnlineList: [],
                // 周边搜索的半径
                searchRadius: '',
                // 被点击的资源标注信息
                showResInfo:{},
                isShowInfo: false,
            }
        },
        mounted(){
            let timer = setTimeout(()=>{
                this.initMap()
                clearTimeout(timer)
            },500)
        },
        methods: {
            // 初始化地图
            initMap() {
                console.log('初始化地图',adsInfo[0].lng)
                // 创建Map实例
                this.resMap = new BMap.Map("qinlinMap");
                console.log('resMap',this.resMap)
                // 初始化地图,设置中心点坐标和地图级别
                this.resMap.centerAndZoom(new BMap.Point(113.36133,23.13129), 11);
                // 设置地图显示的城市 此项是必须设置的
                this.resMap.setCurrentCity("广州市");
                //开启鼠标滚轮缩放
                this.resMap.enableScrollWheelZoom(true);
                //
                this.creatMarker()
            },
            // 创建标注
            creatMarker(){
                let i = 0
                for(let key of adsInfo){
                    key.isSelect = false
                    if(i < 1000) {
                        let lngLat = key.lng.split(';')
                        let point = new BMap.Point(lngLat[0], lngLat[1]); //
                        let myIcon = new BMap.Icon(this.markerIcon, new BMap.Size(20,33),{
                            anchor: new BMap.Size(10, 33)
                        });
                        let marker = new BMap.Marker(point,{icon:myIcon});  // 创建标注
                        let label = new BMap.Label(key.resName,{offset:new BMap.Size(20,5)});
                        label.setStyle({
                            borderRadius: "3px"
                        });
                        marker.setLabel(label);
                        marker.setTop(true);
                        this.resMap.addOverlay(marker);              // 将标注添加到地图中*/
                        marker.addEventListener("click",()=>{
                            this.showInfo(key,point)
                        });
                        // console.log('getOffset',marker.getOffset())
                    } else {
                        break
                    }
                    i++
                }
            },
            // 显示详情
            showInfo(info,point){
                let content = this.$refs.res_info_window
                let opts = {
                    width: 250,             // 信息窗口宽度
                    height: 88,              // 信息窗口高度
                    title: "",              // 信息窗口标题
                    enableMessage: false    //设置允许信息窗发送短息
                }
                this.showResInfo = info
                let infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
                this.resMap.openInfoWindow(infoWindow,point);        //开启信息窗口
                this.isShowInfo = true
            },
            // 详情里选定按钮
            addResFun(item) {
                this.checkBoxFun(this.showResInfo)
            },
            /* 左侧搜索 */
            // 搜索
            searchFun() {
                // 亲邻社区搜索
                let arr = adsInfo.filter((item,index) => {
                    if (item.resName.includes(this.selectName)) {
                        return item
                    }
                })
                this.searchResList = arr
                arr.length ? this.activeSearchKind = 1 : this.activeSearchKind = 2
                // 在线搜索
                this.onlineSearchFun()
            },
            // 在线搜索
            onlineSearchFun(){
                let resultArray = []
                let options = {
                    onSearchComplete: (results)=>{
                        // 判断状态是否正确
                        if (local.getStatus() == BMAP_STATUS_SUCCESS){
                            // console.log('在线搜索results',results,results.getNumPois(),results.getPoi(0));
                            // let arr = []
                            // for (let i = 0; i < results.getCurrentNumPois(); i++){
                            //     arr.push({
                            //         id: results.getPoi(i).uid,
                            //         title: results.getPoi(i).title,
                            //         address: results.getPoi(i).address,
                            //         city: results.getPoi(i).city,
                            //         province: results.getPoi(i).province,
                            //         point: results.getPoi(i).point,
                            //     });
                            // }
                            // this.searchOnlineList = arr
                            // console.log('searchOnlineList',this.searchOnlineList)
                            let totalResults = results.getNumPois();
                            let totalPages = results.getNumPages();
                            let currPage = results.getPageIndex();// 获取当前是第几页数据
                            for (let i = 0; i < results.getCurrentNumPois(); i++) {
                                //在当前页面下获取页面中的内容
                                resultArray.push({
                                    id: results.getPoi(i).uid,
                                    title: results.getPoi(i).title,
                                    address: results.getPoi(i).address,
                                    city: results.getPoi(i).city,
                                    province: results.getPoi(i).province,
                                    point: results.getPoi(i).point,
                                })
                            }
                            if (currPage < totalPages - 1) {
                                // 遍历到最后一页之后不再进行下一页搜索，此时，已经获取到全部的搜索结果
                                local.gotoPage(results.getPageIndex() + 1);
                            } else {
                                this.searchOnlineList = resultArray
                                this.onlineResultsMarker()
                                console.log("全部结果有：",resultArray,"------原本搜索结果有：",totalResults);
                            }
                        }
                    },
                    pageCapacity : 50
                };
                let local = new BMap.LocalSearch(this.resMap, options);
                // local.setPageCapacity(100);
                local.search(this.selectName);
            },
            // 在线结果打点
            onlineResultsMarker(){
                for(let key of this.searchOnlineList){
                    let marker = new BMap.Marker(key.point);  // 创建标注
                    marker.setTop(true);
                    this.resMap.addOverlay(marker);            // 将标注添加到地图中
                    marker.addEventListener("click",()=>{
                        let content =
                            "<div>"+
                            "<p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>"
                            + key.title +"</p>"+
                            "<p style='font:14px arial,sans-serif;margin:0;line-height:1.5;'>" +
                            "地址:"+ key.address +"</p>"+
                            "</div>";
                        let opts = {
                            width: 0,             // 信息窗口宽度
                            height: 0,              // 信息窗口高度
                            title: "",              // 信息窗口标题
                            enableMessage: false    //设置允许信息窗发送短息
                        }
                        let infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
                        this.resMap.openInfoWindow(infoWindow,key.point); //开启信息窗口
                    });
                }
            },
            // 全选
            selectAllFun(){
                for(let key of this.searchResList) {
                    if(!key.isSelect) {
                        key.isSelect = true
                        this.selectResList.push(key)
                    }
                }
                console.log('全选',this.selectResList)
            },
            // 勾选/取消
            checkBoxFun(item) {
                console.log('item',item)
                if(item.isSelect) {
                    // 取消选定
                    if (this.activeSearchKind === 1) {
                        this.deleteRes(item)
                    } else if(this.activeSearchKind === 2){
                        item.isSelect = false
                        for (let i = 0; i < this.selectOnlineList.length; i++) {
                            if (this.selectOnlineList[i].id === item.id) {
                                this.selectOnlineList.splice(i, 1)
                                break
                            }
                        }
                        this.deleteCircle(item.id)
                    }
                } else {
                    // 选定
                    if(this.activeSearchKind === 1) {
                        let lngLat = item.lng.split(';')
                        let point = new BMap.Point(lngLat[0],lngLat[1])
                        // 圈起标识
                        this.createCircle(item.resID,point)
                        item.isSelect = true
                        // 添加到选中列表
                        this.pushSelectList(item)
                    } else if(this.activeSearchKind === 2) {
                        // 圈起标识
                        this.createCircle(item.id,item.point)
                        item.isSelect = true
                        this.selectOnlineList.push(item)
                    }
                }
            },
            // 添加到选中列表
            pushSelectList(item) {
                this.selectResList.push(item)
            },
            // 画圆标识选中状态
            createCircle(id,point){
                console.log('id,point',id,point)
                let opts = {
                    position : point,    // 指定文本标注所在的地理位置
                    offset   : new BMap.Size(-24, -48)    //设置文本偏移量
                }
                let label = new BMap.Label(id, opts);  // 创建文本标注对象
                label.setStyle({
                    color : "rgba(0,0,0,0)",
                    fontSize : "12px",
                    height : "48px",
                    width: "48px",
                    background: 'rgba(0,0,0,0)',
                    border: "3px solid #1890FF",
                    borderRadius: "50%"
                });
                this.resMap.addOverlay(label);
                console.log('label',label,label.content)
            },
            // 删除覆盖物
            deleteCircle(id) {
                let allOverlay = this.resMap.getOverlays();
                console.log('allOverlay',allOverlay)
                for (let i = 0; i < allOverlay.length; i++) {
                    if (allOverlay[i].content == id) {
                        this.resMap.removeOverlay(allOverlay[i]);
                        break;
                    }
                }
            },
            /* 右下 */
            // 删除选中社区
            deleteRes(item) {
                this.deleteCircle(item.resID)
                item.isSelect = false
                for (let i = 0; i < this.selectResList.length; i++) {
                    if (this.selectResList[i].resID === item.resID) {
                        this.selectResList.splice(i, 1)
                        break
                    }
                }
            },
            // 删除全部
            deleteAll() {
                for (let key of this.selectResList) {
                    key.isSelect = false
                    this.deleteCircle(key.resID)
                }
                this.selectResList = []
            },
            // 周边搜索
            searchAround(){
                this.searchResList = []
                let radius = this.searchRadius * 1000
                for(let key of this.selectOnlineList) {
                    let circle = new BMap.Circle(key.point,radius,{fillColor:"blue", strokeWeight: 1 ,fillOpacity: 0.3, strokeOpacity: 0.3});
                    this.resMap.addOverlay(circle);
                    this.showResInCircle(key.point,radius)
                }
                this.searchResList.length ?  this.activeSearchKind = 1 : this.activeSearchKind = 2
            },
            // 显示圆半径内的小区
            showResInCircle(point,radius) {
                let date1=new Date();
                let allOverlay = this.resMap.getOverlays();
                for(let key of adsInfo) {
                    for (let akey of allOverlay) {
                        if( akey.isVisible() &&
                            akey.toString() == "[object Marker]" &&
                            akey.getLabel() &&
                            akey.getLabel().content === key.resName) {
                            let lngLat = key.lng.split(';')
                            let point2 = new BMap.Point(lngLat[0],lngLat[1])
                            let distance = this.resMap.getDistance(point,point2)
                            if(distance > radius){
                                akey.hide()
                            } else {
                                let flag = this.searchResList.some((item,index)=>{
                                    if(key.resID === item.resID) {
                                        return true
                                    }
                                })
                                if (!flag) {
                                    this.searchResList.push(key)
                                }
                            }
                            break
                        }
                    }
                }
                let date2 = new Date();
                let haomiao = date2.getTime() - date1.getTime();
                console.log('用时',haomiao/(1000*60))
            },
            // 导出exc
            exportExcel(){

            },
            // 选定提交点位
            pushMapRes(){

            },
        },
    }
</script>

<style scoped>
    #qinlinMap {
        position: fixed !important;
        top: 60px;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 1;
    }
    /* 左侧 */
    .left_search_box{
        position: fixed;
        top: 80px;
        left: 32px;
        width: 308px;
    }
    .search_btn{
        min-width: 32px;
        height: 32px;
        line-height: 32px;
        padding: 0;
    }

    .left_search_content{
        margin-top: 8px;
        background: #ffffff;
        font-size: 14px;
        color: #333;
    }

    .search_result_btn{
        padding: 8px 16px;
    }

    .search_kind{
        display: inline-block;
        width: 82px;
        height: 20px;
        line-height: 20px;
        color: #fff;
        background: #637995;
        text-align: center;
        border-radius: 10px;
        cursor: pointer;
        margin-right: 8px;
    }

    .active_search_kind{
        background: #2d8cf0;
    }

    .search_result_all{
        cursor: pointer;
    }

    .search_ul{
        height: 720px;
        overflow-y: auto;
    }

    .search_li{
        display: flex;
        padding: 8px 4px 8px 16px;
        border-bottom: 1px solid #D9D9D9;
    }

    .is_select_li_icon{
        color:#1890FF
    }

    .search_res_info{
        flex:1;
    }

    .search_li .el-icon-circle-check-outline{
        width: 34px;
        font-size: 26px;
        line-height: 38px;
        text-align: center;
        cursor:pointer;
    }

    .search_res_info p{
        line-height: 24px;
    }

    /*  底部选中 */
    .bottom_right_active{
        position: fixed;
        bottom: 24px;
        right: 32px;
        width: 280px;
        height: 200px;
        background: #fff;
        border-radius: 3px;
        font-size: 14px;
        color: #333;
        z-index: 99;
    }

    .bottom_right_header{
        line-height: 24px;
        display: flex;
        padding: 0 8px;
        border-bottom: 1px solid #D9D9D9;
    }

    .select_num{
        flex: 1
    }

    .select_del_all{
        width: 72px;
        text-align: center;
        cursor: pointer;
    }

    .select_ul{
        height: 140px;
        overflow-y: auto;

    }

    .select_li{
        display: flex;
        line-height: 24px;
        padding: 0 8px;
    }

    .select_li_resName{
        flex: 1;
    }

    .select_li .el-icon-delete{
        width: 24px;
        line-height: 24px;
        font-size: 16px;
        text-align: center;
        cursor: pointer;
    }

    /* 详情弹出框 */
    .info_footer{
        text-align: right;
        padding: 8px;
    }
    .info_footer span{
        display: inline-block;
        height: 24px;
        line-height: 24px;
        border-radius: 3px;
        color: #fff;
        padding: 0 8px;
        font-size: 14px;
        cursor: pointer;
    }

    .show_adDoor{
        background: #5c5f7a;
    }

    .show_adDoor:hover{
        background: #333
    }

    .add_Btn{
        background: #0095ff;
    }

    .add_Btn:hover{
        background: #0078A8;;
    }


    ::-webkit-scrollbar {
        width: 6px;
        height: 8px;
        background: #FAFAFA;
    }

    ::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }
</style>
