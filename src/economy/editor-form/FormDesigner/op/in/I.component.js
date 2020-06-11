import Ux from 'ux';

const dataPassword = (normalized = {}, data = {}) => {
    normalized.visibilityToggle = Ux.valuePath(data, "optionJsx.visibilityToggle");
}
const dataInputNumber = (normalized = {}, data = {}) => {
    // 最大值 / 最小值
    normalized.min = Ux.valuePath(data, "optionJsx.min");
    normalized.max = Ux.valuePath(data, "optionJsx.max");
    // 步进系数 / 精度
    normalized.step = Ux.valuePath(data, "optionJsx.step");
    normalized.precision = Ux.valuePath(data, 'optionJsx.precision');
    // 常用格式
    const numeric = Ux.valuePath(data, "optionJsx.numeric");
    if (!Ux.isEmpty(numeric)) {
        if (numeric.percent) {
            normalized.numberMode = "PERCENT";
        } else {
            normalized.numberMode = "CURRENCY";
            normalized.numberUnit = numeric.unit;
            normalized.numberUnitPosition = numeric.unitPosition;
        }
    }
}
const DATA_EXECUTOR = {
    aiPassword: dataPassword,                   // 密码框
    aiInputNumber: dataInputNumber              // 数值输入框
}
export default {
    dataComponent: (normalized = {}, data = {}, reference) => {
        const render = normalized.render;
        const executor = DATA_EXECUTOR[render];
        if (Ux.isFunction(executor)) {
            executor(normalized, data, reference);
        }
    }
}