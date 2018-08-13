import {DataLabor} from "entity";
import Immutable from 'immutable';
import E from './Ux.Error';
import Type from './Ux.Type';
import U from 'underscore';

/**
 * 将数据会写状态树，props中需要包含`fnOut`函数
 * @method writeTree
 * @param {React.PureComponent} reference React对应组件引用
 * @param state 写入的状态数据
 * @param dft 默认值
 */
const writeTree = (reference, state, dft = null) => E.fxOut(reference, (fnOut) => {
    const $state = state ? Immutable.fromJS(state).toJS() : state;
    const fnModify = prefix => (field, value) => {
        if (field.startsWith(prefix)) {
            const key = `assist.${field.replace(/\./g, '_').replace(/assist_/g, '')}`
            $state[key] = value;
            delete $state[field];
        }
    };
    Type.itObject(state, (field, value) => {
        fnModify("assist")(field, value);
        fnModify("tabular")(field, value);
    }, true);
    fnOut(DataLabor.createIn($state, dft));
});
/**
 * list.items子列表专用方法，默认是Save模式
 * @param dataObject
 * @param id
 * @param deleted
 * @param record
 */
const rapitRecord = (dataObject, id, record, deleted = false) => {
    // 检查数据基本信息
    E.fxTerminal(!dataObject, 10082, dataObject);
    E.fxTerminal(!record, 10062, record);
    E.fxTerminal(!id, 10062, id);
    // 读取原始记录
    const dataRecord = dataObject && dataObject.is()
        ? Immutable.fromJS(dataObject.to()).toJS() : {};
    console.info("[ 调试专用，后期删除 ] Before ", id, dataRecord, record);
    if (id) {
        // 读取原始数据
        let $extracted = dataObject.$(id);
        const executeRecord = (single) => {
            // 从原始记录中抽取DataArray列表
            if ($extracted && $extracted.is()) {
                if (deleted) {
                    // 删除记录中的数据
                    $extracted.removeElement(single.key);
                } else {
                    // 更新数据
                    $extracted.saveElement(single);
                }
                dataRecord[id] = $extracted.to();
            } else {
                // 这种只能添加，不会在删除的时候触发
                dataRecord[id] = [single];
            }
        };
        if (U.isArray(record)) {
            record.forEach(executeRecord);
        } else {
            executeRecord(record);
        }
    }
    console.info("[ 调试专用，后期删除 ] After ", id, dataRecord, record);
    return dataRecord;
};

const rdxSubmitting = (reference, loading = true) => {
    const state = {};
    state[`status.submitting`] = {loading};
    const $state = Immutable.fromJS(state).toJS();
    writeTree(reference, $state);
};
const rdxReject = (message) => Promise.reject({data: {info: message}});
/**
 * 读取专用的带有`$_`前缀的属性值，主要用于从state状态中读取，Zero中所有的state中的键都是`$_`的格式。
 * @method toEffect
 * @param state 传入的React状态
 */
const toEffect = (state = {}) => {
    const inherits = {};
    for (const key in state) {
        if (key.startsWith("$_")) {
            inherits[key] = state[key];
        }
    }
    return inherits
};
/**
 * @class State
 * @description 回写状态树专用方法
 */
export default {
    // 特殊方法，用于执行DataObject中的某个key下的

    rapitRecord,
    // 写状态树
    writeTree,
    // 防重复提交专用方法
    rdxSubmitting,
    // 返回Promise的reject结果
    rdxReject,
    // 老版本提取$_状态的专用方法
    toEffect
}
