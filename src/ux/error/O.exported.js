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
const reportExported = (data, config = {}) => {
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

export default {
    reportExported
}