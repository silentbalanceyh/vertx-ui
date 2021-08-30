import Abs from "./abyss";
import Ele from './element';
import E from "./error";
import Dev from './develop';
import T from './unity';
import Cv from './constant';
import Eng from './engine';
import Ajx from './ajax';

import {Progress} from "antd";
import React from "react";
import './xweb.less';

/**
 * ## 「标准」`Ux.xtLazyAjax`
 *
 * 根据 config 中的 ajax 配置，来执行参数解析，主要用于可执行 Ajax的延迟请求控件，如：
 *
 * * ListSelector
 * * AddressSelector
 * * TreeSelector
 *
 * 上述控件都是复杂的自定义控件，必须解析 ajax 配置执行延迟远程调用。
 *
 * ### 1. 配置解析流程
 *
 * config的ajax包含了远程处理的配置信息，分成两种读取数据的模式：
 *
 * 1. Qr模式：启用查询引擎：`ajax.params.criteria`
 * 2. 非Qr模式：直接查询数据：`ajax.magic`
 *
 * ### 2. 执行输入解析
 *
 * 调用`Ux.parseInput`方法解析每个参数的参数来源信息，最终生成不同来源下的数据构造请求参数。
 *
 * @memberOf module:_xweb
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


/**
 * ## 「标准」`Ux.xtChecked`
 *
 * 该函数主要用于`<Select/>`多选和`<Tree/>`的onSelect中，通过配置实现多种模式的选择。
 *
 * * 替换模式：直接使用键值集合替换原始选择。
 * * 合并模式：执行Save操作选择追加和替换两种。
 *
 * @memberOf module:_xweb
 * @param {Set|Array} $keySet 已经选择的主键集合
 * @param {ReactComponent} reference React组件引用
 * @returns {Array} 返回最终选择键值集合
 */
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
 * ## 「标准」`Ux.xtLazyInit`
 *
 * 延迟初始化，统一处理，在 `componentDidMount` 中调用。
 *
 * @memberOf module:_xweb
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
/**
 * ## 「标准」`Ux.xtLazyData`
 *
 * 该方法用于在按钮中执行重新加载和刷新时专用，可手动编程的方式触发Ajax操作。
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用
 * @param {Object} request 请求数据
 * @param {Function} fnCallback Ajax调用的回调函数
 */
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
 * ## 「标准」`Ux.xtLazyUp`
 *
 * 延迟初始化，统一处理，在 `componentDidUpdate` 中调用。
 *
 * @memberOf module:_xweb
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
/**
 * ## 「标准」`Ux.xtRowChange`
 *
 * 构造当前行的`onChange`专用函数，该API应用于column的render注入事件流程，可实现行数据变动操作，支持多字段数据。
 *
 * 1. 先使用二义性`ambEvent`读取数据信息。
 * 2. 再触发上层的`onChange`方法，自定义组件中的上层方法会直接被Ant Design注入。
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件应用
 * @param {String} rowKey 行记录主键
 * @param {String} field 被操作的字段
 * @returns {Function} 返回事件函数
 */
const xtRowChange = (reference, rowKey, field) => (event) => {
    let {value = []} = reference.props;
    if (Abs.isArray(value) && rowKey && field) {
        value = Abs.clone(value);
        const fieldValue = Ele.ambEvent(event);
        value.forEach(each => {
            if (rowKey === each.key) {
                each[field] = fieldValue;
            }
        });
        Abs.fn(reference).onChange(value);
    }
}
/**
 * ## 「标准」`Ux.xtExprFlat`
 *
 * Object转换成Array专用，如传入：
 *
 * ```json
 * {
 *     "field": "expr1",
 *     "field": "expr2"
 * }
 * ```
 *
 * 构造带expression表达式的配置数据信息。
 *
 * @memberOf module:_xweb
 * @param {Object} value 传入Object数据
 * @returns {Array} 执行完成后的数组
 */
const xtExprFlat = (value = {}) => {
    const data = [];
    if (value) {
        Object.keys(value).forEach(item => {
            const valueOrExpr = value[item];
            if (valueOrExpr) {
                const record = {};
                /* 数据信息 */
                record.name = item;
                record.value = valueOrExpr;
                const parsed = Ele.valueParse(valueOrExpr);
                Object.assign(record, parsed);
                data.push(record);
            }
        })
    }
    return data;
}

