import Abs from '../abyss';
import Cv from '../constant';
import T from '../unity';
import Ele from '../element';
import Ajax from '../ajax';
import Dev from '../develop';
import E from '../error';

import Rx from './expression';
import Pr from './parser';
import Q from './query';
import Datum from './datum';
import Fn from './functions';
import Raft from './raft';

import WebColumn from './web-column';
import WebUnit from './web-unit';
import WebField from './web-field';

import moment from "moment";
import {DataObject} from 'entity';
import {Tabs} from "antd";
import React from "react";

const {Logger} = Dev;

// widthSeed / widthWord
const widthSeed = () => {
    const fontSize = Cv['CSS_FONT'];       // 默认的字体值
    if (fontSize) {
        if (0 <= fontSize.indexOf("12")) {
            return 12;          // 12px;
        } else if (0 <= fontSize.indexOf("13")) {
            return 13;          // 13px;
        } else {
            return 14;          // 14px;
        }
    } else {
        return 14;              // 14px;
    }
}
const widthWord = (input, isPadding = true) => {
    let length = 0;
    if ("string" !== typeof input) {
        return 0;
    } else {
        for (let idx = 0; idx < input.length; idx++) {
            const code = input.charCodeAt(idx);
            const str = String(input.charAt(idx));
            const seed = widthSeed();

            /*
             * 特殊字符
             */

            if (Abs.isCn(str) || [
                "：",    // 中文冒号
                "，",    // 中文逗号
                "。",    // 中文句号
                "；",    // 中文分号
            ].includes(str)) {
                /*
                 * 中文字符长度
                 * 中文是方块字，宽度完全统一
                 */
                length += seed;
            } else {
                if (48 <= code && code <= 57) {
                    /*
                     * 数字
                     */
                    length += (seed / 6 * 5);
                } else if (65 <= code && code <= 90) {
                    /*
                     * 大写字母
                     */
                    length += (seed / 4 * 3);
                } else if (97 <= code && code <= 122) {
                    /*
                     * 小写字母
                     */
                    length += (seed / 3 * 2);
                } else {
                    if ([
                        ".",    // 点符号
                        ":",    // 冒号
                    ].includes(str)) {
                        length += 1;
                    } else if ([
                        "@",    // 邮件格式
                        "-",    // 时间中线
                        "/",    // 路径
                        " ",    // 空白
                        ";",    // 分号
                        ",",    // 逗号
                        "_",    // 下划线
                        "=",    // 等号
                    ].includes(str)) {
                        length += (seed / 2);
                    } else {
                        // length += seed;
                    }
                }
            }
        }
        length = parseInt(length);                  // 转换成整数
        return isPadding ? (length + 32) : length;  // 边距 16px
    }
}

const _widthObject = (input = {}) => {
    if (input) {
        let defaultWidth = 0;
        Object.keys(input).forEach(field => {
            const value = input[field];
            const calculated = widthWord(field) + widthWord(value) + 12; // ( " = " )
            if (defaultWidth < calculated) {
                defaultWidth = calculated;
            }
        });
        return defaultWidth;
    } else return 0;
}
const _widthFields = (input = []) => {
    let fields = [];
    input.forEach(child => {
        if (Abs.isObject(child)) {
            const keys = Object.keys(child);
            if (fields.length < keys.length) {
                fields = keys;
            }
        }
    });
    return fields;
}
/*
 * Mount `__array` variable to column
 */
