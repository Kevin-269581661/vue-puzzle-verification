<template>
    <div class="ad_main">
        <div class="ad_breadcrumb">
            <p>
                <a href="#">方案管理</a><em> / </em><a href="#">点位表盘</a>
                <span class="ad_breadcrumb_time">数据统计截止至{{ checkDate }}</span>
            </p>
        </div>
        <el-card style="margin: 0 64px 16px 64px;">
            <el-row class="handel_ul" :gutter="36">
                <el-col class="handel_ul_li" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <span class="li-label">关键词：</span>
                    <el-input placeholder="请输入关键词" v-model="searchInfo[searchInfo.keywordType]" size="small"
                        class="input-with-select">
                        <el-select v-model="searchInfo.keywordType" slot="prepend" size="small" placeholder="请输入关键词"
                            style="width: 98px">
                            <el-option label="资源名称" value="resName"></el-option>
                            <el-option label="媒体位ID" value="assetTag"></el-option>
                        </el-select>
                    </el-input>
                </el-col>
                <el-col class="handel_ul_li" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <span class="li-label">城市区域：</span>
                    <el-cascader :options="areaList" v-model="areaRid" separator="-" :show-all-levels="true"
                        placeholder="请选择区域" filterable :clearable="true" size="small" @change="changeArea">
                    </el-cascader>
                </el-col>
                <el-col class="handel_ul_li" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <span class="li-label">查询范围：</span>
                    <el-date-picker v-model="dateInput" size="small" type="daterange" range-separator="⇀"
                        start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy/MM/dd" format="yyyy/MM/dd"
                        @change="dateChange" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-col>
                <el-col class="handel_ul_li" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <span class="li-label">楼栋：</span>
                    <el-input v-model="buildingName" placeholder="请输入楼栋" size="small" clearable>
                    </el-input>
                </el-col>
                <el-col class="handel_ul_li" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <span class="li-label">单元：</span>
                    <el-input v-model="unitName" placeholder="请输入单元" size="small" clearable>
                    </el-input>
                </el-col>
                <el-col class="handel_ul_li handel_ul_li_btn" :xs="12" :sm="8" :md="8" :lg="8" :xl="6">
                    <el-button type="primary" :disabled="searchBtnAbled" @click="searchFun" class="el-icon-search">
                        &nbsp;搜索</el-button>
                    <el-button @click="clearSearch">重置</el-button>
                </el-col>
            </el-row>
        </el-card>
        <div class="mediaList_wrap">
            <div class="tab-box">
                <div style="width: 90%;">
                    <el-tabs v-model="mediaTypeId" @tab-click="handleClick">
                        <el-tab-pane v-for="item in mediaTypesArr" :key="item.id" :label="item.name" :name="item.id">
                        </el-tab-pane>
                    </el-tabs>
                </div>
                <!-- 列设置 -->
                <template v-if="mediaTypesArr.length">
                    <TableSetting class="tab-setting" refresh filter :columns="adsColumn" cacheKey="plate"
                        @filterColumn="filterColumn" @refreshTable="refreshTable">
                    </TableSetting>
                </template>
            </div>
            <div class="tab_conten">
                <div class="table_wrap"
                    :class="!tableLength && (pageData.pageSize == 20 ? 'table_wrap_20' : pageData.pageSize == 30 ? 'table_wrap_30' : pageData.pageSize == 40 ? 'table_wrap_40' : '')">
                    <el-table v-loading="tableLoading" element-loading-text="拼命加载中..."
                        element-loading-spinner="el-icon-loading" :key="itemKey" :data="adsTableList" class="ads_table"
                        :class="tableLength ? 'ads_table_10' : ''" style="width: 100%">
                        <template v-for="item in adsColumn">
                            <template v-if="item.label === '媒体状态'">
                                <el-table-column v-if="item.isChecked" column-key="asState" :prop="item.prop"
                                    :label="item.label" :width="item.width" :fixed="item.fix === 'left' ? true : false">
                                    <template slot-scope="scope">
                                        <point-state :state-text="stateToText(scope.row.asState).text"
                                            :color="stateToText(scope.row.asState).color"></point-state>
                                    </template>
                                </el-table-column>
                            </template>
                            <template v-else-if="item.label === '售卖状态'">
                                <el-table-column v-if="item.isChecked" column-key="asSaleState" :prop="item.prop"
                                    :label="item.label" :width="item.width" :fixed="item.fix === 'left' ? true : false">
                                    <template slot-scope="scope">
                                        <point-state :state-text="stateToSellText(scope.row.asSaleState).text"
                                            :color="stateToSellText(scope.row.asSaleState).color"></point-state>
                                    </template>
                                </el-table-column>
                            </template>
                            <template v-else>
                                <el-table-column v-if="item.isChecked" :prop="item.prop" :label="item.label"
                                    :min-width="item.width" :fixed="item.fix === 'left' ? true : false"
                                    show-overflow-tooltip>
                                </el-table-column>
                            </template>
                        </template>
                        <el-table-column v-for="(item, index) in tableHeader" :prop="item.dayOfMonth" :key="index"
                            width="50" :label="item.dayOfMonth + item.dayOfWeek" class-name="el-table-column-dayTime">
                            <template slot-scope="scope">
                                <div class="color_chunk color_chunk_2"
                                    v-if="scope.row[item.dayOfMonth] && scope.row[item.dayOfMonth].status === -1"></div>
                                <el-popover v-else placement="top-start" width="310" trigger="hover">
                                    <div>
                                        <div v-if="
                                        mediaTypesArr.find(item => item.id == mediaTypeId).name == '单元门禁灯箱' &&
                                        scope.row[item.dayOfMonth].status == 0 &&
                                        scope.row.occupyingPlanList[scope.row[item.dayOfMonth].adPlanIndex].ka">
                                            <p class="propmt_message_p">全国单预锁/全国单占用</p>
                                        </div>
                                        <div v-else>
                                            <p class="propmt_message_p">
                                                占点方案：{{ scope.row[item.dayOfMonth] &&
                                                        scope.row.occupyingPlanList[scope.row[item.dayOfMonth].adPlanIndex].apName
                                                }}
                                            </p>
                                            <p class="propmt_message_p">
                                                占点排期：{{ scope.row[item.dayOfMonth] &&
                                                        scope.row.occupyingPlanList[scope.row[item.dayOfMonth].adPlanIndex].lStar
                                                        + '-'
                                                        + (scope.row[item.dayOfMonth] &&
                                                            scope.row.occupyingPlanList[scope.row[item.dayOfMonth].adPlanIndex].lEnd)
                                                }}
                                            </p>
                                        </div>
                                    </div>
                                    <div slot="reference" class="color_chunk"
                                        :class="scope.row[item.dayOfMonth] && scope.row[item.dayOfMonth].status == 0 ? 'color_chunk_0' : scope.row[item.dayOfMonth] && (scope.row[item.dayOfMonth].status == 1 || scope.row[item.dayOfMonth].status == 2) ? 'color_chunk_1' : 'color_chunk_2'">
                                        <span
                                            v-if="scope.row[item.dayOfMonth] && scope.row[item.dayOfMonth].isStartPoint == 1"
                                            class="warningInfoColor beginWarningInfo color_chunk_3">
                                        </span>
                                    </div>
                                </el-popover>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <el-row class="table_bottom">
                <el-col :span="9">
                    <p class="warningInfo">
                        <span class="warningInfoColor beginWarningInfo"></span>
                        <span class="warningInfoName">排期开始日期</span>
                        <span style="background: rgba(255,144,97,1)" class="warningInfoColor"></span>
                        <span class="warningInfoName">被占点位</span>
                        <span style="background: rgba(255,226,129,1)" class="warningInfoColor"></span>
                        <span class="warningInfoName">预锁点位</span>
                        <span style="background: rgba(235,237,240,1)" class="warningInfoColor"></span>
                        <span class="warningInfoName">空闲点位</span>
                    </p>
                </el-col>
                <el-col :span="15">
                    <div class="ad_pagination">
                        <el-pagination background layout="total, prev, pager, next, sizes, jumper"
                            @current-change="changePage" @size-change="changeSize" :page-sizes="[10, 20, 30, 40]"
                            :current-page.sync="pageData.pageNum" :page-size="pageData.pageSize"
                            :total="pageData.totalSize">
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="ad_footer">
            <el-button size="small" @click="returnBefore">返回</el-button>
        </div>
    </div>
