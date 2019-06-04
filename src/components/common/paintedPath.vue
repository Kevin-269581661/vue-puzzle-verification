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
                        <span class="handel_ul_li_title">所属线路:</span>
                        <el-input v-model="selectPath" size="small" placeholder="请输入线路名称"></el-input>
                    <!--    <el-select v-model="selectPath" filterable placeholder="请选择线路" :clearable="true"
                                   size="small" @change="">
                            <el-option v-for="item in pathList"
                                       :key="item.value"
                                       :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>-->
                    </li>
                    <li class="handel_ul_li handel_ul_li_btn">
                        <el-button type="primary" :disabled="searchBtnAbled" @click="searchFun">搜索</el-button>
                        <el-button @click="clearSearch">重置</el-button>

                    </li>
                    <li class="handel_ul_li handel_ul_li_Newbtn" v-if="showCreateBtn">
                        <el-button type="primary" icon="el-icon-plus" @click="createPath">新建</el-button>
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
                            min-width="30%">
                        </el-table-column>
                        <el-table-column
                            prop="mediaInfo"
                            label="覆盖媒体"
                            min-width="20%">
                        </el-table-column>
                        <el-table-column
                            prop="pointCount"
                            label="覆盖点位"
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
                                <span class="detail_btn" @click="showDetail(scope.row)">查看详情</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="ad_pagination">
                    <el-pagination
                        background
                        layout="total, prev, pager, next, sizes, jumper"
                        @current-change="changePage"
                        :page-sizes="[10, 20, 30, 40]"
                        :total="300">
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
                <el-form :model="createData" :rules="createRules" ref="createData" label-width="92px" class="demo-ruleForm">
                    <el-form-item label="线路名称:" prop="pathLine">
                        <el-input v-model="createData.pathLine" placeholder="请选择输入线路名称"></el-input>
                    </el-form-item>
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
            class="path_detail"
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
                        prop="resourceName"
                        label="覆盖资源"
                        min-width="20%">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isInput">{{scope.row.resourceName}}</span>
                            <el-select v-model="scope.row.resourceName" filterable placeholder="请选择资源" :clearable="true"
                                       style="width: 100%" size="small" @change="changeRes">
                                <el-option
                                    v-for="item in resList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                      <!--      <el-input v-else v-model="scope.row.resourceName" placeholder="小区名称" size="small"></el-input>-->
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="regionName"
                        label="区域"
                        min-width="17">
                        <template slot-scope="scope">
                            <span v-if="!scope.row.isInput">{{scope.row.regionName}}</span>
                            <el-input v-else v-model.trim="scope.row.regionName" placeholder="区域" size="small"></el-input>
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
                            <span class="detail_table_row_btn">{{scope.row.isInput ? '取消' : '删除'}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="add_res" @click="AddRow()" v-show="isEdit">
                    <i class="el-icon-plus" style="color: rgba(24,144,255,1)"></i>
                    添加
                </div>
            </div>
            <div slot="footer" class="dialog-footer path_detail_footer">
                <el-button v-if="isEdit" @click="isEdit = false">取 消</el-button>
                <el-button v-else @click="isEdit = true">编 辑</el-button>
                <el-button type="primary" @click="detailDialogVisible = false">{{isEdit ? '保 存' : '关 闭'}}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { api } from "../../api/api";
    export default {
        name: "paintedPath",
        data(){
            return{
                // 用户登录信息
                sessionData: '',
                // 页码及条数
                pageData:{
                    pageNo: 1,
                    pageSize: 10,
                },
                // 表格高度
                tableHeight: 595,
                //加载中
                tableLoading: true,
                cityList: [],
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
                pathTableList:[],
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
                    pathLine: [
                        { required: true, message: '请输入路线名称', trigger: 'change' },
                        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'change' }
                    ],
                    city: [
                        { required: true, message: '请输入选择城市', trigger: 'change' },
                    ],
                    resName:[
                        // { required: true, message: '请输入路线名称', trigger: 'blur' },
                    ]
                },
                // 可选择的小区列表 440105海珠区
                resList:[
                    {value:'45813',label:'阳光名苑',area:'荔湾区'},
                    {value:'44072',label:'雅郡花园',area:'荔湾区'},
                    {value:'42438',label:'珠江国际公馆',area:'荔湾区'},
                    {value:'40955',label:'海印南苑',area:'荔湾区'}
                ],
                // 线路详情
                detailDialogVisible: false,
                detailList:[],
                // 编辑状态
                isEdit: false,
                activePathName:'',
            }
        },
        mounted(){
            this.getSessionData()
            this.getTableList()
            this.getCity()
        },
        methods:{
            getSessionData(){
                this.sessionData = JSON.parse(sessionStorage.getItem('session_data'))
            },
            // 搜索按钮
            searchFun() {
                this.getTableList()
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
            // 分页
            changePage(val){
                console.log('当前页',val)
            },
            // 获取表格数据
            getTableList(){
                let params = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    name: this.selectPath,
                    pageNo: this.pageData.pageNo,
                    pageSize: this.pageData.pageSize,
                }
                if(!params.name){
                    delete params.name
                }
                this.tableLoading = false
                api.getApi(this.apiVar.engineer + '/list',params).then(res=>{
                    console.log('线路列表接口',res)
                    if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                        this.setTableData(res.data.data)
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout()
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
            },
            // 设置表格数据
            setTableData(tableData){
                let lineArr = []
                for(let key of tableData){
                    let obj = {
                        lineId: key.lineId,
                        lineName: key.lineName,
                        regionInfo: '',
                        mediaInfo: '',
                        pointCount: key.pointCount,
                        updateTime: key.updateTime
                    }
                    // 覆盖小区
                    for(let rKey of key.regionInfo){
                        obj.regionInfo += rKey.regionName + '('+ rKey.count +')' + ' / '   // 斜杠前后有空格
                    }
                    obj.regionInfo = obj.regionInfo.substr(0,obj.regionInfo.length-2)
                    // 覆盖媒体
                    if(Array.isArray(key.mediaTypeInfo)){
                        for(let mKey of key.mediaTypeInfo){
                            obj.mediaInfo += mKey.mediaName + '('+ mKey.mediaCount +')' + ' / '
                        }
                        obj.mediaInfo = obj.mediaInfo.substr(0,obj.mediaInfo.length-2)
                    }else{
                        obj.mediaInfo = key.mediaTypeInfo || '--'
                    }
                    lineArr.push(obj)
                }
                this.pathTableList = lineArr
            },
            // 获取城市
            getCity(){
                let info = {
                    "token": this.sessionData.token,
                    "uid": this.sessionData.uID
                };
                api.postApi(this.apiVar.Advertisement+'/GetAuthorCity', info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 300200){
                        let resinfo = res.data.data;
                        let result = [];
                        for(let data of resinfo){
                            let obj = {
                                label: data.rName,
                                value: data.rID.toString()
                            };
                            result.push(obj);
                        }
                        this.cityList = result;
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                });
            },
            // 查看详情 detailList
            showDetail(row){
                this.activePathName = row.lineName
                let params = {
                    uid:this.sessionData.uID,
                    token: this.sessionData.token,
                    lineId: row.lineId
                }
                api.getApi(this.apiVar.engineer + '/detail', params).then(res => {
                    console.log('线路详情res', res)
                    if (res.data.SysCode == 200200 || res.data.MSG === "成功") {
                        this.setDetailData(res.data.data)
                    } else if (res.data.SysCode == 100302) {
                        this.loginTimeout()
                    } else {
                        this.messageFun('warning', res.data.MSG)
                    }
                })
                this.detailDialogVisible = true
            },
            // 线路详情
            setDetailData(lineData){
                console.log('线路详情lineData',lineData)
                if(Array.isArray(lineData)){
                    let detailList = []
                    for(let key of lineData){
                        detailList.push({
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
                    this.detailList = detailList
                }
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
                        console.log('submit!',this.createData);
                        this.creatLine()
                        // this.createDialogVisible = false
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 新建线路
            creatLine(){
              let params = {
                  uid: this.sessionData.uID,
                  token: this.sessionData.token,
                  cityId: this.createData.city,
                  name: this.createData.pathLine,
                  resourceIds: this.createData !== '' ? this.createData.resName.join(',') : '',
              }
              console.log('新建线路params',params)
              api.postApi(this.apiVar.engineer + '/create', params).then(res=>{
                  console.log('新建线路res',res)
                  if (res.data.System == 200200 || res.data.MSG === "成功") {
                      this.messageFun('success', '新建成功')
                      this.createDialogVisible = false
                  } else if (res.data.SysCode == 100302) {
                      this.loginTimeout()
                  } else {
                      this.messageFun('warning', res.data.MSG)
                  }
              })
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
            // 操作提示统一方法
            messageFun(mesType,mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            // 登录超时
            loginTimeout() {
                this.$message({
                    message: '登录超时或权限异常,请重新登录',
                    type: 'warning'
                })
                this.$router.push('/login')
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
    .handel_ul_li_Newbtn{
        float: right;
        text-align: right;
        margin-right:0
    }

    /deep/ .handel_ul .el-input{
        width: calc(100% - 68px);
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
    /deep/ .el-dialog__body{
        padding: 32px;
    }
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
    .path_detail /deep/ .el-dialog__footer{
        border-top: 1px solid rgba(0,0,0,0.09);
    }
    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        height: 450px;
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
    .el-table th, .el-table tr{
        height: 44px;
        padding: 0;
        background-color: #f7f7f7;
    }
</style>
