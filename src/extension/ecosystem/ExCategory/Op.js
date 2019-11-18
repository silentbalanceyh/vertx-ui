import Ex from 'ex';
import U from 'underscore';
import Ux from 'ux';

const yiSider = (reference) => {
    /*
     * 读取根路径上的 tabular
     */
    Ex.I.tabular({type: Ex.V.TYPE_CATEGORY})
        .then(response => {
            /*
             * 设置当前组件的基本状态
             */
            const state = {};
            if (U.isArray(response)) {
                state.$data = response
                /* 基础排序 */
                    .sort((left, right) => left.sort - right.sort);
            }
            state.$ready = true;
            reference.setState(state);
        })
};
const yoMenu = (reference) => {
    const {$data = []} = reference.state;
    const menu = [];
    $data.forEach(item => {
        const each = {};
        each.key = item.key;
        each.text = item.name;
        each.data = Ux.clone(item);
        menu.push(each);
    });
    return menu;
};
const rxSelect = (reference) => (selected = {}) => {
    const {item: {props: {data}}} = selected;
    if (data) {
        const {rxSelect} = reference.props;
        if (U.isFunction(rxSelect)) {
            rxSelect(data);
        }
    } else {
        console.error("[ ExR ] 绑定数据丢失：", selected)
    }
};
export default {
    yiSider,
    yoMenu,
    rxSelect
}