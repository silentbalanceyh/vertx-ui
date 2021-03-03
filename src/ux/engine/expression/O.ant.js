import Datum from './I.ant.datum';
import Pure from './I.ant.pure';
import Complex from './I.ant.complex';
import Ele from "../../element";
import Ut from "../../unity";
import Abs from "../../abyss";
import Dev from "../../develop";
import Expr from "./O.ai";
// I.unique.js
/*
 * 统一处理
 * 1. config.datum = ... （表单解析动态汇合）
 * 2. config.items = ... （表单解析静态汇合）
 * 3. config.$datum = ...（列解析动态汇合）
 */
const plxUnique = (reference, config = {}) => {
    let source = {};
    if (Abs.isArray(config.items)) {
        source.data = Expr.aiExprOption(config.items);
        source.config = {
            display: 'label',// 固定值处理
            value: 'key'// 固定值处理
        };
    } else {
        let datum;
        if (config.datum) {
            datum = config.datum;
        } else if (config['$datum']) {
            datum = config['$datum']
        }
        if (datum) {
            const config = "string" === typeof datum ?
                Ut.formatObject(datum, true) : datum;
            /*
             * 计算 list
             */
            if (config) {
                source.data = Datum.onDatum(reference, config.source);
            } else {
                source.data = [];
            }
            /*
             * 兼容处理 label 优先，其次 display
             */
            const $config = {};
            if (config.label) {
                $config.display = config.label;
            } else {
                $config.display = config.display;
            }
            $config.value = config.value;
            source.config = $config;
        }
    }
    /*
     * 解析 value 处理, 数据源的最终生成已经拿到
     * source
     * {
     *     "data": [],    // 数据源
     *     "display": "", // 显示字段
     *     "value": "",   // 显示值
     * }
     */
    return source;
};
// I.data.js
const toMock = (jsx = {}, reference) => {
    const {config = {}} = jsx;
    if (config.mock) {
        const {mock = {}} = reference.state;
        jsx.mock = mock[config.mock];
    }
};
const toConfig = (reference, jsx = {}, fnDatum) => {
    const {config = {}, ...others} = jsx;
    const {datum, ...rest} = config;
    const source = fnDatum(reference, {datum, ...rest});
    if (config.table) {
        const {table = {}, ...left} = rest;
        return {source, table, config: left, ...others};
    } else {
        return {source, config: rest, ...others};
    }
};
const Data = {
    toMock,
    toConfig,
}
// I.fn.change.js
const onChange = (rest = {}, fnChange, jsx = {}) => {
    const {
        reference,
        options = [],
        config = {},        // 默认是 {}
        depend,
        prevent = true
    } = jsx;
    /*
     * 一定会包含 onChange 参数，信任内部的 native code 的相关处理
     * 1）fnChange：通过编程写的外部传入的 change 函数
     * 2）onChange：默认的，zero ui 中的特殊 onChange
     * -- 处理 linker
     * -- 处理 impact 两个节点
     * 3）是否包含了 reference 引用信息
     * -- 自定义的一定包含 reference
     * -- 非自定义的一定不包含 reference
     */
    rest.onChange = (event) => {
        /*
         * 二义性函数处理值信息，直接带 prevent 读取
         * 带 prevent 是防止一些特殊的 prevent 被取消
         */
        const value = Ele.ambEvent(event, {prevent});
        const formValues = {};
        if (config.linker) {
            /*
             * linker 专用处理，配置项
             * optionJsx.config.linker
             * optionJsx.config.linkerField
             */
            Ut.writeLinker(formValues, config,
                (field) => Ele.elementUnique(options, field, value));
        }
        if (depend) {
            const {impact = {}} = depend;
            if (Abs.isObject(impact) && !Abs.isEmpty(impact)) {
                /*
                 * depend 专用处理
                 * optionJsx.depend.impact
                 */
                Ut.writeImpact(formValues, depend, value);
            }
        }
        /*
         * reference 存在才执行 form 逻辑
         */
        if (reference) {
            /*
             * 不为空就设值
             */
            if (!Abs.isEmpty(formValues)) {
                Dev.dgDebug(formValues, "[ Ux ] depend.impact / linker 结果！");
                Ut.formHits(reference, formValues);
            }
        }
        if (Abs.isFunction(fnChange)) {
            fnChange(event, value, reference);
        }
    }
}

