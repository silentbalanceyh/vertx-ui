import {v4} from "uuid";
import {detailedDiff} from "deep-object-diff";
import {saveAs} from "file-saver";
import Abs from "./abyss";
import Cv from "./constant";

import React from 'react';
import {Drawer} from "antd";
import T from './unity';
import {DataArray, DataObject, DataRouter, HocI18n, HocI18r} from "entity";

const _layout = (layoutType = {}, window, dft = true) => {
    if (Cv.DEBUG) {
        let message = `%c 「Zero」 [Layout] Layout Selector： label = ${layoutType.label}, key = ${layoutType.key}`;
        console.groupCollapsed(message, "color:#7c8577;font-weight:900");
        console.log(`%c 「Zero」 Window Parameter:`, "color:#006c54", window);
        console.log(`%c 「Zero」 Layout Object information:`, "color:#769149", layoutType);
        console.log(`%c 「Zero」 Layout Revert to default? default = `, dft ? "color:red" : "color:#d96c3", dft);
        console.groupEnd();
    }
};
/**
 * ## 「开发专用」`Ux.dgRouter`
 *
 * UI组件的日志记录器，记录所有的UI组件，打印当前系统中所有存在的路由组件
 * 该方法通常只在react-router的入口文件中使用，开发模式可知道生成代码生成的路由组件做统计。
 *
 * @memberOf module:_develop
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
 * ## 「开发专用」`Ux.dgDebug`
 *
 * （高频函数）通用 DEBUG 调试函数，直接调用即可，用于打印特定数据，第三参数可设置日志的颜色，
 * 如果不设置则使用`#eb2f96`作为默认色彩。
 *
 * ```js
 * import Ux from 'ux';
 * const user = { username:"Lang Yu" };
 * Ux.dgDebug(user, "用户信息");  // 使用默认色彩
 * ```
 *
 * @memberOf module:_develop
 * @param {any} data 推荐使用输入的 Object。
 * @param {Object} prefix 消息前缀。
 * @param {WebColor} color 色彩值。
 * @return {any} 传入什么内容就打印什么内容（方便Fluent调用）。
 */
const dgDebug = (data = {}, prefix, color) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.log(`%c [DEBUG] ${prefix ? prefix : ""}`, `color:white;background-color:${color ? color : "#eb2f96"};font-weight:900;`, data);
    }
    return data;
};

/**
 * ## 「开发专用」`Ux.dgAjax`
 *
 * （高频函数）通用 DEBUG 调试函数，主要调试 Ajax 请求响应专用，在开发模式以及`Z_DEV_MOCK`打开时候使用
 * 主要用于监控Ajax远程请求的数据信息，此处`prefix`为标识，主要用于鉴别在什么位置执行ajax调试专用。
 *
 * @memberOf module:_develop
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
 * ## 「开发专用」`Ux.dgFileJson`
 *
 * （高频函数）通用 DEBUG 抓取数据格式的专用函数，该函数会抓取数据并且生成 Json 文件存储起来
 *
 * @memberOf module:_develop
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
 * ## 「开发专用」`Ux.dgQuery`
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
 * @memberOf module:_develop
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
 * ## 「开发专用」`Ux.dgGraphic`
 *
 * 打印图相关配置和数据信息，内部调用 `dgDebug` 函数，该函数目前只在 GEvent 内部使用，主要用于打印图专用的数据结构，
 * 和 dgDebug 不同的是颜色上会有区别，图日志的默认颜色为`#1A91FF`。
 *
 * @memberOf module:_develop
 * @param {Object} input 输入的核心数据信息。
 * @param {String} message 打印的消息信息，会追加 GEvent 日志前缀。
 * @param {WebColor} color 色差专用字符串，Web色彩。
 */
const dgGraphic = (input, message, color = "#1A91FF") => {
    dgDebug(input, `[ GEvent ] ${message}`, color);
};


