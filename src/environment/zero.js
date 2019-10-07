import React from "react";
import Ux from "ux";
import {LoadingAlert, LoadingContent} from 'web';
import Fn from './zero.fn';
import U from 'underscore';

/**
 * 配合fnForm执行的Form中的配置的检查，保证：
 * * Hoc高阶配置中必须包含`_form`节点；
 * * `$hoc`必须作为配置存在于state状态中；
 * @method ensureForm
 * @private
 * @param target 需要封装的组件信息
 * @param options 配置基本信息
 */
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
/**
 * @class zero
 * @description 注解zero用于封装组件的高阶ES7语法
 */
export default (options = {}) => {
    /**
     * zero注解过后执行Hoc高阶封装操作
     * @method ZeroComponent
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
        // Redux连接配置：顺序不可替换
        Component = Fn.fnConnect(Component, options);
        // Form连接配置：顺序不可替换
        Component = Fn.fnForm(Component, options);

        return Component;
    };
};
