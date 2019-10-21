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
                                <ul class="first-tags" :style="{height:tabHeight}">
                                    <li class="first-tags-li" v-for="(first,index) in personTags" :key="index">
                                        <span>{{first.label}}：</span>
                                        <ul class="second-tags">
                                            <li class="second-tags-li" v-for="(second,index) in first.childer"
                                                @click="chooseTags(first,second)" :class="second.checked?'active':''">
                                                {{second.label}}
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <div class="show-hide-btn" :class="showhideText=='展开'?'':'show'"
                                     @click="toggleShowTags">
                                    <i :class="showhideText=='展开'?'el-icon-d-arrow-left':'el-icon-d-arrow-right'"></i>
                                    {{showhideText}}
                                </div>
                            </div>
                        </div>
                    </el-tab-pane>
                    <el-tab-pane label="偏好标签" name="second">
                        <div class="tab-content-wrap">
                            <ul class="hobby-tags-ul">
                                <li class="hobby-tags-li">
                                    <el-popover
                                        placement="bottom-start"
                                        v-for="(firstTag,index) in hobbyTags"
                                        :key="index"
                                        :width="width"
                                        trigger="manual"
                                        :visible-arrow="false"
                                        :value="firstTag.hovered"
                                        popper-class="tag-popover"
                                    >
                                        <span class="first-tag-btn" :class="firstTag.checked?'active':''"
                                              slot="reference" @click="chooseHobbyTag(firstTag)"
                                              @mouseenter="showPopver(firstTag)" @mouseleave="hidePopver(firstTag)">
                                            {{firstTag.label}}
                                        </span>
                                        <div class="ul-wrap" @mouseenter="enterPopver(firstTag)"
                                             @mouseleave="leavePopver(firstTag)">
                                            <ul class="second-tag-ul tag-ul">
                                                <li class="second-tag-li tag-li"
                                                    v-for="(secondTag,index) in firstTag.childer" :key="index"
                                                    @mouseenter="showUl(2,secondTag)">
                                                    <div class="check-wrap">
                                                        <el-checkbox v-model="secondTag.checked"
                                                                     @change="tagChecked($event,2,firstTag,secondTag)">
                                                            {{secondTag.label}}
                                                        </el-checkbox>
                                                        <i class="el-icon-arrow-right"></i>
                                                    </div>

                                                </li>
                                            </ul>
                                            <ul class="third-tag-ul tag-ul"
                                                v-if="thirdShow">
                                                <li class="third-tag-li tag-li"
                                                    v-for="(thirdTag,index) in currentThirdList" :key="index"
                                                    @mouseenter="showUl(3,thirdTag)">
                                                    <div class="check-wrap">
                                                        <el-checkbox v-model="thirdTag.checked"
                                                                     @change="tagChecked($event,3,firstTag,thirdTag)">
                                                            {{thirdTag.label}}
                                                        </el-checkbox>
                                                        <i v-if="thirdTag.childer" class="el-icon-arrow-right"></i>
                                                    </div>

                                                </li>
                                            </ul>
                                            <ul class="forth-tag-ul"
                                                v-if="forthShow">
                                                <li class="forth-tag-li tag-li"
                                                    v-for="(forthTag,index) in currentForthList"
                                                    :key="index">
                                                    <div class="check-wrap">
                                                        <el-checkbox v-model="forthTag.checked"
                                                                     @change="tagChecked($event,4,firstTag,forthTag)">
                                                            {{forthTag.label}}
                                                        </el-checkbox>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </el-popover>
                                </li>
                            </ul>
                        </div>

                    </el-tab-pane>
                </el-tabs>
                <div class="checked-panel-wrap">
                    <div class="checked-panel">
                        <div>
                            <el-button plain v-for="(tag,index) in chooseTagsArr" :key="index" size="mini"
                                       @click="cancelChooseTag(tag)">{{tag.label}}<i class="el-icon-close"></i>
                            </el-button>
                        </div>
                        <p>
                            <span>已选{{chooseTagsArr.length}}个标签，默认交集组合查询</span>
                            <span @click="clearAllTag">清空条件</span>
                        </p>
                    </div>
                </div>
                <div class="btn">
                    <el-button type="primary" @click="getRankList">查 询</el-button>
                </div>

            </div>
            <div class="bottom">
                <h5>
                    <span>排名TOP200</span>
                    <span @click="exportTable"><i class="el-icon-upload2"></i>导出</span>
                </h5>
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
                                width="50"
                                type="index">
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
                                prop="rname"
                                label="城市"
                                min-width="80"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.rname || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="pname"
                                label="区域"
                                min-width="80"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.pname || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="tradingArea"
                                label="商圈"
                                min-width="100"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span>{{scope.row.tradingArea || '--' }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="resType"
                                label="资源类型"
                                min-width="100"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    <span v-if="scope.row.resType==1">社区</span>
                                    <span v-if="scope.row.resType==2">写字楼</span>
                                    <span v-if="scope.row.resType==3">街道</span>
                                    <span v-if="scope.row.resType==4">地铁</span>
                                    <span v-if="scope.row.resType==5">学校</span>
                                    <span v-if="scope.row.resType==6">寺庙</span>
                                    <span v-if="scope.row.resType==7">户外路牌</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="ctype"
                                label="楼盘类型"
                                min-width="100"
                                :show-overflow-tooltip="true">
                                <template slot-scope="scope">
                                    {{ scope.row.ctype || '--' }}
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="hprice"
                                label="楼盘价格"
                                min-width="100"
                                :show-overflow-tooltip="true"
                            >
                                <template slot-scope="scope">
                                    <span>{{priceFormat(scope.row.hprice)||'--'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="hnum"
                                label="住户数量"
                                min-width="100"
                                :show-overflow-tooltip="true"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.hnum || '--'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="mediaCount"
                                label="媒体数量"
                                min-width="80"
                                :show-overflow-tooltip="true"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.mediaCount|| '--'}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="asCount"
                                label="点位数量"
                                min-width="80"
                            >
                                <template slot-scope="scope">
                                    <span>{{scope.row.asCount}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column
                                prop="action"
                                label="操作"
                                min-width="80"
                            >
                                <template slot-scope="scope">
                                    <el-button type="text" @click="gotoDetail(scope.row)">画像详情</el-button>
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
    import commaFormat from "../../commonFun/commaFormat.js"
    import api from "../../api/api.js";

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
                tabHeight: '252px',
                showhideText: '展开',
                width: 132,//面板宽度
                activeName: 'first',
                thirdShow: false,
                forthShow: false,
                currSecondTag: '',//当前选中的二级标签
                currThirdTag: '',//当前选中的三级标签
                currentThirdList: [],//当前展示的三级标签列表
                currentForthList: [],//当前展示的四级标签列表
                personTags: [],
                hobbyTags: [
                    {
                        "value": "1",
                        "label": "一级1",
                        "checked": false,
                        "hovered": false,
                        "childer": [
                            {
                                "value": "121",
                                "label": "1二级1",
                                "checked": false,
                                "childer": [{
                                    "value": "12131",
                                    "label": "1三级1",
                                    "childer": [{
                                        "value": "12141",
                                        "label": "1四级1",
                                    }]
                                }]
                            },
                            {
                                "value": "122",
                                "label": "1二级2",
                                "checked": false,
                                "childer": [{
                                    "value": "12231",
                                    "label": "1三级2",
                                    "checked": false,
                                    "childer": [{
                                        "value": "12241",
                                        "label": "1四级2",
                                    }]
                                }]
                            },
                            {
                                "value": "123",
                                "label": "1二级1",
                                "checked": false,
                                "childer": [{
                                    "value": "12331",
                                    "label": "1三级1",
                                    "checked": false,
                                    "childer": [{
                                        "value": "12341",
                                        "label": "1四级1",
                                        "checked": false,
                                    }]
                                }]
                            },
                            {
                                "value": "124",
                                "label": "1二级2",
                                "checked": false,
                                "childer": [{
                                    "value": "12431",
                                    "label": "1三级2",
                                    "checked": false,
                                    "childer": [{
                                        "value": "12441",
                                        "label": "1四级2",
                                        "checked": false,
                                    }]
                                }]
                            },
                            {
                                "value": "125",
                                "label": "1二级1",
                                "checked": false,
                                "childer": [{
                                    "value": "12531",
                                    "label": "1三级1",
                                    "checked": false,
                                    "childer": [{
                                        "value": "12541",
                                        "label": "1四级1",
                                        "checked": false,
                                    }]
                                }]
                            },
                            {
                                "value": "126",
                                "label": "1二级2",
                                "checked": false,
                                "childer": [{
                                    "value": "12631",
                                    "label": "1三级2",
                                    "checked": false,
                                    "childer": [{
                                        "value": "12641",
                                        "label": "1四级2",
                                        "checked": false,
                                    }]
                                }]
                            }
                        ]
                    },
                    {
                        "value": "2",
                        "label": "一级2",
                        "checked": false,
                        "hovered": false,
                        "childer": [
                            {
                                "value": "221",
                                "label": "2二级",
                                "checked": false,
                                "childer": [{
                                    "value": "22131",
                                    "label": "2三级",
                                    "checked": false,
                                }]
                            }
                        ]
                    },
                    {
                        "value": "3",
                        "label": "一级3",
                        "checked": false,
                        "hovered": false,
                        "childer": [
                            {
                                "value": "321",
                                "label": "3二级",
                                "checked": false,
                                "childer": [{
                                    "value": "32131",
                                    "label": "3三级",
                                    "checked": false,
                                }]
                            }
                        ]
                    },

                ],
                chooseTagsArr: [],
                // 表格数据
                currentPlan: [],
                //加载中
                loading: false,
                currPage: 1,
                pageSize: 10,
                totalSize: 10,
            };
        },
        methods: {
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.format(price);
            },
            //展开收起面板
            toggleShowTags() {
                if (this.tabHeight == '252px') {
                    this.tabHeight = '452px'
                    this.showhideText = '收起'
                } else {
                    this.tabHeight = '252px'
                    this.showhideText = '展开'
                }
            },
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            //人群标签-选中和取消标签
            chooseTags(first, second) {
                console.log(first, second, this.chooseTagsArr);

                if (second.checked) {
                    //取消选中当前二级
                    second.checked = false
                    //一级被选中
                    if (first.checked) {
                        //取消选中
                        first.checked = false
                        let item = {
                            value:first.value,
                            label:first.label
                        }
                        this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(item), 1);
                        for (let data of first.childer) {
                            if(data.checked){
                                let obj = {
                                    value:data.value,
                                    label:first.label+'：'+data.label
                                }
                                this.chooseTagsArr.push(obj)
                            }

                        }
                    }
                    // this.showPersonTags()
                } else {
                    //选中
                    // second.checked = true
                    this.filterArr(first, second)
                }


            },
            //人群标签-展示
            showPersonTags() {
                console.log(this.personTags);
                this.chooseTagsArr = []
                //   for(let data of this.personTags){
                //       let obj = ''
                //       if(data.checked){
                //            obj = {
                //               value:data.value,
                //               label:data.label
                //           }
                //           this.chooseTagsArr.push(obj)
                //       }else{
                //           for(let data2 of data.childer){
                //               if(data2.checked){
                //                   obj = {
                //                       value:data2.value,
                //                       label:data.label+'：'+data2.label
                //                   }
                //                   this.chooseTagsArr.push(obj)
                //               }
                //           }
                //       }
                // }

            },
            //选中的标签数组 取交集
            filterArr(arr, second) {
                let a = [...this.chooseTagsArr]//展示的标签数组
                let b = [...arr.childer]//该标签的下级标签数组
                let obj = ''
                //交集
                let intersect = a.filter(x => [...b].some(y => y.label === x.label.split('：')[1]))
                console.log('交集--', intersect);
                if (intersect.length == b.length - 1) {
                    //可合并部分标签。取差集
                    // console.log('合并部分标签前',this.chooseTagsArr);
                    this.chooseTagsArr = a.filter(x => [...b].every(y => y.label !== x.label.split('：')[1]))
                    //加上一个新的一级标签
                    obj = {
                        value: arr.value,
                        label: arr.label
                    }
                    // this.chooseTagsArr.push(obj)
                    for (let data of this.personTags) {
                        if (data.value == arr.value) {
                            data.checked = true
                        }
                    }
                    console.log('合并部分标签后', this.chooseTagsArr);
                } else {
                    obj = {
                        value: second.value,
                        label: arr.label + '：' + second.label
                    }

                }
                this.pushArr(obj,second)
            },
            //删除单个的标签
            cancelChooseTag(item) {
                console.log(item);
                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(item), 1);
                for (let data of this.personTags) {
                    if (item.label.includes('：')) {
                        let tag = item.label.split('：')[1]
                        for (let data2 of data.childer) {
                            if (data2.label == tag) {
                                data2.checked = false
                            }
                        }
                    } else {
                        //选中一级
                        if (data.label == item.label) {
                            for (let data2 of data.childer) {
                                data2.checked = false
                            }
                        }
                    }
                }

                let fn = function (arr) {
                    for (let data of arr) {
                        if (data.value == item.value) {
                            data.checked = false
                            return
                        } else {
                            if (data.childer) {
                                fn(data.childer)
                            }
                        }
                    }
                }
                fn(this.hobbyTags)


            },
            //清空所有标签
            clearAllTag() {
                this.chooseTagsArr = [];
                for (let data of this.personTags) {
                    for (let item of data.childer) {
                        if (item.checked) {
                            item.checked = false
                        }
                    }
                }

                this.clear(this.hobbyTags)

                // console.log(this.chooseTagsArr);
            },
            clear(obj, type) {
                if (obj.childer) {
                    //偏好
                    if (type == 'split') {
                        for (let data of this.chooseTagsArr) {
                            let a = data.label.split('：')[0]
                            if (data.label.includes('：') && a.includes(obj.label)) {
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                                if (data.childer) {
                                    this.clear(data, 'split')
                                }
                            }

                        }

                    } else {
                        for (let data of obj.childer) {
                            data.checked = false
                            if (data.childer) {
                                this.clear(data.childer)
                            }
                        }
                    }

                } else {
                    //人群
                    for (let data of obj) {
                        data.checked = false
                        if (data.childer) {
                            this.clear(data.childer)
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
            //移入移出一级标签
            showPopver(firstTag) {
                firstTag.hovered = true
            },
            hidePopver(firstTag) {
                // console.log(this.thirdShow);
                let that = this
                setTimeout(() => {
                    if (!that.thirdShow == true) {
                        //直接离开 面板消失
                        firstTag.hovered = false
                    }
                }, 100)

            },
            //进入和离开面板
            enterPopver(firstTag) {
                firstTag.hovered = true
            },
            leavePopver(firstTag) {
                // console.log('从面板离开');
                firstTag.hovered = false;
                //重置数据
                this.width = 132;
                this.thirdShow = false;
                this.forthShow = false;
                this.currentThirdList = [];
                this.currentForthList = [];
            },
            //偏好标签-选中一级标签
            chooseHobbyTag(item) {
                // console.log(item);
                // console.log(this.chooseTagsArr);
                if (item.checked) {
                    item.checked = false
                    this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(item), 1);
                } else {
                    let obj = {
                        value: item.value,
                        label: item.label
                    }
                    item.hovered = false
                    //清空下级
                    this.clear(item, 'split')
                    this.pushArr(obj, item)
                }

            },
            //偏好标签-选中二三四级
            tagChecked(e, level, tag1, tag2) {
                console.log(e, level, tag1, tag2);
                let obj = {
                    label: '',
                    value: ''
                }
                if (e) {
                    //选中
                    if (level == 2) {
                        obj.label = tag1.label + '：' + tag2.label
                        obj.value = tag2.value;
                        //判断是否选中上级，去掉选中
                        for (let data of this.chooseTagsArr) {
                            if (data.label == tag1.label) {
                                tag1.checked = false
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                            //是否选中下级
                            let a = data.label.split('：')[0].split('/')[1];
                            if (a == tag2.label) {
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                                //清空所有下级
                                this.clear(tag2.childer)

                            }
                        }

                    } else if (level == 3) {
                        for (let data of tag1.childer) {
                            for (let data2 of data.childer) {
                                if (data2.value == tag2.value) {
                                    obj.label = tag1.label + '/' + data.label + '：' + data2.label
                                    obj.value = data2.value
                                }
                            }
                        }
                        //判断是否选中上级，去掉选中
                        for (let data of this.chooseTagsArr) {
                            if (data.label == tag1.label) {
                                tag1.checked = false
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                        }
                        for (let data of this.chooseTagsArr) {
                            let str = data.label.split('：')[1]
                            let a = this.currSecondTag.label
                            if (str == a) {
                                this.currSecondTag.checked = false
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                            //是否选中下级
                            let b = data.label.split('：')[0].split('/')[2];
                            if (b == tag2.label) {
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                                //清空所有下级
                                this.clear(tag2.childer)
                            }
                        }
                    } else {
                        for (let data of tag1.childer) {
                            for (let data2 of data.childer) {
                                for (let data3 of data2.childer) {
                                    if (data3.value == tag2.value) {
                                        obj.label = tag1.label + '/' + data.label + '/' + data2.label + '：' + data3.label
                                        obj.value = data3.value
                                    }
                                }
                            }
                        }
                        //判断是否选中上级，去掉选中
                        //三级
                        for (let data of this.chooseTagsArr) {
                            let str = data.label.split('：')[1]
                            let a = this.currThirdTag.label
                            if (str == a) {
                                this.currThirdTag.checked = false
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                        }
                        //二级
                        for (let data of this.chooseTagsArr) {
                            let str = data.label.split('：')[1]
                            let a = this.currSecondTag.label
                            if (str == a) {
                                this.currSecondTag.checked = false
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                        }
                        //一级
                        for (let data of this.chooseTagsArr) {
                            if (data.label == tag1.label) {
                                tag1.checked = false
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                        }
                    }
                    // console.log(obj, tag2);

                    this.pushArr(obj, tag2);


                } else {
                    //取消选中
                    for (let data of this.chooseTagsArr) {
                        if (data.value == tag2.value) {
                            this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                        }
                    }
                }
            },
            pushArr(obj, item) {
                if (this.chooseTagsArr.length < 4) {
                    item ? item.checked = true : '';
                    this.chooseTagsArr.push(obj)

                } else {
                    item ? item.checked = false : '';
                    Message.warning("最多只能选择4个标签");
                }
            },
            //偏好标签-鼠标移入
            showUl(level, tag) {
                // console.log(level,tag);
                let arr = [];
                arr = tag.childer;
                if (tag.childer) {
                    if (level == 2) {
                        this.width = 264
                        this.thirdShow = true
                        this.forthShow = false
                        this.currSecondTag = tag
                        this.currentThirdList = arr
                    } else {
                        this.width = 396
                        this.forthShow = true
                        this.currThirdTag = tag
                        this.currentForthList = arr
                    }

                }

            },
            //排名列表
            getRankList() {
                console.log(this.chooseTagsArr);
                if (this.chooseTagsArr.length > 0) {
                    let ids = ''
                    for (let data of this.chooseTagsArr) {
                        ids += data.value + ','
                    }
                    ids = ids.substring(0, ids.length - 1);
                    api.getApi(this.apiVar.portrait + 'label/search', {ids: ids}).then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 200200) {
                            this.currentPlan = res.data.data
                        } else {
                            this.$message.warning(res.data.MSG)
                        }
                    })
                } else {
                    api.getApi(this.apiVar.portrait + 'label/search').then(res => {
                        console.log(res.data);
                        if (res.data.SysCode == 200200) {
                            this.currentPlan = res.data.data
                        } else {
                            this.$message.warning(res.data.MSG)
                        }
                    })
                }

            },
            //导出表格
            exportTable() {
            },
            //跳转画像详情
            gotoDetail() {
                this.$router.push('./portraitDetail')
            },
            //获取标签数据
            getTags() {
                api.getApi(this.apiVar.portrait + 'label/getLabels').then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        this.personTags = res.data.data
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            }

        },
        mounted() {
            this.getTags()
            this.getRankList()
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

    .checked-panel-wrap {
        padding: 0 32px;
    }

    .tab-content {
        position: relative;
        border: 1px solid rgba(224, 224, 224, 1);
        overflow: hidden;
    }

    .show-hide-btn {
        width: 100%;
        height: 42px;
        line-height: 42px;
        position: absolute;
        left: 0;
        bottom: 0;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%);
        text-align: center;
        color: rgba(0, 0, 0, 0.45);
        font-size: 14px;
        cursor: pointer;

    }

    .show-hide-btn.show {
        border-top: 1px solid #E0E0E0;
    }

    .show-hide-btn /deep/ .el-icon-d-arrow-left, .show-hide-btn /deep/ .el-icon-d-arrow-right {
        transform: rotateZ(270deg)
    }

    .first-tags {
        height: 232px;
        padding: 0 16px;

        transition: all 0.3s;
    }

    .first-tags-li {
        display: flex;
        box-sizing: border-box;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
        /*height: 48px;*/
        padding: 5px 0;
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
        padding: 4px 8px;
        cursor: pointer;
        float: left;
        margin-bottom: 2px;
        margin-top: 2px;
        margin-right: 4px;
    }

    .second-tags-li.active {
        color: #fff;
        background: #1890FF;
        border-radius: 2px;
    }

    .checked-panel {
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

    .checked-panel p span:first-child {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.35);
    }

    .checked-panel p span:last-child {
        color: #1890ff;
        cursor: pointer;
        font-size: 14px;
    }

    .checked-panel .el-icon-close {
        position: relative;
        right: -6px;
    }

    .checked-panel /deep/ .el-button {
        min-width: 40px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        padding: 0 12px 0 8px;
    }

    .table-wrap {
        padding: 24px 32px;
    }

    .table-wrap button {
        min-width: 0;
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
        padding: 0 32px 0 16px;
        border-bottom: 1px solid #E6E7E9;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .bottom h5 span:last-child {
        color: #1890ff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 400;
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
        padding: 5px 0;
        border-right: 1px solid #ebeef5;
        box-sizing: border-box;
        height: 140px;
    }

    .tag-li {
        cursor: pointer;
    }

    .second-tag-li {
        position: relative;
    }

    .third-tag-ul {
        position: absolute;
        left: 132px;
        top: 0px;
    }

    .forth-tag-ul {
        width: 132px;
        height: 140px;
        padding: 5px 0;
        position: absolute;
        left: 264px;
        top: 0px;

    }

    .tag-popover {
        border: none;
        box-shadow: none;
    }

    .check-wrap {
        height: 30px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
    }

    .check-wrap:hover {
        background: rgba(23, 143, 254, 0.08);
    }

    .first-tag-btn {
        display: inline-block;
        text-align: center;
        font-size: 14px;
        width: 76px;
        height: 26px;
        line-height: 26px;
        border-radius: 0;
        margin-right: 8px;
        color: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(194, 194, 194, 1);
        cursor: pointer;
        position: relative;
    }

    .first-tag-btn:focus {
        outline: none;
    }

    .first-tag-btn.active {
        border: 1px solid rgba(24, 144, 255, 1);
        color: #1890FF;
    }

    /*滚动条*/
    .tag-ul, .forth-tag-ul {
        height: 140px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .tag-ul::-webkit-scrollbar, .forth-tag-ul::-webkit-scrollbar {
        width: 4px;
        background: #fff;
    }

    .tag-ul::-webkit-scrollbar-thumb, .forth-tag-ul::-webkit-scrollbar-thumb { /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #D8D8D8;
        border-radius: 4px;
    }

    .first-tag-btn::before, .first-tag-btn.active::before {
        display: inline-block;
        content: '';
        width: 0;
        height: 0;
        border: 4px solid transparent;
        border-bottom-color: rgba(0, 0, 0, 0.35);
        border-right-color: rgba(0, 0, 0, 0.35);
        position: absolute;
        right: 2px;
        bottom: 2px;
        z-index: 10;
    }

    .first-tag-btn.active::before {
        border-bottom-color: rgba(24, 144, 255, 1);
        border-right-color: rgba(24, 144, 255, 1);
    }

    .btn {
        width: 100%;
        text-align: center;
        margin-bottom: 24px;
        margin-top: 16px;
    }

    .btn button {
        width: 74px;
        height: 32px;

    }

</style>
<style>
    .el-popper {
        min-width: 132px;
        border: none;
        border-radius: 0;
        padding: 0;
        /*height: 140px;*/
    }

    .el-popper[x-placement^=bottom] {
        margin-top: 4px;
    }
</style>
