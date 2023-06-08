import React from 'react';
import {Checkbox, Col, Input, Row} from 'antd';
import Op from './Op';

import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';

const UCA_NAME = "SearchInput";
// =====================================================
// componentInit/componentUp
// =====================================================
@uca({
    "i18n.cab": require('./Cab.json'),
    "i18n.name": "UI",
    state: {
        $data: {}
    }
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        Op.yiDefault(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        __Zn.xtReset(this, {props: prevProps, state: prevState},
            (value) => Op.yiValue(this, value));
    }

    render() {
        const {reference, layout = {}, ...rest} = this.props;

        const {$data = {}} = this.state;
        // _zeroUca.default.sexCab is not a function
        const cab = __Zn.fromHoc(this, "config");
        // __Zn.sexCab(this, "config");
        if (__Zn.isEmpty(layout)) {
            layout.left = 16;
            layout.right = 8;
        }
        const WebField = __Zn.V4InputGroup;
        return (
            <WebField {...rest}>
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
            </WebField>
        );
    }
}

export default Component;