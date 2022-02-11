import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {Dsl} from "entity";

/**
 * ## 「组件」`OxModule`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * @memberOf module:web-component
 * @method OxModule
 */
// =====================================================
// componentInit/componentUp
// =====================================================

const getControl = (reference, $identifier) => {
    const {config = {}} = reference.props;
    const {vector = {}} = config;
    /*
     * vector 的两种格式
     * 1. 直接包含了 $identifier，则直接提取
     * 2. 无法提取 $identifier 对应的配置时
     * - 2.1. 查看 __ALIAS__ ：远程读取
     * - 2.2. 如果没有 __ALIAS__ 配置则直接 __DEFAULT__ 处理
     */
    if (vector.hasOwnProperty($identifier)) {
        /*
         * 静态 $identifier 提取（Z专用）
         */
        const $control = vector[$identifier];
        const controlData = {$identifier, $control}
        Ux.dgDebug(controlData, "「直接」选择的：$identifier 和 $control.");
        return Ux.promise(controlData);
    } else {
        if (vector['__ALIAS__']) {
            const {
                $myView = {},            // 视图
                $myDefault = {},         // 默认视图
                $metadata = {},          // 读取类型和页面
                $inited = {},
            } = reference.props;
            /*
             * 远程读取构造 vector
             *
             *      "page": xxx,
             *      "identifier": xxx,
             *      "path": based on view/position,
             *      "type": calculate the parameter from params,
             *      "alias": The name that you can define here.
             */
            const request = {};
            request.identifier = $identifier ? $identifier : vector.__DEFAULT__;

            // page, componentType
            const {
                componentType,
                page
            } = $metadata;
            request.type = componentType;
            request.page = page;

            let view = $myView.name;
            if (!view) {
                view = $myDefault.name ? $myDefault.name : "DEFAULT";
            }
            request.view = view;
            request.position = $myView.position ? $myView.position : "DEFAULT";

            // 动态部分 只有动态检索才会使用 data 节点读取基础数据信息
            request.data = $inited;
            request.config = vector['__SEEK__'];
            request.alias = vector['__ALIAS__'];
            /**
             * {
             *     alias: "直接配置，通常是：EDIT, ADD, FILTER, LIST",
             *     data: {
             *         "用于选择处理时专用的插件参数专用配置。"
             *     },
             *     identifier: "原始标识规则选择符",
             *     language: "语言信息",
             *     page: "当前页面ID（UI_PAGE专用）",
             *     type: "当前查找专用类型，如：FORM / LIST",
             *     position: "当前页面位置，对应 position",
             *     view: "当前页面专用视图，对应 view"
             * }
             */
            return Ex.I.visitor(request).then(vectorData => {
                const $control = vectorData['controlId'];
                const controlData = {$identifier, $control}
                Ux.dgDebug(controlData, "「远程」选择的：$identifier 和 $control.");
                return Ux.promise(controlData)
            })
        } else {
            /*
             * 默认，直接从 __DEFAULT__ 提取
             */
            const $control = vector.__DEFAULT__;
            const controlData = {$identifier, $control}
            Ux.dgDebug(controlData, "「默认」选择的：$identifier 和 $control.");
            return Ux.promise(controlData);
        }
    }
};
/*
 * 计算 control 的id
 * 1）如果未传入 $identifier，则检查 config 中是否包含了 __DEFAULT__
 * 2）如果传入了 $identifier，则根据 config 中去找
 */
const asyncControl = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 是否走 fabric 配置流程
     */
    if (Ux.isArray(config['fabric'])) {
        const fabric = config['fabric'];
        /*
         * 读取新的配置信息
         */
        const fabricAsync = Ex.etPure(reference, fabric);
        const dataEvent = Dsl.getEvent(null);
        return fabricAsync(dataEvent).then(dataEvent => {
            const $identifier = dataEvent.getPrev();
            return getControl(reference, $identifier);
        });
    } else {
        const {$identifier} = reference.props;
        return getControl(reference, $identifier);
    }
};
const componentInit = (reference) => asyncControl(reference).then((combine = {}) => {
    const state = {};
    const {$control, $identifier} = combine;
    if ($control) {
        const {$metadata = {}} = reference.props;
        const type = $metadata.componentType;
        if (type) {
            return Ex.yiControl($control, type).then($config => {
                state.$ready = true;
                state.$config = $config;
                state.$identifier = $identifier;
                reference.setState(state);
            });
        } else {
            console.error("[ Ox ] 该组件要求的 componentType 无值。", type);
        }
    } else {
        state.$ready = true;
        if ($identifier) {
            state.$identifier = $identifier;
        } else {
            console.error("[ Ox ] 当前传入的 $identifier 没有值！", $identifier);
        }
        reference.setState(state);
    }
});
const componentUp = (reference, previous = {}) => {
    const current = reference.props.$identifier;
    const prev = previous.props.$identifier;
    if (current !== prev) {
        componentInit(reference)
            .then(state => Ux.dgDebug(state, "[ Ox ] 最终状态"));
    }
};

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {state: prevState, props: prevProps});
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 读取 $control 配置
             */
            const {$config = {}, $identifier} = this.state;
            /*
             * 提取 children 的 props.config
             */
            const {children} = this.props;
            let config = {};
            if (children.props) {
                config = children.props.config;
            }
            Object.assign(config, $config);
            return Ux.aiChildren(this, {
                /*
                 * 配置基本信息
                 */
                config,
                /*
                 * 当前组件处理的 $identifier（模型ID）
                 */
                $identifier,
            })

        }, Ex.parserOfColor("OxModule").container())
    }
}

export default Component;