/**
 * ## 「开发专用」`Ux.dgDiff`
 *
 * 打印两个对象的深度比对结果，打印差异性（比较两个对象专用）。
 *
 * @memberOf module:_develop
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
 * ## 「开发专用」`Ux.dgTodo`
 *
 * 打印任务标签，颜色会有区别，内部调用dgDebug。
 *
 * @memberOf module:_develop
 * @param {any} input 输入的数据对象
 * @param {String} message 输入信息
 */
const dgTodo = (input, message) => {
    dgDebug(input, `TODO: ${message}`, "#CD0200")
}

/**
 * ## 日志记录器
 *
 * 虽然 Logger 是类，但是在整个 `Zero Ui`框架中，它的调用方式比较特殊，实际上它是
 * JavaScript 中的一个 Object 结构，可直接使用，并且整个环境中只有一个，大部分地方都直接使用了Logger类执行日志输出。
 *
 * ### Logger调用
 *
 * ```js
 * // 非法的使用方法
 * const logger = new Logger();
 *
 * // 合法调用方法，即使是一个类，也需要使用单例模式
 * import Ux from 'ux';
 * Ux.Logger.xxx
 * ```
 *
 * > 日志记录器只在开发环境生效，`NODE_ENV`值为`development`，`DEV_develop`的值为`true`。
 *
 * ### 成员函数表
 *
 * |函数名|说明|
 * |---:|:---|
 * |filters|打印查询条件。|
 * |layout|打印布局模板。|
 * |mock|（模拟环境）打印模拟环境数据。|
 * |render|五阶段的render生命周期日志打印。|
 * |request|Ajax请求数据打印。|
 * |response|Ajax响应数据打印。|
 * |sign|数字签名结果打印。|
 *
 * @class Logger
 */
class Logger {
    /**
     * ## 「标准」`Ux.Logger.sign`
     *
     * 签名过高中的 Http 请求数据，签名结果结构如下：
     *
     * ```json
     * {
     *     "seed": "签名的基础种子值",
     *     "sig": "签名的最终结果sig，前后端必须一致",
     *     "secret": "签名引入的 secret，每个终端不一样（每个用户也可能不一样）"
     * }
     * ```
     *
     * @param {String} uri 请求的Uri地址
     * @param {String} method Http方法信息
     * @param {Object} parameters 请求过程中的参数
     * @param {Object} config 计算的最终签名结果
     */
    static sign(uri, method, parameters, {
        seed, sig, secret
    }) {
        if (Cv.DEBUG) {
            let message = `%c 「Zero」 [Sign] Sign with method ${method}. ( uri = ${uri})`;
            console.groupCollapsed(message, "color:#CCCC33;font-weight:900");
            console.log(`%c 「Zero」 Parameters -> `, 'color:#9999CC;font-weight:900', parameters);
            console.log(`%c 「Zero」 Seed -> `, 'color:#669966;font-weight:900', seed);
            console.log(`%c 「Zero」 Secret -> `, 'color:blue;font-weight:900', secret);
            console.log(`%c 「Zero」 Sig -> `, 'color:red;font-weight:900', sig);
            console.groupEnd();
        }
    };

    /**
     * ## 「标准」`Ux.Logger.response`
     *
     * 打印Ajax请求中的响应数据日志记录
     *
     * @param {Object} data 核心响应数据内容，包含了参数信息
     * @param {Object} params 请求数据内容
     * @param {Request} request 请求对象本身
     * @param {boolean} isMock 是否启用模拟数据的打印
     * @return {Promise<T>} 返回最终的 Promise
     */
    static response(data, params, request = {}, isMock = false) {
        if (Cv.DEBUG) {
            const {
                method,
                url,
                headers,
            } = request;
            let message = `%c <---「Zero」 [Ajax] 接受响应 ${method} ${url}`;
            const theme = isMock ? "color: white; background-color:#52c41a; font-weight:900" : "color:#548B54;font-weight:900";
            console.groupCollapsed(message, theme);
            const it = headers.entries();
            const headerData = {};
            let item = {done: true};
            do {
                item = it.next();
                const entry = item.value;
                if (entry) {
                    headerData[entry[0]] = entry[1];
                }
            } while (!item.done);
            console.log(`%c 「Zero」 Headers -> `, 'color:#c93;font-weight:900', headerData);
            console.log(`%c 「Zero」 Request -> `, 'color:#006699;font-weight:900', params);
            console.log(`%c 「Zero」 Response -> `, 'color:#039;font-weight:900', data);
            console.groupEnd();
        }
        // For fetch api 专用
        return Promise.resolve(data);
    }

