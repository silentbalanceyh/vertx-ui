import React from 'react';
import Op from './Op';
import Ex from 'ex';
import {ExGraphicPlotter} from 'ei';

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this)
    }

    render() {
        return Ex.yoRender(this, () => {
            const inherit = Ex.yoAmbient(this);
            const {$data = {}} = this.state;
            const {config = {}} = this.props;
            return (
                <ExGraphicPlotter {...inherit} data={$data}
                                  $graphic={config}/>
            );
        }, Ex.parserOfColor("PxTopologyMaster").page())
    }
}

export default Component;