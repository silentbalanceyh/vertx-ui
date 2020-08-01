import Value from "../element";
import Abs from '../abyss';
import E from "../error";
import U from 'underscore';

/**
 * ## 特殊函数「Zero」
 *
 * Ant Design中的表单清空专用方法，用于清空当前 Ant Design表单。
 *
 * @memberOf module:_ant
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {Object} data 需要清空的对象值。
 * @return {Object} 处理被清空的所有方法。
 */
const formClear = (reference, data) => {
    const {$clear, form} = reference.props;
    // 记录切换：从更新表单 -> 添加表单切换
    if ($clear && $clear.is()) {
        // 记录切换：从更新某条记录 -> 更新另外一条记录
        const keys = $clear.to();
        keys.forEach(key => Value.valueAppend(data, key, undefined));
    }
    const fields = Object.keys(form.getFieldsValue());
    fields.forEach(key => Value.valueAppend(data, key, undefined));
    form.setFieldsValue(data);
};
/**
 *
 * ## 特殊函数「Zero」
 *
 * 根据数据填充 data 变量。
 *
 * 1. 如果包含了`$record`在 props 属性中，则直接使用 $record 数据执行填充，$record 的类型是 DataObject。
 * 2. 如果不包含`$record`变量，则直接用 form 的 `getFieldsValue` 读取当前表单值来填充 data 变量。
 *
 * @memberOf module:_ant
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {Object} data 需要填充的对象值。
 * @return {Object} 返回最终填充的结果。
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
 * ## 特殊函数「Zero」
 *
 * 直接从 form 中按 `key` 读取表单数据值。
 *
 * 1. 如果传入了 Array 类型的 key，则读取包含了 key 中所有元素的表单对象值。
 * 2. 如果传入了 String 类型的 key，则直接读取表单字段为 `key` 的字段值。
 * 3. 如果什么都没传入，则直接返回所有表单值。
 *
 * @memberOf module:_ant
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {String|Array} key 字段名称，有可能是字段集合。
 * @return {Object|any} 返回读取的字段值。
 */
const formGet = (reference, key) => {
    const {form} = reference.props;
    // E.fxTerminal(!form, 10020, form);
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
 * ## 特殊函数「Zero」
 *
 * 重设表单值专用方法。
 *
 * @memberOf module:_ant
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {String|Array} keys 字段名称，有可能是字段集合。
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
 * ## 特殊函数「Zero,Ambiguity」
 *
 * Ant Design中的Form操作的二义性函数
 *
 * * `value`有值时直接设置`key`的表单值；
 * * `value`为undefined时则直接读取Form中的`key`对应的值
 *
 * 这个方法是一个典型的二义性方法，如果有 value 则设置字段`key`的值，如果没有value则读取`value`的值，但是它的读取不如 `formGet`，
 * `formGet`是增强版的表单读取方法，不仅仅可以读单字段的值，还可以读一个子对象（Object）。
 *
 * @memberOf module:_ant
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {String} key 字段名称。
 * @param {any} value 字段值
 * @return {any} 只有在 value 不传入时使用该值。
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
 * ## 特殊函数「Zero」
 *
 * Ant Design中的Form表单执行值设置，直接使用values执行设置，values中如果有undefined则清空该字段。
 *
 * @memberOf module:_ant
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {Object} values 设置Form表单中的字段值
 */
const formHits = (reference, values = {}) => {
    const {form} = reference.props;
    E.fxTerminal(!form, 10020, form);
    if (form) {
        /*
         * 旧代码会引起重设时出现清空的问题，所以不可以使用
         * 旧代码
        // const formValues = {};
        // const fields = Object.keys(form.getFieldsValue());
        // fields.forEach(field => formValues[field] = values[field]);
         */
        form.setFieldsValue(values);
    }
};
/**
 * ## 特殊函数「Zero」
 *
 * > 该函数主要使用在`ListSelector、TreeSelector`这种复杂的自定义组件中。
 *
 * 通过 data 来读取
 *
 * 1. data 是 Array，则按长度为 1 来处理。
 * 2. data 是 Object，则直接处理。
 *
 * @memberOf module:_ant
 * @param {Object} data linker关联的数据信息。
 * @param {Object} config linker关联的配置信息。
 * @param {String} linkerField linker关联的字段值。
 * @return {undefined|*} 返回undefined或者最终计算的 linker 数据。
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
const formRedo = (reference) => {
    reference.setState({
        $submitting: false, $loading: false
    });
}
export default {
    // Form数据处理
    formClear,
    formRead,
    formGet,
    formReset,
    formRedo,
    // Hit
    formHit,
    formHits,
    formLinker,
};