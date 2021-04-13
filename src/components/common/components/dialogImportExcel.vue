<template>
  <div>
    <el-dialog
      :title="textObj.title"
      :visible.sync="importDialogShow"
      :width="width"
      top="23vh"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :show-close="false"
      :center="false"
      custom-class="import-dialog"
    >
      <div class="first-step">
        <span class="step-title">{{textObj.step1}}</span>
        <div class="first-step-body">
          <img
            class="excel-img"
            src="../../../assets/images/export.png"
            alt=""
          />
          {{textObj.fileName}}
          <a
            :href="textObj.downloadLink"
            :download="textObj.downloadFileName"
            class="downloag_btn"
            @click="dowmLoadFun"
            >点击下载<img
              class="down-excel-img"
              src="../../../assets/images/downExcel.png"
              alt=""
            />
          </a>
        </div>
      </div>
      <div class="second-step">
        <span class="step-title">{{textObj.step2}}</span>
        <el-upload
          ref="importRes"
          drag
          :action="importAction"
          :show-file-list="true"
          :on-change="importUploadFile"
          :on-remove="importFileRemove"
          :auto-upload="false"
          :limit="1"
          :multiple="false"
          :fileList="fileList"
          accept=".xlsx"
        >
          <img src="../../../assets/images/export.png" alt="" />
          <div class="el-upload__text">点击或将文件拖拽到这里上传</div>
        </el-upload>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="cancelImport">{{textObj.footerCancle}}</el-button>
        <el-button type="primary" :loading="uploadLoading" @click="commitFile">{{textObj.footerComfirm}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 时间格式化
import { api } from "../../../api/api.js";
export default {
  name: "dialogImportExcel",
  props: {
    importDialogShow: {
      type: Boolean,
      default: false,
    },
    textObj: {
      type: Object,
      default: {
        title: '导入物料备注',
        step1: '第一步：下载模板并按要求完善表格',
        step2: '第二步：上传编辑好的Excle表格',
        fileName: '《QADN-导入物料备注模板》',
        footerCancle: '取 消',
        footerComfirm: '提 交'
      }
    },
    width: {
      type: String,
      default: '448px'
    },
    importAction: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fileList: [],
      // 登录信息
      sessionData: {},
      importFileData: [],
      uploadLoading: false
    };
  },
  computed: {},
  created() {},
  watch: {
    importDialogShow(val) {
      !val && (this.fileList = [])
    }
  },
  methods: {
    // 取消导入
    cancelImport() {
      this.$emit("update:importDialogShow", false)
      this.uploadLoading = false;
    },
    // 导入模版下载, 阻止冒泡事件
    dowmLoadFun(event) {
      event.stopPropagation();
    },
    importUploadFile(file, fileList) {
      if(file.name.match(/.xlsx$/)) {
        this.fileList = fileList
        this.importFileData = [file];
      } else {
        this.fileList = []
        this.$message.warning("文件格式必须为xlsx，请重新长传！")
      }
    },
    importFileRemove(file, fileList) {
      console.log(file, fileList);
      this.importFileData = fileList;
    },
    commitFile() {
      if (
        Array.isArray(this.importFileData) &&
        this.importFileData.length == 0
      ) {
        this.$message.warning("请先上传excel文件哦~");
        return;
      }
      let formData = new FormData();
      formData.append("file", this.importFileData[0].raw);
      // 上传文件
      this.uploadLoading = true;
      api
        .postUpload_file(this.importAction + '?apID=' + sessionStorage.getItem("order_apid"), formData)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            this.$message.success(res.data.MSG);
            // 重置画面备注信息
            this.$EventBus.$emit('resetSearchInfo')
            this.$emit("update:importDialogShow", false)
          } else {
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
        })
        .finally((_) => {
          this.uploadLoading = false;
        });
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .import-dialog .el-dialog__header {
  padding: 12px 24px;
}
/deep/ .import-dialog .el-dialog__body {
  padding: 4px 24px 24px;
}
/deep/ .import-dialog .el-dialog__footer {
  display: block;
  text-align: right;
}

/deep/ .error-point-dialog {
  .el-dialog__header {
    padding: 19px 24px;
    border-bottom: 1px solid #e9e9e9;
  }
  .el-dialog__body {
    padding: 24px;
  }
  .el-button + .el-button {
    margin-left: 14px;
  }
}
.step-title {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
}
.first-step-body {
  width: 400px;
  height: 48px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  box-sizing: border-box;
  margin: 16px 0;
  background: #ffffff;
  border-radius: 4px;
  border: 1px solid #dadada;
}
.second-step {
  /deep/ .el-upload-dragger {
    height: 128px;
    padding-top: 33px;
    .el-upload__text {
      margin-top: 10px;
    }
  }
}
.excel-img {
  width: 28px;
  vertical-align: middle;
  margin: 0 6px 0 16px;
}
.down-excel-img {
  width: 12.9px;
  margin-left: 9px;
}
/deep/ .el-upload-dragger {
  margin: 16px 0 0 0;
}
.downloag_btn {
  display: flex;
  align-items: center;
  margin: 0 20px 0 auto;
  cursor: pointer;
  color: rgba(102, 102, 102, 1);
}
</style>
