// 给当前用户添加本地缓存信息
export function addLocalCache(key, value) {
    getUserIndex()
    allUserList[index][key] = value;
    localStorage.setItem("local_data", JSON.stringify(allUserList));
}

// 获取当前用户本地缓存信息
export function getLocalCache(key) {
    getUserIndex()
    const rowSpace = JSON.parse(localStorage.getItem("local_data"))[index][key]
    return rowSpace
}

let allUserList // 本地缓存的用户列表
let curUser // 当前用户信息
let index // 当前用户在用户列表中的下标

// 获取当前用户下标
function getUserIndex() {
    curUser = JSON.parse(sessionStorage.getItem("session_data"));
    allUserList = JSON.parse(localStorage.getItem("local_data"));
    index = allUserList.findIndex((user) => user.uid === curUser.uID);
}
