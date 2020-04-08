import yoDynamic from './yo.dynamic';
import Fn from '../../functions';
import Ux from 'ux';

/**
 * ## 扩展函数
 *
 * 查询表单专用，构造查询信息，内置先调用`yoDynamic`处理。
 *
 * 1. 初始化表单值`$inited`，赋予`connector`的连接符。
 * 2. rxClose 的专用处理。
 *
 * @memberOf module:_channel
 * @method yoFilter
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Object} 计算最终生成的继承属性专用方法
 */
export default (reference) => {
    const attrs = yoDynamic(reference);
    /*
     * 初始化数据
     */
    const {$inited = {}} = reference.props;
    if (Ux.isEmpty($inited)) {
        attrs.$inited = {
            connector: "AND"
        };
    } else {
        const data = Ux.clone($inited);
        const connector = data[""] ? "AND" : "OR";
        delete data[""];
        data.connector = connector;
        attrs.$inited = data;
    }
    /*
     * 关闭专用函数
     */
    attrs.rxClose = Fn.rsVisible(reference, false);
    return attrs;
}