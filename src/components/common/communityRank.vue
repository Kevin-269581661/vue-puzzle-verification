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
                <div class="choose-panel">
                    <div>
                        <el-button plain  v-for="(tag,index) in chooseTagsArr" :key="index" size="mini" @click="cancelChooseTag(tag)">{{tag}}<i class="el-icon-close"></i></el-button>
                    </div>
                    <span @click="clearAllTag">清空条件</span>
                </div>
            </div>
            <div class="bottom">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "communityRank",
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
                chooseTagsArr: []
            };
        },
        methods: {
            handleClick(tab, event) {
                console.log(tab, event);
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
                    second.flag = 1
                    this.chooseTagsArr.push(str)
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
            }
        }
    }
</script>

<style scoped>
    .content-wrap {
        margin: 0 64px;
    }

    .top {
        background: #fff;
        border: 1px solid rgba(230, 231, 233, 1);
    }

    .top /deep/ .el-tabs__nav-wrap {
        padding: 0 14px;
    }

    .tab-content-wrap {
        padding: 24px 32px;
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
</style>
