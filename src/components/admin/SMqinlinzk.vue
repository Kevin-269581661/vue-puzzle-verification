<template>
    <div class="ad_mediaDetail_wrap clearfix">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">亲邻智邻</a>
            </p>
        </div>
        <div class="mediaList_wrap">
            <el-card class="box-card" shadow="never">
                <div slot="header" class="clearfix">
                    <h5 class="qlzk-title">画像申请</h5>
                    <div class="qlzk-title-button">
           <span style="float: left;margin-right: 37px">
               <el-button v-for="(item,index) in buttons" :key="index" :class="{active:index == num}" type="text"
                          @click=changeButtons(index)>{{item}}</el-button>
           </span>
                        <span style="float: left">
              <div class="block">
              <el-date-picker
                  v-model="titleDate"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  @change="selectDate()"
              >
              </el-date-picker>
            </div>
            </span>
                    </div>
                </div>
                <div class="list">
                    <ul>
                        <li class="list-item" v-for="(item,index) in applyList" :key="index">
              <span>
                <img src="../../assets/images/qlzk_icon.png" alt="">
              </span>
                            <span style="margin-left: 16px">
                <div class="item-content">
                <p>{{item.realName}} 对 <span>{{item.apName}}</span>申请 {{item.resName}} 等<i
                    @click="getHouseList(item.apid,item.aiTime)">{{item.count}}</i>个 社区画像，费用为 ￥{{priceFormat(item.price)}}</p>
                <em class="times">{{item.timeDiff}}</em>
              </div>
              </span>
                            <span style="float: right">
                                <el-button type="primary"
                                           @click="openPicDialogFun(item.apid,item.count,item.price,item.apName,item.aiTime)"
                                           v-if="item.aiState == 0 ">通过</el-button>
                                <el-button type="danger" @click="passApply(2,item.apid)"
                                           v-if="item.aiState == 0 ">拒绝</el-button>
                                <el-button type="danger" plain disabled
                                           v-if="item.aiState == 2 ">已拒绝</el-button>
                                <el-button type="primary" disabled v-if="item.aiState == 1 ">已通过</el-button>
              </span>
                        </li>
                    </ul>
                    <!--通过审核-->
                    <el-dialog
                        :visible.sync="openPicDialog"
                        width="50%"
                        class="openPicDialog">
                        <template slot="title">
                            <p style="font-size: 16px;color: #303133;">{{currApname}} 申请开通的社区({{currCount}})</p>
                        </template>
                        <div>
                        <span>
                             <div>
                            <p style="margin-bottom: 5px">选择消费偏好</p>
                            <el-tag
                                :key="tag.id"
                                v-for="(tag,index) in hoppyTags"
                                closable
                                :disable-transitions="false"
                                @close="spliceHoppy(index)">
                                {{tag.name?tag.name:tag.label}}
                            </el-tag>
                            <el-cascader :options="allHoppy" v-model="selectHoppy" @change="changeHoppy"></el-cascader>
                        </div>
              <ul class="houseList-wrap">
                   <li v-for="(item,index) in houseList" :key="index"><span>{{item.resCity}}</span><span>{{item.resCounty}}</span><span>{{item.resName}}</span>
                      <el-tooltip class="item" effect="dark"
                                  :content="formatTime(item.gSDay)+'-'+formatTime(item.gEDay)"
                                  placement="right-start">
     <span>{{formatTime(item.gSDay)}}-{{formatTime(item.gEDay)}}</span>
    </el-tooltip>

                  </li>
              </ul>
              <p class="total-count">
                  <i class="el-icon-info"
                     style="margin-right: 2px;color: #999"></i>总计：<span>￥{{priceFormat(currPrice)}}</span></p>
            </span>
                        </div>
                        <span slot="footer" class="dialog-footer">
    <el-button @click="cancelApply()">取 消</el-button>
    <el-button type="primary" @click="passApply(1,currApid)">确 定</el-button>
  </span>
                    </el-dialog>
                    <!--申请开通的社区列表-->
                    <el-dialog
                        title="申请开通的社区"
                        :visible.sync="houselistDialog"
                        width="35%">
                        <span>
              <ul class="houseList-wrap">

                  <li v-for="(item,index) in houseList" :key="index"><span>{{item.resCity}}</span><span>{{item.resCounty}}</span><span>{{item.resName}}</span>
                  </li>
              </ul>
            </span>
                    </el-dialog>
                </div>
            </el-card>
        </div>
    </div>
