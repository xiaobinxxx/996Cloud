/**
 * 格式化文件大小
 * @param value
 * @returns {string}
 */
let renderSize = (value) => {
  if (null == value || value == '') {
    return "0 By";
  }
  var unitArr = new Array("By", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
  var index = 0,
    srcsize = parseFloat(value);
  index = Math.floor(Math.log(srcsize) / Math.log(1024));
  var size = srcsize / Math.pow(1024, index);
  //  保留的小数位数
  size = size.toFixed(1);
  return size + unitArr[index];
};
/**
 * 日期时间格式化
 * @param dateTimeStamp
 * @returns {*|string}
 */
let getDateDiff = (dateTimeStamp) => {
  let minute = 1000 * 60;
  let hour = minute * 60;
  let day = hour * 24;
  let halfamonth = day * 15;
  let month = day * 30;
  let now = new Date().getTime();
  let diffValue = now - dateTimeStamp;
  if (diffValue < 0) {
    return;
  }
  let monthC = diffValue / month;
  let weekC = diffValue / (7 * day);
  let dayC = diffValue / day;
  let hourC = diffValue / hour;
  let minC = diffValue / minute;
  let result = '';

  if (monthC >= 1) {
    result = "" + parseInt(monthC) + "月前";
  } else if (monthC >= 12) {
    result = dateTimeStamp.toLocaleString();
  } else if (weekC >= 1) {
    result = "" + parseInt(weekC) + "周前";
  } else if (dayC >= 1) {
    result = "" + parseInt(dayC) + "天前";
  } else if (hourC >= 1) {
    result = "" + parseInt(hourC) + "小时前";
  } else if (minC >= 1) {
    result = "" + parseInt(minC) + "分钟前";
  } else
    result = "刚刚";
  return result;
};

/**
 * 随机生成字符串
 * @constructor
 */
let RandomStr = () => {
  let timestamp = new Date().getTime();
  // 随机字符
  let chars = ['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
  // 生成随机字符
  let res = "";
  for(let i = 0; i < 4 ; i ++) {
    let id = Math.ceil(Math.random()*35);
    res += chars[id];
  }
  return res + timestamp;
};
module.exports = {
  renderSize,
  getDateDiff,
  RandomStr,
};


