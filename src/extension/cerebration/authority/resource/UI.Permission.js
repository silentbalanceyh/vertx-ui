import React from 'react';
import Ux from 'ux';
import Op from './op/Op';
import Ex from "ex";
import jsx from './Web.Tree';
import Wizard from './wizard/UI';
import {Col, Row} from "antd";

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Perm.List")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPermPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPermPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {
                $opened = false,
                $tree = [],
                $selectedData
            } = this.state ? this.state : {};
            const span = $opened ? {left: 0, right: 24} : {left: 5, right: 19};
            return (
                <Row className={"web-authority-resource"}>
                    <Col span={span.left}>
                        {jsx.treePermission(this, $tree)}
                    </Col>
                    <Col span={span.right} className={"content"}>
                        <Wizard {...Ex.yoAmbient(this)}
                                rxRefresh={() => Ux.of(this).loading(false).done()}
                            // this.?etState({$loading: true})
                                data={$selectedData}/>
                    </Col>
                </Row>
            )
        }, Ex.parserOfColor("PxPermissionList").control());
    }
}

export default Component