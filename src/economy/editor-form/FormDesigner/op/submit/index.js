import submit from './I.attribute';
import depend from './I.depend';
import Ct from "./I.component";
import dataRules from './O.fn.rule';
import dataOption from './O.fn.option';

export default {
    ...submit,
    ...depend,
    dataInit: (normalized = {}, params = {}) => {
        /*
         * normalized.field 可不设置
         * normalized.optionJsx 初始化
         * normalized.optionItem 初始化
         * normalized.optionConfig 初始化
         */
        normalized.optionJsx = {config: {}, depend: {}};
        normalized.optionItem = {};
        normalized.optionConfig = {};
    },
    /* rules, option 处理 */
    dataRules,
    dataOption,
    dataComponent: (normalized = {}, params = {}) => {
        const render = params.render;
        if ("aiPassword" === render) {
            // 密码框
            Ct.dataPassword(normalized, params);
        } else if ("aiInputNumber" === render) {
            // 数值框
            Ct.dataNumber(normalized, params);
        } else if ("aiTextArea" === render) {
            // 多文本框
            Ct.dataTextArea(normalized, params);
        } else if ("aiSelect" === render) {
            // 下拉框
            Ct.dataSelect(normalized, params);
        }
    },
}