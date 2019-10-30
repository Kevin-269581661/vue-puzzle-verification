<template>
    <div class="community-rank">
        <div class="ad_mediaDetail_nav ">
            <p><a href="#" style="color: #999">社区排名</a></p>
            <div class="portrait_header_select">
                <el-dropdown @command="selectAsrIdFun">
                    <p class="el-dropdown-link">
                        {{currCompany.asrName}}<i class="el-icon-arrow-down el-icon--right"></i>
                    </p>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item v-for="(item,index) in companyList" :key="index" :command="item">
                            {{item.asrName}}
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
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
                                        style="padding: 0"

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
                                                    <div class="check-wrap" :class="secondTag.hovered?'hover':''">
                                                        <el-checkbox v-model="secondTag.checked"
                                                                     @change="tagChecked($event,2,firstTag,secondTag)">
                                                            {{secondTag.label}}
                                                        </el-checkbox>
                                                        <i class="el-icon-arrow-right" v-if="secondTag.childer"></i>
                                                    </div>

                                                </li>
                                            </ul>
                                            <ul class="third-tag-ul tag-ul"
                                                v-if="thirdShow">
                                                <li class="third-tag-li tag-li"
                                                    v-for="(thirdTag,index) in currentThirdList" :key="index"
                                                    @mouseenter="showUl(3,thirdTag)">
                                                    <div class="check-wrap" :class="thirdTag.hovered?'hover':''">
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
                            <span class="txt">已选{{chooseTagsArr.length}}个标签，默认交集组合查询</span>
                            <span class="btn" @click="clearAllTag" v-if="chooseTagsArr.length>0">清空条件</span>
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
                                width="50">
                                <template slot-scope="scope">
                                    <span>{{scope.row.rank || '--'}}</span>
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
                                    <span>{{scope.row.asCount || '--'}}</span>
                                </template>
                            </el-table-column>
                            <!--<el-table-column-->
                                <!--prop="action"-->
                                <!--label="操作"-->
                                <!--min-width="80"-->
                            <!--&gt;-->
                                <!--<template slot-scope="scope">-->
                                    <!--<el-button type="text" @click="gotoDetail(scope.row)">画像详情</el-button>-->
                                <!--</template>-->
                            <!--</el-table-column>-->
                            <div slot="empty">
                                <no-search-result></no-search-result>
                            </div>
                        </el-table>
                    </div>
                    <div class="ad_pagination" v-if="total">
                        <el-pagination
                            background
                            layout="total, sizes, prev, pager, next, jumper"
                            @current-change="changePage"
                            @size-change="sizeChange"
                            :page-sizes="[10, 20, 50]"
                            :current-page.sync="currPage"
                            :page-size="pageSize"
                            :total="total">
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
                // 默认选择的公司
                currCompany: '',
                companyList: [],
                tabHeight: '252px',
                showhideText: '展开',
                width: 144,//面板宽度
                activeName: 'first',
                thirdShow: false,
                forthShow: false,
                currSecondTag: '',//当前选中的二级标签
                currThirdTag: '',//当前选中的三级标签
                currentThirdList: [],//当前展示的三级标签列表
                currentForthList: [],//当前展示的四级标签列表
                personTags: [],
                hobbyTags: [],
                chooseTagsArr: [],
                // 表格数据
                currentPlan: [],
                //加载中
                loading: false,
                currPage: 1,
                pageSize: 10,
                total: 0,
                ids: '',

            };
        },
        methods: {
            // 平台商公司列表
            getCompanyList() {
                this.portraitInfo = JSON.parse(sessionStorage.getItem('portraitInfo'))
                console.log(this.portraitInfo);
                // 选中的公司
                this.currCompany = this.portraitInfo[0]
                let arr = []
                for (let key of this.portraitInfo) {
                    arr.push({
                        asrId: key.asrId,
                        asrName: key.asrName,
                    })
                }
                this.companyList = arr
                console.log('companyList', this.companyList)
            },
            // 选择公司
            selectAsrIdFun(item) {
                this.currCompany = item
            },
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.format(price);
            },
            //展开收起面板
            toggleShowTags() {
                //482
                console.log(document.body.clientWidth);
                if (this.tabHeight == '252px') {
                    this.tabHeight = document.body.clientWidth < 1370 ? '482px' : '452px'
                    this.showhideText = '收起'
                } else {
                    this.tabHeight = '252px'
                    this.showhideText = '展开'
                }
            },
            handleClick(tab, event) {
                // console.log(tab, event);
                // this.getTags()

            },
            //人群标签-选中和取消标签
            chooseTags(first, second) {
                console.log(second, this.chooseTagsArr);
                let obj = {
                    label: first.label + '：' + second.label,
                    value: second.value
                };
                if (second.checked) {
                    //取消选中当前二级
                    second.checked = false;
                    //一级被选中
                    if (first.checked) {
                        //取消选中
                        first.checked = false;
                        if (this.chooseTagsArr.length < 4) {
                            for (let data of this.chooseTagsArr) {
                                if (data.value == first.value) {
                                    this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                                }
                            }
                            for (let data of first.childer) {
                                if (data.checked) {
                                    let a = {
                                        value: data.value,
                                        label: first.label + '：' + data.label
                                    }

                                    this.chooseTagsArr.push(a)

                                }
                            }
                        }
                    } else {
                        for (let data of this.chooseTagsArr) {
                            if (data.value == second.value) {
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                        }
                    }

                } else {
                    //选中
                    second.checked = true
                    // this.chooseTagsArr.push(obj)
                    this.filterArr(first, second)
                }


            },
            //选中的标签数组 取交集
            filterArr(arr, second) {
                // console.log(arr);
                let a = [...this.chooseTagsArr]//展示的标签数组
                let b = [...arr.childer]//该标签的下级标签数组
                //交集
                let intersect = a.filter(x => [...b].some(y => y.label === x.label.split('：')[1]))
                console.log('交集--', intersect);
                if (intersect.length == b.length - 1) {
                    //可合并部分标签。取差集
                    this.$message({showClose: true, message: arr.label + '不限，不占用所选标签数', type: 'info'})
                    this.chooseTagsArr = a.filter(x => [...b].every(y => y.label !== x.label.split('：')[1]))
                    for (let data of this.personTags) {
                        if (data.value == arr.value) {
                            data.checked = true
                        }
                    }

                } else {
                    let obj = {
                        label: arr.label + '：' + second.label,
                        value: second.value
                    };
                    this.pushArr(obj, second)
                }


                console.log('合并部分标签后', this.chooseTagsArr);
            },

            //删除单个的标签
            cancelChooseTag(item) {
                console.log(item);
                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(item), 1);
                for (let data of this.personTags) {
                    let tag = item.label.split('：')[1]
                    if (data.childer) {
                        for (let data2 of data.childer) {
                            if (data2.label == tag) {
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


                //判断一级是否仍然选中
                let firstTag = item.label.split('：')[0].split('/')[0]
                for (let data of this.hobbyTags) {
                    if (firstTag == data.label && data.childer) {
                        let flag = data.childer.some(a => a.checked == true)
                        if (!flag) {
                            data.checked = false
                        }
                    }
                }

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
                        let arr = [...this.chooseTagsArr]
                        for (let data of this.chooseTagsArr) {
                            let a = data.label.split('：')[0]
                            if (data.label.includes('：') && a.includes(obj.label)) {
                                console.log(data.label);
                                arr.splice(arr.indexOf(data), 1);
                                // console.log(this.chooseTagsArr);
                                if (data.childer) {
                                    this.clear(data, 'split')
                                }
                            }

                        }
                        this.chooseTagsArr = arr

                    }
                    for (let data of obj.childer) {
                        data.checked = false
                        if (data.childer) {
                            this.clear(data.childer)
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
                this.getRankList();
            },
            // 每页条数切换
            sizeChange(val) {
                this.pageSize = val;
                this.currPage = 1;
                this.getRankList();
            },
            //移入移出一级标签
            showPopver(firstTag) {
                firstTag.hovered = true
            },
            hidePopver(firstTag) {
                // console.log(this.thirdShow);
                let that = this
                setTimeout(() => {
                    //此一级标签下有没有hover的标签 有为true 无为false
                    let flag = firstTag.childer.some(item => item.hovered == true)
                    // console.log(flag);
                    if (!flag) {
                        //直接离开 面板消失
                        firstTag.hovered = false
                    }

                }, 100)


            },
            //进入和离开面板
            enterPopver(firstTag) {
                // console.log('进入');
                firstTag.hovered = true
            },
            leavePopver(firstTag) {
                // console.log('从面板离开');
                firstTag.hovered = false;
                //重置数据
                this.width = 144;
                this.thirdShow = false;
                this.forthShow = false;
                this.currentThirdList = [];
                this.currentForthList = [];
                let fn = function (arr) {
                    for (let data of arr) {
                        data.hovered = false
                        if (data.childer) {
                            fn(data.childer)
                        }
                    }
                }
                fn(this.hobbyTags)
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
                    // tag1.checked = true
                    if (level == 2) {
                        obj.label = tag1.label + '：' + tag2.label
                        obj.value = tag2.value;
                        //判断是否选中上级，去掉选中
                        let arr = [...this.chooseTagsArr]
                        for (let data of this.chooseTagsArr) {
                            if (data.label == tag1.label) {
                                tag1.checked = false
                                arr.splice(arr.indexOf(data), 1);
                            }
                            //是否选中下级
                            let a = data.label.split('：')[0].split('/')[1];
                            if (a == tag2.label) {
                                arr.splice(arr.indexOf(data), 1);
                                //清空所有下级
                                this.clear(tag2.childer)
                            }
                        }
                        this.chooseTagsArr = arr

                    } else if (level == 3) {
                        for (let data of tag1.childer) {
                            if (data.childer) {
                                for (let data2 of data.childer) {
                                    if (data2.value == tag2.value) {
                                        obj.label = tag1.label + '/' + data.label + '：' + data2.label
                                        obj.value = data2.value
                                    }
                                }
                            }

                        }
                        //判断是否选中上级，去掉选中
                        let arr = [...this.chooseTagsArr]
                        for (let data of this.chooseTagsArr) {
                            if (data.label == tag1.label) {
                                tag1.checked = false
                                arr.splice(arr.indexOf(data), 1);
                            }
                        }
                        for (let data of this.chooseTagsArr) {
                            let str = data.label.split('：')[1]
                            let a = this.currSecondTag.label
                            if (str == a) {
                                this.currSecondTag.checked = false
                                arr.splice(arr.indexOf(data), 1);
                            }
                            //是否选中下级
                            let b = data.label.split('：')[0].split('/')[2];
                            if (b == tag2.label) {
                                arr.splice(arr.indexOf(data), 1);
                                //清空所有下级
                                this.clear(tag2.childer)
                            }
                        }
                        this.chooseTagsArr = arr
                    } else {
                        for (let data of tag1.childer) {
                            if (data.childer) {
                                for (let data2 of data.childer) {
                                    if (data2.childer) {
                                        for (let data3 of data2.childer) {
                                            if (data3.value == tag2.value) {
                                                obj.label = tag1.label + '/' + data.label + '/' + data2.label + '：' + data3.label
                                                obj.value = data3.value
                                            }
                                        }
                                    }

                                }
                            }

                        }
                        //判断是否选中上级，去掉选中
                        let arr = [...this.chooseTagsArr]
                        //三级
                        for (let data of this.chooseTagsArr) {
                            let str = data.label.split('：')[1]
                            let a = this.currThirdTag.label
                            if (str == a) {
                                this.currThirdTag.checked = false
                                arr.splice(arr.indexOf(data), 1);
                            }
                        }
                        //二级
                        for (let data of this.chooseTagsArr) {
                            let str = data.label.split('：')[1]
                            let a = this.currSecondTag.label
                            if (str == a) {
                                this.currSecondTag.checked = false
                                arr.splice(arr.indexOf(data), 1);
                            }
                        }
                        //一级
                        for (let data of this.chooseTagsArr) {
                            if (data.label == tag1.label) {
                                tag1.checked = false
                                arr.splice(arr.indexOf(data), 1);
                            }
                        }
                        this.chooseTagsArr = arr
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
                    //此一级标签下是否没有选中的标签 有为true 无为false
                    let flag = tag1.childer.some(item => item.checked == true)
                    // console.log(flag);
                    if (!flag) {
                        tag1.checked = false
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
                tag.hovered = true
                if (level == 2) {
                    this.width = 288
                    this.forthShow = false
                    this.currSecondTag = tag

                    if (tag.childer) {
                        this.currentThirdList = arr
                        this.thirdShow = true
                    } else {
                        this.width = 144
                        this.thirdShow = false
                    }
                    for (let data of this.hobbyTags) {
                        if (data.childer) {
                            for (let data2 of data.childer) {
                                if (data2.value == tag.value) {
                                    data2.hovered = true
                                } else {
                                    data2.hovered = false
                                }
                            }
                        }
                    }

                } else {
                    this.width = 432
                    this.currThirdTag = tag
                    if (tag.childer) {
                        this.currentForthList = arr
                        this.forthShow = true
                    } else {
                        this.width = 288
                        this.forthShow = false
                    }

                    for (let data of this.currentThirdList) {
                        if (data.value == tag.value) {
                            data.hovered = true
                        } else {
                            data.hovered = false
                        }
                    }

                }


            },

            //排名列表
            getRankList() {
                // console.log(this.chooseTagsArr);
                this.loading = true
                let info = {
                    pageNum: this.currPage,
                    pageSize: this.pageSize,
                    asrId: this.currCompany.asrId
                }
                if (this.chooseTagsArr.length > 0) {
                    let ids = ''
                    for (let data of this.chooseTagsArr) {
                        ids += data.value + ','
                    }
                    this.ids = ids.substring(0, ids.length - 1);
                    info.ids = this.ids
                }
                api.getApi(this.apiVar.portrait + 'label/search', info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        this.total = res.data.data.total
                        this.currentPlan = res.data.data.list;
                        this.loading = false
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            },
            //导出表格
            exportTable() {
                let info = {
                    ids: this.ids,
                    asrId: this.currCompany.asrId,
                    // responseType: 'arraybuffer',
                }
                api.getApi_file(this.apiVar.portrait + 'label/export', info).then(res => {
                    let blob = new Blob([res.data], {type: 'application/ms-download;charset=utf-8'});
                    let downloadElement = document.createElement('a');
                    let href = window.URL.createObjectURL(blob);    //创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = '社区排名-' + new Date().getFullYear() + (new Date().getMonth() + 1) + new Date().getDate() + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + '.xls'; //下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click();                        //点击下载
                    document.body.removeChild(downloadElement);     //下载完成移除元素
                    window.URL.revokeObjectURL(href);               //释放掉blob对象

                })
            },
            //跳转画像详情
            gotoDetail() {
                this.$router.push('./portraitDetail')
            },
            //获取标签数据
            getTags(type, parentId) {
                let info = ''
                info = {
                    type: type == 'first' ? 0 : 1,
                    loadChilder: 1,
                    parentId: parentId ? parentId : 0,
                }
                api.getApi(this.apiVar.portrait + 'label/getLabels', info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        // type == 'first' ? this.personTags = res.data.data : this.hobbyTags = res.data.data
                        if (type == 'first') {
                            this.personTags = res.data.data
                        } else {
                            for (let data of res.data.data) {
                                data.hovered = false
                            }

                            this.hobbyTags = res.data.data
                            console.log(this.hobbyTags);
                        }
                    } else {
                        this.$message.warning(res.data.MSG)
                    }
                })
            }

        },
        mounted() {
            this.getCompanyList()
            this.getTags('first')
            this.getTags('second')
            this.getRankList()
        }
    }
</script>

<style scoped>
    .ad_mediaDetail_nav {
        position: relative;
    }

    .portrait_header_select {
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }

    .portrait_header_select /deep/ .el-dropdown-link {
        /*border-bottom-right-radius: unset;*/
        /*border-top-right-radius: unset;*/
        /*padding-left: 4px;*/
        background: rgba(0, 0, 0, 0);
        color: #999;
        border: none;
        text-align: center;
        padding-left: 0;
        font-size: 14px;
    }

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

    .top /deep/ .el-tabs__header {
        margin-bottom: 0;
    }

    .top /deep/ .el-tabs__nav-wrap::after {
        height: 1px;
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

    .checked-panel p .txt {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.35);
    }

    .checked-panel p .btn {
        color: #1890ff;
        cursor: pointer;
        font-size: 14px;
        margin-left: 14px;
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
        padding: 12px 24px 0;
        border-bottom: 1px dashed rgba(0, 0, 0, 0.12);
    }

    .hobby-tags-li:last-child {
        border-bottom: none;
    }

    .hobby-tags-li span {
        margin-bottom: 12px;
    }

    /deep/ .el-table__body-wrapper {
        overflow-y: hidden;
    }

    .tag-ul {
        width: 144px;
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
        left: 144px;
        top: 0px;
    }

    .forth-tag-ul {
        width: 144px;
        height: 140px;
        padding: 5px 0;
        position: absolute;
        left: 288px;
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

    .check-wrap:hover, .check-wrap.hover {
        background: rgba(23, 143, 254, 0.08);
    }

    .check-wrap /deep/ .el-checkbox {
        width: 100%;
        height: 100%;
        line-height: 30px;
    }

    .first-tag-btn {
        display: inline-block;
        text-align: center;
        font-size: 14px;
        min-width: 76px;
        height: 26px;
        padding: 0 8px;
        box-sizing: border-box;
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
    .tag-popover {
        min-width: 132px ;
        border: none ;
        border-radius: 0 ;
        padding: 0 ;
        /*height: 140px;*/
    }

    .tag-popover[x-placement^=bottom] {
        margin-top: 4px ;
    }
</style>
