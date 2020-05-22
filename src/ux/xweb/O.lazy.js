import Eng from '../engine';
import T from '../unity';
import Abs from '../abyss';
import Ajx from '../ajax';
import Ele from '../element';
import Dev from '../develop';
import E from "../error";


/**
 * ## 标准函数
 *
 * 根据 config 中的 ajax 配置，来执行参数解析，主要用于可执行 Ajax的延迟请求控件，如：
 *
 * * ListSelector
 * * AddressSelector
 * * TreeSelector
 *
 * 上述控件都是复杂的自定义控件，必须解析 ajax 配置执行延迟远程调用。
 *
 * @memberOf module:_xt
 * @method xtLazyAjax
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} config Ajax配置专用配置信息。
 * @return {Object} 返回参数信息。
 */
const xtLazyAjax = (reference, config = {}) => {
    // 必须保证ajax参数信息
    E.fxTerminal(!config.ajax, 10053, config);
    config = Abs.clone(config);     // 拷贝防止变更，防止页码记忆
    if (config.ajax) {
        /**
         * 读取上层引用，这里是ListSelector中对应的Form本身
         * 所以上层引用才会是reference
         */
        const ref = Eng.onReference(reference, 1);
        E.fxTerminal(!ref, 10079, ref);
        if (ref) {
            const ajaxRef = config.ajax;
            if (Abs.isQr(config)) {
                const request = {};
                if (!ajaxRef.params) ajaxRef.params = {};
                /*
                 * 拷贝 sorter / pager
                 */
                Object.assign(request, ajaxRef.params);
                request.criteria = Eng.parseInput(ajaxRef.params.criteria, ref);
                return request;
            } else {
                return Eng.parseInput(ajaxRef.magic, ref);
            }
        }
    }
};
const xtValues = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 提取 Form 中需要提取的字段
     */
    const ref = Eng.onReference(reference, 1);
    if (ref) {
        return Eng.onLinker(config, (fields) => T.formGet(ref, fields));
    } else {
        return {};
    }
};

const xtTrigger = (reference) => {
    const {value} = reference.props;
    if (undefined === value) {
        /*
         * 无值直接触发
         */
        return true;
    } else {
        /*
         * 有值检查是否完整
         */
        const values = xtValues(reference);
        const {config = {}} = reference.props;
        /*
         * 针对 key 的专用检查
         */
        const {linker = {}} = config;
        const sureField = linker.key;
        return !values[sureField];
    }
};
/**
 * ## 标准函数
 *
 * 延迟初始化，统一处理，在 `componentDidMount` 中调用。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 */
const xtLazyInit = (reference) => {
    const {config = {}, id} = reference.props;
    const isTrigger = xtTrigger(reference);
    if (isTrigger) {
        const values = xtValues(reference);
        if (!Abs.isEmpty(values)) {
            Dev.dgDebug(values, "[ Xt ] 初始化时的 linker 值", "#8B3A62");
            const ref = Eng.onReference(reference, 1);
            /*
             * 有值，执行 loading 操作
             */
            const params = xtLazyAjax(reference, config);
            /*
             * 回调处理
             */
            const fnCallback = (unique = {}) => {
                const formValues = {};
                T.writeLinker(formValues, config, () => unique);
                if (formValues.hasOwnProperty(id)) {
                    reference.setState({initialValue: formValues});
                    T.formHits(ref, formValues);
                } else {
                    console.warn(`${id} 字段并没配置在 linker 中，请检查：`, unique);
                }
            };
            const fnFix = () => {
                const {form} = ref.props;
                if (form) {
                    const values = form.getFieldsValue();
                    const {linker = {}} = config;
                    const formValues = {};
                    Object.keys(linker)
                        .map(fromField => linker[fromField])
                        .forEach(toField => {
                            if (values.hasOwnProperty(toField)) {
                                formValues[toField] = values[toField];
                            }
                        });
                    reference.setState({initialValue: formValues});
                }
            }
            /*
             * engine模式和非engine模式的自动判断
             */
            const isQr = Abs.isQr(config);
            if (isQr) {
                /*
                 * 查询引擎接口
                 */
                const inputCond = Abs.clone(values);
                inputCond[""] = true;
                const request = Eng.qrCombine(params, ref, inputCond);
                Dev.dgDebug(request, "[ Xt ] engine = true 的最终查询条件", "#8B3A62");
                Ajx.asyncData(config.ajax, request, (data) => {
                    const unique = Abs.isArray(data.list) ? data.list : [];
                    if (1 === unique.length) {
                        fnCallback(unique[0]);
                    } else if (0 === unique.length) {
                        // 特殊情况
                        fnFix();
                    }
                });
            } else {
                /*
                 * 非查询引擎接口
                 */
                Dev.dgDebug(params, "[ Xt ] engine = false 的最终查询条件", "#8B3A62");
                Ajx.asyncData(config.ajax, params, (sourceArray) => {
                    const unique = Ele.elementFind(sourceArray, values);
                    if (1 === unique.length) {
                        fnCallback(unique[0]);
                    } else if (0 === unique.length) {
                        // 特殊情况
                        fnFix();
                    }
                });
            }
        }
    }
};

/**
 * ## 标准函数
 *
 * 延迟初始化，统一处理，在 `componentDidUpdate` 中调用。
 *
 * @memberOf module:_xt
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} virtualRef 包含了`props`和`state`的前一个状态的引用。
 */
const xtLazyUp = (reference, virtualRef) => {
    const prevValue = virtualRef.props.value;
    const curValue = reference.props.value;
    /*
     * 发生改变的时候操作
     */
    if (prevValue !== curValue) {
        /*
         * 表单专用判断
         */
        const ref = Eng.onReference(reference, 1);
        const {form} = ref.props;
        const {value, config = {}} = reference.props;
        /*
         * 是否操作过（未操作就是重置状态）
         */
        const isTouched = form.isFieldsTouched();
        if (isTouched) {
            /*
             * 非重置
             */
            if (value) {
            } else {
                /*
                 * 添加：重置
                 */
                const formValues = {};
                T.writeLinker(formValues, config, () => ({}));
                if (!Abs.isEmpty(formValues)) {
                    T.formHits(ref, formValues);
                }
            }
        } else {
            /*
             * 重置表单
             */
            const {initialValue = {}} = reference.state;
            if (Abs.isEmpty(initialValue)) {
                /*
                 * 添加：重置
                 */
                const formValues = {};
                T.writeLinker(formValues, config, () => ({}));
                if (!Abs.isEmpty(formValues)) {
                    T.formHits(ref, formValues);
                }
            } else {
                /*
                 * 编辑：重置
                 */
                const fields = Object.keys(initialValue);
                const current = T.formGet(ref, fields);
                if (Abs.isDiff(current, initialValue)) {
                    T.formHits(ref, initialValue);
                }
            }
        }
    }
};
export default {
    xtLazyInit,
    xtLazyUp,
    xtLazyAjax,
}