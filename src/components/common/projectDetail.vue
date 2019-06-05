<template>
    <div class="ad_mediaDetail_wrap">
        <div class="ad_mediaDetail_nav clearfix">
            <p>
                <a href="#">工程管理</a>
                <em> / </em>
                <a href="#">工程详情</a>
            </p>
        </div>
        <div class="comList_wrap">
            <div class="pro_content_top">
                <el-row class="top_row">
                    <el-col :span="12">
                        <h4>
                            <img src="../../assets/images/planlogo.png" alt="">                                
                            上画清单
                        </h4>
                    </el-col>
                    <el-col :span="12" class="text_right">
                        <el-button size="small" @click="download()">导出清单</el-button>
                        <el-button type="primary" size="small" @click="toDistribute()">分配人员</el-button>
                    </el-col>
                </el-row>
                <el-row class="same_padding">
                    <el-col :span="5">
                        <b>所属线路：</b>
                        <span>{{projectInfo.lineName}}</span>
                    </el-col>
                    <el-col :span="5">
                        <b>工程人员：</b>
                        <span>{{projectInfo.engineer}}</span>
                    </el-col>
                    <el-col :span="5">
                        <b>小区数量：</b>
                        <span>{{projectInfo.resNum}}</span>
                    </el-col>
                    <el-col :span="5">
                        <b>点位数量：</b>
                        <span>{{projectInfo.adsNum}}</span>
                    </el-col>
                    <el-col :span="4" class="text_right">
                        <span>上画状态</span>
                    </el-col>
                </el-row>
                <el-row class="same_padding">
                    <el-col :span="5">
                        <b>上画时间：</b>
                        <span>{{projectInfo.photoTime}}</span>
                    </el-col>
                    <el-col :span="5">
                        <b>订单数量：</b>
                        <span>{{projectInfo.orderNum}}</span>
                    </el-col>
                    <el-col :span="5">
                        <b>媒体数量：</b>
                        <span>{{projectInfo.mediaNum}}</span>
                    </el-col>
                    <el-col :span="5">
                        <b>已上画数：</b>
                        <span>{{projectInfo.finishNum}}</span>
                    </el-col>
                    <el-col :span="4"  class="text_right state_text">
                        <b>{{projectInfo.progress}}</b>
                    </el-col>
                </el-row>
            </div>
            <div class="pro_detail_container">
                <el-tabs>
                    <el-tab-pane v-for="(item, index) in projectOrderList" :key="item.orderId" :label="'订单'+toChinesNum(index+1)">
                        <div class="table_wrap">
                            <el-row>
                                <h4>{{item.orderName}}</h4>
                            </el-row>
                            <el-row class="car-title">
                                <i class="el-icon-info" style="color: #1890FF;"></i>                            
                                订单:<span>{{projectInfo.orderNum}}</span>
                                小区:<span>{{projectInfo.resNum}}</span>
                                媒体:<span>{{projectInfo.mediaNum}}</span>
                                点位:<span>{{projectInfo.adsNum}}</span>
                                已上画:<span>{{projectInfo.finishNum}}</span>
                            </el-row>
                            <el-table border :data="item.asidList">
                                <el-table-column type="index" label="序号" width="60">
                                </el-table-column>
                                <el-table-column prop="resName" label="小区" min-width="120">
                                </el-table-column>
                                <el-table-column prop="mTitle" label="媒体">
                                </el-table-column>
                                <el-table-column prop="asLab" label="投放面">
                                </el-table-column>
                                <el-table-column prop="adSize" label="广告尺寸">
                                </el-table-column>
                                <el-table-column prop="assetTag" label="资产编号">
                                </el-table-column>
                                <el-table-column prop="resAddress" label="详情地址" min-width="250">
                                </el-table-column>
                                <el-table-column prop="mRemark" label="点位备注">
                                </el-table-column>
                                <el-table-column prop="state" label="状态" width="80">
                                    <template slot-scope="scope">
                                        <span class="point">
                                            <b :style="{background:scope.row.state==1?'rgba(82,196,26,1)':'rgba(250,173,20,1)'}"></b>
                                            {{(scope.row.state == 1?'已完成':'未完成')}}
                                        </span>
                                    </template>
                                </el-table-column>
                                <el-table-column label="素材" width="60" >
                                    <template slot-scope="scope">
                                            <span @click="toShowImg(scope.row)" class="link_text">查看</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>

                <div class="content_bottom_btn">
                    <el-button class="cancel" @click="goBack()" size="small">返回</el-button>                
                </div>
            </div>
        </div>

        <!-- 分配人员弹出框 -->
        <el-dialog title="分配上画人员"
            :visible.sync="isShowDistri"
            custom-class="size_detail_dialog"            
            width="400px">
            <el-select v-model="currEngineer" placeholder="请选择" size="small" multiple>
                <el-option v-for="item of engineerArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDistri = false" size="small">取 消</el-button>
                <el-button type="primary" @click="confirmDistribute" size="small">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 查看素材 -->
        <el-dialog :visible.sync="isShowImg" class="imgPreview">
            <img  :src="dialogImageUrl" alt="素材" />
        </el-dialog>
    </div>
