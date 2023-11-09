<template>
  <div>
    <!-- 空位导出-弹框组件 -->
    <el-dialog title="空位导出" :visible.sync="isOpenDownload" width="790px">
      <template slot="title">
        <div class="dialog_header">
          <span style="margin-right: auto;">空位导出</span>

          <!-- <el-dropdown>
            <el-button type="plain" size="mini">
              一键筛选<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>测试</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->

          <el-select
            v-model="collectSelection"
            placeholder="一键筛选"
            size="mini"
            filterable
            clearable
            style="width: 120px"
            @change="collectChange"
          >
            <el-option
              v-for="item of collectList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>

        </div>
      </template>
      <div class="vacancy_box">

        <el-row>
          <el-col :span="6">
            <span>导出空位:</span>
          </el-col>
          <el-col :span="18">
            <el-radio-group v-model="downLoadInfo.loadType" @input="loadTypeChange">
              <template v-for="(item, index) in mediaPermissionList" >
                <el-radio :label="item" :key="index">
                  {{item}}
                </el-radio>
              </template>
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
                <el-option v-for="(item, index) in allMediaTypes" :key="index" :label="item.mediaTypeName" :value="item.mediaTypeId"></el-option>
              </el-select>
          </el-col>
        </el-row>

        <el-row  v-if="sessionData.uType === 'ADN_MD_COUNTRY'">
          <el-col :span="6">
            <span>开门次数范围:</span>
          </el-col>
          <el-col :span="18" class="openDoorCount">
            <div class="openDoorSelect">
              <span>时间：</span>
              <el-select
                v-model="downLoadInfo.openDoorType"
                placeholder="开门次数"
                size="small"
                class="otherSelect"
                ref="openDoorRef"
                @change="handleChangeOpenDoorCount"
              >
                <el-option
                  v-for="item in openDoorCountType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
                <div class="open-door-select">
                  <div class="open-door-date">
                    <span class="demonstration">自定义时间范围：</span>
                    <el-date-picker
                      v-model="downLoadInfo.openDoorDate"
                      type="daterange"
                      value-format="yyyy/MM/dd"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      :picker-options="pickerOptions0"
                      >
                    </el-date-picker>
                  </div>
                </div>
              </el-select>
            </div>
            <div>
              <span>范围：</span>
              <el-input  type="number" v-model="downLoadInfo.openDoorMinCount" placeholder="最小值" style="width:120px" @change="handleChangeInput"></el-input>
              &nbsp;~&nbsp;
              <el-input  type="number" v-model="downLoadInfo.openDoorMaxCount" placeholder="最大值" style="width:120px" @change="handleChangeInput"></el-input>
            </div>
          </el-col>
        </el-row>

        <el-row v-if="sessionData.uType === 'ADN_MD_COUNTRY'">
          <el-col :span="6">
            <span>是否支持语音播报:</span>
          </el-col>
          <el-col :span="18">
            <el-radio-group v-model="downLoadInfo.supportVoice">
              <el-radio :label="-1">不限</el-radio>
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
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

        <div class="dialog_footer">
          <div class="footer_left">
            <span class="btn_box" @click="createCollect">
              <i class="el-icon-star-off"></i>
              收藏此筛选组合
            </span>
            <span class="btn_box" @click="openCollectTable">收藏列表</span>
          </div>
          <el-button @click="cancelDown" size="small">取 消</el-button>
          <el-button type="primary" @click="confirmDown" size="small">
            确 定
          </el-button>
        </div>
      </div>
    </el-dialog>

    <!-- 收藏列表 -->
    <VacancyDownloadCollect ref="vacancyDownloadCollect" :collectList="collectList" @getCollectList="getCollectList" @cancelCollect="cancelCollect"/>
  </div>
</template>

<script>
import FileSaver from 'file-saver';
import api from "../../../../api/api.js";
import sessFun from "../../../../commonFun/sessFun.js";
import filterData from "../../../../commonFun/filterTableData.js";
import VacancyDownloadCollect from './vacancyDownloadCollect.vue'
import { Message } from "element-ui";

