<template>
    <div class="question-list">
        <h5>{{mainInfo.listTitle}}</h5>
        <ul>
            <li class="question-li" v-for="(item,index) in mainInfo.question" :key="index" @click="chooseQuestion(item)">{{item.title}}</li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "questionList",
        props:{
            mainInfo: {
                type: Object,
                default: {}
            }
        },
        methods:{
            chooseQuestion(item){
                this.$emit("callbackAnswer", item)
            }
        },
        mounted(){

        }
    }
</script>

<style scoped>
    .question-list{
        padding: 32px;
    }
    .question-list h5{
        color:rgba(0,0,0,0.85);
        font-size: 20px;
        margin-bottom: 24px;
        font-weight: 600;
    }
    .question-li{
        height:42px;
        background:rgba(247,247,246,1);
        border-radius:3px;
        padding: 10px 12px;
        box-sizing: border-box;
        color:rgba(51,51,51,1);
        font-size: 16px;
        margin-bottom: 16px;
        cursor: pointer;
        font-weight: bold;
    }
    .question-li:hover{
        color: #369EFE;
    }
</style>
