import {Col} from "antd";
import Ux from "ux";
import React from "react";
import Ex from "ex";
import {ExRegiment} from "ei";
import Event from './event';

export default (reference, data, key) => {
    const {config = {}} = reference.props;
    return (
        <Col span={8} className={"row-op"}>
            {config.editable ? Ux.sexModal(reference, `${key}Op`, () => {
                /*
                 * ExRegiment 专用的配置信息
                 */
                const inherit = Ex.yoAmbient(reference);
                inherit.rxSubmit = Event.rxSave(reference, key);
                inherit.$isCategory = false;
                /*
                 * 构造 ExRegiment 的 $query 条件
                 */
                inherit.$query = Event.rxQuery(reference, key);
                return (
                    <ExRegiment {...inherit}/>
                );
            }) : false}
        </Col>
    )
};