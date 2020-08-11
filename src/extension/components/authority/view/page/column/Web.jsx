import Sd from "../_shared";
import {Checkbox, Col, Empty, Row, Tag} from "antd";
import React from "react";
import Ux from "ux";
import Op from './Op';

export default (reference) => {
    const {$source, $keySet} = reference.state;
    const info = Ux.fromHoc(reference, "info");

    return (
        <Row>
            <Col span={24}>
                <div className={"ux-title ux-title-pure"}>{info.title}</div>
                {Sd.renderSelected(reference, info)}
                {(() => {
                    if ($source) {
                        // 有数据
                        const system = $source.filter(item => "SYSTEM" === item._type);
                        const systemValues = system.map(item => item.key);
                        // 业务选择数据

                        const business = $source.filter(item => "SYSTEM" !== item._type);
                        let businessValues = [];
                        if ($keySet) {
                            businessValues = Array.from($keySet);
                        }
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
                                <Row>
                                    <Col span={4} className={"title"}>
                                        {info.business}
                                    </Col>
                                    <Col span={20}>
                                        <Checkbox checked={Op.isCheckedAll(reference)}
                                                  onChange={Op.rxCheckAll(reference)}/>&nbsp;&nbsp;{info.all}
                                    </Col>
                                </Row>
                                <Row>
                                    {(() => {
                                        const {$heightStyle = {}} = reference.state;
                                        const style = $heightStyle.style ? Ux.clone($heightStyle.style) : {};
                                        style.maxHeight = $heightStyle.style.maxHeight - 258;
                                        return (
                                            <Col span={20} offset={4}
                                                 className={"op-business"}>
                                                <Checkbox.Group options={business}
                                                                style={style} value={businessValues}
                                                                onChange={Op.rxCheck(reference)}/>
                                            </Col>
                                        )
                                    })()}
                                </Row>
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