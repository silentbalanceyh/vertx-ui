import Ux from 'ux';
import * as U from 'underscore';

const bindChange = (reference: any) => (value, selectedOptions) => {
    // 触发外围的onChange专用事件
    if (4 === value.length) {
        const updated = value[3];
        if (updated) {
            // 选择触发时，country / state / city 整个一条链上的数据已经加载完成，这里value为数组，直接设置
            reference.setState({defaultValue: Ux.clone(value)});
            const {onChange, onPostChange} = reference.props;
            if (U.isFunction(onChange)) {
                // 表单设置值
                Ux.dgDebug({updated}, "表单更改值 = ");
                // 将当前值更新为distinctId专用
                onChange(updated);
            }
            if (U.isFunction(onPostChange)) {
                // 更改完成过后的变更函数
                const {options = []} = reference.state;
                onPostChange(value, options);
            }
        }
    }
};
export default {
    bindChange
}
