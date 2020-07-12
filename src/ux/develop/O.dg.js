import {saveAs} from "file-saver";
import Cv from "../constant";
import {v4} from "uuid";
import Abs from '../abyss';
import {detailedDiff} from 'deep-object-diff';

/**
 * ## 标准函数
 *
 * UI组件的日志记录器，记录所有的UI组件。
 *
 * @memberOf module:_debug
 * @param {Ux} Ux Utility X工具包。
 * @param {Object} container 布局容器组件。
 * @param {Object} component 页面核心组件。
 */
const dgRouter = (Ux, container, component) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.groupCollapsed("%c 「Zero」 UI Component Report:", "font-weight:900;color:#369");
        console.info("[Ux] Container = ", container);
        console.info("[Ux] Component = ", component);
        console.groupEnd();
    }
};
/**
 * ## 标准函数
 *
 * （高频函数）通用 DEBUG 调试函数，直接调用即可
 *
 * ```js
 * import Ux from 'ux';
 * const user = { username:"Lang Yu" };
 * Ux.dgDebug(user, "用户信息");  // 使用默认色彩
 * ```
 *
 * @memberOf module:_debug
 * @param {any} data 推荐使用输入的 Object。
 * @param {String} prefix 消息前缀。
 * @param {WebColor} color 色彩值。
 * @return {any} 传入什么内容就打印什么内容（方便Fluent调用）。
 */
const dgDebug = (data = {}, prefix, color) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.debug(`%c [DEBUG] ${prefix ? prefix : ""}`, `color:white;background-color:${color ? color : "#eb2f96"};font-weight:900;`,
            data);
    }
    return data;
};
/**
 * ## 标准函数
 *
 * （高频函数）通用 DEBUG 调试函数，主要调试 Ajax 请求响应专用。
 *
 * @memberOf module:_debug
 * @param {any} data 输入的需要调试的数据信息。
 * @param {any} prefix 消息的前缀。
 * @return {any} 输入什么内容就返回什么内容（方便Fluent调用）。
 */
const dgAjax = (data, prefix) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.debug(`%c [DEBUG] Ajax - ${prefix ? prefix : ""}`, "color:red;font-weight:900;",
            data);
    }
    return data;
};
/**
 * ## 集成函数
 *
 * （高频函数）通用 DEBUG 抓取数据格式的专用函数，该函数会抓取数据并且生成 Json 文件存储起来
 *
 * @memberOf module:_debug
 * @param {any} data 输入的需要调试的数据信息。
 * @param {String} ext 扩展名，不设置则使用 `.json`。
 * @param {String} filename 下载的文件名，如果不设置则使用 `<uuid>.<ext>` 的格式。
 */
const dgFileJson = (data, filename, ext = "json") => {
    let finalData = data;
    if (!Blob.prototype.isPrototypeOf(data)) {
        finalData = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });
    }
    const file = filename ? filename + "." + ext : v4() + "." + ext;
    saveAs(finalData, file);
};
/**
 * ## 标准函数
 *
 * 打印 React 组件中的特殊查询条件信息，从 `reference.state` 中提取
 *
 * * $terms：列过滤配置，用于存储列过滤的字段和类型。
 * * $filters：表单提交的查询条件配置，主要用于 ExForm 中的过滤提交设置。
 * * $condition：列过滤最终生成的条件信息。
 * * $query：状态中合并的起点查询条件，标配的 Query 结构。
 *
 * 下边是示例结构：
 *
 * ```json
 * {
 *     "pager": {
 *         "page": 1,
 *         "size": 10
 *     },
 *     "sorter": [
 *         "field,DESC"
 *     ],
 *     "criteria": {
 *     },
 *     "projection": []
 * }
 * ```
 *
 * @memberOf module:_debug
 * @param {React.Component} reference React组件引用专用信息
 * @param {String} name 当前条件分析器日志名称
 */
const dgQuery = (reference = {}, name) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.groupCollapsed(`%c [DEBUG] Qr - 条件分析专用日志：`, "background-color:#668B8B;color:white;font-weight:900;", name);
        const {
            $terms,      // 列过滤配置
            $filters,    // 表单提交配置
            $condition,  // 列过滤条件
            $query = {}, // state 中的 $query
        } = reference.state ? reference.state : {};
        const input = reference.props.$query;
        console.debug(`%c [ Or ] props 中的 $query: `, "color:#27408B;font-weight:900;", Abs.clone(input));
        console.debug(`%c [ Or ] state 中的 $terms: `, "color:#B03060;font-weight:900;", Abs.clone($terms));
        console.debug(`%c [ Or ] state 中的 $condition: `, "color:#2F4F4F;font-weight:900;", Abs.clone($condition));
        console.debug(`%c [ Or ] state 中的 $filters: `, "color:#2F4F4F;font-weight:900;", Abs.clone($filters));
        console.debug(`%c [ Or ] state 中的 $query: `, "color:#104E8B;font-weight:900;", Abs.clone($query));
        console.groupEnd();
    }
};
/**
 * ## 标准函数
 *
 * 打印图相关配置和数据信息，内部调用 `dgDebug` 函数，该函数目前只在 GEvent 内部使用。
 *
 * @memberOf module:_debug
 * @param {Object} input 输入的核心数据信息。
 * @param {String} message 打印的消息信息，会追加 GEvent 日志前缀。
 * @param {WebColor} color 色差专用字符串，Web色彩。
 */
const dgGraphic = (input, message, color = "#556B2F") => {
    dgDebug(input, `[ GEvent ] ${message}`, color);
};
/**
 * ## 集成函数
 *
 * 打印两个对象的深度比对结果，打印差异性（比较两个对象专用）。
 *
 * @memberOf module:_debug
 * @param {any} left 对比左值
 * @param {any} right 对比右值
 */
const dgDiff = (left, right) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        if (left && right) {
            console.error(detailedDiff(left, right));
        }
    }
};
/**
 * ## 调试专用函数
 *
 * 打印任务标签
 *
 * @memberOf module:_debug
 * @param {any} input 输入的数据对象
 * @param {String} message 输入信息
 */
const dgTodo = (input, message) => {
    dgDebug(input, `TODO: ${message}`, "#CD0200")
}
export default {
    dgTodo,
    dgRouter,
    dgDiff,
    dgDebug,
    dgQuery,
    dgAjax,
    dgFileJson,
    dgGraphic,
}