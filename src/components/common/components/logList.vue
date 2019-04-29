<template>
    <div>
        <ul class="timeline">
            <li v-for="item of list" :key="item.id" class="timeline_item">
                <div class="line_tail"></div>
                <div class="line_head"></div>
                <div class="line_content">
                    <p class="time">{{item.time}}</p>
                    <span :class="[getcolor(), 'content']" v-if="item.text">{{item.text}}</span>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props:{
        list: {
            type: Array,
            default: []
        }
    },
    data(){
        return {

        }
    },
    methods:{
        getcolor(){
            let num = Math.floor(Math.random()*3+1);
            if(num == 1){
                return 'blue';
            }else if(num == 2){
                return 'yellow';
            }else{
                return 'green';
            }
        },
    },
}
</script>

<style scoped>
    /* 处理弹出框日志组件 */
    .timeline{
        list-style: none;
        margin: 0;
        padding: 0;
    }
    .timeline_item{
        margin: 0!important;
        padding: 0 0 12px;
        list-style: none;
        position: relative
    }
    .line_tail{
        height: 100%;
        border-left: 1px solid #e8eaec;
        position: absolute;
        left: 6px;
        top: 0;
    }
    .line_head{
        width: 13px;
        height: 13px;
        background-color: #fff;
        border-radius: 50%;
        border: 1px solid transparent;
        position: absolute;
        border-color: #2d8cf0;
        color: #2d8cf0;
    }
    .line_content{
        padding: 1px 1px 10px 24px;
        font-size: 12px;
        position: relative;
        top: -3px;
    }
    .time{
        font-size: 14px;
        color: #999999;
        margin: 0;
    }
    .content{
        padding: 2px 6px;
        font-size: 14px;
        width: auto;
        color: #fff;
        border-radius: 0px 30px 30px 40px;
        display: inline-block;
        max-height: 130px;
        height: auto;
    }
    .timeline_item:last-child .line_tail{
        display: none;
    }
    .blue{
        background: #38B9FA;
    }
    .yellow{
        background: #FFA943;
    }
    .green{
        background: #61EC8E;
    }
</style>
