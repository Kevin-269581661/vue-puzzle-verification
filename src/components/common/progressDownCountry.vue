<template>
  <div class="down_page">
    <el-progress
      v-if="currper == 100"
      :width="120"
      type="circle"
      :percentage="currper"
      status="success"
    ></el-progress>
    <el-progress
      v-else
      :width="120"
      type="circle"
      :percentage="currper"
    ></el-progress>
    <p class="text_style">
      {{
        currper == 100
          ? "生成完成，请在下载工具里查看文件"
          : "正在生成中，请等待…"
      }}
    </p>
    <span v-if="currper < 100" class="nav"
      >已耗时 {{ Math.ceil(second / 60) }} 分钟，<a
        class="nav-text"
        href="https://apps.qinlinad.com/rapidDownload.html"
        target="_blank"
        >立即加速</a
      ></span
    >
    <div class="file_style" v-if="currper == 100">
      <img src="../../assets/images/downfile.png" alt="" />
    </div>
  </div>
</template>

<script>
import api from "../../api/api.js";
import sessFun from "../../commonFun/sessFun.js";
export default {
  data() {
    return {
      currper: 0,
      myInterval: "",
      second: 0,
      routeQuery: null,
      sessionData: null,
    };
  },
  methods: {
    // 导出订单图片包
    getProcess() {
      api
        .getApi("/image/downloadNationalImgPackage", this.$route.query)
        .then((res) => {
          console.log(res.data);
          if (res.data.SysCode == 200200) {
            let resinfo = res.data.data;
            this.currper = parseInt(Number(resinfo.rate));
            if (this.currper == 100) {
              clearInterval(this.myInterval);
              let downloadElement = document.createElement("a");
              let href = resinfo.url;
              downloadElement.href = href;
              document.body.appendChild(downloadElement);
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              this.$alert("请在下载工具里查看文件", "文件成功生成", {
                confirmButtonText: "知道了",
              });
            }
          } else {
            clearInterval(this.myInterval);
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
          clearInterval(this.myInterval);
        });
    },
    // 导出ppt/pdf
    getPPTProcess() {
      api
        .getApi(
          "/national/api/v1/powerPoint/getPPTXReportProgress",
          this.$route.query
        )
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let resinfo = res.data.data;
            this.currper = parseInt(Number(resinfo.rate));
            if (resinfo.code == 200) {
              if (resinfo.finish == 1) {
                clearInterval(this.myInterval);
                let downloadElement = document.createElement("a");
                let href = resinfo.cosUrl;
                downloadElement.href = href;
                document.body.appendChild(downloadElement);
                downloadElement.click(); //点击下载
                document.body.removeChild(downloadElement); //下载完成移除元素
                this.$alert("请在下载工具里查看文件", "文件成功生成", {
                  confirmButtonText: "知道了",
                });
              }
            } else {
              clearInterval(this.myInterval);
              this.$message.warning(resinfo.msg);
            }
          } else {
            clearInterval(this.myInterval);
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
          clearInterval(this.myInterval);
        });
    },
    // 周边资源导出
    getBroundResProcess() {
      if (!(this.routeQuery && this.routeQuery.uqKey)) {
        this.$message.warning("资源参数获取错误！");
        return;
      }
      let formData = new FormData();
      formData.append("uqKey", this.routeQuery.uqKey);
      if (
        this.sessionData.uType == "ADN_MD" ||
        this.sessionData.uType == "ADN_BD"
      ) {
        formData.append("asrId", this.sessionData.asrID);
      }
      api
        .postExportFile("/image/GetCenterPointRes", formData)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            let resinfo = res.data.data;
            this.currper = parseInt(Number(resinfo.rate));
            if (this.currper >= 100) {
              clearInterval(this.myInterval);
              let downloadElement = document.createElement("a");
              let href = resinfo.url;
              downloadElement.href = href;
              document.body.appendChild(downloadElement);
              downloadElement.click(); //点击下载
              document.body.removeChild(downloadElement); //下载完成移除元素
              this.$alert("请在下载工具里查看文件", "文件成功生成", {
                confirmButtonText: "知道了",
              });
            }
          } else {
            clearInterval(this.myInterval);
            this.$message.warning(res.data.MSG);
          }
        })
        .catch((res) => {
          console.log(res);
          clearInterval(this.myInterval);
        });
    },
  },
  created() {
    this.routeQuery = this.$route.query;
    if (this.$route.query.downtype == 1) {
      this.getProcess();
    } else if (this.$route.query.downtype == 2) {
      this.getPPTProcess();
    } /* else if (this.$route.query.downtype == 3) {
      this.sessionData = sessFun.getSess();
      this.getBroundResProcess();
    } */
  },
  mounted() {
    this.myInterval = setInterval(() => {
      setTimeout(() => {
        console.log("downtype--", this.$route.query.downtype);
        //调用接口的方法
        if (this.$route.query.downtype == 1) {
          this.getProcess();
        } else if (this.$route.query.downtype == 2) {
          this.getPPTProcess();
        }/*  else if (this.$route.query.downtype == 3) {
          this.getBroundResProcess();
        } */
      }, 1);
      this.second = this.second + 5;
    }, 5000);
  },
  destroyed() {
    clearInterval(this.myInterval);
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
