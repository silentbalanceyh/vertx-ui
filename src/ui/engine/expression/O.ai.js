// 导入当前目录
import Apply from './O.apply';
import Parser from './I.parser.up';
import Ele from "../../element";
import Abs from "../../abyss";
// 导入内部 ai 解析器
import {v4} from "uuid";

const mapIterator = (array = [], callback, objectCallback = data => data) => {
    const items = [];
    array.forEach(each => {
        if ("string" === typeof each) {
            each = each.replace(/ /g, '');
            const item = callback(each.split(','));
            items.push(item);
        } else {
            items.push(objectCallback(each));
        }
    });
    return items;
};
/**
 * ## 「标准」`Ux.aiExprAjax`
 *
 * Ajax配置专用解析函数，解析表达式，在 ListSelector 中常用的 Ajax 表达式完整信息，后续版本中，下边组件都可能应用：
 *
 * * ListSelector
 * * TreeSelector
 * * MatrixSelector
 *
 * 格式和表格如：
 *
 * `method,uri,params.pager.page,params.pager.size,$KV$`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|method|Ajax请求专用方法。|
 * |1|uri|Ajax请求的Uri地址。|
 * |2|params.pager.page|分页函数中的页码。|
 * |3|params.pager.size|分页函数中的每页尺寸。|
 * |4|$KV$|<属性解析器>|
 *
 * @memberOf module:_parser
 * @param {Object} ajax 基本的 ajax 配置。
 * @returns {Object} 解析过后的标准 ajax 配置对象。
 */
const aiExprAjax = (ajax = {}) => {
    // 默认是POST方法
    let item = ajax;
    const {metadata, ...rest} = ajax;
    if (metadata) {
        // 如果是对象，出现了metadata才会执行属性解析
        item = Parser.parseItem(metadata, "ajax");
        // 分页参数执行整数
        const pager = item.params.pager;
        if (pager) {
            pager.page = Ele.valueInt(pager.page);
            pager.size = Ele.valueInt(pager.size);
        }
        const lefts = Ele.valueLadder(rest);
        // 只合并criteria
        if (!lefts.params) lefts.params = {};
        item.params.criteria = lefts.params.criteria;
    }
    return item;
};


/**
 * ## 「标准」`Ux.aiExprTabs`
 *
 * 标准解析，解析成 Tabs 组件需要使用的子组件专用配置，格式如：
 *
 * `tab,key,icon,$KV$`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|tab|页签上文字。|
 * |1|key|页签主键。|
 * |2|icon|页签上的图标。|
 * |3|$KV$|<属性解析器>|
 *
 * @memberOf module:_parser
 * @param {Array} items 每一个Tab页对应的item表达式解析。
 * @param {Props} props 传入当前React组件属性信息。
 * @returns {Array} 转换成标准的 Tab 对应 items。
 */
const aiExprTabs = (items = [], props = {}) =>
    items.map(item => Parser.parseItem(item, "tabs"))
        .map(Apply.applyKey);


/**
 *
 * ## 「标准」`Ux.aiExprFilter`
 *
 * 按照 Item 解析过滤条件，针对过滤条件对相关信息执行过滤，智能化表达式解析，解析格式：
 *
 * `source,field,type,cond`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|source|字典源信息，如ci.type格式，用于读取Assist数据。|
 * |1|field|查询条件的条件字段。|
 * |2|type|条件操作类型，对应查询操作符。|
 * |3|cond|值信息：可以是「表达式」，也可以是「固定值」。|
 *
 * @memberOf module:_parser
 * @param {String|Object} filter 过滤条件解析
 * @returns {Object} 解析成条件
 */
const aiExprFilter = (filter = "") =>
    Parser.parseItem(filter, "filter");


/**
 * ## 「标准」`Ux.aiExprWindow`
 *
 * 窗口标准解析器，主要提供给 `Modal` 模态窗使用，格式如：
 *
 * `title,okText,cancelText,visible,width,maskClosable,onOk,component`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|title|弹出窗口标题文字。|
 * |1|okText|OK按钮文字。|
 * |2|cancelText|Cancel按钮文字。|
 * |3|visible|是否显示窗口。|
 * |4|width|窗口宽度，用数字。|
 * |5|maskClosable|点击遮罩是否关闭。|
 * |6|onOk|调用`Ux.connectId`触发的按钮ID。|
 * |7|component|窗口中显示组件的名称。|
 *
 * @memberOf module:_parser
 * @param {String} literal 输入表达式。
 * @returns {Object} 解析成标准的窗口对象。
 */
