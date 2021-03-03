import React from 'react';
import Ux from "ux";
import Op from './sub/Op';
import Ex from "ex";

import {Button, Col, Row} from 'antd';
import '../Cab.less';

import renderSource from './sub/segment.left';
import renderTarget from './sub/segment.right';
import renderField from './sub/segment.field';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Form.Sub")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const info = Ux.fromHoc(this, "info")
            return (
                <div className={"ops-task-sub"}>
                    <Row className={"title-row"}>
                        <Col span={6}>
                            {info.source}：
                        </Col>
                        <Col span={6}>
                            {info.target}：
                        </Col>
                    </Row>
                    <Row>
                        <Col span={6}>
                            {renderSource(this)}
                        </Col>
                        <Col span={6}>
                            {renderTarget(this)}
                        </Col>
                        <Col span={12}>
                            {renderField(this)}
                        </Col>
                    </Row>
                    <Button id={"$opSaveTask"} className={"ux-hidden"}
                            onClick={Op.rxSubmit(this)}/>
                </div>
            )
        }, Ex.parserOfColor("SubTaskForm").form());
    }
}

export default Component