import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {ExHistory} from "ei";

class Component extends React.PureComponent {
    state = {$ready: false};

    componentDidMount() {
        Op.yiHistory(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$dict = {}} = this.state;
            const attrs = Op.yoHistory(this);
            const inherit = Ex.yoAmbient(this);
            return (
                <ExHistory {...inherit} {...attrs} $dict={$dict}/>
            );
        }, Ex.parserOfColor("ExHistoryContainer").component())
    }
}

export default Component;