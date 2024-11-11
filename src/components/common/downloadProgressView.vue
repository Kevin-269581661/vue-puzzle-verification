<!-- 轮询查询下载进度页面 -->
<template>
  <div class="down_page">
    <el-progress
      type="circle"
      :width="120"
      :status="progressStatus"
      :percentage="percentNum"
    ></el-progress>

    <p v-if="progressStatus === 'success'" class="text_style">
      处理完成
    </p>

    <p v-else-if="progressStatus === 'exception'" class="text_style" style="color: #F56C6C">
      处理失败，请稍后重试~
    </p>

    <p v-else-if="progressStatus === 'warning'" class="text_style">
      处理完成，部分处理失败，<a href="javaScript:;" class="nav-text" @click="openFailResultDialog">查看处理失败列表</a>
    </p>

    <p v-else class="text_style">
      正在处理中，请等待...
    </p>

    <span v-if="percentNum < 100" class="nav"
      >已耗时 {{ Math.ceil(spendSecond / 60) }} 分钟，<a
        class="nav-text"
        href="https://apps.qinlinad.com/rapidDownload.html"
        target="_blank"
        >立即加速</a
    ></span>

    <!-- <div class="file_style" v-if="percentNum == 100">
      <img src="../../assets/images/downfile.png" alt="" />
    </div> -->

    <!-- 非系统订单-图片导入文件匹配失败-弹窗 -->
    <FailListDialog ref="failListDialogRef" targetName="非系统订单图片导入"/>
  </div>
</template>

<script>
import FailListDialog from '@/components/common/components/failListDialog/index.vue'

// 轮询任务间隔时长（毫秒）
const TASK_INTERVAL = 10000

export default {
  name: 'downloadProgressView',
  components: { FailListDialog },
  data() {
    return {
      sessionData: null,
      // 已耗时（秒）
      spendSecond: 0,
      taskTimer: null,
      // 进度
      percentNum: 0,
      // 不符合要求数据列表
      failList: [],
      // 请求标识（第一次请求后返回）
      // uqKey: '',
      // 进度条状态：'' 正常, success 成功, exception 失败, warning 警告
      progressStatus: null
    };
  },
  methods: {

    /**
     * 打开处理结果弹窗
     */
    openFailResultDialog() {
      if (!this.failList.length) return
      const list = this.failList
      const columns = [
        {
          title: '失败文件名称',
          dataIndex: 'name',
        },
        {
          title: '失败信息',
          dataIndex: 'msg',
        }
      ]
      this.$refs.failListDialogRef && this.$refs.failListDialogRef.open({ list, columns })
    },


    /**
     * 开启轮询任务
     */
     async beginTask() {
      try {
        const isComplete = await this.getResult()
        if (isComplete) {
          if (this.failList.length) {
            console.log('failList ===', this.failList)
            this.progressStatus = 'warning'
            this.openFailResultDialog()
            return
          }
          this.progressStatus = 'success'
          // this.$message.success('操作成功')
          this.$alert("操作成功")
        } else {
          await this.sleep(TASK_INTERVAL)
          // 粗略计算累积时间
          this.spendSecond += (TASK_INTERVAL / 1000)
          this.beginTask()
        }
      } catch (err) {
        this.stopTask()
        // 此处使用模态框提示（重提示）
        // this.$message.error(String(err) || '操作失败')
        this.$alert("操作失败: " + err)
        this.progressStatus = 'exception'
        console.error('beginTask error:', err)
      }
    },

    /**
     * 停止轮询任务
     */
    stopTask() {
      if (this.taskTimer) clearTimeout(this.taskTimer)
    },

    sleep(timestamp) {
      if (this.taskTimer) clearTimeout(this.taskTimer)
      return new Promise((resolve, reject) => {
        this.taskTimer = setTimeout(() => {
          resolve()
        }, timestamp)
      })
    },

    /**
     * 查询处理结果
     */
    async getResult() {
      const { downtype } = this.$route.query
      let res = null
      switch(Number(downtype)) {
        // case 1:
        //   break
        // case 2:
        //   break
        // case 3:
        //   break
        // 非系统订单-图片导入
        case 4:
          res = await this.$api.photoPackage.matchSpace({
            ...this.$route.query,
            zipUrl: decodeURIComponent(this.$route.query.zipUrl)
          })
          break
        default:
      }
      const { SysCode: code, MSG: message, data } = res.data || {}
      if (code !== 200200) throw new Error(message)
      const { rate, failList, uqKey } = data
      this.percentNum = Number(rate)
      this.failList = failList || []
      if (!this.$route.query.uqKey) {
        this.$router.replace({
          query: {
            ...this.$route.query,
            uqKey
          }
        })
      }
      return this.percentNum >= 100
    }
  },
  mounted() {
    if (this.$route.query.downtype) {
      this.beginTask()
    } else {
      this.$message.error('操作失败：downtype 参数缺失')
    }
  },
  beforeDestroy() {
    this.stopTask()
  },
};
</script>

<style scoped>
.down_page {
  text-align: center;
  padding-top: 25%;
}
.text_style {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  margin-top: 8px;
  margin-bottom: 8px;
}
.nav {
  font-size: 14px;
  font-weight: 400;
  color: rgba(0, 0, 0, 0.65);
  line-height: 22px;
}
.nav-text {
  color: #4aa6fc;
}
.file_style {
  position: absolute;
  bottom: 0;
  left: 40px;
}
.file_style img {
  display: inline-block;
  width: 148px;
  height: 84px;
}
</style>
