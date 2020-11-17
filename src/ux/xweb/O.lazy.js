import Eng from '../engine';
import Abs from '../abyss';
import E from "../error";
import Ele from '../element';
import T from '../unity';
import Dev from '../develop';
import Ajx from '../ajax';
import Cv from '../constant';

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
    E.fxTerminal(!config.ajax, 10053, config);              // Error 中断打印
    config = Abs.clone(config);     // 拷贝防止变更，防止页码记忆
    if (config.ajax) {
        /**
         * 读取上层引用，这里是ListSelector中对应的Form本身
         * 所以上层引用才会是reference，即调用了当前方法的组件本身必须包含 reference 引用
         *
         * 1）Form模式下，reference 引用的 props 中包含 form 变量。
         * 2）自由模式下，reference 引用中会包含类似 Assist 的数据完成参数整体解析。
         */
        const ref = Eng.onReference(reference, 1);
        E.fxTerminal(!ref, 10079, ref);                     // Error 中断打印

        if (ref) {
            const ajaxRef = config.ajax;
            if (Abs.isQr(config)) {
                /*
                 * 查询引擎模式
                 * {
                 *      "criteria": {}
                 * }
                 */
                const request = {};
                if (!ajaxRef.params) ajaxRef.params = {};
                /*
                 * 拷贝 sorter / pager
                 */
                Object.assign(request, ajaxRef.params);
                request.criteria = Eng.parseInput(ajaxRef.params.criteria, ref);
                return request;
            } else {
                /*
                 * 非查询引擎模式
                 * {
                 *      "magic": {}
                 * }
                 */
                return Eng.parseInput(ajaxRef.magic, ref);
            }
        }
    }
};

const xtChecked = ($keySet, reference) => {

    /* 多选最终结果 */
    const {config = {}} = reference.props;
    const selectedKeys = Ele.toArray($keySet);

    /* 抽取配置信息 */
    const {selection = {}} = config;
    const {replace = true, field = "key"} = selection.multipleMode ? selection.multipleMode : {};

    /* 计算选中项 */
    let $selectedKeys = [];
    if (replace) {

        // 替换模式，直接替换选择的 key 值
        $selectedKeys = selectedKeys;
    } else {

        // 合并模式，合并模式时，要根据 field 配置执行选择
        const {value = []} = reference.props;
        const dataArray = Abs.clone(value);
        $keySet.forEach(element => Ele.elementSave(dataArray, element, field));
        $selectedKeys = dataArray;
    }
    return $selectedKeys;
}

const xtValues = (reference, config = {}) => {
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
/*
 * 触发初始化流程的判断，该初始化流程在执行过程中进行判断，执行初始化时的操作
 * 1）根据数据还原 linker 内容（查询唯一记录）
 * 2）将还原过后的数据记录填充到表单中
 */
const isTrigger = (reference, config = {}) => {
    const {value} = reference.props;
    if (undefined === value) {
        /*
         * 无值信息，直接触发，这种情况通常用于当前字段不存在于表单中
         * 而是反向引用字段，多读取一次
         */
        return true;
    } else {
        /*
         * 有值则直接检查是否完整
         */
        const values = xtValues(reference, config);
        /*
         * 专用于检查 key 是否存在
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
    const {config = {}} = reference.props;
    if (isTrigger(reference, config)) {
        const values = xtValues(reference, config);
        if (Abs.isNotEmpty(values)) {
            Dev.dgDebug(values, "[ Xt ] 初始化时的 linker 值", "#8B3A62");

            /* 有值，执行 loading 操作 */
            const ref = Eng.onReference(reference, 1);
            const initParams = xtLazyAjax(ref, config);

            /*
             * engine模式和非engine模式的自动判断
             */
            let request;
            if (Abs.isQr(config)) {
                const inputCond = Abs.clone(values);
                inputCond[""] = true;
                request = Eng.qrCombine(initParams, ref, inputCond);
                Dev.dgDebug(request, "[ Xt ] engine = true 的最终查询条件", "#8B3A62");
            } else {
                request = Abs.clone(values);
                request[""] = true;
                request["$I"] = initParams;
                Dev.dgDebug(request, "[ Xt ] engine = false 的最终查询条件", "#8B3A62");
            }
            xtLazyData(reference, request, source => xtLazyUnique(reference, source))
        }
    }
};
const xtLazyData = (reference, request = {}, fnCallback) => {
    if (Abs.isFunction(fnCallback)) {
        const {config = {}} = reference.props;
        Ajx.asyncData(config.ajax, request, response => {
            let dataArray = [];
            if (response.list) {
                dataArray = Abs.isArray(response.list) ? response.list : [];
            } else {
                dataArray = Abs.isArray(response) ? response : [];
            }
            fnCallback(dataArray);
        })
    }
}
const xtLazyUnique = (reference, source = []) => {
    const {config = {}, id} = reference.props;
    const ref = Eng.onReference(reference, 1);
    if (0 === source.length) {
        const $keySet = T.formGet(ref);
        const {linker = {}} = config;
        if (Abs.isNotEmpty($keySet)) {
            const initialValue = {};
            Object.keys(linker).map(fromField => linker[fromField])
                .filter(toField => $keySet.hasOwnProperty(toField))
                .forEach(toField => initialValue[toField] = $keySet[toField])
            reference.setState({initialValue, $keySet});
        }
    } else if (1 === source.length) {
        const $keySet = source[0] ? source[0] : {};
        const initialValue = {};
        T.writeLinker(initialValue, config, () => $keySet);
        if (initialValue.hasOwnProperty(id)) {
            reference.setState({initialValue, $keySet});
            T.formHits(ref, initialValue);
        } else {
            console.warn(`${id} 字段并没配置在 linker 中，请检查：`, $keySet);
        }
    }
}
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
    const ref = Eng.onReference(reference, 1);
    const {form} = ref.props;
    // 表单判断专用
    const {id} = reference.props;
    if (form) {
        const isTouched = form.isFieldsTouched();
        if (prevValue !== curValue) {
            const {value, config = {}} = reference.props;
            if (isTouched) {
                // 非重置
                if (value) {

                } else {
                    // 添加：重置
                    const formValues = {};
                    T.writeLinker(formValues, config, () => ({}));
                    if (Abs.isNotEmpty(formValues)) {
                        T.formHits(ref, formValues);

                        Abs.fn(reference).onChange(formValues[id]);
                    }
                }
            } else {
                // 重置
                const {initialValue = {}} = reference.state;
                if (Abs.isEmpty(initialValue)) {
                    // 添加：重置
                    const formValues = {};
                    T.writeLinker(formValues, config, () => ({}));
                    if (Abs.isNotEmpty(formValues)) {
                        T.formHits(ref, formValues);

                        Abs.fn(reference).onChange(formValues[id]);
                    }
                } else {
                    // 编辑：重置
                    const fields = Object.keys(initialValue);
                    const current = T.formGet(ref, fields);
                    if (Abs.isDiff(current, initialValue)) {

                        T.formHits(ref, initialValue);

                        Abs.fn(reference).onChange(initialValue[id]);
                    }
                }
            }
        } else {
            const {$mode} = ref.props;
            if (Cv.FORM_MODE.EDIT === $mode && undefined === curValue && !isTouched) {
                const {initialValue} = reference.state;
                if (initialValue) {

                    T.formHits(ref, initialValue);

                    Abs.fn(reference).onChange(initialValue[id]);
                }
            }
        }
    }
};
export default {
    xtLazyInit,
    xtLazyUp,
    xtLazyAjax,

    xtLazyData,

    xtChecked,          // 多选专用
}