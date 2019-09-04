import Ux from 'ux';
import Ex from 'ex';
import React from 'react';
import {Button, Col, Popover, Row} from "antd";
import U from 'underscore';

const jsxTitle = (reference, config = {}) =>
    (
        <Row>
            <Col span={23}>
                <h3>{config.title}</h3>
            </Col>
            <Col span={1} style={{
                paddingTop: 3
            }}>
                <Button shape={"circle"} icon={"close"}
                        size={"small"}
                        className={"ux-red"}
                        onClick={event => {
                            Ux.prevent(event);
                            Ex.rsVisible(reference, false)();
                        }}/>
            </Col>
        </Row>
    );

export default (reference, jsxChildren, config = {}) => {
    config = Ux.clone(config);
    /*
     * overlayStyle 计算，主要针对 width
     */
    config.overlayStyle = {width: config.width};
    config.content = U.isFunction(jsxChildren) ? jsxChildren() : false;
    /*
     * 关闭按钮属性专用
     */
    config.title = jsxTitle(reference, config);
    return (
        <Popover {...config}/>
    );
}