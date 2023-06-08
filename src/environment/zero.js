import React from "react";
import Ux from "ux";
import {LoadingAlert, LoadingContent} from 'web';
import Fn from './zero.fn';

const ensureForm = (target = {}, options = {}) => {
    // target.state必须存在，不存在会导致读取的Error
    if (options.form && target.state) {
        const {$hoc} = target.state;
        Ux.E.fxTerminal(!$hoc, 10055, $hoc);
        if ($hoc) {
            Ux.E.fxTerminal(!$hoc.to().hasOwnProperty("_form"), 10056, $hoc.to());
        }
    }
};
/*
 * 错误信息标准化专用方法，格式如：
 *
 * 1. $hoc._("_fatal")
 *
 *      ```json
 *      {
 *          "download":{
 *              400: "xxx",
 *              404: "xxx"
 *          },
 *          "run": {
 *              "message": "xxx",
 *              "description": [
 *                  "xxx"
 *              ]
 *          }
 *      }
 *      ```
 *
 * 2. error结构
 *
 *      ```json
 *      {
 *          "code": xxx,
 *          "_error": true,
 *          "status": xxx,
 *          "statusText": "xxx",
 *          "message": "xxx",
 *          "info": "xxx",
 *          "alert": {
 *              "icon": "xxx",
 *              "message": "xxx",
 *              "description": [
 *              ]
 *          }
 *      }
 *      ```
 *
 */
const smartError = (reference, error = {}) => {
    // 外层属性
    const divAttrs = {};
    divAttrs.style = {
        paddingTop: "9%",
        paddingLeft: "15%",
        paddingRight: "15%",
        paddingBottom: "12%"
    }

    // Alert专用属性
    const alertAttrs = {};
    alertAttrs.className = "web-error-alert";

    // ========================== $alert / $icon 处理
    const {alert = {}} = error.data ? error.data : {};
    const {$hoc} = reference.state;
    const fatal = $hoc ? $hoc._("_fatal") : {};
    const {run = {}} = fatal;

    const config = {};
    config.$icon = alert.icon ? alert.icon : "stop";
    config.$type = alert.type ? alert.type : "error";

    // 主体消息部分处理
    const $alert = {};
    /*
     * message
     * 1. 优先级最高：        编程传入 alert.message
     * 2. 次级优先级：        fatal.run.message
     */
    if (alert.message) {
        $alert.message = alert.message;
    } else {
        $alert.message = run.message;
    }
    /*
     * description
     * 1. 优先级高：          编程传入 alert.description
     * 2. 次级优先级：        fatal.run.description
     * 3. 追加：
     *                      rest.status = status + " " + statusCode
     *                      rest.message（系统信息）
     */
    const fnArray = (input) => {
        if (Ux.isArray(input)) {
            return Ux.clone(input);
        } else {
            return Ux.clone([input]);
        }
    }
    let description = [];
    if (alert.description) {
        description = fnArray(alert.description);
    } else {
        if (Ux.isArray(error)) {
            description = error;
        } else if ("string" === typeof error) {
            description = [error];
        } else if (Ux.isObject(error)) {
            if (run.description) {
                description = description.concat(run.description);
            }
            if (error.message) {
                description.push(`Error Detail: ${error.message}`);
            }
        }
    }
    $alert.description = description;
    config.$alert = $alert;
    return (
        <div {...divAttrs}>
            <LoadingAlert {...config}/>
        </div>
    )
}
/*
 * 防内存泄漏专用方法
 */
// eslint-disable-next-line import/no-anonymous-default-export
export default (options = {}) => {
    return (target, property, descriptor) => {
        // 修改target过后的继承
        let Component = class extends target {
            constructor(props) {
                super(props);
                // 静态资源放到State状态中
                const original = this.state ? this.state : {};
                this.state = {
                    // $hoc：Hoc专用资源处理流程，生成$hoc
                    $hoc: Fn.fnI18n(target, options),
                    // $op：Bind专用流程，用于绑定事件信息，生成$op
                    $op: Fn.fnOp(options),
                    // 初始化状态
                    ...options.state ? options.state : {},
                    // 当前状态
                    ...original
                };
            }

            componentDidMount() {
                // 启用异步 Raft模式，主要针对Form
                if (options.form) {
                    Ux.raftForm(this, options.raft).then(raft => {
                        const state = {};
                        state.raft = raft;
                        if (Ux.isFunction(super.componentDidMount)) {
                            this.setState(state);
                            super.componentDidMount();
                        } else {
                            state.$ready = true;
                            this.setState(state);
                        }
                    })
                } else {
                    if (Ux.isFunction(super.componentDidMount)) {
                        super.componentDidMount();
                    }
                }
            }

            componentDidUpdate(prevProps, prevState, snapshot) {
                /*
                 * 主页 / 动态 / 静态页面切换的 BUG
                 */
                if (Ux.isRoute(this.props, prevProps)) {
                    const state = Ux.clone(this.state);
                    state.$hoc = Fn.fnI18n(target, options);
                    state.$op = Fn.fnOp(options);
                    this.setState(state);
                }
                if (Ux.isFunction(super.componentDidUpdate)) {
                    super.componentDidUpdate(prevProps, prevState, snapshot);
                }
            }

            render() {
                const {error} = this.state;
                if (error) {
                    return smartError(this, error);
                } else {
                    // 计算Render，是否执行加载
                    const render = Fn.fnRender(this.props, options);
                    // 检查Form专用程序
                    ensureForm(this, options);
                    // 打印日志
                    const {form} = this.props;
                    if (form) {
                        const isTouched = form.isFieldsTouched();
                        if (!isTouched) {
                            Fn.fnLog(this, options);
                        }
                    } else {
                        // 打印日志
                        Fn.fnLog(this, options);
                    }
                    return render ? super.render() : <LoadingContent/>;
                }
            }
        };
        Component = Fn.fnUnmount(Component, options);
        // Redux连接配置：顺序不可替换
        Component = Fn.fnConnect(Component, options);
        // Form连接配置：顺序不可替换
        Component = Fn.fnForm(Component, options);
        return Component;
    };
};
