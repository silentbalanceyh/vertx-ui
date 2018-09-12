import U from 'underscore';
import Ux from 'ux';
import Op from './Op.Visit'
import Init from "./Op.Init";

const _recoverData = (reference = {}, item = {}) => {
    const $item = Ux.clone(item);
    const treeData = Init.readTreeMapping(reference);
    Ux.itObject(treeData, (treeKey, orignalKey) => {
        if ($item.hasOwnProperty(treeKey)) {
            // 不相等时才做相关转换
            if (treeKey !== orignalKey) {
                $item[orignalKey] = $item[treeKey];
                delete $item[treeKey];
            }
        }
    });
    // 如果包含children则直接删除，因为提交数据中不需要children
    if ($item.hasOwnProperty("children")) {
        delete $item.children;
    }
    return $item;
};

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
        rxItemDelete(_recoverData(reference, item), keys);
    }
};

const rxPreEdit = (reference, item) => (event) => {
    event.preventDefault();
    // 只设置iKey和iItemText，不设置iItemData
    reference.setState({
        // 添加模式：
        iAdd: false,
        ..._rxState(item.key, undefined, item.display)
    });
};

const rxPreAdd = (reference, item) => (event) => {
    event.preventDefault();
    const $item = Ux.clone(item);
    const newItem = {};
    newItem.key = Ux.randomUUID();
    newItem.branch = $item.key;
    // 要设置新的key相关信息（需要解决连续添加问题）
    const {expandedKeys = []} = reference.state;
    expandedKeys.push(newItem.key);
    reference.setState({
        // 设置选中项
        iAdd: true,
        // 选中项的更改，拷贝新内容变更
        selected: Ux.clone([newItem.key]),
        // 新添加的也成为展开项
        expandedKeys,
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
    reference.setState(_rxState());
    // 确认Item处理
    const {rxItemEdit, rxItemAdd} = reference.props;
    const {iItemText = "", iAdd = false} = reference.state;
    // 延迟执行
    const fnData = (item) => {
        const keys = Op.visitChildren(item);
        // 更新数据信息
        let $item = Ux.clone(item);
        $item.display = iItemText;
        $item = _recoverData(reference, $item);
        return {item: $item, keys};
    };
    if (iAdd) {
        if (U.isFunction(rxItemAdd)) {
            const data = fnData(item);
            rxItemAdd(data.item, data.keys);
        }
    } else {
        if (U.isFunction(rxItemEdit)) {
            const data = fnData(item);
            rxItemEdit(data.item, data.keys);
        }
    }

};

const rxChange = (reference) => (event) => {
    event.preventDefault();
    let state = reference.state;
    if (!state) state = {};
    reference.setState(_rxState(state.iKey, state.iItemData, event.target.value));
};
const rxSelect = (reference, edit = false) => (key, node) => {
    // 特殊处理，只有Key的长度大于0即有内容被选中时才触发，防止清空
    if (edit && 0 < key.length) {
        // 设置selected的数据
        reference.setState({
            selected: key
        })
    }
};
const rxExpand = (reference) => (keys) => {
    const expandedKeys = Ux.clone(keys);
    reference.setState({expandedKeys});
};
const rxSearch = (reference) => (value) => {
    // 这里需要和term区分开，change已经改变过值了，这里term会触发真正的过滤
    reference.setState({keyword: value});
};
const rxClear = (reference) => () => {
    reference.setState({term: "", keyword: undefined})
};
const rxCriteria = (reference) => (event) => {
    reference.setState({term: event.target.value});
};
export default {
    // 最开始的三个按钮
    rxDelete,
    rxPreEdit,
    rxPreAdd,
    // 添加、编辑、变更
    rxEdit,
    rxCancel,
    rxChange,
    // 树的展开和选中
    rxSelect,
    rxExpand,
    // 搜索树专用方法
    rxSearch,
    rxClear,
    rxCriteria
}