import React from "react";
import {LoadingContent} from 'zi';
import __Zn from './zero.module.dependency';
import __ANNO from './annotation.__.fn.anno.zero';

const __Zt = {
    ...__Zn,
    ...__ANNO,
}

const __ensureForm = (target = {}, options = {}) => {
    // target.state必须存在，不存在会导致读取的Error
    if (options.form && target.state) {
        const {$hoc} = target.state;
        __Zt.fxTerminal(!$hoc, 10055, $hoc);
        if ($hoc) {
            __Zt.fxTerminal(!$hoc.to().hasOwnProperty("_form"), 10056, $hoc.to());
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
            // this.formRef.current -> this.props.form
            formRef = React.createRef();

            constructor(props) {
                super(props);
                // 静态资源放到State状态中
                const original = this.state ? this.state : {};
                this.state = {
                    // $hoc：Hoc专用资源处理流程，生成$hoc
                    $hoc: __Zt.annoI18n(target, options),
                    // $op：Bind专用流程，用于绑定事件信息，生成$op
                    $op: __Zt.annoOp(options),
                    // 初始化状态
                    ...options.state ? options.state : {},
                    // 当前状态
                    ...original
                };
            }

            componentDidMount() {
                // 启用异步 Raft模式，主要针对Form
                if (options.form) {
                    __Zt.raftForm(this, options.raft).then(raft => {
                        const state = {};
                        state.raft = raft;
                        if (__Zt.isFunction(super.componentDidMount)) {
                            __Zn.of(this).in(state)
                                .handle(() => super.componentDidMount())

                            // this.?etState(state, () => super.componentDidMount());
                            // super.componentDidMount();
                        } else {
                            __Zn.of(this).in(state)
                                .ready().done();
                            // state.$ready = true;
                            // this.?etState(state);
                        }
                    })
                } else {
                    if (__Zt.isFunction(super.componentDidMount)) {
                        super.componentDidMount();
                    }
                }
            }

            componentDidUpdate(prevProps, prevState, snapshot) {
                /*
                 * 主页 / 动态 / 静态页面切换的 BUG
                 */
                if (__Zt.isRoute(this.props, prevProps)) {
                    const state = __Zt.clone(this.state);
                    state.$hoc = __Zt.annoI18n(target, options);
                    state.$op = __Zt.annoOp(options);
                    __Zn.of(this).in(state).handle(() => {

                        if (__Zt.isFunction(super.componentDidUpdate)) {
                            super.componentDidUpdate(prevProps, prevState, snapshot);
                        }
                    })
                    // this.?etState(state, () => {
                    //     if (__Zt.isFunction(super.componentDidUpdate)) {
                    //         super.componentDidUpdate(prevProps, prevState, snapshot);
                    //     }
                    // });
                } else {
                    if (__Zt.isFunction(super.componentDidUpdate)) {
                        super.componentDidUpdate(prevProps, prevState, snapshot);
                    }
                }
            }

            render() {
                const {error} = this.state;
                if (error) {
                    console.trace(error);
                    return __Zt.annoError(this, error);
                } else {
                    // 计算Render，是否执行加载
                    const render = __Zt.annoRender(this.props, options);
                    // 检查Form专用程序
                    __ensureForm(this, options);
                    // 打印日志
                    // FORM
                    const form = this.formRef.current;
                    if (form) {
                        const isTouched = form.isFieldsTouched();
                        if (!isTouched) {
                            __Zt.annoLog(this, options);
                        }
                    } else {
                        // 打印日志
                        __Zt.annoLog(this, options);
                    }
                    const {skin} = this.props;
                    // return <LoadingContent skin={skin}/>;
                    return render ? super.render() : <LoadingContent skin={skin}/>;
                }
            }
        };
        Component = __Zt.annoUnmount(Component, options);
        // Redux连接配置：顺序不可替换
        Component = __Zt.annoConnect(Component, options);
        // Form连接配置：顺序不可替换
        // Component = Fn.fnForm(Component, options);
        return Component;
    };
};
