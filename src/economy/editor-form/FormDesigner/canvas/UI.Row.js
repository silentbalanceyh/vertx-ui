import React from 'react';
import {Row} from 'antd';
import {component} from "../../../_internal";
import Rdr from '../component'
import Op from '../op';

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "Grid.Row",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiGridRow(this);
    }

    render() {

        return (
            <Row className={"canvas-row"}>
                {Rdr.renderCmd(this, {className: "top-command"})}
            </Row>
        )
    }
}

export default Component