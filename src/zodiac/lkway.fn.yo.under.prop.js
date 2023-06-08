import __LIMIT_ATTRS from './lkway.__.v.attribute.limit';
import __Zn from './zero.module.dependency';

const yoLimit = (jsx = {}, includeDefault = true, limits) => {
    let attrLimits = includeDefault ? __LIMIT_ATTRS.COMMON : [];
    if (__Zn.isArray(limits)) {
        attrLimits = attrLimits.concat(limits);
    }
    const processed = {};
    Object.keys(jsx)
        // 移除所有 $ 开头的属性
        .filter(key => !key.startsWith("$"))
        .filter(key => !attrLimits.includes(key))
        .filter(key => {
            if (__Zn.isFunction(jsx[key])) {
                return !key.startsWith("rx");
            } else return true;
        })
        .forEach((field) => processed[field] = jsx[field]);
    return processed;
};
// extract $t_ / $a_
const yoDatum = (props = {}, keys = []) => {
    const inherits = {};
    if (0 === keys.length) {
        // 读取所有
        // eslint-disable-next-line
        for (const key in props) {
            if (props.hasOwnProperty(key)) {
                if (key.startsWith("$t_") || key.startsWith("$a_")) {
                    inherits[key] = props[key];
                }
            }
        }
    } else {
        keys.forEach(key => {
            key = key.replace(/\./g, '_');
            if (props[`$t_${key}`]) {
                inherits[`$t_${key}`] = props[`$t_${key}`];
            } else if (props[`$a_${key}`]) {
                inherits[`$a_${key}`] = props[`$a_${key}`];
            }
        });
    }
    return inherits;
};
const yoAide = (reference, inherit = {}) => {
    const _seekAssist = (uniform = {}, input = {}) => {
        /*
         * props
         */
        if (input) {
            Object.keys(input)
                .filter(field =>
                    field.startsWith(`$a_`) ||  // 旧辅助数据
                    field.startsWith(`__`) ||   // 新组件继承
                    field.startsWith(`$t_`))    // 古老字典数据
                .forEach(key => uniform[key] = input[key]);
        }
    };
    _seekAssist(inherit, reference.props);
    _seekAssist(inherit, reference.state ? reference.state : {});
    return inherit;
}
const yoChild = (jsx = {}, limits) => {
    let attrLimits = [].concat(__LIMIT_ATTRS.COMMON)
    if (__Zn.isArray(limits)) {
        attrLimits = attrLimits.concat(limits);
    }
    const processed = {};
    Object.keys(jsx)
        // 移除所有 $ 开头的属性
        .filter(key => !attrLimits.includes(key))
        .filter(key => {
            if (__Zn.isFunction(jsx[key])) {
                return !key.startsWith("rx");
            } else return true;
        })
        .forEach((field) => processed[field] = jsx[field]);
    return processed;
};
export default {
    yoLimit,
    yoDatum,
    yoAide,
    yoChild,
}