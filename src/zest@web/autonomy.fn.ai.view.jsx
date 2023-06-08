import {Col, Row, Tag} from "antd";
import React from "react";

const aiViewMy = (config = {}, reference) => {
    const {$myDefault, $myView} = reference.props;
    if ($myDefault && $myView) {
        const {grid = {}} = config;
        const left = grid.left ? grid.left : 6;
        const right = grid.right ? grid.right : 18;
        let display = $myView.title ? $myView.title : $myDefault.title;
        if ($myDefault.name === $myView.name) {
            display = $myDefault.title;
        }
        return (
            <Row className={"ux_view_my"}>
                <Col span={left} className={"label"}>
                    {config.selected}
                </Col>
                <Col span={right} className={"content"}>
                    {<Tag color={"magenta"} style={{
                        fontSize: 14
                    }}>{display}（{$myView.name}）</Tag>}
                </Col>
            </Row>
        );
    } else {
        return false;
    }
}
export default {
    aiViewMy,
}