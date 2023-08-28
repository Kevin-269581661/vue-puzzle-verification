<template>
  <div class="make_voice_dialog">
    <!-- 制作音频 - 弹框组件 -->
    <el-dialog
      title="制作音频"
      :visible.sync="visible"
      width="1300px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="true"
    >
      <div v-loading="dialogLoading" class="dialog_content">
        <div class="custom_dialog_body">
          <el-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-width="120px"
          size="small"
          class="form"
        >
          <div class="step_title">第一步：选择音色</div>

            <el-form-item label-width="0" prop="voiceType">
              <!-- <div class="tone_box">
                <el-radio-group v-model="activeToneBtnVal" size="small">
                  <el-radio-button
                    v-for="(item, i) in toneBtnList"
                    :key="i"
                    :label="item.value"
                    type="plain"
                  >
                    {{ item.label }}
                  </el-radio-button>
                </el-radio-group>
                <span class="start_text">* </span><span class="text">精品音色基于更优质的算法进行合成，发音更加细腻流畅</span>
              </div> -->
              <!-- 音色选择列表 -->
              <div class="tone_list_wrapper">
                <div class="tone_list">
                  <div
                    v-for="(item, i) in toneList"
                    :key="i"
                    class="tone_item"
                    :class="{ active: formData.voiceType === item.voiceType }"
                    @click="handleToneItemClick(item)"
                  >
                    <div class="avatar_box">
                      <img :src="item.icon || require('../../../../assets//images/default_avatar.png')" alt="">
                    </div>
                    <div class="info_box">
                      <div class="name_box">
                        <span class="text" :title="item.name">{{ item.name }}</span>
                        <span class="tag_box">{{ item.tag }}</span>
                      </div>
                      <div class="desc_box">{{ item.title }}</div>
                    </div>
                    <!-- <div class="play_box" @click="playToneAudio(item)">
                      <img src="../../../../assets/images/play_icon.png" alt="">
                    </div> -->
                  </div>
                </div>
              </div>
            </el-form-item>

            <!-- <div class="step_title">第二步：调节音量和语速</div>

            <el-form-item label-width="110px" label="语速" prop="title">
              <div class="speed_box">
                <el-slider v-model="formData.value"  :marks="marks"></el-slider>
              </div>
            </el-form-item> -->

            <div class="step_title">第二步：输入需要合成的文字</div>

            <!-- <el-form-item label="覆盖要求：" prop="title">
              <el-radio-group v-model="formData.radio">
                <el-radio v-for="item in coverRadioList" :key="item.value" :label="item.value">{{ item.label }}</el-radio>
              </el-radio-group>
            </el-form-item> -->

            <!-- <el-form-item label="合成文字：" prop="title">
              <div class="compound_text_box">
                <div class="textarea_box">
                  <textarea placeholder="请输入需要合成的文字，最多可以输入60个字符" maxlength="20000" class="input_box" />
                </div>
                <div class="footer">
                  <div class="left_box">
                    <div class="try_listen_btn">
                      <img src="../../../../assets/images/small_play_icon.png" alt="">
                      <span>试听</span>
                    </div>
                    <span class="text">（仅可试听前100字）</span>
                  </div>
                  <div class="right_box">0/20000</div>
                </div>
              </div>
            </el-form-item> -->

            <el-form-item label="合成文字：" prop="text">
              <el-input
                type="textarea"
                size="small"
                placeholder="请输入需要合成的文字，最多可以输入30个字符"
                v-model="formData.text"
                maxlength="30"
                show-word-limit
                clearable
                :autosize="{ minRows: 3, maxRows: 6 }"
                resize="none"
                class="el_textarea_box"
              >
              </el-input>
            </el-form-item>

          </el-form>
        </div>
        <div class="custom_dialog_footer">
          <el-button @click="close" size="small">取 消</el-button>
          <el-button type="primary" @click="validateForm('tryListen')" size="small">
            试 听
          </el-button>
          <el-button type="primary" @click="validateForm('makeVoice')" size="small">
            生成音频
          </el-button>
        </div>

      </div>

    </el-dialog>

    <!-- 音频播放器 -->
    <audio ref="audioRef" @error="handleAudioError"></audio>
  </div>
</template>

<script>
import { Message } from "element-ui";

import api from "../../../../api/api.js";
import sessFun from "../../../../commonFun/sessFun.js";

