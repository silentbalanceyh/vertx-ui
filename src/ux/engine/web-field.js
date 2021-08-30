import {
    AddressSelector,
    BraftEditor,
    CheckJson,
    CheckTransfer,
    DialogEditor,
    FileUpload,
    InputArray,
    JsonEditor,
    ListSelector,
    MagicView,
    MatrixSelector,
    SearchInput,
    SearchRangeDate,
    TableEditor,
    TreeSelector
} from "web";
import {Button, Checkbox, DatePicker, Input, InputNumber, Radio, Select, Switch, TimePicker, TreeSelect} from "antd";
// 内部要用的接口函数
import R from "./expression";
import Abs from '../abyss';
import T from "./datum";
import React from "react";
import Ut from "../unity";
import './web-field.less';
import Act from './action';

const filterOption = (inputText, option) => {
    const {props = {}} = option;
    // 先做 value 匹配
    const {value, children} = props;
    if (0 <= value.indexOf(inputText)) {
        return true;
    } else {
        return (0 <= children.indexOf(inputText))
    }
}
const normalizeAttribute = (reference, jsx, onChange) => {
    // 解决 rest 为 {} 时引起的 Bug
    let rest = {};
    Object.keys(jsx).filter(key => ![
        "config",   // optionJsx.config
        "depend",  // optionJsx.depend
        "filter",    // optionJsx.filter
        // 下边是注入类配置
        "eventPrevent",
        "eventDisabled",
        "options",   // 后入参数
    ].includes(key))
        .forEach(key => rest[key] = jsx[key]);
    rest = Abs.clone(rest); // 拷贝防止二次
    /*
     * 1）onChange 事件的处理（先构造配置项）
     */
    const {
        config,                  // 基本项配置：optionJsx.config
        depend,                 // 触发项配置：optionJsx.depend
        eventPrevent = true,     // 行为项配置：（编程传入）
        eventDisabled = false,   // ReadOnly的时候是否禁用（用于特殊配置）
        options = [],            // options，用于后期处理
    } = jsx;
    const $config = {
        reference,                      // 组件引用
        prevent: eventPrevent,          // 特殊配置
        options,                        // 处理 options 专用
    };
    if (config) {
        $config.config = Abs.clone(config);      // 当前 Jsx 核心配置
    }
    if (depend) {
        $config.depend = Abs.clone(depend);    // 当前 depend 配置
    }
    /*
     * 往 rest 中注入特殊的 onChange
     */
    R.Ant.onChange(rest, onChange, $config);

    /*
     * 2）ReadOnly处理
     * 注意第二参数，该参数用于让组件在 readOnly 的时候同步 disabled 禁用组件
     * 如果组件不是 Input 的时候必须
     */
    R.Ant.onReadOnly(rest, eventDisabled, reference);
    return rest;    // 返回构造好的 rest
}
// =====================================================
// 按钮
// =====================================================
const _jsxUniform = (jsx = {}, fnRender) => {
    const {grouped = false} = jsx;
    if (grouped) {
        return (
            <Button.Group>
                {Abs.isFunction(fnRender) ? fnRender() : false}
            </Button.Group>
        )
    } else {
        return (
            <span>
                {Abs.isFunction(fnRender) ? fnRender({
                    style: {
                        marginRight: 8
                    }
                }) : false}
            </span>
        )
    }
};
const aiAction = (reference, jsx = {}) =>
    _jsxUniform(jsx, (config = {}) => {
        const {actions = [], loading = false} = jsx;
        return actions.map(item => {
            const {text, ...rest} = item;
            rest.loading = loading;
            /*
             * 禁用处理
             */
            if (!rest.hasOwnProperty('disabled')) {
                const {disabled = false} = jsx;
                rest.disabled = disabled;
            }
            return (
                <Button {...rest} style={config.style}>{text}</Button>
            );
        })
    });
const aiSubmit = (reference, optionJsx = {}) => {
    const cell = {optionJsx};
    Act.raftAction(cell, reference);
    const {actions = []} = optionJsx;
    if (1 === actions.length) {
        const {$loading = false} = reference.state;
        const action = actions[0];
        const {text, ...rest} = action;
        rest.loading = $loading;
        return (
            <Button {...rest}>{text}</Button>
        )
    } else {
        throw new Error("aiSubmit必须配置单独的SUBMIT操作！");
    }
}

const aiButtonGroup = (reference, buttons = []) => {
    if (1 === buttons.length) {
        const button = buttons[0];
        return aiButton(reference, button);
    } else {
        return (
            <Button.Group>
                {buttons.map(button => aiButton(reference, button))}
            </Button.Group>
        )
    }
};

