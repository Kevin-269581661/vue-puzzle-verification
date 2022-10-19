<template>
  <div>
    <el-dialog
      title="监播图片详情"
      :visible.sync="dialogVisible"
      @open="getImageDetailsList"
      :show-close="true"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="custom-dialog-wrapper registration-media"
      :width="imgsWidth"
    >
      <div class="top-box">
        <div class="audit-title">
          <span
            >{{ `${imageData.resName} (${imageData.mediaName})` }}&nbsp;</span
          >
          <el-tag
            size="mini"
            :hit="true"
            :type="imageData.auditStatus === 0 ? 'warning' : 'success'"
          >
            {{ imageData.auditStatus === 0 ? "未审核" : "已审核" }}
          </el-tag>
          <el-tag
            size="mini"
            :hit="true"
            :type="imageData.auditResult === 0 ? 'danger' : 'success'"
          >
            {{ imageData.auditResult === 0 ? "不合格" : "合格" }}
          </el-tag>
        </div>

        <div class="tag-box">
          <div>
            <el-tag size="mini" type="info" style="color: #000">{{
              imageData.districtName
            }}</el-tag>
            <el-tag size="mini" type="info" style="color: #000">{{
              `${imageData.asLab}面`
            }}</el-tag>
            <el-tag size="mini" type="info" style="color: #000">{{
              imageData.assetTag
            }}</el-tag>
          </div>
          <div>
            <el-button
              icon="el-icon-picture-outline"
              @click="toOpenImage(imageData.materialUrl)"
              >素材</el-button
            >
          </div>
        </div>
      </div>

      <div class="hint-box" v-if="!imageList">
        <span>暂无数据</span>
      </div>
      <div class="audit-box" v-else>
        <div
          class="audit-img"
          v-for="(item, index) in imageList.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
          )"
          :key="index"
        >
          <div class="img-box">
            <i
              v-if="item.pURL"
              slot="reference"
              class="el-icon-zoom-in"
              @click="toOpenImage(item.pURL)"
            ></i>
            <img :src="item.pURL" />
          </div>
          <div class="audit-detail">
            <div class="left">
              <div class="tag">
                <i class="el-icon-date"></i>
                <span>上传时间:&nbsp;</span>
                <el-tooltip
                  v-if="item.pUTime"
                  effect="dark"
                  :content="
                    item.pUTime.replace(
                      /(\d{4})-(\d{2})-(\d{2})\s(\d+):(\d+):(\d+)/,
                      '$1年$2月$3日 $4:$5'
                    )
                  "
                  placement="top-end"
                  :open-delay="1500"
                >
                  <span>{{
                    `${item.pUTime.replace(
                      /(\d{4})-(\d{2})-(\d{2})\s(\d+):(\d+):(\d+)/,
                      "$1年$2月$3日 $4:$5"
                    )}`
                  }}</span>
                </el-tooltip>
                <span v-else>--</span>
              </div>
              <div class="tag">
                <i class="el-icon-user"></i>
                <span>上传人员:&nbsp;</span>
                <span>{{ item.realname || "--" }}</span>
              </div>
            </div>
            <div class="right">
              <el-button type="primary" @click="toOpenProblemDialog(item)"
                >添加问题</el-button
              >
            </div>
          </div>
          <div class="err-box">
            <el-popover
              v-for="(tag, index) in item.errList"
              :key="index"
              placement="top-end"
              width="160"
              v-model="tag.closeVisible"
            >
              <p style="margin-bottom: 10px">
                <i class="el-icon-warning" style="color: #faad14"></i>
                确定要删除该问题吗？
              </p>
              <div style="display: flex; justify-content: flex-end">
                <el-button
                  style="min-width: 45px; height: 25px; line-height: 25px"
                  type="primary"
                  size="mini"
                  @click="toCloseTag(tag)"
                  >是的</el-button
                >
                <el-button
                  style="min-width: 45px; height: 25px; line-height: 25px"
                  size="mini"
                  @click="tag.closeVisible = false"
                  >取消</el-button
                >
              </div>
              <el-tag
                slot="reference"
                :disable-transitions="true"
                closable
                @close="toOpenCloseVisible(item, tag)"
              >
                {{ tag.errMsg }}
              </el-tag>
            </el-popover>
          </div>
        </div>
      </div>

      <el-pagination
        background
        layout="prev, pager, next"
        :current-page.sync="currentPage"
        :page-size.sync="pageSize"
        :hide-on-single-page="imgListLength > 4 ? false : true"
        :total="imgListLength"
        style="text-align: right"
      >
      </el-pagination>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关 闭</el-button>
        <el-button @click="toLastOne">上一个</el-button>
        <el-button @click="toNextOne" type="primary">下一个</el-button>
      </span>
    </el-dialog>

    <el-dialog title="添加问题" :visible.sync="addProblemVisible" width="751px">
      <div class="add-box">
        <div class="add-left">
          <div class="radio-box">
            <span>请选择问题类型</span>
            <el-radio-group v-model="errType" @change="radioChange()">
              <el-radio :label="0">图片/素材不匹配</el-radio>
              <el-radio :label="1">夜景图亮度不满足要求</el-radio>
              <el-radio :label="2">报头日期不匹配</el-radio>
              <el-radio :label="3">绑门/锁门</el-radio>
              <el-radio :label="4">其他</el-radio>
            </el-radio-group>

            <span>请简单描述下问题</span>
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              :autosize="{ minRows: 2, maxRows: 6 }"
              v-model="errMsg"
              :disabled="isClose"
            >
            </el-input>
          </div>
        </div>
        <img class="add-right" :src="imgUrl" />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="toResetProblemDialog">取 消</el-button>
        <el-button type="primary" @click="toSubmitProblem">提 交</el-button>
      </span>
    </el-dialog>

    <div class="image-box">
      <el-dialog
        :visible.sync="imageVisible"
        :close-on-click-modal="true"
        :show-close="false"
        width="604px"
      >
        <img :src="imgUrl" />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import api from "../../../api/api.js";
