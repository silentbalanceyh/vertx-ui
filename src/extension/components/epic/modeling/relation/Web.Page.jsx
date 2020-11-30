import React from 'react';
import {ExDeploy, ExGraphicSpider} from "ei";
import {Col, Row, Tag} from 'antd';
import Ex from 'ex';
import Ux from 'ux';

export default (reference, title = {}) => {
    const {$selected} = reference.state;
    if ($selected) {
        const header = title.header;
        const data = $selected.data ? $selected.data : {};
        const inherit = Ex.yoAmbient(reference);
        /*
         * 图区域的专用计算，将传入宽高数据
         */
        const gxFun = {};
        // 构造基础图数据专用函数
        gxFun.onNodeInitBefore = Ux.g6Image();
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
                        <ExGraphicSpider {...inherit} $current={data}
                                         {...gxFun}/>
                    </Col>
                </Row>
            </div>
        );
    } else {
        return (<ExDeploy alert={title.right} $width={820} step={1}/>)
    }
}