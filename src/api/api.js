import axios from 'axios';

export const api = {
    postApi(u, postParams) {
        return axios({
            method: 'post',
            url: u,
            data: postParams,
            transformRequest: [function (data) {
                // Do whatever you want to transform the data
                let ret = '';
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                return ret
            }],
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(res => res).catch(err => {
            console.log('error', err);
        });
    },
    getApi(u, getParams) {
        return axios({
            method: 'get',
            url: u,
            params: getParams
        }).then(res => res);
    },
    postApi_new(u, postParams) {
        // 'Content-Type'默认： application/x-www-form-urlencoded
        return axios({
            method: 'post',
            url: u,
            data: postParams,
        }).then(res => res).catch(err => {
            console.log('error', err);
        });
    },
    postApi_json(u, postParams) {
        return axios({
            method: 'post',
            url: u,
            data: postParams,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res).catch(err => {
            console.log('error', err);
        });
    },
    getApi_file(u, getParams) {
        return axios({
            method: 'get',
            url: u,
            params: getParams,
            responseType: 'blob'
        }).then(res => res).catch(err => {
            console.log('error', err);
        });
    },
    postUpload_file(u, postParams){
        return axios({
            method: 'post',
            url: u,
            data: postParams,
            headers:{
                'Content-Type': 'multipart/form-data'
            },
    }).then(res => res).catch(err =>{
            console.log('upload--error', err);
        });
    },
    // post请求获取数据流文件
    postExportFile(url, postParams,resType) {
        return axios({
            method: 'post',
            url: url,
            data: postParams,
            headers:{
                'Content-Type': 'multipart/form-data'
            },
            responseType: resType ? resType : 'json',
        }).then(res => res).catch(err =>{
            console.log('Export--error', err);
        });
    }
}
export default api
