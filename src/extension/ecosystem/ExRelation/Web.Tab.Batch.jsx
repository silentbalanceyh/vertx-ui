import React from 'react';
import Ux from 'ux';
import {Col, Popconfirm} from 'antd';
import Event from './event';
/*
 * 批量删除专用按钮
 */
export default (reference, data = [], key) => {
    const {config = {}} = reference.props;
    if (config.editable) {
        const state = reference.state ? reference.state : {};
        let $selected = [];
        if ("up" === key) {
            $selected = state['$selectedUp'];
        } else {
            $selected = state['$selectedDown'];
        }
        if (!$selected) {
            $selected = [];
        }
        const batch = Ux.fromHoc(reference, "batch");
        if (batch) {
            const attrs = {};
            attrs.disabled = 0 === $selected.length;
            if (batch.confirm) {
                const confirmAttrs = {};
                if (0 < $selected.length) {
                    confirmAttrs.onConfirm = (event) => {
                        Ux.prevent(event);
                        Event.rxRemove(reference, $selected, key);
                    };
                    confirmAttrs.title = batch.confirm;
                }
                attrs.onClick = Ux.prevent;
                return (
                    <Col span={12} className={"row-batch"}>
                        <Popconfirm {...confirmAttrs}>
                            <a href={"#"} {...attrs}>
                                {batch.text}
                            </a>
                        </Popconfirm>
                    </Col>
                )
            } else {
                if (0 < $selected.length) {
                    attrs.onClick = (event) => {
                        Ux.prevent(event);
                        Event.rxRemove(reference, $selected, key);
                    }
                }
                return (
                    <Col span={12} className={"row-batch"}>
                        <a href={"#"} {...attrs}>
                            {batch.text}
                        </a>
                    </Col>
                )
            }
        } else {
            return (<Col span={12}/>)
        }
    } else {
        return (<Col span={12}/>)
    }
}