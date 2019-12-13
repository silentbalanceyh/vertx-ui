import React from 'react';
import {Checkbox, Col, Input, Row} from 'antd';
import Op from './Op';
import {_zero} from "../../_internal";
import Ux from 'ux';

@_zero({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        $data: {}
    }
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiDefault(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Ux.xtReset(this, {props: prevProps, state: prevState},
            (value) => Op.yiValue(this, value));
    }

    render() {
        const {reference, layout = {}, ...rest} = this.props;

        const {$data = {}} = this.state;
        const cab = Ux.sexCab(this, "config");
        if (Ux.isEmpty(layout)) {
            layout.left = 16;
            layout.right = 8;
        }
        return (
            <Input.Group {...rest}>
                <Row>
                    <Col span={layout.left}>
                        <Input value={$data.text} type={"compact"}
                               onChange={Op.onChange(this)}/>
                    </Col>
                    <Col span={layout.right} style={{
                        paddingTop: 5,
                        textAlign: "left"
                    }}>
                        &nbsp;&nbsp;
                        <Checkbox checked={"=" === $data.op}
                                  onChange={Op.onChecked(this)}/>
                        &nbsp;&nbsp;
                        {cab.checkbox ? cab.checkbox : ""}
                    </Col>
                </Row>
            </Input.Group>
        );
    }
}

export default Component;