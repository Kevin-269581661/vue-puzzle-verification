<template>
    <div>
        <div v-for="item of talkArr" :key="item.id">
            <p class="time_box">
                <span class="time">{{item.dateTime}}</span>
            </p>
            <div class="info_box">
                <img :src="item.imgurl" alt="">
                <div class="info_content">
                    <span>{{item.content}}</span>
                    <div class="info_arrow"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            talkArr: [
                {
                    id: 1,
                    imgurl: require('../../../assets/images/alreadyLock.png'),
                    content: '宇杰，您上月业绩200万，本月截止9月16号业绩150万，继续努力哦！',
                    dateTime: '2018.08.08 15:06:06' 
                },
                {
                    id: 2,
                    imgurl: require('../../../assets/images/alreadyLock.png'),
                    content: '宇杰，您上月业绩200万，本月截止9月16号业绩150万，继续努力哦！',
                    dateTime: '2018.08.08 15:06:06' 
                },
                {
                    id: 3,
                    imgurl: require('../../../assets/images/alreadyLock.png'),
                    content: '宇杰，您上月业绩200万，本月截止9月16号业绩150万，继续努力哦！',
                    dateTime: '2018.08.08 15:06:06' 
                },
            ],
        }
    },
}
</script>

<style scoped>
.time_box{
    text-align: center;
}
.time{
    width:120px;
    height:24px;
    background:rgba(0,0,0,0.12);
    border-radius:2px;
    color: #fff;
    padding: 2px 5px;
    font-size: 12px;
}
.info_box{
    margin: 15px 0;
}
.info_box img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-block;
}
.info_content{
    background: #fff;
    position: relative;
    margin-left: 10px;
    padding: 10px;
    font-size: 14px;
    color:rgba(102,102,102,1);
    display: inline-block;
    max-width: 260px;
    box-shadow:0px 0px 12px 0px rgba(0,0,0,0.1);
    border-radius: 4px;
    border: 1px solid #ebeef5;
    word-break: break-all;
}
.info_arrow{
    position: absolute;
    left: -10px;
    top: 35%;
    display: block;
    width: 0;
    height: 0;
    border-color: transparent;
    border-style: solid;
    
    border-width: 10px;
    filter: drop-shadow(0 2px 10px rgba(0,0,0,.03));
    
    border-left-width: 0;
    border-right-color: #ebeef5;

}
.info_arrow::after{
    border-left-width: 0;
    border-right-color: #fff;
}
</style>
