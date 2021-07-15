/*
 * @Author: penglei
 * @Date: 2021-07-13 13:07:15
 * @LastEditors: penglei
 * @LastEditTime: 2021-07-13 13:10:24
 * @FilePath: /frontend/src/components/develop/components/mixins/minix.js
 */
const mixin = {
    data() {
        return {
            // 合同类型：0-首签  1-续约 2-加门 3-补充
            contractTypeArr: {
                0: "首签合同",
                1: "续签合同",
                2: "加门合同",
                3: "补充协议",
            },
        }
    },
    methods: {
        
    }
}

export default mixin
