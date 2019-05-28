import React from 'react';
import Op from './Op';
import {Button} from 'antd';
import IxOpButton from '../IxOpButton/UI';
import Ux from "ux";

class Component extends React.PureComponent {
    state = {
        op: []
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {op = []} = this.state;
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxOpExtra：", "#3c3");
        return (
            <Button.Group style={{float: "right"}}>
                {op.map(button => <IxOpButton key={button.key} $config={button}
                                              {...this.props}/>)}
            </Button.Group>
        );
    }
}

export default Component;