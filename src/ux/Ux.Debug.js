import U from 'underscore'
import saveAs from "file-saver";
import v4 from "uuid";

/**
 * 检查传入对象object是否包含了field字段值
 * * 1.传入的object不可以是undefined。
 * * 2.传入的field不可以是undefined。
 * * 3.object必须包含field，才不会有错误信息输出。
 * @method ensureArgs
 * @private
 * @param object 被检查的JavaScript对象
 * @param {String} field 被检查的字段名称
 * @example
 *
 *      // 导入Debug子类
 *      import Dg from './Ux.Debug';
 *      // 省略中间代码
 *      const reference = ...;
 *      Dg.ensureArgs(reference, "foo");
 */
const ensureArgs = (object, field) => {
    if (!object || !field || !object.hasOwnProperty(field)) {
        console.error(`[ZUI] Argument invalid, object must have key ${field}`, object);
    }
};
/**
 * 检查传入的input是否合法
 * * 合法条件：不为null、不为undefined、不为JavaScript的if检查条件中的false
 * @method ensureNotNull
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
 * @method ensureRuntime
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
 * @method ensureAttr
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
 * @method ensureToken
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
 * @method ensureKey
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
 * @method ensureApp
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
 * @method ensureRender
 * @private
 * @param {Function} render 函数应用
 * @param {Object} option render过程中的配置
 * @example
 *
 *      // 使用JSX渲染某个字段
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
 * @method ensureType
 * @private
 * @param value
 * @param {Function} fun
 * @param {String} flag 期望类型
 * @example
 *
 *      // 查找数组中的唯一元素
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
/**
 * 检查数组的长度是否大于上限长度
 * @method ensureLength
 * @private
 * @param {Array} array 被检查的数组
 * @param {Number} upLimit 数组上限长度值
 */
const ensureLength = (array = [], upLimit = 0) => {
    ensureNumber(upLimit);
    if (U.isArray(array)) {
        if (upLimit < array.length) {
            console.error(`[ZUI] Expected length is '${upLimit}', but current length is '${array.length}'.`);
        }
    }
};
/**
 * 检查当前传入值是否是一个合法的Number
 * @method ensureNumber
 * @private
 * @param value 传入的数值
 */
const ensureNumber = (value) => {
    if ("number" !== typeof value) {
        console.error("[ZUI] Expected number input value here.", typeof value);
    }
};
/**
 * 检查当前传入的值是否是一个正数的Number
 * @method ensurePositive
 * @private
 * @param value
 */
const ensurePositive = (value) => {
    ensureNumber(value);
    if (0 > value) {
        console.error("[ZUI] Expected positive number of input value.", value);
    }
};
/**
 * 将传入的值`data`下载成一个文件保存，文件名系统生成，该文件名被转换过，所以调用时使用Ux调用
 * @method dgFileJson
 * @param {Object|Array} data 传入的数据
 * @param ext 保存的文件格式后缀名，默认为.json
 * @example
 *
 *      // 设置文件中将保存的数据
 *      const data = {
 *          username:"Lang",
 *          password:"Lang"
 *      };
 *      Ux.dgFileJson(data);
 */
const dgFileJson = (data, ext = "json") => {
    let finalData = data;
    if (!Blob.prototype.isPrototypeOf(data)) {
        finalData = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });
    }
    saveAs(finalData, v4() + "." + ext);
};
/**
 * 【Development Only】
 * 在调试模式才启用的Form专用打印信息，打印Form初始化过程中的表单数据
 * 支持两种模式：updated = true为更新Form时的数据，updated = false则是添加时的数据
 * @method dgForm
 * @param {ReactComponent} reference 包含了form变量的React的组件Component引用
 * @param data 当前Form中的表单数据
 * @param updated 判断当前调试使用的是更新/添加模式
 */
const dgForm = (reference, data = {}, updated = false) => {
    if (Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG)) {
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
 * @param ux Ux引用
 */
const dgScript = (ux = {}) => {
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
/**
 * 【Development Only】
 * 自动生成路由中的路由报表，可查看所有的路由信息
 * @method dgRouter
 * @param ux Ux引用
 * @param container Layout模板配置信息
 * @param component Page组件配置信息
 */
const dgRouter = (ux, container, component) => {
    if (Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG)) {
        console.info(ux);
        console.groupCollapsed("[Ux] UI report as following:");
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
 * @return 返回传入的数据
 */
const dgMonitor = (data) => {
    if (Boolean("development" === process.env.NODE_ENV && process.env.$DEBUG)) {
        console.info(data);
    }
    return data;
};
/**
 * 1. `ensure`工具类：Zero UI内部专用断言工具类
 * 2. `dg`工具类：开发人员调试常用工具类
 * @module Ux
 * @class Debug
 */
export default {
    // 诊断专用方法
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
    // 调试专用方法
    dgFileJson,
    dgScript,
    dgForm,
    dgRouter,
    dgMonitor,
}
