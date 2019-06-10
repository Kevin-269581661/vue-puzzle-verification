let sess = {};
sess.getSess = function(){
    return JSON.parse(sessionStorage.getItem("session_data"));
}
export default sess;