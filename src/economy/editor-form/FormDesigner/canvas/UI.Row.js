import React from 'react';
import {Row} from 'antd';
import {component} from "../../../_internal";
import Op from '../op';
import Ux from 'ux';
import Rdr from "../component";
import CellEditor from './UI.Cell';
import {DragSource} from "react-dnd";

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
        Op.yiRow(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {config = {}, connectDragSource} = this.props;
            const {$drawer} = this.state;
            const active = $drawer ? "right-active" : "";
            return connectDragSource(
                <div className={"canvas-row"}>
                    <div className={"left"}>
                        {Rdr.renderCmds(this, {
                            ...config,
                            ...configRowCmd,
                        })}
                    </div>
                    <Row className={`right ${active}`}>
                        {(() => {
                            const {$cells = []} = this.state;
                            return $cells.map(cell => {
                                const cellAttrs = Op.yoCell(this, cell);
                                return (
                                    <CellEditor {...cellAttrs}/>
                                )
                            })
                        })()}
                    </Row>
                    {Rdr.renderDrawer(this)}
                </div>
            )
        })
    }
}

export default DragSource(
    Op.DragTypes.RowDesigner,
    Op.Row.sourceSpec,
    Op.Row.sourceConnect
)(Component);