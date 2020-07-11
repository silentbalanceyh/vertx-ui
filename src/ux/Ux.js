import abs from './abyss';
import ajax from './ajax';
import constant from './constant';
import develop from './develop';
import element from './element';
import engine from './engine';
import entity from './entity';
import unity from './unity';
import graphic from './graphic';
import xweb from './xweb';
import romantic from './romantic';

import E from './error';

const exported = {
    /**
     * # 内部模块
     *
     * 底层原子类操作
     *
     * @module _primary
     */
    /**
     * # 内部模块
     *
     * 遍历专用模块
     *
     * @module _it
     */
    /**
     * # 内部模块
     *
     * 判断专用模块
     *
     * @module _is
     */
    /**
     * # 内部模块
     *
     * 异步专用模块
     *
     * @module _async
     */
    ...abs,

    /**
     * # 内部私有模块
     *
     * 私有函数，不可以通过 `Ux.xxx` 调用，没有 exported 内容
     *
     * @module __private
     */
    /**
     * # 内部模块
     *
     * Ajax专用访问处理
     *
     * @module _ajax
     */
    /**
     * # 内部模块
     *
     * 消息类专用方法（可支持异步模式）
     *
     * @module _message
     */
    /**
     * # 内部模块
     *
     * 异步专用模块
     *
     * @module _callback
     */
    ...ajax,
    /**
     * # 内部模块
     *
     * 调试专用模块
     *
     * @module _debug
     *
     */
    ...develop,
    /**
     * # 内部模块
     *
     * 值处理专用模块
     *
     * @module _value
     *
     */
    /**
     * # 内部模块
     *
     * 转换专用模块
     *
     * @module _to
     *
     */
    /**
     * # 内部模块
     *
     * 值处理专用模块
     *
     * @module _element
     *
     */
    /**
     * # 内部模块
     *
     * 「二义性」方法专用模块
     *
     * @module _ambiguity
     */
    ...element,
    /**
     * # 内部模块
     *
     * 引擎：引擎数据模块
     *
     * @module _from
     */
    /**
     * # 内部模块
     *
     * 引擎：引擎挂载模块
     *
     * @module _on
     */
    /**
     * # 内部模块
     *
     * 引擎：专用解析函数
     *
     * @module _parser
     */
    /**
     * # 内部模块
     *
     * 引擎：赋值函数
     *
     * @module _apply
     */
    /**
     * # 内部模块
     *
     * 引擎：专用配置模块
     *
     *
     * 基本规范：
     *
     * 1. cab类方法 -> 读取配置基本方法。
     *      1. cab会从 cab/cn/ 目录下读取静态配置。
     *      2. 如果配置来源并不是来自于静态配置，则不考虑。
     * 2. cap类方法 -> 构造配置基本输入，在 raft 之前处理。
     * 3. config类方法 -> 正式配置组件，初始化完成所有的静态配置。
     * 4. raft类方法 -> 遗留方法（对接老系统）。
     *
     * @module _config
     */
    /**
     * # 内部模块
     *
     * 引擎：表达式解析模块
     *
     * @module _aiExpr
     */
    /**
     * # 内部模块
     *
     * 引擎：查询引擎专用
     *
     * @module _qr
     */
    /**
     * # 内部模块
     *
     * 引擎：锚点专用模块
     *
     * @module _anchor
     */
    ...engine,
    ...entity,
    /**
     * # 内部模块
     *
     * 随机函数模块
     *
     * @module _random
     */
    /**
     * # 内部模块
     *
     * Redux 模块
     *
     * 状态位于`out`节点之下，特殊的默认值如下：
     *
     * * `assist`：辅助数据节点。
     * * `tabular`：辅助字典节点。
     * * `datum`：特殊数据状态节点
     *      * `data`：当前页面的主数据信息。
     *      * `menus`：页面菜单主要数据。
     *      * `inited`：当前表单的初始化数据。
     *      * `user`：登录状态数据。
     * * `state`：状态节点。
     *      * `submitting`：提交状态处理。
     *      * `loading`：加载状态处理。
     *
     * > 节点可支持路径解析如：`datum.data`作为 key 值，直接搜索路径信息。
     *
     * @module _redux
     */
    /**
     * # 内部模块
     *
     * 所属应用模块
     *
     * @module _app
     */
    /**
     * # 内部模块
     *
     * 编码解码模块
     *
     * @module _encrypt
     */
    /**
     * # 内部模块
     *
     * 数学运算模块
     *
     * @module _math
     */
    /**
     * # 内部模块

     * HTML元素模块
     *
     * @module _html
     */
    /**
     * # 内部模块
     *
     * Ant Design专用
     * @module _ant
     */
    /**
     * # 内部模块
     *
     * 格式化模块
     *
     * @module _format
     */
    /**
     * # 内部模块
     *
     * 连接专用模块
     *
     * @module _connect
     */
    /**
     * # 内部模块
     *
     * 树专用模块
     *
     * @module _tree
     */
    /**
     * # 内部模块
     *
     * 表格专用模块
     *
     * @module _table
     */
    /**
     * # 内部模块
     *
     * 插件专用模块
     *
     * @module _plugin
     */
    /**
     * # 内部模块
     *
     * 排序专用模块
     *
     * 排序函数中有两个维度的数据。
     *
     * 1. 是否传入key：如果传入了key则证明是对对象中的字段为key的数据执行排序。
     * 2. 没有传入key：那么就是左右值的基础数据排序。
     *
     * 是否生成`Function`函数，如果生成Function函数，则通常用于 Ant Design中的 column 中的 `sorter`属性。
     *
     * 1. 带`Fn`结尾的用于 column 的列排序。
     * 2. 不带`Fn`结尾的主要用于 Array 的 sort 方法排序。
     *
     * @module _sorter
     */
    /**
     * # 内部模块
     *
     * entity 中专用语言模块，处理专用 Dsl 的数据类型专用
     *
     * * DataObject
     * * DataArray
     *
     * @module _dsl
     */
    ...unity,
    ...graphic,
    /**
     * # 内部模块
     *
     * 自定组件专用模块
     *
     * @module _xt
     */
    ...xweb,
    /**
     * # 内部模块
     *
     * 新模块，各种骚操作（增强多义性函数）
     *
     * @module _romantic
     */
    ...romantic,
    /**
     * # 内部模块
     *
     * 常量的直接调用方式
     *
     * ```js
     * import Ux from 'ux';
     *
     * const value = Ux.Env.xxx
     * ```
     *
     * @module _constant
     *
     */
    Env: {
        ...constant,
    },
    /**
     * # 内部容错模块
     *
     * 容错模块的专用方式，注意这个模块的调用和其他地方的调用不太相同。
     *
     * ```js
     * import Ux from 'ux';
     * // Ux.E.xxx; 直接调用该函数处理
     * ```
     *
     * @module _error
     */
    E,
};
console.warn(exported);
export default exported;

