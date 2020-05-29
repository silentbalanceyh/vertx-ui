import React from "react";
import {Input} from "antd";
import Ux from "ux";
import Rdr from "../component";
import {DropTarget} from "react-dnd";
import Op from "../op";

const configCellCmd = {
    // 最外层 Css
    className: "c-command",
    // Tooltip
    placement: "top",
}

class Component extends React.PureComponent {
    state = {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        const targetItem = Op.item(this.props);
        const sourceItem = this.props['dragItem'];
        if (!Op.itemRowSame(sourceItem, targetItem)) {
            const {reference} = this.props;
            Op.dropColor(reference, this.props['isOver']);
        }
    }

    render() {
        const {config = {}, connectDropTarget, reference} = this.props;
        const {$hover = false} = this.state;
        return connectDropTarget(
            <div className={`content-tool ${$hover ? "content-tool-hover" : ""}`}>
                <Input placeholder={(() => Ux.fromHoc(reference, "label"))()}/>
                {Rdr.renderCmds(reference, {
                    ...config,
                    ...configCellCmd,
                })}
            </div>
        )
    }
}

export default DropTarget(
    Op.DragTypes.CellDesigner,
    Op.Cell.targetSpec,
    Op.Cell.targetConnect
)(Component);