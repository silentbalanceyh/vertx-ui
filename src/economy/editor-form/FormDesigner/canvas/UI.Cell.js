import React from 'react';
import {Col, Input} from 'antd';
import {component} from "../../../_internal";
import Op from "../op";
import Rdr from "../component";

const configCellCmd = {
    // 最外层 Css
    className: "c-command",
    // Tooltip
    placement: "top",
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "Grid.Cell",
})
class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiCell(this);
    }

    render() {
        const {config = {}} = this.props;
        const {span} = config;
        if (span) {
            return (
                <Col span={span} className={"canvas-cell"}>
                    <div className={"content"}>
                        <div className={"content-tool"}>
                            <Input/>
                            {Rdr.renderCmds(this, {
                                ...configCellCmd,
                            })}
                        </div>
                        <div className={"content-drop"}>

                        </div>
                        <div className={"t-command"}>
                            {(() => {
                                const {$merge} = this.state;
                                if ($merge) {
                                    return Rdr.renderCmd(this, $merge)
                                } else return false;
                            })()}
                        </div>
                    </div>
                </Col>
            )
        } else return false;
    }
}

export default Component