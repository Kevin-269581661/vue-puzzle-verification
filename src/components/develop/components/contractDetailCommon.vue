<!--
 * @Author: penglei
 * @Date: 2021-06-29 21:39:57
 * @LastEditors: penglei
 * @LastEditTime: 2021-06-29 23:26:45
 * @FilePath: /frontend/src/components/develop/components/contractDetailCommon.vue
-->
<template>
  <div>
    <el-row type="flex" justify="space-between" class="title-row">
      <el-col :span="6" class="row-left">
        <label class="title-label">{{
          contractTypeArr[contractObj.dcType]
        }}</label>
        <div v-if="contractObj.contractNo" class="title-content">
          {{ `（${contractObj.contractNo}）` }}
        </div>
        <div class="contract-status-name">
          {{ stateList[contractObj.dcState] }}
        </div>
      </el-col>
      <el-col :span="6" class="row-right">
        <el-button
          v-for="(item, index) in operationArr"
          :key="index"
          size="mini"
          @click="handleContract(item)"
          >{{ item }}</el-button
        >
      </el-col>
    </el-row>
    <el-table
      :data="mediaRelList"
      border
      style="width: 100%"
      class="media-table"
    >
      <el-table-column prop="mTitle" label="媒体名称" width="180">
      </el-table-column>
      <el-table-column prop="mType" label="媒体类型" width="180">
      </el-table-column>
      <el-table-column prop="createUser" label="安装负责人"> </el-table-column>
      <el-table-column prop="installDate" label="安装/拆除完成日期">
      </el-table-column>
      <el-table-column prop="mState" label="媒体状态"> </el-table-column>
    </el-table>
    <div v-for="(item, index) in detailArr" :key="index" class="contract-borde">
      <div class="emphasize-text">{{ item.title }}</div>
      <el-row :gutter="46" class="content-row">
        <el-col
          v-for="(formItem, formIndex) in item.content"
          :key="formIndex"
          :span="6"
          class="detail-item"
        >
          <label class="detail-item-label">{{ `${formItem.label}：` }}</label>
          <div class="detail-item-content">{{ formItem.value || "" }}</div>
        </el-col>
      </el-row>
    </div>
    <!-- 附件 -->
    <div class="emphasize-text">附件</div>
    <el-row :gutter="46" class="content-row">
      <el-col :span="8">
        <div v-for="(item, index) in fileList" :key="index" class="file-item">
          <i class="el-icon-document"></i>
          <span class="file-item__name">{{ item.fileName }}</span>
          <i class="el-icon-download" @click="downloadFile(item)"></i>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import api from "../../../api/api";
