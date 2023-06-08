import __Zn from '../zero.uca.dependency.table.UNLOCK';
import {DataArray} from 'zme';

const callbackRow = (reference, input) => {
    /*
     * rxPostRow
     */
    const ref = __Zn.onReference(reference, 1);
    const {rxRow} = ref.props;
    const {id = ""} = reference.props;
    if (__Zn.isFunction(rxRow)) {
        /*
         * 1）input：添加、删除、编辑都好，最终处理的内容为 {} 或 key
         * 2）form：当前组件需要使用的上层 form 引用（Ant Form）
         * 3）reference：表单引用
         */
        const value = __Zn.formHit(ref, id);
        const field = id;
        const current = input;
        rxRow({field, value, current}, reference);
    }
};
const saveData = (reference, record) => {
    /*
     * data为null时,设置默认值[]
     */
    if (reference?.state.data == null) {
        reference.state.data = [];
    }
    const {data = []} = reference.state;
    if ("string" === typeof record) {
        let $data = __Zn.clone(data);
        $data = $data.filter(each => record !== each.key);
        return $data;
    } else {
        /*
         * 保存 / 新增
         */
        const dataArray = new DataArray(data); // Dsl.getArray(data);
        dataArray.saveElement(record);
        return dataArray.to();
    }
};

const onRow = (reference) => (row = {}, additional = {}) => {
    /*
     * 按照 row 保存数据
     */
    const state = __Zn.clone(additional);
    /*
     * 更新相关数据
     */
    const request = saveData(reference, row);
    state.data = doChange(reference, request);
    __Zn.of(reference).in(state).handle(() => {

        /*
         * rxPostRow 调用
         */
        callbackRow(reference, state.data);
    })
    // reference.?etState(state);
    // /*
    //  * rxPostRow 调用
    //  */
    // callbackRow(reference, state.data);
};
const onRows = (reference) => (rows = [], additional = {}) => {
    const state = __Zn.clone(additional);
    const {data = []} = reference.state;
    const dataArray = new DataArray(data); // Dsl.getArray(data);
    rows.forEach(row => dataArray.saveElement(row));
    const request = dataArray.to();
    state.data = doChange(reference, request);

    __Zn.of(reference).in(state).handle(() => {

        /*
         * rxRow 调用
         */
        callbackRow(reference, state.data);
    })
    // reference.?etState(state);
    // /*
    //  * rxRow 调用
    //  */
    // callbackRow(reference, state.data);
};
const doChange = (reference, request = []) => {
    request = __Zn.clone(request);
    /*
     * 最终处理，解决 ERROR 类似的字段
     */
    const {$keyField} = reference.state;
    request.forEach(record => {
        if (record.key && record.key.startsWith("ERROR")) {
            record.key = record[$keyField];
        }
    });
    __Zn.fn(reference).onChange(request);
    return request;
}
const fnDelete = (reference) => (id, record) => {
    /*
     * 提交处理
     */
    __Zn.of(reference).submitting().handle(() => {

        /*
         * 更新 row
         */
        const rxRow = onRow(reference);
        rxRow(id, {$submitting: false});
    }, 0)
    // reference.?etState({$submitting: true});
    // __Zn.toLoading(() => {
    //     /*
    //      * 更新 row
    //      */
    //     const rxRow = onRow(reference);
    //     rxRow(id, {$submitting: false});
    // })
};
const fnEdit = (reference) => (id, record) => {
    const ref = __Zn.onReference(reference, 1);
    const data = __Zn.clone(record);
    const {$inited = {}} = ref.props;

    const {$keyField = "key"} = reference.state;
    if (record[$keyField]) {
        /*
         * 保证更新
         */
        data.key = record[$keyField];
    }

    if ($inited.key) {
        // 父表单字段
        data.parentId = $inited.key;
    }
    /*
     * 状态重新设置
     */
    const state = {};
    /*
     * data 中的日期格式需要解析
     * The value/defaultValue of DatePicker or MonthPicker must be a moment object after `antd@2.0`
     * 防止上述错误，执行表单的初始值
     */
    state.$inited = data;
    state.$mode = __Zn.Env.FORM_MODE.EDIT;
    // state.$visible = true;
    __Zn.of(reference).in(state).open().done();
    // reference.?etState(state);
};
const onOpen = (reference) => () => {
    const ref = __Zn.onReference(reference, 1);

    const data = {};
    // 专用处理
    data.key = __Zn.randomUUID();

    const {$inited = {}} = ref.props;
    if ($inited.key) {
        // 父表单字段
        data.parentId = $inited.key;
    }
    // 后期是合并，所以这里需要提供 $inited 键
    return __Zn.promise({
        $inited: data,
        $mode: __Zn.Env.FORM_MODE.ADD
    });
};
const yoUniform = (uniform = {}, reference) => {
    /*
     * $record 主记录处理
     */
    const {$record, $options} = reference.props;
    uniform.$record = $record;
    uniform.$options = $options;
    /*
     * 上层的 $op 属性引入到下层中执行处理
     * 传入下层，可替换二次属性
     */
    const {$op = {}} = reference.props;
    if (!__Zn.isEmpty($op)) {
        /*
         * 执行二阶函数的专用位置，绑定二级 form
         */
        uniform.$op = $op;
    }
};
const yoInherit = (reference) => {
    const ref = __Zn.onReference(reference, 1);
    const inherit = __Zn.onUniform(ref.props);

    inherit.reference = reference;
    /*
     * 自定义组件，这里要调用外围方法
     */
    inherit.rxRow = onRow(reference);
    inherit.rxRows = onRows(reference);
    /*
     * 构造 Form 类的 Assist
     * 这个属于特殊规则，主要针对 form 中 Array 类型的提供数据源
     */
    const form = __Zn.v4FormRef(ref); // ref.props;
    /*
     * 特殊统一处理
     */
    yoUniform(inherit, ref);
    if (form) {
        const values = form.getFieldsValue();
        Object.keys(values)
            .filter(field => __Zn.isArray(values[field]))
            .forEach(field => {
                const key = __Zn.toKey(`form.${field}`);
                const value = values[field];
                inherit[key] = new DataArray(value); // Dsl.getArray(value);
            })
    }
    return inherit;
};