const aiExprWindow = (literal = "") => {
    const item = Parser.parseItem(literal, "window");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('width')) item.width = Ele.valueInt(item.width);
    return item;
};


/**
 * ## 「标准」`Ux.aiExprDrawer`
 *
 * 抽屉标准解析器，主要提供给 `Drawer` 抽屉组件使用，格式如：
 *
 * `title,placement,width,closable,maskClosable,visible`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|title|抽屉窗口标题属性。|
 * |1|placement|抽屉窗口所处的位置，top,bottom,left,right四种。|
 * |2|width|抽屉窗口的宽度。|
 * |3|closable|是否支持`关闭`功能。|
 * |4|maskClosable|点击遮罩时是否支持关闭。|
 * |5|visible|是否显示该抽屉。|
 *
 * @memberOf module:_parser
 * @param {String} drawer 输入表达式。
 * @returns {Object} 解析成标准的抽屉对象。
 */
const aiExprDrawer = (drawer = "") => {
    const item = Parser.parseItem(drawer, "drawer");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('maskClosable')) item.maskClosable = "true" === (item.maskClosable);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};


/**
 * ## 「标准」`Ux.aiExprPopover`
 *
 * 气泡浮游窗解析器，主要提供给 `Popover` 浮游窗口组件使用，格式如：
 *
 * `title,placement,width,closable,visible`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|title|浮游窗口标题属性。|
 * |1|placement|浮游窗口所处的位置，top,bottom,left,right四种。|
 * |2|width|浮游窗口的宽度。|
 * |3|closable|是否支持`关闭`功能。|
 * |4|visible|是否显示该浮游窗口。|
 *
 * @memberOf module:_parser
 * @param {String} popover 输入表达式。
 * @returns {Object} 解析成标准的浮游窗口对象。
 */
const aiExprPopover = (popover = "") => {
    const item = Parser.parseItem(popover, "popover");
    if (item.hasOwnProperty('key')) {
        delete item['key'];
    }
    if (item.width) item.width = Ele.valueInt(item.width);
    if (item.hasOwnProperty('visible')) item.visible = "true" === (item.visible);
    if (item.hasOwnProperty('closable')) item.closable = "true" === (item.closable);
    return item;
};

const aiMetaColumn = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = Parser.parseItem(metadata, "column");
        const options = Ele.valueLadder(rest);
        Object.assign(basic, options);
        Apply.applyColumn(basic);
        item = basic;
    }
    return item;
};


/**
 * ## 「标准」`Ux.aiExprColumn`
 *
 * 列专用解析器，表格中的 columns 配置解析，解析格式如：
 *
 * `dataIndex,title,$render,sorter,$KV$`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|dataIndex|列字段名信息。|
 * |1|title|列头标题文字。|
 * |2|$render|列渲染类型。|
 * |3|sorter|是否排序。|
 * |4|$KV$|<属性解析器>|
 *
 * @memberOf module:_parser
 * @param {Array} columns 针对字符串数组和对象数组的合并解析流程。
 * @returns {Array} 解析成标准的 column 数组格式。
 */
const aiExprColumn = (columns = []) =>
    mapIterator(columns, (values = []) =>
            Apply.applyColumn(Parser.parseItem(values, "column")),
        aiMetaColumn)
        .map(column => Ele.valueLadder(column)); /* 列的拉平处理 */


/**
 * ## 「标准」`Ux.aiExprIcon`
 *
 * 图标解析专用，解析图标中的风格数据，解析多个图标，解析格式和表格为：
 *
 * `text,icon,iconStyle.fontSize,iconStyle.color,style.color,$KV$`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|text|解析的文字信息。|
 * |1|icon|解析的图标信息。|
 * |2|iconStyle.fontSize|图标的尺寸。|
 * |3|iconStyle.color|图标的颜色。|
 * |4|style.color|文字颜色。|
 * |5|$KV$|<属性解析器>|
 *
 * @memberOf module:_parser
 * @param {Array} icons 图标解析。
 * @returns {Array} 解析成标准的 icons 数组格式。
 */
