import Ux from "ux";
import {Button, Col, Input, Row, Tag} from "antd";
import React from "react";

const _on2Filter = (reference, key) => (event) => {
    event.preventDefault();
    let {filters = {}} = reference.state;
    if (key) {
        filters[key] = event.target ? event.target.value : "";
    } else {
        // 清空筛选器
        const $filters = {};
        Object.keys(filters).forEach(key => $filters[key] = undefined);
        filters = $filters;
    }
    filters = Ux.clone(filters);
    reference.setState({filters});
};
const renderButton = (reference) => {
    return (
        <Button.Group>
            <Button icon={"filter"}/>
            <Button icon={"undo"} onClick={_on2Filter(reference, null)}/>
        </Button.Group>
    );
};
const renderFilter = (reference) => {
    const {config = {}, filters = {}} = reference.state;
    const filter = config.filter ? config.filter : [];
    return 0 < filter.length ? (
        <Row className={"web-table-transfer-row"}>
            <Col span={2} style={{paddingTop: 3, paddingLeft: 5}}>
                {config.prefix ? (
                    <Tag color={"magenta"}>{`${config.prefix}：`}</Tag>
                ) : ""}
            </Col>
            {filter.map(item => (
                <Col span={3} key={item.key}>
                    <Input placeholder={item.placeholder}
                           style={{width: "90%"}}
                           onChange={_on2Filter(reference, item.key)}
                           value={filters[item.key]}/>
                </Col>
            ))}
            <Col span={2}>
                {renderButton(reference)}
            </Col>
        </Row>
    ) : false;
};

export default {
    renderFilter
};