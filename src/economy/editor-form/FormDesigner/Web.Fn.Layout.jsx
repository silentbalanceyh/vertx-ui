import Ux from "ux";
import {Col, Empty, Form, Icon, Row, Tag} from "antd";
import React from "react";

const renderItem = (reference, item = {}) => {
    const {optionItem = {}} = item;
    return (
        <Form.Item {...optionItem}>
            --
        </Form.Item>
    );
}

const renderData = (reference, config = {}) => {
    const {rows = []} = config;
    return rows.map((row = {}) => (
        <Row key={row.key} className={"viewer-layout-row"}>
            {row.cells.map(cell => (
                <Col key={cell.field} span={cell.span}>
                    {renderItem(reference, cell)}
                </Col>
            ))}
        </Row>
    ));
}

export default (reference, jsx = {}) => {
    const ref = Ux.onReference(reference, 1);
    const {$layout = {}} = ref.state;
    return (
        <div>
            <Row>
                <Col span={24}>
                    <Tag color={"blue"} style={{fontSize: 14}}>
                        <Icon type={"arrow-down"}/>&nbsp;&nbsp;
                        {$layout.title}
                    </Tag>
                    &nbsp;&nbsp;
                    {$layout.comment}
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    {(() => {
                        const value = Ux.formHit(reference, "window");
                        if (value) {
                            return renderData(reference, $layout.data[value]);
                        } else {
                            return (<Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>)
                        }
                    })()}
                </Col>
            </Row>
        </div>
    )
}