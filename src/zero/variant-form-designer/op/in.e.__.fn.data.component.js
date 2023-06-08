import dataAction from './in.__.@fn._.submit';
import Opt from './in.__.fn.data.option';
import __Zn from '../zero.uca.dependency';

const dataPassword = (normalized = {}, data = {}) => {
    normalized.visibilityToggle = __Zn.valuePath(data, "optionJsx.visibilityToggle");
}
const dataInputNumber = (normalized = {}, data = {}) => {
    // 最大值 / 最小值
    normalized.min = __Zn.valuePath(data, "optionJsx.min");
    normalized.max = __Zn.valuePath(data, "optionJsx.max");
    // 步进系数 / 精度
    normalized.step = __Zn.valuePath(data, "optionJsx.step");
    normalized.precision = __Zn.valuePath(data, 'optionJsx.precision');
    // 常用格式
    const numeric = __Zn.valuePath(data, "optionJsx.numeric");
    if (!__Zn.isEmpty(numeric)) {
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
    normalized.rows = __Zn.valuePath(data, "optionJsx.rows");
    // 自动缩放检测
    const autoSize = __Zn.valuePath(data, "optionJsx.autoSize");
    if (!__Zn.isEmpty(autoSize)) {
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
    normalized.mode = __Zn.valuePath(data, "optionJsx.mode");
    if ("SWITCH" === normalized.mode) {
        normalized.checkedChildren = __Zn.valuePath(data, "optionJsx.checkedChildren");
        normalized.unCheckedChildren = __Zn.valuePath(data, "optionJsx.unCheckedChildren");
    }
}

const dataRadio = (normalized = {}, data = {}) => {
    // 模式
    normalized.mode = __Zn.valuePath(data, "optionJsx.mode");
    // 宽度处理
    const style = __Zn.valuePath(data, "optionJsx.style");
    if (!__Zn.isEmpty(style)) {
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
    normalized.listType = __Zn.valuePath(data, "optionJsx.listType");
    normalized.text = __Zn.valuePath(data, "optionJsx.text");
    normalized.withCredentials = __Zn.valuePath(data, "optionJsx.withCredentials");

    const config = __Zn.valuePath(data, "optionJsx.config");
    if (!__Zn.isEmpty(config)) {
        normalized.uploadSingle = __Zn.valuePath(config, "single");
        normalized.uploadLimit = __Zn.valuePath(config, "limit");
        normalized.uploadDownFile = __Zn.valuePath(config, "fileKey");
    }
    const ajax = __Zn.valuePath(data, "optionJsx.ajax");
    if (!__Zn.isEmpty(ajax)) {
        normalized.uploadDownUri = __Zn.valuePath(ajax, "download");
        normalized.uploadUpUri = __Zn.valuePath(ajax, "uri");
        normalized.uploadUpParam = __Zn.valuePath(ajax, "params");
    }
    const accept = __Zn.valuePath(data, "accept");
    if (accept) {
        normalized.accept = accept.split(',');      // 数组
    }
}
const dataTransfer = (normalized = {}, data = {}) => {
    const config = __Zn.valuePath(data, "optionJsx.config");
    if (!__Zn.isEmpty(config)) {
        normalized.transferField = __Zn.valuePath(config, "valueKey");
        if (__Zn.isArray(config.titles)) {
            const [transferLeft, transferRight] = config.titles;
            if (transferLeft) normalized.transferLeft = transferLeft;
            if (transferRight) normalized.transferRight = transferRight;
        }
    }
}
const dataBraftEditor = (normalized = {}, data = {}) => {
    normalized.braftHeight = __Zn.valuePath(data, "optionJsx.config.height");
}
const dataAddressSelector = (normalized = {}, data = {}) => {
    normalized.addressMode = __Zn.valuePath(data, "optionJsx.config.ajax");
    const config = __Zn.valuePath(data, "optionJsx.config");
    if (!__Zn.isEmpty(config)) {
        const {country = {}, state = {}, city = {}, region = {}} = config;
        normalized.addrCountryUri = __Zn.valuePath(country, "uri");
        normalized.addrCountryField = __Zn.valuePath(country, "display");

        normalized.addrStateUri = __Zn.valuePath(state, "uri");
        normalized.addrStateField = __Zn.valuePath(state, "display");
        normalized.addrStateParent = __Zn.valuePath(state, "parent");

        normalized.addrCityUri = __Zn.valuePath(city, "uri");
        normalized.addrCityField = __Zn.valuePath(city, "display");
        normalized.addrCityParent = __Zn.valuePath(city, "parent");

        normalized.addrRegionUri = __Zn.valuePath(region, "uri");
        normalized.addrRegionField = __Zn.valuePath(region, "display");
        normalized.addrRegionParent = __Zn.valuePath(region, "parent");

        normalized.addrInitUri = __Zn.valuePath(config, "init");
    }
}
const dataJsonEditor = (normalized = {}, data = {}) => {
    normalized.jsonHeight = __Zn.valuePath(data, "optionJsx.config.height");
}
const dataTreeSelector = (normalized = {}, data = {}) => {
    // Tree 树选择
    Opt.dataTree(normalized, data);
    // 特殊选择
    const selection = __Zn.valuePath(data, "optionJsx.config.selection");
    if (!__Zn.isEmpty(selection)) {
        normalized.treeMulti = __Zn.valuePath(selection, "multiple");
        normalized.checkStrictly = __Zn.valuePath(selection, "checkStrictly");
    }
}
const dataTableEditor = (normalized = {}, data = {}) => {
    // 表格编辑器
    const format = __Zn.valuePath(data, "optionJsx.config.format");
    if (!__Zn.isEmpty(format)) {
        normalized.tableFormat = __Zn.valuePath(format, "type");
        normalized.tableKeyField = __Zn.valuePath(format, "keyField");
    }
}
const dataTitle = (normalized = {}, data = {}) => {
    const config = __Zn.valuePath(data, "optionJsx.config");
    if (__Zn.isEmpty(config)) {
        normalized.titleMode = "TITLE";
    } else {
        normalized.titleMode = "COMMENT";
        const {commentType = "info"} = config;
        normalized.commentType = commentType;
        normalized.commentTitle = __Zn.valuePath(config, "message");
        normalized.commentDescription = __Zn.valuePath(config, "description");
    }
}
const dataMagic = (normalized = {}, data = {}) => {
    const config = __Zn.valuePath(data, "optionJsx.config");
    if (!__Zn.isEmpty(config)) {
        const jsx = __Zn.valuePath(data, "optionJsx");
        const {items = []} = config;
        normalized.dataEmpty = __Zn.valuePath(config, "$empty");
        if (config.hasOwnProperty("expr")) {
            normalized.dataType = "TEXT";
            normalized.textExpr = __Zn.valuePath(config, "expr");
        } else if (jsx.moment) {        // 时间必须这样判断
            normalized.dataType = "DATE";
            normalized.dateFormat = __Zn.valuePath(config, "dateFormat");
        } else if (config.boolean && 2 === items.length) {     // 逻辑值必须这样判断
            normalized.dataType = "BOOLEAN";
            normalized.booleanTrue = __Zn.elementUnique(items, 'key', true, "label");
            normalized.booleanFalse = __Zn.elementUnique(items, 'key', false, "label");
        } else if (config.hasOwnProperty("user")) {
            normalized.dataType = "REMOTE";
            normalized.remoteUri = __Zn.valuePath(config, "user.uri");
            normalized.remoteMethod = __Zn.valuePath(config, "user.method");
            if (!normalized.remoteMethod) {
                normalized.remoteMethod = "GET";
            }
            normalized.remoteField = __Zn.valuePath(config, "user.field");
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
    const layout = __Zn.valuePath(data, "optionJsx.layout");
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
    normalized.rangeMode = __Zn.valuePath(data, "optionJsx.mode");
    normalized.format = __Zn.valuePath(data, "optionJsx.format");
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
        if (__Zn.isFunction(executor)) {
            executor(normalized, data, reference);
        }
    }
}