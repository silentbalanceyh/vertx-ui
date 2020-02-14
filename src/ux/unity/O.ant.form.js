import Value from "../element";
import Abs from '../abyss';
import E from "../error";
import U from 'underscore';

/**
 * Ant Design中的Form清空专用方法
 * @method formClear
 * @param reference React对应组件引用 React.PureComponent
 * @param data
 * @return {*}
 */
const formClear = (reference, data) => {
    const {$clear, form} = reference.props;
    // 记录切换：从更新表单 -> 添加表单切换
    if ($clear && $clear.is()) {
        const keys = $clear.to();
        keys.forEach(key => Value.valueAppend(data, key, undefined));
    }
    // 记录切换：从更新某条记录 -> 更新另外一条记录
    const fields = Object.keys(form.getFieldsValue());
    fields.forEach(key => Value.valueAppend(data, key, undefined));
    return data;
};
/**
 * Ant Design中的Form读取，将`$record`记录中的数据读取到`data`中；
 * @method formRead
 * @param reference React对应组件引用 React.PureComponent
 * @param data 被修改的数据引用
 */
const formRead = (reference, data = {}) => {
    const {$record} = reference.props;
    if ($record && $record.is()) {
        const record = $record.to();
        // eslint-disable-next-line
        for (const key in record) {
            if (record.hasOwnProperty(key)) {
                data[key] = record[key];
            }
        }
    } else {
        const {form} = reference.props;
        data = form.getFieldsValue();
    }
    return data;
};
/**
 * Ant Design中的Form的表单数据读取
 * @method formGet
 * @param reference React对应组件引用 React.PureComponent
 * @param key 指定重置的字段值
 */
const formGet = (reference, key) => {
    const {form} = reference.props;
    E.fxTerminal(!form, 10020, form);
    if (form) {
        let data = form.getFieldsValue();
        data = Abs.clone(data);
        if (U.isArray(key)) {
            const result = {};
            key.forEach(each => result[each] = data[each]);
            return Value.valueValid(result);
        } else {
            return key ? data[key] : data;
        }
    }
};
/**
 * Ant Design中的Form的表单重置函数
 * @method formReset
 * @param reference React对应组件引用 React.PureComponent
 * @param keys 指定重置的字段值
 */
const formReset = (reference, keys = []) => {
    const {form} = reference.props;
    if (form) {
        if (0 < keys.length) {
            form.resetFields(keys);
        } else {
            form.resetFields();
            /*
             * callback，reset回调
             */
            const {doReset} = reference.props;
            if (U.isFunction(doReset)) {
                doReset(keys, reference);
            }
        }
    }
};
/**
 * Ant Design中的Form操作的二义性函数
 * * `value`有值时直接设置`key`的表单值；
 * * `value`为undefined时则直接读取Form中的`key`对应的值
 * @method formHit
 * @param reference React对应组件引用 React.PureComponent
 * @param key 字段名
 * @param value 字段值
 * @return {any}
 */
const formHit = (reference, key, value) => {
    const {form} = reference.props;
    E.fxTerminal(!form, 10020, form);
    if (form) {
        if (undefined !== value) {
            const values = {};
            values[key] = value;
            form.setFieldsValue(values);
        } else {
            return form.getFieldValue(key);
        }
    }
};
/**
 * Ant Design中的Form表单执行值设置
 * @method formHits
 * @param reference React对应组件引用 React.PureComponent
 * @param values 设置Form表单中的字段值
 */
const formHits = (reference, values = {}) => {
    const {form} = reference.props;
    E.fxTerminal(!form, 10020, form);
    if (form) {
        form.setFieldsValue(values);
    }
};
/*
 * 通过 data 来读取
 * 1）data 是 Array，则长度为 1 的处理
 * 2）data 是 Object，则直接处理
 */
const formLinker = (data, config = {}, linkerField) => {
    const {linker} = config;
    if (linker && !Abs.isEmpty(linker) && linkerField) {
        if (data) {
            if (U.isArray(data)) {
                /*
                 * 数组处理
                 */
                if (1 === data.length) {
                    const response = data[0];
                    return formLinker(response, config);
                }
            } else {
                /*
                 * 递归处理
                 */
                const hitField = Object.keys(linker)
                    .filter(field => linker[field] === linkerField)
                    .filter(field => undefined !== field);
                if (1 === hitField.length) {
                    return data[hitField[0]];
                }
            }
        }
    }
};
export default {
    // Form数据处理
    formClear,
    formRead,
    formGet,
    formReset,
    // Hit
    formHit,
    formHits,
    formLinker,
};