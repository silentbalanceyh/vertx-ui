/**
 * 读取Tabular和Assist专用属性：`$t_`和`$a_`开头的属性值。
 * @method toDatum
 * @param props 传入的React属性
 * @param keys 需提取的所有keys属性名集
 */
const onDatum = (props = {}, keys = []) => {
    const inherits = {};
    if (0 === keys.length) {
        // 读取所有
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

/**
 * 通用属性读取相关信息
 * @method toProp
 * @param props 传入的React属性
 * @param keys 需提取的所有keys属性名集
 */
const onProp = (props = {}, ...keys) => {
    const inherits = {};
    // Fix Issue
    let targetFor = [];
    if (1 === keys.length && Array.prototype.isPrototypeOf(keys[0])) {
        targetFor = keys[0];
    } else {
        targetFor = keys;
    }
    targetFor.forEach(key => {
        const targetKey = `$${key}`;
        if (props.hasOwnProperty(targetKey)) {
            inherits[targetKey] = props[targetKey];
        }
    });
    // 特殊方法专用：reference和fnOut
    // fnOut：专用写Redux状态的方法
    if (props.fnOut) {
        inherits.fnOut = props.fnOut;
    }
    return inherits;
};
const onUniform = (props, ...keys) => {
    const item = onDatum(props);
    const defaultProp = [
        "app",      // 应用程序数据
        "user",     // 用户数据
        "profile",  // 账号数据
        "router",   // 路由数据
        "parent",   // 主记录数据
        "submitting"    // 防重复提交专用
    ].concat(keys);
    const common = onProp.apply(this, [props].concat(defaultProp));
    return {
        ...item,
        ...common
    };
};
export default {
    onUniform,
}