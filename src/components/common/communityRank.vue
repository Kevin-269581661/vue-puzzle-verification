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
                                            <li class="second-tags-li" v-for="(second,index) in first.children"
                                                @click="chooseTags(first,second)" :class="second.checked?'active':''">
                                                {{second.label}}
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                                <div class="show-hide-btn" :class="showhideText=='展开'?'':'show'" @click="toggleShowTags">
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
                                                    v-for="(secondTag,index) in firstTag.children" :key="index"
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
                                                        <i v-if="thirdTag.children" class="el-icon-arrow-right"></i>
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
                    <el-button type="primary" >查 询</el-button>
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
                tabHeight:'232px',
                showhideText:'展开',
                width: 132,//面板宽度
                activeName: 'second',
                thirdShow: false,
                forthShow: false,
                currentThirdList: [],//当前展示的三级标签
                currentForthList: [],//当前展示的四级标签
                personTags: [],
                hobbyTags: [
                    {
                        "value": "1",
                        "label": "一级1",
                        "checked": false,
                        "hovered": false,
                        "children": [
                            {
                                "value": "121",
                                "label": "1二级1",
                                "checked": false,
                                "children": [{
                                    "value": "12131",
                                    "label": "1三级1",
                                    "children": [{
                                        "value": "12141",
                                        "label": "1四级1",
                                    }]
                                }]
                            },
                            {
                                "value": "122",
                                "label": "1二级2",
                                "checked": false,
                                "children": [{
                                    "value": "12231",
                                    "label": "1三级2",
                                    "checked": false,
                                    "children": [{
                                        "value": "12241",
                                        "label": "1四级2",
                                    }]
                                }]
                            },
                            {
                                "value": "123",
                                "label": "1二级1",
                                "checked": false,
                                "children": [{
                                    "value": "12331",
                                    "label": "1三级1",
                                    "checked": false,
                                    "children": [{
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
                                "children": [{
                                    "value": "12431",
                                    "label": "1三级2",
                                    "checked": false,
                                    "children": [{
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
                                "children": [{
                                    "value": "12531",
                                    "label": "1三级1",
                                    "checked": false,
                                    "children": [{
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
                                "children": [{
                                    "value": "12631",
                                    "label": "1三级2",
                                    "checked": false,
                                    "children": [{
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
                        "children": [
                            {
                                "value": "221",
                                "label": "2二级",
                                "checked": false,
                                "children": [{
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
                        "children": [
                            {
                                "value": "321",
                                "label": "3二级",
                                "checked": false,
                                "children": [{
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
            //展开收起面板
            toggleShowTags(){
                if(this.tabHeight=='232px'){
                    this.tabHeight = '452px'
                    this.showhideText = '收起'
                }else{
                    this.tabHeight = '232px'
                    this.showhideText = '展开'
                }
            },
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            //人群标签-选中标签
            chooseTags(first, second) {
                console.log(first, this.chooseTagsArr);
                let str = first.label + '：' + second.label
                let obj = {
                    label: str,
                    value: second.value
                }
                if (second.checked) {
                    //取消选中
                    second.checked = false
                    for (let data of this.personTags) {
                        for (let data2 of data.children) {
                            if (data2.label == second) {
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(str), 1);
                            }
                        }
                    }

                } else {
                    //选中
                    this.pushArr(obj, second)
                    this.filterArr(first)
                }

            },
            //选中的标签数组 取交集
            filterArr(arr){
                let a = [...this.chooseTagsArr]//展示的标签数组
                let b = [...arr.children]//该标签的下级标签数组
                //交集
                let intersect = a.filter(x => [...b].some(y => y.label === x.label.split('：')[1]))
                console.log('交集--',intersect);
                if(intersect.length == b.length){
                    //可合并部分标签。取差集
                    // console.log('合并部分标签前',this.chooseTagsArr);
                    this.chooseTagsArr =a.filter(x => [...b].every(y => y.label !== x.label.split('：')[1]))
                    //加上一个新的一级标签
                    let obj = {
                        value:arr.value,
                        label:arr.label
                    }
                    this.chooseTagsArr.push(obj)
                    console.log('合并部分标签后',this.chooseTagsArr);
                }

            },
            //删除选择的标签
            cancelChooseTag(item) {
                console.log(item);
                let tag = item.label.split('：')[1]
                for (let data of this.personTags) {
                    for (let data2 of data.children) {
                        if (data2.label == tag) {
                            data2.checked = 0
                        }
                    }
                }
                // for (let data of this.hobbyTags) {
                //     for (let data2 of data.children) {
                //         if (data2.label == tag) {
                //             data2.checked = 0
                //         }
                //     }
                // }
                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(item), 1);

            },
            //清空所有标签
            clearAllTag() {
                this.chooseTagsArr = [];
                for (let data of this.personTags) {
                    for (let item of data.children) {
                        if (item.checked) {
                            item.checked = false
                        }
                    }
                }
                for (let data of this.hobbyTags) {
                    data.checked = false
                    if (data.children) {
                        for (let data2 of data.children) {
                            data2.checked = false
                            if (data2.children) {
                                for (let data3 of data2.children) {
                                    data3.checked = false
                                    if (data3.children) {
                                        for (let data4 of data3.children) {
                                            data4.checked = false
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                console.log(this.hobbyTags);
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
                        for(let data of this.chooseTagsArr){
                            if(data.label == tag1.label){
                                tag1.checked = false
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                        }
                    } else if (level == 3) {
                        let temp = ''
                        for (let data of tag1.children) {
                            for (let data2 of data.children) {
                                if (data2.value == tag2.value) {
                                    temp = data2
                                    obj.label = tag1.label + '/' + data.label + '：' + data2.label
                                    obj.value = data2.value
                                }

                            }
                        }
                        // //判断是否选中上级，去掉选中
                        for(let data of this.chooseTagsArr){
                            console.log(data,temp.label);
                            let str = data.label.split('：')[0]
                            if( str == temp.label.split('：')[0]){
                                temp.checked = false
                                this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                            }
                        }
                    } else {
                        for (let data of tag1.children) {
                            for (let data2 of data.children) {
                                for (let data3 of data2.children) {
                                    if (data3.value == tag2.value) {
                                        obj.label = tag1.label + '/' + data.label + '/' + data2.label + '：' + data3.label
                                        obj.value = data3.value
                                    }
                                }
                            }
                        }

                    }
                    // console.log(obj, tag2);

                    this.pushArr(obj, tag2);


                } else {
                    //取消选中
                   for(let data of this.chooseTagsArr){
                       if(data.value == tag2.value){
                           this.chooseTagsArr.splice(this.chooseTagsArr.indexOf(data), 1);
                       }
                   }
                }
            },
            pushArr(obj, item) {
                if (this.chooseTagsArr.length < 4) {
                    item?item.checked = true:'';
                    this.chooseTagsArr.push(obj)

                } else {
                    item?item.checked = false:'';
                    Message.warning("最多只能选择4个标签");
                }
            },
            //偏好标签-鼠标移入
            showUl(level, tag) {
                // console.log(level,tag);
                let arr = [];
                arr = tag.children;
                if (tag.children) {
                    if (level == 2) {
                        this.width = 264
                        this.thirdShow = true
                        this.forthShow = false
                        this.currentThirdList = arr
                    } else {
                        this.width = 396
                        this.forthShow = true
                        this.currentForthList = arr
                    }

                }

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

    .checked-panel-wrap {
        padding: 0 32px;
    }
    .tab-content{
        position: relative;
        border: 1px solid rgba(224, 224, 224, 1);
        overflow: hidden;
    }
    .show-hide-btn{
        width: 100%;
        height: 42px;
        line-height: 42px;
        position: absolute;
        left: 0;
        bottom: 0;
        background:linear-gradient(180deg,rgba(255,255,255,0) 0%,rgba(255,255,255,1) 100%);
        text-align: center;
        color:rgba(0,0,0,0.45);
        font-size: 14px;
        cursor: pointer;

    }
    .show-hide-btn.show{
        border-top: 1px solid #E0E0E0;
    }
    .show-hide-btn /deep/ .el-icon-d-arrow-left, .show-hide-btn /deep/ .el-icon-d-arrow-right{
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
    .btn{
        width: 100%;
        text-align: center;
        margin-bottom: 24px;
        margin-top: 16px;
    }
    .btn button{
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
        height: 140px;

    }

    .el-popper[x-placement^=bottom] {
        margin-top: 4px;
    }
</style>