</template>

<script>
    import {
        MessageBox,
        Message,
    } from "element-ui";
    // 时间控件格式化
    import dateFormat from "../../commonFun/timeFormat.js";
    import sessFun from '../../commonFun/sessFun.js'    
    import api from "../../api/api.js";
    export default {
        data(){
            return{
                // 搜索数据
                projectInfo:{
                    line: '线路一',
                    engineer: [],
                    progress: 0.8,
                    photoTime: '2019-06-01',
                    truePhotoTime: '2019-06-02',
                    orderNum: 2,
                    resNum: 34,
                    mediaNum: 45,
                    adsNum: 65,
                    finishNum: 5
                },
                // 城市
                cityArr: [],
                // 线路
                lineArr: [],
                // 工程人员
                engineerArr: [],
                isShowDistri: false,
                currEngineer: [],
                // 展示图片
                isShowImg: false,
                // 图片url
                dialogImageUrl: '',
                // 订单
                orderArr: [],
                // 表格数据
                projectOrderList: [
                    {
                        orderId: 2,
                        orderName: '鑫苑国际新城1',
                        resNum: 34,
                        mediaNum: 45,
                        adsNum: 67,
                        finishNum: 5,
                        progress: 0.83,
                        asidList: [
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 2,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                        ],
                    },
                    {
                        orderId: 1,
                        orderName: '鑫苑国际新城2',
                        resNum: 34,
                        mediaNum: 45,
                        adsNum: 67,
                        finishNum: 5,
                        progress: 0.83,
                        asidList: [
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                            {
                                resID: 123,
                                resName: '21世纪美墅加州风情',
                                mTitle: '南门进',
                                asLab: 'A',
                                adSize: '125*160',
                                assetTag: 'ZJ0305+1',
                                mRemark: '小区A',
                                materialUrl: '',
                                resAddress: '水科路与花园北路交叉口向东750米路北',
                                state: 1,
                            },
                        ],
                    },
                ],           
            }
        },
        methods:{
            // // 导出excel
            // download(){
            //     let resultArr = [];
            //     require.ensure([], () => {
            //         const { export_json_to_excel } = require('../../vendorExcel/Export2Excel');
            //         const tHeader = ['上画时间', '所属线路', '工程人员', '上画状态', '订单', '资源名称', '媒体', '投放面', '物料尺寸', '资产编号', '点位备注', '素材', '详细地址', '城市', '区域', '实际上刊时间'];
            //         const filterVal = ['photoTime', 'line', 'engineer', 'progress', 'orderName', 'resName', 'mTitle', 'asLab', 'adSize', 'assetTag', 'mRemark', 'materialUrl', 'resAddress', 'city', 'rName', 'truePhotoTime'];
            //         const list = resultArr;
            //         const data = this.formatJson(filterVal, list);
            //         export_json_to_excel(tHeader, data, name);
            //     })
            // },
            // formatJson(filterVal, jsonData) {
            //     return jsonData.map(v => filterVal.map(j => v[j]))
            // },
            // 导出清单
            download(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    publishId: sessionStorage.getItem('taskId'),
                };
                api.getApi_file(this.apiVar.publishPaintTask+"/export", info).then(res =>{
                    console.log(res.data);

                }).catch(err =>{
                    console.log(err);
                });
            },
            // 分配人员
            toDistribute(){
                this.currEngineer = this.projectInfo.engineerArr.map((data, index)=> {
                    return data.value
                });
                this.getEngineer();
                this.isShowDistri = true;
            },
            // 工程人员列表
            getEngineer(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    service: "GetEPByAsrID",
                    data: {
                        asrID: sess.asrID,
                    }
                };
                api.postApi_new(this.apiVar.Media, info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        this.engineerArr = res.data.data.map((item, index) =>{
                            return {
                                value: item.uID,
                                label: item.realName
                            }
                        });
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            },
            // 确认分配工程人员
            confirmDistribute(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    taskId: this.projectInfo.photoId,
                    userIds: this.currEngineer.join(','),
                };
                api.postApi(this.apiVar.publishPaintTask+"/setEngineerUser", info).then(res =>{
                    if(res.data.SysCode == 200200){

                        Message.success(res.data.MSG);
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                });
            },
            // 获取详情
            getData(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    publishId: sessionStorage.getItem('taskId'),
                };
                api.getApi(this.apiVar.publishPaintTask+"/detail", info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        let resInfo = res.data.data;
                        this.projectInfo = this.setData(resInfo);
                        this.projectOrderList = this.setTableData(resInfo.orderList);
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        Message.warning(res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            },
            // 设置数据格式
            setData(item){
                let obj = {
                    photoId: item.publishId,
                    photoTime: item.publishDate,
                    line: item.lineId,
                    lineName: item.lineName,
                    photoNum: item.publishPaintCount,
                    mediaNum: item.mediaCount,
                    resNum: item.resourceCount,
                    engineerArr: [],
                    engineer: "",
                    progress: item.publishProgress,
                    finishNum: item.finishNum,
                    orderNum: item.orderList.length,
                };
                obj.engineer = item.engineerMember?item.engineerMember.map((data, index) =>{
                    return data.userName;
                }).join('/'): '';
                obj.engineerArr = item.engineerMember?item.engineerMember.map((data, index) =>{
                    return {
                        label: data.userName,
                        value: data.userId,
                    };
                }): [];
                return obj;
            },
            // 设置表格数据
            setTableData(arr){
                let result = [];
                result = arr.map((item, index)=>{
                    let info = {
                        orderId: item.orderId,
                        orderName: item.orderName,

                        resNum: item.resNum,
                        mediaNum: item.mediaNum,
                        adsNum: item.adsNum,
                        finishNum: item.finishNum,
                        progress: item.progress,
                        asidList: []
                    };
                    info.asidList = item.resourceList.map((data, daIndex)=>{
                        return {
                            resID: data.resourceId,
                            resName: data.resourceName,
                            mTitle: data.mediaName,
                            asLab: data.asName,
                            adSize: data.resourceSize,
                            assetTag: data.assetNumber,
                            mRemark: data.remark,
                            materialUrl: data.material,
                            resAddress: data.address,
                            state: data.publishStatus,
                        }
                    });
                    return info;
                });
                return result;
            },
            // 数字转换为中文
            toChinesNum(num){
                let changeNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
                let unit = ["", "十", "百", "千", "万"];
                num = parseInt(num);
                let getWan = (temp) => {
                let strArr = temp.toString().split("").reverse();
                let newNum = "";
                for (var i = 0; i < strArr.length; i++) {
                    newNum = (i == 0 && strArr[i] == 0 ? "" : (i > 0 && strArr[i] == 0 && strArr[i - 1] == 0 ? "" : changeNum[strArr[i]] + (strArr[i] == 0 ? unit[0] : unit[i]))) + newNum;
                    }
                    return newNum;
                }
                let overWan = Math.floor(num / 10000);
                let noWan = num % 10000;
                if (noWan.toString().length < 4) {
                    noWan = "0" + noWan;
                }
                return overWan ? getWan(overWan) + "万" + getWan(noWan) : getWan(num);
            },
            // 查看素材
            toShowImg(row){
                this.dialogImageUrl = row.materialUrl;
                this.isShowImg = true;
            },
            // 返回
            goBack() {
                this.$router.push("./projectList");
            },
        },
        mounted(){
            this.sessionData = sessFun.getSess();
            this.getEngineer();
            this.getData();
        },
    };
