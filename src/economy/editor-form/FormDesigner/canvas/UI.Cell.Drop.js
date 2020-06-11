import React from "react";
import Rdr from "../component";
import {DropTarget} from "react-dnd";
import Op from "../op";
import Image from "../images";
import {Tag} from 'antd';

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
        if (!Op.itemCellSame(sourceItem, targetItem)) {
            const {reference} = this.props;
            Op.dropColor(reference, this.props['isOver']);
        }
    }

    render() {
        const {
            config = {}, data = {},
            connectDropTarget, reference
        } = this.props;
        const {$hover = false} = this.state;
        return connectDropTarget(
            <div className={`content-tool ${$hover ? "content-tool-hover" : ""}`}>
                <div className={"ant-input dropped"}>
                    {data.render ? (
                        <div>
                            {(() => {
                                const {$palette = {}} = this.props;
                                const text = $palette[data.render];
                                return (
                                    <Tag>
                                        {text}
                                    </Tag>
                                );
                            })()}
                            <img src={Image[data.render]} alt={data.render}/>
                        </div>
                    ) : false}
                </div>
                {Rdr.renderCmds(reference, {
                    ...config,
                    ...configCellCmd,
                    placement: "bottom"
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