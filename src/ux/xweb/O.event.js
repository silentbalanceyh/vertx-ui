import Abs from '../abyss';
import Ele from '../element';
import Cmn from './O.common';

const onChange = (reference) => function () {
    /*
     * 配置传入位置（二阶）
     */
    const [field, config, index] = arguments;
    if (1 === arguments.length) {
        /*
         * 传入 string，子类调用（纯调用）
         */
        return event => {
            const value = Ele.ambEvent(event);
            Abs.fn(reference).onChange(field, value);
        }
    } else if (2 === arguments.length) {
        /*
         * 直接更新数据值
         */
        return (field, value) => {
            let values;
            if (index) {
                values = Cmn.xtSet(reference, [field, index], value);
            } else {
                values = Cmn.xtSet(reference, field, value);
            }
            /* 该值就是 values */
            Abs.fn(reference).onChange(values);
            reference.setState({data: values});
        }
    }
}
/*
 * 自定义组件有三种格式
 * 1. data = {}
 * 2. data = Array
 * 3. data = ...（基础格式）
 */
export default {
    xt: (reference) => ({
        /* onChange 专用绑定 */
        onChange: onChange(reference)
    })
};