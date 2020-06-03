import React from "react";
import {DropTarget} from "react-dnd";
import Op from "../op";
import Ux from 'ux';
import {LoadingAlert} from 'web';
import {Form} from 'antd';

const renderJsx = (reference, type, cell = {}) => {
    // 标题行
    if ("aiTitle" === type) {
        const {title, config = {}, ...cellRest} = cell;
        if (!cellRest.key) cellRest.key = Ux.randomUUID();
        // 第二种格式
        if (config.description) {
            return (
                <LoadingAlert $alert={config}/>
            )
        } else {
            cellRest.className = `ux-title ux-title-pure`;
            return (
                <div className={cellRest.className}>
                    {title}
                </div>
            )
        }
    } else {
        console.info(cell);
        const {optionItem = {}, optionJsx = {}} = cell;
        const fnRender = Ux[type];
        return (
            <Form.Item {...optionItem}>
                {fnRender(reference, optionJsx)}
            </Form.Item>
        );
    }
}

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
                            return renderJsx(this, render, raft);
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