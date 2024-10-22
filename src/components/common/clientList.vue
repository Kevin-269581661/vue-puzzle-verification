<template>
	<div class="ad_mediaDetail_wrap clearfix">
		<div class="ad_mediaDetail_nav ">
			<p class="clearfix">
				<a href="#" style="color: #999">客户管理</a>
			</p>
		</div>
		<div class="mediaList_wrap">
			<div class="mediaList_head">
				<h2>客户列表</h2>
                <a class="nav-text" href="https://apps.qinlinad.com/crm.html" target="_blank">如何更高效化的管理您的客户？</a>
			</div>
			<div class="mediaList_container">
                <div class="flex_box">
                    <el-input placeholder="请输入内容" v-model="searchInfo.keyword" size="small" class="marginR">
                        <el-select v-model="searchInfo.select" slot="prepend" placeholder="请选择">
                            <el-option label="公司品牌" value="1"></el-option>
                            <el-option label="公司名称" value="2"></el-option>
                            <el-option label="联系人" value="3"></el-option>
                        </el-select>
                    </el-input>
                    <el-date-picker size="small" class="marginR" v-model="searchInfo.date" type="daterange" range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="创建日期" end-placeholder="创建日期">
                    </el-date-picker>
                    <el-select v-model="searchInfo.company" placeholder="请选择公司" size="small" v-if="!['ADN_BD_KA', 'ADN_BD'].includes(sessionData.uType)" class="marginR">
                        <el-option v-for="item of companyArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                    <el-button type="primary" icon="el-icon-search" @click="search()"
                               :disabled="!isSearch" class="marginR" >搜索</el-button>
                    <el-button plain @click="reset()" :disabled="!isReset" class="marginR" >重置</el-button>
                    <el-button plain @click="newClient()" v-if="showNewBtn" class="marginR" >新建</el-button>
                </div>
				<div class="table_wrap">
					<!-- <el-table border :data="currentPlan" @sort-change="sortChange" v-loading="loading" element-loading-text="玩命加载中..." element-loading-spinner="el-icon-loading" style="width: 100%" :default-sort="{prop: 'joinTime', order: 'descending'}"> -->
					<el-table border :data="currentPlan" @sort-change="sortChange" v-loading="loading" element-loading-text="玩命加载中..." element-loading-spinner="el-icon-loading" style="width: 100%">
						<el-table-column prop="realName" label="联系人" min-width="6%" show-overflow-tooltip>
						</el-table-column>
						<!--<el-table-column prop="clientRName" label="所在地" min-width="7.2%">-->
						<!--</el-table-column>-->
						<el-table-column prop="position" label="职位" min-width="7.2%" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="phone" label="手机号码" min-width="9.5%">
						</el-table-column>
						<el-table-column prop="cName" label="公司名称" min-width="18.4%" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="rName" label="所在城市" min-width="8%">
						</el-table-column>
						<el-table-column prop="cBrand" label="公司品牌" min-width="12.1%" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="puName" label="所有人" min-width="6.1%" show-overflow-tooltip  :filters="filterRealName" :filter-method="filterRealNameFun" :filter-multiple="true">
						</el-table-column>
						<el-table-column prop="joinTime" label="创建日期" min-width="8.3%" sortable="custom">
							<template slot-scope="scope">
								<span>{{ formatTime(scope.row.joinTime) }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" min-width="4.1%">
							<template slot-scope="scope">
								<a href="javascript:void(0)" @click="showDetail(scope.row)" style="color: #108EE9"
                                   >查看</a>
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
                            :total="totalNum">
                        </el-pagination>
                    </div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import api from "../../api/api.js";
// 时间控件格式化
import dateFormat from "../../commonFun/timeFormat.js";
import sessFun from "../../commonFun/sessFun.js";
import noSearchResult from "./components/noSearchResult.vue";
// 筛选过滤
import filterFormat from "../../commonFun/filterTableData.js";
import {
    Row,
    Input,
    Button,
    Table,
    TableColumn,
    DatePicker,
    Select,
    Option,
    Message
} from "element-ui";

export default {
    name: "customList",
    components: {
        noSearchResult,
        elRow: Row,
        elInput: Input,
        elButton: Button,
        elTable: Table,
        elTableColumn: TableColumn,
        elDatePicker: DatePicker,
        elSelect: Select,
        elOption: Option,
    },
    data() {
        return {
            // 公司列表
            companyArr: [],
            // 分页信息
            paginationShow: true,
            pageSize: 10,
            pageSizes: [10, 20, 50],
            currPage: 1,
            totalPage: 0,
            totalNum: 0,
            // 登录信息
            sessionData:{},
            //加载中
            loading: true,
            showNewBtn: true,
            searchInfo: {
                select: '1',
                keyword: '',
                date: '',
                company: '',
                // 按照啥排序
                orderby: '',
                // 升序降序0/1
                desc: "",
            },
            // 表格数据
            currentPlan: [],
            isSearch: true,
            isReset: true,
            //过滤所有人
            filterRealName: [],
            isPay: 0
        };
    },
    mounted: function() {
      this.sessionData = sessFun.getSess();
      this.requestIsPay();
      if(!['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType)){
          this.getCompany();
      }else{
          this.getSubSaleList()
      }
      this.searchFun();

    },
    methods: {
        //获取下级销售列表
        getSubSaleList() {
            api.getApi(this.apiVar.Advertisement + '/GetSubSaleList').then(res => {
                console.log(res.data);
                if (res.data.SysCode == 200200) {
                    this.filterRealName = filterFormat(res.data.data, "realName",'uID');

                } else {
                    this.messageFun('warning', res.data.MSG);
                }
            });
        },
        filterRealNameFun(value, row) {
            // console.log(row, value);
            return row.puName === value;
        },
        // 切换页码
        changePage(page) {
            this.currPage = page;
            console.log('page----', page);
            this.searchFun();
        },
        // 每页条数切换
        sizeChange(val) {
            this.pageSize = val;
            this.currPage = 1;
            this.searchFun();
        },
        // 获取公司
        getCompany(){
            let sess = this.sessionData;
            let info = {
                uid: sess.uID,
                token: sess.token,
            };
            api.getApi(this.apiVar.UCAPI + '/GetDirectAscr', info).then(res =>{
                console.log(res);
                if(!res.data.SysCode){
                    let result = [];
                    for(let data of res.data){
                        let obj = {
                            label: data.asName,
                            value: data.asrID,
                        };
                        result.push(obj);
                    }
                    this.companyArr = result;
                } else if(res.data.SysCode == 100403) {
                    console.error('获取公司', res.data.MSG)
                } else{
                    Message.warning(res.data.MSG);
                }
            }).catch(err =>{
                console.log(err);
            });
        },

        requestIsPay() {
          api.getApi('/addsp/api/v1/company/isPay', {
              asrID: this.sessionData.asrID
          }).then(res => {
              if (res.data.SysCode === 200200 && res.data.data === true) {
                this.isPay = 1;
              }
              this.getRole()
          })
        },

        // 判断角色是否有新建按钮(销售有)
        getRole() {
            if (!['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType)) {
                this.showNewBtn = false;
            }
            // 判断KA销售权限+数字化公司，隐藏新建功能和编辑功能
            if (['ADN_BD_KA', 'ADN_BD'].includes(this.sessionData.uType) && this.isPay) {
              this.showNewBtn = false
            }
        },
        // 搜索数据格式化
        searchFormat(){
            console.log('currpage--', this.currPage);
            let session = this.sessionData;
            let info = {
                uid: session.uID,
                token: session.token,
                pageNo: this.currPage,
                pageSize: this.pageSize
            };
            let { date, select, keyword, company, orderby, desc } = this.searchInfo;
            info = {
                ...info,
                ...(date && {beginTime: date[0], endTime: date[1]+' 23:59:59'}),
                ...(keyword && (select=='1' && {brandName: keyword}) || (select=='2' && {companyName: keyword}) || (select=='3' && {contactName: keyword})),
                ...(company && { asrID: company}),
                ...(orderby && {orderby}),
                ...(desc!=='' && desc>=0 &&{desc})
            };
            return info;
        },
        searchFun(){
            this.paginationShow = false;
            this.loading = true;
            let info = this.searchFormat();
            this.getData(info);
            this.$nextTick(function () {
                this.paginationShow = true;
            });
        },
        // 滚动加载获取数据(无搜索数据)
        getData(params){
            api.getApi(this.apiVar.Advertisement+'/GetCustomer', params).then(res =>{
                console.log(res.data);
                if(!res.data.SysCode){
                    let dataInfo = res.data.page;
                    this.totalNum = dataInfo.total;
                    let dataArr = dataInfo.list;
                    this.currentPlan = this.funcData(dataArr);
                    this.loading = false;
                    if (dataInfo.totalSize == 0) {
                        this.$Message.warning('暂无数据');
                    }
                    if(dataInfo.totalPage == 0){
                        Message.warning('暂无数据');
                    }
                }else{
                    Message.warning(res.data.MSG);
                }
            });
        },
        // 数据处理
        funcData(dataArr){
            let result = [];
            for(let data of dataArr){
                let tmpObj = '';
                tmpObj = this.setTableData(data);
                result.push(tmpObj);
            }
            return result;
        },
        // 搜索(优化)
        search(){
            let { date, select, keyword, company } = this.searchInfo;
            this.isSearch = false;
            let timer = setTimeout(()=>{
                this.isSearch = true;
                clearTimeout(timer);
            }, 1000);
            if(date || keyword || company){
                this.currentPlan = [];
                this.loading = true;
                this.currPage = 1;
                this.searchFun()
            }else{
                this.$message.warning('请输入搜索条件');
            }
        },
        // 设置表格数据
        setTableData(item){
            let obj = {
                cBrand: item.cBrand || '--',
                cID: item.cID || '',
                cName: item.cName || '--',
                crID: item.crID || '',
                iID: item.iID || '',
                joinTime: item.joinTime || '',
                phone: item.phone || '',
                position: item.position || '--',
                puName: item.puName || '--',
                rID: item.rID || '',
                rName: item.rName || '--',
                realName: item.realName || '',
                sName: item.sName || '',
                uID: item.uID || '',
                cAddress: item.cAddress || '',
                cRemark: item.cRemark || ''
            };
            return obj;
        },
        // 时间格式化
        formatTime(time) {
            return dateFormat.toDate(time, '/');
        },
        // 重置
        reset(){
            this.searchInfo = {
                select: '1',
                keyword: '',
                date: '',
                company: '',
            };
            this.currPage = 1;
            this.currentPlan = [];
            this.isReset = false;
            let timer = setTimeout(()=>{
                this.isReset = true;
                clearTimeout(timer);
            }, 1000);
            this.searchFun();
        },
        // 新建按钮
        newClient() {
            this.$router.push("./createClient");
        },
        // 查看按钮
        showDetail(data) {
            sessionStorage.setItem("customerId", data.uID);
            this.$router.push("./clientDetail");
        },
        // 时间排序(请求后台接口进行排序)
        sortChange(column){
            console.log('columm---', column);
            if(column.order == "ascending"){
                this.searchInfo.orderby = column.prop;
                this.searchInfo.desc = 0;
            }else if(column.order == "descending"){
                this.searchInfo.orderby = column.prop;
                this.searchInfo.desc = 1;
            }
            this.currPage = 1;
            this.searchFun();
        },
    }
};
</script>

<style scoped>
/*筛选*/
.el-checkbox + .el-checkbox {
    margin-left: 0;
}
.flex_box{
    display: flex;
    flex-wrap: wrap;
}
.marginR{
    margin-right: 6px;
}
.el-button+.el-button{
    margin-left: 0;
}
.typeBox p {
    height: 30px;
    font-size: 12px;
    text-align: center;
    line-height: 30px;
    border-top: 1px solid #cccccc;
}

/deep/ .el-checkbox__label {
    font-size: 10px;
    color: #8a8a8a;
}

/*日期控件*/
.block {
    display: inline-block;
    margin-left: 2px;
    position: relative;
}

/deep/ .el-range-separator {
    position: relative;
    top: -3px;
}

/* /deep/ .el-input__inner {
    width: 260px;
} */

/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
    float: left;
    position: relative;
}

.el-input {
    width: 240px;
    border-radius: 4px;
}

/*下拉搜索框*/
/deep/ .el-input-group__prepend {
    width: 64px;
    background-color: #fff;
}

/deep/ .el-input-group--prepend .el-select .el-input__inner {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;

    width: 104px;
}

/deep/ .el-input-group--prepend .el-input__inner {
    width: 185px;
}

.mediaList_head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.mediaList_head .nav-text{
    margin-right: 16px;
    font-size: 14px;
    color: #1890FF;
    line-height: 20px;
    cursor: pointer;
}
</style>
