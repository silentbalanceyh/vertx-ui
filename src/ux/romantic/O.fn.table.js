import sexCab from './O.fn.cab';
import Abs from '../abyss';
import Eg from '../engine';

/**
 * ## 特殊函数「Zero」
 *
 * 内部调用 `sexCab` 读取表格配置，一般 `key` 取 `table`，该配置可直接被
 * Ant Design中的`<Table/>`组件直接消费。
 *
 * @memberOf module:_romantic
 * @method sexTable
 * @param {ReactComponent} reference React组件。
 * @param {String} key 配置键值。
 * @return {any} 返回表格专用数据。
 */
export default (reference, key) => {
    const config = sexCab(reference, key);
    /*
     * 表格专用处理
     */
    const $config = Abs.clone(config);
    $config.columns = Eg.configColumn(reference, config.columns);
    $config.className = "web-table";
    $config.pagination = {size: "small"};
    return $config;
}