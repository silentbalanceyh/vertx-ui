// 默认导入
import React from "react";
import Highlighter from "react-highlight-words";
import {Divider, Icon, Popconfirm, Tooltip} from "antd";
import {Link} from "react-router-dom";
// 引擎内
import WebFilter from "./web-filter";
import WebUnit from "./web-unit";
import WebField from './web-field';
import Rft from "./raft";
import R from "./expression";
import Datum from "./datum";
// 引擎外
import Abs from '../abyss';
import T from "../unity";
import Ele from "../element";
import './web-column.less';
import Fn from './functions';
import Ajax from '../ajax';
import {saveAs} from "file-saver";

const _jsxObject = (children = {}) => {
    const keys = Object.keys(children);
    return (
        <ul className={"ux-ul"}>
            {keys.map(key => (<li key={key}>{key} = {children[key]}</li>))}
        </ul>
    );
}
const _jsxArray = (children = [], config = {}) => {
    // 计算列宽度
    const {__array = {}} = config;
    // 基础表格渲染
    let fields = [];
    if (Abs.isArray(__array.fields)) {
        fields = __array.fields;
    } else {
        children.forEach(child => {
            const keys = Object.keys(child);
            if (fields.length < keys.length) {
                fields = keys;
            }
        });
    }
    // 修改 Array 类型的呈现
    const widthMap = __array.width ? __array.width : {};
    const isPure = 0 === fields.length;
    return (
        <table className={`${isPure ? "ux-table-nested-pure" : "ux-table-nested"}`}>
            {0 < fields.length ? (
                <thead>
                <tr>
                    {fields.map(field => {
                        const style = {};
                        if (widthMap.hasOwnProperty(field)) {
                            // 各自16的边距
                            style.width = widthMap[field];
                        }
                        return (
                            <th key={field} style={style}>{field}</th>
                        )
                    })}
                </tr>
                </thead>
            ) : false}
            <tbody>
            {children.map((child, childIdx) => (
                <tr key={`row${childIdx}`}>
                    {isPure ? (
                        <td key={`${childIdx}`}>{child}</td>
                    ) : (fields.map(field => (
                        <td key={`${field}${childIdx}`}>{child[field]}</td>
                    )))}
                </tr>
            ))}
            </tbody>
        </table>
    );
}

const jsxSpan = (attrs = {}, children, config = {}) => {
    const {jsxIcon} = config;
    return (
        <span {...attrs}>
            {(() => {
                if (Abs.isObject(children)) {
                    return _jsxObject(children);
                } else if (Abs.isArray(children)) {
                    return _jsxArray(children, config);
                } else return children;
            })()}
            {Abs.isFunction(jsxIcon) ? jsxIcon() : false}
        </span>
    )
}
const jsxIcon = (attrs = {}, children, iconData) => {
    if (iconData) {
        const {icon, iconStyle = {}} = iconData;
        const addOn = {};
        addOn.style = iconStyle;
        if (iconStyle.color) {
            addOn['data-color'] = iconStyle.color;
            addOn['data-size'] = iconStyle.fontSize;
        }
        const style = {};
        if (32 < iconStyle.fontSize) {
            style.lineHeight = `${iconStyle.fontSize}px`
        }
        return (
            <span className={"web-icon-label"}>
                {WebUnit.aiIcon(icon, addOn)}
                &nbsp;&nbsp;
                {jsxSpan({
                    ...attrs,
                    className: "label",
                    style
                }, children)}
            </span>
        )
    } else {
        return (
            <span>
                {jsxSpan(attrs, children)}
            </span>
        )
    }
};

