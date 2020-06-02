import React from "react";
import {DropTarget} from "react-dnd";
import Op from "../op";
import Ux from 'ux';

class Component extends React.PureComponent {
    state = {}

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.dropColor(this, this.props['isOver']);
    }

    render() {
        const {connectDropTarget} = this.props;
        const {$hover = false} = this.state;

        const ref = Ux.onReference(this, 1);
        const message = Ux.fromHoc(ref, "message");

        return connectDropTarget(
            <div className={`content-drop ${$hover ? "content-drop-hover" : ""}`}>
                {(() => {
                    const {data = {}} = this.props;
                    const {render} = data;
                    if (render) {
                        const fnRender = Ux[render];
                        if (Ux.isFunction(fnRender)) {
                            const {raft = {}} = data;
                            return fnRender(this, raft);
                        } else {
                            return (
                                <div className={"drop-error"}>
                                    {$hover ? "" : Ux.formatExpr(message.error, {render})}
                                </div>
                            )
                        }
                    } else {
                        return (
                            <div className={"drop-pending"}>
                                {$hover ? "" : message.empty}
                            </div>
                        )
                    }
                })()}
            </div>
        )
    }
}

export default DropTarget(
    Op.DragTypes.FormDesigner,
    Op.Form.targetSpec,
    Op.Form.targetConnect
)(Component);