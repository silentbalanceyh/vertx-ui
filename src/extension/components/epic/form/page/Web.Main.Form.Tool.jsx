import Ux from 'ux';
import {Button, Col, Input, Row, Tag} from 'antd';
import React from "react";
import Event from '../event';

export default (reference, toolbar = {}) => {
    const {buttons = []} = toolbar;
    return (
        <Row className={"ext-tool"}>
            <Col span={4}>
                {buttons.map(button => {
                    const {onClick, ...rest} = button;
                    const attrs = {}
                    const fnClick = Event.actions[onClick];
                    if (Ux.isFunction(fnClick)) {
                        attrs.onClick = fnClick(reference);
                    }
                    Object.assign(attrs, rest);
                    const {text, ...restAttrs} = attrs;
                    return (
                        <Button {...restAttrs}>
                            {text}
                        </Button>
                    )
                })}
            </Col>
            <Col span={6}>
                {(() => {
                    const {$model = ""} = reference.props;
                    return (
                        <div className={"model"}>
                            <span>{toolbar.manage}</span>
                            <Tag color={"green"} style={{
                                fontSize: 14
                            }}>{$model}</Tag>
                        </div>
                    );
                })()}
            </Col>
            <Col span={6} offset={8}>
                <Input.Search placeholder={toolbar.searchText}
                              onSearch={$searchText => {
                                  Ux.of(reference).in({$searchText}).done();
                                  // reference.?etState({$searchText});
                              }}/>
            </Col>
        </Row>
    )
}