</template>

<script>
import api from '../../api/api'
// 时间格式化
import timeFormat from '../../commonFun/timeFormat'
import areaArr from '../../commonFun/areaPackage_new'
import pointState from "./components/pointState.vue";
import TableSetting from '../common/components/TableSetting'
export default {
    name: "adsDialPlate",
    components: {
        pointState,
        TableSetting
    },
    data() {
        return {
            adsColumn: [
                { id: 0, label: "资源名称", prop: "resName", width: "120", isChecked: true, fix: "left" },
                { id: 1, label: "媒体名称", prop: "mTitle", width: "80", isChecked: true, fix: "left" },
                { id: 2, label: "城市", prop: "cityName", width: "80", isChecked: false, fix: "not" },
                { id: 3, label: "区域", prop: "districtName", width: "80", isChecked: true, fix: "left" },
                { id: 4, label: "街道", prop: "street", width: "100", isChecked: false, fix: "not" },
                { id: 5, label: "商圈", prop: "tradingArea", width: "120", isChecked: false, fix: "not" },
                { id: 6, label: "媒体位ID", prop: "assetTag", width: "180", isChecked: false, fix: "not" },
                { id: 7, label: "设备类型", prop: "mediaModel", width: "80", isChecked: false, fix: "not" },
                { id: 8, label: "位置类型", prop: "siteType", width: "80", isChecked: false, fix: "not" },
                { id: 9, label: "楼栋", prop: "buildingName", width: "80", isChecked: false, fix: "not" },
                { id: 10, label: "单元", prop: "unitName", width: "80", isChecked: false, fix: "not" },
                { id: 11, label: "投放面", prop: "asLab", width: "80", isChecked: true, fix: "left" },
                { id: 12, label: "位置朝向", prop: "siteOrientation", width: "80", isChecked: true, fix: "left" },
                { id: 13, label: "媒体状态", prop: "asState", width: "100", isChecked: false, fix: "not" },
                { id: 14, label: "售卖状态", prop: "asSaleState", width: "100", isChecked: false, fix: "not" },
            ],
            itemKey: '', // 用于更新表格
            mediaTypeId: '', //当前选择的媒体类型id
            mediaTypesArr: [],  //媒体类型数据
            sessionData: '',
            // 页码及条数
            pageData: {
                pageNum: 1,
                pageSize: 10,
                totalSize: 0,
            },
            checkDate: '',
            // 点位表盘loading
            tableLoading: true,
            searchInfo: {
                keywordType: "resName",
                resName: "",
                assetTag: "",
            },
            cityRid: '',
            // 选择的区域
            areaRid: [],
            // 城市列表
            cityList: '',
            // 区域下拉
            areaList: [],
            // 日期区间
            dateInput: [],
            beforDate: [],
            // 楼栋搜索字段
            buildingName: '',
            // 单元搜索字段
            unitName: '',
            searchBtnAbled: false,
            adsTableList: [],
            // 表格key值用于强制刷新渲染
            // tableKey: 1,
            // 表格头部
            tableHeader: [],
            // 选择的第一个日期
            firstTime: '',
            tableLength: true,
            // 时间限制
            pickerOptions: {
                disabledDate: (time) => {
                    if (!this.firstTime) {
                        // console.log('toDay',toDay)
                        // return true
                    } else {
                        // 过去
                        let passDay = timeFormat.returnDayCount(-89, '/', new Date(this.firstTime))
                        // 未来
                        let toDay = timeFormat.returnDayCount(89, '/', new Date(this.firstTime))
                        // console.log('toDay',toDay,'passDay',passDay)
                        return time.getTime() > Date.parse(toDay) || time.getTime() < Date.parse(passDay)
                    }

                },
                onPick: (time) => {
                    //当第一时间选中才设置禁用
                    if (time.minDate) {
                        this.firstTime = time.minDate;
                        // console.log('this.firstTime',this.firstTime,time.maxDate)
                    }
                    // if(time.maxDate){
                    //     vue.timeOptionRange = null;
                    // }
                }
            }
        }
    },
    mounted() {
        this.getSessionData()
        this.setTime()
        this.getCity()
        // 设置表格左侧定位的高度
        this.setFixedTableHieght()
        this.getMediaType();
    },
    methods: {
        // 列展示
        filterColumn(columns) {
            this.adsColumn = columns
            this.itemKey = Math.random()
        },
        // 刷新列表
        refreshTable() {
            this.getTableData()
        },
        // 媒体状态转换
        stateToText(state) {
            let mediaArr = [
                {
                    text: "正常",
                    value: 1,
                    color: "rgba(82,196,26,1)",
                },
                {
                    text: "待安装",
                    value: 2,
                    color: "rgba(196,203,211,1)",
                },
                {
                    text: "已拆除",
                    value: 4,
                    color: "rgba(199, 203, 206, 1)",
                },
            ];
            return (
                mediaArr.filter((item) => {
                    return item.value === state;
                })[0] || {}
            );
        },

        // 售卖状态转换
        stateToSellText(state) {
            let mediaArr = [
                {
                    text: "可售卖",
                    value: 1,
                    color: "rgba(82,196,26,1)",
                },
                {
                    text: "不可售卖",
                    value: 2,
                    color: "rgba(199, 203, 206, 1)",
                },
            ];
            return state === 2 ? mediaArr[1] : mediaArr[0];
        },
        //根据公司id获取媒体类型
        getMediaType() {
            let info = {
                companyIds: this.sessionData.asrID
            }
            api.getApi("/addsp/api/v1/company/mediaTypes", info).then(res => {
                if (res.data.SysCode == 200200) {
                    let _mediaTypesArr = res.data.data;
                    _mediaTypesArr.forEach((item) => {
                        item.id = item.id.toString();
                    })
                    this.mediaTypesArr = _mediaTypesArr;
                    this.mediaTypeId = this.mediaTypesArr[0].id || '';
                    this.getTableData();
                } else {
                    this.messageFun('warning', res.data.MSG)
                }
            }).catch((err) => {
                console.log()
            })
        },
        getSessionData() {
            this.sessionData = JSON.parse(sessionStorage.getItem('session_data'))
            // if (this.sessionData.uType === 'ADN_MD_COUNTRY') {
            //     this.$router.push('/*')
            // }
            if (
                this.sessionData.uType === !'ADN_MD' ||
                this.sessionData.uType === !'ADN_MD_COUNTRY' ||
                this.sessionData.uType === !'ADN_SA'
            ) {
                this.$router.push('/*')
            }
        },
        setTime() {
            let starTime, endTime
            starTime = timeFormat.returnDayCount(0, '/')
            endTime = timeFormat.returnDayCount(29, '/')
            this.dateInput = [starTime, endTime]                // 设置默认时间
            this.beforDate = [starTime, endTime]
        },
        // 表格左侧定位的高度
        setFixedTableHieght() {
            // let timer = setTimeout(()=>{
            //     let fixedTable = document.querySelector('.el-table__fixed') //el-table__body-wrapper
            //     let tableBody = document.querySelector('.el-table__body-wrapper')
            //     console.log('fixedTable',fixedTable,'tableBody',tableBody.offsetHeight)
            //     clearTimeout(timer)
            //     if(fixedTable && tableBody){
            //         fixedTable.style.height = tableBody.offsetHeight + 32 + 'px'//490 + (this.pageData.pageSize / 10 - 1) * 450  + 'px'
            //         // clearTimeout(timer)
            //     }else{
            //         this.setFixedTableHieght()
            //     }
            // },500)
        },
        // tab切换
        handleClick() {
            this.pageData.pageNum = 1
            this.pageData.pageSize = 10
            this.searchInfo.resName = ''
            this.areaRid = []
            this.getTableData()
            this.setFixedTableHieght()
        },
        // 获取城市
        getCity() {
            let info = {
                "token": this.sessionData.token,
                "uid": this.sessionData.uID
            };
            api.postApi(this.apiVar.Advertisement + '/GetAuthorCity', info).then(res => {
                // console.log(res.data);
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
                    this.getAreaByRID()
                } else {
                    Message.warning(res.data.MSG);
                }
            });
        },
        // 获取区域 children
        getAreaByRID() {
            let areaList = []
            // console.log('cityList',this.cityList)
            for (let key of this.cityList) {
                let obj = {
                    label: key.label,
                    value: key.value,
                    children: [],
                }
                let areaTempArr = areaArr.findArea(key.value)
                // console.log('areaTempArr',areaTempArr)
                for (let aKey of areaTempArr) {
                    obj.children.push({
                        label: aKey.rName,
                        value: aKey.rID
                    })
                }
                areaList.push(obj)
            }
            this.areaList = areaList;
            // console.log('areaList',areaList)
        },
        // 获取表盘数据
        getTableData() {
            if (!this.dateInput) {
                this.messageFun('warning', '日期区间不能为空！')
                this.searchBtnAbled = false
                return
            }
            this.tableLoading = true
            let params = {
                uid: this.sessionData.uID,
                token: this.sessionData.token,
                pageNum: this.pageData.pageNum,
                pageSize: this.pageData.pageSize,
                mediaTypeId: this.mediaTypeId,
                startTime: this.dateInput[0],
                endTime: this.dateInput[1],
                buildingName: this.buildingName,
                unitName: this.unitName,
                [this.searchInfo.keywordType]: this.searchInfo[this.searchInfo.keywordType],
                cityId: this.areaRid[0],//this.cityRid,
                districtId: this.areaRid[1],
            }
            if (!params.resName) {
                delete params.resName
            }
            if (!params.assetTag) {
                delete params.assetTag
            }
            if (!params.districtId) {
                delete params.cityId
                delete params.districtId
            }
            api.getApi(this.apiVar.Advertisement + '/VisualizeAds', params).then(res => {
                // console.log('点位表盘列表',res)
                if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                    this.pageData.totalSize = res.data.data.totalCount
                    this.checkDate = res.data.data.checkDate
                    this.setTableData(res.data.data)
                } else {
                    this.messageFun('warning', res.data.MSG)
                    this.pageData.pageNum = 0
                    this.pageData.pageSize = 10
                    this.pageData.totalSize = 0
                    this.adsTableList = []
                }
                this.tableLoading = false
            })
        },
        // 设置表格数据
        setTableData(tableData) {
            this.tableHeader = tableData.tableHeader.concat()
            let adsArr = []
            if (tableData.adsList.length) {
                for (let key of tableData.adsList) {
                    let obj = {
                        resName: key.resName || '--', // 资源名称
                        cityName: key.cityName || '--', // 城市
                        districtName: key.districtName || '--', // 区域
                        street: key.street || '--', // 街道
                        tradingArea: key.tradingArea || '--', // 商圈
                        mTitle: key.mTitle || '--', // 媒体名称
                        assetTag: key.assetTag || '--', // 资产编号（媒体位ID）
                        mediaModel: key.mediaModel || '--', // 设备类型
                        siteType: key.siteType || '--', // 位置类型
                        buildingName: key.buildingName || '--', // 楼栋
                        unitName: key.unitName || '--', // 单元
                        siteOrientation: key.siteOrientation || '--', // 位置朝向
                        asLab: key.asLab || '--', // 投放面
                        asState: key.asState || '--', // 媒体状态
                        asSaleState: key.asSaleState, // 售卖状态
                        occupyingPlanList: key.occupyingPlanList, // 点位表盘列表
                    }
                    for (let oKey of key.occupyInfos) {
                        obj[oKey.dayOfMonth] = oKey; //JSON.parse(JSON.stringify(oKey));
                    }
                    adsArr.push(obj)
                }
                this.adsTableList = adsArr.concat()
                if (this.adsTableList.length < 10) {
                    this.tableLength = true
                } else {
                    this.tableLength = false
                }
            }
        },
        // 区域选择
        changeArea(val) {
            // console.log('选择的区域val',val)
            // this.cityRid = this.areaRid.substr(0,4) + '00'
        },
        // 时间选择
        dateChange(val) {
            // console.log('时间选择',val)
            if (val && val.length > 0) {
                let dayNum = this.GetDateDiff(val[0], val[1])
                if (dayNum < 29) {
                    // this.dateInput = this.beforDate.concat()
                    this.dateInput[1] = timeFormat.returnDayCount(29, '/', new Date(this.dateInput[0]))
                    // console.log('this.dateInput',this.dateInput)
                    this.messageFun('warning', '最短周期为30天')
                } else if (dayNum > 90) {
                    this.dateInput = this.beforDate.concat()
                    this.messageFun('warning', '最长周期为90天')
                } else {
                    this.beforDate = this.dateInput.concat()
                }
                this.firstTime = ''
            }
        },
        // 搜索
        searchFun() {
            // console.log('this.dateInput',this.dateInput)
            this.searchBtnAbled = true
            this.pageData.pageNum = 1
            this.getTableData()
            let timer = setTimeout(() => {
                if (this.searchBtnAbled) {
                    this.searchBtnAbled = false
                }
                clearTimeout(timer)
            }, 350)
            this.setFixedTableHieght()
        },
        // 重置搜索
        clearSearch() {
            this.searchInfo.resName = ''
            this.searchInfo.assetTag = ''
            this.areaRid = []
            this.buildingName = ''
            this.unitName = ''
            this.pageData.pageNum = 1
            this.pageData.pageSize = 10
            this.setTime()
            this.getTableData()
            this.setFixedTableHieght()
        },
        // 分页
        changePage(val) {
            // console.log('当前页',val)
            this.pageData.pageNum = val
            this.getTableData()
            this.setFixedTableHieght()
        },
        // 每页的条数
        changeSize(val) {
            // console.log('每页的条数',val)
            this.pageData.pageSize = val
            this.getTableData()
            this.setFixedTableHieght()
        },
        // 返回上一页
        returnBefore() {
            this.$router.go(-1);
            // this.$router.push("./planList");
        },
        GetDateDiff(startDate, endDate) {
            let startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
            let endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
            let dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
            return dates;
        },
        // 操作提示统一方法
        messageFun(mesType, mes) {
            this.$message({
                message: mes,
                type: mesType,
                showClose: true,
            })
        },
    },
}
</script>

