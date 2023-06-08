import React from 'react';
import {ExDeploy, ExGraphicEditor} from "ei";
import {Col, Row, Tag} from 'antd';
import Ex from 'ex';
import Op from './op';

export default (reference, title = {}) => {
    const {$selected} = reference.state;
    if ($selected) {
        const header = title.header;
        const data = $selected.data ? $selected.data : {};
        const inherit = Ex.yoAmbient(reference);
        inherit.data = data;
        /*
         * 图区域的专用计算，将传入宽高数据
         */
        const gxFun = Op.rxCommand(reference);
        return (
            <div>
                <Row className={"header"}>
                    <Col span={4} className={"title"}>
                        {header.name}
                    </Col>
                    <Col span={6} offset={1}>
                        <Tag color={"cyan"} style={{
                            fontSize: 14,
                        }}>{data.name}</Tag>
                    </Col>
                    <Col span={4} className={"title"}>
                        {header.identifier}
                    </Col>
                    <Col span={6} offset={1}>
                        {data.identifier}
                    </Col>
                </Row>
                <Row>
                    <Col span={24}>
                        {/* 节点专用函数处理和执行 */}
                        <ExGraphicEditor {...inherit}
                                         {...gxFun}/>
                    </Col>
                </Row>
            </div>
        );
    } else {
        return (<ExDeploy alert={title.right} $width={820} step={1}/>)
    }
}