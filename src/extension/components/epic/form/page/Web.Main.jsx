import {Col, Row} from "antd";
import Ux from "ux";
import renderMenu from "./Web.Main.Menu";
import Form from "./Web.Main.Form";
import Ex from "ex";
import {ModelingPpt} from "app";
import React from "react";

export default (reference) => () => {
    const {$selected, $model} = reference.state;
    return (
        <Row>
            <Col span={4}>
                <div style={{
                    maxHeight: Ux.toHeight(106),
                    overflow: "auto",
                    paddingRight: 6
                }}>
                    {renderMenu(reference)}
                </div>
            </Col>
            <Col span={20} className={"ext-form-comment"}>
                {$selected ? (
                    <Form {...Ex.yoAmbient(reference)}
                          $identifier={$selected}
                          $model={$model}/>
                ) : (() => {
                    const alert = Ux.fromHoc(reference, "alert");
                    return (<ModelingPpt alert={alert} adjust={380} step={2}/>)
                })()}
            </Col>
        </Row>
    );
}