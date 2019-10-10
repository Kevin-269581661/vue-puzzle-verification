<template>
    <div class="community-rank">
        <div class="ad_mediaDetail_nav ">
            <p><a href="#" style="color: #999">社区排名</a></p>
        </div>
        <div class="content-wrap">
            <div class="top">
                <el-tabs v-model="activeName" @tab-click="handleClick">
                    <el-tab-pane label="人群标签" name="first">
                        <div class="tab-content-wrap">
                            <div class="tab-content">
                                <ul class="first-tags">
                                    <li class="first-tags-li" v-for="(first,index) in tags" :key="index">
                                        <span>{{first.name}}：</span>
                                        <ul class="second-tags">
                                            <li class="second-tags-li" v-for="(second,index) in first.children"
                                                @click="chooseTags(first,second)" :class="second.flag==1?'active':''">
                                                {{second.name}}
                                            </li>
                                        </ul>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="偏好标签" name="second">偏好标签</el-tab-pane>
                </el-tabs>
                <div class="choose-panel-wrap">
                    <div class="choose-panel">
                        <div>
                            <el-button plain  v-for="(tag,index) in chooseTagsArr" :key="index" size="mini" @click="cancelChooseTag(tag)">{{tag}}<i class="el-icon-close"></i></el-button>
                        </div>
                        <span @click="clearAllTag">清空条件</span>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <h5>排名TOP200</h5>
                <div class="table-wrap">
                    <div class="table_dt">
                        <el-table
                            v-loading="loading"
                            element-loading-text="拼命加载中..."
                            element-loading-spinner="el-icon-loading"
                            border
                            :data="currentPlan"
                            style="width: 100%">
                            <el-table-column
                                label="排名"
                                min-width="50"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.rank}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                label="资源"
                                min-width="180"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.resName}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="cityName"
                                label="城市"
                                min-width="80"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.cityName || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="area"
                                label="区域"
                                min-width="100"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.area || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="businessCircle"
                                label="商圈"
                                min-width="100"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.businessCircle || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="resType"
                                label="资源类型"
                                min-width="100"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.resType || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="building"
                                label="楼盘类型"
                                min-width="100"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.building || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="price"
                                label="楼盘价格"
                                min-width="100"
                                :show-overflow-tooltip="true"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.price||'--'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="houseNum"
                                label="住户数量"
                                min-width="100"
                                :show-overflow-tooltip="true"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.houseNum || '--'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="mediaNum"
                                label="媒体数量"
                                min-width="100"
                                :show-overflow-tooltip="true"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.mediaNum|| '--'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="resNum"
                                label="点位数量"
                                min-width="100"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.resNum}}</span>
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
                            :total="totalSize">
                        </el-pagination>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {
        Table,
        Tabs,
        TableColumn,
        Button,
        Message
    } from "element-ui";
    import noSearchResult from "./components/noSearchResult.vue";
    export default {
        name: "communityRank",
        components: {
            elTable: Table,
            elTableColumn: TableColumn,
            elButton: Button,
            elTabs: Tabs,
            noSearchResult,
        },
        data() {
            return {
                activeName: 'first',
                tags: [
                    {name: '性别', children: [{name: '男', flag: 0}, {name: '女', flag: 0}]},
                    {
                        name: '年龄',
                        children: [
                            {name: '18岁以下', flag: 0}, {name: '18~24岁', flag: 0}, {
                                name: '25~34岁',
                                flag: 0
                            }, {name: '35-44岁', flag: 0}, {name: '45~54岁', flag: 0}, {
                                name: '55~64岁',
                                flag: 0
                            }, {name: '65岁及以上', flag: 0}]
                    },
                    {
                        name: '教育水平',
                        children: [{name: '高中及以下', flag: 0}, {name: '大专', flag: 0}, {name: '本科及以上', flag: 0}]
                    },
                    {
                        name: '收入水平',
                        children: [{name: '2,499元及以下', flag: 0}, {name: '2,500~3,999元', flag: 0}, {
                            name: '4,000~7,999元',
                            flag: 0
                        }, {name: '8,000~19,999元', flag: 0}, {name: '20,000元及以上', flag: 0}]
                    },
                    {name: '消费水平', children: [{name: '高', flag: 0}, {name: '中', flag: 0}, {name: '低', flag: 0}]},
                    {name: '资产情况', children: [{name: '有车', flag: 0}, {name: '无车', flag: 0}]},
                    {
                        name: '人生阶段',
                        children: [
                            {name: '初中生', flag: 0}, {name: '高中生', flag: 0}, {name: '大学生', flag: 0}, {
                                name: '研究生',
                                flag: 0
                            }, {name: '孕期', flag: 0}, {name: '育儿阶段', flag: 0}, {
                                name: '家有孕妇',
                                flag: 0
                            }, {name: '家有0-1岁小孩', flag: 0}, {name: '家有1-3岁小孩', flag: 0}, {
                                name: '家有3-6岁小孩',
                                flag: 0
                            }, {name: '家有小学生', flag: 0}, {name: '家有初中生', flag: 0}, {name: '家有高中生', flag: 0}]
                    },
                    {
                        name: '工作分布',
                        children: [{name: '生产操作人员', flag: 0}, {name: '文职人员', flag: 0}, {
                            name: '专业技术人员',
                            flag: 0
                        }, {name: '管理者和企业主', flag: 0}, {name: '个体经营者', flag: 0}, {name: '服务人员', flag: 0}]
                    },
                    {
                        name: '行业分布',
                        children: [
                            {name: '农林牧渔', flag: 0}, {name: '能源采矿化工', flag: 0}, {name: '食品加工', flag: 0}, {
                                name: '纺织服装',
                                flag: 0
                            }, {name: '建材家居', flag: 0}, {name: '医药卫生', flag: 0}, {
                                name: '机械制造',
                                flag: 0
                            }, {name: 'IT通信电子', flag: 0}, {name: '建筑房地产', flag: 0}, {
                                name: '交通运输和仓储邮政',
                                flag: 0
                            }, {name: '餐饮', flag: 0}, {name: '日化百货', flag: 0}, {name: '金融保险', flag: 0}, {
                                name: '生活服务',
                                flag: 0
                            }, {name: '住宿旅游', flag: 0}, {name: '广告营销', flag: 0}, {
                                name: '法律商务人力外贸',
                                flag: 0
                            }, {name: '科学研究', flag: 0}, {name: '教育', flag: 0}, {
                                name: '文化体育娱乐',
                                flag: 0
                            }, {name: '社会公共管理', flag: 0}]
                    },
                ],
                chooseTagsArr: [],
                // 表格数据
                currentPlan: [{
                    rank: '排名',
                    resName: '资源',
                    resType: '资源类型',
                    cityName: '城市',
                    area: '区域',
                    businessCircle: '商圈',
                    building: '楼盘类型',
                    price: '楼盘价格',
                    houseNum: '住户数量',
                    mediaNum:'媒体数量',
                    resNum:'点位数量',
                }],
                //加载中
                loading: false,
                currPage: 1,
                pageSize: 10,
                totalSize: 10,
            };
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            //人群标签-选中标签
            chooseTags(first,second) {
                let str = first.name+'：'+second.name
                if (second.flag == 1) {
                    //取消
                    second.flag = 0
                    for(let data of this.tags){
                        for(let data2 of data.children){
                            if(data2.name == second){
                                data2.flag=0
                            }
                        }
                    }
                    this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(str), 1);
                } else {
                    //选中
                    if(this.chooseTagsArr.length<4){
                        second.flag = 1
                        this.chooseTagsArr.push(str)
                    }else{
                        Message.warning("最多只能选择4个标签");
                    }

                }
            },
            //删除选择的标签
            cancelChooseTag(item){
                let tag = item.split('：')[1]
                for(let data of this.tags){
                    for(let data2 of data.children){
                        if(data2.name == tag){
                            data2.flag=0
                        }
                    }
                }
                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(item), 1);

            },
            //清空所有标签
            clearAllTag(){
                this.chooseTagsArr = [];
                for(let data of this.tags){
                    for(let item of data.children){
                        if(item.flag==1){
                            item.flag=0
                        }
                    }
                }
            },
            // 分页
            changePage(val) {
                // console.log('当前页',val)
                this.currPage = val
                this.searchFun();
            },
            // 每页条数切换
            sizeChange(val) {
                this.pageSize = val;
                this.currPage = 1;
                this.searchFun();
            },
        }
    }
