import React from "react";
import {LoadingAlert} from 'zone';
import {Button, Form} from 'antd';
import __Zn from '../zero.uca.dependency';

const renderJsx = (reference, type, cell = {}) => {
    // 标题行
    if ("aiTitle" === type) {
        const {title, config = {}, ...cellRest} = cell;
        if (!cellRest.key) cellRest.key = __Zn.randomUUID();
        // 第二种格式
        if (config.description) {
            return (
                <LoadingAlert $alert={config}/>
            )
        } else {
            cellRest.className = `ux_title`;
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
        const fnRender = __Zn.V_UCA_CONTROL[type];
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
        __Zn.dndDropColor(this, this.props['isOver']);
    }

    render() {
        const {$dndDrop} = this.props;
        const {$hover = false} = this.state;

        const ref = __Zn.onReference(this, 1);
        const message = __Zn.fromHoc(ref, "message");
        return (
            <div ref={$dndDrop} className={`content-drop ${$hover ? "content-drop-hover" : ""}`}>
                {(() => {
                    const {data = {}} = this.props;
                    const {render, ...rest} = data;
                    if (render) {
                        const fnRender = __Zn.V_UCA_CONTROL[render];
                        if (__Zn.isFunction(fnRender)) {
                            return renderJsx(this, render, rest);
                        } else {
                            return (
                                <div className={"drop-error"}>
                                    {$hover ? "" : __Zn.formatExpr(message.error, {render})}
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

export default Component;