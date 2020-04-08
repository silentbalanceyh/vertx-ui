// 导入第三方
import U from "underscore";
// 导入外层
import Cv from '../constant';

const _reportObject = (lib = {}, kv = []) => {
    const result = {};
    Object.keys(lib)
        .filter(key => !U.isFunction(lib[key]))
        .forEach(key => result[key] = lib[key]);
    const prefix = kv[0] + kv[2];
    console.log(`%c ${prefix} （ Class ）: `, `font-weight:900;color:${kv[1]}`, result);
};
const _reportShared = (lib, kv, fnFilter, appended) => {
    const result = {};
    const append = appended ? appended : `${kv[2]}XXX`;
    Object.keys(lib)
        .filter(key => U.isFunction(lib[key]))
        .filter(fnFilter)
        .forEach(key => result[key] = lib[key]);
    const prefix = kv[0] + append;
    console.log(`%c ${prefix} （ Function ）: `, `font-weight:900;color:${kv[1]}`, result);
};
const _reportFunction = (lib, kv) => _reportShared(lib, kv, key => key.startsWith(kv[2]));
const _reportOther = (lib, kv) => {
    const splitted = kv[2].split(':')[1].split('`');
    const fnFilter = (key) => {
        const filtered = splitted.filter(item => key.startsWith(item));
        return 0 === filtered.length;
    };
    _reportShared(lib, kv, fnFilter, "XXX");
};

const _reportEach = (expr, library = {}) => {
    const kv = expr.split(',');
    if (kv[2]) {
        if (U.isObject(library)) {
            if ("OBJECT" !== kv[2]) {
                if (kv[2].startsWith("OTHER")) {
                    _reportOther(library, kv);
                } else {
                    _reportFunction(library, kv);
                }
            } else {
                _reportObject(library, kv);
            }
        }
    } else {
        console.log(`%c ${kv[0]} （ All ）: `, `font-weight:900;color:${kv[1]}`, library);
    }
};
/**
 * ## 标准函数
 *
 * 该函数直接生成框架报表，在最早的 console 中打印，内部调用代码如：
 *
 * ```js
 * const input = {
 *      E,
 *      develop,
 *      abs,
 *      element,
 *      entity,
 *      graphic,
 *      unity,
 *      ajax,
 *      engine,
 * };
 * export default () => E.fxReport(input, config);
 * ```
 *
 * @memberOf module:_error
 * @param {Object} data 需要生成报表的数据
 * @param {Object} config 是需要解析的
 * @return {Object} 返回生成的报表数据
 */
const fxReport = (data, config = {}) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.groupCollapsed(`%c 「Zero」 Zero UI Framework / Tool Report ( Ux )`, "font-weight:900;color:#369");
        /*
         * 迭代：data / config 都是二层对象
         */
        Object.keys(data).forEach((key) => {
            /*
             * 一层处理
             * data[key] 是库
             * config[key] 是数组，每个元素是需要解析的内容
             */
            const array = config[key];
            if (U.isArray(array)) {
                array.forEach(expr => _reportEach(expr, data[key]));
            }
        });
        console.groupEnd();
    }
    return data;
};
/**
 * ## 标准函数
 *
 * 只会使用在 Redux 环境中的响应处理器，目前是框架内部使用，带监控流程生成日志。
 *
 * 内部调用代码如下：
 *
 * ```js
 * const actionType = $action.ofType(type.getType());
 * const source = from(actionType);
 * return source.pipe(
 *      map(action => action.payload),
 *      map(promise),
 *      switchMap(promise => from(promise).pipe(
 *          map(responser),
 *          map(E.fxRedux),
 *          map(data => Rdx.dataOut(data))
 *      ))
 * );
 * ```
 *
 * @memberOf module:_error
 * @param {String|Object} object 传入的数据信息。
 * @param {any} original 原始数据问题。
 * @return {any} 传入什么返回什么，使用函数链操作。
 */
const fxRedux = (object, original) => {
    if (Cv.DEBUG) {
        let message = `%c 「Zero」 Redux Data Flow`;
        console.groupCollapsed(message, "color:white;background-color:#09c;font-weight:100");
        if ("string" === typeof object) {
            console.log("「Zero」 Redux Key: ", object);
        } else {
            console.log("「Zero」 Object Data: ", object);
        }
        console.log("「Zero」 Original Data: ", original);
        console.groupEnd();
    }
    // 解决Redux中的数据问题
    return object;
};
export default {
    fxReport,
    fxRedux
}