const _widthFieldsSub = (column = {}, fields = [], widthMap = {}) => {
    /*
     * 构造 `__array` 每一列的元数据，由于是数组列
     * 1）fields：当前表格存在的所有字段
     * 2）width：构造 `field = number`
     */
    const array = {};
    array.fields = fields;
    array.width = widthMap;
    /*
     * 计算 __array
     * {
     *     "fields": [],
     *     "width": {
     *         "field1": xxx,
     *         "field2": yyy
     *     }
     * }
     */
    const originalRef = column.__array;
    if (originalRef) {
        /*
         * 旧版本执行
         * 1. - fields 变化：直接替换
         * 2. - fields 不变化：计算最大的 width（单字段执行）
         */
        let fieldsPrev = originalRef.fields;
        if (!Abs.isArray(fieldsPrev)) {
            fieldsPrev = [];
        }
        if (fields.length > fieldsPrev.length) {
            /*
             * 「直接替换」字段发生变化
             */
            originalRef.fields = fields;  // 单独替换 fields
        }
        /*
         * `width` 计算
         */
        if (!originalRef.width) {
            originalRef.width = {};
        }

        /*
         * fields 计算
         */
        fields.forEach(field => {
            let fieldOld = originalRef.width[field];
            if (!fieldOld) {
                fieldOld = 0;
            }
            let fieldNew = widthMap[field];
            if (!fieldNew) {
                fieldNew = 0;
            }
            /*
             * 计算结果
             */
            if (fieldNew >= fieldOld) {
                originalRef.width[field] = widthMap[field];
            }
        });
    } else {
        /*
         * 「直接替换」第一次执行宽度设置
         */
        column.__array = array;
    }
}
const _widthArray = (input, config = {}) => {
    if (input) {
        // 计算基础表渲染数据，当前列
        const fields = _widthFields(input);
        // 计算当前列的最大宽度，特殊变量
        let defaultWidth = 0;
        const widthMap = {};
        /*
         * 计算当前列的最大宽度
         * 1）先遍历列，计算每一列的最大宽度
         * 2）再遍历数据，不考虑 ["","",""] 的数据格式
         */
        fields.forEach(field => {
            /*
             * 当前列标题宽度
             */
            const widthTitle = widthWord(field, false);
            /*
             * 计算数据中的最大宽度
             */
            let widthColumn = 0;
            input.forEach(each => {
                const value = each[field];
                const widthRow = widthWord(value ? value : "", false);
                if (widthColumn < widthRow) {
                    widthColumn = widthRow;
                }
            });
            /*
             * 计算每列最大值
             */
            const current = Math.max(widthTitle, widthColumn);
            widthMap[field] = current + 12;
        });
        const {column = {}} = config;

        _widthFieldsSub(column, fields, widthMap);

        defaultWidth = Object.keys(column.__array.width)
            .map(key => column.__array.width[key])
            .reduce((left, right) => left + right, 0);

        return defaultWidth + 32;
    } else return 0;
}
const _widthMix = (input, data = []) => {
    if (Abs.isArray(input)) {
        return _widthArray(input, data);
    } else if (Abs.isObject(input)) {
        return _widthObject(input);
    } else {
        return widthWord(input);
    }
}
const _widthMax = (data = [], field = "", fnWidth = () => 0, column) => {
    let defaultWidth = 0;
    /*
     * 解决BUG：
     * Unhandled Rejection (TypeError): Cannot read property 'forEach' of null
     */
    data = Abs.isArray(data) ? data : [];
    data.forEach(record => {
        const literal = record[field];
        let calculated;
        if (literal) {
            calculated = fnWidth(literal, {
                // 计算宽度专用，field 字段名，data 所有记录集
                field, data, column
            });
        } else {
            calculated = 0;
        }
        if (defaultWidth < calculated) {
            defaultWidth = calculated;
        }
    });
    return defaultWidth;
}

const _widthTitle = (title = "", column = {}) => {
    let titleWidth = widthWord(title);
    if (column.sorter) {
        titleWidth += 24;
    }
    if (column.hasOwnProperty("$filter")) {
        titleWidth += 28;
    }
    return titleWidth;
};
const _widthOption = (mapping = []) => {
    let defaultWidth = 0;
    mapping.forEach(each => {
        if ("string" === typeof each) {
            let calculated;
            if (0 < each.indexOf(',')) {
                const segments = each.split(',');
                calculated = widthWord(segments[0]);
                calculated += 8;
                const size = Ele.valueInt(segments[2], 0);
                if (36 < size) {
                    calculated += (size - widthSeed());
                }
            } else {
                calculated = widthWord(each);
            }
            if (defaultWidth < calculated) {
                defaultWidth = calculated;
            }
        } else {
            defaultWidth = 0;
        }
    });
    return defaultWidth;
}
// ------------- 核心方法

