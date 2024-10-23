<template>
    <div class="row-box">
        <div class="item-one">
            <img :src="userInfo.headPic||'../../../static/images/niu.png'" alt="" class="avator-round">
            <ul class="item-one-column">
                <li class="bold-text">{{userInfo.realName || ''}}</li>
                <li class="normal-text">{{userInfo | uTypeToText}}</li>
            </ul>
            <div v-if="cityRank" class="item-one-column item-one-board">
                <span class="bold-text">第{{cityRank}}名</span>
                <span class="normal-text">城市排名</span>
            </div>
        </div>

        <div v-if="honorImg.length>0" class="line-vertical"></div>

        <div class="item-two" v-if="honorImg.length>0">
            <slot :showImgNum="showImgNum"></slot>
        </div>

        <div v-show="showImgNum < honorImg.length && showImgNum > 0" class="overflow-img">●●●</div>

        <div v-if="linkArr.length>0 && showImgNum > 0" class="line-vertical"></div>

        <div class="item-three">
            <home-link class="cell-group" :link="linkArr"></home-link>
        </div>
    </div>
</template>

<script>
    import homeLink from './homeLinkNew.vue';
    export default {
        name: "personalInfo",
        components: {
            homeLink,
        },
        props: {
            userInfo: {
                type: Object,
                default: {},
            },
            honorImg:{
                type: Array,
                default: []
            },
            linkArr:{
                type: Array,
                default: []
            },
            cityRank: {
                type: [String, Number],
                default: ''
            },
            imgSize: {
                type: Array,
            }
        },
        data() {
            return {
                showImgNum: 0
            }
        },
        watch: {
            honorImg(val) {
                // 数据更改并渲染时触发
                this.$nextTick(()=>{
                    this.honorImg.length && !this.showImgNum && this.setEllipsis()
                })
            }
        },
        methods: {
            setEllipsis() {
                let imgGroupWidth = $('.item-two')[0]
                if(!imgGroupWidth || !this.imgSize) return
                imgGroupWidth = imgGroupWidth.getBoundingClientRect().width
                this.showImgNum = Math.floor(imgGroupWidth / (this.imgSize[0]+10))
            }
        },
        mounted() {
            window.addEventListener("resize", ()=>{
                this.setEllipsis()
            })
        }
    }
</script>

<style scoped lang="scss">
* {font-family: "Helvetica Neue", Helvetica, Arial, "PingFang ", "Hiragino Sans GB" "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;}
%flex-row-center {
    display: flex;
    align-items: center;
    flex-flow: row nowrap;
}
%flex-column-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column nowrap;
}
.row-box {
    @extend %flex-row-center;
    position: relative;
    height: 130px;
    width: 100%;
    padding: 0 24px;
    border: 1px solid #E6E7E9;
    box-sizing: border-box;
    background: #fff;
    font-family: PingFangSC-Regular, PingFang SC;
    & > div {
       box-sizing: border-box;
    }
    .item-one {
        @extend %flex-row-center;
        justify-content: space-between;
        padding: 0 32px 0 0;
        .avator-round {
            width: 64px;
            height: 64px;
            border-radius: 32px;
            margin-right: 12px;
        }
        .item-one-column {
            .bold-text {
                margin-bottom: 5px;
                font-size: 18px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: rgba(51, 51, 51, 1);
                line-height: 24px;
                white-space: nowrap;
            }
            .normal-text {
                font-size: 14px;
                font-weight: 400;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(0, 0, 0, 0.45);
                line-height: 22px;
                white-space: nowrap;
            }
        }
        .item-one-board {
            @extend %flex-column-center;
            width: 88px;
            height: 64px;
            margin-left: 33px;
            background: rgba(248, 248, 248, 1);
            border-radius: 6px;
        }
    }
    .item-two {
        display: flex;
        justify-content: flex-start;
        flex-grow: 1;
        margin: 0 27px 0 -5px;
        overflow: hidden;
        .img-default-size {
            width: 51px;
            max-height: 62px;
        }
        img {
            margin: 0 5px;
        }
    }
    .item-three {
        // width: 50%;
        // flex: 1;
        margin-left: auto;
        .cell-group {
            @extend %flex-row-center;
            justify-content: space-between;
            margin-left: -12px;
            margin-right: -12px;
        }
    }
    .line-vertical {
        width: 1px;
        height: 64px;
        margin-right: 32px;
        flex-grow: unset;
        background: rgba(241, 241, 241, 1);
    }
    .overflow-img {
        width: 51px;
        margin: auto 27px auto 0;
        text-align: center;
        color: rgba(0, 0, 0, 0.2);

    }
    /* @media screen and (max-width: 1420px) {
        .overflow-img {
            display: block;
        }
        .item-two {
            width: 183px;
        }
    } */
}
</style>