const _jsxError = (message) => (
    <div className={"ux-error"}>
        {message}
    </div>
);
/**
 * ## 「标准」`Ux.xtRender`
 *
 * 检查系统状态内部是否存在`error`节点，如果存在`error`节点，则直接渲染错误信息，配置出错的统一调用流程。
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用。
 * @param {Function} render 执行 render 的函数。
 * @return {Jsx|boolean} 直接渲染。
 */
const xtRender = (reference, render) => {
    const {error} = reference.state ? reference.state : {};
    if (error) {
        console.error(error);
        if ("string" === typeof error) {
            return _jsxError(error);
        } else {
            let message = ``;
            if (error.code) {
                message = `${error.code} ${error.error}`
            }
            return _jsxError(message);
        }
    } else {
        if (reference.state) {
            return render();
        } else {
            return false;
        }
    }
};


/**
 * ## 「标准」`Ux.xtReady`
 *
 * 由于 Zero 框架无法调用 Extension 中的`yoRender`，所以可直接使用`xtReady` 实现和 `yoRender`中
 * 同样的逻辑
 *
 * 1. 检查配置是否准备完成，如果准备完成：`$ready = true`，否则为false。
 * 2. 准备没有完成时，则不渲染。
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用。
 * @param {Function} render 执行 render 的函数。
 * @param {Object} LOG 日志配置。
 * @return {JSX.Element} 直接渲染。
 */
const xtReady = (reference, render, LOG = {}) => {
    const {$ready = false} = reference.state ? reference.state : {};
    if ($ready) {
        const {color = "#4682B4", name = "", logger = false} = LOG;
        if (logger) {
            const {$visible = false} = reference.state;
            if (LOG.force || ($visible && name)) {
                Dev.dgDebug(reference.state, `[ Xt ] 自定义组件 ${name} 初始化完成时的状态`, color);
            }
        }
        return xtRender(reference, render);
    } else {
        const {component: Component} = LOG;
        if (Component) {
            /* 提供了加载组件 */
            return (<Component/>);
        } else {
            return (<Progress percent={62.8}
                              size={"small"}
                              status={"active"}
                              style={{
                                  width: "60%"
                              }}/>);
        }
    }
};

const isDiff = (left, right) => {
    const leftType = typeof left;
    const rightType = typeof right;
    if (leftType === rightType) {
        // 相同类型才能比较
        if (Abs.isArray(left) || Abs.isObject(left)) {
            return Abs.isDiff(left, right);
        } else {
            return left !== right;
        }
    } else {
        // 类型不同则二者不同
        return true;
    }
};

/**
 * ## 「标准」`Ux.xtReset`
 *
 * 重置专用函数，内部关联 Ant Design 的 Form信息。
 *
 * @memberOf module:_xweb
 * @method xtReset
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} virtualRef 带有state和props的前一次状态信息。
 * @param {Function} callback 回调函数处理。
 */
const xtReset = (reference, virtualRef = {}, callback) => {
    /*
     * 三个值相互比较
     */
    const current = reference.props.value;
    const original = virtualRef.props.value;
    let isTouch;
    const {form} = reference.props;
    if (form) {
        isTouch = form.isFieldsTouched();
    } else {
        isTouch = false;
    }
    if (!isTouch) {
        /*
         * 这是标准自定义控件中会存在的内容
         */
        if (reference.props.hasOwnProperty("data-__meta")) {
            const metadata = reference.props['data-__meta'];
            const initial = metadata.initialValue;
            if (isDiff(current, original) && !isDiff(current, initial)) {
                callback(initial);
            }
        }
    }
};

const _xtRevert = (reference, callback = {}) => {
    /*
     * prevValue（之前的值）
     * curValue（之后的值）
     */
    const ref = Eng.onReference(reference, 1);
    if (ref) {
        /*
         * 传入了 reference 变量
         */
        const {form} = ref.props;
        if (form) {
            const isTouched = form.isFieldsTouched();
            const {value, onChange} = reference.props;
            if (isTouched) {
                console.debug("ANT-FORM, touched = true");
            } else {
                console.debug("ANT-FORM, touched = false");
                /*
                 * 重置
                 */
                if (Abs.isFunction(onChange)) {
                    onChange(value);
                    /*
                     * 外置函数
                     */
                    if (Abs.isFunction(callback.reset)) {
                        callback.reset(value);
                    }
                }
            }
        } else {
            console.debug("NO-FORM");
            /*
             * 非直接自定义控件
             */
        }
    } else {
        /*
         * 没有传入 reference 变量
         */
        console.debug("NO-REF, reference = null");
    }
}
/**
 * ## 「标准」`Ux.xtRevert`
 *
 * 自定义组件的新重置处理，用于设置表单的重置相关信息
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用。
 * @param {Object} virtualRef 带有state和props的前一次状态信息。
 * @param {Function} callback 回调函数处理。
 */
