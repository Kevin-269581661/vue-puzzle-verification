<template>
    <div class="list-wrap">
        <el-radio-group v-model="checked" @change="radioChange">
            <el-radio-button label="应用市场"></el-radio-button>
            <el-radio-button label="公告通知"></el-radio-button>
        </el-radio-group>
        <el-carousel ref="carousel" :autoplay="false" arrow="never" indicator-position="none" class="carousel-box"  height="528px" @change='carouselChange'>
            <el-carousel-item>
                <ul class="app-list">
                    <li class="app-item" v-for="item in appCenter" @click="goToPage(item)">
                        <div class="item-left">
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <div class="item-right">
                            <span class="app-name">{{item.title}}</span>
                            <!-- <el-tooltip popper-class="desc-tooltip" effect="dark" :content="item.desc" v-model="item.descTooltip"> -->
                                <p class="app-desc">{{item.desc}}</p>
                            <!-- </el-tooltip> -->
                        </div>
                    </li>
                </ul>
            </el-carousel-item>
            <el-carousel-item>
                <ul class="app-list">
                    <li class="app-item" v-for="item in appCenter" @click="goToPage(item)">
                        <div class="item-left">
                            <img :src="item.imgUrl" alt="">
                        </div>
                        <div class="item-right">
                            <span class="app-name">{{item.title}}</span>
                            <!-- <el-tooltip popper-class="desc-tooltip" effect="dark" :content="item.desc" v-model="item.descTooltip"> -->
                                <p class="app-desc">{{item.desc}}</p>
                            <!-- </el-tooltip> -->
                        </div>
                    </li>
                </ul>
            </el-carousel-item>
        </el-carousel>
    </div>
</template>

<script>
    export default {
        name: "messageAndApp",
        props: {
            appCenter:{
                type: [Object, String, Array],
                default: ()=>{}
            }
        },
        data() {
            return {
                checked: '应用市场'
            }
        },
        methods: {
            goToPage(item) {
                this.$emit('goToPage', item)
            },
            radioChange(val) {
                if(val === '公告通知') {
                    this.$refs.carousel.setActiveItem(1)
                } else {
                    this.$refs.carousel.setActiveItem(0)
                }
            },
            carouselChange(val) {
                if(val == 1 && this.checked == '应用市场') {
                    this.checked = '公告通知'
                } else if(val == 0 && this.checked == '公告通知') {
                    this.checked = '应用市场'
                }
            }
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
::-webkit-scrollbar {
    width: 4px;
    background: #fafafa;
}
::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: #fafafa;
    border-radius: 4px;
}
.list-wrap {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px 24px 0;
    .carousel-box {
        width: 100%;
        padding-top: 16px;
        .app-list {
            height: 100%;
            overflow-y: auto;
            overflow-x: hidden;
            .app-item {
                position: relative;
                display: flex;
                flex-direction: row;
                align-items: center;
                margin: 16px 0;
                cursor: pointer;
                .item-left {
                    img {
                        width: 48px;
                        height: 48px;
                        margin-right: 12px;
                        border-radius: 8px;
                    }
                }
                .item-right {
                    display: flex;
                    flex-direction: column;
                    .app-name {
                        font-size: 16px;
                        font-family: PingFangSC-Semibold, PingFang SC;
                        font-weight: 600;
                        color: rgba(0, 0, 0, 0.85);
                        line-height: 24px;
                    }
                    .app-desc {
                        width: 204px;
                        overflow: hidden;
                        white-space: nowrap;
                        font-size: 12px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: rgba(0, 0, 0, 0.65);
                        line-height: 18px;
                        text-overflow: ellipsis;
                    }
                }
            }
        }
    }
}
</style>
