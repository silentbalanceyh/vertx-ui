import React from 'react';
import Ux from "ux";
import {Button} from "antd";

const onClickBack = (reference, topbar) => (event) => {
    event.preventDefault();
    // 写状态树
    if (topbar.back.state) {
        Ux.writeTree(reference, topbar.back.state);
    }
    // 可使用target
    const target = Ux.toQuery("target");
    let previous;
    if (target) {
        previous = target;
    } else {
        previous = topbar.back.uri ? topbar.back.uri : Ux.Env.ENTRY_ADMIN;
    }
    // 导航处理
    Ux.toRoute(reference, previous);
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
                    className={"ux-extra"}
                    onClick={onClickBack(reference, topbar)}/>);
};

const initComponent = (ref) => {
    const {$key = "page", reference} = ref.props;
    /*
     * 开启双读取模式
     * 1. 直接读取，$key 中不包含 . 操作符
     * 2. 如果 $key 中包含了 . 操作符，则用命中的方式
     */
    let topbar = {};
    if (0 < $key.indexOf('.')) {
        const args = $key.split('.');
        const config = Ux.fromPath.apply(this, [reference].concat(args));
        topbar = Ux.clone(config ? config : {});
    } else {
        const config = Ux.fromHoc(reference, $key);
        topbar = Ux.clone(config ? config : {});
    }

    // 2.拷贝当前hoc配置
    topbar = Ux.clone(topbar ? topbar : {});
    // 3.解析left和right（分别解析）
    if (topbar.left) topbar.left = Ux.aiExprButtons(topbar.left, ref.props);
    if (topbar.right) topbar.right = Ux.aiExprButtons(topbar.right, ref.props);
    // 4.解析结果保存在状态中，只执行一次
    ref.setState({$config: topbar});
};
export default {
    renderButton,
    renderBack,
    initComponent
};