const widthObject = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = _widthMax(data, column.dataIndex, _widthObject);
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthArray = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = _widthMax(data, column.dataIndex,
        _widthArray, column // 传入 column 引用，如果是 Array 可能会被更改
    );
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthText = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = _widthMax(data, column.dataIndex,
        _widthMix, column // 传入 column 引用，如果是 Array 可能会被更改
    );
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthCurrency = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = _widthMax(data, column.dataIndex, (input) => widthWord(T.formatCurrency(input)));
    return titleWidth > textWidth ? titleWidth : textWidth;
}
const widthMapping = (titleWidth = 0, column = {}, data = []) => {
    const mapping = Object.keys(column['$mapping'])
        .map(key => column['$mapping'][key]);
    const textWidth = _widthOption(mapping);
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthExecutor = (titleWidth = 0, column = {}, data = []) => {
    let width = 0;
    if (Abs.isArray(column['$option'])) {
        /*
         * 多个按钮操作
         */
        column['$option'].forEach(opt => {
            if ("divider" === opt) {
                /*
                 * 分隔符操作
                 */
                width += 12;
            } else {
                /*
                 * 计算每一个的文字，累加
                 */
                const single = widthWord(opt.text, false);
                width += single;
            }
        });
        width += 32;
    }
    return titleWidth > width ? titleWidth : width;
};
const widthUser = (titleWidth = 0, column = {}, data = []) => {
    const textWidth = 144;      // 创建人默认（一个图标 + 4个字）
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthDate = (titleWidth = 0, column = {}, data = []) => {
    let textWidth = 0;
    const format = column['$format'];
    if (0 < data.length) {
        data.map(record => record[column.dataIndex])
            .filter(value => !!value)
            .map(value => Ele.valueTime(value, format))
            .filter(moment.isMoment)
            .map(value => value.format(format))
            .map(widthWord)
            .forEach(current => {
                if (textWidth < current) {
                    textWidth = current;
                }
            });
    } else {
        // 修正无数据的最小日期格式
        textWidth = widthWord(format);
    }
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const widthDatum = (titleWidth = 0, column = {}, data = [], reference) => {
    const options = Rx.Ant.toUnique(reference, {datum: column['$datum']});
    const source = options.data;
    const {value, display} = options.config;
    let textWidth = 0;
    data.map(record => record[column.dataIndex])
        .filter(value => !!value)
        .map(text => Ele.elementUnique(source, value, text))
        .filter(found => !!found)
        .map(found => T.valueExpr(display, found, true))
        .map(widthWord)
        .forEach(current => {
            if (textWidth < current) {
                /*
                 * 暂时使用固定值，防止越界
                 */
                textWidth = current;
            }
        });
    textWidth += 24;        // 引入24的修正值
    return titleWidth > textWidth ? titleWidth : textWidth;
};
const FUNS = {
    "EXECUTOR": widthExecutor,
    "TEXT": widthText,
    "CURRENCY": widthCurrency,
    "INPUT": widthText,
    "LOGICAL": widthMapping,
    "MAPPING": widthMapping,
    "USER": widthUser,
    "DATE": widthDate,
    "DATUM": widthDatum,
    "OBJECT": widthObject,
    "ARRAY": widthArray,
};
/**
 * ## 「引擎」`Ux.configScroll`
 *
 * 计算表格中的 `scroll` 列自适应性的专用函数，不同的渲染器计算列宽度方法不同。
 *
 * @memberOf module:_engine
 * @method configScroll
 * @param {Object} $table 传入的表格配置信息。
 * @param {Array} data 传入的表格数据信息。
 * @param {ReactComponent} reference React对应组件引用。
 */
const configScroll = ($table = {}, data = [], reference) => {
    const $columns = $table.columns;
    /*
     * 计算当前列的最大长度
     */
    // eslint-disable-next-line
    $columns.forEach(column => {
        /*
         * 当前列的数据信息
         * rdData：当前数据列所有数据信息
         * rdType：当前数据列渲染方式
         * rdTitle：当前数据列的标题长度
         * rdWidth：当前数据列是否设置了宽度
         */
        const rdType = column['$render'] ? column['$render'] : "INPUT";
        const rdTitle = column.title;
        const rdWidth = column.width;

        /*
         * 计算 width 的新算法
         * 1）先根据 render 计算 width
         * 2）如果 width > rdWidth，那么修改原始的 width
         */
        const executor = FUNS[rdType];
        if (Abs.isFunction(executor)) {
            const titleWidth = _widthTitle(rdTitle, column);
            const calculated = executor(titleWidth, column, data, reference);
            if (rdWidth) {
                if (!column.fixed) {
                    // 左右工具栏不参与运算，要固定宽度
                    column.width = Math.max(titleWidth, calculated, rdWidth);
                }
            } else {
                column.width = Math.max(titleWidth, calculated);
            }
        }
    });
    /*
     * 可支持的最大宽度
     * 未配置 scroll 的时候计算，配置了就不用计算了
     */
    if (!$table.scroll || !$table.scroll.x) {
        /*
         * 基础计算：必须是超过6列才执行
         */
        if (!$table.scroll) {
            $table.scroll = {};
        }
        $table.scroll.x = 'fill-available';  //width + adjust * 2;
        /*
         * className 计算
         */
        let className = $table.className;
        if (!className) {
            className = "";
        }
        className = `${className} web-table-adjust`;
        $table.className = className;
    }
}
// ------------------ O.init.js

/**
 * ## 「引擎」`Ux.initial`
 *
 * 执行表单初始化逻辑，实现表单属性`$inited`的完整计算流程，不论是静态配置还是动态配置，都生效，表单初始化流程如下：
 *
 * 1. 添加模式中（mode = ADD）：判断form中是否包含了initial属性，如果包含了initial属性，则使用initial属性计算。
 *      * 此时initial中的属性对应值支持表达式如`UNIQUE:xxx`这种，所有在表单中可支持的表达式都可执行初始化计算，计算源以reference为主。
 * 2. 编辑模式中（mode = EDIT）：编辑模式直接将`$inited`变量的值赋值到初始化数据中。
 *
 * 第三参数`program`主要负责提供编程模式的覆盖参数，它的优先级最高，如果出现了同名属性，直接用`program`中的函数进行覆盖。
 *
 * @memberOf module:_primary
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} form 表单配置。
 * @param {Object} program 编程专用的配置数据传入。
 * @return {Object} 初始化数据（表单初始化数据）。
 */
const initial = (reference, form, program = {}) => {
    /*
     * 读取字段本身配置
     * 1）对于 form.initial 的处理在于：
     * - $mode = ADD 的时候
     * 2）如果 $mode = EDIT 则直接跳过该流程
     */
    const {$mode = "ADD"} = reference.props;
    let initial = {};
    if (form && form.initial) {
        /*
         * 解析表达式
         */
        let definition = {};
        Object.keys(form.initial)
            /* 直接过滤得到最终的表达式 */
            .filter(key => "string" === typeof form.initial[key])
            .forEach(key => {
                const value = Pr.parseValue(form.initial[key], reference);
                if (undefined !== value) {      // undefined !== value
                    definition[key] = value;
                }
            });
        initial = definition;
    }
    if ("EDIT" === $mode) {
        /*
         * EDIT 编辑模式，只追加补充数据
         */
        const {$inited = {}} = reference.props;
        initial = Abs.assign($inited, initial, 2)
    }
    if (!Abs.isEmpty(program)) {
        Object.assign(initial, program);
    }
    return initial;
};
// ------------------ O.dialog.js
/*
 * 解决 redux 模式下的 BUG 问题
 */
const isLoading = (reference) => {
    let submitting = Ele.ambValue(reference, "$submitting");
    if (submitting instanceof DataObject) {
        /*
         * redux 模式下的加载效果处理
         * DataObject -> loading 数据
         */
        submitting = submitting._("loading");
    }
    return submitting;
}
/**
 * ## 「引擎」`Ux.configDialog`
 *
 * 「标准配置」Dialog 专用的配置信息。
 *
 * 1. 先调用`aiExprWindow`解析`window`元素。
 * 2. 执行`onOk`的锚点连接函数
 * 3. 执行`onCancel`流程
 * 4. 执行防重复提交流程
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} config 窗口配置专用数据。
 * @return {Object} 返回处理好的窗口配置。
 */
const configDialog = (reference, config = {}) => {
    const $dialog = Rx.aiExprWindow(config);
    /*
     * 使用解析结果来拷贝
     */
    const $config = Abs.clone($dialog);
    /*
     * onOk按钮（可以不包含 onOk）
     */
    if ("string" === typeof $config.onOk) {
        $dialog.__onOk = $config.onOk;
        $dialog.onOk = () => T.connectId($config.onOk);
    }
    /*
     * onCancel按钮
     */
    $dialog.onCancel = () => reference.setState({$visible: false});
    $dialog.destroyOnClose = true;
    $dialog.maskClosable = false;
    $dialog.className = "web-dialog";   // 默认窗口风格
    /*
     * 防重复提交
     */
    const {$visible = false} = reference.state;
    const $submitting = isLoading(reference);
    $dialog.visible = $visible;
    $dialog.confirmLoading = $submitting;
    $dialog.cancelButtonProps = {
        loading: $submitting
    };
    return $dialog;
};
/**
 *
 * ## 「引擎」`Ux.configAnchor`
 *
 * 锚点专用函数信息
 *
 * Array类型
 *
 * ```js
 * [
 *    id1, id2
 * ]
 * ```
 *
 * Object
 *
 * ```js
 * {
 *    key1 = id1,
 *    key2 = id2
 * }
 * ```
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array|Object} op 锚点按钮配置生成器。
 * @param {Function} callback 按钮执行函数，可以从callback中执行该函数。
 * @return {Array} 配置的最终锚点。
 */
const configAnchor = (reference, op, callback) => {
    const $button = [];
    const rxClick = (key) => (event) => {
        Abs.prevent(event);
        let state = {$visible: true};
        if (Abs.isFunction(callback[key])) {
            /*
             * 特殊 callback 回调
             */
            const promise = callback[key]();
            promise.then((callbackState = {}) => {
                Object.assign(callbackState, state);
                reference.setState(callbackState);
            });
        } else {
            reference.setState(state);
        }
    };
    if (op) {
        if (Abs.isArray(op)) {
            /*
             * 数组模式
             */
            op.forEach(key => {
                const button = {};
                button.key = key;
                button.id = key;
                button.className = "ux-hidden";
                button.onClick = rxClick(key);
                $button.push(button);
            })
        } else if (Abs.isObject(op)) {
            /*
             * 对象格式
             */
            Abs.itObject(op, (key, id) => {
                const button = {};
                button.key = key;
                button.id = id;
                button.className = "ux-hidden";
                button.onClick = rxClick(key);
                $button.push(button);
            })
        }
    }
    return $button;
};
/**
 * ## 「引擎」`Ux.cabQuery`
 *
 * 返回绑定资源文件中的`_grid`专用列表配置信息，然后生成 query 执行的最终结果，读取位置：
 *
 * 1. `_grid.query`节点的数据读取
 * 2. qrCombine函数执行完成整体解析过程。
 *
 * ```json
 * {
 *     "_grid":{
 *         "query":{
 *             "criteria":{},
 *             "sorter": [],
 *             "pager":{
 *                 "page":1,
 *                 "size":10
 *             },
 *             "projection": []
 *         }
 *     }
 * }
 * ```
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @return {any}
 */
const cabQuery = (reference, key = "grid") => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const config = $hoc._(key);
        if (config && config.query) {
            /*
             * 构造 $query
             */
            return Q.qrCombine(config.query, reference);
        }
    }
};
// ---------------- O.table.js

/**
 * ## 「引擎」`Ux.configColumn`
 *
 * 「标准配置」Ant Design的Table组件的Table组件专用属性`columns`列处理器，处理每一列的`render`属性
 *
 * 配置信息如下：
 *
 * 1. 先使用`aiExprColumn`解析原始配置。
 * 2. 计算 $render 的不同模式
 * 3. 封装操作，底层调用 columnWrapper 专用封装函数（内置的）
 * 4. 追加 $filter 列过滤配置。
 * 5. 计算排序配置 sorter = true 时。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Array} columns 当前Table组件的columns配置。
 * @param {Object} ops 当前列是否可操作列：如列中包含了编辑、删除按钮，如果出现扩展则执行扩展替换。
 * @return {Array} 返回处理过后的表格列信息。
 */
const configColumn = (reference, columns = [], ops = {}) => {
    /*
     * 先执行基本解析
     */
    columns = Rx.aiExprColumn(columns);
    /*
     * 遍历每一个列执行注入
     */
    columns.forEach(column => {
        // $render处理
        WebColumn.columnRender(reference, column, ops);
        // $render处理完成过后，可考虑包装
        WebColumn.columnWrapper(reference, column);
        // $filter过滤处理
        WebColumn.columnFilter(reference, column);
        // sorter = true 是否开启可控模式
        WebColumn.columnSorter(reference, column);
        // title替换
        WebColumn.columnSynonym(reference, column);
    });
    return columns;
};
/**
 * ## 「引擎」`Ux.configTable`
 *
 * 「标准配置」Table 专用的配置信息。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} table 表格配置数据相关信息。
 * @param {Object} ops 外置处理的 executor 专用信息。
 * @return {Object} 返回处理好的配置信息。
 */
const configTable = (reference, table = {}, ops = {}) => {
    /*
     * 基本表格
     * 1）无分页
     * 2）计算了 scroll
     */
    const $tableInput = Abs.clone(table);
    const {limitation, ...$table} = $tableInput;
    if (!table.hasOwnProperty('pagination')) {
        $table.pagination = false;
    }
    /*
     * 不包含 scroll 属性
     */
    if (!table.hasOwnProperty("scroll")) {
        if (undefined !== limitation && 0 < limitation) {
            const y = 38 * limitation;
            $table.scroll = {
                y
            }
        }
    }
    $table.columns = configColumn(reference, table.columns, ops);
    return $table;
};
/**
 * ## 「引擎」`Ux.configExecutor`
 *
 * ### 统一执行 executor
 *
 * 函数格式：
 *
 * ```js
 * const fun = (reference) => (id, record) => {}
 * ```
 *
 * 1. reference：当前组件，如 ExTable
 * 2. id：记录的ID
 * 3. record：记录数据全部
 *
 * ### 合并 executor 的方式：
 *
 * 1. 来源于 reference.props 中的 $executor 变量
 * 2. 标准函数：
 *      * fnEdit：打开编辑Tab页专用
 *      * fnDelete：删除一行记录专用
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} executors 待绑定的事件专用信息。
 * @return {Object} 返回处理过后的 executors 信息。
 */
const configExecutor = (reference, executors) => {
    /*
     * 基本规范，executor 必须是 fn 打头的
     */
    const events = {};
    Object.keys(executors)
        .filter(key => key.startsWith('fn'))
        .filter(key => Abs.isFunction(executors[key]))
        .forEach(key => events[key] = executors[key]);
    let executor = Abs.clone(events);
    const {$executor = {}} = reference.props;
    if (!Abs.isEmpty($executor)) {
        /*
         * 如果 $executor 中包含了 fnEdit / fnDelete 会被覆盖掉
         */
        Object.assign(executor, $executor);
    }
    return executor;
};
/**
 * ## 「引擎」`Ux.configExecutors`
 *
 * 「2阶」（略）该操作主要是编程过程中使用。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} executors 待绑定的事件专用信息。
 * @return {Object} 返回处理过后的 executors 信息。
 */
const configExecutors = (reference, executors) => {
    const events = {};
    Object.keys(executors)
        .filter(key => Abs.isFunction(executors[key]))
        .forEach(key => {
            const target = executors[key](reference);
            if (Abs.isFunction(target)) {
                events[key] = target;
            }
        });
    return events;
}
// ---------------- O.form.js

/*
 * ## 引擎函数
 *
 * 配置专用方法，处理当前Form中的input控件专用信息，该配置方法为**上层方法**，直接从
 * 绑定的资源文件`Cab.json`引用的配置中读取相关配置。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @return {any}
 */
const cabForm = (reference = {}, key = "form") => {
    const {$hoc} = reference.state;
    E.fxTerminal(!$hoc, 10062, $hoc);
    const form = $hoc._(key);
    E.fxTerminal(!form, 10056, $hoc);
    return Abs.clone(form);
};
/**
 *
 * ## 「引擎」`Ux.capForm`
 *
 * 配置专用方法，该方法为**下层方法**，直接使用Object作为配置输入。
 *
 * cab: Cab.json 中读取的 form 配置
 *
 * ```json
 * {
 *     form:{
 *          className: "表单对应的CSS",
 *          window: 布局选择,
 *          columns: 使用 grid 时表单支持的布局
 *          ui: 布局信息
 *          hidden: 隐藏字段专用信息
 *          actions: {
 *              op: {
 *                  "Button的id": "SAction的 code"
 *          }
 *     },
 *     control: {
 *          id: "动态创建时的 control id",
 *          magic: {
 *              Ajax专用参数信息
 *          },
 *          uri: "默认远程的 uri",
 *          method: "调用远程的 uri对应的 Ajax 方法，默认 GET"
 *     }
 * }
 * ```
 *
 * program：通过编程方式传入的配置
 *
 * ```json
 * {
 *     key: "form",     // 默认使用 form
 *     jsx: {
 *         "字段名": (reference, jsx) => xxx，渲染函数
 *     },
 *     dynamic:{
 *         renders: {},
 *         extensions: {},
 *     },
 *     columns: （优先）使用 grid 时表单支持的布局,
 *     supplier: （优先）构造 magic 专用的 supplier，和上边的配置结合使用
 * }
 * ```
 *
 * capForm 主要用于设置 addOn 附加信息，最终返回数据结构
 *
 * ```json
 * {
 *     form: {
 *         window,
 *         className,
 *         ui,
 *         hidden,
 *         actions:{
 *             op: {}
 *         }
 *     },
 *     addOn: {
 *         columns:
 *         renders:
 *         dynamic:{
 *             renders: {},
 *             extensions: {}
 *         }
 *     },
 * }
 * ```
 *
 * supplier 响应格式（参考form）
 *
 * ```json
 * {
 *     className: "表单对应的CSS",
 *     window: 布局选择,
 *     columns: 使用 grid 时表单支持的布局
 *     ui: 布局信息
 *     hidden: 隐藏字段专用信息
 *     actions: {
 *     op: {
 *          "Button的id": "SAction的 code"
 *     }
 * }
 * ```
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} config 基本输入的配置信息。
 * @param {Object} program 编程传入的配置信息。
 * @return {Promise<T>} 返回异步的 Promise。
 */
const capForm = async (reference = {}, config = {}, program = {}) => {
    const addOn = {};
    /*
     * 计算 supplier
     * 1）program 中的 supplier 最优先
     * 2）其次检查动态或静态，如果是
     *   - 静态：() -> config.form;
     *   - 动态：() -> supplier(magic);
     */
    let supplier;
    if (config.form) {
        /*
         * 静态模式
         * form足够
         */
        supplier = () => Abs.promise(config.form);
    } else {
        if (config.control) {
            const {magic = {}, id = "", ...rest} = config.control;
            /*
             * 参数构造
             */
            const params = Pr.parseInput(magic, reference);
            params.control = id;
            /*
             * 提取 generator
             */
            let generator;
            if (program.hasOwnProperty('supplier')) {
                generator = program['supplier'];
                if (Abs.isFunction(generator)) {
                    supplier = () => generator(params);
                }
            } else {
                supplier = () => Ajax.asyncPromise(rest, params);
            }
        } else {
            console.error(config);      // 检查后端数据
            throw new Error("[ Ux ] Form无法初始化，检查配置数据！")
        }
    }
    /*
     * 1）读取最终 form 的配置
     */
    const form = await supplier();
    /*
     * 2）计算 columns
     */
    const {
        columns = 4, // 默认 4 列
        ...rest
    } = form;
    if (program.hasOwnProperty('columns')) {
        addOn.columns = program.columns;
    } else {
        addOn.columns = columns;
    }
    /*
     * 3）是否包含编程传入的 jsx
     */
    if (program.hasOwnProperty('renders')) {
        addOn.renders = {};
        const {renders = {}} = program;
        Object.keys(renders).filter(key => !!renders[key])
            .filter(key => Abs.isFunction(renders[key]))
            .forEach(key => addOn.renders[key] = renders[key]);
    }
    /*
     * 4）是否包含了动态信息
     */
    if (program.hasOwnProperty('dynamic')) {
        addOn.dynamic = program.dynamic;
    }
    /*
     * 5）捆绑引用和ID
     */
    const {id = ""} = reference.props;
    addOn.id = id;
    if (!addOn.id) {
        // 修正 id 来源
        if (program.hasOwnProperty("id")) {
            addOn.id = program.id;
        }
    }
    addOn.reference = reference;
    /*
     * 6）权限控制
     */
    // TODO: 权限控制部分，用于控制 $op 的权限信息
    return {
        form: rest,
        addOn
    };
};
/**
 * ## 「引擎」`Ux.configForm`
 *
 * 「标准配置」表单配置的标准处理方法，和 React 隔离的独立配置函数，处理 form 配置专用。
 *
 * @memberOf module:_engine
 * @param {Object} form 传入的特殊Form配置，Object类型。
 * @param {Object} addOn 编程专用的Object类型。
 * @return {Object} 配置规范化完成后的Form数据。
 */
const configForm = (form, addOn = {}) => {
    /*
     * 1）form 配置存在
     * 2）addOn 中包含了 reference
     * 3）form.ui 存在
     */
    if (!form) return E.fxError(10012, 'form');
    if (!addOn.reference) return E.fxError(10049, addOn);
    if (!form.ui) return E.fxError(10056, form.ui);
    /*
     * 2）构造Raft基本配置
     */
    const raft = {form: {}};
    const paramsOut = {form, addOn};
    // Render-1: <Form/> 配置构造
    Raft.raftAttribute(raft, paramsOut);
    const {reference} = addOn;
    // Render-2: <Input type="hidden"/>
    Raft.raftHidden(raft, form, reference);
    // Render-3：计算 form.ui
    const normalized = Raft.raftUi(reference, form.ui, form.rule);
    // Render-4：计算布局相关信息
    const calculated = Raft.raftLayout(raft, paramsOut);
    raft.rows = [];
    /*
     * 行遍历
     */
    raft.search = {};
    normalized.forEach((row, rowIndex) => {
        // 计算行处理信息
        const rowData = Raft.raftRow(raft, {row, index: rowIndex, calculated});
        const {rowItem = {}, rowStyle} = rowData;
        rowItem.cells = [];
        /*
         * 列遍历
         */
        row.forEach((cell, cellIndex) => {
            // 高度修正
            Raft.raftItem(cell, {}, rowStyle);
            /*
             * 解决 rowStyle, 处理Cell和 <Col/>
             */
            const params = {
                cell, index: cellIndex,
                calculated,
                row: {...rowItem, length: row.length, index: rowIndex},
                addOn,
            };
            const column = Raft.raftColumn(raft, Abs.clone(params));
            /*
             * 处理 title 和 $button
             */
            Raft.raftSpecial(column);
            if (cell.complex) {
                /*
                 * 子表单模式（用于静态扩展专用）
                 * 1）key 会发生变化
                 * 2）span 默认为 24
                 */
                column.col.key = `${cell.name}-${rowIndex}-${cellIndex}`;
                if (!cell.hasOwnProperty('span')) {
                    column.col.span = 24;
                }
                const render = Raft.raftContainer(cell, Abs.clone(params), configForm);
                if (render) {
                    column.render = render;
                } else {
                    throw new Error("[ Ux ] 容器模式没有生成正确的 render ")
                }
            } else {
                column.__render = cell.render;    // 拷贝原始值，用于元数据分析
                column.render = Raft.raftRender(cell, Abs.clone(params));
            }
            /*
             * 搜索表单辅助工具，主要是搜索的时候需要执行值处理
             */
            {
                const {render, field} = cell;
                if (field && "$button" !== field) {
                    if (undefined === render) {
                        raft.search[field] = "aiInput";
                    } else {
                        if ("string" === typeof render) {
                            raft.search[field] = render;
                        }
                    }
                }
            }
            rowItem.cells.push(column);
        });
        Logger.render(5, rowItem, rowIndex);
        raft.rows.push(rowItem);
    });
    raft.enabled = true;
    /*
     * 权限控制
     */
    if (form.op) {
        /*
         * 配置 Raft 对应的 op
         */
        raft.authorized = Abs.clone(form.op);
    }
    /*
     * initial 专用配置（初始化）
     */
    if (form.initial) {
        raft.initial = Abs.clone(form.initial);
    }
    /*
     * assist 专用
     */
    if (form.assist) {
        raft.assist = Abs.clone(form.assist);
    }
    Logger.render(3);
    return raft;
};

/**
 * ## 「引擎」`Ux.raftForm`
 *
 * 新函数，两种情况
 *
 * 1. 长度为1
 * 2. 长度为2
 *
 * 该函数只在内部调用。
 *
 * @memberOf module:_engine
 * @return {Promise<T>} 返回最终的 Promise。
 */
function raftForm() {
    if (1 === arguments.length) {
        /*
         * 返回 Promise
         * 1. 普通功能，capForm
         * 2. 配置功能，configForm
         * 3. 辅助信息，assist 数据处理
         */
        const reference = arguments[0];
        if (reference) {
            const {config = {}, $op = {}} = reference.props;
            const $config = Abs.clone(config);
            return capForm(reference, $config).then((response = {}) => {
                const {form, addOn = {}} = response;
                const raft = configForm(form, addOn);
                const state = {};
                state.raft = raft;
                state.$op = $op;
                return Abs.promise(state);
            }).then(processed => {
                const {raft = {}} = processed;
                let configAssist = Datum.fromHoc(reference, "assist");
                if (!configAssist) {
                    configAssist = {};
                }
                if (raft.assist) {
                    Object.assign(configAssist, raft.assist);
                }
                if (!Abs.isEmpty(configAssist)) {
                    return Fn.asyncAssist(configAssist, reference, processed);
                } else {
                    return Abs.promise(processed);
                }
            });
        }
    } else if (2 === arguments.length) {
        const reference = arguments[0];
        const config = arguments[1] ? arguments[1] : {};
        const {
            key = "form",        // 读取 Cab文件的配置，key 默认为 form
            ...rest              // 其他 配置
        } = config;
        const form = cabForm(reference, key);
        /*
         * options 专用
         */
        const options = capForm(reference, {form}, rest);
        /*
         * 执行 configForm 核心操作
         */
        return options.then(response => {
            const {form, addOn = {}} = response;
            const raft = configForm(form, addOn);
            /*
             * 构造 raft
             */
            return Abs.promise(raft);
        });
    }
}

// ---------------- O.tab.js
const callTab = (reference, children = {}) => {
    const {$tabs = {}} = reference.state ?
        reference.state : {};
    const {items = [], ...rest} = $tabs;
    return (
        <Tabs {...rest}>
            {items.map(item => {
                const fnRender = children[item.key];
                return (
                    <Tabs.TabPane {...item}>
                        {Abs.isFunction(fnRender) ? fnRender(item) :
                            `对不起，children 函数丢失：${item.key}`}
                    </Tabs.TabPane>
                )
            })}
        </Tabs>
    )
}

/**
 * ## 「引擎」`Ux.configTab`
 *
 * 「标准配置」Tabs 专用的配置信息。
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {Object} config 传入的配置数据信息。
 * @return {Object} 处理完成的配置数据。
 */
const configTab = (reference, config = {}) => {
    const tabs = Abs.clone(config);
    const {
        tabPosition, items
    } = tabs;
    /*
     * 处理 tabs，解析分两种模式，主要针对 items
     * 1）全字符串格式：key,value;key,value
     * 2）数组格式：["key,value","key,value"]
     */
    if ("string" === typeof items) {
        // 第一种格式化
        tabs.items = Rx.aiExprTabs(items.split(';')
            /*
             * 除去空字符串
             */
            .filter(item => "" !== item));
    } else {
        if (Abs.isArray(items)) {
            tabs.items = Rx.aiExprTabs(items);
        }
    }
    /*
     * children 专用渲染
     */
    tabs.items = Fn.aiChildItem(tabs.items, reference, Tabs.TabPane);
    /*
     * 临时解决方案
     */
    tabs.items.forEach((item = {}) => {
        const {icon, tab} = item;
        if ("string" === typeof tab && icon) {
            if ("left" === tabPosition || "right" === tabPosition) {
                item.tab = WebUnit.aiBlock(icon, tab, item.key);
            }
        }
    });
    /*
     * tabBarExtraContent解析（和PageCard中类似）， 构造 tabBarExtraContent 的 render 函数
     */
    const fnSwitch = ($activeKey) => {
        /*
         * 激活的 activeKey 设置
         */
        reference.setState({$activeKey});
        const {rxTabClick} = reference.props;
        if (Abs.isFunction(rxTabClick)) {
            rxTabClick($activeKey);
        }
    };
    if (Abs.isArray(tabs.tabBarExtraContent)) {
        const content = Rx.aiExprButtons(tabs.tabBarExtraContent, reference.props);
        /*
         * 无状态解析
         */
        tabs.fnExtra = () => {
            /*
             * Render 的生成周期，构造 Extra 的状态，比如禁用等
             */
            return WebField.aiButtonGroup(reference, content);
        }
    } else if (Abs.isObject(tabs.tabBarExtraContent)) {
        /*
         * 有状态解析
         */
        tabs.onTabClick = fnSwitch;
        /*
         * 计算有状态的 fnExtra
         */
        if (Abs.isFunction(tabs.tabBarExtraContent)) {
            tabs.fnExtra = tabs.tabBarExtraContent;
        } else {
            const normalized = {};
            Abs.itObject(tabs.tabBarExtraContent, (field, value) =>
                normalized[field] = Rx.aiExprButtons(value, reference.props));
            tabs.fnExtra = () => {
                /*
                 * render部分
                 */
                const {$activeKey} = reference.state ? reference.state : {};
                const content = normalized[$activeKey];
                return WebField.aiButtonGroup(reference, content);
            }
        }
    }
    if (!tabs.onTabClick) {
        if (tabs.hasOwnProperty('activeKey')) {
            tabs.onTabClick = fnSwitch;
        } else {
            const {rxTabClick} = reference.props;
            if (Abs.isFunction(rxTabClick)) {
                tabs.onTabClick = rxTabClick;
            }
        }
    }
    return tabs;
};
const cabTab = (reference = {}, key = "tabs") => {
    const {$hoc} = reference.state;
    if ($hoc) {
        const tabs = $hoc._(key);
        if (!Abs.isEmpty(tabs)) {
            return configTab(reference, Abs.clone(tabs));
        } else return {};
    } else return {};
}
/**
 * ## 「引擎」`Ux.capTab`
 *
 * （异步）Tabs 页签专用函数，用于处理页签级别的配置信息，通常是 _tabs 节点
 *
 * @memberOf module:_engine
 * @param {ReactComponent} reference React对应组件引用。
 * @param {String} key 表单配置读取必须的键。
 * @param {Object} state 专用的状态，会被直接更改，追加 $tabs 变量。
 * @return {any}
 */
const capTab = (reference = {}, key = "tabs", state = {}) => {
    state.$tabs = cabTab(reference, key);
    return Abs.promise(state);
}
export default {
    cabQuery,
    capForm,        // 异步处理（基本配置）
    capTab,


    initial,

    configScroll,
    configDialog,
    configAnchor,
    configColumn,
    configTable,
    configExecutor,
    configExecutors,
    configForm,     // 执行 raft 处理
    configTab,
    widthWord,

    raftForm,       // Legacy遗留系统
    callTab,
}