import {DataLabor} from "entity";
import Immutable from 'immutable';

/**
 * 将数据会写状态树，props中需要包含`fnOut`函数
 * @method writeTree
 * @param {React.PureComponent} reference React对应组件引用
 * @param state 写入的状态数据
 * @param dft 默认值
 */
const writeTree = (reference = {}, state, dft = null) => {
    const {fnOut} = reference.props;
    if (fnOut) {
        const $state = state ? Immutable.fromJS(state).toJS() : state;
        fnOut(DataLabor.createIn($state, dft));
    } else {
        console.warn("[STATE] 'fnOut' function is missing in current component.", reference);
    }
};
/**
 * Button的防重复提交专用，固定状态$_loading属性值
 * @method writeLoading
 * @param {React.PureComponent} reference React对应组件引用
 * @param {Boolean} $_loading 写入组件状态
 */
const writeLoading = (reference = {}, $_loading = true) => {
    reference.setState({$_loading});
};
/**
 * @class State
 * @description 回写状态树专用方法
 */
export default {
    writeTree,
    writeLoading,
}
