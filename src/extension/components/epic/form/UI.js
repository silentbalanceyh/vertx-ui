import React from 'react'
import Ux from "ux";
import Ex from 'ex';
import Yo from './yo';

import {Col, Row} from 'antd';
import './Cab.less';
import renderMenu from './Web.Fn.Menu';
import Form from './Web.Form';
import {ModelingPpt} from "app";

@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .ready(true)
    .to()
)

class Component extends React.PureComponent {
    componentDidMount() {
        Yo.yiPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$selected, $model} = this.state;
            return (
                <Row>
                    <Col span={4}>
                        <div style={{
                            maxHeight: Ux.toHeight(106),
                            overflow: "auto",
                            paddingRight: 6
                        }}>
                            {renderMenu(this)}
                        </div>
                    </Col>
                    <Col span={20} className={"ext-form-comment"}>
                        {$selected ? (
                            <Form {...Ex.yoAmbient(this)}
                                  $identifier={$selected}
                                  $model={$model}/>
                        ) : (() => {
                            const alert = Ux.fromHoc(this, "alert");
                            return (<ModelingPpt alert={alert} adjust={380} step={2}/>)
                        })()}
                    </Col>
                </Row>
            );
        }, Ex.parserOfColor("PxForm").page())
    }
}

export default Component