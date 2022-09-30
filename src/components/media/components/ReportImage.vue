<template>
    <div>
        <el-dialog
            title="监播图片"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            custom-class="custom-dialog-wrapper registration-media"
            width="75%">
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
                    height="630"
                    border
                    style="width: 100%">
                        <el-table-column
                            prop="reportArea"
                            label="所属区域"
                            width="108">
                        </el-table-column>
                        <el-table-column
                            prop="reportCommunity"
                            label="所属小区"
                            width="160">
                        </el-table-column>
                        <el-table-column
                            prop="mediaName"
                            label="媒体名称"
                            width="160">
                        </el-table-column>
                        <el-table-column
                            prop="launchFace"
                            label="投放面"
                            width="108">
                        </el-table-column>
                        <el-table-column
                            prop="assetNumber"
                            label="资产编号"
                            width="160">
                        </el-table-column>
                        <el-table-column
                            prop="imageNumber"
                            label="图片数量"
                            width="108">
                        </el-table-column>
                        <el-table-column
                            prop="auditStatus"
                            label="审核状态"
                            width="108">
                        </el-table-column>
                        <el-table-column
                            prop="auditResult"
                            label="审核结果"
                            width="108">
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <div class="operate-text" @click="toAudit(scope.row)">审批</div>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="handleClose()">关 闭</el-button>
            </span>
        </el-dialog>
        <AuditImage
            :dialogVisible.sync="auditImageVisible"
            :updateOrderData="auditImageData">
        </AuditImage>
    </div>
</template>

<script>
import AuditImage from '../components/AuditImage.vue'

export default {
    name:'reportImage',
    components: {
        AuditImage
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
            searchParams: {}
        }
    },
    mounted() {
        console.log(this.reportImageData);
    },
    methods:{
        toAudit(row) {
            this.auditImageVisible = true
            console.log(row);
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
  justify-content: center;
}

.handel_ul_li {
  display: flex;
  align-items: center;
  flex-flow: row nowrap;
  width: 350px;
  margin: 8px 32px 8px 0px;
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
        line-height: 22px;
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
</style>
