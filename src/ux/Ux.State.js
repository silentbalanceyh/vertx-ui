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

const writeButton = (reference, event) => {
    return (loading = true) => {
        const id = event.target.id;
        if (id) {
            const data = {};
            data[id] = {loading};
            const state = {};
            state[`op.status.buttons`] = data;
            writeTree(reference, state);
        }
    }
};
/**
 * @class State
 * @description 回写状态树专用方法
 */
export default {
    writeTree,
    writeButton
}