export default {
  name: "auditImage",
  props: {
    dialogVisible: {
      type: Boolean,
      default: () => false,
    },
    auditSearchParams: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 4,

      imageDataList: [],
      imageData: {},
      imageList: [],
      errList: [],
      currentItem: {},

      isClose: true,
      isHide: true,

      imageVisible: false,
      addProblemVisible: false,
      closeHintVisible: false,

      imgUrl: "",
      picID: "",
      errType: -1,
      errMsg: "",

      dialogWidth: 0,

      errTypeList: {
        0: "图片/素材不匹配",
        1: "夜景图亮度不满足要求",
        2: "报头日期不匹配",
        3: "绑门/锁门",
        4: "其他",
      },
    };
  },
  computed: {
    imgListLength() {
      return this.imageList.length || 0;
    },
    imgsWidth() {
      const length = this.imageList.length;
      if (length > 4) {
        return "1506px";
      } else if (length <= 0) {
        return "408px";
      } else {
        return length * 370 + 24 + "px";
      }
    },
  },
  methods: {
    getImageDetailsList() {
      api
        .postApi_json(
          "/addsp/api/v1/audit/imageDetails",
          this.auditSearchParams
        )
        .then((res) => {
          if (res.data.SysCode === 200200) {
            const resData = res.data.data;
            this.imageDataList = resData || [];
            const item = resData.filter((item) => item.itemIndex === 0);
            this.imageData = item[0] || [];
            // console.log('图片参数', this.imageData);
            this.imageList = this.imageData.imgList || [];
            this.imageList.map((v) => {
              if (v.errList) {
                v.errList.map((v) => {
                  this.$set(v, "closeVisible", false);
                });
              }
            });
          } else {
            this.$message({
              type: "warning",
              message: "监播照片详情数据获取异常！",
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 显示tag删除提示
    toOpenCloseVisible(item, tag) {
      item.errList.map((v) => (v.closeVisible = false));
      const index = item.errList.indexOf(tag);
      item.errList[index].closeVisible = true;
      this.currentItem = item;
    },
    toCloseTag(tag) {
      this.currentItem.errList.splice(this.currentItem.errList.indexOf(tag), 1);
      if (this.errList) {
        this.errList.splice(this.errList.indexOf(tag), 1);
        this.$message({
          type: "success",
          message: "删除问题成功",
        });
      }
      if (tag.id) {
        api
          .getApi("/addsp/api/v1/audit/imgAuditDelete", { id: tag.id })
          .then((res) => {
            if (res.data.SysCode === 200200) {
            } else {
              this.$message({
                type: "warning",
                message: "删除问题异常",
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    },
    // 点击提交问题
    toSubmitProblem() {
      if (this.errType !== 4) {
        const index = this.currentItem.errList.findIndex(
          (v) => v.errMsg === this.errTypeList[this.errType]
        );
        if (index !== -1) {
          return this.$message({
            showClose: false,
            message: "请勿添加相同问题类型",
            type: "warning",
          });
        }
      }
      if (this.errType < 0) {
        this.$confirm("未选择问题类型，请选择后重新提交", "提交失败", {
          showCancelButton: false,
          showClose: false,
          confirmButtonText: "好 的",
          type: "error",
        });
      } else if (this.errType === 4 && this.errMsg === "") {
        this.$confirm("未描述具体问题，请填写后重新提交", "提交失败", {
          showCancelButton: false,
          showClose: false,
          confirmButtonText: "好 的",
          type: "error",
        });
      } else {
        const errData = {
          errMsg:
            this.errType === 4 ? this.errMsg : this.errTypeList[this.errType],
          errType: this.errType,
          pID: this.picID,
        };
        const tempObj = {
          closeVisible: false,
          errMsg: errData.errMsg,
        };
        const index = this.imageList.findIndex(
          (item) => item.pID === this.picID
        );
        this.imageList[index].errList.push(tempObj);
        this.errList.push(errData);
        this.$message({
          showClose: false,
          message: "添加问题成功",
          type: "success",
        });
        this.toResetProblemDialog();
      }
    },
    toAuditImg() {
      let params = {
        lID: this.imageData.lID,
        auditStatus: 1,
        errList: JSON.parse(JSON.stringify(this.errList)) || [],
      };
      api.postApi_json("/addsp/api/v1/audit/imgAudit", params).then((res) => {
        if (res.data.SysCode === 200200) {
          this.errList = [];
        } else {
          this.$message({
            type: "warning",
            message: "问题上传异常！",
          });
        }
      });
    },
    // 重置添加问题对话框
    toResetProblemDialog() {
      this.addProblemVisible = false;
      this.errType = -1;
      this.errMsg = "";
      this.isClose = true;
    },
    // 打开添加问题对话框
    toOpenProblemDialog(item) {
      this.imgUrl = item.pURL;
      this.picID = item.pID;
      this.currentItem = item;
      this.addProblemVisible = true;
    },
    // 控制文本框是否禁用
    radioChange() {
      if (this.errType === 4) {
        this.isClose = false;
      } else {
        this.isClose = true;
      }
    },

    // 上一页
    toLastOne() {
      this.toAuditImg();
      const item = this.imageDataList.filter((item) => item.itemIndex === -1);
      if (item.length) {
        this.auditSearchParams.lID = item[0].lID;
        this.getImageDetailsList();
      } else {
        this.$message({
          showClose: false,
          message: "已经到头了",
          type: "warning",
        });
      }
    },
    // 下一页
    toNextOne() {
      this.toAuditImg();
      const item = this.imageDataList.filter((item) => item.itemIndex === 1);
      if (item.length) {
        this.currentPage = 1;
        this.auditSearchParams.lID = item[0].lID;
        this.getImageDetailsList();
      } else {
        this.$message({
          showClose: false,
          message: "已经到尾了",
          type: "warning",
        });
      }
    },
    handleClose() {
      this.currentPage = 1;
      this.toAuditImg();
      this.$emit("update:dialogVisible", false);
      this.$emit("refresh");
    },
    toOpenImage(imgUrl) {
      this.imgUrl = imgUrl;
      this.imageVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.top-box {
  .audit-title {
    font-size: 20px;
    font-weight: 600;
    line-height: 22px;
    letter-spacing: 0px;
    text-align: left;
    color: #000;
    margin-bottom: 12px;

    /deep/ .el-tag {
      margin-left: -4px;
      margin-right: 6px;
    }
  }
  .tag-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}

.audit-box {
  display: flex;
  position: relative;
  justify-content: space-between;
  margin-top: 24px;
  width: 346px;

  .audit-img {
    padding-right: 24px;
    .img-box {
      position: relative;
      i {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 24px;
        height: 24px;
        background-color: rgba(0, 0, 0, 0.65);
        border-radius: 4px;
        color: #fff;
        font-size: 14px;
        line-height: 24px;
        text-align: center;
        cursor: pointer;
      }
      img {
        width: 346px;
        height: 460px;
        border-radius: 4px;
      }
    }
  }

  .audit-detail {
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    width: 346px;
    height: 72px;
    margin-top: 8px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 4px;
    padding: 6px;

    .left {
      .tag {
        line-height: 22px;
        color: #000;
        margin: 2px 8px 2px 0px;
      }
    }
  }

  .err-box {
    margin-top: 8px;
    /deep/ .el-tag {
      color: #ff7f3c;
      border-color: #ff7f3c;
      background: rgba(255, 127, 60, 0.2);
      margin-bottom: 8px;

      .el-icon-close::before {
        color: #ff7f3c;
      }
    }
    /deep/ .el-tag__close:hover {
      background: rgba(255, 127, 60, 0.2);
    }
  }
}

.hint-box {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 346px;
  height: 460px;
}

.add-box {
  display: flex;
  justify-content: flex-start;
  .add-left {
    width: 296px;
    height: 512px;
    background: #ffffff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    border-radius: 4px;

    .radio-box {
      padding: 16px;
      /deep/ .el-radio-group {
        display: flex;
        flex-direction: column;
        .el-radio {
          margin: 6px 0;
          font-size: 14px;
          color: #000;
        }
      }

      span {
        display: block;
        font-size: 16px;
        color: #000;
        font-weight: 600;
        margin: 10px 0px 8px 0px;
      }
    }
  }

  .add-right {
    width: 384px;
    height: 512px;
    margin-left: 23px;
  }
}

/deep/ .el-tag {
  font-size: 12px;
  font-weight: normal;
  margin-right: 8px;
  line-height: 22px;
  height: 24px;
}

/deep/ .el-dialog__title {
  font-weight: 600;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
}

/deep/ .el-dialog__body {
  padding: 24px;
}

.image-box {
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 564px;
    height: 752px;
  }
  /deep/ .el-dialog__header {
    display: none;
  }
  /deep/ .el-dialog__body {
    padding: 20px;
  }
}
</style>
