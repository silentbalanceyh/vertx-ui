import __PLX from './antd4.field.__.fn.plx.complex';
import __PURE from './antd4.field.__.fn._.pure';
import __ON from './antd4.field.__.fn.on.event';
import __DATUM_PARSE from './source.datum.fn.parse.data';
import Sk from "skin";
import __Zn from './zero.module.dependency';

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
const __DATA = {
    toMock,
    toConfig,
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
 * |toMock|「开发」开发过程计算模拟数据。|
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
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {Object} config 配置数据结构。
     * @returns {Array} 树形数组，专用 TreeOptions。
     */
    static toTreeOptions(reference, config = {}) {
        return __PLX.plxTreeOptions(reference, config);
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
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {Object} config 配置数据结构。
     * @param {Function} filter 过滤专用函数。
     * @returns {Array} 返回解析过后的 options 列表。
     */
    static toOptions(reference, config = {}, filter = () => true) {
        return __PLX.plxOptions(reference, config, filter);
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
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {optionJsx} jsx 输入的jsx配置。
     * @returns {Function} 返回记录执行专用函数。
     */
    static toRecord(reference, jsx = {}) {
        return __PLX.plxRecord(reference, jsx);
    };

    /**
     *
     * ## 「标准」`Ux.Ant.toDialogConfig`
     *
     * 窗口配置解析
     *
     * 返回最终窗口配置对象。
     *
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {String[]} path 路径信息
     * @returns {Object} 返回窗口配置
     */
    static toDialogConfig(reference, ...path) {
        return __PLX.plxDialog.apply(null, [reference].concat(path));
    };

    /**
     * ## 「标准」`Ux.Ant.onFromTo`
     *
     * 复杂解析
     *
     * 根据`config`配置信息，执行 from 和 to 部分的值流程。
     *
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {optionJsx} jsx 输入的jsx配置。
     */
    static onFromTo(reference, jsx = {}) {
        return __PLX.plxFromTo(reference, jsx);
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
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {Object} config 基本配置数据信息。
     * @return {Object|any} 返回唯一记录集。
     */
    static toUnique(reference, config = {}) {
        return __PLX.plxUnique(reference, config);
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
     * @param {Object|ReactComponent} reference React对应组件引用。
     */
    static toMock(jsx = {}, reference) {
        return __DATA.toMock(jsx, reference);
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
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @returns {Object} 返回构造好的配置信息。
     */
    static toConfig(jsx = {}, reference) {
        return __DATA.toConfig(jsx, reference);
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
        return __DATUM_PARSE.parseOrigin(items, config);
    };

    /**
     * ## 「标准」`Ux.Ant.toDatum`
     *
     * 根据 Datum 配置解析辅助数据，生成最终解析好的 options 数据（Array类型）。
     *
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {Object} config Datum专用配置信息。
     * @param {Function} filter 过滤函数。
     * @returns {Array} 返回的最终 options。
     */
    static toDatum(reference, config = {}, filter = () => true) {
        return __DATUM_PARSE.parseDatum(reference, config, filter);
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
     * @param {Object|ReactComponent} reference React对应组件引用。
     */

    static onReadOnly(jsx = {}, disabled = false, reference) {
        return __PURE.readOnly(jsx, disabled, reference);
    };

    /**
     *
     * @param jsx
     * @param reference
     */
    static onReduce(jsx = {}, reference) {
        return __PURE.reduce(jsx, reference);
    }

    /**
     *
     * @param jsx
     * @param name
     */
    static onLocale(jsx, name) {
        Sk.skinI18n(jsx, name);
    }

    /**
     *
     * @param jsx
     * @param name
     */
    static onCssClass(jsx, name) {
        __Zn.toCssClass(jsx, name);
    }

    /**
     * ## 「标准」`Ux.Ant.onMultiple`
     *
     * 多选专用方法，设置 multiple 属性。
     *
     * @param {optionJsx} jsx 输入的jsx配置。
     */
    static onMultiple(jsx = {}) {
        return __PURE.multiple(jsx);
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
        return __ON.onSelect(jsx, fnSelect);
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
        return __ON.onChange(rest, fnChange, jsx);
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
        return __PURE.addonAfter(jsx);
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
        return __PURE.placeholder(jsx);
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
        return __PURE.prefix(jsx);
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
        return __PURE.disabledDate(jsx);
    };
}

export default Ant;