const xtRevert = (reference, virtualRef, callback = {}) => {
    const {readOnly = false} = reference.props;
    if (!readOnly) {
        const prevValue = virtualRef.props.value;
        const curValue = reference.props.value;
        if (Abs.isObject(prevValue) || Abs.isObject(curValue)) {
            /*
             * 数据结构是 Object 或 Array
             */
            if (Abs.isDiff(prevValue, curValue)) {
                _xtRevert(reference, callback);
            }
        } else {
            if (prevValue !== curValue) {
                _xtRevert(reference, callback);
            }
        }
    } else {
        /**
         * ReadOnly 的情况下，不执行任何重置，因为不会被改变
         */
    }
}

/**
 * ## 「标准」`Ux.xtUnsafe`
 *
 * 新版中的`UNSAFE_componentWillReceiveProps(nextProps,context)`的内部调用，虽然不提倡使用，
 * 但在自定义组件中，该函数依然会控制内部状态变更，所以依旧采用该方法。
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用。
 * @param {Props} nextProps 下一个属性。
 */
const xtUnsafe = (reference, nextProps = {}) => {
    if ('value' in nextProps) {
        const value = nextProps.value;
        reference.setState(value);
    }
};

const xtValue = (reference, consumer) => {
    const {config = {}} = reference.props;
    const originalFormat = config.format ? config.format : Cv.XT_FORMAT.OBJECT;
    const state = reference.state ? Abs.clone(reference.state) : {};
    let data = state.data;
    /* 计算简单format */
    let hitFormat;
    if ("string" === typeof originalFormat) {
        hitFormat = originalFormat;
    } else {
        const {type} = originalFormat;
        hitFormat = type ? type : Cv.XT_FORMAT.OBJECT;
    }
    // Dev.dgDebug({format: hitFormat}, "自定义组件选择数据格式")
    if (Cv.XT_FORMAT.OBJECT === hitFormat) {
        if (Abs.isArray(data) || undefined === data) {
            throw new Error("格式和数据异常，状态格式：Array，定义格式：Object。");
        } else {
            return consumer.object(data);
        }
    } else if (Cv.XT_FORMAT.ARRAY === hitFormat) {
        if (Abs.isArray(data) || undefined === data) {
            return consumer.array(data);
        } else {
            throw new Error("格式和数据异常，状态格式：Object，定义格式：Array。");
        }
    } else if (Cv.XT_FORMAT.ARRAY_PURE === hitFormat) {
        return consumer.arrayPure(data);
    } else if (Cv.XT_FORMAT.ARRAY_MAP === hitFormat) {
        /* 两种格式都支持 */
        return consumer.arrayMap(data);
    } else if (Cv.XT_FORMAT.ARRAY_GROUP === hitFormat) {

    }
}
/**
 * ## 「标准」`Ux.xtGet`
 *
 * 广义读取当前组件消费的数据信息，外层表单中会用props.value传入设置的值。
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用。
 * @param {String} field 读取字段的数据（只适用于OBJECT类型）。
 * @return {Object} 返回最终状态信息。
 */
const xtGet = (reference, field = undefined) => {
    return xtValue(reference, {
        object: (data) => {
            if (data) {
                return field ? data[field] : data;
            } else return data;
        },
        array: (data) => field ? data
            .filter(Abs.isObject)
            .map(item => item[field]) : data,
        arrayMap: (data) => field ? data
            .filter(Abs.isObject)
            .map(item => item[field]) : data,
        set: (data) => data ? data : []
    })
};
/**
 * ## 「标准」`Ux.xtSet`
 *
 * （略）
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用。
 * @param {Array} name 读取字段的数据（只适用于OBJECT类型）。
 * @param {any} value 设置的任何值。
 * @return {Object} 返回最终状态信息。
 */
