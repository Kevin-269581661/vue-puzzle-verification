<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">广告限制</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <div class="mediaList_head">
                <h2>广告限制列表</h2>
            </div>
            <div class="mediaList_container">
                <div class="table_wrap">
                    <el-table border :data="ADlist" style="width: 100%" v-loading="loading" element-loading-text="玩命加载中.." element-loading-spinner="el-icon-loading">
                        <el-table-column label="限制类型" min-width="11.6%">
                            <template slot-scope="scope">
                                <span class="data" v-if="!scope.row.showInput">{{scope.row.nTitle}}</span>
                                <el-input v-model.trim="scope.row.typeUpdate" placeholder="请输入广告类型" v-if="scope.row.showInput"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column label="描述" min-width="62.2%">
                            <template slot-scope="scope">
                                <span class="data" v-if="!scope.row.showInput">{{scope.row.ndescript}}</span>
                                <el-input v-model.trim="scope.row.detailUpdate" placeholder="请输入描述" class=" longText" v-if="scope.row.showInput"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column v-if="role=='SM'" label="操作" min-width="7.1%">
                            <template slot-scope="scope">
                                <div v-if="!scope.row.changeBtn">
                                    <el-button type="text" size="small" class="editAD" @click.native.prevent="editAD(scope.row, scope.$index)">编辑</el-button>
                                    <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.row, scope.$index)">删除</el-button>
                                </div>
                                <div v-if="scope.row.changeBtn">
                                    <el-button type="text" size="small" class="saveAD" @click.native.prevent="saveAD(scope.row, scope.$index)">保存</el-button>
                                    <el-button type="text" size="small" class="cancelAD" @click.native.prevent="cancelAD(scope.row, scope.$index)">取消</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div v-if="role=='SM'">
                        <div class="addAdlimit" @click="adlimitAddFun()">+ 新增广告类型</div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import {
    Table,
    TableColumn,
    Input,
    Button,
    MessageBox,
    Message
} from "element-ui";
import api from "../../api/api.js";
export default {
    name: "ADlimit",
    components: {
        elTable: Table,
        elTableColumn: TableColumn,
        elInput: Input,
        elButton: Button
    },
    data() {
        return {
            //加载中
            loading: true,
            session_data:{},
            role: "",
            //表格
            ADlist: [
                // {
                //     nID: 1,
                //     nTitle: "医疗",
                //     ndescript: "医疗类型的广告",
                //     showInput: false,
                //     changeBtn: false,
                //     typeUpdate: "",
                //     detailUpdate: ""
                // },
                // {
                //     nID: 2,
                //     nTitle: "物理",
                //     ndescript: "物理类型的广告",
                //     showInput: false,
                //     changeBtn: false,
                //     typeUpdate: "",
                //     detailUpdate: ""
                // }
            ]
        };
    },
    created() {
        this.session_data = JSON.parse(sessionStorage.getItem("session_data"));
        this.role = this.session_data.uType;
        this.getInitData();
    },
    methods: {
        //   获取初始数据
        getInitData() {
            let info = {
                uid: this.session_data.uID,
                token: this.session_data.token,
                service:"GetNotPush",
                data: {
                }
            };
            api
                .postApi_new(this.apiVar.Media, info)
                .then(res => {
                    console.log(res.data);
                    if (res.data.SysCode ==200200) {
                        this.ADlist = res.data.data;
                        for (let data of this.ADlist) {
                            data.showInput = false;
                            data.changeBtn = false;
                            data.typeUpdate = "";
                            data.detailUpdate = "";
                        }
                    } else if(res.data.SysCode == 100302){
                        // Message.warning(res.data.MSG);
                        Message.warning('登录超时,请重新登录');
                        this.$router.push('/login');
                    }else{
                        Message.warning(res.data.MSG);
                    }
                    this.loading = false;
                })
                .catch(res => {
                    this.loading = false;
                    console.log(res);
                });
        },
        // 添加一行
        adlimitAddFun() {
            let ADcontent = {
                nTitle: "",
                ndescript: "",
                showInput: true,
                changeBtn: true,
                typeUpdate: "",
                detailUpdate: ""
            };
            this.ADlist.unshift(ADcontent);
        },
        //删除
        deleteRow(row, index) {
            this.$confirm("确定要删除这条数据吗？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    // uid     int【必填】     UserID
                    // nid     int【必填】     广告限制nID
                    // let info = {};
                    // info.uid = JSON.parse(
                    //     sessionStorage.getItem("session_data")
                    // ).uID;
                    // info.nid = row.nID;

                    let info = {
                        uid: this.session_data.uID,
                        token: this.session_data.token,
                        service:"DelNP",
                        data: {
                            nid: row.nID
                        }
                    };
                    // 删除接口
                    api.postApi_new(this.apiVar.Media, info).then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 200200) {
                            this.ADlist.splice(index, 1);
                            Message.success(res.data.MSG);
                        } else if(res.data.SysCode == 100302){
                            Message.warning('登录超时,请重新登录');
                            this.$router.push('/login');
                        }else {
                            Message.warning(res.data.MSG);
                        }
                    });
                })
                .catch(() => {
                    Message.info("已取消删除");
                });
        },
        //编辑
        editAD(rows, index) {
            console.log(rows.showInput);
            this.$set(rows, "typeUpdate", rows.nTitle);
            this.$set(rows, "detailUpdate", rows.ndescript);
            this.$set(rows, "showInput", !rows.showInput);
            this.$set(rows, "changeBtn", !rows.changeBtn);
            this.ADlist.push();
            console.log(rows);
        },
        //保存
        saveAD(rows, index) {
            if (rows.typeUpdate === "") {
                Message.warning("请填写限制类型后再保存");
                return;
            }
            if (rows.typeUpdate.length > 30) {
                Message.warning("限制类型请保持在30个字符以内");
                return;
            }
            if (rows.detailUpdate.length > 200) {
                Message.warning("描述请保持在200个字符以内");
                return;
            }
            if (!rows.nID) {
                // 新增广告限制
                // uid     int【必填】     UserID
                // nt      String          限制行业名称
                // nd      String          限制理由或描述
                // console.log("addRows", rows);
                // let info = {};
                // info.uid = JSON.parse(
                //     sessionStorage.getItem("session_data")
                // ).uID;
                // info.nt = rows.typeUpdate;
                // info.nd = rows.detailUpdate;
                // console.log("addinfo", info);

                let info ={
                    uid: this.session_data.uID,
                    token: this.session_data.token,
                    service:"AddNotPush",
                    data: {
                        nt: rows.typeUpdate,
                        nd: rows.detailUpdate
                    }
                };

                api
                    .postApi_new(this.apiVar.Media, info)
                    .then(res => {
                        console.log(res);
                        if (res.data.SysCode == 200200) {
                            Message.success(res.data.MSG);
                            let resData = res.data.data;
                            this.$set(rows, 'nID', resData.nID);
                            this.$set(rows, 'nTitle', rows.typeUpdate);
                            this.$set(rows, 'ndescript', rows.detailUpdate);
                            this.$set(rows, 'showInput', !rows.showInput);
                            this.$set(rows, 'changeBtn', !rows.changeBtn);
                            this.ADlist.push();
                        } else if(res.data.SysCode == 100302){
                            Message.warning('登录超时,请重新登录');
                            this.$router.push('/login');
                        }else {
                            // Message.warning(res.data.MSG);
                            Message.warning("广告限制不能重复");
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
            } else {
                console.log("editRows", rows);
                // 修改广告限制
                // uid     int【必填】     UserID
                // nid     int【必填】     广告限制nID
                // nt      String          限制行业名称
                // nd      String          限制理由或描述
                // let info = {};
                // info.uid = JSON.parse(
                //     sessionStorage.getItem("session_data")
                // ).uID;
                // info.nid = rows.nID;
                // info.nt = rows.typeUpdate;
                // info.nd = rows.detailUpdate;

                let info = {
                    uid: this.session_data.uID,
                    token: this.session_data.token,
                    service:"SetNotPush",
                    data: {
                        nid: rows.nID,
                        nt: rows.typeUpdate,
                        nd: rows.detailUpdate
                    }
                };
                console.log("editinfo", info);
                api
                    .postApi_new(this.apiVar.Media, info)
                    .then(res => {
                        console.log(res);
                        if (res.data.SysCode == 200200) {
                            Message.success(res.data.MSG);
                            this.$set(rows, "nTitle", rows.typeUpdate);
                            this.$set(rows, "ndescript", rows.detailUpdate);
                            this.$set(rows, "showInput", !rows.showInput);
                            this.$set(rows, "changeBtn", !rows.changeBtn);
                            this.ADlist.push();
                        } else if(res.data.SysCode == 100302){
                            Message.warning('登录超时,请重新登录');
                            this.$router.push('/login');
                        }else {
                            Message.warning(res.data.MSG);
                        }
                    })
                    .catch(res => {
                        console.log(res);
                    });
            }
        },
        //取消
        cancelAD(rows, index) {
            if (!rows.nID) {
                this.ADlist.splice(index, 1);
            } else {
                //前端显示
                this.$set(rows, "nTitle", rows.nTitle);
                this.$set(rows, "ndescript", rows.ndescript);
                //切换输入框和操作类型的显示
                this.$set(rows, "showInput", !rows.showInput);
                this.$set(rows, "changeBtn", !rows.changeBtn);
                this.ADlist.push();
            }
        }
    }
};
</script>

<style scoped>
.changeInput {
    width: 95%;
    display: none;
}

/*筛选*/
.el-checkbox + .el-checkbox {
    margin-left: 0;
}

/deep/ .el-checkbox__label {
    font-size: 10px;
    color: #8a8a8a;
}

/*日期控件*/
.block {
    display: inline-block;
    position: relative;
    top: 0px;
    margin-left: 63px;
}

/deep/ .el-input__inner {
    width: 100%;
    height: 32px;
}

/deep/ .el-range-editor .el-range-input {
    line-height: 20px;
}

/deep/ .el-date-editor .el-range__icon {
    position: absolute;
    right: 10px;
    top: 0;
}
/deep/.el-picker-panel .el-date-range-picker .el-popper {
    left: 335px !important;
}

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

/*wrap*/
.mediaList_wrap {
    width: 92%;
    background: #ffffff;
    border: 1px solid #e6e7e9;
    margin: 0 auto;
    /*margin-bottom: 90px;*/
}

.mediaList_wrap .mediaList_head {
    width: 100%;
    height: 24px;
    padding: 12px 0;
    border-bottom: 1px solid #e6e7e9;
}

.mediaList_wrap .mediaList_head h2 {
    font-size: 16px;
    color: #2c313c;
    height: 24px;
    padding-left: 14px;
    font-weight: bold;
}
.mediaList_wrap .mediaList_container {
    width: 100%;
}

.mediaList_wrap .mediaList_container .table_wrap {
    width: 96%;
    margin: 20px auto;
    border-radius: 4px;
}

.table_wrap {
    width: 1210px;
    border-radius: 4px;

    margin: 0 auto;
    margin-top: 20px;
}

/*表格*/
/deep/.el-date-editor .el-range-separator {
    line-height: 26px;
}

/deep/.el-table th,
.el-table tr {
    height: 44px;
    padding: 0;
    background-color: #f7f7f7;
}
/deep/ .el-table td {
    padding: 5px 0;
    overflow-x: hidden;
    text-overflow: ellipsis;
}
/deep/.el-table--border {
    border-radius: 4px;
}

/deep/ .el-table th > .cell {
    font-size: 14px;
    color: #666666;
    font-weight: bold;
}
/deep/ .el-table .caret-wrapper {
    width: 22px;
}

/deep/.el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ecf5ff;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    height: 405px;
    overflow-y: scroll;
    overflow-x: hidden;
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;
    background: #fafafa;
}
/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/

    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c1c1c1;
    border-radius: 4px;
}
/*超出省略*/
/deep/ .el-table .cell {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
/*筛选*/
/deep/ .el-table__column-filter-trigger {
    margin-left: 10px;
}
/deep/.el-table th > .cell.highlight {
    color: #409eff !important;
}

/deep/ div.el-table-filter {
    left: 1106px !important;
}
/*操作*/
/deep/.el-button--mini,
.el-button--small {
    font-size: 14px !important;
}

/deep/.el-button .el-button--primary .el-button--mini {
    width: 51px;
}
/deep/.el-dropdown-menu--mini .el-dropdown-menu__item {
    width: 65px;
}

.tar {
    text-align: right !important;
    padding-right: 10px;
}

/deep/ .el-dropdown .el-button-group .el-button {
    height: 28px;
}

/*新增刊例价*/
.addAdlimit {
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
    color: rgba(0, 0, 0, 0.65);
}

</style>
