import React from 'react';
import {Button, Col, Input, Radio, Row} from 'antd';
import Op from './Op';
import Ux from 'ux';

class Component extends React.PureComponent {

    render() {
        const {
            value = [],
            config = {},
            $dropCategory = [],
            $dropAttribute = [],
        } = this.props;
        return 0 < value.length ? (
            <Row>
                <Col span={24}>
                    {value.map((data, index) => {
                        return (
                            <div key={data.key} className={"ops-tag-action"}>
                                <Row span={24}>
                                    <Col span={2}>
                                        <Button icon={"minus"} shape={"circle"} size={"small"}
                                                onClick={Op.attrDel(this, data.key)}/>
                                    </Col>
                                    <Col span={6}>
                                        {Op.renderSelect(this, data.key, "category", $dropCategory)}
                                    </Col>
                                    <Col span={6}>
                                        {Op.renderSelect(this, data.key, "attribute", $dropAttribute)}
                                    </Col>
                                    <Col span={3}>
                                        {Op.renderConnector(this, data.key)}
                                    </Col>
                                    <Col span={6}>
                                        <Input onChange={Ux.xtRowChange(this, data.key, "value")}/>
                                    </Col>
                                </Row>
                                <Row span={24}>
                                    <Col span={22} offset={2}>
                                        {index < (value.length - 1) ? (
                                            <Radio.Group onChange={Ux.xtRowChange(this, data.key, "connector")}>
                                                <Radio.Button value={"and"}>
                                                    and
                                                </Radio.Button>
                                                <Radio.Button value={"or"}>
                                                    or
                                                </Radio.Button>
                                            </Radio.Group>
                                        ) : (() => {
                                            const {action = {}} = config;
                                            return (
                                                <Button type={"primary"} onClick={Op.attrAdd(this)}>
                                                    {action.button}
                                                </Button>
                                            )
                                        })()}
                                    </Col>
                                </Row>
                            </div>
                        )
                    })}
                </Col>
            </Row>
        ) : (
            <div className={"ops-tag-empty"}>
                {(() => {
                    const {empty = {}} = config;
                    return (
                        <div>
                            <Button type={"primary"} onClick={Op.attrAdd(this)}>{empty.button}</Button>
                            <div>{empty.comment}</div>
                        </div>
                    )
                })()}
            </div>
        )
    }
}

export default Component;