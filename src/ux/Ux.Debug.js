import U from 'underscore'
import saveAs from "file-saver";
import v4 from "uuid";

/**
 * 检查传入对象object是否包含了field字段值
 * * 1.传入的object不可以是undefined。
 * * 2.传入的field不可以是undefined。
 * * 3.object必须包含field，才不会有错误信息输出。
 * @function ensureArgs
 * @private
 * @param object 被检查的JavaScript对象
 * @param {String} field 被检查的字段名称
 * @example
 *
 *      import Debug from './Ux.Debug';
 *      // 省略中间代码
 *      const reference = ...;
 *      Debug.ensureArgs(reference, "foo");
 */
const ensureArgs = (object, field) => {
    if (!object || !field || !object.hasOwnProperty(field)) {
        console.error(`[ZUI] Argument invalid, object must have key ${field}`, object);
    }
};
/**
 * 检查传入的input是否合法
 * * 合法条件：不为null、不为undefined、不为JavaScript的if检查条件中的false
 * @function ensureNotNull
 * @private
 * @param input
 */
const ensureNotNull = (input) => {
    if (!input) {
        console.error("[ZUI] The input parameter must not be null.");
    }
};
/**
 * 检查传入的React中用的Component组件是否合法
 * * 合法条件：不为null、不为undefined、不为JavaScript的if检查条件中的false
 * @function ensureRuntime
 * @private
 * @param {ReactComponent} reference React中Component组件引用
 */
const ensureRuntime = (reference) => {
    if (!reference) {
        console.error("[ZUI] Your runtime does not support current object", reference);
    }
};
/**
 * 检查函数中的第二特殊参数`effectKey`是否合法
 * * 合法条件：不为null、不为undefined、不为JavaScript的if检查条件中的false
 * @function ensureAttr
 * @private
 * @param {Function} funName 待检查的函数名
 * @param {String} key 待检查的第二参的值
 */
const ensureAttr = (funName, key = "") => {
    if (!key) {
        console.error(`[ZUI] This '${funName}' function require the second 'effectKey' parameter`);
    }
};
/**
 * 检查发送安全请求时的token是否合法
 * * 合法条件：不为null、不为undefined、不为JavaScript的if检查条件中的false
 * @function ensureToken
 * @private
 * @param {String} token 请求中收到的token的值
 */
const ensureToken = (token) => {
    if (!token) {
        console.error("[ZUI] Token could not be picked, the request is invalid.", token);
    }
};
/**
 * 检查函数调用过程中的参数key是否合法（一般用于高阶检查）
 * * 合法条件：不为null、不为undefined、不为JavaScript的if检查条件中的false
 * @function ensureKey
 * @private
 * @param {Function} funName 待检查的函数名
 * @param {String} key 待检查的键值key
 */
const ensureKey = (funName, key = "") => {
    if (!key) {
        console.error(`[ZUI] Function '${funName}' require input parameter key valid.`);
    }
};
/**
 * Application应用专用配置检查，判断当前应用配置是否初始化
 * * 合法条件：不为null、不为undefined、不为JavaScript的if检查条件中的false
 * @function ensureApp
 * @private
 * @param {Object} app 应用程序配置
 */
const ensureApp = (app) => {
    if (!app) {
        console.error("[ZUI] The application has not been initialized.");
    }
};
/**
 * React Component中的render相关专用检查（是否合法）
 * @function ensureRender
 * @private
 * @param {Function} render 函数应用
 * @param {Object} option render过程中的配置
 * @example
 *
 *      const jsxField = (reference, item = {}, render) => {
 *          Dg.ensureRender(render, item);
 *          // ...
 *      }
 */
const ensureRender = (render, option) => {
    if (!U.isFunction(render)) {
        console.error("[ZUI] Render is not a function.", option);
    }
};
/**
 * 调用传入函数检查数据类型，如果类型不对则抛出异常
 * @function ensureType
 * @private
 * @param value
 * @param {Function} fun
 * @param {String} flag 期望类型
 * @example
 *
 *      const elementUnique = (data = [], field = "", value) => {
 *          Dg.ensureType(data, U.isArray, "Array");
 *          //
 *      }
 */
const ensureType = (value, fun, flag) => {
    if (!fun(value)) {
        console.error(`[ZUI] Expected type '${flag}' is invalid.`, value);
    }
};
const ensureLength = (array = [], upLimit = 0) => {
    if (U.isArray(array)) {
        if (upLimit < array.length) {
            console.error(`[ZUI] Expected length is '${upLimit}', but current length is '${array.length}'.`);
        }
    }
};
const ensureNumber = (value) => {
    if ("number" !== typeof value) {
        console.error("[ZUI] Expected number input value here.", typeof value);
    }
};
const ensurePositive = (value) => {
    ensureNumber(value);
    if (0 > value) {
        console.error("[ZUI] Expected positive number of input value.", value);
    }
};
// 环境变量初始化
const rxFileJson = (data, ext = "json") => {
    let finalData = data;
    if (!Blob.prototype.isPrototypeOf(data)) {
        finalData = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });
    }
    saveAs(finalData, v4() + "." + ext);
};
const rxForm = (reference, data = {}, updated = false) => {
    if (Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG)) {
        console.groupCollapsed("[Form] Form metadata when initialized. updated = ", updated);
        console.info("Init Value = ", data);
        console.info("Init Function = ", reference.props.fnInit);
        console.groupEnd();
    }
};
// 环境变量初始化
const rxScript = (ux = {}) => {
    if (Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG)) {
        console.info(ux);
        console.groupCollapsed("[Ux] Assist report as following:");
        const numCond = 0;
        const strCond = "";
        console.info("[If] if(0) = ", (numCond) ? "Yes" : "No");
        console.info("[If] if(\"\") = ", (strCond) ? "Yes" : "No");
        console.groupEnd();
    }
};
const rxRouter = (ux, container, component) => {
    if (Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG)) {
        console.info(ux);
        console.groupCollapsed("[Ux] UI report as following:");
        console.info("[Ux] Container = ", container);
        console.info("[Ux] Component = ", component);
        console.groupEnd();
    }
};
/**
 * 1. `ensure`工具类：Zero UI内部专用断言工具类
 * 2. `dg`工具类：开发人员调试常用工具类
 * @module Ux
 * @class Debug
 */
export default {
    ensureArgs,
    ensureNotNull,
    ensureRuntime,
    ensureAttr,
    ensureToken,
    ensureKey,
    ensureApp,
    ensureRender,
    ensureType,
    ensureLength,
    ensureNumber,
    ensurePositive,

    rxFileJson,
    rxScript,
    rxForm,
    rxRouter,
    rxMonitor: (data) => {
        console.info(data);
        return data;
    },
}
