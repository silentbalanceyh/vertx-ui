import {saveAs} from "file-saver";
import Cv from "../constant";
import v4 from "uuid";
import Abs from '../abyss';
import {detailedDiff} from 'deep-object-diff';

const dgRouter = (Ux, container, component) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.groupCollapsed("%c 「Zero」 UI Component Report:", "font-weight:900;color:#369");
        console.info("[Ux] Container = ", container);
        console.info("[Ux] Component = ", component);
        console.groupEnd();
    }
};

const dgDebug = (data = {}, prefix, color) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.debug(`%c [DEBUG] ${prefix ? prefix : ""}`, `color:white;background-color:${color ? color : "#eb2f96"};font-weight:900;`,
            data);
    }
    return data;
};
const dgAjax = (data, prefix) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.debug(`%c [DEBUG] Ajax - ${prefix ? prefix : ""}`, "color:red;font-weight:900;",
            data);
    }
    return data;
};
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
const dgQuery = (reference = {}, name) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.groupCollapsed(`%c [DEBUG] Qr - 条件分析专用日志：`, "background-color:#6959CD;color:white;font-weight:900;", name);
        const {
            $terms,      // 列过滤配置
            $filters,    // 表单提交配置
            $condition,  // 列过滤条件
            $query = {}, // state 中的 $query
        } = reference.state ? reference.state : {};
        const input = reference.props.$query;
        console.debug(`%c [ Or ] props 中的 $query: `, "color:#27408B;font-weight:900;", Abs.clone(input));
        console.debug(`%c [ Or ] state 中的 $terms: `, "color:#B03060;font-weight:900;", Abs.clone($terms));
        console.debug(`%c [ Or ] state 中的 $condition: `, "color:#2F4F4F;font-weight:900;", Abs.clone($condition));
        console.debug(`%c [ Or ] state 中的 $filters: `, "color:#2F4F4F;font-weight:900;", Abs.clone($filters));
        console.debug(`%c [ Or ] state 中的 $query: `, "color:#104E8B;font-weight:900;", Abs.clone($query));
        console.groupEnd();
    }
};
const dgDiff = (left, right) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        if (left && right) {
            console.error(detailedDiff(left, right));
        }
    }
};
export default {
    dgRouter,
    dgDiff,
    dgDebug,
    dgQuery,
    dgAjax,
    dgFileJson
}