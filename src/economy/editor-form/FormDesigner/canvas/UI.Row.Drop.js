import React from 'react';
import {DropTarget} from "react-dnd";
import Op from "../op";

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
        const {connectDropTarget} = this.props;
        return connectDropTarget(
            <div className={`canvas-row-drop`}>

            </div>
        )
    }
}

export default DropTarget(
    Op.DragTypes.RowDesigner,
    Op.Row.targetSpec,
    Op.Row.targetConnect
)(Component);