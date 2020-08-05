import React from 'react';
import {Col, List, Radio, Row, Switch} from 'antd';
import Ux from 'ux';
import Op from './Op';

export default (reference, source = [], values) => {
    const page = Ux.fromHoc(reference, "page");
    const valueSet = new Set(values);
    const {$heightStyle = {}} = reference.state;
    const style = $heightStyle.style ? Ux.clone($heightStyle.style) : {};
    style.maxHeight = $heightStyle.style.maxHeight - 252;
    return (
        <List dataSource={source} style={style} renderItem={item => {
            return (
                <Row className={"row-item"}>
                    <Col span={8}>
                        {item.alias}：
                    </Col>
                    <Col span={4}>
                        <Switch {...page.access} checked={valueSet.has(item.key)}
                                onChange={Op.rxCheck(reference, item)}/>
                    </Col>
                    <Col span={12} className={"row-item-radio"}>
                        {(() => {
                            const {$keyView} = reference.state;
                            const attrs = {};
                            attrs.disabled = !valueSet.has(item.key);
                            if (attrs.disabled) {
                                attrs.value = undefined;
                            } else {
                                attrs.value = !$keyView.has(item.key);
                            }
                            return (
                                <Radio.Group options={page.radio}
                                             {...attrs}
                                             onChange={Op.rxView(reference, item)}/>
                            )
                        })()}
                    </Col>
                </Row>
            )
        }}/>
    )
}