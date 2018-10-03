import Cv from '../Ux.Env';
import E from '../Ux.Error';
import Value from '../Ux.Value';

/**
 * 通用属性读取相关信息
 * @method toProp
 * @param props 传入的React属性
 * @param keys 需提取的所有keys属性名集
 */
const toProp = (props = {}, ...keys) => {
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
 * 读取Tabular和Assist专用属性：`$t_`和`$a_`开头的属性值。
 * @method toDatum
 * @param props 传入的React属性
 * @param keys 需提取的所有keys属性名集
 */
const toDatum = (props = {}, keys = []) => {
    const inherits = {};
    if (0 === keys.length) {
        // 读取所有
        for (const key in props) {
            if (key.startsWith("$t_") || key.startsWith("$a_")) {
                inherits[key] = props[key];
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
 * 读取组件的全称，和Cab.json中的namespace进行配合读取当前组件的全名
 * @method toFullName
 * @param Component 被封装的组件
 * @param {JSON} Cab 链接资源文件
 * @param {String} Name 当前组件的名称（用于日志调试）
 * @return {String}
 */
const toFullName = (Component, Cab = {}, Name) => {
    // 参数严格检查
    E.fxTerminal(!Cab || !Cab.hasOwnProperty("ns"), 10061, Cab, "ns");
    E.fxTerminal(!Name, 10062, Name);
    const fullName = Cab['ns'] + "/" + Name;
    if (Component) Component.displayName = fullName;
    return fullName;
};
/**
 * 从Uri中读取Query Parameter查询参数
 * @method toQueryParameter
 * @param {String} name 待读取的参数名
 * @return {*}
 */
const toQueryParameter = (name = "") => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
/**
 * 转换Less的风格文件，主要用于生成属性className和style中的backgroundImage
 * 全局前缀使用Cv.Env.CSS_PREFIX进行区分
 * @method toStyle
 * @param name 当前Class的名称
 * @param bg 背景图后缀
 */
const toStyle = (name, bg) => {
    const styles = {};
    styles.className = `${Cv.Env.CSS_PREFIX}-${name}`;
    if (bg) {
        styles.style = {
            backgroundImage: `url(${bg})`
        };
    }
    return styles;
};
const toUniform = (props, ...keys) => {
    const item = toDatum(props);
    const defaultProp = [
        "app",      // 应用程序数据
        "user",     // 用户数据
        "router",       // 路由数据
        "submitting",   // 防重复提交数据
        "parent"    // 主记录数据
    ].concat(keys);
    const common = toProp.apply(this, [props].concat(defaultProp));
    return {
        ...item,
        ...common
    };
};

const toLimitation = (props = {}, limits = []) => {
    const inherits = {};
    const $limitKeys = Value.immutable(limits);
    Object.keys(props).filter(key => !$limitKeys.contains(key))
        .forEach(key => inherits[key] = props[key]);
    return inherits;
};
/**
 * @class Hoc
 * @description 专用Hoc解释器
 */
export default {
    // PageList
    toFullName,
    // 继承专用属性
    toProp,
    toStyle,
    toDatum,
    toUniform,
    toQueryParameter,
    // 处理专用参数信息
    toLimitation,
};


