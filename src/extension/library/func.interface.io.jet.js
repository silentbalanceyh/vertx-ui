// =====================================================
// io 专用，in / out前缀
// =====================================================
import __Zu from 'zet';
import __Zp from 'zep';

/**
 * ## 「输入」`Ex.inApi`
 *
 * 接口处理输入
 *
 * @memberOf module:in/utter
 * @param {Object} uri 接口配置
 * @returns {Object} 处理过的接口数据
 */
const inApi = (uri = {}) =>
    __Zu.inApi(uri);
/**
 *
 * ## 「输出」`Ex.outApi`
 *
 * 接口处理输出
 *
 * @memberOf module:yo/upper
 * @param {Object} params 提交之前原始接口数据
 * @returns {Object} 接口输出数据
 */
const outApi = (params = {}) =>
    __Zp.outApi(params);

/**
 * ## 「输入」`Ex.inJob`
 *
 * 任务处理输入
 *
 * @memberOf module:in/utter
 * @param {Object} mission 任务配置
 * @returns {Object} 处理过的任务数据
 */
const inJob = (mission = {}) =>
    __Zu.inJob(mission);
/**
 *
 * ## 「输出」`Ex.outJob`
 *
 * 任务处理输出
 *
 * @memberOf module:yo/upper
 * @param {Object} params 提交之前原始任务数据
 * @returns {Object} 任务输出数据
 */
const outJob = (params = {}) =>
    __Zp.outJob(params);
export default {
    // in / out
    inApi,
    inJob,
    outApi,
    outJob,
}