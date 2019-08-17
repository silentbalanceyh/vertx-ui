import Ex from 'ex';
import './Cab.less';
import React from 'react';
import {Button, Checkbox, Col, Row} from 'antd';
import {LoadingAlert} from "web";

export default (reference, {
    options = [],
    group = {},
    button = {},
    notice = {},
}) => {
    const {config = {}} = reference.props;
    const style = Ex.toGrid(config);
    return (
        <div>
            <Row>
                <Col span={24}>
                    <LoadingAlert $alert={notice}/>
                </Col>
            </Row>
            <Row>
                <Col span={24} className={"ex-export"}>
                    <Checkbox.Group {...group}>
                        {options.map(item => {
                            return (
                                <div style={style} key={item.key} className={"item"}>
                                    <Checkbox key={item.key} value={item.key}>
                                        {item.label}
                                    </Checkbox>
                                </div>
                            );
                        })}
                    </Checkbox.Group>
                    <div className={"button"}>
                        <Button {...button}/>
                    </div>
                </Col>
            </Row>
        </div>
    );
}