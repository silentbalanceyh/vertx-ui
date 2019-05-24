import React from 'react'
import Ux from "ux";
import Op from './Op';

class Component extends React.PureComponent {
    state = {
        $columns: [],
        $buttons: [],
        $notice: {}
    };

    componentDidMount() {
        Op.init(this);
    }

    render() {
        Ux.dgDebug({
            props: this.props,
            state: this.state,
        }, "[Ex] IxEditorColumn：", "#960");
        return (
            <div>2019-05-24</div>
        )
    }
}

export default Component