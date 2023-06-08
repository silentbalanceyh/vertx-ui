import React from 'react';
import {Col, Row} from 'antd';
import __Zn from '../zero.uca.dependency';

import Rdr from './Web';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "TableTransfer";
const componentInit = (reference) => {
    const state = {};
    // state.$ready = true;
    state.$keyword = undefined;
    __Zn.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    componentDidMount() {
        componentInit(this);
    }

    render() {

        return __Zn.xtReady(this, () => {
            const {style = {}} = this.props;
            const attrUca = Sk.mixUca(UCA_NAME, () => style);
            return (
                <Row {...attrUca}>
                    <Col span={5}>
                        {Rdr.renderSearch(this)}
                        <div className={"tree"}>
                            {Rdr.renderTree(this)}
                        </div>
                    </Col>
                    <Col span={19} className={"content"}>
                        {Rdr.renderTable(this)}
                    </Col>
                </Row>
            )
        }, {name: UCA_NAME, logger: true});
    }
}

export default Component