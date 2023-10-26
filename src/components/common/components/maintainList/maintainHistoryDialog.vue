<template>
  <div class="dialog_container">
    <!-- 媒体维护-历史记录弹出框 -->
    <el-dialog
      :visible.sync="visible"
      :show-close="true"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="历史记录"
      width="60%"
      @closed="close"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <div class="loglist_box">
            <div class="title">
              <p>{{ logData.resName }}</p>
              <p>{{ logData.mTitle }}（{{ logData.assetTag }}）<template v-if="logData.asLab">· {{logData.asLab}}</template></p>
            </div>

            <LogList v-if="!isSellList" :list="logData.list" @toHandle="toHandle" />

            <!-- 售卖/可售卖历史记录 -->
            <SellList v-else :list="logData.list" @toHandle="toHandle" />
          </div>
        </div>
        <div class="custom_dialog_footer">
          <el-button @click="close" size="small">关 闭</el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 媒体维护-历史记录-处理弹框组件 -->
    <MaintainHandleDialog ref="maintainHandleDialogRef" @submitSuccess="handleSuccess"/>
  </div>
</template>

<script>
import { Message } from "element-ui";
import LogList from '@/components/common/components/logList.vue'
import SellList from '@/components/common/components/sellList.vue'
import MaintainHandleDialog from './maintainHandleDialog.vue'
import sessFun from "@/commonFun/sessFun.js";
import { deserialize } from '@/utils/common'

export default {
  name: 'maintainHistoryDialog',
  components: {
    LogList,
    SellList,
    MaintainHandleDialog
  },
  props: {
    preparedData: {
      type: Object,
      default: () => {
        return {
          propTwoSelectList: []
        }
      }
    }
  },
  emits: ['refresh', 'close'],
  data() {
    return {
      dialogLoading: false,
      isEdit: false,
      visible: false,
      isSellList: false,
      logData: {
        resName: '',
        mTitle: '',
        assetTag: '',
        list: []
      },
      currentItem: null
    }
  },
  methods: {
    /**
     * 获取媒体点位的售卖状态记录
     */
    async getSellList(row) {
      if (!row) return console.error('getSellList error: row 不能为空')
      try {
        const { token, uID: uid } = sessFun.getSess()
        this.dialogLoading = true
        const res = await this.$api.postApi_new(this.apiVar.Media, {
          token,
          uid,
          service: "GetMediaMaintainOperationLogAction",
          data: {
            recordId: row.recordId,
            pageNum: 1,
            pageSize: 80,
          },
        })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return Message.error(message || '获取数据失败')

        const list = data.list.map(item => {
          let rmarkCtx = deserialize(item.remark) || []
          return {
            ...item,
            remark: Array.isArray(rmarkCtx) ? rmarkCtx : [ rmarkCtx ],
            sellState: item.operationType === 1 ? '不可售卖' : '可售卖'
          }
        })
        const { resName, mTitle, assetTag, asLab } = row
        this.logData = { resName, mTitle, assetTag, asLab, list }

      } catch (err) {
        Message.error(String(err) || '获取数据失败')
        console.error('getSellList error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 获取历史记录
     */
     async getHistoryList(row) {
      if (!row) return console.error('getHistoryList error: row 不能为空')
      try {
        const { token, uID: uid } = sessFun.getSess()
        this.dialogLoading = true
        const res = await this.$api.postApi_new(this.apiVar.Media, {
          uid,
          token,
          service: "GetMediaMaintenanceHistoryListAction",
          data: {
            mID: row.mID,
            pageNum: 1,
            pageSize: 80,
          },
        })
        const { SysCode: code, MSG: message, data } = res.data
        if (code !== 200200) return Message.error(message || '获取数据失败')

        const list = data.list.map(item => {
          const { createTime: time, patrolPointFields, resAddress: address, recordId, mID, type } = item
          let typeStr = ''
          switch (type) {
            case 1:
              typeStr = '巡点'
              break
            case 2:
              typeStr = '待维修'
              break
            case 3:
              typeStr = '拆除'
              break
          }
          return {
            time,
            patrolPointFields,
            address,
            recordId,
            mID,
            type: typeStr
          }
        })
        const { resName, mTitle, assetTag, asLab } = row
        this.logData = { resName, mTitle, assetTag, asLab, list }

      } catch (err) {
        Message.error(String(err) || '获取数据失败')
        console.error('getHistoryList error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 处理
     */
    toHandle (item) {
      this.$refs.maintainHandleDialogRef && this.$refs.maintainHandleDialogRef.open(item);
    },
    /**
     * 处理成功回调
     */
    handleSuccess() {
      this.close()
      this.$emit('refresh')
    },
    /**
     * 获取数据
     */
    getData() {
      const row = this.currentItem
      if (row.typeName === '不可售卖') {
        this.isSellList = true
        this.getSellList(row)
      } else {
        this.isSellList = false
        this.getHistoryList(row)
      }
    },
    /**
     * 打开弹框
     */
    open(row) {
      this.currentItem = { ...row }
      this.visible = true
      this.getData()
    },
    /**
     * 关闭弹框
     */
    close() {
      if (this.visible) {
        this.currentItem = null
        this.$emit('close')
        this.visible = false
      }
    }
  },
}
</script>

<style lang="scss" scoped="scoped">
.dialog_container {
  /deep/ .el-dialog__body {
    padding: 0;
  }
  .custom_dialog_footer{
    padding: 10px 20px 20px;
  }

  .loglist_box .title {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    padding: 8px 12px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 500;
    margin-bottom: 16px;
  }

  .loglist_box .title p:last-child {
    font-size: 14px;
    margin-top: 2px;
  }
}
</style>
