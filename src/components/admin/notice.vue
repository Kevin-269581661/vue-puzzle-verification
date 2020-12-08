<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#">系统管理</a><em> / </em><a href="#">公告通知</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>公告通知</h2>
            </div>
            <div class="mediaList_container">
                <el-form :inline="true">
                    <el-form-item label="标题：">
                        <el-input placeholder="请输入标题" v-model="searchInfo.title" size="small" class="marginR"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="search()" :loading="isSearch" class="marginR">搜索</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain @click="reset()" :disabled="!isReset" class="marginR">重置</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button plain @click="dialogFormVisible = true" class="marginR">新建</el-button>
                    </el-form-item>
                </el-form>
                <div class="table_wrap">
                    <el-table border :data="tableSource" style="width: 100%" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column prop="title" label="标题" min-width="15%" how-overflow-tooltip></el-table-column>
                        <el-table-column prop="content" label="内容" min-width="50%" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="createTime" label="创建日期" min-width="10%"></el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <div>
                                    <span style="color: #108EE9;cursor: pointer;" @click="catDetail(scope.row)">查看</span>
                                    <el-popover
                                        placement="top-end"
                                        v-model="popShow2"
                                        >
                                        <div class="publish-pop">
                                            <div class="content"><i class="el-icon-warning"></i>你确定要删除吗？</div>
                                            <el-button size="mini" type="text" @click="popShow2 = false">取消</el-button>
                                            <el-button type="primary" size="mini" @click="deleteNotice(scope.row.id)">确定</el-button>
                                        </div>
                                        <span slot="reference" style="color: #108EE9;cursor: pointer;margin-left: 8px">删除</span>
                                    </el-popover>
                                </div>
                            </template>
                        </el-table-column>

                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
                    </el-table>

                    <div class="ad_pagination">
                        <el-pagination
                            background
                            v-if="paginationShow"
                            @size-change="sizeChange"
                            @current-change="changePage"
                            :current-page.sync="currPage"
                            :page-sizes="pageSizes"
                            :page-size="pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="totalNum">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>
        <!-- 查看公告 -->
        <el-dialog
            :visible.sync="dialogVisible"
            :show-close="false"
            width="30%"
            custom-class="notice-dialog">
            <span class="content">{{currentRow.content || ''}}</span>
            <div slot="title">
                <span class="title">{{currentRow.title || ''}}</span>
                <div class="date">{{currentRow.createTime || ''}}</div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">关 闭</el-button>
            </span>
        </el-dialog>
        <!-- 新建公告 -->
        <el-dialog title="新建公告通知" :visible.sync="dialogFormVisible" width="490px" custom-class="new-notice-dialog">
            <el-form :model="noticeForm" ref="noticeForm" :rules="noticeFormRules">
                <el-form-item prop="title" label="标题：" label-width="70px" style="margin-bottom: 18px;">
                    <el-input type="text" v-model.trim="noticeForm.title" size="small" maxlength="18" placeholder="请输入标题，限18个字"></el-input>
                </el-form-item>
                <el-form-item prop="content" label="内容：" label-width="70px">
                    <el-input
                        :rows="4"
                        type="textarea"
                        placeholder="请填写内容"
                        :autosize="{ minRows: 3, maxRows: 8 }"
                        v-model.trim="noticeForm.content">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-popover
                    placement="top-end"
                    v-model="popShow1"
                    >
                    <div class="publish-pop">
                        <div class="content"><i class="el-icon-warning"></i>你确定要发布吗？</div>
                        <el-button size="mini" type="text" @click="popShow1 = false">取消</el-button>
                        <el-button type="primary" size="mini" @click="newNotice('noticeForm')">确定</el-button>
                    </div>
                    <el-button slot="reference" type="primary">发 布</el-button>
                </el-popover>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import sessFun from '../../commonFun/sessFun.js';
    import dateFormat from "../../commonFun/timeFormat.js";
    import {api} from "../../api/api";
    import noSearchResult from "../common/components/noSearchResult.vue";
    
    export default {
        name: "notice",
        components: {
            noSearchResult
        },
        data() {
            return {
                // 分页信息
                paginationShow: true,
                pageSize: 10,
                pageSizes: [10, 20, 50],
                currPage: 1,
                totalPage: 0,
                totalNum: 0,
                // 登录信息
                sessionData:{},
                //加载中
                loading: true,
                searchInfo:{
                    title: ""
                },
                // 表格数据
                tableSource: [],
                isSearch: true,
                isReset: true,
                dialogVisible: false,
                currentRow: {},
                // 新建公告
                dialogFormVisible: false,
                popShow1: false,
                popShow2: false,
                noticeForm: {
                    title: '',
                    content: ''
                },
                noticeFormRules: {
                    title: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    content: [
                        { required: true, message: '请输入公告内容', trigger: 'blur' }
                    ],
                }
            };
        },
        created() {
            this.sessionData = sessFun.getSess();
            this.searchFun();
        },
        methods: {
            // 切换页码
            changePage(page) {
                this.currPage = page;
                console.log('page----', page);
                this.searchFun();
            },
            // 每页条数切换
            sizeChange(val) {
                this.currPage = 1;
                this.pageSize = val;
                this.searchFun();
            },
            // 首页的系统公告查询
            searchFun(){
                this.paginationShow = false;
                this.loading = true;
                let info = this.searchFormat();
                this.getData(info);
                this.$nextTick(function () {
                    this.paginationShow = true;
                });
            },
            // 数据列表
            getData(params){
                api.getApi(this.apiVar.Advertisement+'/GetSystemNotice', params).then(res =>{
                    if(!res.data.SysCode){
                        let dataInfo = res.data;
                        this.totalNum = dataInfo.count;
                        let dataArr = dataInfo || [];
                        this.tableSource = this.funcData(dataArr);
                        this.loading = false;
                        this.isSearch = false;
                        if(dataInfo.totalpage == 0){
                            this.$message.warning('暂无数据');
                        }
                    }else{
                        this.$message.warning(res.data.MSG);
                    }
                });
            },
            // 数据处理
            funcData(dataArr){
                let result = [];
                for(let item of dataArr){
                    let tmpObj = '';
                    tmpObj = this.setTableData(item);
                    result.push(tmpObj);
                }
                return result;
            },
            // 搜索数据格式化
            searchFormat(){
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                    pageNum: this.currPage,
                    pagesize: this.pageSize
                };
                let { title } = this.searchInfo;
                info = {
                    ...info,
                    ...(title && {title})
                };
                return info;
            },
            // 设置表格数据
            setTableData(item){
                let obj = {
                    id: item.id || '',
                    title: item.title || '',
                    content: item.content || '',
                    createTime: item.createTime || ''
                };
                return obj;
            },
            // 时间格式化
            formatTime(time) {
                return dateFormat.toDate(time, '/');
            },
            // 搜索优化
            search(){
                let { title } = this.searchInfo;
                // this.isSearch = false;
                // let timer = setTimeout(()=>{
                //     this.isSearch = true;
                //     clearTimeout(timer);
                // }, 1000);
                if(title){
                    this.tableSource = [];
                    this.loading = true;
                    this.currPage = 1;
                    this.searchFun();
                    this.isSearch = true;
                }else{
                    this.$message.warning('请输入搜索条件');
                }
            },
            // 重置
            reset(){
                this.searchInfo = {
                    title: '',
                };
                this.currPage = 1;
                this.tableSource = [];
                this.isReset = false;
                let timer = setTimeout(()=>{
                    this.isReset = true;
                    clearTimeout(timer);
                }, 1000);
                this.searchFun();
            },
            // 系统公告增加 /advertisement/AddSystemNotice
            newNotice(formName) {
                let _this = this;
                _this.popShow1 = false;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        api.postApi(_this.apiVar.Advertisement+'/AddSystemNotice', _this.noticeForm).then(res=>{
                            if(res.data.SysCode == '200200'){
                                _this.searchFun();
                            } else {
                                _this.$message.warning(res.data.MSG);
                            }
                        }).finally(_=>{
                            _this.dialogFormVisible = false;
                        });
                    } else {
                        _this.$message.warning('输入不能为空！');
                        return false;
                    }
                });
            },
            catDetail(row) {
                this.currentRow = row;
                this.dialogVisible = true
            },
            deleteNotice(id) {
                if(!id) return;
                this.popShow2 = false
                api.postApi(this.apiVar.Advertisement+'/DelSystemNotice', {id}).then(res =>{
                    if(res.data.SysCode == '200200'){
                        this.searchFun();
                    } else {
                        this.$message.warning(res.data.MSG);
                    }
                }).finally(_=>{
                });
            },
            // 开通或者禁用：
            isForbidden(row) {
                console.log(row);
                MessageBox.confirm(
                    `是否${row.uState ? "禁用" : "开通"}该角色?`,
                    "提示",
                    {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning"
                    }
                )
                    .then(() => {
                        let info = {
                            uid: this.sessionData.uID,
                            token: this.sessionData.token,
                            toid: row.uID,
                            ustate: row.uState ? 0 : 1
                        };
                        api.postApi(this.apiVar.UCAPI + "/CtrlUser", info)
                            .then(res => {
                                console.log(res.data);
                                if (res.data.SysCode == 200200) {
                                    this.$message.success(res.data.MSG);
                                    row.uState = row.uState ? 0 : 1;
                                } else {
                                    this.$message.warning(res.data.MSG);
                                }
                            })
                            .catch(res => {
                                console.log(res);
                            });
                    })
                    .catch(() => {
                        this.$message.info("已取消操作");
                    });
            }
        }
    };
