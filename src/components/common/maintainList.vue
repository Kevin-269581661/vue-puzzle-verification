<template>
  <div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav">
      <p class="clearfix">
        <a href="#">媒体管理</a><em> / </em><a href="#">媒体维护</a>
      </p>
    </div>
    <div class="mediaList_wrap">
      <div class="mediaList_head">
        <h2>维护列表</h2>
      </div>
      <div class="mediaList_container">
        <el-row>
          <el-col :span="6">
            <span>资源名称:</span>
            <el-input
              v-model="searchInfo.resName"
              placeholder="请输入资源名称"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>资产编号:</span>
            <el-input
              v-model="searchInfo.assetTag"
              placeholder="请输入资产编号"
            ></el-input>
          </el-col>
          <el-col :span="6">
            <span>所在区域:</span>
            <el-cascader
              placeholder="请选择所在区域"
              v-model="searchInfo.districtId"
              :options="areaArr"
              :clearable="true"
              change-on-select
              @change="handleChange"
            ></el-cascader>
          </el-col>
          <el-col :span="6">
            <span>维护类型:</span>
            <el-select
              v-model="searchInfo.type"
              placeholder="请选择维护类型"
              clearable
            >
              <el-option
                v-for="item of typeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <span>维护状态:</span>
            <el-select
              v-model="searchInfo.status"
              placeholder="请选择维护状态"
              clearable
            >
              <el-option
                v-for="item of stateArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <span
              style="
                text-align: right;
                padding-right: 6px;
                box-sizing: border-box;
              "
              >提交者:</span
            >
            <el-select
              v-model="searchInfo.userId"
              placeholder="请选择提交者"
              filterable
              clearable
            >
              <el-option
                v-for="item of engineerArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="6">
            <span>巡点日期:</span>
            <el-date-picker
              class="input-with-select"
              v-model="searchInfo.date"
              type="daterange"
              range-separator="-"
              format="yyyy/MM/dd"
              value-format="yyyy/MM/dd"
              start-placeholder="巡点日期"
              end-placeholder="巡点日期"
            >
            </el-date-picker>
          </el-col>

          <el-col :span="6">
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search()"
              :disabled="!isSearch"
              >搜索
            </el-button>
            <el-button @click="reset()">重置</el-button>
            <el-button @click="downLoad()">一键导出</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table_wrap">
        <div class="table_dt">
          <el-table
            v-loading="loading"
            element-loading-text="拼命加载中..."
            element-loading-spinner="el-icon-loading"
            border
            :data="currentPlan"
            style="width: 100%"
          >
            <el-table-column
              label="维护类型"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.mtType }}</span>
              </template>
            </el-table-column>

            <el-table-column
              column-key="resName"
              prop="resName"
              label="资源"
              :show-overflow-tooltip="true"
              min-width="160"
            >
              <template slot-scope="scope">
                <span> {{ scope.row.resName || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="cityName"
              label="城市"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.cityName || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="area"
              label="区域"
              min-width="100"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.area || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="mediaName"
              label="媒体名称"
              min-width="120"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.mediaName || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              label="媒体面"
              min-width="120"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.asLab || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="assetTag"
              label="资产编号"
              min-width="150"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                {{ scope.row.assetTag || '--' }}
              </template>
            </el-table-column>

            <el-table-column
              prop="trafficState"
              label="通行情况"
              min-width="170"
              class="tar"
              :show-overflow-tooltip="true"
              v-if="customPermission.patrolPermission"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.trafficState || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="electrifyState"
              label="通电情况"
              min-width="170"
              class="tar"
              :show-overflow-tooltip="true"
              v-if="customPermission.patrolPermission == 2"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.electrifyState || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="issueRecord"
              label="问题记录"
              min-width="170"
              class="tar"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <template v-if=" Array.isArray(scope.row.issueRecord)">
                  <span v-for="(item, index) in scope.row.issueRecord" :key="index">
                    <template v-if="scope.row.issueRecord.length > 1">{{index + 1}}.</template>
                    {{item}}<template v-if="scope.row.issueRecord.length > 1 && index !== scope.row.issueRecord.length - 1">，</template>
                  </span>
                </template>
                <template v-else>
                  <span>{{scope.row.issueRecord}}</span>
                </template>
              </template>
            </el-table-column>

            <el-table-column
              prop="createTime"
              label="提交日期"
              min-width="150"
              class="tar"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createTime || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="updateTime"
              label="处理日期"
              min-width="150"
              class="tar"
              :show-overflow-tooltip="true"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.updateTime || '--' }}</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="createUserName"
              label="提交者"
              min-width="100"
              class="tar"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.createUserName }}</span>
              </template>
            </el-table-column>

            <el-table-column
              column-key="mState"
              prop="mState"
              label="状态"
              fixed="right"
              width="100"
            >
              <template slot-scope="scope">
                <point-state
                  :state-text="scope.row.mState"
                  :color="stateToText(scope.row.mState).color"
                ></point-state>
              </template>
            </el-table-column>

            <el-table-column label="操作" width="100" fixed="right">
              <template slot-scope="scope">
                <el-dropdown
                  size="small"
                  trigger="click"
                  placement="bottom-start"
                  :hide-on-click="true"
                >
                  <span class="el-dropdown-link">
                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      @click.native.prevent="showPhoto(scope.row)"
                      v-if="scope.row.mtType == '巡点'"
                      >照片
                    </el-dropdown-item>
                    <!-- <el-dropdown-item @click.native.prevent="toHandle(scope.row)"
                                                          v-if="scope.row.mtType!='拆除'"
                                                          >处理
                                        </el-dropdown-item> -->
                    <el-dropdown-item
                      @click.native.prevent="showHistory(scope.row)"
                      >历史记录
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>

            <div slot="empty">
              <no-search-result></no-search-result>
            </div>
          </el-table>
        </div>
        <div class="ad_pagination" v-if="totalSize">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            @current-change="changePage"
            @size-change="sizeChange"
            :page-sizes="[10, 20, 50]"
            :current-page.sync="currPage"
            :page-size="pageSize"
            :total="totalSize"
          >
          </el-pagination>
        </div>
      </div>
    </div>

    <!-- 照片弹出框 -->
    <el-dialog title="巡点照片" :visible.sync="isShowImg" width="60%">
      <div style="display: flex; justify-content: center">
        <p
          v-for="(item, index) of imgUrls"
          :key="index"
          style="margin: 0px 10px; text-align: center"
        >
          <img :src="item.url" alt="" style="width: 360px; height: 480px" />
          <span style="width: 100%; display: inline-block; text-align: center">
            <span class="img_span_style">{{
              item.uploadType == 'album' ? '相册上传' : '手机拍摄'
            }}</span>
          </span>
        </p>
      </div>
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>

    <!-- 处理弹出框 -->
    <el-dialog
      :title="handleModalTitle"
      :visible.sync="isShowHandle"
      width="470px"
    >
      <div class="block">
        <span>处理日期：</span>
        <el-date-picker
          v-model="maintainForm.date"
          type="date"
          placeholder="请选择出现时间"
        >
        </el-date-picker>
      </div>
      <div class="remark">
        <span
          >{{
            handleModalTitle == '维修处理' ? '处理说明' : '媒体备注'
          }}：</span
        >
        <el-input
          type="textarea"
          v-model="maintainForm.reamrk"
          :autosize="{ minRows: 2, maxRows: 4 }"
          placeholder="请填处理说明"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowHandle = false">取 消</el-button>
        <el-button type="primary" @click="handleRemark()">确 定</el-button>
      </span>
    </el-dialog>
    <!--历史记录弹出框-->
    <el-dialog
      class="logList-wrap"
      title="历史记录"
      :visible.sync="isShowHistory"
      width="30%"
    >
      <div class="loglist_box">
        <div class="title">
          <p>{{ logList.resName }}</p>
          <p>{{ logList.mTitle }}（{{ logList.assetTag }}）<template v-if="logList.asLab">· {{logList.asLab}}面</template></p>
        </div>

        <log-list
          :list="logList.list"
          @toHandle="toHandle"
          v-if="!isSellList"
        ></log-list>

        <!-- 售卖/可售卖历史记录 -->
        <sell-list :list="logList.list" @toHandle="toHandle" v-else></sell-list>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowHistory = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "../../api/api.js";
