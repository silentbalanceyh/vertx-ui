import {Col, Collapse, Icon, Row} from "antd";
import React from "react";
import Ux from 'ux';

const renderColumn = (columns = [], mapping = {}) => columns.forEach(column => {
    Ux.D.vtSource(column, mapping);
    Ux.D.vtType(column);
    Ux.D.vtRequired(column);
    Ux.D.vtNameOption(column);
    Ux.D.vtValueByType(column);
});

const renderCode = ($name) => {
    return (
        <Row style={{
            backgroundColor: "#f2f4f5",
            padding: 10,
            marginBottom: 10,
            fontSize: 14
        }}>
            <Col span={23} offset={1}>
                        <span style={{
                            color: "#e43a32"
                        }}>import</span>
                &nbsp;&nbsp;
                <span style={{
                    color: "#3a8df7"
                }}>{`{ ${$name} }`}</span>
                &nbsp;&nbsp;
                <span style={{
                    color: "#e43a32"
                }}>from</span>
                &nbsp;&nbsp;
                <span style={{
                    color: "#418345"
                }}>'web';</span>
            </Col>
        </Row>
    )
};

const renderComment = (icon, type) => {
    return (
        <Collapse activeKey={[icon.key, type.key]}>
            <Collapse.Panel header={icon.title} key={icon.key}>
                {icon.items.map(item => (
                    <div key={item.color} style={{
                        marginBottom: 10
                    }}>
                        <Icon type={"info-circle"} style={{
                            fontSize: 16,
                            color: item.color
                        }}/>&nbsp;&nbsp;{item.text}
                    </div>
                ))}
            </Collapse.Panel>
            <Collapse.Panel header={type.title} key={type.key}>
                {type.items.map(item => (
                    <div key={item.color} style={{
                        marginBottom: 10
                    }}>
                        <Icon type={item.icon} style={{
                            fontSize: 16,
                            color: item.color
                        }}/>&nbsp;&nbsp;{item.text}
                    </div>
                ))}
            </Collapse.Panel>
        </Collapse>
    )
};
export default {
    renderColumn,
    renderCode,
    renderComment
}