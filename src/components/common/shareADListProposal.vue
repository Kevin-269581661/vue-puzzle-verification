<template>
    <div>
        <!-- <div v-if="isPC"> -->
        <div>
            <div>
                <header class="share_index_header">
                    <div class="logo_img">
                        <img src="../../assets/images/logo.png" alt="qinlink">
                    </div>
                </header>
            </div>
            <div class="content">
                <div class="content_head">
                    <p class="title">{{FAData.apName}}</p>
                    <p class="comment">公司: {{FAData.cName}}</p>
                    <p class="comment">品牌: {{FAData.cBand}}</p>
                </div>
                <div class="content_main">
                    <el-tabs v-model="activeName" @tab-click="switchTabs">
                        <el-tab-pane label="列表模式" name="first">
                            <div class="search-row">
                                <el-input placeholder="请输入资源名称" v-model="filterOptions.searchKey" clearable @clear="filterFun('')" @keyup.enter.native="keyupFun($event)">
                                    <el-button style="background: #1890ffff; color: #fff; width: 88px;" slot="append" @click="filterFun(filterOptions.searchKey)">搜  索</el-button>
                                </el-input>
                            </div>
                            <div class="dw-panel">
                                <dl>
                                    <dt>城市：</dt>
                                    <dd
                                        v-for="(item, index) in filterOptions.cityList"
                                        :key="index"
                                        :class="item.selected ? 'active' : ''"
                                        @click="changeCity(item)"
                                    >
                                        {{ item.rName }}
                                    </dd>
                                </dl>
                                <dl>
                                    <dt>区域：</dt>
                                    <dd
                                        v-for="(item, index) in filterOptions.districtList"
                                        :key="index"
                                        :class="item.selected ? 'active' : ''"
                                        @click="changeCity(item)"
                                    >
                                    {{ item.rName }}
                                    </dd>
                                </dl>
                                <dl style="border: none;">
                                    <dt>类型：</dt>
                                    <dd v-for="(item, index) in filterOptions.ctypeList"
                                        :key="index"
                                        :class="item.selected ? 'active' : ''"
                                        @click="changeCity(item)"
                                    >
                                        {{ item.name }}
                                    </dd>
                                </dl>
                            </div>
                            <div class="car-title">
                                <i class="el-icon-info" style="color: #1890FF;"></i>
                                <h4 v-if="reading">
                                    可选择<span>{{resMediaAdsNum.adsTotalNum}}</span>面（共<span>{{resMediaAdsNum.resTotalNum}}</span>个楼盘），
                                    已选:<span>{{resMediaAdsNum.planAdsTotal}}</span>面（共<span>{{resMediaAdsNum.selectionTotal}}</span>个楼盘）
                                </h4>
                                <h4 v-else>
                                    可选择<span>{{resMediaAdsNum.adsTotalNum}}</span>面（共<span>{{resMediaAdsNum.resTotalNum}}</span>个楼盘）
                                </h4>
                            </div>
                            <el-table
                                row-key="adProposalResID"
                                v-loading="loading"
                                element-loading-text="玩命加载中.."
                                element-loading-spinner="el-icon-loading"
                                @select="handleSelect"
                                @select-all="handleSelectAll"
                                @selection-change = "selectionChange"
                                ref="multipleTable"
                                border
                                :data="currentPageTableData"
                                style="width: 100%"
                                height="456px"
                                class="shareTable">
                                <el-table-column
                                    v-if="reading"
                                    width="54px"
                                    type="selection"
                                    align="center"
                                    :reserve-selection="true">
                                </el-table-column>
                                <el-table-column
                                    label="资源名称"
                                    show-overflow-tooltip
                                    min-width="140">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.resName || '--' }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="城市"
                                    show-overflow-tooltip
                                    min-width="100">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.cityName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    label="区域"
                                    show-overflow-tooltip
                                    min-width="100">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.districtName}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="cType"
                                    label="楼盘类型"
                                    min-width="85">
                                </el-table-column>
                                <el-table-column
                                    prop="hPrice"
                                    sortable
                                    label="楼盘价格"
                                    min-width="100"
                                    align="right">
                                    <template slot-scope="scope">
                                        <!-- &yen; -->
                                        <span>{{scope.row.hPrice | moneyFormat("¥", 0)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="fNum"
                                    sortable
                                    label="楼栋数量"
                                    min-width="100"
                                    align="right">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.fNum | moneyFormat("", 0)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="hNum"
                                    sortable
                                    label="住户数量"
                                    min-width="100"
                                    align="right">
                                    <template slot-scope="scope">
                                        <span>{{scope.row.hNum | moneyFormat("", 0)}}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="chDay"
                                    sortable
                                    label="建成年份"
                                    min-width="100">
                                </el-table-column>
                                <el-table-column
                                    prop="schedule"
                                    label="排期"
                                    min-width="200"
                                    align="left"
                                    show-overflow-tooltip>
                                </el-table-column>
                                <el-table-column
                                    prop="actualMediaCnt"
                                    label="媒体数量(门)"
                                    min-width="120"
                                    align="right">
                                </el-table-column>
                                <el-table-column
                                    prop="actualAdsCnt"
                                    label="可投数量(面)"
                                    min-width="120"
                                    align="right">
                                </el-table-column>
                                <el-table-column
                                    label="计划投放数(面)"
                                    min-width="130"
                                    align="left"
                                    fixed="right"
                                >
                                    <template slot-scope="scope">
                                        <el-input-number style="width: 80px" :step-strictly="true" size="mini" :min="0" :max="scope.row.actualAdsCnt||0" v-model="scope.row.planAdsCnt" @change="updatePlanAdsCnt(scope.row)"></el-input-number>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="ad_pagination">
                                <el-pagination
                                    background
                                    layout="total, sizes, prev, pager, next, jumper"
                                    @current-change="changePage"
                                    @size-change="sizeChange"
                                    :page-sizes="[10, 20, 50, 100, 500]"
                                    :current-page.sync="pageNum"
                                    :page-size="pageSize"
                                    :total="total"
                                >
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="地图模式" name="second">
                            <share-ad-map :mapADList="showResList" :mapCity="activeCity" :tableSelects="tableSelects"
                                          :activeName="activeName" :reading="reading"
                                          @mapSelectRes="getMapSelect"></share-ad-map>
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <div style="text-align: center;margin: 15px 0" v-show="activeName === 'first'">
                    <el-button plain style="border-radius: 4px;" @click="clearAllSelected" v-show="reading">
                        清 空
                    </el-button>
                    <el-button type="primary" style="border-radius: 4px;" @click="submitFun" v-show="reading">
                        完成选点
                    </el-button>
                </div>
                <!--尾部-->
                <div class="ad_index_footer clearfix">
                    <p><img src="../../assets/images/home_icon.png" alt="">
                        Copyright &copy;{{newDate}} 亲邻科技线上产品部
                    </p>
                </div>
            </div>
        </div>
        <!-- <div v-else>
            <share-mobile></share-mobile>
        </div> -->
    </div>
</template>

<script>
    import api from '../../api/api'
    // 时间格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import shareMobile from "./shareADList_mobile"
    import shareAdMap from "./map/shareHelpADMap"

    export default {
        name: "shareADListProposal",
        components: {
            shareMobile: shareMobile,
            shareAdMap: shareAdMap
        },
        data() {
            return {
                pageNum: 1, // 页码
                totalPage: 1, // 总页数
                pageSize: 20, //每页条数
                total: 0, // 查询总结果数

                newDate: new Date().getFullYear(),
                isPC: true,
                loading: false,               // 数据加载
                activeName: 'first',
                ADList: [],             // 接口总数据
                showResList: [],         // 显示的table数据
                checkADList: [],        // 选择了的点位面
                resMediaAdsNum:{adsTotalNum: 0, resTotalNum: 0, selectionTotal: 0, planAdsTotal: 0},
                urlParams: '',          // url地址
                apID: '',               // 方案id
                aiCode: '',             // 获取密钥
                FAData: {},
                selectedResSet: null, // 记录客户上次提交的所选小区，关键字：adProposalResID
                selectionMap: {},     // 记录客户当前操作所选小区和计划投放面数
                selectionResList: [],
                reading: true,          // 编辑列表
                webLoading: '',
                iframeSrc: '',          // 无忧地图地址
                activeCity: {},      // 当前城市
                selectNum: 1,       // 所选吗，面数
                selectLevelNum: {A: 0, B: 0, C: 0},
                activeSelectNum: 0,     // 当前城市最大可选面数
                // 地图选中的资源
                mapResSet: [],
                // 是否变动
                isChangeMapSelect: false,
                tableSelects: [],
                filterOptions: {
                    searchKey: '',
                    searchedKey: '',
                    cityList: [],
                    districtList: [],
                    ctypeList: []
                },
                timer: null
            }
        },
        computed: {
            currentPageTableData() {
                this.total = this.showResList.length;
                return this.showResList.slice((this.pageNum-1)*this.pageSize, this.pageNum*this.pageSize);
            }
        },
        created() {
            // this.browserRedirect()
        },
        mounted() {
            if (this.isPC === true) {
                this.webLoading = this.$loading({
                    lock: true,
                    text: '正在加载...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                this.urlParams = location.search
                this.apID = (this.urlParams.split("=")[1]).split('&')[0]
                this.aiCode = this.urlParams.split("=")[2]
                console.log('urlParams', this.urlParams, 'apid', this.apID)
                this.getFAInfo()    // 获取方案信息
                this.getSelection()
            } else {
                // this.Msg = {apid:this.apid,aicode:this.aicode}
            }
        },
        methods: {
            // 判断是移动端还是PC端
            /* browserRedirect() {
                let userAgentInfo = navigator.userAgent;
                let Agents = ["Android", "iPhone",
                    "SymbianOS", "Windows Phone",
                    "iPad", "iPod"];
                console.log('userAgentInfo', userAgentInfo)
                for (let v = 0; v < Agents.length; v++) {
                    if (userAgentInfo.indexOf(Agents[v]) > 0) {
                        console.log('移动端页面')
                        this.isPC = false
                        return
                    }
                }
                console.log('PC端页面')
            }, */
            // 切换tabs
            switchTabs(tab, event) {
                console.log('---',tab.name, this.activeName)
                if (tab.name === 'second') {
                    let cityListLength = this.filterOptions.cityList.length
                    let citySelected = false
                    for(let i = 0; i < cityListLength; i++) {
                        if(this.filterOptions.cityList[i].selected) {
                            let {rID, rName} = this.filterOptions.cityList[i]
                            this.activeCity = {
                                value: rID,
                                label: rName
                            }
                            citySelected = true
                            break
                        }
                    }
                    if(cityListLength > 0 && !citySelected) {
                        let {rID, rName} = this.filterOptions.cityList[0]
                        this.activeCity = {
                            value: rID,
                            label: rName
                        }
                    }
                    if(this.activeCity.value) {
                        this.listToMap()
                    } else {
                        this.$message({
                            message: "获取城市失败！",
                            type: 'warning'
                        })
                    }
                } else {
                    // 无忧地图选择点位同步到列表
                    if (this.isChangeMapSelect) {
                        this.mapToList()
                    }
                }
            },
            changePage(val) {
                this.pageNum = val
            },
            sizeChange(val) {
                this.pageSize = val
            },
            updatePlanAdsCnt(row) {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    if(row.planAdsCnt===null||row.planAdsCnt===undefined) {
                        row.planAdsCnt = 0
                    }
                    if(row.planAdsCnt==0) {
                        this.$refs.multipleTable.toggleRowSelection(row, false)
                    } else if(row.planAdsCnt>0) {
                        this.$refs.multipleTable.toggleRowSelection(row, true)
                    }
                    this.$nextTick(()=>{
                        this.computeNumber()
                    })
                }, 600);
            },
            getFAInfo() {
                api.getApi('/addsp/proposal/share/getFangInfo', {aiCode: this.aiCode}).then(res => {
                    console.log('GetShareADS', res)
                    if (res.data.SysCode == 200200) {
                        let shareADSData = res.data.data
                        this.FAData = {
                            apName: shareADSData.apName,
                            cName: shareADSData.cName, 
                            cBand: shareADSData.bTitle
                        }
                        this.selectedResSet = new Set(shareADSData.selectList||[])
                        // 获取小区列表
                        this.getResList({apID: this.apID}, 'onload')
                    } else {
                        this.webLoading.close()
                        this.reading = false;
                        this.$message({
                            message: res.data.MSG,
                            type: 'warning'
                        })
                    }
                })
            },
            //切换城市
            changeCity(item){
                this.$set(item, 'selected', !item.selected)
                this.filterFun()
            },
            // 条件查询小区列表
            filterFun(searchKey) {
                clearTimeout(this.timer)
                this.timer = setTimeout(() => {
                    if(searchKey!==undefined && searchKey!==null) {
                        this.filterOptions.searchedKey = searchKey
                    }
                    let params = {
                        apID: this.apID,
                        resName: this.filterOptions.searchedKey||'',
                        cityIds: this.filterOptions.cityList.reduce((group, item)=>{
                            if(item.selected) {
                                group.push(item.rID)
                            }
                            return group
                        }, []).join(),
                        districtIds: this.filterOptions.districtList.reduce((group, item)=>{
                            if(item.selected) {
                                group.push(item.rID)
                            }
                            return group
                        }, []).join(),
                        cTypes: this.filterOptions.ctypeList.reduce((group, item)=>{
                            if(item.selected) {
                                group.push(item.name)
                            }
                            return group
                        }, []).join()
                    }
                    console.log('params', params)
                    this.pageNum = 1
                    this.getResList(params)
                }, 600);
            },
            // 获取协同选点查询条件（城市、区域、类型）
            getSelection() {
                api.getApi('/addsp/proposal/share/getSelect', {apID: this.apID}).then(res => {
                    if(res.data.SysCode == 200200) {
                        let selectOptions = res.data.data;
                        this.filterOptions.cityList = selectOptions.cityList
                        this.filterOptions.ctypeList = selectOptions.ctypeList.map((item)=>{
                            return {name: item}
                        })
                        this.filterOptions.districtList = selectOptions.districtList
                        let {rID, rName} = this.filterOptions.cityList[0]
                        this.activeCity = {
                            value: rID,
                            label: rName
                        }
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            },
            // 获取原始数据
            getResList(params, onload) {
                this.webLoading = this.$loading({
                    lock: true,
                    text: '正在加载...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                api.getApi('/addsp/proposal/share/getResList', params).then(res => {
                    console.log('获取协同选点列表', res)
                    if(res.data.SysCode == 200200) {
                        // 统计小区总数
                        if(onload) {
                            this.showResList = res.data.data||[]
                            this.resMediaAdsNum.resTotalNum = this.showResList.length
                            for(let adProposalRes of this.showResList) {
                                // 统计可投面总数
                                this.resMediaAdsNum.adsTotalNum += adProposalRes.actualAdsCnt||0
                                if(this.selectedResSet.has(adProposalRes.adProposalResID)) {
                                    this.$refs.multipleTable.toggleRowSelection(adProposalRes, true)
                                }
                            }
                        } else {
                            this.selectionMap = {}
                            for(let res of this.selectionResList) {
                                this.selectionMap[res.adProposalResID] = res.planAdsCnt
                            }
                            let tempResList = res.data.data||[]
                            for(let adProposalRes of tempResList) {
                                if(this.selectionMap[adProposalRes.adProposalResID]>0) {
                                    adProposalRes.planAdsCnt = this.selectionMap[adProposalRes.adProposalResID]
                                }
                            }
                            this.showResList = tempResList
                        }
                        this.computeNumber()
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                }).finally(()=>{
                    this.webLoading.close()
                })
            },
            // 统计总面数和资源数
            computeNumber() {
                this.resMediaAdsNum.selectionTotal = this.selectionResList.length||0
                this.resMediaAdsNum.planAdsTotal = this.selectionResList.reduce((total, item)=>{
                    return total += item.planAdsCnt||0
                }, 0)
            },
            // 回车筛选
            keyupFun(ev){
                let e = ev || window.ev;
                console.log('触发了键盘', e)
                if (e.keyCode === 13) {
                    this.filterFun(this.filterOptions.searchKey)
                }
            },
            // 行选中
            handleSelect(selection, row) {
                this.$nextTick(()=>{
                    if(row.planAdsCnt == 0) {
                        this.$set(row, 'planAdsCnt', 1)
                    }
                    this.computeNumber()
                })
            },
            // 全选中
            handleSelectAll(selection) {
                console.log('全选中selection')
                this.$nextTick(()=>{
                    this.currentPageTableData.forEach(item => {
                        item.planAdsCnt == 0 && (this.$set(item, 'planAdsCnt', 1))
                    });
                    this.computeNumber()
                })
            },
            // 
            selectionChange(selection) {
                this.selectionResList = selection
            },
            // 地图选择到资源
            getMapSelect(...data) {
                console.log('地图选择到资源---',data)
                this.mapResSet = new Set(data[0].map((item)=>item.adProposalResID))
                this.isChangeMapSelect = true
            },
            // 地图同步到列表
            mapToList() {
                for(let adProposalRes of this.showResList) {
                    if(this.mapResSet.has(adProposalRes.adProposalResID)) {
                        this.$refs.multipleTable.toggleRowSelection(adProposalRes, true)
                        adProposalRes.planAdsCnt == 0 && (this.$set(adProposalRes, 'planAdsCnt', 1))
                    }
                }
                this.computeNumber()
            },
            // 提交列表选择的点位给无忧地图 activeRadio
            listToMap() {
                this.tableSelects = this.selectionResList.map(res=>{
                    return res.resID
                })
            },
            // 清空所选小区
            clearAllSelected() {
                this.$refs.multipleTable.clearSelection()
                this.computeNumber()
            },
            // 选点提交
            submitFun() {
                if (this.selectionResList.length==0) {
                    this.$message({
                        message: '请选择资源后再提交！',
                        type: 'warning',
                    })
                } else {
                    this.$confirm('该页面仅能提交一次，请确认无误后提交\n' +
                        ',提交成功后，您的方案选点信息将同步到亲邻选点系统', '是否确定提交选点信息', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        customClass: 'shareADSBtn'
                    }).then(() => {
                        this.PushShareADSFun()
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        })
                    })
                }
            },
            // 反馈协同选点列表
            PushShareADSFun() {
                api.postApi_json('/addsp/proposal/share/pushRes', {
                    apID: this.apID,
                    aiCode: this.aiCode,
                    resList: this.selectionResList.map(res=>{
                        return {adProposalResID: res.adProposalResID, planAdsCnt: res.planAdsCnt}
                    })
                }).then(res =>{
                    if (res.data.SysCode == 200200) {
                        this.$message({
                            message: '选点成功，如需更改请联系您的业务经理！',
                            type: 'success'
                        })
                        this.reading = false
                    } else {
                        this.$message({
                            message: '选点信息提交失败！(点位已被提交过或方案已发布)',
                            type: 'warning'
                        })
                    }
                })
            },
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType
                })
            },
            // 时间格式规范
            formatTime(val) {
                return dateFormat.toDate(val, "/")
            },
        }
    }
