import React from 'react'
import Ux from "ux";
import {Button} from "antd";

const onClickBack = (reference, topbar) => (event) => {
    event.preventDefault();
    // 写状态树
    if (topbar.back.state) {
        Ux.writeTree(reference, topbar.back.state);
    }
    // 导航处理
    Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN);
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
const renderBack = (reference, topbar) => {
    return (<Button icon={"close"} shape="circle" type={"ghost"} onClick={onClickBack(reference, topbar)}/>)
};
export default {
    renderButton,
    renderBack
}