export default {
  name: "contractDetailCommon",
  props: {
    dcID: {
      type: [Number, String],
      default: "",
    },
  },
  data() {
    return {
      detailArr: [],
      fileList: [],
      contractTypeArr: {
        0: "首签合同",
        1: "续签合同",
        2: "补充协议",
        3: "加门合同",
      },
      stateList: {
        "-1": "审核不通过",
        0: "待审核",
        1: "待签约",
        2: "待安装",
        3: "待拆除",
        4: "正常",
        5: "合同到期",
        6: "强制终止",
      },
      // 角色
      roleArr: {
        DEV: "0",
        DEV_ASSET: "1",
        DEV_DIRECTOR: "2",
      },
      operationAuthorityArr: {
        编辑: ["000", "001", "010", "020", "011", "021", "030", "031"],
        删除: [
          "000",
          "001",
          "002",
          "003",
          "004",
          "010",
          "020",
          "011",
          "021",
          "012",
          "022",
          "013",
          "023",
          "014",
          "024",
          "030",
          "031",
          "032",
          "033",
        ],
        重新提交: ["001", "011", "021", "031"],
        媒体录入: ["003", "013", "023", "033"],
        续签: [
          "005",
          "006",
          "007",
          "015",
          "025",
          "016",
          "026",
          "017",
          "027",
          "035",
          "036",
          "037",
        ],
        补充协议: ["005", "015", "025", "035"],
        加门: ["005", "015", "025", "035"],
        付款: ["005", "006", "015", "025", "016", "026", "035", "036"],
        付款记录: [
          "005",
          "006",
          "007",
          "015",
          "025",
          "016",
          "026",
          "017",
          "027",
          "035",
          "036",
          "037",
          "205",
          "206",
          "207",
          "215",
          "225",
          "216",
          "226",
          "217",
          "227",
          "105",
          "106",
          "107",
          "115",
          "125",
          "116",
          "126",
          "117",
          "127",
          "135",
          "136",
          "137",
        ],
        审核: ["200", "210", "220"],
        完成签约: ["102", "112", "122", "132"],
        合同终止: ["105", "115", "125", "135"],
      },
      operationArr: [],
      contractObj: {},
      mediaRelList: [],
    };
  },
  watch: {
    dcID: {
      immediate: true,
      handler(newVal, oldVal) {
        newVal && this.getContractDetail();
      },
    },
  },
  created() {},
  methods: {
    // 合同操作
    handleContract(operation) {
      switch (operation) {
        case "编辑":
          this.$router.push("./newContract");
          break;
        case "删除":
          this.deleteContractVisible = true;
          break;
        case "重新提交":
          break;
        case "媒体录入":
          break;
        case "续签":
          break;
        case "补充协议":
          break;
        case "加门":
          break;
        case "付款":
          break;
        case "付款记录":
          break;
        case "审核":
          break;
        case "完成签约":
          this.signVisible = true;
          break;
        case "合同终止":
          break;
      }
    },
    // 获取当前列表操作权限
    getContractOperation() {
      let tempNo = `${
          this.roleArr[JSON.parse(sessionStorage.getItem("session_data")).uType]
        }${this.contractObj.dcType}${this.contractObj.dcState}`,
        tempArr = [];
      for (const key in this.operationAuthorityArr) {
        if (Object.hasOwnProperty.call(this.operationAuthorityArr, key)) {
          this.operationAuthorityArr[key].includes(tempNo) && tempArr.push(key);
        }
      }
      this.operationArr = tempArr;
    },
    // 获取合同详情
    getContractDetail() {
      api
        .getApi("/addsp/devContract/getContractDetail", {
          dcID: this.dcID,
        })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let tempObj = res.data.data || {};
            this.contractObj = {
              dcType: tempObj.dcType,
              dcState: tempObj.dcState,
            };
            this.detailArr = [
              {
                title: "基本信息",
                content: [
                  { label: "资源名称", value: tempObj.resName },
                  { label: "物业公司", value: tempObj.pmcName },
                  { label: "联系人", value: tempObj.contactsName },
                  { label: "联系人手机号", value: tempObj.contactsPhone },
                  { label: "合同开始日期", value: tempObj.startDate },
                  { label: "合同结束日期", value: tempObj.endDate },
                  { label: "门体归属权", value: tempObj.ownership },
                  { label: "合同媒体数", value: tempObj.mediaCnt },
                ],
              },
              {
                title: "安装信息",
                content: [
                  { label: "赠送车场道闸", value: tempObj.freeCarGateCnt },
                  { label: "赠送护栏门", value: tempObj.freeGuardrailDoorCnt },
                  {
                    label: "赠送门禁设备",
                    value: tempObj.freeAccessControlCnt,
                  },
                  { label: "赠送IC卡", value: tempObj.freeICCardCnt },
                  { label: "赠送ID卡", value: tempObj.freeIDCardCnt },
                  // {label: "赠送护栏", value: tempObj.freeGuardrailDoorCnt},
                  { label: "赠送三辊闸", value: tempObj.freeTRGateCnt },
                  { label: "赠送翼闸", value: tempObj.freeWingGateCnt },
                ],
              },
              {
                title: "费用信息",
                content: [
                  {
                    label: "是否有场地费",
                    value: tempObj.isVenueFee ? "是" : "否",
                  },
                  { label: "场地费付款方式", value: tempObj.venuePayType },
                  { label: "场地费", value: tempObj.venueFee },
                  { label: "场地费应付日期", value: tempObj.venueDate },
                  {
                    label: "是否有开发费",
                    value: tempObj.isDevFee ? "是" : "否",
                  },
                  { label: "开发费付款方式", value: tempObj.devPayType },
                  { label: "开发费", value: tempObj.devFee },
                  { label: "开发费应付日期", value: tempObj.devDate },
                ],
              },
              {
                title: "其它信息",
                content: [{ label: "物业规模(人数)", value: tempObj.resName }],
              },
            ];
            this.fileList = [
              {
                fileUrl: "http://localhost:8080/static/images/noticeBanner.png",
                fileName: "noticeBanner.png",
              },
            ];
            this.mediaRelList = [
              {
                createTime: "2021-06-29T04:05:32.094Z",
                createUser: 0,
                dcID: 0,
                id: 0,
                installDate: "string",
                installUserName: "string",
                isFinish: 0,
                isNew: 0,
                mID: 0,
                mState: 0,
                mTitle: "string",
                mType: "string",
                state: 0,
              },
            ];
            this.getContractOperation();
            this.$message.success(res.data.MSG || "");
          } else {
            this.$message.warning(res.data.MSG || "");
          }
        });
    },
    // 下载附件
    downloadFile(item) {
      var a = document.createElement("a");
      a.download = item.fileName;
      a.href = item.fileUrl;
      $("body").append(a); // 修复firefox中无法触发click
      a.click();
      $(a).remove();
    },
  },
};
</script>
<style lang="scss" scope>
.media-table {
  margin: 16px 12px;
  width: calc(100% - 24px);
}
.contract-borde + .contract-borde {
  padding: 18px 0;
  border-top: 1px solid #E6E7E9;
}
.title-row {
  margin: 8px 12px;
  .title-label,
  .title-content {
    white-space: nowrap;
  }
  .row-left {
    display: flex;
    align-items: center;
    height: 32px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 32px;
  }
  .row-right {
    text-align: right;
  }
}
.content-row {
  padding: 0 12px;
}
.emphasize-text {
  padding: 10px 0;
  margin: 0 12px 8px;
  font-size: 16px;
  font-weight: 600;
  color: #333333;
  line-height: 22px;
}
.detail-item {
  display: flex;
  align-items: center;
  line-height: 22px;
  font-size: 14px;
  padding: 8px 24px;
  .detail-item-label {
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.85);
  }
  .detail-item-content {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(0, 0, 0, 0.65);
  }
}
.detail-common {
  padding: 24px 24px;
  background: #ffffff;
  border: 1px solid #e6e7e9;
  .detail-common-title {
    margin: 8px 24px 0;
    line-height: 28px;
    font-size: 20px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }
}
.contract-status-name {
  height: 22px;
  padding: 0 8px;
  margin-left: 8px;
  background: #e6f7ff;
  border-radius: 2px;
  border: 1px solid #91d5ff;
  font-size: 12px;
  color: #1890ff;
  line-height: 22px;
}
.file-item {
  display: flex;
  align-items: center;
  flex-flow: rwo nowrap;
  box-sizing: border-box;
  height: 32px;
  padding: 0 8px;
  margin-bottom: 10px;
  .el-icon-download {
    display: none;
    margin: 0 0 0 auto;
    font-size: 20px;
    font-weight: 600;
    color: #1890ff;
  }
  .file-item__name {
    margin-left: 6px;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.65);
  }
  &:hover {
    background: rgba(0, 0, 0, 0.04);
    border-radius: 4px;
    .el-icon-download {
      display: block;
    }
  }
}
</style>