/**
 * Ant 原生属性专用类信息
 *
 * 主要用于在`aiXXX`的函数渲染中计算各种不同属性专用，属性计算有三种：
 *
 * * 配置计算
 * * 固定值
 * * 数据计算（包括列表数据以及固定数据）
 *
 * ### 成员函数表
 *
 * |函数名|说明|
 * |:---|:---|
 * |onAddonAfter|计算addonAfter属性。|
 * |onChange|「事件」注入计算生成onChange事件，封装原生onChange事件，注入前后触发事件。|
 * |onDisabledDate|计算disabledDate属性。|
 * |onFromTo|执行复杂带配置的数据转换。|
 * |onMultiple|计算multiple属性（多选属性）。|
 * |onPlaceHolder|计算placeholder属性。|
 * |onPrefix|计算prefix属性。|
 * |onReadOnly|计算readOnly属性。|
 * |onSelect|「事件」注入计算生成onSelect事件。|
 * |toConfig|子表格配置生成器。|
 * |toDatum|「数据」解析DATUM字典数据源生成列表数据。|
 * |toDialogConfig|计算窗口配置。|
 * |toMock|「开发专用」开发过程计算模拟数据。|
 * |toOptions|「数据」选项生成器，Datum/Items共同计算生成选项option的列表。|
 * |toOrigin|计算选项Item对应的配置数据。|
 * |toParsed|直接解析Datum配置。|
 * |toRecord|「数据」根据配置处理记录数据。|
 * |toTreeOptions|「数据」树选项数据计算器。|
 * |toUnique|「数据」唯一记录读取，抽取主键，通常用于字典数据中提取选中记录唯一主键。|
 *
 * @class Ant
 */
class Ant {
    /**
     * ## 「标准」`Ux.Ant.toTreeOptions`
     *
     * 处理 TreeOptions 信息，配置在 optionJsx 中的 config.tree 节点里。
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {Object} config 配置数据结构。
     * @returns {Array} 树形数组，专用 TreeOptions。
     */
    static toTreeOptions(reference, config = {}) {
        return Complex.plxTreeOptions(reference, config);
    };  // 树相关options解析，optionJsx.config.<items>/<datum>，返回数组


    /**
     * ## 「标准」`Ux.Ant.toOptions`
     *
     * 特殊的辅助数据解析流程，config 配置数据结构如下：
     *
     * * config.items：静态数据源。
     * * config.datum：辅助数据源。
     * * config.cascade：专用依赖数据，联动下拉。
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {Object} config 配置数据结构。
     * @param {Function} filter 过滤专用函数。
     * @returns {Array} 返回解析过后的 options 列表。
     */
    static toOptions(reference, config = {}, filter = () => true) {
        return Complex.plxOptions(reference, config, filter);
    };  // 普通解析：items / datum, optionJsx.config.<items>/<datum>，返回数组


    /**
     *
     * ## 「标准」`Ux.Ant.toRecord`
     *
     * 记录处理解析记录字符串，`ExRecord`组件特有，如：
     *
     * ```shell
     * 我的记录：{"name":"Lang","email":"lang.yu@hpe.com"}
     * ```
     *
     * 上述字符串会被解析成：
     *
     * ```json
     * {
     *     "prefix": "我的记录",
     *     "record": {
     *         "name": "Lang",
     *         "email": "lang.yu@hpe.com"
     *     }
     * }
     * ```
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {optionJsx} jsx 输入的jsx配置。
     * @returns {Function} 返回记录执行专用函数。
     */
    static toRecord(reference, jsx = {}) {
        return Complex.plxRecord(reference, jsx);
    };

