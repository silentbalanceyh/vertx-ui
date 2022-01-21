import React from 'react';
import {Card, Col, Divider, Icon, Row} from 'antd';
import Ux from 'ux';
import Ex from 'ex';
import './Cab.less';

class Component extends React.PureComponent {
    render() {
        const {config = {}, source = []} = this.props;
        // Root 部分（无链接）
        const root = source.filter(item => !item.parentId);
        return (
            <Card title={config.title}
                  className={`${Ux.Env.ECONOMY.CARD_CONTAINER} ex-portal`}>
                {root.map((each, index) => (
                    <Row key={each.key} className={"row"}>
                        <Col span={3} style={{
                            backgroundColor: Ex.toColor(index, "SIX_6")
                        }} className={"title"}>
                            <Icon type={each.icon} style={{color: "white"}}/>
                            &nbsp;&nbsp;
                            {each.text}
                        </Col>
                        <Col span={21} className={"content"}>
                            {(() => {
                                const children = source.filter(item => each.key === item.parentId);
                                return children.map((child, index) => (
                                    <span key={child.key}>
                                        {/* eslint-disable-next-line */}
                                        <a href={""} className={"link"} onClick={event => {
                                            Ux.prevent(event);
                                            Ux.toRoute(this, child.uri);
                                        }}>
                                            <Icon type={child.icon}/>
                                            &nbsp;
                                            {child.text}
                                        </a>
                                        {index < (children.length - 1) ? (
                                            <Divider type="vertical"/>
                                        ) : false}
                                    </span>
                                ))
                            })()}
                        </Col>
                    </Row>
                ))}
            </Card>
        )
    }
}

export default Component