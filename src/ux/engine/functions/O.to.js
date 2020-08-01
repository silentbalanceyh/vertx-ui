import Cv from "../../constant";
import Ele from '../../element';
import Abs from "../../abyss";

/**
 * ## 标准函数
 *
 * 生成 Grid 布局的宽度运算，表单中专用，1、2、3、4列不同布局处理。
 *
 * ```json
 * {
 *     grid: "数值，不同数值对应不同宽度"
 * }
 * ```
 *
 *
 * | grid值 | 宽度 |
 * |:---|:---|
 * | 5 | 20% |
 * | 4 | 25% |
 * | 3 | 33.33% |
 * | 2 | 50% |
 * | 1 | 100% |
 *
 * @memberOf module:_to
 * @param {Object} config 传入配置数据
 * @returns {Object} 返回 style 属性
 */
const toGrid = (config = {}) => {
    const {grid = 3} = config;
    const style = {};
    switch (grid) {
        case 5:
            style.width = "20%";
            break;
        case 4:
            style.width = "25%";
            break;
        case 3:
            style.width = "33.33%";
            break;
        case 2:
            style.width = "50%";
            break;
        case 1:
            style.width = "100%";
            break;
        default: {
            console.error("[ Ux ] 暂时不支持该值：", grid);
            break;
        }
    }
    return style;
};
/**
 * ## 标准函数
 *
 * 根据列计算 span / offset 等相关信息，用于对
 *
 * @memberOf module:_to
 * @param {Number} columns 列信息
 * @param {Number} index 是否纳入 index 执行计算
 * @return {Object} 返回可用于 Col 的属性
 */
const toGridSpan = (columns = 4, index = 0) => {
    const attrs = {};
    if (1 === columns) {
        attrs.span = 24;
    } else if (2 === columns) {
        attrs.span = 12;
    } else if (3 === columns) {
        attrs.span = 8;
    } else if (4 === columns) {
        attrs.span = 6;
    } else if (5 === columns) {
        attrs.span = 4;
        if (0 < index) {
            attrs.offset = 1;
        }
    }
    return attrs;
}
/**
 * ## 标准函数
 *
 * 根据修正宽度计算组件最大高度信息，按分辨率智能切换。
 *
 * @memberOf module:_to
 * @param {Number} adjust 修正高度值。
 * @returns {number} 返回最终计算的页面高度值。
 */
const toHeight = (adjust = 0) => {
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
    let maxHeight = height;
    if (1024 < width && width <= 1400) {
        // 直接计算（郑州项目）
        maxHeight = height - 48 - adjust;
    } else if (1400 < width && width < 1900) {
        maxHeight = height - 72 - adjust;
    } else if (1900 < width) {
        maxHeight = height - 96 - adjust;
    }
    return maxHeight;
};
/**
 * ## 标准函数
 *
 * 执行CSS前缀的注入流程。
 *
 * @memberOf module:_to
 * @param {String} name 当前类名称。
 * @returns {string} 返回带前缀的 css 类名。
 */
const toCss = (name) => `${Cv['CSS_PREFIX']}-${name}`;
/**
 * ## 标准函数
 *
 * 消息配置转换函数
 *
 * 1. error = true：最终调用 message.error 处理。
 * 2. error = false：最终调用 message.success 处理。
 *
 * @memberOf module:_to
 * @param {String} content 内容信息。
 * @param {boolean} error 是否呈现错误信息。
 * @returns {Object} 返回消息配置。
 */
const toMessage = (content, error = false) => {
    if (content) {
        const config = {};
        config.modal = {};
        if (error) {
            config.modal.error = {content};
        } else {
            config.modal.success = {content};
        }
        return config;
    }
};
/**
 * ## 标准函数
 *
 * 生成 Assist / Tabular 专用键值数据。
 *
 * @memberOf module:_to
 * @param {String} key `Assist/Tabular`辅助数据的 key 值。
 * @param {boolean} assist 是否 Assist 直接数据。
 * @returns {string} 生成最终键。
 */
