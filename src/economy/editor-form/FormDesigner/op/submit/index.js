import submit from './O.entry';
import depend from './I.depend';
import Ct from "./I.component";

export default {
    ...submit,
    ...depend,

    dataSpec: (normalized = {}, params = {}) => {
        // 密码框
        Ct.dataPassword(normalized, params);
        // 数值框
        Ct.dataNumber(normalized, params);
        // 多文本框
        Ct.dataTextArea(normalized, params);
    },
}