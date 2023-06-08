import React from 'react';
import Op from './Op';
import {Button, Col, Row, Table} from "antd";
import UiForm from "./Form.Sub.Web";

import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';

@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$table = {}, data = []} = this.state;
            return (
                <div>
                    <Row className={"web-param-table"}>
                        <Col span={24}>
                            <Table {...$table} dataSource={data}/>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <UiForm reference={this} onChange={Op.onChange(this)}/>
                        </Col>
                    </Row>
                    <Button className={"ux_hidden"} id={"$opSave"} onClick={Op.onSubmit(this)}/>
                </div>
            )
        })
    }
}

export default Component