<!-- 方案详情-选点排期列表 -->
<template>
  <div>
    <ScheduleAlter :detailData="planDetail" />

    <div class="first-wrap box-wrap">
      <div class="table_wrap">
        <div class="table-setting">
          <el-button
            type="primary"
            icon="el-icon-download"
            @click="handleExport"
          >
            导出
          </el-button>

          <!-- 列设置 -->
          <TableSetting
            refresh
            space
            filter
            cacheKey="planDetail"
            :columns="currentColumn"
            @filterColumn="filterColumn"
            @refreshTable="refreshTable"
            @spaceSetting="spaceSetting"
          />
        </div>

        <el-table
          v-loading="loading" element-loading-text="玩命加载中.."
          element-loading-spinner="el-icon-loading"
          border
          max-height="500"
          style="width: 100%"
          key="index"
          :data="currentPagination"
          :default-sort="{prop: 'recName', order: 'descending'}"
          :size="rowSpace"
        >
          <el-table-column type="expand" fixed="left">
            <template slot-scope="props">
              <el-form
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-form-item label="楼栋数量：">
                  <span>{{ props.row.fNum }}</span>
                </el-form-item>
                <el-form-item label="资产编号：">
                  <span>{{ props.row.assetTag }}</span>
                </el-form-item>
                <el-form-item label="入住年份：">
                  <span>{{ props.row.chDay }}</span>
                </el-form-item>
                <el-form-item label="广告限制：">
                  <span>{{ props.row.notPush }}</span>
                </el-form-item>
                <el-form-item
                  v-if="
                    sessionData.uType == 'ADN_MD_COUNTRY' ||
                    sessionData.uType == 'ADN_BD_KA'
                  "
                  label="归属公司："
                >
                  <span class="ellipsis-td">{{
                    props.row.asName || ''
                  }}</span>
                </el-form-item>
              </el-form>

              <el-form
                v-if="customPermission.patrolPermission"
                label-position="left"
                inline
                class="demo-table-expand"
              >
                <el-form-item label="巡点问题：">
                  <span class="ellipsis-td">{{
                    props.row.remark
                  }}</span>
                </el-form-item>
                <el-form-item label="通行情况：">
                  <span class="ellipsis-td">{{
                    props.row.trafficState
                  }}</span>
                </el-form-item>
                <el-form-item
                  label="通电情况："
                  v-if="customPermission.patrolPermission == 2"
                >
                  <span class="ellipsis-td">{{
                    props.row.electrifyState
                  }}</span>
                </el-form-item>
              </el-form>
            </template>
          </el-table-column>

          <template v-for="item in currentColumn">
            <template v-if="item.label === '资源名称' && item.isChecked">
              <el-table-column
                show-overflow-tooltip
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :fixed="item.fix === 'left' ? true : false"
              >
              </el-table-column>
            </template>

            <template v-else-if="item.label === '城市' && item.isChecked">
              <el-table-column
                :filters="filterCityData"
                :filter-method="filterCity"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :fixed="item.fix === 'left' ? true : false"
              >
              </el-table-column>
            </template>

            <template v-else-if="item.label === '区域' && item.isChecked">
              <el-table-column
                :filters="filtersArea"
                :filter-method="filterOrigin"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :fixed="item.fix === 'left' ? true : false"
              >
              </el-table-column>
            </template>

            <template v-else-if="item.label === '排期' && item.isChecked">
              <el-table-column
                :filters="filtersData"
                :filter-method="filterTimeRange"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :fixed="item.fix"
              >
                <template slot-scope="scope">
                  <template v-if="scope.row.lState == 2">
                    <span>{{ scope.row.finishTimeRange }}</span>
                    <el-tooltip placement="top">
                      <div slot="content">
                        <span>{{ scope.row.timeRange }}</span>
                      </div>
                      <i class="el-icon-question"> </i>
                    </el-tooltip>
                  </template>
                  <span v-else>{{ scope.row.timeRange }}</span>
                </template>
              </el-table-column>
            </template>

            <template v-else>
              <el-table-column
                v-if="item.isChecked"
                :key="item.prop"
                :prop="item.prop"
                :label="item.label"
                :min-width="item.width"
                :fixed="item.fix === 'left' ? true : false"
              >
              </el-table-column>
            </template>
          </template>

        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          style="text-align: right; margin-top: 10px"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum"
        >
        </el-pagination>
      </div>
    </div>

    <!-- 订单/方案详情-导出点位明细-弹框组件 -->
    <ExportPointDetailDialog ref="exportPointDetailDialogRef" />
  </div>
</template>

<script>
import ScheduleAlter from '@/components/common/components/Alter/ScheduleAlter'
import TableSetting from "@/components/common/components/TableSetting"
import ExportPointDetailDialog from '@/components/common/components/point/exportPointDetailDialog.vue'
import sessFun from "@/commonFun/sessFun.js"

