import __V_ENV from './v.environment';
import __Is from './fn.under.is.decision';
import __A from './fn.atomic.foundation';
import {detailedDiff} from "deep-object-diff";

const dgDebug = (data = {}, prefix, color = {}) => {
    if (__V_ENV.DEBUG_DEV) {
        const literal = `%c [DEBUG] ${prefix ? prefix : ""}`;
        let post = "";
        for (let idx = 0; idx < 120 - literal.length; idx++) {
            post += " ";
        }
        if ("string" === typeof color) {
            console.groupCollapsed(`${literal}${post}`,
                `color:white;background-color:${color ? color : "#eb2f96"};font-weight:900;`);
        } else {
            const {front, back = "#eb2f96"} = color;
            console.groupCollapsed(`${literal}${post}`,
                `color:${front};background-color:${color ? color : back};font-weight:900;`);
        }
        const {props, state, _state, ...rest} = data;
        if (props) console.log(`props = `, props);
        if (state) console.log(`state = `, state);
        if (_state) console.log(`state (P) = `, _state);
        if (__Is.isNotEmpty(rest)) {
            console.log(rest);
        }
        console.groupEnd();
    }
    return data;
};
const dgAjax = (data, prefix) => {
    if (__V_ENV.DEBUG_DEV) {
        console.debug(`%c [DEBUG] Ajax - ${prefix ? prefix : ""}`, "color:red;font-weight:900;",
            data);
    }
    return data;
};
const dgRouter = (Ux, container, component) => {
    if (__V_ENV.DEBUG_DEV) {
        console.groupCollapsed("%c 「Zero」 UI Component Report:", "font-weight:900;color:#369");
        console.info("[Ux] Container = ", container);
        console.info("[Ux] Component = ", component);
        console.groupEnd();
    }
};

const dgAdmit = (input = {}, name, isProp = true, config = {}) => {
    if (__V_ENV.DEBUG_DEV) {
        const literal = `%c [DEBUG] [ ${name ? name : ""} ] ${isProp ? " ( Init )" : " ( Ready )"}`;
        const {color = "#2E8B57"} = config;
        console.groupCollapsed(`${literal}`, `color:white;background-color:${color};font-weight:900;`);
        if (isProp) {
            const {
                $anchors, $initial, $owner, $region,
                config, data,
                $bindValue, $bindData,
                ...other
            } = input;
            console.log(`Props = `, other);
            console.log(`   config = `, config);
            console.log(`   data = `, data);
            if ($anchors) console.log(`   $anchors = `, $anchors);
            console.log(`   $initial = `, $initial);
            console.log(`   $owner = `, $owner);
            console.log(`   $region = `, $region);
            console.log(`   $bindValue = `, $bindValue);
            if ($bindData) console.log(`   $bindData = `, $bindData);
        } else {
            const {
                $keySet,
                $keyDefault,
                $inited = {},
                $bindData = {},
                // 顶层
                ...other
            } = input;
            console.log(`State = `, other);
            console.log(`   $keySet = `, $keySet);
            console.log(`   $keyDefault = `, $keyDefault);
            const {
                h, q, v
            } = $inited;
            console.log(`   $inited -> h = `, h);
            console.log(`   $inited -> q = `, q);
            console.log(`   $inited -> v = `, v);
            if ($bindData) console.log(`   $bindData = `, $bindData);
        }
        console.groupEnd();
    }
}

const dgQuery = (reference = {}, name) => {
    if (__V_ENV.DEBUG_DEV) {
        console.groupCollapsed(`%c [DEBUG] Qr - 条件分析专用日志：`, "background-color:#668B8B;color:white;font-weight:900;", name);
        const {
            $terms,      // 列过滤配置
            $filters,    // 表单提交配置
            $condition,  // 列过滤条件
            $query = {}, // state 中的 $query
        } = reference.state ? reference.state : {};
        const input = reference.props.$query;
        console.debug(`%c [ Or ] props 中的 $query: `, "color:#27408B;font-weight:900;", __A.clone(input));
        console.debug(`%c [ Or ] state 中的 $terms: `, "color:#B03060;font-weight:900;", __A.clone($terms));
        console.debug(`%c [ Or ] state 中的 $condition: `, "color:#2F4F4F;font-weight:900;", __A.clone($condition));
        console.debug(`%c [ Or ] state 中的 $filters: `, "color:#2F4F4F;font-weight:900;", __A.clone($filters));
        console.debug(`%c [ Or ] state 中的 $query: `, "color:#104E8B;font-weight:900;", __A.clone($query));
        console.groupEnd();
    }
};
const dgGraphic = (input, message, color = "#1A91FF") => {
    dgDebug(input, `[ GEvent ] ${message}`, color);
};
const dgDiff = (left, right) => {
    if (__V_ENV.DEBUG_DEV) {
        if (left && right) {
            console.error(detailedDiff(left, right));
        }
    }
};
const dgTodo = (input, message) =>
    dgDebug(input, `TODO: ${message}`, "#CD0200")
const dgUCA = (reference = {}, Name) => {
    if (__V_ENV.DEBUG_DEV) {
        const message = `%c 「Zero」 [Rx-Economy] Component Monitor: name = ${Name}`;
        console.groupCollapsed(message, 'color:#0099FF;font-weight:900;');
        console.log(`%c 「Zero」 Props -> `, 'color:#660099;font-weight:900;', reference.props);
        console.log(`%c 「Zero」 State -> `, 'color:#666666;font-weight:900;', reference.state);
        console.groupEnd();
    }
};
const __dgQr = (data = {}, level = 1) => {
    let connector;
    if (data.hasOwnProperty("")) {
        connector = data[""] ? "AND" : "OR";
    } else {
        connector = "OR";
    }
    let indent = "";
    for (let i = 0; i < level; i++) {
        indent += "————"
    }
    console.info(`${indent} `, connector)
    Object.keys(data).filter(field => "" !== field).forEach(field => {
        const item = data[field];
        if (__Is.isObject(item, false)) {
            __dgQr(item, level + 1);
        } else {
            console.info(`${indent} ( ${field} )`, item);
        }
    })
}
const dgQr = (data = {}, prefix) => {
    if (__V_ENV.DEBUG_DEV) {
        const literal = `%c [DEBUG] ${prefix ? prefix : ""}`;
        let post = "";
        for (let idx = 0; idx < 120 - literal.length; idx++) {
            post += " ";
        }
        console.groupCollapsed(`${literal}${post}`,
            `color:white;background-color:#006400;font-weight:900;`);
        __dgQr(data);
        console.groupEnd();
    }
    return data;
};
export default {
    dgQr,
    dgDebug,
    dgAjax,
    dgRouter,
    dgAdmit,
    dgQuery,
    dgGraphic,
    dgDiff,
    dgTodo,
    dgUCA,
}