<template>
    <div>
        <el-dialog
            title="监播图片"
            :visible.sync="dialogVisible"
            :show-close="false"
            :close-on-click-modal="false"
            custom-class="custom-dialog-wrapper registration-media"
            width="65%">
            <div class="handel_ul">
                <li class="handel_ul_li">
                    <span class="li-label">所属区域：</span>
                    <el-select
                        v-model="searchParams.reportArea"
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
                        v-model="searchParams.reportCommunity"
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
                        v-model="searchParams.launchFace"
                        placeholder="请选择投放面"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="A面" value="A面"></el-option>
                        <el-option label="B面" value="B面"></el-option>
                    </el-select>
                </li>
                <li class="handel_ul_li">
                    <span class="li-label">资产编号：</span>
                    <el-select
                        v-model="searchParams.assetNumber"
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
                        v-model="searchParams.imageNumber"
                        placeholder="请选择图片数量"
                        :clearable="true"
                        style="width: 270px"
                        size="small"
                    >
                        <el-option label="2张" value="2张"></el-option>
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
                </li>
            </div>
            <div class="table-area">
                <el-table
                    :header-cell-style="{ background: '#FAFAFA' }"
                    :data="reportImageData"
                    border

                    style="width: 100%">
                        <el-table-column
                            prop="reportArea"
                            label="所属区域"
                            width="108">
                            <template slot-scope="scope">
                                <span>{{ scope.row.reportArea || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="reportCommunity"
                            label="所属小区"
                            width="180">
                            <template slot-scope="scope">
                                <span>{{ scope.row.reportCommunity || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="mediaName"
                            label="媒体名称"
                            width="160">
                            <template slot-scope="scope">
                                <span>{{ scope.row.mediaName || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="launchFace"
                            label="投放面"
                            width="108">
                            <template slot-scope="scope">
                                <span>{{ scope.row.launchFace || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="assetNumber"
                            label="资产编号"
                            width="180">
                            <template slot-scope="scope">
                                <span>{{ scope.row.assetNumber || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="imageNumber"
                            label="图片数量"
                            width="108">
                            <template slot-scope="scope">
                                <span>{{ `${scope.row.imageNumber}张` || '--' }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="auditStatus"
                            label="审核状态"
                            width="118">
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
                            width="118">
                            <template slot-scope="scope">
                                <point-state
                                :state-text="auditResultToText(scope.row.auditResult).text"
                                :color="auditResultToText(scope.row.auditResult).color"
                                ></point-state>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" fixed="right" width="108">
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
            :dialogVisible.sync="auditImageVisible"
            :auditImageData="auditImageData">
        </AuditImage>
    </div>
</template>

<script>
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
        reportImageData: {
            type: Array,
            default: () => []
        }
    },
    data(){
        return {
            auditImageVisible: false,
            auditImageData: {},
            searchParams: {},
            pageSizes: [10, 20, 30],
            pageSize: 10,
            currentPage: 1,
        }
    },
    mounted() {
        console.log(this.reportImageData);
        this.auditDialogWidth = 1000
    },
    computed: {
        paginationTotal() {
            return this.reportImageData.length
        }
    },
    methods:{
        sizeChange (val) {
            this.pageSize = val
            this.currentPage = 1
            // this.getData()
        },

        changePage (page) {
            this.currentPage = page
            // this.getData()
        },
        // 审核状态
        auditStatusToText (state) {
            let mediaArr = [
                {
                    text: '已审核',
                    value: 0,
                    color: '#52C41A',
                },
                {
                    text: '未审核',
                    value: 1,
                    color: '#FAAD14',
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
                    text: '合格',
                    value: 0,
                    color: '#52C41A',
                },
                {
                    text: '不合格',
                    value: 1,
                    color: '#FF4949',
                }
            ];
            return mediaArr.filter(item => {
                return item.value === state
            })[0] || {}
        },
        toAudit(row) {
            this.auditImageVisible = true
            this.auditImageData = row
            // console.log(row);
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
  margin: 8px 32px 8px 0px;
  &:nth-child(3n) {
    margin-right: 0px;
  }
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
    color: #000;
}
</style>