</script>
<style lang="scss" scoped>
    /* 城市、区域、楼盘类型筛选 */
    .dw-panel {
        margin-top: 24px;
        margin-bottom: 8px;
        padding: 0 18px 0 18px;
        border: 1px solid #D8D8D8;
        border-radius: 4px;
        dl {
            border-bottom: 1px dashed #d8d8d8;
            line-height: 40px;
        }
        dt {
            display: inline-block;
            font-size: 14px;
            color: #999999;
            height: 40px;
        }
        .city-proper {
            padding-left: 75px;
            line-height: 34px;
        }
        dd {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            display: inline-block;
            line-height: 22px;
            padding: 3px 10px;
            cursor: pointer;
            margin-left: 6px;
            &.active {
                border-radius: 2px;
                background: #1890ff;
                color: #fff;
            }
        }
        .other-dd {
            padding-left: 0px;
        }
    }
    /* 筛选条件 */
    .filter-condition {
        width: 100%;
        height: 36px;
        line-height: 36px;
        margin: 5px 0 0;
        background: rgb(241, 241, 241);
        /deep/ .el-tag {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(0, 0, 0, 0.1);
            color: rgba(0, 0, 0, 0.35);
            margin-left: 10px;
        }
        /deep/ .el-tag:hover {
            color: #1890ff;
            border-color: #1890ff;
        }
        /deep/ .el-tag:hover .el-tag__close.el-icon-close {
            color: #1890ff;
        }
    }

    /deep/ .el-badge__content.is-fixed.is-dot {
        left: -15px;
        top: 5px;
        background: #FF6868;
        width: 5px;
        height: 5px;
    }
    .share_index_header {
        width: 100%;
        background: #fff;
        height: 60px;
    }

    .logo_img {
        padding: 14px 0 0 60px;
    }
    .logo_img img {
        width: 103px;
    }

    .content {
        padding-left: 60px;
        padding-right: 60px;
        margin: 0 auto;
    }

    .content_head {
        height: 180px;
        margin-top: 16px;
        border: 1px solid rgba(232,232,232,1);
        text-align: center;
        background: url("../../../static/images/shareBg.png") 100% no-repeat;
        background-size: contain;
        background-position: center;
        background-color: #1990ff;
    }

    .content_head .title {
        // display: inline-block;
        width: fit-content;
        padding-bottom: 10px;
        margin: 46px auto 10px;
        line-height: 48px;
        border-bottom: 1px dashed #fff;
        font-size: 40px;
        font-weight: 600;
        color: #fff;
    }

    .content_head .comment {
        display: inline-block;
        line-height: 22px;
        text-align: center;
        font-size: 16px;
        color: #fff;
        & + .comment {
            margin-left: 16px;
        }
    }

    .content_main {
        margin-top: 16px;
        background: #fff;
        padding: 0;
        border: 1px solid rgba(232,232,232,1);
        /deep/ .el-tabs__nav-wrap::after {
            height: 1px !important;
        }
    }
    .content_main /deep/ .el-tabs__content{
        padding: 0 24px 24px;
    }

    .content_main /deep/ .el-tabs__nav-wrap{
        padding: 0 24px;
    }

    .content_main /deep/ .el-tabs__nav{
        height: 48px;
        line-height: 48px;
    }
    .search-row {
        display: flex;
        justify-content: center;
        margin-top: 9px;
        .el-input-group--append {
            width: 560px;
        }
        /deep/ .el-input-group__append {
            border: none;
            background: #1890FFFF;
        }

    }

    .car-title {
        padding: 8px 16px;
        border: 1px solid #BAE7FF;
        margin-bottom: 8px;
        background: #E6F7FF;
    }

    .car-title h4 {
        font-size: 14px;
        display: inline-block;
        color: #444;
    }

    .car-title p {
        font-size: 14px;
        font-weight: normal;
        display: inline-block;
        margin-left: 10px;
    }

    .car-title span {
        font-size: 14px;
        font-weight: 600;
        margin: 0 6px;
        cursor: pointer;
        color: #1890ff;
    }

    /* /deep/ .el-tabs__item{
        font-size: 16px;
    } */

    /* /deep/ .el-tabs__item.is-active {
        color: #1890FF;
    } */

    /* /deep/ .el-table th{
        background: #f7f7f7;
    } */

    /* /deep/ .el-table th > .cell {
        color: #666666;
        line-height: 14px;
        font-weight: bold;

    } */

    /* /deep/ .el-table__row td{
        line-height: 48px;
        font-size: 14px;
        padding: 8px 0;
    } */

    /* /deep/ .el-checkbox + .el-checkbox {
        margin-left: 10px;
    } */

    /* /deep/ .el-table__expanded-cell[class*=cell] {
        padding: 0 86px;
        background-color: #F7F7F7;;
    } */

    /* .el-table__expanded-cell[class*=cell] .el-form{
        height: 44px;
        line-height: 44px;
    } */

    /deep/ .el-form-item__content {
        line-height: 46px;
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        // height: 440px;
        // overflow-y: auto;
        // overflow-x:auto;
    }

    /* /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 4px;
        height: 8px;
        background: #FAFAFA;
    } */

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        // -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        // background: #C1C1C1;
        // border-radius: 4px;
    }

    /* /deep/ .el-table td .cell {
        height: 30px;
        line-height: 30px;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    } */

    /* /deep/ .el-table__row .cell span{
        overflow-x: initial;
    } */
    /*城市按钮*/
    .city_radio{
        display: inline-block;
        width: 68px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        font-size: 12px;
        border-radius: 4px;
        cursor: pointer;
        margin: 0 10px 3px 0;
        color: #606266;
        border: 1px solid #dcdfe6;
    }
    .active_radio{
        background: #409EFF;
        color: #fff;
    }

    .addMinus{
        position: relative;
    }

    .addMinus /deep/ .el-input-number.is-controls-right .el-input__inner{
        padding-left: 5px;
        padding-right: 32px;
    }

    .addMinus /deep/ .el-input-number--mini{
        width: 90%;
    }

    /deep/ .shareTable {
        .el-table tr th, .el-table tr td {
            height: 46px;
            .cell {
                height: 25px;
                line-height: 25px;
            }
        }
        .el-table__header {
            .el-table th > .cell {
                color: rgba(0, 0, 0, 0.85);
            }
        }
        /deep/ .el-input-number--mini {
            .el-input__inner {
                height: 28px;
                padding-left: 28px;
                padding-right: 28px;
            }
            .el-input-number__decrease, .el-input-number__increase {
                width: 26px;
            }
        }
    }


    /* @media all and (min-width: 1900px){
        /deep/ .el-table__body-wrapper{
            overflow-x: hidden;
        }
    } */
</style>
<style>
    .shareADSBtn>.el-message-box__content>.el-icon-warning{
        top:33%
    }
    .shareADSBtn>.el-message-box__content>.el-message-box__message{
        padding-left:0;
    }
    .shareADSBtn>.el-message-box__content>.el-message-box__message>p{
        text-indent: 30px;
    }
</style>