<style lang="scss" scoped>
.handel_ul {
    list-style: none;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
}

/deep/ .handel_ul_li {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
    padding: 12px 0;
    margin: 0;

    .u-key>.el-input__inner {
        width: 100%;
    }

    .el-select--small {
        width: 100%;
    }

    .el-cascader--small {
        width: 100%;
    }

    .li-label {
        display: inline-block;
        white-space: nowrap;
        min-width: 70px;
        text-align: right;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.85);
    }
}

.handel_ul_li_btn {
    .el-button+.el-button {
        margin-left: 8px;
    }

    .collapse-box {
        margin-left: 16px;
        font-weight: 400;
        font-size: 14px;
        color: #1890FF;
        cursor: pointer;
    }
}

/*面包屑*/
.ad_breadcrumb {
    height: 42px;
    line-height: 42px;
    font-size: 14px;
    color: rgb(153, 153, 153);
    width: 100%;
}

.ad_breadcrumb p {
    /*width: 92%;*/
    margin: 0 64px;
}

.ad_breadcrumb p a {
    color: #999;
}

.ad_breadcrumb_time {
    display: inline-block;
    float: right;
}

/*tag颜色覆盖*/
.mediaList_wrap .tab-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #e4e7ed;

    .tab-setting {
        margin-right: 38px;
    }
}

