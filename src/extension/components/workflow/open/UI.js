import React from 'react';
import {TxOpen, TxPage} from "ei";
import Ex from 'ex';

class Component extends React.PureComponent {
    render() {
        const inherit = Ex.yoAmbient(this);
        return (
            <TxPage {...inherit}>
                <TxOpen/>
            </TxPage>
        )
    }
}

export default Component