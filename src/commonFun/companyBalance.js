function getBalance() {
  let balance = '1,000'
  try {
    switch (JSON.parse(sessionStorage.getItem('session_data')).asrID) {
      case '3':
        balance = '3,599.6';
        break;
      case '12':
        balance = '0.00';
        break;
      default:
        balance = '1,000';
    }
  } catch (error) {
    console.error('获取余额', error)
  }
  return balance
}
export default getBalance