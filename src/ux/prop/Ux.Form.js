import Value from "../Ux.Value";
import E from "../Ux.Error";
import Immutable from "immutable";

/**
 * Ant Design中的Form清空专用方法
 * @method formClear
 * @param {React.PureComponent} reference React对应组件引用
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
 * @param {React.PureComponent} reference React对应组件引用
 * @param data 被修改的数据引用
 */
const formRead = (reference, data = {}) => {
    const {$record} = reference.props;
    if ($record && $record.is()) {
        const record = $record.to();
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
 * @param {React.PureComponent} reference React对应组件引用
 * @param key 指定重置的字段值
 */
const formGet = (reference, key) => {
    const {form} = reference.props;
    E.fxTerminal(!form, 10020, form);
    if (form) {
        let data = form.getFieldsValue();
        data = Immutable.fromJS(data).toJS();
        return key ? data[key] : data;
    }
};
/**
 * Ant Design中的Form的表单重置函数
 * @method formReset
 * @param {React.PureComponent} reference React对应组件引用
 * @param keys 指定重置的字段值
 */
const formReset = (reference, keys = []) => {
    const {form} = reference.props;
    if (form) {
        if (0 < keys.length) {
            form.resetFields(keys);
        } else {
            form.resetFields();
        }
    }
};
/**
 * Ant Design中的Form操作的二义性函数
 * * `value`有值时直接设置`key`的表单值；
 * * `value`为undefined时则直接读取Form中的`key`对应的值
 * @method formHit
 * @param {React.PureComponent} reference React对应组件引用
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
 * @param {React.PureComponent} reference React对应组件引用
 * @param values 设置Form表单中的字段值
 */
const formHits = (reference, values = {}) => {
    const {form} = reference.props;
    E.fxTerminal(!form, 10020, form);
    if (form) {
        form.setFieldsValue(values);
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
}