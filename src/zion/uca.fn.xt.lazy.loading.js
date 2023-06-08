import __Zn from './zero.module.dependency';
import __ON from './lkway.fn.on.web.prop';
import __QR_PARSER from './query.fn.qr.syntax.parser';
import __Zi from './uca.fn.xt.inited.values';

const __xtLazyState = (reference, state = {}, configuration) => {
    const ref = __Zn.onReference(reference, 1);
    if (ref) {
        // T.toAssist(ref, state);
        __Zn.yoAide(ref, state);
    }
    let initState = {};
    if (configuration && configuration.state) {
        initState = __Zn.clone(configuration.state);
    }
    Object.assign(state, initState);
    if (__Zn.isNotEmpty(state)) {
        __Zn.of(reference).in(state).done();
        // reference.?etState(state);
    }
}

const __xtLazyConfiguration = (reference, configuration) => {
    let config = {};
    if (configuration) {
        if (configuration.config) {
            config = __Zn.clone(configuration.config);
        } else {
            throw new Error("编程模式配置丢失！")
        }
    } else {
        config = reference.props.config;
    }
    return config;
}

const xtLazyAjax = (reference, config = {}) => {
    /**
     * 读取上层引用，这里是ListSelector中对应的Form本身
     * 所以上层引用才会是reference，即调用了当前方法的组件本身必须包含 reference 引用
     *
     * 1）Form模式下，reference 引用的 props 中包含 form 变量。
     * 2）自由模式下，reference 引用中会包含类似 Assist 的数据完成参数整体解析。
     */
    const ref = __Zn.onReference(reference, 1);
    __Zn.fxTerminal(!ref, 10079, ref);                                             // Error 中断打印


    /*
     * 配置中必须包含 ajax 配置参数，如果没有配置参数则直接报错
     * {
     *      "config": {
     *          "ajax": {
     *              "uri": ...,
     *              "method": ...,
     *              "params":{
     *                  "criteria"
     *              },
     *              "magic":{
     *              }
     *          }
     *      }
     * }
     */
    __Zn.fxTerminal(!config.ajax, 10053, config);                                  // Error 中断打印
    config = __Zn.clone(config);     // 拷贝防止变更，防止页码记忆
    if (config.ajax && ref) {
        const ajaxRef = config.ajax;
        if (__Zn.isQr(config)) {
            if (!ajaxRef.params) ajaxRef.params = {};


            /*
             * 查询引擎模式
             * {
             *      "params":{
             *          "criteria": {}
             *      }
             * }
             * 合并参数时候，查询引擎参数需拷贝 sorter / pager
             * 1. sorter：排序参数
             * 2. pager：分页参数
             * 3. criteria：查询引擎专用参数
             */
            const request = {};
            Object.assign(request, ajaxRef.params);
            request.criteria = __Zn.parseInput(ajaxRef.params.criteria, ref);
            return request;
        } else {


            /*
             * 非查询引擎模式
             * {
             *      "magic": {}
             * }
             */
            return __Zn.parseInput(ajaxRef.magic, ref);
        }
    }
};

