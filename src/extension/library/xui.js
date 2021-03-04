import Ux from "ux";
import React from "react";
import Chk from "./channel";
import {Col, Row} from "antd";

const seekData = (inherit, source = "") => {
    /*
     * 读取上层引用
     */
    if (source) {
        const {reference} = inherit;
        const state = reference.state ? reference.state : {};
        const props = Ux.clone(inherit);
        return Ux.parseValue(source, {state, props});
    }
};
const _seekFabric = (attrs = {}, config = {}, target) => {
    if (target) {
        const {$fabric = {}} = target;
        /*
         * 命中当前 control 的信息
         */
        if (!Ux.isEmpty($fabric)) {
            const fabric = $fabric[config.key];
            if (fabric) {
                /*
                 * 直接读取 $fabric 专用数据信息
                 * （当前）
                 * 1）这里需要注意的是 $fabric 中的数据会进行一次筛选（在配置中针对 control 筛选）
                 * 2）筛选过后，会直接合并到 attrs 中，如果出现了重名，原始的内容会被覆盖掉，所以请小心
                 */
                Object.assign(attrs, fabric);
            }
            /*
             * 直接注入 $fabric 处理
             * （继承）
             */
            attrs.$fabric = $fabric;
        }
    }
}
const seekFabric = (attrs = {}, config = {}, reference = {}) => {
    /**
     * 先从 props 中读取 $fabric 数据，如果 $fabric 存在则执行第一轮处理
     */
    _seekFabric(attrs, config, reference.props);
    /**
     * 然后从 state 中读取 $fabric 数据，存在则执行第一轮处理
     */
    _seekFabric(attrs, config, reference.state);
}

const seekInherit = (attrs = {}, config) => {
    // 容器主键
    attrs.key = config.key;
    // $metadata构建
    const $metadata = {};
    $metadata.key = config.key;
    $metadata.type = config.name;
    $metadata.page = config['pageId'];
    if (config.componentType) {
        // 只有容器会使用
        $metadata.componentType = config.componentType;
    }
    attrs.$metadata = $metadata;
    /*
     * Fabric 传入值
     */
    const {reference} = attrs;
    if (reference) {
        /* 处理 Fabric 的查询功能 */
        seekFabric(attrs, config, reference);
        const {$controls} = reference.props;
        if ($controls) {
            Object.freeze($controls);   // 不可不变更的属性
            attrs.$controls = $controls;
        }
    }
};

// =====================================================
// 主体渲染方法
// =====================================================
/**
 * ## 「动态」`Ex.xuiContainer`
 *
 * 执行 `xuiContainer` 专用容器控件渲染。
 *
 * @memberOf module:_kernel
 * @method xuiContainer
 * @param {Object} container 容器配置信息
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @param {Function} fnJsx 容器中组件渲染专用函数
 * @returns {boolean|Jsx} 渲染带容器的组件信息
 */
const xuiContainer = (container = {}, UI = {}, inherit, fnJsx) => {
    const fnRender = Ux.isFunction(fnJsx) ? fnJsx : () => false;
    if (Ux.isEmpty(container)) {
        // 无容器
        return fnRender();
    } else {
        const Component = UI[container.name];
        if (Component) {
            const {config = {}} = container;
            const attrs = Ux.clone(inherit);
            /*
             * 覆盖 config
             */
            attrs.config = config;
            seekInherit(attrs, container);
            /*
             * 容器的特殊点处理
             * $fabric 需要下放，继承往下处理
             */
            const sorted = Ux.sorterObject(attrs);
            return (
                <Component {...sorted}>
                    {fnRender()}
                </Component>
            )
        } else {
            // 无容器
            console.error(`[ Ox ] 设置了容器但未找到，name = ${container.name}`);
            return fnRender();
        }
    }
}

