var industryToHoppyArr = {};
// 行业转换偏好功能，返回值为偏好的一串string
import industryToHoppy from '../commonFun/json/industryToHoppy.json';
industryToHoppyArr.toHopArr = function (industryId){
    let result = '';
    for(let data of industryToHoppy){
        if(data.industry == industryId){
            result = data.hoppy;
        }
    }
    return result;
} 

export default industryToHoppyArr;