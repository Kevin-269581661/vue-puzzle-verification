<template>
  <div class="ad_mediaDetail_wrap clearfix">
    <div class="ad_mediaDetail_nav">
      <p class="clearfix">
        <a href="#" style="color: #999">公司管理</a>
      </p>
    </div>
    <div class="mediaList_wrap">
      <div class="mediaList_head">
        <h2>公司列表</h2>
      </div>
      <div class="mediaList_container">
        <el-row :gutter="32">
          <el-col class="name_row">
            <span>公司名称:</span>
            <el-input
              v-model="searchInfo.keyword"
              placeholder="请输入"
              size="small"
            ></el-input>
          </el-col>
          <el-col>
            <span>公司类型:</span>
            <el-select
              v-model="searchInfo.type"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item of typeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col>
            <span>状态:</span>
            <el-select
              v-model="searchInfo.state"
              placeholder="请选择"
              size="small"
            >
              <el-option
                v-for="item of stateArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="search()"
              :disabled="!isSearch"
              >查询</el-button
            >
            <el-button plain @click="reset()">重置</el-button>
            <el-button plain @click="newCom()" v-if="showNewBtn"
              >新建</el-button
            >
          </el-col>
        </el-row>
        <div class="table_wrap">
          <el-table
            border
            :data="companyList"
            @sort-change="sortChange"
            v-loading="loading"
            element-loading-text="玩命加载中.."
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column label="公司名称" min-width="11.8%" prop="name">
            </el-table-column>
            <el-table-column prop="type" label="公司类型" min-width="8.1%">
              <template slot-scope="scope">
                <span>{{ roleToText(scope.row.type) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建日期"
              min-width="9.8%"
              sortable="custom"
            >
              <template slot-scope="scope">
                <span>{{ formatTime(scope.row.createTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="state" label="状态" min-width="8.9%">
              <template slot-scope="scope">
                <point-state
                  :state-text="stateToText(scope.row.state).label"
                  :color="stateToText(scope.row.state).color"
                ></point-state>
              </template>
            </el-table-column>
            <el-table-column label="操作" min-width="7.1%">
              <template slot-scope="scope">
                <span
                  v-if="scope.row.state == 1"
                  style="color: #108ee9; cursor: pointer"
                  @click="isForbidden(scope.row)"
                  >禁用</span
                >
                <span
                  v-if="scope.row.state == 0"
                  style="color: #108ee9; cursor: pointer"
                  @click="isForbidden(scope.row)"
                  >开通</span
                >
                <span
                  style="color: #108ee9; cursor: pointer; margin-left: 10px"
                  @click="isEdit(scope.row)"
                  >编辑</span
                >
                <span
                  style="color: #108ee9; cursor: pointer; margin-left: 10px"
                  @click="isPatrolPoint(scope.row)"
                  >巡点配置</span
                >
              </template>
            </el-table-column>

            <div slot="empty">
              <no-search-result></no-search-result>
            </div>
          </el-table>

          <div class="ad_pagination">
            <el-pagination
              background
              v-if="paginationShow"
              @size-change="sizeChange"
              @current-change="changePage"
              :current-page.sync="currPage"
              :page-sizes="pageSizes"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalNum"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑弹出框 -->
    <el-dialog
      :title="isAdd ? '新建公司' : '编辑公司'"
      :visible.sync="isShowNew"
      width="550px"
      class="company-dialog"
      @close="resetPermissions"
    >
      <p class="conpany-form-item">
        <span class="conpany-form__label">公司名称：</span>
        <el-input
          v-model.trim="companyInfo.keyword"
          placeholder="请输入"
          size="small"
        ></el-input>
      </p>
      <p class="conpany-form-item">
        <span class="conpany-form__label">公司类型：</span>
        <el-select
          v-model="companyInfo.type"
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item of typeArr"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <p class="conpany-form-item">
        <span class="conpany-form__label">媒体类型：</span>
        <el-select
          v-model="companyInfo.mediaTypeIds"
          multiple
          collapse-tags
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item of mediaTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </p>
      <p class="conpany-form-item">
        <span class="conpany-form__label">公司属性：</span>
        <el-select
          v-model="companyInfo.systemEnableStatus"
          collapse-tags
          placeholder="系统开通状态"
          size="small"
        >
          <el-option
            v-for="item of systemEnableOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <p class="conpany-form-item">
        <span class="conpany-form__label">全国单拆单：</span>
        <el-select
          v-model="companyInfo.acceptSpiltOrderStatus"
          collapse-tags
          placeholder="请选择"
          size="small"
        >
          <el-option
            v-for="item of splitOrderOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </p>
      <p class="conpany-form-item" v-if="permissionsData.length > 0">
        <template style="display:flex">
          <span class="conpany-form__label" style="padding-right:30px;white-space:nowrap">权限选择：</span>
          <el-checkbox-group v-model="permissions">
            <el-checkbox v-for="item in permissionsData" :key="item.permissionCode" :label="item.permissionId">{{item.permissionName}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="isShowNew = false">取 消</el-button>
        <el-button type="primary" @click="handleCompany()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 巡点配置弹出框 -->
    <patrolPointDialog ref="patrolPointRef" @submitSuccess="searchFun"/>
  </div>
</template>

<script>
import { MessageBox, Message } from "element-ui";
// 时间控件格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
import api from "../../api/api.js";
import noSearchResult from "./components/noSearchResult.vue";
import pointState from "./components/pointState.vue";
import patrolPointDialog from './components/meadiaList/patrolPointDialog.vue'

export default {
  components: {
    noSearchResult,
    pointState,
    patrolPointDialog
  },
  data() {
    return {
      // 分页信息
      paginationShow: true,
      pageSize: 10,
      pageSizes: [10, 20, 50],
      currPage: 1,
      totalPage: 0,
      totalNum: 0,
      // 登录信息
      sessionData: {},
      // 搜索数据
      searchInfo: {
        keyword: "",
        type: "",
        state: "",
        // 按照啥排序
        orderby: "",
        // 升序降序0/1
        desc: "",
      },
      isSearch: true,
      // 状态
      stateArr: [
        {
          label: "正常",
          value: 1,
          color: "rgba(82,196,26,1)",
        },
        {
          label: "禁用",
          value: -1,
          color: "rgba(245,34,45,1)",
        },
      ],
      // 公司类型
      typeArr: [
        // {
        //   label: "平台商",
        //   value: 0,
        // },
        {
          label: "媒体主",
          value: 1,
        },
      ],
      // 所有媒体类型
      mediaTypes: [],
      // 系统是否开通
      systemEnableOptions: [
        {
          label: '已开通',
          value: true
        },
        {
          label: '未开通',
          value: false
        }
      ],
      splitOrderOptions: [
        {
            label: '不可拆单',
            value: false
        },
        {
            label: '可拆单',
            value: true
        }
      ],
      // 表格数据
      companyList: [],
      // 新增公司信息
      companyInfo: {
        keyword: "",
        type: 1,
        mediaTypeIds: [],
        systemEnableStatus: '',
        acceptSpiltOrderStatus: false
      },
      isShowNew: false,
      // 是否可新建公司
      showNewBtn: false,
      // 编辑或新建
      isAdd: false,
      loading: true,
      permissionsData: [],
      permissions:[],
      companyId: null 
    };
  },
  methods: {
    // 切换页码
    changePage(page) {
      this.currPage = page;
      console.log("page----", page);
      this.searchFun();
    },
    // 每页条数切换
    sizeChange(val) {
      this.pageSize = val;
      this.currPage = 1;
      this.searchFun();
    },
    resetPermissions() {
      this.permissions = []
    },
    // 判断角色是否有新建按钮(系统管理员和超级管理员有)
    getRole() {
      this.sessionData = sessFun.getSess();
      let role = this.sessionData.ascType;
      console.log(role);
      if (role == 0) {
        this.showNewBtn = true;
      }
    },
    // 获取所有媒体类型
    getMediaTypes() {
      api
        .getApi("/addsp/api/v1/mediaTypes")
        .then((res) => {
          if (res.data.SysCode === 200200) {
            console.log("获取所有媒体类型", res.data);
            this.mediaTypes = res.data.data || [];
          } else {
            Message.warning(res.data.MSG || "媒体类型获取失败！");
          }
        });
    },
    searchFun() {
      this.paginationShow = false;
      this.loading = true;
      let info = this.searchFormat();
      this.getData(info);
      this.$nextTick(function () {
        this.paginationShow = true;
      });
    },
    // 滚动获取列表数据
    getData(params) {
      api.getApi(this.apiVar.UCAPI + "/AscrList", params).then((res) => {
        console.log(res.data);
        if (!res.data.SysCode) {
          let dataInfo = res.data;
          this.totalNum = dataInfo.count;
          let dataArr = dataInfo.data || [];
          this.companyList = dataArr.map(item => {
            return {
              asrID: item.asrID || "",
              name: item.asName || "",
              state: item.ascState || "",
              type: item.ascType >= 0 ? item.ascType : "",
              mediaTypeList: item.mediaTypeList || [],
              createTime: item.createTime || "",
              openStatus: item.openStatus,
              acceptSpiltOrderStatus: item.acceptSpiltOrderStatus,
            }
          })
          this.loading = false;
          if (dataInfo.totalpage == 0) {
            Message.warning("暂无数据");
          }
        } else {
          Message.warning(res.data.MSG);
        }
      });
    },
    // 搜索数据格式化
    searchFormat() {
      let info = {
        uid: this.sessionData.uID,
        token: this.sessionData.token,
        start: this.currPage,
        pagesize: this.pageSize,
      };
      let { keyword, type, state, orderby, desc } = this.searchInfo;
      info = {
        ...info,
        ...(keyword && { ascName: keyword }),
        ...(state && { astate: state }),
        ...(type >= 0 && { asType: type }),
        ...(orderby && { orderby }),
        ...(desc !== "" && desc >= 0 && { desc }),
      };
      return info;
    },
    // 设置表格数据
    setTableData(item) {
      let obj = {
        asrID: item.asrID || "",
        name: item.asName || "",
        state: item.ascState ? item.ascState : "",
        type: item.ascType >= 0 ? item.ascType : "",
        createTime: item.createTime || "",
        openStatus: item.openStatus
      };
      return obj;
    },
    // 搜索
    search() {
      let { keyword, type, state } = this.searchInfo;
      this.isSearch = false;
      let timer = setTimeout(() => {
        this.isSearch = true;
        clearTimeout(timer);
      }, 1000);
      if (keyword || type !== "" || state !== "") {
        this.companyList = [];
        this.loading = true;
        this.currPage = 1;
        this.searchFun();
      } else {
        Message.warning("请输入搜索条件");
      }
    },
    // 重置
    reset() {
      this.searchInfo = {
        keyword: "",
        type: "",
        state: "",
      };
      this.currPage = 1;
      this.companyList = [];
      this.permissions = []
      this.searchFun();
    },
    // 新建
    newCom() {
      this.companyInfo = {
        keyword: "",
        type: 1,
        mediaTypeIds: [],
        systemEnableStatus: '',
        acceptSpiltOrderStatus: false,
      };
      this.isAdd = true;
      this.getCompanyPerssion()
      
    },
    //获取公司权限
    getCompanyPerssion() {
      let params = {
        companyId:this.companyId
      }
      api.getApi('/addsp/api/v1/company/getPermissions', params)
        .then(res => {
          // console.log(res.data.data)
          this.permissionsData = res.data.data
          res.data.data.forEach(item => {
            if (item.status === 1) {
              if (this.permissions.indexOf(item.permissionId) === -1) {
                this.permissions.push(item.permissionId)  
              }
            }
          })
          this.isShowNew = true;
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 确认修改或新增
    handleCompany() {
      // 新增
      if (this.companyInfo.keyword) {
        if (this.isAdd) {
          let { keyword, type, mediaTypeIds, systemEnableStatus, acceptSpiltOrderStatus } = this.companyInfo;
          let info = {
            name: keyword,
            type,
            mediaTypeIds,
            openStatus:systemEnableStatus,
            acceptSpiltOrderStatus,
            permissions: this.permissions
          };
          api
            .postApi_json(
              "/addsp/api/v1/company/create",
              info
            )
            .then((res) => {
              if (res.data.SysCode == 200200) {
                Message.success(res.data.MSG);
                this.isShowNew = false;
                this.reset();
              } else {
                Message.warning(res.data.MSG);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          // 编辑
          let { keyword, type, asrID, mediaTypeIds, systemEnableStatus, acceptSpiltOrderStatus } = this.companyInfo;
          let info = {
            id: asrID * 1,
            name: keyword,
            type,
            mediaTypeIds,
            openStatus:systemEnableStatus,
            acceptSpiltOrderStatus,
            permissions: this.permissions
          };
          api
            .postApi_json(
              "/addsp/api/v1/company/update",
              info
            )
            .then((res) => {
              if (res.data.SysCode == 200200) {
                Message.success(res.data.MSG);
                this.isShowNew = false;
                this.searchFun();
                this.permissions = []
              } else {
                Message.warning(res.data.MSG);
              }
            })
            .catch((err) => {
              console.log(err);
            });
        }
      } else {
        Message.warning("公司名称不能为空");
      }
    },
    // 时间排序(请求后台接口进行排序)
    sortChange(column) {
      console.log("columm---", column);
      if (column.order == "ascending") {
        this.searchInfo.orderby = column.prop;
        this.searchInfo.desc = 0;
      } else if (column.order == "descending") {
        this.searchInfo.orderby = column.prop;
        this.searchInfo.desc = 1;
      }
      this.currPage = 1;
      this.searchFun();
    },
    // 时间格式化
    formatTime(time) {
      return dateFormat.toDate(time, "/");
    },
    // 角色格式化
    roleToText(type) {
      for (let data of this.typeArr) {
        if (data.value == type) {
          return data.label;
        }
      }
    },
    // 状态转换
    stateToText(state) {
      for (let data of this.stateArr) {
        if (data.value == state) {
          return data;
        }
      }
    },
    // 开通或者禁用：
    isForbidden(row) {
      console.log(row);
      MessageBox.confirm(
        `是否${row.state == 1 ? "禁用" : "开通"}该公司?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let info = {
            uid: this.sessionData.uID,
            token: this.sessionData.token,
            asrID: row.asrID,
            ascState: row.state == 1 ? -1 : 1,
          };
          console.log("info----", row.state, info);
          api
            .postApi(this.apiVar.UCAPI + "/UpdateAscState", info)
            .then((res) => {
              console.log(res.data);
              if (res.data.SysCode == 100200) {
                Message.success("操作成功");
                row.state = row.state == 1 ? -1 : 1;
              } else {
                Message.warning(res.data.MSG);
              }
            })
            .catch((res) => {
              console.log(res);
            });
        })
        .catch(() => {
          Message.info("已取消操作");
        });
    },
    // 编辑
    isEdit(row) {
      console.log('mediaTypeIds--', row)
      this.isShowNew = true;
      this.isAdd = false;
      this.companyId =row.asrID
      this.companyInfo = {
        keyword: row.name,
        type: row.type - 0,
        asrID: row.asrID,
        mediaTypeIds: row.mediaTypeList.map(item => item.mediaTypeId),
        systemEnableStatus: row.openStatus,
        acceptSpiltOrderStatus: row.acceptSpiltOrderStatus
      };
      this.getCompanyPerssion()
    },
    // 巡点配置
    isPatrolPoint(row) {
      // console.log('mediaTypeIds--', row)
      this.$refs.patrolPointRef.open(row)
    },
  },
  mounted() {
    this.getRole();
    this.searchFun();
    this.getMediaTypes();
  },
};
</script>
<style scoped lang="scss">
a {
  color: #108ee9;
}
/deep/.el-row span {
  font-size: 14px;
}
/deep/.el-col-24 {
  width: auto;
}
/deep/.el-col-24:not(:last-child) {
  min-width: 25%;
}
/deep/.el-row .el-select {
  width: calc(98% - 60px);
}
/deep/.name_row .el-input {
  width: calc(98% - 60px);
}
.company-dialog {
  /deep/ .el-dialog__body {
    padding-top: 14px;
    padding-bottom: 14px;
  }
}
.conpany-form-item {
  display: flex;
  flex-flow: row nowrap;
  .el-select {
    width: 100%;
  }
  .conpany-form__label {
    white-space: nowrap;
    line-height: 32px;
    width: 120px;
  }
  & + .conpany-form-item {
    margin-top: 20px;
  }
}
</style>


