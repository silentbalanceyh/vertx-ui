import Ux from 'ux';
import ylCard from './yl.card';

/**
 *
 * ## 渲染函数
 *
 *
 * 用于渲染通用模块：
 *
 * 1. `/ambient/tabular/:type`    字典
 * 2. `/ambient/category/:type`   类别（树形字典）
 * 3. `/ambient/employee/:type`   员工
 * 4. `/ambient/identity/:type`   档案（个人隐私）
 * 5. `/ambient/customer/:type`   客户信息
 *
 * 专用统一模块渲染流程
 *
 * @memberOf module:_channel
 * @method ylDynamic
 * @param {ReactComponent} reference React对应组件引用
 * @param {Function} fnRender 渲染函数
 * @param {Object} config 输入的配置数据
 * @returns {Jsx}
 */
export default (reference, fnRender, config = {}) => {
    /*
     * 处理 $title 变化专用
     */
    let page = Ux.fromHoc(reference, "page");
    if (!page) page = {};
    /*
     * 输入专用 $config
     */
    const $config = {};
    Object.assign($config, config);
    $config.title = page.title;     // 处理标题
    return ylCard(reference, fnRender, $config);
}