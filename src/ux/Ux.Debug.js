import {saveAs} from "file-saver";
import v4 from "uuid";
import Constant from './cv/Ux.Constant';
import Value from './Ux.Value';
import U from 'underscore';

/**
 * 将传入的值`data`下载成一个文件保存，文件名系统生成，该文件名被转换过，所以调用时使用Ux调用
 * @method dgFileJson
 * @param {Object|Array} data 传入的数据
 * @param ext 保存的文件格式后缀名，默认为.json
 * @param filename 需要固定的文件前缀
 * @example
 *
 *      // 设置文件中将保存的数据
 *      const data = {
 *          username:"Lang",
 *          password:"Lang"
 *      };
 *      Ux.dgFileJson(data);
 */
const dgFileJson = (data, ext = "json", filename) => {
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
 * 【Development Only】
 * 在调试模式才启用的Form专用打印信息，打印Form初始化过程中的表单数据
 * 支持两种模式：updated = true为更新Form时的数据，updated = false则是添加时的数据
 * @method dgForm
 * @param {React.PureComponent} reference 包含了form变量的React的组件Component引用
 * @param data 当前Form中的表单数据
 * @param updated 判断当前调试使用的是更新/添加模式
 */
const dgForm = (reference, data = {}, updated = false) => {
    if (Boolean("development" === process.env.NODE_ENV && Constant.DEBUG)) {
        console.groupCollapsed("[Form] Form metadata when initialized. updated = ", updated);
        console.info("Init Value = ", data);
        console.info("Init Function = ", reference.props.fnInit);
        console.groupEnd();
    }
};
/**
 * 【Development Only】
 * Ux包的报表专用调试方法，整个应用中只有一处调用该方法
 * @method dgScript
 * @param ux Ux工具包
 * @param Cv 常量信息
 */
const dgScript = (ux = {}, Cv = {}) => {
    if (Boolean("development" === process.env.NODE_ENV && Constant.DEBUG)) {
        console.groupCollapsed("[Ux] Constant Value is as following:");
        console.info("[Ux] Ux Tool = ", ux);
        console.info("[Ux] Cv = ", Cv);
        console.groupEnd();
    }
};
/**
 * 【Development Only】
 * 自动生成路由中的路由报表，可查看所有的路由信息
 * @method dgRouter
 * @param Ux 工具箱
 * @param container Layout模板配置信息
 * @param component Page组件配置信息
 */
const dgRouter = (Ux, container, component) => {
    if (Boolean("development" === process.env.NODE_ENV && Constant.DEBUG)) {
        console.groupCollapsed("[Zero] UI Component Report:");
        console.info("[Ux] Container = ", container);
        console.info("[Ux] Component = ", component);
        console.groupEnd();
    }
};
/**
 * 【Development Only】
 * Rxjs专用调试打印方法，执行过后返回data
 * @method dgMonitor
 * @param data 传入需要打印的数据信息
 * @param second 传入的第二个参数，对比打印时需要
 * @return 返回传入的数据
 */
const dgMonitor = (data, second) => {
    if (Boolean("development" === process.env.NODE_ENV && Constant.DEBUG)) {
        const $data = data ? Value.clone(data) : data;
        const $second = second ? Value.clone(second) : second;
        console.debug("[Ux] Debug: ", $data, $second);
    }
    return data;
};
const dgDebug = (data, prefix) => {
    if (Boolean("development" === process.env.NODE_ENV && Constant.DEBUG)) {
        console.debug(`%c [DEBUG] ${prefix ? prefix : ""}`, "color:white;background-color:#c30;font-weight:900;",
            data);
    }
    return data;
};

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
/**
 * 1. `ensure`工具类：Zero UI内部专用断言工具类
 * 2. `dg`工具类：开发人员调试常用工具类
 * @module Ux
 * @class Debug
 */
const dgReport = (data, prefix = [], library = []) => {
    if (Boolean("development" === process.env.NODE_ENV && Constant.DEBUG)) {
        console.groupCollapsed(`%c [Zero] Zero UI Framework / Tool Report ( Ux )`, "font-weight:900;color:#369");
        prefix.forEach((item, index) => {
            const kv = item.split(',');
            const lib = library[index];
            if (kv[2]) {
                if (U.isObject(lib)) {
                    if ("OBJECT" !== kv[2]) {
                        if (kv[2].startsWith("OTHER")) {
                            _reportOther(lib, kv);
                        } else {
                            _reportFunction(lib, kv);
                        }
                    } else {
                        _reportObject(lib, kv);
                    }
                }
            } else {
                console.log(`%c ${kv[0]} （ All ）: `, `font-weight:900;color:${kv[1]}`, lib);
            }
        });
        console.groupEnd();
    }
    return data;
};
export default {
    // 调试专用方法
    dgFileJson,
    dgScript,
    dgForm,
    dgRouter,
    dgMonitor,
    dgDebug,
    dgReport
};