const toKey = (key, assist = true) => {
    if (assist) {
        return `$a_${key.replace(/\./g, '_')}`;
    } else {
        return `$t_${key.replace(/\./g, '_')}`;
    }
};
/**
 * ## 标准函数
 *
 * 1. 如果 data 是 Object，则针对 data 中的任何一个对象的 `uri` 执行路由转换。
 * 2. 如果 data 是 Array，则针对 data 中的任何一个元素对象执行 `uri` 转换。
 * 3. 如果 data 是 String，则直接执行转换。
 *
 * @memberOf module:_to
 * @param {String|Object} data 输入的转换源。
 * @param {DataObject} $app 应用程序对象。
 * @returns {string|any} 转换的最终数据。
 */
const toLink = (data, $app) => {
    if (!data) data = [];
    if (Abs.isArray(data)) {
        return data.map(item => toLink(item, $app));
    } else {
        if ("string" === typeof data) {
            const path = $app._("path") ? $app._("path") : Cv.Env['ROUTE'];
            if (!data.startsWith("/")) {
                data = `/${data}`;
            }
            let relatedPath = `${path}${data}`;
            if (!relatedPath.startsWith('/')) {
                relatedPath = `/${relatedPath}`;
            }
            return relatedPath;
        } else if (Abs.isObject(data)) {
            data.uri = toLink(data.uri, $app);
            return data;
        }
    }
};
/**
 * ## 标准函数
 *
 * 根据列信息自动计算表格宽度，计算值会包含多种不同的列值。
 *
 * @memberOf module:_to
 * @param {Array} columns 列配置数组
 * @returns {number} 返回最终宽度
 */
const toX = (columns = []) => {
    let x = 0;
    columns.forEach(column => {
        if (column.hasOwnProperty('width')) {
            x += Ele.valueInt(column.width, 144);
        } else {
            x += 200;
        }
    });
    return x;
};
/**
 * ## 标准函数
 *
 * 如果是中文字符返回长度 2，如果是英文字符返回长度 1，可计算像素。
 *
 * @memberOf module:_to
 * @param {String} literal 输入字符。
 * @returns {number} 返回字符宽度。
 */
const toWidth = (literal = "") => {
    if ("string" === typeof literal) {
        let width = 0;
        for (let idx = 0; idx < literal.length; idx++) {
            const str = String(literal.charAt(idx));
            if (Abs.isCn(str)) {
                width += 2;
            } else {
                width += 1;
            }
        }
        return width;
    } else return -1;
};
/**
 * ## 标准函数
 *
 * data的数据结构
 *
 * ```json
 * {
 *     "list": [],
 *     "count":10
 * }
 * ```
 *
 * 查询条件类
 *
 * ```json
 * {
 *     "pager":{
 *         "page": 1,
 *         "size": 10
 *     },
 *     "criteria": {
 *
 *     },
 *     "sorter":[],
 *     "projection":[]
 * }
 * ```
 *
 * @param {Object} data 数据信息
 * @param {Object} query 查询条件专用雷
 * @param {Object} config 额外的配置
 * @returns 返回生成好的 Table 专用的 pagination
 */
const toPagination = (data = {}, query = {}, config = {}) => {
    const pagination = {};
    const {pager = {}} = query;
    pagination.current = pager.page ? pager.page : 1;
    pagination.pageSize = pager.size ? pager.size : 10;
    pagination.total = data.count ? data.count : 0;
    Object.assign(pagination, config);
    return pagination;
}
export default {
    toHeight,
    toGrid,
    toGridSpan,
    toMessage,

    toCss,  // /* 根据 CSS_PREFIX 前缀计算的 Class */
    toKey,  // 生成 assist / tabular 相关 key
    toLink,
    toX,    // 表格专用列生成
    toWidth, // 计算字符串长度，中文字 x 2

    toPagination, // 根据传入的数据转换
}