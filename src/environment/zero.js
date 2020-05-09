import React from "react";
import Ux from "ux";
import {LoadingAlert, LoadingContent} from 'web';
import Fn from './zero.fn';
import U from 'underscore';

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
export default (options = {}) => {
    /**
     * zero注解过后执行Hoc高阶封装操作
     *
     *
     * 核心配置类，使用注解语法`@zero`执行资源文件绑定，这个注解在整个框架中为最底层注解，
     * 定义组件本身的元数据，它所处理的工作如下：
     *
     * 1. 和 `cab/<LANGUAGE>/` 链接，读取配置信息，构造`HocI18n`对象。
     * 2. redux 映射处理，用于处理 StateToProps 和 DispatchToProps 两种映射关系。
     * 3. 绑定 Ant Design的表单 Form 实现表单的核心绑定。
     * 4. 操作绑定构造 $op 变量，存储在状态中。
     *
     *
     * ```js
     * import Ux from 'ux';
     *
     * &#64;Ux.zero() -- 注释掉的调用方法，由于包含 @ 符号不可解析
     * class Component extends React.Component{
     *
     * }
     * ```
     *
     * @method @zero
     */
    return (target, property, descriptor) => {
        // 修改target过后的继承
        let Component = class extends target {
            // 静态资源放到State状态中
            state = {
                // $hoc：Hoc专用资源处理流程，生成$hoc
                $hoc: Fn.fnI18n(target, options),
                // $op：Bind专用流程，用于绑定事件信息，生成$op
                $op: Fn.fnOp(options),
                // 初始化状态
                ...options.state ? options.state : {}
            };

            componentDidMount() {
                // 启用异步 Raft模式，主要针对Form
                if (options.form) {
                    Ux.raftForm(this, options.raft).then(raft => {
                        const state = {};
                        state.raft = raft;
                        if (U.isFunction(super.componentDidMount)) {
                            this.setState(state);
                            super.componentDidMount();
                        } else {
                            state.$ready = true;
                            this.setState(state);
                        }
                    })
                } else {
                    if (U.isFunction(super.componentDidMount)) {
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
                if (U.isFunction(super.componentDidUpdate)) {
                    super.componentDidUpdate(prevProps, prevState, snapshot);
                }
            }

            render() {
                const {error} = this.state;
                if (error) {
                    const {$hoc} = this.state;
                    const fatal = $hoc ? $hoc._("_fatal") : {};
                    console.error(error);
                    return (
                        <div style={{
                            paddingTop: "10%",
                            paddingLeft: "20%",
                            paddingRight: "20%"
                        }}>
                            <LoadingAlert $alert={fatal.run}
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