    /**
     *
     * ## 「标准」`Ux.Ant.toDialogConfig`
     *
     * 窗口配置解析
     *
     * 返回最终窗口配置对象。
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {String[]} path 路径信息
     * @returns {Object} 返回窗口配置
     */
    static toDialogConfig(reference, ...path) {
        return Complex.plxDialog.apply(null, [reference].concat(path));
    };

    /**
     * ## 「标准」`Ux.Ant.onFromTo`
     *
     * 复杂解析
     *
     * 根据`config`配置信息，执行 from 和 to 部分的值流程。
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {optionJsx} jsx 输入的jsx配置。
     */
    static onFromTo(reference, jsx = {}) {
        return Complex.plxFromTo(reference, jsx);
    }

    /**
     * ## 「标准」`Ux.Ant.toUnique`
     *
     * 组合生成唯一数据信息专用值
     *
     * 1. config.datum：辅助数据源，表单解析动态流程。
     * 2. config.items：辅助数据源，表单解析静态流程。
     * 3. config.$datum：列解析过程中的数据源流程。
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {Object} config 基本配置数据信息。
     * @return {Object|any} 返回唯一记录集。
     */
    static toUnique(reference, config = {}) {
        return plxUnique(reference, config);
    };

    /**
     * ## 「标准」`Ux.Ant.toMock`
     *
     * 「Dev」开发专用
     * 执行模拟数据注入环节，注入模拟数据。
     *
     * 1. 检查 jsx 中的 config 配置数据。
     * 2. config.mock 如果打开，则从 reference 的 state 中提取 `mock` 对象。
     * 3. 最终调用 `mock[config.mock]` 来执行模拟数据的调用。
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     * @param {ReactComponent} reference React对应组件引用。
     */
    static toMock(jsx = {}, reference) {
        return Data.toMock(jsx, reference);
    };

    /**
     * ## 「标准」`Ux.Ant.toConfig`
     *
     * 执行特殊配置解析，生成子表格（Table）配置，返回数据结构如：
     *
     * ```json
     * {
     *     source: ["数据源信息"],
     *     config: {
     *         "...": "基本配置信息"
     *     },
     *     table: {
     *         "...": "表格配置信息"
     *     },
     *     ...others
     * }
     * ```
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     * @param {ReactComponent} reference React对应组件引用。
     * @returns {Object} 返回构造好的配置信息。
     */
    static toConfig(jsx = {}, reference) {
        return Data.toConfig(jsx, reference);
    };

    /**
     * ## 「标准」`Ux.Ant.toOrigin`
     *
     * 针对每个选项的相关信息执行`applyItem`方法，包括格式化操作。
     *
     * @param {Array} items 输入的选项数组。
     * @param {Object} config 配置数据。
     * @returns {Array} 返回的最终 options。
     */
    static toOrigin(items = [], config = {}) {
        return Datum.parseOrigin(items, config);
    };

    /**
     * ## 「标准」`Ux.Ant.toDatum`
     *
     * 根据 Datum 配置解析辅助数据，生成最终解析好的 options 数据（Array类型）。
     *
     * @param {ReactComponent} reference React对应组件引用。
     * @param {Object} config Datum专用配置信息。
     * @param {Function} filter 过滤函数。
     * @returns {Array} 返回的最终 options。
     */
    static toDatum(reference, config = {}, filter = () => true) {
        return Datum.parseDatum(reference, config, filter);
    };

    /**
     * ## 「标准」`Ux.Ant.toParsed`
     *
     * 表达式解析专用方法，处理 `kv` 表达式，表达式格式如：
     *
     * ```js
     * const expr = "source=item.type,value=key,name=display";
     * const item = Ux.Ant.toParsed(expr);
     * ```
     *
     * @param {String} expr 输入的表达式信息
     * @returns {Object} 解析过后的对象
     */
    static toParsed(expr = "") {
        return Datum.parseExpr(expr);
    };

