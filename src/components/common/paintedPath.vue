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
                    <li class="handel_ul_li handel_ul_li_select">
                        <el-select v-model="selectCity" filterable placeholder="请选择城市" :clearable="true"
                                   style="width: 100%" size="small" @change="">
                            <el-option
                                v-for="item in cityList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </li>
                    <li class="handel_ul_li handel_ul_li_area">
                        <el-select v-model="selectPath" filterable placeholder="请选择线路" :clearable="true"
                                   style="width: 100%" size="small" @change="">
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
                                <span class="detail_btn" @click="showDetail">查看详情</span>
                            </template>
                        </el-table-column>
                    </el-table>
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
            title="线路名称"
            :visible.sync="detailDialogVisible"
            width="340">
            <div>
                <el-table
                    element-loading-text="拼命加载中..."
                    element-loading-spinner="el-icon-loading"
                    border
                    :data="pathTableList"
                    height="240"
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
                            <span class="detail_btn" @click="showDetail">查看详情</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="detailDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="detailDialogVisible = false">确 定</el-button>
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
                detailDialogVisible: false
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
            showDetail(){
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
    /*详情按钮*/
    .detail_btn{
        cursor: pointer;
        color: #2a98fe;
    }
</style>
