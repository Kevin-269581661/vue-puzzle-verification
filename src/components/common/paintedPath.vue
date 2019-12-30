<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav">
            <p><a href="#">工程管理</a><em> / </em><a href="#">线路列表</a></p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>线路列表</h2>
            </div>
            <div class="mediaList_container">
                <div class="handel_ul">
                    <li class="handel_ul_li handel_ul_li_area">
                        <span class="handel_ul_li_title">所属线路:</span>
                        <el-input v-model="selectPath" size="small" placeholder="请输入线路名称"></el-input>
                    </li>
                    <li class="handel_ul_li handel_ul_li_btn">
                        <el-button type="primary" :disabled="searchBtnAbled" @click="searchFun">搜索</el-button>
                        <el-button plain @click="clearSearch">重置</el-button>

                    </li>
                    <li class="handel_ul_li handel_ul_li_Newbtn" v-if="showCreateBtn">
                        <el-button plain style="width: 100px" @click="exportPath('all')">导出全部线路</el-button>
                        <el-button plain @click="createPath">新建线路</el-button>
                    </li>
                </div>
                <div class="table_wrap">
                    <el-table
                        v-loading="tableLoading"
                        element-loading-text="拼命加载中..."
                        element-loading-spinner="el-icon-loading"
                        border
                        :data="pathTableList"
                        style="width: 100%">
                        <el-table-column
                            prop="lineName"
                            label="线路"
                            min-width="17%">
                        </el-table-column>
                        <el-table-column
                            prop="regionInfo"
                            label="覆盖小区"
                            min-width="30%"
                            :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column
                            prop="mediaInfo"
                            label="覆盖媒体"
                            min-width="20%">
                        </el-table-column>
                        <el-table-column
                            prop="pointCount"
                            label="覆盖点位"
                            align="right"
                            min-width="14%">
                        </el-table-column>
                        <el-table-column
                            prop="updateTime"
                            label="更新时间"
                            min-width="15%">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="112">
                            <template slot-scope="scope">
                                <!--<span class="detail_btn" @click="showDetail(scope.row)">查看详情</span>-->
                                <el-dropdown size="small" trigger="click" placement="bottom-start">
                                <span class="el-dropdown-link" style="color: #1890ff;cursor: pointer">
                                      操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native.prevent="showDetail(scope.row)">查看详情</el-dropdown-item>
                                        <!--<el-dropdown-item>导出线路</el-dropdown-item>-->
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </template>
                        </el-table-column>
                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>
                </div>
                <div class="ad_pagination">
                    <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        @current-change="changePage"
                        @size-change="changeSize"
                        :page-sizes="[10, 20, 30, 40]"
                        :current-page.sync="pageData.pageNum"
                        :page-size="pageData.pageSize"
                        :total="pageData.totalSize">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!--新建弹出框-->
        <el-dialog
            title="新建线路"
            :visible.sync="createDialogVisible"
            width="650px">
            <div>
                <el-form :model="createData" :rules="createRules" ref="createData" label-width="92px"
                         class="demo-ruleForm">
                    <el-form-item label="线路名称:" prop="pathLine">
                        <el-input v-model="createData.pathLine" placeholder="请选择输入线路名称" @change="changeLineName"
                                  size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="所属城市:" prop="city">
                        <el-select v-model="createData.city" filterable placeholder="请选择城市" :clearable="true"
                                   style="width: 100%" size="small" @change="changeCity">
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="选择小区:" prop="resName">
                        <el-select v-model="createData.resName" filterable multiple placeholder="请选择小区"
                                   :clearable="true"
                                   :loading="resLoading" style="width: 100%" size="small">
                            <!--@focus="selectResFocus"-->
                            <el-option
                                v-for="item in resList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm('createData')">确 定</el-button>
            </div>
        </el-dialog>
        <!--详情弹出框-->
        <el-dialog
            :title="activePathName"
            :visible.sync="detailDialogVisible"
            class="path_detail"
            width="65%">
            <div class="path_detail_box">
                <el-table
                    v-loading="pathDetaiLoading"
                    element-loading-text="拼命加载中..."
                    element-loading-spinner="el-icon-loading"
                    border
                    :data="detailList"
                    style="width: 100%">
                    <el-table-column
                        prop="resourceName"
                        label="覆盖资源"
                        min-width="20%">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isInput">{{scope.row.resourceName}}</span>
                            <el-select v-else v-model="scope.row.resourceId" filterable placeholder="请选择资源"
                                       :clearable="true"
                                       :loading="detailResLoading" style="width: 100%" size="small"
                                       @change="changeRes(scope.row)">
                                <el-option
                                    v-for="item in resList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="regionName"
                        label="区域"
                        min-width="17">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isInput">{{scope.row.regionName}}</span>
                            <el-select v-else v-model="scope.row.regionId" filterable placeholder="区域" :clearable="true"
                                       style="width: 100%" size="small" @change="changeArea(scope.row)">
                                <el-option
                                    v-for="(item,index) in areaList"
                                    :key="index"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tradingArea"
                        label="商圈"
                        min-width="17%">
                        <template slot-scope="scope">
                            <span>{{scope.row.tradingArea || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="buildType"
                        label="类型"
                        min-width="12%">
                        <template slot-scope="scope">
                            <span>{{scope.row.type || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="address"
                        label="详细地址"
                        :show-overflow-tooltip="true"
                        min-width="20%">
                        <template slot-scope="scope">
                            <span>{{scope.row.address}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="isEdit"
                        prop="btn"
                        label="操作"
                        width="80px">
                        <template slot-scope="scope">
                            <span class="detail_table_row_btn" @click="deleteLineRes(scope.row)">{{scope.row.isInput ? '取消' : '删除'}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="add_res" @click="AddRow()" v-show="isEdit">
                    <i class="el-icon-plus" style="color: rgba(24,144,255,1)"></i>
                    添加
                </div>
            </div>
            <div slot="footer" class="dialog-footer path_detail_footer">
                <el-button v-if="isEdit" @click="cancelEdit">取 消</el-button>
                <el-button plain @click="exportPath('one')">导 出</el-button>
                <el-button plain v-if="!isEdit && showCreateBtn" @click="isEdit = true">编 辑</el-button>
                <el-button plain @click="saveResToLine" :loading="saveLoading">{{isEdit ? '保 存' : '关 闭'}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {api} from "../../api/api";
    import noSearchResult from "./components/noSearchResult.vue";

    export default {
        name: "paintedPath",
        components: {
            noSearchResult
        },
        data() {
            let validateresName = (rule, value, callback) => {
                if (!this.createData.city) {
                    callback(new Error('请先选择城市'));
                } else {
                    callback();
                }
            };
            let validatereLineName = (rule, value, callback) => {
                if (this.repetLineName) {
                    callback(new Error('该名称已被占用!'));
                } else {
                    callback();
                }
            };
            return {
                // 用户登录信息
                sessionData: '',
                // 页码及条数
                pageData: {
                    pageNum: 1,
                    pageSize: 10,
                    totalSize: 0,
                },
                // 表格高度
                tableHeight: 595,
                //加载中
                tableLoading: true,
                cityList: [],
                // 编辑线路是选择的区域下拉
                areaList: [],
                // 编辑线路是选择的区域id
                regionID: '',
                //
                pathList: [
                    {value: '0', label: '线路一'},
                    {value: '1', label: '线路二'},
                    {value: '2', label: '线路三'}
                ],
                selectPath: '',
                // 根据权限显示创建按钮
                showCreateBtn: true,
                // 搜索按钮禁用
                searchBtnAbled: false,
                // 路线列表
                pathTableList: [],
                // 新建弹出框
                createDialogVisible: false,
                // 创建时的loading
                createLoading: '',
                // 创建的路线数据
                createData: {
                    city: '',
                    pathLine: '',
                    resName: ''
                },
                repetLineName: false,
                // 小区下拉loading
                resLoading: true,
                // 创建路线的表单验证
                createRules: {
                    pathLine: [
                        {required: true, message: '请输入路线名称', trigger: 'change'},
                        {min: 1, max: 40, message: '长度在 1 到 40 个字符', trigger: 'change'},
                        {validator: validatereLineName, trigger: ['blur', 'change']},
                    ],
                    city: [
                        {required: true, message: '请选择城市', trigger: 'change'},
                    ],
                    // resName:[
                    //     {validator: validateresName, trigger: 'blur' },
                    // ]
                },
                // 可选择的小区列表
                resList: [],
                // 线路详情
                detailDialogVisible: false,
                pathDetaiLoading: true,
                // 线路详情的id
                detailLineId: '',
                // 详情列表
                detailList: [],
                //添加资源时下拉loading
                detailResLoading: true,
                // 编辑状态
                isEdit: false,
                // 线路详情的名称
                activePathName: '',
                // 新增行下标
                addRowIndex: 0,
                // 上一次选择的小区id
                beforeResourceId: '',
                // 保存时loading
                saveLoading: false,
            }
        },
        mounted() {
            this.getSessionData()
            // 获取线路列表
            this.getTableList()
            // 获取城市列表
            this.getCity()
        },
        methods: {
            getSessionData() {
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'))
                if (this.sessionData.mediaManageLevel == 1) {
                    this.showCreateBtn = false
                }
            },
            // 搜索按钮
            searchFun() {
                this.pageData.pageNum = 1
                this.getTableList()
            },
            // 重置搜索 selectPath
            clearSearch() {
                this.selectPath = '';
                this.pageData.pageNum = 1
                this.getTableList()
            },
            // 分页
            changePage(val) {
                console.log('当前页', val)
                this.pageData.pageNum = val
                this.getTableList()
            },
            // 每页的条数
            changeSize(val) {
                console.log('每页的条数', val)
                this.pageData.pageSize = val
                this.getTableList()
            },
            // 获取表格数据
            getTableList() {
                this.tableLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    name: this.selectPath,
                    pageNum: this.pageData.pageNum,
                    pageSize: this.pageData.pageSize,
                }
                if (!params.name) {
                    delete params.name
                }
                api.getApi(this.apiVar.engineer + '/list', params).then(res => {
                    console.log('线路列表接口', res)
                    if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                        this.pageData.totalSize = res.data.data.totalSize
                        this.setTableData(res.data.data.data)
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                    this.tableLoading = false
                })
            },
            // 设置表格数据
            setTableData(tableData) {
                let lineArr = []
                for (let key of tableData) {
                    let obj = {
                        lineId: key.lineId,
                        lineName: key.lineName,
                        cityId: key.cityId,
                        regionInfo: '',
                        mediaInfo: '',
                        pointCount: key.pointCount,
                        updateTime: key.updateTime || '--'
                    }
                    // 覆盖小区
                    if (Array.isArray(key.regionInfo)) {
                        for (let rKey of key.regionInfo) {
                            obj.regionInfo += rKey.regionName + '(' + rKey.count + '个)' + ' / '   // 斜杠前后有空格
                        }
                        obj.regionInfo = obj.regionInfo.substr(0, obj.regionInfo.length - 2)
                    } else {
                        obj.regionInfo = key.regionInfo || '--'
                    }
                    // 覆盖媒体
                    if (Array.isArray(key.mediaTypeInfo)) {
                        for (let mKey of key.mediaTypeInfo) {
                            obj.mediaInfo += mKey.mediaName + '(' + mKey.mediaCount + '个)' + ' / '
                        }
                        obj.mediaInfo = obj.mediaInfo.substr(0, obj.mediaInfo.length - 2)
                    } else {
                        obj.mediaInfo = key.mediaTypeInfo || '--'
                    }
                    lineArr.push(obj)
                }
                this.pathTableList = lineArr
            },
            // 获取城市
            getCity() {
                let info = {
                    "token": this.sessionData.token,
                    "uid": this.sessionData.uID
                };
                api.postApi(this.apiVar.Advertisement + '/GetAuthorCity', info).then(res => {
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
                    } else {
                        Message.warning(res.data.MSG);
                    }
                });
            },
            // 获取区域
            getAreaByRID(row) {
                // let cityIds = ''
                // for(let key of this.cityList){
                //     cityIds += key.value + ','
                // }
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    cityIds: row.cityId //cityIds.substr(0,cityIds.length-1)
                }
                api.getApi(this.apiVar.engineer + '/districtList', params).then(res => {
                    console.log('获取区域', res);
                    if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                        let resData = res.data.data;
                        let areaArr = [];
                        for (let key of resData) {
                            areaArr.push({
                                label: key.rName,
                                value: key.rID
                            })
                        }
                        this.areaList = areaArr;
                    } else {
                        this.messageFun('warning', res.data.MSG);
                    }
                })
            },
            // 小区下拉选项
            getResList(cityId) {
                console.log('小区列表', this.resList)
                // if(!this.resList.length){
                this.resLoading = true
                this.detailResLoading = true
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    districtId: this.regionID,
                    cityId: cityId || this.createData.city,
                    // resName: '',
                }
                if (!params.districtId) {
                    delete params.districtId;
                }
                if (!params.cityId) {
                    delete params.cityId;
                }
                api.getApi(this.apiVar.engineer + '/resInfoListByDistrictId', params).then(res => {
                    console.log('小区下拉选项res', res);
                    if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                        let resData = res.data.data;
                        let resArr = [];
                        for (let key of resData) {
                            if (!key.resID) {
                                console.log('key.resID', key)
                            }
                            resArr.push({
                                label: key.resName,
                                value: key.resID.toString()
                            });
                        }
                        this.resList = resArr;
                        console.log('this.resList', this.resList)
                        this.resLoading = false
                        this.detailResLoading = false
                    } else {
                        this.messageFun('warning', res.data.MSG);
                    }
                })
                // }
            },
            // 查看详情 detailList
            showDetail(row) {
                this.activePathName = row.lineName
                this.detailLineId = row.lineId
                this.detailList = []
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    lineId: row.lineId
                }
                api.getApi(this.apiVar.engineer + '/detail', params).then(res => {
                    console.log('线路详情res', res);
                    if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                        this.setDetailData(res.data.data);
                        this.pathDetaiLoading = false;
                        this.isEdit = false;
                    } else {
                        this.messageFun('warning', res.data.MSG);
                    }
                })
                //获取小区下拉
                this.createData.city = ''
                this.regionID = ''
                this.resList = []
                this.getResList(row.cityId)
                // 获取城市区域
                // if(!this.areaList.length){
                this.getAreaByRID(row);
                // }
                this.detailDialogVisible = true;
            },
            // 线路详情
            setDetailData(lineData) {
                console.log('线路详情lineData', lineData)
                if (Array.isArray(lineData)) {
                    let detailList = [];
                    for (let key of lineData) {
                        detailList.push({
                            "lineId": this.detailLineId,
                            "resourceId": key.resourceId,
                            "resourceName": key.resourceName,
                            "regionId": key.regionId,
                            "regionName": key.regionName,
                            "cityId": key.cityId,
                            "cityName": key.cityName,
                            "tradingArea": key.tradingArea,
                            "type": key.type,
                            "address": key.address,
                        })
                    }
                    this.detailList = detailList;
                }
            },
            // 新增一行
            AddRow() {
                this.detailList.unshift({
                    resourceId: '',
                    resourceName: '',
                    regionName: '',
                    regionId: '',
                    cityId: "",
                    cityName: "",
                    tradingArea: '',
                    type: '',
                    address: '',
                    isInput: true,
                    addRowIndex: this.addRowIndex,
                });
                this.addRowIndex += 1
            },
            // 删除线路小区
            deleteLineRes(row) {
                console.log('删除线路小区', row)
                if (row.isInput) {
                    // 未添加线路的行删除
                    this.detailDeletRow('1', row.addRowIndex)
                } else {
                    this.$confirm('确定删除该小区？', '提示').then(_ => {
                        this.pathDetaiLoading = true
                        let params = {
                            uid: this.sessionData.uID,
                            token: this.sessionData.token,
                            resId: row.resourceId,
                            lineId: row.lineId
                        }
                        api.postApi(this.apiVar.engineer + '/removeResFromLine', params).then(res => {
                            console.log('删除线路的小区', res)
                            if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                                this.detailDeletRow('2', row.resourceId)
                                this.messageFun('success', '删除成功')
                                this.getTableList();
                            } else {
                                this.messageFun('warning', res.data.MSG)
                            }
                            this.pathDetaiLoading = false
                        }).catch(err => {
                            this.pathDetaiLoading = false
                        })
                    }).catch(_ => {
                        this.messageFun('info', '已取消')
                    })
                }
            },
            // 详情列表编辑状态删除行 stats：1为普通的行删除 2为线路里的小区删除
            detailDeletRow(stats, id) {
                for (let i = 0; i < this.detailList.length; i++) {
                    if (stats === '1') {
                        if (id === this.detailList[i].addRowIndex) {
                            this.detailList.splice(i, 1)
                            break
                        }
                    } else if (stats === '2') {
                        if (id === this.detailList[i].resourceId) {
                            this.detailList.splice(i, 1)
                            break
                        }
                    }
                }
            },
            // 编辑线路-选择小区
            changeRes(row) {
                console.log('选择的小区', row)
                if (row.resourceId !== '' && row.resourceId !== null) {
                    let isHave = this.isHaveDiffRes(row)
                    if (!isHave) {
                        let params = {
                            uid: this.sessionData.uID,
                            token: this.sessionData.token,
                            resId: row.resourceId
                        }
                        api.getApi(this.apiVar.engineer + '/resInfoByResId', params).then(res => {
                            console.log('获取选择小区的信息', res)
                            if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                                let resData = res.data.data
                                row.type = resData.cType || '--'
                                row.address = resData.resAddress || '--'
                                row.resourceName = resData.resName || '--'
                                row.tradingArea = resData.tradingArea || '--'
                                row.regionId = resData.rID
                                // 记录成功选择的小区id
                                this.beforeResourceId = row.resourceId
                            } else {
                                this.messageFun('warning', res.data.MSG)
                            }
                        })
                    } else {
                        this.messageFun('warning', '请勿重复选择相同小区！')
                        if (row.regionId || row.type || row.tradingArea) {
                            row.resourceId = this.beforeResourceId
                        } else {
                            this.clearRowData(row)
                        }
                    }
                } else {
                    this.clearRowData(row)
                }
            },
            // 编辑时-选择小区判断是否重复
            isHaveDiffRes(row) {
                for (let key of this.detailList) {
                    if (key.resourceId == row.resourceId && row.addRowIndex !== key.addRowIndex) {
                        return true
                    }
                }
                return false
            },
            // 行数据初始化
            clearRowData(row) {
                row.type = ''
                row.address = ''
                row.resourceId = ''
                row.resourceName = ''
                row.regionId = ''
                row.tradingArea = ''
            },
            // 编辑线路-选择区域
            changeArea(row) {
                this.regionID = row.regionId
                this.resList = []
                this.getResList(row.cityId)
                // 重新选择区域则初始化行数据
                this.clearRowData(row)
                row.regionId = this.regionID
            },
            // 取消编辑
            cancelEdit() {
                let arr = []
                for (let key of this.detailList) {
                    if (!key.isInput) {
                        arr.push(key);
                    }
                }
                this.detailList = arr;
                this.isEdit = false
            },
            // 保存或关闭
            saveResToLine() {
                if (this.isEdit) {
                    console.log('保存')
                    let resourceIds = ''
                    let isAdd = false
                    for (let key of this.detailList) {
                        if (key.isInput && key.resourceId) {
                            isAdd = true
                            resourceIds += key.resourceId + ','
                        }
                    }
                    console.log('resourceIds', resourceIds)
                    if (isAdd && resourceIds) {
                        let params = {
                            uid: this.sessionData.uID,
                            token: this.sessionData.token,
                            lineId: this.detailLineId,
                            resourceIds: resourceIds.substr(0, resourceIds.length - 1)
                        }
                        this.saveLoading = true;
                        api.postApi(this.apiVar.engineer + '/addResource', params).then(res => {
                            console.log('线路新增资源', res)
                            if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                                this.messageFun('success', '保存成功')
                                this.getTableList()
                                this.detailDialogVisible = false
                            } else {
                                this.messageFun('warning', res.data.MSG)
                            }
                            this.saveLoading = false;
                        })
                    } else {
                        this.messageFun('warning', '暂无新增小区关联！')
                    }
                } else {
                    console.log('关闭')
                    this.detailDialogVisible = false
                }

            },
            // 新建线路
            createPath() {
                this.createDialogVisible = true
            },
            // 新建方案 - 线路名称
            changeLineName(val) {
                console.log('新建方案 - 线路名称', val)
                this.repetLineName = false
            },
            // 新建方案 - 城市选择
            changeCity(val) {
                console.log('城市选择', val)
                this.createData.resName = []
                //获取小区下拉
                this.getResList()
            },
            //创建的表单验证
            submitForm(formName) {
                console.log('formName', formName)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!', this.createData);
                        this.creatLine()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 新建线路
            creatLine() {
                this.createloading = this.$loading({
                    lock: true,
                    text: '加急创建中...',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                })
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    cityId: this.createData.city,
                    name: this.createData.pathLine,
                    resourceIds: this.createData !== '' ? this.createData.resName.join(',') : '',
                }
                console.log('新建线路params', params)
                api.postApi(this.apiVar.engineer + '/create', params).then(res => {
                    console.log('新建线路res', res)
                    if (res.data.System == 200200 || res.data.MSG === "成功") {
                        this.messageFun('success', '新建成功')
                        this.createDialogVisible = false
                        this.getTableList()
                        this.setFormData()
                    } else if (res.data.SysCode == 200500) {
                        this.repetLineName = true
                        this.$refs.createData.validateField('pathLine')  // 手动触发校验
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                    this.createloading.close()
                })
            },
            // 新建成功后数据初始
            setFormData() {
                this.$refs.createData.resetFields()
                this.resList = []
                for (let i in this.createData) {
                    this.createData[i] = ""
                }
            },
            // 操作提示统一方法
            messageFun(mesType, mes) {
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            //导出线路
            exportPath(type){
                let params = ''
                if(type == 'all'){
                    params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                    }
                }else{
                    params = {
                        uid: this.sessionData.uID,
                        token: this.sessionData.token,
                        lineId:this.detailLineId
                    }
                }
                api.getApi_file(this.apiVar.engineer+'/downloadDetailExcel',params).then(res=>{
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                    let downloadElement = document.createElement('a');
                    let href = window.URL.createObjectURL(blob); //创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = res.headers['content-disposition'].split('=')[1]; //下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); //点击下载
                    document.body.removeChild(downloadElement); //下载完成移除元素
                    window.URL.revokeObjectURL(href); //释放掉blob对象
                })
            }
        },
    }
