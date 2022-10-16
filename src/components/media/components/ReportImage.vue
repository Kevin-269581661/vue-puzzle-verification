<template>
    <div>
        <el-dialog
            title="监播图片"
            @open="getAdPlanDetailsList()"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            custom-class="custom-dialog-wrapper registration-media"
            width="75%">
            <div class="handel_ul">
                <li class="handel_ul_li">
                    <span class="li-label">所属区域：</span>
                    <el-select
                        v-model="searchParams.districtName"
                        placeholder="请选择所属区域"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="天河区" value="天河区"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li">
                    <span class="li-label">所属小区：</span>
                    <el-select
                        v-model="searchParams.resName"
                        placeholder="请选择所属小区"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="保利心语花园" value="保利心语花园"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li">
                    <span class="li-label">所属媒体：</span>
                    <el-select
                        v-model="searchParams.mediaName"
                        placeholder="请选择所属媒体"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="兴盛路西门" value="兴盛路西门"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li">
                    <span class="li-label" style="width: 70px; text-align: right;">投放面：</span>
                    <el-select
                        v-model="searchParams.asLab"
                        placeholder="请选择投放面"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="A" value="A"></el-option>
                        <el-option label="B" value="B"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li">
                    <span class="li-label">资产编号：</span>
                    <el-select
                        v-model="searchParams.assetTag"
                        placeholder="请选择资产编号"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="GZ0930285203" value="GZ0930285203"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li">
                    <span class="li-label">图片数量：</span>
                    <el-select
                        v-model="searchParams.imgNum"
                        placeholder="请选择图片数量"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="2" :value="2"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li">
                    <span class="li-label">审核状态：</span>
                    <el-select
                        v-model="searchParams.auditStatus"
                        placeholder="请选择审核状态"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="已审核" :value="0"></el-option>
                        <el-option label="未审核" :value="1"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li">
                    <span class="li-label">审核结果：</span>
                    <el-select
                        v-model="searchParams.auditResult"
                        placeholder="请选择审核结果"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="合格" :value="0"></el-option>
                        <el-option label="不合格" :value="1"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li handel_ul_li_btn">
                    <el-button
                        type="primary"
                        icon="el-icon-search"
                        @click="toSearchParams()"
                    >
                        搜索</el-button>
                    <el-button plain @click="toResetParams()">重置</el-button>
                    <el-button plain @click="export2Excel()">导出</el-button>
                </li>
            </div>
            <div class="table-area">
                <el-table
                    :header-cell-style="{ background: '#FAFAFA' }"
                    :data="tableData"
                    border
                    style="width: 100%">
                        <el-table-column
                            prop="districtName"
                            label="所属区域"
                            min-width="108">
                            <template slot-scope="scope">
                                <span>{{ scope.row.districtName || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="resName"
                            label="所属小区"
                            min-width="180">
                            <template slot-scope="scope">
                                <span>{{ scope.row.resName || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="mediaName"
                            label="媒体名称"
                            min-width="160">
                            <template slot-scope="scope">
                                <span>{{ scope.row.mediaName || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="asLab"
                            label="投放面"
                            min-width="108">
                            <template slot-scope="scope">
                                <span>{{ `${scope.row.asLab}面` || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="assetTag"
                            label="资产编号"
                            min-width="180">
                            <template slot-scope="scope">
                                <span>{{ scope.row.assetTag || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="imgNum"
                            label="图片数量"
                            min-width="108">
                            <template slot-scope="scope">
                                <span>{{ `${scope.row.imgNum}张` || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="auditStatus"
                            label="人工审核状态"
                            min-width="118">
                            <template slot-scope="scope">
                                <point-state
                                :state-text="auditStatusToText(scope.row.auditStatus).text"
                                :color="auditStatusToText(scope.row.auditStatus).color"
                                ></point-state>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="auditResult"
                            label="审核结果"
                            min-width="118">
                            <template slot-scope="scope">
                                <point-state
                                :state-text="auditResultToText(scope.row.auditResult).text"
                                :color="auditResultToText(scope.row.auditResult).color"
                                ></point-state>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" min-width="108">
                            <template slot-scope="scope">
                                <div class="operate-text" @click="toAudit(scope.row)">审核</div>
                            </template>
                        </el-table-column>
                </el-table>

                <el-pagination
                    background
                    @size-change="sizeChange"
                    @current-change="changePage"
                    :current-page.sync="currentPage"
                    :page-sizes="pageSizes"
                    :page-size.sync="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="paginationTotal"
                    style="margin-top: 14px; text-align: right">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">关 闭</el-button>
            </span>
        </el-dialog>
        <AuditImage
            ref="auditImageRef"
            @toLastId="toLastId"
            @toNextId="toNextId"
            :dialogVisible.sync="auditImageVisible"
            :auditSearchParams="auditSearchParams">
        </AuditImage>
    </div>
</template>

<script>
import api from "../../../api/api.js";

import AuditImage from '../components/AuditImage.vue'
import pointState from '../../common/components/pointState.vue'

export default {
    name:'reportImage',
    components: {
        AuditImage,
        pointState
    },
    props: {
        dialogVisible: {
            type: Boolean,
            default: () => false,
        },
        reportImageApID: {
            type: Number,
            default: () => 0
        }
    },
    data(){
        return {
            auditImageVisible: false,
            tableData: [],
            auditImageID: 0,
            searchParams: {},
            auditSearchParams: {},
            pageSizes: [10, 20, 30],
            pageSize: 10,
            currentPage: 1,
            paginationTotal: 0,
        }
    },
    mounted() {
        this.auditDialogWidth = 1000
    },
    methods:{
        export2Excel() {
            let name = '监播图片详情';
            require.ensure([], () => {
                const { export_json_to_excel } = require('../../../vendorExcel/Export2Excel');
                const tHeader = ['所属区域', '所属小区', '媒体名称', '投放面', '资产编号', '图片数量', '人工审核状态(0:未审核,1:已审核)', '审核结果(0:不合格,1:合格)'];
                const filterVal = ['districtName', 'resName', 'mediaName', 'asLab', 'assetTag', 'imgNum', 'auditStatus', 'auditResult'];
                const list = this.tableData;
                const data = this.formatJson(filterVal, list);
                export_json_to_excel(tHeader, data, name);
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) => filterVal.map((j) => v[j]));
        },
        getAdPlanDetailsList() {
            let params = {
                ...this.searchParams,
                apID: this.reportImageApID,
                pageNum: this.currentPage,
                pageSize: this.pageSize,
            }
            api.postApi('/addsp/api/v1/audit/adPlanDetails', params).then((res)=>{
                if (res.data.SysCode) {
                const resData = res.data.data
                this.tableData = resData.list || []
                this.paginationTotal = resData.total || 0
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.data.MSG || "订单审核明细获取异常！"
                    });
                }
            })
        },
        toLastId(id) {
            console.log('当前id'+id);
            // if(id <= 0) return;
            // this.auditImageData = this.reportImageData[--id]
        },
        toNextId(id) {
            console.log('当前id'+id);
            // if(id < this.reportImageData.length) {
                // this.auditImageData = this.reportImageData[++id]
            // }
        },
        sizeChange (val) {
            this.pageSize = val
            this.currentPage = 1
            this.getAdPlanDetailsList()
        },

        changePage (page) {
            this.currentPage = page
            this.getAdPlanDetailsList()
        },
        // 审核状态
        auditStatusToText (state) {
            let mediaArr = [
                {
                    text: '未审核',
                    value: 0,
                    color: '#FAAD14',
                },
                {
                    text: '已审核',
                    value: 1,
                    color: '#52C41A',
                }
            ];
            return mediaArr.filter(item => {
                return item.value === state
            })[0] || {}
        },
        // 审核结果
        auditResultToText (state) {
            let mediaArr = [
                {
                    text: '不合格',
                    value: 0,
                    color: '#FF4949',
                },
                {
                    text: '合格',
                    value: 1,
                    color: '#52C41A',
                }
            ];
            return mediaArr.filter(item => {
                return item.value === state
            })[0] || {}
        },
        toAudit(row) {
            this.auditSearchParams = {...this.searchParams, lID: row.lID}
            console.log('审核图片参数 lID', this.auditSearchParams);
            this.auditImageVisible = true
        },
        handleClose () {
            this.$emit("update:dialogVisible", false)
        },
        toSearchParams() {
            if(Object.keys(this.searchParams).length === 0) return;
            console.log(this.searchParams);
        },
        toResetParams() {
            this.searchParams = {}
        },
    }
}
</script>

<style lang="scss" scoped>
.handel_ul {
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
}

.handel_ul_li {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  width: 350px;
  margin: 0px 24px 16px 0px;
  .li-label {
    font-size: 14px;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.65);
  }
}

.handel_ul_li_btn {
  .el-button + .el-button {
    margin-left: 8px;
  }
}

.table-area {
    margin-top: 30px;

    .operate-text {
        font-size: 14px;
        line-height: 32px;
        color: #1890ff;
        cursor: pointer;
    }
}

/deep/ .el-table td,
/deep/ .el-table .el-table__cell {
    padding: 0;
}

/deep/ .el-table th,
/deep/ .el-table tr td {
    height: 46px;
}

/deep/ .el-dialog__footer {
    border-top: 1px solid #E9E9E9;
}

/deep/ .el-dialog__header {
    border-bottom: 1px solid #E9E9E9;
}

/deep/ .el-dialog__title {
    font-weight: 600;
    color: rgba(0, 0, 0, 0.85);
    color: #000;
}

/deep/ .el-table__fixed-right::before {
    z-index: -1;
}

</style>
