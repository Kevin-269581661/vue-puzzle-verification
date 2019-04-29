// 百度数据消费偏好数据转换为中文
import Hoppy from '../commonFun/json/hoppyNumToText.json';
var hoppyNumToText = {};
// 单纯返回消费偏好中文字符串
hoppyNumToText.toText = function (id){
    let result = '';
    for(let data of Hoppy){
        for(let item of data.children){
            if(item.value == id){
                result = item.label;
                break;
            }
        }
    }
    return result;
}

// 返回关于这项的id,text
hoppyNumToText.toObj = function (id, parentId){
    let result = {
        id: '',
        text: '',
        parentId: ''
    };
    for(let data of Hoppy){
        if(data.value == parentId){
            for(let item of data.children){
                if(item.value == id){
                    result.text = item.label;
                    result.id = item.value;
                    result.parentId = data.value;
                    break;
                }
            }
        }
    }
    return result;
}

export default hoppyNumToText;