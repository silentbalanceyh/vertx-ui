import Ux from 'ux';

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
        if (Ux.isFunction(rxSelect)) {
            rxSelect(data);
        }
    } else {
        console.error("[ ExR ] 绑定数据丢失：", selected)
    }
};
export default {
    yoMenu,
    rxSelect
}