import {DataLabor} from "entity";
import Immutable from 'immutable';
import E from './Ux.Error';
import Type from './Ux.Type';

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
    writeTree,
    rdxSubmitting,
    rdxReject,
    toEffect
}
