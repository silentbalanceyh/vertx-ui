import __Zi from 'zi';
import __Zo from 'zo';
import __Zn from 'zone';

/**
 * ## 「引擎」`Ux.onUniform`
 *
 * 原生 Zero UI中的组件继承属性专用方法，在 Zero Extension 中会调用`yoAmbient`方法实现属性继承，
 * 继承过程中包含几个核心数据：
 *
 * 1. `$t_` 和 `$a_` 的辅助数据，Tabular和Assist两种。
 * 2. `app`应用程序相关数据。
 * 3. `user, profile`用户登录后的数据。
 * 4. `submitting`防重复提交状态数据。
 * 5. `router`核心路由数据。
 * 6. 输入的`keys`对应的键相关数据。
 *
 * @memberOf module:on/zodiac
 * @param {Props} props 当前React组件的属性信息。
 * @param {String[]} keys 待提取的属性集合。
 * @return {Object} 返回最终的数据信息。
 */
const onUniform = (props, ...keys) =>
    __Zo.onUniform.apply(this, [props].concat(keys))
/**
 * ## 「标准」`Ux.onColor`
 *
 * ### 基本说明
 *
 * 获取主色调专用方法，从 reference 中读取主色调相关信息。主色调的读取方式有两种，说明如下：
 *
 * * 从Ant Design 4.0开始，样式和皮肤设置存放在token中。
 *
 * 1. `$settings`：从token中获取的样式和皮肤信息，默认没有设置，修改全局的样式和皮肤可进行设置，其中colorPrimary为主色调信息。
 * 2. `Z_CSS_COLOR`：关于主色调的环境变量，如果$settings没有设置，则会返回此值。
 *
 * ### 特殊说明
 *
 * And Design 5 中的样式定制参考：<https://ant.design/docs/react/customize-theme-cn>，此处的 token 并非安全相关的 token，而是一种定制主题的方式，它在设置的时候其调用代码如下：
 *
 * ```js
 * import {ConfigProvider} from 'antd';
 *
 * return (
 *     <ConfigProvider locale="cn" theme={
 *         {
 *             token: {},
 *             algorithm: "css-in-js"
 *         }
 *     }>
 *     </ConfigProvider>
 * )
 * ```
 *
 * token 相关的API参考：<https://ant.design/docs/react/customize-theme-cn#api>，后期关于皮肤的完整设计如：
 *
 * 1. 所有的皮肤都在 `skin` 目录中进行管理，而不同的皮肤依靠不同的环境变量来指定：
 *     - `Z_CSS_SKIN_MODULE`：指定皮肤的模块
 *     - `Z_CSS_SKIN_NAME`：指定皮肤中模块名称
 * 2. 用户登录系统之后，可以使用皮肤管理工具对当前皮肤进行修改，并且将修改结果存储同步到个人设置中。
 * 3. 保存之后色彩风格会追加 **第三来源**：从远程数据库中提取皮肤信息，这种皮肤信息是用户自定义的皮肤信息。
 *
 * @memberOf module:on/zodiac
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @returns {String} 返回主色调信息。
 */
const onColor = (reference) =>
    __Zo.onColor(reference);
/**
 * ## 「引擎」`Ux.fromHoc`
 *
 * 资源文件数据读取专用方法，从 $hoc 中读取主键值相关信息。
 *
 * @memberOf module:from/zone
 * @deprecated
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String} key 读取对应属性名。
 * @param {Number} level 层级
 * @return {null}
 */
const fromHoc = (reference = {}, key = "", level = 0) =>
    __Zn.fromHoc(reference, key, level)
/**
 * ## 「引擎」`Ux.fromPath`
 *
 * 资源文件数据读取专用方法，从 $hoc 中读取主键值相关信息，可以处理深度路径信息。
 *
 * @memberOf module:from/zone
 * @deprecated
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String[]} args 读取属性名核心路径。
 * @return {null}
 */
const fromPath = (reference = {}, ...args) =>
    __Zn.fromPath.apply(this, [reference].concat(args));

/**
 * ## 「标准」`Ux.onDatum`
 *
 * 辅助数据读取专用函数，可根据 key = `xxx.yyy` 的值处理辅助数据，主要读取：
 *
 * 1. 读取Tabular专用辅助数据。
 * 2. 读取Assist专用辅助数据。
 * 3. 读取Category专用辅助数据。
 *
 * 根据所需信息读取上述三大类的辅助数据，得到最终的 Array 类型的数组结果。
 *
 * @memberOf module:on/zodiac
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String} key 需要读取的 Tabular/Assist 的键值。
 * @return {Array} 返回最终的数组。
 */
const onDatum = (reference, key) =>
    __Zo.onDatum(reference, key);
/**
 * ## 「引擎」`Ux.onReference`
 *
 * 直接返回属性中的`reference`（父类引用），根据`current`计算将要递归的层级，这里必须是
 * 按照 Zero UI 中的规范传入了 reference 的组件。
 *
 * ```js
 * // 父类引用
 * const ref = Ux.onReference(this, 1);
 *
 * // 爷类引用
 * const ref - Ux.onReference(this, 2);
 *
 * // 不断往上递归，读取所需要的 n 层引用信息。
 * ```
 *
 * @memberOf module:on/zone
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {Number} current 处理层级信息。
 * @return {Object|ReactComponent} 返回组件引用。
 */
const onReference = (reference, current = 0) =>
    __Zn.onReference(reference, current);
