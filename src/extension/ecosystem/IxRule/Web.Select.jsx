import React from 'react';
import {Checkbox, Col, Collapse, Row, Tag} from 'antd';
import "./Cab.less";
import Event from './event';
import Ux from "ux";
import {LoadingAlert} from "../../../economy";

export default (reference) => {
    const attrs = {};
    attrs.key = "selection";
    attrs.showArrow = false;
    const {$source = []} = reference.props;
    const {$selectedKeys, $selectedFields = [], data = []} = reference.state;

    const pending = Ux.fromHoc(reference, "pending");
    const {source = {}} = pending;

    let selectedKey = $selectedKeys ? $selectedKeys[0] : undefined;
    const index = Ux.elementIndex(data, selectedKey, 'key');
    return (
        <Collapse activeKey={["selection"]}>
            <Collapse.Panel {...attrs} header={
                <span>
                    <Row>
                        <Col span={12}>
                            {source.title}
                        </Col>
                        <Col span={12} style={{
                            textAlign: "right"
                        }}>
                            {0 <= index ? (
                                <span>
                                    {source.selected}
                                    <Tag color={"orange"} style={{
                                        fontSize: 14
                                    }}>
                                        {source.rule}{index + 1}
                                    </Tag>
                                </span>
                            ) : false}
                        </Col>
                    </Row>
                </span>
            }>
                <div className={"content"}>
                    {(() => {
                        if (0 < $source.length) {
                            return (
                                <Checkbox.Group options={$source} className={"content-check"}
                                                value={$selectedFields}
                                                onChange={Event.onChecked(reference)}
                                                disabled={undefined === $selectedKeys}/>
                            )
                        } else {
                            const {config = {}} = reference.props;
                            const {sourceEmpty} = config;
                            if (sourceEmpty) {
                                return (
                                    <LoadingAlert $alert={sourceEmpty}/>
                                )
                            } else return false;
                        }
                    })()}
                </div>
            </Collapse.Panel>
        </Collapse>
    )
}