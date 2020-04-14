import React from "react";
import Ex from "ex";
import Ux from 'ux';
import {ExGraphicViewer} from "ei";

const mountExecutor = (inherit = {}, reference) => {
    const {event = {}} = reference.props;
    const $fabric = {};
    if (Ux.isEmpty(event)) {
        /*
         * 编程传入函数
         */
        const {$event = {}} = reference.props;
        Object.keys($event)
            .filter(key => Ux.isFunction($event[key]))
            .forEach(eventName => $fabric[eventName] = $event[eventName]);
    } else {
        Object.keys(event).forEach(eventName => {
            /*
             * 构造事件发送器：Fabric 链式结构
             */
            const fabric = Ex.etUniform(reference, event[eventName]);
            if (Ux.isFunction(fabric)) {
                $fabric[eventName] = fabric;
            }
        });
    }
    /* $fabric 转换成 event 用于绑定 */
    {
        const $event = {executor: {}};
        if (Ux.isFunction($fabric.onNodeDoubleClick)) {
            $event.executor.onNodeDoubleClick = $fabric.onNodeDoubleClick;
        }
        inherit.$event = $event;
    }
}

export default (reference) => {
    const {$data = {}} = reference.state;
    const inherit = Ex.yoAmbient(reference);
    const {$inited = {}} = reference.props;
    /* $fabric 转换成 event 用于绑定 */
    mountExecutor(inherit, reference);
    return (
        <ExGraphicViewer {...inherit} data={$data}
                         $current={$inited}
                         config={{
                             category: {
                                 source: "graphic.nodes",
                                 field: "categoryThird"
                             }
                         }}/>
    )
}