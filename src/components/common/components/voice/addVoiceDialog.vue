<template>
  <div class="add_voice_dialog">
    <!-- 添加音频 - 弹框组件 -->
    <el-dialog
      title="添加音频"
      :visible.sync="visible"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <div class="step_bar">
            <el-steps :active="activeStep" finish-status="success" align-center>
              <el-step v-for="(item, i) in stepList" :key="i" :title="item.title"></el-step>
            </el-steps>
          </div>
          <div v-if="stepList[activeStep].subTitle" class="step_title">{{ stepList[activeStep].subTitle }}</div>
          <div class="form_wrapper">
            <!-- 音频信息表单 -->
            <el-form
              v-if="activeStep === 0"
              ref="voiceFormRef"
              :model="voiceFormData"
              :rules="voiceFormRules"
              label-width="100px"
              size="small"
              class="voice_form"
            >

              <el-form-item label="音频标题：" prop="title">
                <el-input
                v-model.trim="voiceFormData.title"
                :disabled="!!voiceFormData.voiceId"
                placeholder="请输入音频标题"
                class="form_item_width"
                maxlength="30"
              ></el-input>
              </el-form-item>

              <el-form-item label="音频素材：" prop="voiceId">
                <!-- 选择的音频 -->
                <div v-if="voiceFormData.voiceId" class="voice_show_box">
                  <img src="../../../../assets//images/audio_icon.png"/>
                  <div class="btn_box">
                    <i class="el-icon-service listen_icon" @click="playSelectVioce"></i>
                  </div>
                  <i class="el-icon-error close_icon" @click="clearSelectVoice"></i>
                </div>
                <div class="radio_button_box">
                  <el-radio-group v-model="activeMaterialBtnVal" :disabled="!voiceFormData.title">
                    <el-radio-button v-for="(item, i) in materialBtnList" :key="i" :label="item.value">
                      {{ item.label }}
                    </el-radio-button>
                  </el-radio-group>
                </div>
                <!-- 制作音频 -->
                <div v-if="activeMaterialBtnVal === 0" class="make_voice_box" :class="{ disabled: !voiceFormData.title }">
                  <div class="icon_box">
                    <img src="../../../../assets//images/audio_icon.png"/>
                  </div>
                  <el-button type="primary" @click="handleMakeVoiceBtnClick" :disabled="!voiceFormData.title">制作音频</el-button>
                </div>
                <!-- 上传音频 -->
                <el-upload
                  v-else
                  :action="uploadData.action"
                  :headers="uploadData.headers"
                  :data="{
                    title: voiceFormData.title
                  }"
                  :name="uploadData.name"
                  :show-file-list="false"
                  :before-upload="handleBeforeUpload"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  :disabled="!voiceFormData.title"
                  drag
                  class="upload_voice_box"
                  :class="{ disabled: !voiceFormData.title }"
                >
                  <div class="icon_box">
                    <img src="../../../../assets//images/audio_icon.png"/>
                  </div>
                  <div class="upload_text">将音频拖到此处，或 <em>点击上传</em></div>
                  <div class="upload_tip" slot="tip">
                    <span class="start_text">* </span>只能上传 WAV 格式音频文件，时长10-15秒且不超过3M
                  </div>
                </el-upload>
              </el-form-item>

            </el-form>
            <!-- 播放信息表单 -->
            <el-form
              v-else-if="activeStep === 1"
              ref="playFormRef"
              :model="playFormData"
              :rules="playFormRules"
              label-width="100px"
              size="small"
              class="play_form"
            >

              <el-form-item label="排期方式：" prop="publishType">
                <el-radio-group v-model="playFormData.publishType" @change="changePublishType">
                  <el-radio-button v-for="(item, i) in scheduleBtnList" :key="i" :label="item.value">
                    {{ item.label }}
                  </el-radio-button>
                </el-radio-group>
              </el-form-item>

              <el-form-item v-if="playFormData.publishType == 3" label="日期：" prop="dateRange">
                <el-date-picker
                  v-model="playFormData.dateRange"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-DD"
                  align="right"
                  :disabled="playFormData.publishType !== 3"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label="投放设备：" prop="publishDeviceType">
                <el-radio-group v-model="playFormData.publishDeviceType">
                  <el-radio-button v-for="(item, i) in deviceBtnList" :key="i" :label="item.value">
                    {{ item.label }}
                  </el-radio-button>
                </el-radio-group>
                <el-button type="text" size="small" style="margin-left: 60px;" @click="openMediaTableDialog">媒体列表</el-button>
              </el-form-item>

              <el-form-item label="投放时段：" prop="publishTimeRange">
                <el-radio-group v-model="playFormData.publishTimeRange">
                  <el-radio-button v-for="(item, i) in timeBtnList" :key="i" :label="item.value">
                    {{ item.label }}
                  </el-radio-button>
                </el-radio-group>
                <div v-if="playFormData.publishTimeRange === 2" class="time_select_box">
                  <!-- 时段选择器 - 组件 -->
                  <TimeFrameSelect ref="timeFrameSelectRef" v-model="playFormData.playTimes"/>
                </div>
              </el-form-item>

            </el-form>
            <!-- 完成创建 -->
            <div v-else-if="activeStep === 2" class="finish_box">
              <i class="el-icon-success icon_font"></i>
              <div class="title">创建成功</div>
              <div class="date_text">创建日期：2018年3月18日</div>
            </div>

          </div>
        </div>
        <div class="custom_dialog_footer">
          <el-button @click="close" size="small">取 消</el-button>
          <el-button type="primary" @click="handleNextStep" size="small">
            {{ activeStep !== 2 ? '下一步' : '确定' }}
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 制作音频 - 弹框组件-->
    <MakeVoiceDialog ref="makeVoiceDialogRef" @confirm="confirmMakeVoice"/>

    <!-- 媒体列表 - 弹框组件-->
    <MediaTableDialog ref="mediaTableDialogRef" :apId="voiceFormData.apId" @confirm="confirmSelectMedia"/>

    <!-- 音频播放器 -->
    <audio ref="audioRef" @error="handleAudioError"></audio>
  </div>
