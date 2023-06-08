import Ux from 'ux';
import React from 'react';
import {Col, Row} from "antd";
import xuiContainer from './aero.@fn.xui.container';
import __Sk from './aero.__.fn.seek.configuration';
import __Yo from './channel.cm.fn.yo.container.norm'

const __xuiControl = (control = {}, UI = {}, inherit = {}) => {
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
                    const data = __Sk.seekData(inherit, control.source);
                    if (data) {
                        attrs.data = data;
                    }
                    const {event = {}, ...rest} = control.config;
                    attrs.config = rest;
                    /*
                     * 只有 Component 才出现的事件流程
                     */
                    attrs.event = event;
                    __Sk.seekInherit(attrs, control);
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
const xuiDecorator = (configuration = {}, UI = {}, inherit = {}, state = {}) => {
    // TODO: Usage in future
    const $control = __Yo.yoControl(configuration);
    /* 激活专用 */
    const $inherit = Ux.clone(inherit);
    if (state && state.$switcher) {
        $inherit.$switcher = state.$switcher;
    }
    return __xuiControl($control, UI, $inherit);
}
const __xuiCell = (column = {}, UI = {}, inherit = {}) => {
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

const __xuiColumn = (column) => {
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
const xuiGrid = (grid = [], UI = {}, inherit = {}) => grid.map(row => {
    const {columns = [], key} = row;
    return (
        <Row key={key}>
            {columns.map(column => {
                const fnRender = __xuiCell(column, UI, inherit);
                // 响应式布局
                const attrs = __xuiColumn(column);
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
    xuiDecorator,
}