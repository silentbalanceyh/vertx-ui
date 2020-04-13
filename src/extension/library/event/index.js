import upstream from './upstream';
import fabric from './fabric';

/**
 * 内部模块
 *
 * rx系列方法
 *
 * @module _rx
 */
/**
 * 内部模块
 *
 * 事件调度方法
 *
 * @module _event
 */
export default {
    ...upstream,
    ...fabric,
}