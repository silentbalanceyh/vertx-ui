import Ajax from './L.ajax';
import Filter from './L.filters';
import Ui from './L.ui';

/**
 * ## 日志记录器
 *
 * 虽然 Logger 是类，但是在整个 `Zero Ui`框架中，它的调用方式比较特殊，实际上它是
 * JavaScript 中的一个 Object 结构，可直接使用，并且整个环境中只有一个。
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
 * > 日志记录器只在开发环境生效，`NODE_ENV`值为`development`，`DEV_DEBUG`的值为`true`。
 *
 * @class Logger
 *
 */
class Logger {
    /**
     * ## 标准函数
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
    static sign(uri, method, parameters, config) {
        return Ajax.sign(uri, method, parameters, config);
    };

    /**
     * ## 标准函数
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
        return Ajax.response(data, params, request, isMock);
    }

    /**
     * ## 标准函数
     *
     * 打印Ajax请求中的核心请求数据，发送Ajax之前记录日志。
     *
     * @param {Request} request fetch中的请求对象。
     * @param {Object} parameters 请求的所有数据信息。
     * @param {String} token 安全模式下生成的 token 信息打印。
     */
    static request(request, parameters, token = '') {
        return Ajax.request(request, parameters, token);
    };

    /**
     * ## 标准函数
     *
     * 打印整个`mock`模拟数据过程中的请求和响应相关数据信息。
     *
     * @param {Request} request fetch中的请求对象。
     * @param {Response} response fetch中的响应数据。
     * @param {String} url 请求对应的RESTful接口地址。
     */
    static mock(request, response, url) {
        return Ajax.mock(request, response, url);
    };

    /**
     * ## 标准函数
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
    static filters(reference = {}, config = {}) {
        return Filter.filters(reference, config);
    }

    /**
     * ## 标准函数
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
        return Ui.render(phase, item, key);
    };

    /**
     * ## 标准函数
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
        return Ui.layout(layoutType, window, dft);
    }
}

export default Logger;