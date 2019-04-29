//作用：
// 所有偏好json
// import allHoppy from '../commonFun/json/allHoppy.json';
import allHoppy from '../commonFun/json/allHoppy_new.json';
var hoppy = {};
// 由偏好idArr（父子级）转换中文返回
hoppy.getText = function (idArr){
    let result = {
        first: '',
        second: ''
    };
    for(let data of allHoppy){
        if(data.value == idArr[0]){
            result.first = data.label;
            for(let item of data.children){
                if(item.value == idArr[1]){
                    result.second = item.label;
                    break;
                }
            }
            break;
        }
    }
    return result;
}

// 由二级偏好id转换中文和此id返回
hoppy.getName = function (id){
    let result = {
        id: id,
        name: ''
    };
    for(let data of allHoppy){
        for(let item of data.children){
            if(item.value == id){
                result.name = item.label;
                break;
            }
        }
    }
    return result;
}

hoppy.getSimpleName = function (id){
    let result = {
        id: '',
        name: ''
    };
    if(
        id == 1 ||
        id == 2 ||
        id == 3 ||
        id == 4 ||
        id == 5 ||
        id == 6 ||
        id == 7 ||
        id == 8 ||
        id == 9 ||
        id == 10 ||
        id == 11 ||
        id == 12 ||
        id == 13 ||
        id == 14 ||
        id == 15 ||
        id == 16 ||
        id == 17 ||
        id == 18 ||
        id == 20 ||
        id == 21 ||
        id == 22 ||
        id == 23 ||
        id == 24 ||
        id == 25 
    ){
        result = {
            id: 101,
            name: 'APP安装'
        };
    }else{
        for(let data of allHoppy){
            for(let item of data.children){
                if(item.value == id){
                    result.id = item.value;
                    result.name = item.label;
                    break;
                }
            }
        }
    }
    return result;
}
export default hoppy;