</script>
<style lang="scss">
    .publish-pop {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(0, 0, 0, 0.65);
        line-height: 22px;
        .content {
            margin-bottom: 13px;
        }
        i {
            color: #E6A23C;
            margin-right: 4px;
        }
    }
</style>
<style scoped lang="scss">
    /deep/ .notice-dialog {
        .el-dialog__header {
            padding: 16px 24px 6px;
            .title {
                height: 24px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(0, 0, 0, 0.85);
                line-height: 24px;
            }
            .date {
                float: right;
                height: 24px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: rgba(0, 0, 0, 0.45);
                line-height: 24px;
            }
        }
        .el-dialog__body {
            padding: 6px 24px 14px;
        }
        .content {
            height: 200px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(0, 0, 0, 0.65);
            line-height: 20px;
        }
    }
    /deep/ .new-notice-dialog {
        .el-dialog__header {
            padding: 19px 24px;
            border-bottom: 1px solid #E9E9E9;
        }
        .el-dialog__body {
            padding: 24px 24px 14px;
        }
        .el-input {
            width: 100%;
        }
    }
    .marginR{
        margin-right: 6px;
    }
    .el-button+.el-button{
        margin-left: 0;
    }
    /deep/ .el-form-item {
        margin: 0;
    }
    /deep/ .el-checkbox__label {
        font-size: 10px;
        color: #8a8a8a;
    }

    .el-input {
        width: 180px;
        border-radius: 4px;
        border-radius: 4px;
    }

</style>
