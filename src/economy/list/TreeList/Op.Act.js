import U from 'underscore';
import Ux from 'ux';
import Op from './Op.Visit'

const _rxState = (iKey, iItemData, iItemText) => {
    return ({
        iKey, iItemText, iItemData
    })
};
const rxDelete = (reference, item) => (event) => {
    // 是否触发外置操作
    event.preventDefault();
    const {rxItemDelete} = reference.props;
    if (U.isFunction(rxItemDelete)) {
        const keys = Op.visitChildren(item);
        rxItemDelete(Ux.clone(item), keys);
    }
};

const rxPreEdit = (reference, item) => (event) => {
    event.preventDefault();
    // 只设置iKey和iItemText，不设置iItemData
    reference.setState(_rxState(item.key, undefined, item.display));
};

const rxPreAdd = (reference, item) => (event) => {
    event.preventDefault();
    const $item = Ux.clone(item);
    const newItem = {};
    newItem.key = Ux.randomUUID();
    newItem.branch = $item.key;
    // 要设置新的key相关信息
    reference.setState({
        // 设置选中项
        selected: [newItem.key],
        ..._rxState(newItem.key, newItem)
    })
};

const rxCancel = (reference) => event => {
    event.preventDefault();
    // 清空三个核心节点
    reference.setState(_rxState())
};

const rxEdit = (reference, item) => (event) => {
    event.preventDefault();
    reference.setState(_rxState())
    // 确认Item处理
    const {rxItemEdit} = reference.props;
    const {iItemText = ""} = reference.state;
    if (U.isFunction(rxItemEdit)) {
        const keys = Op.visitChildren(item);
        const $item = Ux.clone(item);
        $item.display = iItemText;
        rxItemEdit($item, keys);
    }
};

const rxChange = (reference) => (event) => {
    event.preventDefault();
    let state = reference.state;
    if (!state) state = {};
    reference.setState(_rxState(state.iKey, undefined, event.target.value));
};

export default {
    rxDelete,
    rxPreEdit,
    rxEdit,
    rxPreAdd,
    rxCancel,
    rxChange,
}