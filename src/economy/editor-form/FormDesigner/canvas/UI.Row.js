import React from 'react';
import {Row} from 'antd';
import {component} from "../../../_internal";
import Op from '../op';
import Rdr from "../component";

const configRowCmd = {
    // 最外层 Css
    className: "v-command",
    // Tooltip
    placement: "left",
    // 内置的浮游窗口
    popover: {
        // 按命令分组
        setting: {
            placement: "right"
        }
    }
}

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
        const {$drawer} = this.state;
        const active = $drawer ? "right-active" : "";
        return (
            <div className={"canvas-row"}>
                <div className={"left"}>
                    {Rdr.renderCmd(this, {
                        ...config,
                        ...configRowCmd,
                    })}
                </div>
                <Row className={`right ${active}`}>

                </Row>
                {Rdr.renderDrawer(this)}
            </div>
        )
    }
}

export default Component