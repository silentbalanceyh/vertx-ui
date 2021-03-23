// 默认导入
import React from "react";
import Highlighter from "react-highlight-words";
import {Divider, Icon, Popconfirm, Tooltip} from "antd";
import {saveAs} from "file-saver";
import {Link} from "react-router-dom";
// 引擎内
import WebFilter from "./web-filter";
import WebUnit from "./web-unit";
import Rft from "./raft";
import R from "./expression";
import Datum from "./datum";
// 引擎外
import Abs from '../abyss';
import T from "../unity";
import Ele from "../element";
import Ajax from "../ajax";
import './web-column.less';

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
    const widthMap = __array.width ? __array.width : {};
    return (
        <table className={"ux-table-nested"}>
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
            <tbody>
            {children.map((child, childIdx) => (
                <tr key={`row${childIdx}`}>
                    {fields.map(field => (
                        <td key={`${field}${childIdx}`}>{child[field]}</td>
                    ))}
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
        return (
            <span>
                {WebUnit.aiIcon(icon, addOn)}
                &nbsp;&nbsp;
                {jsxSpan(attrs, children)}
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
const TEXT = (reference, config = {}) => {
    /*
     * -1. 风格可静态化
     */
    let attrs = Cmn.normalizeInit(config);
    attrs.reference = reference;
    return (text, record) => {
        attrs = Abs.clone(attrs);
        /*
         * 1.格式化文字
         **/
        let normalizedText = Cmn.normalizeText(text, config, record);
        let isPop = false;
        if (normalizedText) {
            /*
            * 2.带省略号文字专用处理
            */
            isPop = Cmn.normalizeOverflow(attrs, config);
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
                fun(text, record, {config, reference});
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

const _aiDownload = (reference, config, text) => {
    let downloadConfig = config["$download"];
    if (!downloadConfig) downloadConfig = {};
    const value = {value: text.key, name: text.name ? text.name : T.randomUUID()};
    return (<a href={value.name} onClick={(event) => {
        event.preventDefault();
        const link = T.formatExpr(downloadConfig.ajax, value);
        Ajax.ajaxDownload(link, value, {})
            .then(data => saveAs(data, value.name));
    }}>{downloadConfig.flag ? downloadConfig.flag : value.name}</a>);
};

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

const RENDERS = {
    CONNECT: (reference, column) => {

        let attrs = Cmn.normalizeInit(column);
        /*
         * -2. 必须删除 $expr
         */
        attrs.reference = reference;
        return (text, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 在 render 周期执行该操作
             */
            const {$connect = []} = reference.state;
            const connect = $connect.filter(item => {
                const {config = {}} = item;
                return column.dataIndex === config.pos;
            });
            /*
             * 构造核心函数
             */
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
                    if ("divider" === item) {
                        // 由于在遍历过程中，所以 `key` 是必须的
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
    EDITOR: (reference, column = {}) => {
        /* Cell 处理 */
        const cell = {};
        cell.field = column.dataIndex;
        const $cell = column.config ? column.config : {};
        Object.assign(cell, $cell);
        if (!cell.optionJsx) {
            cell.optionJsx = {};
        }
        if (!cell.optionConfig) {
            cell.optionConfig = {};
        }
        return (text, record, index) => {
            const {disabled = false, config = {}} = reference.props;
            /*
             * 处理专用
             */
            const rowCell = Abs.clone(cell);
            // rowCell.field = [cell.field, index];
            /*
            rowCell.optionJsx.onChange = (event) => {
                const value = Ele.ambEvent(event);
                const data = Xt.xtSet(reference, [rowCell.field, index], value);
                reference.setState({data});
                const {config = {}} = reference.props;
                Abs.fn(reference).onChange(Xt.xtFormat(data, config.format));
            }*/
            rowCell.optionJsx.value = record[rowCell.field];
            rowCell.optionJsx.disabled = disabled;      // 禁用处理
            rowCell.column = {
                index,                      // 列变更时的索引
                format: config.format,      // 格式信息
            }
            const render = Rft.raftRender(rowCell, {
                addOn: {
                    reference
                },
            });
            return render(record);
        }
    },
    CURRENCY: (reference, config) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(config);
        /*
         * -2. 必须删除 $expr
         */
        if (config['$expr']) delete config['$expr'];
        return (text, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 1.格式化文字
             **/
            let normalizedText = Cmn.normalizeText(text, config, record);
            /*
             * 2.设置单位信息
             */
            if (normalizedText) {
                const $config = config["$config"] ? config["$config"] : {};
                const unit = $config.unit ? $config.unit : "￥";
                const after = !!$config.after;
                /*
                 * 3. 格式化货币
                 */
                normalizedText = T.formatCurrency(normalizedText);
                if (unit) {
                    /*
                     * 4. 前后计算单位
                     */
                    if (after) {
                        normalizedText = `${normalizedText}${unit}`;
                    } else {
                        normalizedText = `${unit}${normalizedText}`;
                    }
                }
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
    DATE: (reference, config) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(config);
        /*
         * -2. 必须删除 $expr
         */
        if (config['$expr']) delete config['$expr'];
        return (text, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 1.格式化文字
             **/
            let normalizedText = Cmn.normalizeText(text, config, record);
            /*
             * 2.格式化
             */
            if (normalizedText && text) {
                normalizedText = T.formatDate(normalizedText, config['$format']);
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        };
    },
    DATUM: (reference, columnConfig = {}) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(columnConfig);
        /*
         * -2. 处理 normalized 解析
         * $datum 的相关处理
         */
        const normalized = R.Ant.toUnique(reference, columnConfig);
        const {data = [], config = {}} = normalized;
        const {display, value} = config;

        return (text, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 1. 解析 display, value
             */
            let normalizedText;
            let iconData;
            if (Abs.isArray(text)) {
                /*
                 * 多值
                 */
                const result = text
                    .map(item => Ele.elementUnique(data, value, item))
                    .map(item => T.valueExpr(display, item, true));
                normalizedText = result.join(',');
            } else {
                /*
                 * 单值
                 */
                const item = Ele.elementUnique(data, value, text);
                if (item) {
                    {
                        /*
                         * 只有查找对了单值的时候才执行该操作
                         * 解析 adorn 执行图标处理
                         */
                        const adornCfg = columnConfig.$config ? columnConfig.$config : {};
                        iconData = _aiAdorn(adornCfg, item);
                    }
                    normalizedText = T.valueExpr(display, item, true);
                } else {
                    const {$empty} = columnConfig;
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
    DICT: (reference, config = {}) => (text, record = {}) => {
        /*
         * 提取特殊变量 $dict
         */
        const {$dict = {}} = reference.props;
        const attrs = {};
        if (Abs.isEmpty($dict)) {
            attrs.style = {color: "red"};
            return Cmn.jsxSpan(attrs, "ERROR");
        } else {
            const {$config = {}} = config;
            const fieldName = $config.field ? $config.field : "name";
            /*
             * 读取 Source
             * field <- record <- $dict（两层穿透）
             */
            const ref = $dict[record[fieldName]];
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
                    /*
                     * 维持原始值
                     */
                    return Cmn.jsxSpan(attrs, text);
                }
            }

        }
    },
    DOWNLOAD: (reference, config) => (text, record) => {
// 上传时作了序列化，所以下载时要做反向处理
        text = JSON.parse(text);
        if (Abs.isArray(text)) {
            return (
                <ul>
                    {text.map(each => <li>{_aiDownload(reference, config, each)}</li>)}
                </ul>
            );
        } else return _aiDownload(reference, config, text);
    },
    EXECUTOR: (reference, config, executor = {}) => (text, record) => {
        // Executor 处理
        const {$options = {}} = reference.props;
        const {$option = []} = config;
        const options = [];
        // 增加过滤函数
        $option.forEach((item, index) => {
            // 函数过滤
            const calculated = T.pluginOp(reference, record);
            /*
             * 行专用的 key
             */
            const rowKey = `${text}-${index}`;

            /*
            * 追加 string 类型的 options
            * 扩展：如果 item 是 string，那么表示直接设置该属性为 true
            * _setDivider(options, item, rowKey);
            */
            if (rowKey && "string" === typeof item) {
                const option = {};
                option[item] = true;
                option.key = `link-vertical-${rowKey}`;
                _setRule(option, item, record);
                options.push(option);
            }


            /*
             * 追加 object 类型的 options
             */
            if (rowKey && "string" !== typeof item) {
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
                        config,
                        executor,
                        reference,
                    });
                    _setRule(option, item, record);
                    options.push(option);
                } else {
                    // fnEdit 切换，编辑被关闭
                    const viewText = $options['op.row.view'];
                    if ("fnEdit" === item.executor && viewText) {
                        /*
                         * 打开 fnEdit
                         */
                        option.enabled = true;
                        option.icon = "search";
                        option.text = viewText;
                        _setExecutor(option, item, {
                            text, record,
                            config,
                            executor,
                            reference,
                        });
                        options.push(option);
                    }
                }
            }
        });
        // 是否包含了 op.row.view 处理，先判断
        let normalized = [];
        if (2 === options.length) {
            normalized = options.filter(item => !item.divider);
        } else {
            normalized = Abs.clone(options);
        }
        return (
            <div style={{
                width: "100%",
                textAlign: "center",
                ...config.style ? config.style : {}
            }}>
                {0 < options.filter(item => !item.divider).length ?
                    normalized.map(item => item.divider ?
                        Cmn.jsxDivider(item.key) :     // Divider 渲染
                        // Confirm 窗口处理，链接专用处理
                        (item.confirm ? Cmn.jsxConfirm(item) : Cmn.jsxLink(item))
                    ) : false}
            </div>
        );
    },
    HYPERLINK: (reference, config) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(config);
        /*
         * -2. 必须删除 $expr
         */
        attrs.reference = reference;
        return (text, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 1.格式化文字
             **/
            let normalizedText = Cmn.normalizeText(text, config, record);
            let isPop = false;
            if (normalizedText) {
                /*
                 * 2.链接专用处理
                 */
                const $config = config["$config"] ? config["$config"] : {};
                if ($config.url) {
                    attrs.url = T.formatExpr($config.url, record, true);
                }
                /*
                 * 3.Overflow
                 */
                isPop = Cmn.normalizeOverflow(attrs, config);
            }
            return isPop ? (
                <Tooltip title={normalizedText}
                         overlayClassName={"web-tool-tip"}>
                    {Cmn.jsxHyper(attrs, normalizedText)}
                </Tooltip>
            ) : Cmn.jsxHyper(attrs, normalizedText);
        }
    },
    LOGICAL: (reference, config = {}) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(config);
        /*
         * -2. 静态部分，先解析 $mapping
         * 并且只解析一次
         */
        const {$mapping = {}} = config;
        const parsed = {};
        Object.keys($mapping)
            .forEach(key => parsed[key] = R.aiExprIcon($mapping[key]));
        return (originalText, record = {}) => {
            attrs = Abs.clone(attrs);
            /*
             * 1. 根据值提取 item
             * {
             *      "text",
             *      "icon",
             *      "iconStyle",
             * }
             */
            const item = originalText ? parsed["true"] : parsed["false"];
            /*
             * 2. icon 的规范化
             */
            const normalizedIcon = Cmn.normalizeIcon(item);
            /*
             * 3.格式化文字
             */
            const normalizedText = Cmn.normalizeText(item.text, config, record);
            return Cmn.jsxIcon(attrs, normalizedText, normalizedIcon)
        }
    },
    MAPPING: (reference, config) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(config);
        /*
         * -2. 静态部分，先解析 $mapping
         * 并且只解析一次
         */
        const {$mapping = {}} = config;
        const parsed = {};
        Object.keys($mapping)
            .forEach(key => {
                let processed = key;
                if (0 < key.indexOf('`')) {
                    /*
                     * valueLadder 中符号冲突
                     * 1）.号需要转换成 ` 来处理 literal 中的值
                     * 2）因为值中可能包含 . 号
                     */
                    const reg = new RegExp("`", "g");
                    processed = key.replace(reg, '.');
                }
                parsed[processed] = R.aiExprIcon($mapping[key]);
            });
        return (originalText, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 1. 根据值提取 item
             * {
             *      "text",
             *      "icon",
             *      "iconStyle",
             * }
             */
            let item = parsed[originalText];
            if (!item) item = {};
            /*
             * 2. icon 的规范化
             */
            const normalizedIcon = Cmn.normalizeIcon(item);
            /*
             * 3.格式化文字
             */
            const normalizedText = Cmn.normalizeText(item.text, config, record);
            /*
             * 4.合并 item 中的
             */
            if (Abs.isDiff(attrs.style, item.style)) {
                attrs.style = item.style;
            }
            return Cmn.jsxIcon(attrs, normalizedText, normalizedIcon);
        }
    },
    PERCENT: (reference, config) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(config);
        /*
         * -2. 必须删除 $expr
         */
        if (config['$expr']) delete config['$expr'];
        return (text, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 1.格式化文字
             **/
            let normalizedText = Cmn.normalizeText(text, config, record);
            /*
             * 2.格式化
             */
            if (normalizedText) {
                normalizedText = T.formatPercent(text);
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
    PURE: (reference, config = {}) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(config);
        return (text, record = {}) => {
            attrs = Abs.clone(attrs);
            /*
             * 1.格式化文字
             */
            const normalizedText = Cmn.normalizeText(text, config, record);
            /*
             * 2.执行 highlight 专用处理
             */
            if (config.highlight) {
                /*
                 * 支持 $filter 的专用搜索高亮处理
                 */
                const {$keyword = {}} = reference.state ? reference.state : {};
                const words = Object.keys($keyword)
                    .filter(cond => cond.startsWith(config.dataIndex))
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
                return Cmn.jsxSpan(attrs, normalizedText, config);
            }
        }
    },
    TEXT,
    USER: (reference, column) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(column, ["$empty"]);
        /*
         * -2. 配置处理
         */
        const {$config = {}} = column;
        return (text, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 设置 icon Style
             */
            const {$lazy = {}} = reference.state ? reference.state : {};
            const columnValue = $lazy[column.dataIndex];
            let children;
            if (columnValue) {
                children = columnValue[text];
                if (!children) {
                    children = columnValue['undefined']
                }
            }
            /*
             * icon 专用
             */
            const {icon} = $config;
            const iconAttrs = {};
            if (icon || !$config.hasOwnProperty("icon")) {
                if (text) {
                    iconAttrs.icon = "user";
                    iconAttrs.iconStyle = {
                        color: "#CD2990",
                        fontSize: 16
                    }
                } else {
                    iconAttrs.icon = "setting";
                    iconAttrs.iconStyle = {
                        color: "#7D7D7D",
                        fontSize: 16
                    }
                }
            }
            delete attrs['$empty'];
            return Cmn.jsxIcon(attrs, children, iconAttrs);
        }
    },
    ARRAY: (reference, config = {}) => {
        /*
         * -1. 风格可静态化
         */
        let attrs = Cmn.normalizeInit(config);
        return (text, record) => {
            attrs = Abs.clone(attrs);
            /*
             * 1.格式化文字
             **/
            if (Abs.isArray(text)) {
                text = text.join(",");
            }
            let normalizedText = Cmn.normalizeText(text, config, record);
            if (normalizedText) {
                /*
                * 2.带省略号文字专用处理
                */
                Cmn.normalizeOverflow(attrs, config);
            }
            return Cmn.jsxSpan(attrs, normalizedText);
        }
    },
    RENDERS: (reference, column) => {
        const {$renders = {}} = reference.props;
        const Component = $renders[column.dataIndex];
        if (Component) {
            const {config = {}} = column;
            return (text, record) => {
                const data = Abs.clone(record);
                const inherit = Datum.onUniform(reference.props);
                /*
                 * value / identifier 特殊，用于生成配置
                 */
                if (config.value) {
                    data[config.value] = text;
                }
                if (config.mapping) {
                    Object.keys(config.mapping).forEach(to => {
                        const from = config.mapping[to];
                        data[to] = data[from];
                    })
                }
                inherit.data = data;
                if (Abs.isFunction(Component)) {
                    return Component(inherit);
                } else {
                    return (<Component {...inherit}/>);
                }
            }
        } else {
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
                const $supported = Abs.immutable(RENDERS.supports);
                if ($supported.contains($render)) {
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
};
export default exported;