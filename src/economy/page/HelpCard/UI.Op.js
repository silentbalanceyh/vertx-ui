import React from 'react';
import Ux from "ux";
import {Button, Steps} from "antd";
import Immutable from "immutable";

const onClickBack = (reference, topbar) => (event) => {
    event.preventDefault();
    // 写状态树
    if (topbar.back.state) {
        Ux.writeTree(reference, topbar.back.state);
    }
    // 导航处理
    Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN);
};

const renderBack = (ref, topbar) => {
    const reference = Ux.onReference(ref, 1);
    return (<Button icon={"close"} shape="circle" type={"ghost"}
                    className={"zero-extra-button"}
                    onClick={onClickBack(reference, topbar)}/>);
};
const _applyLoading = (item, props = {}) => {
    const {$submitting} = props;
    if ($submitting) {
        const submitting = $submitting.is() ? $submitting.to() : {};
        item.loading = submitting.loading;
    }
    return item;
};
const renderButton = (ref, topbar, key = "left") => {
    const buttons = topbar[key] ? topbar[key] : [];
    return (
        <Button.Group>
            {buttons.map(button => {
                const $button = Ux.clone(_applyLoading(button, ref.props));
                const {text, ...rest} = $button;
                return (<Button {...rest}>{text}</Button>);
            })}
        </Button.Group>
    );
};
const renderHelp = (ref, topbar, current) => {
    if (topbar.help && topbar.help.steps) {
        const helps = Ux.aiExprHelp(topbar.help.steps);
        // 当前步骤
        let $current = current ? current : topbar.help.current;
        $current = Ux.valueInt($current);
        return (
            <Steps current={$current}
                   size={topbar.help.size ? topbar.help.size : "small"}>
                {helps.map(help => <Steps.Step {...help}/>)}
            </Steps>
        );
    } else
        return false;
};
const initComponent = (ref) => {
    const {$key = "page", reference} = ref.props;
    // 1.从Hoc中读取配置
    let topbar = Ux.fromHoc(reference, $key);
    // 2.拷贝left节点
    topbar = Immutable.fromJS(topbar ? topbar : {}).toJS();
    if (topbar.left) topbar.left = Ux.aiExprButton(topbar.left, ref.props);
    // 3.解析结果保存在状态中，只执行一次
    ref.setState({$config: topbar});
};
export default {
    renderBack,
    renderHelp,
    renderButton,
    initComponent,
};