import React from 'react';
import Ux from "ux";
import Ex from 'ex';
import {Button, Col, Row, Switch, Tooltip} from "antd";

import renderMenu from './Web.Menu';
import renderPage from './Web.Page';
import Op from "./op";

@Ux.zero(Ux.rxEtat(require('../Cab.json'))
    .cab("UI.Relation")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * models / category 计算最终的模型列表
             */
            const title = Ux.fromHoc(this, "title");
            const attrSwitch = Op.yoSwitch(this);
            const attrLeft = Op.yoLeft(this);
            const attrRight = Op.yoRight(this);
            /*
             * 切换
             */
            const {$expand = false} = this.state;
            return (
                <Row>
                    <Col {...attrLeft} className={"ox-rel-page"}>
                        {renderPage(this, title)}
                    </Col>
                    {$expand ? (
                        <Col {...attrRight}>
                            <Tooltip title={title.expand}>
                                <Button icon={Ux.v4Icon("double-left")}
                                        shape={"circle"}
                                        className={"uc_green"}
                                        onClick={Op.onClose(this)}/>
                            </Tooltip>
                        </Col>
                    ) : (
                        <Col {...attrRight}>
                            <div className={"ox-rel-title"}>
                                <Switch {...attrSwitch}/>&nbsp;&nbsp;{title.left}
                            </div>
                            <div style={{
                                maxHeight: Ux.toHeight(136),
                                overflow: "auto",
                                paddingRight: 6
                            }}>
                                {renderMenu(this)}
                            </div>
                        </Col>
                    )}
                </Row>
            );
        }, Ex.parserOfColor("PxRelation").control());
    }
}

export default Component;