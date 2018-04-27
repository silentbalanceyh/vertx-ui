import U from 'underscore'
import saveAs from "file-saver";
import v4 from "uuid";

const ensureArgs = (object, key = "") => {
    if (!object || !object.hasOwnProperty(key)) {
        console.error(`[Kid] Argument invalid, object must have key ${key}`, object);
    }
};

const ensureNotNull = (input) => {
    if (!input) {
        console.error("[Kid] The input parameter must not be null.");
    }
};

const ensureRuntime = (reference) => {
    if (!reference) {
        console.error("[Kid] Your runtime does not support current object", reference);
    }
};

const ensureAttr = (funName, key = "") => {
    if (!key) {
        console.error(`[Kid] This '${funName}' function require the second 'effectKey' parameter`);
    }
};

const ensureToken = (token) => {
    if (!token) {
        console.error("[Kid] Token could not be picked, the request is invalid.", token);
    }
};

const ensureKey = (funName, key = "") => {
    if (!key) {
        console.error(`[Kid] Function '${funName}' require input parameter key valid.`);
    }
};

const ensureApp = (app) => {
    if (!app) {
        console.error("[Kid] The application has not been initialized.");
    }
};

const ensureRender = (render, option) => {
    if (!U.isFunction(render)) {
        console.error("[Kid] Render is not a function.", option);
    }
};
const ensureType = (value, fun, flag) => {
    if (!fun(value)) {
        console.error(`[Kid] Expected type '${flag}' is invalid.`, value);
    }
};
const ensureLength = (array = [], upLimit = 0) => {
    if (U.isArray(array)) {
        if (upLimit < array.length) {
            console.error(`[Kid] Expected length is '${upLimit}', but current length is '${array.length}'.`);
        }
    }
};
const ensureNumber = (value) => {
    if ("number" !== typeof value) {
        console.error("[Kid] Expected number input value here.", typeof value);
    }
};
const ensurePositive = (value) => {
    ensureNumber(value);
    if (0 > value) {
        console.error("[Kid] Expected positive number of input value.", value);
    }
};
// 环境变量初始化
const rxDebug = (ux = {}) => {
    console.info(ux);
    console.groupCollapsed("[Ux] Assist report as following:");
    const numCond = 0;
    const strCond = "";
    console.info("[If] if(0) = ", (numCond) ? "Yes" : "No");
    console.info("[If] if(\"\") = ", (strCond) ? "Yes" : "No");
    console.groupEnd();
};
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
    rxDebug,
    rxFileJson,
    rxForm,
    rxMonitor: (data) => {
        console.info(data);
        return data;
    },
}
