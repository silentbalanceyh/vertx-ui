import React from 'react';
import {Row} from 'antd';
import {component} from "../../../_internal";
import Op from '../op';
import Rdr from "../component";

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "Grid.Row",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiGridRow(this);
    }

    render() {
        const {config = {}} = this.props;
        return (
            <div className={"canvas-row"}>
                <div className={"left"}>
                    {Rdr.renderCmd(this, {
                        ...config,
                        className: "v-command",
                        placement: "left"
                    })}
                </div>
                <Row className={"right"}>
                    Hello
                </Row>
            </div>
        )
    }
}

export default Component