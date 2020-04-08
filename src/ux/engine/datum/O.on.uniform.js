const onDatum = (props = {}, keys = []) => {
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
/**
 * ## 引擎函数
 *
 * 原生 Zero UI中的组件继承属性专用方法，在 Zero Extension 中会调用`yoAmbient`方法实现属性继承，
 * 继承过程中包含几个核心数据：
 *
 * 1. `$t_` 和 `$a_` 的辅助数据，Tabular和Assist两种。
 * 2. `app`应用程序相关数据。
 * 3. `user, profile`用户登录后的数据。
 * 4. `submitting`防重复提交状态数据。
 * 5. `router`核心路由数据。
 * 6. 输入的`keys`对应的键相关数据。
 *
 * @memberOf module:_on
 * @param {Props} props 当前React组件的属性信息。
 * @param {String[]} keys 待提取的属性集合。
 * @return {Object} 返回最终的数据信息。
 */
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