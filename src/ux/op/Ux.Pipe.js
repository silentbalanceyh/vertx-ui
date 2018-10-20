import Env from "../Ux.Env";
import U from "underscore";
import Dg from "../Ux.Debug";
import State from "../prop/Ux.State";
import Value from '../Ux.Value';
import E from '../Ux.Error';

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
        const data = Value.clone($items.to());
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
    return 0 < pipeGet(reference).length;
};
const pipeGet = (reference) => {
    const {$items, $inited = {}} = reference.props;
    if ($items && $items.is()) {
        const data = Value.clone($items.to());
        const array = data[$inited.key];
        return array ? array : [];
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

const pipeTree = (reference = {}, values = {}, deleted = false) => {
    const {$tree} = reference.props;
    if ($tree && $tree.is()) {
        // 【二义性处理】Function和值
        values = Value.to(values);
        if (deleted) {
            $tree.removeElement(values.key);
        } else {
            $tree.saveElement(values);
        }
        return $tree.to();
    } else return $tree;
};

const pipeCriteria = (reference = {}, filters = {}) => {
    const {$query} = reference.props;
    if ($query && $query.is()) {
        let ref = $query.to().criteria;
        // 【二义性处理】Function和值
        filters = Value.to(filters);
        if (filters) {
            ref = Object.assign(ref, filters);
        }
        return ref ? ref : {};
    } else return {};
};

const pipeQuery = (reference = {}, filters = {}) => {
    const {$query} = reference.props;
    if ($query && $query.is()) {
        const criteria = pipeCriteria(reference, filters);
        $query.set("criteria", criteria);
        return $query.to();
    } else return {};
};

const pipeStream = (reference = {}, config = {}, state = {}) => {
    const {
        stateKey, key, data, index
    } = config;
    // 判断是读还是写
    if (data) {
        // 写数据
        if (!state[stateKey]) state[stateKey] = {};
        state[stateKey][key] = data;
        return state;
    } else {
        let $key = key;
        if (!$key) {
            const {$parent = {}} = reference.props;
            if ($parent.key) $key = $parent.key;
            if (!$key) E.fxFailure(10096, $key);
        }
        let record = {};
        // 读数据
        const {$selected} = reference.props;
        if ($selected && $selected.is()) {
            const selected = $selected._($key);
            if (U.isArray(selected)) {
                if (undefined === index) {
                    return selected;
                } else {
                    record = selected[index];
                }
            }
        } else {
            E.fxFailure(10097, record);
        }
        return record;
    }
};
export default {
    pipeSelected,
    pipeInit,
    pipeGet,
    pipeIsUpdate,
    pipeReset,
    pipeVerify,
    pipeTree,
    pipeCriteria,
    pipeQuery,
    pipeStream
};