import React from "react";
import {DropTarget} from "react-dnd";
import Op from "../op";
import Ux from 'ux';
import {LoadingAlert} from 'web';
import {Button, Form} from 'antd';

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
    } else if ("aiAction" === type) {
        const {optionItem = {}, optionJsx = {}, hidden = false} = cell;
        const {extension = []} = optionJsx;
        return (
            <Form.Item {...optionItem} colon={false} className={"web-form-designer-actions"}>
                {extension.map(item => {
                    const buttonAttrs = {};
                    buttonAttrs.type = "default";
                    if (hidden) {
                        /* 幽灵按钮 */
                        buttonAttrs.ghost = true;
                    } else {
                        if (item.type) {
                            buttonAttrs.type = item.type;
                        }
                    }
                    return (
                        <Button key={item.key} {...buttonAttrs}>
                            {item.text}
                        </Button>
                    )
                })}
            </Form.Item>
        );
    } else {
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
                    const {render, ...rest} = data;
                    if (render) {
                        const fnRender = Ux[render];
                        if (Ux.isFunction(fnRender)) {
                            return renderJsx(this, render, rest);
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