const yoValue = (value = [], tableRef = {}) => {
    let normalized = [];
    if (__Zn.isArray(value)) {
        normalized = __Zn.clone(value);
    } else {
        try {
            normalized = __Zn.wayS2O(value); // JSON.parse(value);
        } catch (error) {
        }
    }
    if (__Zn.isArray(normalized)) {
        /*
         * key 专用执行
         */
        normalized.forEach((record, index) => {
            if (undefined !== tableRef.rowKey) {
                /*
                 * 定义了 rowKey 字段信息
                 */
                if (!record.hasOwnProperty(tableRef.rowKey)) {
                    record[tableRef.rowKey] = `ERROR-${index}`;
                }
                /*
                 * 不包含 key 时，将 rowKey 的值赋值给 key
                 */
                if (!record.key) {
                    record.key = record[tableRef.rowKey];
                }
            } else {
                /*
                 * 如果没定义 rowKey，不包含 key 则标识为错误
                 */
                if (!record.hasOwnProperty('key')) {
                    record.key = `ERROR-${index}`;
                }
            }
        });
    }
    return normalized;
}
const yoInheritForm = (reference, $inited, $mode) => {
    const inherit = yoInherit(reference);
    inherit.$inited = $inited;
    inherit.$mode = $mode;
    const {value} = reference.props;
    if (value) {
        inherit.value = value;
    }
    const {$renders} = reference.props;
    if ($renders) {
        inherit.$renders = $renders;
    }
    return inherit;
}
export default {
    EVENTS: {
        fnDelete,
        fnEdit,
    },
    onOpen,
    yoValue,
    yoInherit,
    yoInheritForm,
}