const aiButton = (reference, button = {}) => {
    if (!button.key) {
        button.key = Ut.randomUUID();
    }
    const {text, ...rest} = button;
    return (
        <Button {...rest}>{text}</Button>
    )
};
// =====================================================
// 非操作的交互式组件
// =====================================================
// import Input from './O.input';
const aiInput = (reference, jsx = {}, onChange) => {
    jsx = Abs.clone(jsx);
    // 处理prefix属性
    R.Ant.onPrefix(jsx);
    // 处理addonAfter
    R.Ant.onAddonAfter(jsx);
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    // ReadOnly处理
    R.Ant.onReadOnly(jsx, false, reference);
    // 处理PlaceHolder，先处理readOnly
    R.Ant.onPlaceHolder(jsx);
    return (<Input {...jsx}/>);
};

// import InputNumber from './O.input.number';
const aiInputNumber = (reference, jsx = {}, onChange) => {
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    // ReadOnly处理
    R.Ant.onReadOnly(jsx, false, reference);
    // numeric 配置
    const {numeric = {}, ...rest} = jsx;
    if (numeric.percent) {
        rest.formatter = value => `${value}%`;
        rest.parser = value => value.replace(`%`, '');
    } else {
        // 输入单位
        if (numeric.unit) {
            if (numeric.unitPosition) {
                // 右侧
                rest.formatter = value => `${value} ${numeric.unit}`;
            } else {
                // 左侧
                rest.formatter = value => `${numeric.unit} ${value}`;
            }
            rest.parser = value => value.replace(numeric.unit, "");
        }
    }
    return (<InputNumber {...rest}/>);
};


// import InputPassword from './O.input.password';
const aiPassword = (reference, jsx = {}, onChange) => {
    // 处理prefix属性
    R.Ant.onPrefix(jsx);
    // 处理addonAfter
    R.Ant.onAddonAfter(jsx);
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    // ReadOnly处理
    R.Ant.onReadOnly(jsx, false, reference);
    // 处理PlaceHolder，先处理readOnly
    R.Ant.onPlaceHolder(jsx);
    if (jsx.readOnly) {
        jsx.visibilityToggle = false;   // 关闭切换按钮
    }
    return (<Input.Password {...jsx} autoComplete={"new-password"}/>);
};


// import Hidden from './O.hidden';
const aiHidden = (reference, jsx = {}) => {
    jsx.type = "hidden";
    return (<Input {...jsx}/>)
}


// import Select from './O.select';
const aiSelect = (reference, input = {}, onChange) => {
    const {fnFilter = () => true, ...jsx} = input;
    /*
     * filters 计算
     * 1）$filters 就是一个 Object
     * 2）$filters 是一个函数
     */
    const {config = {}, depend} = jsx;
    const options = R.Ant.toOptions(reference, config, fnFilter);
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时需要禁用
        options,
    }, onChange);
    /*
     * Linker处理，修改 onChange
     */
    R.Ant.onChange(rest, onChange, {
        config, options,
        depend,
        reference
    });
    if (!rest.disabled && !rest.readOnly) {
        rest.filterOption = filterOption
    }
    // 没有任何内容时候的 100% 宽度处理
    if (!rest.style) {
        rest.style = {width: "100%"};
    }
    return (
        <Select {...rest}>
            {options.map(item => (
                <Select.Option key={item.key} value={item.value}>
                    {item.label}
                </Select.Option>
            ))}
        </Select>
    );
};


// import TextArea from './O.textarea';
const aiTextArea = (reference, jsx = {}) => {
    return (<Input.TextArea {...jsx}/>);
}


// import DatePicker from './O.picker.date';
const aiDatePicker = (reference, jsx = {}, onChange) => {
    // DisabledDate
    R.Ant.onDisabledDate(jsx);
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    // 处理readOnly
    R.Ant.onReadOnly(jsx, true, reference);
    return (<DatePicker {...jsx} className={"ux-readonly ux-date-picker"}/>);
}


// import TimePicker from './O.picker.time';
const aiTimePicker = (reference, jsx = {}, onChange) => {
    R.Ant.onChange(jsx, onChange);
    return (<TimePicker {...jsx}/>);
}


// import Checkbox from './O.check.box';
const aiCheckbox = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventPrevent: false,        // 不关闭默认行为
        eventDisabled: true,        // 只读时候需要禁用
    }, onChange);
    /*
     * 分流：
     * 1）多选
     * 2）单选
     */
    const {config} = jsx;
    if (config) {
        const options = R.Ant.toOptions(reference, config);
        /*
         * 特殊初始值，暂时不取消这里的处理
         */
        const initial = jsx['data-initial'];
        if (initial) {
            if (Abs.isArray(initial)) {
                const {form} = reference.props;
                // form 变量专用处理
                if (!form) {
                    rest.defaultValue = initial;
                }
            }
        }
        return (
            <Checkbox.Group {...rest} options={options}/>
        )
    } else {
        const $rest = Abs.clone(rest);
        const {onChange, mode, ...left} = $rest;
        if ("SWITCH" === mode) {
            return (<Switch {...left} onChange={onChange}/>)
        } else {
            return (<Checkbox {...left} onChange={onChange}/>)
        }
    }
};


