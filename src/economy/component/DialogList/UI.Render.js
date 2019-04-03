import React from 'react';
import Op from './op/Op';
import {Button, Col, Row} from 'antd';

const renderHeader = (reference) => {
    const options = Op.readOption(reference);
    // 检查是否包含了op.add.visible
    let ready = false;
    const item = {};
    // 是否显示
    if (options.hasOwnProperty("op.add.visible") ||
        options.hasOwnProperty('op.add')) {
        // 需要显示添加按钮或者隐藏显示
        item.type = 'primary';
        item.htmlType = 'button';
        if (options.hasOwnProperty("op.add.visible") &&
            !options['op.add.visible']) {
            item.className = 'ux-hidden';
        }
        if (options.hasOwnProperty('op.add.id')) {
            item.key = options['op.add.id'];
            item.id = item.key;
        }
        ready = true;
    }
    return ready ? (
        <Row className={"page-topbar"}>
            <Col span={8}>
                <Button {...item} onClick={Op.rxAdd(reference, options['op.add.window'])}>
                    {options['op.add']}
                </Button>
            </Col>
        </Row>
    ) : false;
};

export default {
    renderHeader
};