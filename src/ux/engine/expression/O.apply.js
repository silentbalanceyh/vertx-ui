// 导入第三方库
import U from "underscore";
import {v4} from "uuid";
// 导入当前目录
import Parser from "./I.parser.down";
import Ruler from './I.parser.rule';
// 导入外层
import Abs from '../../abyss';
import Ut from '../../unity';

/**
 * ## 引擎函数
 *
 * 直接解析字符串生成数组。
 *
 * 1. 如果输入是数组，则不执行解析。
 * 2. 如果输入是字符串，则执行解析。
 *
 * 使用代码如：
 *
 * ```js
 * const str = "item1,item2,item3";
 * const strArr = Ux.applyArray(str);
 * // strArr的值如：["item1","item2","item3"];
 * ```
 *
 * @memberOf module:_apply
 * @param {String} literal 字面量专用数据。
 * @returns {Array} 返回解析后的数组。
 */
const applyArray = (literal) => U.isArray(literal) ? literal : literal.split(',');
/**
 * ## 引擎函数
 *
 * 如果 item 中没有 key 存在，则赋值 uuid 的值。
 *
 * @memberOf module:_apply
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyKey = (item = {}) => {
    if (!item.hasOwnProperty('key')) {
        item.key = v4();
    }
    return item;
};
/**
 * ## 引擎函数
 *
 * 解析验证规则：`optionConfig.rules` 专用方法。
 *
 * @memberOf module:_apply
 * @param {Array} rules 验证规则数组。
 * @returns {Array} 返回最终的数组信息。
 */
const applyRules = (rules = []) => {
    const processed = [];
    rules.forEach(rule => {
        if ("string" === typeof rule) {
            const result = Ruler.parseRule(rule);
            if (result) {
                processed.push(result);
            }
        } else {
            processed.push(rule);
        }
    });
    return processed;
};
/**
 * ## 引擎函数
 *
 * 1. 如果 `key` 存在，则直接删除，防止 dataIndex 位移。
 * 2. 如果存在 `sorter` 属性，则执行布尔转换。
 *
 * @memberOf module:_apply
 * @param {Object} item 传入列配置。
 * @returns {Object} 返回处理过的对象。
 */
const applyColumn = (item = {}) => {
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    if (item.hasOwnProperty("sorter")) {
        item.sorter = Boolean(item.sorter);
    }
    return item;
};
/**
 * ## 引擎函数
 *
 * 如果 item 中没有 value 而只包含了 key，则执行赋值，拷贝 key 给 value 属性：
 *
 * ```js
 *
 * const item = {
 *     key: "itemKey"
 * };
 * // item.value = item.key
 * const processed = Ux.applyValue(item);
 * ```
 *
 * @memberOf module:_apply
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyValue = (item = {}) => {
    if (item.hasOwnProperty("key") && !item.hasOwnProperty("value")) {
        item.value = item.key;
    }
    return item;
};
/**
 * ## 引擎函数
 *
 * 执行button 上的按钮函数，主要用于连接点击`onClick`事件，一个按钮点击另外一个`id`的按钮，触发目标按钮的`onClick`。
 *
 * @memberOf module:_apply
 * @param {Object} item 需要赋值的 item 对象。
 * @return {Object}
 */
const applyConnect = (item = {}) => {
    if (item.hasOwnProperty("connectId")) {
        const connectId = item.connectId;
        item.onClick = () => Ut.connectId(connectId);
        delete item.connectId;
    }
    return item;
};
/**
 * ## 引擎函数
 *
 * 防重复提交专用的状态注入
 *
 * 1. 从 props 中读取`$submitting` 状态数据，该数据为 `DataObject` 类型。
 * 2. 从 DataObject中提取`loading`的布尔值，true表示正在执行 redux加载，false表示没执行。
 *
 * @memberOf module:_apply
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Props} props React的属性信息。
 * @returns {Object} 返回处理后的属性信息。
 */
const applyLoading = (item = {}, props) => {
    const {$submitting} = props;
    if ($submitting) {
        const submitting = $submitting.is() ? $submitting.to() : {};
        item.loading = submitting.loading;
    }
    return item;
};
/**
 * ## 引擎函数
 *
 * 解析Kv数组，基础解析完成过后，如果出现`$KV$`，那么解析后续表达式：`k1=v1,k2=v2`，然后将解析结果压入到item中。
 *
 * @memberOf module:_apply
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Object} config 配置数据信息。
 * @param {Array} kvs `key=value`的参数对。
 * @returns {Object} 返回处理后的配置属性。
 */
const applyKv = (item = {}, config = [], kvs = []) => {
    if (kvs.length >= config.length) {
        if (item.hasOwnProperty("$KV$")) {
            for (let idx = config.length - 1; idx < kvs.length; idx++) {
                const literal = kvs[idx];
                Parser.parseTo(item, literal);
            }
            delete item['$KV$'];
        }
    }
    return item;
};
/**
 * ## 引擎函数
 *
 * 如果存在 `style` 属性，则执行 `style` 属性的解析，生成 Object。
 *
 * @memberOf module:_apply
 * @param {Object} item 需要赋值的 item 对象。
 * @returns {Object} 返回处理后的属性信息。
 */
const applyStyle = (item = {}) => {
    if (item.hasOwnProperty('style')) {
        const literal = item.style;
        if ("string" === typeof literal) {
            const styleArr = literal.split(':');
            const style = {};
            style.fontSize = `${styleArr[0]}px`;
            style.color = `${styleArr[1]}`;
            item.style = style;
        }
    }
    return item;
};
/**
 * ## 引擎函数
 *
 * 解析表单 item 专用的方法信息，简化版处理：
 *
 * ```json
 * {
 *     "metadata": "...",
 *     "optionJsx": "...",
 *     "optionConfig": "...",
 *     "optionItem": "..."
 * }
 * ```
 *
 * @memberOf module:_apply
 * @param {Object} item 需要赋值的 item 对象。
 * @param {Object} config 配置数据信息。
 * @param {Array} kvs `key=value`的参数对。
 * @returns {Object} 返回处理后的配置属性。
 */
const applyItem = (item = {}, config = [], kvs = []) => {
    /*
     * 查找定义的 $KV$ 的索引
     */
    let kvIndex = -1;
    config.forEach((item, index) => {
        if ("$KV$" === item) {
            kvIndex = index;
        }
    });
    /*
     * kvs 的变幻
     * 1）超过 $KV$ 索引的位置执行 '' 的压缩，也就是 $KV$ 之后丢弃掉空字符串
     * 2）压缩的时候需要保留 $KV$ 之前的应用
     */
    const compress = [];
    if (0 < kvIndex) {
        kvs.forEach((kv, index) => {
            if (index < kvIndex) {
                compress.push(kv);
            } else {
                if (kv) {
                    compress.push(kv);
                }
            }
        });
    } else {
        kvs.forEach(kv => compress.push(kv));
    }
    /*
     * 执行压缩过后的处理操作
     */
    let $item = Abs.immutable(item);
    for (let idx = 0; idx < config.length; idx++) {
        const name = config[idx];
        if (compress[idx]) {
            if (0 < name.indexOf(".")) {
                $item = $item.setIn(name.split('.'), compress[idx]);
            } else {
                $item = $item.set(name, compress[idx]);
            }
        }
    }
    return $item.toJS();
};
export default {
    applyArray,
    applyKey,
    applyRules,
    applyItem,
    applyStyle,
    applyLoading,
    applyKv,
    applyColumn,
    applyValue,
    applyConnect,
};