</template>

<script>
    import api from "../../api/api.js";
    import timeFormat from '../../commonFun/timeFormat.js'
    import commaFormat from '../../commonFun/commaFormat.js'
    import sessFun from '../../commonFun/sessFun.js';    
    // 消费偏好json
    import allHoppy from "../../commonFun/json/allHoppy_new.json";
    // 消费偏好转换中文
    import hoppyToText from "../../commonFun/hoppyToText.js";

    export default {
        name: "qinlinzk",
        data() {
            return {
                // 登录信息
                sessionData:{},
                //当前选中的数据的apid
                currApid: '',
                currCount: '',
                currPrice: 0,
                currApname: '',
                //审核状态 0未审核 1已通过 2已拒绝
                pass: 3,
                num: 0,
                buttons: ['全部', '待审核', '已通过', '已拒绝'],
                titleDate: [new Date() - 3600 * 1000 * 24 * 30, Number(new Date())],
                //开通社区画像
                options: [
                    {
                        value: '选项1',
                        label: '通用零售'
                    }, {
                        value: '选项2',
                        label: 'APP分类'
                    }, {
                        value: '选项3',
                        label: 'APP安装量'
                    }, {
                        value: '选项4',
                        label: '龙须面'
                    }, {
                        value: '选项5',
                        label: '北京烤鸭'
                    }],
                value1: [],
                houselistDialog: false,
                openPicDialog: false,
                //画像申请列表
                applyList: [],
                dataArr: [],
                //申请开通的社区列表
                houseList: '',
                //点击通过的列表

                //消费偏好
                hoppyTags: [],
                selectHoppy: [],
                allHoppy: [],
                //选择了的消费偏好
                // hoppys: [
                //     {
                //         value: "APP分类",
                //         label: "APP分类",
                //         children: [
                //             {
                //                 value: "便捷生活",
                //                 label: "便捷生活"
                //             },
                //             {
                //                 value: "房屋地产",
                //                 label: "房屋地产"
                //             },
                //             {
                //                 value: "人才招聘",
                //                 label: "人才招聘"
                //             },
                //             {
                //                 value: "交通导航",
                //                 label: "交通导航"
                //             },
                //             {
                //                 value: "个人工具",
                //                 label: "个人工具"
                //             },
                //             {
                //                 value: "旅游出行",
                //                 label: "旅游出行"
                //             },
                //             {
                //                 value: "健康医疗",
                //                 label: "健康医疗"
                //             },
                //             {
                //                 value: "美食外卖",
                //                 label: "美食外卖"
                //             },
                //             {
                //                 value: "电子商务",
                //                 label: "电子商务"
                //             },
                //             {
                //                 value: "金融理财",
                //                 label: "金融理财"
                //             },
                //             {
                //                 value: "社交网络",
                //                 label: "社交网络"
                //             },
                //             {
                //                 value: "电子阅读",
                //                 label: "电子阅读"
                //             },
                //             {
                //                 value: "实用工具",
                //                 label: "实用工具"
                //             },
                //             {
                //                 value: "学习教育",
                //                 label: "学习教育"
                //             },
                //             {
                //                 value: "办公管理",
                //                 label: "办公管理"
                //             },
                //             {
                //                 value: "综合资讯",
                //                 label: "综合资讯"
                //             },
                //             {
                //                 value: "通讯聊天",
                //                 label: "通讯聊天"
                //             },
                //             {
                //                 value: "汽车服务",
                //                 label: "汽车服务"
                //             },
                //             {
                //                 value: "视频服务",
                //                 label: "视频服务"
                //             },
                //             {
                //                 value: "音乐音频",
                //                 label: "音乐音频"
                //             },
                //             {
                //                 value: "游戏服务",
                //                 label: "游戏服务"
                //             },
                //             {
                //                 value: "女性亲子",
                //                 label: "女性亲子"
                //             },
                //             {
                //                 value: "拍摄美化",
                //                 label: "拍摄美化"
                //             },
                //             {
                //                 value: "智能设备",
                //                 label: "智能设备"
                //             },
                //             {
                //                 value: "应用分发",
                //                 label: "应用分发"
                //             },
                //         ]
                //     },
                //     {
                //         value: "APP安装",
                //         label: "APP分类",
                //         children: [
                //             {
                //                 value: "便捷生活",
                //                 label: "便捷生活"
                //             },
                //             {
                //                 value: "房屋地产",
                //                 label: "房屋地产"
                //             },
                //             {
                //                 value: "人才招聘",
                //                 label: "人才招聘"
                //             },
                //             {
                //                 value: "交通导航",
                //                 label: "交通导航"
                //             },
                //             {
                //                 value: "个人工具",
                //                 label: "个人工具"
                //             },
                //             {
                //                 value: "旅游出行",
                //                 label: "旅游出行"
                //             },
                //             {
                //                 value: "健康医疗",
                //                 label: "健康医疗"
                //             },
                //             {
                //                 value: "美食外卖",
                //                 label: "美食外卖"
                //             },
                //             {
                //                 value: "电子商务",
                //                 label: "电子商务"
                //             },
                //             {
                //                 value: "金融理财",
                //                 label: "金融理财"
                //             },
                //             {
                //                 value: "社交网络",
                //                 label: "社交网络"
                //             },
                //             {
                //                 value: "电子阅读",
                //                 label: "电子阅读"
                //             },
                //             {
                //                 value: "实用工具",
                //                 label: "实用工具"
                //             },
                //             {
                //                 value: "学习教育",
                //                 label: "学习教育"
                //             },
                //             {
                //                 value: "办公管理",
                //                 label: "办公管理"
                //             },
                //             {
                //                 value: "综合资讯",
                //                 label: "综合资讯"
                //             },
                //             {
                //                 value: "通讯聊天",
                //                 label: "通讯聊天"
                //             },
                //             {
                //                 value: "汽车服务",
                //                 label: "汽车服务"
                //             },
                //             {
                //                 value: "视频服务",
                //                 label: "视频服务"
                //             },
                //             {
                //                 value: "音乐音频",
                //                 label: "音乐音频"
                //             },
                //             {
                //                 value: "游戏服务",
                //                 label: "游戏服务"
                //             },
                //             {
                //                 value: "女性亲子",
                //                 label: "女性亲子"
                //             },
                //             {
                //                 value: "拍摄美化",
                //                 label: "拍摄美化"
                //             },
                //             {
                //                 value: "智能设备",
                //                 label: "智能设备"
                //             },
                //             {
                //                 value: "应用分发",
                //                 label: "应用分发"
                //             },
                //         ]
                //     },
                //     {
                //         value: "日用百货",
                //         label: "日用百货"
                //     },
                //     {
                //         value: "家具建材",
                //         label: "家具建材"
                //     }
                // ],
            }
        },
        created() {
            this.sessionData = sessFun.getSess();
            this.allHoppy = allHoppy;
        },
        mounted() {
            this.getPorList()
        },
        methods: {
            // 价格加上逗号
            priceFormat(price) {
                return commaFormat.init(price);
            },
            //点击通过
            openPicDialogFun(apid, count, price, apName,aitime) {
                this.openPicDialog = true;
                this.currApid = apid;
                this.currCount = count;
                this.currPrice = price;
                this.currApname = apName;
                this.getHouseList(apid,aitime,2);
                this.getTags(apid)
            },
            //申请开通画像的订单列表
            getPorList() {
                this.dataArr = [];
                let that = this;
                let uid = this.sessionData.uID;
                let token = this.sessionData.token;
                let info = {
                    uid: uid,
                    tooken: token
                };
                api.getApi(that.apiVar.QZhike + '/SetPorList', info).then(res => {
                        console.log('SetPorList画像审核列表返回---', res.data);
                        // let obj = {};
                        if (res.data.SysCode == 100302) {
                            that.$message.warning('登录超时,请重新登录');
                            that.$router.push('/login');
                        }

                        let arr = res.data.concat();
                        // let t = [];
                        // for (let i in arr.reverse()) {
                        //     if (arr[i].aiState === 0) {
                        //         t.push(arr.reverse().splice(i, 1))
                        //         // arr.unshift(t[0])
                        //         // this.dataArr.push(t[0])
                        //     }
                        // }
                        // console.log('ttttt', t);
                        // // arr.sort(this.compareSort);
                        // console.log('arr----', arr);
                        // arr = arr.concat(t);

                        for (let data of arr) {
                            let aiTime = new Date(data.aiTime).getTime();
                            let obj = {
                                aiState: data.aiState,
                                apid: data.apID,
                                count: data.resCount,
                                resName: data.resName,
                                timeDiff: timeFormat.timestampFormat(aiTime),
                                aiTime: data.aiTime,
                                price: data.total ? data.total : 0,
                                apName: data.apName,
                                realName: data.uName,
                                ctList: data.ctList ? data.ctList.split(',') : ''
                            };
                            // obj.ctList.pop();
                            this.dataArr.push(obj);
                            // this.getApName(res.data[i].apID, uid, i, res.data.length, obj)
                        }

                        console.log('申请的提前', this.dataArr);

                        this.applyList = this.dataArr;
                        console.log('排序后', this.applyList);

                    }
                );
            },
            //消费偏好
            getTags(apid) {
                this.hoppyTags = [];
                let ctArr = [];
                for (let i = 0;i< this.dataArr.length;i++) {
                    if (this.dataArr[i].apid === apid && this.dataArr[i].ctList.length !== 0) {
                        console.log('有消费偏好的', this.dataArr[i]);
                        console.log('ctList---', this.dataArr[i].ctList);
                            ctArr.push(this.dataArr[i].ctList)

                    }
                }
                if (ctArr.length != 0) {
                    console.log('消费偏好----', ctArr[0]);
                    for (let data2 of ctArr[0]) {
                        this.hoppyTags.push(hoppyToText.getName(data2))
                    }
                    console.log('消费偏好', this.hoppyTags)
                }

            },
            //列表排序
            compareSort(obj1, obj2) {
                let val1 = obj1.aiTime;
                let val2 = obj2.aiTime;
                if (val1 < val2) {
                    return 1;
                } else if (val1 > val2) {
                    return -1;
                } else {
                    return 0;
                }
            },

            //申请开通的社区列表
            getHouseList(apid,aitime,state) {
                if (!state) {
                    this.houselistDialog = true;
                }
                let info = {
                    apid: apid,
                    uid: this.sessionData.uID,
                    tooken: this.sessionData.token,
                    aitime:timeFormat.toDateTime(aitime)
                };
                console.log('获取社区列表info--',info)
                api.getApi(this.apiVar.QZhike + '/SelectApIdOrder', info).then(res => {
                    console.log('SelectApIdOrder返回---', res.data);
                    let resList = [];
                    if (res.data.SysCode) {
                        if (res.data.SysCode == 100302) {
                            this.$message.warning('登录超时,请重新登录');
                            this.$router.push('/login');
                        }
                    } else {

                        for (let data of res.data) {
                            let resObj = {};
                            resObj.resCity = data.resCity?data.resCity:'';
                            resObj.resCounty = data.resCounty?data.resCounty:'';
                            resObj.resName = data.resName?data.resName:'';
                            resObj.gSDay = data.gSDay?data.gSDay:'';
                            resObj.gEDay = data.gEDay?data.gEDay:'';
                            resObj.apid = data.apID?data.apID:'';
                            resList.push(resObj)
                        }
                    }

                    this.houseList = resList;
                    console.log('社区列表', this.houseList);
                })
            },
            // 时间格式规范
            formatTime(val) {
                if (val) {
                    return timeFormat.toDate(val, "/");
                }
            },
            //确定或拒绝 审核
            passApply(status, apid) {
                if (status === 1) {
                    if (this.hoppyTags.length == 0) {
                        this.$message.warning('请选择消费偏好！');
                        return
                    }
                }
                let aiState = status;
                let ctArr = [];
                for (let data  of this.hoppyTags) {
                    ctArr.push(data.id)
                }
                let m = [];
                let t = [];
                for (let data of ctArr) {
                    m.push(data)
                    if(data<26){
                        t.push(data)
                    }
                }
                if(m.length>8){
                    this.$message.warning('消费偏好最多选择8个！');
                    return
                }
                if(t.length>5){
                    this.$message.warning('APP安装最多选择5个！');
                    return
                }

                let info = {
                    //关联订单id
                    apid: apid,
                    //审核人id
                    suid: this.sessionData.uID,
                    //订单状态
                    aistate: aiState,
                    tooken: this.sessionData.token,
                    ctlist: ctArr.join(',')
                };
                console.log('审核info---', info);
                api.getApi(this.apiVar.QZhike + '/UpdateState', info).then(res => {
                    console.log("审核UpdateState返回---", res.data);
                    if (res.data.SysCode == 100302) {
                        this.$message.warning('登录超时,请重新登录');
                        this.$router.push('/login');
                    } else if (res.data.SysCode == 700200) {
                        //通过
                        this.$message.success(res.data.MSG);
                        this.getPorList()
                    } else {
                        //拒绝
                        this.$message.warning(res.data.MSG);
                        this.getPorList();
                    }
                });
                this.openPicDialog = false

            },
            //开通社区画像 取消按钮{
            cancelApply() {
                this.selectHoppy = [];
                this.hoppyTags = [];
                this.openPicDialog = false
            },
            changeHoppy() {
                console.log("改变了消费偏好");
                console.log(this.selectHoppy);
                let text = hoppyToText.getText(this.selectHoppy);
                let info = {
                    id: this.selectHoppy[1],
                    value: this.selectHoppy.join(','),
                    label: text.second
                };
                // console.log(hoppyToText.getText(this.spliceHoppy));
                console.log('text---------------', text);
                if (this.hoppyInclude(this.hoppyTags, this.selectHoppy)) {
                    this.$message.warning('请不要选择重复的消费偏好！');
                } else {
                    this.hoppyTags.push(info);
                }
                this.selectHoppy = [];


            },
            // 判断已选择的数据是否有要新添加的数据
            hoppyInclude(arr, info) {
                let isInclude = false;
                for (let data of arr) {
                    if (data.id == info[1]) {
                        isInclude = true;
                        break;
                    }
                }
                return isInclude;
            },
            spliceHoppy(index) {
                this.hoppyTags.splice(index, 1);
            },
            //列表状态切换
            changeButtons(index) {
                console.log(index);
                this.num = index;
                console.log('申请列表', this.dataArr);
                let tempArr = [];
                //日期
                let date = this.titleDate;
                console.log('选择了的日期', this.titleDate);
                //0.全部 1.待审核 2.已通过 3.已拒绝
                if (date) {
                    for (let data of this.dataArr) {
                        // console.log(new Date(data.aiTime).getTime());
                        // console.log(new Date(date[0]),new Date(date[1]));
                        // console.log(new Date(date[0]) <= new Date(data.aiTime).getTime());
                        // console.log(new Date(date[1]) >= new Date(data.aiTime).getTime());
                        if ((new Date(data.aiTime).getTime()) >= new Date(date[0]) && (new Date(data.aiTime).getTime()) <= new Date(date[1])) {
                            //在日期范围内
                            if (index == 1 && data.aiState == 0) {
                                console.log('待审核');
                                //待审核
                                tempArr.push(data)
                            } else if (index == 2 && data.aiState == 1) {
                                //通过
                                console.log('通过');
                                tempArr.push(data)
                            } else if (index == 3 && data.aiState == 2) {
                                //拒绝
                                console.log('拒绝');
                                tempArr.push(data)
                            } else if (index == 0) {
                                // console.log('全部');
                                tempArr.push(data)
                            }
                        }
                    }

                } else {
                    //日期为空
                    console.log('日期为空');
                    for (let data of this.dataArr) {
                        if (index == 1 && data.aiState == 0) {
                            //待审核
                            console.log('待审核');
                            tempArr.push(data)
                        } else if (index == 2 && data.aiState == 1) {
                            //通过
                            console.log('通过');
                            tempArr.push(data)
                        } else if (index == 3 && data.aiState == 2) {
                            //拒绝
                            console.log('拒绝');
                            tempArr.push(data)
                        } else if (index == 0) {
                            console.log('全部');
                            tempArr.push(data)
                        }
                    }
                }
                this.applyList = tempArr

            },
            //日期搜索
            selectDate() {
                console.log('日期选择', this.titleDate);
                let date = this.titleDate;
                let num = this.num;
                let tempArr = [];
                for (let data of this.dataArr) {
                    // console.log(new Date(data.aiTime).getTime());
                    // console.log(new Date(date[0]), new Date(date[1]));
                    // console.log(new Date(date[0]) <= new Date(data.aiTime).getTime());
                    // console.log(new Date(date[1]) >= new Date(data.aiTime).getTime());
                    if (date) {
                        if (new Date(date[0]) <= (new Date(data.aiTime).getTime()) && new Date(date[1]) >= (new Date(data.aiTime).getTime())) {
                            console.log('在日期范围内')
                            if (num == 1 && data.aiState == 0) {
                                console.log('待审核');
                                tempArr.push(data)
                            } else if (num == 2 && data.aiState == 1) {
                                console.log('通过');
                                //通过
                                tempArr.push(data)
                            } else if (num == 3 && data.aiState == 2) {
                                console.log('拒绝');
                                //拒绝
                                tempArr.push(data)
                            } else if (num == 0) {
                                console.log('全部');
                                tempArr.push(data)
                            }
                        }
                    } else {
                        console.log('叉掉了日期');
                        tempArr = this.dataArr
                    }
                }
                console.log(tempArr);
                if (tempArr.length == 0) {
                    this.$message.warning('没有符合条件的数据！')
                }
                this.applyList = tempArr
            }
        }

    }
