import Ux from 'ux';
import Event from './Op.Event';
import yiForm from './Op.Form';

const yiEdition = (reference, config = {}) => {
    const {
        table = {}, dialog = "", op,
        /*
         * 提交过后是否关闭窗口
         * = false: 如果 false 则继续添加，只重置
         * = true：如果 true 则添加完后关闭窗口
         */
    } = config;
    const state = {};
    const {$rows = {}} = reference.props;
    /*
     * EVENTS中的默认函数
     * fnEdit
     * fnDelete
     * 上层传入 $rows 对象，同样包含了其他函数
     */
    const events = Ux.clone(Event.EVENTS);
    Object.assign(events, $rows);
    const executors = Ux.configExecutor(reference, events);
    /*
     * 窗口
     */
    state.$dialog = Ux.configDialog(reference, dialog);
    /*
     * 提取当前 Dialog 需要使用的 Form
     */
    const ref = Ux.onReference(reference, 1);
    /*
     * executors 格式化，DialogEditor 专用
     */
    const normalized = {};
    Object.keys(executors).forEach(key => {
        if (Ux.isFunction(executors[key])) {
            const normalizeFn = executors[key](reference);
            if (Ux.isFunction(normalizeFn)) {
                normalized[key] = normalizeFn;
            }
        }
    });
    const tableRef = Ux.configTable(ref, table, normalized);
    state.$table = tableRef;
    if (tableRef.rowKey) {
        /*
         * 方便后期编辑、添加、删除
         */
        state.$keyField = tableRef.rowKey;
    }
    /*
     * 按钮处理
     */
    state.$button = Ux.configAnchor(reference, op, {
        /*
         * 添加的回调函数，主要用于生成状态
         */
        add: Event.onOpen(reference)
    });
    /*
     * initialValue
     */
    const {value = []} = reference.props;
    const $data = yoValue(value, tableRef);
    state.initialValue = $data;
    state.data = $data;

    yiForm(reference, config, state)
        .then(Ux.ready).then(Ux.pipe(reference));
};

const yoValue = (value = [], tableRef = {}) => {
    let normalized = [];
    if (Ux.isArray(value)) {
        normalized = Ux.clone(value);
    } else {
        try {
            normalized = JSON.parse(value);
        } catch (error) {
        }
    }
    if (Ux.isArray(normalized)) {
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

const yiView = (reference, config) => {
    const {
        table = {},
        /*
         * 提交过后是否关闭窗口
         * = false: 如果 false 则继续添加，只重置
         * = true：如果 true 则添加完后关闭窗口
         */
    } = config;
    const state = {};
    /*
     * 提取当前 Dialog 需要使用的 Form
     */
    const ref = Ux.onReference(reference, 1);
    /*
     * executors 格式化，DialogEditor 专用
     */
    const $table = Ux.clone(table);
    $table.columns = table.columns.filter(item => "EXECUTOR" !== item['$render']);
    state.$table = Ux.configTable(ref, $table, {});
    state.$ready = true;
    reference.setState(state);
};

const yiPage = (reference) => {
    const {config = {}, readOnly = false} = reference.props;
    /*
     * 表格
     */
    if (readOnly) {
        yiView(reference, config);
    } else {
        yiEdition(reference, config);
    }
};
const yuPage = (reference, virtualRef) => {
    const {readOnly = false} = reference.props;
    if (!readOnly) {
        const prevValue = virtualRef.props.value;
        const curValue = reference.props.value;
        /*
         * 发生改变的时候操作
         */
        if (prevValue !== curValue) {
            /*
             * Form 处理
             */
            const ref = Ux.onReference(reference, 1);
            const {form} = ref.props;
            /*
             * 是否操作过（未操作就是重置状态）
             */
            const isTouched = form.isFieldsTouched();
            if (isTouched) {

            } else {
                /*
                 * 重置表单
                 */
                const {initialValue = []} = reference.state;
                const {onChange, id} = reference.props;
                if (Ux.isFunction(onChange)) {
                    /*
                     * 初始化表单
                     */
                    reference.setState({data: initialValue});
                    if (0 < initialValue.length) {
                        /*
                         * 编辑重置
                         */
                        const state = {};
                        state[id] = initialValue;
                        Ux.formHits(ref, state);
                    } else {
                        /*
                         * 添加重置
                         */
                        Ux.formReset(ref, [id])
                    }
                }
            }
        }
    }
};
export default {
    yoValue,
    yiPage,
    yuPage,
}