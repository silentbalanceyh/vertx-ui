import Acl from "./O.secure";
import Amt from "./O.ambient";

import Abs from '../abyss';
import E from "../error";
import Dev from "../develop";
import Cv from "../constant";
import Ele from "../element";
import Eng from '../engine';

/**
 * ## 「引擎」`Ux.formSubmit`
 *
 * Ant Design中的表单提交函数，返回最终的表单提交数据值。
 *
 * @memberOf module:_ui
 * @async
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {boolean} redux 是否执行 redux 提交。
 * @return {Promise<T>} 返回最终的表单提交数据值。
 */
const formSubmit = (reference, redux = false) => {
    // 提取 Form
    const {form} = reference.props;
    if (form) {
        return new Promise((resolve, reject) => form.validateFieldsAndScroll((error, values) => {
            // 执行 values
            if (error) {
                const data = {};
                data.error = error;
                data.client = true;
                reject({data});
            }
            resolve(values);
        })).then((params) => {
            // 拷贝参数
            const request = Acl.aclSubmit(params, reference);
            // 执行规则字段@的操作
            const formData = {};
            Object.keys(request).forEach(field => {
                if (0 <= field.indexOf("@")) {
                    const kv = field.split("@");
                    if (!formData[kv[0]]) {
                        formData[kv[0]] = {};
                    }
                    formData[kv[0]][kv[1]] = request[field];
                } else {
                    formData[field] = request[field];
                }
            })
            Dev.dgDebug(formData, "[ Ux ] 表单提交数据：", "#228B22");
            return Abs.promise(formData);
        });
    } else {
        return E.fxReject(10020);
    }
};

/**
 * ## 「引擎」`Ux.valueRequest`
 *
 * Ant Design提交表单被规范化过后的数据。
 *
 * 1. 注入默认语言信息，`Cv['Language']`读取语言信息，默认`cn`。
 * 2. 如果记录中不包含`active`字段，则注入默认的 active。
 * 3. 如果包含了应用数据，则将应用的 `sigma` 注入到请求数据中。
 * 4. 移除掉所有的 undefined 节点。
 *
 * @memberOf module:_value
 * @param {Object} params 输入数据值。
 * @return {Object} 被处理过后的请求数据值。
 */
const valueRequest = (params = {}) => {
    // 执行默认参数处理
    const data = Abs.clone(params);
    /* 记录中的语言信息 */
    data.language = Cv['LANGUAGE'];
    if (!data.hasOwnProperty('active')) {
        /* 默认记录启用 */
        data.active = true;
    }
    /*
     * 三个头部参数提取，仅保留 sigma 参数，其余两个参数不在此处体现
     * X-App-Id, X-App-Key, X-Sigma
     */
    const app = Amt.isInit();
    if (app && app.sigma) {
        // 双字段处理
        data.sigma = app.sigma;
    }
    return Ele.valueValid(data);
};

/**
 * ## 「标准」`Ux.formClear`
 *
 * Ant Design中的表单清空专用方法，用于清空当前 Ant Design表单。
 *
 * @memberOf module:_ui
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
        keys.forEach(key => Ele.valueAppend(data, key, undefined));
    }
    const fields = Object.keys(form.getFieldsValue());
    fields.forEach(key => Ele.valueAppend(data, key, undefined));
    form.setFieldsValue(data);
};
/**
 *
 * ## 「标准」`Ux.formRead`
 *
 * 根据数据填充 data 变量。
 *
 * 1. 如果包含了`$record`在 props 属性中，则直接使用 $record 数据执行填充，$record 的类型是 DataObject。
 * 2. 如果不包含`$record`变量，则直接用 form 的 `getFieldsValue` 读取当前表单值来填充 data 变量。
 *
 * @memberOf module:_ui
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
 * ## 「标准」`Ux.formGet`
 *
 * 直接从 form 中按 `key` 读取表单数据值。
 *
 * 1. 如果传入了 Array 类型的 key，则读取包含了 key 中所有元素的表单对象值。
 * 2. 如果传入了 String 类型的 key，则直接读取表单字段为 `key` 的字段值。
 * 3. 如果什么都没传入，则直接返回所有表单值。
 *
 * @memberOf module:_ui
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {String|Array} key 字段名称，有可能是字段集合。
 * @return {Object|any} 返回读取的字段值。
 */
const formGet = (reference, key = undefined) => {
    if (reference) {
        const {form} = reference.props;
        // E.fxTerminal(!form, 10020, form);
        if (form) {
            let data = form.getFieldsValue();
            data = Abs.clone(data);
            if (Abs.isArray(key)) {
                const result = {};
                key.forEach(each => result[each] = data[each]);
                return Ele.valueValid(result);
            } else {
                return key ? data[key] : data;
            }
        }
    }
};
/**
 * ## 「标准」`Ux.formReset`
 *
 * 重设表单值专用方法。
 *
 * @memberOf module:_ui
 * @param {ReactComponent} reference React组件引用，必须绑定过 Ant 中的 Form。
 * @param {String|Array} keys 字段名称，有可能是字段集合。
 * @param {Object} response 响应最终信息数据。
 */
const formReset = (reference, keys = [], response = {}) => {
    const {form} = reference.props;
    if (form) {
        if (0 < keys.length) {
            form.resetFields(keys);
        } else {
            form.resetFields();
        }
        Abs.fn(reference).doReset(reference, keys, response);
    } else {
        const ref = Eng.onReference(reference, 1);
        if (ref) {
            formReset(reference, keys, response);
        }
    }
};
/**
 * ## 「标准」`Ux.formHit`
 *
 * 「Ambiguity」Ant Design中的Form操作的二义性函数
 *
 * * `value`有值时直接设置`key`的表单值；
 * * `value`为undefined时则直接读取Form中的`key`对应的值
 *
 * 这个方法是一个典型的二义性方法，如果有 value 则设置字段`key`的值，如果没有value则读取`value`的值，但是它的读取不如 `formGet`，
 * `formGet`是增强版的表单读取方法，不仅仅可以读单字段的值，还可以读一个子对象（Object）。
 *
 * @memberOf module:_ui
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
 * ## 「标准」`Ux.formHits`
 *
 * Ant Design中的Form表单执行值设置，直接使用values执行设置，values中如果有undefined则清空该字段。
 *
 * @memberOf module:_ui
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
 * ## 「标准」`Ux.formLinker`
 *
 * > 该函数主要使用在`ListSelector、TreeSelector`这种复杂的自定义组件中。
 *
 * 通过 data 来读取
 *
 * 1. data 是 Array，则按长度为 1 来处理。
 * 2. data 是 Object，则直接处理。
 *
 * @memberOf module:_ui
 * @param {Object} data linker关联的数据信息。
 * @param {Object} config linker关联的配置信息。
 * @param {String} linkerField linker关联的字段值。
 * @return {undefined|*} 返回undefined或者最终计算的 linker 数据。
 */
const formLinker = (data, config = {}, linkerField) => {
    const {linker} = config;
    if (linker && !Abs.isEmpty(linker) && linkerField) {
        if (data) {
            if (Abs.isArray(data)) {
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
const valueMap = (target, source, config = {}) => {
    Abs.itObject(config, (from, to) => {
        if (!target[from]) {
            target[from] = source[to];
        }
    });
    return target;
}
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
    // 提交专用
    formSubmit,
    formEnd: (reference) => reference.setState({
        $submitting: false,
        $loading: false
    }),
    valueRequest,
    valueMap,
};