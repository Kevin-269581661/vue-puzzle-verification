<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav">
            <p>
                <a href="#" style="color: #999">常见问题</a>
            </p>
        </div>
        <el-container class="container">
            <el-aside class="qna-aside" width="280px">
                <div class="input">
                    <el-input v-model="keyword" placeholder="请输入问题关键词" @keyup.enter.native="enterFun($event)" clearable
                              @clear="clearSearch"></el-input>
                    <div class="icon" @click="searchFun"><i class="el-icon-search"></i></div>
                </div>
                <div class="scroll">
                    <el-menu
                        :default-active="activeName"
                        class="el-menu-vertical-demo"
                        @select="handleSelect"
                    >
                        <label v-for="(item,index) in qnaData" :key="index">
                            <el-menu-item class="pl30" v-if="!item.children" :index="item.index">
                                <span slot="title">{{item.menuName}}</span>
                            </el-menu-item>
                            <el-submenu v-else :index="item.index">
                                <template slot="title">
                                    <span>{{item.menuName}}</span>
                                </template>
                                <el-menu-item-group>
                                    <el-menu-item v-for="(q,i) in item.children" :key="i" :index="q.index">
                                        {{q.menuName}}
                                    </el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                        </label>
                    </el-menu>
                </div>
            </el-aside>
            <el-main>
                <div class="scroll" style="height: 100%">
                    <keep-alive>
                        <!--<component :is="comName" ></component>-->
                        <question-list :mainInfo="mainInfo" @callbackAnswer="handleAnswer"
                                       v-if="componentType==1"></question-list>
                        <answer-panel :answerData="answerData" v-if="componentType==2"
                                      @callbackComponentType="handleBack"></answer-panel>
                        <search-result :searchData="searchData" v-if="componentType==3"
                                       @callbackResult="handleResult"></search-result>
                    </keep-alive>
                </div>

            </el-main>
        </el-container>
    </div>
</template>

