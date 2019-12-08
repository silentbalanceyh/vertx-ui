import sexCab from './O.fn.cab';
import Abs from '../abyss';
import Eg from '../engine';
/*
 * table:
 * {
 *
 * }
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