// 时间控件格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
import pointState from './components/pointState.vue';
import noSearchResult from "./components/noSearchResult.vue";
import {
  Row,
  Input,
  Button,
  Table,
  TableColumn,
  DatePicker,
  Select,
  Option,
  Message,
} from "element-ui";
// 日志组件totalPage
import logList from './components/logList.vue'
import sellList from './components//sellList.vue'
import timeFormat from '../../commonFun/timeFormat.js';

export default {
  name: "customList",
  components: {
    logList,
    noSearchResult,
    pointState,
    elRow: Row,
    elInput: Input,
    elButton: Button,
    elTable: Table,
    elTableColumn: TableColumn,
    elDatePicker: DatePicker,
    elSelect: Select,
    elOption: Option,
    sellList
  },
  data () {
    return {
      // 公司列表
      companyArr: [],
      currPage: 1,
      pageSize: 10,
      totalSize: 0,
      // 登录信息
      sessionData: {},
      //加载中
      loading: false,
      // 状态 （-1-已删除，1-未处理,2-已处理）,
      stateArr: [
        {
          label: '已处理',
          value: 2,
        },
        {
          label: '未处理',
          value: 1
        }
      ],
      // 类型 1-巡点、2-待维修、3-拆除,
      typeArr: [
        {
          label: '巡点',
          value: 1,
        },
        // {
        //     label: '待维修',
        //     value: 2
        // },
        {
          label: '不可售卖',
          value: 4
        },

        {
          label: '拆除',
          value: 3
        },

        // {
        //   label: '维修',
        //   value: 5
        // }

      ],
      // 工程人员
      engineerArr: [],
      // 表格数据
      currentPlan: [],
      //所在区域
      areaArr: [],
      //处理对话框
      maintainForm: {
        date: '',
        reamrk: '',
      },
      // 是否滚动加载
      loading_point: true,
      isSearch: true,
      isReset: true,
      // 搜索信息
      searchInfo: {
        resName: '',
        assetTag: '',
        type: '',
        districtId: [],
        status: '',
        date: '',
        userId: '',
      },
      // 处理弹出框
      isShowHandle: false,
      handleModalTitle: '',
      //历史记录弹出框
      isShowHistory: false,
      remark: '',
      // 图片弹出框
      isShowImg: false,
      imgUrls: '',
      // 问题列表
      logList: {
        resName: '',
        mTitle: '',
        assetTag: '',
        list: [
          {
            id: 1,
            time: '',
            text: '',
            address: '',
            type: '',
          },
        ]
      },
      logsId: [],
      multipleSelection: '',//选中的表格数据
      customPermission: {},  //巡点权限

      isSellList: false
    };
  },
  mounted: function () {
    this.getRole();
    this.getCity();
    this.getComUser();
    this.searchFun();
  },
  methods: {
    //选择区域
    handleChange (value) {
      console.log(value);
    },
    // 状态转换
    stateToText (state) {
      let arr = [
        {
          text: '已处理',
          color: 'rgba(82,196,26,1)',
        },
        {
          text: '未处理',
          color: 'rgba(250,173,20,1)',
        },

      ];
      for (let data of arr) {
        if (data.text === state) {
          return data;
        }
      }
    },
    //表格方法
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange (val) {
      console.log(val)
      this.multipleSelection = val;
    },

    // 权限城市数据
    getCity () {
      let info = {
        "service": "GetCompanyCitiesAction",
        "token": this.sessionData.token,
        "uid": this.sessionData.uID
      };
      api.postApi_new(this.apiVar.Media, info).then(res => {
        // console.log(res.data);
        if (res.data.SysCode == 200200) {
          let result = [];
          for (let data of res.data.data) {
            let obj = {
              label: data.cityName,
              value: data.cityId,
              children: []
            };
            if (data.districtList) {
              for (let data2 of data.districtList) {
                let obj2 = {
                  label: data2.districtName,
                  value: data2.districtId,
                }
                obj.children.push(obj2)
              }
            }
            result.push(obj);
          }
          this.areaArr = result;
        } else {
          Message.warning(res.data.MSG);
        }
      }).catch(err => {
        console.log(err);
      });
    },

    // 获取公司人员
    getComUser () {
      let info = {
        "token": this.sessionData.token,
        "uid": this.sessionData.uID,
      };
      api.getApi(this.apiVar.UCAPI + '/GetSameCompanyUser', info).then(res => {
        console.log(res);
        if (res.data.SysCode == 200200) {
          let result = [];
          for (let data of res.data.data) {
            let obj = {
              label: data.realName,
              value: data.uID
            }
            result.push(obj);
          }
          this.engineerArr = result;
        } else {
          // Message.warning(res.data.MSG);
        }
      }).catch(err => {
        console.log(err);
      });
    },
    // 展示图片
    showPhoto (item) {
      console.log(item);
      this.imgUrls = JSON.parse(item.picUrl);
      this.isShowImg = true;
    },
    //历史记录
    showHistory (item) {
      console.log(item)

      this.isShowHistory = true
      if (item.mtType === '不可售卖') {
        console.log('111111')
        this.isSellList = true
        this.getSellList(item)
      } else {
        console.log('222222')
        this.isSellList = false
        this.getHistoryList(item)
      }

    },
    // 处理
    toHandle (item) {
      console.log(item);
      this.isShowHistory = false;
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        service: "GetUntreatedPatrolPoint",
        data: {
          mID: item.mID
        }
      };
      this.maintainForm = {
        date: '',
        reamrk: '',
        recordId: item.recordId
      }
      this.isShowHandle = true;
      this.handleModalTitle = item.mtType == '巡点' ? '巡点处理' : '维修处理'

    },
    // 确认处理
    handleRemark () {
      console.log(this.maintainForm.date);
      if (this.maintainForm.date == '' || this.maintainForm.date == null) {
        Message.warning('请填写处理日期')
      } else {
        let info = {
          uid: this.sessionData.uID,
          token: this.sessionData.token,
          service: "UpdateMediaMaintenanceAction",
          data: {
            "updateTime": timeFormat.toDate(this.maintainForm.date, '-'),
            "feedback": this.maintainForm.reamrk,
            "recordId": this.maintainForm.recordId,
          }
        };
        api.postApi_new(this.apiVar.Media, info).then(res => {
          console.log('处理', res.data);
          if (res.data.SysCode == 200200) {
            Message.success(res.data.MSG);
            this.searchFun();
            this.isShowHandle = false;
          } else if (res.data.SysCode == 200111) {
            Message.warning('请填写处理日期')
          } else {
            Message.success(res.data.MSG);
          }
        }).catch(err => {
          console.log(err);
        });
      }

    },
    // 判断角色是否有新建按钮(销售有)
    getRole () {
      this.sessionData = sessFun.getSess();
      this.customPermission = this.sessionData.customPermission;
    },
    // 搜索数据格式化
    searchFormat () {
      let session = this.sessionData;
      let info = {
        uid: session.uID,
        token: session.token,
        service: 'GetMediaMaintenanceListAction',
        data: {}
      };
      let { resName, assetTag, type, districtId, status, date, userId } = this.searchInfo;
      let data = {
        pageNum: this.currPage,
        pageSize: this.pageSize,
      };
      data = {
        ...data,
        ...(districtId && { cityId: districtId[0] }),
        ...(districtId.length > 1 && { districtId: districtId[1] }),
        ...(type && { type: type }),
        ...(assetTag && { assetTag: assetTag }),
        ...(resName && { resName: resName }),
        ...(status && { status: status }),
        ...(date && { startTime: timeFormat.toDate(date[0], '-'), endTime: timeFormat.toDate(date[1], '-') }),
        ...(userId && { userId: userId }),
      };
      info.data = data;
      return info;
    },
    searchFun () {
      let info = this.searchFormat();
      this.getData(info);
    },
    // 滚动加载获取数据(无搜索数据)
    getData (params) {
      api.postApi_new(this.apiVar.Media, params).then(res => {
        console.log(res.data);
        if (res.data.SysCode == 200200) {
          let dataInfo = res.data.data;
          this.totalSize = dataInfo.total;
          let dataArr = dataInfo.list;
          this.currentPlan = this.funcData(dataArr);
          if (dataInfo.total == 0) {
            Message.warning('暂无数据');
          }
        } else {
          this.totalSize = 0
          Message.warning(res.data.MSG);
        }
        this.loading = false;
      });
    },
    // 数据处理
    funcData (dataArr) {
      let result = [];
      for (let data of dataArr) {
        let tmpObj = '';
        tmpObj = this.setTableData(data);
        result.push(tmpObj);
      }
      return result;
    },
    // 搜索(优化)
    search () {
      let that = this
      this.isSearch = false;
      setTimeout(() => {
        that.isSearch = true;
      }, 1000);
      that.currentPlan = [];
      that.loading = true;
      that.loading_point = false;
      that.currPage = 1;
      that.searchFun()
    },
    // 分页
    changePage (val) {
      // console.log('当前页',val)
      this.currPage = val
      this.searchFun();
    },
    // 每页条数切换
    sizeChange (val) {
      this.pageSize = val;
      this.currPage = 1;
      this.searchFun();
    },
    // 设置表格数据
    setTableData (item) {
      /*
      *  mState: '已处理',
          mtType: '巡点',
          resName: '资源',
          cityName: '城市',
          area: '区域',
          mediaName: '媒体名称',
          assetTag: '资产编号',
          issueRecord: '问题记录',
      * */
      let obj = {
        id: item.id,
        mID: item.mID,
        mState: item.status == 1 ? '未处理' : '已处理',
        resName: item.resName,
        assetTag: item.assetTag,
        mediaName: item.mTitle,
        cityName: item.cityName,
        area: item.districtName,
        trafficState: item.trafficState || '--',
        electrifyState: item.electrifyState || '--',
        issueRecord: item.remark ? item.remark : '--',
        feedback: item.feedback ? item.feedback : '--',
        updateTime: item.updateTime ? item.updateTime : '---',
        createTime: item.createTime ? item.createTime : '---',
        createUserName: item.createUserName ? item.createUserName : '---',
        status: item.status,
        remark: item.remark,
        mTitle: item.mTitle,
        recordId: item.recordId,
        picUrl: item.picUrl,
        asLab: item.asLab
      };
      if (item.type == 1) {
        obj.mtType = '巡点'
      } else if (item.type == 2) {
        obj.mtType = '待维修'
      } else if (item.type == 3) {
        obj.mtType = '拆除'
      } else if (item.type == 4) {
        obj.mtType = '不可售卖'
        obj.issueRecord = JSON.parse(obj.issueRecord)
      }
      if (item.patrolPointPics && item.patrolPointPics.length) {
        let arr = [];
        for (let data of item.patrolPointPics) {
          let itemObj = {
            type: data.uploadType == 'camera' ? 1 : 2,
            url: data.url,
            address: data.uploadAddress
          };
          arr.push(itemObj);
        }
        obj.urls = arr;
      }
      return obj;
    },
    // 时间格式化
    formatTime (time) {
      return dateFormat.toDate(time);
    },
    // 导出
    downLoad () {
      let { resName, assetTag, type, districtId, status, date, userId } = this.searchInfo;
      let params = {
        ...(districtId && { cityId: districtId[0] }),
        ...(districtId.length > 1 && { districtId: districtId[1] }),
        ...(type && { type: type }),
        ...(assetTag && { assetTag: assetTag }),
        ...(resName && { resName: resName }),
        ...(status && { status: status }),
        ...(date && { startTime: timeFormat.toDate(date[0], '-'), endTime: timeFormat.toDate(date[1], '-') }),
        ...(userId && { userId: userId }),
      };
      if (this.sessionData.customPermission.patrolPermission) {
        params.isCustom = 1;
      }
      api.getApi_file('/mediaService/api/v2/exportRMList', params).then(res => {
        let blob = new Blob([res.data], { type: 'application/ms-download;charset=utf-8' });
        let downloadElement = document.createElement('a');
        let href = window.URL.createObjectURL(blob);    //创建下载的链接
        downloadElement.href = href;
        downloadElement.download = '维护记录-' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.xls'; //下载后文件名
        document.body.appendChild(downloadElement);
        downloadElement.click();                        //点击下载
        document.body.removeChild(downloadElement);     //下载完成移除元素
        window.URL.revokeObjectURL(href);               //释放掉blob对象
      });
    },
    // 重置
    reset () {
      this.searchInfo = {
        resName: '',
        assetTag: '',
        type: '',
        districtId: [],
        status: '',
        date: '',
        userId: '',
      };
      this.currPage = 1;
      console.log(this.searchInfo);
      this.currentPlan = [];
      this.isReset = false;
      let timer = setTimeout(() => {
        this.isReset = true;
        clearTimeout(timer);
      }, 1000);
      this.searchFun();
    },
    // 新建按钮
    newClient () {
      this.$router.push("./createClient");
    },
    // 查看按钮
    showDetail (data) {
      sessionStorage.setItem("customerId", data.uID);
      this.$router.push("./clientDetail");
    },

    // 媒体点位的售卖状态记录
    getSellList (item) {

      let info = {
        data: {
          recordId: item.recordId,
          pageNum: 1,
          pageSize: 80,
        },
        service: "GetMediaMaintainOperationLogAction",
        token: this.sessionData.token,
        uid: this.sessionData.uID
      };

      api.postApi_new(this.apiVar.Media, info).then(res => {
        if (res.data.SysCode == 200200) {
          const list = res.data.data.list.map(item => {
            console.log(item.remark, 'rmark')
            let rmark
            let rmarkCtx = JSON.parse(JSON.stringify(item.remark))
            if (rmarkCtx.indexOf('[') === -1) {
              rmark = [rmarkCtx]
            } else {
              rmark = JSON.parse(item.remark)
            }
            return {
              ...item,
              remark: Array.isArray(rmark) ? rmark : [rmark],
              sellState: item.operationType === 1 ? '不可售卖' : '可售卖'
            }
          }) || []
           let obj = {
            resName: item.resName,
            mTitle: item.mTitle,
            assetTag: item.assetTag,
            asLab: item.asLab,
            list
          };
          this.logList = obj 
        } else {
          Message.warning(res.data.MSG);
        }
      }).catch(err => {
        console.log(err);
      });

    },

    // 获取历史记录
    getHistoryList (item) {
      console.log(item, 'itememem')
      let info = {
        "data": {
          mID: item.mID,
          pageNum: 1,
          pageSize: 80,
        },
        "service": "GetMediaMaintenanceHistoryListAction",
        "token": this.sessionData.token,
        "uid": this.sessionData.uID
      };

      api.postApi_new(this.apiVar.Media, info).then(res => {
        console.log('历史记录', res.data);
        if (res.data.SysCode == 200200) {
          let obj = {
            resName: item.resName,
            mTitle: item.mTitle,
            assetTag: item.assetTag,
            asLab: item.asLab,
            list: []
          };
          for (let data of res.data.data.list) {
            let a = {
              time: data.createTime,
              text: data.remark,
              address: data.resAddress,
              recordId: data.recordId,
              mID: data.mID,
            };
            if (data.type == 1) {
              a.type = '巡点'
            } else if (data.type == 2) {
              a.type = '待维修'
            } else if (data.type == 3) {
              a.type = '拆除'
            }

            obj.list.push(a);
          }
          this.logList = obj;
          console.log(this.logList);
        } else {
          Message.warning(res.data.MSG);
        }
      }).catch(err => {
        console.log(err);
      });

    }
  }
};
</script>