</template>

<script>
import FileSaver from 'file-saver';
import { Message } from "element-ui";

import api from "../../../../api/api.js";
import sessFun from "../../../../commonFun/sessFun.js";
import filterData from "../../../../commonFun/filterTableData.js";
import TimeFrameSelect from './timeFrameSelect.vue'
import MakeVoiceDialog from "./makeVoiceDialog.vue"
import MediaTableDialog from "./mediaTableDialog.vue"

const initVoiceFormData = () => ({
  // 订单ID
  apId: null,
  // 音频数据Id
  id: null,
  // 排期Id
  scheduleId: '',
  // 音频标题
  title: '',
  // 音频文件ID
  voiceId: '',
  // 音频文件地址
  voiceUrl: ''
})

const initPlayFormData = () => ({
  // 排期方式
  publishType: 2,
  dateRange: [],
  startDate: null,
  endDate: null,
  // 投放设备类型
  publishDeviceType: 2,
  // 投放时段
  publishTimeRange: 1,
  // 投放时间
  playTimes: [],
  // 投放设备列表
  medias: [],
  isSelectAll: false,
  //
  // mediaIds: [],
})

export default {
  components: {
    TimeFrameSelect,
    MakeVoiceDialog,
    MediaTableDialog
  },
  emits: ['refreshList'],
  data () {
    return {
      visible: false,
      dialogLoading: false,
      activeStep: 0,
      stepList: [
        { title: '完善音频信息', subTitle: '音频信息' },
        { title: '确认播放信息', subTitle: '播放信息' },
        { title: '完成创建', subTitle: '' },
      ],
      // 音频素材-单选按钮组
      materialBtnList: [
        { label: '文本转音频', value: 0 },
        { label: '上传音频', value: 1 },
      ],
      activeMaterialBtnVal: 0,
      // 音频信息表单
      voiceFormData: initVoiceFormData(),
      voiceFormRules: {
        title: [{ required: true, message: '请输入音频标题', trigger: 'blur'}],
        voiceId: [{ required: true, message: '请选择音频素材', trigger: 'blur'}]
      },
      // 播放信息表单
      playFormData: initPlayFormData(),
      playFormRules: {
        publishType: [{ required: true, message: '请选择排期方式', trigger: 'change'}],
        dateRange: [{
          validator: (rule, value, callback) => {
            if (this.playFormData.publishType === 3 && (!this.playFormData.dateRange || !this.playFormData.dateRange.length)) {
              callback(new Error('请选择自定义日期'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        // publishDeviceType: [{
        //   validator: (rule, value, callback) => {
        //     const condition = this.playFormData.medias.length || this.playFormData.isSelectAll
        //     if (this.playFormData.publishDeviceType === 2 && condition) {
        //       callback()
        //     } else {
        //       callback(new Error('请选择投放设备'))
        //     }
        //   },
        //   trigger: 'blur'
        // }],
        publishTimeRange: [{
          validator: (rule, value, callback) => {
            if (this.playFormData.publishTimeRange === 2 && (!this.playFormData.playTimes || !this.playFormData.playTimes.length)) {
              callback(new Error('请选择投放时段'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
      },
      // 排期方式-单选按钮组
      scheduleBtnList: [
        { label: '按工程完成上画任务后', value: 2 },
        { label: '时间自定义', value: 3 },
      ],
      // 投放设备-单选按钮组
      deviceBtnList: [
        // { label: '全媒体', value: 1 },
        { label: '指定媒体', value: 2 },
      ],
      // 投放时段-单选按钮组
      timeBtnList: [
        { label: '全时段', value: 1 },
        { label: '指定时段', value: 2 },
      ],
      uploadData: {
        // 	必选参数，上传的地址
        action: '',
        // 设置上传的请求头部
        headers: {},
        // 上传时附带的额外参数
        // data: {},
        // 上传的文件字段名
        name: 'file'
      }
    };
  },
  methods: {
    /**
     * 播放音频
     */
     playAudio(src) {
      if (this.$refs.audioRef) {
        this.$refs.audioRef.src = src
        this.$refs.audioRef.play()
      }
    },
    handleAudioError() {
      Message.error('音频加载失败')
    },
    /**
     * 播放已选的音频
     */
    playSelectVioce () {
      this.playAudio(this.voiceFormData.voiceUrl)
    },
    /**
     * 清除已选的音频
     */
    async clearSelectVoice () {
      try {
        await this.$confirm(`删除音频无法恢复，是否继续？`, '温馨提示', {
          type: 'warning'
        })
      } catch (err) {
        return
      }
      try {
        const { voiceId: id } = this.voiceFormData
        this.dialogLoading = true
        const res = await api.postApi_json('addsp/api/v1/voice/voice/delete', { id })
        const { code, data, message } = res.data
        if (code !== 200) return Message.error(message)
        this.voiceFormData.voiceUrl = ''
        this.voiceFormData.voiceId = ''
      } catch (err) {
        Message.error('操作失败')
        console.error('clearSelectVoice error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 打开媒体列表选择弹框
     */
    openMediaTableDialog() {
      this.$refs.mediaTableDialogRef && this.$refs.mediaTableDialogRef.open(this.voiceFormData.id)
    },
    /**
     * 切换排期方式
     */
    changePublishType() {
      // if (this.playFormData.publishType !== 3) {
      //   this.playFormData.dateRange = []
      // }
    },
    /**
     * 初始化上传数据
     */
    initUploadData() {
      const { token, uID: uid } = sessFun.getSess() || {}
      this.uploadData = {
        ...this.uploadData,
        action: this.apiVar.qadnUrl + '/addsp/api/v1/voice/voice/upload',
        headers: {
          token,
          uid
        }
      }
    },
    /**
     * 上传音频 - 上传前校验
     */
    handleBeforeUpload(file) {
      // 必须先填写音频标题
      const voiceTitle = this.voiceFormData.title
      if (!voiceTitle) {
        Message.warning('请先填写音频标题')
        return false
      }
      // 校验文件类型
      if (!file.type.toLowerCase().includes('wav')) {
        Message.warning('请上传 WAV 格式文件')
        return false
      }
      // 校验文件大小不超过 3M
      if (file.size / 1024 / 1024 > 3) {
        Message.warning('请上传小于 3M 的文件')
        return false
      }
      return true
    },
    /**
     * 上传音频 - 上传成功
     */
    handleUploadSuccess(res) {
      if (!res || !res.data) return Message.error('上传失败')
      const { id: voiceId, url: voiceUrl } = res.data
      this.voiceFormData.voiceId = voiceId
      this.voiceFormData.voiceUrl = voiceUrl
      Message.success('上传成功')
    },
    /**
     * 上传音频 - 上传出错
     */
    handleUploadError(err) {
      Message.error('上传出错')
    },
    /**
     * 选择媒体设备回调
     */
    confirmSelectMedia({ list, isCheckAll }) {
      this.playFormData.isSelectAll = isCheckAll
      this.playFormData.medias = list
    },
    /**
     * 制作音频回调
     */
    confirmMakeVoice({ voiceId, voiceUrl }) {
      this.voiceFormData.voiceId = voiceId
      this.voiceFormData.voiceUrl = voiceUrl
    },
    /**
     * 点击制作音频
     */
    handleMakeVoiceBtnClick () {
      // 必须先填写音频标题
      const voiceTitle = this.voiceFormData.title
      if (!voiceTitle) return Message.warning('请先填写音频标题')
      this.$refs.makeVoiceDialogRef && this.$refs.makeVoiceDialogRef.open(voiceTitle)
    },
    /**
     * 下一步
     */
    async handleNextStep() {
      try {
        if (this.activeStep === 0) {
          const validRes = await this.$refs['voiceFormRef'].validate()
          if (!validRes) return false
        }
        else if (this.activeStep === 1) {
          const validRes = await this.$refs['playFormRef'].validate()
          if (!validRes) return false
          // 提交表单
          const [startDate = null, endDate = null] = this.playFormData.dateRange
          const params = {
            ...this.voiceFormData,
            ...this.playFormData,
            startDate,
            endDate
          }
          let res = null
          this.dialogLoading = true
          if (params.id) {
            res = await api.postApi_json('/addsp/api/v1/voice/update', params)
          } else {
            res = await api.postApi_json('/addsp/api/v1/voice/create', params)
          }
          if (!res || !res.data) return Message.error('提交表单数据失败')
          const { code, data, MSG } = res.data
          if (code !== 200) return Message.error(MSG || '提交表单数据失败')
          this.$emit('refreshList')
        }
        else if (this.activeStep === 2) {
          this.close()
        }
        if (++this.activeStep > this.stepList.length - 1) this.activeStep = 0;
      } catch (err) {
        console.error('handleNextStep error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 获取记录详情数据
     */
    async getRecordData(id) {
      if (!id) return
      try {
        this.dialogLoading = true
        const { data = {} } = await api.getApi('/addsp/api/v1/voice/getVoiceDetail', { id })
        const { code, data: res, message } = data
        if (code !== 200) return Message.error(message || '获取数据失败')
        const { title, voiceId, publishType, startDate, endDate, publishDeviceType, publishTimeRange, playTimes, voiceUrl } = res
        this.voiceFormData = {
          ...this.voiceFormData,
          title,
          voiceId,
          voiceUrl
        }
        this.playFormData = {
          ...this.playFormData,
          publishType,
          startDate,
          endDate,
          dateRange: [ startDate, endDate ],
          publishDeviceType,
          publishTimeRange,
          playTimes,
        }
      } catch (err) {
        Message.error(err || '获取数据失败')
        console.error('getRecordData error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 打开弹框
     */
    open({ apId, recordId = null }) {
      if (!apId) {
        console.error('open error: 缺少参数 apId')
        return
      }
      if (recordId) {
        this.voiceFormData.id = recordId
        this.getRecordData(recordId)
      }
      this.activeStep = 0
      this.voiceFormData.apId = apId
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      this.activeStep = 0
      this.recordId = null
      this.dialogLoading = false
      this.voiceFormData = initVoiceFormData()
      this.playFormData = initPlayFormData()
      this.$refs.voiceFormRef && this.$refs.voiceFormRef.clearValidate()
      this.$refs.playFormRef && this.$refs.playFormRef.clearValidate()
      this.visible = false
    },
  },
  mounted () {
    this.initUploadData()
  },

};
</script>

<style lang="scss" scoped>
.add_voice_dialog {
  /deep/ .el-form-item--small .el-form-item__content {
    line-height: 32px !important;
  }
  /deep/ .el-button.el-button--text span {
    position: relative;
    top: 0 !important;
  }
  /deep/ .el-dialog .el-dialog__body {
    padding: 0;
  }
  .dialog_content {
    .step_bar {
      margin-bottom: 24px;
      /deep/ .el-step__title.is-success {
        color: #1890FF;
      }
      /deep/ .el-step__head.is-success {
        color: #1890FF;
        border-color: #1890FF;
      }
    }
    .step_title {
      height: 32px;
      line-height: 32px;
      background-color: #F1F1F1;
      padding: 0 14px;
      margin-bottom: 24px;
      font-weight: 600;
    }
    .radio_button_box {
      margin-bottom: 16px;
    }
    .voice_show_box {
      width: 50px;
      height: 50px;
      border-radius: 4px;
      background: #f5f5f5;
      margin-bottom: 10px;
      margin-top: 10px;
      position: relative;
      &:hover .btn_box {
        display: block;
      }
      .btn_box {
        width: 100%;
        height: 100%;
        border-radius: 4px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
        background-color: rgba(0, 0, 0, 0.5);
        display: none;
        text-align: center;
        .listen_icon {
          font-size: 26px;
          color: #fff;
          cursor: pointer;
          line-height: 50px;
        }
      }
      .close_icon {
        font-size: 20px;
        color: #F56C6C;
        cursor: pointer;
        position: absolute;
        right: -10px;
        top: -10px;
        z-index: 20;
      }
      img {
        width: 100%;
        height: 100%;
        border-radius: 4px;
      }
    }
    .make_voice_box {
      width: 314px;
      height: 132px;
      border-radius: 2px;
      border: 1px solid #D9D9D9;
      background: #FAFAFA;
      display: flex;
      align-items: center;
      // justify-content: center;
      flex-direction: column;
      box-sizing: border-box;
      &.disabled {
        opacity: 0.5;
      }
      .icon_box {
        width: 32px;
        height: 32px;
        margin: 25px auto 15px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .upload_voice_box {
      &.disabled {
        opacity: 0.5;
      }
      /deep/ .el-upload-dragger {
        width: 314px;
        height: 132px;
        border-radius: 2px;
        border: 1px solid #D9D9D9;
        background: #FAFAFA;
        display: flex;
        align-items: center;
        // justify-content: center;
        flex-direction: column;
        box-sizing: border-box;
        margin-bottom: 8px;
      }
      .icon_box {
        width: 32px;
        height: 32px;
        margin: 25px auto 10px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .start_text {
        color: #FF4949;
      }
      .upload_tip {
        color: rgba(0, 0, 0, 0.45);
        font-family: PingFang SC;
        font-size: 12px;
        line-height: 20px;
      }
      .upload_text {
        color: rgba(0, 0, 0, 0.85);
        text-align: center;
        font-family: Roboto;
        font-size: 14px;
        line-height: 24px;
        em {
          color: #1890FF;
        }
      }
    }

    .finish_box {
      text-align: center;
      padding-top: 52px;
      .icon_font {
        font-size: 72px;
        color: #52C41A;
        margin-bottom: 24px;
      }
      .title {
        color: #333;
        text-align: center;
        font-family: PingFang SC;
        font-size: 24px;
        font-weight: 500;
        line-height: 32px;
        margin-bottom: 8px;
      }
      .date_text {
        color: #999;
        text-align: center;
        font-family: PingFang SC;
        font-size: 14px;
        line-height: 22px;
      }
    }
    .time_select_box {
      margin-top: 16px;
    }
  }

  .dialog_footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .form_item_width {
    width: 314px;
  }

}

</style>
