import React from 'react';
import {DropTarget} from "react-dnd";
import Op from "../op";

class Component extends React.PureComponent {
    state = {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        /* 离开事件 */
        const {isOver} = this.props;
        Op.Row.hoverSwitch(this, () => isOver);
    }

    render() {
        const {connectDropTarget} = this.props;
        const {$hover = false} = this.state;
        return connectDropTarget(
            <div className={`canvas-row-drop ${$hover ? "canvas-row-drop-hover" : ""}`}>

            </div>
        )
    }
}

export default DropTarget(
    Op.DragTypes.RowDesigner,
    Op.Row.targetSpec,
    Op.Row.targetConnect
)(Component);