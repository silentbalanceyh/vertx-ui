import React from 'react';
import {Col, DatePicker, Row, TimePicker} from "antd";
import Ux from 'ux';

export default (reference, config = {}) => {
    const {down = {}} = config;
    const {$inited = {}} = reference.state;
    let dataField = $inited.runTime ? $inited.runTime : 1;
    let dataFreq = $inited.runFreq;
    let repeatTime = "DAY" === dataFreq ? dataField : 1;
    let repeatDate = "YEAR" === dataFreq ? dataField : 1;
    return (
        <Col span={23} offset={1}>
            <Row className={"row-date"}>
                <Col span={10}>
                    {down['startDate']}
                </Col>
                <Col span={11} offset={1}>
                    {Ux.itRepeat(repeatDate, (index) => ({
                        key: "startDate" + index,
                        index,
                        value: $inited['startDate'] ? $inited['startDate'][index] : null,
                    })).map(each => {
                        return (
                            <DatePicker className={"ux-readonly"} key={each.key}
                                        value={each.value ? each.value : null}
                                        onChange={value => {
                                            /*
                                             * 计算当前的值
                                             */
                                            let startDate = []
                                            if ($inited['startDate']) {
                                                startDate = Ux.clone($inited['startDate']);
                                            }
                                            startDate[each.index] = value;
                                            const replaced = Ux.clone($inited);
                                            replaced['startDate'] = startDate;
                                            reference.setState({$inited: replaced});
                                        }}/>
                        )
                    })}
                </Col>
            </Row>
            <Row className={"row-date"}>
                <Col span={10}>
                    {down['startTime']}
                </Col>
                <Col span={11} offset={1}>
                    {Ux.itRepeat(repeatTime, (index) => ({
                        key: "startTime" + index,
                        index,
                        value: $inited['startTime'] ? $inited['startTime'][index] : null,
                    })).map(each => {
                        return (
                            <TimePicker value={each.value ? each.value : null}
                                        key={each.key}
                                        onChange={value => {
                                            /*
                                                     * 计算当前的值
                                                     */
                                            let startDate = []
                                            if ($inited['startTime']) {
                                                startDate = Ux.clone($inited['startTime']);
                                            }
                                            startDate[each.index] = value;
                                            const replaced = Ux.clone($inited);
                                            replaced['startTime'] = startDate;
                                            reference.setState({$inited: replaced});
                                        }}/>
                        )
                    })}
                </Col>
            </Row>
        </Col>
    )
}