const xtSet = (reference, name, value) => {
    let field;
    let index = -1;
    if ("string" === typeof name) {
        field = name;
    } else if (Abs.isArray(name)) {
        field = name[0];
        index = undefined !== name[1] ? name[1] : -1;
    } else if ("number" === typeof name) {
        index = name;
    }
    return xtValue(reference, {
        object: data => {
            if (data) {
                data[field] = value;
            }
            return data;
        },
        array: data => {
            const ref = data[index] ? data[index] : null;
            if (ref) {
                ref[field] = value;
            }
            return data;
        },
        arrayPure: data => {
            data[index] = value;
            return data;
        },
        arrayMap: (data) => {
            data = Abs.clone(data);
            const objRef = data[index];
            if (objRef) {
                objRef[field] = value;
            }
            return data;
        }
    })
};


/**
 * ## 「标准」`Ux.xtInitObject`
 *
 * * 如果属性 props 中存在 `value` 变量，则返回该值。
 * * 如果属性 props 中不存在 `value` 变量，则返回 `{}`。
 *
 * @memberOf module:_xweb
 * @param {Props} props React属性信息。
 * @return {Object} 返回初始值。
 */
const xtInitObject = (props = {}) => {
    const values = {};
    const value = props.value;
    if (value) {
        values.data = value;
    } else {
        // 默认对象
        values.data = {};
    }
    return values;
};


/**
 *
 * ## 「标准」`Ux.xtInitArray`
 *
 * * 如果属性 props 中存在 `value` 变量
 *      * value本身是一个 Array，直接使用该 Array 初始化（步骤2）。
 *      * value本身是一个 Object，则使用 `value.data` 执行初始化（步骤2）。
 * * 如果属性 props 中不存在 `value` 变量。
 *      * 如果允许空数组，则使用`{data:[]}`。
 *      * 如果不允许空数组，则使用`{data:[{key:"uuid"}]}`。
 *
 * 返回结构：
 *
 * ```json
 * {
 *     "empty模式": {
 *         data: []
 *     },
 *     "非empty模式": {
 *         data: [
 *             {
 *                 key: "ef78bf10-4db7-49d1-910d-96bc7eaad3c3"
 *             }
 *         ]
 *     }
 * }
 * ```
 *
 * @memberOf module:_xweb
 * @param {Props} props React属性信息。
 * @param {boolean} empty 是否使用空数组作为初始值。
 * @return {Array}
 */
const xtInitArray = (props = {}, empty = false) => {
    const values = {};
    // 初始化处理
    const value = props.value;
    if (value) {
        // 如果是 String，是否可以直接转换
        let literial = value;
        if ("string" === typeof value) {
            try {
                literial = JSON.parse(value);
            } catch (e) {
            }
        } else if (Abs.isArray(value)) {
            if (0 < value.length) {
                literial = value;
            } else {
                literial = [];
            }
        } else if (value.data && Abs.isArray(value.data)) {
            if (0 < value.data.length) {
                literial = value.data;
            } else {
                literial = [];
            }
        }
        // Empty 处理
        if (0 === literial.length) {
            if (empty) {
                literial = [];
            } else {
                literial = [{key: T.randomUUID()}];
            }
        }

        if (Abs.isArray(literial)) {
            values.data = literial;
        }
    } else {
        values.data = ((empty) ? [] : [{key: T.randomUUID()}]);
    }
    return values;
};


/**
 * ## 「标准」`Ux.xtInitArrayMap`
 *
 * （略），直接将Array类型转换成Map类型（Object），字段值为Object的键值。
 *
 * @memberOf module:_xweb
 * @param {Props} props React属性信息。
 * @param {boolean} empty 是否使用空数组作为初始值。
 * @return {Object}
 */
const xtInitArrayMap = (props = {}, empty = false) => {
    const values = {};
    // 初始化处理
    const value = props.value;
    if (value) {
        // 构造存在的数组信息
        const normalized = [];
        const {config = {}} = props;
        const {format = {}} = config;
        const {keyField} = format;
        Object.keys(value).forEach(key => {
            const item = Abs.clone(value[key]);
            if (keyField) {
                item[keyField] = key;
            }
            item.key = T.randomUUID();
            item._key = key;
            normalized.push(item);
        });
        values.data = normalized;
        return values;
    } else return xtInitArray(props, empty);
}


/**
 *
 * ## 「标准」`Ux.xtInitFormat`
 *
 * 双格式处理
 *
 * ```json
 * {
 *     "Array直接格式":[],
 *     "Json格式":{}
 * }
 * ```
 *
 * @memberOf module:_xweb
 * @param {Props} props React属性信息
 * @return {{}}
 */
const xtInitFormat = (props = {}) => {
    return xtValue({props}, {
        object: () => xtInitObject(props),
        array: () => xtInitArray(props),
        arrayPure: () => [],
        arrayMap: () => xtInitArrayMap(props),
        arrayGroup: () => ({})
    });
}

