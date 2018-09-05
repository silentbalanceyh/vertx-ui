import React from 'react'
import Ux from "ux";
import {Button} from "antd";
import Immutable from 'immutable';

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

const initComponent = (ref) => {
    const {$key = "page", reference} = ref.props;
    // 1.从Hoc中读取配置
    let topbar = Ux.fromHoc(reference, $key);
    // 2.拷贝当前hoc配置
    topbar = Immutable.fromJS(topbar ? topbar : {}).toJS();
    // 3.解析left和right（分别解析）
    if (topbar.left) topbar.left = Ux.aiExprButton(topbar.left, reference.props);
    if (topbar.right) topbar.right = Ux.aiExprButton(topbar.right, reference.props);
    // 4.解析结果保存在状态中，只执行一次
    ref.setState({$config: topbar});
};
export default {
    renderButton,
    renderBack,
    initComponent
}