import Dg from "./Ux.Debug";
import Value from "./Ux.Value";

/**
 * 资源文件数据读取方法
 * @method fromHoc
 * @param {React.PureComponent} reference React对应组件引用
 * @param {String} key 读取对应属性名
 * @return {null}
 */
const fromHoc = (reference = {}, key = "") => {
    Dg.ensureKey("fromHoc", key);
    const {$hoc} = reference.state;
    return $hoc ? $hoc._(key) : null;
};
/**
 * 从路由参数中读取数据专用
 * @method fromRouter
 * @param {React.PureComponent} reference React对应组件引用
 * @param {String} key 读取对应属性名
 * @return {null}
 */
const fromRouter = (reference = {}, key = "") => {
    Dg.ensureKey("fromRouter", key);
    const {$router} = reference.props;
    return $router ? $router._(key) : null;
};
/**
 * 从reference的props中读取`key`对应的值，一般用于读取Tabular/Assist
 * @method onDatum
 * @param {React.PureComponent} reference React对应组件引用
 * @param {String} key
 * @return {*}
 */
const onDatum = (reference, key) => {
    key = key.replace(/\./g, "_");
    const targetKey =
        reference.props[`$t_${key}`] || reference.props[`$a_${key}`];
    if (targetKey && targetKey.is()) {
        return targetKey.to();
    }
    return [];
};
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
    if (form) {
        if (undefined !== value) {
            const values = {};
            values[key] = value;
            form.setFieldsValue(values);
        } else {
            return form.getFieldValue(key);
        }
    } else {
        console.error("[Ux-Prop] form variable is missing!");
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
    if (form) {
        form.setFieldsValue(values);
    } else {
        console.error("[Ux-Prop] form variable is missing!");
    }
};
/**
 * 从React Router中读取路由参数
 * @method onRouting
 * @param {React.PureComponent} reference React对应组件引用
 * @param key 需要读取的参数键名
 * @return {*}
 */
const onRouting = (reference, key) => {
    const {$router} = reference.props;
    if ($router) {
        const params = $router.params();
        if (params) {
            return params[key];
        }
    }
};
/**
 * @class Prop
 * @description 属性专用处理器
 */
export default {
    // Form数据处理
    formClear,
    formRead,
    formReset,
    // Hit
    formHit,
    formHits,
    // 从reference中抽取数据
    onRouting,
    onDatum,
    // 从Hoc, Router中提取数据
    fromHoc,
    fromRouter
};
