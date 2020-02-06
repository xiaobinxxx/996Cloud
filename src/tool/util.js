export default {
  /**
   * 文件大小统计
   * @param {string} value
   * @returns {string}
   */
  renderSize(value) {
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
  },
  /**
   * 使用spilt方法实现模糊查询  (查找name)
   * @param  {Array}  list     进行查询的数组
   * @param  {String} keyWord  查询的关键词
   * @return {Array}           查询的结果
   */
  fuzzyQuery(list, keyWord) {
    let arr = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].name.split(keyWord).length > 1) {
        arr.push(list[i]);
      }
    }
    return arr;
  },
}
