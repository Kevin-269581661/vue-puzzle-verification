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
                                    <li class="first-tags-li" v-for="(first,index) in personTags" :key="index">
                                        <span>{{first.label}}：</span>
                                        <ul class="second-tags">
                                            <li class="second-tags-li" v-for="(second,index) in first.children"
                                                @click="chooseTags(first,second)" :class="second.flag==1?'active':''">
                                                {{second.label}}
                                            </li>
                                        </ul>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="偏好标签" name="second">
                        <div class="tab-content-wrap">
                            <ul class="hobby-tags-ul">
                                <li class="hobby-tags-li">
                                    <span>标签一：</span>
                                    <el-popover
                                        placement="bottom"
                                        width="132"
                                        v-for="(firstTag,index) in hobbyTags"
                                        :key="index"
                                        visible-arrow="none"
                                        popper-class="tag-popover"
                                    >
                                        <el-button plain slot="reference">{{firstTag.label}}</el-button>
                                        <ul class="second-tag-ul">
                                            <li class="second-tag-li tag-li"
                                                v-for="(secondTag,index) in firstTag.children" :key="index">
                                                <p>{{secondTag.label}}</p>
                                                <ul class="third-tag-ul tag-ul" v-if="secondTag.children">
                                                    <li class="third-tag-li tag-li"
                                                        v-for="(thirdTag,index) in secondTag.children" :key="index">
                                                        <p>{{thirdTag.label}}</p>
                                                        <ul class="forth-tag-ul tag-ul" v-if="thirdTag.children">
                                                            <li class="forth-tag-li tag-li"
                                                                v-for="(forthTag,index) in thirdTag.children"
                                                                :key="index">
                                                                <p>{{forthTag.label}}</p>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </el-popover>
                                </li>
                            </ul>
                        </div>

                    </el-tab-pane>
                </el-tabs>
                <div class="choose-panel-wrap">
                    <div class="choose-panel">
                        <div>
                            <el-button plain v-for="(tag,index) in chooseTagsArr" :key="index" size="mini"
                                       @click="cancelChooseTag(tag)">{{tag}}<i class="el-icon-close"></i></el-button>
                        </div>
                        <p>
                            <span>已选{{chooseTagsArr.length}}个标签，默认交集组合查询</span>
                            <span @click="clearAllTag">清空条件</span>
                        </p>
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
    import personTags from "../../commonFun/json/personTags.json"

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
                activeName: 'second',
                personTags: [],
                hobbyTags: [
                    {
                        "value": "100",
                        "label": "一级1",
                        "children": [
                            {
                                "value": "100",
                                "label": "二级",
                                "children": [{
                                    "value": "100",
                                    "label": "三级",
                                    "children": [{
                                        "value": "100",
                                        "label": "四级",
                                    }]
                                }]
                            }
                        ]
                    },
                    {
                        "value": "100",
                        "label": "一级2",
                        "children": [
                            {
                                "value": "100",
                                "label": "二级",
                                "children": [{
                                    "value": "100",
                                    "label": "三级",
                                }]
                            }
                        ]
                    }
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
                    mediaNum: '媒体数量',
                    resNum: '点位数量',
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
            chooseTags(first, second) {
                let str = first.label + '：' + second.label
                if (second.flag == 1) {
                    //取消
                    second.flag = 0
                    for (let data of this.personTags) {
                        for (let data2 of data.children) {
                            if (data2.label == second) {
                                data2.flag = 0
                            }
                        }
                    }
                    this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(str), 1);
                } else {
                    //选中
                    if (this.chooseTagsArr.length < 4) {
                        second.flag = 1
                        this.chooseTagsArr.push(str)
                    } else {
                        Message.warning("最多只能选择4个标签");
                    }

                }
            },
            //删除选择的标签
            cancelChooseTag(item) {
                let tag = item.split('：')[1]
                for (let data of this.personTags) {
                    for (let data2 of data.children) {
                        if (data2.label == tag) {
                            data2.flag = 0
                        }
                    }
                }
                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(item), 1);

            },
            //清空所有标签
            clearAllTag() {
                this.chooseTagsArr = [];
                for (let data of this.personTags) {
                    for (let item of data.children) {
                        if (item.flag == 1) {
                            item.flag = 0
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
        },
        mounted() {
            this.personTags = personTags
        }
    }
</script>

<style scoped>
    .content-wrap {
        margin: 0 64px;
    }

    .top, .bottom {
        background: #fff;
        border: 1px solid rgba(230, 231, 233, 1);
    }

    .top /deep/ .el-tabs__nav-wrap {
        padding: 0 14px;
    }

    .top /deep/ .el-tabs__item.is-top {
        color: rgba(0, 0, 0, 0.45);
    }

    .top /deep/ .el-tabs__item.is-active {
        color: #1890FF;
    }

    .tab-content-wrap {
        padding: 24px 32px 0;
    }

    .choose-panel-wrap {
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

    .choose-panel p span:first-child {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.35);
    }

    .choose-panel p span:last-child {
        color: #1890ff;
        cursor: pointer;
        font-size: 14px;
    }

    .choose-panel .el-icon-close {
        position: relative;
        right: -6px;
    }

    .choose-panel /deep/ .el-button {
        min-width: 40px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        padding: 0 12px 0 8px;
    }

    .table-wrap {
        padding: 24px 32px;
    }

    .bottom {
        margin-top: 16px;
    }

    .bottom h5 {
        font-size: 16px;
        font-weight: 600;
        color: rgba(44, 49, 60, 1);
        height: 48px;
        line-height: 48px;
        padding: 0 16px;
        border-bottom: 1px solid #E6E7E9;
    }

    .hobby-tags-ul {
        border: 1px solid rgba(224, 224, 224, 1);
    }

    .hobby-tags-li {
        padding: 12px 24px;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
    }

    .hobby-tags-li:last-child {
        border-bottom: none;
    }

    /deep/ .el-table__body-wrapper {
        overflow-y: hidden;
    }

    .tag-ul {
        width: 132px;
        padding: 12px;
        border: 1px solid #ebeef5;
    }

    .second-tag-li {
        position: relative;
    }

    .third-tag-ul {
        position: absolute;
        left: 145px;
        top: -11px;
        background: #fff;
    }

    .forth-tag-ul {
        position: absolute;
        left: 264px;
        top: 0;
        background: #fff;
    }

    .tag-popover {
        border: none;
        box-shadow: none;
    }


    /*  .top /deep/ .el-cascader {
          width: 76px;
          height: 26px;
          margin-right: 8px;
          line-height: 26px;
      }

      .top /deep/ .el-cascader .el-input--suffix .el-input__inner {
          border: 1px solid rgba(24, 144, 255, 1);
          height: 100%;
          border-radius: 0px;
          position: relative;
          z-index: 9;
      }

      .top /deep/ .el-input::before {
          display: inline-block;
          content: '';
          width: 0;
          height: 0;
          border: 4px solid transparent;
          border-bottom-color: rgba(24, 144, 255, 1);
          border-right-color: rgba(24, 144, 255, 1);
          position: absolute;
          right: 2px;
          bottom: 2px;
          z-index: 10;
      }

      .top /deep/ .el-input__suffix {
          display: none;
      }

      .top /deep/ .el-input {
          height: 100%;
      }*/

</style>
<style>
    .el-popper{
        min-width: 132px;
        border: none;
        border-radius: 0;
        box-shadow: none;
    }
</style>
