import {Col, Collapse, Icon, Row} from "antd";
import React from "react";

const renderColumn = (columns = [], mapping = {}) => {
    columns.forEach(column => {
        if ("source" === column.dataIndex) {
            column.render = (text) => {
                const item = mapping['source'][text];
                return (
                    <span><Icon {...item}/></span>
                )
            }
        }
        if ("type" === column.dataIndex) {
            column.render = (text) => (<span style={{
                color: "#bc0981"
            }}>{text}</span>)
        }
        if ("required" === column.dataIndex) {
            column.render = (text) => {
                const type = text ? "check" : "close";
                const color = text ? "#f99" : "#69f";
                return <Icon type={type} style={{fontSize: 16, color}}/>;
            }
        }
        if ("name" === column.dataIndex || "option" === column.dataIndex) {
            column.render = (text) => {
                if ("reference" === text || "children" === text) {
                    return (
                        <span style={{
                            color: "#9551f6"
                        }}>{text}</span>
                    )
                } else {
                    return "name" === column.dataIndex ? (
                        <span style={{
                            color: "#1e358c"
                        }}>{text}</span>
                    ) : (
                        <span style={{
                            color: "#4169E1"
                        }}>{text}</span>
                    )
                }
            }
        }
        if ("value" === column.dataIndex) {
            column.render = (text, record) => {
                if ("String" === record.type) {
                    text = `"${text}"`;
                    return (<span style={{
                        color: "#87d068"
                    }}>{text}</span>)
                } else if ("Boolean" === record.type) {
                    return (<span style={{
                        color: "#4169E1"
                    }}>{text}</span>)
                } else {
                    return text;
                }
            }
        }
    })
};

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
}
export default {
    renderColumn,
    renderCode,
    renderComment
}