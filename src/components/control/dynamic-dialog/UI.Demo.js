import React from 'react'
import {DynamicDialog, PageCard} from "web";
import Ux from 'ux'
import {Button, Col, Row} from 'antd';

const {zero} = Ux;

@zero(Ux.rxEtat(require("./Cab"))
    .cab("UI.Demo")
    .state({})
    .to()
)
class Component extends React.PureComponent {
    render() {
        const configuration = Ux.fromHoc(this, "configuration");
        const fnOk = (item) => (event) => {
            event.preventDefault();
            const state = {};
            state[item.state] = true;
            this.setState(state);
        };
        const fnCancel = (item) => (event) => {
            event.preventDefault();
            const state = {};
            state[item.state] = false;
            this.setState(state);
        };
        return (
            <PageCard reference={this}>
                <Row>
                    {configuration.map(item => (
                        <Col key={item.state} span={item.span}>
                            <Button onClick={fnOk(item)}>{item.button}</Button>
                            <DynamicDialog $dialog={item.window}
                                           rxCancel={fnCancel(item)}
                                           rxOk={fnCancel(item)}
                                           $visible={this.state[item.state]}>
                                {item.button}
                            </DynamicDialog>
                        </Col>
                    ))}
                </Row>
            </PageCard>
        )
    }
}

export default Component