const xuiControl = (control = {}, UI = {}, inherit = {}) => {
    if (Ux.isEmpty(control)) {
        console.error("[ ExR ] 配置数据有问题，control = ", control);
        return false;
    } else {
        if (control.isContainer) {
            /*
             * 只渲染容器，不包含容器内部相关信息
             * 不传第四参，直接进入容器渲染过程
             */
            return xuiContainer(control.container, UI, inherit);
        } else {
            const Component = UI[control.name];
            if (Component) {
                /*
                 * 配置和数据解析
                 */
                const fnRender = () => {
                    const attrs = Ux.clone(inherit);
                    /*
                     * Component 专用流程
                     */
                    const data = seekData(inherit, control.source);
                    if (data) {
                        attrs.data = data;
                    }
                    const {event = {}, ...rest} = control.config;
                    attrs.config = rest;
                    /*
                     * 只有 Component 才出现的事件流程
                     */
                    attrs.event = event;
                    seekInherit(attrs, control);
                    const sorted = Ux.sorterObject(attrs);
                    return (
                        <Component {...sorted}/>
                    )
                };
                if (control.container) {
                    return xuiContainer(control.container, UI, inherit, fnRender)
                } else {
                    return fnRender();
                }
            } else {
                console.error("[ ExR ] 配置的组件不存在", control, UI);
                return false;
            }
        }
    }
}

/**
 * ## 「动态」`Ex.xuiDecorator`
 *
 * 执行 `xuiDecorator` 修饰包装组件。
 * 1. 提取 control 中的配置信息
 * 2. 是否执行了 $switcher 的随机跳跃处理（刷新界面专用）
 * 3. 事件执行器，针对特殊节点：`decorator` 执行事件注入解析工作
 *
 * @memberOf module:_kernel
 * @method xuiDecorator
 * @param {Object} configuration 修饰组件专用配置数据
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @param {State} state 组件专用状态信息
 * @returns {boolean|Jsx} 渲染修饰过的组件
 */
const xuiDecorator = (configuration = {}, UI = {}, inherit = {}, state = {}) => {
    // TODO: Usage in future
    const $control = Chk.yoControl(configuration);
    /* 激活专用 */
    const $inherit = Ux.clone(inherit);
    if (state && state.$switcher) {
        $inherit.$switcher = state.$switcher;
    }
    return xuiControl($control, UI, $inherit);
}

const getRender = (column = {}, UI = {}, inherit = {}) => {
    /*
     * 默认什么内容都不渲染
     */
    let fnRender;
    if (column.hasOwnProperty("rows")) {
        // 递归渲染
        fnRender = () => xuiGrid(column.rows, UI, inherit);
    } else {
        // 组件渲染
        fnRender = () => xuiDecorator(column.control, UI, inherit);
    }
    return fnRender;
};

const xuiColumn = (column) => {
    const attrs = {};
    attrs.key = column.key;
    attrs.span = column.span;
    if (column.xs) attrs.xs = column.xs;
    if (column.sm) attrs.sm = column.sm;
    if (column.md) attrs.md = column.md;
    if (column.lg) attrs.lg = column.lg;
    if (column.xl) attrs.xl = column.xl;
    if (column.xxl) attrs.xxl = column.xxl;
    return attrs;
};
/**
 * ## 「动态」`Ex.xuiGrid`
 *
 * 执行 `xuiGrid` 专用Grid控件布局。
 *
 * @memberOf module:_kernel
 * @method xuiGrid
 * @param {Array<Array>} grid Grid布局专用二维数组配置
 * @param {Object} UI 组件配置
 * @param {Object} inherit 将被继承的属性表
 * @returns {Jsx} 渲染行列`<Row>, <Col>`的Grid组件
 */
const xuiGrid = (grid = [], UI = {}, inherit = {}) => grid.map(row => {
    const {columns = [], key} = row;
    return (
        <Row key={key}>
            {columns.map(column => {
                const fnRender = getRender(column, UI, inherit);
                // 响应式布局
                const attrs = xuiColumn(column);
                return (
                    <Col {...attrs}>
                        {fnRender()}
                    </Col>
                )
            })}
        </Row>
    )
});
export default {
    xuiGrid,
    xuiContainer,
    xuiDecorator,
}