import React from 'react';
import {component} from "../../_internal";
import Op from './op';
import Ux from 'ux';
import {Button, Col, Row, Table} from "antd";
import UiForm from "./forms/Web.Form";
import './Cab.less';

@component({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ux.xtReady(this, () => {
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
                    <Button className={"ux-hidden"} id={"$opSave"} onClick={Op.onSubmit(this)}/>
                </div>
            )
        })
    }
}

export default Component