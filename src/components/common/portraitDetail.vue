<template>
    <!--画像详情-->
    <div class="portrait-detail-wrap">
        <div class="ad_mediaDetail_nav ">
            <p class="clearfix">
                <a href="#" style="color: #999">亲邻智邻</a>
            </p>
            <el-dropdown trigger="click">
                <p class="el-dropdown-link">
                    下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </p>
                <el-dropdown-menu slot="dropdown" >
                    <el-dropdown-item>黄金糕</el-dropdown-item>
                    <el-dropdown-item>狮子头</el-dropdown-item>
                    <el-dropdown-item>螺蛳粉</el-dropdown-item>
                    <el-dropdown-item disabled>双皮奶</el-dropdown-item>
                    <el-dropdown-item divided>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        <div class="top-content-wrap">
            <div class="title">
                <img src="../../assets/images/resLogo.svg" alt="">
                <h5>{{resData.resName}}</h5>
            </div>
            <div class="community_main_info">
                <div class="community_info_row">
                    <h6 class="community_info_h6">位置信息</h6>
                    <el-row>
                        <el-col :span="6">
                            <label class="community_info_label">城市：</label><span>{{resData.city || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">区域：</label><span>{{resData.cityArea || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">商圈：</label><span>{{resData.tradingArea || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">详细地址：</label><span>{{resData.resAddress}}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="community_info_row">
                    <h6 class="community_info_h6">社区类型</h6>
                    <el-row>
                        <el-col :span="6">
                            <label class="community_info_label">资源类型：</label><span>{{resData.resType == 1 ? '社区' : '写字楼'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">楼盘类型：</label><span>{{resData.houseType || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label
                                class="community_info_label">楼盘价格：</label><span>¥{{resData.floorPrice || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">入住年份：</label><span>{{resData.joinTime || '--'}}</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="community_info_row">
                    <h6 class="community_info_h6">社区信息</h6>
                    <el-row>
                        <el-col :span="6">
                            <label
                                class="community_info_label">楼栋数量：</label><span>{{resData.buildingNum || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">住户数量：</label><span>{{resData.HouseNum || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">媒体数量：</label><span>{{resData.mediaNum || '--'}}</span>
                        </el-col>
                        <el-col :span="6">
                            <label class="community_info_label">点位数量：</label><span>{{resData.adsNum || '--'}}</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <div class="tab-wrap">
            <el-tabs>
                <el-tab-pane label="用户管理">
                    用户管理
                </el-tab-pane>
                <el-tab-pane label="配置管理"></el-tab-pane>
            </el-tabs>
        </div>

    </div>
</template>

<script>
    export default {
        name: "portraitDetail",
        data() {
            return {
                resData: {
                    resName: '中信西关海花苑',
                    resType: '1',
                    city: '',
                    cityArea: '',
                    tradingArea: '',
                    houseType: '',
                    floorPrice: '',
                    HouseNum: 0,
                    buildingNum: 0,
                    joinTime: '',
                    resAddress: '',
                    mediaNum: 0,
                    adsNum: 0
                },
            }
        }
    }
</script>

<style scoped>
    .el-dropdown-link{
        cursor: pointer;
    }
    .ad_mediaDetail_nav {
        display: flex;
        justify-content: space-between;
    }

    .top-content-wrap{
        margin: 0 64px;
        box-sizing: border-box;
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(230, 231, 233, 1);
        padding: 32px;
    }
    .tab-wrap{
        margin: 24px 64px;
        background: #fff;
    }
    .tab-wrap /deep/ .el-tabs__nav-wrap{
        padding: 0 14px;
        border:1px solid rgba(230,231,233,1);
    }
    .tab-wrap /deep/ .el-tabs__header{
        margin-bottom: 0;
    }
    .tab-wrap /deep/ .el-tabs__content{
        background: #f5f6fa;
        padding-top: 24px;
    }

    .top-content-wrap .title {
        display: flex;
        align-items: center;

    }

    .top-content-wrap .title h5 {
        margin-left: 12px;
        font-size: 20px;
        color: rgba(0, 0, 0, 0.85);
        font-weight: 500;
    }

    .community_main_info {
        padding: 16px 0 0 44px;
    }

    .community_info_row {
        font-size: 14px;
        margin-bottom: 24px;
    }

    .community_info_row h6 {
        margin-bottom: 10px;
    }

    .community_info_row span {
        color: #666666;
    }


    .community_info_row .community_info_label {
        color: #333333;
    }
</style>
