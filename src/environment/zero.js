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
                    const {$hoc} = this.state;
                    const fatal = $hoc ? $hoc._("_fatal") : {};
                    console.error(error);
                    /*
                     * 连接错误信息
                     */
                    if (fatal.run) {
                        if (Ux.isArray(error)) {
                            fatal.run.description = error;
                        } else if ("string" === typeof error) {
                            fatal.run.description = [error];
                        }
                    }
                    return (
                        <div style={{
                            paddingTop: "10%",
                            paddingLeft: "20%",
                            paddingRight: "20%"
                        }}>
                            <LoadingAlert $alert={fatal.run}
                                          className={"web-error-alert"}
                                          $icon={"stop"} $type={"error"}/>
                        </div>
                    )
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
