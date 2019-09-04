import {saveAs} from "file-saver";
import Cv from "../constant";
import v4 from "uuid";

const dgRouter = (Ux, container, component) => {
    if (Boolean("development" === process.env.NODE_ENV && Cv.DEBUG)) {
        console.groupCollapsed("%c 「Zero」 UI Component Report:", "font-weight:900;color:#369");
        console.info("[Ux] Container = ", container);
        console.info("[Ux] Component = ", component);
        console.groupEnd();
    }
};

const dgDebug = (data, prefix, color) => {
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
export default {
    dgRouter,
    dgDebug,
    dgAjax,
    dgFileJson
}