export default {
  name: 'planPointScheduleTable',
  components: {
    ScheduleAlter,
    TableSetting,
    ExportPointDetailDialog
  },
  emits: ['submitSuccess', 'afterClose'],
  props: {
    planDetail: {
      type: Object,
      default: () => {}
    },
    setPointDataList: {
      type: Array,
      default: () => []
    },
    setpointArr: {
      type: Array,
      default: () => []
    },
    // 城市过滤结果
    filterCityData: {
      type: Array,
      default: () => []
    },
    // 排期时间过滤
    filtersData: {
      type: Array,
      default: () => []
    },
    // 地区过滤结果
    filtersArea: {
      type: Array,
      default: () => []
    },
    apId: {
      type: String
    }
  },
  data() {
    return {
      loading: false,
      // 表头数据
      currentColumn: [
        { id: 0, label: "资源名称", prop: "resName", width:"150", isChecked: true, fix: "not" },
        { id: 1, label: "媒体名称", prop: "mTitle", width:"150", isChecked: true, fix: "not" },
        { id: 2, label: "媒体类型", prop: "mediaTypeName", width:"150", isChecked: true, fix: "not" },
        { id: 3, label: "投放面", prop: "asLab", width:"150", isChecked: true, fix: "not" },
        { id: 4, label: "位置朝向", prop: "siteOrientation", width:"150", isChecked: false, fix: "not" },
        { id: 5, label: "城市", prop: "city", width:"150", isChecked: true, fix: "not" },
        { id: 6, label: "区域", prop: "rName", width:"150", isChecked: true, fix: "not" },
        { id: 7, label: "媒体位ID", prop: "assetTag", width:"150", isChecked: false, fix: "not" },
        { id: 8, label: "街道", prop: "street", width:"150", isChecked: false, fix: "not" },
        { id: 9, label: "商圈", prop: "tradingArea", width:"150", isChecked: false, fix: "not" },
        { id: 10, label: "设备类型", prop: "mType", width:"150", isChecked: false, fix: "not" },
        { id: 11, label: "位置类型", prop: "site", width:"150", isChecked: false, fix: "not" },
        { id: 12, label: "楼栋", prop: "buildingName", width:"150", isChecked: false, fix: "not" },
        { id: 13, label: "单元", prop: "unitName", width:"150", isChecked: false, fix: "not" },
        { id: 14, label: "排期", prop: "timeRange", width:"200", isChecked: true, fix: "right" },
      ],
      rowSpace: '',
      // 分页时页面条目数量
      pageSize: 100,
      currentPage: 1,
      totalNum: 0,
      sessionData: {},
      role: '',
      customPermission: {}
    }
  },
computed: {
    currentPagination () {
      this.totalNum = this.setPointDataList.length;
      return this.setPointDataList.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
    }
  },
  methods: {
    handleExport() {
      this.$refs.exportPointDetailDialogRef && this.$refs.exportPointDetailDialogRef.open({ apId: this.apId, name: this.planDetail.apName })
    },

    /**
     * 导出excel
     */
    // export2Excel (name) {
    //     let resultArr = [];
    //     for (let data of this.setpointArr) {
    //     let obj = {
    //         province: data.province || "",
    //         city: data.city,
    //         rName: data.rName,
    //         street: data.street, //街道
    //         tradingArea: data.tradingArea,
    //         resName: data.resName,
    //         resAddress: data.resAddress,
    //         fNum: data.fNum == '0' ? '#' : data.fNum,
    //         unitCount: data.unitCount, //单元数量
    //         cType: data.cType,
    //         hPrice: data.hPrice / 100,
    //         hNum: data.hNum == '0' ? '#' : data.hNum,
    //         chDay: data.chDay,
    //         notPush: data.notPush,
    //         resAlias: data.alias,
    //         description: data.description,
    //         supportingFacilities: data.supportingFacilities,
    //         dNum: data.dNum, //出入口数
    //         liveRate: data.liveRate, //入住率
    //         liftType: data.liftType, // 配套电梯
    //         parkSpaceNum: data.parkSpaceNum || "",
    //         lat: data.lng, //经度
    //         lng: data.lat, //纬度
    //         mediaTypeName: data.mediaTypeName,
    //         mTitle: data.mTitle,
    //         buildingName: data.buildingName, //楼栋
    //         unitName: data.unitName, //单元
    //         siteOrientation: data.siteOrientation, //位置朝向
    //         assetTag: data.assetTag,
    //         mType: data.mType,
    //         site: data.site,
    //         asLab: data.asLab,
    //         adSize: data.adSize,
    //         adViewSize: data.adViewSize,
    //         mRemark: data.mRemark,
    //         timeRange: data.timeRange,
    //         mapCenter: data.mapCenterName || '',
    //         finishTimeRange: data.finishTimeRange,
    //         remark: data.remark,
    //         trafficState: data.trafficState || '',
    //         electrifyState: data.electrifyState || '',
    //         asName: data.asName,
    //     };
    //     resultArr.push(obj);
    //     }
    //     require.ensure([], () => {
    //     const { export_json_to_excel } = require('../../../../vendorExcel/Export2Excel');
    //     let tHeader = [
    //         '省份',
    //         '城市',
    //         '区域',
    //         '街道',
    //         '商圈',
    //         '资源名称',
    //         '详细地址',
    //         '楼栋数量',
    //         '单元数量',
    //         '楼盘类型',
    //         '楼盘价格',
    //         '住户数量',
    //         '入住年份',
    //         '广告限制',
    //         '资源别名',
    //         '楼盘介绍',
    //         '周边配套',
    //         '出入口数',
    //         '入住率',
    //         '配套电梯',
    //         '车位数',
    //         '经度',
    //         '纬度',
    //         '媒体类型',
    //         '媒体名称',
    //         '楼栋',
    //         '单元',
    //         '位置朝向',
    //         '媒体位ID',
    //         '设备型号',
    //         '位置类型',
    //         '投放面',
    //         '素材尺寸',
    //         '可视尺寸',
    //         '媒体备注',
    //         '投放排期',
    //         '地图中心点',
    //         '终止日期',
    //     ];
    //     let filterVal = [
    //         'province',
    //         'city',
    //         'rName',
    //         'street',
    //         'tradingArea',
    //         'resName',
    //         'resAddress',
    //         'fNum',
    //         'unitCount',
    //         'cType',
    //         'hPrice',
    //         'hNum',
    //         'chDay',
    //         'notPush',
    //         'resAlias',
    //         'description',
    //         'supportingFacilities',
    //         'dNum',
    //         'liveRate',
    //         'liftType',
    //         'parkSpaceNum',
    //         'lat',
    //         'lng',
    //         'mediaTypeName',
    //         'mTitle',
    //         'buildingName',
    //         'unitName',
    //         'siteOrientation',
    //         'assetTag',
    //         'mType',
    //         'site',
    //         'asLab',
    //         'adSize',
    //         'adViewSize',
    //         'mRemark',
    //         'timeRange',
    //         'mapCenter',
    //         'finishTimeRange',
    //     ];

    //     switch (this.customPermission.patrolPermission) {
    //         case 1:
    //         tHeader.push('巡点问题', '通行情况');
    //         filterVal.push('remark', 'trafficState');
    //         break;
    //         case 2:
    //         tHeader.push('巡点问题', '通行情况', '通电情况');
    //         filterVal.push('remark', 'trafficState', 'electrifyState');
    //         break;
    //     }

    //     if ((this.sessionData.uType == 'ADN_MD_COUNTRY') || (this.sessionData.uType == 'ADN_BD_KA')) {
    //         tHeader.push('归属公司')
    //         filterVal.push('asName');
    //     }

    //     const list = resultArr;
    //     const data = this.formatJson(filterVal, list);
    //     export_json_to_excel(tHeader, data, name);
    //     })
    //   },

      // formatJson (filterVal, jsonData) {
      //   return jsonData.map(v => filterVal.map(j => v[j]))
      // },

      // 列展示
      filterColumn(columns) {
        this.currentColumn = columns
        // this.itemKey = Math.random()
      },

      // 刷新列表
      refreshTable() {
        // this.search()
      },

      // 更改列表行距
      spaceSetting(size) {
        this.rowSpace = size;
      },

      handleSizeChange (val) {
        this.pageSize = val;
        // this.getAudioList()
      },
      handleCurrentChange (val) {
        this.currentPage = val;
        // this.getAudioList()
      },

      filterCity (value, row) {
        return row.city === value;
      },

      filterOrigin (value, row) {
        return row.rName === value;
      },

      filterTimeRange (value, row) {
        return row.timeRange === value;
      },

  },
  mounted() {
    this.sessionData = sessFun.getSess();
    this.role = this.sessionData.uType;
    this.customPermission = this.sessionData.customPermission;
  }
}
</script>

<style lang="scss" scoped="scoped">
.box-wrap {
  background-color: #fff;

  > h4 {
    height: 55px;
    padding-left: 28px;
    border-bottom: 1px solid #e6e7e9;
    font-size: 16px;
    color: rgba(51, 51, 51, 0.85);
    line-height: 55px;
    font-weight: bold;
  }
}

.table_wrap {
  padding: 8px 32px;
}

.table_wrap /deep/ .el-table__body-wrapper {
  min-height: auto;
}

.table-setting {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 16px;
  .searchBtn {
    margin-right: 8px;
    background: #1890FF;
    border: 1px solid #1890FF;
    box-shadow: 0px 2px 0px rgba(0, 0, 0, 0.043);
    border-radius: 2px;
    color: #FFFFFF;
  }
}
</style>
