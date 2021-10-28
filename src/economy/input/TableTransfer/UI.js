import React from 'react';
import {Col, Row} from 'antd';
import Ux from "ux";
import './Cab.less';
import Rdr from './Web';

const componentInit = (reference) => {
    const state = {};
    state.$ready = true;
    state.$keyword = undefined;
    reference.setState(state);
}

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {

        return Ux.xtReady(this, () => {
            const {style = {}} = this.props;
            return (
                <Row style={style} className={"web-table-transfer"}>
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
        }, {name: "TableTransfer", logger: true});
    }
}

export default Component