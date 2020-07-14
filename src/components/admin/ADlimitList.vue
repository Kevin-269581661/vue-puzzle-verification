<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#">系统管理</a><em> / </em><a href="#">广告限制</a>
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
                        <el-table-column v-if="role=='SA'" label="操作" min-width="7.1%">
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
                    <div v-if="role=='SA'">
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
            ADlist: []
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
                    } else{
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
                        } else {
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
                        } else if(res.data.SysCode == 100403) {
                            Message.warning(res.data.MSG);
                        } else {
                            Message.warning("广告限制不能重复")
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
                        } else {
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

/deep/ .el-input__inner {
    width: 100%;
    height: 32px;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    height: 405px;
}
/*超出省略*/
/deep/ .el-table .cell {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
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

.table_wrap .el-button{
    min-width: auto;
}

</style>
