import Ux from 'ux';
import dataAction from './I.fn.submit';
import Opt from './I.option';

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
const dataTextArea = (normalized = {}, data = {}) => {
    // 默认行数
    normalized.rows = Ux.valuePath(data, "optionJsx.rows");
    // 自动缩放检测
    const autoSize = Ux.valuePath(data, "optionJsx.autoSize");
    if (!Ux.isEmpty(autoSize)) {
        normalized.autoSizeMin = autoSize.minRows;
        normalized.autoSizeMax = autoSize.maxRows;
    }
}
const dataSelect = (normalized = {}, data = {}) => {
    // 多选启用读取
    Opt.dataMultiple(normalized, data);
}
const dataTreeSelect = (normalized = {}, data = {}) => {
    // 多选启用读取
    Opt.dataMultiple(normalized, data);
    // Option 专用（单独读取动态数据源）
    Opt.dataDatum(normalized, data);
    // Tree
    Opt.dataTree(normalized, data);
}
const dataCheckbox = (normalized = {}, data = {}) => {
    // 模式
    normalized.mode = Ux.valuePath(data, "optionJsx.mode");
    if ("SWITCH" === normalized.mode) {
        normalized.checkedChildren = Ux.valuePath(data, "optionJsx.checkedChildren");
        normalized.unCheckedChildren = Ux.valuePath(data, "optionJsx.unCheckedChildren");
    }
}

