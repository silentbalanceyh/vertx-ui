import U from 'underscore'
import saveAs from "file-saver";
import v4 from "uuid";

/**
 * 【内部调用】检查传入对象object是否包含了field字段值
 * * 1.传入的object不可以是undefined。
 * * 2.传入的field不可以是undefined。
 * * 3.object必须包含field，才不会有错误信息输出。
 * @function ensureArgs
 * @param object 被检查的JavaScript对象
 * @param {String} field 被检查的字段名称
 * @return undefined
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
 * 【内部调用】检查传入的input是否合法
 * * 不为null
 * * 不为undefined
 * * 不为JavaScript的if检查条件中的false
 * @function ensureNotNull
 * @param input
 * @return undefined
 */
const ensureNotNull = (input) => {
    if (!input) {
        console.error("[ZUI] The input parameter must not be null.");
    }
};
/**
 * 【内部调用】检查传入的React中用的Component组件是否合法
 * * 不为null
 * * 不为undefined
 * * 不为JavaScript的if检查条件中的false
 * @function ensureRuntime
 * @param reference
 * @return undefined
 */
const ensureRuntime = (reference) => {
    if (!reference) {
        console.error("[ZUI] Your runtime does not support current object", reference);
    }
};

const ensureAttr = (funName, key = "") => {
    if (!key) {
        console.error(`[ZUI] This '${funName}' function require the second 'effectKey' parameter`);
    }
};

const ensureToken = (token) => {
    if (!token) {
        console.error("[ZUI] Token could not be picked, the request is invalid.", token);
    }
};

const ensureKey = (funName, key = "") => {
    if (!key) {
        console.error(`[ZUI] Function '${funName}' require input parameter key valid.`);
    }
};

const ensureApp = (app) => {
    if (!app) {
        console.error("[ZUI] The application has not been initialized.");
    }
};

const ensureRender = (render, option) => {
    if (!U.isFunction(render)) {
        console.error("[ZUI] Render is not a function.", option);
    }
};
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
