import Env from "../Ux.Env";
import U from "underscore";
import Dg from "../Ux.Debug";
import Immutable from "immutable";
import State from "../prop/Ux.State";

/**
 * 链接Form初始化区分编辑和添加模式专用
 * @param reference
 * @param fnAdd,
 * @param fnUpdate
 */
const pipeIsUpdate = (reference) => {
    const {$key, $mode} = reference.props;
    // 1.没有传入$key的时候是添加
    let isUpdate;
    if ($key) {
        // 2.传入$key过后，需要检查Mode
        if ($mode) {
            // 有$key，$mode为UPDATE时为更新
            isUpdate = $mode === Env.Mode.UPDATE;
        } else {
            // 有$key没有$mode，更新
            isUpdate = true;
        }
    } else {
        // 没有传入Key则是false
        isUpdate = false;
    }
    return isUpdate;
};
const pipeInit = (reference, fnAdd, fnUpdate) => {
    const {$inited} = reference.props;
    // 如果包含了$key则是更新模式
    let data = {};
    // 计算添加还是更新
    if (pipeIsUpdate(reference)) {
        // 更新模式
        if (U.isFunction(fnUpdate)) {
            data = fnUpdate($inited, reference);
        } else {
            // 直接读取$inited
            data = $inited;
        }
        Dg.dgForm(reference, data, true);
    } else {
        // 添加模式
        if (U.isFunction(fnAdd)) {
            data = fnAdd($inited, reference);
        }
        Dg.dgForm(reference, data);
    }
    return data;
};
/**
 * 重置当前表单专用方法
 * @param reference
 * @param dataArray 输入的参数，默认是空值
 */
const pipeReset = (reference, dataArray = []) => {
    const {$items, $inited = {}} = reference.props;
    if ($items && $items.is()) {
        // 读取原来数据
        const data = Immutable.fromJS($items.to()).toJS();
        data[$inited.key] = dataArray;
        State.writeTree(reference, {
            "list.items": data,
        });
    }
};
/**
 * 验证当前的items中是否包含了数据信息
 * @param reference
 */
const pipeVerify = (reference) => {
    return 0 < pipeGet(reference).length
};
const pipeGet = (reference) => {
    const {$items, $inited = {}} = reference.props;
    if ($items && $items.is()) {
        const data = Immutable.fromJS($items.to()).toJS();
        const array = data[$inited.key];
        return array ? array : []
    } else {
        return [];
    }
};

const pipeSelected = (reference, isData = false, field) => {
    const {$selected} = reference.props;
    if ($selected && $selected.is()) {
        const keys = $selected._("key");
        if (!(1 === keys.length && "_ROOT_" === keys[0])) {
            if (isData) {
                const data = $selected._("data");
                if (data && field) {
                    return data[field];
                } else {
                    return data;
                }
            } else {
                return keys;
            }
        }
    }
};

export default {
    pipeSelected,
    pipeInit,
    pipeGet,
    pipeIsUpdate,
    pipeReset,
    pipeVerify
}