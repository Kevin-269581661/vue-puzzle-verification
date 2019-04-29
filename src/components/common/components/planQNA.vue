<template>
    <div>
       <!-- <div style="margin-bottom: 40px">
            <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="keyword">
            </el-input>
        </div>-->
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
                <template slot="title">
                    <h3>Q1.在哪里使用地图选点？</h3>
                </template>
                <div>
                    <P>A1：(1)点击方案列表的 新建方案 按钮</P>
                    <p style="padding-left: 59px">(2)在第一步中新建方案页面完善客户信息</p>
                    <p>
                        <img src="../../../assets/images/PQNA_img1.png" alt="">
                    </p>
                    <p style="padding-left: 59px">(3)点击第二步中的地图按钮（注意选择排期）如下图所示：</p>

                    <p>
                        <img src="../../../assets/images/PQNA_img2.png" alt="">
                    </p>
                </div>
            </el-collapse-item>
            <el-collapse-item name="2">
                <template slot="title">
                    <h3>Q2.是否可以导出全部点位表？</h3>
                </template>
                <div><p>A2：暂时不可以，点位excle表格不可实时体现点位的使用情况，建议直接在创建方案页面使用地图功能在线挑点</p></div>
            </el-collapse-item>
            <el-collapse-item name="3">
                <template slot="title">
                    <h3>Q3.协同选点是否可以提交多次？</h3>
                </template>
                <div><p>A3：协同选点的页面目前只能够提交一次</p></div>
            </el-collapse-item>
            <el-collapse-item name="4">
                <template slot="title">
                    <h3>Q4.协同选点后，客户要求再选择一次如何解决？</h3>
                </template>
                <div>
                    <p>A4：在方案编辑页面上不点击 更新客户选点，直接点击下一步，再次分享给客户即可。</p>
                    <p class="img-wrap">
                        <img src="../../../assets/images/PQNA_img3.png" alt="">
                    </p>
                </div>
            </el-collapse-item>
            <el-collapse-item name="5">
                <template slot="title">
                    <h3>Q5.为何完成选点后，报价单一直无法提交？</h3>
                </template>
                <div>
                    <p>A5：请先在管理员账号上设置好刊例价，刊例价的定价规格为 2周1面。</p>
                    <p class="img-wrap">
                        <img src="../../../assets/images/PQNA_img4.png" alt="">
                    </p>
                </div>
            </el-collapse-item>
            <el-collapse-item name="6">
                <template slot="title">
                    <h3>Q6.方案预锁规则</h3>
                </template>
                <div>
                    <p>A6：释放规则：
                        1.预锁方案的最大预锁期为7天;&nbsp;
                        2.预锁方案到了投放期，但是不投放，也会释放
                    </p>
                    <p style="padding-left: 59px">方案列表预锁天数倒计时</p>
                    <p class="img-wrap">
                        <img src="../../../assets/images/PQNA_img5.png" alt="">
                    </p>
                </div>
            </el-collapse-item>
        </el-collapse>
    </div>
</template>

<script>
    export default {
        name: "mediaQNA",
        data() {
            return {
                keyword:'',
                activeNames: 1
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
    img {
        width: 90%;
    }
</style>
<style>
    .el-main {
        background: #f5f6fa;
        padding-bottom: 120px;
    }
</style>
