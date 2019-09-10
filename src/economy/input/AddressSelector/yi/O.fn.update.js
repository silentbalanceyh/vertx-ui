import yiInit from './O.fn.init';
import U from 'underscore';

export default (reference, prevProps) => {
    if (reference.props.value) {
        // 1. 检查 是否发生了改变
        if (reference.props.value !== prevProps.value) {
            // 读取初始值，一般用于重设
            const meta = reference.props['data-__meta'];
            if (meta) {
                const initValue = meta['initialValue'];
                // 直接更新
                if (initValue === reference.props.value) {
                    yiInit(reference);
                }
            }
        }
    } else {
        // 清空处理
        const {fnChange} = reference.props;
        if (U.isFunction(fnChange)) {
            // 清空处理
            fnChange(undefined);
        }
    }
};