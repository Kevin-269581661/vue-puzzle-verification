var balance = '1,000'
try {
  if(JSON.parse(sessionStorage.getItem('session_data')).asrID == 3) {
    balance = '2,299.8'
  }
} catch (error) {
  console.error('获取余额', error)
}
export default balance