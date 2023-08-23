<template>
  <div class="add_voice_dialog">
    <!-- 制作音频 - 弹框组件 -->
    <el-dialog title="制作音频" :visible.sync="visible" width="800px">
      <div class="dialog_content">
      <div class="step_bar">
        <el-steps :active="activeStep" finish-status="success" align-center>
          <el-step v-for="(item, i) in stepList" :key="i" :title="item.title"></el-step>
        </el-steps>
      </div>
      <div class="step_title">{{ stepList[activeStep].subTitle }}</div>
      <div class="form_wrapper">
        <!-- 音频信息表单 -->
        <el-form ref="voiceFormRef" :model="voiceFormData" :rules="rules" label-width="100px" size="small" class="voice_form">

          <el-form-item label="音频标题：" prop="title">
            <el-input v-model="voiceFormData.title" placeholder="请输入" class="form_item_width"></el-input>
          </el-form-item>

        </el-form>
        <!-- 播放信息表单 -->

      </div>
      </div>
      <div slot="footer" class="dialog_footer">
        <el-button @click="close" size="small">取 消</el-button>
        <el-button type="primary" @click="handleConfirm" size="small">
          确 定
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
  id: 0,
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
      voiceFormData: initVoiceFormData(),
      voiceFormRules: [],
      playFormData: initPlayFormData(),
      playFormRules: [],
    };
  },
  methods: {
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
  .dialog_content {
    .step_bar {
      margin-bottom: 14px;
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