const initFormData = () => ({
  // 合成文字
  text: '',
  voiceType: null,
  voiceTitle: ''
  // value: [0, 100],
  // radio: null
})

const initMakeAudioData = () => ({
  // 合成的语音地址
  src: '',
  // 合成的语音参数（用来判断是否是同一个语音）
  params: {}
})

export default {
  emits: ['confirm'],
  data () {
    return {
      visible: false,
      dialogLoading: false,
      // 选择音色-单选按钮组
      toneBtnList: [
        { label: '精品音色（推荐）', value: 0 },
        { label: '普通音色', value: 1 },
      ],
      activeToneBtnVal: 0,
      // 音色列表
      toneList: [],
      formData: initFormData(),
      formRules: {
        voiceType: [{
          validator: (rule, value, callback) => {
            if (!value) {
              callback(new Error('请选择合成语音类型'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        text: [{ required: true, message: '请输入合成文字', trigger: 'blur'}]
      },
      marks: {
        0: '0',
        8: '8',
        37: '37',
        // 50: {
        //   style: {
        //     color: '#1989FA'
        //   },
        //   label: this.$createElement('strong', '50%')
        // }
      },
      coverRadioList: [
        { label: '手动输入文本', value: 0 },
        { label: '上传文本文件', value: 1 },
      ],
      makeAudioData: initMakeAudioData()
    };
  },
  methods: {
    /**
     * 点击播放音色
     */
    // async playToneAudio({ voiceType }) {
    //   try {
    //     const src = await this.getAudioByToneId(voiceType)
    //     this.tryListen(src)
    //   } catch (err) {
    //     console.error('playToneAudio error:', err)
    //   }
    // },
    /**
     * 点击选择音色
     */
    handleToneItemClick({ voiceType }) {
      this.formData.voiceType = voiceType
    },
    /**
     * 获取音色列表数据
     */
    async getToneList() {
      try {
        this.dialogLoading = true
        const { data = {} } = await api.postApi_json('addsp/api/v1/voice/voice/templates')
        const { code, data: res, message } = data
        if (code !== 200) return Message.error(message)
        this.toneList = res
      } catch (err) {
        Message.error('获取数据失败')
        console.error('getToneList error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    handleAudioError() {
      Message.error('音频加载失败')
    },
    /**
     * 点击生成音频
     */
    async makeVoice() {
      try {
        const { text, voiceType, voiceTitle: title } = this.formData
        const { realName: creatorName, uID: creatorId } = sessFun.getSess()
        const params = {
          // 试听文本
          text,
          // 试听音色ID
          voiceType,
          title,
          creatorName,
          creatorId
        }
        // 生成音频文件接口
        const { data = {} } = await api.postApi_json('addsp/api/v1/voice/template/create', params)
        const { code, data: res, message } = data
        if (code !== 200 || !res) return  Message.error('操作失败')
        const { id: voiceId, url: voiceUrl } = res
        this.$emit('confirm', { voiceId, voiceUrl })
        this.close()
      } catch (err) {
        Message.error(err || '操作失败')
      }
    },
    /**
     * 点击试听
     */
    async tryListen() {
      try {
        // 若生成过，读取缓存
        if (JSON.stringify(this.formData) !== JSON.stringify(this.makeAudioData.params)) {
          // 试听音频接口（根据文本生成）
          const { data = {} } = await api.postApi_json('addsp/api/v1/voice/voice/audition', this.formData)
          const { code, data: src, message } = data
          if (code !== 200) return Message.error(message)
          this.makeAudioData = {
            src,
            params: JSON.parse(JSON.stringify(this.formData))
          }
        }
        this.playAudio(this.makeAudioData.src)
      } catch (err) {
        Message.error(err || '操作失败')
      }
    },
    /**
     * 播放音频
     */
    playAudio(src) {
      if (this.$refs.audioRef) {
        this.$refs.audioRef.src = src
        this.$refs.audioRef.play()
      }
    },
    /**
     * 校验表单
     */
    async validateForm(actionType) {
      try {
        const validRes = await this.$refs['formRef'].validate()
        if (!validRes) return false
        this.dialogLoading = true
        if (this[actionType]) await this[actionType]()
      } catch (err) {
        console.error('validateForm error:', err)
      } finally {
        this.dialogLoading = false
      }
    },
    /**
     * 打开弹框
     */
    open(voiceTitle) {
      this.formData.voiceTitle = voiceTitle
      this.getToneList()
      this.visible = true
    },
    /**
     * 关闭弹框
     */
    close() {
      this.formData = initFormData()
      this.makeAudioData = initMakeAudioData()
      this.$refs['formRef'].clearValidate()
      this.visible = false
    },
  },
  mounted () {},

};
</script>

<style lang="scss" scoped>
.make_voice_dialog {
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
    .step_title {
      color:  rgba(0, 0, 0, 0.85);
      font-family: Roboto;
      font-size: 14px;
      font-weight: 600;
      line-height: 22px;
      margin-bottom: 16px;
    }

    .tone_box {
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      .start_text {
        color: #FF4949;
        margin-left: 14px;
      }
      .text {
        color: rgba(0, 0, 0, 0.45);
        font-family: PingFang SC;
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }
    }

    .tone_list_wrapper {
      border-radius: 2px;
      border: 1px solid #D9D9D9;
      background: #FAFAFA;
      // height: 220px;
      max-height: 345px;
      overflow-y: auto;
      .tone_list {
        padding: 16px;
        display: grid;
        grid-template-columns: repeat(5, 2fr);
        grid-gap: 16px;
        box-sizing: border-box;
        .tone_item {
          border-radius: 2px;
          border: 1px solid #D9D9D9;
          background-color: #fff;
          // background: rgba(24, 144, 255, 0.04);
          // width: 210px;
          height: 68px;
          // flex-shrink: 0;
          box-sizing: border-box;
          padding: 0 16px;
          display: flex;
          align-items: center;
          &.active {
            border-color: #1890FF;
            background: rgba(24, 144, 255, 0.04);
          }
          .avatar_box {
            width: 40px;
            height: 40px;
            margin-right: 6px;
            img {
              width: 100%;
              height: 100%;
            }
          }
          .info_box {
            flex: 1;
            overflow: hidden;
            .name_box {
              width: 100%;
              overflow: hidden;
              display: flex;
              align-items: center;
              .text {
                color: #000;
                font-family: PingFang SC;
                font-size: 16px;
                font-weight: 600;
                line-height: 24px;
                // max-width: 55px;
                max-width: 85px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
              }
              .tag_box {
                display: inline-block;
                border-radius: 2px;
                border: 1px solid #F68F50;
                background: rgba(255, 143, 73, 0.15);
                height: 20px;
                line-height: 12px;
                color: #ED8F57;
                font-family: PingFang SC;
                font-size: 12px;
                font-weight: 500;
                box-sizing: border-box;
                padding: 0 4px;
                margin-left: 4px;
                display: flex;
                align-items: center;
                white-space: nowrap;
              }
            }
            .desc_box {
              color: rgba(0, 0, 0, 0.45);
              font-family: PingFang SC;
              font-size: 14px;
              line-height: 20px;
              width: 100%;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
          .play_box {
            width: 28px;
            height: 28px;
            cursor: pointer;
            margin-left: 4px;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }

    .speed_box {
      padding: 0 50px 20px 20px;
    }

    .compound_text_box {
      width: 968px;
      height: 158px;
      border-radius: 2px;
      border: 1px solid #D9D9D9;
      padding: 12px;
      display: flex;
      flex-direction: column;
      .textarea_box {
        width: 100%;
        flex: 1;
        overflow: hidden;
        .input_box {
          border: 0;
          outline: none;
          width: 100%;
          height: 100%;
          resize: none;
        }
      }

      .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left_box {
          display: flex;
          align-items: center;
          .try_listen_btn {
            cursor: pointer;
            color: #1890FF;
            font-family: PingFang SC;
            font-size: 14px;
            line-height: 22px;
            display: flex;
            align-items: center;
            margin-right: 5px;
            img {
              width: 16px;
              height: 16px;
              margin-right: 2px;
            }
          }
          .text {
            color:  rgba(0, 0, 0, 0.25);
            font-family: Roboto;
            font-size: 14px;
            font-weight: 400;
            line-height: 22px;
          }
        }
        .right_box {
          color: rgba(0, 0, 0, 0.25);
          text-align: right;
          font-family: Roboto;
          font-size: 14px;
          font-style: normal;
          line-height: 22px;
        }
      }
    }

    .el_textarea_box {
      max-height: 100px;
    }

  }


}

</style>
