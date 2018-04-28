import randomjs from 'random-js';
import {v4} from 'uuid';
import Dg from './Ux.Debug';

/**
 * 生成固定长度的随机字符串
 * @method randomString
 * @param {Number} length 生成字符串的长度
 * @return {String}
 */
const randomString = (length) => {
    Dg.ensureNotNull(length);
    const engine = randomjs.engines.mt19937().autoSeed();
    return randomjs.string()(engine, length);
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
    randomString
}