// import TreeSelect from './O.tree.select';
const aiTreeSelect = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时候需要禁用
    }, onChange);
    // 处理TreeSelect
    const {config = {}} = jsx;
    const data = R.Ant.toTreeOptions(reference, config);
    // 没有任何内容时候的 100% 宽度处理
    if (!rest.style) {
        rest.style = {width: "100%"};
    }
    return (<TreeSelect treeData={data} {...rest}/>);
};


// import Radio from './O.radio';
const aiRadio = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventDisabled: true,         // 只读时候需要禁用
    }, onChange);
    // 处理 Radio 相关
    const {config = {}} = jsx;
    const options = R.Ant.toOptions(reference, config);
    // true / false 专用，不影响 Select 的专用处理
    if (2 === options.length) {
        options.forEach(option => {
            if ("true" === option.value) {
                option.value = true;
            }
            if ("false" === option.value) {
                option.value = false;
            }
        })
    }
    // Radio的另外一种模式开启
    const {type = "RADIO"} = config;
    const Component = "RADIO" === type ? Radio : Radio.Button;
    return (
        <Radio.Group {...rest}>
            {options.map(item => (
                <Component key={item.key} style={item.style ? item.style : {}}
                           value={item.hasOwnProperty('value') ? item.value : item.key}>
                    {item.label}
                </Component>
            ))}
        </Radio.Group>
    );
};


// import TreeSelector from './O.selector.tree';
const aiTreeSelector = (reference, jsx = {}) => {
    const {$options = {}} = reference.props;
    if ($options.selectable && jsx.config) {
        /*
         * 这里的 selectable 是字段级的
         * {
         *     "field": {
         *     }
         * }
         */
        jsx.config.selectable = $options.selectable;
    }
    return (<TreeSelector {...jsx} reference={reference}/>);
};


// import TableEditor from './O.editor.table';
const aiTableEditor = (reference, jsx = {}, onChange) => {
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    return (<TableEditor {...jsx} reference={reference}/>);
};


// import SearchRangeDate from './O.search.range.date';
const aiSearchRangeDate = (reference, jsx = {}) => {
    return (<SearchRangeDate {...jsx} reference={reference}/>)
};


// import SearchInput from './O.search.input';
const aiSearchInput = (reference, jsx = {}) => {
    return (<SearchInput {...jsx} reference={reference}/>)
};


//import MatrixSelector from './O.selector.matrix';
const aiMatrixSelector = (reference, jsx = {}) => {
    return (<MatrixSelector {...jsx} reference={reference}/>);
};


//import Magic from './O.magic';
const aiMagic = (reference, jsx = {}) => {
    /*
     * 解析 items 专用，必须要有
     */
    const {config = {}, ...rest} = jsx;
    const items = R.Ant.toOptions(reference, config);
    if (items && items.length > 0) {
        config.items = items;
    }
    /*
     * 新增 record 解析
     * 格式：prefix = json
     */
    if (config.record) {
        config.rxRecord = R.Ant.toRecord(reference, config);
    }
    /*
     * 绑定 $a_ 和 $t_
     */
    const inherit = T.onUniform(reference.props);
    return (<MagicView {...rest} config={config}
                       reference={reference} {...inherit}/>);
};


//import ListSelector from './O.selector.list';
const aiListSelector = (reference, jsx = {}) => {
    return (<ListSelector {...jsx} reference={reference}/>);
};


// import JsonEditor from './O.editor.json';
const aiJsonEditor = (reference, jsx = {}, onChange) => {
    // onChange处理
    R.Ant.onChange(jsx, onChange);
    return (<JsonEditor {...jsx} reference={reference}/>)
};


//import InputArray from './O.input.array';
const aiInputMulti = (reference, jsx = {}, onChange) => {
    // 处理 onChange 处理
    R.Ant.onChange(jsx, onChange);
    // ReadOnly 处理
    R.Ant.onReadOnly(jsx, false, reference);
    return (<InputArray {...jsx} reference={reference}/>)
}


// import FileUpload from './O.file.upload';
const aiFileUpload = (reference, jsx = {}, onChange) => {
    R.Ant.onChange(jsx, onChange);
    // 是否支持多文件
    R.Ant.onMultiple(jsx);
    return (<FileUpload {...jsx} reference={reference}/>);
};