    /**
     * ## 「标准」`Ux.Logger.request`
     *
     * 打印Ajax请求中的核心请求数据，发送Ajax之前记录日志。
     *
     * @param {Request} request fetch中的请求对象。
     * @param {Object} parameters 请求的所有数据信息。
     * @param {String} token 安全模式下生成的 token 信息打印。
     */
    static request(request, parameters, token = '') {
        const method = request.method;
        const uri = request.url;
        if (Cv.DEBUG) {
            let message = `%c --->「Zero」 [Ajax] 真实请求 ${method} ${uri}`;
            const color = Cv.SIGN ? "#06C" : "#4682B4";
            console.groupCollapsed(message, `color:${color};font-weight:900`);
            console.log(`%c 「Zero」 Request -> `, 'color:#7A8B8B;font-weight:900', request);
            if (parameters.criteria) {
                console.log(`%c 「Zero」 Criteria -> `, 'color:#DB7093;font-weight:900', parameters.criteria);
            }
            console.log(`%c 「Zero」 Parameters -> `, 'color:#669966;font-weight:900', parameters);
            console.log(`%c 「Zero」 Uri -> `, 'color:#06C;font-weight:900', uri);
            console.log(`%c 「Zero」 Token -> `, 'color:#339966;font-weight:900', token);
            console.groupEnd();
        }
    };

    /**
     * ## 「标准」`Ux.Logger.mock`
     *
     * 打印整个`mock`模拟数据过程中的请求和响应相关数据信息。
     *
     * @param {Request} request fetch中的请求对象。
     * @param {Response} response fetch中的响应数据。
     * @param {String} url 请求对应的RESTful接口地址。
     */
    static mock(request, response, url) {
        if (Cv.DEBUG && Cv.MOCK) {
            let message = `%c --->「Zero」 [Ajax] 模拟请求 ${url ? url : ""}`;
            console.groupCollapsed(message, "color:white;background-color:#CD0000;font-weight:900;");
            if (request) {
                console.log("%c 「Zero」 Mock request -> ", 'color:#99CC33', request);
            } else {
                console.log("%c 「Zero」 Mock request -> ( Promise Mode Directly )", 'color:#99CC33');
            }
            console.log("%c 「Zero」 Mock response -> ", 'color:#0099FF', response);
            console.groupEnd();
        }
        return response;
    };

    /**
     * ## 「标准」`Ux.Logger.filters`
     *
     * 日志记录不同的查询函数相关信息，config数据结构如下：
     *
     * ```json
     * {
     *     "input": "输入的查询条件",
     *     "query": "props 中的查询条件 -> $query",
     *     "filters": "state 中的列过滤条件 -> $filters",
     *     "cond": "state 中的外置查条件 -> $condition"
     * }
     * ```
     *
     * > 打印过滤条件专用日志记录器！
     *
     * @param {React.Component} reference React组件引用。
     * @param {Object} config 基本查询配置。
     */
    static filters(reference = {}, {
        input = {}, query = {}, filters = {}, cond
    }) {
        if (Cv.DEBUG) {
            let message = `%c 「Zero」 [Filter] Filters Data Process`;
            console.groupCollapsed(message, "color:red;font-weight:900");
            console.log(`%c 「Zero」 Input Query -> `, 'color:#009900;font-weight:900', input);
            console.log(`%c 「Zero」 Prop Query -> `, 'color:#660099;font-weight:900', query);
            console.log(`%c 「Zero」 Search Filter -> `, 'color:#0099FF;font-weight:900', filters);
            console.log(`%c 「Zero」 Cond -> `, 'color:blue;font-weight:900', cond);
            console.groupEnd();
        }
    }