const aiExprIcon = (icons) => {
    const fnNorm = (item = {}) => {
        if (item.iconStyle && item.iconStyle.fontSize) {
            const fontSize = Ele.valueInt(item.iconStyle.fontSize, -1);
            if (-1 < fontSize) {
                item.iconStyle.fontSize = fontSize;
            } else {
                item.iconStyle.fontSize = 12;
            }
        }
        return item;
    };
    if ("string" === typeof icons) {
        return fnNorm(Parser.parseItem(icons, "icon"));
    } else if (Abs.isArray(icons)) {
        return mapIterator(icons, (values = []) => fnNorm(Parser.parseItem(values, "icon")));
    }
};

/**
 * ## 「标准」`Ux.aiExprButton`
 *
 * 按钮标准解析，解析顺序：`key, text, connectId, type, icon, disabledKey, $KV$`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|key|按钮主键。|
 * |1|text|按钮上显示的文字信息。|
 * |2|connectId|按钮点击连接的元素id，客户端元素的id。|
 * |3|type|按钮的类型，如type=primary等。|
 * |4|icon|对应`<Button/>`的icon属性。|
 * |5|disabledKey|按钮禁用的key值，可设置disabled和非disabled状态。|
 * |6|$KV$|<属性解析器>|
 *
 * @memberOf module:_parser
 * @param {String|Object} literal 解析按钮。
 * @param {Props} props React属性信息。
 * @returns {Object} 解析的标准按钮配置。
 */
const aiExprButton = (literal, props = {}) => {
    let button = Parser.parseItem(literal, "button");
    button = Apply.applyConnect(button);
    button = Apply.applyLoading(button, props);
    return button;
};
/**
 * ## 「标准」`Ux.aiExprButtons`
 *
 * 按钮解析函数，批量版，解析多个`<Button/>`元素，属性参考`aiExprButton`方法。
 *
 * @memberOf module:_parser
 * @param {Array} buttons 每个按钮会使用`literal`解析。
 * @param {Props} props React属性信息。
 * @returns {Array} 解析的标准按钮配置。
 */
const aiExprButtons = (buttons = [], props = {}) => _aiExprButton(buttons, props);
// const aiExprDirect = (buttons = [], props = {}) => _aiExprButton(buttons, props, "direct");
const _aiExprButton = (buttons = [], props = {}, key = "button") =>
    mapIterator(buttons, (values = []) => Parser.parseItem(values, key))
        .map(Apply.applyConnect).map(item => Apply.applyLoading(item, props));


/**
 * ## 「标准」`Ux.aiExprOp`
 *
 * 针对按钮的标准解析器，解析`op`属性，格式和表格如：
 *
 * `key,text,event,type,className,icon,$KV$`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|key|操作按钮主键。|
 * |1|text|按钮文字信息。|
 * |2|event|事件名称，如SUBMIT,RESET等。|
 * |3|type|按钮类型，如primary,default。|
 * |4|className|按钮设置类型：绿色=ux-success，红色=ux-red，桃红=ux-spec，棕色=ux-brown。|
 * |5|icon|按钮上的图标信息。|
 * |6|$KV$|<属性解析器>|
 *
 * @memberOf module:_parser
 * @param {String|Object} button 解析按钮。
 * @returns {Object} 按钮标准对象配置。
 */
const aiExprOp = (button = "") => {
    let parsed;
    if ("string" === typeof button) {
        const splitted = button.split(',');
        if (1 === splitted.length) {
            const item = {};
            item.id = button;
            item.key = button;
            item.text = "";
            parsed = item;
        } else {
            parsed = Parser.parseItem(button, "op");
        }
    } else {
        parsed = button;
    }
    if (parsed.key) {
        if (!parsed.id) parsed.id = parsed.key;
    }
    return parsed;
};


