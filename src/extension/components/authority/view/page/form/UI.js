import React from 'react';
import Ux from "ux";
import Op from "./Op";
import Ex from "ex";
import Sd from "../_shared";
import {Col, Row, Spin} from 'antd';
import {LoadingAlert} from "web";
import renderPage from './Web';

@Ux.zero(Ux.rxEtat(require("../Cab.json"))
    .cab("UI.Form")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        window.addEventListener("resize", Ux.rxResize(this, Op.ADJUST));
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this, {props: prevProps, state: prevState});
    }

    componentWillUnmount() {
        window.removeEventListener("resize", Ux.rxResize(this, Op.ADJUST));
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $submitting = false,
                $loading = false,
                $resources,          // 选择的资源信息
                $selected,           // 是否选择了节点
            } = this.state;
            const alert = Ux.fromHoc(this, "alert");
            return (
                <div className={"page-column"}>
                    {Sd.renderButtons(this, !$resources)}
                    <Spin spinning={$submitting || $loading}>
                        <Row>
                            <Col span={6}>
                                {Sd.renderGroup(this)}
                            </Col>
                            <Col span={18} className={"content"}>
                                {$selected ? renderPage(this) : (
                                    <Row>
                                        <Col>
                                            <LoadingAlert $alert={alert}/>
                                        </Col>
                                    </Row>
                                )}
                            </Col>
                        </Row>
                    </Spin>
                </div>
            )
        }, Ex.parserOfColor("Rule-Column").define())
    }
}

export default Component