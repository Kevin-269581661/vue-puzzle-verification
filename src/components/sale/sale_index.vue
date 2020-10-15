<template>
    <div>
        <div class="ad_index_container">
            <home-top :user-info="userInfo" :data-arr="dataArr" :honor-img="companyHonor"></home-top>
            <div style="margin:24px 0;display:flex;">
                <div style="width:66%;border: 1px solid #e5e6e9;">
                    <h2 class="h2_style">常用模块</h2>
                    <home-link :link="linkArr"></home-link>
                </div>
                <div style="width:33%; margin-left:24px;background:#fff;border: 1px solid #e5e6e9;">
                    <h2 class="h2_style">您的助手</h2>
                    <div class="loglist_box">
                        <p class="time_box">
                            <span class="time">{{saleTalk.dateTime}}</span>
                        </p>
                        <div class="info_box">
                            <img :src="saleTalk.imgurl" alt="">
                            <div class="info_content">
                                <span>{{userInfo.username}}, 您{{saleTalk.content}}</span>
                                <div class="info_arrow"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="app-center-item" id="appCenter">
                <!--isPlatform-->
                <h2 class="h2_style"><span @click="goToPage()">应用中心 <i class="el-icon-arrow-right"></i></span></h2>
                <ul :style="{height:isSlideDown?'254px':'510px'}">
                    <li v-for="item in appCenter" @click="goToPage(item)">
                        <div class="item-left">
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <div class="item-right">
                            <h5>{{item.title}}</h5>
                            <el-tooltip popper-class="desc-tooltip" effect="dark" :content="item.desc" placement="top" v-model="item.descTooltip">
                                <p>{{item.desc}}</p>
                            </el-tooltip>
                        </div>
                    </li>
                </ul>
                <div class="slide" @click="slideAppCenterItem">
                    <span class="down" v-if="isSlideDown">展开 <i class="el-icon-d-arrow-left"></i> </span>
                    <span class="up" v-else>收起 <i class="el-icon-d-arrow-left"></i> </span>
                </div>
            </div>
            <div style="margin:24px 0; background:#fff;border: 1px solid #e5e6e9;">
                <h2 class="h2_style">业绩进度 <span class="span_rank">单位为：万</span></h2>
                <div style=" width:96%; margin:24px auto;position:relative;" v-if="isShowLine">

                    <ul class="timeline">
                        <li v-for="(item, index) of priceList" :key="index" class="timeline_item"
                            :style="'width:'+100/(priceList.length-1)+'%'">
                            <div class="line_tail"></div>
                            <div class="line_head"></div>
                            <div class="line_content"> {{item}}</div>
                        </li>
                    </ul>
                    <div id="rank_info">
                        <el-popover class="item" effect="dark" placement="right-start" width="180" trigger="hover">
							<span class="popover_span rank_img">
								<img :src="userInfo.avator" alt="">
								<span>￥{{saleInfo.price}}(第{{saleInfo.rank}}名)</span>
							</span>
                            <span slot="reference" class="rank_line"></span>
                        </el-popover>
                    </div>
                </div>
                <template v-else>
                    <div class="img_point">
                        <no-search-result></no-search-result>
                    </div>
                </template>
            </div>
        </div>
        <!-- 动效 -->
        <div class="monthly_ranking" v-show="isMonthlyRanking">
            <div class="monthly_ranking_box">
                <div class="monthly_ranking_title">
                    <img src="../../assets/images/index/BD.png" alt="">
                </div>
                <div class="monthly_ranking_content">
                    <el-row>
                        <el-col :span="8">
                            <div class="monthly_ranking_city monthly_ranking_content_first">
                                <div id="first_box">
                                    <img src="../../assets/images/index/left-star.png" alt=""
                                         class="monthly_ranking_img_top_left">
                                    <img src="../../assets/images/index/right-star.png" alt=""
                                         class="monthly_ranking_img_top_right">
                                    <img src="../../assets/images/index/left.png" alt=""
                                         class="monthly_ranking_img_left">
                                    <img src="../../assets/images/index/header_min.png" alt=""
                                         class="monthly_ranking_img_meiddle">
                                    <img :src="rankInfo[0].headPic" alt=""
                                         class="monthly_ranking_img_meiddle header_style">
                                    <img src="../../assets/images/index/right.png" alt=""
                                         class="monthly_ranking_img_right">
                                    <img src="../../assets/images/index/name.png" alt=""
                                         class="monthly_ranking_img_bottom">
                                    <span
                                        class="monthly_ranking_city_name city_name_left">{{rankInfo[0].username}}</span>
                                    <span class="ranking_num first_ranking_num">第{{rankInfo[0].rank}}名</span>
                                </div>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="monthly_ranking_city monthly_ranking_content_second">
                                <img id="second_top_left" src="../../assets/images/index/left-star.png" alt=""
                                     class="monthly_ranking_img_top_left">
                                <img id="second_top_right" src="../../assets/images/index/right-star.png" alt=""
                                     class="monthly_ranking_img_top_right">
                                <img id="second_img_left" src="../../assets/images/index/left.png" alt=""
                                     class="monthly_ranking_img_left">
                                <img id="meiddle" src="../../assets/images/index/header_min.png" alt=""
                                     class="monthly_ranking_img_meiddle">
                                <img id="meiddle" :src="rankInfo[1].headPic" alt=""
                                     class="monthly_ranking_img_meiddle center_header">
                                <img id="second_img_right" src="../../assets/images/index/right.png" alt=""
                                     class="monthly_ranking_img_right">
                                <img id="second_img_name" src="../../assets/images/index/name.png" alt=""
                                     class="monthly_ranking_img_bottom">
                                <span id="second_city_name" class="monthly_ranking_city_name city_name_meiddle">{{rankInfo[1].username}}</span>
                                <span class="ranking_num second_ranking_num">第{{rankInfo[1].rank}}名</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="monthly_ranking_city monthly_ranking_content_three">
                                <div id="three_box">
                                    <img src="../../assets/images/index/left-star.png" alt=""
                                         class="monthly_ranking_img_top_left">
                                    <img src="../../assets/images/index/right-star.png" alt=""
                                         class="monthly_ranking_img_top_right">
                                    <img src="../../assets/images/index/left.png" alt=""
                                         class="monthly_ranking_img_left">
                                    <img src="../../assets/images/index/header_min.png" alt=""
                                         class="monthly_ranking_img_meiddle">
                                    <img :src="rankInfo[2].headPic" alt=""
                                         class="monthly_ranking_img_meiddle header_style">
                                    <img src="../../assets/images/index/right.png" alt=""
                                         class="monthly_ranking_img_right">
                                    <img src="../../assets/images/index/name.png" alt=""
                                         class="monthly_ranking_img_bottom">
                                    <span
                                        class="monthly_ranking_city_name city_name_right">{{rankInfo[2].username}}</span>
                                    <span class="ranking_num three_ranking_num">第{{rankInfo[2].rank}}名</span>
                                </div>
                            </div>
                        </el-col>
                    </el-row>
                    <div class="monthly_ranking_bottom">
                        <div class="monthly_ranking_bottom_btn" @click="isMonthlyRanking = !isMonthlyRanking">继续努力</div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
    import {Button, Message} from 'element-ui';
    import homeTop from '../common/components/homeTop.vue';
    import homeLink from '../common/components/homeLink.vue';
    import {api} from '../../api/api';
    import timeFormat from '../../commonFun/timeFormat';
    import sessFun from '../../commonFun/sessFun.js';
    import comcards from '../../commonFun/json/comcard.json';
    import appCenter from '../../commonFun/json/appCenter.json';
    import indexIsDateFirst from '../../commonFun/indexIsDateFirst.js';
    import noSearchResult from "../../components/common/components/noSearchResult.vue";


    export default {
        name: "sale_index",
        components: {
            homeTop,
            homeLink,
            noSearchResult,
            elButton: Button,
        },
        data() {
            return {
                // 动效
                isMonthlyRanking: false,
                linkArr: [
                    {
                        imgurl: require('../../assets/images/group.png'),
                        title: '客户管理',
                        desc: '客户管理模块，您可在此模块中查看、新建、编辑客户',
                        link: './sale/clientList',
                        children: [
                            {
                                title: '客户列表',
                                link: './sale/clientList',
                            },
                            {
                                title: '新建客户',
                                link: './sale/createClient',
                            }
                        ],
                    },
                    {
                        imgurl: require('../../assets/images/editor.png'),
                        title: '方案管理',
                        desc: '方案管理模块，您可在此模块中查看、新建、发布方案',
                        link: './sale/planList',
                        children: [
                            {
                                title: '导出空位',
                                link: '',
                            },
                            // {
                            //     title: '方案列表',
                            //     link: './sale/planList',
                            // },
                            {
                                title: '地图选点',
                                link: '',
                            }
                        ],
                    },
                    {
                        imgurl: require('../../assets/images/order.png'),
                        title: '订单管理',
                        desc: '订单管理模块，您可在此模块查看订单，中止订单',
                        link: './sale/orderList',
                        children: [
                            {
                                title: '订单列表',
                                link: './sale/orderList'
                            }
                        ],
                    },
                ],
                userInfo: {
                    username: '曾俊超',
                    greetings: '祝您开心每一天!',
                    duty: '销售经理',
                    dep: '销售部门',
                    phone: '13631275100',
                    avator: require('../../assets/images/index/niu.png'),
                    endTime: '2018-06-06'
                },
                dataArr: [
                    {
                        name: '当月激活客户数',
                        data: 87
                    },
                    {
                        name: '当月订单数',
                        data: 18
                    },
                    {
                        name: '当月成交金额',
                        data: 388
                    },
                ],
                priceList: [0, 25, 50, 75, 100],
                // 是否显示进度条
                isShowLine: true,
                // 你的助手
                saleTalk: {
                    dateTime: '2018.08.08 15:06:06',
                    imgurl: require('../../assets/images/index/niu.png'),
                    content: '宇杰，您上月业绩200万，本月截止9月16号业绩150万，继续努力哦！'
                },
                // 进度排名
                saleInfo: {
                    price: 30,
                    rank: 9
                },
                // 排名信息
                rankInfo: [
                    {
                        username: '',
                        rank: '',
                        headPic: require('../../assets/images/index/niu.png'),
                    },
                    {
                        username: '',
                        rank: '',
                        headPic: require('../../assets/images/index/niu.png'),
                    },
                    {
                        username: '',
                        rank: '',
                        headPic: require('../../assets/images/index/niu.png'),
                    },
                ],
                // 勋章
                companyHonor: [],
                isCom: false,
                // 应用中心
                appCenter: '',
                isSlideDown: true,


            }
        },
        methods: {
            getSession() {
                this.sessionData = sessFun.getSess();
                this.userInfo.username = this.sessionData.realName;
                this.userInfo.dep = this.sessionData.division;
                this.userInfo.duty = this.sessionData.asName;
                this.userInfo.phone = this.sessionData.phone;
                this.userInfo.avator = this.sessionData.headPic ? this.sessionData.headPic : require('../../assets/images/index/niu.png')
            },
            getIsCom() {
                let sessrid = this.sessionData.asrID;
                let comarr = ['1', '2', '3', '4', '5', '6', '7'];
                for (let data of comarr) {
                    if (sessrid == data) {
                        this.isCom = true;
                        break;
                    }
                }
                if (this.isCom) {
                    let cards = [];
                    let result = [];
                    for (let data of comcards) {
                        if (sessrid == data.value) {
                            cards = data.cards;
                            break;
                        }
                    }
                    for (let item of cards) {
                        let obj = {
                            label: item.label,
                            title: item.title,
                            flag: item.label.includes('2') ? true : false,
                            value: require('../../assets/images/index/' + item.value + '.png'),
                        };
                        obj.url = obj.value;
                        result.push(obj);
                    }
                    console.log('result----cards', result);
                    this.companyHonor = result;
                }
            },
            resizeRank(price) {
                let rankLength = document.getElementsByClassName('timeline')[0].offsetWidth;
                let maxPrice = this.priceList[this.priceList.length - 1];
                let truePrice = document.getElementById('rank_info');
                let side = (price / maxPrice) * rankLength;
                truePrice.style.left = side + 'px';
                document.getElementsByClassName('rank_line')[0].style.width = side + 'px';
            },
            // 排名弹窗
            getRank() {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token
                };
                api.getApi(this.apiVar.report + '/GetMonthRankOfBD', info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let resinfo = res.data.data;
                        let result = [];
                        for (let data of resinfo) {
                            let obj = {
                                username: data.realName,
                                headPic: data.headPic ? data.headPic : require('../../assets/images/index/niu.png'),
                                rank: data.rankNumber,
                            };
                            result.push(obj);
                        }
                        console.log('result----', result);
                        if (result.length == 3) {
                            this.rankInfo = result;
                        } else if (result.length == 1) {
                            let obj = {
                                username: '张三',
                                headPic: require('../../assets/images/index/niu.png'),
                                rank: result[0].rank + 1
                            };
                            result.unshift(obj);
                            let otherObj = {
                                username: '老五',
                                headPic: require('../../assets/images/index/niu.png'),
                                rank: result[0].rank + 1
                            };
                            result.push(otherObj);
                            this.rankInfo = result;
                        } else if (result.length == 2) {
                            let max = Math.max(result[1].rank, result[0].rank);
                            let obj = {
                                username: '王五',
                                headPic: require('../../assets/images/index/niu.png'),
                                rank: max + 1
                            };
                            result.push(obj);
                            this.rankInfo = result;
                        }
                        let timer = setTimeout(() => {
                            this.animateFun()
                            clearTimeout(timer)
                        }, 200);

                    } else {
                        // Message.warning(res.data.MSG);
                        this.$message({
                            type: 'warning',
                            message: res.data.MSG,
                            duration: 1000
                        });
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 那句话
            getOneTalk() {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                };
                api.getApi(this.apiVar.report + '/GetCountMessage', info).then(res => {
                    console.log(res);
                    if (res.data.SysCode == 200200) {
                        let resinfo = res.data.data;
                        this.saleTalk.content = resinfo.countMessage;
                        this.saleTalk.dateTime = resinfo.time;
                    } else {
                        Message.warning(res.data.MSG);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取数据
            getData() {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                };
                api.getApi(this.apiVar.report + '/GetHomePageInfoOfBD', info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let resInfo = res.data.data;
                        this.dataArr[0].data = resInfo.customerCount;
                        this.dataArr[1].data = resInfo.orderCount;
                        this.dataArr[2].data = resInfo.apTotal / 100;

                        this.userInfo.endTime = timeFormat.toDate(resInfo.time, '/');
                    } else {
                        Message.warning(res.data.MSG);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取业绩进度
            getTarget() {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                };
                api.getApi(this.apiVar.report + '/GetTargetOfYear', info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let target = res.data.data.targetOfYear / 1000000;
                        let oneTarget = target / 4;
                        // this.priceList = [0, oneTarget, oneTarget*2, oneTarget*3, oneTarget*4, target];
                        this.priceList = [0, oneTarget, oneTarget * 2, oneTarget * 3, target];
                        if (target) {
                            this.getAptotal();
                        } else {
                            this.isShowLine = false;
                        }
                    } else {
                        this.isShowLine = false;
                        // Message.warning(res.data.MSG);
                    }
                }).catch(err => {
                    console.log(err);
                });
            },
            // 获取这个月销售额
            getAptotal() {
                let info = {
                    uid: this.sessionData.uID,
                    token: this.sessionData.token,
                };
                api.getApi(this.apiVar.report + '/GetApTotalSoFarOfBD', info).then(res => {
                    console.log(res.data);
                    if (res.data.SysCode == 200200) {
                        let resinfo = res.data.data;
                        this.saleInfo = {
                            price: resinfo.apTotalSoFar / 1000000,
                            rank: resinfo.rankNumber,
                        };
                        let price = 0;
                        if (resinfo.apTotalSoFar / 1000000 > this.priceList[this.priceList.length - 1]) {
                            price = this.priceList[this.priceList.length - 1];
                        } else {
                            price = this.saleInfo.price;
                        }
                        console.log(this.saleInfo, 'fdalfda----');
                        this.resizeRank(price);
                        // 实时监听body宽度变化
                        window.addEventListener("resize", () => {
                            console.log(1111);
                            this.resizeRank(price);
                        });
                    } else {
                        Message.warning(res.data.MSG);
                    }
                });
            },
            // 开场动画
            animateFun() {
                this.isMonthlyRanking = true
                $(".monthly_ranking_title").animate({
                    top: '-10px',
                    opacity: 1,
                }, 400, () => {
                    $(".monthly_ranking_title").animate({
                        top: '0px',
                    }, 150)
                })
                // 中间主图
                let time1 = setTimeout(() => {
                    $("#meiddle").animate({
                        left: '47px',
                        height: '162px',
                        width: '162px',
                    }, 400, () => {
                        $("#meiddle").animate({
                            height: '152px',
                            width: '152px',
                        }, 150, () => {
                            // 左边喇叭
                            document.getElementById('second_img_left').style.display = 'block'
                            $("#second_img_left").animate({
                                left: '0px'
                            }, 200,)
                            // 右边喇叭
                            document.getElementById('second_img_right').style.display = 'block'
                            $("#second_img_right").animate({
                                right: '-3px'
                            }, 200, () => {
                                // 底下城市名称背景图
                                document.getElementById('second_img_name').style.display = 'block'
                                $("#second_img_name").animate({
                                    top: '114px'
                                }, 200, () => {
                                    // 左边花
                                    document.getElementById('second_top_left').style.display = 'block'
                                    $("#second_top_left").animate({
                                        top: '-20px'
                                    }, 200, () => {
                                        // 右边花
                                        document.getElementById('second_top_right').style.display = 'block'
                                        $("#second_top_right").animate({
                                            top: '-22px'
                                        }, 200)
                                    })
                                })
                                // 底下城市名称
                                document.getElementById('second_city_name').style.display = 'block'
                                $("#second_city_name").animate({
                                    top: '115px'
                                }, 200, () => {
                                    //  底部名次
                                    $(".second_ranking_num").animate({
                                        bottom: '-25px',
                                        opacity: 1
                                    }, 100)
                                })
                            })
                        })
                    })
                    clearTimeout(time1)
                }, 550)
                // 左边动画 first_box three_box
                let time2 = setTimeout(() => {
                    // 左边动画
                    document.getElementById('first_box').style.display = 'block'
                    $("#first_box").animate({
                        bottom: '20px'
                    }, 300, () => {
                        $("#first_box").animate({
                            bottom: '0px'
                        }, 100,)
                    })
                    // 右边动画
                    document.getElementById('three_box').style.display = 'block'
                    $("#three_box").animate({
                        bottom: '20px'
                    }, 300, () => {
                        $("#three_box").animate({
                            bottom: '0px'
                        }, 100, () => {
                            // 底部按钮
                            $(".monthly_ranking_bottom_btn").animate({
                                bottom: '0px',
                                opacity: 1
                            }, 150)
                            // 左边名次
                            $(".first_ranking_num").animate({
                                bottom: '-3px',
                                opacity: 1
                            }, 150)
                            // 右边名次
                            $(".three_ranking_num").animate({
                                bottom: '-3px',
                                opacity: 1
                            }, 150)
                        })
                    })
                    clearTimeout(time2)
                }, 1750)
            },
            // 应用中心的展开和收起
            slideAppCenterItem() {
                this.isSlideDown = !this.isSlideDown
                if(!this.isSlideDown){
                    this.uploadEvent(1)
                }

            },
            // 应用中心跳转
            goToPage(item) {
                if (item) {
                    this.uploadEvent(2,item.name)
                    item.descTooltip = false
                    window.open(item.link, '_blank')
                } else {
                    this.uploadEvent(2,'home')
                    window.open('https://apps.qinlinad.com', '_blank')
                }
            },
            getUuid() {
                let s = [];
                let hexDigits = "0123456789abcdef";
                for (let i = 0; i < 36; i++) {
                    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
                }
                s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
                s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
                s[8] = s[13] = s[18] = s[23] = "-";
                let uuid = s.join("");
                return uuid;
            },
            // 用户中心事件上报 1展示2点击
            uploadEvent(type,name){
                this.$nextTick(function() {
                    //用户中心渲染完成
                    // console.log('用户中心渲染完成')
                    let params = []
                    if(type==1){
                        //展现
                        for(let i=0;i<this.appCenter.length;i++){
                            if(this.isSlideDown){
                                if(i<8){
                                    let obj = {
                                        "userId":this.sessionData.uID,
                                        "behaviorTime":timeFormat.toDateTime(new Date()),
                                        "componentName":this.appCenter[i].name,
                                        "requestId":this.getUuid(),
                                        "type":type
                                    }
                                    params.push(obj)
                                }
                            }else{
                                if(i>7){
                                    let obj = {
                                        "userId":this.sessionData.uID,
                                        "behaviorTime":timeFormat.toDateTime(new Date()),
                                        "componentName":this.appCenter[i].name,
                                        "requestId":this.getUuid(),
                                        "type":type
                                    }
                                    params.push(obj)
                                }
                            }
                        }
                    }else{
                        //点击
                        let obj = {
                            "userId":this.sessionData.uID,
                            "behaviorTime":timeFormat.toDateTime(new Date()),
                            "componentName":name,
                            "requestId":this.getUuid(),
                            "type":type
                        }
                        params.push(obj)
                    }
                    console.log(params)
                    api.postApi(this.apiVar.UCAPI+'/UserStaticReport',{userStatics:JSON.stringify(params)}).then(res=>{
                        // console.log('UserStaticReport---',res.data);
                    })
                });
            }
        },
        mounted() {

            this.getSession();
            this.getIsCom();
            let nowDate = timeFormat.toDate(new Date(), '/');
            if (indexIsDateFirst.getIsFirst(this.sessionData.uID, nowDate)) {
                this.getRank();
            }
            // 获取数据
            this.getData();
            // 获取目标
            this.getTarget();
            // 那句话
            this.getOneTalk();
            //用户中心
            this.appCenter = appCenter
            this.uploadEvent(1)
        }
        ,
    }
    ;
</script>

<style scoped>
    .ad_index_container {
        margin: 24px 64px;
        height: auto;
    }

    .h2_style {
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(0, 0, 0, 0.85);
        background: #fff;
        font-size: 16px;
        font-weight: bold;
        height: 52px;
        line-height: 52px;
        padding-left: 24px;
        border-bottom: 1px solid #ececec;
    }

    .loglist_box {
        padding: 10px 24px 0;
        height: 150px;
        overflow-x: hidden;
        overflow-y: scroll;
    }

    .loglist_box::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }

    .loglist_box::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
        background: #c1c1c1;
        border-radius: 4px;
    }

    /* 进度条 */
    .timeline {
        /* width: 98%; */
        margin: 0;
        font-size: 14px;
        list-style: none;
        display: flex;
    }

    .timeline_item {
        margin: 0 !important;
        padding: 0 0 12px;
        list-style: none;
        position: relative
    }

    .line_tail {
        width: 100%;
        border-top: 1px solid #e8eaec;
        position: absolute;
        left: 4px;
        top: 4px;
    }

    .line_head {
        width: 8px;
        height: 8px;
        background-color: #2d8cf0;
        border-radius: 50%;
        border: 1px solid transparent;
        position: absolute;
        border-color: #2d8cf0;
        color: #2d8cf0;
    }

    .line_content {
        padding: 1px 1px 10px 24px;
        font-size: 12px;
        position: relative;
        left: -25px;
        bottom: -15px;
        width: 50px;
    }

    .timeline_item:last-child {
        width: 0% !important;
    }

    .timeline_item:last-child .line_tail {
        display: none;
    }

    #rank_info {
        width: 100px;
        top: -30px;
    }

    .rank_img img {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        vertical-align: middle;
    }

    .rank_line {
        border-radius: 50%;
        border: 1px solid #2d8cf0;
        position: absolute;
        top: 4px;
        background-color: rgba(191, 191, 191, 1);
        color: #2d8cf0;
        z-index: 20;
    }

    .span_rank {
        float: right;
        padding-right: 24px;
        font-size: 14px;
        font-weight: normal;
    }

    /* 你的助手 */
    .time_box {
        text-align: center;
        padding-top: 10px;
    }

    .time {
        width: 120px;
        height: 24px;
        background: rgba(0, 0, 0, 0.12);
        border-radius: 2px;
        color: #fff;
        padding: 2px 5px;
        font-size: 12px;
    }

    .info_box {
        margin: 15px 0;
    }

    .info_box img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: inline-block;
    }

    .info_content {
        background: #fff;
        position: relative;
        margin-left: 10px;
        padding: 10px;
        font-size: 14px;
        color: rgba(102, 102, 102, 1);
        display: inline-block;
        max-width: 260px;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        border: 1px solid #ebeef5;
        word-break: break-all;
    }

    .info_arrow {
        position: absolute;
        left: -10px;
        top: 35%;
        display: block;
        width: 0;
        height: 0;
        border-color: transparent;
        border-style: solid;

        border-width: 10px;
        filter: drop-shadow(0 2px 10px rgba(0, 0, 0, .03));

        border-left-width: 0;
        border-right-color: #fff;

    }

    .info_arrow::after {
        border-left-width: 0;
        border-right-color: #fff;
    }

    /* 动效 */
    /* #rank_model{
        position: relative;
        width: 960px;
        height: 420px;
        margin: 200px auto 0;
    }
    #rank_model img{
        position: absolute;
        top: 113px;
        left: -1000px;
    }
    #rank_model .on{
        left: -8px;
        transition: 0.5s 1s;
    } */

    #rank_model {
        width: 190px;
        height: 120px;
        padding: 3px;
        position: absolute;
        z-index: 12;
        top: 100px;
        left: 50%;
    }

    /*动画名字， 动画运行的时间，alternate平滑过渡， infinite是反复执行*/
    #rank_model {
        animation-name: imgAnimation;
        animation: imgAnimation 2s alternate;
        -webkit-animation: imgAnimation 2s alternate;
        -moz-animation: imgAnimation 2s alternate infinite;
    }

    /* 动效 */
    /*城市月季排行*/
    .monthly_ranking {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 998;
        background: rgba(0, 0, 0, 0.3);
    }

    .monthly_ranking_box {
        width: 720px;
        margin: 190px auto;
        height: 470px;
        /*border: 1px solid #fff;*/
    }

    .monthly_ranking_title {
        position: relative;
        margin: 0 auto;
        text-align: center;
        top: 70px;
        opacity: 0;
    }

    .monthly_ranking_title img {
        width: 389px;
        height: 152px;
    }

    .monthly_ranking_city {
        position: relative;
        margin-top: 32px;
        height: 160px;
    }

    /*顶部花*/
    .monthly_ranking_img_top_left, .monthly_ranking_img_top_right {
        position: absolute;
        z-index: 999;
    }

    .monthly_ranking_img_left {
        position: absolute;
        left: 0;
    }

    .monthly_ranking_img_meiddle {
        position: absolute;
        left: 47px;
        width: 126px;
        height: 126px;
        z-index: 1000;
    }

    .monthly_ranking_img_right {
        position: absolute;
        right: 8%;
    }

    /*底部名次*/
    .ranking_num {
        position: absolute;
        color: #fff;
        letter-spacing: 8px;
        font-size: 18px;
        /*display: none;*/
    }

    .monthly_ranking_img_bottom {
        position: absolute;
        z-index: 1001;
        top: 90px;
        width: 142px;
        left: 40px;
    }

    .monthly_ranking_city_name {
        position: absolute;
        z-index: 1001;
        color: #fff;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 1px;
        text-align: center;
        display: inline-block;
        width: 142px;
    }

    /*左边城市名称*/
    .city_name_left {
        bottom: 45px;
        /* left: 88px; */
        left: 42px;
    }

    /*左边*/
    #first_box {
        display: none;
        position: absolute;
        height: 160px;
        width: 100%;
        bottom: -120px;
    }

    .monthly_ranking_content_first .monthly_ranking_img_top_left {
        top: -26px;
        left: 53px;
    }

    .monthly_ranking_content_first .monthly_ranking_img_top_right {
        right: 66px;
        top: -27px;
    }

    .first_ranking_num {
        /*bottom: -3px;*/
        bottom: -30px;
        left: 75px;
        opacity: 0;
    }

    /*中间*/
    .monthly_ranking_content_second .monthly_ranking_img_meiddle {
        left: 100px;
        width: 0;
        height: 0
    }

    .monthly_ranking_content_second .monthly_ranking_img_left {
        display: none;
        left: 40px;
    }

    .monthly_ranking_content_second .monthly_ranking_img_right {
        right: 30px;
        top: 1px;
        display: none;
    }

    .monthly_ranking_content_second .monthly_ranking_img_bottom {
        top: 180px;
        display: none;
        left: 53px;
    }

    .city_name_meiddle {
        left: 54px;
        top: 180px;
        display: none;
    }

    .monthly_ranking_content_second .monthly_ranking_img_top_left {
        left: 58px;
        display: none;
        top: -50px;
    }

    .monthly_ranking_content_second .monthly_ranking_img_top_right {
        right: 45px;
        top: -50px;
        display: none;
    }

    .second_ranking_num {
        bottom: -50px;
        left: 88px;
        opacity: 0;
    }

    /*右边*/
    #three_box {
        display: none;
        position: absolute;
        height: 160px;
        width: 100%;
        bottom: -120px;
    }

    .monthly_ranking_content_three .monthly_ranking_img_top_left {
        top: -22px;
        left: 75px;
    }

    .monthly_ranking_content_three .monthly_ranking_img_top_right {
        right: 40px;
        top: -28px;
    }

    .monthly_ranking_content_three .monthly_ranking_img_meiddle {
        left: 30%;
    }

    .monthly_ranking_content_three .monthly_ranking_img_left {
        left: 25px;
        top: 0
    }

    .monthly_ranking_content_three .monthly_ranking_img_right {
        right: -3px;
    }

    .monthly_ranking_content_three .monthly_ranking_img_bottom {
        left: 64px;
    }

    .monthly_ranking_bottom {
        color: #FFD424;
        text-align: center;
        margin-top: 48px;
    }

    .monthly_ranking_bottom_btn {
        position: relative;
        margin: 0 auto;
        width: 102px;
        height: 34px;
        line-height: 34px;
        background: #F25A5A;
        border-radius: 3px;
        cursor: pointer;
        z-index: 999;
        bottom: -50px;
        opacity: 0;
    }

    .city_name_right {
        bottom: 45px;
        /* left: 114px; */
        left: 64px;
    }

    .three_ranking_num {
        bottom: -30px;
        left: 100px;
        opacity: 0;
    }

    .header_style {
        border-radius: 50%;
        width: 100px;
        height: 100px;
        position: absolute;
        left: 60px;
        top: 16px;
    }

    .monthly_ranking_content_three .header_style {
        left: 85px;
    }

    .monthly_ranking_content_second .center_header {
        width: 120px;
        height: 120px;
        border-radius: 50%;
        left: 62px;
        top: 20px;
    }

    @-webkit-keyframes imgAnimation {
        0% {
            top: 500px;
            left: 50%;
        }
        100% {
            top: 100px;
            left: 50%;
        }
    }

    .img_point {
        text-align: center;
        color: #666;
        margin-top: 20px;
        padding-bottom: 20px;
    }


</style>
