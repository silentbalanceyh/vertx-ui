import React from 'react';
import {Button, Tooltip} from "antd";
import Op from './Op';
import Ux from "ux";

const renderEach = (op = {}) => {
    const {text, tooltip = false, ...rest} = op;
    return tooltip ? (
        <Tooltip title={text} key={rest.key} placement={"top"}>
            <Button {...rest}/>
        </Tooltip>
    ) : (<Button {...rest}>{text}</Button>);
};

class Component extends React.PureComponent {
    state = {
        op: undefined
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        /* 窗口配置 */
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpOpen：", "#f66");
        const op = Op.configOp(this);
        if (0 < op.length) {
            if (1 === op.length) {
                const each = op[0];
                return renderEach(each);
            } else {
                return (
                    <Button.Group>
                        {op.map(each => renderEach(each))}
                    </Button.Group>
                )
            }
        } else return false;
    }
}

export default Component;