const queryStored = (reference = {}) => {
    /* query 专用 */
    const {$query} = reference.props;
    if (Abs.isObject($query)) {
        const queryStr = T.encryptBase64(JSON.stringify($query));
        return `condition=${queryStr}`;
    } else {
        return "";
    }
};
const Cmn = {
    /* 分割线 */
    jsxDivider: (key) => (<Divider type={"vertical"} key={key}/>),
    /* onClick 专用链接 */
    jsxLink: (item = {}) => item.enabled ? (
        // eslint-disable-next-line
        <a key={item.key} onClick={item.onClick}
           className={item.icon ? "ux-link-icon" : ""}>
            {item.icon ? <Icon type={item.icon}/> : false}
            {item.text}
        </a>
    ) : false,
    /* onConfirm 专用 */
    jsxConfirm: (item = {}) => item.enabled ? (
        <Popconfirm key={item.key} title={item.confirm}
                    overlayClassName={"ux-confirm-op"}
                    icon={<Icon type="exclamation-circle" theme="filled"/>}
                    onConfirm={item.onConfirm}>
            {/* eslint-disable-next-line*/}
            <a>{item.text}</a>
        </Popconfirm>
    ) : false,
    /* */
    /* jsxSpan */
    jsxSpan,
    /* jsxIcon */
    jsxIcon,
    /* jsxUser */
    jsxLazy: (attrs = {}, dataMap = {}) => {
        const value = dataMap[attrs.$key];
        return jsxIcon({}, value, {icon: attrs.$icon})
    },
    /* jsxHyper */
    jsxHyper: (attributes = {}, children) => {
        let {reference, url, ...attrs} = attributes;
        const {$router, $app} = reference.props;
        if ($app) {
            url = `/${$app._("path")}${url}`;
        }
        if (0 < url.indexOf("?")) {
            url += `&`
        } else {
            url += `?`
        }
        url += queryStored(reference);
        url += `&target=${$router.path()}`;
        return (
            <Link {...attrs} to={url}>{children}</Link>
        )
    },
    normalizeInit: (config, keys = []) => {
        const attrs = {};
        Ele.valueCopy(attrs, config, [
            "className",
            "style"
        ].concat(keys));
        return attrs;
    },
    /* normalizeText */
    normalizeText: (text, config, record) => {
        let normalizedText = text;
        if (normalizedText) {
            /*
            * 1.1. 第一处理 $expr 表达式，由于使用了表达式
            * 证明当前值需要最终处理 $expr 的核心内容，前提是 text 有值
            */
            const expression = config["$expr"];
            if (expression && "string" === typeof expression) {
                /*
                 * 表达式条件
                 * 1. 配置了 $expr
                 * 2. $expr 的类型是 String 字符串
                 * 3. 追加 value 到新的 record 中用于处理 :value 的表达式，还可处理其他表达式
                 */
                const original = Abs.clone(record);
                original.value = text;
                normalizedText = T.formatExpr(expression, original, true);
            }
        } else {
            /*
             * 1.2. 只有无值的时候，$empty 才有用
             */
            const empty = config["$empty"];
            if (empty && "string" === typeof empty) {
                normalizedText = config["$empty"];
            }
        }
        return normalizedText;
    },
    /* normalizeIcon */
    normalizeIcon: (item = {}) => {
        let iconAttrs = {};
        Ele.valueCopy(iconAttrs, item, ["icon", "iconStyle"]);
        if (iconAttrs.icon) {
            if (!iconAttrs.iconStyle) {
                iconAttrs.iconStyle = {};
            }
            const iconRef = iconAttrs.iconStyle;
            if (iconRef.hasOwnProperty('fontSize')) {
                iconRef.fontSize = Ele.valueInt(iconRef.fontSize, 14);
            }
        }
        return Abs.isEmpty(iconAttrs) ? undefined : iconAttrs;
    },
    /* 长文本处理 */
    normalizeOverflow: (attrs = {}, config = {}) => {
        /*
         * 2.带省略号文字专用处理
         */
        const {width} = config;
        if (!attrs.style) attrs.style = {};
        if (0 < width) {
            attrs.style.overflow = "hidden";
            attrs.style.whiteSpace = "nowrap";
            attrs.style.textOverflow = "ellipsis";
            attrs.style.maxWidth = width;
            attrs.style.width = width;
            attrs.style.display = "inline-block";  // 必须有内容才会生效
            return true;
        } else {
            return false;
        }
    }
}
const TEXT = (reference, column = {}) => {
    let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
    attrs.reference = reference;
    return (text, record) => {
        attrs = Abs.clone(attrs);
        let normalizedText = Cmn.normalizeText(text, column, record);               // 1.格式化文字
        let isPop = false;
        if (normalizedText) {
            isPop = Cmn.normalizeOverflow(attrs, column);                           // 2.带省略号文字专用处理
        }
        return isPop ? (
            <Tooltip title={normalizedText}
                     overlayClassName={"web-tool-tip"}>
                {Cmn.jsxSpan(attrs, normalizedText)}
            </Tooltip>
        ) : Cmn.jsxSpan(attrs, normalizedText);
    }
}

const _setExecutor = (option = {}, item, metadata = {}) => {
    const {
        executor = {},  /* 执行器函数 */
        reference,      /* 当前组件引用 */
        text,           /* Ant Design 中的 text */
        record,         /* 当前行的记录集 */
        config = {}     /* 当前字段对应的配置数据 */
    } = metadata;
    if (item.executor) {
        const fun = executor[item.executor];
        if (Abs.isFunction(fun)) {
            const fnExecutor = (event) => {
                event.preventDefault();
                const configuration = {
                    config,     // 完整配置
                    reference,  // 引用
                };
                if (item.ajax) {
                    configuration.ajax = item.ajax;
                }
                fun(text, record, configuration);
            };
            if (item.confirm) {
                option.confirm = item.confirm;
                option.onConfirm = fnExecutor;
            } else {
                option.onClick = fnExecutor;
            }
        } else {
            option.error = "Not Function";
            console.error(option.error);
        }
    } else {
        option.error = "No Executor";
        console.error(option.error);
    }
};

const _setEnabled = (calculated, item = {}, executor = {}, options = {}) => {
    if (Abs.isEmpty(executor)) {
        /*
         * 直接禁用
         */
        return false;
    } else {
        /*
         * 基础检查（先检查 executor 中是否包含了 item
         */
        if (executor.hasOwnProperty(item.executor)) {
            /*
             * 包含了，则执行 calculated 的判断
             */
            if ("fnEdit" === item.executor || "fnDelete" === item.executor) {
                if (calculated.edition && "fnEdit" === item.executor) {
                    /*
                     * 编辑按钮
                     */
                    const option = options['op.row.edit'];
                    if (undefined === option) {
                        return true;
                    } else {
                        return !!option;
                    }
                } else if (calculated.deletion && "fnDelete" === item.executor) {
                    /*
                     * 删除按钮
                     */
                    const option = options['op.row.delete'];
                    if (undefined === option) {
                        return true;
                    } else {
                        return !!option;
                    }
                } else return false;
            } else {
                return true;
            }
        } else {
            // 不包含的情况，直接 false
            return false;
        }
    }
};

const _setRule = (option, item = {}, record = {}) => {
    if (item.rule) {
        try {
            const rule = item.rule;
            const field = rule.field;
            const value = record[field];
            const replaced = rule.value[value];
            if (replaced) {
                Object.assign(option, replaced);
            }
        } catch (error) {
        }
    }
}

