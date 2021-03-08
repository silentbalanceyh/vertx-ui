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
 * ### 1.基本介绍
 *
 * 执行 `xuiContainer` 专用容器控件渲染，该函数主要用于渲染容器基础配置，该函数支持两种渲染模式：
 *
 * 1. 无容器模式：`container`无配置，为空。
 * 2. 有容器模式：`container`中有内容，带容器渲染。
 *
 * ### 2.参数说明
 *
 * 1. container：容器配置信息，对应后端的`containerConfig`配置对象。
 * 2. UI：配置专用组件`import UI from 'oi';`，专用于配置的核心组件定义（Ox组件）。
 * 3. inherit：继承属性集，构造继承属性，连接原生`yoAmbient`构造的属性集。
 * 4. fnJsx：「Jsx渲染函数」组件专用Jsx渲染函数，容器函数会笼罩在`fnJsx`外围。
 *
 * ### 3.追加属性
 *
 * > 除开`Ex.yoAmbient`函数构造的属性集以外，当前函数会追加特定属性信息
 *
 * |属性名|含义|
 * |:---|:---|
 * |key|配置中的组件key信息，来自于container.config.key键值。|
 * |$metadata|元数据信息，记录了组件key，组件名称，页面ID，组件类型等。|
 * |$fabric|从props和state中构造所有Fabric引擎所需的基础配置。|
 * |$controls|组件配置，存储了当前页面所需的所有配置信息。|
 *
 * #### 3.1.$metadata结构
 *
 * ```js
 * {
 *     key: "组件key",
 *     type: "组件名称，系统会根据该名称读取容器组件",
 *     page: "当前配置中的pageId，页面ID",
 *     componentType: "当前容器类型"
 * }
 * ```
 *
 * #### 3.2.$controls加锁
 *
 * $controls变量会在读取完成后执行加锁`Object.freeze`操作，一旦加锁后，该配置信息不可被更改（只读）。
 *
 * #### 3.3.递归渲染
 *
 * 在`container + component`结构中，还允许`component`定义自我容器，如果出现自我容器，则容器会构造两层，如：
 *
 * ```jsx
 * <Container>
 *     <SelfContainer>
 *         <Component/>
 *     </SelfContainer>
 * </Container>
 * ```
 *
 * * Container：外层容器配置的基础信息`containerConfig`。
 * * SelfContainer：内层容器配置的基础信息。
 * * Component：组件本身以及组件基础配置。
 * * `SelfContainer + Component`等价于`xuiControl`的内容。
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
 * ### 1.基本介绍
 *
 * 执行 `xuiDecorator` 修饰包装组件。
 * 1. 提取 control 中的配置信息
 * 2. 是否执行了 $switcher 的随机跳跃处理（刷新界面专用）
 * 3. 事件执行器，针对特殊节点：`decorator` 执行事件注入解析工作
 *
 * ### 2.xuiControl解析流程
 *
 * 根据传入的配置信息，构造组件配置。
 *
 * #### 2.1.基础流程：
 *
 * * 如果`isContainer = true`，证明当前组件带容器配置，先渲染容器，再渲染组件。
 * * 如果提取了`control.name`，从`UI`中构造的组件，则执行组件渲染。
 * * 如果内置包含了`control.container`，则构造内置容器。
 *
 * #### 2.2.继承属性：
 *
 * |属性名|含义|
 * |:---|:---|
 * |data|构造当前组件所需的数据信息，调用`seekData`方法执行计算（只能同步操作）。|
 * |config|构造当前组件所需的配置信息。|
 * |event|事件专用配置信息，该事件会在内部执行Fabric引擎。|
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

const xuiCell = (column = {}, UI = {}, inherit = {}) => {
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
 * ### 1.基本介绍
 *
 * 执行 `xuiGrid` 专用Grid控件布局，执行每个单元格的渲染操作，Grid执行行列渲染。每个单元格内部：
 *
 * 1. xuiCell：执行单元格内容渲染。
 * 2. xuiColumn：执行单元格属性渲染`<Col/>`元素。
 *
 * ### 2.xuiCell
 *
 * xuiCell用于构造`fnJsx`函数，内置会递归执行：
 *
 * 1. xuiGrid：`rows`配置。
 * 2. xuiDecorator：`control`配置。
 *
 * ### 3.最终骨架
 *
 * 最终骨架代码：
 *
 * #### 3.1.容器部分
 *
 * ```jsx
 * <Container>
 *     <SelfContainer>
 *         <Component/>
 *     </SelfContainer>
 * </Container>
 * ```
 *
 * #### 3.2.网格部分
 *
 * 上边骨架中的`<Component/>`部分
 *
 * ```jsx
 * <Row>
 *     <Col>
 *          {xuiGrid}
 *          {xuiDecorator}
 *     </Col>
 * </Row>
 * ```
 *
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
                const fnRender = xuiCell(column, UI, inherit);
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