    /**
     * ## 「标准」`Ux.Ant.onReadOnly`
     *
     * 针对只读 readOnly 属性的设置
     *
     * 1. 如果 readOnly 是Object，则直接执行依赖性处理。
     *      * same 配置：目标字段为true，则readOnly为true。
     *      * diff 配置：目标字段为true，则readOnly为false。
     * 2. 其他状况，如果 mode 不是 "multiple"，则执行禁用。
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     * @param {boolean} disabled 是否禁用。
     * @param {ReactComponent} reference React对应组件引用。
     */

    static onReadOnly(jsx = {}, disabled = false, reference) {
        return Pure.readOnly(jsx, disabled, reference);
    };

    /**
     * ## 「标准」`Ux.Ant.onMultiple`
     *
     * 多选专用方法，设置 multiple 属性。
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     */
    static onMultiple(jsx = {}) {
        return Pure.multiple(jsx);
    };


    /**
     *
     * ## 「标准」`Ux.Ant.onSelect`
     *
     *
     * 处理属性 onSelect，针对菜单类型的选择方法专用。
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     * @param {Function} fnSelect 选择事件函数。
     */
    static onSelect(jsx = {}, fnSelect) {
        return Pure.onSelect(jsx, fnSelect);
    };

    /**
     * ## 「标准」`Ux.Ant.onChange`
     *
     * 处理特殊的 onChange 属性
     *
     * jsx的数据结构如：
     *
     * ```json
     * {
     *     reference: "当前React组件引用",
     *     options: [
     *         "专用选项方法"
     *     ],
     *     config: {
     *         "...": "optionJsx中的config配置数据"
     *     },
     *     depend: {
     *         "...": "optionJsx中的depend配置数据"
     *     },
     *     prevent: "布尔值，是否禁用默认事件"
     * }
     * ```
     *
     * @param {Object} rest 被修改的jsx。
     * @param {Function} fnChange 外置传入函数。
     * @param {Object} jsx 传入的jsx专用。
     */
    static onChange(rest = {}, fnChange, jsx = {}) {
        return onChange(rest, fnChange, jsx);
    };

    /**
     * ## 「标准」`Ux.Ant.onAddonAfter`
     *
     * 检查 addonAfter 属性，并执行解析，解析分两种
     *
     * * 标签处理：直接设置文字
     * * 图标处理：设置文字和图标等信息。
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     */
    static onAddonAfter(jsx = {}) {
        return Pure.addonAfter(jsx);
    };

    /**
     * ## 「标准」`Ux.Ant.onPlaceHolder`
     *
     * 检查 placeholder 属性，并执行解析，解析特殊情况
     *
     * * 如果只读或者禁用，则删除 placeholder。
     * * 不论任何时候，如果包含了 `inscribe`属性，则设值为`inscribe` 值（只读和禁用模式的专用placeholder）。
     *
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     */
    static onPlaceHolder(jsx = {}) {
        return Pure.placeholder(jsx);
    };

    /**
     * ## 「标准」`Ux.Ant.onPrefix`
     *
     * 检查 prefix 属性，并执行解析，解析分两种
     *
     * * 标签处理：直接设置文字
     * * 图标处理：设置文字和图标等信息。
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     */
    static onPrefix(jsx) {
        return Pure.prefix(jsx);
    };

    /**
     * ## 「标准」`Ux.Ant.onDisabledDate`
     *
     * 检查 disabledDate 属性，并执行它的处理，解析器支持
     *
     * * `propFromNow`：从当前时间开始，大于当前时间则禁用
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     */
    static onDisabledDate(jsx = {}) {
        return Pure.disabledDate(jsx);
    };
}

export default Ant;