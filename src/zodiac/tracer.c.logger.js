import __Zn from './zero.module.dependency';

const _layout = (layoutType = {}, window, dft = true) => {
    if (__Zn.Env.DEBUG) {
        let message = `%c 「Zero」 [Layout] Layout Selector： label = ${layoutType.label}, key = ${layoutType.key}`;
        console.groupCollapsed(message, "color:#7c8577;font-weight:900");
        console.log(`%c 「Zero」 Window Parameter:`, "color:#006c54", window);
        console.log(`%c 「Zero」 Layout Object information:`, "color:#769149", layoutType);
        console.log(`%c 「Zero」 Layout Revert to default? default = `, dft ? "color:red" : "color:#d96c3", dft);
        console.groupEnd();
    }
};

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
 * @name zodiac.Logger
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
        if (__Zn.Env.DEBUG_DEV) {
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
        if (__Zn.Env.DEBUG_DEV) {
            const {
                method,
                url,
                headers,
            } = request;
            let message = `%c <---「Zero」 [Ajax] 接受响应 ${method} ${url}`;
            const theme = isMock ? "color: white; background-color:#52c41a; font-weight:900" : "color:#548B54;font-weight:900";
            console.groupCollapsed(message, theme);

            console.groupCollapsed("%c 「Zero」 Headers -> ", 'color:#c93;font-weight:900')
            if (headers) {
                for (const [key, value] of headers) {
                    console.log(`%c 「Zero」 Header -> ${key} = ${value}`, 'color:#7A8B8B;font-weight:900')
                }
            }
            console.groupEnd();

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
        if (__Zn.Env.DEBUG_DEV) {
            let message = `%c --->「Zero」 [Ajax] 真实请求 ${method} ${uri}`;
            const color = __Zn.Env.SIGN ? "#06C" : "#4682B4";
            console.groupCollapsed(message, `color:${color};font-weight:900`);
            console.log(`%c 「Zero」 Request -> `, 'color:#7A8B8B;font-weight:900', request);
            // headers 单独打印调试
            console.groupCollapsed("%c 「Zero」 Headers -> ", 'color:#c93;font-weight:900')
            const {headers} = request;
            if (headers) {
                for (const [key, value] of headers) {
                    console.log(`%c 「Zero」 Header -> ${key} = ${value}`, 'color:#7A8B8B;font-weight:900')
                }
            }
            console.groupEnd();
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
        if (__Zn.Env.DEBUG_DEV && __Zn.Env.MOCK) {
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
        if (__Zn.Env.DEBUG_DEV) {
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
        if (__Zn.Env.DEBUG_DEV && __Zn.Env.DEBUG_FORM) {
            // Step 1：表单打印第一步，直接开始打印
            if (1 === phase) {
                const message = `%c 「FORM」表单基础配置：Configuration --> ${key}`;
                console.groupCollapsed(message, "color:#0066CC;font-weight:900",
                    `Grid = ${item?.columns}, Layout = ${item?.window}`);
                return;
            }
            // Step 2：属性布局部分处理
            if (4 === phase) {
                let message = `%c「FORM」单元格 / 布局`;
                const {layoutType} = item;
                console.groupCollapsed(message, "color:#7c8577;font-weight:900");
                console.log(`%c 「Zero」基本配置: `, "color:#006c54", `Label = ${item.label}, Key = ${item.key}`);
                console.log(`%c 「Zero」布局类型详情:`, "color:#769149", layoutType);
                console.log(`%c 「Zero」是否采用默认值? Default = `, key.dft ? "color:red" : "color:#d96c3", key.dft);
                console.groupEnd();
                return;
            }
            if (5 === phase) {
                // Step3: 开始打印
                const message = `%c「FORM」表单行独立配置：RowConfig --> ${key}`;
                console.log(message, "color:#39f;font-weight:900",
                    `Key = ${item.key}, ClassName = ${item.className}`);
                return;
            }
            if (2 === phase) {
                // 打印字段
                if (item.optionItem) {
                    const mode = key ? `"Jsx"` : `"Hoc"`;
                    const message = `%c「FORM」单元格 / 内容：(渲染模式：${mode}) name="${item.field}", label="${item.optionItem.label}"`;
                    console.groupCollapsed(message, `color:#006c54;font-weight:900`);
                    console.log(`%c 「FORM」字段配置 optionItem: `, "color:#06c", item.optionItem);
                    console.log(`%c 「FORM」字段配置 optionJsx：`, "color:#660", item.optionJsx);
                    console.groupEnd();
                }
            }
            // 最终结果
            if (3 === phase) {
                console.groupEnd();
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

export default Logger