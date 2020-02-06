/**
 * 对字符串进行加密
 * @param code
 * @returns {string}
 */
function compileStr(code){
  var c=String.fromCharCode(code.charCodeAt(0)+code.length);
  for(var i=1;i<code.length;i++){
    c+=String.fromCharCode(code.charCodeAt(i)+code.charCodeAt(i-1));
  }
  return escape(c);
}

/**
 * 对字符串进行解密
  * @param code
 * @returns {string}
 */
function uncompileStr(code){
  code = unescape(code);
  var c=String.fromCharCode(code.charCodeAt(0)-code.length);
  for(var i=1;i<code.length;i++){
    c+=String.fromCharCode(code.charCodeAt(i)-c.charCodeAt(i-1));
  }
  return c;
}

module.exports = {
  compileStr,
  uncompileStr,
};
