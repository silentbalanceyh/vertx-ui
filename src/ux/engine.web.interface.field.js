// 内部要用的接口函数

import __Zs from 'zs';

const __UCA = __Zs.V_UCA_CONTROL;
// =====================================================
// 按钮
// =====================================================
/**
 * ## 「标准」`Ux.aiAction`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiAction = (reference, jsx = {}) => __UCA.aiAction(reference, jsx);
/**
 * ## 「标准」`Ux.aiSubmit`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param optionJsx
 * @returns {*}
 */
const aiSubmit = (reference, optionJsx = {}) => __UCA.aiSubmit(reference, optionJsx);
/**
 * ## 「标准」`Ux.aiButtonGroup`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param buttons
 * @returns {*}
 */
const aiButtonGroup = (reference, buttons = []) => __Zs.aiButtonGroup(reference, buttons);
/**
 * ## 「标准」`Ux.aiButton`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param button
 * @returns {*}
 */
const aiButton = (reference, button = {}) => __Zs.aiButton(reference, button);
// =====================================================
// 非操作的交互式组件
// =====================================================
/**
 * ## 「标准」`Ux.aiInput`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiInput = (reference, jsx = {}, onChange) => __UCA.aiInput(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiInputPassword`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
// import InputPassword from './O.input.password';
const aiPassword = (reference, jsx = {}, onChange) => __UCA.aiPassword(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiCaptcha`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiCaptcha = (reference, jsx = {}, onChange) => __UCA.aiCaptcha(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiProtocol`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiProtocol = (reference, jsx = {}, onChange) => __UCA.aiProtocol(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiInputNumber`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiInputNumber = (reference, jsx = {}, onChange) => __UCA.aiInputNumber(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiHidden`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiHidden = (reference, jsx = {}) => __UCA.aiHidden(reference, jsx);

// import Select from './O.select';
/**
 * ## 「标准」`Ux.aiSelect`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param input
 * @param onChange
 * @returns {*}
 */
const aiSelect = (reference, input = {}, onChange) => __UCA.aiSelect(reference, input, onChange);

/**
 * ## 「标准」`Ux.aiTextArea`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiTextArea = (reference, jsx = {}) => __UCA.aiTextArea(reference, jsx);

/**
 * ## 「标准」`Ux.aiDatePicker`
 *
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
// import DatePicker from './O.picker.date';
const aiDatePicker = (reference, jsx = {}, onChange) => __UCA.aiDatePicker(reference, jsx, onChange);

/**
 * ## 「标准」`Ux.aiTimePicker`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */

