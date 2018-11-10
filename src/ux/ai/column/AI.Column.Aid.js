import Value from '../../value';
// Expr
import AiValue from "../expr/AI.Expr.Value";
// Xt
import Xt from '../../xweb';

import U from "underscore";
// jsx.style -> style中
// 「静态」读取jsx中的风格到当前风格中
const onStyle = (attrs = {}, reference, {
    jsx = {}
}) => {
    // 将jsx中的style拷贝到
    attrs.style = jsx.style ? jsx.style : {};
};
// -> jsx.readOnly
const outReadOnly = (attrs = {}, reference, {
    jsx = {}, column = {}
}) => {
    attrs.readOnly = false;
    // 1.检查jsx的readOnly是不是存在
    if (jsx.hasOwnProperty('readOnly')) {
        const {readOnly = false} = jsx;
        attrs.readOnly = readOnly;
    }
    // 2.其次检查$config中是否设置了readOnly
    const {$config = {}} = column;
    if ($config.hasOwnProperty("readOnly")) {
        // 如果整体是false，则以$config.readOnly节点为主
        if (!attrs.readOnly) {
            attrs.readOnly = !!$config.readOnly;
        }
    }
};
// -> $config.mode
// 「动态」读取序号，依赖value中的值（每次渲染时需要计算）
const outSeq = (attrs = {}, reference, {
    jsx = {}, column = {}, text
}) => {
    const {$config = {}} = column;
    attrs.children = Value.sequence(text, $config.mode);
};

const onChangeUnit = (attrs = {}, reference, {
    column = {},
}) => Xt.xt3ChangeUnit(reference, {field: column.dataIndex});

const jsxChild = (column = {}, record = {}, fnRender) => {
    // config中是否配置了childOnly
    const {$config = {}} = column;
    if ($config['childOnly']) {
        // 如果是childOnly则只有children = [] > 0 时渲染
        if (record.children && 0 < record.children.length) {
            return false;
        } else return U.isFunction(fnRender) ? fnRender() : false;
    } else return U.isFunction(fnRender) ? fnRender() : false;
};
const jsxConnect = (fnStatic, fnDynamic, fnRender) => {
    return (reference, column = {}, jsx) => {
        // 穿透引用
        const channel = {};
        // 执行静态处理函数
        const attrs = fnStatic(reference, {column, jsx}, channel);

        return (text, record = {}, index) => {
            // 执行动态处理函数
            fnDynamic(attrs, reference, {jsx, column, text, record, index}, channel);
            // 执行渲染专用函数
            const {children, ...rest} = attrs;
            return jsxChild(column, record, () => fnRender(rest, children));
        }
    }
};
export default {
    // ------- 静态
    onStyle,    // 设置渲染的span标签的风格
    outReadOnly, // 设置当前组件的"只读"属性
    onChangeUnit, // 生成函数用于处理底层的「索引」专用结果
    // ------- 动态：根据值有所改变
    outSeq,     // 根据不同的mode设置序号字段以及序号字段的相关规则
    // ------- 初始化
    initEmpty: () => ({}),
    initDynamic: (column = {}) => AiValue.applyDynamic(column),
    // ------- jsx渲染流程变化
    jsxChild,
    jsxConnect
};