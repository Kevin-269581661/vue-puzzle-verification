var utils = {
  //设置cookie
  setCookie(c_name, value, expire) {
    var date = new Date();
    date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * expire);
    document.cookie = c_name + "=" + escape(value) + "; expires=" + date.toGMTString();
  },
  //读取cookie
  getCookie(c_name) {
    if (document.cookie.length > 0) {
      let c_start = document.cookie.indexOf(c_name + "=");

      if (c_start != -1) {
        c_start = c_start + c_name.length + 1;
        let c_end = document.cookie.indexOf(";", c_start);
        if (c_end == -1) c_end = document.cookie.length;
        return unescape(document.cookie.substring(c_start, c_end))
      }
    }
    return "";
  },
  //清除cookie
  clearCookie: function (name) {
    this.setCookie(name, "", -1);//修改2值都为空，天数为负1
  },

};
export default utils
