<template>
  <div class="add_voice_dialog">
    <!-- 添加音频 - 弹框组件 -->
    <el-dialog
      title="添加音频"
      :visible.sync="visible"
      width="800px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
      center
    >
      <div class="dialog_content">
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
            <el-input v-model="voiceFormData.title" placeholder="请输入" class="form_item_width"></el-input>
          </el-form-item>

          <el-form-item label="音频素材：" prop="title">
            <div class="radio_button_box">
              <el-radio-group v-model="activeMaterialBtnVal">
                <el-radio-button v-for="(item, i) in materialBtnList" :key="i" :label="item.value">
                  {{ item.label }}
                </el-radio-button>
              </el-radio-group>
            </div>
            <!-- 制作音频 -->
            <div v-if="activeMaterialBtnVal === 0" class="make_voice_box">
              <div class="icon_box">
                <img src="../../../assets//images/audio_icon.png"/>
              </div>
              <el-button type="primary" @click="handleMakeVoiceBtnClick">制作音频</el-button>
            </div>
            <!-- 上传音频 -->
            <el-upload
              v-else
              class="upload_voice_box"
              drag
              action="https://jsonplaceholder.typicode.com/posts/"
              multiple>
              <div class="icon_box">
                <img src="../../../assets//images/audio_icon.png"/>
              </div>
              <div class="upload_text">将音频拖到此处，或 <em>点击上传</em></div>
              <div class="upload_tip" slot="tip">
                <span class="start_text">* </span>只能上传MP3格式音频文件，时长10-15秒且不超过3M
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

          <el-form-item label="排期方式：" prop="title">
            <el-radio-group v-model="activeScheduleBtnVal">
              <el-radio-button v-for="(item, i) in scheduleBtnList" :key="i" :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="日期：" prop="title">
            <el-date-picker
              v-model="playFormData.date"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              align="right"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="投放设备：" prop="title">
            <el-radio-group v-model="activeDeviceBtnVal">
              <el-radio-button v-for="(item, i) in deviceBtnList" :key="i" :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
            <el-button type="text" size="small" style="margin-left: 60px;">媒体列表</el-button>
          </el-form-item>

          <el-form-item label="投放时段：" prop="title">
            <el-radio-group v-model="activeTimeBtnVal">
              <el-radio-button v-for="(item, i) in timeBtnList" :key="i" :label="item.value">
                {{ item.label }}
              </el-radio-button>
            </el-radio-group>
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
      <div slot="footer" class="dialog_footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">
          下一步
        </el-button>
      </div>
    </el-dialog>

    <!-- 收藏列表 -->
    <!-- <VacancyDownloadCollect ref="vacancyDownloadCollect" :collectList="collectList" @getCollectList="getCollectList" @cancelCollect="cancelCollect"/> -->
  </div>
</template>

<script>
import FileSaver from 'file-saver';
import { Message } from "element-ui";

import api from "../../../api/api.js";
import sessFun from "../../../commonFun/sessFun.js";
import filterData from "../../../commonFun/filterTableData.js";
// import VacancyDownloadCollect from './vacancyDownloadCollect.vue'

const initVoiceFormData = () => ({
  // 音频标题
  title: '',
})

const initPlayFormData = () => ({
  date: null,
})

export default {
  components: {
    // VacancyDownloadCollect
  },
  data () {
    return {
      visible: false,
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
      voiceFormData: initVoiceFormData(),
      voiceFormRules: {},
      playFormData: initPlayFormData(),
      playFormRules: {},
      // 排期方式-单选按钮组
      scheduleBtnList: [
        { label: '按订单投放日期', value: 0 },
        { label: '按工程完成上画任务后', value: 1 },
        { label: '自定义', value: 2 },
      ],
      activeScheduleBtnVal: 0,
      // 投放设备-单选按钮组
      deviceBtnList: [
        { label: '全媒体', value: 0 },
        { label: '指定媒体', value: 1 },
      ],
      activeDeviceBtnVal: 0,
      // 投放时段-单选按钮组
      timeBtnList: [
        { label: '全时段', value: 0 },
        { label: '指定时段', value: 1 },
      ],
      activeTimeBtnVal: 0,
    };
  },
  methods: {
    handleMakeVoiceBtnClick () {

    },
    handleNextStep() {
      if (++this.activeStep > this.stepList.length - 1) this.activeStep = 0;
    },
    handleConfirm() {
      this.handleNextStep()
    },
    open() {
      this.visible = true
    },
    close() {
      this.visible = false
    },
  },
  mounted () {
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
