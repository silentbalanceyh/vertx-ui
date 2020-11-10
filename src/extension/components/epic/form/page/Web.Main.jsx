import {Col, Row} from "antd";
import Ux from "ux";
import renderMenu from "./Web.Main.Menu";
import Form from "./Web.Main.Form";
import Ex from "ex";
import {ExDeploy} from "ei";
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
                    return (<ExDeploy alert={alert} $width={880} step={2}/>)
                })()}
            </Col>
        </Row>
    );
}