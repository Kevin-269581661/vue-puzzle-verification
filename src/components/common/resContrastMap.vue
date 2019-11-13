<template>
    <div class="res-contrast-map">
        <!--引入远程JS-->
        <remote-js src="https://api.map.baidu.com/library/GeoUtils/1.2/src/GeoUtils_min.js"></remote-js>
        <!--地图标签-->
        <div v-loading="mapLoading"
             element-loading-text="玩命加载中.."
             element-loading-spinner="el-icon-loading"
             id="resMap" ref="resMap">
        </div>
        <!--左上角下拉框-->
        <div class="select-group">
            <!--城市-->
            <el-select v-model="selectCity" size="small" placeholder="请选择城市" @change="filterCity">
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
            <el-checkbox-group v-model="companyCheckbox" @change="chooseCompany">
                <el-checkbox v-for="item in companyList" :label="item.value" :key="item.value" :class="item.class">
                    {{item.name}}({{item.num}})
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
                resMarkers: [],
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
                selectArea: '',
                selectResType: 0,
                companyList: [
                    {value: 1, name: '亲邻', num: 2809, class: 'red'},
                    {value: 2, name: '分众', num: 2809, class: 'blue'},
                    {value: 3, name: '新潮', num: 2809, class: 'orange'},
                    {value: 4, name: '祥云门', num: 2809, class: 'green'},
                ],
                companyCheckbox: [1]
            }
        },
        methods: {
            // 初始化地图
            initMap() {
                let that = this
                console.log('初始化地图----')
                // 创建Map实例
                this.resMap = new BMap.Map("resMap", {enableMapClick: false});
                console.log('resMap', this.resMap)
                // 设置地图显示的城市 此项是必须设置的
                // this.resMap.setCurrentCity(this.$route.query.city);
                this.resMap.setCurrentCity('广州市');
                // 初始化地图,设置中心点坐标和地图级别
                // this.resMap.centerAndZoom(this.$route.query.city, 11);
                this.resMap.centerAndZoom('广州市', 11);
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
                    console.log('监听点击地图---', e.point)
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
                this.mapLoading = false
            },
            // 判断点是否在视野内
            pointInBounds() {
                console.log('判断点是否在视野内------', this.resMap.getZoom())
                if (!this.isMouseSearch && !this.isOnlineSearch && !this.isMultiPoint && this.resMap.getZoom() >= 16) {
                    let bound = this.resMap.getBounds();// 地图可视区域
                    for (let key of this.resMarkers) {
                        if (bound.containsPoint(key.point) == true && !key.isVisible()) {
                            key.show()
                        }
                    }
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
                console.log('城市', this.selectCity)
            },
            // 选择区域
            filterArea() {
                console.log('区域', this.selectArea)

            },
            //选择资源类型
            filterResType() {
                console.log('类型', this.selectResType)
            },
            //选择公司
            chooseCompany() {
                console.log(this.companyCheckbox);
            }
        },
        mounted() {
            window.onload = this.initMap()
        }
    }
</script>

<style scoped>
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

    .red /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner{
        background-color: #FF3131;
        border-color: #FF3131;
    }

    .blue /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #318FFF;
        border-color: #318FFF;
    }

    .orange /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner  {
        background-color: #ffa940;
        border-color: #ffa940;
    }

    .green /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner {
        background-color: #13c2c2;
        border-color: #13c2c2;
    }
    .red /deep/ .el-checkbox__input.is-focus .el-checkbox__inner, .blue /deep/ .el-checkbox__input.is-focus .el-checkbox__inner ,.orange /deep/ .el-checkbox__input.is-focus .el-checkbox__inner,.green /deep/ .el-checkbox__input.is-focus .el-checkbox__inner{
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

</style>
