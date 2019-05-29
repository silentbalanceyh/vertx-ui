import React from 'react';
import Ux from "ux";
import Fx from '../Fx';
import {Button, Tooltip} from "antd";

/*
 * 标准的
 * 1. 保存按钮
 * 2. 重置按钮
 * 3. 删除按钮
 */
class Component extends React.PureComponent {

    render() {
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxExtra：", "#063");
        const {$view = "list", $options = {}, $loading = false} = this.props;
        const op = Fx.initBar($options, $view);
        return ("list" === $view) ? false : (
            <Button.Group style={{float: "right"}}>
                {op.map(button => {
                    const {tooltip = false, text, ...config} = button;
                    if (tooltip) {
                        const {key, ...rest} = config;
                        return (
                            <Tooltip key={key} placement={"top"} title={text}>
                                <Button {...rest} htmlType={"button"}
                                        loading={$loading}/>
                            </Tooltip>
                        );
                    } else {
                        return (
                            <Button {...config} htmlType={"button"}
                                    loading={$loading}>
                                {text}
                            </Button>
                        );
                    }
                })}
            </Button.Group>
        );
    };
}

export default Component;