// import DialogEditor from './O.editor.dialog';
const aiDialogEditor = (reference, jsx = {}) => {
    /*
     * 表格中的行执行器
     */
    const {
        $rows = {},
        $plugins = {},
    } = reference.props;
    /*
     * 特殊函数执行
     * $plugins -> 只有 DialogEditor 才会使用该函数，执行
     * 核心过滤，判定 EXECUTOR 部分
     */
    const inherit = jsx;
    inherit.reference = reference;
    inherit.$rows = $rows;
    /*
     * 构造新的逻辑流程
     */
    inherit.$plugins = $plugins;
    return (<DialogEditor {...inherit}/>)
};


// import Transfer from './O.transfer';
const aiTransfer = (reference, jsx = {}, onChange) => {
    /*
     * filters 计算
     * 1）$filters 就是一个 Object
     * 2）$filters 是一个函数
     */
    const {config = {}, depend} = jsx;
    const options = R.Ant.toOptions(reference, config);
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventDisabled: true,        // 只读时需要禁用
        options,
    }, onChange);
    /*
     * Linker处理，修改 onChange
     */
    R.Ant.onChange(rest, onChange, {
        config, options, reference, depend
    });
    // 打开限制继承
    return (
        <CheckTransfer {...rest} config={config}  // 因为 rest 中去掉了 config, trigger, filter
                       $source={options}
                       reference={reference}/>
    )
};


// import CheckJson from './O.check.json';
const aiCheckJson = (reference, jsx = {}, onChange) => {
    /*
     * 1）onChange
     * 2）readOnly
     * 3）disabled
     */
    const rest = normalizeAttribute(reference, {
        ...jsx,
        eventPrevent: false,        // 不关闭默认行为
        eventDisabled: true,        // 只读时候需要禁用
    }, onChange);
    /*
     * 多选
     */
    const {config} = jsx;
    const options = R.Ant.toOptions(reference, config);
    /*
     * 特殊初始值，暂时不取消这里的处理
     */
    const initial = jsx['data-initial'];
    if (initial) {
        if (Abs.isArray(initial)) {
            rest.defaultValue = initial;
        }
    }
    return (<CheckJson {...rest} reference={reference} $source={options}/>)
}


// import AddressSelector from './O.selector.address';
const aiAddressSelector = (reference, jsx = {}) =>
    (<AddressSelector {...jsx} reference={reference}/>);


// import RichEditor from './O.editor.rich';
const aiBraftEditor = (reference, jsx = {}, onChange) => {
    R.Ant.onChange(jsx, onChange);
    return (<BraftEditor {...jsx} reference={reference}/>);
};
const exported = {
    // 常规录入
    aiInput,
    ai2Input: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiInput(reference, jsx, fnChange);
    },

    // 密码输入框
    aiPassword,
    ai2Password: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiPassword(reference, jsx, fnChange);
    },


    // 数字输入框
    aiInputNumber,
    ai2InputNumber: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiInputNumber(reference, jsx, fnChange);
    },


    aiInputMulti,
    ai2InputMulti: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiInputMulti(reference, jsx, fnChange);
    },

    // 多选框
    aiCheckbox,
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
    ai2Select: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiSelect(reference, jsx, fnChange);
    },


    // 多行文本输入
    aiTextArea,
    ai2TextArea: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiTextArea(reference, jsx, fnChange);
    },


    // 日期选择器
    aiDatePicker,
    ai2DatePicker: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiDatePicker(reference, jsx, fnChange);
    },


    // 时间选择
    aiTimePicker,


    // 树下拉选择器
    aiTreeSelect,
    ai2TreeSelect: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiTreeSelect(reference, jsx, fnChange);
    },


    // 单选框
    aiRadio,
    ai2Radio: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiRadio(reference, jsx, fnChange);
    },


    // 选择穿梭框
    aiTransfer,
    ai2Transfer: (onChange) => (reference, jsx = {}) => {
        const fnChange = onChange.apply(null, [reference]);
        return aiTransfer(reference, jsx, fnChange);
    },


    // 列表多选器
    aiMatrixSelector,
    ai2MatrixSelector: (mockData = {}) => (reference, jsx = {}) =>
        (<MatrixSelector reference={reference} mock={mockData} {...jsx}/>),


    // 列表选择器
    aiListSelector,
    ai2ListSelector: (mockData = {}) => (reference, jsx = {}) =>
        (<ListSelector reference={reference} mock={mockData} {...jsx}/>),


    // 树选择器
    aiTreeSelector,
    ai2TreeSelector: (mockData = {}) => (reference, jsx = {}) =>
        (<TreeSelector reference={reference} mock={mockData} {...jsx}/>),


    // 地址选择器
    aiAddressSelector,
    ai2AddressSelector: (onSelect, mockData = {}) => (reference, jsx = {}) => {
        const fnChange = onSelect.apply(null, [reference]);
        return (<AddressSelector {...jsx} reference={reference} mock={mockData}
                                 rxSelect={fnChange}/>);
    },


    // 上传组件
    aiFileUpload,


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
};
export default exported;