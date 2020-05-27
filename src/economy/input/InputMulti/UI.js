import React from "react";
import Op from './Op';

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

export default Component