export default {
  components: {
    VacancyDownloadCollect
  },
  data () {
    return {
      isOpenDownload: false,
      // 登录信息
      sessionData: {},
      // 空位导出信息
      downLoadInfo: {
        // 导出空位
        loadType: "",
        // 选择城市
        city: [],
        // 媒体类型
        mediaTypeIds: '',
        // 是否默认日期
        dateType: "1",
        // 自定义日期
        daterange: [],
        //最小值
        openDoorMinCount: '',
        //最大值
        openDoorMaxCount: '',
        //开门类型值
        openDoorType: '',
        //开门次数日期范围
        openDoorDate: [],
        //语音支持
        supportVoice: -1
      },
      allMediaTypes: [],
      tempMediaTypes: [],
      // 城市列表
      cityList: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() <= Date.now() - 1000 * 3600 * 24;
        },
      },
      mediaPermissionList: [],
      mediaTypeList: [],
      collectList: [],
      collectSelection: null,
      // 开门次数类型
      openDoorCountType: [
        {
          label: '昨日',
          value: 1
        },
        {
          label: '近7天',
          value: 2
        },
        {
          label: '近30天',
          value: 3
        },
        {
          label: '自定义',
          value:  4
        },
      ],
      //限制时间范围
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6; //如果没有后面的-8.64e6就是不可以选择今天的
        }
      },
    };
  },
  methods: {
    open() {
      this.isOpenDownload = true
    },
    close() {
      this.isOpenDownload = false
    },
    // 导出类型对应媒体类型
    loadTypeChange(type) {
        this.downLoadInfo.mediaTypeIds = []
        const index = this.tempMediaTypes.findIndex(item => item.chooseTypeName === type)
        this.allMediaTypes = this.tempMediaTypes[index].mediaTypeList
    },
    // 获取session数据
    getSessionData () {
      this.sessionData = sessFun.getSess();
      // 处理导点纬度
      let permissionList = this.sessionData.userMediaChooseConfigs || []
      // 导出空位
      let tempPermiision = []
      // 媒体类型
      let tempMediaTypes = []
      if(permissionList.length) {
        permissionList.forEach(per => {
          if(per.chooseTypeName !== '小区') {
            tempPermiision.push(per.chooseTypeName)
          }
        })
      }
      tempPermiision = [...new Set(tempPermiision)]
      let order = ['点位', '单元', '楼栋', '小区']
      tempPermiision = tempPermiision.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b)
      })
      if(tempPermiision.length) {
        let list
        tempPermiision.forEach(item => {
            list = permissionList.filter(v => v.chooseTypeName === item)
            tempMediaTypes.push({
                chooseTypeName: item,
                mediaTypeList: list
            })
        })
      }

      // 按小区导出不做限制
      tempPermiision.push('小区')
      const resArr = filterData(permissionList, 'mediaTypeId', 'mediaTypeName').map(item => {
        return {
          mediaTypeId: item.value,
          mediaTypeName: item.mediaTypeName
        }
      })

      tempMediaTypes.push({
        chooseTypeName: '小区',
        mediaTypeList: resArr
      })

      // 导出空位的处理
      if (
        ['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType) &&
        this.sessionData.customPermission.proposalPermission == 1
      ) {
        tempPermiision = tempPermiision.filter(item => item !== '点位')
      }

      this.tempMediaTypes = tempMediaTypes
      this.mediaPermissionList = tempPermiision
    },
    cancelDown() {
      this.resetDownloadInfo()
      this.close();
    },
    //输入框校验
    handleChangeInput() {
      if (this.downLoadInfo.openDoorMinCount < 0 ) {
        this.downLoadInfo.openDoorMinCount = ''
      }
      if (this.downLoadInfo.openDoorMaxCount < 0 ) {
        this.downLoadInfo.openDoorMaxCount = ''
      }
      if (this.downLoadInfo.openDoorMaxCount > 100000000) {
        this.downLoadInfo.openDoorMaxCount = 100000000
      }
    },
    // 重置空位导出信息
    resetDownloadInfo() {
      const info = this.downLoadInfo
      info.loadType = '',
      info.city = [],
      info.dateType = '1'
      info.mediaTypeIds = ''
      info.daterange = []
      this.collectSelection = null
      info.supportVoice = -1
      info.openDoorMinCount = ''
      info.openDoorMaxCount = ''
      info.openDoorType = ''
      info.openDoorDate = []
    },
    confirmDown () {
      let { loadType, city, daterange, dateType, openDoorType, openDoorMinCount,openDoorMaxCount,mediaTypeIds,openDoorDate } = this.downLoadInfo;
        if (!loadType) {
            Message.warning("请选择选点纬度!");
            return;
        }
        if (!city.length) {
            Message.warning("请选择城市!");
            return;
       }
        if ( openDoorType === 4 && openDoorDate.length < 2) {
          this.messageFun("warning", "请选择自定义时间范围");
            return;
        }
        
        if (openDoorMinCount > openDoorMaxCount) {
          this.messageFun("warning", "最小值不能大于最大值");
          return;
        }
        if (openDoorType !== '' && openDoorMinCount === '') {
          this.messageFun("warning", "请填写最小值");
          return;
        }
        if (openDoorType !== '' && openDoorMaxCount === '') {
          this.messageFun("warning", "请填写最大值");
          return;
        }
        
        
        if (openDoorType === '' && openDoorMinCount !== '' && openDoorMaxCount !== '') {
          this.messageFun("warning", "请选择开门时间范围");
          return;
        }
        if (dateType == "2") {
          if (!daterange || !daterange.length) {
            this.messageFun("warning", "请先选择日期");
            return;
          }
        }
        if (!mediaTypeIds.length) {
            Message.warning("请选择媒体类型!");
            return;
        }
        switch(loadType) {
            // 按小区
            case "小区": this.getExcelData('exportVacancyByCommunity', '小区'); break;
            // 按楼栋
            case "楼栋": this.getExcelData('exportVacancyByBuilding', '楼栋'); break;
            // 按单元
            case "单元": this.getExcelData('exportVacancyByUnit', '单元'); break;
            // 按点位
            case "点位": this.getExcelData('exportVacancyByAds', '点位'); break;
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
                value: data.rID,
              };
              result.push(obj);
            }
            this.cityList = result;
          } else {
            Message.warning(res.data.MSG);
          }
        });
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
        FileSaver.saveAs(new Blob([data], {type: "application/vnd.ms-excel"}), `${fileName} 空位表(按${name}).xlsx`)
    },
    // 按小区/楼栋/单元/点位 - 表格数据请求
    getExcelData(url, name) {
        let loadingPoint = this.$loading({
            lock: true,
            text: "玩命加载中...",
            spinner: "el-icon-loading",
            background: "rgba(0, 0, 0, 0.7)",
        });
        let { city, mediaTypeIds,openDoorType,openDoorMinCount,openDoorMaxCount,supportVoice, dateType, daterange, openDoorDate } = this.downLoadInfo;
        let params = {
            cityIds: city.join(','),
            mediaTypeIds: mediaTypeIds.join(','),
            supportVoice,
            openDoorType: openDoorType === ''? null : openDoorType,
            openDoorMinCount: openDoorMinCount === ''? null : openDoorMinCount,
            openDoorMaxCount: openDoorMaxCount === '' ? null : openDoorMaxCount,
            openDoorBeginDate: openDoorType === 4 ? openDoorDate[0] : null,
            openDoorEndDate: openDoorType === 4 ? openDoorDate[1] : null
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
    /**
     * 添加导出条件的收藏
     */
    createCollect() {
      this.$prompt('请为该筛选组合命名', '温馨提示', {
        inputPattern: /.+/,
        inputErrorMessage: '请输入筛选组合名称'
      }).then(({ value: name }) => {
        const { city: cityIds, dateType, daterange, mediaTypeIds, loadType: vacancy } = this.downLoadInfo
        const citys = cityIds.map(cityId => {
          return this.cityList.find(item => item.value === cityId).label
        })
        let defaultTimeFlag = null
        if (dateType == '1') {
          defaultTimeFlag = 1
        } else if (dateType == '2') {
          defaultTimeFlag = 0
        }
        const [startTime = null, endTime = null] = daterange
        const mediaTypes = mediaTypeIds.map(id => {
          return this.allMediaTypes.find(item => item.mediaTypeId === id).mediaTypeName
        })
        let params = {
          // 城市ids
          cityIds,
          // 城市s
          citys,
          // 媒体类型id
          mediaTypeIds,
          // 媒体类型
          mediaTypes,
          // 收藏名字
          name,
          // 是否默认时间: 0 否, 1 是
          defaultTimeFlag,
          // 自定义开始时间
          startTime,
          // 自定义结束时间
          endTime,
          // 空位
          vacancy,
        }
        console.log('createCollect ===> ', params)
        api
        .postApi_json(`${this.apiVar.excelExport}/saveCollect`, params)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            Message.success('操作成功');
            this.getCollectList({})
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch(err => {
          console.error('createCollect error:', err)
        })
      }).catch(() => {});
    },
    // 开门次数
    handleChangeOpenDoorCount () {
      if (this.openDoorType === 4) {
        if (this.openDoorDate.length === 0) {
          sessFun.messageFun("warning", "请选择自定义时间范围!");
          this.openDoorType = null
        }
      }
    },
    /**
     * 打开收藏列表
     */
    openCollectTable () {
      this.$refs.vacancyDownloadCollect && this.$refs.vacancyDownloadCollect.open()
    },
    /**
     * 获取收藏列表
     */
    getCollectList({ onComplete }) {
      api
        .getApi(`${this.apiVar.excelExport}/collectList`)
        .then((res) => {
          if (res.data.SysCode == 200200) {
            const list = res.data.data || []
            this.collectList = list.map(item => {
              return {
                ...item,
                cityDisplayStr: item.citys.join('、'),
                mediaTypeDisplayStr: item.mediaTypes.join('、'),
              }
            })
          } else {
            Message.warning(res.data.MSG);
          }
        })
        .catch(err => {
          console.error('getCollectList error:', err)
        })
        .finally(() => {
          onComplete && onComplete()
        })
    },
    /**
     * 取消收藏
     */
     cancelCollect({ id, onComplete }) {
      api
        .getApi(`${this.apiVar.excelExport}/deleteCollect`, { id })
        .then((res) => {
          if (res.data.SysCode == 200200) {
            Message.success('操作成功');
            this.getCollectList({ onComplete })
          } else {
            onComplete && onComplete()
            Message.warning(res.data.MSG);
          }
        })
        .catch(err => {
          onComplete && onComplete()
          console.error('cancelCollect error:', err)
        })
    },
    /**
     * 一键筛选
     */
    collectChange(val) {
      if (this.collectSelection) {
        const itemData = this.collectList.find(item => item.id === val)
        // console.log('collectChange itemData===>', itemData)
        if (itemData) {
          let { cityIds: city = [], vacancy: loadType, mediaTypeIds = [], startTime, endTime, defaultTimeFlag } = itemData
          // 导出空位的处理
          if (!this.mediaPermissionList.includes(loadType)) {
            loadType = null
          }
          // 选择城市的处理
          const cityIdList = this.cityList.map(item => item.value)
          city = city.filter(item => cityIdList.includes(item))
          // console.log('collectChange city===>', city)
          // 媒体类型的处理
          // console.log('tempMediaTypes ===', this.tempMediaTypes)
          if (loadType) this.loadTypeChange(loadType)
          // console.log('allMediaTypes ===', this.allMediaTypes)

          const allMediaTypeIdList = this.allMediaTypes.map(item => item.mediaTypeId)
          // console.log('allMediaTypeIdList ===', allMediaTypeIdList)
          // console.log('collectChange mediaTypeIds===>', JSON.stringify(mediaTypeIds))


          mediaTypeIds = mediaTypeIds.filter(item => allMediaTypeIdList.includes(item))
          // console.log('collectChange mediaTypeIds===>', mediaTypeIds)

          // 选择日期的处理
          let daterange = []
          if (!defaultTimeFlag && startTime && endTime) {
            daterange = [startTime, endTime]
          }
          // console.log('collectChange daterange===>', daterange)

          this.downLoadInfo = {
            city,
            loadType,
            mediaTypeIds,
            dateType: defaultTimeFlag ? '1' : '2',
            daterange
          }
        }
      }
    }
  },
  mounted () {
    this.getSessionData();
    this.getCity();
    this.getCollectList({})
    // this.getAllMediaTypes();
  },
  computed: {

  },
};
</script>

