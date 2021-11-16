import Cv from "../../constant";
import Ele from '../../element';
import Abs from "../../abyss";
import filesize from 'file-size';

/**
 * ## 「标准」`Ux.toHeight`
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
    /* 模拟过后的基础宽度 */
    /*
    * 计算头部宽度
    * 整个框架中唯一一个 ux-header 的元素，存在于
    * */
    const eleHeader = document.getElementById("__ELE_HEADER");
    // 基础高度（计算Header占用的基本高度
    let baseHeight;
    if (eleHeader) {
        /*
         * 直接根据 Header 计算
         * 整个系统中只有一个 __ELE_HEADER，存在于模板顶部
         */
        baseHeight = eleHeader.offsetHeight;
    } else {
        /*
         * 如果找不到，则根据分辨率来计算基础高度
         * 1024 x 768, 1009, 768
         * 1280 x 1024, 1265, 913
         * 1366 x 720, 1351, 720
         * 1440 x 900, 1440, 789
         * 1680 x 1050, 1665, 939
         * 1920 x 1080, 1920, 969
         * 1920 x 1200, 1905, 1066
         * 计算方法，width 有一个最大值不可突破，先区分分辨率的区域
         */
        if (width <= 1024) {
            console.error("您使用的分辨率过小，有可能会显示不正常！")
            /**
             * 1024 x 768
             */
            baseHeight = 32;
        } else if (1024 < width && width <= 1280) {
            /**
             * 1280 x 1024
             */
            baseHeight = 48;
        } else if (1280 < width && width <= 1366) {
            /*
             * 1366 x 720
             */
            baseHeight = 48;
        } else if (1366 < width && width <= 1440) {
            /*
             * 1440 x 900
             */
            baseHeight = 48;
        } else if (1440 < width && width <= 1680) {
            /*
             * 1680 x 1050
             */
            baseHeight = 56;
        } else if (1680 < width && width <= 1920) {
            /*
             * 1920 x 1080
             */
            baseHeight = 56;
        } else {
            /*
             * > 1920（高清）
             */
            baseHeight = 56;
        }
    }
    return (height - baseHeight - adjust);
};


/**
 * ## 「引擎」`Ux.toGrid`
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
 * ## 「引擎」`Ux.toGridSpan`
 *
 * 根据列计算 span / offset 等相关信息，针对布局执行核心操作。
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
 * ## 「标准」`Ux.toCss`
 *
 * 执行CSS前缀的注入流程，根据环境变量中配置的`Z_CSS_PREFIX`来追加CSS类名的前缀。
 *
 * @memberOf module:_to
 * @param {String} name 当前类名称。
 * @returns {string} 返回带前缀的 css 类名。
 */
const toCss = (name) => `${Cv['CSS_PREFIX']}-${name}`;


/**
 * ## 「标准」`Ux.toMessage`
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
 * ## 「标准」`Ux.toKey`
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
 * ## 「标准」`Ux.toLink`
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
 * ## 「引擎」`Ux.toX`
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
 * ## 「标准」`Ux.toWidth`
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
 * ## 「引擎」`Ux.toPagination`
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
 * @memberOf module:_to
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


/**
 * ## 「标准」`Ux.toHeightState`
 *
 * 高度修正专用的状态生成器：
 *
 * ```json
 * {
 *     $heightStyle: {
 *          style: {
 *              maxHeight
 *          }
 *     },
 *     $heightValue: number
 * }
 * ```
 *
 * @memberOf module:_to
 * @param {Number} adjust 修正高度值。
 * @returns {Object} 返回最终状态的数据结构
 */
const toHeightState = (adjust) => {
    const maxHeight = toHeight("number" === typeof adjust ? adjust : 0);
    const state = {};
    state.$heightStyle = {
        style: {
            maxHeight
        }
    }
    state.$heightValue = maxHeight;
    return state;
}
/**
 * ## 「标准」`Ux.toFileSize`
 *
 * 读取文件大小专用方法，解析成合适方法
 *
 * @memberOf module:_to
 * @param {Number} value 修正高度值。
 * @param {String} unit 单位信息
 * @returns {Object} 返回最终状态的数据结构
 */
const toFileSize = (value, unit) => {
    const normalize = Ele.valueFloat(value, 0.0);
    const size = filesize(normalize);
    if (unit) {
        return `${size.to(unit)}${unit}`;
    } else {
        const units = ['B', 'KB', 'MB', 'GB', 'TB']
        let result = normalize;
        units.forEach((unit, index) => {
            if (Math.pow(1024, index) < normalize
                && normalize < Math.pow(1024, index + 1)) {
                result = toFileSize(normalize, unit);
            }
        })
        return result;
    }
}
export default {
    toHeight,
    toHeightState,
    toGrid,
    toGridSpan,
    toMessage,
    toFileSize,

    toCss,  // /* 根据 CSS_PREFIX 前缀计算的 Class */
    toKey,  // 生成 assist / tabular 相关 key
    toLink,
    toX,    // 表格专用列生成
    toWidth, // 计算字符串长度，中文字 x 2

    toPagination, // 根据传入的数据转换
}