    /**
     * ## 「标准」`Ux.Logger.render`
     *
     * Logger中的表单不同生命周期的日志记录器。
     *
     * ### phase 阶段
     *
     * 阶段值的含义：
     *
     * 1. 阶段`1`：表单开始初始化配置信息。
     * 2. 阶段`2`：字段信息打印，处理 optionItem, optionJsx 配置信息。
     * 3. 阶段`3`：打印最终结果。
     * 4. 阶段`4`：布局打印，内部调用`layout`方法。
     * 5. 阶段`5`：行配置专用处理，row configuration 信息。
     *
     * ### item 配置
     *
     * 对应Json中的每个字段的配置，结构如：
     *
     * ```json
     * {
     *     "field": "字段名称",
     *     "optionItem": "<Form.Item> 对应配置",
     *     "optionJsx": "组件本身所需配置",
     *     "optionConfig": "特殊配置"
     * }
     * ```
     *
     * ### key 配置
     *
     * 记录了基本的表单信息，如 window, default, columns 等基本表单信息。
     *
     * @param {Number} phase 渲染表单的生命周期。
     * @param {any} item 输入的相关信息。
     * @param {any} key 配置基本数据，如 window, dft 等表单所需。
     */
    static render(phase = 1, item = {}, key = {}) {
        if (Cv.DEBUG && Cv.DEBUG_FORM) {
            if (5 === phase) {
                // 开始打印
                const message = `%c 「Zero」 [Render] Row Config --> ${key}`;
                console.log(message, "color:#39f;font-weight:900", item);
            } else if (4 === phase) {
                // 打印模板
                _layout(item, key.window, key.dft);
            } else if (3 === phase) {
                // 关闭
                console.groupEnd();
            } else if (2 === phase) {
                // 打印字段
                if (item.optionItem) {
                    const mode = key ? `"Jsx"` : `"Hoc"`;
                    const message = `%c 「Zero」 [Render] (${mode}) name="${item.field}", label="${item.optionItem.label}"`;
                    console.groupCollapsed(message, `color:white;font-weight:900`);
                    console.log(`%c 「Zero」 Render mode: `, "color:#0c0", mode);
                    console.log(`%c 「Zero」 Field optionItem: `, "color:#06c", item.optionItem);
                    console.log(`%c 「Zero」 Field optionJsx：`, "color:#660", item.optionJsx);
                    console.groupEnd();
                }
            } else {
                // 开始打印
                const message = `%c 「Zero」 [Render] Form configuration --> ${key}`;
                console.groupCollapsed(message, "color:#0066CC;font-weight:900", item);
            }
        }
    };

    /**
     * ## 「标准」`Ux.Logger.layout`
     *
     * Logger中的方法调用，打印布局相关日志，配置参数的结构如下：
     *
     * ### layoutType
     *
     * ```json
     * {
     *     "label": "标签显示文本",
     *     "key": "根据布局计算的key值，四位数字"
     * }
     * ```
     *
     * @param {Object} layoutType 布局类型。
     * @param {Number} window Form中的 window 专用参数。
     * @param {Number} dft Form中的 window 的默认值打印。
     */
    static layout(layoutType = {}, window, dft = true) {
        return _layout(layoutType, window, dft);
    }
}

