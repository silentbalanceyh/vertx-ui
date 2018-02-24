import React from "react";
import { connect } from "react-redux";
import Ux from "ux";
import { Form } from "antd";
import { LoadingLayout } from "control";
import HocI18n from "../entity/hoc/HocI18n";

const fnFullName = (target, options = {}) => {
    let fullname;
    if (
        options.hasOwnProperty("i18n.cab") &&
        options.hasOwnProperty("i18n.name")
    ) {
        const cab = options["i18n.cab"];
        const name = options["i18n.name"];
        if (name && cab) {
            fullname = Ux.toFullName(target, cab, name);
        }
    }
    return fullname;
};

const fnConnect = (target, options = {}) => {
    if (options.connect) {
        const s2p = options.connect.s2p;
        const d2p = options.connect.d2p;
        // State to Prop only
        if (!d2p) {
            target = connect(s2p, {})(target);
        } else {
            target = connect(s2p, d2p)(target);
        }
    }
    return target;
};

const fnForm = (target, options = {}) => {
    if (options.form) {
        target = Form.create()(target);
    }
    return target;
};

const ensureForm = (target = {}, options = {}) => {
    if (options.form) {
        const {$hoc} = target.state;
        if (!$hoc) {
            console.error("[Kid] Error to initialize config for form.", $hoc);
        } else {
            if (!$hoc.to().hasOwnProperty("_form")) {
                console.error(
                    "[Kid] '_form' key missing in form component configuration.",
                    $hoc.to()
                );
            }
        }
    }
};

const fnI18n = (target, options = {}) => {
    let i18n;
    const fullname = fnFullName(target, options);
    if (fullname) {
        i18n = new HocI18n(fullname, {});
    }
    return i18n;
};

const fnLog = (reference, options = {}) => {
    if (options.logger) {
        const fullname = fnFullName(reference, options);
        if (Ux.DEBUG) {
            if (fullname) {
                options.logger(reference, fullname);
            } else {
                options.logger(reference, "Unknown");
            }
        }
    }
};
const getDatum = (props, key) => {
    key = key.replace(/\./g, "_");
    const targetKey = props[`$t_${key}`] || props[`$a_${key}`];
    if (targetKey && targetKey.is()) {
        return targetKey.to();
    }
    return undefined;
};

const fnRender = (props = {}, options = {}) => {
    let render = true;
    if (options.loading) {
        options.loading.forEach(key => {
            if (0 <= key.indexOf(".")) {
                const value = getDatum(props, key);
                if (!value) {
                    render = false;
                    return;
                }
            } else {
                const targetKey = `$${key}`;
                if (
                    !props[targetKey] ||
                    (props[targetKey].is && !props[targetKey].is())
                ) {
                    render = false;
                    return;
                }
            }
        });
    }
    return render;
};

const fnOp = (options = {}) => {
    const binding = {};
    if (options.op) {
        for (const key in options.op) {
            binding[key] = options.op[key];
        }
    }
    return binding;
};

export default (options = {}) => {
    return (target, property, descriptor) => {
        const injectState = options.state ? options.state : {};

        class _target extends target {
            // 静态资源放到State状态中
            state = {
                // Hoc专用资源处理流程
                $hoc : fnI18n(target, options),
                // Bind专用流程，用于绑定事件信息
                $op : fnOp(options),
                // 初始化State
                ...injectState
            };

            render() {
                // 计算Render
                const render = fnRender(this.props, options);
                // 是否打印日志
                fnLog(this, options);
                // 检查Form专用程序
                ensureForm(this, options);

                return render ? super.render() : <LoadingLayout/>;
            }
        }

        // Redux connect configuration
        _target = fnConnect(_target, options);
        // Form connect configuration
        _target = fnForm(_target, options);
        return _target;
    };
};
