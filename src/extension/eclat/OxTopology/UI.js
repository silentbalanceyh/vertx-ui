import React from 'react';
import Yo from './yo';
import Ex from 'ex';
import Ux from 'ux';
import {Col, Row} from 'antd';
/* 内容渲染 */
import {LoadingAlert} from "web";
import {ExGraphicViewer} from "ei";

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExTopology")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Yo.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Yo.yuPage(this, {props: prevProps, state: prevState});
    }

    render() {
        return Ex.yoRender(this, () => (
            <div className={"drawer-background"}>
                <Row>
                    <Col span={24}>
                        {Ex.yoRender(this, () => {
                            const {$data = {}} = this.state;
                            const {nodes = []} = $data;
                            if (0 < nodes.length) {
                                const inherit = Ex.yoAmbient(this);
                                /*
                                 * 处理图配置
                                 */
                                Yo.yoGraphic(inherit, this);
                                inherit.data = $data;
                                /*
                                 * 事件构造
                                 */
                                const gxFun = Yo.rxCommand(this);
                                return (
                                    <ExGraphicViewer {...inherit}
                                                     {...gxFun}/>
                                );
                            } else {
                                const alert = Ux.fromHoc(this, "alert");
                                return (
                                    <LoadingAlert $alert={alert}/>
                                )
                            }
                        }, Ex.parserOfColor("OxTopology").component())}
                    </Col>
                </Row>
            </div>
        ), Ex.parserOfColor('OxTopology').component())
    }
}

export default Component;