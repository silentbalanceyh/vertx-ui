import React from 'react'
import Op from "./Op";

class Component extends React.PureComponent {
    state = {
        op: [],
        visible: false
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        console.info(this.props, this.state);
        const {op = []} = this.state;
        const $op = Op.configOp(this, op);
        console.info($op);
        return (
            <div>

            </div>
        )
    }
}

export default Component