/deep/ .mediaList_wrap .el-tabs__header {
    padding: 0 20px;
    margin: 0;
    width: 100%;
    border: 0;

    .el-tabs__nav-next,
    .el-tabs__nav-prev {
        line-height: 52px;
    }
}

/deep/ .mediaList_wrap .el-tabs__nav-wrap::after {
    width: 0;
}

/deep/ .mediaList_wrap .el-tabs__item {
    min-width: 68px;
    box-sizing: border-box;
    height: 54px;
    line-height: 54px;
    padding: 0 20px !important;
    text-align: center;
    font-size: 16px;
    color: #666666;
}

/deep/ .mediaList_wrap .el-tabs__item.is-active {
    color: #1890FF;
}

/* /deep/ #tab-roadGate{
        margin-left: 18px;
    } */

/deep/ .el-tabs__active-bar {
    // width: 68px !important;
}

/deep/ .el_tab_road {
    text-align: right;
}

.tab_conten {
    padding: 24px 32px;
}

/*搜索块*/
.tab_conten_row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;

    .row-unit {
        width: 280px;
        flex-grow: 1;
        flex-shrink: 1;
        display: flex;
        align-items: center;

        &+.row-unit {
            margin-left: 32px;
        }

        .search_label {
            display: inline-block;
            white-space: nowrap;
            width: 70px;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
        }

        /deep/ .el-date-editor .el-range-separator {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.25);
        }
    }

    .btn-group {
        display: flex;
        margin-left: 32px;
    }
}

