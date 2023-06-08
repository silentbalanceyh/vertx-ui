import __Zn from './zero.module.dependency';
import _Ant from './antd4.c.ant.processor';

const Cv = __Zn.Env;
const CvC = Cv.K_NAME.V_COLUMN;

const parseColumn = (columns = [], reference) => {
    const normalized = [];
    columns.filter(each => "key" !== each.dataIndex).forEach(each => {
        // 选项处理（组件配置）
        const item = {};
        item.value = each.dataIndex;
        item.key = each.dataIndex;
        item.label = each.title;
        item.control = each[CvC.RENDER] ? each[CvC.RENDER] : Cv.K_VALUE.COLUMN_DEFAULT;
        // 配置专用
        const config = {};
        if (each[CvC.FORMAT]) {
            config.format = each[CvC.FORMAT];
        }
        if (each[CvC.MAPPING]) {
            config.mapping = each[CvC.MAPPING];
        }
        if (each[CvC.EXPR]) {
            const expr = each[CvC.EXPR];
            const expression = {}
            if (expr.startsWith(":value")) {
                // 带后缀
                expression.after = expr.replace(/:value/g, "");
            } else if (expr.endsWith(":value")) {
                // 带前缀
                expression.before = expr.replace(/:value/g, "");
            } else {
                // 前后缀都带
                const kv = expr.split(':value');
                expression.before = kv[0];
                expression.after = kv[1];
            }
            config.expression = expression;
        }
        if (each[CvC.DATUM]) {
            const datum = each.$datum;
            config.options = _Ant.toOptions(reference, {datum});
        }
        item.config = config;
        normalized.push(item);
    });
    return normalized;
}
export default {
    parseColumn,
}