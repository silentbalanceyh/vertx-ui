import React from "react";
import {DropTarget} from "react-dnd";
import Op from "../op";

class Component extends React.PureComponent {
    state = {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.dropColor(this, this.props['isOver']);
    }

    render() {
        const {connectDropTarget, data = {}} = this.props;
        const {$hover = false} = this.state;
        return connectDropTarget(
            <div className={`content-drop ${$hover ? "content-drop-hover" : ""}`}>
                Hello
            </div>
        )
    }
}

export default DropTarget(
    Op.DragTypes.FormDesigner,
    Op.Form.targetSpec,
    Op.Form.targetConnect
)(Component);