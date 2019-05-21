import React from 'react'
import Op from './Op';
import {Button} from 'antd';
import IxOpButton from '../IxOpButton/UI';

class Component extends React.PureComponent {
    state = {
        op: []
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        const {op = []} = this.state;
        return (
            <Button.Group style={{float: "right"}}>
                {op.map(button => <IxOpButton key={button.key} $config={button}
                                              {...this.props}/>)}
            </Button.Group>
        )
    }
}

export default Component