</script>
<style scoped>
    /*面包屑导航*/
    .ad_mediaDetail_wrap {
        position: relative;
    }
    .ad_mediaDetail_nav{
        width: 92%;
        margin: 0 auto;
    }
    .ad_mediaDetail_nav p {
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaDetail_nav p a {
        color: #666;
    }

    .ad_mediaDetail_nav {
        height: 42px;
        position: relative;
    }
    /deep/.comList_container .el-input{
        max-width: 180px;
    }
    /deep/.comList_container .el-row{
        margin-top:24px;
    }

    .comList_wrap {
        width: 92%;
        margin: 0 auto;
    }

    .pro_content_top, .pro_detail_container{
        background:#fff;
        border:1px solid rgba(230,231,233,1);
        padding: 24px 32px;
    }
    .pro_content_top .el-row b{
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,1);
    }
    .pro_content_top .el-row span{
        font-size:14px;
        font-family:PingFangSC-Regular;
        font-weight:400;
        color:rgba(0,0,0,0.85);
    }
    .top_row{
        margin-bottom: 16px;
    }
    .top_row h4{
        font-size: 20px;
        font-weight: bold;
        font-family: PingFangSC-Medium;
        color: rgba(0,0,0,0.85);
    }
    .top_row h4 img{
        width: 28px;
        height: 28px;
        margin-right: 6px;
        vertical-align: bottom;
    }
    .same_padding{
        margin-bottom: 8px;
        padding-left: 40px;
    }
    .pro_detail_container{
        margin: 24px 0;
        padding: 0;
        
    }
    .el-col-24{
        width: auto;
    }
    /*表格*/
    /deep/.pro_detail_container .el-table th {
        height: 44px;
        padding: 0;
        background-color: #f7f7f7;
    }
    /deep/.pro_detail_container .el-table td {
        padding: 8px 0;
        overflow-x: hidden;
        text-overflow: ellipsis;
    }

    /deep/.pro_detail_container .el-table--border {
        border-radius: 4px;
    }

    /deep/.pro_detail_container .el-table th > .cell {
        font-size: 14px;
        color: #666666;
        font-weight: bold;
    }
    /deep/.pro_detail_container .el-table tr {
        height: 54px;
    }
    /* 各个属性个数等 */
    .car-title {
        background: #E6F7FF;
        border: 1px solid #BAE7FF;
        border-radius: 4px;
        margin-bottom: 16px;
        padding: 5px;
    }

    .car-title h4 {
        font-size: 14px;
        display: inline-block;
    }

    .car-title p {
        font-size: 14px;
        font-weight: normal;
        display: inline-block;
        margin-left: 10px;
    }

    .car-title span {
        font-size: 14px;
        font-weight: normal;
        margin: 0 6px;
        cursor: pointer;
        color: #1890ff;
    }
    .text_right{
        text-align:right;
    }
    .pro_content_top .state_text b{
        color:rgba(0,0,0,0.85);
        font-size: 20px;        
    }
    .table_wrap{
        padding: 10px 32px; 
    }
    .table_wrap h4{
        font-size: 20px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(0,0,0,0.85);
        height: 34px;
        line-height: 10px;
    }
    /deep/ .pro_detail_container .el-tabs__header{
        border-bottom: 1px solid #e6e7e9;
        height: 53px;
        line-height: 54px;
    }
    /deep/.pro_detail_container  .baojiadan .el-tabs__header{
        border-bottom: none;
        height: 38px;
        line-height: 38px;
        background-color: #f5f7fa;
        border-bottom: 1px solid #e4e7ed;
        margin: 0;
    }
    /deep/ .el-tabs__nav-scroll {
        padding-left: 32px;
    }

    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
        background-color: transparent;
        border: none;
    }
    /deep/ .el-tabs--border-card>.el-tabs__header .el-tabs__item{
        border: none;
    }
    /deep/ .el-tabs__item:focus.is-active.is-focus:not(:active){
        box-shadow: none;
    }
    /deep/ .size_detail_dialog .el-dialog__header{
        font-weight: bold;
        padding: 16px;
        border-bottom: 1px solid #E8E8E8;
    }
    /deep/ .size_detail_dialog .el-dialog__footer{
        border-top: 1px solid #E8E8E8;
        padding: 16px;
    }
    .content_bottom_btn {
        margin: 20px;
        width: 100%;
        text-align: center;
    }
    .link_text{
        color: rgb(16, 142, 233);
        cursor: pointer;
        font-size: 14px;
    }
    .point b{
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }
</style>


