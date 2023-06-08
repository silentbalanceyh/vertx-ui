import __V_ENV from './v.environment';
/* 组件第一次加载之后的日志 */
import __Dg from './fn.debug.dg.logging';

const COLOR_QR = "#4682B4";
const dglList = (reference) => {
    if (__V_ENV.DEBUG_QR) {
        const componentName = reference.displayName;
        const content = `< ${componentName} > 初始化Qr日志：`;
        const {state = {}, props = {}} = reference;
        const {
            $myDefault = {},
            $query: query = {},
            config = {}
        } = props;

        const {
            $qr,
            $condition,
            $terms,
            $keyword,

            $columns,
            $columnsMy,
            $myView,

            $query,
            $queryDefault,
            $queryView,
        } = state;
        const body = {
            in: {
                $query: query,
                config: {
                    query: config.query,
                }
            },
            view: {
                $myDefault,
                $myView,
                v: {
                    $columns,
                    $columnsMy,
                }
            },
            query: {
                $query,
                $queryView,
                $queryDefault
            },
            runtime: {
                $qr,
                $condition,
                $terms,
                $keyword,
            }
        }
        __Dg.dgDebug(body, content, COLOR_QR);
    }
}
const dglApi = (reference, response = {}) => {
    if (__V_ENV.DEBUG_QR) {
        const componentName = reference.displayName;
        const content = `< ${componentName} > 远程视图 __qr：`;
        const {$queryView, $query} = reference.state;
        const body = {
            __qr: response.__qr,
            $query,
            $queryView
        }
        __Dg.dgDebug(body, content, "#0eb071");
    }
}
const __dglQr = (reference, message, color) => {
    if (__V_ENV.DEBUG_QR) {
        const componentName = reference.displayName;
        const content = `< ${componentName} > ${message}：`;
        const {state = {}} = reference;

        const {
            $qr,
            $condition,
            $terms,
            $keyword,
        } = state;
        const body = {
            $qr,
            $condition,
            $terms,
            $keyword,
        }
        __Dg.dgDebug(body, content, color);
    }
}

const __dglView = (reference, message, color) => {
    if (__V_ENV.DEBUG_QR) {
        const componentName = reference.displayName;
        const content = `< ${componentName} > ${message}：`;
        const {state = {}} = reference;

        const {
            $qr,
            $condition,
            $terms,
            $keyword,

            $queryView,
        } = state;
        const body = {
            $qr,
            $condition,
            $terms,
            $keyword,
            $queryView
        }
        __Dg.dgDebug(body, content, color);
    }
}


const __dglColumn = (reference, message, color) => {
    if (__V_ENV.DEBUG_QR) {
        const componentName = reference.displayName;
        const content = `< ${componentName} > ${message}：`;
        const {state = {}} = reference;

        const {
            $qr,
            $condition,
            $terms,
            $keyword,

            $columnsMy,
        } = state;
        const body = {
            $qr,
            $condition,
            $terms,
            $keyword,
            $columnsMy
        }
        __Dg.dgDebug(body, content, color);
    }
}
const dglViewAt = (reference) => {
    if (__V_ENV.DEBUG_QR) {
        const componentName = reference.displayName;
        const content = `< ${componentName} > 视图选择：`;
        const {state = {}} = reference;

        const {
            $qr,
            $condition,
            $terms,
            $keyword,

            $queryView,
            $myView,
        } = state;
        const body = {
            $qr,
            $condition,
            $terms,
            $keyword,
            $queryView,
            $myView,
        }
        __Dg.dgDebug(body, content, "#00aec5");
    }
}

const dglQrFilter = (reference) => {
    __dglQr(reference, "列过滤", "#8fbe00");
}
const dglQrSearch = (reference) => {
    __dglQr(reference, "搜索框", "#00b7ff");
}

const dglQrAdvance = (reference) => {
    __dglQr(reference, "高级搜索", "#ff8e00");
}

const dglViewUp = (reference) => {
    __dglView(reference, "视图更新", "#ff555d");
}

const dglVColumn = (reference) => {
    __dglColumn(reference, "列保存", "#558dff");
}
const dglVCriteria = (reference) => {
    __dglColumn(reference, "查询条件", "#9469ff");
}


const dglQrC = (reference, major = true) => {
    if (major) {
        // qr 发起
        __dglQr(reference, "$qr -> $condition 转换", "#d643bf");
    } else {
        // condition 发起
        __dglQr(reference, "$condition -> $qr 转换", "#d643bf");
    }
}
const dglQrV = (reference, qr, query, server = false) => {
    if (__V_ENV.DEBUG_QR) {
        const componentName = reference ? reference.displayName : "Function";
        let content;
        if (server) {
            content = `< ${componentName} > ：query -> $qr`;
        } else {
            content = `< ${componentName} > : $qr -> query`;
        }
        __Dg.dgDebug({
            qr, query,
        }, content, "#d643bf")
    }
}
export default {
    dglQrV,
    dglQrC,

    dglVColumn,
    dglVCriteria,

    dglList,        // 1. 初始化
    dglApi,         // 2. 第一次加载之后 __qr 值

    dglQrFilter,
    dglQrSearch,
    dglQrAdvance,

    dglViewUp,      // 4. 视图更新之后的日志
    dglViewAt,      // 5. 视图选择之后
}