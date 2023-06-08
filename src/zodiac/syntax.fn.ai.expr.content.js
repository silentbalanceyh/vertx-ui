import __Zn from './zero.module.dependency';
import __Pr from './syntax.fn.parse.component';
import __Zt from './syntax.__.fn._.zone';

const _aiExprString = (item, field) => {
    // title专用解析器
    if ("string" === typeof item
        && 0 <= item.indexOf(field)
        && 0 > item.indexOf(",")    // 防止出现title字段
    ) {
        const kv = item.split("=");
        const result = {};
        // Ant-Design Form必须
        result.field = __Zn.randomUUID();
        // 解析特殊标题
        if ("string" === typeof kv[1]) {
            if (0 < kv[1].indexOf(",")) {
                const firstField = kv[1].split(",")[0];
                const className = kv[1].split(",")[1];
                result[field] = firstField;
                result.className = className;
            } else {
                result[kv[0]] = kv[1];
            }
        }
        item = result;
    }
    if (__Zn.isObject(item) && item[field] && !item.field) {
        // title 行的特殊设置
        item.field = __Zn.randomUUID();
    }
    return item;
}
const aiExprTitle = (item) => _aiExprString(item, "title")

const aiExprSubject = (item) => _aiExprString(item, "subject")

const aiExprIcon = (icons) => {
    const fnNorm = (item = {}) => {
        if (item.iconStyle && item.iconStyle.fontSize) {
            const fontSize = __Zn.valueInt(item.iconStyle.fontSize, -1);
            if (-1 < fontSize) {
                item.iconStyle.fontSize = fontSize;
            } else {
                item.iconStyle.fontSize = 12;
            }
        }
        return item;
    };
    if ("string" === typeof icons) {
        return fnNorm(__Pr.parseItem(icons, "icon"));
    } else if (__Zn.isArray(icons)) {
        return __Zt.itPipe(icons, (values = []) => fnNorm(__Pr.parseItem(values, "icon")));
    }
};
export default {
    aiExprTitle,
    aiExprSubject,
    aiExprIcon,
}