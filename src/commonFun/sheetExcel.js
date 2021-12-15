// 使用案例
// head = ['资源名称',	'市', '区',	'资源地址',	'楼盘价格',	'入住年份',	'住户数量',	'出入口', '楼栋数量', '楼盘（写字楼）类型',	'地图中心点', '可选面数' ,'投放排期'];
// arr = [
//     {
//         sheetName: '北京市',  //sheet Name
//         showList: [             //数据数组
//             {
//                 resName: '资源名称', 
//                 city: '市', 
//                 rName: '区', 
//                 resAddress: '资源地址', 
//                 hPrice: '楼盘价格', 
//                 chDay: '入住年份', 
//                 hNum: '住户数量', 
//                 dNum: '出入口', 
//                 fNum: '楼栋数量', 
//                 cType: '楼盘（写字楼）类型', 
//                 map: '地图中心点', 
//                 adsNum: '可选面数', 
//                 timeRange: '投放排期'
//             }
//         ],
//     }
// ];
// otherHead = ['http://www.qinlinad.com', '', '', '', '', '', '', '', '', '', '', '', ''];
// head为表头， arr为数据数组，otherhead为合并内容

var XLSX = null;
import(/* webpackChunkName: "XLSX" */ "xlsx").then((res) => {
    XLSX = res;
});
let sheetExcel = {};
sheetExcel.toDownload = function(head, arr, title='', otherHead=[]){
    console.log('arr----', arr);
    let allResult = [];
    for(let item of arr){
        let resultArr = [];
        for(let data of item.showList){
            let dataArr = [];
            for(let i in data){
                dataArr.push(data[i]);
              }
            resultArr.push(dataArr);
        }
        allResult.push(resultArr);
    }
    console.log('resultArr----', allResult);
    let wsArr = [];
    let aoa = [];
    if(otherHead.length){
        aoa = [otherHead, head];
    }else{
        aoa = [
            head //第一行标题
        ];
    }
    let filename = '';
    let values = allResult;
    //将数据合并
    for (let i = 0, iLen = values.length; i < iLen; i++) {
        for (let j = 0, jLen = values[i].length; j < jLen; j++) {
            aoa.push(values[i][j]);
            // console.log('aoa----', aoa);
            if(j >= jLen - 1){
                let len = values[i][j].length;
                console.log('values[i][0][jLen-1]', values[i][0][len-1]);

                let ws = XLSX.utils.aoa_to_sheet(aoa);
                if(otherHead.length){
                    let merge = { s: {r:0, c:0}, e: {r:0, c:12} };
                    if( !ws['!merges'] ) ws['!merges'] = [];
                    ws['!merges'].push(merge);
                }

                let obj = {
                    uname: values[i][0][1],
                    data: ws
                };
                filename+=obj.uname+'-';
                wsArr.push(obj);
                if(otherHead.length){
                    aoa = [otherHead, head];
                }else{
                    aoa = [
                        head //第一行标题
                    ];
                }
            }
        }
    }
    console.log('wsArr---', wsArr);
    const wb = XLSX.utils.book_new();
    for(let i = 0; i< wsArr.length; i++){
        wb['SheetNames'][i] = arr[i].sheetName;
        wb['Sheets'][arr[i].sheetName]= wsArr[i].data;
    }
    if(title){
        filename = title;
    }
    console.log('wwbbb--', wb);
    XLSX.writeFile(wb, filename + ".xlsx");
}

//判断如果是系统中6个皓邻公司或全国权限账号（KA销售及全国媒介），excel表头添加设备型号字段
sheetExcel.addEquipmentTypeHead=function(headArr){
    let newHeadArr=headArr.slice(0)
    if(sheetExcel.isAddEquipmentTypeAsXlsx()){
        newHeadArr.push("设备型号")
    }
    return newHeadArr
}
//判断如果是系统中6个皓邻公司或全国权限账号（KA销售及全国媒介），excel内容添加设备型号字段equipmentType
sheetExcel.addEquipmentTypeVal=function(valObj,equipmentTypeVal){
    let newValObj=JSON.parse(JSON.stringify(valObj))
    if(sheetExcel.isAddEquipmentTypeAsXlsx()){
        newValObj.equipmentType=equipmentTypeVal
    }
    return newValObj
}

//判断如果是系统中6个皓邻公司或全国权限账号（KA销售及全国媒介）
sheetExcel.addEquipmentFilterVal=function(filterValArr){
    let newFilterValArr=filterValArr.slice(0)
    if(sheetExcel.isAddEquipmentTypeAsXlsx()){
        newFilterValArr.push('equipmentType')
    }
    return newFilterValArr
}

//导出表格是否需要添加设备型号
sheetExcel.isAddEquipmentTypeAsXlsx=function(){
    //判断是否是6个皓邻公司或全国权限账号（KA销售及全国媒介）
    let session_data=JSON.parse(sessionStorage.getItem("session_data"))
    let customPermission=session_data.customPermission
    let equipmentTypePermission=customPermission.equipmentTypePermission
    if(equipmentTypePermission==1||["ADN_MD_COUNTRY", "ADN_BD_KA"].includes(session_data.uType)){
        return true
    }else{
        return false
    }
}

//页面table是否需要添加设备号
sheetExcel.isAddEquipmentTypeAsTable=function(){
    //判断是否是6个皓邻公司
    let session_data=JSON.parse(sessionStorage.getItem("session_data"))
    let customPermission=session_data.customPermission
    let equipmentTypePermission=customPermission.equipmentTypePermission
    if(equipmentTypePermission==1){
        return true
    }else{
        return false
    }
}

export default sheetExcel;