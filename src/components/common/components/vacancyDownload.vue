<template>
  <div class="vacancy_box">
    <el-row>
      <el-col :span="6">
        <span>导出空位:</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="downLoadInfo.loadType">
          <el-radio label="1">按小区</el-radio>
          <el-radio label="2" v-if="showNdwBtn">按点位</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <span>选择城市:</span>
      </el-col>
      <el-col :span="18">
        <el-select
          v-model="downLoadInfo.city"
          placeholder="请选择城市"
          multiple
          size="small"
          collapse-tags
          filterable
        >
          <el-option
            v-for="item in cityList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <span>选择日期:</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="downLoadInfo.dateType">
          <el-radio label="1">默认半年日期</el-radio>
          <el-radio label="2">自定义日期</el-radio>
        </el-radio-group>
      </el-col>
    </el-row>
    <el-row v-if="downLoadInfo.dateType == '2'">
      <el-col :span="18" :offset="6">
        <el-date-picker
          v-model="downLoadInfo.daterange"
          type="daterange"
          size="small"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy/MM/dd"
          format="yyyy/MM/dd"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-col>
    </el-row>
    <p class="button_box">
      <el-button @click="cancelDown()" size="small">取 消</el-button>
      <el-button type="primary" @click="confirmDown()" size="small"
        >确 定</el-button
      >
    </p>
  </div>
</template>

<script>
import api from "../../../api/api.js";
// 时间格式化
import timeFormat from "../../../commonFun/timeFormat.js";
import sheetExcel from "../../../commonFun/sheetExcel.js";
import sessFun from "../../../commonFun/sessFun.js";

import { Message } from "element-ui";