<script>

    import questionList from './components/questionList'
    import answerPanel from './components/answerPanel'
    import searchResult from './components/searchResult'
    import qnaData from '../../commonFun/json/qnaData.json'

    export default {
        name: "questionAndAnswer",
        components: {

            questionList,
            answerPanel,
            searchResult
        },
        data() {
            return {
                activeName: '1',
                // comName: '',
                keyword: '',
                qnaData: '',
                mainInfo: {},
                answerData: {},
                searchData: {},
                componentType: 1,//显示的组件类型 1.问题列表 2.答案面板 3.搜索结果
            }
        },
        mounted() {
            this.qnaData = qnaData;
            let questionInfo = JSON.parse(sessionStorage.getItem('questionInfo'))
            if (questionInfo.fromPage == 'fastMenu') {
                if (questionInfo.type !== 'other') {
                    if (questionInfo.question.index) {
                        this.componentType = 2
                        this.answerData = questionInfo.question
                        this.activeName = questionInfo.question.index
                    } else {
                        this.activeName = questionInfo.index
                        this.componentType = 1
                        this.handleSelect(this.activeName)
                    }
                } else {
                    this.activeName = '1'
                    this.componentType = 1
                    this.mainInfo = qnaData[0];
                }
            }

            // console.log(this.qnaData);
        },
        methods: {
            //点击菜单
            handleSelect(index) {
                console.log(index);
                this.activeName = index;
                this.componentType = 1
                for (let value of this.qnaData) {
                    if (value.children) {
                        for (let v of value.children) {
                            if (v.index == index) {
                                this.mainInfo = v
                            }
                        }

                    } else {
                        if (value.index == index) {
                            this.mainInfo = value
                        }
                    }
                }

                // console.log(this.mainInfo);

            },
            //问题列表点击问题
            handleAnswer(data) {
                this.answerData = data
                sessionStorage.setItem('questionInfo', JSON.stringify({'fromPage': 'answer'}))
                this.componentType = 2
            },
            //答案面板点击返回
            handleBack(type) {
                // console.log(type, this.activeName);
                this.componentType = type
                if(sessionStorage.getItem('questionInfo').fromPage =='search'){
                    this.handleSelect(this.activeName)
                }
            },
            //搜索
            searchFun() {
                console.log(this.keyword);
               if(this.keyword){
                   this.searchData = {}
                   this.componentType = 3
                   let keyword = this.keyword;
                   let result = []
                   let arr = [...this.qnaData]
                   // console.log(arr);
                   arr.forEach((item, index) => {
                           if (item.question) {
                               //
                               for (let data of item.question) {
                                   if (data.title.includes(keyword) || data.answer.includes(keyword)) {
                                       let aWord = this.getText(data.answer).split('。')
                                       let obj = {
                                           id: data.id,
                                           path: data.path,
                                           title: data.title.split(keyword).join("<em class='f-color'>" + keyword + "</em>"),
                                           answer: data.answer,
                                       }

                                       if (data.path == '合同下载') {
                                           var re = /<a[^>]*href=['"]([^"]*)['"][^>]*>(.*?)<\/a>/g;
                                           // console.log(re.exec(data.answer)[2]);
                                           obj.answer = re.exec(item)[2].split(keyword).join("<em class='f-color'>" + keyword + "</em>")
                                       }
                                       for (let item of aWord) {
                                           if (item.includes(keyword)) {
                                               obj.answer = item.split(keyword).join("<em class='f-color'>" + keyword + "</em>")
                                           }
                                       }
                                       result.push(obj)
                                   }
                               }
                           }
                           else {
                               for (let value of item.children) {
                                   for (let data of value.question) {
                                       if (data.title.includes(keyword) || data.answer.includes(keyword)) {
                                           let aWord = this.getText(data.answer).split('。')
                                           // console.log(data.title, aWord);
                                           let obj = {
                                               id: data.id,
                                               path: data.path,
                                               title: data.title.split(keyword).join("<em class='f-color'>" + keyword + "</em>"),
                                               answer: data.answer,
                                           }
                                           for (let item of aWord) {
                                               if (item.includes(keyword)) {
                                                   obj.answer = item.split(keyword).join("<em class='f-color'>" + keyword + "</em>")
                                               }
                                           }
                                           result.push(obj);
                                       }
                                   }
                               }
                           }
                       }
                   );
                   this.searchData = {
                       list: result,
                       keyword: keyword
                   };
               }
                // console.log(this.searchData);
            },
            //去掉字符串里的标签
            getText(str) {
                var pattern =  /<\/?.+?\/?>/g
                // console.log(str.replace(pattern, ''));
                return (str.replace(pattern, ''))
            },
            //清空搜索框
            clearSearch() {
                this.keyword = ''
                this.qnaData.forEach((value, key) => {
                    if (value.children) {
                        value.children.forEach((v, k) => {
                            if (v.index == this.activeName) {
                                this.mainInfo = v
                            }
                        })
                    } else {
                        if (value.index == this.activeName) {
                            this.mainInfo = value
                        }
                    }
                })
                this.componentType = 1
            },
            //点击搜到的问题
            handleResult(title) {
                console.log(title);
                title = this.getText(title)
                for (let data of this.qnaData) {
                    if (data.question) {
                        for (let i of data.question) {
                            if (title == i.title) {
                                this.answerData = i;
                                sessionStorage.setItem('questionInfo', JSON.stringify({'fromPage': 'search'}))
                                this.componentType = 2
                            }
                        }
                    } else {
                        for (let i of data.children) {
                            for (let j of i.question) {
                                if (title == j.title) {
                                    this.answerData = j;
                                    sessionStorage.setItem('questionInfo', JSON.stringify({'fromPage': 'search'}))
                                    this.componentType = 2
                                }
                            }
                        }
                    }

                }

            },
            //键盘回车
            enterFun(ev) {
                let e = ev || window.ev;
                if (e.keyCode === 13) {
                    this.searchFun()
                }
            }
        }

    }
</script>

<style scoped>
    .ad_mediaDetail_wrap {
        position: absolute;
        width: 100%;
        bottom: 60px;
        top: 60px;

    }

    .container {
        height: 78vh;
    }

    .el-aside {
        background: #ffffff;
        color: #333;
        text-align: left;
        padding: 32px 0;
        box-sizing: border-box;
        border-right: 1px solid #e5e6e9;
        padding-right: 6px;
    }

    .el-aside, .el-main {
        overflow: hidden;
    }

    /*!*滚动条*!*/
    .scroll {
        height: 95%;
        overflow-y: scroll;
    }

    .scroll::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 4px; /*高宽分别对应横竖滚动条的尺寸*/
    }

    .scroll::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 4px;
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0.2);
        background: rgba(0, 0, 0, 0.2);
    }

    .scroll::-webkit-scrollbar-track {
        /*滚动条里面轨道*/
        -webkit-box-shadow: inset 0 0 0px rgba(0, 0, 0, 0);
        border-radius: 0;
        background: #fafafa;
    }

    .qna-aside /deep/ .el-input {
        margin-bottom: 10px;
    }

    .el-menu {
        /*height: 100%;*/
        border-right: none;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
    }

    .qna-aside /deep/ .el-menu-item.is-active, .qna-aside /deep/ .el-menu-item.is-active:focus, .el-menu-item.is-active:hover {
        background-color: #e9f7fe;
        border-right: 2px solid #1890ff;
        color: #1890ff;
        font-weight: bold;
    }

    /deep/ .el-menu-item, .el-submenu__title {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        padding-left: 48px !important;
    }

    /deep/ .el-menu-item.pl30 {
        padding-left: 32px !important;
    }

    .qna-aside /deep/ .el-submenu__title {
        font-size: 14px;
        height: 40px;
        line-height: 40px;
        padding-left: 32px !important;

    }

    .qna-aside /deep/ .el-menu-item:focus, .el-menu-item:hover, .qna-aside /deep/ .el-submenu__title:hover {
        background-color: #fff;
        color: #1890ff;
    }

    .qna-aside /deep/ .el-submenu.is-active .el-submenu__title i {
        color: rgba(0, 0, 0, 0.5);
    }

    .qna-aside /deep/ .el-menu-item-group__title {
        padding: 0;
    }

    .el-main {
        background-color: #fff;
        color: #333;
        padding: 16px;
        /*height: 740px;*/
    }

    .ad_mediaDetail_wrap .el-container {
        border: 1px solid #E6E7E9;
        margin: 0 60px;
        box-sizing: border-box;
    }

    .input {
        position: relative;
        margin: 0 16px;
    }

    .input .icon {
        width: 30px;
        height: 32px;
        text-align: center;
        line-height: 32px;
        color: #d9d9d9;
        position: absolute;
        right: 0;
        top: 0;
        cursor: pointer;
    }

    .input /deep/ .el-input__suffix {
        right: 30px;
    }

    .input /deep/ .el-input--suffix .el-input__inner {
        height: 32px;
    }


</style>
<style>
    .ad_mediaDetail_wrap .el-collapse {
        border-top: none;
    }

</style>
