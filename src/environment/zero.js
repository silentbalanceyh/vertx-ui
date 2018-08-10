import React from "react";
import {connect} from "react-redux";
import Ux from "ux";
import {Form} from "antd";
import {LoadingContent} from 'web';
import {HocI18n} from "entity";

/**
 * 计算组件的全名，主要针对zero配置中的两个特殊键
 * @method fnFullName
 * @private
 * @param target 需要封装的组件信息
 * @param options 配置基本信息
 * @return {*}
 * @example
 *
 *      ...
 *      {
 *          "i18n.cab":{}
 *          "i18n.name":"ComponentName"
 *      }
 */
const fnFullName = (target, options = {}) => {
    let fullname;
    if (options.hasOwnProperty("i18n.cab") && options.hasOwnProperty("i18n.name")) {
        const cab = options["i18n.cab"];
        const name = options["i18n.name"];
        if (name && cab) {
            fullname = Ux.toFullName(target, cab, name);
        }
    }
    return fullname;
};
/**
 * 针对组件执行Redux封装，封装Redux对应的connect专用方法
 * @method fnConnect
 * @private
 * @param target 需要封装的组件信息
 * @param options 配置基本信息
 * @return {*}
 * @example
 *
 *      ...
 *      {
 *          connect:{
 *              s2p:"State -> Prop的Redux配置",
 *              d2p:"Dispatch -> Prop的Redux配置"
 *          }
 *      }
 */
const fnConnect = (target, options = {}) => {
    if (options.connect) {
        const s2p = options.connect.s2p;
        const d2p = options.connect.d2p;
        // 如果没有d2p，则仅使用State -> Prop
        // 否则使用State -> Prop和Dispatch -> Prop
        if (!d2p) {
            target = connect(s2p, {})(target);
        } else {
            target = connect(s2p, d2p)(target);
        }
    }
    return target;
};
/**
 * 执行Ant Design中的Form的封装，调用Form.create()方法
 * @method fnForm
 * @private
 * @param target 需要封装的组件信息
 * @param options 配置基本信息
 * @return {*}
 * @example
 *
 *      ...
 *      {
 *          form:true
 *      }
 */
const fnForm = (target, options = {}) => {
    if (options.form) {
        target = Form.create()(target);
    }
    return target;
};
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
 * 和资源文件绑定的专用封装高阶组件方法，生成内部的`$hoc`变量；
 * * `$hoc`变量是一个`HocI18n`的数据类型
 * * `$hoc`变量位于当前组件`reference.state`状态中，而不是属性中
 * @method fnI18n
 * @private
 * @param target 需要封装的组件信息
 * @param options 配置基本信息
 * @return {*}
 */
const fnI18n = (target, options = {}) => {
    let i18n;
    const fullname = fnFullName(target, options);
    if (fullname) {
        i18n = new HocI18n(fullname, {});
    }
    return i18n;
};
/**
 * 是否打印当前组件的日志信息，并且使用传入的`options.logger`输出日志【Debug模式】
 * @method fnLog
 * @private
 * @param reference 需要封装的组件引用
 * @param options
 * @example
 *
 *      ...
 *      {
 *          logger: Log.component
 *      }
 */
const fnLog = (reference, options = {}) => {
    if (options.logger) {
        const fullname = fnFullName(reference, options);
        if (Ux.Env.DEBUG) {
            if (fullname) {
                options.logger(reference, fullname);
            } else {
                options.logger(reference, "Unknown");
            }
        }
    }
};
/**
 * 读取某个key下边的数据信息：
 * * `key`的格式对应Tabular/Assist格式；
 * * `key`读出来的数据必须是`DataObject/DataArray`类型；
 * * `DataObject/DataArray`类型需要执行`is()`判断看是否夹在完成；
 * @method getDatum
 * @private
 * @param props 当前组件的属性props
 * @param key 检查的key
 * @return {*}
 */
const getDatum = (props, key) => {
    key = key.replace(/\./g, "_");
    const targetKey = props[`$t_${key}`] || props[`$a_${key}`];
    if (targetKey && targetKey.is()) {
        return targetKey.to();
    }
    return undefined;
};
/**
 * 是否在当前组件中启用Loading遮罩效果，该效果会调用Loading组件
 * @method fnRender
 * @private
 * @param props 当前组件的属性props
 * @param options 基本配置信息
 * @return {boolean}
 * @example
 *
 *      ...
 *      {
 *          loading:[
 *              "pay.item",
 *              "border"
 *          ]
 *      }
 */
const fnRender = (props = {}, options = {}) => {
    let render = true;
    if (options.loading) {
        options.loading.forEach(key => {
            if (0 <= key.indexOf(".")) {
                const value = getDatum(props, key);
                if (!value) {
                    render = false;
                    // forEach中中断必须跳出
                    return;
                }
            } else {
                const targetKey = `$${key}`;
                if (!props[targetKey] || (props[targetKey].is && !props[targetKey].is())) {
                    render = false;
                    // forEach中中断必须跳出
                    return;
                }
            }
        });
    }
    return render;
};
/**
 * 是否绑定操作信息，该操作信息会生成绑定数据，注入到`state`状态中
 * @method fnOp
 * @private
 * @param options 基本配置信息
 * @example
 *
 *      ...
 *      {
 *          op:{
 *              "select":Op.fnSelect
 *          }
 *      }
 */
const fnOp = (options = {}) => {
    const binding = {};
    if (options.op) {
        for (const key in options.op) {
            binding[key] = options.op[key];
        }
    }
    return binding;
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
        // 状态注入
        // state节点
        const injectState = options.state ? options.state : {};
        // 修改target过后的继承
        let Component = class extends target {
            // 静态资源放到State状态中
            state = {
                // $hoc：Hoc专用资源处理流程，生成$hoc
                $hoc: fnI18n(target, options),
                // $op：Bind专用流程，用于绑定事件信息，生成$op
                $op: fnOp(options),
                // 状态合并：初始化State
                ...injectState
            };

            render() {
                // 计算Render，是否执行加载
                const render = fnRender(this.props, options);
                // 检查Form专用程序
                ensureForm(this, options);

                return render ? super.render() : <LoadingContent/>;
            }
        };
        // Redux连接配置：顺序不可替换
        Component = fnConnect(Component, options);
        // Form连接配置：顺序不可替换
        Component = fnForm(Component, options);

        return class hoc extends Component {
            render() {
                // 是否打印日志
                fnLog(this, options);
                return super.render();
            }
        };
    };
};