<style lang="scss" scoped>
/deep/.vacancy_box .el-row {
  height: 50px;
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

/deep/.vacancy_box .el-result {
  padding: 0;
  padding-bottom: 50px;
}
.dialog_header {
  display: flex;
  align-items: center;
  padding-right: 36px;
}
.dialog_footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .footer_left {
    margin-right: auto;
  }
  .btn_box {
    cursor: pointer;
    & + .btn_box {
      margin-left: 20px;
    }
  }
}
.openDoorCount{
  display: flex;
  align-items: center;
  margin-top: -8px;
  /deep/ .el-select{
    width: 135px;
  }
  .openDoorSelect{
    margin-right: 10px;
  }
}
.otherSelect {
  /deep/ .el-input__inner {
    max-width: 135px;
    height: 30px;
    padding-left: 10px;
    color: #1890ff;
    border-radius: 0;
    overflow: hidden;
  }
  /deep/ .el-select__tags-text {
    display: inline-block;
    max-width: 30px;
    overflow: hidden;
    // text-overflow: ellipsis;
  }
  /deep/ .el-tag__close.el-icon-close {
    right: -5px;
    top: -5px;
  }
}

.otherSelect /deep/ .el-tag {
  background: #fff;
  color: #1890ff;
}

.otherSelect /deep/ .el-input__inner:hover {
  color: #1890ff;
  border-color: #1890ff;
}

.otherSelectActive /deep/ .el-input__inner {
  border-color: #1890ff;
}

.otherSelectActive /deep/ .el-input .el-select__caret {
  color: #1890ff;
}
.open-door-select{
  padding: 10px 20px;
}
.open-door-date{
  border-top: 1px solid blue;
  width: 470px;
  padding: 10px 0;
}
.open-door-date span {
  font-weight: 400;
  font-size: 14px;
}

</style>