</script>

<style scoped>
    /*搜索条件*/
    .handel_ul_li {
        margin-right: 32px;
    }

    .handel_ul_li_area {
        width: 23%;
    }

    .handel_ul_li_Newbtn {
        float: right;
        text-align: right;
        margin-right: 0
    }

    .handel_ul_li_Newbtn /deep/ .el-button:first-child {
        width: 100px;
    }

    /deep/ .handel_ul .el-input {
        width: calc(100% - 68px);
    }

    /deep/ .el-pagination__jump {
        margin-left: 0;
    }

    /*详情按钮*/
    .detail_btn {
        cursor: pointer;
        color: #2a98fe;
    }

    /*编辑*/
    .add_res {
        box-sizing: border-box;
        width: 100%;
        height: 32px;
        border: 1px dashed #d9d9d9;
        border-radius: 4px;
        text-align: center;
        line-height: 32px;
        cursor: pointer;
        margin-top: 10px;
        font-size: 14px;
        color: rgba(24, 144, 255, 1);
    }

    .add_res:hover {
        border-color: rgba(24, 144, 255, 1);
    }

    /*弹出框标题*/
    /deep/ .el-dialog__body {
        padding: 32px;
    }

    /deep/ .el-dialog__title {
        font-weight: 600;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
    }

    /deep/ .el-dialog__header {
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    }

    /*详情*/
    .path_detail_box /deep/ .el-table td .cell {
        height: 30px;
        line-height: 30px;
    }

    .path_detail_box /deep/ .el-input--small .el-input__inner {
        height: 30px;
        line-height: 30px;
    }

    .path_detail_box /deep/ .el-table__body-wrapper {
        height: 320px;
        min-height: 320px;
    }

    .detail_table_row_btn {
        color: rgba(24, 144, 255, 1);
        cursor: pointer;
    }

    /deep/ .el-dialog__footer {
        border-top: 1px solid rgba(0, 0, 0, 0.09);
    }

    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        min-height: 500px;
        overflow-y: auto;
        overflow-x: hidden;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar {
        width: 4px;
        background: #FAFAFA;
    }

    /deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #C1C1C1;
        border-radius: 4px;
    }

    .el-table th, .el-table tr {
        height: 44px;
        padding: 0;
        background-color: #f7f7f7;
    }
</style>
