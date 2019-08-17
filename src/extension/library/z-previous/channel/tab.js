import Ux from 'ux';
import Fn from '../../functions';
import Unity from './uniform';
/*
 * Container -> Tab
 */
const yoTab = (reference, config = {}) => {
    const {options = {}, op = {}} = reference.state ? reference.state : {};
    const {items = [], activeKey, ...rest} = config;
    const inherit = {};
    inherit.$activeKey = activeKey;
    inherit.$items = items;
    inherit.$options = options;
    inherit.$op = op;
    inherit.config = Ux.clone(rest);
    /*
     * 风格专用处理
     */
    const {clsTab = Ux.ECONOMY.TAB_CONTAINER} = reference.props;
    inherit.className = clsTab;
    Fn.Log.tab({
        $activeKey: activeKey,
        $items: items
    });
    return inherit;
};
const yoButton = (reference, prefix) => {
    const {$op = {}} = reference.props;
    const button = [];
    Object.keys($op).filter(opKey => opKey.startsWith(prefix))
        .map(opKey => $op[opKey])
        .filter(item => !!item)
        .forEach(item => button.push(item));
    return button;
};
/*
 * Tab -> Open
 */
const yoOpen = (reference, config = {}) => {
    const attrs = Unity.yoUniform(reference);
    attrs.config = yoButton(reference, 'op.open');
    return attrs;
};
export default {
    yoTab,
    // 处理Bar栏
    yoOpen
}