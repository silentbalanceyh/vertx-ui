import __V_ENV from './v.environment';
import __LOG from './fn.debug.dg.logging';
import __RANDOM from './fn.unity.random';
import {saveAs} from "file-saver";

const dgFile = (data, filename, ext = "json") => {
    let finalData = data;
    if (!Blob.prototype.isPrototypeOf(data)) {
        finalData = new Blob([JSON.stringify(data, null, 2)], {
            type: "application/json"
        });
    }
    const file = filename ? filename + "." + ext : __RANDOM.randomUUID() + "." + ext;
    saveAs(finalData, file);
};
export default {
    dgFile, dgFileJson: dgFile,
    dgJs: (input, message, color = "#FA7EBC") => __LOG.dgDebug(input, message, color),
    // 开发用参数集合
    dgSkip: (value, vDefault = true) => {
        if (__V_ENV.DEBUG_DEV) {
            return vDefault ? Boolean(value) : !Boolean(value);
        } else {
            return false;
        }
    }
}