/deep/ .el-button {
    width: 76px;
    height: 32px;
    text-align: center;
    padding: 0;
}

/deep/ .tab_conten .el-date-editor {
    width: calc(100% - 67px);
}

.table_wrap {
    margin: 16px auto 0;
}

/deep/ .el-table {
    border-left: 1px solid rgba(233, 233, 233, 0.5);
    border-right: 1px solid rgba(233, 233, 233, 0.5);
    /*box-shadow:4px 0 0 0 rgba(0,0,0,0.1);*/
    border-radius: 4px 0px 0px 0px;
}

/deep/ .tab_conten .el-table tr th {
    height: 42px;
    padding: 0;
    background-color: #f7f7f7;
}

/deep/ .tab_conten .el-table tr td {
    height: 42px;
}

/deep/ .tab_conten .el-table td {
    padding: 6px 0;
    color: rgba(102, 102, 102, 1);
    text-overflow: ellipsis;
}

/deep/ .tab_conten .el-table td .cell {
    height: 32px;
    line-height: 32px;
}

/deep/ .el-table th.el-table-column-dayTime .cell {
    font-size: 12px;
    line-height: 18px;
    padding: 0 4px;
    text-align: center;
}

.propmt_message_p {
    line-height: 24px;
    font-size: 14px;
    color: #666;
}

