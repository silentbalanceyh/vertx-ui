import React from 'react';
import Ux from "ux";
import Ex from "ex";
import Op from "./Op";
import {Col, Row} from "antd";
import ExListFast from "../ExListFast/UI";
import QxQBE from '../QxQBE/UI';
import QxInput from '../QxInput/UI';
import QxRange from '../QxRange/UI';
import QxTag from '../QxTag/UI';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "TxQDone";
@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        Ex.wf(this).yiQueue();
    }

    render() {
        return Ex.yoRender(this, () => {
            const wf = Ex.wf(this);
            /*
             * 合并选项配置中的核心选项
             * _grid.options <-- config.options
             *
             * _grid.options：来自资源文件
             * config.options：来自属性
             */
            const exchange = Ux.Env.GRID.LIST_WF;
            const config = Ux.fromHoc(this, "toolkit");
            const {
                $qbe,
                $query,
                $qr,
                $qbeOk = false,     // State Revert Bug
            } = this.state;
            // inherit
            const inherit = Ex.yoAmbient(this);
            inherit.__state = {$query, $qr, $qbe};
            const attrQueue = Sk.mixTx(UCA_NAME);
            return (
                <div {...attrQueue}>
                    <QxTag {...Ex.yoQrTag(this, config.tag)}/>
                    <Row className={"toolbar"}>
                        <Col {...exchange.open}>
                        </Col>
                        <Col {...exchange.batch}>
                        </Col>
                        <Col {...exchange.search} className={"search"}>
                            <QxInput {...Ex.yoQrCond(this, {
                                ...config.serial,
                                field: 'serial'
                            })}/>
                            <QxRange {...Ex.yoQrCond(this, {
                                ...config.range,
                                field: 'range'
                            })}/>
                        </Col>
                        <Col {...exchange.extra}>
                            <QxQBE {...Ex.yoQrQBE(this)}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            {$qbeOk ? (
                                <ExListFast {...wf.yoQueue()}
                                            $renders={wf.JsxList}
                                            $executor={Op.yoExecutor(this)}/>
                            ) : false}
                        </Col>
                    </Row>
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).control());
    }
}

export default Component