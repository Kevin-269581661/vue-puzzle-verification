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
                        <el-button size="small" @click="toSetLine()" v-if="!projectInfo.line">设置线路</el-button>
                        <el-button size="small" @click="download()" :loading="downLoading">导出清单</el-button>
                        <el-button type="primary" size="small" @click="toDistribute()">分配人员</el-button>
                    </el-col>
                </el-row>
                <el-row class="same_padding">
                    <el-col :span="5">
                        <b>所属线路：</b>
                        <span>{{projectInfo.lineName||'未设置'}}</span>
                    </el-col>
                    <el-col :span="5">
                        <b>工程人员：</b>
                        <span>{{projectInfo.engineer||'--'}}</span>
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
                        <span>上画进度</span>
                    </el-col>
                </el-row>
                <el-row class="same_padding">
                    <el-col :span="5">
                        <b>上画时间：</b>
                        <span>{{projectInfo.photoTime}}</span>
                        <el-tooltip placement="top" width="200" trigger="hover" effect="dark" v-if="projectInfo.photoTime>new Date()">
                            <div slot="content">
                                距离上画剩余 <span :style="remainDay<=3?'color:red;':''">{{remainDay}}</span> 天
                            </div>
                            <i class="fa fa-info-circle"></i>
                        </el-tooltip>
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
                        <b>{{projectInfo.progress}}%</b>
                    </el-col>
                </el-row>
            </div>
            <div class="pro_detail_container">
                <el-tabs @tab-click="handleClick" v-model="currentOrder">
                    <el-tab-pane v-for="(item, index) in tabOrderList" :name="item.orderId?item.orderId.toString():''" :key="item.orderId" :label="'订单'+toChinesNum(index+1)">
                        <el-row class="order_row">
                            <h4>{{item.orderName}}</h4>
                        </el-row>
                    </el-tab-pane>
                </el-tabs>
                <div class="table_wrap">
                    <el-row class="car-title">
                        <i class="el-icon-info" style="color: #1890FF;"></i>
                        小区:<span>{{tableNumInfo.resNum}}</span>
                        媒体:<span>{{tableNumInfo.mediaNum}}</span>
                        点位:<span>{{tableNumInfo.adsNum}}</span>
                        已上画:<span>{{tableNumInfo.finishNum}}</span>
                        上画率:<span>{{tableNumInfo.progress}}%</span>
                    </el-row>
                    <el-table border :data="currAsidList" v-loading="loading" 
                        element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
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
                        <el-table-column prop="resAddress" label="详情地址" min-width="250" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>
                                    {{scope.row.resAddress || '--'}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="mRemark" label="点位备注" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>
                                    {{scope.row.mRemark || '--'}}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="state" label="状态" width="80">
                            <template slot-scope="scope">
                                <span class="point">
                                    <b :style="{background:scope.row.state==1?'rgba(82,196,26,1)':'rgba(250,173,20,1)'}"></b>
                                    {{(scope.row.state == 1?'已上画':'未上画')}}
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

                <div class="content_bottom_btn">
                    <el-button class="cancel" @click="goBack()" size="small">返回</el-button>
                </div>
            </div>
        </div>

        <!-- 设置线路弹出框 -->
        <el-dialog title="设置线路"
            :visible.sync="isShowLine"
            custom-class="size_detail_dialog line_box">
            <el-table border :data="resList" height="450">
                <el-table-column prop="resName" label="小区" >
                </el-table-column>
                <el-table-column prop="area" label="区域">
                </el-table-column>
                <el-table-column prop="line" label="选择线路">
                    <template slot-scope="scope">
                        <el-select v-model="scope.row.lineId" placeholder="请选择线路" size="small">
                            <el-option v-for="item of lineArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowLine = false" size="small">取 消</el-button>
                <el-button type="primary" @click="updateLine()" size="small" :loading="updateLoading">更 新</el-button>
            </span>
        </el-dialog>

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
                <el-button type="primary" @click="confirmDistribute" size="small" :loading="disTriLoading">确 定</el-button>
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
import timeFormat from '../../commonFun/timeFormat.js';
    export default {
        data(){
            return{
                // 当前订单
                currentOrder: '',
                remainDay: 0,
                // 任务数据
                projectInfo:{
                    line: '线路一',
                    engineer: '',
                    progress: 0.8,
                    photoTime: '2019-06-01',
                    truePhotoTime: '2019-06-02',
                    orderNum: 2,
                    resNum: 34,
                    mediaNum: 45,
                    adsNum: 65,
                    finishNum: 5
                },
                // 线路
                lineArr: [],
                isShowLine: false,
                // 小区列表
                // resList: [],
                resList: [
                    {
                        resID: 1,
                        resName: '小区一',
                        area: '天河区',
                        lineId: 25,
                        lineName: '',
                    },
                    {
                        resID: 2,
                        resName: '小区二',
                        area: '天河区',
                        lineId: '',
                        lineName: '',
                    },
                ],
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
                // tab数据
                tabOrderList: [],
                // 表格数据
                currAsidList: [],
                // 表格数据统计
                tableNumInfo:{
                    resNum: 34,
                    mediaNum: 45,
                    adsNum: 67,
                    finishNum: 5,
                    progress: 0.83,
                },
                // 表格loading
                loading: true,                
                // 更新loading
                updateLoading: false,
                // 导出loading
                downLoading: false,
                // 分配人员loading
                disTriLoading: false,
            }
        },
        methods:{
            handleClick(){
                console.log(this.currentOrder);
                this.getTableData(this.currentOrder);
            },
            // 设置线路
            toSetLine(){
                if(!this.lineArr.length){
                    this.getResList();
                    this.getLine();
                }
                this.isShowLine = true;
            },
            // 导出清单
            download(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    taskId: sessionStorage.getItem('taskId'),
                };
                this.downLoading = true;
                api.getApi_file(this.apiVar.publishPaintTask+"/taskDetailsReport", info).then(res =>{
                    console.log(res.data);
                    let blob = new Blob([res.data], {type: 'application/vnd.ms-excel;charset=utf-8'});
                    let downloadElement = document.createElement('a');
                    let href = window.URL.createObjectURL(blob); //创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = decodeURI(res.headers['content-disposition'].split('=')[1]); //下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); //点击下载
                    document.body.removeChild(downloadElement); //下载完成移除元素
                    window.URL.revokeObjectURL(href); //释放掉blob对象
                    this.downLoading = false;
                }).catch(err =>{
                    console.log(err);
                    this.downLoading = false;
                });
            },
            // 分配人员
            toDistribute(){
                this.currEngineer = this.projectInfo.engineerArr.map(data=> {
                    return data.value
                });
                if(!this.engineerArr.length){
                    this.getEngineer();
                }
                this.isShowDistri = true;
            },
            // 线路列表
            getLine(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    getAll: 1,
                };
                api.getApi(this.apiVar.engineer+"/list", info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        let resinfo = res.data.data.data;
                        this.lineArr = resinfo ? resinfo.map(item =>{
                            return {
                                label: item.lineName,
                                value: item.lineId,
                            };
                        }): [];
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        this.messageFun('warning', res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            },
            // 获取小区列表
            getResList(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    taskId: this.projectInfo.photoId
                };
                api.getApi(this.apiVar.publishPaintTask + "/listResource", info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        let resinfo = res.data.data;
                        this.resList = resinfo ? resinfo.map(item =>{
                            return {
                                resID: item.resourceId,
                                resName: item.resourceName,
                                area: item.regionName,
                                lineId: '',
                                lineName: '',
                            };
                        }): [];
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        this.messageFun('warning', res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            },
            // 更新线路小区关联
            updateLine(){
                console.log(this.resList, 'reslist---');
                let result = this.resList.filter(item =>{
                    return item.lineId;
                });
                console.log('result---', result);
                let arr = result.map(item => {
                    return {
                        lineId: item.lineId,
                        resId: item.resID
                    };
                });
                if(arr.length){
                    let sess = this.sessionData;
                    let info = {
                        uid: sess.uID,
                        token: sess.token,
                        resources: JSON.stringify(arr)
                    };
                    this.updateLoading = true;
                    api.postApi(this.apiVar.engineer+"/updateResourceLine", info).then(res =>{
                        console.log(res.data);
                        if(res.data.SysCode == 200200){
                            this.isShowLine = false;
                            if(result.length >= this.resList.length){
                                this.$router.push('./projectList');
                            }else{
                                location.reload(false);
                            }
                        }else if(res.data.SysCode == 100302){
                            this.loginTimeout();
                        }else{
                            this.messageFun('warning', res.data.MSG);
                        }
                        this.updateLoading = false;
                    }).catch(err =>{
                        console.log(err);
                        this.updateLoading = false;
                    });
                }else{
                    this.messageFun('warning', '请先关联小区再更新');
                }
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
                        this.engineerArr = res.data.data.map(item =>{
                            return {
                                value: item.uID,
                                label: item.realName
                            }
                        });
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        this.messageFun('warning', res.data.MSG);
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
                this.disTriLoading = true;
                api.postApi(this.apiVar.publishPaintTask+"/setEngineerUser", info).then(res =>{
                    if(res.data.SysCode == 200200){
                        let updateArr = this.engineerArr.filter(ele =>{
                            return this.currEngineer.includes(ele.value)
                        });
                        this.projectInfo.engineerArr = updateArr;
                        this.projectInfo.engineer = updateArr.map(data =>{
                            return data.label;
                        }).join('/');
                        Message.success(res.data.MSG);
                        this.isShowDistri = false;
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        this.messageFun('warning', res.data.MSG);
                    }
                    this.disTriLoading = false;
                }).catch(err =>{
                    this.disTriLoading = false;
                    console.log(err);
                });
            },
            // 获取详情
            getData(){
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    publishId: sessionStorage.getItem('taskId'),
                    // publishId: 23,
                };
                api.getApi(this.apiVar.publishPaintTask+"/detail", info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        let resInfo = res.data.data;
                        this.projectInfo = this.setData(resInfo);
                        this.tabOrderList = this.setTabData(resInfo.orderList);
                        // 获取表格数据
                        this.currentOrder = this.tabOrderList[0].orderId.toString();
                        this.remainDay = this.countDay(this.projectInfo.photoTime);
                        this.getTableData(this.currentOrder);
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        this.messageFun('warning', res.data.MSG);
                    }
                }).catch(err =>{
                    console.log(err);
                });
            },
            // 7天以上显示7天,否则显示相隔天数
            countDay(time){
                let dayA = Math.abs(timeFormat.getDayBetween(time, new Date()));
                console.log('dayA-----', dayA);
                let RemainDay = dayA>7?7:dayA;
                return RemainDay;
            },
            // 设置数据格式
            setData(item){
                let obj = {
                    photoId: item.publishId,
                    photoTime: timeFormat.toDate(item.publishDate, '/'),
                    line: item.lineId,
                    lineName: item.lineName,
                    adsNum: item.publishPaintCount,
                    mediaNum: item.mediaCount,
                    resNum: item.resourceCount,
                    engineerArr: [],
                    engineer: "",
                    progress: (item.publishProgress*100).toFixed(0),
                    finishNum: item.publishCount,
                    orderNum: item.orderList.length,
                };
                obj.engineer = item.engineerMembers?item.engineerMembers.map(data =>{
                    return data.userName;
                }).join('/'): '';
                obj.engineerArr = item.engineerMembers?item.engineerMembers.map(data =>{
                    return {
                        label: data.userName,
                        value: data.userId,
                    };
                }): [];
                return obj;
            },
            // 设置tab数据
            setTabData(arr){
                console.log(arr);
                let result = [];
                result = arr.map(item=>{
                    let info = {
                        orderId: item.orderId,
                        orderName: item.orderName,
                    };
                    return info;
                });
                return result;
            },
            // 获取表格数据
            getTableData(orderId){
                console.log('----orderid', orderId);
                let sess = this.sessionData;
                let info = {
                    uid: sess.uID,
                    token: sess.token,
                    taskId: sessionStorage.getItem('taskId'),
                    orderId: orderId
                };
                this.loading = true;
                api.getApi(this.apiVar.publishPaintTask+"/getOrderDetail", info).then(res =>{
                    console.log(res.data);
                    if(res.data.SysCode == 200200){
                        let resinfo = res.data.data;
                        this.currAsidList = resinfo.resourceList? this.setTableData(resinfo.resourceList):[];
                        this.tableNumInfo = {
                            resNum: resinfo.resourceCount,
                            mediaNum: resinfo.mediaCount,
                            adsNum: resinfo.publishPaintCount,
                            finishNum: resinfo.publishCount,
                            progress: (resinfo.publishProgress*100).toFixed(0),
                        };
                    }else if(res.data.SysCode == 100302){
                        this.loginTimeout();
                    }else{
                        this.messageFun('warning', res.data.MSG);
                    }
                    this.loading = false;
                }).catch(err =>{
                    console.log(err);
                    this.loading = false;
                });
            },
            // 设置表格数据
            setTableData(arr){
                console.log(arr);
                let result = [];
                result = arr.map(item=>{
                    return {
                        resID: item.resourceId,
                        resName: item.resourceName,
                        mTitle: item.mediaName,
                        asLab: item.asName,
                        adSize: item.resourceSize,
                        assetTag: item.assetNumber,
                        mRemark: item.remark,
                        materialUrl: item.material,
                        resAddress: item.address,
                        state: item.publishStatus,
                    }
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
            // 操作提示统一方法
            messageFun(mesType, mes){
                this.$message({
                    message: mes,
                    type: mesType,
                    showClose: true,
                })
            },
            // 登录超时
            loginTimeout() {
                Message.warning("登录超时,请重新登录");
                this.$router.push("/login");
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
        font-size: 14px;
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
        margin: 0 32px;
    }
    .order_row h4{
        font-size: 20px;
        font-family:PingFangSC-Medium;
        font-weight:500;
        color:rgba(0,0,0,0.85);
        height: 34px;
        line-height: 34px;
        margin: 0 32px 16px;
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
    /deep/ .line_box .el-input--small .el-input__inner,/deep/ .line_box .el-table td .cell{
        height: 30px;
        line-height: 30px;
    }
    /*滚动条*/
    /deep/ .el-table__body-wrapper {
        min-height: 400px;
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

    .imgPreview /deep/ .el-dialog{
        max-width: 42%;
    }
    .imgPreview /deep/ .el-dialog__body{
        max-height: 640px;
    }
    .imgPreview /deep/ .el-dialog {
        max-height: 750px;
    }
    .imgPreview /deep/ .el-dialog img{
        width: 100%;
        min-height: 500px;
    }
</style>