/**
 * ## 「标准」`Ux.aiExprAction`
 *
 * 针对某些Action按钮的解析，格式和表格如：
 *
 * `key,text,type,icon,confirm,$KV$`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|key|当前操作主键。|
 * |1|text|档案操作按钮文字。|
 * |2|type|当前操作类型，主要针对Button类型如primary。|
 * |3|icon|按钮呈现的icon信息。|
 * |4|confirm|是否包含Popconfirm的操作，多一层封装。|
 * |5|$KV$|<属性解析器>|
 *
 * @memberOf module:_parser
 * @param {String|Object} popover 需要解析的 action 操作专用配置。
 * @returns {Object} 解析成标准的 action。
 */
const aiExprAction = (popover = "") => Parser.parseItem(popover, "action");


/**
 * ## 「标准」`Ux.aiExprCommand`
 *
 * 针对 command 的按钮专用解析器，格式和表格如：
 *
 * `key,text,className,confirm,confirmPosition,icon,tooltip,$KV$`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|key|按钮主键。|
 * |1|text|操作元素文字信息。|
 * |2|className|当前元素的className（CSS专用）。|
 * |3|confirm|是否支持confirm窗口。|
 * |4|confirmPosition|confirm窗口的位置信息。|
 * |5|icon|元素绑定的图标信息。|
 * |6|tooltip|元素是否支持浮游提示，使用浮游文字就只显示图标。|
 * |7|$KV$|<属性解析器>|
 *
 * @memberOf module:_parser
 * @param {String|Object} command 需要解析的 command 专用配置。
 * @returns {Object} 解析成标准的 command。
 */
const aiExprCommand = (command = "") => Parser.parseItem(command, "command");


/**
 * ## 「标准」`Ux.aiExprCommands`
 *
 * 针对 commands 的按钮专用解析器（批量版本）
 *
 * @memberOf module:_parser
 * @param {Array} commands 命令配置数组
 * @return {Array} 解析过后的 commands
 */
const aiExprCommands = (commands = []) =>
    mapIterator(commands, aiExprCommand);

/**
 * ## 「标准」`Ux.aiExprOption`
 *
 * 选择框专用的 options 解析器，用于解析各种选项信息，格式和表格如：
 *
 * `key,label,style`
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|key|选项值。|
 * |1|label|选项文字。|
 * |2|style|选项风格。|
 *
 * @memberOf module:_parser
 * @param {Array} options 针对字符串数组和对象数组的合并解析流程。
 * @returns {Array} 解析成标准的 option 数组格式。
 */
const aiExprOption = (options = []) =>
    mapIterator(options,
        (values = []) => Parser.parseItem(values, "option"),
        aiMetaOption)
        .map(Apply.applyValue);

const aiMetaOption = (item = {}) => {
    if (item.metadata) {
        let each = Parser.parseItem(item.metadata, "option");
        if (item.items) each.items = aiExprOption(item.items);
        if (item.children) each.children = aiExprOption(item.children);
        item = each;
    }
    return item;
};

const applyField = (item = {}) => {
    // field删除key信息，有field代替
    if (item.hasOwnProperty('key')) {
        delete item.key;
    }
    // span的数值处理
    if (item.span) {
        item.span = Ele.valueInt(item.span);
    }
    // 验证规则处理
    if (item.optionConfig && item.optionConfig.rules) {
        item.optionConfig.rules = Apply.applyRules(item.optionConfig.rules);
    }
    // Filter专用字段语法，防止逗号冲突
    if (item.field && 0 < item.field.indexOf('`')) {
        // Filter专用语法解析
        item.field = item.field.replace('`', ',');
    }
    // 按钮专用处理
    if (item.optionJsx) {
        item.optionJsx = Parser.parseAction(item.optionJsx);
    }
    // 解析ajax属性，ListSelector专用
    const ajaxConfig = item.optionJsx && item.optionJsx.config ? item.optionJsx.config : {};
    if (ajaxConfig && ajaxConfig.hasOwnProperty("ajax")) {
        ajaxConfig.ajax = aiExprAjax(ajaxConfig.ajax);
    }
    return item;
};
/**
 * ## 「标准」`Ux.aiExprTitle`
 *
 * 解析 `title` = 值的专用标题处理，解析带标题的行。
 *
 * @memberOf module:_parser
 * @param {Object|String} item 标准入口解析。
 * @returns {Object} 被解析过的字段标准对象。
 */
