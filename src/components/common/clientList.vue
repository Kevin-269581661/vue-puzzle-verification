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
			</div>
			<div class="mediaList_container">
				<el-row>
					<div class="mediaList_handel">
						<span>
							<div style="display:inline-block">
								<el-input placeholder="请输入内容" v-model="searchInfo.keyword" class="input-with-select" size="small">
									<el-select v-model="searchInfo.select" slot="prepend" placeholder="请选择">
										<el-option label="公司品牌" value="1"></el-option>
										<el-option label="公司名称" value="2"></el-option>
										<el-option label="联系人" value="3"></el-option>
									</el-select>
								</el-input>
							</div>
						</span>
						<span>
							<div class="block">
								<el-date-picker class="input-with-select" size="small" v-model="searchInfo.date" type="daterange" range-separator="-" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="创建日期" end-placeholder="创建日期">
								</el-date-picker>
							</div>
						</span>
                        <span v-if="sessionData.uType !='BD'">
							<div class="block">
                                <el-select v-model="searchInfo.company" placeholder="请选择公司" size="small">
                                    <el-option v-for="item of companyArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
							</div>
						</span>
						<span>
							<el-button type="primary" icon="el-icon-search" @click="search()" :disabled="!isSearch">搜索</el-button>
						</span>
                        <span>
							<el-button plain @click="reset()" :disabled="!isReset">重置</el-button>
						</span>
						<span>
							<el-button plain @click="newClient()" v-if="showNewBtn">新建</el-button>
						</span>
					</div>
				</el-row>
				<div class="table_wrap">
					<el-table border :data="currentPlan" v-loading="loading" v-loadmore="userLoadMore" element-loading-text="玩命加载中..." element-loading-spinner="el-icon-loading" style="width: 100%" :default-sort="{prop: 'joinTime', order: 'descending'}">
						<el-table-column prop="realName" label="联系人" min-width="6%" show-overflow-tooltip>
						</el-table-column>
						<!--<el-table-column prop="clientRName" label="所在地" min-width="7.2%">-->
						<!--</el-table-column>-->
						<el-table-column prop="position" label="职位" class="tar" min-width="7.2%" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="phone" label="手机号码" min-width="9.5%">
						</el-table-column>
						<el-table-column prop="cName" label="公司名称" min-width="18.4%" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="rName" label="所在城市" min-width="8%">
						</el-table-column>
						<el-table-column prop="cBrand" label="公司品牌" min-width="12.1%" show-overflow-tooltip>
						</el-table-column>
						<el-table-column prop="puName" label="所有人" min-width="6.1%">
						</el-table-column>
						<el-table-column label="创建日期" min-width="8.3%" sortable :sort-by="sortData">
							<template slot-scope="scope">
								<span>{{ formatTime(scope.row.joinTime) }}</span>
							</template>
						</el-table-column>
						<el-table-column label="操作" min-width="4.1%">
							<template slot-scope="scope">
								<a href="javascript:void(0)" @click="showDetail(scope.row)" style="color: #108EE9">查看</a>
							</template>
						</el-table-column>

                        <div slot="empty">
                            <no-search-result></no-search-result>
                        </div>
					</el-table>
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
            pageSize: 15,
            currPage: 1,
            totalPage: 0,
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
            },
            // 表格数据
            currentPlan: [],
            // 是否滚动加载
            loading_point: true,
            isSearch: true,
            isReset: true,
        };
    },
    mounted: function() {
        this.getRole();
        if(this.sessionData.uType !='BD'){
            this.getCompany();
        }
        this.searchFun();
    },
    directives: {
        loadmore: {
            bind: function (el, binding) {
                const selectWrap = el.querySelector('.el-table__body-wrapper')
                selectWrap.addEventListener('scroll', function () {
                    const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
                    // console.log('滚动的距离',scrollDistance)
                    if (scrollDistance <= 100) {
                        binding.value()
                    }
                })
            }
        }
    },
    methods: {
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
                }else if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    Message.warning(res.data.MSG);
                }
            }).catch(err =>{
                console.log(err);
            });
        },
        // 用户列表--滚动监听
        userLoadMore(){
            if(this.loading_point){
                this.loading_point = false;
                if(this.currPage <= this.totalPage){
                    this.searchFun();
                }
            }
        },
        // 判断角色是否有新建按钮(销售有)
        getRole() {
            this.sessionData = sessFun.getSess();
            let role = this.sessionData.uType;
            console.log(role);
            if (role != "BD") {
                this.showNewBtn = false;
            }
        },
        // 搜索数据格式化
        searchFormat(){
            let session = this.sessionData;
            let info = {
                uid: session.uID,
                token: session.token,
                pageNo: this.currPage,
                pageSize: this.pageSize
            };
            let { date, select, keyword, company } = this.searchInfo;
            info = {
                ...info,
                ...(date && {beginTime: date[0], endTime: date[1]+' 23:59:59'}),
                ...(keyword && (select=='1' && {brandName: keyword}) || (select=='2' && {companyName: keyword}) || (select=='3' && {contactName: keyword})),
                ...(company && { asrID: company})
            };
            return info;
        },
        searchFun(){
            let info = this.searchFormat();
            this.getData(info);
        },
        // 滚动加载获取数据(无搜索数据)
        getData(params){
            api.getApi(this.apiVar.Advertisement+'/GetCustomer', params).then(res =>{
                console.log(res.data);
                if(res.data.SysCode == 100302){
                    this.loginTimeout();
                }else{
                    if(!res.data.SysCode){
                        let dataInfo = res.data.page;
                        this.totalPage = dataInfo.totalPage;
                        let dataArr = dataInfo.list;
                        this.currentPlan = this.currentPlan.concat(this.funcData(dataArr));
                        this.loading_point = true;
                        this.currPage++;
                        this.loading = false;
                        if(dataInfo.totalPage == 0){
                            Message.warning('暂无数据');
                        }
                    }else{
                        Message.warning(res.data.MSG);
                    }
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
                this.loading_point = false;
                this.currPage = 1;
                this.searchFun()
            }else{
                this.$message.warning('请输入搜索条件');
            }
        },
        // 设置表格数据
        setTableData(item){
            let obj = {
                cBrand: item.cBrand ? item.cBrand : '--',
                cID: item.cID ? item.cID:'',
                cName: item.cName ? item.cName : '--',
                crID: item.crID ? item.crID : '',
                iID: item.iID ? item.iID : '',
                joinTime: item.joinTime ? item.joinTime : '',
                phone: item.phone ? item.phone : '',
                position: item.position ? item.position : '--',
                puName: item.puName ? item.puName : '--',
                rID: item.rID ? item.rID : '',
                rName: item.rName ? item.rName : '--',
                realName: item.realName ? item.realName : '',
                sName: item.sName ? item.sName : '',
                uID: item.uID ? item.uID : '',
                cAddress: item.cAddress ? item.cAddress : '',
                cRemark: item.cRemark ? item.cRemark : ''
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
        //日期排序
        sortData(a, b) {
            return dateFormat.toDate(a.joinTime, '') - dateFormat.toDate(b.joinTime, '');
        },
        loginTimeout(){
            Message.warning("登录超时,请重新登录");
            this.$router.push("/login");
        },
    }
};
</script>

<style scoped>
/*筛选*/
.el-checkbox + .el-checkbox {
    margin-left: 0;
}

.input-with-select /deep/ .el-input__inner {
    font-size: 14px;
    /*padding: 10px 10px;*/
    /* height: 32px; */
    /* line-height: 19px; */
    /*vertical-align: middle;*/
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
    /*top: 3px;*/
}

/deep/ .el-date-editor .el-range__icon {
    position: relative;
    top: -3px;
    margin-right: 2px;
}

/deep/ .el-range-separator {
    position: relative;
    top: -3px;
}

/deep/ .el-input__inner {
    width: 260px;
    /* height: 32px; */
    /*line-height: 34px;*/
}

/deep/ .el-range-editor .el-range-input {
    line-height: 20px;
}
/deep/ .el-date-editor i,
/deep/ .el-date-editor input,
/deep/ .el-date-editor span {
    float: left;
    position: relative;
}

   /*面包屑导航*/
    .ad_mediaDetail_wrap {
        position: relative;
    }
    .ad_mediaDetail_nav{
        width: 92%;
        margin: 0 auto;
    }
    .ad_mediaDetail_nav p {
        position: absolute;
        left: 0;
        top: 12px;
        font-size: 14px;
        line-height: 18px;
    }

    .ad_mediaDetail_nav p a {
        color: #666;
    }

    .ad_mediaDetail_nav {
        height: 42px;
        position: relative;
    }

    /*wrap*/
 /*   .mediaList_wrap {
        width: 92%;
        background: #ffffff;
        border: 1px solid #e6e7e9;
        margin: 0 auto;
    }

    .mediaList_wrap .mediaList_head {
        width: 100%;
        height: 24px;
        padding: 12px 0;
        border-bottom: 1px solid #e6e7e9;
    }

    .mediaList_wrap .mediaList_head h2 {
        font-size: 16px;
        color: #2c313c;
        height: 24px;

        padding-left: 14px;
        font-weight: bold;
    }

    .mediaList_wrap .mediaList_container {
        width: 96%;
        margin: 24px auto;
    }*/

.el-input {
    width: 240px;
    border-radius: 4px;
}

/* .el-button {
    width: 76px;
    height: 34px;
    text-align: center;
    padding: 0;
    margin-left: 2px;
    position: relative;
    left: 0;
} */
/* /deep/ .el-button [class*=el-icon-]+span, .select-wrap button .el-icon-search{
  position: relative;
  left: -2px;
  top: 0px;
} */


.mediaList_wrap .mediaList_container .table_wrap {
    margin: 24px auto;
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

/* .el-input {
    height: 32px !important;
    border-radius: 4px;
} */

/*表格*/

/deep/ .el-table th,
.el-table tr {
    height: 44px;
    padding: 0;
    background-color: #f7f7f7;
}

/deep/ .el-table td {
    padding: 8px 0;
    overflow-x: hidden;
    text-overflow: ellipsis;
}

/deep/ .el-table--border {
    border-radius: 4px;
}

/deep/ .el-table th > .cell {
    font-size: 14px;
    color: #666666;
    font-weight: bold;
}

/deep/ .el-table .caret-wrapper {
    width: 22px;
}

/deep/ .el-table--enable-row-hover .el-table__body tr:hover > td {
    background-color: #ecf5ff;
}

/*滚动条*/
/deep/ .el-table__body-wrapper {
    height: 405px;
    overflow-y: scroll;
    overflow-x: hidden;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar {
    width: 4px;
    background: #fafafa;
}

/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #c1c1c1;
    border-radius: 4px;
}

/*超出省略*/
/deep/ .el-table .cell {
    overflow-x: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/deep/ .el-table__row td:nth-child(1) .cell {
    width: 90px;
}

/deep/ .el-table__row td:nth-child(2) .cell {
    width: 114px;
}

/deep/ .el-table__row td:nth-child(4) .cell {
    width: 247px;
}

/deep/ .el-table__row td:nth-child(6) .cell {
    width: 180px;
}

/deep/ .el-table__row td:nth-child(8) .cell {
    width: 108px;
}

/*筛选*/
/deep/ .el-table__column-filter-trigger {
    margin-left: 10px;
}

/deep/ .el-table th > .cell.highlight {
    color: #409eff !important;
}

/deep/ div.el-table-filter {
    left: 1106px !important;
}

/*操作*/
/deep/ .el-button--mini,
.el-button--small {
    font-size: 14px !important;
}

/deep/ .el-button .el-button--primary .el-button--mini {
    width: 51px;
}

/deep/ .el-dropdown-menu--mini .el-dropdown-menu__item {
    width: 65px;
}

/deep/ .el-button-group .el-button:not(:last-child) {
    margin-top: -1px;
}

.tar {
    text-align: right !important;
    padding-right: 10px;
}

/deep/ .el-dropdown .el-button-group .el-button {
    height: 28px;
}

/*按钮*/
/deep/ .el-button--default:focus,
.el-button--default:hover {
    color: #606266;
    border-color: #dcdfe6;
    background-color: #fcfcfc;
}

.content_bottom_btn /deep/ .el-button span {
    position: relative;
    top: -2px;
}

.content_bottom_btn /deep/ .el-button span a {
    color: #606266;
}

.mediaList_handel span {
    float: left;
    margin-left: 2px;
}
</style>
