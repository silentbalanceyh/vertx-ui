import dataJsx from './I.fn.jsx.js';
import Opt from './I.option';

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
const dataSelect = (normalized = {}, params = {}) => {
    // 多选启用
    Opt.dataMultiple(normalized, params);
}
const dataTreeSelect = (normalized = {}, params = {}) => {
    // 多选启用
    Opt.dataMultiple(normalized, params);
    // Option 专用（单独读取动态数据源）
    Opt.dataOption(normalized, params);
    // Tree
    Opt.dataTree(normalized, params);
}
const dataCheckbox = (normalized = {}, params = {}) => {
    // 模式
    dataJsx(normalized, params, 'mode');
    if ("SWITCH" === params.mode) {
        dataJsx(normalized, params, 'checkedChildren');
        dataJsx(normalized, params, 'unCheckedChildren');
    }
}

const dataFileUpload = (normalized = {}, params = {}) => {
    if (params.uploadSingle) {

    }
}

const dataRadio = (normalized = {}, params = {}) => {
    // 模式
    dataJsx(normalized, params, 'mode');
    // 宽度处理
    if (params.radioCount) {
        const style = {};
        if (1 === params.radioCount) {
            style.width = "100%";
        } else if (2 === params.radioCount) {
            style.width = "48%";
        } else if (3 === params.radioCount) {
            style.width = "32%";
        } else if (4 === params.radioCount) {
            style.width = "24%";
        }
        normalized.optionJsx.style = style;
    }
}
export default {
    // 专用
    dataComponent: (normalized = {}, params = {}) => {
        const render = params.render;
        if ("aiPassword" === render) {
            // 密码框
            dataPassword(normalized, params);
        } else if ("aiInputNumber" === render) {
            // 数值框
            dataNumber(normalized, params);
        } else if ("aiTextArea" === render) {
            // 多文本框
            dataTextArea(normalized, params);
        } else if ("aiSelect" === render) {
            // 下拉框
            dataSelect(normalized, params);
        } else if ("aiTreeSelect" === render) {
            // 树状下拉
            dataTreeSelect(normalized, params);
        } else if ("aiCheckbox" === render) {
            // 多选框
            dataCheckbox(normalized, params);
        } else if ("aiRadio" === render) {
            // 单选框
            dataRadio(normalized, params);
        } else if ("aiDatePicker" === render) {
            // 日期选择器
            Opt.dataDate(normalized, params);
        } else if ("aiTimePicker" === render) {
            // 时间选择器
            Opt.dataDate(normalized, params);
        } else if ("aiFileUpload" === render) {
            // 上传
            dataFileUpload(normalized, params);
        }
    },
}