const aiExprTitle = (item) => {
    // title专用解析器
    if ("string" === typeof item
        && 0 <= item.indexOf("title")
        && 0 > item.indexOf(",")    // 防止出现title字段
    ) {
        const kv = item.split("=");
        const result = {};
        // Ant-Design Form必须
        result.field = v4();
        // 解析特殊标题
        if ("string" === typeof kv[1]) {
            if (0 < kv[1].indexOf(",")) {
                const title = kv[1].split(",")[0];
                const className = kv[1].split(",")[1];
                result.title = title;
                result.className = className;
            } else {
                result[kv[0]] = kv[1];
            }
        }
        item = result;
    }
    if (Abs.isObject(item) && item.title && !item.field) {
        // title 行的特殊设置
        item.field = v4();
    }
    return item;
};
/**
 * ## 「标准」`Ux.aiExprField`
 *
 * 解析顺序：`field, optionItem.label, span, optionJsx.style.width, render, $KV$`。
 *
 * |索引值|字段名|说明|
 * |---:|:---|:---|
 * |0|field|表单字段名。|
 * |1|optionItem.label|表单之前的标签文字。|
 * |2|span|Grid表单的每一列的span宽度。|
 * |3|optionJsx.style.width|整个输入字段的宽度，可以是百分比。|
 * |4|render|当前字段的渲染函数，`aiXXX`类型。|
 * |5|$KV$|<属性解析器>|
 *
 *
 * @memberOf module:_parser
 * @param {String} literal 被解析的字段表达式信息。
 * @returns {Object} 被解析过的字段标准对象。
 */
const aiExprField = (literal = "") => applyField(Parser.parseItem(literal, "field"));
/**
 *
 * ## 「标准」`Ux.aiExprFieldEx`
 *
 * 双源解析器，解析 field 和 metadata 专用，该函数是`aiExprField`的扩展函数，执行多重合并，以及针对字段进行扩展
 * 解析逻辑。
 *
 * @memberOf module:_parser
 * @param {Object} item 标准入口解析。
 * @returns {Object} 被解析过的字段标准对象。
 */
const aiExprFieldEx = (item = {}) => {
    if (item.metadata) {
        const {metadata, ...rest} = item;
        const basic = "string" === typeof metadata ? aiExprField(metadata) : {};
        const options = Ele.valueLadder(rest);
        // 属性追加（不覆盖）
        const final = Abs.assign(basic, options, 1);
        applyField(final);
        item = final;
    } else if (item.field) {
        // 没有副作用的解析，让result也支持
        const result = Ele.valueLadder(item);
        applyField(result);
        item = result;
    }
    /*
     * 特殊解析
     * 解析 optionJsx.extension 节点
     */
    if (item.optionJsx && item.optionJsx.extension) {
        if (Abs.isArray(item.optionJsx.extension)) {
            const parsed = [];
            item.optionJsx.extension
                .map(each => aiExprOp(each))
                .filter(each => undefined !== each)
                .forEach(each => parsed.push(each));
            // 解析替换处理
            item.optionJsx.extension = parsed;
        }
    }
    return item;
};
export default {
    /* I.ai.window.js */
    aiExprWindow,
    aiExprDrawer,
    aiExprPopover,

    /* I.ai.column.js */
    aiExprColumn,
    aiExprIcon,

    aiExprFilter,   /* 解析 filter 专用 */
    aiExprTabs,     /* 专用 Tabs 解析 */

    /* 解析 datum 成为 option 专用 */
    aiExprOption,

    aiExprCommands,
    aiExprCommand,
    aiExprButtons,
    aiExprButton,
    aiExprOp,
    aiExprAction,   // Web 组件中需要使用，不可缺

    /* 表单专用 field 解析流程 */
    /* 表单专用 field 的扩展解析流程 */
    /* 表单专用 title （ field = title ）解析 */
    aiExprField,
    aiExprFieldEx,
    aiExprTitle,

    /* 专用 ajax 解析 */
    aiExprAjax,
};