const aiTimePicker = (reference, jsx = {}, onChange) => __UCA.aiTimePicker(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiCheckbox`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiCheckbox = (reference, jsx = {}, onChange) => __UCA.aiCheckbox(reference, jsx, onChange);

/**
 * ## 「标准」`Ux.aiTreeSelect`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiTreeSelect = (reference, jsx = {}, onChange) => __UCA.aiTreeSelect(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiRadio`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiRadio = (reference, jsx = {}, onChange) => __UCA.aiRadio(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiTreeSelector`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
// import TreeSelector from './O.selector.tree';
const aiTreeSelector = (reference, jsx = {}) => __UCA.aiTreeSelector(reference, jsx);
/**
 * ## 「标准」`Ux.aiTableEditor`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
// import TableEditor from './O.editor.table';
const aiTableEditor = (reference, jsx = {}, onChange) => __UCA.aiTableEditor(reference, jsx, onChange);


// import SearchRangeDate from './O.search.range.date';
/**
 * ## 「标准」`Ux.aiSearchRangeDate`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiSearchRangeDate = (reference, jsx = {}) => __UCA.aiSearchRangeDate(reference, jsx);


// import SearchInput from './O.search.input';
/**
 * ## 「标准」`Ux.aiSearchInput`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiSearchInput = (reference, jsx = {}) => __UCA.aiSearchInput(reference, jsx);


//import MatrixSelector from './O.selector.matrix';
/**
 * ## 「标准」`Ux.aiMatrixSelector`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiMatrixSelector = (reference, jsx = {}) => __UCA.aiMatrixSelector(reference, jsx);


//import Magic from './O.magic';
/**
 * ## 「标准」`Ux.aiMagic`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiMagic = (reference, jsx = {}) => __UCA.aiMagic(reference, jsx);


//import ListSelector from './O.selector.list';
/**
 * ## 「标准」`Ux.aiListSelector`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiListSelector = (reference, jsx = {}) => __UCA.aiListSelector(reference, jsx);
/**
 * ## 「标准」`Ux.aiUserSelector`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiUserSelector = (reference, jsx = {}) => __UCA.aiUserSelector(reference, jsx);
/**
 * ## 「标准」`Ux.aiUserLeader`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiUserLeader = (reference, jsx = {}) => __UCA.aiUserLeader(reference, jsx);

/**
 * ## 「标准」`Ux.aiGroupSwitcher`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiGroupSwitcher = (reference, jsx = {}) => __UCA.aiGroupSwitcher(reference, jsx);
/**
 * ## 「标准」`Ux.aiUserGroup`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiUserGroup = (reference, jsx = {}) => __UCA.aiUserGroup(reference, jsx);

// import JsonEditor from './O.editor.json';
/**
 * ## 「标准」`Ux.aiJsonEditor`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiJsonEditor = (reference, jsx = {}, onChange) => __UCA.aiJsonEditor(reference, jsx, onChange);


//import InputArray from './O.input.array';
/**
 * ## 「标准」`Ux.aiInputMulti`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiInputMulti = (reference, jsx = {}, onChange) => __UCA.aiInputMulti(reference, jsx, onChange);


// import FileUpload from './O.file.upload';
/**
 * ## 「标准」`Ux.aiFileUpload`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiFileUpload = (reference, jsx = {}, onChange) => __UCA.aiFileUpload(reference, jsx, onChange);

/**
 * ## 「标准」`Ux.aiFileLogo`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiFileLogo = (reference, jsx = {}, onChange) => __UCA.aiFileLogo(reference, jsx, onChange);
/**
 * ## 「标准」`Ux.aiFileBatch`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiFileBatch = (reference, jsx = {}, onChange) => __UCA.aiFileBatch(reference, jsx, onChange);


// import DialogEditor from './O.editor.dialog';
/**
 * ## 「标准」`Ux.aiDialogEditor`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @returns {*}
 */
const aiDialogEditor = (reference, jsx = {}) => __UCA.aiDialogEditor(reference, jsx);


// import Transfer from './O.transfer';
/**
 * ## 「标准」`Ux.aiTransfer`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiTransfer = (reference, jsx = {}, onChange) => __UCA.aiTransfer(reference, jsx, onChange);


// import CheckJson from './O.check.json';
/**
 * ## 「标准」`Ux.aiCheckJson`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiCheckJson = (reference, jsx = {}, onChange) => __UCA.aiCheckJson(reference, jsx, onChange);


// import AddressSelector from './O.selector.address';
/**
 * ## 「标准」`Ux.aiAddressSelector`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiAddressSelector = (reference, jsx = {}, onChange) => __UCA.aiAddressSelector(reference, jsx, onChange);


// import RichEditor from './O.editor.rich';
/**
 * ## 「标准」`Ux.aiBraftEditor`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiBraftEditor = (reference, jsx = {}, onChange) => __UCA.aiBraftEditor(reference, jsx, onChange);
// import aiTableTransfer from './O.tree.select';
/**
 * ## 「标准」`Ux.aiTableTransfer`
 * @memberOf module:ai-form/zest
 * @param reference
 * @param jsx
 * @param onChange
 * @returns {*}
 */
const aiTableTransfer = (reference, jsx = {}, onChange) => __UCA.aiTableTransfer(reference, jsx, onChange);
const exported = {
    // 验证码
    aiCaptcha,
    /**
     * ## 「标准」`Ux.ai2Captcha`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2Captcha: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiCaptcha(reference, jsx, fnChange);
    },
    // 协议专用（多个解析按钮）
    aiProtocol,
    /**
     * ## 「标准」`Ux.ai2Protocol`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2Protocol: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiProtocol(reference, jsx, fnChange);
    },
    // 常规录入
    aiInput,
    /**
     * ## 「标准」`Ux.ai2Input`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2Input: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiInput(reference, jsx, fnChange);
    },

    // 密码输入框
    aiPassword,
    /**
     * ## 「标准」`Ux.ai2Password`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2Password: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiPassword(reference, jsx, fnChange);
    },


    // 数字输入框
    aiInputNumber,
    /**
     * ## 「标准」`Ux.ai2InputNumber`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2InputNumber: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiInputNumber(reference, jsx, fnChange);
    },


    aiInputMulti,
    /**
     * ## 「标准」`Ux.ai2InputMulti`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2InputMulti: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiInputMulti(reference, jsx, fnChange);
    },

    // 多选框
    aiCheckbox,
    /**
     * ## 「标准」`Ux.ai2Checkbox`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2Checkbox: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiCheckbox(reference, jsx, fnChange);
    },

    aiCheckJson,

    aiSubmit,
    aiAction,

    // 隐藏元素
    aiHidden,


    // 显示数据
    aiMagic,


    // 下拉
    aiSelect,
    /**
     * ## 「标准」`Ux.ai2Select`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2Select: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiSelect(reference, jsx, fnChange);
    },


    // 多行文本输入
    aiTextArea,
    /**
     * ## 「标准」`Ux.ai2TextArea`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2TextArea: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiTextArea(reference, jsx, fnChange);
    },


    // 日期选择器
    aiDatePicker,
    /**
     * ## 「标准」`Ux.ai2DatePicker`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2DatePicker: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiDatePicker(reference, jsx, fnChange);
    },


    // 时间选择
    aiTimePicker,


    // 树下拉选择器
    aiTreeSelect,
    /**
     * ## 「标准」`Ux.ai2TreeSelect`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2TreeSelect: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiTreeSelect(reference, jsx, fnChange);
    },


    // 单选框
    aiRadio,
    /**
     * ## 「标准」`Ux.ai2Radio`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2Radio: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiRadio(reference, jsx, fnChange);
    },


    // 选择穿梭框
    aiTransfer,
    /**
     * ## 「标准」`Ux.ai2Transfer`
     * @memberOf module:ai-form/zest
     * @param onChange
     * @returns {*}
     */
    ai2Transfer: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiTransfer(reference, jsx, fnChange);
    },


    // 列表多选器
    aiMatrixSelector,
    /**
     * ## 「标准」`Ux.ai2MatrixSelector`
     *
     * @memberOf module:ai-form/zest
     * @param mockData
     * @returns {function(*, {}=): *}
     */
    ai2MatrixSelector: (mockData = {}) => (reference, jsx = {}) => {
        jsx.mock = mockData;
        return aiMatrixSelector(reference, jsx);
    },


    // 列表选择器
    aiListSelector,
    /**
     * ## 「标准」`Ux.ai2ListSelector`
     *
     * @memberOf module:ai-form/zest
     * @param mockData
     * @returns {function(*, {}=): *}
     */
    ai2ListSelector: (mockData = {}) => (reference, jsx = {}) => {
        jsx.mock = mockData;
        return aiListSelector(reference, jsx);
    },


    // 树选择器
    aiTreeSelector,
    /**
     * ## 「标准」`Ux.ai2TreeSelector`
     *
     * @memberOf module:ai-form/zest
     * @param mockData
     * @returns {function(*, {}=): *}
     */
    ai2TreeSelector: (mockData = {}) => (reference, jsx = {}) => {
        jsx.mock = mockData;
        return aiTreeSelector(reference, jsx);
    },


    // 地址选择器
    aiAddressSelector,
    /**
     * ## 「标准」`Ux.ai2AddressSelector`
     *
     * @memberOf module:ai-form/zest
     * @param onSelect
     * @param mockData
     * @returns {function(*, {}=): *}
     */
    ai2AddressSelector: (onSelect, mockData = {}) => (reference, jsx = {}) => {
        const fnChange = onSelect.apply(null, [reference]);
        jsx.mock = mockData;
        return aiAddressSelector(reference, jsx, fnChange);
    },


    // 用户选择器
    aiUserSelector,
    // 用户组切换器,
    aiGroupSwitcher,
    // 经理选择器
    aiUserLeader,
    // 用户组设置
    aiUserGroup,

    // 上传组件
    aiFileUpload,


    // 图标上传
    aiFileLogo,


    // 批量上传组件
    aiFileBatch,


    // 表格编辑器
    aiTableEditor,


    // 富文本编辑器
    aiBraftEditor,


    aiButton,
    aiButtonGroup,


    // 弹出框选择器
    aiDialogEditor,


    // Json编辑器
    aiJsonEditor,


    // 搜索专用
    aiSearchInput,


    // 时间搜索专用
    aiSearchRangeDate,

    // 树 + 表格编辑穿梭
    aiTableTransfer,
};
export default exported;