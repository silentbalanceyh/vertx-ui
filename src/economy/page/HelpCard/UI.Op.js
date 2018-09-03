import React from 'react'
import Ux from "ux";
import {Button, Steps} from "antd";

const onClickBack = (reference, topbar) => (event) => {
    event.preventDefault();
    // 写状态树
    if (topbar.back.state) {
        Ux.writeTree(reference, topbar.back.state);
    }
    // 导航处理
    Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN);
};

const renderBack = (reference, topbar) => {
    return (<Button icon={"close"} shape="circle" type={"ghost"} onClick={onClickBack(reference, topbar)}/>)
};

const renderButton = (reference, topbar, key = "left") => {
    const buttons = topbar[key] ? topbar[key] : [];
    return (
        <Button.Group>
            {buttons.map(button => {
                const {text, ...rest} = button;
                return <Button {...rest}>{text}</Button>
            })}
        </Button.Group>
    )
};
const renderHelp = (reference, topbar, current) => {
    if (topbar.help && topbar.help.steps) {
        const helps = Ux.aiExprHelp(topbar.help.steps);
        // 当前步骤
        const $current = current ? current : topbar.help.current;
        return (
            <Steps current={$current} size={topbar.help.size ? topbar.help.size : "small"}>
                {helps.map(help => <Steps.Step {...help}/>)}
            </Steps>
        );
    } else
        return false;
};
export default {
    renderBack,
    renderHelp,
    renderButton
}