/**
 * ## 「标准」`Ux.onLinker`
 *
 * 和 linker 配置项目的数据提取。
 *
 * @memberOf module:on/zion
 * @param {Object} config linker相关的配置信息。
 * @param {Function|any} valueSupplier 默认值，或值处理函数。
 * @return {Object} 生成的最终 linker 数据。
 */
const onLinker = (config = {}, valueSupplier) =>
    __Zi.onLinker(config, valueSupplier)
/**
 * ## 「标准」`Ux.onSave`
 *
 * 1. 数组合并（添加、更新）处理。
 * 2. 数组删除。
 *
 * @memberOf module:on/zodiac
 * @param {Object|ReactComponent} reference React对应组件引用。
 * @param {String} key 需要读取的 Tabular/Assist 的键值。
 * @param {Object} data 数据处理信息，包含了数据记录集。
 * @param {boolean} isDeleted 删除还是合并。
 * @return {Array} 返回处理完成的数组信息。
 */
const onSave = (reference, key, data, isDeleted = false) =>
    __Zo.onSave(reference, key, data, isDeleted);
/**
 * ## 「标准」`Ux.assistIn`
 *
 * @memberOf module:assist/zodiac
 * @param {Object|ReactComponent} reference React组件。
 * @param {String} key 需要读取的 Assist 的键值。
 * @param {Object} data 需要执行数据处理的信息
 */
const assistIn = (reference, key, data) =>
    __Zo.assistIn(reference, key, data);
/**
 * ## 「标准」`Ux.assistOut`
 *
 * @memberOf module:assist/zodiac
 * @param {Object|ReactComponent} reference React组件。
 * @param {String} key 需要读取的 Assist 的键值。
 * @param {Object} data 需要执行数据处理的信息
 */
const assistOut = (reference, key, data) =>
    __Zo.assistOut(reference, key, data);
export default {
    // on / from  react part
    onReference,    // 读取上层引用
    fromHoc,
    /**
     * ## 「引擎」`Ux.inHoc`
     *
     * 资源文件数据读取专用方法，从 $hoc 中读取主键值相关信息。
     *
     * @memberOf module:in/zone
     * @method inHoc
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {String} key 读取对应属性名。
     * @param {Number} level 层级
     * @return {null}
     */
    inHoc: fromHoc,
    fromPath,

    /**
     * ## 「引擎」`Ux.inPath`
     *
     * 资源文件数据读取专用方法，从 $hoc 中读取主键值相关信息，可以处理深度路径信息。
     *
     * @memberOf module:in/zone
     * @method inPath
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {String[]} args 读取属性名核心路径。
     * @return {null}
     */
    inPath: fromPath,
    /**
     * ## 「引擎」`Ux.inConfig`
     *
     * @memberOf module:in/zone
     * @param ref
     * @returns {*}
     */
    inConfig: (ref) => fromHoc(ref, "config"),    // _config
    /**
     * ## 「引擎」`Ux.inAlert`
     *
     * @memberOf module:in/zone
     * @param ref
     * @returns {*}
     */
    inAlert: (ref) => fromHoc(ref, "alert"),      // _alert
    /**
     * ## 「引擎」`Ux.inInfo`
     *
     * @memberOf module:in/zone
     * @param ref
     * @returns {*}
     */
    inInfo: (ref) => fromHoc(ref, "info"),        // _info

    // lkway
    onUniform, yoUniform: onUniform,
    onColor,


    // source
    onDatum, inDatum: onDatum,     // 读取 Tabular 或 Assist
    onSave,         // 处理 Assist / Tabular 的合并
    assistIn,
    assistOut,

    onLinker,       // 根据 linker 读取数据信息

    /**
     * ## 「引擎」`Ux.elementFindDatum`
     *
     * 带辅助数据的强化版`elementFind`方法。
     *
     * @memberOf module:element/zodiac
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {Object} filters 查询条件。
     * @return {Array} 返回查找的数组。
     */
    elementFindDatum: (reference, source, filters) =>
        __Zo.elementFindDatum(reference, source, filters),
    /**
     * ## 「引擎」`Ux.elementUniqueDatum`
     *
     * 带辅助数据的强化版`elementUnique`方法。
     *
     * @memberOf module:element/zodiac
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {String} field 查询专用字段。
     * @param {any} value 查询字段对应的值。
     * @return {Object|null} 返回查找到的唯一记录数据。
     */
    elementUniqueDatum: (reference, source, field, value) =>
        __Zo.elementUniqueDatum(reference, source, field, value),
    /**
     * ## 「引擎」`Ux.elementGroupDatum`
     *
     * 带辅助数据的强化班`elementGroup`方法。
     *
     * @memberOf module:element/zodiac
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {String} field 分组专用的字段名。
     * @return {Object} 分组过后的数据。
     */
    elementGroupDatum: (reference, source, field) =>
        __Zo.elementGroupDatum(reference, source, field),
    /**
     * ## 「引擎」`Ux.elementMapDatum`
     *
     * 带辅助数据的强化班`elementMap`方法。
     *
     * @memberOf module:element/zodiac
     * @param {Object|ReactComponent} reference React对应组件引用。
     * @param {String} source 需要读取的 Tabular/Assist 的键值。
     * @param {String} from 构造Map键。
     * @param {String} to 构造Map值。
     * @return {Object} 分组过后的数据。
     */
    elementMapDatum: (reference, source, from, to) =>
        __Zo.elementMapDatum(reference, source, from, to),
}