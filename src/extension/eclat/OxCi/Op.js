import Ux from "ux";
import {Modal} from "antd";
/*
 * 生成初始数据结构
 */
const _ciItem = (data = {}) => {
    const item = {};
    // if (data.globalId) {
    //     /* 优先考债 id，ucmdb id 读取，在关系计算中必须 */
    //     item.key = data.globalId; // 使用 id 替换掉 key
    // } else {
    //     item.key = data.key; // 搜索中的 key
    // }
    item.key = data.key; // 搜索中的 key
    item.name = data.name;
    item.identifier = data.identifier;
    return item;
};
const ciStart = (reference) => {
    const {data = {}} = reference.props;
    const item = _ciItem(data);
    item.index = 0; // 第一个
    return item;
};
const ciOpen = (reference, data = {}) => {
    let {$stack = []} = reference.state;
    $stack = Ux.clone($stack);
    const item = _ciItem(data);
    $stack.push(item);
    $stack.forEach((item, index) => item.index = index);
    const $index = $stack.length - 1;
    return {
        $index,
        $stack,
    }
};
const ciMove = (reference, item = {}) => {
    let original = reference.state.$stack;
    const $stack = [];
    original.forEach((each, index) => {
        if (index <= item.index) {
            $stack.push(each);
        }
    });
    const $index = $stack.length - 1;
    return {
        $stack,
        $index,
    }
};
const ciExisting = (reference, data) => {
    let {$stack = []} = reference.state;
    const item = _ciItem(data);
    const counter = $stack.filter(each => each.key === item.key).length;
    return 0 < counter;
};
const ciMoveData = (reference, data) => {
    const item = _ciItem(data);
    let original = reference.state.$stack;
    original.forEach((each, index) => {
        if (each.key === item.key) {
            item.index = index;
        }
    });
    return ciMove(reference, item);
};
const onProbe = (reference, data = {}) => {
    const existing = ciExisting(reference, data);
    if (existing) {
        const modal = Ux.fromHoc(reference, "modal");
        modal.content = Ux.formatExpr(modal.content, data, true);
        Modal.confirm({
            ...modal,
            onOk: () => {
                const state = ciMoveData(reference, data);
                reference.setState(state);
            }
        })
    } else {
        const state = ciOpen(reference, data);
        reference.setState(state);
    }
};
export default {
    /*
     * onProbe 中的 data 的特别的数据结构：
     * {
     *      "globalId": "必须数据，UCMDB ID"，
     *      "name": "当前数据中的 name 节点",
     *      "identifier": "标识符相关信息"
     * }
     */
    onProbe,
    onVisit: (reference) => (model = {}) => {
        const {$identifier} = reference.props;
        if ($identifier) {
            const data = Ux.clone(model);
            data.identifier = $identifier;
            onProbe(reference, data);
        }
    },
    onSelected: (reference, item = {}) => (event) => {
        Ux.prevent(event);
        const state = ciMove(reference, item);
        reference.setState(state);
    },
    onStart: ciStart,
}