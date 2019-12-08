import Ux from "ux";
import U from 'underscore';

const yoUnSelected = (reference) => {
    const {$data = [], $selected = []} =
        reference.state ? reference.state : {};
    const $keys = Ux.immutable($selected.map(each => each.key));
    const {rxFilter} = reference.props;
    let result = $data.filter(each => !$keys.contains(each.key));
    if (U.isFunction(rxFilter)) {
        result = result.filter(rxFilter);
    }
    return result;
};
const yoQuery = (reference, configuration = {}) => Ux.qrCommon(reference, {
    /*
     * 查询参数 $query
     * 1）默认 100 条（第一页，每一页100条）
     * 2）参数来源：$condition
     * - config.ajax.magic - 配置中的参数
     * - 搜索框的配置（带清空）
     * - 选择左边树（带清空）
     */
    query: {pager: {page: 1, size: 100}},
    ...configuration,
});
export default {
    yoQuery,
    yoUnSelected,
}