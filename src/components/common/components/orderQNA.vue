<template>
    <div>
      <!--  <div style="margin-bottom: 40px">
            <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="keyword">
            </el-input>
        </div>-->
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
                <template slot="title">
                    <h3>Q1.为何发布方案后，还是显示未投放状态？</h3>
                </template>
                <div>
                    <P>A1：qadn在半夜执行程序，隔天会显示为投放中或者投放完成状态</P>
                </div>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <h3>Q2.能否中止整个订单的投放？</h3>
                </template>
                <div><p>A2：城市的超级运营在订单列表的操作栏中直接操作“结束订单”即可</p></div>
                <br/>
                <p class="img-wrap"><img src="../../../assets/images/OQNA_img1.png" alt=""></p>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template slot="title">
                    <h3>Q3.能否导出监播报告？</h3>
                </template>
                <div>
                    <p>A3：可以，报告分为2张PDF文件，在订单详情页面点击，位置如下图</p>
                    <br/>
                    <p class="img-wrap"><img src="../../../assets/images/OQNA_img2.png" alt=""></p>
                    <p class="img-wrap"><img src="../../../assets/images/OQNA_img3.png" alt=""></p>
                </div>
            </el-collapse-item>
            <el-collapse-item name="4">
                <template slot="title">
                    <h3>Q4.订单的单个点位如何中止投放？</h3>
                </template>
                <div>
                    <p>A4：进入订单详情，点击“换点“按钮，进入换点页面，点击 “中止”按钮即可</p>
                    <br/>
                    <p class="img-wrap"><img src="../../../assets/images/OQNA_img4.png" alt=""></p>
                    <p class="img-wrap"><img src="../../../assets/images/OQNA_img5.png" alt=""></p>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>

</template>

<script>
    export default {
        name: "mediaQNA",
        data(){
            return{
                keyword:'',
               activeNames:1
            }
        },
        methods:{
            handleChange() {

            },
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
</style>
