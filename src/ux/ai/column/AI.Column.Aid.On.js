import Xt from "../../xweb/index";
import AiExpr from "../expr/AI.Expr.String";
import Prop from "../../prop/Ux.Prop";
import RxAnt from "../ant/AI.RxAnt";


const _getConfig = (column = {}) => column['$config'] ? column['$config'] : {};
// jsx.style -> style中
// 「静态」读取jsx中的风格到当前风格中
const onStyle = (attrs = {}, reference, {
    jsx = {}
}) => {
    // 将jsx中的style拷贝到
    attrs.style = jsx.style ? jsx.style : {};
};

const onUnit = (attrs = {}, reference, {
    column = {}
}) => {
    // 解析items
    const config = _getConfig(column);
    if (config.hasOwnProperty('unit')) {
        attrs.addonAfter = config.unit;
    }
};

const onChangeUnit = (attrs = {}, reference, {
    column = {},
    normalize   // 格式化专用
}) => Xt.xt3ChangeUnit(reference, {field: column.dataIndex, normalize});

const onOptions = (attrs = {}, reference, {
    column = {},
}) => {
    // 解析items
    const config = _getConfig(column);
    attrs.items = AiExpr.aiExprOption(config.items);
};
const onRows = (attrs = {}, reference, {
    column = {},
}) => {
    const config = _getConfig(column);
    const rows = config ? config["rows"] : 2;
    attrs.rows = rows;
};
const onDatum = (attrs = {}, reference, {
    column = {},
}) => {
    const config = _getConfig(column);
    // 读取父类专用ref
    const ref = Prop.onReference(reference, 1);
    const options = RxAnt.toOptions(ref, config);
    attrs.items = options;
};
const onTree = (attrs = {}, reference, {
    column = {},
}) => {
    const config = _getConfig(column);
    if (config.datum) {
        const ref = Prop.onReference(reference, 1);
        attrs.treeData = RxAnt.toTreeOptions(ref, config);
    }
};
const onJsx = (attrs = {}, reference, {
    column = {},
}) => {
    const jsxAttrs = column.jsx ? column.jsx : {};
    Object.assign(attrs, jsxAttrs);
};
const onAllowClear = (attrs = {}, reference, {
    column = {},
}) => {
    const config = _getConfig(column);
    if (config.hasOwnProperty('allowClear')) {
        attrs.allowClear = config.allowClear;
    }
};
const onList = (attrs = {}, reference, {
    column = {},
}) => {
    const $datum = column['$datum'];
    const config = "string" === typeof $datum ? RxAnt.toParsed($datum) : $datum;
    const list = {};
    list.data = Prop.onDatum(reference, config.source);
    list.config = config;
    // 兼容处理，label优先，display次之
    if (config.label) {
        list.display = config.label;
    } else {
        list.display = config.display;
    }
    attrs.list = list;
};
export default {
    // ------- 静态：TableEditor用
    onStyle,    // 设置渲染的span标签的风格
    onChangeUnit, // 生成函数用于处理底层的「索引」专用结果
    onOptions,  // 设置专用的options解析
    onRows, // 设置TextArea专用的rows属性
    onUnit, // 单位设置，unit = ￥
    onDatum, // 处理config.items的双用性
    onList, // 处理config.$datum中的专用属性
    onTree, // Tree专用属性
    onJsx, // 处理jsx直接节点对应的数据信息
    onAllowClear, // Select专用属性，允许清除
};