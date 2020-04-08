import Q from '../query';

/**
 * ## 引擎函数
 *
 * 返回绑定资源文件中的`_grid`专用列表配置信息，然后生成 query 执行的最终结果。
 *
 * @memberOf module:_config
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @return {any}
 */
const cabQuery = (reference, key = "grid") => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const config = $hoc._(key);
        if (config && config.query) {
            /*
             * 构造 $query
             */
            return Q.qrCombine(config.query, reference);
        }
    }
};
export default {
    cabQuery,
}