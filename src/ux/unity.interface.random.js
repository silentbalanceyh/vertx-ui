// 导入第三方库
// 导入外层
import __Zn from 'zone';

export default {
    /**
     * ## 「标准」`Ux.randomUUID`
     *
     * 随机生成UUID，内部调用 uuid 库函数。
     *
     * @memberOf module:random/zone
     * @method randomUUID
     */
    randomUUID: () => __Zn.randomUUID(),
    /**
     * ## 「标准」`Ux.randomString`
     *
     * 随机生成字符串，内部调用 random-js。
     *
     * @memberOf module:random/zone
     * @method randomString
     * @param {Number} length 输入需要生成随机字符串的长度。
     */
    randomString: (length) => __Zn.randomString(length),
    /**
     * ## 「标准」`Ux.randomArray`
     *
     * @memberOf module:random/zone
     * @method randomArray
     */
    randomArray: (array = []) => __Zn.randomArray(array),
    /**
     * ## 「标准」`Ux.randomInteger`
     *
     * 随机生成数值。
     *
     * @memberOf module:random/zone
     * @method randomInteger
     * @param {Number} min 生成数值区域的最小值。
     * @param {Number} max 生成数值区域的最大值。
     */
    randomInteger: (min = 0, max = 100) => __Zn.randomInteger(min, max)
};
