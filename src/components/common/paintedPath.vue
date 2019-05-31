<template>
    <div class="ad_main">
        <div class="ad_breadcrumb">
            <p><a href="#" style="color: #999">线路管理</a></p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>线路列表</h2>
            </div>
            <div class="mediaList_container">
                <div class="handel_ul">
                    <li class="handel_ul_li handel_ul_li_area">
                        <span>所属线路:</span>
                        <el-select v-model="selectPath" filterable placeholder="请选择线路" :clearable="true"
                                    size="small" @change="">
                            <el-option v-for="item in pathList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </li>
                    <li class="handel_ul_li handel_ul_li_btn">
                        <el-button type="primary" icon="el-icon-search" @click="searchFun" :disabled="searchBtnAbled">搜索</el-button>
                        <el-button @click="clearSearch">重置</el-button>
                        <el-button plain @click="createPath" v-if="showCreateBtn">新建</el-button>
                    </li>
                </div>
                <div class="table_wrap">
                    <el-table
                        element-loading-text="拼命加载中..."
                        element-loading-spinner="el-icon-loading"
                        border
                        :data="pathTableList"
                        height="480"
                        style="width: 100%">
                        <el-table-column
                            prop="pathLine"
                            label="线路"
                            min-width="12%">
                        </el-table-column>
                        <el-table-column
                            prop="city"
                            label="城市"
                            min-width="12">
                        </el-table-column>
                        <el-table-column
                            prop="resName"
                            label="覆盖小区"
                            min-width="12%">
                        </el-table-column>
                        <el-table-column
                            prop="mediaName"
                            label="覆盖媒体"
                            min-width="15%">
                        </el-table-column>
                        <el-table-column
                            prop="ads"
                            label="覆盖点位"
                            min-width="15%">
                        </el-table-column>
                        <el-table-column
                            prop="time"
                            label="更新时间"
                            min-width="12%">
                        </el-table-column>
                        <el-table-column
                            label="操作"
                            width="100px">
                            <template slot-scope="scope">
                                <span class="detail_btn" @click="showDetail(scope.row)">查看详情</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="ad_pagination">
                    <el-pagination
                        background
                        layout="total, prev, pager, next, sizes, jumper"
                        :total="100">
                    </el-pagination>
                </div>
            </div>
        </div>
        <!--新建弹出框-->
        <el-dialog
            title="新建线路"
            :visible.sync="createDialogVisible"
            width="340"
            :before-close="handleClose">
            <div>
                <el-form v-model="createData" :rules="createRules" ref="createData" label-width="92px" class="demo-ruleForm">
                    <el-form-item label="选择城市:" prop="city">
                        <el-select v-model="createData.city" filterable placeholder="请选择城市" :clearable="true"
                                   style="width: 100%" size="small" @change="">
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="线路名称:" prop="pathLine">
                        <el-input v-model="createData.pathLine" placeholder="请选择输入线路名称"></el-input>
                    </el-form-item>
                    <el-form-item label="选择小区:" prop="resName">
                        <el-select v-model="createData.resName" filterable multiple placeholder="请选择小区" :clearable="true"
                                   style="width: 100%" size="small" @change="">
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
            width="65%">
            <div class="path_detail_box">
                <el-table
                    element-loading-text="拼命加载中..."
                    element-loading-spinner="el-icon-loading"
                    border
                    :data="detailList"
                    height="480"
                    style="width: 100%">
                    <el-table-column
                        prop="resName"
                        label="覆盖资源"
                        min-width="20%">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isInput">{{scope.row.resName}}</span>
                            <el-input v-else v-model.trim="scope.row.resName" placeholder="小区名称" size="small"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="area"
                        label="区域"
                        min-width="17">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isInput">{{scope.row.area}}</span>
                            <el-input v-else v-model.trim="scope.row.area" placeholder="区域" size="small"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tradingArea"
                        label="商圈"
                        min-width="17%">
                        <template slot-scope="scope">
                            <span>{{scope.row.area}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="buildType"
                        label="类型"
                        min-width="12%">
                        <template slot-scope="scope">
                            <span>{{scope.row.buildType}}</span>
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
                            <span class="detail_table_row_btn">{{scope.row.isInput ? '取消' : '删除'}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="add_res" @click="AddRow()" v-show="isEdit">
                    <i class="el-icon-plus" style="color: rgba(24,144,255,1)"></i>
                    添加
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button v-if="isEdit" @click="isEdit = false">取 消</el-button>
                <el-button v-else @click="isEdit = true">编 辑</el-button>
                <el-button type="primary" @click="detailDialogVisible = false">{{isEdit ? '保 存' : '关 闭'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "paintedPath",
        data(){
            return{
                cityList: [
                    {
                        value: '1',
                        label: '广州市'
                    }
                ],
                selectCity: '',
                pathList: [
                    {value: '0',label:'线路一'},
                    {value: '1',label:'线路二'},
                    {value: '2',label:'线路三'}
                ],
                selectPath: '',
                // 根据权限显示创建按钮
                showCreateBtn: true,
                // 搜索按钮禁用
                searchBtnAbled: false,
                // 路线列表
                pathTableList:[
                    {
                        pathLine:'线路一',
                        city:'广州市',
                        resName:'天河区(12)',
                        mediaName:'广告门(56)',
                        ads:'156',
                        time:'2019/5/21 14:15:22'
                    },
                    {
                        pathLine:'线路二',
                        city:'广州市',
                        resName:'越秀区(22)',
                        mediaName:'广告门(56)',
                        ads:'100',
                        time:'2019/5/12 12:19:36'
                    },
                    {
                        pathLine:'线路三',
                        city:'广州市',
                        resName:'荔湾区(38)',
                        mediaName:'广告门(156)',
                        ads:'199',
                        time:'2019/5/30 17:15:45'
                    },
                ],
                // 新建弹出框
                createDialogVisible: false,
                // 创建的路线数据
                createData:{
                    city:'',
                    pathLine:'',
                    resName:''
                },
                // 创建路线的表单验证
                createRules:{
                    city: [
                        { required: true, message: '请输入选择城市', trigger: 'change' },
                    ],
                    pathLine: [
                        { required: true, message: '请输入路线名称', trigger: 'change' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
                    ],
                    resName:[
                        // { required: true, message: '请输入路线名称', trigger: 'blur' },
                    ]
                },
                // 可选择的小区列表
                resList:[
                    {value:'1',label:'小区1'},
                    {value:'2',label:'小区2'},
                    {value:'3',label:'小区3'},
                    {value:'4',label:'小区4'}
                ],
                // 线路详情
                detailDialogVisible: false,
                detailList:[
                    {
                        resName:'中信西关海二期',
                        area:'荔湾区',
                        tradingArea:'荔湾湖商圈',
                        buildType:'住宅',
                        address:'广州市荔湾区中山八路西关路48号'
                    }
                ],
                // 编辑状态
                isEdit: false,
                activePathName:'',
            }
        },
        mounted(){

        },
        methods:{
            // 搜索按钮
            searchFun() {

            },
            // 重置搜索
            clearSearch(){
                this.selectCity = '';
                this.selectPath = '';
            },
            // 新建线路
            createPath(){
                this.createDialogVisible = true
            },
            // 查看详情
            showDetail(row){
                this.activePathName = row.pathLine
                this.detailDialogVisible = true
            },
            handleClose(done) {
                console.log('done',done)
                this.createDialogVisible = false
                // this.$confirm('确认关闭？') .then(_ => {
                //         done();
                //     }).catch(_ => {
                //
                // });
            },
            //创建的表单验证
            submitForm(formName) {
                console.log('formName',formName)
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        console.log('submit!');
                        this.createDialogVisible = false
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 新增一行
            AddRow(){
                this.detailList.unshift({
                    resName:'',
                    area:'',
                    tradingArea:'',
                    buildType:'',
                    address:'',
                    isInput: true,
                });
            },
        },
    }
</script>

<style scoped>
    /*面包屑*/
    .ad_breadcrumb{
        height: 42px;
        line-height: 42px;
        font-size: 14px;
        color: rgb(153,153,153);
        width: 100%;
    }
    .ad_breadcrumb p{
        width: 92%;
        margin: 0 auto;
    }
    /*搜索条件*/
    .handel_ul_li{
        margin-right: 32px;
    }
    .handel_ul_li_area{
        width: 23%;
    }
    /deep/ .handel_ul .el-select{
        width: calc(100% - 74px);
    }
    /deep/ .el-pagination__jump{
        margin-left: 0;
    }
        /*详情按钮*/
    .detail_btn{
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
        color: rgba(24,144,255,1);
    }
    .add_res:hover{
        border-color: rgba(24,144,255,1);
    }
    /*弹出框标题*/
    /deep/ .el-dialog__title{
        font-weight: 600;
        font-size:16px;
        color:rgba(0,0,0,0.85);
    }
    /deep/ .el-dialog__header{
        padding: 16px 20px;
        border-bottom: 1px solid rgba(0,0,0,0.09);
    }
    /*详情*/
    .path_detail_box /deep/ .el-input--small .el-input__inner{
        height: 30px;
        line-height: 30px;
    }
    .detail_table_row_btn{
        color: rgba(24,144,255,1);
        cursor: pointer;
    }
</style>
