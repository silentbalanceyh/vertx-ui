// 导入第三方库
import {MersenneTwister19937, Random} from 'random-js';
import {v4} from 'uuid';
// 导入外层
import E from '../error';

const randomString = (length) => {
    E.fxTerminal(!length, 10062, length);
    // 1.0 旧版本：const engine = randomjs.engines.mt19937().autoSeed();
    const engine = MersenneTwister19937.autoSeed();
    const random = new Random(engine);
    return random.string(length); // randomjs.string()(engine, length);
};
const randomInteger = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max + 1)) + min;
};
const randomArray = (array = []) => {
    const index = randomInteger(0, array.length - 1);
    return array[index];
}
export default {
    /**
     * ## 「标准」`Ux.randomUUID`
     *
     * 随机生成UUID，内部调用 uuid 库函数。
     *
     * @memberOf module:_unity
     * @method randomUUID
     */
    randomUUID: v4,
    /**
     * ## 「标准」`Ux.randomString`
     *
     * 随机生成字符串，内部调用 random-js。
     *
     * @memberOf module:_unity
     * @method randomString
     * @param {Number} length 输入需要生成随机字符串的长度。
     */
    randomString,
    /**
     * ## 「标准」`Ux.randomArray`
     *
     * @memberOf module:_unity
     * @method randomArray
     */
    randomArray,
    /**
     * ## 「标准」`Ux.randomInteger`
     *
     * 随机生成数值。
     *
     * @memberOf module:_unity
     * @method randomInteger
     * @param {Number} min 生成数值区域的最小值。
     * @param {Number} max 生成数值区域的最大值。
     */
    randomInteger
};