/**
 * ## 「标准」`Ux.xtFormat`
 *
 * TableEditor等专用格式方法，可支持多种不同格式。
 *
 * @memberOf module:_xweb
 * @param {Array} internal 二维数据
 * @param {Object} format 格式配置数据
 * @returns {any} 返回初始化后的数据
 */
const xtFormat = (internal = [], format) => {
    /* 如果 format 不存在则直接返回 */
    const normalized = Abs.clone(internal);
    if (format) {
        const formatted = {};
        if ("string" === typeof format) {
            formatted.type = format;
        } else {
            Object.assign(formatted, format);
        }
        /* format 格式化过后 */
        if (Cv.XT_FORMAT.OBJECT === formatted.type
            || Cv.XT_FORMAT.ARRAY_PURE === formatted.type) {
            return normalized;
        } else if (Cv.XT_FORMAT.ARRAY === formatted.type) {
            if ("key" !== formatted.keyField) {
                normalized.forEach(item => {
                    item.key = item[formatted.keyField];
                });
            }
            return normalized;
        } else if (Cv.XT_FORMAT.ARRAY_MAP === formatted.type) {
            const grouped = formatted.keyField ? formatted.keyField : "key";
            const result = {};
            normalized.forEach(item => {
                const key = item[grouped];
                if (key) {
                    const $item = Abs.clone(item);
                    if ("key" !== grouped) {
                        delete $item.key;
                    }
                    delete $item[grouped];
                    result[key] = $item;
                }
            });
            return result;
        }
    } else return normalized;
}
/**
 * 「标准」`Ux.xtRowAdd`
 *
 * 表格中的添加行函数（二维表结构）
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用
 * @param {Object} record 记录专用数据
 * @param {Number} index 记录索引
 * @returns {Function} 行添加事件函数
 */
const xtRowAdd = (reference, record, index) => (event) => {
    Abs.prevent(event);
    const data = xtGet(reference);
    if (Abs.isArray(data)) {
        /* 在当前索引之下插入 */
        data.splice(index + 1, 0, {key: T.randomUUID()});
        reference.setState({data});
    }
}
/**
 *
 * 「标准」`Ux.xtRowDel`
 *
 * 表格中的删除行函数（二维表结构）
 *
 * @memberOf module:_xweb
 * @param {ReactComponent} reference React组件引用
 * @param {Object} record 记录专用数据
 * @param {Number} index 记录索引
 * @returns {Function} 行删除事件函数
 */
const xtRowDel = (reference, record, index) => (event) => {
    Abs.prevent(event);
    let data = xtGet(reference);
    if (Abs.isArray(data)) {
        /* 直接移除当前索引位置的数据 */
        let merged = [];
        if (1 === data.length) {
            const item = {};
            item.key = data[0].key;
            if (!item.key) {
                item.key = T.randomUUID();
            }
            merged = [item];
        } else {
            data = data.filter((item, itemIdx) => !(record.key === item.key && itemIdx === index));
            merged = data;
        }
        reference.setState({data: merged});
        return Abs.promise(merged);
    } else {
        return Abs.promise(null);
    }
}
const xtTransfer = (reference, callback) => (targetKeys, direction, moveKeys = []) => {
    const {$selectedKeys = []} = reference.state;
    let $selected = [];
    if ("right" === direction) {
        // 往右，直接追加，注意顺序
        $selected = Abs.clone($selectedKeys);
        moveKeys.forEach(moveKey => $selected.push(moveKey));
    } else {
        // 往左
        $selectedKeys.forEach(each => {
            if (!moveKeys.includes(each)) {
                $selected.push(each);
            }
        })
    }
    if (Abs.isFunction(callback)) {
        callback($selected);
    }
}
export default {
    /* Ajax 部分 */
    xtLazyInit,
    xtLazyUp,
    xtLazyAjax,

    xtLazyData,

    xtTransfer,         // Transfer自定义组件专用
    xtChecked,          // 多选专用

    // 同一个界面几次挂载
    xtUnsafe,
    xtGet,
    xtSet,
    xtFormat,

    xtInitObject,
    xtInitArray,
    xtInitArrayMap,
    xtInitFormat,

    /* render 处理 */
    xtRender,
    xtReady,
    xtReset,
    xtRevert,

    xtExprFlat,

    /* 表格 */
    xtRowChange,
    xtRowAdd,
    xtRowDel
}