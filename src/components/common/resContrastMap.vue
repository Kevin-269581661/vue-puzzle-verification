<template>
    <div class="res-contrast-map" v-loading="mapLoading"
         element-loading-text="玩命加载中.."
         element-loading-spinner="el-icon-loading">
        <!--引入远程JS-->
        <remote-js src="https://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js"></remote-js>
        <!--地图标签-->
        <div id="resMap" ref="resMap">
        </div>
        <!--左上角下拉框-->
        <div class="select-group">
            <!--城市-->
            <el-select v-model="selectCity" size="small" placeholder="请选择城市" @change="filterCity" filterable>
                <el-option v-for="item in cityList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <!--区域-->
            <el-select v-model="selectArea" size="small" placeholder="请选择区域" collapse-tags multiple clearable
                       @change="filterArea">
                <el-option v-for="item in areaList" :key="item.rID" :label="item.rName" :value="item.rID"></el-option>
            </el-select>
            <!--资源类型-->
            <el-select v-model="selectResType" size="small" placeholder="请选择" @change="filterResType">
                <el-option v-for="item in resTypeList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </div>
        <!--右上角选择-->
        <div class="radio-group">
            <el-checkbox-group v-model="companyCheckbox">
                <el-checkbox v-for="item in companyList" :label="item.value" :key="item.value" :class="item.color"
                             @change="chooseCompany($event,item.value)" :disabled='item.count==0'>
                    {{item.name}}({{item.count}})
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <!--底部右侧鼠标绘制-->
        <div class="bottom_right_control">
            <!--比例尺-->
            <ul class="scale_control">
                <li class="li_map_zoom">
                    <span>{{scale}}</span>
                    <div class="zoom_scale"></div>
                </li>
                <li class="li_btn" @click="setMapZoom('minus')">
                    <i class="el-icon-minus"></i>
                </li>
                <li class="li_btn" @click="setMapZoom('add')">
                    <i class="el-icon-plus"></i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import api from "../../api/api"
    import areaPackage from "../../commonFun/areaPackage_new";

    export default {
        name: "resContrastMap",
        components: {
            'remote-js': {
                render(createElement) {
                    return createElement('script', {attrs: {type: 'text/javascript', src: this.src}});
                },
                props: {
                    src: {type: String, required: true},
                },
            },
        },
        data() {
            return {
                resMap: '',
                mapLoading: true,
                // 鼠标绘制结果状态
                isMouseSearch: false,
                // 标识在线搜索结果状态
                isOnlineSearch: false,
                // 标识当前模式为多点辐射
                isMultiPoint: false,
                //浮标
                QLpointCollection: [],
                FZpointCollection: [],
                XCpointCollection: [],
                XYMpointCollection: [],
                QLResData: [],
                FZResData: [],
                XCResData: [],
                XYMResData: [],
                //比例
                scale: '5公里',
                cityList: '',
                areaList: '',
                resTypeList: [
                    {label: '全部资源', value: 0},
                    {label: '社区', value: 1},
                    {label: '写字楼', value: 2}
                ],
                selectCity: '',
                selectArea: [],
                selectResType: 0,
                companyList: [
                    {value: 1, name: '亲邻', count: 0, color: 'red'},
                    {value: 2, name: '分众', count: 0, color: 'blue'},
                    {value: 3, name: '新潮', count: 0, color: 'orange'},
                    {value: 4, name: '祥云门', count: 0, color: 'green'},
                ],
                companyCheckbox: [1,2],

            }
        },
        methods: {
            // 初始化地图
            initMap() {
                let that = this
                // console.log('初始化地图----')
                // 创建Map实例
                this.resMap = new window.BMap.Map("resMap", {enableMapClick: false});
                console.log('resMap', this.resMap)
                // 设置地图显示的城市 此项是必须设置的
                let city = areaPackage.CodeToText(this.selectCity)
                this.resMap.setCurrentCity(city);
                // 初始化地图,设置中心点坐标和地图级别
                this.resMap.centerAndZoom(city, 11);
                //开启鼠标滚轮缩放
                this.resMap.enableScrollWheelZoom(true);
                let mapStyleJson = [
                    {
                        "featureType": "land",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "point",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                    {
                        "featureType": "building",
                        "elementType": "geometry.stroke",
                        "stylers": {
                            "visibility": "off"
                        }
                    },
                ]
                this.resMap.setMapStyle({styleJson: mapStyleJson})

                // 监听点击地图
                this.resMap.addEventListener("click", (e) => {
                    // console.log('监听点击地图---', e.point)
                    if (this.isMouseLine) {
                        if (!this.mouseLineStep) {
                            this.resMap.addEventListener("mousemove", that.mapMouseMove, false)
                        }
                        // this.LinePoints.push(e.point)
                        // this.drawingLine(e.point)
                        // this.mouseLineStep++
                    }
                });
                // 监听地图缩放
                this.resMap.addEventListener('zoomend', (e) => {
                    this.setMapZoom()
                })
                // 监听地图移动
                this.resMap.addEventListener('moveend', (e) => {
                    this.pointInBounds()
                })
                this.getData(1)
            },
            // 判断点是否在视野内
            pointInBounds() {
                console.log('判断点是否在视野内------', this.resMap.getZoom())
                if (!this.isMouseSearch && !this.isOnlineSearch && !this.isMultiPoint && this.resMap.getZoom() >= 16) {
                    // let bound = this.resMap.getBounds();// 地图可视区域
                    // for (let key of this.resMarkers) {
                    //     if (bound.containsPoint(key.point) == true && !key.isVisible()) {
                    //         key.show()
                    //     }
                    // }
                }
            },
            // 地图缩放
            setMapZoom(temp) {
                if (temp === 'add') {
                    this.resMap.zoomIn()
                } else if (temp === 'minus') {
                    this.resMap.zoomOut()
                }
                let scaleArr = ['20米', '50米', '100米', '200米', '500米', '1公里', '2公里', '5公里', '10公里', '20公里', '25公里', '50公里', '100公里', '200公里', '500公里', '1000公里', '2000公里', '5000公里', '10000公里']
                let mapLevel = [19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
                let index = mapLevel.indexOf(this.resMap.getZoom())
                this.scale = scaleArr[index]
                if (index <= 4) {
                    this.pointInBounds()
                }
                console.log('当前地图缩放等级---', this.resMap.getZoom(), this.scale)
            },
            // 选择城市
            filterCity() {
                // console.log('城市', this.selectCity)
                let city = areaPackage.CodeToText(this.selectCity)
                this.resMap.setCurrentCity(city);
                // 初始化地图,设置中心点坐标和地图级别
                this.resMap.centerAndZoom(city, 11);
                this.clearMarkers()
                this.selectArea = [];
                this.getArea(this.selectCity)
                console.log(this.companyCheckbox);
                if (this.companyCheckbox.length > 0) {
                    for (let data of this.companyCheckbox) {
                        // 设置地图显示的城市 此项是必须设置的
                        this.getData(data)
                    }
                }
            },
            // 选择区域
            filterArea() {
                // console.log('区域', this.selectArea)
               this.clearMarkers()
                // this.getData()
                if (this.companyCheckbox.length > 0) {
                    for (let data of this.companyCheckbox) {
                        this.getData(data)
                    }
                }
            },
            //清空marker
            clearMarkers(){
                this.resMap.removeOverlay(this.QLpointCollection)
                this.resMap.removeOverlay(this.FZpointCollection)
                this.resMap.removeOverlay(this.XCpointCollection)
                this.resMap.removeOverlay(this.XYMpointCollection)
            },
            //选择资源类型
            filterResType() {
                this.clearMarkers()
                if (this.companyCheckbox.length > 0) {
                    for (let data of this.companyCheckbox) {
                        this.getData(data)
                    }
                }
            },
            //选择公司
            chooseCompany(e, id) {
                // console.log(e,id);
                if (e) {
                    this.getData(id)
                } else {
                    if(id == 1){
                        this.resMap.removeOverlay(this.QLpointCollection)
                    }else if(id == 2){
                        this.resMap.removeOverlay(this.FZpointCollection)
                    }else if(id == 3){
                        this.resMap.removeOverlay(this.XCpointCollection)
                    }else{
                        this.resMap.removeOverlay(this.XYMpointCollection)
                    }
                }
            },
            //获取点位数据
            getData(companyId) {
                this.mapLoading = true
                let info = {
                    cityCode: this.selectCity,
                    company: companyId
                }
                if (this.selectArea.length > 0) {
                    info.districtCodes = this.selectArea.join(',')
                }
                if (this.selectResType != 0) {
                    info.resType = this.selectResType
                }
                api.getApi(this.apiVar.mapApi + '/resCompare/list', info).then(res => {
                    console.log('数据', res.data.data)
                    if (res.data.SysCode == 200200) {
                        let result = res.data.data.resList
                        if (companyId == 1) {
                            this.QLResData = result
                            this.addMarker(result, '#FF3131', companyId)
                        } else if (companyId == 2) {
                            this.FZResData = result
                            this.addMarker(result, '#318FFF', companyId)
                        } else if (companyId == 3) {
                            this.XCResData = result
                            this.addMarker(result, '#ffa940', companyId)
                        } else {
                            this.XYMResData = result
                            this.addMarker(result, '#52c41a', companyId)
                        }
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
                this.getCommunityCount(companyId)
            },
            //获取点位数量数据
            getCommunityCount(companyId){
                let info = {
                    cityCode: this.selectCity,
                }
                if (this.selectArea.length > 0) {
                    info.districtCodes = this.selectArea.join(',')
                }
                if (this.selectResType != 0) {
                    info.resType = this.selectResType
                }
                api.getApi(this.apiVar.mapApi + '/resCompare/resCount', info).then(res => {
                    // console.log('数据', res.data)
                    if (res.data.SysCode == 200200) {
                        this.companyList = res.data.data
                        if(res.data.data[1].count>0){
                            this.getData(res.data.data[1].value)
                        }
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            },
            //添加标注
            addMarker(arr, color,companyId) {

                if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
                    var points = [];  // 添加海量点数据
                    for (let data of arr) {
                        points.push(new window.BMap.Point(data.lng, data.lat));
                    }
                    var options = {
                        size: BMAP_POINT_SIZE_SMALL,
                        shape: BMAP_POINT_SHAPE_CIRCLE,
                        color: color
                    }
                    if (companyId == 1) {
                        this.QLpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.QLpointCollection.addEventListener('click', function (e) {
                            // 监听点击事件
                        });
                        this.resMap.addOverlay(this.QLpointCollection);  // 添加Overlay
                    } else if (companyId == 2) {
                        this.FZpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.FZpointCollection);  // 添加Overlay
                    } else if (companyId == 3) {
                        this.XCpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.XCpointCollection);  // 添加Overlay
                    } else {
                        this.XYMpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.XYMpointCollection);  // 添加Overlay
                    }

                    this.mapLoading = false
                } else {
                    alert('请在chrome、safari、IE8+以上浏览器查看本示例');
                }

            },
            // 获取城市
            getCity() {
                api.postApi(this.apiVar.Advertisement + '/GetAuthorCity').then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 300200) {
                        let resinfo = res.data.data;
                        let result = [];
                        for (let data of resinfo) {
                            let obj = {
                                label: data.rName,
                                value: data.rID.toString()
                            };
                            result.push(obj);
                        }
                        this.cityList = result;
                        this.selectCity = this.cityList[0].value
                        this.getArea(this.selectCity)
                        this.initMap()
                    } else {
                        Message.warning(res.data.MSG);
                    }
                });
            },
            //区域列表
            getArea(id) {
                this.areaList = areaPackage.findArea(id)
            }
        },
        mounted() {
            this.getCity()

        }
    }
</script>

<style scoped>
    .res-contrast-map {
        width: 100%;
        height: 100vh;
    }

    #resMap {
        position: fixed !important;
        top: 0;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 1;
    }

    /*左上角下拉框*/
    .select-group {
        position: fixed;
        top: 32px;
        left: 32px;
        height: 42px;
        max-width: 905px;
    }

    .select-group /deep/ .el-select {
        width: 164px;
        margin-bottom: 8px;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12)
    }

    .select-group /deep/ .el-input__inner {
        color: rgba(0, 0, 0, 0.85);
        border: 1px solid #fff;
        font-size: 14px;
    }
    .select-group /deep/ .el-select .el-tag{
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 88px;
        margin-top: 6px;
    }

    /*右上角*/
    .radio-group {
        position: fixed;
        top: 32px;
        right: 32px;
        height: 32px;
        line-height: 32px;
        box-sizing: border-box;
        max-width: 905px;
        background: #fff;
        box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        padding: 0px 12px;
    }

    .radio-group /deep/ .el-checkbox__inner {
        border-radius: 50%;
    }

    .radio-group /deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
        color: rgba(0, 0, 0, 0.85);
    }

    .radio-group /deep/ .el-checkbox__inner:after {
        box-sizing: content-box;
        content: "";
        width: 0;
        height: 0;
        border: none;
    }

    .red /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: rgba(255,49,49,0.8);
        border-color: rgba(255,49,49,0.8);
    }
    .blue /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: rgba(49,143,255,0.8);
        border-color: rgba(49,143,255,0.8);
    }


    .orange /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: rgba(255,169,64,0.8);
        border-color: rgba(255,169,64,0.8);
    }
    .green /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: rgba(82,196,26,0.8);
        border-color: rgba(82,196,26,0.8);
    }
    .lakeBlue /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color:rgba(21, 196, 178, 0.8);
        border-color: rgba(21, 196, 178, 0.8);
    }

    .red /deep/ .el-checkbox__inner {
        background-color: rgba(255,49,49,0.2);
        border-color: rgba(255,49,49,0.2);
    }
    .blue /deep/ .el-checkbox__inner {
        background-color: rgba(49,143,255,0.2);
        border-color: rgba(49,143,255,0.2);
    }
    .orange /deep/ .el-checkbox__inner {
        background-color: rgba(255,169,64,0.2);
        border-color: rgba(255,169,64,0.2);
    }
    .green /deep/ .el-checkbox__inner {
        background-color: rgba(82,196,26,0.2);
        border-color: rgba(82,196,26,0.2);
    }
    .lakeBlue /deep/ .el-checkbox__inner {
        background-color: rgba(21, 196, 178, 0.2);
        border-color: rgba(21, 196, 178, 0.2);
    }

    .red /deep/ .el-checkbox__input.is-focus .el-checkbox__inner, .blue /deep/ .el-checkbox__input.is-focus .el-checkbox__inner, .orange /deep/ .el-checkbox__input.is-focus .el-checkbox__inner, .green /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: transparent;
    }
    .red /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner, .blue /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner, .orange /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner, .green /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: #edf2fc;
        border-color: #dcdfe6;
    }
    /*底部右侧控件*/
    .bottom_right_control {
        position: fixed;
        bottom: 16px;
        right: 24px;
        width: 265px;
    }

    .scale_control {
        width: 48%;
        height: 20px;
        background: #fff;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        float: right;
        padding: 6px 0;
    }

    .scale_control li {
        float: left;
        text-align: center;
        color: rgba(0, 0, 0, 0.65);
        font-size: 12px;
        border-right: 1px solid #E8E8E8;
    }

    .scale_control li:last-child {
        border-right: none;
    }

    .li_map_zoom {
        width: 44%;
        height: 20px;
    }

    .zoom_scale {
        height: 8px;
        margin: 0 10%;
        border-bottom: 1px solid rgba(0, 0, 0, 0.5);
        border-left: 1px solid rgba(0, 0, 0, 0.5);
        border-right: 1px solid rgba(0, 0, 0, 0.5);
        position: relative;
        top: -4px;
    }

    .scale_control .li_btn {
        width: 26%;
        line-height: 20px;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        cursor: pointer;
    }
    .radio-group /deep/  .el-checkbox__input.is-disabled+span.el-checkbox__label{
        color: #c0c4cc !important;
    }

</style>
