import dataJsx from './I.fn.option.jsx';

const dataPassword = (normalized = {}, params = {}) => {
    // 密码框才有的属性
    dataJsx(normalized, params, 'visibilityToggle');
}
const dataNumber = (normalized = {}, params = {}) => {
    // 最小值 / 最大值
    dataJsx(normalized, params, 'min');
    dataJsx(normalized, params, 'max');
    // 步进系数 / 精度
    dataJsx(normalized, params, 'step');
    dataJsx(normalized, params, "precision");
    // 常用格式
    if ("PERCENT" === params.numberMode) {
        /* 百分比 */
        normalized.optionJsx.formatter = value => `${value}%`;
        normalized.optionJsx.parser = value => value.replace(`%`, '');
    } else {
        /* 货币处理，必须输入货币单位 */
        if (params.numberUnit) {
            /* 左右区别 */
            if (params.numberUnitPosition) {
                /* 右侧 */
                normalized.optionJsx.formatter = value => `${value} ${params.numberUnit}`;
            } else {
                /* 左侧 */
                normalized.optionJsx.formatter = value => `${params.numberUnit} ${value}`;
            }
            normalized.optionJsx.parser = value => value.replace(params.numberUnit, "");
        }
    }
}
const dataTextArea = (normalized = {}, params = {}) => {
    // 默认行数
    dataJsx(normalized, params, 'rows');
    // 是否开启自动缩放功能
    if (params.autoSize) {
        if (params.autoSizeMin || params.autoSizeMax) {
            // minRows, maxRows
            normalized.optionJsx.autoSize = {};
            if (0 < params.autoSizeMin) {
                normalized.optionJsx.autoSize.minRows = params.autoSizeMin;
            }
            if (0 < params.autoSizeMax) {
                normalized.optionJsx.autoSize.maxRows = params.autoSizeMax;
            }
        }
    }
}
export default {
    // 密码框
    dataPassword,
    // 输入数值
    dataNumber,
    // 多文本
    dataTextArea,
}