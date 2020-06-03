import React from 'react';
import {Col} from 'antd';
import {component} from "../../../_internal";
import Op from "../op";
import Rdr from "../component";
import Ux from 'ux';
import {DragSource} from "react-dnd";
import CellDrop from './UI.Cell.Drop';
import CellDropWeb from './UI.Cell.DropContent.js';

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
            return Ux.xtReady(this, () => {
                const {$hover = false} = this.state;
                return (
                    <Col span={span} className={`canvas-cell ${$hover ? "canvas-cell-hover" : ""}`}>
                        {connectDragSource(
                            <div className={"content"}>
                                <CellDrop {...this.props} reference={this}/>
                                <CellDropWeb {...this.props} reference={this}/>
                                <div className={"t-command"}>
                                    {(() => {
                                        const {$merge} = this.state;
                                        if ($merge) {
                                            return Rdr.renderCmd(this, $merge, {
                                                ...config,
                                                placement: "bottom"
                                            })
                                        } else return false;
                                    })()}
                                </div>
                            </div>
                        )}
                        {Rdr.renderDrawer(this)}
                    </Col>
                )
            })
        } else return false;
    }
}

export default DragSource(
    Op.DragTypes.CellDesigner,
    Op.Cell.sourceSpec,
    Op.Cell.sourceConnect
)(Component);