import Dg from './Ux.Debug';
import Value from './Ux.Value';

const fromHoc = (reference = {}, key = "") => {
    Dg.ensureKey('fromHoc', key);
    const {$hoc} = reference.state;
    return $hoc ? $hoc._(key) : null;
};
const fromRouter = (reference = {}, key = "") => {
    Dg.ensureKey('fromRouter', key);
    const {$router} = reference.props;
    return $router ? $router._(key) : null;
};
const onDatum = (reference, key) => {
    key = key.replace(/\./g, '_');
    const targetKey = reference.props[`$t_${key}`] || reference.props[`$a_${key}`];
    if (targetKey && targetKey.is()) {
        return targetKey.to();
    }
    return [];
};
const formClear = (reference, data) => {
    const {$clear} = reference.props;
    if ($clear && $clear.is()) {
        const keys = $clear.to();
        keys.forEach(key => {
            Value.valueAppend(data, key, undefined);
        })
    }
    return data;
};
const formRead = (reference, data = {}) => {
    const {$record} = reference.props;
    console.info($record);
    if ($record && $record.is()) {
        const record = $record.to();
        for (const key in record) {
            if (record.hasOwnProperty(key)) {
                data[key] = record[key];
            }
        }
    }
    return data;
};
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
const formHit = (reference, key, value) => {
    const {form} = reference.props;
    if (form) {
        if (value) {
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
const formHits = (reference, values = {}) => {
    const {form} = reference.props;
    if (form) {
        form.setFieldsValue(values);
    } else {
        console.error("[Ux-Prop] form variable is missing!");
    }
};
const onRouting = (reference, key) => {
    const {$router} = reference.props;
    if ($router) {
        const params = $router.params();
        if (params) {
            return params[key];
        }
    }
};
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
    fromRouter,
}
