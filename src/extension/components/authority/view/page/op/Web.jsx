import Sd from "../_shared";
import {Checkbox, Col, Empty, Row, Tag} from "antd";
import React from "react";
import Ux from "ux";
import Op from './Op';
import renderItem from "./Web.Item";

export default (reference) => {
    const {$source, $dataGroup = [], $keySet} = reference.state;
    const info = Ux.fromHoc(reference, "info");
    return (
        <Row>
            <Col span={24}>
                <div className={"ux-title ux-title-pure"}>{info.title}</div>
                {Sd.renderSelected(reference, info)}
                {(() => {
                    if ($source) {
                        // 业务选择数据
                        const business = $source.filter(item => "SYSTEM" !== item._type);
                        let businessValues = [];
                        if ($keySet) {
                            businessValues = Array.from($keySet);
                        }
                        // 有数据
                        const system = $source.filter(item => "SYSTEM" === item._type);
                        const systemValues = system.map(item => item.key);
                        return (
                            <div className={"content-page"}>
                                <Row>
                                    <Col span={4} className={"title"}>
                                        {info.system}
                                    </Col>
                                    <Col span={20}>
                                        <Tag color={"magenta"}>
                                            {info.tips}
                                        </Tag>
                                    </Col>
                                </Row>
                                <Row className={"row-content"}>
                                    <Col span={20} offset={4} className={"op-system"}>
                                        <Checkbox.Group options={system} value={systemValues}/>
                                    </Col>
                                </Row>
                                <Row className={"row-action"}>
                                    <Col span={20} offset={4}>
                                        <Checkbox checked={Op.isCheckedAll(reference)}
                                                  onChange={Op.rxCheckAll(reference)}/>&nbsp;&nbsp;{info.all}
                                    </Col>
                                </Row>
                                {$dataGroup.map(group => {
                                    const groupSet = new Set(group.value);
                                    const groupSource = business.filter(item => groupSet.has(item.key));
                                    return (
                                        <Row key={group.key}>
                                            <Col span={4} className={"title"}>
                                                {group.name}：
                                            </Col>
                                            <Col span={20}>
                                                {renderItem(reference, groupSource, businessValues)}
                                            </Col>
                                        </Row>
                                    )
                                })}
                            </div>
                        )
                    } else {
                        // 无数据
                        return (<Empty description={info.empty}/>)
                    }
                })()}
            </Col>
        </Row>
    )
}