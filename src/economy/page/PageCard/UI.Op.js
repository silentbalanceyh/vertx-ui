import React from 'react';
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
const _applyLoading = (item, props = {}) => {
    const {$submitting} = props;
    if ($submitting) {
        const submitting = $submitting.is() ? $submitting.to() : {};
        item.loading = submitting.loading;
    }
    return item;
};
const renderButton = (ref, topbar, key = "left", $disabled = {}) => {
    const buttons = topbar[key] ? topbar[key] : [];
    return (
        <Button.Group>
            {buttons.map(button => {
                const $button = Ux.clone(_applyLoading(button, ref.props));
                const {text, ...rest} = $button;
                // 状态禁用按钮
                if ($disabled.hasOwnProperty(rest.key)) {
                    rest.disabled = $disabled[rest.key];
                }
                return (<Button {...rest}>{text}</Button>);
            })}
        </Button.Group>
    );
};
const renderBack = (ref, topbar) => {
    const reference = Ux.onReference(ref, 1);
    return (<Button icon={"close"} shape="circle" type={"ghost"}
                    className={"zero-extra-button"}
                    onClick={onClickBack(reference, topbar)}/>);
};

const initComponent = (ref) => {
    const {$key = "page", reference} = ref.props;
    // 1.从Hoc中读取配置
    let topbar = Ux.fromHoc(reference, $key);
    // 2.拷贝当前hoc配置
    topbar = Ux.clone(topbar ? topbar : {});
    // 3.解析left和right（分别解析）
    if (topbar.left) topbar.left = Ux.aiExprButton(topbar.left, ref.props);
    if (topbar.right) topbar.right = Ux.aiExprButton(topbar.right, ref.props);
    // 4.解析结果保存在状态中，只执行一次
    ref.setState({$config: topbar});
};
export default {
    renderButton,
    renderBack,
    initComponent
};