export default {
  data() {
    return {
      // 登录信息
      sessionData: {},
      // 空位导出信息
      downLoadInfo: {
        loadType: "1",
        city: [],
        dateType: "1",
        daterange: [],
      },
      // 城市列表
      cityList: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() <= Date.now()-1000*3600*24;
        },
      },
    };
  },
  methods: {
    // 获取session数据
    getSessionData() {
      this.sessionData = sessFun.getSess();
      this.role = this.sessionData.uType;
    },
    cancelDown() {
      this.messageFun("info", "取消此操作");
      this.$emit("cancelClick", false);
    },
    confirmDown() {
      console.log("downLoadInfo----", this.downLoadInfo);
      let { loadType, city, daterange, dateType } = this.downLoadInfo;
      if (!city.length) {
        Message.warning("请选择城市!");
        return;
      }
      if (dateType == "2") {
        if (!daterange || !daterange.length) {
          this.messageFun("warning", "请先选择日期");
          return;
        }
      }
      if (loadType == "1") {
        if (dateType == "1") {
          // 半年日期按照小区来导
          this.exportExcelData();
        } else {
          // 自定义日期按照小区来导
          this.dateRangeEmpty();
        }
      } else {
        let { city, daterange } = this.downLoadInfo;
        let rid = city.join(",");
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          rIDs: rid,
        };
        if (dateType == "1") {
          // 半年日期按照点位来导
          this.getDaterangeAds(info);
        } else {
          info.startTime = daterange[0];
          info.endTime = daterange[1];
          // 自定义日期按照点位来导
          this.getDaterangeAds(info);
        }
      }
    },
    // 获取城市
    getCity() {
      let info = {
        token: this.sessionData.token,
        uid: this.sessionData.uID,
      };
      api
        .postApi(this.apiVar.Advertisement + "/GetAuthorCity", info)
        .then((res) => {
          console.log(res.data);
          if (res.data.SysCode == 300200) {
            let resinfo = res.data.data;
            let result = [];
            for (let data of resinfo) {
              let obj = {
                label: data.rName,
                value: data.rID.toString(),
              };
              result.push(obj);
            }
            this.cityList = result;
          } else {
            Message.warning(res.data.MSG);
          }
        });
    },
    // 自定义日期按照小区
    dateRangeEmpty() {
      this.postDownLoadNum(0);
      let { city, daterange } = this.downLoadInfo;
      let loadingPoint = this.$loading({
        lock: true,
        text: "玩命加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let rid = city.join(",");
      console.log(daterange, rid);
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        rIDs: rid,
        startTime: daterange[0],
        endTime: daterange[1],
      };
      api
        .postApi(this.apiVar.Advertisement + "/ExportSpareRes", info)
        .then((res) => {
          console.log(res.data);
          if (!res.data.SysCode) {
            if (res.data.length) {
              let returnobj = this.formatData(res.data);
              let head = [
                "省份",
                "城市",
                "区域",
                "资源名称",
                "商圈",
                "地址",
                "媒介载体",
                "楼栋数量",
                "住户数量",
                "楼盘价格",
                "楼盘类型",
                "入住时间",
                "车位数",
                "车流量",
                "人流量",
                "广告限制",
                "点位备注",
                "媒体数量(面)",
                "地图中心点",
              ];
              if (
                (this.sessionData.uType == "MD" &&
                  this.sessionData.mediaManageLevel == 1) ||
                (this.sessionData.uType == "BD" &&
                  this.sessionData.saleManageLevel == 2)
              ) {
                head.push("归属公司");
              }
              let customPermission = JSON.parse(
                sessionStorage.getItem("session_data")
              ).customPermission;
              switch (customPermission.patrolPermission) {
                case 1:
                  head.push("巡点问题", "通行情况");
                  break;
                case 2:
                  head.push("巡点问题", "通行情况", "通电情况");
                  break;
              }
              let allHead = head.concat([info.startTime + "-" + info.endTime]);
              let filename =
                returnobj.city.join("-") +
                "-" +
                info.startTime +
                "~" +
                info.endTime +
                "空位表";
              sheetExcel.toDownload(allHead, returnobj.arr, filename);
            } else {
              this.messageFun("warning", "此城市没有点位");
            }
          } else {
            this.messageFun("warning", res.data.MSG);
          }
          loadingPoint.close();
        })
        .catch((err) => {
          console.log(err);
          loadingPoint.close();
        });
    },
    // 导出空点格式化数据
    formatData(arr) {
      let returnObj = {
        city: [],
        arr: "",
      };
      let result = [];
      for (let data of arr) {
        let resObj = {
          sheetName: this.getCityName(data.rID),
          showList: [],
        };
        returnObj.city.push(resObj.sheetName);
        let dataArr = data.adDoor.concat(data.barrier);
        for (let item of dataArr) {
          let obj = {
            province: item.prName || "--",
            city: item.crName || "--",
            rName: item.rName || "--",
            resName: item.resName || "--",
            tradingArea: item.tradingArea || "--",
            resAddress: item.resAddress || "--",
            mVehicle: item.mVehicle,
            fNum: item.fNum || "--",
            hNum: item.hNum || "--",
            hPrice: item.hPrice / 100,
            cType: item.cType || "--",
            chDay: item.chDay || "--",
            parkSpaceNum: item.parkSpaceNum || "--",
            carFlow: item.carFlow || "--",
            peopleFlow: item.peopleFlow || "--",
            notPush: item.allNotPush || "--",
            remark: item.allremark || "--",
            adsNum: item.adsNum || 0,
            mapCente:item.mapCenter || '--'
          };
          if (
            (this.sessionData.uType == "MD" &&
              this.sessionData.mediaManageLevel == 1) ||
            (this.sessionData.uType == "BD" &&
              this.sessionData.saleManageLevel == 2)
          ) {
            obj.asNames = item.asNames;
          }
          let customPermission = JSON.parse(
            sessionStorage.getItem("session_data")
          ).customPermission;
          // (定制巡点)
          if (customPermission) {
            switch (customPermission.patrolPermission) {
              case 1:
                obj.allRemark = item.allRemark;
                obj.allTrafficState = item.allTrafficState;
                break;
              case 2:
                obj.allRemark = item.allRemark;
                obj.allTrafficState = item.allTrafficState;
                obj.allElectrifyState = item.allElectrifyState;
                break;
            }
          }
          obj[
            this.downLoadInfo.daterange[0] +
              "-" +
              this.downLoadInfo.daterange[1]
          ] = item.DateInfo.adsNum || 0;
          resObj.showList.push(obj);
        }
        result.push(resObj);
      }
      returnObj.arr = result;
      return returnObj;
    },
    // 获取城市中文名称
    getCityName(rid) {
      let str = "";
      for (let data of this.cityList) {
        if (data.value == rid) {
          str = data.label;
          break;
        }
      }
      return str;
    },
    // 导出空点导出次数接口
    postDownLoadNum(type) {
      let data = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        type,
      };
      api
        .postApi(this.apiVar.Advertisement + "/AddExportLog", data)
        .then((res) => {
          console.log(res);
        });
    },
    // 半年日期按照小区导出数据
    exportExcelData() {
      this.postDownLoadNum(0);
      let loadingPoint = this.$loading({
        lock: true,
        text: "玩命加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      let dateArr = [];
      let request_times = this.downLoadInfo.city.length; //计算分几次请求
      let funcs = []; //Promise.all要用到的参数, 存放每次请求的Promise对象
      for (let i = 0; i < request_times; i++) {
        // 循环请求次数，构造请求的Promise对象并插入funcs数组
        let func = new Promise((resolve, reject) => {
          //定义Promise并处理请求逻辑
          let data = [];
          console.log(this.downLoadInfo.city[i]);
          api
            .getApi(
              // this.apiVar.jsonLink+this.downLoadInfo.city[i]+'.json'
              this.apiVar.Advertisement + "/ExportHalfYearSpaceRes",
              { cityIds: this.downLoadInfo.city[i] }
            )
            .then((response) => {
              if (response.data.SysCode == 200200) {
                let dataArr = response.data.data[0];
                data.push(dataArr);
                resolve(data);
              } else {
                resolve("");
              }
            })
            .catch((error) => {
              resolve("");
            });
        });
        funcs.push(func);
      }
      Promise.all(funcs).then((values) => {
        //使用Promise.all调用funcs里面的函数，并合并数据，最后给js-xlsx生成Excel
        let resultValus = [];
        for (let val of values) {
          if (val) {
            resultValus.push(val);
          }
        }
        // console.log(resultValus);
        if (resultValus.length) {
          let returnobj = this.hasPointData(resultValus);
          if (returnobj.arr.length > 0) {
            console.log("returnobj----", returnobj);
            let date = returnobj.date,
              head = [
                "省份",
                "城市",
                "区域",
                "资源名称",
                "商圈",
                "地址",
                "媒介载体",
                "楼栋数量",
                "住户数量",
                "楼盘价格",
                "楼盘类型",
                "入住时间",
                "广告限制",
                "点位备注",
                "媒体数量(面)",
                "地图中心点"
              ],
              customPermission = JSON.parse(
                sessionStorage.getItem("session_data")
              ).customPermission;
            if (
              (this.sessionData.uType == "MD" &&
                this.sessionData.mediaManageLevel == 1) ||
              (this.sessionData.uType == "BD" &&
                this.sessionData.saleManageLevel == 2)
            ) {
              head.push("归属公司");
            }
            switch (customPermission.patrolPermission) {
              case 1:
                head.push("巡点问题", "通行情况");
                break;
              case 2:
                head.push("巡点问题", "通行情况", "通电情况");
                break;
            }
            let allHead = head.concat(date);
            let filename =
              returnobj.filename +
              "-" +
              date[0].substring(0, 10) +
              "~" +
              date[date.length - 1].substring(11) +
              "空位表";
            sheetExcel.toDownload(allHead, returnobj.arr, filename);
          } else {
            this.messageFun("warning", "点位为空");
          }
        } else {
          this.messageFun("warning", "此城市没有点位");
        }
        loadingPoint.close();
      });
    },
    // 处理数据
    hasPointData(arr) {
      let returnObj = {
        arr: "",
        date: "",
        filename: "",
      };
      let result = [];
      let allDateArr = [];
      let filenameArr = [];
      for (let data of arr) {
        if (data.length === 0 || data[0].length === 0) {
          continue;
        }
        let resObj = {
          sheetName: data[0][0].crName,
          showList: [],
        };
        filenameArr.push(resObj.sheetName);
        // console.log(data)
        for (let k = 0, kLen = data.length; k < kLen; k++) {
          for (let item of data[k]) {
            let dateArr = [];
            let dataStr = [];
            let obj = {
              province: item.prName,
              city: item.crName,
              rName: item.rName,
              resName: item.resName,
              tradingArea: item.tradingArea,
              resAddress: item.resAddress,
              mVehicle: item.mVehicle,
              fNum: item.fNum,
              hNum: item.hNum,
              hPrice: item.hPrice / 100,
              cType: item.cType,
              chDay: item.chDay,
              notPush: item.allNotPush || "",
              remark: item.allremark || "",
              adsNum: item.adsNum,
              mapCenter:item.mapCenter || ""
            };
            if (
              (this.sessionData.uType == "MD" &&
                this.sessionData.mediaManageLevel == 1) ||
              (this.sessionData.uType == "BD" &&
                this.sessionData.saleManageLevel == 2)
            ) {
              obj.asNames = item.asNames;
            }
            let customPermission = JSON.parse(
              sessionStorage.getItem("session_data")
            ).customPermission;
            if (customPermission) {
              switch (customPermission.patrolPermission) {
                case 1:
                  obj.allRemark = item.allRemark;
                  obj.allTrafficState = item.allTrafficState;
                  break;
                case 2:
                  obj.allRemark = item.allRemark;
                  obj.allTrafficState = item.allTrafficState;
                  obj.allElectrifyState = item.allElectrifyState;
                  break;
              }
            }
            let showData = item.DateInfo.sort(this.sortDate);
            // console.log('showData',showData)
            for (let date of showData) {
              dateArr.push(
                timeFormat.toDate(date.starDate, "/") +
                  "-" +
                  timeFormat.toDate(date.endDate, "/")
              );
              dataStr.push(date.adsNum);
            }
            let dateObj = this.concatObj(dateArr, dataStr);
            let resultObj = Object.assign(obj, dateObj);
            resObj.showList.push(obj);
            if (k >= kLen - 1) {
              allDateArr = dateArr;
            }
          }
        }
        result.push(resObj);
      }
      returnObj = {
        arr: result,
        date: allDateArr,
        filename: filenameArr.join("-"),
      };
      return returnObj;
    },
    // 键转换为值
    concatObj(dateArr, dataStr) {
      let obj = {};
      for (let dateI = 0, dateLen = dateArr.length; dateI < dateLen; dateI++) {
        obj[dateArr[dateI]] = dataStr[dateI];
      }
      return obj;
    },
    // 自定义日期按照点位来导
    getDaterangeAds(info) {
      this.postDownLoadNum(1);
      let loadingPoint = this.$loading({
        lock: true,
        text: "玩命加载中...",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)",
      });
      api
        .postApi(this.apiVar.Advertisement + "/ExportSpareAds", info)
        .then((res) => {
          console.log(res.data);
          if (res.data.SysCode == 300200) {
            let resinfo = res.data;
            let date = resinfo.startTime + "-" + resinfo.endTime;
            if (resinfo.data.length) {
              let returnData = [];
              for (let item of resinfo.data) {
                if (item.spareAds.length) {
                  returnData.push(item.spareAds);
                }
              }
              if (returnData.length) {
                let returnobj = this.formatDataAds(resinfo.data, date);
                console.log("returnobj-----", returnobj);
                let head = [
                  "资源名称",
                  "省份",
                  "城市",
                  "区域",
                  "商圈",
                  "媒体名称",
                  "媒介载体",
                  "资产编号",
                  "门体类型",
                  "投放面",
                  "媒体等级",
                  "广告限制",
                  "点位备注",
                  "广告尺寸",
                  "画面尺寸",
                  "详细地址",
                  "楼盘类型",
                  "楼盘价格",
                  "楼栋数量",
                  "入住时间",
                  "小区户数",
                  "人流量",
                  "车位数",
                  "车流量",
                  "地图中心点",
                  "空闲日期",
                ];
                if (
                  (this.sessionData.uType == "MD" &&
                    this.sessionData.mediaManageLevel == 1) ||
                  (this.sessionData.uType == "BD" &&
                    this.sessionData.saleManageLevel == 2)
                ) {
                  head.push("归属公司");
                }
                let customPermission = JSON.parse(
                  sessionStorage.getItem("session_data")
                ).customPermission;
                /* if(customPermission && customPermission.patrolPermission) {
                                head.push('巡点问题', '通行情况');
                            } */
                switch (customPermission.patrolPermission) {
                  case 1:
                    head.push("巡点问题", "通行情况");
                    break;
                  case 2:
                    head.push("巡点问题", "通行情况", "通电情况");
                    break;
                }
                let filename = returnobj.city.join("-") + "-" + date + "空位表";
                sheetExcel.toDownload(head, returnobj.arr, filename);
              } else {
                this.messageFun("warning", "此城市在此时间段内没有点位");
              }
            } else {
              this.messageFun("warning", "此城市在此时间段内没有点位");
            }
          } else {
            this.messageFun("warning", res.data.MSG);
          }
          loadingPoint.close();
        })
        .catch((err) => {
          loadingPoint.close();
          console.log(err);
        });
    },
    // 结构格式化
    formatDataAds(arr, date) {
      let resultObj = {
        city: [],
        arr: "",
      };
      let result = [];
      for (let data of arr) {
        console.log("cityname----", data.cityName);
        if (data.spareAds.length) {
          let resObj = {
            sheetName: data.cityName,
            showList: [],
          };
          resultObj.city.push(data.cityName);
          for (let item of data.spareAds) {
            let obj = {
              resName: item.resName || "--",
              province: item.prName || "--",
              city: item.crName || "--",
              rName: item.rName || "--",
              tradingArea: item.tradingArea || "--",
              mTitle: item.mTitle || "--",
              mVehicle: item.mVehicle,
              assetTag: item.assetTag,
              mType: item.mType,
              asLab: item.asLab,
              grade: item.grade || "--",
              notPush: item.allNotPush || "--",
              allremark: item.allremark || "--",
              adSize: item.adSize || "--",
              adViewSize: item.adViewSize || "--",
              resAddress: item.resAddress || "--",
              cType: item.cType || "--",
              hPrice: item.hPrice / 100,
              fNum: item.fNum || "--",
              chDay: item.chDay || "--",
              hNum: item.hNum || "--",
              peopleFlow: item.peopleFlow || "--",
              parkSpaceNum: item.parkSpaceNum || "--",
              carFlow: item.carFlow || "--",
              mapCenter:item.mapCenter || "--",
              date: date,
            };
            if (
              (this.sessionData.uType == "MD" &&
                this.sessionData.mediaManageLevel == 1) ||
              (this.sessionData.uType == "BD" &&
                this.sessionData.saleManageLevel == 2)
            ) {
              obj.asName = item.asName;
            }
            let customPermission = JSON.parse(
              sessionStorage.getItem("session_data")
            ).customPermission;
            if (customPermission) {
              switch (customPermission.patrolPermission) {
                case 1:
                  obj.remark = item.remark || "";
                  obj.trafficState = item.trafficState || "";
                  break;
                case 2:
                  obj.remark = item.remark || "";
                  obj.trafficState = item.trafficState || "";
                  obj.electrifyState = item.electrifyState || "";
                  break;
              }
            }
            resObj.showList.push(obj);
          }
          result.push(resObj);
        }
      }
      resultObj.arr = result;
      return resultObj;
    },
    // 时间大小排序
    sortDate(a, b) {
      let aDate = timeFormat.toDate(a.starDate, "");
      let bDate = timeFormat.toDate(b.starDate, "");
      return aDate - bDate;
    },
    // 操作提示统一方法
    messageFun(mesType, mes) {
      this.$message({
        message: mes,
        type: mesType,
        showClose: true,
      });
    },
  },
  mounted() {
    this.getSessionData();
    this.getCity();
  },
  computed: {
    //显示导点位
    showNdwBtn() {
      return !(this.sessionData.uType == "BD" && this.sessionData.customPermission.proposalPermission == 1);
    },
  },
};
</script>

<style scoped>
/deep/.vacancy_box .el-row {
  height: 45px;
}
/deep/.vacancy_box .el-select {
  width: 90%;
}
/deep/.vacancy_box .el-input__inner {
  width: 100%;
}
/deep/.vacancy_box .el-date-editor {
  width: 90%;
}
/deep/.vacancy_box .el-range-editor--mini .el-range-separator {
  line-height: 30px;
}
.button_box {
  text-align: right;
}
</style>
