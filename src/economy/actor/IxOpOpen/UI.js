import React from 'react';
import {Button} from "antd";
import Op from './Op';

class Component extends React.PureComponent {
    state = {
        op: undefined
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {op} = this.state;
        if (op) {
            const {text, ...rest} = op;
            return (
                <Button {...rest}>{text}</Button>
            );
        } else return false;
    }
}

export default Component;