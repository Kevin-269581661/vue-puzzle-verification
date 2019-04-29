<template>
    <div>
        <!--<div style="margin-bottom: 40px">
            <el-input
                placeholder="请输入内容"
                prefix-icon="el-icon-search"
                v-model="keyword">
            </el-input>
        </div>-->
        <el-collapse v-model="activeNames" @change="handleChange">
            <el-collapse-item name="1">
                <template slot="title">
                    <h3>Q1.为何提示客户创建失败？</h3>
                </template>
                <div>
                    <div>
                        <p>A1：(1)联系人账户名请不要使用销售的账户名，建议使用联系人姓名的拼音；该账号主要用于以后会将QADN系统的广告主直接登录操作</p>
                        <p style="padding-left: 59px">(2)底部公司信息，若非该销售新建的公司，则无法修改，建议操作为：</p>
                        <p style="padding-left: 70px">i.输入公司名简称，直接读取系统加载出来的公司：</p>
                        <p><img src="../../../assets/images/CQNA_img1.png" alt=""></p>
                        <p style="padding-left: 70px">ii.若加载出来的公司均不符合，则直接输入新的公司名，填写新的公司信息即可</p>
                    </div>

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
                keyword: '',
                activeNames: 1
            }
        },
        methods: {
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
