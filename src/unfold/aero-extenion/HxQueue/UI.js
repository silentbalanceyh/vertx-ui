import React from 'react';
import {Checkbox, Col, Row, Tag} from 'antd';

import Ux from 'ux';
import Op from './Op';
import __Zn from '../zero.aero.dependency';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "HxQueue";

class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        Op.componentInit(this).then(Ux.pipe(this));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        // Metadata Update
        __Zn.aclChildUp(this, {
            props: prevProps,
            state: prevState
        }, Op.componentInit);
    }

    render() {
        return __Zn.yoRender(this, () => {
            const {config = {}} = this.props;
            const {webSection = {}} = config;
            const {region = []} = webSection;
            return region.map(each => {
                const regionData = Op.yoData(this, each);
                const checkAttrs = {};
                const {$keySet} = this.state;
                checkAttrs.value = Array.from($keySet);
                checkAttrs.onChange = __Zn.aclE.C.rxCheckFn(this, {
                    source: regionData,
                    option: each,
                });
                const attrHx = Sk.mixHx(UCA_NAME);
                return (
                    <Row key={each.value} {...attrHx}>
                        <Col span={3} className={"head-row"}>
                            <Tag color={"magenta"} style={{
                                fontSize: 14
                            }}>
                                {each.title}
                            </Tag>
                        </Col>
                        <Col span={21}>
                            <Checkbox.Group {...checkAttrs}>
                                {regionData.map(each => (
                                    // The $keySet has been processed by `aclIn` method based on `mapping`
                                    // So, the `key` could be `value` at the same time.
                                    <Checkbox key={each.key} value={each.key}>
                                        {each.title}
                                    </Checkbox>
                                ))}
                            </Checkbox.Group>
                        </Col>
                    </Row>
                )
            })
        }, __Zn.parserOfColor(UCA_NAME).internal({off: true}))
    }
}

export default Component