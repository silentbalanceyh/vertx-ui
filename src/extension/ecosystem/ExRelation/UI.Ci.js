import React from 'react';
import Ex from 'ex';
import {ExRegiment} from 'ei';
import Op from './Op';

class Component extends React.PureComponent {

    render() {
        const inherit = Ex.yoAmbient(this);
        inherit.rxSubmit = Op.rxSaveCi(this);
        return (
            <ExRegiment {...inherit}/>
        )
    }
}

export default Component;