const xtLazyInit = (reference, configuration) => {
    const {
        id,                 // 当前字段名称
        value               // Ant Form对应的当前数据
    } = reference.props;
    // 配置节点（双源头传入）
    const config = __xtLazyConfiguration(reference, configuration);

    const ref = __Zn.onReference(reference, 1);
    const {linker = {}, intern = false} = config;
    if (intern) {
        __xtLazyState(reference, {}, configuration)
        return;
    }
    // ----------------------- 检查 -------------------------
    /* 值检查流程，是否触发核心流程 */
    const {$inited = {}} = ref.props;
    const values = __ON.onLinker(config, () => __Zi.xtInited(ref, $inited));
    if (__Zn.isEmpty(values) ||                              // 1. values = {} 则直接中断，无法执行初始化加载流程
        (undefined !== value && values[linker.key])) {       // 2. value有值并且主键也有值
        __xtLazyState(reference, {}, configuration)
        return;
    }
    // ----------------------- 主流程 -------------------------
    /*
     * 包含值，执行 loading 操作，参数构造
     **/
    const params = xtLazyAjax(reference, config);

    let request;
    if (__Zn.isQr(config)) {
        // 查询引擎参数，Qr 必须是 POST 方法
        const condition = __Zn.clone(values);
        condition[""] = true;                           // AND 连接符
        request = __QR_PARSER.qrCombine(params, ref, condition);
        __Zn.dgDebug(request, "[ Xt ] engine = true 的最终查询条件", "#8B3A62");
    } else {
        // 非查询引擎 Qr 参数
        request = __Zn.clone(values);
        Object.assign(request, params);
        __Zn.dgDebug(request, "[ Xt ] engine = false 的最终查询条件", "#8B3A62");
    }

    __Zn.asyncData(config.ajax, request, response => {
        // 根据响应数据构造最终执行
        const source = __Zn.valueArray(response);
        if (0 === source.length) {
            // 0 初始化
            const $keySet = __Zn.formGet(ref);
            if (__Zn.isEmpty($keySet) || !!$keySet) {
                __xtLazyState(reference, {}, configuration)
                return;                                 // 直接中断
            }
            const initialValue = {};
            Object.keys(linker)
                .map(from => linker[from])
                .filter($keySet.hasOwnProperty)
                .forEach(to => initialValue[to] = $keySet[to]);
            const state = {initialValue, $keySet}
            __Zn.dgDebug(state, "[ xtLazyUnique ] 0 初始化", "#B8860B");
            __xtLazyState(reference, state, configuration);
        } else if (1 === source.length) {
            // 1 初始化
            const $keySet = source[0] ? source[0] : {};
            const initialValue = {};
            __Zn.writeLinker(initialValue, config, () => $keySet);
            if (initialValue.hasOwnProperty(id)) {
                const state = {initialValue, $keySet}
                __Zn.dgDebug(state, "[ xtLazyUnique ] 1 初始化", "#B8860B");
                __xtLazyState(reference, state, configuration);
                __Zn.formHits(ref, initialValue);
                // FormUp: 触发 linker / depend.impact 需刷新界面
                __Zn.of(ref).up().done();
            } else {
                __Zn.dgDebug($keySet, `${id} 字段并没配置在 linker 中，请检查：`, "#B8860B");
            }
        } else {
            // N 初始化
            const $keySet = __Zn.formGet(ref);
            if (__Zn.isEmpty($keySet) || !$keySet) {
                __xtLazyState(reference, {}, configuration)
                return;                                 // 直接中断
            }


            /*
             * 构造 filters 做反向查找
             */
            const filterValues = {};
            Object.keys(linker).forEach(fieldFrom => {
                const fieldTo = linker[fieldFrom]
                const fieldV = $keySet[fieldTo];
                if (undefined !== fieldV) {
                    filterValues[fieldFrom] = fieldV;
                }
            })
            const found = __Zn.elementFind(source, filterValues, true);
            if (0 === found.length) {
                __xtLazyState(reference, {}, configuration)
                return;                                 // 直接中断
            }


            const sourceValues = found[0] ? found[0] : {};
            const initialValue = {};
            __Zn.writeLinker(initialValue, config, () => sourceValues);
            /*
             * 谁有值修改谁
             * initialValue -> $keySet
             * $keySet -> initialValue
             */
            Object.keys($keySet)
                .filter(field => initialValue.hasOwnProperty(field))
                .filter(field => $keySet.hasOwnProperty(field))
                .forEach(field => {
                    const iValue = initialValue[field];
                    const fValue = $keySet[field];
                    if (iValue && !fValue) {
                        $keySet[field] = iValue;
                    }
                    if (fValue && !iValue) {
                        initialValue[field] = fValue;
                    }
                });


            if (initialValue.hasOwnProperty(id)) {
                const state = {initialValue, $keySet};
                __Zn.dgDebug(state, "[ xtLazyUnique ] N 初始化", "#B8860B");
                __xtLazyState(reference, state, configuration);
                __Zn.formHits(ref, initialValue);
            } else {
                __Zn.dgDebug($keySet, `（多）${id} 字段并没配置在 linker 中，请检查：`, "#B8860B");
            }
        }
    })
};


const xtLazyUp = (reference, virtualRef, configuration) => {
    const prevValue = virtualRef.props.value;
    const curValue = reference.props.value;
    const {initialValue = {}} = reference.state;
    const {
        id,                 // 当前字段名称
    } = reference.props;
    // 配置节点（双源头传入）
    const config = __xtLazyConfiguration(reference, configuration);

    const {intern = false} = config;
    if (intern) {
        return;
    }

    const ref = __Zn.onReference(reference, 1);
    const form = __Zn.v4FormRef(ref); // ref.props;
    if (form) {
        const isTouched = form.isFieldsTouched();
        const valueInit = initialValue[id];

        /*
         * 「清空操作」
         * 1. 打开表单后直接清空当前表单，isTouched = true
         * 2. 当前值为 undefined，且新旧值不相等
         */
        if (isTouched) {
            // isTouched = true
            if (undefined === curValue && curValue !== prevValue) {
                const formValues = {};
                __Zn.writeLinker(formValues, config, () => ({}));
                __Zn.dgDebug(formValues, `[ xtLazyUp ] isTouched = ${isTouched}, 点击清空（${id}）`, "#B8860B");
                __Zn.formHits(ref, formValues);
                __Zn.fn(reference).onChange(curValue);  // 维持 isTouched
            }
        } else {
            // isTouched = false，表示表单中没有任何值的更改
            if (curValue !== prevValue) {
                const fields = Object.keys(initialValue);
                const formValues = __Zn.formGet(ref, fields);
                if (__Zn.isDiff(formValues, initialValue)) {
                    __Zn.dgDebug(initialValue, `[ xtLazyUp ] isTouched = false, 编辑/添加重置（${id}）`, "#B8860B");
                    __Zn.formHits(ref, initialValue);
                }
                return;
            }

            if (undefined !== valueInit && undefined === curValue) {
                // 反向重置
                __Zn.dgDebug(initialValue, `[ xtLazyUp ] isTouched = false, 编辑/添加反向重置（${id}）`, "#B8860B");
                __Zn.formHits(ref, initialValue);
            }
        }
    }
};

export default {
    xtLazyUp,
    xtLazyInit,
    xtLazyAjax,
}