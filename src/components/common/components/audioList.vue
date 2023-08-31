<template>
  <div class="third-wrap box-wrap">
      <div class="table_wrap" v-if="audioInfoData.length > 0">
          <p class="search-row">
              <el-button type="primary" size="small" @click="addVoice"
                >添加音频
              </el-button>
          </p>

          <el-table
            :data="audioInfoData"
            style="margin-top:16px;"
            v-loading="loading"
            element-loading-text="玩命加载中.."
            class="table-wrap">
              <el-table-column label="状态" min-width="6%" align="center">
                <template slot-scope="scope">
                  <el-switch v-model="scope.row.status" @change="changeSwitch(scope.row)" :active-value="1" :inactive-value="0"></el-switch>
                </template>
              </el-table-column>
              <el-table-column prop="title" label="音频标题" min-width="20%" show-overflow-tooltip align="center">
              </el-table-column>
              <el-table-column prop="date" label="投放日期" min-width="32%" show-overflow-tooltip align="center">
                <template slot-scope="scope">
                    <div>
                        {{ scope.row.startDate }}——{{ scope.row.endDate }}
                    </div>
                </template>
              </el-table-column>
              <el-table-column prop="publishType" label="排期方式" min-width="12.4%" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.publishType === 1">按订单投放日期</div>
                    <div v-else-if="scope.row.publishType === 2">按上画时间</div>
                    <div v-else>自定义</div>
                </template>
              </el-table-column>
              <el-table-column prop="publishTimeRange" label="投放时段" min-width="12%" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.publishTimeRange === 1">全时段</div>
                    <div v-else-if="scope.row.publishTimeRange === 2">指定时段</div>
                    <div v-else>自定义</div>
                </template>
              </el-table-column>
              <el-table-column prop="publishDeviceType" label="投放设备" min-width="12%" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.publishDeviceType === 1">全设备</div>
                    <div v-else-if="scope.row.publishDeviceType === 2">指定设备</div>
                    <div v-else>自定义</div>
                </template>
              </el-table-column>
              <el-table-column prop="auditStatus" label="素材审批状态" min-width="12.7%" align="center" >
                <template slot-scope="scope">
                    <div v-if="scope.row.auditStatus === 0">待审批</div>
                    <div v-else-if="scope.row.auditStatus === 1">已审批</div>
                    <div v-else style="display:flex; justify-content:center; align-items:center">
                        不通过
                        <el-tooltip class="item" effect="dark" :content="scope.row.reason" placement="bottom" v-if="scope.row.reason">
                            <img src="../../../assets/images/tip.png" class="tip-img">
                        </el-tooltip>
                    </div>
                </template>
              </el-table-column>
              <el-table-column prop="publishStatus" label="投放状态" min-width="12.7%" align="center">
                <template slot-scope="scope">
                    <div v-if="scope.row.publishStatus === 0">待投放</div>
                    <div v-else-if="scope.row.publishStatus === 1">投放中</div>
                    <div v-else>已停止</div>
                </template>
              </el-table-column>
              <el-table-column prop="playCount" label="播放次数" min-width="12.7%" align="center">
                <template slot-scope="scope">
                    <div v-if="!scope.row.playCount">--</div>
                    <div v-else>{{ scope.row.playCount}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="count" label="操作" min-width="12.7%" align="left">
                <template slot-scope="scope">
                    <el-dropdown size="small" trigger="click" placement="bottom-start" :hide-on-click="false">
                        <span class="el-dropdown-link">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item @click.native.prevent="openAddVoiceDialog(scope.row)" v-if="scope.row.auditStatus !== 2">编辑</el-dropdown-item>
                            <el-dropdown-item @click.native.prevent="openAddVoiceDialog(scope.row)" v-else>重新提交</el-dropdown-item>
                            <el-dropdown-item @click.native.prevent="showAudio(scope.row)">试听</el-dropdown-item>
                            <el-dropdown-item @click.native.prevent="downLoadAudio(scope.row)">下载</el-dropdown-item>
                            <el-popconfirm title="确定通过吗？" @confirm="passAudio(scope.row)">
                                <el-dropdown-item
                                    slot="reference"
                                    v-if="scope.row.auditStatus === 0  && sessionData.permissions.includes('voiceAdvertisingBroadcast')"
                                >
                                    通过
                                </el-dropdown-item>
                            </el-popconfirm>
                            <el-popconfirm title="确定不通过吗？" @confirm="failAudio(scope.row)">
                                <el-dropdown-item
                                    slot="reference"
                                    v-if="scope.row.auditStatus === 0 && sessionData.permissions.includes('voiceAdvertisingBroadcast')"
                                >
                                    不通过
                                </el-dropdown-item>
                            </el-popconfirm>
                            <el-popconfirm title="确定删除吗？"  @confirm="deleteAudio(scope.row)">
                                <el-dropdown-item
                                    slot="reference"
                                    v-if=" scope.row.publishStatus === 0"
                                >
                                    删除
                                </el-dropdown-item>
                            </el-popconfirm>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
              </el-table-column>
          </el-table>
          
      </div>


    <div class="table_wrap" v-else>
        <el-empty description="暂无可播放的音频，点击去添加">
            <el-button type="primary" @click="addVoice">添加音频</el-button>
        </el-empty>
    </div>

    <el-dialog
      title="试听"
      :visible.sync="audioDialogVisible"
      width="350px"
      @close="pauseAudio"
      top="300px">
      <p class="audio-title">音频名称：{{ audioName }}</p>
      <audio controls class="audio" id="audio">
        <source :src="audioUrl" type="audio/mpeg">
      </audio>
    </el-dialog>

    <el-dialog
      title="审核不通过"
      :visible.sync="failureDialogVisible"
      width="350px"
      top="250px"
    >
      <el-input
        type="textarea"
        :rows="5"
        placeholder="请输入不通过原因"
        v-model="failureReason">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="failureReason = false">取 消</el-button>
        <el-button type="primary" @click="confirmFailedAudio">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 添加音频 - 弹框组件 -->
    <AddVoiceDialog ref="addVoiceDialogRef" @refreshList="() => $emit('getAudioList')"/>
  </div>
</template>

<script>
import axios from 'axios';
import {Table, TableColumn, Message} from 'element-ui';
import {api} from "../../../api/api.js";
import AddVoiceDialog from "./voice/addVoiceDialog.vue";
import sessFun from "../../../commonFun/sessFun.js";

  export default {
      components: {
          elTable: Table,
          elTableColumn: TableColumn,
          AddVoiceDialog
      },
      props: {
          audioInfoData: {
            type: Array,
            default: []
          },
          loading: {
            type: Boolean,
            default: true
          },
          getAudioList: {
            type: Function
          },
          apId: {
            type: String,
            default: ''
          }
      },
      computed: {},
      data() {
          return {
            audioDialogVisible: false,
            audioName: '',
            audioUrl: '',
            failureDialogVisible: false,
            failureReason: '',
            sessionData: {},
            isDownLoad: false
          }
    },
    created() {
        this.sessionData = sessFun.getSess();
      },
      methods: {
        /**
         * 打开添加音频弹框
         */
        openAddVoiceDialog(row) {
            if (row.status) {
                this.$message({
                    type: "warning",
                    message: "关闭音频后进入编辑状态",
                });
            } else {
                this.$refs.addVoiceDialogRef && this.$refs.addVoiceDialogRef.open({
                    apId: this.apId,
                    recordId: row.scheduleId
                })
            }
        },
        addVoice() {
            this.$refs.addVoiceDialogRef && this.$refs.addVoiceDialogRef.open({
                apId: this.apId
            })
        },
        // 点击试听
        showAudio(row) {
            this.isDownLoad = false
            this.getLoadAudio(row)
          },
        getLoadAudio(row) {
          let params = {
              id: row.voiceId
            }
          this.audioName = row.title
          api.getApi('/addsp/api/v1/voice/voice/auditionVoiceTemplate', params)
              .then(res => {
                  console.log(res.data.data)
                  if (res.data.code === 200) {
                    this.audioUrl = res.data.data
                      if (this.isDownLoad) {
                        this.downLoadAudioFile()
                        // const link = document.createElement('a')
                        // link.style.display = 'none'
                        // link.href = URL.createObjectURL(this.audioUrl)
                        // link.download = `${this.audioName}.wav`
                        // document.body.appendChild(link)
                        // link.click()
                        // document.body.removeChild(link)
                        // URL.revokeObjectURL(this.audioUrl)
                      } else {
                        this.audioDialogVisible = true
                      }
                  } else {
                    this.$message({
                        type: "warning",
                        message: res.data.MSG || "操作失败！",
                    });
                  }
              })
              .catch(err => {
                  console.log(err)
              })
          },
        downLoadAudioFile() {
          axios({
            method: 'get',
            url: this.audioUrl, // 请求地址
            responseType: 'blob',
          })
          .then(res => {
            let blob = new Blob([res.data])
            // 创建一个临时的ur1指向blob对象
            let url = window.URL.createobjectURL(blob)
            //创建一个a标签，用来下载
            let a = document.createElement("a")
            a.href = url
            a.download = `${this.audioName}.wav`
            a.click()
            // 释放这个临时的对象ur1
            window.URL.revokeobjectURL(url)
          })
          .catch(err => {
              console.log(err)
          })
        },
        // 下载音频
        downLoadAudio(row) {
            this.isDownLoad = true
            this.getLoadAudio(row)
          },
        // 开启或关闭音频
        changeSwitch(row) {
            console.log(row);
            let params = {
                scheduleId: row.scheduleId,
                status: row.status
            }
            api.postApi_json('/addsp/api/v1/voice/voice/schedule/setEnableStatus', params)
                .then(res => {
                    console.log(res)
                    if (res.data.code !== 200) {
                        this.$message({
                            type: "warning",
                            message: res.data.MSG || "状态更改异常！",
                        });
                        row.status === 0 ? row.status = 1 : row.status = 0
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        // 暂停播放
        pauseAudio() {
            let audio = document.getElementById('audio')
            audio.pause()
          },
        // 音频审核通过
        passAudio(row) {
            this.row = row
            let params = {
                id: row.id
            }
            api.postApi_json('/addsp/api/v1/voice/audit/pass', params)
                .then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            type: "success",
                            message: "审核成功！",
                        });
                        this.$emit('getAudioList')
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.MSG || "音频审核异常！",
                        });
                    }
                })
                .catch(err => {
                    console.log(err)
                })
          },
        // 弹出音频不通过弹窗
        failAudio(row) {
            this.row = row
            this.failureDialogVisible =true
        },

        //确认不通过音频
        confirmFailedAudio() {
            let params = {
                id: this.row.id,
                reason: this.failureReason
            }
            api.postApi_json('/addsp/api/v1/voice/audit/reject',params)
                .then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            type: "success",
                            message: "审核成功！",
                        });
                        this.$emit('getAudioList')
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.MSG || "音频审核异常！",
                        });
                    }
                })
                .catch(err => {
                    console.log(err)
                })
                .finally(() => {
                    this.failureDialogVisible = false
                })
        },
        // 删除音频
        deleteAudio(row) {
            let params = {
                id: row.id
            }
            api.postApi_json('/addsp/api/v1/voice/voice/schedule/delete', params)
                .then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            type: "success",
                            message: "删除音频成功！",
                        });
                        this.$emit('getAudioList')
                    } else {
                        this.$message({
                            type: "warning",
                            message: res.data.MSG || "删除音频失败·！",
                        });
                    }
                })
                .catch(err => {
                    console.log(err)
                })
          }
    },
  }
