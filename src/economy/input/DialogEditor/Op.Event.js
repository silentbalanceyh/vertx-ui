import Ux from "ux";
import {Dsl} from "entity";
import U from "underscore";

const saveData = (reference, record) => {
    const {data = []} = reference.state;
    if ("string" === typeof record) {
        let $data = Ux.clone(data);
        $data = $data.filter(each => record !== each.key);
        return $data;
    } else {
        /*
         * 保存 / 新增
         */
        const dataArray = Dsl.getArray(data);
        dataArray.saveElement(record);
        return dataArray.to();
    }
};

const onRow = (reference) => (row = {}, additional = {}) => {
    /*
     * 按照 row 保存数据
     */
    const state = Ux.clone(additional);
    /*
     * 更新相关数据
     */
    state.data = saveData(reference, row);
    /*
     * 自定义组件变更
     */
    const {onChange} = reference.props;
    if (U.isFunction(onChange)) {
        onChange(state.data);
    }
    reference.setState(state);
};
const onRows = (reference) => (rows = [], additional = {}) => {
    const state = Ux.clone(additional);
    const {data = []} = reference.state;
    const dataArray = Dsl.getArray(data);
    rows.forEach(row => dataArray.saveElement(row));
    const request = dataArray.to();
    state.data = Ux.clone(request);
    const {onChange} = reference.props;
    if (U.isFunction(onChange)) {
        onChange(state.data);
    }
    reference.setState(state);
};
const fnDelete = (id, record, metadata = {}) => {
    /*
     * 删除当前行的信息
     */
    const {reference} = metadata;
    /*
     * 提交处理
     */
    reference.setState({$submitting: true});
    Ux.toLoading(() => {
        /*
         * 更新 row
         */
        const rxRow = onRow(reference);
        rxRow(id, {$submitting: false});
    })
};
const fnEdit = (id, record, metadata = {}) => {
    const {reference} = metadata;
    const ref = Ux.onReference(reference, 1);
    const data = Ux.clone(record);
    const {$inited = {}} = ref.props;
    if ($inited.key) {
        // 父表单字段
        data.parentId = $inited.key;
    }
    /*
     * 状态重新设置
     */
    const state = {};
    state.$inited = data;
    state.$mode = Ux.Env.FORM_MODE.EDIT;
    state.$visible = true;
    reference.setState(state);
};
const onOpen = (reference) => () => {
    const ref = Ux.onReference(reference, 1);

    const data = {};
    data.key = Ux.randomUUID();
    const {$inited = {}} = ref.props;
    if ($inited.key) {
        // 父表单字段
        data.parentId = $inited.key;
    }
    // 后期是合并，所以这里需要提供 $inited 键
    return Ux.promise({
        $inited: data,
        $mode: Ux.Env.FORM_MODE.ADD
    });
};
const yoInherit = (reference) => {
    const ref = Ux.onReference(reference, 1);
    const inherit = Ux.onUniform(ref.props);
    /*
     * 传入 submit 专用函数
     */
    inherit.doSubmitting = ($submitting = true) =>
        reference.setState({$submitting});
    /*
     * 自定义组件，这里要调用外围方法
     */
    inherit.doRow = onRow(reference);
    inherit.doRows = onRows(reference);
    /*
     * 构造 Form 类的 Assist
     * 这个属于特殊规则，主要针对 form 中 Array 类型的提供数据源
     */
    const {form} = ref.props;
    if (form) {
        const values = form.getFieldsValue();
        Object.keys(values)
            .filter(field => U.isArray(values[field]))
            .forEach(field => {
                const key = Ux.toKey(`form.${field}`);
                const value = values[field];
                inherit[key] = Dsl.getArray(value);
            })
    }
    return inherit;
};
export default {
    EVENTS: {
        fnDelete,
        fnEdit,
    },
    onOpen,
    yoInherit,
}