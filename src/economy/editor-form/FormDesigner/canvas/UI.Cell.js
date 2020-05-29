import React from 'react';
import {Col, Input} from 'antd';
import {component} from "../../../_internal";
import Op from "../op";
import Rdr from "../component";
import Ux from 'ux';
import {DragSource} from "react-dnd";

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
        const {config = {}, connectDragSource} = this.props;
        const {span} = config;
        if (span) {
            return (
                <Col span={span} className={"canvas-cell"}>
                    {connectDragSource(
                        <div className={"content"}>
                            <div className={"content-tool"}>
                                <Input placeholder={(() => Ux.fromHoc(this, "label"))()}/>
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
                    )}
                    {Rdr.renderDrawer(this)}
                </Col>
            )
        } else return false;
    }
}

export default DragSource(
    Op.DragTypes.CellDesigner,
    Op.Cell.sourceSpec,
    Op.Cell.sourceConnect
)(Component);