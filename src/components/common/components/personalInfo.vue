<template>
    <div class="row-box">
        <div class="item-one">
            <img :src="userInfo.avator" alt="" class="avator-round">
            <ul class="item-one-column">
                <li class="bold-text">{{userInfo.username || ''}}</li>
                <li class="normal-text">{{userInfo.role || ''}}</li>
            </ul>
            <div v-if="rank" class="item-one-column item-one-board">
                <span class="bold-text">第{{rank}}名</span>
                <span class="normal-text">城市排名</span>
            </div>
        </div>
        <div v-if="rank" class="line-vertical"></div>
        <div class="item-two">
            <img v-for="(item,index) of honorImg" :key="index" :src="item.url" :alt="item.title" :title="item.title">
            <!-- <i>{{key.title}}</i> -->
        </div>
        <div v-if="rank || honorImg.length>0" class="line-vertical"></div>
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
            rank: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
            }
        },
        methods: {
        },
        mounted() {
        }
    }
</script>

<style scoped lang="scss">
* {font-family: "Helvetica Neue", Helvetica, Arial, "PingFang ", "Hiragino Sans GB" "Heiti SC", "Microsoft YaHei", "WenQuanYi Micro Hei", sans-serif;}
li {

}
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
        flex: 1;
        display: flex;
        justify-content: space-between;
        margin-left: 27px;
        margin-right: 27px;
        overflow: hidden;
        img {
            margin: 0 5px;
            width: 51px;
            height: 59px;
        }
    }
    .item-three {
        flex: 1;
        margin-left: 32px;
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
        flex-grow: unset;
        background: rgba(241, 241, 241, 1);
    }
}
</style>