</script>

<style scoped>
    /*面包屑导航*/
    .ad_mediaDetail_wrap {
        position: relative;
    }

    .ad_mediaDetail_nav p {
        padding-left: 65px;
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

    .mediaList_wrap {
        width: 90%;
        height: 581px;
        background: #FFFFFF;
        border: 1px solid #E6E7E9;
        border-radius: 4px;
        margin: 0 auto;
    }

    /deep/ .el-card {
        border: none;
    }

    /deep/ .el-card__header {
        padding: 9px 20px;
        line-height: 32px;
    }

    /deep/ .el-card__body {
        padding: 0 20px 20px 20px;
        height: 466px;
        overflow-y: scroll;
    }

    /deep/ .el-card__body::-webkit-scrollbar {
        width: 4px;
        background: #ffffff;
    }

    /*定义滑块 内阴影+圆角*/
    /deep/ .el-card__body::-webkit-scrollbar-thumb {
        border-radius: 4px;
        background: #C1C1C1;
    }

    .qlzk-title {
        display: inline-block;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: bold;
    }

    .qlzk-title-button {
        float: right;
        line-height: 32px;
    }

    .qlzk-title-button button {
        padding: 3px 0;
        color: rgba(0, 0, 0, 0.65);
    }

    .qlzk-title-button /deep/ .el-button + .el-button {
        margin-left: 24px;
    }

    /deep/ .el-card__header button.active span {
        color: #1890FF !important;
    }

    /deep/ .el-card__header span:first-child {
        font-size: 14px;
        color: rgba(0, 0, 0, .65);
        font-weight: 400;
    }

    .qlzk-title-button /deep/ .el-range-editor.el-input__inner {
        width: 256px;
        height: 32px;
        line-height: 32px;
        color: rgba(0, 0, 0, 0.65);
    }

    .qlzk-title-button /deep/ .el-date-editor .el-range-separator {
        line-height: 26px;
        font-size: 14px;
    }

    .qlzk-title-button /deep/ .el-date-editor .el-range__icon {
        line-height: 26px;
    }

    .list .list-item img {
        width: 32px;
        height: 32px;
    }

    .list .list-item {
        border-bottom: 1px solid #E8E8E8;
        height: 79px;
        padding-top: 16px;
        box-sizing: border-box;
    }

    .list .list-item > span {
        float: left;
    }

    .list .list-item .item-content p {
        margin-bottom: 4px;
        font-size: 14px;
        color: rgba(0, 0, 0, 0.65);
    }

    .list .list-item em {
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);

    }

    .list .list-item .item-content span {
        color: #108EE9;
        /*cursor: pointer;*/
    }

    .list .list-item .item-content i {
        color: #108EE9;
        text-decoration: underline;
        font-style: normal;
        cursor: pointer;
    }

    .list .list-item button {
        width: 74px;
        height: 32px;
        line-height: 8px;
    }

    .list .list-item /deep/ button.is-disabled span {
        position: relative;
        left: -4px;
    }

    .houseList-wrap {
        border: 1px solid #C2C2C2;
        border-radius: 4px;
        margin-bottom: 18px;
        margin-top: 5px;
    }

    .houseList-wrap /deep/ .el-dialog__body {
        padding: 0 20px;
    }

    .houseList-wrap li {
        border-bottom: 1px solid #e9e9e9;
        height: 43px;
        line-height: 43px;
        display: flex;
        justify-content: space-around;
    }

    .houseList-wrap li span {
        flex: 1;
        text-align: center;
    }

    .houseList-wrap li span:last-child {
        flex: 2;
        overflow-x: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    /*滚动条*/
    .houseList-wrap {
        height: 351px;
        overflow-y: scroll;
        overflow-x: hidden;
    }

    .houseList-wrap ::-webkit-scrollbar {
        width: 4px;
        background: #fafafa;
    }

    .houseList-wrap ::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #c1c1c1;
        border-radius: 4px;
    }

    .total-count {
        text-align: right;
        font-size: 12px;
        color: #666666;
    }

    .total-count span {
        font-size: 24px;
        color: #343131;
        margin-left: 2px;
    }

    .openPicDialog /deep/ .el-input__inner {
        height: 32px;
    }

    .openPicDialog /deep/ .el-dialog__body {
        padding-top: 0px;
    }

    .openPicDialog h1 {
        font-size: 16px;
        color: #303133;
    }

    .openPicDialog /deep/ .el-tag {
        margin-right: 5px;
        margin-bottom: 5px;
    }

    .openPicDialog /deep/ .dialog-footer button {
        height: 34px;
        line-height: 10px;
    }

    /deep/ .el-date-editor .el-range__close-icon {
        line-height: 23px;
    }

    /*1440*/
    @media all and (min-width: 1420px) {
        .ad_mediaDetail_nav p {
            padding-left: 70px;
        }
    }

    /*1920*/
    @media all and (min-width: 1900px) {
        .ad_mediaDetail_nav p {
            padding-left: 95px;
        }

    }
</style>