</script>

<style scoped>
    .content-wrap {
        margin: 0 64px;
    }

    .top,.bottom{
        background: #fff;
        border: 1px solid rgba(230, 231, 233, 1);
    }

    .top /deep/ .el-tabs__nav-wrap {
        padding: 0 14px;
    }
    .top /deep/ .el-tabs__item.is-top{
        color:rgba(0,0,0,0.45);
    }
    .top /deep/ .el-tabs__item.is-active{
        color: #1890FF;
    }

    .tab-content-wrap {
        padding: 24px 32px 0;
    }
    .choose-panel-wrap{
        padding: 0 24px 24px;
    }

    .first-tags {
        padding: 0 16px;
        border: 1px solid rgba(224, 224, 224, 1);
    }

    .first-tags-li {
        display: flex;
        box-sizing: border-box;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
        /*height: 48px;*/
        padding: 10px 0;
        align-items: center;
        font-size: 14px;
    }

    .first-tags-li:last-child {
        border: none;
    }

    .first-tags-li > span {
        display: inline-block;
        min-width: 70px;
        text-align: right;
    }

    .second-tags {
        min-width: 1050px;
    }

    .second-tags-li {
        color: rgba(0, 0, 0, 0.65);
        padding: 4px 12px;
        cursor: pointer;
        float: left;
    }

    .second-tags-li.active {
        color: #fff;
        background: #1890FF;
        border-radius: 2px;
    }

    .choose-panel {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 38px;
        background: rgba(241, 241, 241, 1);
        width: 100%;
        padding: 0 16px;
        box-sizing: border-box;
        margin-top: 8px;
    }

    .choose-panel > span {
        color: #1890ff;
        cursor: pointer;
        font-size: 14px;
        float: right;
    }
    .choose-panel .el-icon-close{
        position: relative;
        right: -6px;
    }
    .choose-panel /deep/ .el-button{
        min-width: 40px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        padding: 0 12px 0 8px;
    }
    .table-wrap {
       padding: 24px 32px;
    }
    .bottom{
        margin-top: 16px;
    }
    .bottom h5{
        font-size:16px;
        font-weight:600;
        color:rgba(44,49,60,1);
        height: 48px;
        line-height: 48px;
        padding: 0 16px;
        border-bottom: 1px solid #E6E7E9;
    }
    /deep/ .el-table__body-wrapper{
        overflow-y: hidden;
    }

</style>
