import dataJsx from './I.fn.jsx.js';
import dataAction from './I.fn.submit';
import Opt from './I.option';
import Ux from 'ux';

const dataPassword = (normalized = {}, params = {}) => {
    // 密码框才有的属性
    dataJsx(normalized, params, 'visibilityToggle');
}
const dataInputNumber = (normalized = {}, params = {}) => {
    // 最小值 / 最大值
    dataJsx(normalized, params, 'min');
    dataJsx(normalized, params, 'max');
    // 步进系数 / 精度
    dataJsx(normalized, params, 'step');
    dataJsx(normalized, params, "precision");
    if (params.hasOwnProperty("numberMode")) {
        // 常用格式
        const numeric = {};
        if ("PERCENT" === params.numberMode) {
            numeric.percent = true;
        } else {
            numeric.percent = false;
            numeric.unit = params.numberMode;
            numeric.unitPosition = params.numberUnitPosition;
        }
        normalized.optionJsx.numeric = numeric;
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
        normalized.optionJsx.config.single = params.uploadSingle;
    }
    dataJsx(normalized, params, 'listType');
    dataJsx(normalized, params, 'text');
    if (params.accept) {
        const acceptString = params.accept.join(',');
        normalized.optionJsx.accept = acceptString;
    }
    dataJsx(normalized, params, 'withCredentials');
    if (params.uploadLimit) {
        normalized.optionJsx.config.limit = params.uploadLimit;
    }
    if (params.uploadDownFile) {
        normalized.optionJsx.config.filekey = params.uploadDownFile;
    }
    const ajax = {};
    if (params.uploadDownUri) {
        ajax.download = params.uploadDownUri;
    }
    if (params.uploadUpUri) {
        ajax.uri = params.uploadUpUri;
    }
    if (params.uploadUpParam) {
        ajax.params = params.uploadUpParam;
    }
    normalized.optionJsx.ajax = ajax;
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
const dataTransfer = (normalized = {}, params = {}) => {
    if (params.transferField) {
        normalized.optionJsx.config.valueKey = params.transferField;
    }
    if (params.transferLeft && params.transferRight) {
        const titles = [params.transferLeft, params.transferRight];
        normalized.optionJsx.config.titles = titles;
    }
}
const dataBraftEditor = (normalized = {}, params = {}) => {
    if (params.braftHeight) {
        normalized.optionJsx.config.height = params.braftHeight;
    }
}
const dataJsonEditor = (normalized = {}, params = {}) => {
    if (params.jsonHeight) {
        normalized.optionJsx.config.height = params.jsonHeight;
    }
}
const dataAddressSelector = (normalized = {}, params = {}) => {
    if (params.addressMode) {
        normalized.optionJsx.config.ajax = params.addressMode;
    }
    if (params.addrCountryUri &&
        params.addrCountryField) {
        const country = {};
        country.uri = params.addrCountryUri;
        country.display = params.addrCountryField;
        normalized.optionJsx.config.country = country;
    }
    if (params.addrStateUri &&
        params.addrStateField && params.addrStateParent) {
        const state = {};
        state.uri = params.addrStateUri;
        state.display = params.addrStateField;
        state.parent = params.addrStateParent;
        state.field = params.addrStateParent;
        normalized.optionJsx.config.state = state;
    }
    if (params.addrCityUri &&
        params.addrCityField && params.addrCityParent) {
        const city = {};
        city.uri = params.addrCityUri;
        city.display = params.addrCityField;
        city.parent = params.addrCityParent;
        city.field = params.addrCityParent;
        normalized.optionJsx.config.city = city;
    }
    if (params.addrRegionUri &&
        params.addrRegionField && params.addrRegionParent) {
        const region = {};
        region.uri = params.addrRegionUri;
        region.display = params.addrRegionField;
        region.parent = params.addrRegionParent;
        region.field = params.addrRegionParent;
        normalized.optionJsx.config.region = region;
    }
    if (params.addrInitUri) {
        normalized.optionJsx.config.init = params.addrInitUri;
    }
}
const dataTreeSelector = (normalized = {}, params = {}) => {
    // Tree
    Opt.dataTree(normalized, params);
    // 特殊选项
    const selection = {};
    if (params.treeMulti) {
        selection.multiple = params.treeMulti;
    } else {
        selection.multiple = false;
    }
    if (params.checkStrictly) {
        selection.checkStrictly = params.checkStrictly;
    } else {
        selection.checkStrictly = false;
    }
    normalized.optionJsx.config.selection = selection;
}
const dataTableEditor = (normalized = {}, params = {}) => {
    const format = {};
    if (params.tableFormat) {
        format.type = params.tableFormat;
    } else {
        format.type = "ARRAY";
    }
    if (params.tableKeyField) {
        format.keyField = params.tableKeyField;
    } else {
        format.keyField = "key";
    }
    normalized.optionJsx.config.format = format;
}
const dataTitle = (normalized = {}, params = {}) => {
    if ("COMMENT" === params.titleMode) {
        const config = {};
        config.message = params.commentTitle;
        if (params.commentType) {
            config.type = params.commentType;
        } else {
            config.type = "info";
        }
        if (params.commentDescription) {
            const description = [];
            params.commentDescription.forEach(item => {
                description.push(item);
            });
            config.description = description;
        }
        normalized.optionJsx.config = config;
    }
}
const dataMagic = (normalized = {}, params = {}) => {
    // 所有类型合适的空值处理
    if (params.dataEmpty) {
        normalized.optionJsx.config.$empty = params.dataEmpty;
    }
    if ("TEXT" === params.dataType) {
        // 文本类型
        if (params.textExpr) {
            // 文本表达式
            normalized.optionJsx.config.expr = params.textExpr;
        }
    } else if ("BOOLEAN" === params.dataType) {
        // 布尔型
        if (params.booleanTrue && params.booleanFalse) {
            normalized.optionJsx.config.boolean = true;
            const items = [];
            items.push({key: true, value: true, label: params.booleanTrue});
            items.push({key: false, value: false, label: params.booleanFalse});
            normalized.optionJsx.config.items = items;
        }
    } else if ("DATE" === params.dataType) {
        if (params.dateFormat) {
            normalized.moment = true;
            normalized.optionJsx.config.format = params.dateFormat;
        }
    } else if ("REMOTE" === params.dataType) {
        if (params.remoteUri && params.remoteField) {
            const user = {};
            user.uri = params.remoteUri;
            user.method = params.remoteMethod ? params.remoteMethod : "GET";
            user.field = params.remoteField;
            normalized.optionJsx.config.user = user;
        }
    } else if ("RECORD" === params.dataType) {
        // 记录解析
        normalized.optionJsx.config.record = true;
    } else if ("TABLE" === params.dataType) {
        // 表格列处理
        if (params.tableColumns) {
            Opt.dataTable(normalized, params.tableColumns);
        }
    }
    // DATUM 会被解析，所以这里不用处理
}
const DATA_EXECUTOR = {
    aiPassword: dataPassword,                       // 密码框
    aiInputNumber: dataInputNumber,                 // 数值框
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
}
export default {
    // 专用
    dataComponent: (normalized = {}, params = {}, reference) => {
        const render = params.render;
        const executor = DATA_EXECUTOR[render];
        if (Ux.isFunction(executor)) {
            executor(normalized, params, reference);
        }
    },
}