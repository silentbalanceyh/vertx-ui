import Py from 'js-pinyin';

Py.setOptions({checkPolyphone: false, charCase: 0})
/**
 *
 * ## 标准函数
 *
 * 将汉字转换成拼音
 *
 * @memberOf module:_value
 * @param {String} input 输入的数据
 * @returns {String} 返回转换好的拼音信息
 */
const valuePinyin = (input) => {
    if ("string" === typeof input) {
        return Py.getFullChars(input);
    } else return input;
}
export default {
    valuePinyin,
}