const _aiAdorn = (config = {}, record = {}, reference) => {
    const {adorn} = config;
    if (adorn) {
        const {field, items = {}} = adorn;
        if (field) {
            const iconExpr = items[record[field]];
            if (iconExpr) {
                const parsed = iconExpr.split(',');
                if (3 === parsed.length) {
                    const iconData = {};
                    iconData.icon = parsed[0];
                    iconData.iconStyle = {};
                    iconData.iconStyle.fontSize = parsed[1] ? parsed[1] : 14;
                    if (parsed[2]) {
                        iconData.iconStyle.color = parsed[2];
                    }
                    return iconData;
                }
            }
        }
    }
}
const _aiSum = (config = {}, record = {}) => {
    const {field = [], op = "P"} = config;
    const defaultValue = op === "M" ? 1 : 0;
    let sum = defaultValue;
    field.forEach(each => {
        const value = Ele.valueFloat(record[each], defaultValue);
        if ("M" === op) {
            sum *= value;
        } else {
            sum += value;
        }
    });
    return sum;
}

const LAZY_COLUMN = (reference, column) => {
    let attrs = Cmn.normalizeInit(column, ["$empty"]);                              // -1. 风格可静态化
    const {$config = {}} = column;                                                       // -2. 配置处理
    return (text, record) => {
        attrs = Abs.clone(attrs);
        const {$lazy = {}} = reference.state ? reference.state : {};                     // 设置 icon Style
        const columnValue = $lazy[column.dataIndex];
        let children;
        if (columnValue) {
            children = columnValue[text];
            if (!children) {
                children = columnValue['undefined']
            }
        }
        const {icon} = $config;
        const iconAttrs = {};
        if (icon || !$config.hasOwnProperty("icon")) {
            if (text) {
                const segments = icon ? icon.split(',') : [];
                iconAttrs.icon = segments[0] ? segments[0] : "user";
                iconAttrs.iconStyle = {
                    color: segments[1] ? segments[1] : "#CD2990",
                    fontSize: 16
                }
            } else {
                const segments = icon ? icon.split(',') : [];
                iconAttrs.icon = segments[0] ? segments[0] : "setting";
                iconAttrs.iconStyle = {
                    color: segments[1] ? segments[1] : "#7D7D7D",
                    fontSize: 16
                }
            }
        }
        delete attrs['$empty'];
        return Cmn.jsxIcon(attrs, children, iconAttrs);
    }
};
const RENDERS = {
    // field = 属性信息，对应 dataIndex，title = 标题信息，对应 title
    /*
     * 列配置
     * {
     *      "metadata": "field,title,TOTAL",
     *      "style": "",
     *      "className": "",
     *      "$config": {
     *          "field": [
     *              "操作字段1",
     *              "操作字段2"
     *          ],
     *          "op": "P = Plus,加法，M = 乘法",
     *          "currency": "货币单位"
     *      }
     * }
     *
     * 场景：
     * 单价 x 数量 = 总价
     *
     * 属性：
     * - field, 执行计算的操作字段（当前record记录中）
     * - op，分两种求和（连乘和连加）
     * - currency：货币单位
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    TOTAL: (reference, column = {}) => {
        let attrs = Cmn.normalizeInit(column);
        return (text, record = {}) => {
            const {$config = {}} = column;
            let sum = _aiSum($config, record);
            record[column.dataIndex] = sum;
            const {currency} = $config;
            if (currency) {
                sum = `${currency}${T.formatCurrency(sum)}`;
            }
            return Cmn.jsxSpan(attrs, sum, column);
        }
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,ROW",
     *      "$config": {
     *          "field": "aiTreeSelect",
     *          "jsx": {
     *              "style": {
     *                  "width": "160px"
     *              },
     *              "config": {
                        "datum": "source=term.expense,key=key,label=code",
                        "expr": ":name（:code）",
                        "tree": "text=label,parent=parentId"
                    }
     *          }
     *      }
     * }
     *
     * 场景：
     * 链接到表单组件，可输入而产生表格编辑效果（拓展为表格编辑）
     *
     * 属性：
     * - field, 可操作的表单渲染方法（参考表单部分）
     * - jsx，对应表单组件中的 optionJsx
     * - fieldCond, 条件字段，默认 key（更新数据专用）
     * - fieldKey，提值字段，通常为主键，默认key（更新数据专用）
     *
     * 标准化：
     * - 「x」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    ROW: (reference, column = {}) => {
        const {value = []} = reference.props;
        const {$config = {}} = column;
        const {
            field, jsx = {},
            fieldCond = 'key',
            fieldKey = 'key'
        } = $config;
        const executor = WebField[field];
        // jsx processing
        return (text, record = {}) => {
            const $jsx = Abs.clone(jsx);
            if (Abs.isFunction(executor)) {
                if (text) {
                    $jsx.value = text;
                }
                return executor(reference, $jsx, (data) => {
                    record[column.dataIndex] = data;
                    const $value = Abs.clone(value);
                    let foundIndex = Ele.elementIndex(value, fieldCond, record[fieldKey]);
                    if (0 <= foundIndex) {
                        $value[foundIndex] = Abs.clone(record);
                    }
                    Abs.fn(reference).onChange($value);
                })
            } else {
                return (
                    <span>{field} is invalid</span>
                )
            }
        }
    },
    /*
     * 「保留」列配置
     * {
     *      "metadata": "field,title,CONNECT",
     *      "style": "",
     *      "className": "",
     *      "$option": [
     *          "添加",
     *          "删除"
     *      ]
     * }
     *
     * 场景：
     * 多个链接连接操作专用，该操作依赖注入的 reference 的状态变量，状态中必须包含：
     * $connect = [
     *      {
     *          "config": {
     *              "pos": "链接到 column.dataIndex"
     *          }
     *      }
     * ]
     * 最终会渲染成类似如下链接
     *
     * 添加 | 删除 | 编辑
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    CONNECT: (reference, column) => {
        let attrs = Cmn.normalizeInit(column);
        attrs.reference = reference;
        return (text, record) => {
            attrs = Abs.clone(attrs);
            const {$connect = []} = reference.state;
            const connect = $connect.filter(item => {
                const {config = {}} = item;
                return column.dataIndex === config.pos;
            });
            const normalized = [];
            connect.forEach((item, index) => {
                if (0 < index) {
                    normalized.push("divider");
                }
                normalized.push(item);
            })
            return (
                <span>
                {normalized.map((item) => {
                    if ("divider" === item) {                                   // 由于在遍历过程中，所以 `key` 是必须的
                        return (
                            <Divider type={'vertical'} key={T.randomUUID()}/>
                        )
                    } else {
                        const {onClick, ...rest} = item;
                        if (Abs.isFunction(onClick)) {
                            const fnClick = onClick(item, record);
                            return WebUnit.aiAnchor(rest, fnClick, "LINK");
                        } else return false;
                    }
                })}
                </span>
            );
        }
    },
    /*
     * （Zero Extension工具管理界面内部专用）列配置
     * {
     *      "metadata": "field,title,EDITOR",
     *      "$config": {
     *          "render": "aiSelect",
     *          "optionJsx.config.items":[
     *              "GET,GET方法",
     *              "PUT,PUT方法
     *          ]
     *      }
     * }
     *
     * 旧版使用config，新使用$config和外层统一，由于历史原因，EDITOR 和 ROW 有点重复，但为了
     * 使得整个界面一致，推荐优先使用EDITOR，次之则使用ROW，属性内容可参考 ROW 类型。
     *
     * 场景：
     *
     * 表格编辑
     *
     * 标准化：
     * - 「x」不支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    EDITOR: (reference, column = {}) => {
        const cell = {};                                                    // Cell 处理
        cell.field = column.dataIndex;
        const $cell = column.config ? column.config : {};                   // 旧版优先级高
        const $config = column.$config ? column.$config : {};               // 新版优先级低
        Object.assign(cell, $config, $cell);
        if (!cell.optionJsx) {
            cell.optionJsx = {};
        }
        if (!cell.optionConfig) {
            cell.optionConfig = {};
        }
        return (text, record, index) => {
            const {disabled = false, config = {}} = reference.props;
            /* 处理专用 */
            const rowCell = Abs.clone(cell);
            rowCell.optionJsx.value = record[rowCell.field];
            rowCell.optionJsx.disabled = disabled;                          // 禁用处理
            rowCell.column = {
                index,                                                      // 列变更时的索引
                format: config.format,                                      // 格式信息
            }
            const render = Rft.raftRender(rowCell, {
                addOn: {
                    reference
                },
            });
            return render(record);
        }
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,CURRENT",
     *      "style": "",
     *      "className": "",
     *      "$empty": ""
     *      "$config": {
     *          "unit": "￥",
     *          "after": "true | false"
     *      }
     * }
     *
     * 场景：
     * - 呈现金额信息，显示货币金额
     *
     * 属性：
     * - unit：货币单位，默认使用￥（人民币）
     * - after：货币和金额的位置
     *    - after = true：1,200￥
     *    - after = false：￥1,200
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「o」支持 $empty
     */
    CURRENCY: (reference, column) => {
        let attrs = Cmn.normalizeInit(column);                                  // -1. 风格可静态化
        if (column['$expr']) delete column['$expr'];                            // -2. 必须删除 $expr
        return (text, record) => {
            attrs = Abs.clone(attrs);
            let normalizedText = Cmn.normalizeText(text, column, record);       // 1.格式化文字
            if (undefined === normalizedText) {                                 // 2.设置单位信息
                normalizedText = 0
            }
            const $config = column["$config"] ? column["$config"] : {};
            const unit = $config.unit ? $config.unit : "￥";
            const after = !!$config.after;
            normalizedText = T.formatCurrency(normalizedText);                  // 3. 格式化货币
            if (unit) {
                if (after) {                                                    // 4. 前后计算单位
                    normalizedText = `${normalizedText}${unit}`;
                } else {
                    normalizedText = `${unit}${normalizedText}`;
                }
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,DATE",
     *      "style": "",
     *      "className": "",
     *      "$empty": "",
     *      "$format": "YYYY-MM-DD",
     *      "$config": {
     *          "format"
     *      }
     * }
     *
     * 场景：
     * - 主要用于呈现时间信息
     *
     * 属性：
     * - 旧版：$format用来描述时间格式
     * - 新版：$config.format用来描述时间格式（低优先级）
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「o」支持 $empty
     */
    DATE: (reference, column) => {
        let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
        if (column['$expr']) delete column['$expr'];                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = Abs.clone(attrs);
            let normalizedText = Cmn.normalizeText(text, column, record);               // 1.格式化文字
            if (normalizedText && text) {
                let format = column["$format"];
                if (!format) {
                    const {$config = {}} = column;
                    format = $config["format"];                                         // 新版专用
                }
                normalizedText = T.formatDate(normalizedText, format);                  // 2.格式化
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        };
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,DATUM",
     *      "style": "",
     *      "className": "",
     *      "$datum": "source=bill.type,value=code,display=name",
     *      "$empty": "xxxx"
     *      "$config": {
     *          "adorn": {
     *              "field": "f1",
     *              "items": {
     *                  "record[f1]": "icon,size,color",
     *                  "record[f2]": "icon,size,color",
     *              }
     *          }
     *      }
     * }
     *
     * 场景：
     * - 字典信息专用处理，执行复杂的字典结构
     *
     * 属性：
     *
     * - $datum: source     = 字典名称
     *           value      = 字典值字段
     *           display    = 字典显示字段（display可支持 $expr 格式）
     * - adorn：修饰专用，可让字典类型支持图标格式，通常根据某个属性的值进行计算，主要修饰 icon
     *
     * 此处的 column 可支持三种格式：
     *
     * 1. 常用
     * {
     *      "$datum": "xxxxx"       // 新版常用格式
     *      "datum": "xxxxx"        // 旧版常用格式
     *      "items": "xxxxx"        // 「不推荐使用」静态格式，可直接使用MAPPING替代，所以一般不使用
     * }
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」不直接支持 $expr，但可直接在 display 中书写可解析表达式
     * - 「o」支持 $empty
     */
    DATUM: (reference, column = {}) => {
        let attrs = Cmn.normalizeInit(column);                                              // -1. 风格可静态化
        const normalized = R.Ant.toUnique(reference, column);                               // -2. 处理 normalized 解析 $datum 的相关处理
        const {data = [], config = {}} = normalized;
        const {display, value} = config;
        return (text) => {
            attrs = Abs.clone(attrs);
            let normalizedText;                                                             // 1. 解析 display, value
            let iconData;
            if (Abs.isArray(text)) {
                // 多值
                const result = text
                    .map(item => Ele.elementUnique(data, value, item))
                    .map(item => T.valueExpr(display, item, true));
                normalizedText = result.join(',');
            } else {
                // 单值
                const item = Ele.elementUnique(data, value, text);                          // 单值
                if (item) {
                    const adornCfg = column.$config ? column.$config : {};                  // 只有查找对了单值的时候才执行该操作 解析 adorn 执行图标处理
                    iconData = _aiAdorn(adornCfg, item);
                    normalizedText = T.valueExpr(display, item, true);
                } else {
                    const {$empty} = column;
                    if ($empty) {
                        normalizedText = $empty;
                    } else {
                        normalizedText = false;
                    }
                }
            }
            return Cmn.jsxIcon(attrs, normalizedText, iconData);
        }
    },
    /*
     * 「可注入函数」列配置
     * {
     *      "metadata": "field,title,DICT",
     *      "$config": {
     *          "field": "xxx"
     *      }
     * }
     *
     * 场景：
     * 纯字典类型，从 props 中提取专用字典 $dict，如果字典有问题则渲染异常信息，这种模式支持函数
     *
     * 属性：
     * - field：默认使用name，也可使用其他属性信息，特殊 $dict 专用
     *
     * 标准化：
     * - 「x」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「x」不支持 $empty
     */
    DICT: (reference, column = {}) => (text, record = {}) => {
        const {$dict = {}} = reference.props;                               // 提取特殊变量 $dict
        const attrs = {};
        if (Abs.isEmpty($dict)) {
            attrs.style = {color: "red"};
            return Cmn.jsxSpan(attrs, "ERROR");
        } else {
            const {$config = {}} = column;
            const fieldName = $config.field ? $config.field : "name";
            const ref = $dict[record[fieldName]];                           // 读取 Source field <- record <- $dict（两层穿透）
            if (!ref) {
                return Cmn.jsxSpan(attrs, text);
            } else {
                let normalized;
                if (Abs.isFunction(ref)) {
                    normalized = ref(text, record);
                } else {
                    normalized = ref[text];
                }
                if (normalized) {
                    if (Abs.isObject(normalized)) {
                        normalized = normalized.display;
                    }
                    return Cmn.jsxSpan(attrs, normalized);
                } else {
                    return Cmn.jsxSpan(attrs, text);
                }
            }

        }
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,FILE_SIZE",
     *      "style": "",
     *      "className": "",
     *      "$empty": ""
     * }
     *
     * 场景：
     * - 智能显示文件尺寸
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」不支持 $expr
     * - 「o」支持 $empty
     */
    FILE_SIZE: (reference, column) => {
        let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
        if (column['$expr']) delete column['$expr'];                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = Abs.clone(attrs);
            let normalizedText = Cmn.normalizeText(text, column, record);               // 1.格式化文字
            if (normalizedText) {
                normalizedText = Fn.toFileSize(text);                                   // 2.格式化
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,DOWNLOAD",
     *      "style": "",
     *      "className": "",
     *      "$empty": ""
     * }
     *
     * 场景：
     * - 下载链接专用
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」不支持 $expr
     * - 「o」支持 $empty
     */
    DOWNLOAD: (reference, column) => {
        let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
        if (column['$expr']) delete column['$expr'];                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = Abs.clone(attrs);
            let normalizedText = Cmn.normalizeText(text, column, record);               // 1.格式化文字
            const $config = column['$config'];
            return (
                // eslint-disable-next-line
                <a href={""} onClick={event => {
                    Abs.prevent(event);
                    const {uri = ""} = $config.ajax ? $config.ajax : {}
                    const link = T.formatExpr(uri, record, true);
                    const value = {value: record.key, name: text}
                    Ajax.ajaxDownload(link, value, {})
                        .then(data => saveAs(data, value.name));
                }}>{Cmn.jsxSpan(attrs, normalizedText)}</a>
            );
        }
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,EXECUTOR",
     *      "$option": [
     *          {
     *              "text": "编辑",
     *              "executor": "fnEdit"
     *          },
     *          "divider",
     *          {
     *              "text": "删除",
     *              "executor": "fnDelete",
     *              "confirm": "确认删除选择的实体记录？"
     *          }
     *      ]
     * }
     *
     * 场景：
     * 专用操作按钮
     *
     * 属性：
     *
     * - text：链接文字
     * - executor：外围专用函数（$executor）     $plugins.koRow 执行操作符过滤
     * - confirm：浮游提示框文字
     *
     * 标准化：
     * - 「x」不支持 style, className 默认
     * - 「o」不支持 $expr，转移到 text 文字中
     * - 「x」不支持 $empty
     */
    EXECUTOR: (reference, column, executor = {}) => (text, record) => {
        const {$options = {}} = reference.props;
        const {$option = []} = column;
        const options = [];
        // 「显示 / 隐藏」过滤 $plugins.koRow
        T.pluginKoRow(reference, record, $option).forEach((item, index) => {
            // 「启用 / 禁用」过滤 ￥plugins.pluginRow（和表单会绑定，ACL操作）
            const calculated = T.pluginOp(reference, record);
            const rowKey = `${text}-${index}`;                                          // 行专用的 key
            if (rowKey) {
                const option = {};
                option.key = `link-${rowKey}`;
                option.text = T.formatExpr(item.text, record);
                option.enabled = _setEnabled(
                    calculated, item,
                    executor, $options
                );
                if (option.enabled) {
                    _setExecutor(option, item, {
                        text, record,
                        config: column,
                        executor,
                        reference,
                    });
                    _setRule(option, item, record);
                    options.push(option);
                } else {
                    const viewText = $options['op.row.view'];                          // fnEdit 切换，编辑被关闭
                    if ("fnEdit" === item.executor && viewText) {                      // 打开 fnEdit
                        option.enabled = true;
                        option.icon = "search";
                        option.text = viewText;
                        _setExecutor(option, item, {
                            text, record,
                            config: column,
                            executor,
                            reference,
                        });
                        options.push(option);
                    }
                }
            }
        });
        // 自动计算 divider
        let normalized = [];
        for (let idx = 0; idx < options.length; idx++) {
            const option = options[idx];
            normalized.push(option);
            if (idx < options.length - 1) {
                const item = {};
                item.divider = true;
                item.key = `link-devider-${text}-${idx}`;
                normalized.push(item);
            }
        }
        return (
            <div style={{
                width: "100%",
                textAlign: "center",
                ...column.style ? column.style : {}
            }}>
                {0 < options.filter(item => !item.divider).length ?
                    normalized.map(item => item.divider ?
                        Cmn.jsxDivider(item.key) :                                      // Divider 渲染
                        (item.confirm ? Cmn.jsxConfirm(item) : Cmn.jsxLink(item))       // Confirm 窗口处理，链接专用处理
                    ) : false}
            </div>
        );
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,HYPERLINK",
     *      "style": "",
     *      "className": "",
     *      "$config": {
     *          "url"
     *      }
     * }
     *
     * 场景：
     * 调用 React-Router 专用链接函数
     *
     * 属性：
     * - url，可支持表达式的链接信息
     * - 支持浮游文字专用任务，Tooltip面板处理
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    HYPERLINK: (reference, column) => {
        let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
        attrs.reference = reference;                                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = Abs.clone(attrs);
            let normalizedText = Cmn.normalizeText(text, column, record);               // 1.格式化文字
            let isPop = false;
            if (normalizedText) {
                const $config = column["$config"] ? column["$config"] : {};             // 2.链接专用处理
                if ($config.url) {
                    attrs.url = T.formatExpr($config.url, record, true);
                }
                isPop = Cmn.normalizeOverflow(attrs, column);                           // 3.Overflow
            }
            return isPop ? (
                <Tooltip title={normalizedText}
                         overlayClassName={"web-tool-tip"}>
                    {Cmn.jsxHyper(attrs, normalizedText)}
                </Tooltip>
            ) : Cmn.jsxHyper(attrs, normalizedText);
        }
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,LOGICAL",
     *      "style": "",
     *      "className": "",
     *      "$mapping": {
     *          "true": "消费项,pay-circle,16,#268941",
     *          "false": "付款项,pay-circle,16,#f6af03"
     *      }
     * }
     *
     * 场景：
     * 逻辑模式专用，主要处理 true / false 两种模式，支持图标信息
     *
     * 属性：
     * - 表达式格式：text - 文字信息
     *             icon - 图标基本信息
     *             size - 图标大小
     *             color - 图标颜色
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」支持 $expr
     * - 「o」支持 $empty
     */
    LOGICAL: (reference, column = {}) => {
        let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
        const {$mapping = {}} = column;                                                 // -2. 静态部分，先解析 $mapping 并且只解析一次
        const parsed = {};
        Object.keys($mapping)
            .forEach(key => parsed[key] = R.aiExprIcon($mapping[key]));
        return (originalText, record = {}) => {
            attrs = Abs.clone(attrs);
            const item = originalText ? parsed["true"] : parsed["false"];               // 1. 根据值提取 item
            const normalizedIcon = Cmn.normalizeIcon(item);                             // 2. icon 的规范化
            const normalizedText = Cmn.normalizeText(item.text, column, record);        // 3.格式化文字
            return Cmn.jsxIcon(attrs, normalizedText, normalizedIcon)
        }
    },
    /*
     * 列配置（LOGICAL增强版）
     * {
     *      "metadata": "field,title,MAPPING",
     *      "style": "",
     *      "className": "",
     *      "$mapping": {
     *          "value1": "消费项,pay-circle,16,#268941",
     *          "value2": "付款项,pay-circle,16,#f6af03"
     *      }
     * }
     *
     * 场景：
     * - 多值模式专用
     *
     * 属性：
     * - 表达式格式：text - 文字信息
     *             icon - 图标基本信息
     *             size - 图标大小
     *             color - 图标颜色
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」支持 $expr
     * - 「o」支持 $empty
     */
    MAPPING: (reference, column) => {
        let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
        const {$mapping = {}} = column;
        // -2. 静态部分，先解析 $mapping 并且只解析一次
        const parsed = {};
        Object.keys($mapping)
            .forEach(key => {
                let processed = key;
                if (0 < key.indexOf('`')) {
                    // valueLadder 中符号冲突, 1）.号需要转换成 ` 来处理 literal 中的值, 2）因为值中可能包含 . 号
                    const reg = new RegExp("`", "g");
                    processed = key.replace(reg, '.');
                }
                parsed[processed] = R.aiExprIcon($mapping[key]);
            });
        return (originalText, record) => {
            attrs = Abs.clone(attrs);
            let item = parsed[originalText];                                            // 1. 根据值提取 item
            if (!item) item = {};
            const normalizedIcon = Cmn.normalizeIcon(item);                             // 2. icon 的规范化
            const normalizedText = Cmn.normalizeText(item.text, column, record);        // 3.格式化文字
            if (Abs.isDiff(attrs.style, item.style)) {                                  // 4.合并 item 中的
                attrs.style = item.style;
            }
            return Cmn.jsxIcon(attrs, normalizedText, normalizedIcon);
        }
    },

    /*
     * 列配置
     * {
     *      "metadata": "field,title,PERCENT",
     *      "style": "",
     *      "className": "",
     *      "$empty": ""
     *      "$config": {
     *      }
     * }
     *
     * 场景：
     * - 呈现百分比
     *
     * 属性：
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「x」不支持 $expr
     * - 「o」支持 $empty
     */
    PERCENT: (reference, column) => {
        let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
        if (column['$expr']) delete column['$expr'];                                    // -2. 必须删除 $expr
        return (text, record) => {
            attrs = Abs.clone(attrs);
            let normalizedText = Cmn.normalizeText(text, column, record);               // 1.格式化文字
            if (normalizedText) {
                normalizedText = T.formatPercent(text);                                 // 2.格式化
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
    /*
     * 列配置（高亮专用）
     * {
     *      "metadata": "field,title,PURE",
     *      "style": "",
     *      "className": "",
     *      "$empty": "",
     *      "highlight": ""
     *      "$config": {
     *      }
     * }
     *
     * 场景：
     * - 可支持高亮模式的文本处理
     *
     * 属性：
     * - highlight 开启高亮
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」不支持 $expr
     * - 「o」支持 $empty
     */
    PURE: (reference, column = {}) => {
        let attrs = Cmn.normalizeInit(column);                                          // -1. 风格可静态化
        return (text, record = {}) => {
            attrs = Abs.clone(attrs);
            const normalizedText = Cmn.normalizeText(text, column, record);             // 1.格式化文字
            if (column.highlight) {                                                     // 2.执行 highlight 专用处理
                const {$keyword = {}} = reference.state ? reference.state : {};         // 支持 $filter 的专用搜索高亮处理
                const words = Object.keys($keyword)
                    .filter(cond => cond.startsWith(column.dataIndex))
                    .map(cond => $keyword[cond]);
                return (
                    <Highlighter
                        highlightStyle={{backgroundColor: '#ffc069', padding: 0}}
                        searchWords={words}
                        autoEscape
                        textToHighlight={normalizedText ? normalizedText.toString() : ""}
                    />
                );
            } else {
                return Cmn.jsxSpan(attrs, normalizedText, column);
            }
        }
    },
    /*
     * 列配置
     * {
     *      "metadata": "field,title,<?>",
     *      "style": "",
     *      "className": "",
     *      "$config": {
     *          "url"
     *      }
     * }
     *
     * 场景：
     * 默认值，可不填写
     *
     * 属性：
     * - $expr
     * - $empty
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    TEXT,
    /*
     * 列配置
     * {
     *      "metadata": "field,title,USER",
     *      "style": "",
     *      "className": "",
     *      "$config": {
     *          "uri": "/api/user/:key",
     *          "field": "realname",
     *          "method": "GET"
     *      }
     * }
     *
     * 场景：
     * 带链接的延迟加载专用模式，可支持图标等
     *
     * 属性：
     * - $expr
     * - $empty
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    USER: LAZY_COLUMN,  // 旧版
    LAZY: LAZY_COLUMN,  // 新版
    /*
     * 列配置
     * {
     *      "metadata": "field,title,ARRAY",
     *      "style": "",
     *      "className": ""
     * }
     *
     * 场景：
     * 数组构成模式，列表呈现数据
     *
     * 属性：
     * - $expr
     * - $empty
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    ARRAY: (reference, config = {}) => {
        let attrs = Cmn.normalizeInit(config);                                      // -1. 风格可静态化
        return (text, record) => {
            attrs = Abs.clone(attrs);
            if (Abs.isArray(text)) {                                                // 1.格式化文字
                text = text.join(",");
            }
            let normalizedText = Cmn.normalizeText(text, config, record);
            if (normalizedText) {
                Cmn.normalizeOverflow(attrs, config);                               // 2.带省略号文字专用处理
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
    /*
     * 「编程模式」列配置
     * {
     *      "metadata": "field,title,RENDERS",
     *      "style": "",
     *      "className": ""
     *      "config": {
     *          "value": "code",
     *          "mapping": {
     *              "globalId": "sourceGlobalId",
     *              "name": "sourceName",
     *              "identifier": "sourceIdentifier"
     *          }
     *      }
     * }
     *
     * 场景：
     * 根据 $renders 提取编程信息，没有 $renders 时转 TEXT
     *
     * 属性：
     * - $expr
     * - $empty
     *
     * 标准化：
     * - 「o」支持 style, className 默认
     * - 「o」支持 $expr
     * - 「o」支持 $empty
     */
    RENDERS: (reference, column) => {
        const {$renders = {}} = reference.props;
        const Component = $renders[column.dataIndex];
        if (Component) {
            const {config = {}} = column;
            return (text, record) => {
                const data = Abs.clone(record);
                const inherit = Datum.onUniform(reference.props);
                if (config.value) {                                     // value / identifier 特殊，用于生成配置
                    data[config.value] = text;
                }
                if (config.mapping) {
                    Object.keys(config.mapping).forEach(to => {
                        const from = config.mapping[to];
                        data[to] = data[from];
                    })
                }
                inherit.data = data;
                inherit.config = config;
                if (Abs.isFunction(Component)) {
                    return Component(inherit);
                } else {
                    return (<Component {...inherit}/>);
                }
            }
        } else {
            console.warn("没有找到对应的 $renders, column =", column.dataIndex)
            return TEXT(reference, column);
        }
    },
    // 打开列过滤专用代码
    supports: [
        "TEXT",
        "PURE",
        "LOGICAL",
        "MAPPING",
        "ARRAY",
        "DATUM"
    ]
}
const exported = {
    columnFilter: (reference = {}, column = {}) => {
        if (column.hasOwnProperty("$filter")) {
            if (column.hasOwnProperty("key")) {
                /*
                 * 仅保留 dataIndex 作为唯一的列标识
                 */
                delete column.key;
            }
            const {$filter = {}} = column;
            const {config = {}, type = "DIRECT"} = $filter;
            const executor = WebFilter[type];
            if (Abs.isFunction(executor)) {
                /*
                 * 满足信息的相关处理
                 */
                executor(reference, column, config);
            } else {
                console.error(`[Err] type = ${type} 的模式目前不支持！`);
            }
        }
    },
    /*
     * 由于系统在点击表格的 onChange 会优先触发一个 loading 的效果
     * 也就是说这个 loading 效果会使得 sorter 必须要受控，否则一旦 setState
     * 排序的内容就会被还原，导致排序失效，这种情况在不设置 filter 的时候是不存在的
     * 所以设置内置属性：
     * 1. $stateSorter 变量用于控制
     * 2. $condition 则是真正需要使用的查询条件
     */
    columnSorter: (reference = {}, column = {}) => {
        /* 是否开启可控 */
        const {$stateSorter = false} = reference.state ? reference.state : {};
        if ($stateSorter) {
            if (column.sorter) {
                /* FIX：解决排序和过滤同时出现的情况，这种情况排序需要受控 */
                const {$sorter = {}} = reference.state ? reference.state : {};
                if (Abs.isEmpty($sorter)) {
                    // 没有排序规则
                    column.sortOrder = false;
                } else {
                    if ($sorter.order && $sorter.field === column.dataIndex) {
                        column.sortOrder = $sorter.order;
                    } else {
                        // 不属于当前字段排序
                        column.sortOrder = false;
                    }
                }
            }
        }
    },
    columnRender: (reference = {}, column = {}, ops) => {
        const {$render = "PURE"} = column;
        const executor = RENDERS[$render];
        if (Abs.isFunction(executor)) {
            /*
             * 过滤掉不支持过滤的情况
             */
            if (column.hasOwnProperty("$filter")) {
                if (RENDERS.supports.includes($render)) {
                    /*
                     * 支持
                     */
                    const $filter = column['$filter'];
                    if (Abs.isObject($filter)) {
                        const {type = "DIRECT"} = $filter;
                        if ("SEARCH" === type) {
                            /*
                             * 只有搜索类才会处理 highlight 专用
                             */
                            column.highlight = true;
                        }
                    }
                } else {
                    /*
                     * 列过滤设置过程中，如果出现了不支持列过滤的类型
                     * 则直接删除列过滤配置 $filter
                     */
                    delete column['$filter'];
                }
            }

            column.render = executor(reference, column, ops);
        } else {
            console.error(`[ UxW ] 没有找到对应的 render 函数：${$render}`);
        }
    },
    columnWrapper: (reference, column = {}) => {
        let fnOriginal;
        if (Abs.isFunction(column.render)) {
            fnOriginal = column.render;
            delete column.render;
        }
        const {$config = {}} = column;
        if (!Abs.isEmpty($config)) {
            const {wrapper = false} = $config;
            if (wrapper) {
                const {rowSpan} = $config;
                if (undefined !== rowSpan) {
                    column.render = T.columnWrapper(column, fnOriginal)
                }
            }
        }
        if (!column.render) {
            if (Abs.isFunction(fnOriginal)) {
                column.render = fnOriginal;
            }
        }
        return column;
    },
    // 同义词处理
    columnSynonym: (reference, column = {}) => {
        const {$synonym = {}} = reference.props;
        if ($synonym.hasOwnProperty(column.dataIndex)) {
            column.title = $synonym[column.dataIndex]
        }
        return column;
    }
};
export default exported;