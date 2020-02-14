// 导入第三方库
import {MersenneTwister19937, Random} from 'random-js';
import {v4} from 'uuid';
// 导入外层
import E from '../error';

/**
 * 生成固定长度的随机字符串
 * @method randomString
 * @param {Number} length 生成字符串的长度
 * @return {String}
 */
const randomString = (length) => {
    E.fxTerminal(!length, 10062, length);
    // 1.0 旧版本：const engine = randomjs.engines.mt19937().autoSeed();
    const engine = MersenneTwister19937.autoSeed();
    const random = new Random(engine);
    return random.string(length); // randomjs.string()(engine, length);
};
/**
 * 生成范围随机整数
 * @param min
 * @param max
 */
const randomInteger = (min = 0, max = 100) => {
    return Math.floor(Math.random() * (max + 1)) + min;
};
/**
 * @class Random
 * @description 专用随机类
 */
export default {
    /**
     * 随机生成UUID
     * @method randomUUID
     */
    randomUUID: v4,
    randomString,
    randomInteger
};
