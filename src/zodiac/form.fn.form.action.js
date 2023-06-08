import __Zn from './zero.module.dependency';
import __Fr from './antd4.fn.v4.patch';

const formGet = (reference, key = undefined, warningOn = true) => {
    if (reference) {
        // E.fxTerminal(!form, 10020, form);
        // 旧代码：const {form} = reference.props;
        const form = __Fr.v4FormRef(reference);
        if (form) {
            let data = form.getFieldsValue();
            data = __Zn.clone(data);
            if (__Zn.isArray(key)) {
                const result = {};
                key.forEach(each => result[each] = data[each]);
                return __Zn.valueValid(result);
            } else {
                return key ? data[key] : data;
            }
        } else {
            if (warningOn) {
                console.warn("[V4] Form 引用读取失败！！", form, key);
            }
        }
    }
};

const formReset = (reference, keys = [], response = {}) => {
    // 旧代码：const {form} = reference.props;
    const form = __Fr.v4FormRef(reference);
    if (form) {
        if (0 < keys.length) {
            form.resetFields(keys);
        } else {
            form.resetFields();
        }
        __Zn.fn(reference).rxReset(reference, keys, response);
    } else {
        const ref = __Zn.onReference(reference, 1);
        const refForm = __Fr.v4FormRef(ref);
        if (refForm) {
            formReset(reference, keys, response);
        }
    }
};
const formHit = (reference, key, value = undefined) => {
    // 旧代码：const {form} = reference.props;
    const form = __Fr.v4FormRef(reference);
    __Zn.fxTerminal(!form, 10020, form);
    if (form) {
        if (undefined !== value) {
            const values = {};
            values[key] = value;
            form.setFieldsValue(values);
            //__Zn.of(reference).up().done();
        } else {
            return form.getFieldValue(key);
        }
    }
};
const formHits = (reference, values = {}) => {
    // 旧代码：const {form} = reference.props;
    const form = __Fr.v4FormRef(reference);
    __Zn.fxTerminal(!form, 10020, form);
    // 无form引用
    if (!form) {
        return;
    }
    // 无值处理
    if (__Zn.isEmpty(values)) {
        return;
    }
    // 判断是否发生改变
    const fields = Object.keys(values);
    const valueOld = formGet(reference, fields);
    // 防止死循环，执行深度判断设值（原始值和现有值执行比对）
    if (__Zn.isDiff(valueOld, values)) {
        const fields = Object.keys(form.getFieldsValue());
        // Fix: You cannot set a form field before rendering a field associated with the value.
        const formValues = __Zn.clone(values);
        Object.keys(values).forEach(field => {
            if (!fields.includes(field)) {
                delete formValues[field];
            }
        });
        form.setFieldsValue(formValues);
        //__Zn.of(reference).up().done();
    } else {
        __Zn.dgDebug({form}, "新旧值未发生该变，不触发！！")
    }
};
const formClear = (reference, data) => {
    const {$clear} = reference.props;
    // 旧代码：const {form} = reference.props;
    const form = __Fr.v4FormRef(reference);
    // 记录切换：从更新表单 -> 添加表单切换
    if ($clear && $clear.is()) {
        // 记录切换：从更新某条记录 -> 更新另外一条记录
        const keys = $clear.to();
        keys.forEach(key => __Zn.valueAppend(data, key, undefined));
    }
    const fields = Object.keys(form.getFieldsValue());
    fields.forEach(key => __Zn.valueAppend(data, key, undefined));
    form.setFieldsValue(data);
    //__Zn.of(reference).up().done();
};
const formRow = (reference, request = {}, config = {}) => {
    // 此处 request 执行过 dataRequest 或 valueRequest 部分的内容
    const {rxRow} = reference.props;
    if (__Zn.isFunction(rxRow)) {
        const {
            $mode,          // 表单模式
            $inited         // 表单初始值
        } = reference.props;
        if (__Zn.Env.FORM_MODE.ADD === $mode && !config.close) {
            /*
             * 此处新版本需要重新考虑流程，主要原因是在持续处理过程中，如何更新 hidden
             * 属性的问题，一旦重置之后，hidden 的属性会设置成最早的值，所以此处需要一个
             * 新的API执行重置的动作。
             * 1. 根据 reset 配置重置表单，如果 reset 为空，则重置整个表单
             *    如果 reset 为长度大于1的数组，则重置 reset 中的字段
             * 2. 由于调用的是 formContinue，所以此处会重置 $inited.key 的值
             *    保证持续添加的效果
             * 更改过后的 formContinue 的接口和原始接口是一致的，包括操作行为
             */
            __Zn.of(reference).load().handle(() => {
                const initialValue = __Zn.clone($inited);
                {
                    const {reset = []} = config;
                    formReset(reference, reset);
                    initialValue.key = __Zn.randomUUID();
                    formHits(reference, initialValue);
                }
                rxRow(request, {
                    $submitting: false,         // 关闭提交
                    $inited: initialValue,      // 继续添加，处于添加模式比较特殊
                });
            })

        } else {
            // 关闭窗口的模式可以不用考虑房重复提交部分
            rxRow(request, {
                $visible: false, // 关闭窗口
                $submitting: false, // 关闭提交
            });
        }
        return __Zn.promise(request);
    } else {
        throw new Error("[ Ux ] 核心函数 rxRow 丢失！");
    }
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    // 读取：data[key] | data
    formGet,
    // 重置
    formReset,
    // 「二义性」读 / 写
    formHit,
    // 「批量」写
    formHits,
    // 清空
    formClear,
    // 行添加
    formRow,
}