/*方块颜色*/
.color_chunk {
    width: 32px;
    height: 32px;
}

/*预锁*/
.color_chunk_0 {

    background: #FFE281;
}

/*被占*/
.color_chunk_1 {
    background: #FF9061;
}

/*空闲*/
.color_chunk_2 {
    background: #EBEDF0;
}

/*被占或预锁开始时间*/
.table_wrap .color_chunk_3 {
    position: relative;
    top: -10px;
    border: 10px solid rgba(93, 173, 255, 1);
    border-right: 10px solid transparent;
    border-bottom: 10px solid transparent;
}

/*表格样式提示信息*/
.warningInfo {
    line-height: 32px;
}

.warningInfoColor {
    display: inline-block;
    height: 10px;
    width: 10px;
    border-radius: 2px;
    vertical-align: middle;
}

.warningInfo .warningInfoName {
    color: rgba(0, 0, 0, 0.45);
    font-size: 12px;
    margin-right: 16px;
}

/* 直角三角形（箭头左上）*/
.beginWarningInfo {
    width: 0;
    height: 0;
    border: 5px solid rgba(93, 173, 255, 1);
    border-right: 5px solid transparent;
    border-bottom: 5px solid transparent;
}

/*颜色信息、分页*/
.table_bottom {
    padding: 0 32px 16px;
}

.ad_footer {
    text-align: center;
    margin-top: 24px;
    font-size: 14px;
}

/*滚动条*/
/deep/ .ads_table_10.ads_table .el-table__body-wrapper {
    height: 458px !important;
    min-height: 450px;
}

/deep/ .ads_table .el-table__body-wrapper {
    min-height: 450px;
    overflow-y: auto;
    overflow-x: auto;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    height: 8px;
    background: #FAFAFA;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #C1C1C1;
    border-radius: 4px;
}

/deep/ .ads_table .el-table__fixed {
    height: 490px !important;
}

/deep/ .table_wrap_20 .el-table__fixed {
    height: 940px !important;
}

/deep/ .table_wrap_30 .el-table__fixed {
    height: 1390px !important;
}

/deep/ .table_wrap_40 .el-table__fixed {
    height: 1840px !important;
}

/*safari下表头错位*/
/deep/ .el-table .el-table-column-resName .cell {
    min-width: 120px;
}

/deep/ .el-table .el-table-column-mediaName .cell {
    min-width: 120px;
}

/deep/ .el-table .el-table-column-districtName .cell {
    min-width: 120px;
}

/deep/ .el-table .el-table-column-asLab .cell {
    min-width: 90px;
}
</style>
