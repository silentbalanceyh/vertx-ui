import State from "./Ux.State";

/**
 * 读取当前表格中的记录信息，填充表格相关信息专用
 * @param reference
 */
const itemTable = (reference) => {
    const {$items, $inited, $addKey} = reference.props;
    let data = [];
    if ($inited) {
        /**
         * 读取主记录的key信息：
         * 1. 添加模式读取主记录key：$addKey;
         * 2. 更新模式读取主记录key：$inited.key;
         */
        const hittedKey = $inited.key || $addKey;
        const dataArray = $items.$(hittedKey);
        if (dataArray && dataArray.is()) {
            data = dataArray.to();
        }
    } else {
        // 添加模式
        const dataObject = $items.to();
        if (dataObject) {
            data = dataObject[$addKey];
            if (!data) data = [];
        }
    }
    return data;
};
const itemInit = (reference) => {
    const {$items, $inited, $addKey} = reference.props;
    const {editKey} = reference.state;
    /**
     * $addKey不会消失，这里主要考虑两点
     * 1. editKey有值（子表单编辑）
     * 2. $inited有值的情况（编辑模式）
     */
    if (editKey && $inited) {
        const dataArray = $items.$($inited.key);
        return dataArray && dataArray.is() ? dataArray.getElement(editKey) : {};
    } else {
        const dataArray = $items.$($addKey);
        return dataArray && dataArray.is() ? dataArray.getElement(editKey) : {};
    }
};
const itemDelete = (reference, id, state = {}) => {
    const {$inited = {}, $items, $addKey} = reference.props;
    const hittedKey = $addKey || $inited.key;
    const dataRecord = State.rapitRecord($items, hittedKey, {key: id}, true);
    state['list.items'] = dataRecord;
    State.writeTree(reference, state);
};
/**
 * 读取Items专用方法，
 * $items - 从list.items上读取的相关数据
 * $parent - 包含了父记录数据，如果包含了则是（合并提交）
 * @param reference
 */
const itemRead = (reference) => {
    // list.items树上的数据，主记录id只能从$parent中读取
    const {$items, $inited = {}, $addKey} = reference.props;
    let result = [];
    if ($items) {
        let hittedKey;
        if ($inited.key) {
            hittedKey = $inited.key;
        } else {
            if ($addKey) {
                hittedKey = $addKey;
            }
        }
        // 读取记录中的items数据信息
        if (hittedKey) {
            const dataRecord = $items.$(hittedKey);
            if (dataRecord && dataRecord.is()) {
                result = dataRecord.to();
            }
            return result;
        }
    }
};
const itemKey = (reference) => {
    const {$inited, $addKey} = reference.props;
    if ($inited) {
        // 如果包含$inited，则EDIT-EDIT，EDIT-ADD
        return $inited.key;
    } else {
        // 如果不包含$inited，则ADD-EDIT, ADD-ADD
        return $addKey;
    }
};
export default {
    // 初始化当前页的表格数据
    itemTable,
    // 初始化Dialog中对应的数据
    itemInit,
    // 点击关闭onClose，删除数据
    itemDelete,
    // 读取当前记录中的数组
    itemRead,
    // 读取KEY
    itemKey,
}