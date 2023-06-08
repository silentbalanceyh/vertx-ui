import __Zn from './zero.module.dependency';

const xtTransfer = (reference, callback) => (targetKeys, direction, moveKeys = []) => {
    const {$selectedKeys = []} = reference.state;
    let $selected = [];
    if ("right" === direction) {
        // 往右，直接追加，注意顺序
        $selected = __Zn.clone($selectedKeys);
        moveKeys.forEach(moveKey => $selected.push(moveKey));
    } else {
        // 往左
        $selectedKeys.forEach(each => {
            if (!moveKeys.includes(each)) {
                $selected.push(each);
            }
        })
    }
    if (__Zn.isFunction(callback)) {
        callback($selected);
    }
}

const xtChecked = ($keySet, reference, configuration) => {
    /* 多选最终结果 */
    let config = {};
    if (configuration) {
        config = __Zn.clone(configuration)
    } else {
        config = reference.props.config;
    }
    const selectedKeys = __Zn.toArray($keySet);

    /* 抽取配置信息 */
    const {selection = {}} = config;
    const {replace = true, field = "key"} = selection.multipleMode ? selection.multipleMode : {};

    /* 计算选中项 */
    let $selectedKeys = [];
    if (replace) {

        // 替换模式，直接替换选择的 key 值
        $selectedKeys = selectedKeys;
    } else {

        // 合并模式，合并模式时，要根据 field 配置执行选择
        const {value = []} = reference.props;
        const dataArray = __Zn.clone(value);
        $keySet.forEach(element => __Zn.elementSave(dataArray, element, field));
        $selectedKeys = dataArray;
    }
    return $selectedKeys;
}
export default {
    xtChecked,
    xtTransfer,
}