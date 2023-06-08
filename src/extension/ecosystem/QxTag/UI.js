import React from 'react';
import {Col, Row, Tag} from 'antd';
import Ux from 'ux';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "QxTag";
const renderTag = (reference, condition = {}, value) => {
    return Object.keys(condition).filter(field => value[field]).map(field => {
        const kv = condition[field].split(',');
        const [text, color = "green"] = kv;
        return (
            <Tag key={field} color={color}
                 style={{fontSize: 14}}
                 closable onClose={event => {
                Ux.prevent(event);
                Ux.fn(reference).rxClean(field);
            }}>
                {text}
            </Tag>
        )
    })
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {value, config = {}} = this.props;
        const exchange = Ux.Env.GRID.LIST_WF;
        const attrQx = Sk.mixQx(UCA_NAME);
        return (
            <Row {...attrQx}>
                <Col {...exchange.open} className={"filter-title"}>
                    {config.title}
                </Col>
                <Col span={21} className={"filter-label"}>
                    {Ux.isNotEmpty(value) ? (
                        // eslint-disable-next-line
                        <a href={"#"} onClick={event => {
                            Ux.prevent(event);
                            Ux.fn(this).rxClean(null);
                        }}>
                            {Ux.v4Icon("delete")}
                            &nbsp;
                            {config.clean}
                        </a>
                    ) : false}
                    &nbsp;&nbsp;
                    {renderTag(this, config.condition, value)}
                </Col>
            </Row>
        );
    }
}

export default Component