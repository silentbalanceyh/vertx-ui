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
    render() {
        const {config = {}, connectDropTarget, reference} = this.props;
        return connectDropTarget(
            <div className={"content-tool"}>
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