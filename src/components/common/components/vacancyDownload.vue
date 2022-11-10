<template>
  <div class="vacancy_box">
    <el-row>
      <el-col :span="6">
        <span>导出空位:</span>
      </el-col>
      <el-col :span="18">
        <el-radio-group v-model="downLoadInfo.loadType">
          <el-radio label="1">按小区</el-radio>
          <el-radio label="2">按楼栋</el-radio>
          <el-radio label="3">按单元</el-radio>
          <el-radio label="4" v-if="showNdwBtn">按点位</el-radio>
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
        <span>媒体类型:</span>
      </el-col>
      <el-col :span="18">
          <el-select
            size="small"
            class="m_ehicle_class"
            multiple
            collapse-tags
            v-model="downLoadInfo.mediaTypeIds"
            placeholder="请选择媒体类型"
          >
            <el-option v-for="(item, index) in allMediaTypes" :key="index" :label="item.name" :value="item.id"></el-option>
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
import sessFun from "../../../commonFun/sessFun.js";
import { Message } from "element-ui";

export default {
  data () {
    return {
      // 登录信息
      sessionData: {},
      // 空位导出信息
      downLoadInfo: {
        loadType: "1",
        city: [],
        dateType: "1",
        mediaTypeIds: '',
        daterange: [],
      },
      allMediaTypes: [],
      // 城市列表
      cityList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() <= Date.now() - 1000 * 3600 * 24;
        },
      },
    };
  },
  methods: {
    // 获取session数据
    getSessionData () {
      this.sessionData = sessFun.getSess();
    },
    cancelDown () {
      this.messageFun("info", "取消此操作");
      this.$emit("cancelClick", false);
    },
    confirmDown () {
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

        switch(loadType) {
            // 按小区
            case "1": this.getExcelData('exportVacancyByCommunity', '小区'); break;
            // 按楼栋
            case "2": this.getExcelData('exportVacancyByBuilding', '楼栋'); break;
            // 按单元
            case "3": this.getExcelData('exportVacancyByUnit', '单元'); break;
            // 按点位
            case "4": this.getExcelData('exportVacancyByAds', '点位'); break;
        }
    },
    // 获取城市
    getCity () {
      let info = {
        token: this.sessionData.token,
        uid: this.sessionData.uID,
      };
      api
        .postApi(this.apiVar.Advertisement + "/GetAuthorCity", info)
        .then((res) => {
        // console.log(res.data);
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
    // 个人权限公司下媒体类型列表
    getAllMediaTypes() {
      api.getApi('/addsp/api/v1/mediaTypes/getPersonalAuthMediaTypes').then(res => {
        if (res.data.SysCode == 200200) {
          this.allMediaTypes = res.data.data || []
        } else {
          this.messageFun('warning', res.data.MSG);
        }
      })
    },
    // 获取城市中文名称
    getCityName (rids) {
        let citys = [];
        for (let i = 0; i < rids.length; i++) {
            for(let data of this.cityList) {
                if(data.value === rids[i]) {
                    citys.push(data.label)
                    break
                }
            }
        }
        return citys.join('-');
    },
    // 导出表格
    exportToExcel(data, name) {
        let { city, dateType, daterange } = this.downLoadInfo;
        let fileName = this.getCityName(city)
        // 自定义日期
        if(dateType == '2') {
            fileName += '-' + daterange[0] + '~' + daterange[1]
        }
        // 导出excel
        let blob = new Blob([data], {type: "application/vnd.ms-excel;charset=utf-8"});
        let downloadElement = document.createElement("a");
        let href = window.URL.createObjectURL(blob); //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = `${fileName} 空位表(按${name}).xlsx`; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click(); //点击下载
        document.body.removeChild(downloadElement); //下载完成移除元素
        window.URL.revokeObjectURL(href); //释放掉blob对象
    },
    // 按小区/楼栋/单元/点位 - 表格数据请求
    getExcelData(url, name) {
        let loadingPoint = this.$loading({
            lock: true,
            text: "玩命加载中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
        });
        let { city, mediaTypeIds, dateType, daterange } = this.downLoadInfo;
        let params = {
            cityIds: city.join(','),
            mediaTypeIds: mediaTypeIds.join(','),
        }
        // 自定义日期
        if(dateType === '2') {
            params.startTime = daterange[0]
            params.endTime = daterange[1]
        }
        api.getApi_file('/addsp/api/v1/excel/export/' + url, params)
        .then((res) => {
            if (res.status === 200) {
                if(res.data) {
                    this.exportToExcel(res.data, name)
                    this.messageFun('success', '导出成功')
                }
            } else {
                this.messageFun('error', '导出失败')
            }
        })
        .catch((err) => {
            console.log(err);
        })
        .finally(() => {
            loadingPoint.close()
        })
    },
    // 操作提示统一方法
    messageFun (mesType, mes) {
      this.$message({
        message: mes,
        type: mesType,
        showClose: true,
      });
    },
  },
  mounted () {
    this.getSessionData();
    this.getCity();
    this.getAllMediaTypes();
  },
  computed: {
    //显示导点位
    showNdwBtn () {
      return !(['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType) && this.sessionData.customPermission.proposalPermission == 1);
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
