import React from 'react';
import Ex from "ex";
import {TxPage, TxQDone} from "ei";

class Component extends React.PureComponent {
    render() {
        const inherit = Ex.yoAmbient(this);
        return (
            <TxPage {...inherit}>
                <TxQDone/>
            </TxPage>
        )
    }
}

export default Component