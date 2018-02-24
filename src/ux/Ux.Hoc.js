import Dg from './Ux.Debug'
import Prop from './Ux.Prop'
import Op from './Ux.Op'

const toProp = (props = {}, ...keys) => {
    const inherits = {};
    keys.forEach(key => {
        const targetKey = `$${key}`;
        if (props.hasOwnProperty(targetKey)) {
            inherits[targetKey] = props[targetKey]
        }
    });
    return inherits;
};
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

const toEffect = (state = {}) => {
    const inherits = {};
    for (const key in state) {
        if (key.startsWith("$_")) {
            inherits[key] = state[key];
        }
    }
    return inherits
};

const toFullName = (Component, Cab = {}, Name) => {
    // 参数严格检查
    Dg.ensureArgs(Cab, "ns");
    Dg.ensureNotNull(Name);
    const fullname = Cab.ns + "/" + Name;
    if (Component) Component.displayName = fullname;
    return fullname;
};
const toQueryParameter = (name = "") => {
    const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};
/**
 * fnShow:对话框弹出窗口
 * fnHide:对话框关闭窗口
 * fnOut:Redux专用写函数
 * $dialog:对应Hoc中的_window，对话框参数
 * $metadata:对应Hoc中的_pagelist, 页面专用元数据
 * $query:当前页面的查询条件信息
 * @param reference
 * @param FormComponent
 * @returns {{}}
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
export default {
    // PageList
    toPageList,
    toFullName,
    // 继承专用属性
    toProp,
    toDatum,
    toEffect,
    toQueryParameter,
    // 处理专用参数信息
};


