import U from 'underscore';
import Immutable from 'immutable';
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
const rxAddDialog = (reference, item) => (event) => {
    event.preventDefault();
    // 只设置iKey和iItemText，不设置iItemData
    reference.setState({
        iAdd: true,
        ..._rxState(item.key, undefined, item.display)
    });
};
const rxEditDialog = (reference, item) => (event) => {
    event.preventDefault();
    // 只设置iKey和iItemText，不设置iItemData
    reference.setState({
        iAdd: false,
        ..._rxState(item.key, undefined, item.display)
    });
};
const rxCloseDialog = (reference, item) => (event) => {
    event.preventDefault();
    rxClose(reference, item);
};
const rxClose = (reference, item) => {
    reference.setState({
        iAdd: true,
        ..._rxState(undefined, undefined, item.display)
    });
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
    const state = {
        // 设置选中项
        iAdd: true,
        // 选中项的更改，拷贝新内容变更
        selected: Ux.clone([newItem.key]),
        // 新添加的也成为展开项
        expandedKeys,
        ..._rxState(newItem.key, newItem)
    };
    reference.setState(state)
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

const _rxFilters = (reference, key, options = {}, item = {}) => {
    const {$query} = reference.props;
    // 提取query
    const filters = $query && $query.is() ?
        $query.to() : {};
    const criteria = filters.criteria ? filters.criteria : {};
    // 写入到根节点
    criteria[""] = true;
    // 提取当前节点的key，单选模式
    const selectedKey = key[0];
    if (options['tree.filter.full']) {
        // 全查询模式，计算全树相关信息
        // 全查询模式开启的情况下，检查tree.filter.mode
        let impactKeys = [];
        if ("CHILD" === options["tree.filter.mode"]) {
            // 只包含子节点的选择，不包含当前节点
            let $impactKeys = Immutable.fromJS(Op.visitChildren(item));
            if ($impactKeys.contains(selectedKey)) {
                impactKeys = $impactKeys.toJS().filter(key => key !== selectedKey);
            } else {
                impactKeys = $impactKeys.toJS();
            }
        } else {
            impactKeys = Op.visitChildren(item);
        }
        if (U.isArray(impactKeys)) {
            criteria[`${options["tree.filter"]},i`] = impactKeys;
        }
    } else {
        if ("_ROOT_" !== selectedKey) {
            criteria[options["tree.filter"]] = selectedKey;
        } else {
            if (criteria.hasOwnProperty(options["tree.filter"])) {
                delete criteria[options['tree.filter']];
            }
        }
    }
    // 重置pager回到第一页
    if (filters.pager) {
        filters.pager.page = 1;
    }
    return filters;
};
const rxSelect = (reference, edit = false) => (key, treeNode = {}) => {
    // 特殊处理，只有Key的长度大于0即有内容被选中时才触发，防止清空
    if (edit && 0 < key.length) {
        // 设置selected的数据
        reference.setState({
            selected: key
        });
        // 写状态树专用
        const options = Init.readOptions(reference);
        if (options["tree.filter"]) {
            // 选中节点
            const node = treeNode.node ? treeNode.node : {};
            const dataItem = node.props ? node.props["data-items"] : {};
            // 提取更新过后的Filters
            const filters = _rxFilters(reference, key, options, dataItem);
            // 这里的selected有可能是数组
            Ux.writeTree(reference, {
                "grid.query": filters,
                "grid.list": undefined,
                // 选择的树的Key信息，用于设置parentId专用
                "tree.selected": {
                    data: dataItem,
                    key,
                }
            })
        }
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
    // 窗口模式下专用
    rxCloseDialog,
    rxAddDialog,
    rxEditDialog,
    rxClose,
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