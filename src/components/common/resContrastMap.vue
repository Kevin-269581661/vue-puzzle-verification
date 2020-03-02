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
        <div class="left-top select-group">
            <!--城市-->
            <el-select v-model="selectCity" size="small" placeholder="请选择城市" @change="filterCity" filterable>
                <el-option v-for="item in cityList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
            <!--区域-->
            <el-select v-model="selectArea" size="small" placeholder="请选择区域" collapse-tags multiple clearable
                       @visible-change="filterArea">
                <el-option v-for="item in areaList" :key="item.rID" :label="item.rName" :value="item.rID"></el-option>
            </el-select>
            <!--资源类型-->
            <el-select v-model="selectResType" size="small" placeholder="请选择" @change="filterResType">
                <el-option v-for="item in resTypeList" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </div>
        <!--右上角选择-->
        <div class="right-top radio-group">
            <el-checkbox-group v-model="companyCheckbox">
                <el-checkbox
                    v-if="item.count>0"
                    v-for="item in companyList"
                    :label="item.value"
                    :key="item.value"
                    :class="[item.color]"
                    @change="chooseCompany($event,item.value)"
                    :disabled='flagSwitch&&flagCompany!==item.value&&item.value!==1'>
                    {{item.name}}({{item.count}})
                </el-checkbox>
            </el-checkbox-group>
        </div>
        <!--左下角重叠分析-->
        <div class="left-bottom">
            <div class="analyze-btn" @click="openAnalyze">
                重叠分析
                <span class="active_arrow" :class="showAnalyzeList ? '' : 'active_arrow_hide'">
                    <i class="el-icon-d-arrow-left"></i>
                </span>
            </div>
            <div class="analyze-content" v-show="showAnalyzeList">
                <div class="content-wrap">
                    <div class="content-top">
                        <!--重叠标记开关-->
                        <div class="flag-switch">
                            <div class="switch">
                                <span>重叠标记</span>
                                <el-switch
                                    @change="changeSwitch"
                                    v-model="flagSwitch"
                                    active-color="#9254DE"
                                    inactive-color="#e8e8e8">
                                </el-switch>
                            </div>
                            <div class="option">
                                <el-select @change="selectAnalyzeCompany" v-model="flagCompany" placeholder="请选择">
                                    <el-option
                                        v-for="item in contendList"
                                        :key="item.value"
                                        :label="item.name"
                                        :value="item.value"
                                        v-if="item.count>0"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                        <!--数据-->
                        <ul class="content-top-data">
                            <li>
                                <span>{{overlap.count}}</span>
                                <span>重叠小区(个)</span>
                            </li>
                            <li>
                                <span>{{overlap.rate}}%</span>
                                <span>重叠率</span>
                            </li>
                        </ul>
                    </div>
                    <div class="content-list">
                        <div class="community-list" v-for="(item,index) in communityList">
                            <h5>{{item.comName}}</h5>
                            <p>{{item.comAddress}}</p>
                            <div class="info">
                                <span>{{item.districtName}}</span>
                                <span>{{item.hNum}}户</span>
                                <span>¥{{item.hPrice/100 || 0}}/m²</span>
                                <span>{{item.chDay}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="content-bottom">
                        <el-dropdown trigger="click">
                            <el-button type="plain">
                                导出<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item @click.native.prevent="exportFun(3)" command="3">多方重叠分析
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="exportFun(1)" command="1">重叠小区
                                </el-dropdown-item>
                                <el-dropdown-item @click.native.prevent="exportFun(2)" command="2">排除重叠小区
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </div>
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
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from "../../commonFun/sessFun.js";
    import timeFormat from "../../commonFun/timeFormat";

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
                KJpointCollection: [],
                QLResData: [],
                FZResData: [],
                XCResData: [],
                XYMResData: [],
                KJResData: [],
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
                contendList: [],//竞媒
                companyCheckbox: [1, 2],
                showAnalyzeList: false,//是否展开重叠分析
                flagSwitch: false,//重叠标记开关
                flagCompany: 2,//重叠分析竞媒
                overlap: {
                    count: 0,
                    rate: 0
                },
                overlapData: [],//重复的点数据
                overlapCollection: [],//浮标
                communityList: [{
                    resName: '达利花园',
                    address: '宝安区后端利达路3号',
                    area: '宝安区',
                    houseNum: '500',
                    price: '50000',
                    years: '2018年'
                }]

            }
        },
        methods: {
            // 时间格式规范预锁
            formatTime(val) {
                return dateFormat.toDate(val, '/');
            },
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
                if (this.companyCheckbox.length > 0) {
                    for (let data of this.companyCheckbox) {
                        // 设置地图显示的城市 此项是必须设置的
                        if (data != 1) {
                            this.getData(data)
                        } else {
                            setTimeout(() => {
                                that.getData(data)
                            }, 300)
                        }
                    }
                }
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
                let that = this
                let city = areaPackage.CodeToText(this.selectCity)
                this.resMap.setCurrentCity(city);
                // 初始化地图,设置中心点坐标和地图级别
                this.resMap.centerAndZoom(city, 11);
                this.clearMarkers()
                this.selectArea = [];
                this.getArea(this.selectCity)
                // console.log(this.companyCheckbox);
                if (this.flagSwitch) {
                    this.getOverlapData(this.flagCompany)
                    this.companyCheckbox = [1, this.flagCompany]
                } else {
                    if (this.companyCheckbox.length > 0) {
                        for (let data of this.companyCheckbox) {
                            if (data != 1) {
                                this.getData(data)
                            } else {
                                setTimeout(() => {
                                    that.getData(data)
                                }, 300)
                            }
                        }
                    }
                }
            },
            // 选择区域
            filterArea(e) {
               if(!e){
                   //下拉框关闭时请求
                   let that = this
                   // console.log('区域', this.selectArea)
                   this.clearMarkers()
                   // this.getData()
                   if (this.flagSwitch) {
                       setTimeout(() => {
                           that.getOverlapData(this.flagCompany)
                       }, 500)

                       this.companyCheckbox = [1, this.flagCompany]
                   } else {
                       if (this.companyCheckbox.length > 0) {
                           for (let data of this.companyCheckbox) {
                               if (data != 1) {
                                   this.getData(data)
                               } else {
                                   setTimeout(() => {
                                       that.getData(data)
                                   }, 300)
                               }
                           }
                       }
                   }
               }

            },
            //清空marker
            clearMarkers() {
                let promise = new Promise((resolve, reject) => {
                    this.resMap.removeOverlay(this.QLpointCollection)
                    this.resMap.removeOverlay(this.FZpointCollection)
                    this.resMap.removeOverlay(this.XCpointCollection)
                    this.resMap.removeOverlay(this.XYMpointCollection)
                    this.resMap.removeOverlay(this.KJpointCollection)
                    this.resMap.removeOverlay(this.overlapCollection)
                    resolve();
                });
                return promise;

            },
            //选择资源类型
            filterResType() {
                let that = this
                this.clearMarkers()
                if (this.flagSwitch) {
                    this.getOverlapData(this.flagCompany)
                    this.companyCheckbox = [1, this.flagCompany]
                } else {
                    if (this.companyCheckbox.length > 0) {
                        for (let data of this.companyCheckbox) {
                            if (data != 1) {
                                this.getData(data)
                            } else {
                                setTimeout(() => {
                                    that.getData(data)
                                }, 300)
                            }
                        }
                    }
                }
            },
            //选择公司
            chooseCompany(e, id) {
                console.log(e, id, this.companyCheckbox);
                let that = this
                if (e) {
                    if (id !== 1) {
                        this.clearMarkers()
                        //是否覆盖分析
                        if (this.flagSwitch) {
                            if (id == 2) {
                                this.addMarker(this.FZResData, '#318FFF', id)
                            } else if (id == 3) {
                                this.addMarker(this.XCResData, '#ffa940', id)
                            } else if (id == 4) {
                                this.addMarker(this.XYMResData, '#52c41a', id)
                            } else if (id == 5) {
                                this.addMarker(this.KJResData, '#15C4B2', id)
                            }
                            if(this.companyCheckbox.includes(1)){
                                this.addMarker(this.QLResData, '#FF3131', 1)
                            }

                            this.addMarker(this.overlapData, '#9254DE', 99)
                        } else {
                            if (this.companyCheckbox.length > 0) {
                                for (let data of this.companyCheckbox) {
                                    if (data != 1) {
                                        this.getData(data)
                                    } else {
                                        setTimeout(() => {
                                            that.getData(data)
                                        }, 300)
                                    }
                                }
                            }
                        }

                    } else {
                        this.resMap.removeOverlay(this.overlapCollection)
                        if (this.flagSwitch) {
                            this.addMarker(this.QLResData, '#FF3131', id)
                            this.addMarker(this.overlapData, '#9254DE', 99)
                        } else {
                            this.addMarker(this.QLResData, '#FF3131', id)
                        }
                    }

                } else {
                    if (id == 1) {
                        this.resMap.removeOverlay(this.QLpointCollection)
                    } else if (id == 2) {
                        this.resMap.removeOverlay(this.FZpointCollection)
                    } else if (id == 3) {
                        this.resMap.removeOverlay(this.XCpointCollection)
                    } else if (id == 4) {
                        this.resMap.removeOverlay(this.XYMpointCollection)
                    } else if (id == 5) {
                        this.resMap.removeOverlay(this.KJpointCollection)
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
                        } else if (companyId == 4) {
                            this.XYMResData = result
                            this.addMarker(result, '#52c41a', companyId)
                        } else if (companyId == 5) {
                            this.KJResData = result
                            this.addMarker(result, '#15C4B2', companyId)
                        }
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
                this.getCommunityCount(companyId)
            },
            //获取点位数量数据
            getCommunityCount(companyId) {
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
                        this.contendList = res.data.data.slice(1)

                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            },
            //添加标注
            addMarker(arr, color, companyId) {
                if (document.createElement('canvas').getContext) {  // 判断当前浏览器是否支持绘制海量点
                    let points = [];  // 添加海量点数据
                    for (let data of arr) {
                        points.push(new window.BMap.Point(data.lng, data.lat));
                    }
                    let options = {
                        size: BMAP_POINT_SIZE_SMALL,
                        shape: BMAP_POINT_SHAPE_CIRCLE,
                        color: color
                    }
                    if (companyId == 1) {
                        this.QLpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.QLpointCollection);  // 添加Overlay
                    } else if (companyId == 2) {
                        this.FZpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.FZpointCollection);  // 添加Overlay
                    } else if (companyId == 3) {
                        this.XCpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.XCpointCollection);  // 添加Overlay
                    } else if (companyId == 4) {
                        this.XYMpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.XYMpointCollection);  // 添加Overlay
                    } else if (companyId == 5) {
                        this.KJpointCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.KJpointCollection);  // 添加Overlay
                    } else {
                        //覆盖点
                        this.overlapCollection = new BMap.PointCollection(points, options);  // 初始化PointCollection
                        this.resMap.addOverlay(this.overlapCollection);  // 添加Overlay
                    }

                    this.mapLoading = false
                } else {
                    alert('请在chrome、safari、IE8+以上浏览器查看本示例');
                }

            },
            // 获取权限城市
            getCity() {
                api.postApi(this.apiVar.mapApi + 'map/resCompare/authorCity').then(res => {
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
                        this.$message.warning(res.data.MSG);
                    }
                });
            },
            //区域列表
            getArea(id) {
                this.areaList = areaPackage.findArea(id)
            },
            //点击重叠分析
            openAnalyze() {
                this.companyCheckbox = [1, this.flagCompany]
                let that = this
                this.showAnalyzeList = !this.showAnalyzeList
                if (this.showAnalyzeList && !this.flagSwitch) {
                    this.clearMarkers()
                    this.flagSwitch = true
                    this.changeSwitch()
                    // this.getOverlapData(this.flagCompany)
                }


            },
            //重叠标记开关
            changeSwitch() {
                let that = this
                this.clearMarkers()
                if (this.flagSwitch) {
                    //打开
                    this.getOverlapData(this.flagCompany)
                    this.companyCheckbox = [1, this.flagCompany]
                    // this.addMarker(this.overlapData, '#9254DE', 99)
                } else {
                    //关闭
                    this.resMap.removeOverlay(this.overlapCollection)
                    if (this.companyCheckbox.length > 0) {
                        for (let data of this.companyCheckbox) {
                            if (data != 1) {
                                this.getData(data)
                            } else {
                                setTimeout(() => {
                                    that.getData(data)
                                }, 300)
                            }
                        }
                    }
                }
            },
            //选择分析竞媒
            selectAnalyzeCompany() {
                // console.log(this.flagCompany);
                let that = this
                this.companyCheckbox = [1, this.flagCompany]
                if (this.flagCompany !== 1) {
                    this.getOverlapData(this.flagCompany)
                } else {
                    this.getOverlapData(this.flagCompany)
                }
            },
            //重叠分析数据
            getOverlapData(companyId) {
                let that = this
                // console.log('公司id',companyId);
                this.clearMarkers()
                that.mapLoading = true
                let info = {
                    cityCode: that.selectCity,
                    company: companyId
                }
                if (that.selectArea.length > 0) {
                    info.districtCodes = that.selectArea.join(',')
                }
                if (that.selectResType != 0) {
                    info.resType = that.selectResType
                }
                if (that.flagSwitch) {
                    api.getApi(that.apiVar.mapApi + '/resCompare/stackAnalyze', info).then(res => {
                        console.log('覆盖分析数据', res.data)
                        if (res.data.SysCode == 200200) {
                            let qadnResList = res.data.data.qadnResList //亲邻
                            let competitionList = res.data.data.competitionList  //竞媒
                            let overlapList = res.data.data.overlapList //重叠
                            //竞媒打点
                            if (companyId == 2) {
                                that.FZResData = competitionList
                                that.addMarker(competitionList, '#318FFF', companyId)
                            } else if (companyId == 3) {
                                that.XCResData = competitionList
                                that.addMarker(competitionList, '#ffa940', companyId)
                            } else if (companyId == 4) {
                                that.XYMResData = competitionList
                                that.addMarker(competitionList, '#52c41a', companyId)
                            } else if (companyId == 5) {
                                that.KJResData = competitionList
                                that.addMarker(competitionList, '#15C4B2', companyId)
                            }

                            //亲邻打点
                            that.QLResData = qadnResList
                            that.addMarker(qadnResList, '#FF3131', 1)
                            //覆盖点打点
                            that.overlapData = overlapList
                            that.addMarker(overlapList, '#9254DE', 99)
                            //重叠小区和重重复率
                            let rate = overlapList.length / (overlapList.length + qadnResList.length)
                            let obj = {
                                count: overlapList.length,
                                rate: (rate * 100).toFixed(2)
                            }
                            that.overlap = obj
                            //覆盖小区列表
                            that.communityList = overlapList

                        } else {
                            that.$message.warning(res.data.MSG)
                        }
                    })
                }
                that.getCommunityCount(companyId)
            },
            //导出
            exportFun(exportType) {
                let params = {
                    cityCode: this.selectCity,
                    company: this.flagCompany,
                    exportType: exportType
                }
                if (this.selectArea.length > 0) {
                    params.districtCodes = this.selectArea.join(',')
                }
                if (this.selectResType != 0) {
                    params.resType = this.selectResType
                }
                api.getApi_file(this.apiVar.mapApi + '/resCompare/exportStackAnalyze', params).then(res => {
                    console.log('导出', res.headers)
                    if (res.data.SysCode === 100302 || res.data.MSG === "登陆超时") {
                        sessFun.loginTimeout()
                    } else {
                        let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                        let downloadElement = document.createElement('a');
                        let href = window.URL.createObjectURL(blob); //创建下载的链接
                        downloadElement.href = href;
                        downloadElement.download = '资源对比叠加分析' + this.formatTime(new Date()) + '.xlsx'; //下载后文件名
                        document.body.appendChild(downloadElement);
                        downloadElement.click(); //点击下载
                        document.body.removeChild(downloadElement); //下载完成移除元素
                        window.URL.revokeObjectURL(href); //释放掉blob对象
                    }
                })
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

    /*左下角重叠分析*/
    .left-bottom {
        position: fixed;
        bottom: 16px;
        left: 16px;
    }

    .analyze-btn {
        width: 288px;
        height: 32px;
        line-height: 32px;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.12);
        border-radius: 4px;
        color: rgba(0, 0, 0, 0.85);
        font-size: 14px;
        text-align: center;
        cursor: pointer;
    }

    .active_arrow {
        width: 50px;
        text-align: center;
        color: rgba(0, 0, 0, 0.85);
        font-size: 12px;
    }

    .active_arrow .el-icon-d-arrow-left {
        transform: rotate(-90deg);
    }

    .active_arrow_hide .el-icon-d-arrow-left {
        transform: rotate(90deg);
    }

    .analyze-content {
        width: 288px;
    }

    .content-wrap {
        border-top: 1px solid #E8E8E8;
        border-bottom: 1px solid #E8E8E8;
        box-sizing: border-box;
        background: #fff;
    }

    .content-top {
        padding: 0 16px;
        margin-top: 16px;
    }

    .flag-switch {
        border-radius: 4px;
        border: 1px solid rgba(232, 232, 232, 1);
        width: 256px;
        height: 112px;
        padding: 15px 20px;
        box-sizing: border-box;
        margin-bottom: 15px;
    }

    .switch {
        width: 100%;
        height: 32px;
        background: rgba(255, 255, 255, 1);
        border-radius: 4px;
        border: 1px solid rgba(217, 217, 217, 1);
        display: flex;;
        justify-content: space-between;
        align-items: center;
        padding: 0 8px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
        box-sizing: border-box;
        margin-bottom: 15px;
    }

    .option {
        width: 100%;
        height: 32px;
    }

    .option /deep/ .el-input--suffix .el-input__inner, .option /deep/ .el-select {
        width: 100%;
        height: 32px;
    }

    .content-top-data {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
    }

    .content-top-data li {
        width: 120px;
        height: 69px;
        background: rgba(247, 247, 247, 1);
        border-radius: 4px;
        border: 1px solid rgba(232, 232, 232, 1);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .content-top-data li span:first-child {
        color: rgba(0, 0, 0, 0.85);
        font-size: 24px;
    }

    .content-top-data li span:last-child {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
    }

    .community-list {
        border-top: 1px solid #E8E8E8;
        padding: 16px;
        box-sizing: border-box;

    }

    .content-list {
        max-height: 259px;
        overflow-y: scroll;
        overflow-x: hidden !important;
    }

    /*滚动条*/

    .content-list::-webkit-scrollbar {
        width: 4px;
        height: 8px;
        background: #e8e8e8;
    }

    .content-list::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 0px;
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }

    .content-list::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
        border-radius: 0;
        background: #fafafa;
    }

    .community-list h5 {
        color: rgba(0, 0, 0, 0.85);
        font-size: 18px;
        font-weight: bold;
    }

    .community-list p {
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        margin-top: 4px;
        margin-bottom: 4px;
    }

    .info span {
        background: rgba(0, 0, 0, 0.06);
        border-radius: 2px;
        padding: 2px 6px;
        color: rgba(0, 0, 0, 0.35);
        font-size: 12px;
    }

    .content-wrap .content-bottom {
        text-align: center;
        border-top: 1px solid #E8E8E8;
        padding: 8px 16px;
        box-sizing: border-box;
    }

    .content-bottom button {
        width: 74px;
        height: 32px;
    }

    /*左上角下拉框*/
    .select-group {
        position: fixed;
        top: 16px;
        left: 16px;
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

    .select-group /deep/ .el-select .el-tag {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 88px;
        margin-top: 6px;
    }

    /*右上角*/
    .radio-group {
        position: fixed;
        top: 16px;
        right: 16px;
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

    .red /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner, .analyze.red /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: rgba(255, 49, 49, 0.8);
        border-color: rgba(255, 49, 49, 0.8);
    }

    .blue /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner, .analyze.blue /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: rgba(49, 143, 255, 0.8);
        border-color: rgba(49, 143, 255, 0.8);
    }

    .orange /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner, .analyze.orange /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: rgba(255, 169, 64, 0.8);
        border-color: rgba(255, 169, 64, 0.8);
    }

    .green /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner, .analyze.green /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: rgba(82, 196, 26, 0.8);
        border-color: rgba(82, 196, 26, 0.8);
    }

    .lakeBlue /deep/ .el-checkbox__input.is-checked .el-checkbox__inner, .red /deep/ .el-checkbox__input.is-indeterminate .el-checkbox__inner, .analyze.lakeBlue /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: rgba(21, 196, 178, 0.8);
        border-color: rgba(21, 196, 178, 0.8);
    }

    .red /deep/ .el-checkbox__inner {
        background-color: rgba(255, 49, 49, 0.2);
        border-color: rgba(255, 49, 49, 0.2);
    }

    .blue /deep/ .el-checkbox__inner {
        background-color: rgba(49, 143, 255, 0.2);
        border-color: rgba(49, 143, 255, 0.2);
    }

    .orange /deep/ .el-checkbox__inner {
        background-color: rgba(255, 169, 64, 0.2);
        border-color: rgba(255, 169, 64, 0.2);
    }

    .green /deep/ .el-checkbox__inner {
        background-color: rgba(82, 196, 26, 0.2);
        border-color: rgba(82, 196, 26, 0.2);
    }

    .lakeBlue /deep/ .el-checkbox__inner {
        background-color: rgba(21, 196, 178, 0.2);
        border-color: rgba(21, 196, 178, 0.2);
    }

    .red /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
        color: rgba(0, 0, 0, 0.65);
    }

    .red /deep/ .el-checkbox__input.is-focus .el-checkbox__inner, .blue /deep/ .el-checkbox__input.is-focus .el-checkbox__inner, .orange /deep/ .el-checkbox__input.is-focus .el-checkbox__inner, .green /deep/ .el-checkbox__input.is-focus .el-checkbox__inner, .lakeBlue /deep/ .el-checkbox__input.is-focus .el-checkbox__inner {
        border-color: transparent;
    }

    .red /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner, .blue /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner, .orange /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner, .lakeBlue /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner, .green /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
        background-color: #edf2fc;
        border-color: #dcdfe6;
    }

    /*底部右侧控件*/
    .bottom_right_control {
        position: fixed;
        bottom: 16px;
        right: 16px;
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

    .radio-group /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
        color: #c0c4cc !important;
    }

    .analyze /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
        color: rgba(0, 0, 0, 0.85) !important;
    }

</style>