// -------------------- 开发工具专用方法（监视器）--------------------------
const DevTool = (reference) => {
    const keyFn = (event) => {
        // `Home` key
        if (36 === event.keyCode) {
            reference.setState({__MONITOR: true});
        }
    }
    const keyAdd = (name) => {
        let data = T.Session.get(Cv.KEY_MDATA);
        if (!data) {
            data = [];
        }
        if (!data.includes(name)) {
            data.push(name);
            T.Session.put(Cv.KEY_MDATA, data);
        }
    }
    const dataItem = (value, name) => {
        const metadata = {};
        metadata.name = name;
        if ("function" === typeof value) {
            metadata.type = "Function";
        } else if ("boolean" === typeof value) {
            metadata.type = "Boolean";
            metadata.value = value;
        } else if ("string" === typeof value) {
            metadata.type = "String";
            metadata.value = value;
        } else {
            if ("children" === name) {
                metadata.type = "ReactChildren"
            } else {
                if (value instanceof React.Component) {
                    metadata.type = "React";
                } else if (value instanceof DataObject) {
                    metadata.type = "DataObject";
                    if (value.is()) {
                        metadata.value = value.to();
                    }
                } else if (value instanceof DataArray) {
                    metadata.type = "DataArray";
                    if (value.is()) {
                        metadata.value = value.to();
                    }
                } else if (value instanceof DataRouter) {
                    metadata.type = "DataRouter";
                    const valueData = {};
                    valueData.uri = value.path();
                    valueData.params = value.params();
                    metadata.value = valueData;
                } else if (value instanceof HocI18n ||
                    value instanceof HocI18r) {
                    metadata.type = "HocI18";
                    metadata.value = value.to();
                } else {
                    if (value) {
                        if (Abs.isFunction(value.to)) {
                            metadata.type = "Zero";
                            metadata.value = value.to();
                        } else {
                            if (Abs.isArray(value)) {
                                metadata.type = "Array";
                                metadata.value = value;
                            } else if (Set.prototype.isPrototypeOf(value)) {
                                metadata.type = "Set";
                                metadata.value = value;
                            } else {
                                metadata.type = "Object";
                                metadata.value = value;
                            }
                        }
                    } else {
                        metadata.type = "Undefined";
                        metadata.value = value;
                    }
                }
            }
        }
        return metadata;
    }
    const dataNorm = (props = {}, state = {}) => {
        const $props = {};
        Object.keys(props)
            .filter(field => "__MONITOR" !== field)
            .filter(field => "form" !== field)
            .filter(field => {
                const component = props[field];
                if (component) {
                    return !component.hasOwnProperty('_reactInternalFiber');
                } else return true;
            })
            .forEach(field => $props[field] = dataItem(props[field], field));
        const $state = {};
        Object.keys(state)
            .filter(field => "__MONITOR" !== field)
            .filter(field => "raft" !== field)
            .forEach(field => $state[field] = dataItem(state[field], field));
        return {
            props: $props,
            state: $state,
        }
    }
    return ({
        on: () => {
            if (Cv.MONITOR) {
                document.addEventListener(`keydown`, keyFn);
            }
        },
        off: () => {
            if (Cv.MONITOR) {
                document.removeEventListener(`keydown`, keyFn);
            }
        },
        render: (UIContent) => {
            if (Cv.MONITOR) {
                const {__MONITOR = false} = reference.state;
                // Monitor 主界面
                return (
                    <Drawer visible={__MONITOR}
                            placement={"bottom"}
                            className={"web-develop"}
                            title={"Zero Ui Development Debug Monitor"}
                            height={"95%"} destroyOnClose
                            onClose={() => reference.setState({__MONITOR: false})}>
                        {UIContent ? (<UIContent/>) : false}
                    </Drawer>
                );
            } else {
                return false;
            }
        },
        initialize: () => {
            if (Cv.MONITOR) {
                const data = T.Session.get(Cv.KEY_MDATA);
                const dataArray = [];
                if (data) {
                    data.forEach(dataKey => dataArray.push(T.Session.get(dataKey)));
                }
                return dataArray;
            } else return [];
        },
        // 数据存储方法
        store: async (name) => {
            if (Cv.MONITOR) {
                const {props, state} = reference;
                const keyName = Cv.KEY_MDATA + name;
                // 先添加组件所有的 key 值
                keyAdd(keyName);
                const normalized = dataNorm(props, state);
                normalized.name = name;
                T.Session.put(keyName, normalized);
            }
        },
        // 数据清除方法
        clean: async (input) => {
            const data = T.Session.get(Cv.KEY_MDATA);
            if (data) {
                data.forEach(dataKey => T.Session.remove(dataKey))
            }
            T.Session.remove(Cv.KEY_MDATA);
            return input;
        }
    })
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    Logger,     // 专用日志器
    DevTool,    // 专用调试器
    dgTodo,
    dgRouter,
    dgDiff,
    dgDebug,
    dgQuery,
    dgAjax,
    dgFileJson,
    dgGraphic,
}