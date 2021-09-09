import api from "../api/api"

function getBalance() {
    let sessionData = JSON.parse(sessionStorage.getItem('session_data') || null);
    return new Promise((resolve) => {
        api.getApi('/report/homepage/getAsrBalance', {
            uid: sessionData.uID,
            token: sessionData.token
        }).then(res => {
            if (res.data.SysCode === 200200) {
              resolve(res.data.data.balance*1 || 0);
            } else {
              resolve(0);
            }
        })
    })
}
export default getBalance