<style scoped lang="scss">
.table_wrap {
  margin: 24px 32px;
}

/deep/ .mediaList_container .el-row {
  margin-bottom: 15px;
  display: flex;
}

/deep/ .mediaList_container .el-col > span {
  font-size: 14px;
  min-width: 65px;
  color: rgba(0, 0, 0, 0.85);
}

/deep/ .mediaList_container .el-input__icon.el-icon-arrow-down.is-reverse {
  line-height: 34px;
}

/deep/ .mediaList_container .el-col .el-cascader {
  width: 100%;
}

/deep/ .el-select {
  width: 100%;
}

/deep/ .el-col .el-date-editor .el-range__close-icon {
  line-height: 27px;
}

.table_dt dl dt {
  font-size: 14px;
}

.table_dt dl dd {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.45);
}

/deep/ .table_dt .el-table__row .cell span {
  overflow: hidden;
}

/deep/ .mediaList_container .el-input,
/deep/ .mediaList_container .el-input__inner {
  height: 32px;
}

/deep/ .mediaList_container .el-col-6 {
  display: flex;
  align-items: center;
  margin-right: 24px;
}

/deep/ .mediaList_container .el-date-editor .el-range-separator,
/deep/ .mediaList_container .el-date-editor .el-range__icon {
  line-height: 26px;
}

