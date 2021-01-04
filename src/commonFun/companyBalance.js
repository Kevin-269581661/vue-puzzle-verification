var balance = '1,000'
if(JSON.parse(sessionStorage.getItem('session_data')).asrID == 999) {
  balance = '2,299.8'
}
export default balance