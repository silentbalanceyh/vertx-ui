import U from 'underscore';
import Dust from './O.foundation';

import E from '../error';
import Abs from '../abyss';

const xtChange = (reference, changedValues = {}, key) => {
    const {onChange} = reference.props;
    // 10095规范：传入的自定义控件中没有onChange的函数
    E.fxFatal(!U.isFunction(onChange), 10095, onChange);
    // 专用于Array类型的onChange处理，生成新的newValue
    if (key) {
        // Array类型处理变更数据信息
        onChange(changedValues);
    } else {
        // 0.非Array类型
        const $state = Abs.clone(reference.state);
        let newValue = Object.assign({}, $state, changedValues);
        // 1.拷贝新数据
        newValue = Abs.clone(newValue);
        // 2.过滤特殊数据
        newValue = Dust.xtToValue(newValue);
        // 3.变更数据处理
        onChange(newValue);
    }
};

const xt2Change = (reference, field) => (event) => {
    // 1.读取Input数据
    const state = Dust.xtGet(reference, field, () => event.target ? event.target.value : undefined);
    // 2.更新状态
    reference.setState(state);
    // 3.调用内置的onChange专用事件
    xtChange(reference, state);
};
const xt2Blur = (reference, field) => (event) => {
    const {onBlur} = reference.props;
    if (U.isFunction(onBlur)) {
        onBlur(event);
        // 二次绑定处理
        xt2Change(reference, field)(event);
    }
};

export default {
    xtChange,
    // 生成事件
    xt2Change,
    xt2Blur,
};