.red {
  background-color: #ff6e6e;
}

.green {
  background-color: #52c41a;
}

.mediaList_container .el-row .span_style {
  border-radius: 12px;
  color: #fff;
  width: 54px;
  display: inline-block;
  text-align: center;
  font-size: 12px;
}

.span_a {
  color: #1890ff;
  cursor: pointer;
}

.img_span_style {
  border-radius: 12px;
  color: #fff;
  width: 130px;
  display: inline-block;
  text-align: center;
  font-size: 12px;
  background: #979797;
}

.loglist_box .title {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 500;
  margin-bottom: 16px;
}

.loglist_box .title p:last-child {
  font-size: 14px;
  margin-top: 2px;
}

/deep/ .logList-wrap .el-dialog__body {
  padding: 16px 24px 30px;
}

/deep/ .logList-wrap .el-dialog__title {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  font-size: 16px;
}

.point_style {
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/deep/ .el-dropdown-link {
  cursor: pointer;
  color: #108ee9;
}

.block,
.remark {
  display: flex;
  align-items: center;
}

.remark {
  margin-top: 16px;
}

/deep/ .block .el-date-editor.el-input__inner,
/deep/ .block .el-input--prefix .el-input__inner {
  height: 32px;
  width: 350px;
}

/deep/ .block .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 350px;
}

/deep/ .block .el-input__icon {
  line-height: 32px;
}

/deep/ .remark .el-textarea__inner {
  width: 350px;
  height: 74px;
  resize: none;
}

/deep/ .el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 100%;
  height: 32px;
  padding-right: 0;
}

/deep/ .remark .el-textarea {
  width: 350px;
}

/deep/ .ad_mediaDetail_wrap .el-date-editor .el-range__icon {
  position: relative;
  top: -3px;
}

/deep/ .ad_mediaDetail_wrap .el-date-editor .el-range-separator {
  line-height: 25px;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
  overflow-y: hidden;
  overflow-x: scroll;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
  height: 8px;
  background: #fafafa;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #c1c1c1;
  border-radius: 4px;
}

/deep/ .el-dialog__body {
  padding-bottom: 6px !important;
}
/deep/ .el-dialog__footer {
  padding: 10px 24px 24px;
} 
</style>