</script>

<style lang="scss" scoped>
@import '../../../assets/component.scss';
  .box-wrap {
      margin-bottom: 32px;
      background-color: #fff;
  }

  /deep/ .el-tabs__nav-scroll {
      padding-left: 28px;
  }

  .box-wrap > h4 {
      height: 55px;
      padding-left: 28px;
      border-bottom: 1px solid #e6e7e9;
      font-size: 16px;
      color: rgba(51, 51, 51, 0.85);
      line-height: 55px;
      font-weight: bold;
  }

  .table_wrap {
      margin: 0px 32px;
  }

  /deep/ .el-table th > .cell {
      font-weight: bold;
  }

  /* 弹出框样式 */
  .car-title {
      background: #e6f7ff;
      border: 1px solid #bae7ff;
      border-radius: 4px;
      margin: 16px 0;
      padding: 5px;
  }

  .car-title h4 {
      font-size: 14px;
      display: inline-block;
  }

  .car-title span {
      font-size: 14px;
      font-weight: normal;
      margin: 0 6px;
      cursor: pointer;
      color: #1890ff;
  }

  /* 搜索 */
  .search-row {
      margin-bottom: 10px;
  }

  .search-row /deep/ .el-button {
      padding: 0 10px;
  }
  /deep/ .material-remark-dialog {
      .material-remark-dialog__body {
          padding-left: 24px;
          padding-right: 24px;
      }
      .material-remark-dialog__footer {
          padding-top:11px;
          border-top: 1px solid rgba(233, 233, 233, 1);
          text-align:center;
      }
      .el-dialog__body {
          padding: 16px 0 11px 0;
          .ad_pagination {
              padding-bottom: 24px;
          }
      }
  }
  .inline_dialog {
      display: flex;
      align-items: center;
      span {
          white-space: nowrap;
      }
  }

  .inline_dialog > p {
      display: flex;
      align-items: center;
      margin-right: 16px;
  }

  .inline_dialog /deep/ .el-button {
      margin-right: 5px;
  }

  .dropdown_a /deep/ .el-button {
      width: 94px;
  }

  .dropdown-menu /deep/ .el-dropdown-menu__item {
      padding: 0 12px;
      width: 84px;
  }

  .table_mater /deep/ .gutter {
      width: 8px;
  }

  .table_mater img {
      width: 20px;
      height: 20px;
      position: relative;
      left: 4px;
      top: 6px;
  }

  /* 图片查看显示 */
  .imgPreview /deep/ .el-dialog {
      width: 35%;
  }

  .imgPreview /deep/ .el-dialog__body {
      text-align: center;
  }

  /deep/ .imgPreview .el-dialog__body img {
      max-width: 100%;
      width: auto;
      height: 550px;
  }

  .upload_border {
      width: 104px;
      height: 104px;
      background: rgba(0, 0, 0, 0.02);
      border-radius: 4px;
      display: flex;
      line-height: 1;
      flex-direction: column;
      text-align: center;
      align-items: center;
      justify-content: center;
  }

  .upload_border .el-icon-plus {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.45);
  }

  .imgpain_box {
      height: 104px;
      overflow: hidden;
      display: flex;
      justify-content: center;
  }

  .imgpain_box.tal {
      justify-content: left;
  }

  /deep/ .imgpain_box .el-upload--picture-card {
      border: 1px dashed #dedede;
      width: 104px;
      height: 104px;
      margin: 0;
  }

  /deep/ .imgpain_box .el-upload-list--picture-card .el-upload-list__item {
      width: 104px;
      height: 104px;
  }

  /deep/ .imgpain_box .el-upload-list__item.is-success {
      display: block;
  }

  /*物料详情弹框*/
  .change-pic-detail-info h5 {
      color: rgba(0, 0, 0, 0.85);
      font-size: 16px;
      font-weight: bold;
      margin-bottom: 6px;

  }

  .change-pic-detail-info h5 span {
      display: inline-block;
      width: 44px;
      height: 18px;
      background: rgba(0, 0, 0, 0.15);
      border-radius: 2px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      text-align: center;
      line-height: 18px;
  }

  .change-pic-detail-info h5 span.a {
      background: rgba(230, 247, 255, 1);
      border: 1px solid rgba(145, 213, 255, 1);
      color: #1890FF;
  }

  .change-pic-detail-info p {
      color: rgba(0, 0, 0, 0.65);
      font-size: 14px;
      margin-bottom: 6px;
  }

  .change-pic-detail-info .divide {
      width: 100%;
      height: 1px;
      background: rgba(216, 216, 216, 1);
      margin: 24px 0;
  }

  .remark-box {
      display: flex;
      margin-top: 16px;
  }

  .remark-box span {
      width: 86px;
  }

</style>

<style>
  .all-pic-dialog .el-dialog__body, .all-pic-dialog .el-dialog__footer {
      text-align: center;
      padding-bottom: 20px;
  }

  .change-pic-detail-modal /deep/ .el-dialog__body {
      padding: 5px 24px;
  }
  .el-tabs__content{
    padding-bottom: 60px;
  }

  .el-dropdown-link{
    cursor: pointer;
  }
  .tip-img{
    width: 14px;
    height: 14px;
  }
  .audio-title{
    font-size: 20px;
    font-weight: 600;
    margin-top: -20px;
    margin-bottom: 20px;
    }
    .audio{
        outline: none;
    }
</style>
