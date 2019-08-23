import Ux from 'ux';
import * as U from 'underscore';

const _setChange = (reference: any, value: any = [], updated: any) => {
    // 选择触发时，country / state / city 整个一条链上的数据已经加载完成，这里value为数组，直接设置
    reference.setState({defaultValue: Ux.clone(value)});
    const {onChange, rxSelect} = reference.props;
    if (U.isFunction(onChange)) {
        // 表单设置值
        Ux.dgDebug({updated}, "值更改 = ");
        // 将当前值更新为regionId专用
        onChange(updated);
    }
    if (U.isFunction(rxSelect)) {
        // 更改完成过后的变更函数
        const {options = []} = reference.state;
        rxSelect(value, options);
    }
};

const bindChange = (reference: any) => (value, selectedOptions) => {
    if (4 === value.length) {
        /*
         * 长度为 4 表示选择完成
         */
        const updated = value[3];
        if (updated) {
            _setChange(reference, value, updated);
        }
    } else {
        /*
         * 长度为 0 则表示清空
         */
        if (0 === value.length) {
            _setChange(reference, value, undefined);
        }
    }
};
export default {
    bindChange
}
