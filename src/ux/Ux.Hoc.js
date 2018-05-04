import Dg from './Ux.Debug'
import Prop from './Ux.Prop'
import Op from './Ux.Op'
import Cv from './Ux.Env'

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
            inherits[targetKey] = props[targetKey]
        }
    });
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
        })
    }
    return inherits;
};
/**
 * 读取专用的带有`$_`前缀的属性值，主要用于从state状态中读取，Zero中所有的state中的键都是`$_`的格式。
 * @method toEffect
 * @param state 传入的React状态
 */
const toEffect = (state = {}) => {
    const inherits = {};
    for (const key in state) {
        if (key.startsWith("$_")) {
            inherits[key] = state[key];
        }
    }
    return inherits
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
    Dg.ensureArgs(Cab, "ns");
    Dg.ensureNotNull(Name);
    const fullname = Cab.ns + "/" + Name;
    if (Component) Component.displayName = fullname;
    return fullname;
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
 * PageList组件专用继承方法
 * * fnShow:对话框弹出窗口
 * * fnHide:对话框关闭窗口
 * * fnOut:Redux专用写函数
 * * $dialog:对应Hoc中的_window，对话框参数
 * * $metadata:对应Hoc中的_pagelist, 页面专用元数据
 * * $query:当前页面的查询条件信息
 * @method toPageList
 * @param {React.PureComponent} reference React对应组件引用
 * @param {JSX} FormComponent 是否包含传入组件
 * @return {{}}
 */
const toPageList = (reference = {}, FormComponent) => {
    const inherit = {};
    const {$op, $_show} = reference.state;
    const {fnOut} = reference.props;
    // 三个函数特殊属性
    inherit.fnShow = $op.show(reference);
    inherit.fnHide = $op.hide(reference);
    inherit.fnOut = fnOut;
    // 专用窗口处理
    const dialog = Prop.fromHoc(reference, "window");
    for (const key in dialog) {
        if (dialog.hasOwnProperty(key)) {
            dialog[key].onCancel = $op.hide(reference);
            dialog[key].visible = $_show;
            Op.connectButton(dialog[key]);
        }
    }
    inherit.$dialog = dialog;
    if (FormComponent) {
        inherit.$component = FormComponent;
    } else {
        inherit.$component = false;
    }
    // 元数据
    inherit.$metadata = Prop.fromHoc(reference, "pagelist");
    inherit.$query = reference.state.$query;
    inherit.$filters = reference.props.$filters;
    return inherit;
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
        }
    }
    return styles;
};
/**
 * @class Hoc
 * @description 专用Hoc解释器
 */
export default {
    // PageList
    toPageList,
    toFullName,
    // 继承专用属性
    toProp,
    toStyle,
    toDatum,
    toEffect,
    toQueryParameter,
    // 处理专用参数信息
};


