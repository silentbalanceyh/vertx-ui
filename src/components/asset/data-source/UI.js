import React from 'react';
import {Col, Row} from 'antd';
import Ex from 'ex';
import Ux from 'ux';
import {Fn, OpsSource} from 'app';

import renderSource from './Web.Source';
import renderTable from './Web.Table';
import Op from './Op';

@Ux.zero(Ux.rxEtat(require("./Cab.json"))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$type, $selected = {}, $refresh} = this.state;
            return (
                <Row>
                    <Col span={5}>
                        <OpsSource {...Ex.yoAmbient(this)}
                                   $refresh={$refresh}
                                   rxSelect={Op.rxSelect(this)}/>
                    </Col>
                    {(() => {
                        if ($type === Fn.Cv.Types.DataTable) {
                            // 非默认
                            return renderTable(this, $selected);
                        } else {
                            // 默认
                            return renderSource(this, $selected);
                        }
                    })()}
                </Row>
            )
        }, Ex.parserOfColor("PxDataSource").page());
    }
}

export default Component