const dataRadio = (normalized = {}, data = {}) => {
    // 模式
    normalized.mode = Ux.valuePath(data, "optionJsx.mode");
    // 宽度处理
    const style = Ux.valuePath(data, "optionJsx.style");
    if (!Ux.isEmpty(style)) {
        if (style.width) {
            if ("100%" === style.width) {
                normalized.radioCount = 1;
            } else if ("48%" === style.width) {
                normalized.radioCount = 2;
            } else if ("32%" === style.width) {
                normalized.radioCount = 3;
            } else if ("24%" === style.width) {
                normalized.radioCount = 4;
            }
        }
    }
}
const dataFileUpload = (normalized = {}, data = {}) => {
    normalized.listType = Ux.valuePath(data, "optionJsx.listType");
    normalized.text = Ux.valuePath(data, "optionJsx.text");
    normalized.withCredentials = Ux.valuePath(data, "optionJsx.withCredentials");

    const config = Ux.valuePath(data, "optionJsx.config");
    if (!Ux.isEmpty(config)) {
        normalized.uploadSingle = Ux.valuePath(config, "single");
        normalized.uploadLimit = Ux.valuePath(config, "limit");
        normalized.uploadDownFile = Ux.valuePath(config, "fileKey");
    }
    const ajax = Ux.valuePath(data, "optionJsx.ajax");
    if (!Ux.isEmpty(ajax)) {
        normalized.uploadDownUri = Ux.valuePath(ajax, "download");
        normalized.uploadUpUri = Ux.valuePath(ajax, "uri");
        normalized.uploadUpParam = Ux.valuePath(ajax, "params");
    }
    const accept = Ux.valuePath(data, "accept");
    if (accept) {
        normalized.accept = accept.split(',');      // 数组
    }
}
const dataTransfer = (normalized = {}, data = {}) => {
    const config = Ux.valuePath(data, "optionJsx.config");
    if (!Ux.isEmpty(config)) {
        normalized.transferField = Ux.valuePath(config, "valueKey");
        if (Ux.isArray(config.titles)) {
            const [transferLeft, transferRight] = config.titles;
            if (transferLeft) normalized.transferLeft = transferLeft;
            if (transferRight) normalized.transferRight = transferRight;
        }
    }
}
const dataBraftEditor = (normalized = {}, data = {}) => {
    normalized.braftHeight = Ux.valuePath(data, "optionJsx.config.height");
}
const dataAddressSelector = (normalized = {}, data = {}) => {
    normalized.addressMode = Ux.valuePath(data, "optionJsx.config.ajax");
    const config = Ux.valuePath(data, "optionJsx.config");
    if (!Ux.isEmpty(config)) {
        const {country = {}, state = {}, city = {}, region = {}} = config;
        normalized.addrCountryUri = Ux.valuePath(country, "uri");
        normalized.addrCountryField = Ux.valuePath(country, "display");

        normalized.addrStateUri = Ux.valuePath(state, "uri");
        normalized.addrStateField = Ux.valuePath(state, "display");
        normalized.addrStateParent = Ux.valuePath(state, "parent");

        normalized.addrCityUri = Ux.valuePath(city, "uri");
        normalized.addrCityField = Ux.valuePath(city, "display");
        normalized.addrCityParent = Ux.valuePath(city, "parent");

        normalized.addrRegionUri = Ux.valuePath(region, "uri");
        normalized.addrRegionField = Ux.valuePath(region, "display");
        normalized.addrRegionParent = Ux.valuePath(region, "parent");

        normalized.addrInitUri = Ux.valuePath(config, "init");
    }
}
const dataJsonEditor = (normalized = {}, data = {}) => {
    normalized.jsonHeight = Ux.valuePath(data, "optionJsx.config.height");
}
const dataTreeSelector = (normalized = {}, data = {}) => {
    // Tree 树选择
    Opt.dataTree(normalized, data);
    // 特殊选择
    const selection = Ux.valuePath(data, "optionJsx.config.selection");
    if (!Ux.isEmpty(selection)) {
        normalized.treeMulti = Ux.valuePath(selection, "multiple");
        normalized.checkStrictly = Ux.valuePath(selection, "checkStrictly");
    }
}
const dataTableEditor = (normalized = {}, data = {}) => {
    // 表格编辑器
    const format = Ux.valuePath(data, "optionJsx.config.format");
    if (!Ux.isEmpty(format)) {
        normalized.tableFormat = Ux.valuePath(format, "type");
        normalized.tableKeyField = Ux.valuePath(format, "keyField");
    }
}
const dataTitle = (normalized = {}, data = {}) => {
    const config = Ux.valuePath(data, "optionJsx.config");
    if (Ux.isEmpty(config)) {
        normalized.titleMode = "TITLE";
    } else {
        normalized.titleMode = "COMMENT";
        const {commentType = "info"} = config;
        normalized.commentType = commentType;
        normalized.commentTitle = Ux.valuePath(config, "message");
        normalized.commentDescription = Ux.valuePath(config, "description");
    }
}
const dataMagic = (normalized = {}, data = {}) => {
    const config = Ux.valuePath(data, "optionJsx.config");
    if (!Ux.isEmpty(config)) {
        const jsx = Ux.valuePath(data, "optionJsx");
        const {items = []} = config;
        normalized.dataEmpty = Ux.valuePath(config, "$empty");
        if (config.hasOwnProperty("expr")) {
            normalized.dataType = "TEXT";
            normalized.textExpr = Ux.valuePath(config, "expr");
        } else if (jsx.moment) {        // 时间必须这样判断
            normalized.dataType = "DATE";
            normalized.dateFormat = Ux.valuePath(config, "dateFormat");
        } else if (config.boolean && 2 === items.length) {     // 逻辑值必须这样判断
            normalized.dataType = "BOOLEAN";
            normalized.booleanTrue = Ux.elementUnique(items, 'key', true, "label");
            normalized.booleanFalse = Ux.elementUnique(items, 'key', false, "label");
        } else if (config.hasOwnProperty("user")) {
            normalized.dataType = "REMOTE";
            normalized.remoteUri = Ux.valuePath(config, "user.uri");
            normalized.remoteMethod = Ux.valuePath(config, "user.method");
            if (!normalized.remoteMethod) {
                normalized.remoteMethod = "GET";
            }
            normalized.remoteField = Ux.valuePath(config, "user.field");
        } else if (config.record) {
            // 记录解析
            normalized.dataType = "RECORD";
        } else if (config.hasOwnProperty("table")) {
            // 表格列处理
            normalized.dataType = "TABLE"
            normalized.tableColumns = Opt.dataTable(data);
        } else {
            normalized.dataType = "DATUM";
        }
    }
}
const dataSearchInput = (normalized = {}, data = {}) => {
    const layout = Ux.valuePath(data, "optionJsx.layout");
    if (layout) {
        const {left, right} = layout;
        normalized.layoutLeft = left;
        normalized.layoutRight = right;
    } else {
        /* 默认 */
        normalized.layoutLeft = 16;
        normalized.layoutRight = 8;
    }
}
const dataSearchRangeDate = (normalized = {}, data = {}) => {
    normalized.rangeMode = Ux.valuePath(data, "optionJsx.mode");
    normalized.format = Ux.valuePath(data, "optionJsx.format");
}
const DATA_EXECUTOR = {
    aiPassword: dataPassword,                       // 密码框
    aiInputNumber: dataInputNumber,                 // 数值输入框
    aiTextArea: dataTextArea,                       // 多文本框
    aiSelect: dataSelect,                           // 下拉框
    aiTreeSelect: dataTreeSelect,                   // 树型下拉
    aiCheckbox: dataCheckbox,                       // 多选框
    aiRadio: dataRadio,                             // 单选框
    aiDatePicker: Opt.dataDate,                     // 日期选择
    aiTimePicker: Opt.dataDate,                     // 时间选择
    aiFileUpload: dataFileUpload,                   // 上传组件
    aiTransfer: dataTransfer,                       // 穿梭框
    aiBraftEditor: dataBraftEditor,                 // 富文本
    aiAddressSelector: dataAddressSelector,         // 地址选择器
    aiJsonEditor: dataJsonEditor,                   // Json编辑器
    aiTreeSelector: dataTreeSelector,               // 树选择器
    aiTableEditor: dataTableEditor,                 // format 专用处理
    aiTitle: dataTitle,                             // 标题处理
    aiMagic: dataMagic,                             // 数据呈现专用
    aiAction: dataAction,                           // 按钮专用
    aiSearchInput: dataSearchInput,                 // 搜索匹配框
    aiSearchRangeDate: dataSearchRangeDate,         // 搜索范围框
}
export default {
    // 专用
    dataComponent: (normalized = {}, data = {}, reference) => {
        const render = normalized.render;
        const executor = DATA_EXECUTOR[render];
        if (Ux.isFunction(executor)) {
            executor(normalized, data, reference);
        }
    }
}