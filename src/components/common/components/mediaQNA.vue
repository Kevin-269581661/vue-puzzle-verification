<template>
    <div>
        <!--<div style="margin-bottom: 40px">-->
            <!--&lt;!&ndash;<el-input&ndash;&gt;-->
                <!--&lt;!&ndash;placeholder="请输入内容"&ndash;&gt;-->
                <!--&lt;!&ndash;prefix-icon="el-icon-search"&ndash;&gt;-->
                <!--&lt;!&ndash;v-model="keyword">&ndash;&gt;-->
            <!--&lt;!&ndash;</el-input>&ndash;&gt;-->
            <!--<el-autocomplete-->
                <!--class="inline-input"-->
                <!--v-model="seleQ"-->
                <!--:fetch-suggestions="querySearch"-->
                <!--placeholder="请输入内容"-->
                <!--:trigger-on-focus="false"-->
                <!--@select="handleSelect"-->
            <!--&gt;</el-autocomplete>-->
        <!--</div>-->
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
                <template slot="title">
                    <h3>Q1.为何提示媒体创建失败？</h3>
                </template>
                <div>
                    <P>A1：请先检查资源及媒体的必填字段（每个必填字段左侧会有红色“*”号提示）是否已经填写及各个字段是否超过字数限制，具体字段限制如下图：</P>
                    <br/>
                    <div class="table-wrap">
                        <el-table
                            :data="tableData"
                            border
                            :show-header=false
                            style="width: 100%">
                            <el-table-column
                                prop="word"
                                label="字段"
                                min-width="30%">
                            </el-table-column>
                            <el-table-column
                                prop="limit"
                                label="限制"
                                min-width="70%">
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <h3>Q2.媒体资产编号是否必填？</h3>
                </template>
                <div>
                    <p>A2：当媒体状态为待安装时，则资产编号为空；其他状态（正常、待维修、禁用）都必填</p>
                </div>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template slot="title">
                    <h3>Q3.媒体状态是否可以修改？</h3>
                </template>
                <div>
                    <p>
                        A3：可以；点击媒体列表最右侧操作按钮，即可修改媒体状态；正常状态的媒体可以修改为禁止，前提是无预锁中的方案或者无发布的订单调用此媒体；待安装的媒体修改状态为正常需在亲邻助手中完成装门任务</p>
                </div>
            </el-collapse-item>
            <el-collapse-item name="4">
                <template slot="title">
                    <h3>Q4.媒体的投放面数确定后是否可以修改？</h3>
                </template>
                <div><p>A4：不可以，如需修改请联系亲邻总部</p></div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    export default {
        name: "mediaQNA",
        data() {
            return {
                restaurants: [],
                keyword: '',
                activeNames: 1,
                seleQ:'',
                Qarr: [
                    {Q: '为何提示媒体创建失败？'},
                    {Q: '媒体资产编号是否必填？'},
                    {Q: '媒体状态是否可以修改？'},
                    {Q: '媒体的投放面数确定后是否可以修改？'},
                ],
                tableData: [
                    {word: '资源类型', limit: '必填'},
                    {word: '资源名称', limit: '限制40个字符'},
                    {word: '所属城市', limit: '必填'},
                    {word: '所属区域', limit: '必填'},
                    {word: '所属商圈', limit: '限制40个字符'},
                    {word: '具体地址', limit: '限制70个字符'},
                    {word: '楼盘类型', limit: '必填'},
                    {word: '出入口数', limit: '限制字数1~20'},
                    {word: '楼栋数量', limit: '必填，限制数字1~9999999'},
                    {word: '住户数量', limit: '必填，限制数字1~9999999'},
                    {word: '楼盘价格', limit: '必填，限制数字1~9999999'},
                    {word: '入住年份', limit: '必填'},
                    {word: '经纬度', limit: '必填，经度只能输入1-180，纬度只能输入0-90'},
                    {word: '所属物业', limit: '限制20个字符'},
                    {word: '媒介载体', limit: '必填'},
                    {word: '媒体名称', limit: '必填，限制40个字符'},
                    {word: '可投面数', limit: '必填，1-26，但前端只显示A面和B面'},
                    {word: '媒体状态', limit: '必填'},
                    {word: '资产编号', limit: '必填，限制40个字符，状态为待安装，则资产编号不填'},
                    {word: '媒体类型', limit: '必填，限制20个字符'},
                    {word: '广告尺寸', limit: '必填，宽度1~9999999，高度1~9999999'},
                    {word: '可视画面', limit: '必填，宽度1~9999999，高度1~9999999'},
                    {word: '备注', limit: '限制200个字符'},
                ]
            }
        },
        mounted() {
            this.restaurants = this.loadAll();
        },
        methods: {
            handleChange() {

            },
            querySearch(queryString, cb) {
                var restaurants = this.restaurants;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) !== -1);
                };
            },
            loadAll() {
                return [
                    { "value": "为何提示媒体创建失败？", "address": "长宁区新渔路144号" },
                    { "value": "媒体资产编号是否必填？", "address": "上海市长宁区淞虹路661号" },
                    { "value": "媒体状态是否可以修改？", "address": "上海市普陀区真北路988号创邑金沙谷6号楼113" },
                    { "value": "媒体的投放面数确定后是否可以修改？", "address": "天山西路438号" },

                ];
            },
            //点击选择的问题
            handleSelect(item) {
                console.log(item);
            }
        }

    }
</script>

<style scoped>
    h3 {
        color: #000;
        font-size: 18px;
        font-weight: bold;
        text-align: left;
        padding-left: 20px;
    }

    p {
        text-align: left;
        padding: 10px 22px;
        font-size: 16px;
    }

    .el-main {
        background: #f5f6fa;
        padding-bottom: 120px;
    }
    img {
        width: 90%;
    }
    .table-wrap{
        padding-left: 60px;
    }
    .el-autocomplete{
        width: 100%;
    }
    .el-autocomplete .el-input__inner{
        width: 100%;
    }
</style>
<style>
    .table-wrap .el-table{
        width: 80%;
    }
    .table-wrap{
        width: 80%;
    }
</style>
